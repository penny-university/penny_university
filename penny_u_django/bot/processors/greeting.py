from django.conf import settings

from bot.models import User
from bot.processors.base import (
    BotModule,
    event_filter,
    event_filter_factory,
)

CHANNEL_NAME__ID = {
    'data': 'C41403LBA',
    'web': 'C414TFTCH',
    'random': 'C41DZGE8K',
    'general': 'C41G02RK4',
    'deutsch': 'C41Q2A527',
    'django': 'C41QX2KRS',
    'python': 'C42D67CNA',
    'meta-penny': 'C42G2A4LF',
    'sfpenny': 'C44K5JAR4',
    'jobs': 'C5WT843FU',
    'rust': 'C66LPHCLU',
    'data-nerds-projects': 'C68MH0E8L',
    'javascript': 'C6GTBL3L5',
    'job': 'CDM9N259S',
    'penny-playground': 'CHCM2MFHU',
    'book-club': 'CHP0FA4J1'
}

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
                'type': 'plain_text',
                'text': 'Next steps - let us know a little more about yourself:',
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
                    'value': 'interests_survey'
                }
            ]
        }
    ]
    return message


DIALOG_TEMPLATE = {
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
            },
            {
                'name': 'topics_to_share',
                'type': 'textarea',
                'label': 'What do you able to share with others?',
                'hint': 'Provide a comma separated list of subjects you would be interested in sharing.',
                'optional': 'true',
            },
            {
                'name': 'metro_name',
                'type': 'text',
                'label': 'Where are you from?',
                'hint': 'City and state (or country if not the U.S.).',
                'optional': 'true',
            },
            {
                'name': 'how_you_learned_about_pennyu',
                'type': 'text',
                'label': 'How did you learn about Penny University?',
                'hint': 'Who told you? Where did you hear about us?',
                'optional': 'true',
            },
        ]
    }

@event_filter_factory
def in_room(room):
    def filter_func(event):
        return 'channel' in event and event['channel'] == CHANNEL_NAME__ID[room]

    return filter_func


@event_filter_factory
def is_event_type(type_string):
    def filter_func(event):
        type_arr = type_string.split('.')
        assert 1 <= len(type_arr) <= 2, 'Format for type_string must be "foo" or "foo.bar" of "*.bar" or "foo.*"'
        if len(type_arr) == 1:
            type_arr.append('*')
        if 'type' not in event:
            return False
        if type_arr[0] != '*' and event['type'] != type_arr[0]:
            return False
        if 'subtype' in event:
            if type_arr[1] != '*' and event['subtype'] != type_arr[1]:
                return False
        else:
            if type_arr[1] != '*':
                return False
        return True

    return filter_func


@event_filter
def is_block_interaction_event(event):
    """Detects whether or not the event is a block interaction event

    (such events have a 'trigger_id')
    """
    return 'trigger_id' in event


@event_filter_factory
def has_callback_id(callback_id):
    def filter_func(event):
        return event['callback_id'] == callback_id

    return filter_func


class GreetingBotModule(BotModule):
    def __init__(self, slack):
        self.slack = slack

    def notify_admins(self, message):
        for user in settings.PENNY_ADMIN_USERS:
            self.slack.chat_postMessage(channel=user, text=message)

    @in_room(GREETING_CHANNEL)
    @is_event_type('message.channel_join')
    def welcome_user(self, event):
        self.slack.chat_postMessage(channel=event['user'], blocks=greeting_blocks(event['user']))
        self.notify_admins(f'<@{event["user"]}> just received a greeting message.')

    @is_block_interaction_event
    @is_event_type('block_actions')
    def show_interests_dialog(self, event):
        self.slack.dialog_open(dialog=DIALOG_TEMPLATE, trigger_id=event['trigger_id'])

    @is_event_type('dialog_submission')
    @has_callback_id('interests')
    def submit_interests(self, event):
        slack_id = event['user']['id']
        user_data = self.slack.users_info(user=slack_id).data['user']
        kwargs = dict(
            email=user_data['profile']['email'],
            user_name=user_data['name'],
            real_name=user_data['real_name'],
            metro_name=event['submission']['metro_name'] or '',
            topics_to_learn=event['submission']['topics_to_learn'] or '',
            topics_to_share=event['submission']['topics_to_share'] or '',
            how_you_learned_about_pennyu=event['submission']['how_you_learned_about_pennyu'] or '',
        )
        User.objects.update_or_create(defaults=kwargs, slack_id=slack_id)

        message = f"Welcome to Penny University {kwargs['real_name']}!"
        if kwargs['topics_to_learn']:
            message += f"\n\n*This person is interested in learning these topics:*\n{kwargs['topics_to_learn']}"
        if kwargs['topics_to_share']:
            message += f"\n\n*This person also knows a thing or two about these topics:*\n{kwargs['topics_to_share']}"

        self.slack.chat_postMessage(channel=GREETING_CHANNEL, text=message)
        self.notify_admins(f'User <@{slack_id}> just filled out the survey.')
