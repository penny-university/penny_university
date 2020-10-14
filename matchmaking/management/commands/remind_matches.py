from django.core.management.base import BaseCommand

from common.utils import get_slack_client
from matchmaking.models import Match
from bot.processors.matchmaking import create_match_blocks


class Command(BaseCommand):
    help = """Remind matches without Penny Chats to set one up."""

    def handle(self, *args, **options):
        slack_client = get_slack_client()
        matches_without_penny_chats = Match.objects.filter(penny_chat__isnull=True)
        for match in matches_without_penny_chats:
            blocks = create_match_blocks(match.topic_channel.channel_id, match.conversation_id, reminder=True)
            slack_client.chat_postMessage(channel=match.conversation_id, blocks=blocks)
