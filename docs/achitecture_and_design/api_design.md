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
            "user_profile": {
                "id": 1,
                "url": "http://pennyuniversity.org/api/users/profiles/1",
                "real_name": "Joe",
                "user": {
                    "id": 1,
                    "username": "joe.example@email.com"
                }
            },
            "role": "organizer"
        },
        {
            "user_profile": {
                "id": 2,
                "url": "http://pennyuniversity.org/api/users/profiles/2",
                "real_name": "Jenny"
            },
            "role": "attendee"
        }
    ],
    "title": "...",
    "description": "...",
    "date": "...",
    "follow_ups_url": "http://pennyuniversity.org/api/chats/<id>/followups",
    "follow_up_count": 5
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
            "user_profile": {
                "id": 1,
                "real_name": "...",
                "user": {...}
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

## Users
### User Profile
`GET /api/users/profiles/<id>`
```json
{
    "id": 1,
    "url": "http://pennyuniversity.org/api/users/profiles/1",
    "real_name": "Joe",
    "user": {
        "id": 1,
        "username": "joe.example@email.com"
    }
}
```

### User Information
`GET /api/users/<id>`
```json
{
    "id": 1,
    "url": "http://pennyuniversity.org/api/users/1",
    "email": "joe.example@email.com",
    "first_name": "Joe",
    "last_name": "Example",
    "user_profiles": [
      "http://pennyuniversity.org/api/users/profiles/1",
      ...
    ],
    "chats": "http://pennyuniversity.org/api/users/1/chats/",
    "follow_ups": "http://pennyuniversity.org/api/users/2/follow-ups/"
}
```

`PUT /api/users/<id>`
```json
{
    "email": "joe.update@email.com",
    "first_name": "Joe",
    "last_name": "Update"
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
                    "user_profile": {
                        "id": 1,
                        "url": "http://pennyuniversity.org/api/users/profiles/1",
                        "real_name": "Joe",
                        "user": {
                            "id": 1,
                            "username": "joe.example@email.com"
                        },
                        "chats": "http://pennyuniversity.org/api/users/1/chats/"
                    },
                    "role": "organizer"
                },
                {
                    "user": {
                        "id": 2,
                        "url": "http://pennyuniversity.org/api/users/2",
                        "real_name": "Jenny"
                    },
                    "role": "attendee"
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

### Follow Ups for User
`GET /api/user/2/chats`
```json
{
    "count": 123,
    "next": "...url to next page of results...",
    "previous": "...url to next previous of results...",
    "follow_ups": [
        {
            "user_profile": {
                "id": 1,
                "real_name": "...",
                "user": {...}
            },
            "date": "...",
            "content": "...",
            "penny_chat": "http://pennyuniversity.org/api/chats/<id>"
        },
        ...
    ]
}
```

## For later discussion:

### Chat search
`GET /api/chats/?user=2`
The response format is TBD but will be a list of chats and some other metadata and possibly aggregation data (e.g. the number of chats within each tag).
