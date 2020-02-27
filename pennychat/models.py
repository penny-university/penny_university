from django.db import models
from django.utils import timezone

from common.utils import pprint_obj
from users.models import UserProfile


class PennyChat(models.Model):
    DRAFT = 10
    SHARED = 20
    COMPLETED = 30
    ABANDONED = 40
    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (SHARED, 'Shared'),
        (COMPLETED, 'Completed'),
        (ABANDONED, 'Abandoned'),
    )

    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=DRAFT)

    # meta
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __repr__(self):
        return pprint_obj(self)


class PennyChatInvitation(PennyChat):
    penny_chat = models.OneToOneField(
        PennyChat,
        auto_created=True,
        on_delete=models.deletion.CASCADE,
        parent_link=True,
        related_name='invitation',
    )

    # TODO can we get rid of view? it's currently just a weird way to retrieve the penny_chat_invite
    view = models.TextField()
    organizer_tz = models.TextField()  # change to organizer_tz
    organizer_slack_id = models.TextField(null=True)
    invitees = models.TextField()
    channels = models.TextField()
    shares = models.TextField(null=True)

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
    ATTENDEE = 20  # Will attend! these people might have been invited directly by name or indirectly by channel invite
    INVITEE = 30  # Explicitly invited by name
    INVITED_NONATTENDEE = 40  # Will not attend!
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
