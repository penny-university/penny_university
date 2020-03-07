from bot.processors.base import event_processor_decorator
from bot.utils import channel_lookup


@event_processor_decorator
def in_room(room, event):
    return 'channel' in event and event['channel'] == channel_lookup(room)


@event_processor_decorator
def has_event_type(types, event):
    """Process decorator that pass through any event that is one of the specified types.

    Each type argument can take any of these forms:
    * "foo" or "foo.*" - matches events of type "foo" and any subtype
    * "foo.bar" - matches events of type "foo" and subtype "bar"
    * "*.bar" - matches events of any type have subtype "bar"
    * "*.*" - has an event type
    """
    def is_event_type(type_string):
        """To process one type_string at a time."""
        type_arr = type_string.split('.')
        assert 1 <= len(type_arr) <= 2, \
            'Format for type_string must be "foo" or "foo.bar" of "*.bar" or "foo.*"'
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

    if isinstance(types, str):
        types = [types]

    for type_string in types:
        if is_event_type(type_string):
            return True

    return False


@event_processor_decorator
def is_block_interaction_event(event):
    """Detects whether or not the event is a block interaction event

    (such events have a 'trigger_id')
    """
    return 'trigger_id' in event


@event_processor_decorator
def has_callback_id(callback_id, event):
    if 'callback_id' in event:
        return event['callback_id'] == callback_id
    else:
        return event.get('view', {}).get('callback_id') == callback_id


@event_processor_decorator
def has_action_id(action_ids, event):
    if isinstance(action_ids, str):
        action_ids = [action_ids]
    return 'actions' in event and event['actions'][0]['action_id'] in action_ids
