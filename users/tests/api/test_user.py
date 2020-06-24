import pytest

from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token

from users.models import User
from pennychat.models import FollowUp
from users.tokens import verification_token_generator


@pytest.mark.django_db
def test_register_user(mocker):
    client = APIClient()
    data = {
        'email': 'test@profile.com',
        'password': 'password',
        'first_name': 'test',
        'last_name': 'profile',
    }
    with mocker.patch.object(User, 'send_verification_email'):
        response = client.post('/api/auth/register/', data=data, format='json')
    assert response.status_code == 204
    user = User.objects.get(email='test@profile.com')
    assert not user.is_verified
    assert user.has_usable_password()
    assert user.first_name == 'test' and user.last_name == 'profile'


@pytest.mark.django_db
def test_register_user_with_follow_up(mocker, test_chat_2):
    client = APIClient()
    content = 'follow up text'
    data = {
        'email': 'test@profile.com',
        'password': 'password',
        'first_name': 'test',
        'last_name': 'profile',
        'follow_up': {
            'chat_id': test_chat_2.id,
            'content': content
        }
    }
    with mocker.patch.object(User, 'send_verification_email'):
        response = client.post('/api/auth/register/', data=data, format='json')
    assert response.status_code == 204
    print("ALL FOLLOWUPS", FollowUp.objects.all())
    follow_up = FollowUp.objects.filter(content=content)
    assert follow_up.count() == 1


@pytest.mark.django_db
def test_register_user__exists_with_unusable_password(test_user, mocker):
    test_user.set_unusable_password()
    test_user.save()
    client = APIClient()
    data = {
        'email': 'test@profile.com',
        'password': 'password',
        'first_name': 'existing',
        'last_name': 'person',
    }
    with mocker.patch.object(User, 'send_verification_email'):
        response = client.post('/api/auth/register/', data=data, format='json')
    assert response.status_code == 204
    user = User.objects.get(email='test@profile.com')
    assert not user.is_verified
    assert user.has_usable_password()
    assert user.first_name == 'existing'
    assert user.last_name == 'person'


@pytest.mark.django_db
def test_verify_email(test_user):
    client = APIClient()
    test_user.save()
    data = {
        'token': verification_token_generator.make_token(test_user),
        'email': test_user.email,
    }
    response = client.post('/api/auth/verify/', data=data, format='json')
    test_user.refresh_from_db()
    assert response.status_code == 204
    assert test_user.is_verified


@pytest.mark.django_db
def test_verify_email__invalid_token(test_user):
    client = APIClient()
    data = {
        'email': test_user.email
    }
    response = client.post('/api/auth/verification-email/', data=data, format='json')
    assert response.status_code == 204


@pytest.mark.django_db
def test_send_verification_email(test_user, test_chat_2):
    client = APIClient()
    content = 'send verification follow up text'
    data = {
        'email': test_user.email,
        'follow_up': {
            'chat_id': test_chat_2.id,
            'content': content
        }
    }
    response = client.post('/api/auth/verification-email/', data=data, format='json')
    assert response.status_code == 204
    follow_up = FollowUp.objects.filter(content=content)
    assert follow_up.count() == 1


@pytest.mark.django_db
def test_send_verification_email__user_does_not_exist(test_user):
    client = APIClient()
    data = {
        'email': 'notregistered@test.com'
    }
    response = client.post('/api/auth/verification-email/', data=data, format='json')
    assert response.status_code == 404


@pytest.mark.django_db
def test_checking_user_exists(test_user):
    client = APIClient()
    test_user.is_verified = True
    test_user.save()
    data_does_exist = {
        'email': 'test@profile.com',
    }
    data_does_not_exist = {
        'email': 'fail@profile.com',
    }
    response = client.post('/api/auth/exists/', data_does_exist, format='json')
    assert response.status_code == 204

    response = client.post('/api/auth/exists/', data_does_not_exist, format='json')
    assert response.status_code == 404


@pytest.mark.django_db
def test_checking_user_exists__not_verified(test_user):
    client = APIClient()
    data = {
        'email': 'test@profile.com',
    }
    response = client.post('/api/auth/exists/', data, format='json')
    assert response.status_code == 403


@pytest.mark.django_db
def test_checking_user_exists__with_unusable_password():
    User.objects.create_user(username='test@user.com', email='test@user.com')
    client = APIClient()
    data = {
        'email': 'test@user.com'
    }
    response = client.post('/api/auth/exists/', data, format='json')
    assert response.status_code == 404


