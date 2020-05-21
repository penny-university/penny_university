import json

from django.conf import settings
import slack

from penny_university.middleware.integration_test_logging import IntegrationTestLoggingWrapper


def get_slack_client():
    slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
    slack_client = IntegrationTestLoggingWrapper(slack_client)
    return slack_client


def pprint_obj(obj):
    return json.dumps(
        {k: str(v) for k, v in obj.__dict__.items() if k[0] != '_'},
        indent=2,
    )
