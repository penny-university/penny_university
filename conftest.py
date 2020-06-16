from django.conf import settings
import os

if settings.SLACK_API_KEY not in ['', None]:
    print('SLACK_API_KEY and EMAIL_HOST_PASSWORD have been set to None for safety')
    settings.SLACK_API_KEY = None
    settings.EMAIL_HOST_PASSWORD = None

os.environ['CONFTEST_HAS_BEEN_RUN'] = 'true'
