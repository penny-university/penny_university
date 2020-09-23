from datetime import timedelta

import pytest
import pytz
from django.utils import timezone

from common.tests.fakes import SocialProfileFactory
from freezegun import freeze_time
from matchmaking.management.commands.review_match_requests import get_recent_matches
from matchmaking.models import TopicChannel, MatchRequest

UTC = pytz.utc


@pytest.mark.django_db
def test_review_match_requests():
    profile1 = SocialProfileFactory()
    profile2 = SocialProfileFactory()
    profile3 = SocialProfileFactory()

    chan1 = TopicChannel.objects.create(
        channel_id='one',
        slack_team_id='sl123',
        name='uno',
    )
    chan2 = TopicChannel.objects.create(
        channel_id='two',
        slack_team_id='sl123',
        name='dos',
    )

    # recent
    with freeze_time(timezone.now() - timedelta(days=3), tz_offset=0):
        MatchRequest.objects.create(
            topic_channel=chan1,
            profile=profile1,
        )
        MatchRequest.objects.create(
            topic_channel=chan2,
            profile=profile1,
        )
        MatchRequest.objects.create(
            topic_channel=chan1,
            profile=profile2,
        )

    # old - this one better not show up
    with freeze_time(timezone.now() - timedelta(days=30), tz_offset=0):
        MatchRequest.objects.create(
            topic_channel=chan1,
            profile=profile3,
        )

    actual = get_recent_matches(since_days_ago=7)
    expected = f"""PROFILE TO TOPICS
{profile1.email} ({profile1.real_name}) requested a match for:
	topic {chan1.name} in channel {chan1.channel_id}
	topic {chan2.name} in channel {chan2.channel_id}


{profile2.email} ({profile2.real_name}) requested a match for:
	topic {chan1.name} in channel {chan1.channel_id}




TOPIC TO PROFILES
Channel {chan1.channel_id} with topic {chan1.name} has interested people:
	topic {profile1.email} ({profile1.real_name})
	topic {profile2.email} ({profile2.real_name})


Channel two with topic dos has interested people:
	topic {profile1.email} ({profile1.real_name})

"""  # noqa

    assert actual == expected  # noqa
