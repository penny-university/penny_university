import pytest

from common.tests.fakes import SocialProfileFactory
from matchmaking.management.commands.make_matches import make_matches
from matchmaking.models import TopicChannel, Match


@pytest.mark.django_db
def test_make_matches(mocker):
    slack_client = mocker.Mock()
    conversation = {
        'channel': {
            'id': 'FAKE123'
        }
    }
    slack_client.configure_mock(**{'conversations_open.return_value': conversation})

    profile1 = SocialProfileFactory()
    profile2 = SocialProfileFactory()
    profile3 = SocialProfileFactory()

    channel = TopicChannel.objects.create(
        channel_id='one',
        slack_team_id='sl123',
        name='uno',
    )

    make_matches(slack_client, [profile1, profile2, profile3], channel)

    expected_blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Yahoo, you've been matched for a conversation about <#one>!",
            }
        },
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": "Work together to find a time to meet and chat. Once you do, "
                        "click the button below to schedule a Penny Chat.",
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "action_id": "penny_chat_schedule_match",
                    "text": {
                        "type": "plain_text",
                        "text": "Schedule Chat :calendar:",
                        "emoji": True,
                    },
                    "value": "FAKE123",
                    "style": "primary",
                }
            ]
        }
    ]

    slack_client.chat_postMessage.assert_called_once_with(channel='FAKE123', blocks=expected_blocks)
    match = Match.objects.get(conversation_id='FAKE123', topic_channel=channel)
    assert profile1 in match.profiles.all()
    assert profile2 in match.profiles.all()
    assert profile3 in match.profiles.all()
