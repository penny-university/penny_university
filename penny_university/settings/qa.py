import os
from penny_university.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

LOG_FOR_INTEGRATION = os.environ.get('LOG_FOR_INTEGRATION', 'FALSE') == 'TRUE'
