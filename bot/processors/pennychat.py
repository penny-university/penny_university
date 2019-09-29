from datetime import datetime, timedelta
from pprint import pprint

from bot.models import PennyChat
from bot.processors.base import (
    BotModule
)
from bot.processors.filters import (
    is_action_id,
    is_block_interaction_event,
    is_event_type, has_callback_id)


def datetime_range(start, end, delta):
    current = start
    while current < end:
        yield current
        current += delta


time_options = [{'text': {'type': 'plain_text', 'text': dt.strftime('%-I:%M %p')}, 'value': dt.strftime('%-I:%M %p')}
       for dt in datetime_range(datetime(2019, 1, 1, 0), datetime(2019, 1, 2, 0), timedelta(minutes=15))]


def create_penny_chat_blocks(slack=None, penny_chat=None):
    share_string = "Shared with: "
    shares = []
    if penny_chat and len(penny_chat.invitees) > 0:
        for user in penny_chat.invitees.split(','):
            shares.append(slack.users_info(user=user).data['user']['real_name'])

    if penny_chat and len(penny_chat.channels) > 0:
        for channel in penny_chat.channels.split(','):
            shares.append(f'<#{channel}>')

    for i in range(len(shares)):
        share_string += shares[i]
        if i < len(shares) - 1:
            share_string += ", "

    message = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Create Penny Chat*"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                        "It looks like you want to create a new Penny Chat! Click the button below to add details "
                        "about your chat such as when it is taking place and who you want to invite."
                    )

            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Add Details"
                    },
                    "action_id": "penny_chat_details"
                }
            ]
        }
    ]

    return message


def penny_chat_details_modal(penny_chat):
    date = str(penny_chat.date.date()) if penny_chat else str(datetime.now().date())
    time_string = datetime.strftime(penny_chat.date, '%-I:%M %p') if penny_chat else time_options[0]
    time = {'text': {'type': 'plain_text', 'text': time_string}, 'value': time_string}
    users = []
    if penny_chat and len(penny_chat.invitees) > 0:
        users = [user for user in penny_chat.invitees.split(',')]
    channels = []
    if penny_chat and len(penny_chat.channels) > 0:
        channels = [channel for channel in penny_chat.channels.split(',')]

    template = {
        "type": "modal",
        "callback_id": "penny_chat_details",
        "title": {
            "type": "plain_text",
            "text": "Penny Chat Details"
        },
        "submit": {
            "type": "plain_text",
            "text": "Done"
        },
        "blocks": [
            {
                "block_id": "penny_chat_title",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "penny_chat_title",
                    "initial_value": penny_chat.title if penny_chat else ''
                },
                "label": {
                    "type": "plain_text",
                    "text": "Title"
                }
            },
            {
                "block_id": "penny_chat_description",
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "penny_chat_description",
                    "multiline": True,
                    "initial_value": penny_chat.description if penny_chat else ''
                },
                "label": {
                    "type": "plain_text",
                    "text": "Description"
                },
                "hint": {
                    "type": "plain_text",
                    "text": 'Give people an idea of what this chat will be about.'
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Pick a date for the Penny Chat*"
                }
            },
            {
                "block_id": "penny_chat_date_time",
                "type": "actions",
                "elements": [
                    {
                        "type": "datepicker",
                        "action_id": "penny_chat_date",
                        "initial_date": date,
                    },
                    {
                        "type": "static_select",
                        "action_id": "penny_chat_time",
                        "initial_option": time,
                        "options": time_options
                    }
                ]
            },
            {
                "block_id": "penny_chat_user_select",
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Who do you want to invite?*"
                },
                "accessory": {
                    "type": "multi_users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select Users"
                    },
                    "initial_users": users,
                    "action_id": "penny_chat_user_select",
                }
            },
            {
                "block_id": "penny_chat_channel_select",
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Which channels should I share this with?*"
                },
                "accessory": {
                    "type": "multi_channels_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select Channels"
                    },
                    "initial_channels": channels,
                    "action_id": "penny_chat_channel_select",
                }
            },
        ]
    }

    return template


class PennyChatBotModule(BotModule):
    def __init__(self, slack):
        self.slack = slack

    @classmethod
    def create_penny_chat(cls, slack, event):
        response = slack.chat_postMessage(channel=event['channel_id'],
                                          user=event['user_id'],
                                          blocks=create_penny_chat_blocks()
                                          )

        PennyChat.objects.create(template_channel=response.data['channel'], template_timestamp=response.data['ts'])

    @is_block_interaction_event
    @is_action_id('penny_chat_user_select')
    def user_select(self, event):
        users = event['actions'][0]['selected_users']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        invitees = ''
        for invitee in users:
            invitees = invitees + ',' + invitee if len(invitees) > 0 else invitee
        penny_chat.invitees = invitees
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_channel_select')
    def channel_select(self, event):
        selected_channels = event['actions'][0]['selected_channels']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        channels = ''
        for channel in selected_channels:
            channels = channel + ',' + channel if len(selected_channels) > 0 else channel
        penny_chat.channels = channels
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_time')
    def time_select(self, event):
        time = event['actions'][0]['selected_option']['value']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        date = str(penny_chat.date.date())
        penny_chat.date = datetime.strptime(date + ' ' + time, '%Y-%m-%d %I:%M %p')
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_date')
    def date_select(self, event):
        date = event['actions'][0]['selected_date']
        penny_chat = PennyChat.objects.get(view=event['view']['id'])
        time = str(penny_chat.date.time())
        penny_chat.date = datetime.strptime(date + ' ' + time, '%Y-%m-%d %H:%M:%S')
        penny_chat.save()

    @is_block_interaction_event
    @is_action_id('penny_chat_details')
    def open_details_view(self, event):
        penny_chat = PennyChat.objects.get(template_timestamp=event['container']['message_ts'])
        modal = penny_chat_details_modal(penny_chat)
        response = self.slack.views_open(view=modal, trigger_id=event['trigger_id'])
        penny_chat.view = response.data['view']['id']
        penny_chat.save()

    @is_event_type('view_submission')
    @has_callback_id('penny_chat_details')
    def submit_details(self, event):
        view = event['view']
        penny_chat = PennyChat.objects.get(view=view['id'])
        state = view['state']['values']

        penny_chat.title = state['penny_chat_title']['penny_chat_title']['value']
        penny_chat.description = state['penny_chat_description']['penny_chat_description']['value']

        time = state['penny_chat_date_time']['penny_chat_time']['selected_option']['value']
        date = state['penny_chat_date_time']['penny_chat_date']['selected_date']
        penny_chat.date = datetime.strptime(date + ' ' + time, '%Y-%m-%d %I:%M %p')

        selected_users = state['penny_chat_user_select']['penny_chat_user_select']['selected_users']
        users = ''
        for user in selected_users:
            users = users + ',' + user if len(users) > 0 else user
        penny_chat.invitees = users

        selected_channels = state['penny_chat_channel_select']['penny_chat_channel_select']['selected_channels']
        channels = ''
        for channel in selected_channels:
            channels = channel + ',' + channel if len(channels) > 0 else channel
        penny_chat.channels = channels

        penny_chat.save()

        self.slack.chat_update(channel=penny_chat.template_channel,
                               ts=penny_chat.template_timestamp,
                               blocks=create_penny_chat_blocks(self.slack, penny_chat)
                               )
