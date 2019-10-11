import time

from django.conf import settings
from django.core.management.base import BaseCommand

import slack

from users.models import User
from bot.processors.greeting import greeting_blocks

class Command(BaseCommand):
    help = """Send out onboarding questionnaire to set of users specified by a list of slack names. If no users 
    are specified then all users that don't have a row in the database will be contacted. There is a safety switch in 
    the script requiring you to start the send after it lists who will get the onboarding."""

    def add_arguments(self, parser):
        parser.add_argument('slack_handles', type=str, nargs='*', help='a list of slack user names')

    def handle(self, *args, **options):
        # process arguments
        slack_names = options['slack_handles']
        if len(slack_names) == 1:
            slack_names = slack_names[0].replace(' ', '').split(',')
        slack_names = [slack_name.strip(', ') for slack_name in slack_names]

        # collect appropriate ids for onboarding
        slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
        resp = slack_client.users_list()
        if 'ok' not in resp.data or not resp.data['ok']:
            raise RuntimeError(f'something is wrong: {resp.data}')
        user_id__slack_name = {
            member['id']: member['name']
            for member in resp.data['members'][1:]
            if not (member['is_bot'] or member['id'] == 'USLACKBOT')
        }
        slack_name__user_id = {v: k for k, v in user_id__slack_name.items()}

        not_found_users = set()
        non_responded_user_ids = set()
        if slack_names:
            for slack_name in slack_names:
                user_id = slack_name__user_id.get(slack_name)
                if user_id:
                    non_responded_user_ids.add(user_id)
                else:
                    not_found_users.add(slack_name)
        else:
            responded_user_ids = [user.slack_id for user in User.objects.all() if user.slack_id]
            non_responded_user_ids = set(user_id__slack_name).difference(responded_user_ids)

        # notify developer of send status
        if not_found_users:
            print(f'WARNING: These users not found: {", ".join(not_found_users)}\n')
        print(
            'Preparing to send messages to: '
            f'{", ".join([user_id__slack_name[uid] for uid in non_responded_user_ids])}.'
        )
        print()

        # double check that it's ok to send
        start_sending = ''
        while True:
            start_sending = input('Start sending? [NO,yes] >>> ').lower()
            if not start_sending:
                start_sending = 'no'
            if start_sending not in ['no', 'yes']:
                print('Type "yes" or "no".')
            else:
                break

        if start_sending != 'yes':
            print('Exiting')
            exit(0)

        # send
        print('Sending:')

        for user_id in non_responded_user_ids:
            slack_client.chat_postMessage(channel=user_id, blocks=greeting_blocks(user_id))
            print(user_id)
            time.sleep(1.0)  # attempting to avoid rate limiting
