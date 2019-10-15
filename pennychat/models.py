from django.db import models
from enum import Enum


class ChatStatus(Enum):
    DR = 'Draft'
    SH = 'Shared'
    IP = 'In Progress'
    CO = 'Completed'


class PennyChat(models.Model):
    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    invitees = models.TextField()
    channels = models.TextField()
    view = models.TextField()
    user = models.TextField()
    user_tz = models.TextField()
    template_channel = models.TextField()
    status = models.CharField(max_length=2, choices=[(tag, tag.value) for tag in ChatStatus])