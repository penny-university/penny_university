from django.db.models import Q
from django.db import IntegrityError
from django.conf import settings

import slack

from users.models import UserProfile


def update_user_profile_from_slack():
    slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
    resp = slack_client.users_list()
    for slack_user in resp.data['members']:
        if not slack_user.get('profile', {}).get('email'):
            continue
        update_user_profile_from_slack_user(slack_user)


def update_user_profile_from_slack_user(slack_user):
    users = UserProfile.objects.filter(
        Q(slack_id=slack_user['id']) |
        Q(email=slack_user['profile']['email'], slack_team_id=slack_user['team_id'])
    )
    if len(users) == 0:
        UserProfile.objects.create(
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
