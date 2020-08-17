from datetime import datetime, timezone
import pytz
from unittest.mock import call

import pytest

from users.management.commands.notify_users_about_activity import Command, get_recent_followup_queryset

UTC = pytz.utc

###
from factory.django import DjangoModelFactory
from factory import Faker, LazyAttribute

from users.models import User
from pennychat.models import FollowUp

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = LazyAttribute(lambda u: u.email )
    email = Faker('email')
    password = 'password'
    first_name = Faker('first_name')
    last_name = Faker('last_name')


from pennychat.models import PennyChat

class PennyChatFactory(DjangoModelFactory):
    class Meta:
        model = PennyChat

    title = Faker('sentence')
    description = Faker('text')
    date = Faker('date_time_between', start_date='-3y', end_date='+3M')


class EndedPennyChatFactory(PennyChatFactory):
    date = Faker('date_time_between', start_date='-3y', end_date='-1d')
    status = PennyChat.COMPLETED


class FollowUpFactory(DjangoModelFactory):
    class Meta:
        model = FollowUp

    content = Faker('text')
    date = Faker('date_time_between', start_date='-3y', end_date='+3M')
    # penny_chat and user must also be specified

###


def test_handle(mocker):
    command = Command()
    get_recent_followup_queryset = mocker.patch('users.management.commands.notify_users_about_activity.get_recent_followup_queryset')  # noqa
    get_recent_followup_queryset.return_value = [
        {'id': 13, 'first_name': 'Beck', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41CPJTAM', 'user_chats__penny_chat__id': 3, 'user_chats__penny_chat__date': datetime(2017, 1, 16, 18, 52, 57, tzinfo=UTC), 'user_chats__penny_chat__title': 'code reading efficiency', 'user_chats__penny_chat__follow_ups__user_id': 1, 'user_chats__penny_chat__follow_ups__user__first_name': 'Bill'},  # noqa
        {'id': 13, 'first_name': 'Beck', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41CPJTAM', 'user_chats__penny_chat__id': 3, 'user_chats__penny_chat__date': datetime(2017, 1, 16, 18, 52, 57, tzinfo=UTC), 'user_chats__penny_chat__title': 'code reading efficiency', 'user_chats__penny_chat__follow_ups__user_id': 9, 'user_chats__penny_chat__follow_ups__user__first_name': 'Ryan'},  # noqa
        {'id': 13, 'first_name': 'Beck', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41CPJTAM', 'user_chats__penny_chat__id': 7, 'user_chats__penny_chat__date': datetime(2017, 1, 25, 16, 41, 16, tzinfo=UTC), 'user_chats__penny_chat__title': "Hey all, what's good", 'user_chats__penny_chat__follow_ups__user_id': 9, 'user_chats__penny_chat__follow_ups__user__first_name': 'Ryan'},  # noqa
        {'id': 13, 'first_name': 'Beck', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41CPJTAM', 'user_chats__penny_chat__id': 7, 'user_chats__penny_chat__date': datetime(2017, 1, 25, 16, 41, 16, tzinfo=UTC), 'user_chats__penny_chat__title': "Hey all, what's good", 'user_chats__penny_chat__follow_ups__user_id': 13, 'user_chats__penny_chat__follow_ups__user__first_name': 'Beck'},  # noqa
        {'id': 17, 'first_name': 'scott', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41J1HUHZ', 'user_chats__penny_chat__id': 12, 'user_chats__penny_chat__date': datetime(2017, 1, 28, 22, 28, 7, tzinfo=UTC), 'user_chats__penny_chat__title': 'Tests in Django', 'user_chats__penny_chat__follow_ups__user_id': 17, 'user_chats__penny_chat__follow_ups__user__first_name': 'scott'},  # noqa
        {'id': 17, 'first_name': 'scott', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41J1HUHZ', 'user_chats__penny_chat__id': 12, 'user_chats__penny_chat__date': datetime(2017, 1, 28, 22, 28, 7, tzinfo=UTC), 'user_chats__penny_chat__title': 'Tests in Django', 'user_chats__penny_chat__follow_ups__user_id': 26, 'user_chats__penny_chat__follow_ups__user__first_name': 'Anthony'},  # noqa
        {'id': 17, 'first_name': 'scott', 'social_profiles__slack_team_id': 'T41DZFW4T', 'social_profiles__slack_id': 'U41J1HUHZ', 'user_chats__penny_chat__id': 12, 'user_chats__penny_chat__date': datetime(2017, 1, 28, 22, 28, 7, tzinfo=UTC), 'user_chats__penny_chat__title': 'Tests in Django', 'user_chats__penny_chat__follow_ups__user_id': 29, 'user_chats__penny_chat__follow_ups__user__first_name': 'Max'},  # noqa
    ]
    notify_about_activity = mocker.patch('users.management.commands.notify_users_about_activity.notify_about_activity')
    live_run = False
    options = {
        'live_run': live_run,
        'range_start': '2002-01-14T00:00:00Z',
        'range_end': '2020-08-14T00:00:00Z',
        'yesterday': False,
        'filter_emails': 'jfberryman@gmail.com,nick.chouard@gmail.com',
    }
    command.handle(**options)
    assert get_recent_followup_queryset.call_args == call(
        datetime(2002, 1, 14, 0, 0, tzinfo=timezone.utc),
        datetime(2020, 8, 14, 0, 0, tzinfo=timezone.utc),
        ['jfberryman@gmail.com', 'nick.chouard@gmail.com'],
    )
    assert notify_about_activity.call_args_list == [
        call({
            'user_id': 13, 'first_name': 'Beck', 'slack_team_id': 'T41DZFW4T', 'slack_id': 'U41CPJTAM',
            'penny_chats': [
                {
                    'id': 3, 'title': 'code reading efficiency', 'date': datetime(2017, 1, 16, 18, 52, 57, tzinfo=UTC),
                    'followups': [
                        {'user_id': 1, 'first_name': 'Bill'},
                        {'user_id': 9, 'first_name': 'Ryan'},
                    ]
                },
                {
                    'id': 7, 'title': "Hey all, what's good", 'date': datetime(2017, 1, 25, 16, 41, 16, tzinfo=UTC),
                    'followups': [
                        {'user_id': 9, 'first_name': 'Ryan'},
                    ]
                }
            ]},
            live_run,
        ),
        call({
            'user_id': 17, 'first_name': 'scott', 'slack_team_id': 'T41DZFW4T', 'slack_id': 'U41J1HUHZ',
            'penny_chats': [
                {
                    'id': 12, 'title': 'Tests in Django', 'date': datetime(2017, 1, 28, 22, 28, 7, tzinfo=UTC),
                    'followups': [
                        {'user_id': 26, 'first_name': 'Anthony'},
                        {'user_id': 29, 'first_name': 'Max'},
                    ]
                },
            ]},
            live_run,
        ),
    ]


# START HERE TODO!
@pytest.mark.django_db
def test_get_recent_followup_queryset(mocker):
    range_start = datetime(2020, 1, 1, 0, 0, tzinfo=timezone.utc)
    range_end = datetime(2002, 1, 8, 0, 0, tzinfo=timezone.utc)

    user1 = UserFactory()
    user2 = UserFactory()
    # user3 = UserFactory()
    # penny_chat1 = PennyChatFactory()


    get_recent_followup_queryset(range_start, range_end, [user1.email, user2.email])
