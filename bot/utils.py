from django.conf import settings
import slack

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
