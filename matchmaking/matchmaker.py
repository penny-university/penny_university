import datetime
from datetime import timezone
from itertools import chain

import networkx as nx

from matchmaking.models import Match, MatchRequest


def key(*args):
    'standardized key used for lookup dicts in this file'
    return tuple(sorted(args))


class MatchMaker:
    def __init__(self, match_request_since_date):
        """Initialize the MatchMaker

        :param match_request_since_date: only matches for people that requested a match after this date
        """
        self.match_request_since_date = match_request_since_date

        self._now = datetime.datetime.now().astimezone(timezone.utc)

        # CONFIG PARAMS
        # How far to look back in the past for earlier matches. This is used in scoring so that the score is higher if
        # the people being matched haven't been matched in a while or ever.
        self.match_since_date = self._now - datetime.timedelta(weeks=26)

        # give a score boost if we haven't seen them in a while or ever
        self._recent_match_boost_halflife = datetime.timedelta(weeks=6)

        # if they have met this recently or less then give them a score of 0
        self._cutoff_for_repairing = datetime.timedelta(weeks=4)
        # thereafter the penalty has a halflife of this time period
        self._repairing_penalty_halflife = datetime.timedelta(weeks=4)

        # STATE
        self._memos_for_pair_score_and_topic = {}

        self._recent_match_by_profile_pair = dict()
        self._recent_match_by_profile_topic = dict()
        self._recent_match_by_profile_pair_and_topic = dict()
        self._match_requests_profile_to_topic = dict()
        self._match_requests_topic_to_profile = dict()
        self._possible_matches = dict()


    def _gather_data(self):
        "pull the data from the database and create lookup dicts used in scoring and filtering to admissible matches"
        match_requests = MatchRequest.objects.filter(date__gte=self.match_request_since_date)\
            .values_list('profile__email', 'topic_channel__name')
        emails = set(mr[0] for mr in match_requests)

        # recent matches
        matches = Match.objects.filter(date__gte=self.match_since_date)\
            .filter(profiles__email__in=emails)\
            .order_by('date')\
            .prefetch_related('profiles', 'topic_channel')
        most_recent_match_by_profile = {}
        recent_match_by_profile_pair = {}
        recent_match_by_profile_topic = {}
        recent_match_by_profile_pair_and_topic = {}
        for match in matches:
            profiles = list(match.profiles.all().values_list('email', flat=True))
            data = {'num_attending': len(profiles), 'date': match.date}
            topic = match.topic_channel.name
            for i in range(len(profiles)):
                prof_key = key(profiles[i])
                if prof_key not in most_recent_match_by_profile or most_recent_match_by_profile[prof_key]['date'] > data['date']  :
                    most_recent_match_by_profile[prof_key] = data  #TODO! test
                recent_match_by_profile_topic[key(profiles[i], topic)] = data
                for j in range(i + 1, len(profiles)):
                    recent_match_by_profile_pair[key(profiles[i], profiles[j])] = data
                    recent_match_by_profile_pair_and_topic[key(profiles[i], profiles[j], topic)] = data

        # match requests lookups
        match_requests_profile_to_topic = {}
        match_requests_topic_to_profile = {}
        for match_request in match_requests:
            match_requests_profile_to_topic.setdefault(match_request[0], set()).add(match_request[1])
            match_requests_topic_to_profile.setdefault(match_request[1], set()).add(match_request[0])

        possible_matches = {}
        for profile_A, topics in match_requests_profile_to_topic.items():
            possible_matches[profile_A] = set()
            for topic in topics:
                profiles_B = match_requests_topic_to_profile[topic]
                for profile_B in profiles_B:
                    if profile_A != profile_B:
                        possible_matches[profile_A].add(profile_B)

        ######################
        # assign instance vars
        self._most_recent_match_by_profile = most_recent_match_by_profile
        # example: {
        #   ('matt.cronin@gmail.com'): {
        #       'num_attending': 2,
        #       'date': datetime.datetime(2020, 10, 3, 0, 0, tzinfo=timezone.utc),
        #   },  ...

        self._recent_match_by_profile_pair = recent_match_by_profile_pair
        # example: {
        #   ('matt.cronin@gmail.com', 'nikola.novakovic9@gmail.com'): { <same as above> } ...

        self._recent_match_by_profile_topic = recent_match_by_profile_topic
        # example: {
        #   ('data', 'nikola.novakovic9@gmail.com'): { <same as above> } ...

        self._recent_match_by_profile_pair_and_topic = recent_match_by_profile_pair_and_topic
        # example: {
        #   ('data', 'matt.cronin@gmail.com', 'nikolas.novovic9@gmail.com'): { <same as above> } ...

        self._match_requests_profile_to_topic = match_requests_profile_to_topic
        # example: {
        #   'sydneynoh@gmail.com': {'javascript', 'html-css', 'python', 'devops'}, ...

        self._match_requests_topic_to_profile = match_requests_topic_to_profile
        # example: {
        #   'devops': {'ant@gmail.com', 'colin@gmail.me', 'sydneynoh@gmail.com'}, ...

        self._possible_matches = possible_matches
        # example: {
        #   'sydneynoh@gmail.com': {'ant@gmail.com', 'colin@gmail.me', 'sydneynoh@gmail.com'}, ...


    def _pair_score_and_topic(self, p1, p2):
        p1p2_key = key(p1, p2)
        if p1p2_key in self._memos_for_pair_score_and_topic:
            memo = self._memos_for_pair_score_and_topic[p1p2_key]
        else:
            memo = self._memos_for_pair_score_and_topic[p1p2_key] = self._not_memoized_pair_score_and_topic(p1, p2)

        return memo

    def _not_memoized_pair_score_and_topic(self, p1, p2):
        """returns score and topic for this player to player match"""
        #TODO! test if data is not present in lookups, we need to do something smart
        assert p1 is not p2

        score = 1.0

        p1_topics = self._match_requests_profile_to_topic[p1]
        p2_topics = self._match_requests_profile_to_topic[p2]
        topics = p1_topics.intersection(p2_topics)

        # if this fails then we are being very inefficient about picking pairs to test
        assert len(topics) > 0, "won't score pair with no common topics"

        # promote matching of people who have never participated before or haven't participated recently
        score += self._boost_based_upon_recency_of_match(p1, p2)
        # demote matching between two people that have been paired recently
        penalty = self._penalty_based_on_recent_pairing(p1, p2)
        score -= penalty
        if score <= 0:
            return 0, None
        met_recently = False
        if penalty:
            met_recently = True

        # get best topic
        topic = self._select_topic(p1, p2, met_recently, topics)

        return score, topic

    def _boost_based_upon_recency_of_match(self, profile1, profile2):
        # for individual players, if they've never participated, then get a boost of 1.0
        # if they've participated recently then get a boost of 0
        boost = 0
        for profile in [profile1, profile2]:
            if key(profile) in self._most_recent_match_by_profile:
                time_since_last_meeting = self._now - self._most_recent_match_by_profile[key(profile)]['date']
                # if time_since_last_meeting == 0
                #   then the boost is 0
                # if time_since_last_meeting == self._recent_match_boost_halflife
                #   then the penalty is 0.5
                # if time_since_last_meeting == 2*_recent_match_boost_halflife
                #   then the penalty is 0.75
                boost += 1 - 2 ** (-time_since_last_meeting / self._recent_match_boost_halflife)
            else:
                # if they've never participated they get a boost of 1.0
                boost += 1
        return boost

    def _penalty_based_on_recent_pairing(self, profile1, profile2):
        # if they've met too recently, then score is zero and fast return
        # if they've never met, there is no penalty
        # if they have met, then penalize score based on recency (max penalty = 1.0)
        penalty = 0
        p1p2_key = key(profile1, profile2)
        recent_match_by_profile_pair = None
        if p1p2_key in self._recent_match_by_profile_pair:
            recent_match_by_profile_pair = self._recent_match_by_profile_pair[p1p2_key]
            time_since_last_meeting = self._now - recent_match_by_profile_pair['date']
            if time_since_last_meeting < self._cutoff_for_repairing:
                penalty = float('infinity')
            else:
                # if time_since_last_meeting == self._cutoff_for_repairing
                #   then the penalty is 1.0
                # if time_since_last_meeting == self._cutoff_for_repairing + self._repairing_penalty_halflife
                #   then the penalty is 0.5
                # if time_since_last_meeting == self._cutoff_for_repairing + 2*self._repairing_penalty_halflife
                #   then the penalty is 0.25
                penalty = 2 ** (-time_since_last_meeting / self._repairing_penalty_halflife)
        return penalty

    def _select_topic(self, profile1, profile2, met_recently, topics):
        # if there are multiple topics they could be matched in, then weed out any where they've already met (less
        # recently than above)
        topics_to_remove = set()
        topics_this_pair_has_discussed = set()
        least_recent_topic = None
        least_recent_date = None
        for topic in topics:
            p1p2top_key = key(profile1, profile2, topic)
            if met_recently and p1p2top_key in self._recent_match_by_profile_pair_and_topic:
                topics_this_pair_has_discussed.add(topic)
                date_of_that_meeting = self._recent_match_by_profile_pair_and_topic[p1p2top_key]['date']
                if least_recent_date is None or least_recent_date > date_of_that_meeting:
                    least_recent_topic = topic
                    least_recent_date = date_of_that_meeting
        if len(topics - topics_this_pair_has_discussed) == 0:
            # they've discussed all these topics, so just return the least recently discussed topic
            topic = least_recent_topic
        else:
            # exclude topics they're already talked about and then just pick one
            topics -= topics_this_pair_has_discussed

            # TODO: here we're just picking one of the remaining topics but we could do better by selecting topics
            # that at least one of them haven't been matched in before. And if that didn't uniquely identify a best topic
            # we could find the topic where they've met least recently.
            topic = topics.pop()
        return topic


    def _get_matches(self):
        graph = nx.Graph()
        for profile_A, profiles_B in self._possible_matches.items():
            for profile_B in profiles_B:
                weight, _ = self._pair_score_and_topic(profile_A, profile_B)
                if weight > 0:
                    graph.add_edge(profile_A, profile_B, weight=weight)

        matches = nx.algorithms.max_weight_matching(graph, True)
        matches = [list(m) for m in matches]
        return matches

    def _match_unmatched(self, matches):
        profiles_with_matches = set(chain(*matches))  # this just collects all the people that are matched so far
        all_profiles = set(self._match_requests_profile_to_topic.keys())
        unmatched = all_profiles - profiles_with_matches

        additions = []
        for profile in unmatched:
            possible_matches = self._possible_matches[profile]
            best_match = None
            for match in matches:
                number_possible_matches = sum(m in possible_matches for m in match)  # TODO! test w/ both possibilities
                if number_possible_matches == 0:
                    # can't be paired with either of these
                    continue

                score, topic = self._pair_score_and_topic(*match)
                if topic not in self._match_requests_profile_to_topic[profile]:
                    # could have been paired with at least one of these, but they're meeting for a different topic
                    continue

                # yay! at least one of these is a possible match AND they are already meeting about a topic of interest to the unmatched person
                best_match = match

                if number_possible_matches == 2:
                    # best possible thing, the unmatched person matches both of these, no need to look further
                    break

            if best_match:
                additions.append((profile, best_match))

        for profile, best_match in additions:
            best_match.append(profile)

        return matches

    def _add_topics_to_matches(self, matches):
        matches_with_topic = []
        for match in matches:
            score, topic = self._pair_score_and_topic(match[0], match[1])
            matches_with_topic.append({
                'match': match,
                'score': score,
                'topic': topic,
            })
        return matches_with_topic

    def run(self):
        self._gather_data()
        matches = self._get_matches()
        matches = self._match_unmatched(matches)
        matches = self._add_topics_to_matches(matches)
        return matches