import pytest

from rest_framework.test import APIClient

from pennychat.tests import utils


@pytest.fixture
def chats_setup():
    utils.generate_chats(with_follow_ups=True)


@pytest.fixture
def client():
    return APIClient()


@pytest.mark.django_db
def test_follow_up_list(chats_setup, client):
    response = client.get('/api/chats/1/follow-ups/')
    assert response.status_code == 200
    assert response.data['count'] == 2
    follow_ups = response.data['results']
    # first follow up should be the first follow up created
    assert follow_ups[0]['content'] == 'The first follow up'


@pytest.mark.django_db
def test_create_follow_up(chats_setup, client):
    data = {
        'content': 'Create new follow up'
    }
    response = client.post('/api/chats/1/follow-ups/', data=data, format='json')
    assert response.status_code == 201
    response = client.get(f'/api/chats/1/follow-ups/')
    assert response.data['count'] == 3
    assert response.data['results'][2]['content'] == 'Create new follow up'


@pytest.mark.django_db
def test_update_follow_up(chats_setup, client):
    chat = client.get('/api/chats/2/').data
    data = {
        'content': 'Update follow up',
        'penny_chat': chat['url'],
    }
    response = client.put('/api/follow-ups/1/', data=data, format='json')
    assert response.status_code == 200
    response = client.get('/api/chats/1/follow-ups/')
    assert response.data['count'] == 1
    response = client.get('/api/chats/2/follow-ups/')
    assert response.data['count'] == 3
    follow_ups = response.data['results']
    assert follow_ups[0]['content'] == 'Update follow up'


@pytest.mark.django_db
def test_partial_update_follow_up(chats_setup, client):
    data = {
        'content': 'Update follow up'
    }
    response = client.patch('/api/follow-ups/1/', data=data, format='json')
    assert response.status_code == 200
    follow_ups = client.get('/api/chats/1/follow-ups/').data['results']
    assert follow_ups[0]['content'] == 'Update follow up'


@pytest.mark.django_db
def test_delete_follow_up(chats_setup, client):
    response = client.delete('/api/follow-ups/1/')
    assert response.status_code == 204
    response = client.get('/api/chats/1/follow-ups/')
    assert response.data['count'] == 1
    assert response.data['results'][0]['id'] != 1
