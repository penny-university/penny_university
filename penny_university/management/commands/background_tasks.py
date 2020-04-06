from background_task.management.commands.process_tasks import Command as ProcessTasks
from background_task.utils import SignalManager
from django.conf import settings

from bot.tasks import send_penny_chat_reminders


class Command(ProcessTasks):
    def handle(self, *args, **options):
        send_penny_chat_reminders()
        run_process_tasks()


def run_process_tasks():
    """Runs background tasks such as those in bot/tasks/pennychat"""
    process_tasks = ProcessTasks()
    process_tasks.sig_manager = SignalManager()
    process_tasks.run(duration=settings.PROCESS_TASKS_DURATION_SECONDS)
