import json
import urllib
import hashlib
from datetime import datetime, timedelta

from background_task import background as original_background
from django.conf import settings
from pytz import timezone, utc
from sentry_sdk import capture_exception

from common.utils import get_slack_client
from pennychat.models import PennyChatSlackInvitation, Participant
from users.models import (
    SocialProfile,
    get_or_create_social_profile_from_slack_id,
    get_or_create_social_profile_from_slack_ids,
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
GO_TO_FOLLOWUP = 'go_to_followup'

PENNY_CHAT_ID = 'penny_chat_id'


PREVIEW, INVITE, UPDATE, REMIND = 'review', 'invite', 'update', 'remind'
PENNY_CHAT_DETAILS_BLOCKS_MODES = {PREVIEW, INVITE, UPDATE, REMIND}


def background(*args, **kwargs):
    """This is just a silly hack because we don't have an easy way of shutting off async for tests.

    Details about what I want https://github.com/arteria/django-background-tasks/issues/234
    """
    if getattr(settings, 'TASK_ALWAYS_EAGER', False):
        func = args[0]
        # We use .now() in a couple places in code like
        # https://github.com/penny-university/penny_university/blob/36be6d3c75f8094b454f4041abf7208f833583a4/bot/processors/pennychat.py#L312  # noqa
        func.now = func
        return func
    else:
        return original_background(*args, **kwargs)


@background
def post_organizer_edit_after_share_blocks(penny_chat_view_id):
    slack_client = get_slack_client()

    penny_chat_invitation = PennyChatSlackInvitation.objects.get(view=penny_chat_view_id)
    slack_client.chat_postMessage(
        channel=penny_chat_invitation.organizer_slack_id,
        blocks=organizer_edit_after_share_blocks(slack_client, penny_chat_invitation),
    )


@background
def share_penny_chat_invitation(penny_chat_id):
    """Shares penny chat invitations with people and channels in the invitee list."""
    penny_chat_invitation = PennyChatSlackInvitation.objects.get(id=penny_chat_id)
    slack_client = get_slack_client()

    # unshare the old shares
    old_shares = json.loads(penny_chat_invitation.shares or '{}')
    for channel, ts in old_shares.items():
        # TODO https://github.com/penny-university/penny_university/issues/140
        # until this is resolved we will not be able to remove shared messages in private channels
        try:
            slack_client.chat_delete(channel=channel, ts=ts)
        except Exception as e:  # noqa
            capture_exception(e)
            # can't do anything about it anyway... might as well continue
            pass
    invitation_blocks = _penny_chat_details_blocks(penny_chat_invitation, mode=INVITE)
    shares = {}
    channel_ids = comma_split(penny_chat_invitation.channels)
    invitee_ids = comma_split(penny_chat_invitation.invitees)
    participant_ids = []
    for p in penny_chat_invitation.participants.all():
        if p.role != Participant.ORGANIZER:
            profile = SocialProfile.objects.get(
                user=p.user,
                slack_team_id=penny_chat_invitation.created_from_slack_team_id,
            )
            participant_ids.append(profile.slack_id)
    for share_to in set(channel_ids + invitee_ids + participant_ids):
        resp = slack_client.chat_postMessage(
            channel=share_to,
            blocks=invitation_blocks,
        )
        shares[resp.data['channel']] = resp.data['ts']
    penny_chat_invitation.shares = json.dumps(shares)
    penny_chat_invitation.save()


def send_penny_chat_reminders_and_mark_chat_as_reminded():
    """This sends out reminders for any chat that is about to happen and also marks a chat as REMINDED.

    Handled in background_tasks.py
    """
    slack_client = get_slack_client()

    now = datetime.now().astimezone(timezone(settings.TIME_ZONE))
    imminent_chats = PennyChatSlackInvitation.objects.filter(
        status__gte=PennyChatSlackInvitation.SHARED,
        status__lt=PennyChatSlackInvitation.REMINDED,
        date__gte=now,
        date__lt=now + timedelta(minutes=settings.CHAT_REMINDER_BEFORE_PENNY_CHAT_MINUTES),
    )
    for penny_chat_invitation in imminent_chats:
        penny_chat_invitation.status = PennyChatSlackInvitation.REMINDED
        penny_chat_invitation.save()
        reminder_blocks = _penny_chat_details_blocks(penny_chat_invitation, mode=REMIND)
        participants = penny_chat_invitation.get_participants()
        for user in participants:
            profile = SocialProfile.objects.get(
                user=user,
                slack_team_id=penny_chat_invitation.created_from_slack_team_id,
            )
            slack_client.chat_postMessage(
                channel=profile.slack_id,
                blocks=reminder_blocks,
            )


def send_followup_reminder_and_mark_chat_as_completed():
    """This sends out reminders for any chat that is about to happen and also marks a chat as COMPLETED.

    Handled in background_tasks.py
    """
    slack_client = get_slack_client()

    now = datetime.now().astimezone(timezone(settings.TIME_ZONE))
    completed_chats = PennyChatSlackInvitation.objects.filter(
        status__gte=PennyChatSlackInvitation.SHARED,
        status__lt=PennyChatSlackInvitation.COMPLETED,
        date__lt=now - timedelta(minutes=settings.FOLLOWUP_REMINDER_AFTER_PENNY_CHAT_MINUTES),
    )
    for penny_chat_invitation in completed_chats:
        penny_chat_invitation.status = PennyChatSlackInvitation.COMPLETED
        penny_chat_invitation.save()
        reminder_blocks = _followup_reminder_blocks(penny_chat_invitation)
        participants = penny_chat_invitation.get_participants()
        for user in participants:
            profile = SocialProfile.objects.get(
                user=user,
                slack_team_id=penny_chat_invitation.created_from_slack_team_id,
            )
            slack_client.chat_postMessage(
                channel=profile.slack_id,
                blocks=reminder_blocks,
            )


def _penny_chat_details_blocks(penny_chat_invitation, mode=None):
    """Creates blocks for penny chat details"""
    assert mode in PENNY_CHAT_DETAILS_BLOCKS_MODES

    include_calendar_link = mode in {PREVIEW, INVITE, UPDATE}
    include_rsvp = mode in {INVITE, UPDATE}
    include_participant_pictures = mode in {REMIND}

    organizer = get_or_create_social_profile_from_slack_id(
        penny_chat_invitation.organizer_slack_id,
        slack_client=get_slack_client(),
    )

    header_text = ''
    if mode in {PREVIEW, INVITE}:
        header_text = f'_*{organizer.real_name}* invited you to a new Penny Chat!_'
    elif mode == UPDATE:
        header_text = f'_*{organizer.real_name}* has updated their Penny Chat._'
    elif mode == REMIND:
        header_text = f'_*{organizer.real_name}\'s* Penny Chat is coming up soon! We hope you can still make it._'

    date_text = f'<!date^{int(penny_chat_invitation.date.astimezone(utc).timestamp())}^{{date}} at {{time}}|{penny_chat_invitation.date}>'  # noqa
    date_time_block = {
        'type': 'section',
        'text': {
            'type': 'mrkdwn',
            'text': f'*Date and Time*\n{date_text}'
        },
    }

    if include_calendar_link:
        start_date = penny_chat_invitation.date.astimezone(utc).strftime('%Y%m%dT%H%M%SZ')
        end_date = (penny_chat_invitation.date.astimezone(utc) + timedelta(hours=1)).strftime('%Y%m%dT%H%M%SZ')
        google_cal_url = 'https://calendar.google.com/calendar/render?' \
                         'action=TEMPLATE&text=' \
            f'{urllib.parse.quote(penny_chat_invitation.title)}&dates=' \
            f'{start_date}/{end_date}&details=' \
            f'{urllib.parse.quote(penny_chat_invitation.description)}'

        date_time_block['accessory'] = {
            'type': 'button',
            'text': {
                'type': 'plain_text',
                'text': 'Add to Google Calendar :calendar:',
                'emoji': True
            },
            'url': google_cal_url
        }

    body = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': header_text,
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Title*\n{penny_chat_invitation.title}'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Description*\n{penny_chat_invitation.description}'
            }
        },
        date_time_block
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
                        'value': json.dumps({PENNY_CHAT_ID: penny_chat_invitation.id}),  # TODO should this be a helper function?  # noqa
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
                        'value': json.dumps({PENNY_CHAT_ID: penny_chat_invitation.id}),
                        'style': 'primary',
                    }

                ]
            }
        )

    if include_participant_pictures:
        participants = penny_chat_invitation.get_participants()

        default = "https://www.example.com/default.jpg"
        size = 40
        profiles = []
        for participant in participants:
            # get the (gravatar) profile image of a participant
            email = participant.email
            # https://en.gravatar.com/site/implement/images/python/
            gravatar_url = "https://www.gravatar.com/avatar/" +\
                hashlib.md5(email.lower().encode('utf-8')).hexdigest() + "?" +\
                urllib.parse.urlencode({'d': default, 's': str(size)})

            if participant.first_name != "" and participant.last_name != "":
                name = participant.first_name + " " + participant.last_name
            else:
                name = participant.username

            profiles.append({
                'name': name,
                'image_url': gravatar_url
            })

        number_votes_text = f"{len(profiles)} attending" if len(profiles) > 0 else "None attending (yet!)"

        body.append(
            {
                'type': 'context',
                'elements': [
                    {
                        'type': 'image',
                        'image_url': profile['image_url'],
                        'alt_text': profile['name']
                    }
                    for profile in profiles
                ] + [  # concatenates above list with below list
                    {
                        'type': 'plain_text',
                        'emoji': True,
                        'text': number_votes_text
                    }
                ]
            }
        )

    return body


