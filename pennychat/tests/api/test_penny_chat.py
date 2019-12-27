import pytest

from rest_framework.test import APIClient

from pennychat.tests import utils


@pytest.fixture
def chats_setup():
    utils.generate_chats()


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_penny_chat_list(chats_setup, client):
    response = client.get('/api/chats/')
    assert response.status_code == 200
    assert response.data['count'] == 3
    chats = response.data['results']
    # first chat should be most recent chat
    assert chats[0]['title'] == 'Chat 3'


@pytest.mark.django_db
def test_penny_chat_detail(chats_setup, client):
    response = client.get('/api/chats/1/')
    assert response.status_code == 200
    assert response.data['title'] == 'Chat 1'


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


@pytest.mark.django_db
def test_update_penny_chat(chats_setup, client):
    before = client.get('/api/chats/1/').data
    data = {
        'title': 'Update Chat',
        'description': 'Testing updating a chat',
        'date': '2020-01-03T12:00:00Z'
    }
    response = client.put('/api/chats/1/', data=data, format='json')
    assert response.status_code == 200
    assert before['title'] != response.data['title']
    assert response.data['title'] == 'Update Chat'
    assert response.data['description'] == 'Testing updating a chat'
    assert response.data['date'] == '2020-01-03T12:00:00Z'


@pytest.mark.django_db
def test_partial_update_penny_chat(chats_setup, client):
    before = client.get('/api/chats/1/').data
    data = {
        'title': 'Update Chat'
    }
    response = client.patch('/api/chats/1/', data=data, format='json')
    assert response.status_code == 200
    assert before['title'] != response.data['title']
    assert response.data['title'] == 'Update Chat'
    assert before['description'] == response.data['description']


@pytest.mark.django_db
def test_delete_penny_chat(chats_setup, client):
    response = client.delete('/api/chats/1/')
    assert response.status_code == 204
    response = client.get('/api/chats/1/')
    assert response.status_code == 404


@pytest.mark.django_db
def test_follow_up_url(chats_setup, client):
    response = client.get('/api/chats/1/')
    follow_up_url = response.data['follow_ups']
    assert follow_up_url == 'http://testserver/api/chats/1/follow-ups/'
    response = client.get(follow_up_url)
    assert response.status_code == 200
    assert response.data['count'] == 0
