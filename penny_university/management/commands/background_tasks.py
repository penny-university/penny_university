from background_task.management.commands.process_tasks import Command as ProcessTasks
from background_task.utils import SignalManager

from bot.tasks import (
    send_penny_chat_reminders_and_mark_chat_as_reminded,
    send_followup_reminder_and_mark_chat_as_completed,
)


class Command(ProcessTasks):
    """This runs background tasks.

    The background tasks either 1) run periodically, such as posting reminders for upcoming meetings or 2) run too slow
    to be executed in the normal request cycle.

    In production this is run periodically (every 10 minutes for a duration of 10 minutes) by the heroku scheduler.
    See https://dashboard.heroku.com/apps/penny-university/scheduler

    Note that this Command subclasses ProcessTasks (background_task/management/commands/process_tasks.py). See that file
    and the documentation for django-background-tasks for further information.
    https://django-background-tasks.readthedocs.io/en/latest/
    """
    def handle(self, *args, **options):
        # TODO as we grow, the reminder methods here will take longer to send and therefor will delay tasks that should
        # be run relatively quickly in run_process_tasks
        send_penny_chat_reminders_and_mark_chat_as_reminded()
        send_followup_reminder_and_mark_chat_as_completed()

        run_process_tasks(*args, **options)


def run_process_tasks(*args, **options):
    """Runs background tasks such as those in bot/tasks/pennychat
    """
    process_tasks = ProcessTasks()
    process_tasks.sig_manager = SignalManager()
    process_tasks.run(*args, **options)
