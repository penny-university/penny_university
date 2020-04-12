# these imports are to satisfy the requirements of django-background-tasks
# (https://django-background-tasks.readthedocs.io/en/latest/)
# do not import directly from this package, but instead import from the appropriate subpackage
from bot.tasks.pennychat import *
