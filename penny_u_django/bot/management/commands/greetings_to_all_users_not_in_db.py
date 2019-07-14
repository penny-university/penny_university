import time

from django.conf import settings
from django.core.management.base import BaseCommand

import slack

from bot.models import User
from bot.processors.greeting import greeting_blocks

class Command(BaseCommand):
    def handle(self, *args, **options):
        slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
        resp = slack_client.users_list()
        if 'ok' not in resp.data or not resp.data['ok']:
            raise RuntimeError(f'something is wrong: {resp.data}')
        all_user_ids = [member['id'] for member in resp.data['members']]
        responded_user_ids = [user.slack_id for user in User.objects.all() if user.slack_id]
        non_responded_user_ids = set(all_user_ids).difference(responded_user_ids)
        for user_id in non_responded_user_ids:
            slack_client.chat_postMessage(channel=user_id, blocks=greeting_blocks(user_id))
            print(user_id)
            time.sleep(1.0)  # attempting to avoid rate limiting
