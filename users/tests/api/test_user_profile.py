import pytest

from rest_framework.test import APIClient

from users.models import UserProfile


@pytest.fixture
def user_set_up():
    return UserProfile.objects.create(real_name='Anonymous Profile',
                                      email='anonymous@profile.com')


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_user_profile_detail(user_set_up, client):
    response = client.get(f'/api/users/{user_set_up.id}/')
    assert response.data['real_name'] == 'Anonymous Profile'
    assert response.data['email'] == 'anonymous@profile.com'
