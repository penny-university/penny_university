from django.db import models
from django.utils import timezone

from common.utils import pprint_obj
from users.models import (
    UserProfile,
    get_or_create_user_profile_from_slack_id,
)


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

    def save_organizer_from_slack_id(self, slack_user_id):
        organizer = get_or_create_user_profile_from_slack_id(slack_user_id, ignore_user_not_found=False)
        self.save_organizer(organizer)

    def save_organizer(self, organizer):
        Participant.objects.update_or_create(
            penny_chat=self,
            user=organizer,
            defaults=dict(role=Participant.ORGANIZER),
        )

    def get_organizer(self):
        organizer = UserProfile.objects.get(
            user_chats__penny_chat=self,
            user_chats__role=Participant.ORGANIZER,
        )
        return organizer


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
    ROLE_CHOICES = (
        (ORGANIZER, 'Organizer'),
        (ATTENDEE, 'Attendee'),
    )

    penny_chat = models.ForeignKey(PennyChat, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='user_chats')
    role = models.IntegerField(choices=ROLE_CHOICES)

    class Meta:
        unique_together = ('penny_chat', 'user',)
        ordering = ['role']

    def __repr__(self):
        return pprint_obj(self)
