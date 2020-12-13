from datetime import datetime, timedelta, timezone
from itertools import chain
from unittest.mock import call

from freezegun import freeze_time

import pytest

from common.tests.fakes import MatchRequestFactory, SocialProfileFactory, TopicChannelFactory, MatchFactory
from matchmaking.matchmaker import MatchMaker, key


@pytest.mark.django_db
def test_gather_data():
    now = datetime.now().astimezone(timezone.utc)
    prof1, prof2, prof3, prof4, prof5, prof6, prof_too_old = [
        SocialProfileFactory(email=f'prof{i+1}@email.com') for i in range(7)
    ]
    prof_too_old.email = 'prof_too_old@email.com'
    prof_too_old.save()

    topic_channel_science = TopicChannelFactory(name='science')
    topic_channel_art = TopicChannelFactory(name='art')

    with freeze_time(now - timedelta(weeks=52), tz_offset=0):
        MatchRequestFactory(profile=prof_too_old)

    with freeze_time(now - timedelta(weeks=1), tz_offset=0):
        MatchRequestFactory(
            profile=prof1,
            topic_channel=topic_channel_art,
        )
        MatchRequestFactory(
            profile=prof1,
            topic_channel=topic_channel_science,
        )
        MatchRequestFactory(
            profile=prof2,
            topic_channel=topic_channel_art
        )
        MatchRequestFactory(
            profile=prof3,
            topic_channel=topic_channel_science
        )
        MatchRequestFactory(
            profile=prof4,
            topic_channel=topic_channel_science
        )

    with freeze_time(now - timedelta(weeks=3), tz_offset=0):
        MatchFactory(
            topic_channel=topic_channel_art,
            profiles=(prof1, prof2, prof3),
        )
        MatchFactory(
            topic_channel=topic_channel_science,
            profiles=(prof4, prof5),
        )
        MatchFactory(
            topic_channel=topic_channel_science,
            profiles=(prof6, prof_too_old),
        )

    match_maker = MatchMaker(match_request_since_date=now - timedelta(weeks=2))
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


@pytest.mark.django_db
def test_get_unfulfilled_match_requests():
    now = datetime.now().astimezone(timezone.utc)
    since_date = now - timedelta(weeks=10)

    with freeze_time(now - timedelta(weeks=52), tz_offset=0):
        old_match_request_with_no_match = MatchRequestFactory(profile=SocialProfileFactory())

    with freeze_time(now - timedelta(weeks=5), tz_offset=0):
        match_request_with_successful_match = MatchRequestFactory(profile=SocialProfileFactory())
        MatchFactory(
            profiles=(match_request_with_successful_match.profile, SocialProfileFactory()),
            #penny_chat is automatically supplied by MatchFactory
            date=now - timedelta(weeks=4),
        )

        match_request_with_unsuccessful_match = MatchRequestFactory(profile=SocialProfileFactory())
        MatchFactory(
            profiles=(match_request_with_unsuccessful_match.profile, SocialProfileFactory()),
            penny_chat=None,
            date=now - timedelta(weeks=4),
        )

        match_request_with_no_match = MatchRequestFactory(profile=SocialProfileFactory())

    match_requests_profile_ids = set(
        [mr['profile_id'] for mr in MatchMaker._get_unfulfilled_match_requests(since_date)]
    )
    assert old_match_request_with_no_match.profile_id not in match_requests_profile_ids, \
        'this profile made a match request too long ago and should not be considered'
    assert match_request_with_successful_match.profile_id not in match_requests_profile_ids, \
        'this profile has had a successful match since their last match request and should not be considered'
    assert match_request_with_unsuccessful_match.profile_id in match_requests_profile_ids, \
        'this profile has had an unsuccessful match since their last match request (no chat) and should be considered'
    assert match_request_with_no_match.profile_id in match_requests_profile_ids, \
        'this profile has not had a match since their last match request and should be considered'


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


