from django.conf import settings

from bot.utils import notify_admins, channel_lookup
from users.models import SocialProfile
from bot.processors.base import (
    BotModule,
)
from bot.processors.filters import (
    in_room,
    is_block_interaction_event,
    has_callback_id,
    has_event_type,
    has_action_id
)

GREETING_CHANNEL = 'general'
WELCOME_ROOM_CHANNEL = 'penny-u-welcome-committee'


def greeting_blocks(user_id):
    message = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Hey, <@{user_id}>*!',
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': 'Penny University connects people with similar interests in order for them to learn together. '
                        'Add your interests so we can do the same for you.',
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'Add My Interests',
                    },
                    'action_id': 'open_interests_dialog'
                }
            ]
        },
    ]
    return message


def welcome_room_blocks(user_id):
    message = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'<@{user_id}> just arrived. Can anyone reach out to them to set up a 15 minute chat?'
            }

        }
    ]
    return message


def onboarding_blocks(profile=None):
    template = {
        'callback_id': 'interests',
        'title': 'Help us get to know you',
        'submit_label': 'Submit',
        'notify_on_cancel': True,
        'state': 'arbitrary data',
        'elements': [
            {
                'name': 'topics_to_learn',
                'type': 'plain_text_input',
                'label': 'What do you want to learn about?',
                'hint': 'Provide a comma separated list of subjects you would be interested in learning.',
                'optional': 'true',
                'value': profile.topics_to_learn if profile else ''
            },
            {
                'name': 'topics_to_share',
                'type': 'plain_text_input',
                'label': 'What are you able to share with others?',
                'hint': 'Provide a comma separated list of subjects you know a thing or two about.',
                'optional': 'true',
                'value': profile.topics_to_share if profile else ''
            }
        ]
    }
    return template


class GreetingBotModule(BotModule):
    processors = [
        'welcome_user',
        'show_interests_dialog',
        'submit_interests',
    ]

    def __init__(self, slack):
        self.slack = slack

    @in_room(GREETING_CHANNEL)
    @has_event_type('message.channel_join')
    def welcome_user(self, event):
        self.slack.chat_postMessage(channel=event['user'], blocks=greeting_blocks(event['user']))
        self.slack.chat_postMessage(channel=channel_lookup(WELCOME_ROOM_CHANNEL),
                                    blocks=welcome_room_blocks(event['user']))
        notify_admins(self.slack, f'<@{event["user"]}> just received a greeting message.')

    @is_block_interaction_event
    @has_action_id('open_interests_dialog')
    def show_interests_dialog(self, event):
        slack_id = event['user']['id']
        profile = SocialProfile.objects.filter(slack_id=slack_id).first()
        template = onboarding_blocks(profile)
        self.slack.dialog_open(dialog=template, trigger_id=event['trigger_id'])

    @has_event_type('dialog_submission')
    @has_callback_id('interests')
    def submit_interests(self, event):
        slack_id = event['user']['id']
        user_data = self.slack.users_info(user=slack_id).data['user']
        kwargs = dict(
            email=user_data['profile']['email'],
            slack_team_id=settings.SLACK_TEAM_ID,
            display_name=user_data['name'],
            real_name=user_data['real_name'],
            metro_name=event['submission']['metro_name'] or '',
            topics_to_learn=event['submission']['topics_to_learn'] or '',
            topics_to_share=event['submission']['topics_to_share'] or '',
            how_you_learned_about_pennyu=event['submission']['how_you_learned_about_pennyu'] or '',
        )
        SocialProfile.objects.update_or_create(defaults=kwargs, slack_id=slack_id)

        message = f"Welcome to Penny University {kwargs['real_name']}!"
        if kwargs['topics_to_learn']:
            message += f"\n\n*This person is interested in learning these topics:*\n{kwargs['topics_to_learn']}"
        if kwargs['topics_to_share']:
            message += f"\n\n*This person also knows a thing or two about these topics:*\n{kwargs['topics_to_share']}"

        self.slack.chat_postMessage(channel=GREETING_CHANNEL, text=message)
        notify_admins(self.slack, f'User <@{slack_id}> just filled out the survey.')
