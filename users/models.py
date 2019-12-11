from django.db import models


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
        return f'UserProfile:\n' \
            f'  id: {self.id}\n' \
            f'  email: {self.email}\n' \
            f'  slack_id: {self.slack_id}\n' \
            f'  slack_team_id: {self.slack_team_id}\n' \
            f'  display_name: {self.display_name}\n' \
            f'  real_name: {self.real_name}\n' \
            f'  topics_to_learn: {self.topics_to_learn}\n' \
            f'  topics_to_share: {self.topics_to_share}\n' \
            f'  how_you_learned_about_pennyu: {self.how_you_learned_about_pennyu}\n' \
            f'  metro_name: {self.metro_name}\n' \
            f'  created: {self.created}\n' \
            f'  updated: {self.updated}\n'
