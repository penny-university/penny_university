from django.db import models


class User(models.Model):
    email = models.CharField(max_length=200)
    slack_id = models.CharField(max_length=100, unique=True)
    user_name = models.CharField(max_length=100)
    real_name = models.CharField(max_length=100)
    metro_name = models.CharField(max_length=200)
    topics_to_learn = models.CharField(max_length=1500)
    topics_to_share = models.CharField(max_length=1500)
    how_you_learned_about_pennyu = models.CharField(max_length=500)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'
