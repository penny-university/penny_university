import pytest

from users.models import UserProfile


@pytest.fixture
def test_user_profile():
    profile = UserProfile.objects.create(
        real_name='Test Profile',
        email='test@profile.com',
        slack_id='required'
    )
    return profile
