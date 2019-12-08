from django.core.management.base import BaseCommand

from users.utils import update_user_profile_from_slack


class Command(BaseCommand):
    help = (
        'Import user information from slack.'
    )

    def handle(self, *args, **options):
        update_user_profile_from_slack()
