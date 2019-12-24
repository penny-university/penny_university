import pytest
from datetime import datetime
from pytz import timezone, utc

from bot.processors.pennychat import PennyChatBotModule
from pennychat.models import PennyChat

TZ = timezone('America/Chicago')


def create_penny_chat():
    date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=utc)
    chat = PennyChat.objects.create(
        status=PennyChat.DRAFT_STATUS,
        user_tz='America/Chicago',
        template_channel='channel',
        date=date,
        view='view',
    )
    return chat.id


@pytest.mark.django_db
def test_date_select(mocker):
    slack = mocker.Mock()
    bot_module = PennyChatBotModule(slack)

    chat_id = create_penny_chat()

    event = {
        'type': 'block_actions',
        'trigger_id': 'trigger',
        'view': {
            'id': 'view'
        },
        'actions': [
            {
                'action_id': 'penny_chat_date',
                'selected_date': '2019-01-01'
            }
        ],
        'user': {
            'id': 'user'
        }
    }

    bot_module(event)

    penny_chat = PennyChat.objects.get(id=chat_id)
    assert penny_chat.date.astimezone(TZ).date() == datetime(2019, 1, 1).date()


@pytest.mark.django_db
def test_time_select(mocker):
    slack = mocker.Mock()
    bot_module = PennyChatBotModule(slack)

    chat_id = create_penny_chat()

    event = {
        'type': 'block_actions',
        'trigger_id': 'trigger',
        'view': {
            'id': 'view'
        },
        'actions': [
            {
                'action_id': 'penny_chat_time',
                'selected_option': {
                    'value': '12:00 PM'
                }
            }
        ],
        'user': {
            'id': 'user'
        }
    }

    bot_module(event)
    penny_chat = PennyChat.objects.get(id=chat_id)
    test_time = datetime.now().replace(hour=12, minute=0, second=0, microsecond=0).time()
    assert penny_chat.date.astimezone(TZ).time() == test_time
