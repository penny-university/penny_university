from datetime import timedelta

from django.contrib.auth.models import User
from django.utils import timezone
import pytest

from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.models import UserProfile


def generate_user_profile(name):
    email = name + '@wherever.com'
    user = User.objects.create_user(username=email, password='password', email=email)
    user_profile, created = UserProfile.objects.get_or_create(
        slack_id=name,  # UserProfile are required to have unique slack_id
        real_name=name,
        defaults={'email': email, 'user': user}
    )
    return user_profile


def generate_follow_ups(chat, user_profiles):
    followups = []
    for u in user_profiles:
        followup = FollowUp.objects.create(
            penny_chat=chat,
            content='The first follow up',
            user_profile=u,
        )
        followups.append(followup)
    return followups


@pytest.fixture
def test_chats_1():
    user_profile_1 = generate_user_profile('one')
    user_profile_2 = generate_user_profile('two')
    user_profile_3 = generate_user_profile('three')

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

    Participant.objects.create(user_profile=user_profile_1, penny_chat=chat_1, role=Participant.ORGANIZER)
    Participant.objects.create(user_profile=user_profile_2, penny_chat=chat_1, role=Participant.ATTENDEE)

    Participant.objects.create(user_profile=user_profile_2, penny_chat=chat_2, role=Participant.ORGANIZER)
    Participant.objects.create(user_profile=user_profile_3, penny_chat=chat_2, role=Participant.ATTENDEE)

    Participant.objects.create(user_profile=user_profile_3, penny_chat=chat_3, role=Participant.ORGANIZER)
    Participant.objects.create(user_profile=user_profile_1, penny_chat=chat_3, role=Participant.ATTENDEE)

    for chat in chats:
        generate_follow_ups(chat, [user_profile_1, user_profile_2])

    return chats
