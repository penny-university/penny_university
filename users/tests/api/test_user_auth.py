import pytest

from django.contrib.auth.models import User
from rest_framework.test import APIClient

from users.models import UserProfile


@pytest.mark.django_db
def register_user():
    client = APIClient()
    profile = UserProfile.objects.create(
        real_name='Test Profile',
        email='test@profile.com',
        slack_id='required'
    )
    data = {
        'username': 'test@profile.com',
        'password': 'password'
    }
    response = client.post('/api/auth/register/', data=data, format='json')
    assert response.status_code == 200
    user = User.objects.get(username='test@profile.com')
    assert profile in user.userprofile_set
