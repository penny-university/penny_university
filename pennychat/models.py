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

    def __repr__(self):
        return f'PennyChat:\n' \
            f'  id: {self.id}\n' \
            f'  title: {self.title}\n' \
            f'  description: {self.description}\n' \
            f'  date: {self.date}\n' \
            f'  invitees: {self.invitees}\n' \
            f'  channels: {self.channels}\n' \
            f'  view: {self.view}\n' \
            f'  user: {self.user}\n' \
            f'  user_tz: {self.user_tz}\n' \
            f'  template_channel: {self.template_channel}\n' \
            f'  status: {self.status}\n'


class FollowUp(models.Model):
    penny_chat = models.ForeignKey(PennyChat, on_delete=models.CASCADE, related_name='follow_ups')
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='follow_ups')

    def __repr__(self):
        return f'FollowUp:\n' \
            f'  id: {self.id}\n' \
            f'  penny_chat: {self.penny_chat}\n' \
            f'  content: {self.content}\n' \
            f'  date: {self.date}\n' \
            f'  user: {self.user}\n'
