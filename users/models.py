import slack
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, IntegrityError
from django.db.models import Q
from slack.errors import SlackApiError

from common.utils import pprint_obj


class UserProfile(models.Model):
    # slack-related
    email = models.CharField(max_length=200)
    slack_id = models.CharField(max_length=20, unique=True, null=True)
    slack_team_id = models.CharField(max_length=20)
    display_name = models.CharField(max_length=100)
    real_name = models.CharField(max_length=100)

    # pennyu-related
    topics_to_learn = models.CharField(max_length=1500)
    topics_to_share = models.CharField(max_length=1500)
    how_you_learned_about_pennyu = models.CharField(max_length=500)
    metro_name = models.CharField(max_length=200)

    # meta
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'

    def __repr__(self):
        return pprint_obj(self)

    def clean(self):
        super(UserProfile, self).clean()

        email_team_identification = self.email and self.slack_team_id
        if not (email_team_identification or self.slack_id):
            raise ValidationError('UserProfile must be created with either 1) slack_id or 2) email AND slack_team_id')

    def save(self, *args, **kwargs):
        self.clean()
        super(UserProfile, self).save(*args, **kwargs)


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


def get_or_create_user_profile_from_slack_id(slack_user_id, slack_client=None, ignore_user_not_found=True):
    return get_or_create_user_profile_from_slack_ids(
        [slack_user_id],
        slack_client=slack_client,
        ignore_user_not_found=ignore_user_not_found,
    ).get(slack_user_id)


def get_or_create_user_profile_from_slack_ids(slack_user_ids, slack_client=None, ignore_user_not_found=True):
    """Gets or creates UserProfile from the slack users associated with user ids.

    :return dict of UserProfiles keyed by slack_user_id, if a user can not be found in slack, they will not have an
    entry in the dict
    """
    if not slack_client:
        slack_client = slack.WebClient(token=settings.SLACK_API_KEY)

    users = {}
    for slack_user_id in set(slack_user_ids):
        try:
            # call slack every time rather than just seeing if the user is in the database just in case slack contains
            # updated information
            # TODO add request-level or time-based caching since it's unlikely that slack has been updated
            #  within the time of the request
            slack_user = slack_client.users_info(user=slack_user_id).data['user']
        except SlackApiError as e:
            if ignore_user_not_found and "'error': 'user_not_found'" in str(e):
                continue
            raise
        user, create = update_user_profile_from_slack_user(slack_user)
        users[slack_user_id] = user

    return users
