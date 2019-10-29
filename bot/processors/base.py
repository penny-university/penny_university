from functools import (
    partial,
    wraps,
)

PROCESSOR_DEFINITION = (
    'A processor takes only a single argument (besides, the possibility of `self` or `cls`). This represents the event '
    'payload. This argument must be named "event".'
)


class Event(dict):  # TODO remove this and just pass around dict events
    """I assume a simple model for a event for now."""
    def __init__(self, *args, **kwargs):
        super(Event, self).__init__(*args, **kwargs)


def process_all_events(func):
    """Decorator for marking a function as an event processor.

    Functions decorated by this will receive all messages unfiltered.
    """
    func.event_processor = True
    return func


def event_processor_decorator(transform_filter_func):
    """Makes an event processor decorator out of the function that it decorates.

    An event processor is a function that takes an event and does something with it. It can be any callable including
    instance methods and class methods. The only constraint is that it should have a single input representing an event
    and that input must be name "event". There is no constraint on what an event is at all.

    In its most basic form, a transform_filter_func takes an event and returns True if the filter applies to that event.
    Such a transform_filter_func decorated by event_processor_decorator itself _becomes_ a decorator that can modify
    processors and filter their events. Example:

    ```
    @processor_filter
    def contains_kittens(event):
        return 'kittens' in event.text
    ```

    Now `contains_kittens` is a processor decorator that can be used to filter out all events except those that
    contain "kittens".

    ```
    @contains_kittens
    def event_processor(event):
        assert 'kitten' in event.text, 'this should never fail'
    ```

    `@contains_kittens` could also be applied to methods of a class.


    A transform_filter_func can also act as a transformer that _mutates_ an event to anything else. For example

    ```
    @processor_filter
    def frightens_kittens(event):
        if 'kittens' in event.text:
            event.text = event.text + " ... BOO!"
            return event
    ```

    With this transform_filter_func, the following assertions should hold for any event given to the event processor:

    ```
    @contains_kittens
    def event_processor(event):
        assert 'kitten' in event.text, 'this should never fail'
        assert 'BOO' in event.text, 'this should never fail'
    ```

    For more information see the `test_event_processor_decorator__*` tests.
    """

    @wraps(transform_filter_func)
    def decorator(*dec_args, **dec_kwargs):
        if dec_args and callable(dec_args[0]):
            processor = dec_args[0]

            @wraps(processor)
            def wrapped_processor(*args, **kwargs):
                # At this point, you think you are calling the original processor which can only have a
                # single argument called "event". But, A) "event" can be passed in as an argument or a key word
                # argument, and B) the processor can be a method or classmethod, in which case a hidden "self" or "cls"
                # argument will be passed in first. This forms a matrix of 4 valid possibilities.
                self_or_class = None
                event = None
                if kwargs:
                    assert len(kwargs) == 1, PROCESSOR_DEFINITION
                    assert 'event' in kwargs, PROCESSOR_DEFINITION
                    event = kwargs['event']
                if args:
                    if event:
                        assert len(args) <= 1, PROCESSOR_DEFINITION
                        if len(args) == 1:
                            self_or_class = args[0]
                    else:
                        assert len(args) <= 2, PROCESSOR_DEFINITION
                        if len(args) == 2:
                            self_or_class = args[0]
                        event = args[-1]  # last argument is the "event"

                try:
                    new_event = transform_filter_func(event=event)
                    if new_event is True:
                        if self_or_class:
                            return processor(self_or_class, event=event)
                        else:
                            return processor(event=event)
                    elif new_event:
                        if self_or_class:
                            return processor(self_or_class, event=new_event)
                        else:
                            return processor(event=new_event)
                    else:
                        return None
                except TypeError as e:
                    if "got an unexpected keyword argument 'event'" in e.args and e.args[0]:
                        raise TypeError(
                            'event_processors or transform_filter_func must have an "event" argument '
                            'which carries the event payload'
                        )

            return wrapped_processor
        else:
            # new_filter_func _kinda_ wraps filter_func but it also changes the signature
            # so I'm now applying @wraps here - I'm just hoping `partial` does the correct thing
            # partial has a `func` attribute that points to the function that was partially applied
            new_filter_func = partial(transform_filter_func, *dec_args, **dec_kwargs)
            return event_processor_decorator(new_filter_func)

    return decorator


def event_filter(filter_func):
    """Decorator for turning a function into an event processor decorator.


    The decorated function takes an event and returns True if the event should be processed and False otherwise.

    Ex:

    ```
    @event_filter
    def is_happy_event(event):
        return event.get('mood','not_happy') == 'happy'
    ```

    Given this you can decorate event processors with it:

    ```
    @is_happy_event
    def process_only_happy_events(event):
        print("I'm glad you're so happy.")
    ```
    """
    def decorator(func):
        func.event_processor = True
        @wraps(func)
        def wrapper(*args):
            event = args[0] if isinstance(args[0], Event) else args[1]  # b/c 0 arg is `self`
            if filter_func(event):
                return func(*args)
        return wrapper
    return decorator


def event_filter_factory(filter_func_maker):
    """Decorator for turning a function factory into and event processor decorator.

    The decorated function takes any parameters needed to create an event filter and returns that event filter

    Ex:

    ```
    @event_filter_factory
    def is_event_with_mood(mood):
        def filter_func(event):
            return event.get('mood') == mood
        return filter_func
    ```

    Given this you can decorate event processors with it:
    ```
    @is_event_with_mood('happy')
    def process_only_happy_events(event):
        print("I'm glad you're so happy.")

    @is_event_with_mood('sad')
    def process_only_happy_events(event):
        print("I'm sorry you're so sad.")
    ```
    """
    @wraps(filter_func_maker)
    def decorator_creator(*args, **kwargs):
        filter_func = filter_func_maker(*args, **kwargs)
        return event_filter(filter_func)
    return decorator_creator


class EventProcessor:
    """Base class for all event processors.

    All event processors must be callable.
    """
    def __call__(self, event):
        # got to have a call method
        raise RuntimeError('Event Processor must be a callable.')


class Bot(EventProcessor):
    """Base class for all Bots.

    Bots are initialized with a list of event_processors and for each event passed to the bot it passes it on to the
    event_processors.
    """
    def __init__(self, event_processors):
        self.event_processors = event_processors

    def __call__(self, event):
        for event_processor in self.event_processors:
            event_processor(event)


class BotModule(EventProcessor):
    """Base class for all BotModules.

    Given an event, the BotModule will pass the event to all functions where func.event_processor is True. (This is
    true for any function decorated with `process_all_events` or with any decorator created using `event_filter` and
    `event_filter_factory`.) It is the responsibility of the BotModule designer to create appropriate filter decorators.

    Ex:
    ```
    class GreetingBotModule(BotModule):
        @is_event_subtype('channel_join')
        def welcome_user(self, event):
            self.existing_users.append(event['user'])
    ```
    """
    def __call__(self, event):
        member_names = [member_name for member_name in dir(self)]
        members = [getattr(self, member_name) for member_name in member_names]
        methods = [member for member in members if hasattr(member, 'event_processor')]
        for method in methods:
            method(event)
