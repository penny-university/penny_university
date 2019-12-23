import json


def pprint_obj(obj):
    return json.dumps(
        {k: str(v) for k, v in obj.__dict__.items() if k[0] != '_'},
        indent=2,
    )
