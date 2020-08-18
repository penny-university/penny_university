from datetime import datetime, timezone
import pytz
from unittest.mock import call

import pytest

from common.tests.fakes import UserFactory, PennyChatFactory, FollowUpFactory, SocialProfileFactory
from pennychat.models import Participant
from users.management.commands.notify_users_about_activity import Command, get_recent_followup_queryset

UTC = pytz.utc

range_start = datetime(2020, 1, 1, 0, 0, tzinfo=timezone.utc)
range_end = datetime(2020, 1, 8, 0, 0, tzinfo=timezone.utc)

within_range_date = datetime(2020, 1, 2, 0, 0, tzinfo=timezone.utc)
before_range_date = datetime(2019, 1, 2, 0, 0, tzinfo=timezone.utc)


def setup_followup_history():
    user1 = UserFactory()
    soc_prof1 = SocialProfileFactory(user=user1)
    user2 = UserFactory()
    soc_prof2 = SocialProfileFactory(user=user2)
    user3 = UserFactory()
    soc_prof3 = SocialProfileFactory(user=user3)
    user4 = UserFactory()
    soc_prof4 = SocialProfileFactory(user=user4)

    penny_chat1 = PennyChatFactory()
    Participant.objects.create(penny_chat=penny_chat1, user=user1, role=Participant.ORGANIZER)
    Participant.objects.create(penny_chat=penny_chat1, user=user2, role=Participant.ATTENDEE)
    Participant.objects.create(penny_chat=penny_chat1, user=user3, role=Participant.ATTENDEE)
    FollowUpFactory(penny_chat=penny_chat1, user=user1, date=before_range_date)
    FollowUpFactory(penny_chat=penny_chat1, user=user2, date=within_range_date)
    FollowUpFactory(penny_chat=penny_chat1, user=user2, date=within_range_date)

    penny_chat2 = PennyChatFactory()
    Participant.objects.create(penny_chat=penny_chat2, user=user2, role=Participant.ORGANIZER)
    Participant.objects.create(penny_chat=penny_chat2, user=user3, role=Participant.ATTENDEE)
    Participant.objects.create(penny_chat=penny_chat2, user=user4, role=Participant.ATTENDEE)
    FollowUpFactory(penny_chat=penny_chat2, user=user2, date=within_range_date)
    FollowUpFactory(penny_chat=penny_chat2, user=user3, date=within_range_date)
    FollowUpFactory(penny_chat=penny_chat2, user=user4, date=within_range_date)

    return {
        'penny_chats': [penny_chat1, penny_chat2],
        'users': [user1, user2, user3, user4],
        'social_profiles': [soc_prof1, soc_prof2, soc_prof3, soc_prof4]
    }


