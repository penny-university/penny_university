from background_task.management.commands.process_tasks import Command as ProcessTasks
from background_task.utils import SignalManager
from django.conf import settings # TODO! delete

from bot.tasks import send_penny_chat_reminders


class Command(ProcessTasks):
    """This runs background tasks.

    The background tasks either 1) run periodically, such as posting reminders for upcoming meetings or 2) run too slow
    to be executed in the normal request cycle.

    Note that this Command subclasses ProcessTasks (background_task/management/commands/process_tasks.py). See that file
    and the documentation for django-background-tasks for further information.
    https://django-background-tasks.readthedocs.io/en/latest/
    """
    def handle(self, *args, **options):
        send_penny_chat_reminders()
        # TODO this is a good place to update events and mark them as completed
        run_process_tasks(*args, **options)


def run_process_tasks(*args, **options):
    """Runs background tasks such as those in bot/tasks/pennychat
    """
    process_tasks = ProcessTasks()
    process_tasks.sig_manager = SignalManager()
    process_tasks.run(*args, **options)
