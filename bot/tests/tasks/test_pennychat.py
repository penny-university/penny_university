from datetime import timedelta
import json
from unittest.mock import call

from django.utils import timezone
import pytest

from bot.tasks import share_penny_chat_invitation
from pennychat.models import PennyChatInvitation
from users.models import UserProfile


@pytest.mark.django_db
def test_share_penny_chat_invitation(mocker):
    chat = PennyChatInvitation.objects.create(
        title='Chat 1',
        description='The first test chat',
        date=timezone.now() - timedelta(weeks=4),
        invitees='foo,man,choo',
        channels='itsy,bitsy,spider'
    )
    user_profile = UserProfile.objects.create(slack_id='x', display_name='booger')
    chat.save_organizer(user_profile)

    slack_client = mocker.Mock()

    class chat_postMessage:
        def __init__(self, timestamp):
            self.call_num = -1
            self.timestamp = timestamp

        def __call__(self, channel, blocks):
            self.call_num += 1
            chat_postMessage_resp = mocker.Mock()
            chat_postMessage_resp.data = {
                'channel': channel,
                'ts': self.timestamp,
            }
            return chat_postMessage_resp

    slack_client.chat_postMessage.side_effect = chat_postMessage(1234)

    # test 1 - on first call it should send all the invitations
    with mocker.patch('bot.tasks.pennychat._get_slack_client', return_value=slack_client):
        share_penny_chat_invitation.now(chat.id)

    shared_with = set([cal[1]['channel'] for cal in slack_client.chat_postMessage.call_args_list])
    assert shared_with == {'itsy', 'bitsy', 'spider', 'foo', 'man', 'choo'}
    assert not slack_client.chat_delete.called

    chat.refresh_from_db()

    assert json.loads(chat.shares) == {
        'itsy': 1234,
        'bitsy': 1234,
        'spider': 1234,
        'foo': 1234,
        'man': 1234,
        'choo': 1234,
    }

    blocks = slack_client.chat_postMessage.call_args[1]['blocks']
    assert blocks
    assert 'invited you to a new Penny Chat' in str(blocks)

    slack_client.chat_postMessage.side_effect = chat_postMessage(5678)

    # test 2 - on second call it should first delete all the old invitations and send the new ones

    # change these just to make sure that the change is being picked up.
    chat.invitees = 'foo,man'
    chat.channels = 'itsy,bitsy'
    chat.save()

    slack_client.chat_postMessage.reset_mock()

    with mocker.patch('bot.tasks.pennychat._get_slack_client', return_value=slack_client):
        share_penny_chat_invitation.now(chat.id)

    shared_with = set([cal[1]['channel'] for cal in slack_client.chat_postMessage.call_args_list])
    assert shared_with == {'man', 'itsy', 'bitsy', 'foo'}
    assert slack_client.chat_delete.call_args_list == [
        call(channel='itsy', ts=1234),
        call(channel='bitsy', ts=1234),
        call(channel='spider', ts=1234),
        call(channel='foo', ts=1234),
        call(channel='man', ts=1234),
        call(channel='choo', ts=1234),
    ]

    chat.refresh_from_db()

    assert json.loads(chat.shares) == {
        'itsy': 5678,
        'bitsy': 5678,
        'foo': 5678,
        'man': 5678,
    }
