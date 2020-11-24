import json
from urllib.parse import urlencode

from background_task import background as original_background
from django.conf import settings
import slack


from penny_university.middleware.integration_test_logging import IntegrationTestLoggingWrapper


def get_slack_client(team_id=None):
    """Return the cached slack client associated with the specified team id.

    :param team_id: (this isn't being used quite yet, but will be soon)
    :return:
    """
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


def background(*args, **kwargs):
    """Use this anywhere that you would used the backgroun_tasks @background decorator. In production it acts just like
    normal, but when the TASK_ALWAYS_EAGER setting is True, the tasks will be run immediately.

    I'm trying to get a change into the library here https://github.com/arteria/django-background-tasks/issues/234
    """
    if getattr(settings, 'TASK_ALWAYS_EAGER', False):
        func = args[0]
        # We use .now() in a couple places in code like
        # https://github.com/penny-university/penny_university/blob/36be6d3c75f8094b454f4041abf7208f833583a4/bot/processors/pennychat.py#L312  # noqa
        func.now = func
        return func
    else:
        return original_background(*args, **kwargs)

