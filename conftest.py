from django.conf import settings
import os

if settings.SLACK_API_KEY not in ['', None]:
    print('SLACK_API_KEY set to None for safety')
    settings.SLACK_API_KEY = None

os.environ['CONFTEST_HAS_BEEN_RUN'] = 'true'
