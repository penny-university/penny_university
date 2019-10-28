from functools import (
    partial,
    wraps,
)

PROCESSOR_DEFINITION = (
    'a processor (besides, self or cls) takes only a single argument called "event" which represents the event payload'
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


def processor_decorator(transform_filter_func):
    """Makes a processor decorator out of the function that it decorates.

    In its most basic form, a transform_filter_func takes an event and returns True if the filter applies to that event.
    Such a transform_filter_func decorated by processor_decorator becomes a decorator that can modify processors and
    filter their events. Example:

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
        assert 'kitten' in event['text'], 'this should never fail'
    ```

    """  # TODO finish

    @wraps(transform_filter_func)
    def decorator(*dec_args, **dec_kwargs):
        if dec_args and callable(dec_args[0]):
            processor = dec_args[0]

            @wraps(processor)
            def wrapped_processor(*args, **kwargs):
                if len(args) == 0 and 'event' in kwargs and len(kwargs) == 1:
                    # by the time you get here, you think you are calling the original proce
                    args = (kwargs['event'],)
                    kwargs = {}
                assert not kwargs, PROCESSOR_DEFINITION
                assert 1 <= len(args) <= 2, PROCESSOR_DEFINITION
                try:
                    if len(args) == 1:
                        event = args[0]
                        new_event = transform_filter_func(event=event)
                        if new_event is True:
                            return processor(event=event)
                        elif new_event:
                            return processor(event=new_event)
                        else:
                            return None
                    else:  # len(args) == 2
                        event = args[1]
                        new_event = transform_filter_func(event=event)
                        if new_event is True:
                            return processor(args[0], event=event)
                        elif new_event:
                            return processor(args[0], event=new_event)
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
            # partial has a `func` attribute
            new_filter_func = partial(transform_filter_func, *dec_args, **dec_kwargs)
            return processor_decorator(new_filter_func)

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
