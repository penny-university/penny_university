import logging

from django.conf import settings

from common.utils import get_slack_client
from sentry_sdk import capture_exception
from slack.errors import SlackApiError

from users.models import get_or_create_social_profile_from_slack_ids

_CHANNEL_NAME__ID = None


def channel_lookup(name):
    global _CHANNEL_NAME__ID
    if _CHANNEL_NAME__ID is None:
        slack_client = get_slack_client()
        resp = slack_client.conversations_list()
        _CHANNEL_NAME__ID = {chan['name']: chan['id'] for chan in resp.data['channels']}
    return _CHANNEL_NAME__ID.get(name)


def notify_admins(slack_client, message):
    try:
        for user in settings.PENNY_ADMIN_USERS:
            slack_client.chat_postMessage(channel=user, text=message)
    except Exception as e:
        capture_exception(e)
        # TODO log this
        pass


def comma_split(comma_delimited_string):
    """normal string split for  ''.split(',') returns [''], so using this instead"""
    return [x for x in comma_delimited_string.split(',') if x]


def build_share_string(slack_client, penny_chat_invitation):
    shares = []
    users = get_or_create_social_profile_from_slack_ids(
        comma_split(penny_chat_invitation.invitees),
        slack_client=slack_client,
    )
    for slack_user_id in comma_split(penny_chat_invitation.invitees):
        shares.append(users[slack_user_id].real_name)

    if len(penny_chat_invitation.channels) > 0:
        for channel in comma_split(penny_chat_invitation.channels):
            shares.append(f'<#{channel}>')

    share_string = ''
    if len(shares) == 1:
        share_string = shares[0]
    elif len(shares) == 2:
        share_string = ' and '.join(shares)
    elif len(shares) > 2:
        shares[-1] = f'and {shares[-1]}'
        share_string = ', '.join(shares)

    return share_string


def chat_postEphemeral_with_fallback(slack_client, channel, user, blocks=None, text=None):
    try:
        slack_client.chat_postEphemeral(channel=channel, user=user, blocks=blocks, text=text)
    except SlackApiError as e:
        capture_exception(e)
        if 'error' in e.response.data and e.response.data['error'] == 'channel_not_found':
            logging.info(
                f'Falling back to direct message b/c of channel_not_found ("{channel}"")'
                f'in chat_postEphemeral_with_fallback. It is probably a direct message channel.'
            )
            slack_client.chat_postMessage(channel=user, blocks=blocks, text=text)
        else:
            logging.exception('error when messaging slack')
