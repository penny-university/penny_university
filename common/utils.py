import json

from django.conf import settings
import slack


class WrappedSlackWebClient:
    def __init__(self):
        self.slack_client = slack.WebClient(token=settings.SLACK_API_KEY)

    def __getattr__(self, attr):
        attr = getattr(self.slack_client, attr)
        return attr


def get_slack_client():
    slack_client = WrappedSlackWebClient()
    return slack_client


def pprint_obj(obj):
    return json.dumps(
        {k: str(v) for k, v in obj.__dict__.items() if k[0] != '_'},
        indent=2,
    )
