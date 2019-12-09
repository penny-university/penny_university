from django.db import models
from django.utils import timezone

from users.models import UserProfile


class PennyChat(models.Model):
    DRAFT_STATUS = 1
    SHARED_STATUS = 2
    STATUS_CHOICES = (
        (DRAFT_STATUS, 'Draft'),
        (SHARED_STATUS, 'Shared')
    )

    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    invitees = models.TextField()
    channels = models.TextField()
    view = models.TextField()
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='chats')
    user_tz = models.TextField()
    template_channel = models.TextField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=DRAFT_STATUS)


class FollowUp(models.Model):
    penny_chat = models.ForeignKey(PennyChat, on_delete=models.CASCADE, related_name='follow_ups')
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='follow_ups')