@pytest.mark.django_db
def test_get_recent_followup_queryset(mocker):
    objects = setup_followup_history()
    penny_chat1, penny_chat2 = objects['penny_chats']
    user1, user2, user3, user4 = objects['users']
    soc_prof1, soc_prof2, soc_prof3, soc_prof4 = objects['social_profiles']

    recent_followup_queryset = get_recent_followup_queryset(range_start, range_end, [user1.email, user2.email])
    actual = [item for item in recent_followup_queryset]
    expected = [
        {'id': 1, 'first_name': user1.first_name, 'social_profiles__slack_team_id': soc_prof1.slack_team_id, 'social_profiles__slack_id': soc_prof1.slack_id, 'user_chats__penny_chat__id': user1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title, 'user_chats__penny_chat__follow_ups__user_id': user2.id, 'user_chats__penny_chat__follow_ups__user__first_name': user2.first_name},  # noqa
        {'id': 2, 'first_name': user2.first_name, 'social_profiles__slack_team_id': soc_prof2.slack_team_id, 'social_profiles__slack_id': soc_prof2.slack_id, 'user_chats__penny_chat__id': user1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title, 'user_chats__penny_chat__follow_ups__user_id': user2.id, 'user_chats__penny_chat__follow_ups__user__first_name': user2.first_name},  # noqa
        {'id': 2, 'first_name': user2.first_name, 'social_profiles__slack_team_id': soc_prof2.slack_team_id, 'social_profiles__slack_id': soc_prof2.slack_id, 'user_chats__penny_chat__id': user2.id, 'user_chats__penny_chat__date': penny_chat2.date, 'user_chats__penny_chat__title': penny_chat2.title, 'user_chats__penny_chat__follow_ups__user_id': user2.id, 'user_chats__penny_chat__follow_ups__user__first_name': user2.first_name},  # noqa
        {'id': 2, 'first_name': user2.first_name, 'social_profiles__slack_team_id': soc_prof2.slack_team_id, 'social_profiles__slack_id': soc_prof2.slack_id, 'user_chats__penny_chat__id': user2.id, 'user_chats__penny_chat__date': penny_chat2.date, 'user_chats__penny_chat__title': penny_chat2.title, 'user_chats__penny_chat__follow_ups__user_id': user3.id, 'user_chats__penny_chat__follow_ups__user__first_name': user3.first_name},  # noqa
        {'id': 2, 'first_name': user2.first_name, 'social_profiles__slack_team_id': soc_prof2.slack_team_id, 'social_profiles__slack_id': soc_prof2.slack_id, 'user_chats__penny_chat__id': user2.id, 'user_chats__penny_chat__date': penny_chat2.date, 'user_chats__penny_chat__title': penny_chat2.title, 'user_chats__penny_chat__follow_ups__user_id': user4.id, 'user_chats__penny_chat__follow_ups__user__first_name': user4.first_name},  # noqa
    ]
    assert actual == expected


@pytest.mark.django_db
def test_handle(mocker):
    objects = setup_followup_history()
    penny_chat1, penny_chat2 = objects['penny_chats']
    user1, user2, user3, user4 = objects['users']
    soc_prof1, soc_prof2, soc_prof3, soc_prof4 = objects['social_profiles']

    command = Command()
    mock_get_recent_followup_queryset = mocker.patch('users.management.commands.notify_users_about_activity.get_recent_followup_queryset')  # noqa
    mock_get_recent_followup_queryset.side_effect = get_recent_followup_queryset
    notify_about_activity = mocker.patch('users.management.commands.notify_users_about_activity.notify_about_activity')
    live_run = False
    options = {
        'live_run': live_run,
        'range_start': range_start.isoformat(),
        'range_end': range_end.isoformat(),
        'yesterday': False,
        'filter_emails': f'{user1.email},{user2.email}',
    }
    # NOTE: if anything breaks in get_recent_followup_queryset then fix it in test_get_recent_followup_queryset
    command.handle(**options)
    assert mock_get_recent_followup_queryset.call_args == call(
        range_start,
        range_end,
        [user1.email, user2.email],
    )
    actual = notify_about_activity.call_args_list
    expected = [
        call({
            'user_id': user1.id, 'first_name': user1.first_name, 'slack_team_id': soc_prof1.slack_team_id, 'slack_id': soc_prof1.slack_id,  # noqa
            'penny_chats': [
                {
                    'id': penny_chat1.id, 'title': penny_chat1.title, 'date': penny_chat1.date,
                    'followups': [
                        {'user_id': user2.id, 'first_name': user2.first_name},
                    ]
                }
            ]},
            live_run,
        ),
        call({
            'user_id': user2.id, 'first_name': user2.first_name, 'slack_team_id': soc_prof2.slack_team_id, 'slack_id': soc_prof2.slack_id,  # noqa
            'penny_chats': [
                {
                    'id': penny_chat2.id, 'title': penny_chat2.title, 'date': penny_chat2.date,
                    'followups': [
                        {'user_id': user3.id, 'first_name': user3.first_name},
                        {'user_id': user4.id, 'first_name': user4.first_name},
                    ]
                },
            ]},
            live_run,
        ),
    ]
    assert actual == expected
