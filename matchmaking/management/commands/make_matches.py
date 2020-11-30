from django.conf import settings
from django.core.management.base import BaseCommand

from matchmaking.common import make_matches


class Command(BaseCommand):
    help = """Create a match between users using their emails. A match sets up a DM with the users and the bot."""

    def add_arguments(self, parser):
        parser.add_argument(
            '--emails',
            dest='emails',
            nargs='+',
            type=str,
            help='Emails of the users to match',
            required=True,
        )
        parser.add_argument(
            '--topic-channel',
            dest='topic',
            type=str,
            help='The name of the topic channel that the users were matched in',
            required=True,
        )

    def handle(self, *args, **options):
        num_user_args = len(options['emails'])
        if num_user_args < 2 or num_user_args > 8:
            raise RuntimeError(f'Between 2 and 8 users are required. You provided {num_user_args}.')

        make_matches.now(settings.SLACK_TEAM_ID, options['emails'], options['topic'])
