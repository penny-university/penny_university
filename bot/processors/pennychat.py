from datetime import datetime

from bot.models import PennyChat
from bot.processors.base import (
    BotModule
)
from bot.processors.filters import (
    is_action_id,
    is_block_interaction_event,
    is_event_type, has_callback_id)


def create_penny_chat_blocks(slack=None, penny_chat=None):
    date = datetime.now().strftime("%Y-%m-%d")

    invitees_string = "Invitees: "
    if penny_chat:
        invitees = [slack.users_info(user=u).data['user']['real_name'] for u in penny_chat.invitees.split(',')]
    else:
        invitees = []

    for i in range(len(invitees)):
        invitees_string += invitees[i]
        if i < len(invitees) - 1:
            invitees_string += ", "

    message = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Pick a date for the Penny Chat."
            },
            "accessory": {
                "type": "datepicker",
                "initial_date": date,
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select a date",
                    "emoji": True
                }
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Choose which users to invite. You can always add more later!"
            },
            "accessory": {
                "type": "users_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select a user",
                    "emoji": True
                },
                "action_id": "penny_chat_user_select"
            }
        },
        {
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": invitees_string
                }
            ]
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Add Details",
                        "emoji": True
                    },
                    "action_id": "penny_chat_details"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Title:* {penny_chat.title if penny_chat else ''}"
            },
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*Description:* {penny_chat.description if penny_chat else ''}"
            },
        }
    ]

    if not penny_chat or (penny_chat.title == '' and penny_chat.description == ''):
        message = message[:-2]
    if not penny_chat or not len(penny_chat.invitees):
        message.pop(2)
    return message


def penny_chat_details_dialog(penny_chat):
    template = {
        'callback_id': 'penny_chat_details',
        'title': 'Penny Chat Details',
        'submit_label': 'Submit',
        'notify_on_cancel': True,
        'state': penny_chat.template_timestamp if penny_chat else '',
        'elements': [
            {
                'name': 'title',
                'type': 'text',
                'label': 'Title',
                'value': penny_chat.title if penny_chat else ''
            },
            {
                'name': 'description',
                'type': 'textarea',
                'label': 'Description',
                'hint': 'Give people an idea of what this chat will be about.',
                'value': penny_chat.description if penny_chat else ''
            }
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
        invitee = event['actions'][0]['selected_user']
        penny_chat = PennyChat.objects.get(template_timestamp=event['container']['message_ts'])
        penny_chat.invitees = penny_chat.invitees + ',' + invitee if len(penny_chat.invitees) > 0 else invitee
        penny_chat.save()
        self.slack.chat_update(channel=event['channel']['id'],
                               ts=event['container']['message_ts'],
                               blocks=create_penny_chat_blocks(self.slack, penny_chat)
                               )

    @is_block_interaction_event
    @is_action_id('penny_chat_details')
    def open_details_dialog(self, event):
        penny_chat = PennyChat.objects.get(template_timestamp=event['container']['message_ts'])
        dialog = penny_chat_details_dialog(penny_chat)
        self.slack.dialog_open(dialog=dialog, trigger_id=event['trigger_id'])

    @is_event_type('dialog_submission')
    @has_callback_id('penny_chat_details')
    def submit_details(self, event):
        submission = event['submission']

        penny_chat = PennyChat.objects.get(template_timestamp=event['state'])
        penny_chat.title = submission['title']
        penny_chat.description = submission['description']
        penny_chat.save()

        self.slack.chat_update(channel=penny_chat.template_channel,
                               ts=penny_chat.template_timestamp,
                               blocks=create_penny_chat_blocks(self.slack, penny_chat)
                               )
