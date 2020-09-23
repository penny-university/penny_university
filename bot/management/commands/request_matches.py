from django.core.management.base import BaseCommand

from common.utils import get_slack_client
from matchmaking.models import TopicChannel
from bot.processors.matchmaking import request_match_blocks


class Command(BaseCommand):
    help = """Send out onboarding questionnaire to set of users specified by a list of slack names. If no users
    are specified then all users that don't have a row in the database will be contacted. There is a safety switch in
    the script requiring you to start the send after it lists who will get the onboarding."""

    def add_arguments(self, parser):
        parser.add_argument(
            '--slack-team',
            dest='slack_team',
            type=str,
            help='the slack team id to send the message to'
        )
        parser.add_argument(
            '--topic-channels',
            dest='topic_channels',
            type=str,
            default='*',
            help='a list of topic channel names'
        )

    def handle(self, *args, **options):
        channels_string = options['topic_channels']
        slack_team = options['slack_team']

        if channels_string == '*':
            topic_channels = TopicChannel.objects.all()
        else:
            topic_channels = TopicChannel.objects.filter(name__in=channels_string.split())
        if slack_team is not None:
            topic_channels = topic_channels.filter(slack_team_id=slack_team)

        if len(topic_channels) == 0:
            raise Exception('No topic channels found for provided arguments')

        slack_client = get_slack_client()

        for channel in topic_channels:
            blocks = request_match_blocks(channel.channel_id)
            slack_client.chat_postMessage(channel=channel.channel_id, blocks=blocks)
