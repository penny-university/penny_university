from django.db import models

from users.models import SocialProfile
from pennychat.models import PennyChat


class TopicChannel(models.Model):
    channel_id = models.CharField(max_length=20, unique=True)
    slack_team_id = models.CharField(max_length=20)
    name = models.TextField()


class MatchRequest(models.Model):
    topic_channel = models.ForeignKey(TopicChannel, on_delete=models.CASCADE)
    profile = models.ForeignKey(SocialProfile, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)


class Match(models.Model):
    topic_channel = models.ForeignKey(TopicChannel, on_delete=models.CASCADE)
    profiles = models.ManyToManyField(SocialProfile)
    penny_chat = models.ForeignKey(PennyChat, on_delete=models.SET_NULL, null=True)
    conversation_id = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=True)