@pytest.mark.django_db
def test_user_log_in__verified_and_protected_request(test_social_profile, test_user):
    client = APIClient()
    test_user.is_verified = True
    test_user.save()
    test_social_profile.user = test_user
    test_social_profile.save()
    data = {
        'email': 'test@profile.com',
        'password': 'password'
    }
    response = client.post('/api/auth/login/', data=data, format='json')
    assert response.status_code == 200
    client.credentials(HTTP_AUTHORIZATION='Token ' + response.data['key'])
    data = {
        'title': 'Create Chat',
        'description': 'Testing creating a chat',
        'date': '2020-01-01T00:00'
    }
    response = client.post('/api/chats/', data=data, format='json')
    assert response.status_code == 201


@pytest.mark.django_db
def test_user_log_in__not_verified(test_user):
    client = APIClient()
    data = {
        'email': 'test@profile.com',
        'password': 'password'
    }
    response = client.post('/api/auth/login/', data=data, format='json')
    assert response.status_code == 400


@pytest.mark.django_db
def test_user_log_in__not_verified_with_follow_up(test_user, test_chat_2):
    client = APIClient()
    content = 'login follow up text'
    data = {
        'email': 'test@profile.com',
        'password': 'password',
        'follow_up': {
            'chat_id': test_chat_2.id,
            'content': content
        }
    }
    response = client.post('/api/auth/login/', data=data, format='json')
    assert response.status_code == 400
    follow_up = FollowUp.objects.filter(content=content)
    assert follow_up.count() == 1


@pytest.mark.django_db
def test_user_log_in__verified_with_follow_up(test_user, test_chat_2):
    client = APIClient()
    test_user.is_verified = True
    test_user.save()
    content = 'verified login follow up text'
    data = {
        'email': 'test@profile.com',
        'password': 'password',
        'follow_up': {
            'chat_id': test_chat_2.id,
            'content': content
        }
    }
    response = client.post('/api/auth/login/', data=data, format='json')
    assert response.status_code == 200
    follow_up = FollowUp.objects.filter(content=content)
    assert follow_up.count() == 1


@pytest.mark.django_db
def test_user_log_in__failure_with_follow_up(test_user):
    client = APIClient()
    content = 'failure login follow up text'
    data = {
        'email': 'test@profile.com',
        'password': 'wrong-password',
        'follow_up': {
            'chat_id': 1,
            'content': content
        }
    }
    response = client.post('/api/auth/login/', data=data, format='json')
    assert response.status_code == 400
    follow_up = FollowUp.objects.filter(content=content)
    assert follow_up.count() == 0


@pytest.mark.django_db
def test_user_detail(test_user):
    client = APIClient()
    response = client.get(f'/api/users/{test_user.id}/')
    assert response.data['first_name'] == 'test'
    assert response.data['last_name'] == 'user'


@pytest.mark.django_db
def test_update_user_detail(test_user):
    data = {
        'first_name': 'Bill',
        'last_name': 'Update',
        'email': 'email@update.com'
    }
    token = Token.objects.create(user=test_user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    client.put(f'/api/users/{test_user.id}/', data=data, format='json')
    test_user.refresh_from_db()
    assert test_user.first_name == 'Bill'
    assert test_user.last_name == 'Update'
    assert test_user.email == 'email@update.com'


@pytest.mark.django_db
def test_update_user_detail__wrong_user(test_user):
    wrong_user = User.objects.create_user(
        username='wrong@user.com',
        password='password',
    )
    data = {
        'first_name': 'Bill',
        'last_name': 'Update'
    }
    token = Token.objects.create(user=wrong_user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.put(f'/api/users/{test_user.id}/', data=data, format='json')
    assert response.status_code == 403


@pytest.mark.django_db
def test_partial_user_detail(test_user):
    data = {
        'first_name': 'Bill'
    }
    token = Token.objects.create(user=test_user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    client.patch(f'/api/users/{test_user.id}/', data=data, format='json')
    test_user.refresh_from_db()
    assert test_user.first_name == 'Bill'
    assert test_user.last_name == 'user'


@pytest.mark.django_db
def test_partial_user_detail__wrong_user(test_user):
    wrong_user = User.objects.create_user(
        username='wrong@user.com',
        password='password',
    )
    data = {
        'first_name': 'Bill'
    }
    token = Token.objects.create(user=wrong_user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    response = client.patch(f'/api/users/{test_user.id}/', data=data, format='json')
    assert response.status_code == 403
