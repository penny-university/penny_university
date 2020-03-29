from datetime import timedelta, datetime
import json
from unittest.mock import call

from django.utils import timezone
import pytest
from pytz import utc

from bot.tasks import share_penny_chat_invitation, post_organizer_edit_after_share_template, \
    organizer_edit_after_share_template, shared_message_template
from pennychat.models import PennyChatInvitation, PennyChat
from users.models import UserProfile


@pytest.mark.django_db
def test_share_penny_chat_invitation(mocker):
    penny_chat = PennyChatInvitation.objects.create(
        title='Chat 1',
        description='The first test chat',
        date=timezone.now() - timedelta(weeks=4),
        invitees='foo,man,choo',
        channels='itsy,bitsy,spider'
    )
    user_profile = UserProfile.objects.create(slack_id='x', display_name='booger')
    penny_chat.save_organizer(user_profile)

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
        share_penny_chat_invitation.now(penny_chat.id)

    shared_with = set([cal[1]['channel'] for cal in slack_client.chat_postMessage.call_args_list])
    assert shared_with == {'itsy', 'bitsy', 'spider', 'foo', 'man', 'choo'}
    assert not slack_client.chat_delete.called

    penny_chat.refresh_from_db()

    assert json.loads(penny_chat.shares) == {
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
    penny_chat.invitees = 'foo,man'
    penny_chat.channels = 'itsy,bitsy'
    penny_chat.save()

    slack_client.chat_postMessage.reset_mock()

    with mocker.patch('bot.tasks.pennychat._get_slack_client', return_value=slack_client):
        share_penny_chat_invitation.now(penny_chat.id)

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

    penny_chat.refresh_from_db()

    assert json.loads(penny_chat.shares) == {
        'itsy': 5678,
        'bitsy': 5678,
        'foo': 5678,
        'man': 5678,
    }


@pytest.mark.django_db
def test_post_organizer_edit_after_share_template(mocker):
    penny_chat_view_id = 'some_view_id'
    organizer_slack_id = 'some_organizer_slack_id'

    PennyChatInvitation.objects.create(
        title='Chat 1',
        view=penny_chat_view_id,
        organizer_slack_id=organizer_slack_id,
    )

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

    with mocker.patch('bot.tasks.pennychat._get_slack_client', return_value=slack_client),\
            mocker.patch('bot.tasks.pennychat.organizer_edit_after_share_template', return_value='some_block'):
        post_organizer_edit_after_share_template.now(penny_chat_view_id),

    assert slack_client.chat_postMessage.call_args == call(blocks='some_block', channel='some_organizer_slack_id')


def test_organizer_edit_after_share_template(mocker):
    user_1 = UserProfile(slack_id='user_1', real_name='user_1')
    user_2 = UserProfile(slack_id='user_2', real_name='user_2')
    organizer = UserProfile(slack_id='organizer', real_name='Orlando')

    penny_chat = PennyChatInvitation(
        title='Chat 1',
        invitees='user_1,user_2',
        organizer_slack_id='organizer',
        channels='Chan1,Chan2',
    )

    def ids_mock(user_ids, slack_client=None):
        return {user.slack_id: user for user in [user_1, user_2, organizer] if user.slack_id in user_ids}

    slack_client = mocker.Mock()

    with mocker.patch('bot.tasks.pennychat.get_or_create_user_profile_from_slack_ids', side_effect=ids_mock),\
            mocker.patch('bot.tasks.pennychat.shared_message_template', return_value=['some_blocks']):
        template = str(organizer_edit_after_share_template(slack_client, penny_chat))

    assert 'some_blocks' in template
    assert 'You just shared this invitation with:* user_1, user_2, <#Chan1>, and <#Chan2>.' in template


def test_shared_message_template(mocker):
    penny_chat = PennyChat(
        id=1,
        title='Chat 1',
        description='some_description',
        date=datetime(1979, 10, 12, 1, 1, 1, tzinfo=utc),
    )
    user_name = 'John Berryman'

    template = str(shared_message_template(penny_chat, user_name, include_rsvp=True))
    assert '*John Berryman* invited you to a new Penny Chat' in template
    assert '*Title*\\nChat 1' in template
    assert '*Description*\\nsome_description' in template
    assert 'Count me in' in template, 'should be there when include_rsvp is true'
    assert 'I can\'t make it' in template, 'should be there when include_rsvp is True'

    template = str(shared_message_template(penny_chat, user_name, include_rsvp=False))
    assert '*John Berryman* invited you to a new Penny Chat' in template
    assert '*Title*\\nChat 1' in template
    assert '*Description*\\nsome_description' in template
    assert 'Count me in' not in template, 'should not be there when include_rsvp is False'
    assert 'I can\'t make it' not in template, 'should not be there when include_rsvp is False'
