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
                    'action_id': 'open_interests_modal'
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
        'type': 'modal',
        'callback_id': 'interests',
        'title': {
            'type': 'plain_text',
            'text': 'Help us get to know you'
        },
        'submit': {
            'type': 'plain_text',
            'text': 'Submit'
        },
        'blocks': [
            {
                'block_id': 'topics_to_learn',
                'type': 'input',
                'element': {
                    'action_id': 'topics_to_learn',
                    'type': 'plain_text_input',
                    'initial_value': profile.topics_to_learn if profile else ''
                },
                'label': {
                    'type': 'plain_text',
                    'text': 'What do you want to learn about?',
                },
                'hint': {
                    'type': 'plain_text',
                    'text': 'Provide a comma separated list of subjects you would be interested in learning.',
                },
                'optional': True
            },
            {
                'block_id': 'topics_to_share',
                'type': 'input',
                'element': {
                    'action_id': 'topics_to_share',
                    'type': 'plain_text_input',
                    'initial_value': profile.topics_to_share if profile else ''
                },
                'label': {
                    'type': 'plain_text',
                    'text': 'What are you able to share with others?'
                },
                'hint': {
                    'type': 'plain_text',
                    'text': 'Provide a comma separated list of subjects you know a thing or two about.'
                },
                'optional': True
            }
        ]
    }
    return template


def after_survey_blocks():
    admins = settings.PENNY_ADMIN_USERS
    blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'plain_text',
                'text': 'Thanks for filling out our interests survey!',
                'emoji': True
            }
        },
        {
            'type': 'divider'
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': 'Want a tour of our tools? Check out this quick tutorial:'
            },
            'accessory': {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Watch Video',
                    'emoji': True
                },
                'style': 'primary',
                'url': 'https://www.youtube.com/watch?v=4ZUkckifPqE',
                'action_id': 'watch_platform_tutorial'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': 'Want to review some recent Penny Chats?'
            },
            'accessory': {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Go to Penny Chats',
                    'emoji': True
                },
                'style': 'primary',
                'url': 'https://pennyuniversity.org/chats',
                'action_id': 'go_to_penny_chats'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'Any questions? Feel free to reach out to <{admins[0]}> or <{admins[1]}>.'
            }
        }
    ]
    return blocks


class GreetingBotModule(BotModule):
    processors = [
        'welcome_user',
        'show_interests_modal',
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
    @has_action_id('open_interests_modal')
    def show_interests_modal(self, event):
        slack_id = event['user']['id']
        profile = SocialProfile.objects.filter(slack_id=slack_id).first()
        template = onboarding_blocks(profile)
        self.slack.views_open(view=template, trigger_id=event['trigger_id'])

    @has_event_type('view_submission')
    @has_callback_id('interests')
    def submit_interests(self, event):
        slack_id = event['user']['id']
        user_data = self.slack.users_info(user=slack_id).data['user']
        topics_to_learn = event['view']['state']['values']['topics_to_learn']['topics_to_learn']['value']
        topics_to_share = event['view']['state']['values']['topics_to_share']['topics_to_share']['value']
        kwargs = dict(
            email=user_data['profile']['email'],
            slack_team_id=settings.SLACK_TEAM_ID,
            display_name=user_data['name'],
            real_name=user_data['real_name'],
            topics_to_learn=topics_to_learn or '',
            topics_to_share=topics_to_share or '',
        )
        SocialProfile.objects.update_or_create(defaults=kwargs, slack_id=slack_id)

        message = f"Welcome to Penny University <@{slack_id}>!"
        if kwargs['topics_to_learn']:
            message += f"\n\n*This person is interested in learning these topics:*\n{kwargs['topics_to_learn']}"
        if kwargs['topics_to_share']:
            message += f"\n\n*This person also knows a thing or two about these topics:*\n{kwargs['topics_to_share']}"

        self.slack.chat_postMessage(channel=GREETING_CHANNEL, text=message)
        notify_admins(self.slack, f'User <@{slack_id}> just filled out the survey.')

        self.slack.chat_postMessage(channel=slack_id, blocks=after_survey_blocks())
