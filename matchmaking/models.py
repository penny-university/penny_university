from django.db import models

from common.utils import pprint_obj
from users.models import SocialProfile
from pennychat.models import PennyChat


class TopicChannel(models.Model):
    """A channel that gets periodic "let's meet" reminders and allows people to be matched."""
    channel_id = models.CharField(max_length=20, unique=True)
    slack_team_id = models.CharField(max_length=20)
    name = models.TextField()

    def __repr__(self):
        return pprint_obj(self)


class MatchRequest(models.Model):
    """A user's request to be matched together for a Penny Chat in a particular topic."""
    topic_channel = models.ForeignKey(TopicChannel, on_delete=models.CASCADE)
    profile = models.ForeignKey(SocialProfile, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    def __repr__(self):
        return pprint_obj(self)


class Match(models.Model):
    """A match between two or more users. It is still their responsibility to schedule a Penny Chat."""
    topic_channel = models.ForeignKey(TopicChannel, on_delete=models.CASCADE)
    profiles = models.ManyToManyField(SocialProfile)
    penny_chat = models.ForeignKey(PennyChat, on_delete=models.SET_NULL, null=True)
    conversation_id = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=True)

    def __repr__(self):
        return pprint_obj(self)
