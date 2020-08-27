from datetime import datetime, timezone
import pytz
from unittest.mock import call

from freezegun import freeze_time
import pytest

from common.tests.fakes import UserFactory, PennyChatFactory, FollowUpFactory, SocialProfileFactory
from pennychat.models import Participant
from users.management.commands.notify_users_about_activity import Command, get_recent_followup_dataset, get_range, \
    notify_about_activity, grouped, UnorderedDataError

UTC = pytz.utc
NASHVILLE_TZ = pytz.timezone('America/Chicago')

range_start = datetime(2020, 1, 1, 0, 0, tzinfo=timezone.utc)
range_end = datetime(2020, 1, 8, 0, 0, tzinfo=timezone.utc)

within_range_date = datetime(2020, 1, 2, 0, 0, tzinfo=timezone.utc)
before_range_date = datetime(2019, 1, 2, 0, 0, tzinfo=timezone.utc)


def setup_followup_history():
    """
    There are 4 users 1,2,3,4 but 4 doesn't have a social profile

    There are 2 chats:
    * chat 1 has participants 1,2,3,4 and followups from 2 outside of time range and 3,4 within time range
    * chat 2 has participants 1,2 and followups from 2 inside of time range

    Therefore
    * user 1 will get notifications from 3,4 for chat 1   and    from 2 for chat 2
    * user 2 will get notifications from 3,4 for chat 1
    * user 3 will get notifications from 4 for chat 1  <-- note: users don't receive notifications for their own updates
    * user 4 would get notifications from 3 for chat 1 BUT has no social profile, so no way to contact them

    :return:
    """
    user1 = UserFactory()
    soc_prof1 = SocialProfileFactory(user=user1)
    user2 = UserFactory()
    soc_prof2 = SocialProfileFactory(user=user2)
    user3 = UserFactory()
    soc_prof3 = SocialProfileFactory(user=user3)
    user4 = UserFactory()
    # NOTE! soc_prof4 is intentionally omitted because sometimes a User doesn't have a SocialProfile

    penny_chat1 = PennyChatFactory()
    Participant.objects.create(penny_chat=penny_chat1, user=user1, role=Participant.ORGANIZER)
    Participant.objects.create(penny_chat=penny_chat1, user=user2, role=Participant.ATTENDEE)
    Participant.objects.create(penny_chat=penny_chat1, user=user3, role=Participant.ATTENDEE)
    Participant.objects.create(penny_chat=penny_chat1, user=user4, role=Participant.ATTENDEE)
    FollowUpFactory(penny_chat=penny_chat1, user=user2, date=before_range_date)
    FollowUpFactory(penny_chat=penny_chat1, user=user3, date=within_range_date)
    FollowUpFactory(penny_chat=penny_chat1, user=user4, date=within_range_date)

    penny_chat2 = PennyChatFactory()
    Participant.objects.create(penny_chat=penny_chat2, user=user2, role=Participant.ORGANIZER)
    Participant.objects.create(penny_chat=penny_chat2, user=user1, role=Participant.ATTENDEE)
    FollowUpFactory(penny_chat=penny_chat2, user=user2, date=within_range_date)

    return {
        'penny_chats': [penny_chat1, penny_chat2],
        'users': [user1, user2, user3, user4],
        'social_profiles': [soc_prof1, soc_prof2, soc_prof3]
    }


