from django.conf import settings


def notify_admins(slack_client, message):
    for user in settings.PENNY_ADMIN_USERS:
        slack_client.chat_postMessage(channel=user, text=message)
