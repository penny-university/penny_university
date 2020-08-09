from django.db.models import F
import datetime
import pytz

#TODO! make this real
range_start = pytz.utc.localize(datetime.datetime(2020, 7, 1))
range_end = pytz.utc.localize(datetime.datetime(2020, 8, 1))

#TODO! make this real
def notify_about(**kwargs):
    if kwargs['slack_user_id']:
        print(kwargs['slack_user_name'])
        for chat in kwargs['per_user_chats']:
            print(f'\t{chat["penny_chat_id"]}: {chat["penny_chat_title"]}')
        print()

from users.models import User

notification_data = User.objects.filter(
    # find all users who
    #  were participants (user_chats)
    #  in a penny_chat
    #  that had a follow_up in the given date range
    # NOTE: the same user will be returned multiple times, once for every followup that
    # falls in the date range
    user_chats__penny_chat__follow_ups__date__gte=range_start,
    user_chats__penny_chat__follow_ups__date__lt=range_end,
).exclude(
    # remove row from above corresponding to followups created by the user themselves
    # (`id` below is the user id)
    user_chats__penny_chat__follow_ups__user_id=F('id'),
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
).distinct().order_by(
    'social_profiles__slack_team_id',
    'social_profiles__slack_id',
)
# Note: because we are joining in the social_profile, the user will be notified in
# every social profile that they have. Eventually we might want to start the social profile
# in the participation object and only ping them on the profile they used for that chat

# note, I decided not to initialize these variables with notification_data[0] because I
# think that will trigger a sql execution, and then the for loop will trigger another one
slack_team_id = None
slack_user_id = None
slack_user_name = None
per_user_chats = []
#TODO! test that we notify all users and no non-expected users
for item in notification_data:
    if not (
        item['social_profiles__slack_team_id'] == slack_team_id
        and item['social_profiles__slack_id'] == slack_user_id
    ):
        notify_about(
            slack_user_name=slack_user_name,
            slack_team_id=slack_team_id,
            slack_user_id=slack_user_id,
            per_user_chats=per_user_chats,
        )
        per_user_chats = []
    slack_team_id = item['social_profiles__slack_team_id']
    slack_user_id = item['social_profiles__slack_id']
    slack_user_name = item['first_name']
    per_user_chats.append({
        'penny_chat_id': item['user_chats__penny_chat__id'],
        'penny_chat_date': item['user_chats__penny_chat__date'],
        'penny_chat_title': item['user_chats__penny_chat__title'],
    })

# notify last user
notify_about(
    slack_user_name=slack_user_name,
    slack_team_id=slack_team_id,
    slack_user_id=slack_user_id,
    per_user_chats=per_user_chats,
)

