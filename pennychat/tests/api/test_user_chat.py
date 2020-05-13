import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_user_chats(test_chats_1):
    user = get_user_model().objects.get(username='one@wherever.com')

    response = APIClient().get(f'/api/users/{user.id}/')
    assert 'url' in response.data
    assert response.data['chats'] == f'http://testserver/api/users/{user.id}/chats/'

    response = APIClient().get(f'http://testserver/api/users/{user.id}/chats/')
    assert 'results' in response.data
    assert response.data['results'][0]['penny_chat'] == f'http://testserver/api/chats/{test_chats_1[0].id}/'
    assert response.data['results'][0]['role'] == 'Organizer'
