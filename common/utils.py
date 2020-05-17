from functools import wraps
import json
from unittest import mock

from django.conf import settings
import slack


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
            m = mock.Mock()
            m(*args, **kwargs)
            resp = method(*args, **kwargs)
            print(f'{_prefix}{method.__name__} = Mock()')
            print(f'{_prefix}{method.__name__}.return_value = {resp}')
            print(f'assert {_prefix}{method.__name__}.call_args == {m.call_args}')
            return resp
        return wrapped_method

    def __init__(self, wrapped_instance):
        self.wrapped_instance = wrapped_instance

    def __getattr__(self, attr_name):
        attr = getattr(self.wrapped_instance, attr_name)
        if callable(attr) and not attr_name[0] == '_':
            attr = IntegrationTestLoggingWrapper.wrap(attr, f'instance_of_{self.wrapped_instance.__class__.__name__}.')
        return attr


def get_slack_client():
    slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
    if settings.LOG_FOR_INTEGRATION:
        slack_client = IntegrationTestLoggingWrapper(slack_client)
    return slack_client


def pprint_obj(obj):
    return json.dumps(
        {k: str(v) for k, v in obj.__dict__.items() if k[0] != '_'},
        indent=2,
    )
