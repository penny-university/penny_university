from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = """
    """

    # def add_arguments(self, parser):
    #     parser.add_argument('slack_handles', type=str, nargs='*', help='a list of slack user names')

    def handle(self, *args, **options):
        slack_team = 'T234928191'
        # TODO! put safety function here to check whether or not we have this set up for that slack team already
        # in the future, we'll have a "deploy all the things" method whenever we get installed
        request_matches(schedule=now, repeat='every 15 days', until='forever')

    def request_matches(self):
        make_matches(schedule='in 7 days')

    def make_matches(self):
        remind_matches(schedule='in 7 days')

    def remind_matches(self):
        pass