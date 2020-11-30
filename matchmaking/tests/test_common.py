import pytest

from common.tests.fakes import TopicChannelFactory, SocialProfileFactory, MatchFactory
from matchmaking.models import TopicChannel, Match
from matchmaking.common import request_matches, make_matches, remind_matches


@pytest.mark.django_db
def test_request_matches(mocker):
    topic_channel = TopicChannelFactory()
    scifi_chan = TopicChannelFactory(
        slack_team_id=topic_channel.slack_team_id,
        name = 'scifi',
    )
    frenology_chan = TopicChannelFactory(
        slack_team_id=topic_channel.slack_team_id,
        name='frenology',
    )
    other_chan = TopicChannelFactory()  # different slack id

    mock_slack_client = mocker.Mock()
    with mocker.patch("matchmaking.common.get_slack_client", return_value=mock_slack_client):
        request_matches(topic_channel.slack_team_id, channel_names=['scifi', 'frenology'])

    assert mock_slack_client.chat_postMessage.call_count == 2
    calls = str(mock_slack_client.chat_postMessage.call_args_list)
    assert scifi_chan.channel_id in calls
    assert frenology_chan.channel_id in calls
    assert topic_channel.channel_id not in calls
    assert other_chan.channel_id not in calls
    assert 'click the button' in calls, 'make sure to include some call to action'


@pytest.mark.django_db
def test_make_matches(mocker):
    slack_client = mocker.Mock()
    conversation = {
        'channel': {
            'id': 'FAKE123'
        }
    }
    slack_client.conversations_open.return_value = conversation

    profile1 = SocialProfileFactory()
    profile2 = SocialProfileFactory()
    profile3 = SocialProfileFactory()

    channel = TopicChannel.objects.create(
        channel_id='one',
        slack_team_id='sl123',
        name='uno',
    )

    with mocker.patch('matchmaking.common.get_slack_client', return_value=slack_client):
        make_matches(slack_client, [profile1.email, profile2.email, profile3.email], channel.name)

    expected_blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Yahoo, you've been matched for a conversation about <#one>!\n\nWork together to find a time to meet and chat. Once you do, click the button below to schedule a Penny Chat.",  # noqa
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

@pytest.mark.django_db
def test_remind_matches(mocker):
    slack_team_id = 'T123456'
    mock_slack_client = mocker.Mock()
    no_chat_match_1 = MatchFactory(penny_chat=None)
    no_chat_match_2 = MatchFactory(penny_chat=None)
    chat_match = MatchFactory()
    with mocker.patch("matchmaking.common.get_slack_client", return_value=mock_slack_client):
        remind_matches(slack_team_id)

    assert mock_slack_client.chat_postMessage.call_count == 2

    calls = str(mock_slack_client.chat_postMessage.call_args_list)
    assert no_chat_match_1.conversation_id in calls
    assert no_chat_match_2.conversation_id in calls
    assert chat_match.conversation_id not in calls
    assert chat_match.conversation_id not in calls
    assert 'Were you able to meet' in calls, 'we need to encourage them to meet'
    assert 'click the button' in calls, 'we a call to action'
