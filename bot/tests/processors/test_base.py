from bot.processors.base import (
    Bot,
    Event,
    BotModule,
    event_filter,
    event_filter_factory,
    process_all_events,
    processor_decorator,
)


def test_Bot(mocker):
    processor = mocker.Mock()
    bot = Bot(event_processors=[processor])
    bot(Event({'some': 'event'}))
    assert processor.call_args == mocker.call({'some': 'event'})


def test_BotModule(mocker):
    tester1 = mocker.Mock()
    tester2 = mocker.Mock()
    tester3 = mocker.Mock()
    tester4 = mocker.Mock()

    class MyBotModule(BotModule):
        some_var = 'make sure we don\'t try to call this'

        @event_filter(lambda e: True)  # pass through all events
        def process_events_1(self, event):
            tester1(event)

        @process_all_events
        def process_events_2(self, event):
            tester2(event)

        def not_a_processor_3(self, event):
            tester3(event)

        def not_a_processor_4(self, event):
            tester4(event)

    my_bot_module = MyBotModule()
    event = {'some': 'event'}
    my_bot_module(Event(event))

    assert tester1.call_args == mocker.call(event)
    assert tester2.call_args == mocker.call(event)
    assert not tester3.called
    assert not tester4.called


def test_processor_decorator__as_filter_for_function(mocker):
    tester = mocker.Mock()

    @processor_decorator
    def contains_kitten(event):
        return 'kitten' in event

    @contains_kitten
    def event_processor(event):
        tester()
        assert 'kitten' in event

    assert contains_kitten.__name__ == 'contains_kitten', 'not correctly @wraps-ing the decorated function'
    assert event_processor.__name__ == 'event_processor', 'not correctly @wraps-ing the decorated function'

    event_processor('kitten is cool')
    event_processor('smitten with love')
    assert tester.call_count == 1


def test_processor_decorator__as_filter_for_method(mocker):
    tester = mocker.Mock()

    @processor_decorator
    def contains_kitten(event):
        return 'kitten' in event

    class EventProcessor:
        @contains_kitten
        def process(self, event):
            tester()
            assert 'kitten' in event

    assert contains_kitten.__name__ == 'contains_kitten', 'not correctly @wraps-ing the decorated function'
    assert EventProcessor().process.__name__ == 'process', 'not correctly @wraps-ing the decorated function'

    EventProcessor().process('kitten is cool')
    EventProcessor().process('smitten with love')
    assert tester.call_count == 1


def test_processor_decorator__as_transformer_for_function(mocker):
    tester = mocker.Mock()

    @processor_decorator
    def from_bob(event):
        if event['from'] == 'bob':
            event['extra_data'] = '1234'
            return event

    @from_bob
    def event_processor(event):
        tester()
        assert event['from'] == 'bob'
        assert 'extra_data' in event

    event_processor({'from': 'bob'})
    event_processor({'from': 'jim'})
    assert tester.call_count == 1


def test_processor_decorator__as_transformer_for_method(mocker):
    tester = mocker.Mock()

    @processor_decorator
    def from_bob(event):
        if event['from'] == 'bob':
            event['extra_data'] = '1234'
            return event

    class EventProcessor:
        @from_bob
        def process(self, event):
            tester()
            assert event['from'] == 'bob'
            assert 'extra_data' in event

    EventProcessor().process({'from': 'bob'})
    EventProcessor().process({'from': 'jim'})
    assert tester.call_count == 1


def test_processor_decorator__as_filter_maker(mocker):
    tester = mocker.Mock()

    @processor_decorator
    def from_user(user_name, event):
        return event['from'] == user_name

    @from_user('bob')
    def event_processor(event):
        tester()
        assert event['from'] == 'bob'

    event_processor({'from': 'bob'})
    event_processor({'from': 'jim'})

    # different way of using filter makers
    from_bob = from_user('bob')

    @from_bob
    def event_processor2(event):
        assert event['from'] == 'bob'

    event_processor2({'from': 'bob'})
    event_processor2({'from': 'jim'})
    assert tester.call_count == 1

    # trying with named args (this had a bug at one point)
    from_bob = from_user('bob')

    @from_bob
    def event_processor2(event):
        assert event['from'] == 'bob'

    event_processor2({'from': 'bob'})
    event_processor2({'from': 'jim'})
    assert tester.call_count == 1


def test_processor_decorator__nested_function(mocker):
    # I'm testing this because in an earlier implementation there was a bug when nesting deeper into
    # processor_decorators. Multiple redundant decorators should work the same as a single decorator
    tester = mocker.Mock()

    @processor_decorator
    def from_bob(event):
        return event['from'] == 'bob'

    @from_bob
    @from_bob
    @from_bob
    @from_bob
    def event_processor(event):
        tester()
        assert event['from'] == 'bob'

    event_processor({'from': 'bob'})
    event_processor({'from': 'jim'})
    assert tester.call_count == 1


def test_processor_decorator__nested_method(mocker):
    # Ref test_processor_decorator__nested_function, there was a related, but different bug with applying nested
    # decorators to methods
    tester = mocker.Mock()

    @processor_decorator
    def from_bob(event):
        return event['from'] == 'bob'

    class EventProcessor:
        @from_bob
        @from_bob
        @from_bob
        @from_bob
        def process(self, event):
            tester()
            assert event['from'] == 'bob'

    EventProcessor().process({'from': 'bob'})
    EventProcessor().process({'from': 'jim'})
    assert tester.call_count == 1


def test_processor_decorator__decorating_bot_modules(mocker):
    tester = mocker.Mock()

    @processor_decorator
    def from_bob(event):
        return event['from'] == 'bob'

    class SomeBotModule(BotModule):
        @process_all_events
        def processor(self, event):
            tester()
            assert event['from'] == 'bob'

    module = from_bob(SomeBotModule())  # since the bot module is just a processor, it will also work like the above

    module({'from': 'bob'})
    module({'from': 'jim'})
    assert tester.call_count == 1


def test_event_filter(mocker):
    tester = mocker.Mock()

    @event_filter(lambda e: e['call_me'])
    def my_func(event):
        tester(event)

    assert my_func.__name__ == 'my_func'  # otherwise we're not transferring the function properties correctly

    my_func(Event({'call_me': False}))
    assert tester.called is False

    my_func(Event({'call_me': True}))
    assert tester.call_args == mocker.call({'call_me': True})


def test_event_filter_factory(mocker):
    tester = mocker.Mock()

    @event_filter_factory
    def is_color(color):
        def filter_func(event):
            return event['color'] == color
        return filter_func

    assert is_color.__name__ == 'is_color'  # otherwise we're not transferring the function properties correctly

    @is_color('green')
    def my_func(event):
        tester(event)

    assert my_func.__name__ == 'my_func'

    my_func(Event({'color': 'red'}))
    assert tester.called is False

    my_func(Event({'color': 'green'}))
    assert tester.call_args == mocker.call({'color': 'green'})
