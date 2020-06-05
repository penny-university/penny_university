import json
from datetime import datetime, timedelta
import logging
from pytz import timezone, utc
import requests

from bot.tasks import (
    post_organizer_edit_after_share_blocks,
    share_penny_chat_invitation,
)
from bot.utils import chat_postEphemeral_with_fallback
from pennychat.models import (
    PennyChat,
    PennyChatSlackInvitation,
    Participant,
)
from bot.processors.base import BotModule
from bot.processors.filters import (
    has_action_id,
    is_block_interaction_event,
    has_event_type, has_callback_id)
from users.models import get_or_create_social_profile_from_slack_id, SocialProfile

VIEW_SUBMISSION = 'view_submission'
VIEW_CLOSED = 'view_closed'

PENNY_CHAT_DATE = 'penny_chat_date'
PENNY_CHAT_TIME = 'penny_chat_time'
PENNY_CHAT_USER_SELECT = 'penny_chat_user_select'
PENNY_CHAT_CHANNEL_SELECT = 'penny_chat_channel_select'
PENNY_CHAT_DETAILS = 'penny_chat_details'
PENNY_CHAT_EDIT = 'penny_chat_edit'
PENNY_CHAT_SHARE = 'penny_chat_share'
PENNY_CHAT_CAN_ATTEND = 'penny_chat_can_attend'
PENNY_CHAT_CAN_NOT_ATTEND = 'penny_chat_can_not_attend'

PENNY_CHAT_ID = 'penny_chat_id'


def datetime_range(start, end, delta):
    current = start
    while current < end:
        yield current
        current += delta


def get_time_options():
    time_options = [
        {'text': {'type': 'plain_text', 'text': dt.strftime('%-I:%M %p')}, 'value': dt.strftime('%-I:%M %p')}
        for dt in datetime_range(datetime(2019, 1, 1, 0), datetime(2019, 1, 2, 0), timedelta(minutes=15))
    ]
    return time_options


def penny_chat_details_modal(penny_chat_invitation):
    tz = timezone(penny_chat_invitation.organizer_tz)
    date = str(penny_chat_invitation.date.astimezone(tz).date())
    time_string = datetime.strftime(penny_chat_invitation.date.astimezone(tz), '%-I:%M %p')
    time = {'text': {'type': 'plain_text', 'text': time_string}, 'value': time_string}
    users = []
    if penny_chat_invitation and len(penny_chat_invitation.invitees) > 0:
        users = comma_split(penny_chat_invitation.invitees)
    channels = []
    if penny_chat_invitation and len(penny_chat_invitation.channels) > 0:
        channels = comma_split(penny_chat_invitation.channels)

    # look into `private_metadata` for storing penny_chat_id (https://api.slack.com/reference/surfaces/views)
    template = {
        'type': 'modal',
        'notify_on_close': True,
        'callback_id': PENNY_CHAT_DETAILS,
        'title': {
            'type': 'plain_text',
            'text': 'Penny Chat Details'
        },
        'submit': {
            'type': 'plain_text',
            'text': 'Share Invite :the_horns:',
        },
        'blocks': [
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': 'It looks like you want to create a new Penny Chat! Add a title, details, and date and '
                            'then choose who you want to invite.'
                }
            },
            {
                'block_id': 'penny_chat_title',
                'type': 'input',
                'element': {
                    'type': 'plain_text_input',
                    'action_id': 'penny_chat_title',
                    'initial_value': penny_chat_invitation.title if penny_chat_invitation else ''
                },
                'label': {
                    'type': 'plain_text',
                    'text': 'Title'
                }
            },
            {
                'block_id': 'penny_chat_description',
                'type': 'input',
                'element': {
                    'type': 'plain_text_input',
                    'action_id': 'penny_chat_description',
                    'multiline': True,
                    'initial_value': penny_chat_invitation.description if penny_chat_invitation else ''
                },
                'label': {
                    'type': 'plain_text',
                    'text': 'Description'
                },
                'hint': {
                    'type': 'plain_text',
                    'text': 'Give people an idea of what this chat will be about. This is a great place to add a link '
                            'to a Google hangout or an address for where you will meet.'
                }
            },
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': '*Pick a date for the Penny Chat* (All times are localized.)'
                },
            },
            {
                'type': 'actions',
                'elements': [
                    {
                        'type': 'datepicker',
                        'action_id': PENNY_CHAT_DATE,
                        'initial_date': date,
                    },
                    {
                        'type': 'static_select',
                        'action_id': PENNY_CHAT_TIME,
                        'initial_option': time,
                        'options': get_time_options()
                    }
                ]
            },
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': '*Who do you want to invite?*'
                },
                'accessory': {
                    'type': 'multi_users_select',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Select Users'
                    },
                    'initial_users': users,
                    'action_id': PENNY_CHAT_USER_SELECT,
                }
            },
            {
                'type': 'section',
                'text': {
                    'type': 'mrkdwn',
                    'text': '*Which channels should I share this with?*'
                },
                'accessory': {
                    'type': 'multi_channels_select',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Select Channels'
                    },
                    'initial_channels': channels,
                    'action_id': PENNY_CHAT_CHANNEL_SELECT,
                }
            },
        ]
    }

    return template


