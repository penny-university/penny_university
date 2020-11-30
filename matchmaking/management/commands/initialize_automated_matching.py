from django.core.management.base import BaseCommand

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
        #

        # TODO! put safety function here to check whether or not we have this set up for that slack team already
        # OR maybe set the "overwite if already exists" to true if that makes sense

        #TODO! if a repeating task fails, then future tasks are canceled BUT this seems to indicate that we can
        #subscribe to this signal and just reschedule it again
        # /Users/johnberryman/.virtualenvs/penny/lib/python3.8/site-packages/background_task/models.py:254

        #
        request_matches(schedule=now, repeat='every 15 days', until='forever')

    def request_matches(self):
        make_matches(schedule='in 7 days')

    def make_matches(self):
        remind_matches(schedule='in 7 days')

    def remind_matches(self):
        pass