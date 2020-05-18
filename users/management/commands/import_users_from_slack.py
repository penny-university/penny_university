from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import update_social_profile_from_slack


class Command(BaseCommand):
    help = (
        'Import user information from slack.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--live_run',
            dest='live_run',
            action='store_true',
            help='opposite of dry run - will actually write data to the database',
            required=False,
        )

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                new_users, updated_users = update_social_profile_from_slack()

                print(f'\n\nNEW USERS:\n {new_users}')
                print(f'\n\nUPDATED USERS:\n {updated_users}')
                print(
                    f'\n\nCreated\n'
                    f'- {len(new_users)} new users\n'
                    f'- {len(updated_users)} updated users\n'
                )
                if sum([len(new_users), len(updated_users)]) == 0:
                    print('nothing to do here')
                    raise RuntimeError('not committing')
                if not options['live_run']:
                    print('THIS IS A DRY RUN ONLY - NOT COMMITTING')
                    print('Run with --live_run to actually commit.')
                    raise RuntimeError('not committing')
                print('COMMITTED')
        except Exception as e:
            if str(e) == 'not committing':
                pass
            else:
                raise
