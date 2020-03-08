import pytest

from rest_framework.test import APIClient

from pennychat.models import FollowUp


@pytest.mark.django_db
def test_follow_up_list(test_chats_1):
    client = APIClient()
    penny_chat = test_chats_1[0]
    response = client.get(f'/api/chats/{penny_chat.id}/follow-ups/')
    assert response.status_code == 200
    follow_ups = response.data
    assert len(follow_ups) == 2
    # first follow up should be the first follow up created
    assert follow_ups[0]['content'] == 'The first follow up'
    assert FollowUp.objects.get(pk=follow_ups[0]['id']).content == 'The first follow up'


@pytest.mark.django_db
def test_create_follow_up(test_chats_1):
    client = APIClient()
    penny_chat = test_chats_1[0]
    content = 'Create new follow up'
    data = {
        'content': content
    }
    response = client.post(f'/api/chats/{penny_chat.id}/follow-ups/', data=data, format='json')
    assert response.status_code == 201
    response = client.get(f'/api/chats/{penny_chat.id}/follow-ups/')
    follow_ups = response.data
    assert len(follow_ups) == 3
    assert follow_ups[2]['content'] == content
    assert FollowUp.objects.get(pk=follow_ups[2]['id']).content == content


@pytest.mark.django_db
def test_update_follow_up(test_chats_1):
    client = APIClient()
    first_penny_chat = test_chats_1[0]
    second_penny_chat = test_chats_1[1]
    chat_data = client.get(f'/api/chats/{first_penny_chat.id}/').data
    data = {
        'content': 'Update follow up',
        'penny_chat': chat_data['url'],
    }
    follow_up = second_penny_chat.follow_ups.first()
    response = client.put(f'/api/follow-ups/{follow_up.id}/', data=data, format='json')
    assert response.status_code == 200
    # check that follow up was removed from original chat
    response = client.get(f'/api/chats/{second_penny_chat.id}/follow-ups/')
    assert len(response.data) == 1
    response = client.get(f'/api/chats/{first_penny_chat.id}/follow-ups/')
    follow_ups = response.data
    assert len(follow_ups) == 3
    assert follow_ups[2]['content'] == 'Update follow up'
    assert FollowUp.objects.get(pk=follow_ups[2]['id']).content == 'Update follow up'


@pytest.mark.django_db
def test_partial_update_follow_up(test_chats_1):
    client = APIClient()
    follow_up = test_chats_1[0].follow_ups.first()
    data = {
        'content': 'Update follow up'
    }
    response = client.patch(f'/api/follow-ups/{follow_up.id}/', data=data, format='json')
    assert response.status_code == 200
    response = client.get(f'/api/chats/{test_chats_1[0].id}/follow-ups/')
    follow_ups = response.data
    assert follow_ups[0]['content'] == 'Update follow up'
    assert FollowUp.objects.get(pk=follow_ups[0]['id']).content == 'Update follow up'


@pytest.mark.django_db
def test_delete_follow_up(test_chats_1):
    client = APIClient()
    follow_up = test_chats_1[0].follow_ups.first()
    response = client.delete(f'/api/follow-ups/{follow_up.id}/')
    assert response.status_code == 204
    response = client.get(f'/api/chats/{test_chats_1[0].id}/follow-ups/')
    follow_ups = response.data
    assert len(follow_ups) == 1
    assert follow_ups[0]['id'] != follow_up.id
