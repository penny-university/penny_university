import logging
from functools import wraps
from unittest import mock

from django.conf import settings
from django.core.exceptions import MiddlewareNotUsed


class IntegrationTestLogging:
    """Logs all requests and their responses so that they can be copy-pastable into tests."""
    def __init__(self, get_response):
        if not settings.LOG_FOR_INTEGRATION:
            raise MiddlewareNotUsed()
        self.get_response = get_response

    def __call__(self, request):
        response_name = f"response_for_{request.path.replace('/', '_').strip('_')}"
        logging.info(
            f"LOG_FOR_INTEGRATION> {response_name} = APIClient().{request.method.lower()}('{request.get_full_path()}', "
            f"{request.body}, content_type='{request.content_type}')"
        )
        response = self.get_response(request)
        logging.info(f"LOG_FOR_INTEGRATION> assert {response_name}.status_code == {response.status_code}")
        logging.info(f"LOG_FOR_INTEGRATION> assert {response_name}.content == {response.content}")
        return response


class IntegrationTestLoggingWrapper:
    """Wraps methods and class instances to log calls and responses as copy-pastable mock tests.

    Wrap methods with the `@IntegrationTestLoggingWrapper.wrap` decorator. In this case the call and response
    remains unchanged, but all interactions are logged.

    Wrap class instances using `IntegrationTestLoggingWrapper(instance)`. In this case each non-private method
    is logged.

    Logs are only turned on if the `LOG_FOR_INTEGRATION` django setting is `True`.
    """

    def wrap(method, _prefix=''):
        @wraps(method)
        def wrapped_method(*args, **kwargs):
            resp = method(*args, **kwargs)
            if settings.LOG_FOR_INTEGRATION:
                m = mock.Mock()
                m(*args, **kwargs)
                logging.info(f'LOG_FOR_INTEGRATION> {_prefix}{method.__name__} = Mock()')
                logging.info(f'LOG_FOR_INTEGRATION> {_prefix}{method.__name__}.return_value = {resp}')
                logging.info(f'LOG_FOR_INTEGRATION> assert {_prefix}{method.__name__}.call_args == {m.call_args}')
            return resp
        return wrapped_method

    def __init__(self, wrapped_instance):
        self.wrapped_instance = wrapped_instance

    def __getattr__(self, attr_name):
        attr = getattr(self.wrapped_instance, attr_name)
        if settings.LOG_FOR_INTEGRATION and callable(attr) and not attr_name[0] == '_':
            prefix = self.wrapped_instance.__class__.__name__
            prefix = prefix[0].lower() + prefix[1:] + '.'
            attr = IntegrationTestLoggingWrapper.wrap(attr, prefix)
        return attr