class PennyChatBotModule(BotModule):
    """Responsible for all interactions related to the `/penny chat` command.

    Flow:
    1. User types in `/penny chat` and `create_penny_chat` creates a PennyChatInvitation and opens a modal for the
        organizer
    2. During the create process the organizer fills our title, description, date, and invitee fields and these are
        handled by callbacks `date_select` `time_select` `user_select` `channel_select`. The handling is complicated by
        Slack's awkward API that tracks and updates modal state in a strange way. Because of this we save the modal
        state every chance we get to the PennyChatInvitation.
    3. Once the organizer submits the view it's handled by `submit_details_and_share`. The invitation will be sent to
        all selected channels and users. `submit_details_and_share` also handles updated invitations by deleting all
        previous invitation messages and issuing new ones.
    4. Immediately after sharing the invitation, the organizer is provided with an edit button. If they click it then
        `edit_chat` reopens the modal and allows them to edit and again submit the details (which takes them back to
        `submit_details_and_share`).
    5. Once the form is shared, organizers can RSVP by clicking buttons. This is handled by `attendance_selection` and
        the organizer is notified accordingly.
    """
    processors = [
        'date_select',
        'time_select',
        'user_select',
        'channel_select',
        'submit_details_and_share',
        'edit_chat',
        'attendance_selection',
    ]

    def __init__(self, slack_client):
        self.slack_client = slack_client

    @classmethod
    def create_penny_chat(cls, slack, event):
        user = slack.users_info(user=event['user_id']).data['user']
        date = datetime.now().replace(minute=0, second=0, microsecond=0, tzinfo=utc)

        penny_chat_invitations = PennyChatSlackInvitation.objects \
            .filter(organizer_slack_id=user['id'], status=PennyChatSlackInvitation.DRAFT) \
            .order_by('-updated')

        if len(penny_chat_invitations) > 1:
            logging.error(
                'Found  %d drafts PennyChatInvitation for this user with slack id %s. '
                '(Setting all but the first of these Invitations to status ABANDONED)',
                len(penny_chat_invitations), user['id'],
            )
            penny_chat_invitations.update(status=PennyChat.ABANDONED)
            penny_chat_invitation = penny_chat_invitations[0]
            penny_chat_invitation.status = PennyChatSlackInvitation.DRAFT
        elif len(penny_chat_invitations) == 0:
            penny_chat_invitation = PennyChatSlackInvitation.objects.create(
                organizer_slack_id=user['id'],
                created_from_slack_team_id=user['team_id'],
                status=PennyChatSlackInvitation.DRAFT,
                date=date,
            )
        else:  # There is only one PennyChatInvitation
            penny_chat_invitation = penny_chat_invitations[0]

        penny_chat_invitation.organizer_tz = user['tz']

        modal = penny_chat_details_modal(penny_chat_invitation)
        response = slack.views_open(view=modal, trigger_id=event['trigger_id'])

        # TODO once this line is deleted, remove view from model
        penny_chat_invitation.view = response.data['view']['id']
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_DATE)
    def date_select(self, event):
        date = event['actions'][0]['selected_date']
        penny_chat_invitation = PennyChatSlackInvitation.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat_invitation.organizer_tz)
        time = str(penny_chat_invitation.date.astimezone(tz).time()) if penny_chat_invitation.date else '00:00:00'
        penny_chat_invitation.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %H:%M:%S'))
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_TIME)
    def time_select(self, event):
        time = event['actions'][0]['selected_option']['value']
        penny_chat_invitation = PennyChatSlackInvitation.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat_invitation.organizer_tz)
        date = str(penny_chat_invitation.date.astimezone(tz).date()) \
            if penny_chat_invitation.date else datetime.now().date()
        penny_chat_invitation.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %I:%M %p'))
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_USER_SELECT)
    def user_select(self, event):
        users = event['actions'][0]['selected_users']
        penny_chat_invitation = PennyChatSlackInvitation.objects.get(view=event['view']['id'])
        penny_chat_invitation.invitees = ','.join(users)
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_CHANNEL_SELECT)
    def channel_select(self, event):
        selected_channels = event['actions'][0]['selected_channels']
        penny_chat_invitation = PennyChatSlackInvitation.objects.get(view=event['view']['id'])
        penny_chat_invitation.channels = ','.join(selected_channels)
        penny_chat_invitation.save()

    @has_event_type([VIEW_SUBMISSION, VIEW_CLOSED])
    @has_callback_id(PENNY_CHAT_DETAILS)
    def submit_details_and_share(self, event):
        view = event['view']
        penny_chat_invitation = PennyChatSlackInvitation.objects.get(view=view['id'])
        state = view['state']['values']

        if event['type'] == VIEW_CLOSED:
            # note, if it's a view_closed event then we don't get updated title or description, so no need to save
            return

        penny_chat_invitation.title = state['penny_chat_title']['penny_chat_title']['value']
        penny_chat_invitation.description = state['penny_chat_description']['penny_chat_description']['value']

        if len(penny_chat_invitation.invitees.strip()) == 0 and len(penny_chat_invitation.channels.strip()) == 0:
            penny_chat_invitation.save()
            return {
                'response_action': 'errors',
                'errors': {
                    'penny_chat_description':
                        'One is a lonely number for a Penny Chat. Invite at least one channel or user below.'
                }
            }

        # Ready to share
        penny_chat_invitation.status = PennyChatSlackInvitation.SHARED
        penny_chat_invitation.save()

        post_organizer_edit_after_share_blocks.now(view['id'])
        penny_chat_invitation.save_organizer_from_slack_id(penny_chat_invitation.organizer_slack_id)
        share_penny_chat_invitation(penny_chat_invitation.id)

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_EDIT)
    def edit_chat(self, event):
        try:
            value = json.loads(event['actions'][0]['value'])
            penny_chat_invitation = PennyChatSlackInvitation.objects.get(id=value['penny_chat_id'])
        except:  # noqa
            requests.post(event['response_url'], json={'delete_original': True})
            self.slack_client.chat_postEphemeral(
                channel=event['channel']['id'],
                user=event['user']['id'],
                text=(
                    'We are sorry, but an error has occurred and the Penny '
                    'Chat you are trying to edit is no longer available.'
                ),
            )
            return

        modal = penny_chat_details_modal(penny_chat_invitation)
        response = self.slack_client.views_open(view=modal, trigger_id=event['trigger_id'])
        penny_chat_invitation.view = response.data['view']['id']
        penny_chat_invitation.save()

        if event['actions'][0]['block_id'] == 'organizer_edit_after_share_button':
            return
        else:
            requests.post(event['response_url'], json={'delete_original': True})

    @is_block_interaction_event
    @has_action_id([PENNY_CHAT_CAN_ATTEND, PENNY_CHAT_CAN_NOT_ATTEND])
    def attendance_selection(self, event):
        """
        When a penny chat is shared, the user can click on "will attend" and "won't attend" buttons, and the resulting
        event is handled here.

        There are two side effects of this method:
         1. A Participant entry for the penny_chat and the user will be created or updated with the appropriate role.
         2. The organizer will be notified of "important" changes.
         3. The user will be told that the organizer will be notified.

         The specifics are rather complicated, but you can see how they work in
         bot.tests.processors.test_pennychat.test_PennyChatBotModule_attendance_selection

        """
        participant_role = Participant.ATTENDEE
        if event['actions'][0]['action_id'] == PENNY_CHAT_CAN_NOT_ATTEND:
            participant_role = None

        try:
            profile = get_or_create_social_profile_from_slack_id(
                event['user']['id'],
                slack_client=self.slack_client,
            )
            action_value = json.loads(event['actions'][0]['value'])
            penny_chat_id = action_value[PENNY_CHAT_ID]
            penny_chat = PennyChat.objects.get(pk=penny_chat_id)

            organizer = penny_chat.get_organizer()

            if organizer == profile.user:
                # TODO notify user that it's silly to attend or not attend their own event
                return

            # create organizer notification message (even if we choose not to use it below)
            timestamp = int(penny_chat.date.astimezone(utc).timestamp())
            date_text = f'<!date^{timestamp}^{{date}} at {{time}}|{penny_chat.date}>'
            _not = '' if participant_role == Participant.ATTENDEE else ' _not_'
            notification = f'<@{profile.slack_id}> will{_not} attend your Penny Chat "{penny_chat.title}" ({date_text})'
            we_will_notify_organizer = 'Thank you. We will notify the organizer.'

            changed = False
            if participant_role:
                participant, created = Participant.objects.update_or_create(
                    user=profile.user,
                    penny_chat=penny_chat,
                    defaults={'role': participant_role}
                )
                if created:
                    changed = True
            else:
                num_deleted, _ = Participant.objects.filter(user=profile.user, penny_chat=penny_chat).delete()
                if num_deleted > 0:
                    changed = True

            if changed:
                organizer_profile = SocialProfile.objects.get(
                    user=organizer,
                    slack_team_id=penny_chat.created_from_slack_team_id,
                )
                self.slack_client.chat_postMessage(channel=organizer_profile.slack_id, text=notification)
                chat_postEphemeral_with_fallback(
                    self.slack_client,
                    channel=event['channel']['id'],
                    user=profile.slack_id,
                    text=we_will_notify_organizer,
                )
        except RuntimeError:
            chat_postEphemeral_with_fallback(
                self.slack_client,
                channel=event['channel']['id'],
                user=event['user']['id'],
                text="An error has occurred. Please try again in a moment.",
            )
            logging.exception('error in penny chat attendance selection')


# TODO do we still need this?
def comma_split(comma_delimited_string):
    """normal string split for  ''.split(',') returns [''], so using this instead"""
    return [x for x in comma_delimited_string.split(',') if x]
