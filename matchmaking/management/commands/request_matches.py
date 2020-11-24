from django.core.management.base import BaseCommand

from matchmaking.tasks import request_matches


class Command(BaseCommand):
    help = """Send request match blocks to topic channels in a slack workspace"""

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

        request_matches.now(slack_team, channels_string)
