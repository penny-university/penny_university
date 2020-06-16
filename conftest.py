from django.conf import settings
import os

if settings.SLACK_API_KEY not in ['', None]:
    print('SLACK_API_KEY has been set to None for safety')
    settings.SLACK_API_KEY = None

if settings.EMAIL_HOST_PASSWORD not in ['', None]:
    print('EMAIL_HOST_PASSWORD has been set to None for safety')
    settings.EMAIL_HOST_PASSWORD = None

os.environ['CONFTEST_HAS_BEEN_RUN'] = 'true'
