# from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from django.db.models import Count
from django.template.loader import render_to_string

from users.models import User


# I'm scared to death of accidentally sending mail to everyone
def send_mail(*args, **kwargs):
    pass


class Command(BaseCommand):
    help = (
        'Email everyone associate with Penny U and tell them that we have a new website.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--live_run',
            dest='live_run',
            action='store_true',
            help='opposite of dry run - will actually send emails',
            required=False,
        )

        parser.add_argument(
            '--other_emails',
            dest='other_emails',
            help='csv list of emails that we should send a generic email to.',
            required=True,
        )

    def handle(self, *args, **kwargs):
        users = User.objects.annotate(chat_count=Count('user_chats'))
        for user in users:
            send_welcome_back_email(user, live_run=False)


def send_welcome_back_email(user, live_run=False):
    context = {}
    if user.first_name:
        context['first_name'] = user.first_name
    if user.chat_count > 0:
        print("asdfasdf")
        context['chats_url'] = f'https://www.pennyuniversity.org/profile/{user.id}/'
    print(context)

    text_email = render_to_string('users/welcome_back_email.txt', context)
    html_email = render_to_string('users/welcome_back_email.html', context)
    if live_run:
        send_mail(
            subject='Greeting from Penny University | Take a look at what we\'ve been up to!',
            message=text_email,
            from_email='"Penny University" <lincoln@pennyuniversity.org>',
            recipient_list=user.email,
            html_message=html_email,
        )
    else:
        print(f'chat count = {user.chat_count}')
        print(f'USER: {user.first_name} {user.last_name}\n\nMESSAGE: {text_email}\n')