def test_penalty_based_on_recent_pairing():
    match_maker = MatchMaker(match_request_since_date='does not matter')
    now = datetime.now().astimezone(timezone.utc)
    match_maker._recent_match_by_profile_pair = {
        key('A', 'B'): {'date': now - timedelta(days=1)},
        key('A', 'C'): {'date': now - timedelta(weeks=10)},
        key('A', 'D'): {'date': now - timedelta(weeks=20)},
        # key('A', 'E'): {'date': now - infinity},  <- no entry is treated as never having met
    }
    scoreAB = match_maker._penalty_based_on_recent_pairing('A', 'B')
    scoreAC = match_maker._penalty_based_on_recent_pairing('A', 'C')
    scoreAD = match_maker._penalty_based_on_recent_pairing('A', 'D')
    scoreAE = match_maker._penalty_based_on_recent_pairing('A', 'E')
    assert scoreAB > scoreAC > scoreAD > scoreAE, 'the penalty is greater if they have met more recently'
    assert scoreAB == float('infinity'), 'having just met implies "infinite" penalty'


def test_boost_based_upon_recency_of_match():
    match_maker = MatchMaker(match_request_since_date='does not matter')
    now = datetime.now().astimezone(timezone.utc)
    match_maker._most_recent_match_by_profile = {
        key('A'): {'date': now},
        key('B'): {'date': now - timedelta(weeks=1)},
        key('C'): {'date': now - timedelta(weeks=2)},
        # key('D'): {'date': now - infinity},  <- no entry is treated as never having met
        # key('E'): {'date': now - infinity},  <- no entry is treated as never having met
    }
    scoreAB = match_maker._boost_based_upon_recency_of_match('A', 'B')
    scoreAC = match_maker._boost_based_upon_recency_of_match('A', 'C')
    scoreAD = match_maker._boost_based_upon_recency_of_match('A', 'D')
    scoreDE = match_maker._boost_based_upon_recency_of_match('D', 'E')
    assert scoreAB < scoreAC < scoreAD < scoreDE, 'there is a larger boost for those who have not met in a while'
    assert scoreDE == 2, \
        'boosts of the individual profiles are additive, and if a player has never been in a match their boost is 1'


def test_select_topic():
    match_maker = MatchMaker(match_request_since_date='does not matter')
    now = datetime.now().astimezone(timezone.utc)
    match_maker._recent_match_by_profile_pair_and_topic = {
        key('A', 'B', 'science'): {'date': now - timedelta(weeks=10)},
        key('A', 'B', 'art'): {'date': now - timedelta(weeks=20)},
    }
    met_recently = True

    topics = {'science', 'art', 'history'}
    selected_topic = match_maker._select_topic('A', 'B', met_recently, topics)
    assert selected_topic == 'history', 'choose the topic they have not yet met in'

    topics = {'science', 'art'}
    selected_topic = match_maker._select_topic('A', 'B', met_recently, topics)
    assert selected_topic == 'art', 'if they have already met in all topics, choose the least recent topic'


def test_not_memoized_pair_score_and_topic():
    match_maker = MatchMaker(match_request_since_date='does not matter')
    now = datetime.now().astimezone(timezone.utc)
    match_maker._recent_match_by_profile_pair = {
        key('A', 'B'): {'date': now - timedelta(weeks=20)},
    }
    match_maker._most_recent_match_by_profile = {
        key('A'): {'date': now - timedelta(weeks=20)},
        key('B'): {'date': now - timedelta(weeks=20)},
    }
    match_maker._recent_match_by_profile_pair_and_topic = {
        key('A', 'B', 'science'): {'date': now - timedelta(weeks=10)},
        key('A', 'B', 'art'): {'date': now - timedelta(weeks=20)},
    }
    match_maker._match_requests_profile_to_topic = {
        'A': {'science', 'art', 'history'},
        'B': {'science', 'art', 'religion'},
    }
    score, topic = match_maker._not_memoized_pair_score_and_topic('A', 'B')
    assert score > 0
    assert score != int(score), "score is a whole number, that's unlikely if we're really exercising the functionality"
    assert topic == 'art'


