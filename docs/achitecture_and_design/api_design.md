# API DESIGN

The following are the RESTful endpoints needed to support basic chat and follow-up creation, retrieval, updating, and deletion.

## Chats

### Retrieve individual chat
`GET /api/chats/<id>`
```json
{
    "id": 2,
    "participants": [
        {
            "user": {
                "id": 1
                "url": "http://pennyuniversity.org/api/users/1",
                "name": "Joe"
            },
            "type": "organizer"
        },
        {
            "user": {
                "id": 2
                "url": "http://pennyuniversity.org/api/users/2",
                "name": "Jenny"
            },
            "type": "attendee"
        }
    ],
    "title": "...",
    "description": "...",
    "date": "...",
    "follow_ups_url": "http://pennyuniversity.org/api/chats/<id>/followups",
    "follow_up_count": 5
}
```

### Retrieve a user's chats
`GET /api/user/2/chats`
```json
{
    "count": 123,
    "next": "...url to next page of results...",
    "previous": "...url to next previous of results...",
    "chats": [
        {
            "id": 1,
            "participants": [
                {
                    "user": {
                        "id": 1
                        "url": "http://pennyuniversity.org/api/users/1",
                        "name": "Joe"
                    },
                    "type": "organizer"
                },
                {
                    "user": {
                        "id": 2
                        "url": "http://pennyuniversity.org/api/users/2",
                        "name": "Jenny"
                    },
                    "type": "attendee"
                }
            ],
            "title": "...",
            "description": "...",
            "date": "...",
            "follow_ups_url": "http://pennyuniversity.org/api/chats/<id>/followups",
            "follow_up_count": 5
        },
        ...
    ]
}
```

### Retrieve all chats
`GET /api/chats`
(Same data representation as used in user's chats above.)


### Create a new chat
`POST /api/chats`
```json
{
    "title": "...",
    "date": "...",
    "description": "..."
}
```

### Update a chat
`PUT /api/chats/<id>`
(Same payload as POST)

### Delete a chat
`DELETE /api/chats/<id>`


## Follow-ups

### Retrieve follow-ups for a particular chat
`GET /api/chats/<id>/followups`
```json
{
    "count": 123,
    "next": "...url to next page of results...",
    "previous": "...url to next previous of results...",
    "follow_ups": [
        {
            "user": {
                "id": 1,
                "name": "..."
            },
            "date": "...",
            "content": "...",
            "penny_chat": "http://pennyuniversity.org/api/chats/<id>"
        },
        ...
    ]
}
```

### Create new follow-up
`POST /api/chats/<id>/followups`
```json
{
    "content": "..."
}
```


### Update a follow-up
`PUT /api/followups/<id>`
Same payload as POST


### Delete a follow-up
`DELETE /api/followups/<id>`


## For later discussion:

### Chat search
`GET /api/chats/?user=2`
The response format is TBD but will be a list of chats and some other metadata and possibly aggregation data (e.g. the number of chats within each tag).

### User Profile
TBD
