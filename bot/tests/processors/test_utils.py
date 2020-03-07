from bot.processors.greeting import has_event_type


def test_has_event_type():
    @has_event_type('fruit.apple')
    def fruit_apple_handler(event):
        return True

    @has_event_type('*.apple')
    def star_apple_handler(event):
        return True

    @has_event_type('fruit.*')
    def fruit_star_handler(event):
        return True

    @has_event_type('fruit')
    def fruit_handler(event):
        return True

    @has_event_type('*.*')
    def star_star_handler(event):
        return True

    @has_event_type(['fruit', 'vegetable'])
    def fruit_or_vegetable_handler(event):
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

    # true
    assert fruit_apple_handler(fruit_apple_event)
    assert star_apple_handler(fruit_apple_event)
    assert fruit_star_handler(fruit_apple_event)
    assert fruit_handler(fruit_apple_event)  # unspecified subtype is same as '*'
    assert star_star_handler(fruit_apple_event)
    assert fruit_star_handler(fruit_event)
    assert fruit_handler(fruit_event)
    assert fruit_or_vegetable_handler(fruit_event)

    # false
    assert not fruit_apple_handler(fruit_banana_event)
    assert not fruit_apple_handler(computer_apple_event)
    assert not star_apple_handler(fruit_banana_event)
    assert not fruit_star_handler(computer_apple_event)
    assert not fruit_star_handler(computer_event)
    assert not fruit_apple_handler(fruit_event)
    assert not fruit_or_vegetable_handler(computer_event)

    # if has_event_type is used, then it's assumed that event must be typed
    assert not star_star_handler(non_typed_event)
