from django.core.management.base import BaseCommand

from common.utils import get_slack_client
from users.models import SocialProfile
from matchmaking.models import TopicChannel, Match
from bot.processors.matchmaking import create_match_blocks


class Command(BaseCommand):
    help = """Create a match between users using their emails. A match sets up a DM with the users and the bot."""

    def add_arguments(self, parser):
        parser.add_argument(
            '--users',
            dest='users',
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
        num_user_args = len(options['users'])
        if num_user_args < 2 or num_user_args > 8:
            raise RuntimeError(f'Between 2 and 8 users are required. You provided {num_user_args}.')
        profiles = SocialProfile.objects.filter(email__in=options['users'])
        if len(profiles) < num_user_args:
            arg_set = set(options['users'])
            result_set = set([profile.email for profile in profiles])
            raise RuntimeError(f'Could not find profiles for all emails. {arg_set.difference(result_set)} not found.')
        # fetch topic channel
        topic_channel = TopicChannel.objects.get(name=options['topic'])
        slack_client = get_slack_client()

        make_matches(slack_client, profiles, topic_channel)


def make_matches(slack_client, profiles, topic_channel):
    conversation = slack_client.conversations_open(users=[profile.slack_id for profile in profiles])
    conversation_id = conversation['channel']['id']

    match, created = Match.objects.get_or_create(
        topic_channel=topic_channel,
        conversation_id=conversation_id,
    )
    match.profiles.add(*profiles)

    blocks = create_match_blocks(topic_channel.channel_id, conversation_id)
    slack_client.chat_postMessage(channel=conversation_id, blocks=blocks)
