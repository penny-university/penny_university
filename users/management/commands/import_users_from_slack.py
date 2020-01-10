from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import update_user_profile_from_slack


class Command(BaseCommand):
    help = (
        'Import user information from slack.'
    )

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                new_users, updated_users = update_user_profile_from_slack()

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
                answer = input('\ncommit transaction? (n/Y) > ')
                if answer.lower() != 'y':
                    raise RuntimeError('not committing')
                print('committed')
        except Exception as e:
            if str(e) == 'not committing':
                print('abandoned')
            else:
                raise
