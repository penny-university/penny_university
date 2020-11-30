from common.utils import get_slack_client
from matchmaking.models import TopicChannel, Match
from bot.processors.matchmaking import create_match_blocks, request_match_blocks  #TODO! move these into the matchmaking package?
from users.models import SocialProfile


def request_matches(slack_team_id, channel_names=None):
    """Contact all topic channels (or only those specified) and allow users to sign up to be matched for chats."""
    topic_channels = TopicChannel.objects.filter(slack_team_id=slack_team_id)
    if channel_names is not None:
        topic_channels = TopicChannel.objects.filter(name__in=channel_names)
    if len(topic_channels) == 0:
        raise Exception('No topic channels found for provided arguments')
    slack_client = get_slack_client(slack_team_id)
    for channel in topic_channels:
        blocks = request_match_blocks(channel.channel_id)
        slack_client.chat_postMessage(channel=channel.channel_id, blocks=blocks)


def make_matches(slack_team_id, emails, topic_channel_name):
    """Match profiles (corresponding to emails) to meet for Penny Chats for in a given topic channel."""
    profiles = SocialProfile.objects.filter(email__in=emails)
    if len(profiles) < len(emails):
        arg_set = set(emails)
        result_set = set([profile.email for profile in profiles])
        raise RuntimeError(f'Could not find profiles for all emails. {arg_set.difference(result_set)} not found.')

    # fetch topic channel to make sure it exists
    topic_channel = TopicChannel.objects.get(name=topic_channel_name)
    slack_client = get_slack_client(slack_team_id)
    conversation = slack_client.conversations_open(users=[profile.slack_id for profile in profiles])
    conversation_id = conversation['channel']['id']

    match, created = Match.objects.get_or_create(
        topic_channel=topic_channel,
        conversation_id=conversation_id,
    )
    match.profiles.add(*profiles)

    blocks = create_match_blocks(topic_channel.channel_id, conversation_id)
    slack_client.chat_postMessage(channel=conversation_id, blocks=blocks)


def remind_matches(slack_team_id):
    """Find all people that were recently scheduled to meet but haven't yet, and encourage them to meet."""
    #TODO! make sure to include a filter on recency date otherwise will continually remind people to meet over an over again
    slack_client = get_slack_client(slack_team_id)
    matches_without_penny_chats = Match.objects.filter(penny_chat__isnull=True)
    for match in matches_without_penny_chats:
        blocks = create_match_blocks(match.topic_channel.channel_id, match.conversation_id, reminder=True)
        slack_client.chat_postMessage(channel=match.conversation_id, blocks=blocks)
