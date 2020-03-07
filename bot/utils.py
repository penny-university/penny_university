import logging

from django.conf import settings
import slack
from slack.errors import SlackApiError

_CHANNEL_NAME__ID = None


def channel_lookup(name):
    global _CHANNEL_NAME__ID
    if _CHANNEL_NAME__ID is None:
        slack_client = slack.WebClient(settings.SLACK_API_KEY)
        resp = slack_client.channels_list()
        _CHANNEL_NAME__ID = {chan['name']: chan['id'] for chan in resp.data['channels']}
    return _CHANNEL_NAME__ID.get(name)


def notify_admins(slack_client, message):
    try:
        for user in settings.PENNY_ADMIN_USERS:
            slack_client.chat_postMessage(channel=user, text=message)
    except Exception:
        # TODO log this
        pass


def chat_postEphemeral_with_fallback(slack_client, channel, user, blocks=None, text=None):
    try:
        slack_client.chat_postEphemeral(channel=channel, user=user, blocks=blocks, text=text)
    except SlackApiError as ex:
        if 'error' in ex.response.data and ex.response.data['error'] == 'channel_not_found':
            logging.info(
                f'Falling back to direct message b/c of channel_not_found ("{channel}"")'
                f'in chat_postEphemeral_with_fallback. It is probably a direct message channel.'
            )
            slack_client.chat_postMessage(channel=user, blocks=blocks, text=text)
        else:
            logging.exception('error when messaging slack')
