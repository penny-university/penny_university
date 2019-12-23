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
