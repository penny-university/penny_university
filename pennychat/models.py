from django.db import models
from django.utils import timezone

from common.utils import pprint_obj
from users.models import UserProfile


class PennyChat(models.Model):
    SHARED = 20
    COMPLETED = 30
    ABANDONED = 40
    STATUS_CHOICES = (
        (SHARED, 'Shared'),
        (COMPLETED, 'Completed'),
        (ABANDONED, 'Abandoned'),
    )

    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=SHARED)

    def __repr__(self):
        return pprint_obj(self)


class PennyChatInvitation(models.Model):
    DRAFT = 10
    SHARED = 20
    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (SHARED, 'Shared'),
    )

    # these fields are redundant in the actual `PennyChat` - as soon as the PennyChat is published, these fields
    penny_chat = models.ForeignKey(PennyChat, null=True, on_delete=models.CASCADE, related_name='invitation')
    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=DRAFT)

    # these two are only used during PennyChat creation from the bot command  why? because the slack API appears to
    # give us no other choice
    user_tz = models.TextField()
    template_channel = models.TextField()
    view = models.TextField()

    # these fields are in PennyChat because this model is doing double duty, serving as a record of both the invitation
    # and the chat itself - we might want to create a formal PennyChatInvitation eventually, it could link back to the
    # penny chat itself
    user = models.TextField(null=True)
    invitees = models.TextField()
    channels = models.TextField()

    def __repr__(self):
        return pprint_obj(self)


class FollowUp(models.Model):
    penny_chat = models.ForeignKey(PennyChat, on_delete=models.CASCADE, related_name='follow_ups')
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, related_name='follow_ups')

    def __repr__(self):
        return pprint_obj(self)


class Participant(models.Model):
    ORGANIZER = 10
    ATTENDEE = 20  # Not necessarily invited by name, could have come from a channel invite
    INVITEE = 30  # Explicitly invited by name
    INVITED_NONATTENDEE = 40  # Explicitly invited by name but indicated that they can't come
    ROLE_CHOICES = (
        (ORGANIZER, 'Organizer'),
        (ATTENDEE, 'Attendee'),
        (INVITEE, 'Invitee'),
        (INVITED_NONATTENDEE, 'Invited NonAttendee'),
    )

    penny_chat = models.ForeignKey(PennyChat, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user_chats')
    role = models.IntegerField(choices=ROLE_CHOICES, default=INVITEE)

    class Meta:
        unique_together = ('penny_chat', 'user',)

    def __repr__(self):
        return pprint_obj(self)
