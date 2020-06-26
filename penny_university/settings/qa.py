import os
from penny_university.settings.base import *

DEBUG = True  # SECURITY WARNING: don't run with debug turned on in production!
LOG_FOR_INTEGRATION = os.environ.get('LOG_FOR_INTEGRATION', 'FALSE') == 'TRUE'
FRONT_END_HOST = os.getenv('FRONT_END_HOST')
