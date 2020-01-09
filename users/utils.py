from django.db.models import Q
from django.db import IntegrityError
from django.conf import settings

import slack
from slack.errors import SlackApiError

from users.models import UserProfile


def update_user_profile_from_slack(slack_client=None):
    if not slack_client:
        slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
    resp = slack_client.users_list()
    new_users = []
    updated_users = []
    for slack_user in resp.data['members']:
        if not slack_user.get('profile', {}).get('email'):
            continue
        user, created = update_user_profile_from_slack_user(slack_user)
        if created:
            new_users.append(user)
        else:
            updated_users.append(user)

    return new_users, updated_users


def update_user_profile_from_slack_user(slack_user):
    created = False
    users = UserProfile.objects.filter(
        Q(slack_id=slack_user['id']) | Q(email=slack_user['profile']['email'], slack_team_id=slack_user['team_id'])
    )
    if len(users) == 0:
        created = True
        user = UserProfile.objects.create(
            email=slack_user['profile']['email'],
            slack_id=slack_user['id'],
            slack_team_id=slack_user['team_id'],
            display_name=slack_user['profile']['display_name'],
            real_name=slack_user['profile']['real_name'],
        )
    elif len(users) == 1:
        user = users[0]
        user.email = slack_user['profile']['email']
        user.slack_id = slack_user['id']
        user.slack_team_id = slack_user['team_id']
        user.display_name = slack_user['profile']['display_name']
        user.real_name = slack_user['profile']['real_name']
        user.save()
    else:
        raise IntegrityError('There are duplicate users in the database!')

    return user, created


def get_or_create_by_slack_ids(slack_user_ids, slack_client=None, ignore_user_not_found=True):
    """Gets or creates UserProfile from the slack users associated with user ids.

    :return dict of UserProfiles keyed by slack_user_id, if a user can not be found in slack, they will not have an
    entry in the dict
    """
    if not slack_client:
        slack_client = slack.WebClient(token=settings.SLACK_API_KEY)

    users = {}
    for slack_user_id in slack_user_ids:
        try:
            slack_user = slack_client.users_info(user=slack_user_id).data['user']
        except SlackApiError as e:
            if ignore_user_not_found and "'error': 'user_not_found'" in str(e):
                continue
            raise
        user, create = update_user_profile_from_slack_user(slack_user)
        users[slack_user_id] = user

    return users