def _followup_reminder_blocks(penny_chat_invitation):
    organizer = get_or_create_social_profile_from_slack_id(
        penny_chat_invitation.organizer_slack_id,
        slack_client=get_slack_client(),
    )
    return [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'{organizer.real_name}\'s Penny Chat *"{penny_chat_invitation.title}"* has completed. '
                        'How did it go?\n\nIf you learned something new, then consider writing a Penny Chat '
                        'Follow-Up and sharing what you learned with the community. This is also a great way '
                        'to say _*thank you*_ to all those that attended the Penny Chat.'
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': ':pencil2: Write a Follow-Up',
                        'emoji': True
                    },
                    'style': 'primary',
                    'url': f'https://www.pennyuniversity.org/chats/{penny_chat_invitation.id}',
                    'action_id': GO_TO_FOLLOWUP
                }
            ]
        }
    ]


def organizer_edit_after_share_blocks(slack_client, penny_chat_invitation):
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

    if len(shares) == 1:
        share_string = shares[0]
    elif len(shares) == 2:
        share_string = ' and '.join(shares)
    elif len(shares) > 2:
        shares[-1] = f'and {shares[-1]}'
        share_string = ', '.join(shares)

    shared_message_preview_blocks = _penny_chat_details_blocks(penny_chat_invitation, mode=PREVIEW) + [
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


def comma_split(comma_delimited_string):
    """normal string split for  ''.split(',') returns [''], so using this instead"""
    return [x for x in comma_delimited_string.split(',') if x]
