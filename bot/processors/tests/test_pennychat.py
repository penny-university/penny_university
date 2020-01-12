import datetime

import pytest
import pytz

from bot.processors.pennychat import shared_message_preview_template
from pennychat.models import PennyChat, Participant
from users.models import UserProfile


@pytest.mark.django_db
def test_shared_message_preview_template(mocker):
    organizer = UserProfile.objects.create(slack_id='organizer')
    user_invitee_1 = UserProfile.objects.create(slack_id='invitee')
    # make sure that things don't break if for some reason a user attempts to invite themselves
    user_invitee_2 = organizer

    penny_chat = PennyChat.objects.create(
        invitees=','.join([user_invitee_1.slack_id, user_invitee_2.slack_id]),
        user=organizer.slack_id,
        date=pytz.timezone("America/Los_Angeles").localize(datetime.datetime(1979, 10, 12)),
    )

    def mock(user_ids, slack_client):
        lookup = {
            organizer.slack_id: organizer,
            user_invitee_1.slack_id: user_invitee_1,
        }
        return {user_id: lookup[user_id] for user_id in user_ids}

    with mocker.patch('bot.processors.pennychat.get_or_create_user_profile_from_slack_ids', side_effect=mock):
        # The Actual Test
        shared_message_preview_template(slack_client=None, penny_chat=penny_chat)

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
