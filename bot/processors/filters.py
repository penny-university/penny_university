from bot.processors.base import event_processor_decorator
from bot.utils import channel_lookup


@event_processor_decorator
def in_room(room, event):
    return 'channel' in event and event['channel'] == channel_lookup(room)


@event_processor_decorator
def is_event_type(type_string, event):
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