@pytest.mark.django_db
def test_get_recent_followup_dataset(mocker):
    objects = setup_followup_history()
    penny_chat1, penny_chat2 = objects['penny_chats']
    user1, user2, user3, user4 = objects['users']
    soc_prof1, soc_prof2, soc_prof3 = objects['social_profiles']

    recent_followup_dataset = list(get_recent_followup_dataset(
        range_start,
        range_end,
    ))
    for item in recent_followup_dataset:
        assert item['id'] != item['user_chats__penny_chat__follow_ups__user_id'], 'we should not send notifications to users who made the update'  # noqa
        assert item['social_profiles__slack_team_id'] and item['social_profiles__slack_id'], 'users w/o social profiles can\'t be contacted and should be filtered out'  # noqa

    # I've split up the fields for each item into 3 rows: user-relate, chat-related, followup-related
    expected = [
        {
            'id': user1.id, 'first_name': user1.first_name, 'social_profiles__slack_team_id': soc_prof1.slack_team_id, 'social_profiles__slack_id': soc_prof1.slack_id,  # noqa
            'user_chats__penny_chat__id': penny_chat1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title,  # noqa
            'user_chats__penny_chat__follow_ups__user_id': user3.id, 'user_chats__penny_chat__follow_ups__user__first_name': user3.first_name,  # noqa
        }, {
            'id': user1.id, 'first_name': user1.first_name, 'social_profiles__slack_team_id': soc_prof1.slack_team_id, 'social_profiles__slack_id': soc_prof1.slack_id,  # noqa
            'user_chats__penny_chat__id': penny_chat1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title,  # noqa
            'user_chats__penny_chat__follow_ups__user_id': user4.id, 'user_chats__penny_chat__follow_ups__user__first_name': user4.first_name,  # noqa
        }, {
            'id': user1.id, 'first_name': user1.first_name, 'social_profiles__slack_team_id': soc_prof1.slack_team_id, 'social_profiles__slack_id': soc_prof1.slack_id,  # noqa
            'user_chats__penny_chat__id': penny_chat2.id, 'user_chats__penny_chat__date': penny_chat2.date, 'user_chats__penny_chat__title': penny_chat2.title,  # noqa
            'user_chats__penny_chat__follow_ups__user_id': user2.id, 'user_chats__penny_chat__follow_ups__user__first_name': user2.first_name,  # noqa
        }, {
            'id': user2.id, 'first_name': user2.first_name, 'social_profiles__slack_team_id': soc_prof2.slack_team_id, 'social_profiles__slack_id': soc_prof2.slack_id,  # noqa
            'user_chats__penny_chat__id': penny_chat1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title,  # noqa
            'user_chats__penny_chat__follow_ups__user_id': user3.id, 'user_chats__penny_chat__follow_ups__user__first_name': user3.first_name,  # noqa
        }, {
            'id': user2.id, 'first_name': user2.first_name, 'social_profiles__slack_team_id': soc_prof2.slack_team_id, 'social_profiles__slack_id': soc_prof2.slack_id,  # noqa
            'user_chats__penny_chat__id': penny_chat1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title,  # noqa
            'user_chats__penny_chat__follow_ups__user_id': user4.id, 'user_chats__penny_chat__follow_ups__user__first_name': user4.first_name,  # noqa
        }, {
            'id': user3.id, 'first_name': user3.first_name, 'social_profiles__slack_team_id': soc_prof3.slack_team_id, 'social_profiles__slack_id': soc_prof3.slack_id,  # noqa
            'user_chats__penny_chat__id': penny_chat1.id, 'user_chats__penny_chat__date': penny_chat1.date, 'user_chats__penny_chat__title': penny_chat1.title,  # noqa
            'user_chats__penny_chat__follow_ups__user_id': user4.id, 'user_chats__penny_chat__follow_ups__user__first_name': user4.first_name,  # noqa
        }
    ]
    assert recent_followup_dataset == expected


@pytest.mark.django_db
def test_get_recent_followup_dataset__filter_email(mocker):
    objects = setup_followup_history()
    penny_chat1, penny_chat2 = objects['penny_chats']
    user1, user2, user3, user4 = objects['users']
    soc_prof1, soc_prof2, soc_prof3 = objects['social_profiles']

    recent_followup_dataset = get_recent_followup_dataset(
        range_start,
        range_end,
        [user1.email, user2.email],
    )
    user_ids_being_notified = {item['id'] for item in recent_followup_dataset}
    assert user1.id in user_ids_being_notified
    assert user2.id in user_ids_being_notified
    assert user3.id not in user_ids_being_notified
    assert user4.id not in user_ids_being_notified  # this should be filtered out anyway b/c of no social id


@pytest.mark.django_db
def test_handle(mocker):
    objects = setup_followup_history()
    penny_chat1, penny_chat2 = objects['penny_chats']
    user1, user2, user3, user4 = objects['users']
    soc_prof1, soc_prof2, soc_prof3 = objects['social_profiles']

    command = Command()
    mock_get_recent_followup_dataset = mocker.patch('users.management.commands.notify_users_about_activity.get_recent_followup_dataset')  # noqa
    mock_get_recent_followup_dataset.side_effect = get_recent_followup_dataset
    notify_about_activity = mocker.patch('users.management.commands.notify_users_about_activity.notify_about_activity')
    live_run = False
    options = {
        'live_run': live_run,
        'range_start': range_start.isoformat(),
        'range_end': range_end.isoformat(),
        'yesterday': False,
        'filter_emails': f'{user1.email},{user2.email}',
    }
    # NOTE: if anything breaks in get_recent_followup_dataset then fix it in test_get_recent_followup_dataset
    command.handle(**options)
    assert mock_get_recent_followup_dataset.call_args == call(
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
                        {'user_id': user3.id, 'first_name': user3.first_name},
                        {'user_id': user4.id, 'first_name': user4.first_name},
                    ]
                }, {
                    'id': penny_chat2.id, 'title': penny_chat2.title, 'date': penny_chat2.date,
                    'followups': [
                        {'user_id': user2.id, 'first_name': user2.first_name},
                    ]
                },
            ]},
            live_run,
        ),
        call({
            'user_id': user2.id, 'first_name': user2.first_name, 'slack_team_id': soc_prof2.slack_team_id,
            'slack_id': soc_prof2.slack_id,  # noqa
            'penny_chats': [
                {
                    'id': penny_chat1.id, 'title': penny_chat1.title, 'date': penny_chat1.date,
                    'followups': [
                        {'user_id': user3.id, 'first_name': user3.first_name},
                        {'user_id': user4.id, 'first_name': user4.first_name},
                    ]
                },
            ]},
            live_run,
        ),
        # NOTE user3 id filtered out from the email filter and user4 is filtered out because they don't have a social
        # profile
    ]
    assert actual == expected


