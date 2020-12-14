from django.core.management.base import BaseCommand

from matchmaking.tasks import periodically_request_matches


class Command(BaseCommand):
    help = """Run this command to set up automated matching for a particular slack team. Eventually this command will
    be unnecessary because this functionality will be automatically set up when a new slack team starts using Penny
    University, but since we don't know how we plan to do that yet, this is a starting point.

    The functionality is as follows.
    * First a recurring event is set up that will `request_matches` for all TopicChannels every PERIOD_IN_DAYS(15) days.
        Here we'll encourage people to sign up to be matched.
    * Next, as part of the request match run, a task will be set up DAYS_AFTER_REQUEST_TO_MAKE_MATCH(7) days later to
        `make_matches`. Here we'll pair up the people that requested to be matched, and send them a private message to
        encourage them to schedule a chat.
    * Next, as part of the make_matches run, another task will be set up DAYS_AFTER_MATCH_TO_REMIND(7) days later to
        `remind_matches`. Here we find the pairs that haven't yet set up a match and we'll encourage them to set one up.
    """

    def add_arguments(self, parser):
        parser.add_argument('slack_team_id', type=str, help='the slack_team_id ("T41DZFW4T" is penny-university)')

    def handle(self, *args, **options):
        periodically_request_matches(options['slack_team_id'])
