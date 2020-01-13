import re
import logging

from django.conf import settings
from django.core.exceptions import MiddlewareNotUsed
from django.http import HttpResponse
from requests import Session, Request

content_type_re = re.compile(r'^[^;\s$]+')
charset_re = re.compile(r'charset=([^\s]+)')


def host_port(host, port):
    if host and port:
        return f'{host}:{port}'
    if host:
        return host
    return ''


class DebugPassthrough:
    """If DEBUG=True then proxy all traffic to specified host.

    This is a hack, but a useful one.

    Start dev application locally and then set up a tunnel to it (ex. using ngrok).  Then visit
    /forward?host=<tunnel_host_and_port> on the QA server and all traffic will be proxied through the dev server and the
    responses returned to the QA server. To stop this behavior then go to /forward?host=
    """

    def __init__(self, get_response):
        self.get_response = get_response
        if not settings.DEBUG:
            raise MiddlewareNotUsed()

        self.host = None
        self.port = None
        logging.info(f'MIDDLEWARE:DebugPassthrough> initializing DebugPassthrough')
        # One-time configuration and initialization.

    def __call__(self, request):

        if request.path in ('/forward', '/forward/'):
            former_host = self.host
            former_port = self.port
            message = ''
            if former_host:
                message = f'No longer forwarding to {host_port(former_host, former_port)}</br>'

            self.host = request.GET.get('host')
            self.port = request.GET.get('port')
            if self.host:
                message += f'Forwarding to {host_port(self.host, self.port)}'
            else:
                if not message:
                    message = 'Not forwarding.'

            logging.info(f'MIDDLEWARE:DebugPassthrough> {message}')
            return HttpResponse(message)

        if host_port(self.host, self.port):
            logging.info(f'MIDDLEWARE:DebugPassthrough> Forwarding a request to {host_port(self.host, self.port)}')
            s = Session()

            permitted_headers = ['Content-Type']
            headers = {k: request.headers[k] for k in permitted_headers if k in request.headers}

            req = Request(
                method=request.method,
                url=f'http://{host_port(self.host, self.port)}' + request.get_full_path(),
                headers=headers,
                data=request.body,
                cookies=request.COOKIES,
            )

            req = req.prepare()
            resp = s.send(req, timeout=25)

            content_type = content_type_re.search(resp.headers.get('Content-Type', ''))
            if content_type:
                content_type = content_type.group()

            charset = charset_re.search(resp.headers.get('Content-Type', ''))
            if charset:
                charset = charset.group(1)

            response = HttpResponse(
                content=resp.content,
                content_type=content_type,
                status=resp.status_code,
                reason=resp.reason,
                charset=charset,
            )

            for key, val in resp.cookies.items():
                # TODO add in expiration, etc.
                response.set_cookie(key, val)

        else:
            response = self.get_response(request)

        return response
