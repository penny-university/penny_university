import os
from penny_university.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TASK_ALWAYS_EAGER = os.environ.get('TASK_ALWAYS_EAGER', 'FALSE') == 'TRUE'
MOCK_WRAP_SLACK_CLIENT = os.environ.get('MOCK_WRAP_SLACK_CLIENT', 'FALSE') == 'TRUE'
