from datetime import datetime, timedelta
from itertools import chain

from freezegun import freeze_time
from pytz import timezone

import pytest

from common.tests.fakes import MatchRequestFactory, SocialProfileFactory, TopicChannelFactory, MatchFactory
from matchmaking.matchmaker import MatchMaker, key


@pytest.mark.django_db
def test_gather_data():
    now = timezone('America/Chicago').localize(datetime.now())
    prof1, prof2, prof3, prof4, prof5, prof6, prof_too_old = [SocialProfileFactory(email=f'prof{i+1}@email.com') for i in range(7)]
    prof_too_old.email = 'prof_too_old@email.com'
    prof_too_old.save()

    topic_channel_science = TopicChannelFactory(name='science')
    topic_channel_art = TopicChannelFactory(name='art')

    with freeze_time(now - timedelta(weeks=52), tz_offset=0):
        match_request_too_old = MatchRequestFactory(profile=prof_too_old)

    with freeze_time(now - timedelta(weeks=1), tz_offset=0):
        match_request_prof1a = MatchRequestFactory(
            profile=prof1,
            topic_channel=topic_channel_art,
        )
        match_request_prof1b = MatchRequestFactory(
            profile=prof1,
            topic_channel=topic_channel_science,
        )
        match_request_prof2 = MatchRequestFactory(
            profile=prof2,
            topic_channel=topic_channel_art
        )
        match_request_prof3 = MatchRequestFactory(
            profile=prof3,
            topic_channel=topic_channel_science
        )
        match_request_prof4 = MatchRequestFactory(
            profile=prof4,
            topic_channel=topic_channel_science
        )

    MatchFactory(
        topic_channel=topic_channel_art,
        profiles=(prof1, prof2, prof3),#TODO! test that all pairs got stuck in a table
        date=now - timedelta(weeks=3),
    )
    MatchFactory(
        topic_channel=topic_channel_science,
        profiles=(prof4, prof5),
        date=now - timedelta(weeks=3),
    )
    MatchFactory(
        topic_channel=topic_channel_science,
        profiles=(prof6, prof_too_old),
        date=now - timedelta(weeks=3),
    )

    match_maker = MatchMaker(match_request_since_date=now-timedelta(weeks=2))
    match_maker._gather_data()

    # _recent_match_by_profile_pair, _recent_match_by_profile_pair, and _recent_match_by_profile_pair_and_topic
    # are used to look up information useful in creating a score
    assert 'prof_too_old' not in set(chain(*set(match_maker._recent_match_by_profile_pair.keys())))
    assert set(match_maker._recent_match_by_profile_pair.keys()) == {
        key('prof4@email.com', 'prof5@email.com'),
        # note that the meeting with 3 people got turned into 3 pairs here
        key('prof1@email.com', 'prof2@email.com'),
        key('prof1@email.com', 'prof3@email.com'),
        key('prof2@email.com', 'prof3@email.com'),
    }
    assert match_maker._recent_match_by_profile_pair[key('prof1@email.com', 'prof2@email.com')]['num_attending'] == 3

    assert set(match_maker._recent_match_by_profile_topic) == {
        key('prof1@email.com', 'art'),
        key('prof2@email.com', 'art'),
        key('prof3@email.com', 'art'),
        key('prof4@email.com', 'science'),
        key('prof5@email.com', 'science'),
    }

    assert set(match_maker._recent_match_by_profile_pair_and_topic.keys()) == {
        key('prof1@email.com', 'prof2@email.com', 'art'),
        key('prof1@email.com', 'prof3@email.com', 'art'),
        key('prof2@email.com', 'prof3@email.com', 'art'),
        key('prof4@email.com', 'prof5@email.com', 'science'),
    }

    # _match_requests_profile_to_topic, _match_requests_topic_to_profile, and _possible_matches
    # are used largely as filters to quickly find topics for people, people for topics, and people that share a topic
    # respectively
    assert match_maker._match_requests_profile_to_topic == {
        'prof1@email.com': {'science', 'art'},
        'prof2@email.com': {'art'},
        'prof3@email.com': {'science'},
        'prof4@email.com': {'science'},
    }
    assert match_maker._match_requests_topic_to_profile == {
        'art': {'prof1@email.com', 'prof2@email.com'},
        'science': {'prof1@email.com', 'prof4@email.com', 'prof3@email.com'},
    }
    assert match_maker._possible_matches == {
        'prof1@email.com': {'prof4@email.com', 'prof2@email.com', 'prof3@email.com'},
        'prof2@email.com': {'prof1@email.com'},
        'prof3@email.com': {'prof4@email.com', 'prof1@email.com'},
        'prof4@email.com': {'prof1@email.com', 'prof3@email.com'},
    }


def test_pair_score_and_topic__is_memoized(mocker):
    match_maker = MatchMaker(match_request_since_date='does not matter')
    match_maker._not_memoized_pair_score_and_topic = mocker.Mock()
    match_maker._not_memoized_pair_score_and_topic.return_value = 'output'

    # intentionally call this multiple times and assert that _not_memoized is called once
    assert match_maker._pair_score_and_topic('profile_1', 'profile_2') == 'output'
    assert match_maker._pair_score_and_topic('profile_1', 'profile_2') == 'output'
    assert match_maker._pair_score_and_topic('profile_2', 'profile_1') == 'output'
    assert match_maker._not_memoized_pair_score_and_topic.call_count == 1
    assert match_maker._pair_score_and_topic('profile_1', 'profile_999') == 'output'
    assert match_maker._not_memoized_pair_score_and_topic.call_count == 2


def test_scoring__more_recently_pared_gets_penalized():
    match_maker = MatchMaker(match_request_since_date='does not matter')
    now = timezone('America/Chicago').localize(datetime.now())
    match_maker._most_recent_match_by_profile = {
        # this should give them no boost
        key('A'): {'date': now},
        key('B'): {'date': now},
        key('C'): {'date': now},
        key('D'): {'date': now},
        key('E'): {'date': now},
    }
    match_maker._recent_match_by_profile_pair = {
        key('A', 'B'): {'date': now - timedelta(days=1)},
        key('A', 'C'): {'date': now - timedelta(weeks=10)},
        key('A', 'D'): {'date': now - timedelta(weeks=20)},
        # key('A', 'E'): {'date': now - infinity},  <- no entry is treated as never having met
    }
    match_maker._match_requests_profile_to_topic = {
        'A': {'science'},
        'B': {'science'},
        'C': {'science'},
        'D': {'science'},
        'E': {'science'},
    }
    scoreB, topic = match_maker._not_memoized_pair_score_and_topic('A', 'B')
    scoreC, topic = match_maker._not_memoized_pair_score_and_topic('A', 'C')
    scoreD, topic = match_maker._not_memoized_pair_score_and_topic('A', 'D')
    scoreE, topic = match_maker._not_memoized_pair_score_and_topic('A', 'E')
    assert scoreB == 0
    assert scoreB < scoreC < scoreD < scoreE
    
# def test_scoring__get_best_matching_topic_if_multiple_available():
# def test_scoring__people_that_havent_met_in_a_while_are_boosted()

"""
TODO! delete

    match_maker._recent_match_by_profile_pair = {
        key('A', 'B'): {'date': now - timedelta(weeks=2)},
    }
    match_maker._recent_match_by_profile_topic = {
        key('A', 'art'): {'date': now - timedelta(weeks=4)},
        key('B', 'art'): {'date': now - timedelta(weeks=4)},
    }
    match_maker._recent_match_by_profile_pair_and_topic = {
        key('A', 'B', 'art'): {'date': now - timedelta(weeks=4)},
    }
"""