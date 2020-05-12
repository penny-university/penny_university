import pytest
from rest_framework.test import APIClient

from users.models import SocialProfile


@pytest.mark.django_db
def test_user_chat_detail(test_chats_1):
    profile = SocialProfile.objects.get(slack_id='one')

    response = APIClient().get(f'/api/users/{profile.id}/')
    assert response.data['real_name'] == 'one'
    assert 'url' in response.data
    assert response.data['chats'] == f'http://testserver/api/users/{profile.id}/chats/'

    response = APIClient().get(f'http://testserver/api/users/{profile.id}/chats/')
    assert 'results' in response.data
    assert response.data['results'][0]['penny_chat'] == f'http://testserver/api/chats/{test_chats_1[0].id}/'
    assert response.data['results'][0]['role'] == 'Organizer'
