import pytest

from pennychat.management.commands.import_google_forum import import_to_database
from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)

from users.models import UserProfile

formatted_forum_dump = [
    {
        "title": "titleA",
        "description": "descriptionA",
        "date": "2017-01-23T14:28:31-08:00",
        "user": "A0@gmail.com",
        "followups": [
            {
                "content": "followupA0",
                "date": "2017-02-23T14:28:31-08:00",
                "user": "A0@gmail.com"
            },
            {
                "content": "followupA1",
                "date": "2017-03-24T09:34:49-08:00",
                "user": "A1@gmail.com"
            },
            {
                "content": "followupA2",
                "date": "2017-04-24T09:34:49-08:00",
                "user": "A2@gmail.com"
            },
        ],
    },
    {
        "title": "titleB",
        "description": "descriptionB",
        "date": "2017-05-23T14:28:31-08:00",
        "user": "B0@gmail.com",
        "followups": [
            {
                "content": "followupB0",
                "date": "2017-06-23T14:28:31-08:00",
                "user": "A0@gmail.com"
            },
        ],
    },
    {
        "title": "titleC",
        "description": "descriptionC",
        "date": "2017-07-23T14:28:31-08:00",
        "user": "A0@gmail.com",
        "followups": [
            {
                "content": "followupC0",
                "date": "2017-08-23T14:28:31-08:00",
                "user": "C0@gmail.com"
            },
        ],
    },
]


@pytest.mark.django_db
def test_import_to_database():
    def assert_db_in_proper_state():
        chats = PennyChat.objects.all()
        assert len(chats) == 3
        chat_titles = [c.title for c in chats]
        for expected_titles in ['titleA', 'titleB', 'titleC']:
            assert expected_titles in chat_titles

        for chat in chats:
            assert chat.status == PennyChat.COMPLETED_STATUS

        followups = [f.content for f in FollowUp.objects.all()]
        assert len(followups) == 5
        for expected_followups in ['followupA0', 'followupA1', 'followupA2', 'followupB0', 'followupC0']:
            assert expected_followups in followups

        # just spot check participants
        participants = Participant.objects.all()
        assert len(participants) == 7
        found_count = 0
        for participant in participants:
            if participant.penny_chat.title == 'titleA' and participant.user.email == 'A0@gmail.com':
                found_count += 1
                assert participant.role == Participant.ORGANIZER
            if participant.penny_chat.title == 'titleA' and participant.user.email == 'A1@gmail.com':
                found_count += 1
                assert participant.role == Participant.ATTENDEE
        assert found_count == 2

        users = [u.email for u in UserProfile.objects.all()]
        assert len(users) == 5
        for user in ['A0@gmail.com', 'A1@gmail.com', 'A2@gmail.com', 'B0@gmail.com', 'C0@gmail.com']:
            assert user in users

    import_to_database(formatted_forum_dump, live_run=True)
    assert_db_in_proper_state()

    # idempotency check
    import_to_database(formatted_forum_dump)
    assert_db_in_proper_state()
