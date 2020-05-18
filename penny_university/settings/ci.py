# from penny_university.settings.base import *
#
# # SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True
#
# TASK_ALWAYS_EAGER = True


import os

from penny_university.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# If set to True, this ensures that any background tasks are run immediately rather than using django_background_tasks
TASK_ALWAYS_EAGER = True