@freeze_time("2012-01-14 10:02:03", tz_offset=0)
def test_get_range(mocker):
    range_start, range_end = get_range({'yesterday': True})
    assert range_start == NASHVILLE_TZ.localize(datetime(2012, 1, 13, 0, 0))
    assert range_end == NASHVILLE_TZ.localize(datetime(2012, 1, 14, 0, 0))


def test_notify_about_activity(mocker):
    some_date = NASHVILLE_TZ.localize(datetime(2012, 1, 13, 0, 0))
    mock_get_slack_client = mocker.patch('users.management.commands.notify_users_about_activity.get_slack_client')
    mock_slack_client = mocker.Mock()
    mock_get_slack_client.return_value = mock_slack_client

    args = {
        'user_id': 1, 'first_name': 'Steve', 'slack_team_id': 'T234567', 'slack_id': 'U98765432',
        'penny_chats': [
            {
                'id': 2, 'title': 'something', 'date': some_date,
                'followups': [
                    {'user_id': 1, 'first_name': 'Steve'},  # shouldn't notify of this one b/c it's them
                    {'user_id': 2, 'first_name': 'Margret'},
                    {'user_id': 3, 'first_name': 'Jimi'},
                ]
            },
            {
                'id': 3, 'title': 'whatever', 'date': some_date,
                'followups': [
                    # shouldn't notify of this entire chat because they only have their own followup
                    {'user_id': 1, 'first_name': 'Steve'},
                ]
            }
        ],
    }
    live_run = False
    notify_about_activity(args, live_run)
    assert mock_slack_client.chat_postMessage.called is False, 'safety live_run value not honored!!'

    live_run = True
    notify_about_activity(args, live_run)
    actual = mock_slack_client.chat_postMessage.call_args
    assert actual[1]['channel'] == 'U98765432'
    blocks = str(actual[1]['blocks'])

    assert 'something' in blocks, 'we should notify user of chat that has follow-ups by others'

    # NOTE that the pattern `Steve>` is used when linking out to the users
    assert 'Steve>' not in blocks, 'we should not notify a user of their own followup'
    assert 'Margret>' in blocks, 'we should notify user that Margret followed up'
    assert 'Jimi>' in blocks, 'we should notify user that Margret followed up'

    assert 'whatever' not in blocks, 'we should NOT notify user of chat that have only their follow-ups'


class TestGrouped:
    def test_basic_grouping(self):
        items = [
            {'a': 1, 'b': 10, 'c': 100},
            {'a': 1, 'b': 10, 'c': 200},
            {'a': 1, 'b': 20, 'c': 300},
            {'a': 1, 'b': 20, 'c': 400},
            {'a': 2, 'b': 30, 'c': 500},
        ]

        assert list(grouped(items, ['a', 'b'])) == [
            {'a': 1, 'b': 10, 'items': [{'c': 100}, {'c': 200}]},
            {'a': 1, 'b': 20, 'items': [{'c': 300}, {'c': 400}]},
            {'a': 2, 'b': 30, 'items': [{'c': 500}]},
        ]

        assert list(grouped(items, ['a'])) == [
            {'a': 1, 'items': [{'b': 10, 'c': 100}, {'b': 10, 'c': 200}, {'b': 20, 'c': 300}, {'b': 20, 'c': 400}]},
            {'a': 2, 'items': [{'b': 30, 'c': 500}]},
        ]

    def test_order_error(self):
        # insert item that is ordered incorrectly
        items = [
            {'a': 2, 'b': 10, 'c': 100},
            {'a': 2, 'b': 10, 'c': 200},
            {'a': 1, 'b': 10, 'c': 200},
        ]
        with pytest.raises(UnorderedDataError):
            list(grouped(items, ['a', 'b']))

    def test_lazy_iteration(self):
        class DumbIterator:
            i = 0

            def __iter__(self):
                return self

            def __next__(self):
                self.i += 1
                return {'a': 1, 'b': self.i}

        iterator = DumbIterator()
        gen = grouped(iterator, ['a', 'b'])
        assert iterator.i == 0
        next(gen)  # must call 2 in order to make sure that it has the whole set
        assert iterator.i == 2
        next(gen)
        assert iterator.i == 3
