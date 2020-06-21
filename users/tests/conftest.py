from datetime import timedelta
import pytest
from django.utils import timezone
from users.models import SocialProfile, User
from pennychat.models import PennyChat


@pytest.fixture
def test_social_profile():
    profile = SocialProfile.objects.create(
        real_name='Test Profile',
        email='test@profile.com',
        slack_id='required'
    )
    return profile


@pytest.fixture
def test_user():
    return User.objects.create_user(
        username='test@profile.com',
        email='test@profile.com',
        password='password',
        first_name='test',
        last_name='user',
    )


@pytest.fixture(autouse=True)
def test_chats_1():
    chat_1 = PennyChat.objects.create(
        title='Chat 1',
        description='The first test chat',
        date=timezone.now() - timedelta(weeks=4),
    )
    return chat_1
