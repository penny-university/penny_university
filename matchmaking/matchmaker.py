import datetime
from datetime import timezone
from itertools import chain

import networkx as nx

from matchmaking.models import Match, MatchRequest


def key(*args):
    'standardized key used for lookup dicts in this file'
    return tuple(sorted(args))


class MatchMaker:
    def __init__(self, match_request_since_date, match_since_date):
        """Initialize the MatchMaker

        :param match_request_since_date:
        :param match_since_date: historic matches are used to score possible future matches (for instance, the score to
          be matched with someone you were just matched with will be very low)
        """
        self.match_request_since_date = match_request_since_date
        self.match_since_date = match_since_date

        # stick parameters here such as the min/max dates
        self._now = datetime.datetime.now().astimezone(timezone.utc)
        self._memos_for_pair_score_and_topic = {}


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
        recent_match_by_profile_pair = {}
        recent_match_by_profile_topic = {}
        recent_match_by_profile_pair_and_topic = {}
        for match in matches:
            profiles = list(match.profiles.all().values_list('email', flat=True))
            data = {'num_attending': len(profiles), 'date': match.date}
            topic = match.topic_channel.name
            for i in range(len(profiles)):
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

        # assign instance vars
        self._recent_match_by_profile_pair = recent_match_by_profile_pair
        # example: {
        #   ('matt.cronin@gmail.com', 'nikola.novakovic9@gmail.com'): {
        #       'num_attending': 2,
        #       'date': datetime.datetime(2020, 10, 3, 0, 0, tzinfo=timezone.utc),
        #   },  ...

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
        """returns score and topic for this player to player match

        the score is based upon a number of factors:
        * how recently the players have been matched with one another under this topic
        * how recently the players have been matched with one another regardless of topic
        * how recently each player has been matches to someone else with this topic
        * how recently each player has been matched

        a score of zero goes to a pair that has been matched too recently
        a high score goes to pairs involving a new player being matched
        and intermediate scored are given for intermediate matching

        if multiple topics are involved, then the score for the highest topic is returned
        """
        #TODO! test if data is not present in lookups, we need to do something smart
        assert p1 is not p2

        cutoff_for_repairing = datetime.timedelta(weeks=4)
        cutoff_for_repairing_same_topic = datetime.timedelta(weeks=12)

        p1_topics = self._match_requests_profile_to_topic[p1]
        p2_topics = self._match_requests_profile_to_topic[p2]
        topics = p1_topics.intersection(p2_topics)

        # if this fails then we are being very inefficient about picking pairs to test
        assert len(topics) > 0, "won't score pair with no common topics"

        # if they've met too recently, then score is zero and fast return
        p1p2_key = key(p1, p2)
        recent_match_by_profile_pair = None
        if p1p2_key in self._recent_match_by_profile_pair:
            recent_match_by_profile_pair = self._recent_match_by_profile_pair[p1p2_key]
            if self._now - recent_match_by_profile_pair['date'] < cutoff_for_repairing:
                return 0, None

        # if there are multiple topics they could be matched in, then weed out any where they've already met (less recently than above)
        topics_to_remove = set()
        for topic in topics:
            p1p2top_key = key(p1, p2, topic)
            if recent_match_by_profile_pair and p1p2top_key in self._recent_match_by_profile_pair_and_topic:
                if self._now - self._recent_match_by_profile_pair_and_topic[p1p2top_key][
                    'date'] < cutoff_for_repairing_same_topic:
                    topics_to_remove.add(topic)

        topics = topics - topics_to_remove

        if len(topics) == 0:
            # no admissible topics left because they've met too recently to discuss them
            return 0, None

        # TODO NEXT - come up with a floating point score based upon how recently they've met and pick the right topic
        # increase the score if it involves new or unrecently matched people

        return 1, topics.pop()

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