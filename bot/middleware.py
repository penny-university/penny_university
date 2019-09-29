import re

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

    def __init__(self, get_response):
        self.get_response = get_response
        if not settings.DEBUG:
            raise MiddlewareNotUsed()

        self.host = None
        self.port = None
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

            return HttpResponse(message)

        if host_port(self.host, self.port):

            s = Session()

            req = Request(
                method=request.method,
                url=f'http://{host_port(self.host, self.port)}' + request.get_full_path(),
                headers=request.headers,
                data=request.body,
                cookies=request.COOKIES,
            )

            req = req.prepare()
            resp = s.send(req)

            content_type = content_type_re.search(resp.headers.get('Content-Type'))
            if content_type:
                content_type = content_type.group()

            charset = charset_re.search(resp.headers.get('Content-Type'))
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
