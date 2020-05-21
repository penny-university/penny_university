from django.conf import settings
from django.core.management.base import BaseCommand

from common.utils import get_slack_client


class Command(BaseCommand):
    help = (
        'Send a message to slack and then exit.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--message',
            dest='message',
            action='store',
            help='message to send to slack',
            required=True,
        )
        parser.add_argument(
            '--exit',
            dest='exit_code',
            action='store',
            type=int,
            default=0,
            help='shell exit code',
        )
        parser.add_argument(
            '--channel',
            dest='channel',
            action='store',
            default=settings.SLACK_DEV_CHANNEL,
            help='which channel to post to (defaults to settings.SLACK_DEV_CHANNEL)',
        )

    def handle(self, *args, **options):
        slack_client = get_slack_client()
        slack_client.chat_postMessage(channel=options['channel'], text=options['message'])
        exit(options['exit_code'])
