import pytest

from rest_framework.test import APIClient

from users.models import UserProfile


@pytest.mark.django_db
def test_user_profile_detail():
    client = APIClient()
    profile = UserProfile.objects.create(
        real_name='Anonymous Profile',
        email='anonymous@profile.com',
        slack_id='required',
    )
    response = client.get(f'/api/users/{profile.id}/')
    assert response.data['real_name'] == 'Anonymous Profile'
    assert 'url' in response.data


@pytest.mark.django_db
def test_register_user():
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
    response = client.post(f'/api/auth/registration/', data=data, format='json')
    assert response.status_code == 200
    response = client.get(f'/api/users/{profile.id}/')
    assert response.data['user']['username'] == 'test@profile.com'
