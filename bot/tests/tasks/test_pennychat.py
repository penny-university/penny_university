from datetime import timedelta, datetime
from contextlib import contextmanager
import json
from unittest.mock import call

from django.utils import timezone
import pytest
from pytz import utc

from bot.tasks.pennychat import (
    share_penny_chat_invitation,
    post_organizer_edit_after_share_blocks,
    _penny_chat_details_blocks,
    organizer_edit_after_share_blocks,
)
import bot.tasks.pennychat as pennychat_constants
from pennychat.models import PennyChatInvitation, Participant
from users.models import UserProfile


@contextmanager
def _make_get_or_create_user_profile_from_slack_id_mocks(mocker, mock_path, users):
    def ids_mock(user_ids, slack_client=None):
        return {user.slack_id: user for user in users if user.slack_id in user_ids}

    def id_mock(user_id, slack_client=None):
        return ids_mock([user_id]).get(user_id)

    with mocker.patch(mock_path + '.get_or_create_user_profile_from_slack_id', side_effect=id_mock), \
            mocker.patch(mock_path + '.get_or_create_user_profile_from_slack_ids', side_effect=ids_mock):
        yield


@pytest.mark.django_db
def test_share_penny_chat_invitation(mocker):
    slack_id = 'slack_id'
    penny_chat_invitation = PennyChatInvitation.objects.create(
        title='Chat 1',
        description='The first test chat',
        date=timezone.now() - timedelta(weeks=4),
        invitees='foo,man,choo',
        channels='itsy,bitsy,spider',
        organizer_slack_id='slack_id',
    )
    user_profile = UserProfile.objects.create(slack_id=slack_id, display_name='booger')
    penny_chat_invitation.save_participant(user_profile, Participant.ORGANIZER)

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
    with _make_get_or_create_user_profile_from_slack_id_mocks(mocker, 'bot.tasks.pennychat', [user_profile]), \
            mocker.patch('bot.tasks.pennychat._get_slack_client', return_value=slack_client):
        share_penny_chat_invitation.now(penny_chat_invitation.id)

    shared_with = set([cal[1]['channel'] for cal in slack_client.chat_postMessage.call_args_list])
    assert shared_with == {'itsy', 'bitsy', 'spider', 'foo', 'man', 'choo'}
    assert not slack_client.chat_delete.called

    penny_chat_invitation.refresh_from_db()

    assert json.loads(penny_chat_invitation.shares) == {
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
    penny_chat_invitation.invitees = 'foo,man'
    penny_chat_invitation.channels = 'itsy,bitsy'
    penny_chat_invitation.save()

    slack_client.chat_postMessage.reset_mock()

    with mocker.patch('bot.tasks.pennychat._get_slack_client', return_value=slack_client):
        share_penny_chat_invitation.now(penny_chat_invitation.id)

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

    penny_chat_invitation.refresh_from_db()

    assert json.loads(penny_chat_invitation.shares) == {
        'itsy': 5678,
        'bitsy': 5678,
        'foo': 5678,
        'man': 5678,
    }


@pytest.mark.django_db
def test_post_organizer_edit_after_share_blocks(mocker):
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
            mocker.patch('bot.tasks.pennychat.organizer_edit_after_share_blocks', return_value='some_block'):
        post_organizer_edit_after_share_blocks.now(penny_chat_view_id),

    assert slack_client.chat_postMessage.call_args == call(blocks='some_block', channel='some_organizer_slack_id')


def test_organizer_edit_after_share_blocks(mocker):
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
    users = [user_1, user_2, organizer]
    with _make_get_or_create_user_profile_from_slack_id_mocks(mocker, 'bot.tasks.pennychat', users), \
            mocker.patch('bot.tasks.pennychat._penny_chat_details_blocks', return_value=['some_blocks']):
        template = str(organizer_edit_after_share_blocks(slack_client, penny_chat))

    assert 'some_blocks' in template
    assert 'You just shared this invitation with:* user_1, user_2, <#Chan1>, and <#Chan2>.' in template


def test_penny_chat_details_blocks(mocker):
    organizer_slack_id = 'organizer_slack_id'
    penny_chat = PennyChatInvitation(
        id=1,
        title='Chat 1',
        description='some_description',
        date=datetime(1979, 10, 12, 1, 1, 1, tzinfo=utc),
        organizer_slack_id=organizer_slack_id,
    )
    organizer = UserProfile(slack_id=organizer_slack_id, display_name='John Berryman')

    with _make_get_or_create_user_profile_from_slack_id_mocks(mocker, 'bot.tasks.pennychat', [organizer]):
        preview_blocks = str(_penny_chat_details_blocks(penny_chat, mode=pennychat_constants.PREVIEW))
        invite_blocks = str(_penny_chat_details_blocks(penny_chat, mode=pennychat_constants.INVITE))
        update_blocks = str(_penny_chat_details_blocks(penny_chat, mode=pennychat_constants.UPDATE))
        remind_blocks = str(_penny_chat_details_blocks(penny_chat, mode=pennychat_constants.REMIND))

    assert '*John Berryman* invited you to a new Penny Chat' in preview_blocks, 'wrong header_text'
    assert '*Title*\\nChat 1' in preview_blocks
    assert '*Description*\\nsome_description' in preview_blocks
    assert 'Count me in' not in preview_blocks, 'should not be there when include_rsvp is False'
    assert 'I can\'t make it' not in preview_blocks, 'should not be there when include_rsvp is False'
    assert 'calendar.google.com' in preview_blocks, 'should have calendar link when include_calendar_link is True'

    assert '*John Berryman* invited you to a new Penny Chat' in invite_blocks, 'wrong header_text'
    assert '*Title*\\nChat 1' in invite_blocks
    assert '*Description*\\nsome_description' in invite_blocks
    assert 'Count me in' in invite_blocks, 'should be there when include_rsvp is True'
    assert 'I can\'t make it' in invite_blocks, 'should be there when include_rsvp is True'
    assert 'calendar.google.com' in invite_blocks, 'should have calendar link when include_calendar_link is True'

    assert '*John Berryman* has updated their Penny Chat' in update_blocks, 'wrong header_text'
    assert '*Title*\\nChat 1' in update_blocks
    assert '*Description*\\nsome_description' in update_blocks
    assert 'Count me in' in update_blocks, 'should be there when include_rsvp is True'
    assert 'I can\'t make it' in update_blocks, 'should be there when include_rsvp is True'
    assert 'calendar.google.com' in update_blocks, 'should have calendar link when include_calendar_link is True'

    assert '*John Berryman\'s* Penny Chat is coming up soon! We hope you can still make it' in remind_blocks, \
        'wrong header_text'
    assert '*Title*\\nChat 1' in remind_blocks
    assert '*Description*\\nsome_description' in remind_blocks
    assert 'Count me in' not in remind_blocks, 'should not be there when include_rsvp is False'
    assert 'I can\'t make it' not in remind_blocks, 'should not be there when include_rsvp is False'
    assert 'calendar.google.com'not in remind_blocks, 'should not have calendar link when include_calendar_link is False'
