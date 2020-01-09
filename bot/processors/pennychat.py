from datetime import datetime, timedelta
from pytz import timezone, utc
import urllib.parse
import requests

from pennychat.models import PennyChat, Participant
from bot.processors.base import (
    BotModule
)
from bot.processors.filters import (
    is_action_id,
    is_block_interaction_event,
    is_event_type, has_callback_id)
from users.utils import get_or_create_by_slack_ids


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


def shared_message_preview_template(slack_client, penny_chat):
    shares = []
    if len(penny_chat.invitees) > 0:
        for slack_user_id in penny_chat.invitees.split(','):
            users = get_or_create_by_slack_ids(penny_chat.invitees.split(','), slack_client=slack_client)
            for user in users.values():
                Participant.objects.update_or_create(
                    penny_chat=penny_chat,
                    user=user,
                    defaults=dict(role=Participant.INVITEE),
                )
            shares.append(users[slack_user_id].real_name)

    organizer = get_or_create_by_slack_ids([penny_chat.user], slack_client=slack_client).get(penny_chat.user)
    if organizer:
        Participant.objects.update_or_create(
            penny_chat=penny_chat,
            user=user,
            defaults=dict(role=Participant.ORGANIZER),
        )

    if len(penny_chat.channels) > 0:
        for channel in penny_chat.channels.split(','):
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
    ] + shared_message_template(penny_chat, organizer.real_name) + [
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


def shared_message_template(penny_chat, user_name):
    timestamp = int(penny_chat.date.astimezone(utc).timestamp())
    date_text = f'*Date and Time*\n<!date^{timestamp}^{{date_pretty}} at {{time}}|{penny_chat.date}>'

    start_date = penny_chat.date.astimezone(utc).strftime('%Y%m%dT%H%M%SZ')
    end_date = (penny_chat.date.astimezone(utc) + timedelta(hours=1)).strftime('%Y%m%dT%H%M%SZ')
    google_cal_url = 'https://calendar.google.com/calendar/render?' \
                     'action=TEMPLATE&text=' \
        f'{urllib.parse.quote(penny_chat.title)}&dates=' \
        f'{start_date}/{end_date}&details=' \
        f'{urllib.parse.quote(penny_chat.description)}'

    return [
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
        }
    ]


def penny_chat_details_modal(penny_chat):
    tz = timezone(penny_chat.user_tz)
    date = str(penny_chat.date.astimezone(tz).date())
    time_string = datetime.strftime(penny_chat.date.astimezone(tz), '%-I:%M %p')
    time = {'text': {'type': 'plain_text', 'text': time_string}, 'value': time_string}
    users = []
    if penny_chat and len(penny_chat.invitees) > 0:
        users = [user for user in penny_chat.invitees.split(',')]
    channels = []
    if penny_chat and len(penny_chat.channels) > 0:
        channels = [channel for channel in penny_chat.channels.split(',')]

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
                    'initial_value': penny_chat.title if penny_chat else ''
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
                    'initial_value': penny_chat.description if penny_chat else ''
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
    ]

    def __init__(self, slack):
        self.slack = slack

    @classmethod
    def create_penny_chat(cls, slack, event):
        user = slack.users_info(user=event['user_id']).data['user']
        date = datetime.now().replace(minute=0, second=0, microsecond=0, tzinfo=utc)
        penny_chat, created = PennyChat.objects.get_or_create(
            user=user['id'],
            status=PennyChat.DRAFT_STATUS,
            defaults={
                'user_tz': user['tz'],
                'template_channel': event['channel_id'],
                'date': date,
            },
        )

        modal = penny_chat_details_modal(penny_chat)
        response = slack.views_open(view=modal, trigger_id=event['trigger_id'])
        penny_chat.view = response.data['view']['id']
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_date')
    def date_select(self, event):
        date = event['actions'][0]['selected_date']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat.user_tz)
        time = str(penny_chat.date.astimezone(tz).time()) if penny_chat.date else '00:00:00'
        penny_chat.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %H:%M:%S'))
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_time')
    def time_select(self, event):
        time = event['actions'][0]['selected_option']['value']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        tz = timezone(penny_chat.user_tz)
        date = str(penny_chat.date.astimezone(tz).date()) if penny_chat.date else datetime.now().date()
        penny_chat.date = tz.localize(datetime.strptime(date + ' ' + time, '%Y-%m-%d %I:%M %p'))
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_user_select')
    def user_select(self, event):
        users = event['actions'][0]['selected_users']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        penny_chat.invitees = ','.join(users)
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_channel_select')
    def channel_select(self, event):
        selected_channels = event['actions'][0]['selected_channels']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        penny_chat.channels = ','.join(selected_channels)
        penny_chat.save()

    @is_event_type('view_submission')
    @has_callback_id('penny_chat_details')
    def submit_details(self, event):
        view = event['view']
        penny_chat = PennyChat.objects.get(view=view['id'])
        state = view['state']['values']

        penny_chat.title = state['penny_chat_title']['penny_chat_title']['value']
        penny_chat.description = state['penny_chat_description']['penny_chat_description']['value']
        penny_chat.save()

        if len(penny_chat.invitees.strip()) == 0 and len(penny_chat.channels.strip()) == 0:
            return {
                "response_action": "errors",
                "errors": {
                    "penny_chat_description": "One is a lonely number for a Penny Chat. "
                                              "Invite at least one channel or user below."
                }
            }
        else:
            self.slack.chat_postEphemeral(
                channel=penny_chat.template_channel,
                user=penny_chat.user,
                blocks=shared_message_preview_template(self.slack, penny_chat),
            )

    @is_block_interaction_event
    @is_action_id('penny_chat_edit')
    def edit_chat(self, event):
        try:
            penny_chat = PennyChat.objects.get(user=event['user']['id'], status=PennyChat.DRAFT_STATUS)
        except:  # noqa
            requests.post(event['response_url'], json={'delete_original': True})
            self.slack.chat_postEphemeral(
                channel=event['channel']['id'],
                user=event['user']['id'],
                text=(
                    "We are sorry, but an error has occurred and the Penny "
                    "Chat you are trying to edit is no longer available."
                ),
            )
            return
        modal = penny_chat_details_modal(penny_chat)
        response = self.slack.views_open(view=modal, trigger_id=event['trigger_id'])
        penny_chat.view = response.data['view']['id']
        penny_chat.save()
        requests.post(event['response_url'], json={'delete_original': True})

    @is_block_interaction_event
    @is_action_id('penny_chat_share')
    def share(self, event):
        try:
            penny_chat = PennyChat.objects.get(user=event['user']['id'], status=PennyChat.DRAFT_STATUS)
        except:  # noqa
            requests.post(event['response_url'], json={'delete_original': True})
            self.slack.chat_postEphemeral(
                channel=event['channel']['id'],
                user=event['user']['id'],
                text=(
                    "We are sorry, but an error has occurred and the Penny "
                    "Chat you are trying to share is no longer available."
                ),
            )
            return
        user = self.slack.users_info(user=penny_chat.user)['user']
        for share_to in penny_chat.channels.split(',') + penny_chat.invitees.split(','):
            if share_to != '':
                self.slack.chat_postMessage(
                    channel=share_to,
                    blocks=shared_message_template(penny_chat, user['real_name']),
                )
        penny_chat.status = PennyChat.SHARED_STATUS
        penny_chat.save()
        requests.post(event['response_url'], json={'delete_original': True})
