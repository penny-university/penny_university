import pytest
from datetime import timedelta
from django.utils import timezone
from users.models import SocialProfile, User


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

@pytest.fixture()	
def test_chat_2():	
    chat_1 = PennyChat.objects.create(	
        title='Chat 1',	
        description='The very first test chat',	
        date=timezone.now() - timedelta(weeks=4),	
    )	
    return chat_1
