from bot.processors.base import Event
from bot.processors.greeting import is_event_type


def test_is_event_type():
    @is_event_type('fruit.apple')
    def fruit_apple_handler(event):
        return True

    @is_event_type('*.apple')
    def star_apple_handler(event):
        return True

    @is_event_type('fruit.*')
    def fruit_star_handler(event):
        return True

    @is_event_type('fruit')
    def fruit_handler(event):
        return True

    @is_event_type('*.*')
    def star_star_handler(event):
        return True

    fruit_apple_event = {
        "type": "fruit",
        "subtype": "apple",
    }

    fruit_banana_event = {
        "type": "fruit",
        "subtype": "banana",
    }

    fruit_event = {
        "type": "fruit",
    }

    computer_event = {
        "type": "computer",
    }

    computer_apple_event = {
        "type": "computer",
        "subtype": "apple",
    }

    non_typed_event = {}

    assert fruit_apple_handler(Event(fruit_apple_event))
    assert star_apple_handler(Event(fruit_apple_event))
    assert fruit_star_handler(Event(fruit_apple_event))
    assert fruit_handler(Event(fruit_apple_event))  # unspecified subtype is same as '*'
    assert star_star_handler(Event(fruit_apple_event))
    assert fruit_star_handler(Event(fruit_event))
    assert fruit_handler(Event(fruit_event))

    assert not fruit_apple_handler(Event(fruit_banana_event))
    assert not fruit_apple_handler(Event(computer_apple_event))
    assert not star_apple_handler(Event(fruit_banana_event))
    assert not fruit_star_handler(Event(computer_apple_event))
    assert not fruit_star_handler(Event(computer_event))
    assert not fruit_apple_handler(Event(fruit_event))

    # if is_event_type is used, then it's assumed that event must be typed
    assert not star_star_handler(Event(non_typed_event))
