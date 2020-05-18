import pytest

from users.models import SocialProfile
from bot.processors.greeting import GreetingBotModule


def test_greeting(mocker):
    slack = mocker.Mock()
    greeter = GreetingBotModule(slack)
    GreetingBotModule.GREETING_MESSAGE = 'welcome'
    event = {
        'user': 'U42HCBFEF',
        'type': 'message',
        'subtype': 'channel_join',
        'ts': '1557281569.001300',
        'text': '<@U42HCBFEF> has joined the channel',
        'channel': 'GENERAL',
        'event_ts': '1557281569.001300',
        'channel_type': 'channel'
    }
    greeting_blocks = mocker.patch('bot.processors.greeting.greeting_blocks', return_value='welcome')
    welcome_room_blocks = mocker.patch('bot.processors.greeting.welcome_room_blocks', return_value='arrive')
    notify_admins = mocker.patch('bot.processors.greeting.notify_admins')
    filters_channel_lookup = mocker.patch('bot.processors.filters.channel_lookup', return_value='GENERAL')
    greeting_channel_lookup = mocker.patch('bot.processors.greeting.channel_lookup', return_value='WELCOME_CHANNEL')
    with greeting_blocks, welcome_room_blocks, notify_admins, filters_channel_lookup, greeting_channel_lookup:
        greeter(event)
    slack.chat_postMessage.assert_has_calls([
        mocker.call(channel='U42HCBFEF', blocks='welcome'),
        mocker.call(channel='WELCOME_CHANNEL', blocks='arrive')
    ], any_order=True)
    notify_admins.assert_called()


def test_greeting_wrong_channel(mocker):
    slack = mocker.Mock()
    greeter = GreetingBotModule(slack)
    event = {
        'user': 'U42HCBFEF',
        'type': 'message',
        'subtype': 'channel_join',
        'ts': '1557281569.001300',
        'text': '<@U42HCBFEF> has joined the channel',
        'channel': 'WRONGCHANNELHERE',
        'event_ts': '1557281569.001300',
        'channel_type': 'channel'
    }
    with mocker.patch('bot.processors.filters.channel_lookup', return_value='SOME_WRONG_CHANNEL'):
        greeter(event)
    assert not slack.chat.post_message.called


def test_greeting_wrong_type(mocker):
    slack = mocker.Mock()
    greeter = GreetingBotModule(slack)
    event = {
        'user': 'U42HCBFEF',
        'type': 'message',
        'subtype': 'wrong_type',
        'ts': '1557281569.001300',
        'text': '<@U42HCBFEF> has joined the channel',
        'channel': 'CHCM2MFHU',
        'event_ts': '1557281569.001300',
        'channel_type': 'channel'
    }
    with mocker.patch('bot.processors.filters.channel_lookup', return_value='SOME_WRONG_CHANNEL'):
        greeter(event)
    assert not slack.chat.post_message.called


@pytest.mark.django_db
def test_show_interests_dialog(mocker):
    slack = mocker.Mock()
    bot_module = GreetingBotModule(slack)
    event = {
        'type': 'block_actions',
        'trigger_id': 'whatevs',
        'actions': [
            {
                'action_id': 'open_interests_dialog'
            }
        ],
        'user': {
            'id': 0
        }
    }

    with mocker.patch('bot.processors.greeting.onboarding_blocks', return_value='welcome'):
        bot_module(event)
    assert slack.dialog_open.call_args == mocker.call(dialog='welcome', trigger_id='whatevs')


@pytest.mark.django_db
def test_show_interests_dialog_existing_user(mocker):
    slack = mocker.Mock()
    bot_module = GreetingBotModule(slack)

    SocialProfile.objects.create(slack_id='0', topics_to_learn='django')

    event = {
        'type': 'block_actions',
        'trigger_id': 'whatevs',
        'actions': [
            {
                'action_id': 'open_interests_dialog'
            }
        ],
        'user': {
            'id': 0
        }
    }

    bot_module(event)
    assert slack.dialog_open.call_args[1]['dialog']['elements'][0]['name'] == 'topics_to_learn'
    assert slack.dialog_open.call_args[1]['dialog']['elements'][0]['value'] == 'django'
    assert slack.dialog_open.call_args[1]['dialog']['elements'][1]['name'] == 'topics_to_share'
    assert slack.dialog_open.call_args[1]['dialog']['elements'][1]['value'] == ''


@pytest.mark.django_db
def test_submit_interests(mocker):
    slack = mocker.Mock()
    bot_module = GreetingBotModule(slack)

    # Create initial response
    event = {
        'type': 'dialog_submission',
        'callback_id': 'interests',
        'user': {'id': 'SOME_USER_ID'},
        'submission': {
            'metro_name': 'SOME_METRO',
            'topics_to_learn': 'SOME_LEARNINGS',
            'topics_to_share': '',  # user omitted answer
            'how_you_learned_about_pennyu': 'SOME_REFERER',
        }
    }

    slack_resp = mocker.Mock()
    slack.users_info.return_value = slack_resp
    slack_resp.data = {
        'user': {
            'profile': {'email': 'SOME_EMAIL'},
            'name': 'SOME_SLACK_NAME',
            'real_name': 'SOME_REAL_NAME',
        }
    }
    bot_module(event)

    profile = SocialProfile.objects.get(slack_id='SOME_USER_ID')

    initial_created = profile.created
    initial_updated = profile.updated

    assert profile.email == 'SOME_EMAIL'
    assert profile.slack_id == 'SOME_USER_ID'
    assert profile.display_name == 'SOME_SLACK_NAME'
    assert profile.real_name == 'SOME_REAL_NAME'
    assert profile.metro_name == 'SOME_METRO'
    assert profile.topics_to_learn == 'SOME_LEARNINGS'
    assert profile.topics_to_share == ''
    assert profile.how_you_learned_about_pennyu == 'SOME_REFERER'
    assert profile.created
    assert profile.updated

    assert 'interested in learning' in slack.chat_postMessage.call_args_list[0][1]['text']
    assert 'SOME_LEARNINGS' in slack.chat_postMessage.call_args_list[0][1]['text']
    assert 'knows a thing' not in slack.chat_postMessage.call_args_list[0][1]['text']

    # create updated response
    event = {
        'type': 'dialog_submission',
        'callback_id': 'interests',
        'user': {'id': 'SOME_USER_ID'},
        'submission': {
            'metro_name': 'SOME_OTHER_METRO',
            'topics_to_learn': 'SOME_OTHER_LEARNINGS',
            'topics_to_share': 'SOME_OTHER_TEACHINGS',
            'how_you_learned_about_pennyu': 'SOME_OTHER_REFERER',
        }
    }

    bot_module(event)

    profile = SocialProfile.objects.get(slack_id='SOME_USER_ID')

    assert profile.email == 'SOME_EMAIL'
    assert profile.slack_id == 'SOME_USER_ID'
    assert profile.display_name == 'SOME_SLACK_NAME'
    assert profile.real_name == 'SOME_REAL_NAME'
    assert profile.metro_name == 'SOME_OTHER_METRO'
    assert profile.topics_to_learn == 'SOME_OTHER_LEARNINGS'
    assert profile.topics_to_share == 'SOME_OTHER_TEACHINGS'
    assert profile.how_you_learned_about_pennyu == 'SOME_OTHER_REFERER'
    assert profile.created == initial_created
    assert profile.updated > initial_updated
