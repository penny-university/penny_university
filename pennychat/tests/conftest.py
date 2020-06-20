from datetime import timedelta

from django.utils import timezone
import pytest

from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.models import User, SocialProfile


def generate_users(name):
    email = name + '@wherever.com'
    user = User.objects.create_user(
        username=email, password='password', email=email, first_name=f'First{name}', last_name=f'Last{name}', is_verified=True)
    social_profile, created = SocialProfile.objects.get_or_create(
        slack_id=name,  # SocialProfiles are required to have unique slack_id
        real_name=name,
        defaults={'email': email, 'user': user}
    )
    return user


def generate_follow_ups(chat, users):
    followups = []
    for user in users:
        followup = FollowUp.objects.create(
            penny_chat=chat,
            content='The first follow up',
            user=user,
        )
        followups.append(followup)
    return followups


@pytest.fixture
def users():
    user_1 = generate_users('one')
    user_2 = generate_users('two')
    user_3 = generate_users('three')
    return [user_1, user_2, user_3]


@pytest.fixture
def test_chats_1(users):
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

    Participant.objects.create(user=users[0], penny_chat=chat_1, role=Participant.ORGANIZER)
    Participant.objects.create(user=users[1], penny_chat=chat_1, role=Participant.ATTENDEE)

    Participant.objects.create(user=users[1], penny_chat=chat_2, role=Participant.ORGANIZER)
    Participant.objects.create(user=users[2], penny_chat=chat_2, role=Participant.ATTENDEE)

    Participant.objects.create(user=users[2], penny_chat=chat_3, role=Participant.ORGANIZER)
    Participant.objects.create(user=users[0], penny_chat=chat_3, role=Participant.ATTENDEE)

    for chat in chats:
        generate_follow_ups(chat, [users[0], users[1]])
    return chats