def test_get_matches(mocker):
    # Given these possible connections where every pair is scored 1, there is only one matching that scores
    # as high as 2, we better get that!
    #
    #    A---B
    #     \ /
    #      C
    #      |
    #      D

    match_maker = MatchMaker(match_request_since_date='does not matter')
    match_maker._pair_score_and_topic = mocker.Mock()
    match_maker._pair_score_and_topic.return_value = (1, 'history')

    match_maker._possible_matches = {
        'A': ['B', 'C'],
        'B': ['A', 'C'],
        'C': ['A', 'B', 'D'],
        'D': ['C'],
    }
    matches = match_maker._get_matches()
    matches = set(key(*m) for m in matches)  # convert to set of sorted tuples so that ordering doesn't matter
    assert matches == {key('A', 'B'), key('C', 'D')}
    for forbidden_call in [call('D', 'A'), call('A', 'D'), call('D', 'B'), call('B', 'D')]:
        assert forbidden_call not in match_maker._pair_score_and_topic.call_args_list, \
            "we should not make score calls for pairs that aren't in _possible_matches (very inefficient)"


def test_match_unmatched(mocker):
    # scenario: assume that the matches are A+B in the topic of 'math' and C+D in the topic of 'history', and E and F are
    # unmatched. E is a _possible_match with A or C in the topic of 'math' and F is a _possible_match with A or C in the
    # topic of 'history' therefore the final matching should be A+B+E in 'math' and C+D+F in 'history'
    match_maker = MatchMaker(match_request_since_date='does not matter')
    matches = [['A', 'B'], ['C', 'D']]

    def mock_pair_score_and_topic(p1, p2):
        return {
            key('A', 'B'): (1, 'math'),
            key('C', 'D'): (1, 'history'),
        }[key(p1, p2)]

    match_maker._pair_score_and_topic = mocker.Mock()
    match_maker._pair_score_and_topic.side_effect = mock_pair_score_and_topic
    match_maker._match_requests_profile_to_topic = {
        'A': ['math'],
        'B': ['math'],
        'C': ['history'],
        'D': ['history'],
        'E': ['math'],
        'F': ['history'],
    }
    match_maker._possible_matches = {
        'E': ['A', 'C'],
        'F': ['A', 'C'],
        # really the other keys would be here, but the method wouldn't currently call them
    }
    matches = match_maker._match_unmatched(matches)
    matches = set(key(*m) for m in matches)  # convert to set of sorted tuples so that ordering doesn't matter
    assert matches == {key('A', 'B', 'E'), key('C', 'D', 'F')}


def test_add_topics_to_matches(mocker):
    match_maker = MatchMaker(match_request_since_date='does not matter')

    def mock_pair_score_and_topic(p1, p2):
        return {
            key('A', 'B'): (1, 'math'),
            key('C', 'D'): (2, 'history'),
        }[key(p1, p2)]

    match_maker._pair_score_and_topic = mocker.Mock()
    match_maker._pair_score_and_topic.side_effect = mock_pair_score_and_topic

    matches = match_maker._add_topics_to_matches([['A', 'B', 'E'], ['C', 'D']])
    assert matches == [
        {'match': ['A', 'B', 'E'], 'score': 1, 'topic': 'math'},
        {'match': ['C', 'D'], 'score': 2, 'topic': 'history'},
    ]


def test_run(mocker):
    # just make sure everything is wired up
    match_maker = MatchMaker(match_request_since_date='does not matter')
    match_maker._gather_data = mocker.Mock()
    match_maker._get_matches = mocker.Mock()
    match_maker._get_matches.return_value = "a"
    match_maker._match_unmatched = mocker.Mock()
    match_maker._match_unmatched.side_effect = lambda x: x + 'b'
    match_maker._add_topics_to_matches = mocker.Mock()
    match_maker._add_topics_to_matches.side_effect = lambda x: x + 'c'

    matches = match_maker.run()
    assert matches == "abc"
    assert match_maker._gather_data.called
