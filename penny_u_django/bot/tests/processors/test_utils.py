from bot.processors.base import Event
from bot.processors.greeting import is_event_type

#
# @event_filter_factory
# def is_event_type(type):
#     def filter_func(event):
#         return event['type'] == type
#
#     return filter_func
#

def test_is_event_type(mocker):
    fruit_apple_tester = mocker.Mock()
    star_apple_tester = mocker.Mock()
    fruit_star_tester = mocker.Mock()
    star_star_tester = mocker.Mock()

    @is_event_type('fruit.apple')
    def fruit_apple_handler(event):
        fruit_apple_tester = mocker.Mock()

    @is_event_type('*.apple')
    def star_apple_handler(event):
        star_apple_tester = mocker.Mock()

    @is_event_type('fruit.*')
    def fruit_star_handler(event):
        fruit_star_tester = mocker.Mock()

    @is_event_type('*.*')
    def star_star_handler(event):
        star_star_tester = mocker.Mock()

    fruit_apple_event = {
        "type": "fruit",
        "subtype": "apple",
    }

    fruit_banana_event = {
        "type": "fruit",
        "subtype": "banana",
    }

    computer_apple_event = {
        "type": "computer",
        "subtype": "apple",
    }

    import ipdb;ipdb.set_trace()
    fruit_apple_handler(Event(fruit_apple_event))
    assert fruit_apple_tester.called == True

