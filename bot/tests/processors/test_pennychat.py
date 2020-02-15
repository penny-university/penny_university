import pytest
from datetime import datetime

from pytz import timezone, utc

from bot.processors.pennychat import PennyChatBotModule
import bot.processors.pennychat as penny_chat_constants
from pennychat.models import (
    PennyChatInvitation,
    Participant,
    PennyChat,
)
from users.models import UserProfile

TZ = timezone('America/Chicago')


def create_penny_chat():
    date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=utc)
    chat = PennyChatInvitation.objects.create(
        status=PennyChatInvitation.DRAFT,
        user_tz='America/Chicago',
        template_channel='channel',
        date=date,
        view='view',
    )
    return chat.id


@pytest.mark.django_db
def test_date_select(mocker):
    slack_client = mocker.Mock()
    bot_module = PennyChatBotModule(slack_client)

    chat_id = create_penny_chat()

    event = {
        'type': 'block_actions',
        'trigger_id': 'trigger',
        'view': {
            'id': 'view'
        },
        'actions': [
            {
                'action_id': penny_chat_constants.PENNY_CHAT_DATE,
                'selected_date': '2019-01-01'
            }
        ],
        'user': {
            'id': 'user'
        }
    }

    bot_module(event)

    penny_chat = PennyChatInvitation.objects.get(id=chat_id)
    assert penny_chat.date.astimezone(TZ).date() == datetime(2019, 1, 1).date()


@pytest.mark.django_db
def test_time_select(mocker):
    slack_client = mocker.Mock()
    bot_module = PennyChatBotModule(slack_client)

    chat_id = create_penny_chat()

    event = {
        'type': 'block_actions',
        'trigger_id': 'trigger',
        'view': {
            'id': 'view'
        },
        'actions': [
            {
                'action_id': penny_chat_constants.PENNY_CHAT_TIME,
                'selected_option': {
                    'value': '12:00 PM'
                }
            }
        ],
        'user': {
            'id': 'user'
        }
    }

    bot_module(event)
    penny_chat = PennyChatInvitation.objects.get(id=chat_id)
    test_time = datetime.now().replace(hour=12, minute=0, second=0, microsecond=0).time()
    assert penny_chat.date.astimezone(TZ).time() == test_time


@pytest.mark.django_db
def test_PennyChatBotModule_share(mocker):
    organizer = UserProfile.objects.create(slack_id='organizer')
    user_invitee_1 = UserProfile.objects.create(slack_id='invitee')
    # make sure that things don't break if for some reason a user attempts to invite themselves
    user_invitee_2 = organizer

    penny_chat_invitation = PennyChatInvitation.objects.create(
        invitees=','.join([user_invitee_1.slack_id, user_invitee_2.slack_id]),
        user=organizer.slack_id,
        date=timezone("America/Los_Angeles").localize(datetime(1979, 10, 12)),
        title='fake title',
        description='fake description',
    )

    event = {
        'user': {
            'id': organizer.slack_id
        },
        'trigger_id': 'hi there',
        'actions': [{'action_id': penny_chat_constants.PENNY_CHAT_SHARE}],
        'response_url': 'http://some_website.com',
    }

    def ids_mock(user_ids, slack_client):
        lookup = {
            organizer.slack_id: organizer,
            user_invitee_1.slack_id: user_invitee_1,
        }
        return {user_id: lookup[user_id] for user_id in user_ids}

    def id_mock(user_id, slack_client):
        return ids_mock([user_id], slack_client).get(user_id)

    with mocker.patch('bot.processors.pennychat.get_or_create_user_profile_from_slack_ids', side_effect=ids_mock), \
            mocker.patch('bot.processors.pennychat.get_or_create_user_profile_from_slack_id', side_effect=id_mock), \
            mocker.patch('bot.processors.pennychat.requests'):

        # The Actual Test
        PennyChatBotModule(mocker.Mock()).share(event)

    penny_chat_invitation.refresh_from_db()
    penny_chat = penny_chat_invitation.penny_chat
    assert penny_chat is not None
    assert penny_chat.title == 'fake title'
    assert penny_chat.description == 'fake description'
    assert penny_chat.date == penny_chat_invitation.date
    assert penny_chat.status == PennyChat.SHARED

    organizer_participant = Participant.objects.get(
        penny_chat=penny_chat,
        user=organizer,
    )
    assert organizer_participant.role == Participant.ORGANIZER

    invitee_participant = Participant.objects.get(
        penny_chat=penny_chat,
        user=user_invitee_1,
    )
    assert invitee_participant.role == Participant.INVITEE
    assert penny_chat_invitation.status == PennyChatInvitation.SHARED
