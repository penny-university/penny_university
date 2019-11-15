from functools import (
    partial,
    wraps,
)

PROCESSOR_DEFINITION = (
    'A processor takes only a single argument (besides, the possibility of `self` or `cls`). This represents the event '
    'payload. This argument must be named "event".'
)


def event_processor_decorator(transform_filter_func):
    """Makes an event processor decorator out of the function that it decorates.

    An event processor is a function that takes an event and does something with it. It can be any callable including
    instance methods and class methods. The only constraint is that it should have a single input representing an event
    and that input must be name "event". There is no constraint on what an event is at all.

    In its most basic form, a transform_filter_func takes an event and returns True if the filter applies to that event.
    Such a transform_filter_func decorated by event_processor_decorator itself _becomes_ a decorator that can modify
    processors and filter their events. Examples:

    ```
    @event_processor_decorator
    def contains_kitten(event):
        return 'kitten' in event.text
    ```

    Now `contains_kittens` is a processor decorator that can be used to filter out all events except those that
    contain "kitten".

    ```
    @contains_kitten
    def event_processor(event):
        assert 'kitten' in event.text, 'this should never fail'
    ```

    `@contains_kitten` could also be applied to methods of a class.

    You can also make parameterized event_processor_decorators like this:

    ```
    @event_processor_decorator
    def contains_string(string, event):
        return string in event.text
    ```

    This can be applied to processors more generically because of the parameterization.

    ```
    @contains_string('kitten')
    def event_processor(event):
        assert 'kitten' in event.text, 'this should never fail'
    ```

    This would have the same effect as `@contains_kitten` above.


    Finally, a transform_filter_func can also act as a transformer that _mutates_ an event to anything else. For example

    ```
    @event_processor_decorator
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
                    if e.args and "got an unexpected keyword argument 'event'" in e.args[0]:
                        raise TypeError(
                            'event_processors or transform_filter_func must have an "event" argument '
                            'which carries the event payload'
                        )
                    else:
                        raise

            return wrapped_processor
        else:
            # new_filter_func _kinda_ wraps filter_func but it also changes the signature
            # so I'm now applying @wraps here - I'm just hoping `partial` does the correct thing
            # partial has a `func` attribute that points to the function that was partially applied
            new_filter_func = partial(transform_filter_func, *dec_args, **dec_kwargs)
            return event_processor_decorator(new_filter_func)

    return decorator


class Bot:
    """Base class for all Bots.

    Bots are initialized with a list of event_processors and for each event passed to the bot it passes it on to the
    event_processors.
    """
    def __init__(self, event_processors):
        self.event_processors = event_processors

    def __call__(self, event):
        """Sends event to all modules and optionally returns response to caller.

        Errors if there is more than on response from a module.
        :param event:
        :return:
        """
        responses = []
        for event_processor in self.event_processors:
            resp = event_processor(event)
            if resp:
                responses.append(resp)

        if len(responses) > 1:
            raise RuntimeError(
                "Only one response allowed for Bot. More than one response is ambiguous. Which one do we send?"
            )
        if responses:
            return responses[0]


class BotModule:
    """Base class for all BotModules.

    Given an event, the BotModule will pass the event to all methods specified in the `processors` class variable.

    Ex:
    ```
    class GreetingBotModule(BotModule):
        @is_event_subtype('channel_join')
        def welcome_user(self, event):
            self.existing_users.append(event['user'])
    ```
    """
    def __call__(self, event):
        """Sends event to all event processors optionally returns response to caller.

        Errors if there is more than on response from a event processors.
        :param event:
        :return:
        """
        assert hasattr(self, 'processors') and isinstance(self.processors, list), (
            'BotModules should define `processors`, a list of the processors to run and the order to run them in.'
        )
        responses = []
        for processor in self.processors:
            assert hasattr(self, processor), (
                f'Processor `{processor}` expected in BotModule {self.__class__.__module__}.{self.__class__.__name__} '
                'but not found.'
            )
            try:
                resp = getattr(self, processor)(event)
                if resp:
                    responses.append(resp)
            except TypeError as e:
                if e.args and "missing 1 required positional argument: 'event'" in e.args[0]:
                    raise TypeError(
                        'Processors require a single argument named "event". '
                        f'{self.__class__.__module__}.{self.__class__.__name__}.{processor} does not have an "event" '
                        'argument.'
                    )
                else:
                    raise

            if len(responses) > 1:
                raise RuntimeError(
                    "Only one response allowed for BotModule. More than one response is ambiguous. "
                    "Which one do we send?"
                )
            if responses:
                return responses[0]
