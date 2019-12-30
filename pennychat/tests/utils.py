from datetime import timedelta

from django.utils import timezone

from pennychat.models import PennyChat, FollowUp
from users.models import UserProfile


def generate_user():
    user, created = UserProfile.objects.get_or_create(
        real_name='Anonymous Profile',
        defaults={'email': 'anonymous@profile.com'}
    )
    return user


def generate_follow_ups(chat):
    follow_up_1 = FollowUp.objects.create(penny_chat=chat,
                                          content='The first follow up',
                                          user=generate_user())
    follow_up_2 = FollowUp.objects.create(penny_chat=chat,
                                          content='The second follow up',
                                          user=generate_user())
    return [follow_up_1, follow_up_2]


def generate_chats(with_follow_ups=False):
    chat_1 = PennyChat.objects.create(title='Chat 1',
                                      description='The first test chat',
                                      date=timezone.now() - timedelta(weeks=4),
                                      user=generate_user())
    chat_2 = PennyChat.objects.create(title='Chat 2',
                                      description='The second test chat',
                                      date=timezone.now() - timedelta(days=1),
                                      user=generate_user())
    chat_3 = PennyChat.objects.create(title='Chat 3',
                                      description='The third test chat',
                                      date=timezone.now(),
                                      user=generate_user())
    chats = [chat_1, chat_2, chat_3]
    if with_follow_ups:
        for chat in chats:
            generate_follow_ups(chat)
    return chats
