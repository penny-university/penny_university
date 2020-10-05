import pytest
import logging
import django
from datetime import datetime, timezone, timedelta
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from pennychat.models import PennyChat, Participant
from users.models import User

from common.tests.fakes import UserFactory, PennyChatFactory, FollowUpFactory, SocialProfileFactory

logger = logging.getLogger(__name__)

within_range_date = datetime(2020, 1, 2, 0, 0, tzinfo=timezone.utc)
old_chat_date = django.utils.timezone.now() - timedelta(weeks=4)
future_chat_date = django.utils.timezone.now() + timedelta(days=1)


def setup_test_chats():

    # Private Chat Testing

    chat_private_1 = PennyChatFactory(visibility=PennyChat.PRIVATE)
    chat_private_2 = PennyChatFactory(visibility=PennyChat.PRIVATE)
    chat_private_3 = PennyChatFactory(visibility=PennyChat.PRIVATE)
    chat_public = PennyChatFactory(visibility=PennyChat.PUBLIC)

    user1 = UserFactory()
    user2 = UserFactory()
    user3 = UserFactory()

    # chat_private_1
    # user1 organized this - it should NOT appear to user3
    Participant.objects.create(user=user1, penny_chat=chat_private_1, role=Participant.ORGANIZER)
    Participant.objects.create(user=user2, penny_chat=chat_private_1, role=Participant.ATTENDEE)

    # chat_private_2
    # user3 organized this - it should appear to user3
    Participant.objects.create(user=user3, penny_chat=chat_private_2, role=Participant.ORGANIZER)
    Participant.objects.create(user=user1, penny_chat=chat_private_2, role=Participant.ATTENDEE)

    # chat_private_3
    # user3 attended this
    Participant.objects.create(user=user2, penny_chat=chat_private_3, role=Participant.ORGANIZER)
    Participant.objects.create(user=user3, penny_chat=chat_private_3, role=Participant.ATTENDEE)

    # chat_public
    # user1 organized this - it should appear to user3
    Participant.objects.create(user=user1, penny_chat=chat_public, role=Participant.ORGANIZER)
    Participant.objects.create(user=user2, penny_chat=chat_public, role=Participant.ATTENDEE)

    # Upcoming or Popular Testing

    old_chat_with_no_followups = PennyChatFactory(date=old_chat_date, title='old_chat_with_no_followups')
    old_chat_with_followups = PennyChatFactory(date=old_chat_date, title='old_chat_with_followups')
    future_chat_with_no_followups = PennyChatFactory(date=future_chat_date, title='future_chat')

    Participant.objects.create(user=user1, penny_chat=old_chat_with_no_followups, role=Participant.ORGANIZER)
    Participant.objects.create(user=user2, penny_chat=old_chat_with_no_followups, role=Participant.ATTENDEE)

    Participant.objects.create(user=user2, penny_chat=old_chat_with_followups, role=Participant.ORGANIZER)
    Participant.objects.create(user=user3, penny_chat=old_chat_with_followups, role=Participant.ATTENDEE)

    Participant.objects.create(user=user3, penny_chat=future_chat_with_no_followups, role=Participant.ORGANIZER)
    Participant.objects.create(user=user1, penny_chat=future_chat_with_no_followups, role=Participant.ATTENDEE)

    FollowUpFactory(penny_chat=old_chat_with_followups, user=user1, date=within_range_date)

    chats = [chat_private_1, chat_private_2, chat_private_3, chat_public, old_chat_with_followups, future_chat_with_no_followups]  # noqa

    for chat in chats:
        FollowUpFactory(penny_chat=chat, user=user1, date=within_range_date)
    return {
        'penny_chats': [chat_private_1, chat_private_2, chat_private_3, chat_public],
        'users': [user1, user2, user3],
        'upcoming_or_popular': [old_chat_with_no_followups, old_chat_with_followups, future_chat_with_no_followups]
    }


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
    assert response.data['results'][0]['participants'][0]['user']['id'] == most_recent_chat.get_organizers()[0].id
    assert chats[0]['title'] == most_recent_chat.title
    assert chats[0]['follow_ups_count'] == 2


@pytest.mark.django_db
def test_penny_chat_participants_list__own_content():
    objects = setup_test_chats()
    chat_private_1, chat_private_2, chat_private_3, chat_public = objects['penny_chats']
    user1, user2, user3 = objects['users']
    client = APIClient()
    token = Token.objects.create(user=user3)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get(f'/api/chats/?participants__user_id={user3.id}')
    assert response.status_code == 200
    assert response.data['count'] == 4
    chats = response.data['results']
    returned_chat_ids = set([chat['id'] for chat in chats])
    assert chat_private_2.id in returned_chat_ids, 'user organized this chat but it was not returned'
    assert chat_private_3.id in returned_chat_ids, 'user attended this chat but it was not returned'


@pytest.mark.django_db
def test_penny_chat_participants_list__other_content():
    objects = setup_test_chats()
    chat_private_1, chat_private_2, chat_private_3, chat_public = objects['penny_chats']
    user1, user2, user3 = objects['users']
    client = APIClient()
    token = Token.objects.create(user=user3)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get(f'/api/chats/?participants__user_id={user1.id}')
    assert response.status_code == 200
    assert response.data['count'] == 4
    chats = response.data['results']
    for chat in chats:
        assert int(user1.id) in [participant['user']['id'] for participant in chat['participants']]


@pytest.mark.django_db
def test_penny_chat__upcoming_or_popular():
    objects = setup_test_chats()
    chat_private_1, chat_private_2, chat_private_3, chat_public = objects['penny_chats']
    old_chat_with_no_followups, old_chat_with_followups, future_chat_with_no_followups = objects['upcoming_or_popular']
    user1, user2, user3 = objects['users']
    client = APIClient()
    token = Token.objects.create(user=user3)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/api/chats/?upcoming_or_popular=true')
    assert response.status_code == 200
    titles = {result['title'] for result in response.data['results']}
    assert len(titles) == 5
    assert 'future_chat' in titles
    assert 'old_chat_with_followups' in titles
    chats = response.data['results']
    assert chats[0]['follow_ups_count'] == 1
    # chats[4] = old_chat_with_followups
    assert chats[4]['follow_ups_count'] == 1


@pytest.mark.django_db
def test_penny_chat_detail(test_chats_1):
    client = APIClient()
    penny_chat = test_chats_1[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 200
    assert 'participants' in response.data
    assert response.data['participants'][0]['role'] == 'Organizer'
    assert response.data['participants'][0]['user']['id'] == penny_chat.get_organizers()[0].id
    assert response.data['title'] == penny_chat.title


@pytest.mark.django_db
def test_create_penny_chat(test_chats_1):
    user = test_chats_1[0].get_organizers()[0]
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
    user = test_chats_1[0].get_organizers()[0]
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
    user = penny_chat.get_organizers()[0]
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
    user = penny_chat.get_organizers()[0]
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
    user = penny_chat.get_organizers()[0]
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
