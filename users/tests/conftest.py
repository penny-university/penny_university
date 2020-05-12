import pytest

from users.models import SocialProfile


@pytest.fixture
def test_social_profile():
    profile = SocialProfile.objects.create(
        real_name='Test Profile',
        email='test@profile.com',
        slack_id='required'
    )
    return profile
