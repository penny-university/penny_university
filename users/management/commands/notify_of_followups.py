import datetime
import pytz

from django.core.management.base import BaseCommand, CommandError

from users.models import User

NASHVILLE_TZ = pytz.timezone('America/Chicago')
UTC = pytz.utc


class Command(BaseCommand):
    help = (
        "temp"  # TODO! update
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--live_run',
            dest='live_run',
            action='store_true',
            help='opposite of dry run - will actually send emails',
            required=False,
        )
        parser.add_argument(
            '--range_start',
            dest='range_start',
            help='ISO8601 start time',
            required=False,
        )
        parser.add_argument(
            '--range_end',
            dest='range_end',
            help='ISO8601 end time',
            required=False,
        )
        parser.add_argument(
            '--yesterday',
            dest='yesterday',
            action='store_true',
            help='runs from start of yesterday to end of yesterday',
            required=False,
        )

    def handle(self, *args, **options):
        # test that we're using one of the allowable configurations of parameters
        if not (
            (options.get('yesterday') and not (options.get('range_start') or options.get('range_end')))
            or ((options.get('range_start') and options.get('range_end')) and not options.get('yesterday'))  # noqa
        ):
            raise CommandError('either `yesterday` or (`range_start` and `range_end`) must be defined, and not both')

        if options['yesterday']:
            # TODO! test that this is the right time - we want the Nashville yesterday
            range_end = datetime.datetime.now(NASHVILLE_TZ).replace(hour=0, minute=0, second=0, microsecond=0)
            range_start = range_end - datetime.timedelta(days=1)
        else:
            range_end = datetime.datetime.strptime(options['range_end'], "%Y-%m-%dT%H:%M:%S%z")
            range_start = datetime.datetime.strptime(options['range_start'], "%Y-%m-%dT%H:%M:%S%z")

        if not range_end > range_start:
            raise CommandError('range_end must be after range_start')

        range_start_utc = range_start.astimezone(UTC).replace(tzinfo=None).isoformat()
        range_start_nash = range_start.astimezone(NASHVILLE_TZ).replace(tzinfo=None).isoformat()
        range_end_utc = range_end.astimezone(UTC).replace(tzinfo=None).isoformat()
        range_end_nash = range_end.astimezone(NASHVILLE_TZ).replace(tzinfo=None).isoformat()
        print(f"""Running notification of followups with:
range_start Nashville = {range_start_nash}\trange_start UTC = {range_start_utc}
range_end Nashville = {range_end_nash}\trange_end UTC = {range_end_utc}
""")
        recent_followup_queryset = get_recent_followup_queryset(range_start, range_end)
        # TODO! Test users that have only followed up on their on chats - in this case they will appear in this data set
        # but they will have no penny chat update to report
        for user in grouped(recent_followup_queryset, [
            'id',
            'first_name',
            'social_profiles__slack_team_id',
            'social_profiles__slack_id',
        ]):
            user_data = {
                'user_id': user['id'],
                'first_name': user['first_name'],
            }
            penny_chats = []
            for penny_chat in grouped(user['items'], [
                'user_chats__penny_chat__id',
                'user_chats__penny_chat__title',
                'user_chats__penny_chat__date',
            ]):
                penny_chat_data = {
                    'id': penny_chat['user_chats__penny_chat__id'],
                    'title': penny_chat['user_chats__penny_chat__title'],
                    'date': penny_chat['user_chats__penny_chat__date'],
                }
                followups = []
                for followup in penny_chat['items']:
                    if user['id'] == followup['user_chats__penny_chat__follow_ups__user_id']:
                        # ignore followups that were created by the user
                        continue
                    followup_data = {
                        'user_id': followup['user_chats__penny_chat__follow_ups__user_id'],
                        'first_name': followup['user_chats__penny_chat__follow_ups__user__first_name'],
                    }
                    followups.append(followup_data)
                if followups:
                    penny_chat_data['followups'] = followups
                    penny_chats.append(penny_chat_data)
            if penny_chats:
                user_data['penny_chats'] = penny_chats
                notify_about(user_data)


def get_recent_followup_queryset(range_start, range_end):
    # TODO! test that this works and excludes self-followups

    # Note: because we are joining in the social_profile, the user will be notified in
    # every social profile that they have. Eventually we might want to start the social profile
    # in the participation object and only ping them on the profile they used for that chat
    recent_followup_queryset = User.objects.filter(
        # find all users who
        #  were participants (user_chats)
        #  in a penny_chat
        #  that had a follow_up in the given date range
        # NOTE: the same user will be returned multiple times, once for every followup that
        # falls in the date range
        user_chats__penny_chat__follow_ups__date__gte=range_start,
        user_chats__penny_chat__follow_ups__date__lt=range_end,
    ).values(
        # user data
        'id',
        'first_name',
        'social_profiles__slack_team_id',
        'social_profiles__slack_id',
        # chat data
        'user_chats__penny_chat__id',
        'user_chats__penny_chat__date',
        'user_chats__penny_chat__title',
        # followup data
        'user_chats__penny_chat__follow_ups__user_id',
        'user_chats__penny_chat__follow_ups__user__first_name',
    ).distinct().order_by(
        # Note - the order is important because the for loop can scan the list rather than
        # pull everything into memory
        'id',  # user id
        'social_profiles__slack_team_id',
        'social_profiles__slack_id',
        'user_chats__penny_chat__id',
        'user_chats__penny_chat__follow_ups__user_id',
    )
    return recent_followup_queryset


class CompoundKey:
    # TODO! doc
    def __init__(self, fields, val_dict):
        self.fields = fields
        self.compound_key = {field: val_dict[field] for field in fields}

    def __assert_dict(self, other):
        assert isinstance(other, dict), (
            f"CompoundKey should only be compared with dict. Found type {other.__class__.__name__}: {other}"
        )

    def __eq__(self, other):
        self.__assert_dict(other)
        for field in self.fields:
            if other[field] != self.compound_key[field]:
                return False
        return True

    def __lt__(self, other):
        self.__assert_dict(other)
        for field in self.fields:
            if other[field] == self.compound_key[field]:
                # this isn't the field that changed
                continue
            if other[field] > self.compound_key[field]:
                # the field that changed is correctly ordered
                return True
        return False

    def __str__(self):
        return str(self.compound_key)

    def __iter__(self):
        return iter(self.compound_key.items())


class UnorderedDataError(RuntimeError):
    pass


def grouped(iterable, fields):
    """given ordered iterable of dictionaries, group them according to a compound key in the list of fields

    Raises an error if items are not ordered according to fields.
    """
    # TODO! update docs with examples and test references
    key = None
    vals = []
    for i, item in enumerate(iterable):
        if not key == item:
            if key is not None:
                # compare compound key with next item to make sure the ordering is correct
                if key < item:
                    yield dict(key, items=vals)
                else:
                    raise UnorderedDataError(
                        f'Expected all items to be ordered. Item {item} was less than key {key}'
                    )
            key = CompoundKey(fields, {field: item[field] for field in fields})
            vals = []
        item = item.copy()
        for field in fields:
            del item[field]
        vals.append(item)
    yield dict(key, items=vals)  # last set


# TODO! make this real
def notify_about(user_data):
    print(f'{user_data["user_id"]} {user_data["first_name"]}')
    for penny_chat in user_data['penny_chats']:
        print(f'\t{penny_chat["id"]} {penny_chat["title"]}')
        for followup in penny_chat["followups"]:
            print(f'\t\t{followup["user_id"]} {followup["first_name"]}')
    print()
