from collections import Counter
from matchmaking.models import MatchRequest, Match
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = """Print Automate Matchmaker Stats"""

    def add_arguments(self, parser):
        parser.add_argument(
            '--since_date',
            dest='since_date',
            help='date formated as YYYY-MM-DD',
            required=True,
        )

    def handle(self, *args, **options):
        date = options['since_date']
match_requests = list(MatchRequest.objects.filter(date__gte=date))
num_match_requests = len(match_requests)
who_requests_matches = Counter([m.profile.real_name for m in match_requests])
matches = list(Match.objects.filter(date__gte=date))
num_matches = len(matches)
penny_chats_that_met = [m.penny_chat.title for m in matches if m.penny_chat]
num_penny_chats_that_met = len(penny_chats_that_met)
penny_chats_that_met = '\n    '.join(penny_chats_that_met)
print(f'''
Since {date}:

num_match_requests = {num_match_requests}

who_requests_matches = {who_requests_matches}

num_matches = {num_matches}

num_penny_chats_that_met = {num_penny_chats_that_met}

penny_chats_that_met =
    {penny_chats_that_met}

''')
