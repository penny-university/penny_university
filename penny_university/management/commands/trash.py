import time

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        i = 0
        while True:
            i += 1
            print(i, 'XXXXXXXXX')
            time.sleep(5.0)
