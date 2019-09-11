from bot.processors.base import (
    event_filter,
    event_filter_factory,
)
from common.helpers import CHANNEL_NAME__ID


@event_filter_factory
def in_room(room):
    def filter_func(event):
        return 'channel' in event and event['channel'] == CHANNEL_NAME__ID[room]

    return filter_func


@event_filter_factory
def is_event_type(type_string):
    def filter_func(event):
        type_arr = type_string.split('.')
        assert 1 <= len(type_arr) <= 2, 'Format for type_string must be "foo" or "foo.bar" of "*.bar" or "foo.*"'
        if len(type_arr) == 1:
            type_arr.append('*')
        if 'type' not in event:
            return False
        if type_arr[0] != '*' and event['type'] != type_arr[0]:
            return False
        if 'subtype' in event:
            if type_arr[1] != '*' and event['subtype'] != type_arr[1]:
                return False
        else:
            if type_arr[1] != '*':
                return False
        return True

    return filter_func


@event_filter
def is_block_interaction_event(event):
    """Detects whether or not the event is a block interaction event

    (such events have a 'trigger_id')
    """
    return 'trigger_id' in event


@event_filter_factory
def has_callback_id(callback_id):
    def filter_func(event):
        return event['callback_id'] == callback_id

    return filter_func


@event_filter_factory
def is_action_id(action_id):
    def filter_func(event):
        return event['actions'][0]['action_id'] == action_id

    return filter_func
