from datetime import datetime
import json
import time

import pytest
from pytz import timezone, utc
from sentry_sdk import capture_exception
from common.tests.fakes import PennyChatSlackInvitationFactory, UserFactory, SocialProfileFactory

from bot.processors.pennychat import PennyChatBotModule
import bot.processors.pennychat as penny_chat_constants
from bot.tasks.pennychat import _penny_chat_details_blocks
from matchmaking.models import Match, TopicChannel
from pennychat.models import (
    PennyChatSlackInvitation,
    Participant,
    PennyChat,
)
from unittest.mock import call
from users.models import User, SocialProfile

TIMEZONE = timezone('America/Chicago')
SLACK_TEAM_ID = 'test_id'


def create_penny_chat():
    date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=utc)
    chat = PennyChatSlackInvitation.objects.create(
        status=PennyChatSlackInvitation.DRAFT,
        organizer_tz='America/Chicago',
        date=date,
        view='view',
        created_from_slack_team_id=SLACK_TEAM_ID
    )
    return chat.id


@pytest.mark.django_db
def test_visibility_select(mocker):
    slack_client = mocker.Mock()
    bot_module = PennyChatBotModule(slack_client)

    penny_chat = PennyChatSlackInvitationFactory()

    event = {
        'type': 'block_actions',
        'trigger_id': 'trigger',
        'view': {
            'id': 'view'
        },
        'actions': [
            {
                'action_id': penny_chat_constants.PENNY_CHAT_VISIBILITY,
                'selected_option': {
                    'value': str(PennyChat.PRIVATE)
                }
            }
        ],
        'user': {
            'id': 'user'
        }
    }

    bot_module(event)

    chat_id = PennyChatSlackInvitation.objects.get(id=penny_chat.id)
    assert chat_id.visibility == PennyChat.PRIVATE


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

    penny_chat = PennyChatSlackInvitation.objects.get(id=chat_id)
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
    penny_chat = PennyChatSlackInvitation.objects.get(id=chat_id)
    test_time = datetime.now().replace(hour=12, minute=0, second=0, microsecond=0).time()
    assert penny_chat.date.astimezone(TIMEZONE).time() == test_time


@pytest.mark.django_db
def test_PennyChatBotModule_share(mocker):
    user_1 = User.objects.create_user(username='user_1')
    user_2 = User.objects.create_user(username='user_2')
    organizer = SocialProfile.objects.create(slack_id='organizer', user=user_1)
    invitee_1 = SocialProfile.objects.create(slack_id='invitee', user=user_2)
    # make sure that things don't break if for some reason a user attempts to invite themselves
    invitee_2 = organizer

    view_id = 'some_silly_view_id'
    penny_chat_invitation = PennyChatSlackInvitation.objects.create(
        invitees=','.join([invitee_1.slack_id, invitee_2.slack_id]),
        organizer_slack_id=organizer.slack_id,
        date=timezone("America/Los_Angeles").localize(datetime(1979, 10, 12)),
        title='fake title',
        view=view_id,
        description='fake description',
        created_from_slack_team_id=SLACK_TEAM_ID,
    )

    def id_mock(user_id, slack_client=None, ignore_user_not_found=True):
        lookup = {
            organizer.slack_id: organizer,
            invitee_1.slack_id: invitee_1,
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
        'type': penny_chat_constants.VIEW_CLOSED,
        'callback_id': penny_chat_constants.PENNY_CHAT_DETAILS,
    }

    share_penny_chat_invitation = mocker.patch('bot.processors.pennychat.share_penny_chat_invitation')
    post_organizer_edit_after_share_blocks = mocker.patch(
        'bot.processors.pennychat.post_organizer_edit_after_share_blocks'
    )

    # The Actual Test (premature close)
    with mocker.patch('pennychat.models.get_or_create_social_profile_from_slack_id', side_effect=id_mock), post_organizer_edit_after_share_blocks:  # noqa
        PennyChatBotModule(mocker.Mock()).submit_details_and_share(event)

    assert share_penny_chat_invitation.call_count == 0

    # The Actual Test (actual submission)
    event['type'] = penny_chat_constants.VIEW_SUBMISSION
    with mocker.patch('pennychat.models.get_or_create_social_profile_from_slack_id', side_effect=id_mock), post_organizer_edit_after_share_blocks:  # noqa
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
    assert organizer.user in penny_chat_invitation.get_organizers()
    assert penny_chat_invitation.status == PennyChatSlackInvitation.SHARED


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
    user_1 = User.objects.create_user(username='user_1')
    user_2 = User.objects.create_user(username='user_2')
    user_3 = User.objects.create_user(username='user_3')

    organizer = SocialProfile.objects.create(slack_id='organizer_id', slack_team_id=SLACK_TEAM_ID, user=user_1)

    if starting_role == Participant.ORGANIZER:
        profile = organizer
    else:
        profile = SocialProfile.objects.create(slack_id=str(time.time_ns()), user=user_2)

    some_other_attendee = SocialProfile.objects.create(slack_id=str(time.time_ns()), user=user_3)

    fake_title = 'Fake Title'
    fake_year = 2054
    fake_channel = 'fake_chan'
    penny_chat = PennyChat.objects.create(
        date=timezone("America/Los_Angeles").localize(datetime(fake_year, 10, 12)),
        title=fake_title,
        created_from_slack_team_id=SLACK_TEAM_ID,
    )
    penny_chat_id_dict = json.dumps({penny_chat_constants.PENNY_CHAT_ID: penny_chat.id})

    Participant.objects.create(penny_chat=penny_chat, user=organizer.user, role=Participant.ORGANIZER)
    Participant.objects.create(penny_chat=penny_chat, user=some_other_attendee.user, role=Participant.ATTENDEE)
    if starting_role not in [None, Participant.ORGANIZER]:
        Participant.objects.create(penny_chat=penny_chat, user=profile.user, role=starting_role)

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

    event = user_attendance_event(profile, can_attend)

    slack_client = mocker.Mock()

    # The Actual Tests
    with mocker.patch('bot.processors.pennychat.get_or_create_social_profile_from_slack_id', return_value=profile):
        PennyChatBotModule(slack_client).attendance_selection(event)

    # Evaluation
    actual_final_role = None
    try:
        actual_final_role = Participant.objects.get(penny_chat=penny_chat, user=profile.user).role
    except Participant.DoesNotExist as e:
        capture_exception(e)
        # presumably we weren't supposed to make a participant. this will be tested below
        pass

    assert expected_final_role == actual_final_role, \
        f"expected and final roles do not match (roles: {Participant.ROLE_CHOICES})"

    if expected_organizer_notified:
        # organizer notification
        slack_client.chat_postMessage.assert_called_once()
        notification = slack_client.chat_postMessage.call_args[1]
        assert notification['channel'] == 'organizer_id', 'notified the wrong person'
        assert f'<@{profile.slack_id}>' in notification['text'], 'forgot to list the (non)attendees name'
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
        assert thanks['user'] == profile.slack_id
        assert 'will notify' in thanks['text'].lower()
    else:
        slack_client.chat_postMessage.assert_not_called()

    # Make sure the other attendee wasn't affected
    assert Participant.objects.get(penny_chat=penny_chat, user=some_other_attendee.user).role == Participant.ATTENDEE


