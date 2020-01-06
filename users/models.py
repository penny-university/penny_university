from django.core.exceptions import ValidationError
from django.db import models

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
