from datetime import timedelta

from django.utils import timezone
import pytest

from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.models import UserProfile


def generate_user(name):
    user, created = UserProfile.objects.get_or_create(
        slack_id=name,  # UserProfile are required to have unique slack_id
        real_name=name,
        defaults={'email': name + '@wherever.com'}
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
def test_chats_1():
    user_1 = generate_user('one')
    user_2 = generate_user('two')
    user_3 = generate_user('three')

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

    Participant.objects.create(user=user_1, penny_chat=chat_1, role=Participant.ORGANIZER)
    Participant.objects.create(user=user_2, penny_chat=chat_1, role=Participant.ATTENDEE)

    Participant.objects.create(user=user_2, penny_chat=chat_2, role=Participant.ORGANIZER)
    Participant.objects.create(user=user_3, penny_chat=chat_2, role=Participant.ATTENDEE)

    Participant.objects.create(user=user_3, penny_chat=chat_3, role=Participant.ORGANIZER)
    Participant.objects.create(user=user_1, penny_chat=chat_3, role=Participant.ATTENDEE)

    for chat in chats:
        generate_follow_ups(chat, [user_1, user_2])

    return chats
