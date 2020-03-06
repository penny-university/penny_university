import json
from datetime import datetime, timedelta
import logging
from pytz import timezone, utc
import urllib.parse
import requests

from bot.utils import chat_postEphemeral_with_fallback
from pennychat.models import (
    PennyChat,
    PennyChatInvitation,
    Participant,
)
from bot.processors.base import BotModule
from bot.processors.filters import (
    has_action_id,
    is_block_interaction_event,
    has_event_type, has_callback_id)
from users.models import (
    get_or_create_user_profile_from_slack_ids,
    get_or_create_user_profile_from_slack_id,
    UserProfile,
)

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


def datetime_template(penny_chat):
    timestamp = int(penny_chat.date.astimezone(utc).timestamp())
    date_text = f'<!date^{timestamp}^{{date_pretty}} at {{time}}|{penny_chat.date}>'
    return date_text


def shared_message_template(penny_chat, user_name, include_rsvp=False):
    start_date = penny_chat.date.astimezone(utc).strftime('%Y%m%dT%H%M%SZ')
    end_date = (penny_chat.date.astimezone(utc) + timedelta(hours=1)).strftime('%Y%m%dT%H%M%SZ')
    google_cal_url = 'https://calendar.google.com/calendar/render?' \
                     'action=TEMPLATE&text=' \
        f'{urllib.parse.quote(penny_chat.title)}&dates=' \
        f'{start_date}/{end_date}&details=' \
        f'{urllib.parse.quote(penny_chat.description)}'

    body = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'_*{user_name}* invited you to a new Penny Chat!_'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Title*\n{penny_chat.title}'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Description*\n{penny_chat.description}'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Date and Time*\n{datetime_template(penny_chat)}'
            },
            'accessory': {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Add to Google Calendar :calendar:',
                    'emoji': True
                },
                'url': google_cal_url
            }
        },
    ]

    if include_rsvp:
        body.append(
            {
                'type': 'actions',
                'elements': [
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': 'Count me in :thumbsup:',
                            'emoji': True,
                        },
                        'action_id': PENNY_CHAT_CAN_ATTEND,
                        'value': json.dumps({PENNY_CHAT_ID: penny_chat.id}),  # TODO should this be a helper function?
                        'style': 'primary',
                    },
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': 'I can\'t make it :thumbsdown:',
                            'emoji': True,
                        },
                        'action_id': PENNY_CHAT_CAN_NOT_ATTEND,
                        'value': json.dumps({PENNY_CHAT_ID: penny_chat.id}),
                        'style': 'primary',
                    }

                ]
            }
        )

    return body


