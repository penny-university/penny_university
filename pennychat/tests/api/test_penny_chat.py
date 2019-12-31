import pytest
import logging

from rest_framework.test import APIClient

from pennychat.tests import utils
from pennychat.models import PennyChat

logger = logging.getLogger(__name__)


@pytest.fixture
def chats_setup():
    return utils.generate_chats()


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_penny_chat_list(chats_setup, client):
    response = client.get('/api/chats/')
    assert response.status_code == 200
    assert response.data['count'] == 3
    chats = response.data['results']
    most_recent_chat = PennyChat.objects.order_by('-date').first()
    # first chat should be most recent chat
    assert chats[0]['title'] == most_recent_chat.title


@pytest.mark.django_db
def test_penny_chat_detail(chats_setup, client):
    penny_chat = chats_setup[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 200
    assert response.data['title'] == penny_chat.title


@pytest.mark.django_db
def test_create_penny_chat(chats_setup, client):
    data = {
        'title': 'Create Chat',
        'description': 'Testing creating a chat',
        'date': '2020-01-01T00:00'
    }
    response = client.post('/api/chats/', data=data, format='json')
    assert response.status_code == 201
    chat_id = response.data['id']
    response = client.get(f'/api/chats/{chat_id}/')
    assert response.data['title'] == 'Create Chat'
    assert PennyChat.objects.get(pk=chat_id).title == 'Create Chat'


@pytest.mark.django_db
def test_update_penny_chat(chats_setup, client):
    penny_chat = chats_setup[0]
    before = client.get(f'/api/chats/{penny_chat.id}/').data
    data = {
        'title': 'Update Chat',
        'description': 'Testing updating a chat',
        'date': '2020-01-03T12:00:00Z'
    }
    response = client.put(f'/api/chats/{penny_chat.id}/', data=data, format='json')
    assert response.status_code == 200
    assert before['title'] != response.data['title']
    assert response.data['title'] == 'Update Chat'
    assert response.data['description'] == 'Testing updating a chat'
    assert response.data['date'] == '2020-01-03T12:00:00Z'
    assert PennyChat.objects.get(pk=penny_chat.id).title == 'Update Chat'


@pytest.mark.django_db
def test_partial_update_penny_chat(chats_setup, client):
    penny_chat = chats_setup[0]
    before = client.get(f'/api/chats/{penny_chat.id}/').data
    data = {
        'title': 'Update Chat'
    }
    response = client.patch(f'/api/chats/{penny_chat.id}/', data=data, format='json')
    assert response.status_code == 200
    assert before['title'] != response.data['title']
    assert response.data['title'] == 'Update Chat'
    assert before['description'] == response.data['description']
    assert PennyChat.objects.get(pk=penny_chat.id).title == 'Update Chat'


@pytest.mark.django_db
def test_delete_penny_chat(chats_setup, client):
    penny_chat = chats_setup[0]
    response = client.delete(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 204
    response = client.get(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 404


@pytest.mark.django_db
def test_follow_up_url(chats_setup, client):
    penny_chat = chats_setup[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    follow_up_url = response.data['follow_ups']
    assert follow_up_url == f'http://testserver/api/chats/{penny_chat.id}/follow-ups/'
    response = client.get(follow_up_url)
    assert response.status_code == 200
    assert response.data['count'] == 0
