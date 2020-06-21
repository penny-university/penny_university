import pytest

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
