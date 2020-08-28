import pytest
import logging
from datetime import datetime, timezone
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from pennychat.models import PennyChat, Participant
from users.models import User

from common.tests.fakes import UserFactory, PennyChatFactory, FollowUpFactory, SocialProfileFactory

logger = logging.getLogger(__name__)

within_range_date = datetime(2020, 1, 2, 0, 0, tzinfo=timezone.utc)

# Setup test private chats for test_penny_chat_participants_list__

def setup_test_chats():

    chat_private_1 = PennyChatFactory(visibility=PennyChat.PRIVATE)
    chat_private_2 = PennyChatFactory(visibility=PennyChat.PRIVATE)

    chats = [chat_private_1, chat_private_2]

    # Create 3 new users here rather than an arg

    user1 = UserFactory()
    soc_prof1 = SocialProfileFactory(user=user1)
    user2 = UserFactory()
    soc_prof2 = SocialProfileFactory(user=user2)
    user3 = UserFactory()
    soc_prof3 = SocialProfileFactory(user=user3)

    # Assign participants to each chat

    # Chat 1 
    # user1 = organizer
    # user2 = participant
    # user3 = shouldn't see this

    # Test as user1's page as user1 to make sure it appears

    Participant.objects.create(user=user1, penny_chat=chat_private_1, role=Participant.ORGANIZER)
    Participant.objects.create(user=user2, penny_chat=chat_private_1, role=Participant.ATTENDEE)

    # Chat 2
    # user3 = organizer
    # user1 = participant
    # user2 = shouldn't see this 

    # Test on user3's page as user2 to see if it doesn't appear

    Participant.objects.create(user=user3, penny_chat=chat_private_2, role=Participant.ORGANIZER)
    Participant.objects.create(user=user1, penny_chat=chat_private_2, role=Participant.ATTENDEE)

    for chat in chats:
        FollowUpFactory(penny_chat=chat, user=user1, date=within_range_date)
    return {
        'penny_chats': [chat_private_1, chat_private_2],
        'users': [user1, user2, user3],
        'social_profiles': [soc_prof1, soc_prof2, soc_prof3]
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
    assert response.data['results'][0]['participants'][0]['user']['id'] == most_recent_chat.get_organizer().id
    assert chats[0]['title'] == most_recent_chat.title
    assert chats[0]['follow_ups_count'] == 2


@pytest.mark.django_db
def test_penny_chat_participants_list__own_content():
    objects = setup_test_chats()
    chat_private_1, chat_private_2 = objects['penny_chats']
    user1, user2, user3 = objects['users']
    soc_prof1, soc_prof2, soc_prof3 = objects['social_profiles']
    client = APIClient()
    token = Token.objects.create(user=user1)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    user_id = user1.id
    response = client.get(f'/api/chats/?participants__user_id={user_id}')
    assert response.status_code == 200
    assert response.data['count'] == 2
    chats = response.data['results']
    for chat in chats:
        assert int(user_id) in [participant['user']['id'] for participant in chat['participants']]


@pytest.mark.django_db
def test_penny_chat_participants_list__other_content():
    objects = setup_test_chats()
    chat_private_1, chat_private_2 = objects['penny_chats']
    user1, user2, user3 = objects['users']
    soc_prof1, soc_prof2, soc_prof3 = objects['social_profiles']
    client = APIClient()
    token = Token.objects.create(user=user3)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    user_id = user2.id
    response = client.get(f'/api/chats/?participants__user_id={user_id}')
    assert response.status_code == 200
    assert response.data['count'] == 0
    chats = response.data['results']
    for chat in chats:
        assert int(user_id) in [participant['user']['id'] for participant in chat['participants']]


@pytest.mark.django_db
def test_penny_chat__upcoming_or_popular(test_chats_2):
    client = APIClient()
    private_chat_org = test_chats_2[3].get_organizer()
    token = Token.objects.create(user=private_chat_org)
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.get('/api/chats/?upcoming_or_popular=true')
    assert response.status_code == 200
    titles = {result['title'] for result in response.data['results']}
    assert len(titles) == 3
    assert 'future_chat' in titles
    assert 'old_chat_with_followups' in titles
    chats = response.data['results']
    assert chats[0]['follow_ups_count'] == 0
    assert chats[1]['follow_ups_count'] == 2


@pytest.mark.django_db
def test_penny_chat_detail(test_chats_1):
    client = APIClient()
    penny_chat = test_chats_1[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    assert response.status_code == 200
    assert 'participants' in response.data
    assert response.data['participants'][0]['role'] == 'Organizer'
    assert response.data['participants'][0]['user']['id'] == penny_chat.get_organizer().id
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


@pytest.mark.django_db
def test_un_verified_follow_ups_omitted(test_chats_1, users):
    for user in users:
        user.is_verified = False
        user.save()
    client = APIClient()
    penny_chat = test_chats_1[0]
    response = client.get(f'/api/chats/{penny_chat.id}/')
    follow_up_url = response.data['follow_ups']
    response = client.get(follow_up_url)
    assert response.status_code == 200
    assert len(response.data) == 0
    for user in users:
        user.is_verified = True
        user.save()
