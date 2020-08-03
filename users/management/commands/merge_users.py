from django.core.management.base import BaseCommand
from django.db import transaction
from sentry_sdk import capture_exception

from pennychat.models import Participant, FollowUp
from users.models import User, SocialProfile


class Command(BaseCommand):
    help = (
        'Merge two users into one.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--live-run',
            dest='live_run',
            action='store_true',
            help='opposite of dry run - will actually write data to the database',
            required=False,
        )
        parser.add_argument(
            '--from-email',
            dest='from_email',
            help='The email of the user you want to merge into the other',
            required=True,
        )
        parser.add_argument(
            '--to-email',
            dest='to_email',
            help='The email of the user you want to merge into',
            required=True,
        )

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                from_user = User.objects.get(email=options['from_email'])
                to_user = User.objects.get(email=options['to_email'])
                merge_users(from_user, to_user)
                if not options['live_run']:
                    print('THIS IS A DRY RUN ONLY - NOT COMMITTING')
                    print('Run with --live_run to actually commit.')
                    raise RuntimeError('not committing')
                print('COMMITTED')
        except Exception as e:
            capture_exception(e)
            if str(e) == 'not committing':
                pass
            else:
                raise


def merge_users(from_user, to_user):
    participants = Participant.objects.filter(user=from_user)
    for participant in participants:
        participant.user = to_user
        participant.save()
        print(f'Participation in "{participant.penny_chat.title}" merged to {to_user.email}')
    follow_ups = FollowUp.objects.filter(user=from_user)
    for follow_up in follow_ups:
        follow_up.user = to_user
        follow_up.save()
        print(f'Follow Up from "{follow_up.penny_chat.title}" merged to {to_user.email}')
    profiles = SocialProfile.objects.filter(user=from_user)
    for profile in profiles:
        profile.user = to_user
        profile.save()
        print(f'Profile {profile.email} merged to {to_user.email}')
