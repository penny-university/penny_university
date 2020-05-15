import json
from unittest import mock

from django.conf import settings
import slack

_slack_client = set()  # singleton global slack client


# TODO! test like in notebook
class MockWrappedInstance:
    """Wraps an instance so that all of its methods are actually mocks.

    This allows you to check the call_args later. You can reset an individual method with
    `wrapped_instance.mock_reset(method_name)` or you can reset all the methods with
    `wrapped_instance.mock_reset()`.
    """

    def __init__(self, wrapped_instance):
        self.wrapped_instance = wrapped_instance
        self.mocks = {}

    def __getattr__(self, attr_name):
        attr = getattr(self.wrapped_instance, attr_name)
        if callable(attr):
            if attr_name not in self.mocks:
                self.mocks[attr_name] = mock.Mock(side_effect=attr)
            attr = self.mocks[attr_name]
        return attr

    def mock_reset(self, attr_name=None):
        if attr_name:
            del self.mocks[attr_name]
        else:
            self.mocks = {}

    def mock_log_all_calls(self):
        for k, v in self.mocks.items():
            print(f'*{k}: {v.call_args_list}')


def get_slack_client():
    if not _slack_client:
        slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
        if settings.MOCK_WRAP_SLACK_CLIENT:
            slack_client = MockWrappedInstance(slack_client)
        _slack_client.add(slack_client)
    return next(iter(_slack_client))


def pprint_obj(obj):
    return json.dumps(
        {k: str(v) for k, v in obj.__dict__.items() if k[0] != '_'},
        indent=2,
    )
