from copy import deepcopy

from django.db import IntegrityError
import pytest

from users.models import UserProfile
from users.utils import (
    update_user_profile_from_slack_user,
    update_user_profile_from_slack,
)


slack_user = {
    'id': 'U4102EFU1',
    'team_id': 'T41DZFW4T',
    'name': 'bill',
    'deleted': False,
    'color': '4bbe2e',
    'real_name': 'Bill Israel',
    'tz': 'America/Chicago',
    'tz_label': 'Central Standard Time',
    'tz_offset': -21600,
    'profile': {
        'title': '',
        'phone': '',
        'skype': '',
        'real_name': 'Bill Israel',
        'real_name_normalized': 'Bill Israel',
        'display_name': 'bill',
        'display_name_normalized': 'bill',
        'status_text': '',
        'status_emoji': '',
        'status_expiration': 0,
        'avatar_hash': 'g45132ebae0c',
        'email': 'billyboy@gmail.com',
        'first_name': 'Bill',
        'last_name': 'Israel',
        'image_24': 'https://secure.gravatar.com/avatar/8145132ebae0c1f62cdd7b6126d71768.jpg?s=24&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0013-24.png',  # noqa
        'image_32': 'https://secure.gravatar.com/avatar/8145132ebae0c1f62cdd7b6126d71768.jpg?s=32&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0013-32.png',  # noqa
        'image_48': 'https://secure.gravatar.com/avatar/8145132ebae0c1f62cdd7b6126d71768.jpg?s=48&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0013-48.png',  # noqa
        'image_72': 'https://secure.gravatar.com/avatar/8145132ebae0c1f62cdd7b6126d71768.jpg?s=72&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0013-72.png',  # noqa
        'image_192': 'https://secure.gravatar.com/avatar/8145132ebae0c1f62cdd7b6126d71768.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0013-192.png',  # noqa
        'image_512': 'https://secure.gravatar.com/avatar/8145132ebae0c1f62cdd7b6126d71768.jpg?s=512&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0013-512.png',  # noqa
        'status_text_canonical': '',
        'team': 'T41DZFW4T',
    },
    'is_admin': False,
    'is_owner': False,
    'is_primary_owner': False,
    'is_restricted': False,
    'is_ultra_restricted': False,
    'is_bot': False,
    'is_app_user': False,
    'updated': 1569058551,
}


@pytest.mark.django_db
def test_update_user_profile_from_slack_user__creates_new_user():
    update_user_profile_from_slack_user(slack_user)
    user = UserProfile.objects.get(slack_id=slack_user['id'])
    assert user.email == slack_user['profile']['email']
    assert user.slack_id == slack_user['id']
    assert user.slack_team_id == slack_user['team_id']
    assert user.display_name == slack_user['profile']['display_name']
    assert user.real_name == slack_user['profile']['real_name']


@pytest.mark.django_db
def test_update_user_profile_from_slack_user__safely_updates_existing_user():

    UserProfile.objects.create(
        email=slack_user['profile']['email'],
        slack_id=slack_user['id'],
        slack_team_id=slack_user['profile']['team'],
        display_name='original_display_name',
        metro_name='original_metro_name',
    )

    update_user_profile_from_slack_user(slack_user)
    user = UserProfile.objects.get(slack_id=slack_user['id'])
    assert user.display_name == slack_user['profile']['display_name'], 'the display name should be replaced'
    assert user.metro_name == 'original_metro_name', 'the metro name should not be replaced'


@pytest.mark.django_db
def test_update_user_profile_from_slack_user__updates_user_that_only_has_email():

    UserProfile.objects.create(
        email=slack_user['profile']['email'],
        slack_team_id=slack_user['profile']['team'],
        display_name='original_display_name',
        metro_name='original_metro_name',
    )

    update_user_profile_from_slack_user(slack_user)
    user = UserProfile.objects.get(slack_id=slack_user['id'])
    assert user.email == slack_user['profile']['email'], 'the email should be replaced'
    assert user.metro_name == 'original_metro_name', 'the metro name should not be replaced'


@pytest.mark.django_db
def test_update_user_profile_from_slack_user__does_not_update_same_email_in_other_teams():
    UserProfile.objects.create(
        email=slack_user['profile']['email'],
        slack_id=slack_user['id'],
        slack_team_id=slack_user['profile']['team'],
        display_name='original_display_name',
    )
    UserProfile.objects.create(
        email=slack_user['profile']['email'],
        slack_id='other_slack_id',
        slack_team_id='some_other_team',
        display_name='original_display_name',
    )

    update_user_profile_from_slack_user(slack_user)

    correct_user = UserProfile.objects.get(slack_id=slack_user['id'])
    wrong_user = UserProfile.objects.get(slack_id='other_slack_id')

    assert correct_user.display_name == slack_user['profile']['display_name'], 'the display name should be replaced'
    assert wrong_user.display_name == 'original_display_name', 'the other team user should not be changed'


@pytest.mark.django_db
def test_update_user_profile_from_slack_user__raises_error_for_duplicate_users():
    # these are duplicate users, but one has the email and team and the other has the slack id
    # if we see this error emerge in production, it means that we're saving them inconsistently somewhere.
    UserProfile.objects.create(
        email=slack_user['profile']['email'],
        slack_team_id=slack_user['profile']['team'],
    )
    UserProfile.objects.create(
        slack_id=slack_user['id'],
    )

    with pytest.raises(IntegrityError):
        update_user_profile_from_slack_user(slack_user)


@pytest.mark.django_db
def test_update_user_profile_from_slack(mocker):
    slack_users = []
    for i in range(3):
        slack_users.append(deepcopy(slack_user))
    for i, email in enumerate(['a@gmail.com', 'b@gmail.com', 'c@gmail.com']):
        slack_users[i]['profile']['email'] = email
        slack_users[i]['id'] = str(i)

    slack_client = mocker.Mock()
    slack_client.users_list().data = {
        'members': slack_users,
    }

    with mocker.patch('users.utils.slack.WebClient', return_value=slack_client):
        update_user_profile_from_slack()

    for i in range(3):
        UserProfile.objects.get(slack_id=str(i))
