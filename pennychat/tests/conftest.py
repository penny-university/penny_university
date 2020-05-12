from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone
import pytest

from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.models import SocialProfile


def generate_social_profile(name):
    email = name + '@wherever.com'
    user = User.objects.create_user(username=email, password='password', email=email)
    social_profile, created = SocialProfile.objects.get_or_create(
        slack_id=name,  # SocialProfiles are required to have unique slack_id
        real_name=name,
        defaults={'email': email, 'user': user}
    )
    return social_profile


def generate_follow_ups(chat, social_profiles):
    followups = []
    for profile in social_profiles:
        followup = FollowUp.objects.create(
            penny_chat=chat,
            content='The first follow up',
            user=profile.user,
        )
        followups.append(followup)
    return followups


@pytest.fixture
def test_chats_1():
    social_profile_1 = generate_social_profile('one')
    social_profile_2 = generate_social_profile('two')
    social_profile_3 = generate_social_profile('three')

    chat_1 = PennyChat.objects.create(
        title='Chat 1',
        description='The first test chat',
        date=timezone.now() - timedelta(weeks=4),
    )
    chat_2 = PennyChat.objects.create(
        title='Chat 2',
        description='The second test chat',
        date=timezone.now() - timedelta(days=1),
    )
    chat_3 = PennyChat.objects.create(
        title='Chat 3',
        description='The third test chat',
        date=timezone.now(),
    )
    chats = [chat_1, chat_2, chat_3]

    Participant.objects.create(user=social_profile_1.user, penny_chat=chat_1, role=Participant.ORGANIZER)
    Participant.objects.create(user=social_profile_2.user, penny_chat=chat_1, role=Participant.ATTENDEE)

    Participant.objects.create(user=social_profile_2.user, penny_chat=chat_2, role=Participant.ORGANIZER)
    Participant.objects.create(user=social_profile_3.user, penny_chat=chat_2, role=Participant.ATTENDEE)

    Participant.objects.create(user=social_profile_3.user, penny_chat=chat_3, role=Participant.ORGANIZER)
    Participant.objects.create(user=social_profile_1.user, penny_chat=chat_3, role=Participant.ATTENDEE)

    for chat in chats:
        generate_follow_ups(chat, [social_profile_1, social_profile_2])

    return chats
