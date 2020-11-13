import pytz
import string
from datetime import datetime, timezone

import factory
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyText, FuzzyChoice

from matchmaking.models import Match, MatchRequest, TopicChannel
from pennychat.models import PennyChat, FollowUp, PennyChatSlackInvitation
from users.models import User, SocialProfile

UTC = pytz.utc

slack_team_id = FuzzyText(length=8, chars=string.ascii_uppercase + string.digits, prefix='T')


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = factory.LazyAttribute(lambda u: u.email)
    email = factory.Faker('email')
    password = 'password'
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')


class PennyChatFactory(DjangoModelFactory):
    class Meta:
        model = PennyChat

    title = factory.Faker('sentence')
    description = factory.Faker('text')
    date = factory.Faker('date_time_between', start_date='-3y', end_date='+3M', tzinfo=UTC)
    visibility = PennyChat.PUBLIC


class EndedPennyChatFactory(PennyChatFactory):
    date = factory.Faker('date_time_between', start_date='-3y', end_date='-1d', tzinfo=UTC)
    status = PennyChat.COMPLETED


class FollowUpFactory(DjangoModelFactory):
    class Meta:
        model = FollowUp

    content = factory.Faker('text')
    date = factory.Faker('date_time_between', start_date='-3y', end_date='+3M', tzinfo=UTC)
    # penny_chat and user must also be specified when instantiating this factory!


class SocialProfileFactory(DjangoModelFactory):
    class Meta:
        model = SocialProfile

    email = factory.Faker('email')
    slack_id = FuzzyText(length=8, chars=string.ascii_uppercase + string.digits, prefix='U')
    slack_team_id = slack_team_id
    display_name = factory.Faker('user_name')
    real_name = factory.Faker('name')
    timezone = factory.Faker('timezone')
    # user must be specified when instantiating this factory!


class PennyChatSlackInvitationFactory(DjangoModelFactory):
    class Meta:
        model = PennyChatSlackInvitation
    status = PennyChatSlackInvitation.DRAFT
    organizer_tz = 'America/Chicago'
    date = datetime.now().astimezone(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    view = 'view'
    created_from_slack_team_id = 'test_id'
    visibility = PennyChat.PUBLIC


class TopicChannelFactory(DjangoModelFactory):
    class Meta:
        model = TopicChannel

    channel_id = FuzzyText(length=8, chars=string.ascii_uppercase + string.digits, prefix='C')
    slack_team_id = slack_team_id
    name = FuzzyChoice(['startups', 'books', 'data', 'math-science'])


class MatchRequestFactory(DjangoModelFactory):
    class Meta:
        model = MatchRequest

    topic_channel = factory.SubFactory(TopicChannelFactory)
    profile = factory.SubFactory(SocialProfileFactory)


class MatchFactory(DjangoModelFactory):
    class Meta:
        model = Match

    topic_channel = factory.SubFactory(TopicChannelFactory)
    penny_chat = factory.SubFactory(PennyChatFactory)
    conversation_id = FuzzyText(length=8, chars=string.ascii_uppercase + string.digits, prefix='C')

    @factory.post_generation
    def profiles(self, create, extracted, **kwargs):
        if not create:
            # I'm not sure if I need to do anything here
            return
        if not extracted:
            extracted = (SocialProfileFactory(), SocialProfileFactory())
        self.profiles.set(extracted)