@pytest.mark.django_db
def test_penny_chat_reminders_blocks(mocker):
    invite = PennyChatSlackInvitationFactory()
    organizer = UserFactory()
    organizer_profile = SocialProfileFactory()
    Participant.objects.create(user=organizer, penny_chat=invite, role=Participant.ORGANIZER)
    for i in range(12):
        user = UserFactory()
        Participant.objects.create(user=user, penny_chat=invite, role=Participant.ATTENDEE)

    with mocker.patch('bot.tasks.pennychat.get_or_create_social_profile_from_slack_id', return_value=organizer_profile):
        reminder_blocks = _penny_chat_details_blocks(invite, 'remind')

    # Check that the correct number of blocks were created
    assert len(reminder_blocks[4]['elements']) == 10
    assert reminder_blocks[4]['elements'][-1]['text'] == '& 4 more attending'


@pytest.mark.django_db
def test_schedule_match_penny_chat(mocker):
    profile_1 = SocialProfileFactory()
    profile_2 = SocialProfileFactory()
    topic = TopicChannel.objects.create(
        slack_team_id=profile_1.slack_team_id,
        channel_id='FAKE_CHANNEL',
        name='testing'
    )
    match = Match.objects.create(topic_channel=topic, conversation_id='FAKE_CONVERSATION')
    match.profiles.add(profile_1, profile_2)

    event = {
        'user': {
            'id': profile_1.slack_id,
            'team_id': profile_1.slack_team_id
        },
        'trigger_id': 'fake_trigger',
        'actions': [{'action_id': 'penny_chat_schedule_match', 'value': match.conversation_id}],
    }

    slack_client = mocker.Mock()
    response = mocker.Mock(data={'view': {'id': '12345'}})
    slack_client.configure_mock(**{'views_open.return_value': response})

    # The Actual Tests
    with mocker.patch('bot.processors.pennychat.get_or_create_social_profile_from_slack_id', return_value=profile_1):
        PennyChatBotModule(slack_client).schedule_match(event)

    match.refresh_from_db()
    penny_chat = match.penny_chat
    assert penny_chat is not None
    invite = PennyChatSlackInvitation.objects.get(penny_chat=penny_chat)
    assert invite.invitees == profile_2.slack_id
    assert invite.title == f'{profile_1.real_name} + {profile_2.real_name} Discuss {match.topic_channel.name}'
    assert invite.organizer_slack_id == profile_1.slack_id
