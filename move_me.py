from pennychat.models import PennyChat
from django.db.models import F
import datetime
import pytz

#TODO! make this real
range_start = pytz.utc.localize(datetime.datetime(2020, 7, 1))
range_end = pytz.utc.localize(datetime.datetime(2020, 8, 1))

#TODO! make this real
def notify_about(**kwargs):
    if kwargs['slack_user_id']:
        print(kwargs)

#TODO! test that this gets the right things
notification_data = PennyChat.objects.filter(
    follow_ups__date__gte=range_start,
    follow_ups__date__lt=range_end,
).values(
    # penny chat
    'id',
    'date',
    'title',
    # user
    'participants__user_id',
    'participants__user__social_profiles__slack_team_id',
    'participants__user__social_profiles__slack_id',
    'participants__user__first_name',
).distinct().order_by(
    'participants__user__social_profiles__slack_team_id',
    'participants__user__social_profiles__slack_id',
)

# note, I decided not to initialize these variables with notification_data[0] because I think that will trigger a sql
# query, and then the for loop will trigger another one
slack_team_id = None
slack_user_id = None
slack_user_name = None
per_user_chats = []
#TODO! test that we notify all users and no non-expected users
for item in notification_data:
    if not (
        item['participants__user__social_profiles__slack_team_id'] == slack_team_id
        and item['participants__user__social_profiles__slack_id'] == slack_user_id
    ):
        notify_about(
            slack_user_name=slack_user_name,
            slack_team_id=slack_team_id,
            slack_user_id=slack_user_id,
            per_user_chats=per_user_chats,
        )
        per_user_chats = []
    slack_team_id = item['participants__user__social_profiles__slack_team_id']
    slack_user_id = item['participants__user__social_profiles__slack_id']
    slack_user_name = item['participants__user__first_name']
    per_user_chats.append({
        'penny_chat_id': item['id'],
        'penny_chat_date': item['date'],
        'penny_chat_title': item['title'],
    })

# notify last user
notify_about(
    slack_user_name=slack_user_name,
    slack_team_id=slack_team_id,
    slack_user_id=slack_user_id,
    per_user_chats=per_user_chats,
)