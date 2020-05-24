import pytest
import logging

from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from pennychat.models import PennyChat
from users.models import User

logger = logging.getLogger(__name__)


@pytest.mark.django_db
def test_penny_chat_list(test_chats_1):
    client = APIClient()
    response = client.get('/api/chats/')
    assert response.status_code == 200
    assert response.data['count'] == 3
    chats = response.data['results']
    most_recent_chat = PennyChat.objects.order_by('-date').first()
    # first chat should be most recent chat
    assert 'participants' in response.data['results'][0]
    assert response.data['results'][0]['participants'][0]['role'] == 'Organizer'
    assert response.data['results'][0]['participants'][0]['user']['email'] == 'three@wherever.com'
    assert chats[0]['title'] == most_recent_chat.title


@pytest.mark.django_db
def test_penny_chat_list(test_chats_1):
    client = APIClient()
    response = client.get('/api/chats/?participants__user_id=1')
    assert response.status_code == 200
    assert response.data['count'] == 2
    chats = response.data['results']
    for chat in chats:
        assert 1 in [participant['user']['id'] for participant in chat['participants']]


@pytest.mark.django_db
def test_penny_chat_detail(test_chats_1):
    client = APIClient()
    penny_chat = test_chats_1[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 200
    assert 'participants' in response.data
    assert response.data['participants'][0]['role'] == 'Organizer'
    assert response.data['participants'][0]['user']['email'] == 'one@wherever.com'
    assert response.data['title'] == penny_chat.title


@pytest.mark.django_db
def test_create_penny_chat(test_chats_1):
    user = test_chats_1[0].get_organizer()
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
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
def test_create_penny_chat_without_date(test_chats_1):
    user = test_chats_1[0].get_organizer()
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    data = {
        'title': 'Create Chat',
        'description': 'Testing creating a chat'
    }
    response = client.post('/api/chats/', data=data, format='json')
    assert response.status_code == 400
    assert response.data['date'][0].code == 'required'


@pytest.mark.django_db
def test_create_penny_chat_unauthorized(test_chats_1):
    client = APIClient()
    data = {
        'title': 'Create Chat',
        'description': 'Testing creating a chat',
        'date': '2020-01-01T00:00'
    }
    response = client.post('/api/chats/', data=data, format='json')
    assert response.status_code == 401


@pytest.mark.django_db
def test_update_penny_chat(test_chats_1):
    penny_chat = test_chats_1[0]
    user = penny_chat.get_organizer()
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
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
def test_update_penny_chat_unauthorized(test_chats_1):
    penny_chat = test_chats_1[0]
    client = APIClient()
    data = {
        'title': 'Update Chat',
        'description': 'Testing updating a chat',
        'date': '2020-01-03T12:00:00Z'
    }
    response = client.put(f'/api/chats/{penny_chat.id}/', data=data, format='json')
    assert response.status_code == 401


@pytest.mark.django_db
def test_update_penny_chat_wrong_user(test_chats_1):
    penny_chat = test_chats_1[0]
    user = User.objects.create_user("wronguser")
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    data = {
        'title': 'Update Chat',
        'description': 'Testing updating a chat',
        'date': '2020-01-03T12:00:00Z'
    }
    response = client.put(f'/api/chats/{penny_chat.id}/', data=data, format='json')
    assert response.status_code == 403


@pytest.mark.django_db
def test_partial_update_penny_chat(test_chats_1):
    penny_chat = test_chats_1[0]
    user = penny_chat.get_organizer()
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
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
def test_partial_update_penny_chat_unauthorized(test_chats_1):
    penny_chat = test_chats_1[0]
    client = APIClient()
    data = {
        'title': 'Update Chat'
    }
    response = client.patch(f'/api/chats/{penny_chat.id}/', data=data, format='json')
    assert response.status_code == 401


@pytest.mark.django_db
def test_partial_update_penny_chat_wrong_user(test_chats_1):
    penny_chat = test_chats_1[0]
    user = User.objects.create_user("wronguser")
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    data = {
        'title': 'Update Chat'
    }
    response = client.patch(f'/api/chats/{penny_chat.id}/', data=data, format='json')
    assert response.status_code == 403


@pytest.mark.django_db
def test_delete_penny_chat(test_chats_1):
    penny_chat = test_chats_1[0]
    user = penny_chat.get_organizer()
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.delete(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 204
    response = client.get(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 404


@pytest.mark.django_db
def test_delete_penny_chat_unauthorized(test_chats_1):
    penny_chat = test_chats_1[0]
    client = APIClient()
    response = client.delete(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 401


@pytest.mark.django_db
def test_delete_penny_chat_wrong_user(test_chats_1):
    penny_chat = test_chats_1[0]
    user = User.objects.create_user("wronguser")
    token = Token.objects.create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.delete(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 403


@pytest.mark.django_db
def test_follow_up_url(test_chats_1):
    client = APIClient()
    penny_chat = test_chats_1[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    follow_up_url = response.data['follow_ups']
    assert follow_up_url == f'http://testserver/api/chats/{penny_chat.id}/follow-ups/'
    response = client.get(follow_up_url)
    assert response.status_code == 200
    assert len(response.data) == 2
