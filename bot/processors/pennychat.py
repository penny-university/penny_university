import json
from datetime import datetime, timedelta
import logging
from pytz import timezone, utc
import urllib.parse
import requests
from slack.errors import SlackApiError

from pennychat.models import (
    PennyChat,
    PennyChatInvitation,
    Participant,
)
from bot.processors.base import (
    BotModule
)
from bot.processors.filters import (
    is_action_id,
    is_block_interaction_event,
    is_event_type, has_callback_id)
from users.models import (
    get_or_create_user_profile_from_slack_ids,
    get_or_create_user_profile_from_slack_id,
    UserProfile,
)


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


def shared_message_preview_template(slack_client, penny_chat_invitation):
    shares = []
    users = get_or_create_user_profile_from_slack_ids(
        comma_split(penny_chat_invitation.invitees),
        slack_client=slack_client,
    )
    for slack_user_id in comma_split(penny_chat_invitation.invitees):
        shares.append(users[slack_user_id].real_name)

    organizer = get_or_create_user_profile_from_slack_ids(
        [penny_chat_invitation.user],
        slack_client=slack_client,
    ).get(penny_chat_invitation.user)

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

    shared_message_preview_blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': (
                    '*Almost Done*\n'
                    'Below is the Penny Chat invitation as it will be seen by others. '
                    'Please review it and then either click *Share* or *Edit Details*.'
                )
            },
        },
        {
            'type': 'divider'
        },
    ] + shared_message_template(penny_chat_invitation, organizer.real_name) + [
        {
            'type': 'divider'
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*This will be shared with:* {share_string}'
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'Share :the_horns:',
                        'emoji': True,
                    },
                    'action_id': 'penny_chat_share',
                    'style': 'primary',
                },
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'Edit Details :pencil2:',
                        'emoji': True,
                    },
                    'action_id': 'penny_chat_edit',
                    'style': 'primary',
                }

            ]
        },
    ]

    return shared_message_preview_blocks


def shared_message_template(penny_chat, user_name, include_rsvp=False):
    timestamp = int(penny_chat.date.astimezone(utc).timestamp())
    date_text = f'*Date and Time*\n<!date^{timestamp}^{{date_pretty}} at {{time}}|{penny_chat.date}>'

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
                'text': date_text
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
                        'action_id': 'penny_chat_can_attend',
                        'value': json.dumps({'penny_chat_id': penny_chat.id}),
                        'style': 'primary',
                    },
                    {
                        'type': 'button',
                        'text': {
                            'type': 'plain_text',
                            'text': 'I can\'t make it :thumbsdown:',
                            'emoji': True,
                        },
                        'action_id': 'penny_chat_can_not_attend',
                        'value': json.dumps({'penny_chat_id': penny_chat.id}),
                        'style': 'primary',
                    }

                ]
            }
        )

    return body


def penny_chat_details_modal(penny_chat_invitation):
    tz = timezone(penny_chat_invitation.user_tz)
    date = str(penny_chat_invitation.date.astimezone(tz).date())
    time_string = datetime.strftime(penny_chat_invitation.date.astimezone(tz), '%-I:%M %p')
    time = {'text': {'type': 'plain_text', 'text': time_string}, 'value': time_string}
    users = []
    if penny_chat_invitation and len(penny_chat_invitation.invitees) > 0:
        users = comma_split(penny_chat_invitation.invitees)
    channels = []
    if penny_chat_invitation and len(penny_chat_invitation.channels) > 0:
        channels = comma_split(penny_chat_invitation.channels)

    template = {
        'type': 'modal',
        'callback_id': 'penny_chat_details',
        'title': {
            'type': 'plain_text',
            'text': 'Penny Chat Details'
        },
        'submit': {
            'type': 'plain_text',
            'text': 'Done'
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
                        'action_id': 'penny_chat_date',
                        'initial_date': date,
                    },
                    {
                        'type': 'static_select',
                        'action_id': 'penny_chat_time',
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
                    'action_id': 'penny_chat_user_select',
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
                    'action_id': 'penny_chat_channel_select',
                }
            },
        ]
    }

    return template


