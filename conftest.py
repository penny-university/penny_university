from django.conf import settings
import os

os.environ['DJANGO_SETTINGS_MODULE'] = 'penny_university.settings'


try:
    assert settings.SLACK_API_KEY == '' or settings.SLACK_API_KEY is None
except AssertionError:
    print(
        'SLACK_API_KEY is set.\n'
        'For safety reasons, tests are only run if settings.SLACK_API_KEY is set to empty string or None.\n'
        'Try running with `SLACK_API_KEY= pytest`'
    )
    exit(1)

os.environ['CONFTEST_HAS_BEEN_RUN'] = 'true'
