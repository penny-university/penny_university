from django.core.management.base import BaseCommand

from background_task.models import CompletedTask, Task
from matchmaking.tasks import periodically_request_matches

PERIOD_IN_DAYS = 15
DAYS_AFTER_REQUEST_TO_MAKE_MATCH = 7
DAYS_AFTER_MATCH_TO_REMIND = 7


class Command(BaseCommand):
    help = """Run this command to set up automated matching for a particular slack team. Eventually this command will
    be unnecessary because this functionality will be automatically set up when a new slack team starts using Penny
    University, but since we don't know how we plan to do that yet, this is a starting point.
    
    The functionality is as follows.
    * First a recurring event is set up that will `request_matches` for all TopicChannels every 15 days. Here we'll 
        encourage people to sign up to be matched.
    * Next, as part of the request match run, a task will be set up 7 days later to `make_matches`. Here we'll pair up
        the people that requested to be matched, and send them a private message to encourage them to schedule a chat.
    * Next, as part of the make_matches run, another task will be set up 7 days later to `remind_matches`. Here we find
        the pairs that haven't yet set up a match and we'll encourage them to set one up.
    """

    # def add_arguments(self, parser):
    #     parser.add_argument('slack_handles', type=str, nargs='*', help='a list of slack user names')

    def handle(self, *args, **options):
        #TODO! make sure to log problems to sentry!
        #TODO! add ability to cancel too
        #TODO! test tasks happen in the proper order (how?)
        import ipdb;ipdb.set_trace()
        periodically_request_matches(
            period_in_days=PERIOD_IN_DAYS,
            days_after_request_to_make_match=DAYS_AFTER_REQUEST_TO_MAKE_MATCH,
            days_after_match_to_remind=DAYS_AFTER_MATCH_TO_REMIND,
        )



#TODO! delete this:w
def deets():
    print('\n'.join([f'{t.task_name}:  {t.task_params}' for t in Task.objects.all()]))
def kill():
    Task.objects.all().delete()
def do():
    periodically_request_matches(
        slack_team_id='T123',
        period_in_days=PERIOD_IN_DAYS,
        days_after_request_to_make_match=DAYS_AFTER_REQUEST_TO_MAKE_MATCH,
        days_after_match_to_remind=DAYS_AFTER_MATCH_TO_REMIND,
    )
