from datetime import datetime

from django.conf import settings
from django.core.management import BaseCommand
from pytz import timezone

from bot.tasks import (
    organizer_edit_after_share_blocks,
    _penny_chat_details_blocks,
    shared_message_preview_blocks,
    get_slack_client,
)
from pennychat.models import PennyChatSlackInvitation
from users.models import get_or_create_social_profile_from_slack_id


class Command(BaseCommand):
    help = """DEV ONLY: Send faked slack interactions from `/penny chat` flow.

    Supposedly supports templates:
    * shared_message_preview_blocks
    * shared_message_blocks
    * organizer_edit_after_share_blocks

    Example usage:
    $ ./manage.py send_penny_chat_blocks organizer_edit_after_share_blocks \
        --slack_user_id=UNKEQA7CK --channel=CNQG95KG9
    """

    def add_arguments(self, parser):
        parser.add_argument('template_name', type=str, help='which template')
        parser.add_argument('--slack_user_id', type=str, help='which user (JnBrymn="UNKEQA7CK"')
        parser.add_argument('--channel', type=str, help='which channel to invite (for JnBrymn General=CNQG95KG9)')
        parser.add_argument('--title', type=str, help='title')

    def handle(self, *args, **options):
        if not settings.DEBUG:
            print('This command is intended only for development.')
            return

        organizer = get_or_create_social_profile_from_slack_id(options['slack_user_id'])
        invitees = organizer.slack_id

        slack_client = get_slack_client()

        time_zone = 'America/Los_Angeles'
        penny_chat_invitation = PennyChatSlackInvitation.objects.create(
            title=options['title'] or 'Some Default Title',
            description='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',  # noqa
            date=timezone(time_zone).localize(datetime(2079, 10, 12)),
            channels=options['channel'],
            invitees=invitees,
            user=organizer.slack_id,
            user_tz=time_zone,
        )

        template = options['template_name']
        if template == 'shared_message_preview_blocks':
            blocks = shared_message_preview_blocks(slack_client, penny_chat_invitation)
            slack_client.chat_postMessage(
                channel=organizer.slack_id,
                blocks=blocks,
            )
        elif template == 'shared_message_blocks':
            blocks = _penny_chat_details_blocks(penny_chat_invitation, 'DefaultName', mode='INVITE')
            slack_client.chat_postMessage(
                channel=organizer.slack_id,
                blocks=blocks,
            )

        elif template == 'organizer_edit_after_share_blocks':
            blocks = organizer_edit_after_share_blocks(penny_chat_invitation)
            slack_client.chat_postMessage(
                channel=organizer.slack_id,
                blocks=blocks,
            )
