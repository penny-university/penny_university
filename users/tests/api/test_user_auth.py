import pytest

from django.contrib.auth.models import User
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_register_user(test_user_profile):
    client = APIClient()
    data = {
        'email': 'test@profile.com',
        'password': 'password',
        'first_name': 'test',
        'last_name': 'profile',
    }
    response = client.post('/api/auth/register/', data=data, format='json')
    assert response.status_code == 200
    assert response.data['key'] is not None
    user = User.objects.get(email='test@profile.com')
    assert test_user_profile in user.userprofile_set.all()


@pytest.mark.django_db
def test_checking_user_exists():
    client = APIClient()
    data_does_exist = {
        'email': 'test@profile.com',
    }
    data_does_not_exist = {
        'email': 'test@profile.com',
    }
    user = User.objects.create_user(username='test@profile.com', email='test@profile.com', password='password')
    response = client.post('/api/auth/exists/', data_does_exist, format='json')
    assert response.status_code == 200

    response = client.post('/api/auth/exists/', data_does_not_exist, format='json')
    assert response.status_code == 200
    


@pytest.mark.django_db
def test_user_log_in_and_protected_request(test_user_profile):
    client = APIClient()
    user = User.objects.create_user(username='test@profile.com', email='test@profile.com', password='password')
    test_user_profile.user = user
    test_user_profile.save()
    data = {
        'email': 'test@profile.com',
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
