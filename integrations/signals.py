from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from bot.tasks import add_google_meet
from integrations.models import GoogleCredentials
from pennychat.models import PennyChatSlackInvitation


@receiver(post_save, sender=GoogleCredentials)
def add_google_meet_to_upcoming_chats(sender, **kwargs):
    credentials = kwargs.get('instance')
    if credentials:
        user = credentials.user
        slack_ids = [profile.slack_id for profile in user.social_profiles.all()]
        invites = PennyChatSlackInvitation.objects.filter(organizer_slack_id__in=slack_ids, date__gt=timezone.now())
        for invite in invites:
            add_google_meet(invite.id)
