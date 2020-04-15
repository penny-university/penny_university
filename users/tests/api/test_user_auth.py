import pytest

from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_register_user(test_user_profile):
    client = APIClient()
    data = {
        'username': 'test@profile.com',
        'password': 'password'
    }
    response = client.post('/api/auth/register/', data=data, format='json')
    assert response.status_code == 200
    assert response.data['key'] is not None
    user = User.objects.get(username='test@profile.com')
    assert test_user_profile in user.userprofile_set.all()


@pytest.mark.django_db
def test_user_log_in_and_protected_request(test_user_profile):
    client = APIClient()
    user = User.objects.create_user(username='test@profile.com', password='password')
    test_user_profile.user = user
    test_user_profile.save()
    data = {
        'username': 'test@profile.com',
        'password': 'password'
    }
    response = client.post('/api/auth/login/', data=data, format='json')
    assert response.status_code == 200
    client.credentials(HTTP_AUTHORIZATION='Token ' + response.data['key'])
    data = {
        'title': 'Create Chat',
        'description': 'Testing creating a chat',
        'date': '2020-01-01T00:00'
    }
    response = client.post('/api/chats/', data=data, format='json')
    assert response.status_code == 201
