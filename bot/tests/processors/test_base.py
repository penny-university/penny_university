from bot.processors.base import (
    Bot,
    BotModule,
    event_processor_decorator,
)


def test_Bot(mocker):
    processor = mocker.Mock()
    bot = Bot(event_processors=[processor])
    bot({'some': 'event'})
    assert processor.call_args == mocker.call({'some': 'event'})


def test_BotModule(mocker):
    tester1 = mocker.Mock()
    tester2 = mocker.Mock()

    class MyBotModule(BotModule):
        processors = [
            'process_events',
        ]

        some_var = 'make sure we don\'t try to call this'

        def process_events(self, event):
            tester1(event)

        def not_a_processor(self, event):
            tester2(event)

    my_bot_module = MyBotModule()
    event = {'some': 'event'}
    my_bot_module(event)

    assert tester1.call_args == mocker.call(event)
    assert not tester2.called


def test_event_processor_decorator__as_filter_for_function(mocker):
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__as_filter_for_method(mocker):
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__as_transformer_for_function(mocker):
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__as_transformer_for_method(mocker):
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__as_filter_maker(mocker):
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__nested_function(mocker):
    # I'm testing this because in an earlier implementation there was a bug when nesting deeper into
    # event_processor_decorators. Multiple redundant decorators should work the same as a single decorator
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__nested_method(mocker):
    # Ref test_event_processor_decorator__nested_function, there was a related, but different bug with applying nested
    # decorators to methods
    tester = mocker.Mock()

    @event_processor_decorator
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


def test_event_processor_decorator__decorating_bot_modules(mocker):
    tester = mocker.Mock()

    @event_processor_decorator
    def from_bob(event):
        return event['from'] == 'bob'

    class SomeBotModule(BotModule):
        processors = ['processor']

        def processor(self, event):
            tester()
            assert event['from'] == 'bob'

    module = from_bob(SomeBotModule())  # since the bot module is just a processor, it will also work like the above

    module({'from': 'bob'})
    module({'from': 'jim'})
    assert tester.call_count == 1
