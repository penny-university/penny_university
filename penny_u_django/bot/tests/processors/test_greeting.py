from bot.processors.base import Event
from bot.processors.greeting import GreetingBotModule


def test_greeting(mocker):
    slack = mocker.Mock()
    greeter = GreetingBotModule(slack)
    GreetingBotModule.GREETING_MESSAGE = 'welcome'
    event = Event({
        "user": "U42HCBFEF",
        "type": "message",
        "subtype": "channel_join",
        "ts": "1557281569.001300",
        "text": "<@U42HCBFEF> has joined the channel",
        "channel": "C41G02RK4",  # general
        "event_ts": "1557281569.001300",
        "channel_type": "channel"
    })
    greeter(event)
    assert slack.chat_postMessage.call_args == mocker.call(channel='U42HCBFEF', text='welcome')


def test_greeting_wrong_channel(mocker):
    slack = mocker.Mock()
    greeter = GreetingBotModule(slack)
    event = Event({
        "user": "U42HCBFEF",
        "type": "message",
        "subtype": "channel_join",
        "ts": "1557281569.001300",
        "text": "<@U42HCBFEF> has joined the channel",
        "channel": "WRONGCHANNELHERE",
        "event_ts": "1557281569.001300",
        "channel_type": "channel"
    })
    greeter(event)
    assert not slack.chat.post_message.called


def test_greeting_wrong_type(mocker):
    slack = mocker.Mock()
    greeter = GreetingBotModule(slack)
    event = Event({
        "user": "U42HCBFEF",
        "type": "message",
        "subtype": "wrong_type",
        "ts": "1557281569.001300",
        "text": "<@U42HCBFEF> has joined the channel",
        "channel": "CHCM2MFHU",
        "event_ts": "1557281569.001300",
        "channel_type": "channel"
    })
    greeter(event)
    assert not slack.chat.post_message.called