def organizer_edit_after_share_template(slack_client, penny_chat_invitation):
    shares = []
    users = get_or_create_user_profile_from_slack_ids(
        comma_split(penny_chat_invitation.invitees),
        slack_client=slack_client,
    )
    for slack_user_id in comma_split(penny_chat_invitation.invitees):
        shares.append(users[slack_user_id].real_name)

    organizer = get_or_create_user_profile_from_slack_ids(
        [penny_chat_invitation.organizer_slack_id],
        slack_client=slack_client,
    ).get(penny_chat_invitation.organizer_slack_id)

    if len(penny_chat_invitation.channels) > 0:
        for channel in comma_split(penny_chat_invitation.channels):
            shares.append(f'<#{channel}>')

    if len(shares) == 1:
        share_string = shares[0]
    elif len(shares) == 2:
        share_string = ' and '.join(shares)
    elif len(shares) > 2:
        shares[-1] = f'and {shares[-1]}'
        share_string = ', '.join(shares)

    shared_message_preview_blocks = shared_message_template(penny_chat_invitation, organizer.real_name) + [
        {
            'type': 'divider'
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*:point_up: You just shared this invitation with:* {share_string}. '
                    'We will notify you as invitees respond.\n\n'
                    'In the meantime if you need to update the event, click the button below.'
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'Edit Details :pencil2:',
                        'emoji': True,
                    },
                    # TODO should this be a helper function?
                    'value': json.dumps({PENNY_CHAT_ID: penny_chat_invitation.id}),
                    'action_id': PENNY_CHAT_EDIT,
                    'style': 'primary',
                }

            ]
        },
    ]

    return shared_message_preview_blocks


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

        penny_chat_invitations = PennyChatInvitation.objects \
            .filter(organizer_slack_id=user['id'], status=PennyChatInvitation.DRAFT) \
            .order_by('-updated')

        if len(penny_chat_invitations) > 1:
            logging.error(
                'Found  %d drafts PennyChatInvitation for this user with slack id %s. '
                '(Setting all but the first of these Invitations to status ABANDONED)',
                len(penny_chat_invitations), user['id'],
            )
            penny_chat_invitations.update(status=PennyChat.ABANDONED)
            penny_chat_invitation = penny_chat_invitations[0]
            penny_chat_invitation.status = PennyChatInvitation.DRAFT
        elif len(penny_chat_invitations) == 0:
            penny_chat_invitation = PennyChatInvitation(
                organizer_slack_id=user['id'],
                status=PennyChatInvitation.DRAFT,
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
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat_invitation.organizer_tz)
        time = str(penny_chat_invitation.date.astimezone(tz).time()) if penny_chat_invitation.date else '00:00:00'
        penny_chat_invitation.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %H:%M:%S'))
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_TIME)
    def time_select(self, event):
        time = event['actions'][0]['selected_option']['value']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat_invitation.organizer_tz)
        date = str(penny_chat_invitation.date.astimezone(tz).date()) \
            if penny_chat_invitation.date else datetime.now().date()
        penny_chat_invitation.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %I:%M %p'))
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_USER_SELECT)
    def user_select(self, event):
        users = event['actions'][0]['selected_users']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        penny_chat_invitation.invitees = ','.join(users)
        penny_chat_invitation.save()

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_CHANNEL_SELECT)
    def channel_select(self, event):
        selected_channels = event['actions'][0]['selected_channels']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        penny_chat_invitation.channels = ','.join(selected_channels)
        penny_chat_invitation.save()

    @has_event_type([VIEW_SUBMISSION, VIEW_CLOSED])
    @has_callback_id(PENNY_CHAT_DETAILS)
    def submit_details_and_share(self, event):
        view = event['view']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=view['id'])
        state = view['state']['values']

        if event['type'] == VIEW_CLOSED:
            self.slack_client.chat_postMessage(
                channel=penny_chat_invitation.organizer_slack_id,
                blocks=organizer_edit_after_share_template(self.slack_client, penny_chat_invitation),
            )
            return

        if len(penny_chat_invitation.invitees.strip()) == 0 and len(penny_chat_invitation.channels.strip()) == 0:
            return {
                'response_action': 'errors',
                'errors': {
                    'penny_chat_description':
                        'One is a lonely number for a Penny Chat. Invite at least one channel or user below.'
                }
            }

        # Ready to share
        penny_chat_invitation.title = state['penny_chat_title']['penny_chat_title']['value']
        penny_chat_invitation.description = state['penny_chat_description']['penny_chat_description']['value']
        penny_chat_invitation.status = PennyChatInvitation.SHARED

        penny_chat = penny_chat_invitation.penny_chat

        # Create Participant entry for Organizer
        organizer = get_or_create_user_profile_from_slack_id(
            penny_chat_invitation.organizer_slack_id,
            slack_client=self.slack_client,
        )
        if organizer:
            Participant.objects.update_or_create(
                penny_chat=penny_chat,
                user=organizer,
                defaults=dict(role=Participant.ORGANIZER),
            )

        # Share with all channels and attendees
        old_shares = json.loads(penny_chat_invitation.shares or '{}')
        for channel, ts in old_shares.items():
            if channel[0] != 'C':
                # skip users etc. because yu can't chat_delete messages posted to private channels
                # TODO investigate something better to do here
                continue
            try:
                self.slack_client.chat_delete(channel=channel, ts=ts)
            except:  # noqa
                # slack's chat.postMessage endpoint (below) takes a channel argument which can actually
                # be a user. Unfortunately chat.delete is inconsistent; the channel arg MUST be a channel
                # we're attempting to use the API in hopes that they eventually fix it.
                pass

        invitation_blocks = shared_message_template(penny_chat, organizer.real_name, include_rsvp=True)
        shares = {}
        for share_to in comma_split(penny_chat_invitation.channels) + comma_split(penny_chat_invitation.invitees):
            resp = self.slack_client.chat_postMessage(
                channel=share_to,
                blocks=invitation_blocks,
            )
            shares[resp.data['channel']] = resp.data['ts']

        penny_chat_invitation.shares = json.dumps(shares)
        penny_chat_invitation.save()

        self.slack_client.chat_postMessage(
            channel=penny_chat_invitation.organizer_slack_id,
            blocks=organizer_edit_after_share_template(self.slack_client, penny_chat_invitation),
        )

        return

    @is_block_interaction_event
    @has_action_id(PENNY_CHAT_EDIT)
    def edit_chat(self, event):
        try:
            value = json.loads(event['actions'][0]['value'])
            penny_chat_invitation = PennyChatInvitation.objects.get(id=value['penny_chat_id'])
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
            user = get_or_create_user_profile_from_slack_id(
                event['user']['id'],
                slack_client=self.slack_client,
            )
            action_value = json.loads(event['actions'][0]['value'])
            penny_chat_id = action_value[PENNY_CHAT_ID]
            penny_chat = PennyChat.objects.get(pk=penny_chat_id)

            organizer = UserProfile.objects.get(
                user_chats__penny_chat=penny_chat,
                user_chats__role=Participant.ORGANIZER,
            )

            if organizer == user:
                # TODO notify user that it's silly to attend or not attend their own event
                return

            # create organizer notification message (even if we choose not to use it below)
            timestamp = int(penny_chat.date.astimezone(utc).timestamp())
            date_text = f'<!date^{timestamp}^{{date_pretty}} at {{time}}|{penny_chat.date}>'
            _not = '' if participant_role == Participant.ATTENDEE else ' _not_'
            notification = f'<@{user.slack_id}> will{_not} attend your Penny Chat "{penny_chat.title}" ({date_text})'
            we_will_notify_organizer = 'Thank you. We will notify the organizer.'

            changed = False
            if participant_role:
                participant, created = Participant.objects.update_or_create(
                    user=user,
                    penny_chat=penny_chat,
                    defaults={'role': participant_role}
                )
                if created:
                    changed = True
            else:
                num_deleted, _ = Participant.objects.filter(user=user, penny_chat=penny_chat).delete()
                if num_deleted > 0:
                    changed = True

            if changed:
                self.slack_client.chat_postMessage(channel=organizer.slack_id, text=notification)
                chat_postEphemeral_with_fallback(
                    self.slack_client,
                    channel=event['channel']['id'],
                    user=user.slack_id,
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


def comma_split(comma_delimited_string):
    """normal string split for  ''.split(',') returns [''], so using this instead"""
    return [x for x in comma_delimited_string.split(',') if x]