class PennyChatBotModule(BotModule):
    processors = [
        'date_select',
        'time_select',
        'user_select',
        'channel_select',
        'submit_details',
        'edit_chat',
        'share',
        'can_attend',
    ]

    def __init__(self, slack_client):
        self.slack_client = slack_client

    @classmethod
    def create_penny_chat(cls, slack, event):
        user = slack.users_info(user=event['user_id']).data['user']
        date = datetime.now().replace(minute=0, second=0, microsecond=0, tzinfo=utc)
        penny_chat_invitation, created = PennyChatInvitation.objects.get_or_create(
            user=user['id'],
            status=PennyChatInvitation.DRAFT,
            defaults={
                'user_tz': user['tz'],
                'template_channel': event['channel_id'],
                'date': date,
            },
        )

        modal = penny_chat_details_modal(penny_chat_invitation)
        response = slack.views_open(view=modal, trigger_id=event['trigger_id'])
        penny_chat_invitation.view = response.data['view']['id']
        penny_chat_invitation.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_date')
    def date_select(self, event):
        date = event['actions'][0]['selected_date']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat_invitation.user_tz)
        time = str(penny_chat_invitation.date.astimezone(tz).time()) if penny_chat_invitation.date else '00:00:00'
        penny_chat_invitation.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %H:%M:%S'))
        penny_chat_invitation.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_time')
    def time_select(self, event):
        time = event['actions'][0]['selected_option']['value']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat_invitation.user_tz)
        date = str(penny_chat_invitation.date.astimezone(tz).date()) \
            if penny_chat_invitation.date else datetime.now().date()
        penny_chat_invitation.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %I:%M %p'))
        penny_chat_invitation.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_user_select')
    def user_select(self, event):
        users = event['actions'][0]['selected_users']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        penny_chat_invitation.invitees = ','.join(users)
        penny_chat_invitation.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_channel_select')
    def channel_select(self, event):
        selected_channels = event['actions'][0]['selected_channels']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=event['view']['id'])
        penny_chat_invitation.channels = ','.join(selected_channels)
        penny_chat_invitation.save()

    @is_event_type('view_submission')
    @has_callback_id('penny_chat_details')
    def submit_details(self, event):
        view = event['view']
        penny_chat_invitation = PennyChatInvitation.objects.get(view=view['id'])
        state = view['state']['values']

        penny_chat_invitation.title = state['penny_chat_title']['penny_chat_title']['value']
        penny_chat_invitation.description = state['penny_chat_description']['penny_chat_description']['value']
        penny_chat_invitation.save()

        if len(penny_chat_invitation.invitees.strip()) == 0 and len(penny_chat_invitation.channels.strip()) == 0:
            return {
                "response_action": "errors",
                "errors": {
                    "penny_chat_description": "One is a lonely number for a Penny Chat. "
                                              "Invite at least one channel or user below."
                }
            }
        else:
            self.chat_postEphemeral_with_fallback(
                channel=penny_chat_invitation.template_channel,
                user=penny_chat_invitation.user,
                blocks=shared_message_preview_template(self.slack_client, penny_chat_invitation),
            )

    @is_block_interaction_event
    @is_action_id('penny_chat_edit')
    def edit_chat(self, event):
        try:
            penny_chat_invitation = PennyChatInvitation.objects.get(
                user=event['user']['id'],
                status=PennyChatInvitation.DRAFT,
            )
        except:  # noqa
            requests.post(event['response_url'], json={'delete_original': True})
            self.slack_client.chat_postEphemeral(
                channel=event['channel']['id'],
                user=event['user']['id'],
                text=(
                    "We are sorry, but an error has occurred and the Penny "
                    "Chat you are trying to edit is no longer available."
                ),
            )
            return
        modal = penny_chat_details_modal(penny_chat_invitation)
        response = self.slack_client.views_open(view=modal, trigger_id=event['trigger_id'])
        penny_chat_invitation.view = response.data['view']['id']
        penny_chat_invitation.save()
        requests.post(event['response_url'], json={'delete_original': True})

    @is_block_interaction_event
    @is_action_id('penny_chat_share')
    def share(self, event):
        try:
            penny_chat_invitation = PennyChatInvitation.objects.get(
                user=event['user']['id'],
                status=PennyChatInvitation.DRAFT,
            )
        except:  # noqa
            requests.post(event['response_url'], json={'delete_original': True})
            self.slack_client.chat_postEphemeral(
                channel=event['channel']['id'],
                user=event['user']['id'],
                text=(
                    "We are sorry, but an error has occurred and the Penny "
                    "Chat you are trying to share is no longer available."
                ),
            )
            # TODO! log
            return

        penny_chat = PennyChat.objects.create(
            title=penny_chat_invitation.title,
            description=penny_chat_invitation.description,
            date=penny_chat_invitation.date,
            status=penny_chat_invitation.SHARED,
        )

        penny_chat_invitation.penny_chat = penny_chat
        penny_chat_invitation.status = PennyChatInvitation.SHARED

        # below, I want to make sure that we don't use the penny_chat_invitation title/desc after we've made an
        # official penny_chat.
        # TODO: a better solution might be making penny_chat_invitation raise an error if the title and description
        # are retrieved - but I don't know how
        penny_chat_invitation.title = 'ERROR: refer to penny chat title rather than invitation title'
        penny_chat_invitation.description = 'ERROR: refer to penny chat description rather than invitation description'
        penny_chat_invitation.save()

        users = get_or_create_user_profile_from_slack_ids(
            comma_split(penny_chat_invitation.invitees),
            slack_client=self.slack_client,
        )
        for user in users.values():
            Participant.objects.update_or_create(
                penny_chat=penny_chat,
                user=user,
                defaults=dict(role=Participant.INVITEE),
            )

        organizer = get_or_create_user_profile_from_slack_id(penny_chat_invitation.user, slack_client=self.slack_client)
        if organizer:
            Participant.objects.update_or_create(
                penny_chat=penny_chat,
                user=organizer,
                defaults=dict(role=Participant.ORGANIZER),
            )

        for share_to in comma_split(penny_chat_invitation.channels) + comma_split(penny_chat_invitation.invitees):
            self.slack_client.chat_postMessage(
                channel=share_to,
                blocks=shared_message_template(penny_chat, organizer.real_name, include_rsvp=True),
            )

        # Delete the ephemeral "do you want to share?" post
        requests.post(event['response_url'], json={'delete_original': True})

    @is_block_interaction_event
    @is_action_id('penny_chat_can_attend')
    def can_attend(self, event):  # TODO! test
        try:
            user = UserProfile.objects.filter(slack_id=event['user']['id']).first()
            action_value = json.loads(event['actions'][0]['value'])
            penny_chat_id = action_value['penny_chat_id']
            penny_chat = PennyChat.objects.get(pk=penny_chat_id)
            Participant.objects.update_or_create(
                penny_chat=penny_chat,
                user=user,
                defaults=dict(role=Participant.ATTENDEE),
            )
        except RuntimeError:
            self.slack_client.chat_postEphemeral(
                channel=event['channel']['id'],
                user=event['user']['id'],
                text=(
                    "We are sorry, but an error has occurred and the Penny "
                    "Chat you are trying to edit is no longer available."
                ),
            )
            # TODO! log

    def chat_postEphemeral_with_fallback(self, channel, user, blocks):
        try:
            self.slack_client.chat_postEphemeral(channel=channel, user=user, blocks=blocks)
        except SlackApiError as ex:
            if 'error' in ex.response.data and ex.response.data['error'] == 'channel_not_found':
                logging.info(
                    f'Falling back to direct message b/c of channel_not_found ("{channel}"")'
                    f'in chat_postEphemeral_with_fallback. It is probably a direct message channel.'
                )
                self.slack_client.chat_postMessage(channel=user, blocks=blocks)
            else:
                raise


def comma_split(comma_delimited_string):
    """normal string split for  ''.split(',') returns [''], so using this instead"""
    return [x for x in comma_delimited_string.split(',') if x]
