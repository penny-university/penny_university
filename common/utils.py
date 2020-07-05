import json
from urllib.parse import urlencode

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


def build_url(base, endpoint, **kwargs):
    """
    Generates a url for the user to visit in the web app. If FRONT_END_HOST is not set, an exception will be raised.
    :param base: The url base, i.e. https://pennyuniversity.org
    :param endpoint: Unique token to verify user email
    """
    return f'{base}/{endpoint}?{urlencode(kwargs)}'
