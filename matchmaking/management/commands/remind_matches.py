from django.conf import settings
from django.core.management.base import BaseCommand

from matchmaking.common import remind_matches


class Command(BaseCommand):
    help = """Remind matches without Penny Chats to set one up."""

    def handle(self, *args, **options):
        remind_matches.now(settings.SLACK_TEAM_ID)
