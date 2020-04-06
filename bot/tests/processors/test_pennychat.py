from datetime import datetime
import json
import time

import pytest
from pytz import timezone, utc

from bot.processors.pennychat import PennyChatBotModule
import bot.processors.pennychat as penny_chat_constants
from pennychat.models import (
    PennyChatInvitation,
    Participant,
    PennyChat,
)
from unittest.mock import call
from users.models import UserProfile

TIMEZONE = timezone('America/Chicago')


def create_penny_chat():
    date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=utc)
    chat = PennyChatInvitation.objects.create(
        status=PennyChatInvitation.DRAFT,
        organizer_tz='America/Chicago',
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
    assert penny_chat.date.astimezone(TIMEZONE).date() == datetime(2019, 1, 1).date()


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
    assert penny_chat.date.astimezone(TIMEZONE).time() == test_time


@pytest.mark.django_db
def test_PennyChatBotModule_share(mocker):
    organizer = UserProfile.objects.create(slack_id='organizer')
    user_invitee_1 = UserProfile.objects.create(slack_id='invitee')
    # make sure that things don't break if for some reason a user attempts to invite themselves
    user_invitee_2 = organizer

    view_id = 'some_silly_view_id'
    penny_chat_invitation = PennyChatInvitation.objects.create(
        invitees=','.join([user_invitee_1.slack_id, user_invitee_2.slack_id]),
        organizer_slack_id=organizer.slack_id,
        date=timezone("America/Los_Angeles").localize(datetime(1979, 10, 12)),
        title='fake title',
        view=view_id,
        description='fake description',
    )

    def id_mock(user_id, slack_client=None, ignore_user_not_found=True):
        lookup = {
            organizer.slack_id: organizer,
            user_invitee_1.slack_id: user_invitee_1,
        }
        return lookup[user_id]

    event = {
        'user': {
            'id': organizer.slack_id
        },
        'view': {
            'id': view_id,
            'state': {
                'values': {
                    'penny_chat_title': {
                        'penny_chat_title': {
                            'value': 'new_title',
                        }
                    },
                    'penny_chat_description': {
                        'penny_chat_description': {
                            'value': 'new_description',
                        }
                    }
                }
            },
        },
        'actions': [{'action_id': penny_chat_constants.PENNY_CHAT_SHARE}],
        'response_url': 'http://some_website.com',
        'type': penny_chat_constants.VIEW_SUBMISSION,
        'callback_id': penny_chat_constants.PENNY_CHAT_DETAILS,
    }

    share_penny_chat_invitation = mocker.patch('bot.processors.pennychat.share_penny_chat_invitation')
    post_organizer_edit_after_share_blocks = mocker.patch(
        'bot.processors.pennychat.post_organizer_edit_after_share_blocks'
    )

    # The Actual Test
    with mocker.patch('pennychat.models.get_or_create_user_profile_from_slack_id', side_effect=id_mock), \
            post_organizer_edit_after_share_blocks:
        PennyChatBotModule(mocker.Mock()).submit_details_and_share(event)

    assert share_penny_chat_invitation.call_args == call(penny_chat_invitation.id)
    assert post_organizer_edit_after_share_blocks.now.call_args == call(view_id)

    penny_chat_invitation.refresh_from_db()
    penny_chat = penny_chat_invitation.penny_chat
    assert penny_chat is not None
    assert penny_chat.title == 'new_title'
    assert penny_chat.description == 'new_description'
    assert penny_chat.date == penny_chat_invitation.date
    assert penny_chat.status == PennyChat.SHARED
    assert penny_chat_invitation.get_organizer() == organizer
    assert penny_chat_invitation.status == PennyChatInvitation.SHARED


testdata = [
    dict(
        # it doesn't make sense for the organizer to say that he can attend his own event
        msg="if organizer can attend then his role stays organizer and he isn't notified",
        starting_role=Participant.ORGANIZER,
        can_attend=True,
        expected_final_role=Participant.ORGANIZER,
        expected_organizer_notified=False,
    ),
    dict(
        # it doesn't make sense for the organizer to say that he can not attend his own event
        # TODO stat this and if we get a reasonably high occurrence rate, then provide UX to help find another organizer
        msg="if organizer can not attend then his role stays organizer and he isn't notified",
        starting_role=Participant.ORGANIZER,
        can_attend=False,
        expected_final_role=Participant.ORGANIZER,
        expected_organizer_notified=False,
    ),
    dict(
        msg="if an attendee can't attend, then their participation is removed and the organizer is notified",
        starting_role=Participant.ATTENDEE,
        can_attend=False,
        expected_final_role=None,
        expected_organizer_notified=True,
    ),
    dict(
        msg=(
            "if an attendee choose can_attend again, then the participation is "
            "not changed and the organizer is not notified"
        ),
        starting_role=Participant.ATTENDEE,
        can_attend=True,  # they've already said they'll be there and they say it again
        expected_final_role=Participant.ATTENDEE,
        expected_organizer_notified=False,
    ),
    dict(
        msg="if non-participant can attend then attendance participation is created and notification is delivered",
        starting_role=None,
        can_attend=True,
        expected_final_role=Participant.ATTENDEE,
        expected_organizer_notified=True,
    ),
    dict(
        msg="if non-participant can not attend then no participation is created and no notification is delivered",
        starting_role=None,
        can_attend=False,
        expected_final_role=None,
        expected_organizer_notified=False,
    ),
]


@pytest.mark.django_db
@pytest.mark.parametrize(",".join(testdata[0].keys()), [td.values() for td in testdata])
def test_PennyChatBotModule_attendance_selection(
        msg,  # pytest prints this out when the test errors  # noqa
        starting_role,
        can_attend,
        expected_final_role,
        expected_organizer_notified,
        mocker,
    ):
    organizer = UserProfile.objects.create(slack_id='organizer_id')

    if starting_role == Participant.ORGANIZER:
        user = organizer
    else:
        user = UserProfile.objects.create(slack_id=str(time.time_ns()))

    some_other_attendee = UserProfile.objects.create(slack_id=str(time.time_ns()))

    fake_title = 'Fake Title'
    fake_year = 2054
    fake_channel = 'fake_chan'
    penny_chat = PennyChat.objects.create(
        date=timezone("America/Los_Angeles").localize(datetime(fake_year, 10, 12)),
        title=fake_title,
    )
    penny_chat_id_dict = json.dumps({penny_chat_constants.PENNY_CHAT_ID: penny_chat.id})

    Participant.objects.create(penny_chat=penny_chat, user=organizer, role=Participant.ORGANIZER)
    Participant.objects.create(penny_chat=penny_chat, user=some_other_attendee, role=Participant.ATTENDEE)
    if starting_role not in [None, Participant.ORGANIZER]:
        Participant.objects.create(penny_chat=penny_chat, user=user, role=starting_role)

    def user_attendance_event(user, can_attend):
        if can_attend:
            attendance = penny_chat_constants.PENNY_CHAT_CAN_ATTEND
        else:
            attendance = penny_chat_constants.PENNY_CHAT_CAN_NOT_ATTEND
        return {
            'user': {
                'id': user.slack_id
            },
            'channel': {'id': fake_channel},
            'trigger_id': '(used for @is_block_interaction_event decorator)',
            'actions': [{'action_id': attendance, 'value': penny_chat_id_dict}],
        }

    event = user_attendance_event(user, can_attend)

    slack_client = mocker.Mock()

    # The Actual Tests
    with mocker.patch('bot.processors.pennychat.get_or_create_user_profile_from_slack_id', return_value=user):
        PennyChatBotModule(slack_client).attendance_selection(event)

    # Evaluation
    actual_final_role = None
    try:
        actual_final_role = Participant.objects.get(penny_chat=penny_chat, user=user).role
    except Participant.DoesNotExist:
        # presumably we weren't supposed to make a participant. this will be tested below
        pass

    assert expected_final_role == actual_final_role, \
        f"expected and final roles do not match (roles: {Participant.ROLE_CHOICES})"

    if expected_organizer_notified:
        # organizer notification
        slack_client.chat_postMessage.assert_called_once()
        notification = slack_client.chat_postMessage.call_args[1]
        assert notification['channel'] == 'organizer_id', 'notified the wrong person'
        assert f'<@{user.slack_id}>' in notification['text'], 'forgot to list the (non)attendees name'
        assert fake_title in notification['text'], 'forgot to mention which penny chat'
        assert str(fake_year) in notification['text'], 'forgot to mention date'
        if can_attend:
            assert 'not' not in notification['text'].lower(), 'did we say they could NOT attend?'
        else:
            assert 'not' in notification['text'].lower(), 'did we say they COULD attend?'

        # RSVPer "thanks" notification
        slack_client.chat_postEphemeral.assert_called_once()
        thanks = slack_client.chat_postEphemeral.call_args[1]
        assert thanks['channel'] == fake_channel
        assert thanks['user'] == user.slack_id
        assert 'will notify' in thanks['text'].lower()
    else:
        slack_client.chat_postMessage.assert_not_called()

    # Make sure the other attendee wasn't affected
    assert Participant.objects.get(penny_chat=penny_chat, user=some_other_attendee).role == Participant.ATTENDEE
