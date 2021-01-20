from datetime import timedelta

from django.conf import settings
from django.utils import timezone

from bot.processors.base import BotModule
from bot.processors.filters import is_block_interaction_event, has_action_id
from bot.utils import chat_postEphemeral_with_fallback
from bot.processors.pennychat import PENNY_CHAT_SCHEDULE_MATCH
from matchmaking.models import TopicChannel, MatchRequest
from users.models import SocialProfile, get_or_create_social_profile_from_slack_id

REQUEST_MATCHES = 'request_matches'


def request_match_blocks(channel_id):
    blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'Hey folks! <#{channel_id}> has been set up as a topic channel. Every couple of weeks, '
                        f'I (the Penny Bot) will set you up with other users to chat about <#{channel_id}>.',
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'plain_text',
                'text': 'If you\'re interested in having a virtual chat with another member of this channel next week, '
                        'click the button below!',
                'emoji': True,
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'action_id': REQUEST_MATCHES,
                    'text': {
                        'type': 'plain_text',
                        'text': 'I\'m in! :handshake:',
                        'emoji': True,
                    },
                    'style': 'primary',
                }
            ]
        }
    ]

    return blocks


def confirm_match_request(channel_id):
    blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'Awesome, we will match you with other users in <#{channel_id}> soon!',
            }
        }
    ]

    return blocks


def create_match_blocks(topic_channel_id, conversation_id, reminder=False):
    if reminder:
        message = f'''Hey! Were you able to meet for the <#{topic_channel_id}> discussion?

If not, there\'s still time. Just click the button below when you\'re ready to set up the Penny Chat.'''
    else:
        message = f'''Yahoo, you\'ve been matched for a conversation about <#{topic_channel_id}>!

Work together to find a time to meet and chat. Once you do, click the button below to schedule a Penny Chat.'''

    blocks = [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': message,
            }
        },
        {
            'type': 'actions',
            'elements': [
                {
                    'type': 'button',
                    'action_id': PENNY_CHAT_SCHEDULE_MATCH,
                    'text': {
                        'type': 'plain_text',
                        'text': 'Schedule Chat :calendar:',
                        'emoji': True,
                    },
                    'value': conversation_id,
                    'style': 'primary',
                }
            ]
        }
    ]
    return blocks


class MatchMakingBotModule(BotModule):
    processors = [
        'request_matches',
    ]

    def __init__(self, slack):
        self.slack_client = slack

    @classmethod
    def set_topic_channel(cls, slack, event):
        channel, created = TopicChannel.objects.get_or_create(
            channel_id=event['channel_id'],
            defaults={
                'slack_team_id': event['team_id'],
                'name': event['channel_name']
            }
        )

        if created:
            text = 'This channel is now a Penny Chat topic channel. We will invite users to connect every few weeks.'
        else:
            text = 'This channel is already a topic channel.'

        chat_postEphemeral_with_fallback(
            slack,
            channel=event['channel_id'],
            user=event['user_id'],
            text=text,
        )

    @is_block_interaction_event
    @has_action_id(REQUEST_MATCHES)
    def request_matches(self, event):
        channel_id = event['channel']['id']
        team_id = event['team']['id']
        user_id = event['user']['id']

        profile = get_or_create_social_profile_from_slack_id(slack_user_id=user_id)
        topic_channel = TopicChannel.objects.get(channel_id=channel_id, slack_team_id=team_id)

        recent_requests = MatchRequest.objects.filter(
            topic_channel=topic_channel,
            profile=profile,
            date__gte=timezone.now() - timedelta(days=settings.REMIND_MATCHES_SINCE_DAYS),
        )

        if len(recent_requests) > 0:
            chat_postEphemeral_with_fallback(
                self.slack_client,
                channel=channel_id,
                user=user_id,
                text='You already requested to be matched in this channel recently.',
            )
        else:
            MatchRequest.objects.create(profile=profile, topic_channel=topic_channel)

            chat_postEphemeral_with_fallback(
                self.slack_client,
                channel=channel_id,
                user=user_id,
                blocks=confirm_match_request(channel_id),
            )
