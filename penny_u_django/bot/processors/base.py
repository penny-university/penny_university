from functools import wraps

class Event(dict):
    """I assume a simple model for a event for now."""
    def __init__(self, *args, **kwargs):
        super(Event, self).__init__(*args, **kwargs)


def event_filter(filter_func):
    def decorator(func):
        @wraps(func)
        def wrapper(*args):
            event = args[0] if isinstance(args[0], Event) else args[1]  # b/c 0 arg is `self`
            if filter_func(event):
                return func(*args)
        return wrapper
    return decorator


def event_filter_factory(filter_func_maker):
    @wraps(filter_func_maker)
    def decorator_creator(*args, **kwargs):
        filter_func = filter_func_maker(*args, **kwargs)
        return event_filter(filter_func)
    return decorator_creator


class EventProcessor:
    # this class used for type checking
    def __call__(self, event):
        # got to have a call method
        raise RuntimeError('Event Processor must be a callable.')


class Bot(EventProcessor):
    def __init__(self, event_processors):
        self.event_processors = event_processors

    def __call__(self, event):
        for event_processor in self.event_processors:
            event_processor(event)


class BotModule(EventProcessor):
    def __call__(self, event):
        member_names = [member_name for member_name in dir(self) if member_name[:1] != '_']
        members = [getattr(self, member_name) for member_name in member_names]
        methods = [member for member in members if callable(member)]
        for method in methods:
            method(event)
