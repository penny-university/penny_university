from django.db import models
from django.utils import timezone

from common.utils import pprint_obj
from users.models import (
    get_or_create_social_profile_from_slack_id,
    User
)


class PennyChat(models.Model):
    DRAFT = 10  # not shared with anyone
    SHARED = 20  # invitation sent to all specified channels and users
    REMINDED = 25  # participants reminded of upcoming penny chat
    COMPLETED = 30  # penny chat is over
    ABANDONED = 40  # penny chat abandoned
    STATUS_CHOICES = (
        (DRAFT, 'Draft'),
        (SHARED, 'Shared'),
        (REMINDED, 'Reminded'),
        (COMPLETED, 'Completed'),
        (ABANDONED, 'Abandoned'),
    )

    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=DRAFT)
    created_from_slack_team_id = models.CharField(max_length=20, null=True)

    # meta
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __repr__(self):
        return pprint_obj(self)

    def save_organizer_from_slack_id(self, slack_user_id):
        profile = get_or_create_social_profile_from_slack_id(slack_user_id, ignore_user_not_found=False)
        organizer = profile.user
        self.save_participant(organizer, Participant.ORGANIZER)

    def save_participant(self, participant, role):
        assert role in [role[0] for role in Participant.ROLE_CHOICES]  # get out ids
        Participant.objects.update_or_create(
            penny_chat=self,
            user=participant,
            defaults=dict(role=role),
        )

    def get_organizer(self):
        return User.objects.get(
            user_chats__penny_chat=self,
            user_chats__role=Participant.ORGANIZER,
        )

    def get_participants(self):
        return User.objects.filter(user_chats__penny_chat=self)


class PennyChatSlackInvitation(PennyChat):
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
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='follow_ups')

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
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='user_chats')
    role = models.IntegerField(choices=ROLE_CHOICES)

    class Meta:
        unique_together = ('penny_chat', 'user',)
        ordering = ['role']

    def __repr__(self):
        return pprint_obj(self)
