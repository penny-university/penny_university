from django.conf import settings

from bot.utils import notify_admins
from users.models import UserProfile
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


def greeting_blocks(user_id):
    message = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'*Welcome to Penny University, <@{user_id}>*',
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': (
                    'Penny University is a self-organizing, peer-to-peer learning community. In Penny U there are no '
                    '"mentors" or "mentees" but rather peers that enjoy learning together, socially. '
                )
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': (
                    '• If you have something you can teach, then let it be known. \n • If you have something you want '
                    'to learn, then reach out to the community or to an individual and ask for help - buy them a coffee'
                    ' or lunch, or jump on a Google Hangout. (This is called a _Penny Chat_.) \n • And when your Penny '
                    'Chat is complete, show your appreciation by posting a Penny Chat review in our '
                    '<http://pennyuniversity.org|forum>. Teach us a little of what you have learned.'
                ),
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': (
                    'Penny U is on the move. If all goes well then I, your trusty robot sidekick, will gain super '
                    'powers in the coming months. I will help you find the answers you\'re looking for. I will also '
                    'replace our lowly <http://pennyuniversity.org|Google Groups home page> with something a little '
                    'more... appealing. If you want to help use out then let <@U42HCBFEF> and <@UES202FV5> know.'
                ),
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': (
                    'Next steps - let us know a little more about yourself. (_Note: survey response will be publicly '
                    'viewable._)'
                )
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': 'What would you like to learn?',
                    },
                    'action_id': 'open_interests_dialog'
                }
            ]
        },
    ]
    return message


def onboarding_template(user=None):
    template = {
        'callback_id': 'interests',
        'title': 'Let\'s get to know you',
        'submit_label': 'Submit',
        'notify_on_cancel': True,
        'state': 'arbitrary data',
        'elements': [
            {
                'name': 'topics_to_learn',
                'type': 'textarea',
                'label': 'What do you want to learn?',
                'hint': 'Provide a comma separated list of subjects you would be interested in learning.',
                'optional': 'true',
                'value': user.topics_to_learn if user else ''
            },
            {
                'name': 'topics_to_share',
                'type': 'textarea',
                'label': 'What do you able to share with others?',
                'hint': 'Provide a comma separated list of subjects you would be interested in sharing.',
                'optional': 'true',
                'value': user.topics_to_share if user else ''
            },
            {
                'name': 'metro_name',
                'type': 'text',
                'label': 'Where are you from?',
                'hint': 'City and state (or country if not the U.S.).',
                'optional': 'true',
                'value': user.metro_name if user else ''
            },
            {
                'name': 'how_you_learned_about_pennyu',
                'type': 'text',
                'label': 'How did you learn about Penny University?',
                'hint': 'Who told you? Where did you hear about us?',
                'optional': 'true',
                'value': user.how_you_learned_about_pennyu if user else ''
            },
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
        notify_admins(self.slack, f'<@{event["user"]}> just received a greeting message.')

    @is_block_interaction_event
    @has_action_id('open_interests_dialog')
    def show_interests_dialog(self, event):
        slack_id = event['user']['id']
        user = UserProfile.objects.filter(slack_id=slack_id).first()
        template = onboarding_template(user)
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
        UserProfile.objects.update_or_create(defaults=kwargs, slack_id=slack_id)

        message = f"Welcome to Penny University {kwargs['real_name']}!"
        if kwargs['topics_to_learn']:
            message += f"\n\n*This person is interested in learning these topics:*\n{kwargs['topics_to_learn']}"
        if kwargs['topics_to_share']:
            message += f"\n\n*This person also knows a thing or two about these topics:*\n{kwargs['topics_to_share']}"

        self.slack.chat_postMessage(channel=GREETING_CHANNEL, text=message)
        notify_admins(self.slack, f'User <@{slack_id}> just filled out the survey.')
