import pytz
import string
from datetime import datetime

from factory import LazyAttribute, Faker
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyText

from pennychat.models import PennyChat, FollowUp, PennyChatSlackInvitation
from users.models import User, SocialProfile

UTC = pytz.utc


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = LazyAttribute(lambda u: u.email)
    email = Faker('email')
    password = 'password'
    first_name = Faker('first_name')
    last_name = Faker('last_name')


class PennyChatFactory(DjangoModelFactory):
    class Meta:
        model = PennyChat

    title = Faker('sentence')
    description = Faker('text')
    date = Faker('date_time_between', start_date='-3y', end_date='+3M', tzinfo=UTC)
    visibility = PennyChat.PUBLIC


class EndedPennyChatFactory(PennyChatFactory):
    date = Faker('date_time_between', start_date='-3y', end_date='-1d', tzinfo=UTC)
    status = PennyChat.COMPLETED


class FollowUpFactory(DjangoModelFactory):
    class Meta:
        model = FollowUp

    content = Faker('text')
    date = Faker('date_time_between', start_date='-3y', end_date='+3M', tzinfo=UTC)
    # penny_chat and user must also be specified when instantiating this factory!


class SocialProfileFactory(DjangoModelFactory):
    class Meta:
        model = SocialProfile

    email = Faker('email')
    slack_id = FuzzyText(length=8, chars=string.ascii_uppercase + string.digits, prefix='U')
    slack_team_id = FuzzyText(length=8, chars=string.ascii_uppercase + string.digits, prefix='T')
    display_name = Faker('user_name')
    real_name = Faker('name')
    timezone = Faker('timezone')
    # user must be specified when instantiating this factory!


class PennyChatSlackInvitationFactory(DjangoModelFactory):
    class Meta:
        model = PennyChatSlackInvitation
    status = PennyChatSlackInvitation.DRAFT
    organizer_tz = 'America/Chicago'
    date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    view = 'view'
    created_from_slack_team_id = 'test_id'
    visibility = PennyChat.PUBLIC
