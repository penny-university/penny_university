import slack
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models, IntegrityError
from django.db.models import Q
from slack.errors import SlackApiError

from common.utils import pprint_obj, get_slack_client


class User(AbstractUser):
    # Eventually, we will add fields here to extend this class
    pass


class SocialProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='social_profiles')
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

    def __repr__(self):
        return pprint_obj(self)

    def clean(self):
        super(SocialProfile, self).clean()

        email_team_identification = self.email and self.slack_team_id
        if not (email_team_identification or self.slack_id):
            raise ValidationError('UserProfile must be created with either 1) slack_id or 2) email AND slack_team_id')

    def save(self, *args, **kwargs):
        self.clean()
        super(SocialProfile, self).save(*args, **kwargs)


def update_social_profile_from_slack(slack_client=None):
    if not slack_client:
        slack_client = get_slack_client()
    resp = slack_client.users_list()
    new_profiles = []
    updated_profiles = []
    for slack_user in resp.data['members']:
        if not slack_user.get('profile', {}).get('email'):
            continue
        user, created = update_social_profile_from_slack_user(slack_user)
        if created:
            new_profiles.append(user)
        else:
            updated_profiles.append(user)

    return new_profiles, updated_profiles


def update_social_profile_from_slack_user(slack_user):
    created = False
    profiles = SocialProfile.objects.filter(
        Q(slack_id=slack_user['id']) | Q(email=slack_user['profile']['email'], slack_team_id=slack_user['team_id'])
    )
    if len(profiles) == 0:
        created = True
        profile = SocialProfile.objects.create(
            email=slack_user['profile']['email'],
            slack_id=slack_user['id'],
            slack_team_id=slack_user['team_id'],
            display_name=slack_user['profile']['display_name'],
            real_name=slack_user['profile']['real_name'],
        )
    elif len(profiles) == 1:
        profile = profiles[0]
        profile.email = slack_user['profile']['email']
        profile.slack_id = slack_user['id']
        profile.slack_team_id = slack_user['team_id']
        profile.display_name = slack_user['profile']['display_name']
        profile.real_name = slack_user['profile']['real_name']
        profile.save()
    else:
        raise IntegrityError('There are duplicate social profiles in the database!')

    if profile.user_id is None:
        user, created = User.objects.get_or_create(
            username=profile.email,
            # All of our usernames are emails, but we still need the email field for other uses.
            email=profile.email,
            defaults={
                'first_name': profile.real_name.split()[0],
                'last_name': ' '.join(profile.real_name.split()[1:])
            },
        )
        if created:
            user.set_unusable_password()
        else:
            user.first_name = profile.real_name.split()[0]
            user.last_name = ' '.join(profile.real_name.split()[1:])
        user.save()
        profile.user = user
        profile.save()

    return profile, created


def get_or_create_social_profile_from_slack_id(slack_user_id, slack_client=None, ignore_user_not_found=True):
    return get_or_create_social_profile_from_slack_ids(
        [slack_user_id],
        slack_client=slack_client,
        ignore_user_not_found=ignore_user_not_found,
    ).get(slack_user_id)


def get_or_create_social_profile_from_slack_ids(slack_user_ids, slack_client=None, ignore_user_not_found=True):
    """Gets or creates SocialProfile from the slack users associated with user ids.

    :return dict of SocialProfiles keyed by slack_user_id, if a user can not be found in slack, they will not have an
    entry in the dict
    """
    if not slack_client:
        slack_client = get_slack_client()

    profiles = {}
    for slack_user_id in set(slack_user_ids):
        try:
            # call slack every time rather than just seeing if the user is in the database just in case slack contains
            # updated information
            # TODO get the profile out of the db and only check slack if the update_at is older than some cutoff
            slack_user = slack_client.users_info(user=slack_user_id).data['user']
        except SlackApiError as e:
            if ignore_user_not_found and "'error': 'user_not_found'" in str(e):
                continue
            raise
        profile, create = update_social_profile_from_slack_user(slack_user)
        profiles[slack_user_id] = profile

    return profiles
