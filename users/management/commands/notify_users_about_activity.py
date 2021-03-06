import datetime
import pytz

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from sentry_sdk import capture_exception

from common.utils import get_slack_client
from users.models import User

NASHVILLE_TZ = pytz.timezone('America/Chicago')
UTC = pytz.utc
MAX_NUM_BLOCKS = 25  # the max number of blocks that can be sent through slack is 50, we're being over cautious


class Command(BaseCommand):
    help = (
        """
        Notifies users of recent activity (currently this is just followups on Penny Chats that they participated in).

        Example dry run:
        ./manage.py notify_users_about_activity \
            --range_start=2002-01-14T00:00:00Z \
            --range_end=2020-08-14T00:00:00Z \
            --filter_emails=meg@berryman.com,bo@berryman.com

        If you _reeeeeeeely_ want to send the notifications, then add --live_run

        You can also run as `--yesterday` rather than exact dates and it will calculate "yesterday" for Nashville TN
        assuming that the server is running on accurate UTC time.
        """
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
        parser.add_argument(
            '--filter_emails',
            dest='filter_emails',
            help='CSV list of emails to send to (if they have any updates)',
            required=False,
        )

    def handle(self, *args, **options):
        range_start, range_end = get_range(options)
        filter_emails = options['filter_emails'].split(',') if options['filter_emails'] else None
        live_run = options['live_run']

        recent_followup_dataset = get_recent_followup_dataset(range_start, range_end, filter_emails)
        for user_data in group_by_user(recent_followup_dataset):
            try:
                notify_about_activity(user_data, live_run)
            except Exception as e:
                capture_exception(e)


def get_range(options):
    # test that we're using one of the allowable configurations of parameters
    if not (
            (options.get('yesterday') and not (options.get('range_start') or options.get('range_end')))
            or ((options.get('range_start') and options.get('range_end')) and not options.get('yesterday'))  # noqa
    ):
        raise CommandError('either `yesterday` or (`range_start` and `range_end`) must be defined, and not both')
    if options['yesterday']:
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
    return range_start, range_end


def get_recent_followup_dataset(range_start, range_end, filter_emails=None):
    """Retrieves ordered and filtered set of {user,profile,chat,follow} data corresponding to recent updates.

    :param range_start: Range start for new followups.
    :param range_end: Range end  for new followups.
    :param filter_emails: emails to include in list. If omitted, then retrieves all.
    :return: dataset that contains rows of {user_data,chat_data,followup_user_data} for every followup that occurred
        in the time range for every user in the filter_emails list (or all users if no filter was provided). Followups
        belonging to the original user will be filtered out.
    """
    # Note: because we are joining in the social_profile, the user will be notified in
    # every social profile that they have. Eventually we might want to start the social profile
    # in the participation object and only ping them on the profile they used for that chat
    recent_followup_dataset = User.objects.filter(
        # find all users who
        #  were participants (user_chats)
        #  in a penny_chat
        #  that had a follow_up in the given date range
        # NOTE: the same user will be returned multiple times, once for every followup that
        # falls in the date range
        user_chats__penny_chat__follow_ups__date__gte=range_start,
        user_chats__penny_chat__follow_ups__date__lt=range_end,
    )

    if filter_emails:
        recent_followup_dataset = recent_followup_dataset.filter(
            email__in=filter_emails,
        )

    recent_followup_dataset = recent_followup_dataset.values(
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

    # filter out followups that are from the user that we're sending notifications to
    # and filter out rows where their is not slack id
    # (I tried to figure out how to do this with a orm filter and I failed!)
    recent_followup_dataset = (
        item for item in recent_followup_dataset
        if item['id'] != item['user_chats__penny_chat__follow_ups__user_id'] and item['social_profiles__slack_team_id'] and item['social_profiles__slack_id']  # noqa
    )

    return recent_followup_dataset


def group_by_user(recent_followup_dataset):
    """Groups the recent_followup_dataset by user, then within that by chat, then within that by followup.

    :param recent_followup_dataset
    :return: per-user data
    """
    for user in grouped(recent_followup_dataset, [
        'id',
        'first_name',
        'social_profiles__slack_team_id',
        'social_profiles__slack_id',
    ]):
        user_data = {
            'user_id': user['id'],
            'first_name': user['first_name'],
            'slack_team_id': user['social_profiles__slack_team_id'],
            'slack_id': user['social_profiles__slack_id'],
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
            yield user_data


def notify_about_activity(user_data, live_run=False):
    """Notifies users in slack about recent activity in Penny Chat's they've participated in.

    :param user_data: expected form is
        {
            'user_id': ...,
            'first_name': ...,
            'slack_team_id': ...,
            'slack_id': ...,
            'penny_chats': [{
               'id': ...,
               'title': ...,
               'date': ...,
               'followups': [{
                   'user_id': ...,
                   'first_name': ...,
                }, ...],
            }, ...],
        }

    :return: Nothing. Notifies users as side effect.
    """
    chat_data = []  # each item will be a tuple of (explanatory text, penny_chat.id)
    for penny_chat in user_data['penny_chats']:
        people = {
            followup['first_name']: followup['user_id']
            for followup in penny_chat['followups']
            if followup['user_id'] != user_data['user_id']
        }
        if not people:
            continue
        people_string = get_people_string(people)
        date_string = (
            f'<!date^{int(penny_chat["date"].timestamp())}^{{date_short}}|{penny_chat["date"].strftime("%b %d, %Y")}>'
        )
        if people_string:
            chat_data.append([
                f'Your {date_string} chat _"{penny_chat["title"]}"_ has follow-ups from {people_string}.',
                penny_chat["id"],
            ])
        else:
            chat_data.append([f'Your {date_string} chat _"{penny_chat["title"]}"_ has follow-ups.', penny_chat["id"]])

    print(
        f'\n\nTo be sent to {user_data["first_name"]} '
        f'({user_data["slack_team_id"]} @{user_data["slack_id"]}):\n{chat_data}'
    )
    if chat_data and live_run:
        slack_client = get_slack_client(team_id=user_data['slack_team_id'])
        slack_client.chat_postMessage(
            channel=user_data['slack_id'],
            blocks=generate_blocks(user_data["first_name"], chat_data),
        )


def get_people_string(people):
    """Returns a pretty printed string for the list of people.

    :param people: Assumes a dictionary of first_name-to-user_id
    :return: String combining all the users
    """
    people_strings = []
    for first_name, user_id in people.items():
        if first_name:  # some users don't have first names
            people_strings.append(f'<{settings.FRONT_END_HOST}/profile/{user_id}|{first_name}>')
    if len(people_strings) == 0:
        return ""
    if len(people_strings) == 1:
        return people_strings[0]
    if len(people_strings) == 2:
        return f'{people_strings[0]} and {people_strings[1]}'
    if len(people_strings) > 2:
        first = ', '.join(people_strings[:-1])
        return f'{first}, and {people_strings[-1]}'


def generate_blocks(first_name, chat_data):
    if len(chat_data) == 1:
        chat_data[0][0] = f'Hey {first_name}! {chat_data[0][0]}'
    else:
        for chat in chat_data:
            chat[0] = f'• {chat[0]}'

    blocks = []
    for chat in chat_data:
        penny_chat_text, penny_chat_id = chat
        blocks.append({
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': penny_chat_text
            },
            'accessory': {
                'type': 'button',
                'text': {
                    'type': 'plain_text',
                    'text': 'Read them!',
                    'emoji': True
                },
                'url': f'{settings.FRONT_END_HOST}/chats/{penny_chat_id}'
            }
        })

    # if we're returning too many blocks then get only the most recent ones
    if len(blocks) > MAX_NUM_BLOCKS:
        blocks = blocks[-MAX_NUM_BLOCKS:]

    if len(chat_data) > 1:
        blocks.insert(0, {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': f'Hey {first_name}! You have had several Penny Chat updates:'
            }
        })
    return blocks


class CompoundKey:
    """Represents an ordered lists of keys that can be compared with othered ordered lists."""
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
    if key:  # if there are no items at all, then this will remain None
        yield dict(key, items=vals)  # last set
