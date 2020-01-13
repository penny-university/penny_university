import ast
from dateutil.parser import parse
import json
import mailbox
import re
import sys

from django.conf import settings
from django.core.management.base import (
    BaseCommand,
    CommandError,
)
from django.db import transaction

from pennychat.models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.models import UserProfile


class Command(BaseCommand):
    help = (
        'Extract and normalize content from penny university google forum. '
        'Requires that you retrieve forum content here: https://takeout.google.com. '
        'Run remotely with `cat /wherever/topics.mbox | heroku run --no-tty -a <your-app> ./manage.py import_google_'
        'forum --to_database`. When doing --live_run, if you have problems then make the --live_run argument NOT the '
        'last argument. ¯\\_(ツ)_/¯'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--output_file',
            dest='output_file',
            action='store',
            help='where to dump the output',
            required=False,
        )
        parser.add_argument(
            '--to_database',
            dest='to_database',
            action='store_true',
            help='where to dump the output',
            required=False,
        )
        parser.add_argument(
            '--live_run',
            dest='live_run',
            action='store_true',
            help='opposite of dry run - will actually write data to the database',
            required=False,
        )

    def handle(self, *args, **options):
        print('Waiting to receive piped in .mbox file')
        mbox_path = '/tmp/mbox_dump.txt'
        with open(mbox_path, 'w') as f:
            charcount = f.write(sys.stdin.read())

        if charcount == 0:
            raise RuntimeError('Unable to write .mbox to file')
        else:
            print('Wrote .mbox file to disk')

        if not options['to_database'] and not options['output_file']:
            raise CommandError('Either `to_database` or `output_file` must be specified.')

        mbox = mailbox.mbox(mbox_path)
        messages = get_messages(mbox)
        messages = special_case(messages)
        raw_chats = get_chats(messages)
        formated_chats = format_chats(raw_chats)

        if options['output_file']:
            with open(options['output_file'], 'w') as f:
                f.write(json.dumps(formated_chats))

        if options['to_database']:
            import_to_database(formated_chats, options['live_run'])


codepoint_re = re.compile(r'=([0-9A-Fa-f]{2})')
equal_then_space_re = re.compile(r'=\s+')
weird_newline_re = re.compile(r'=\r?\n')
weird_20_newline_re = re.compile(r'=20\r?\n')
space_newline_re = re.compile(r' \r?\n')
double_indent_re = re.compile(r'(?<!^) {8}', re.MULTILINE)  # ignores indents at beginning of lines
indent_re = re.compile(r'(?<!^) {4}', re.MULTILINE)  # ignores indents at beginning of lines
quote_re = re.compile(
    r'On.*?wrote:'
    r'(?:\r?\n)*'
    r'(?:\r?\n>.*)+',
    re.DOTALL
)
chinese_quote_re = re.compile(
    r'^.*=E5=AF=AB=E9=81=93=EF=BC=9A'
    r'(?:\r?\n)*'
    r'(?:\r?\n>.*)+',
    re.DOTALL | re.MULTILINE
)
image_re = re.compile(r'\[image:.*?\]')
localhost_link_re = re.compile(r'<http://localhost.*?>')
link_re = re.compile(r'<(https?:.*?)>')


def extract_body(message):
    body = message.get_payload()
    while not isinstance(body, str):
        body = body[0].get_payload()

    body = weird_newline_re.sub('', body)
    body = weird_20_newline_re.sub(' ', body)
    body = space_newline_re.sub(' ', body)
    body = double_indent_re.sub(' ', body)
    body = indent_re.sub(' ', body)
    body = quote_re.sub('', body)
    body = chinese_quote_re.sub('', body)
    body = image_re.sub('', body)
    body = localhost_link_re.sub('', body)
    body = link_re.sub(r'(\1)', body)

    # convert `=E2=80=99` (and similar) values to unicode characters
    exceptions = ['false', 'bayes', 'AFQ']  # these are because we encounter strings like `=false` (note `=fa`)
    for ex in exceptions:
        body = body.replace(f'={ex}', f'=x{ex}')
    body = codepoint_re.sub(r'\\x\1', body)  # replaces `=E2` with `\xE2`
    for ex in exceptions[::-1]:
        body = body.replace(f'=x{ex}', f'={ex}')
    body = ast.literal_eval(f"b'''{body}'''")  # oh man this is smelly - but safe actually
    body = body.decode('utf8')

    return body


newlines_re = re.compile(r'(?:\r?\n)+')
email_re = re.compile('^(?:.*?<)?(.*?)(?:[>])?$')


def get_messages(mbox):
    messages = []
    for message in mbox.values():
        messages.append({
            'from': email_re.match(message['from'])[1],
            'to': message['to'],
            'subject': newlines_re.sub('', message['subject']),
            'date': parse(message['date']).isoformat(),
            'message_id': message['message-id'],
            'in_reply_to': message['in-reply-to'],
            'body': extract_body(message),
        })
    return messages


def special_case(messages):
    for message in messages:
        # homeless
        if message['message_id'] == '<CAAoO+ZLxv04ZtdDseVSeBOBy5tkriQ_mUc4fLZ=g1ihhk5fVig@mail.gmail.com>':
            message['in_reply_to'] = '<a08af11e-1a99-4023-a88d-8f6c2b833298@googlegroups.com>'
        if message['message_id'] == '<CAEid7Y_tpXdw4y+_LJMAmsMpnX7rKDLcoy69pC59o+6_JS7TSw@mail.gmail.com>':
            message['in_reply_to'] = '<a3c6d780-e1ed-4409-bfec-d925813df50c@googlegroups.com>'

        # misordered
        if message['message_id'] == '<138b584a-28ef-46da-ba35-a913cd620c16@googlegroups.com>':
            message['date'] = parse('Wed, 2 Nov 2017 14:36:37 -0800').isoformat()
        if message['message_id'] == '<9d13d7dc-0611-43ca-9a0c-418be8469b5c@googlegroups.com>':
            message['date'] = parse('Wed, 1 Dec 2017 12:34:56 -0700').isoformat()

        # posted forum message with different email than used in slack
        if message['from'] == 'scott@stratasan.com':
            message['from'] = 'scott.s.burns@gmail.com'
        if message['from'] == 'jnbrymn@github.com':
            message['from'] = 'jfberryman@gmail.com'
        if message['from'] == 'rmatsum@g.clemson.edu':
            message['from'] = 'ray.a.matsumoto@vanderbilt.edu'

    return messages


def get_chats(messages):
    messages_by_id = {}
    for message in messages:
        messages_by_id[message['message_id']] = message

    unsorted_chats = {}
    homeless_messages = []
    for message in messages:
        original_message = message
        while message['in_reply_to'] is not None:
            try:
                message = messages_by_id[message['in_reply_to']]
            except KeyError:
                homeless_messages.append(message)
                break
        unsorted_chats.setdefault(message['message_id'], []).append(original_message)

    assert len(homeless_messages) == 0

    sorted_chats = {}
    for k, v in unsorted_chats.items():
        subchats = sorted(v, key=lambda m: m['date'])
        sorted_chats[k] = subchats
        assert 'Re:' not in subchats[0]

    unsorted_chat_list = []
    for k, v in sorted_chats.items():
        unsorted_chat_list.append({
            'subject': v[0]['subject'],
            'from': v[0]['from'],
            'date': v[0]['date'],
            'messages': v,
        })

    return sorted(unsorted_chat_list, key=lambda c: c['date'])


def format_chats(raw_chats):
    formated_chats = []
    for chat in raw_chats:
        followups = []
        for message in chat['messages']:
            followups.append({
                'content': message['body'],
                'date': message['date'],
                'user': message['from'],
            })
        formated_chats.append({
            'title': chat['subject'],
            'description': '',
            'date': chat['date'],
            'user': chat['from'],
            'followups': followups,
        })
    return formated_chats


def import_to_database(formated_chats, live_run=False):

    new_users = []
    new_chats = []
    new_follow_ups = []
    new_participants = []

    try:
        with transaction.atomic():
            for dump_chat in formated_chats:
                attendees = set()
                organizer, created = get_or_create_anonymous_user(dump_chat['user'])
                if created:
                    new_users.append(organizer)

                db_chat, created = PennyChat.objects.update_or_create(
                    title=dump_chat['title'],
                    date=dump_chat['date'],
                    defaults=dict(
                        title=dump_chat['title'],
                        date=dump_chat['date'],
                        description=dump_chat['description'],
                    )
                )
                if created:
                    new_chats.append(db_chat)

                for dump_follow_up in dump_chat['followups']:

                    attendee, created = get_or_create_anonymous_user(dump_follow_up['user'])
                    if created:
                        new_users.append(attendee)

                    attendees.add(attendee)

                    db_follow_up, created = FollowUp.objects.update_or_create(
                        date=dump_follow_up['date'],
                        user=attendee,
                        defaults=dict(
                            content=dump_follow_up['content'],
                            date=dump_follow_up['date'],
                            user=attendee,
                            penny_chat=db_chat,
                        )
                    )
                    if created:
                        new_follow_ups.append(db_follow_up)

                # we don't want to create the participant row twice for an organizer who also had a follow-up
                attendees.discard(organizer)
                for attendee in attendees:
                    db_participant, created = Participant.objects.update_or_create(
                        user=attendee,
                        penny_chat=db_chat,
                        defaults=dict(
                            user=attendee,
                            penny_chat=db_chat,
                            role=Participant.ATTENDEE,
                        )
                    )
                    if created:
                        new_participants.append(db_participant)

                db_participant, created = Participant.objects.update_or_create(
                    user=organizer,
                    penny_chat=db_chat,
                    defaults=dict(
                        user=organizer,
                        penny_chat=db_chat,
                        role=Participant.ORGANIZER,
                    )
                )
                if created:
                    new_participants.append(db_participant)

            print(f'\n\nNEW USERS:\n {new_users}')
            print(f'\n\nNEW CHATS:\n {new_chats}')
            print(f'\n\nNEW FOLLOW UPS:\n {new_follow_ups}')
            print(f'\n\nNEW PARTICIPANTS:\n {new_participants}')
            print(
                f'\n\nCreated\n'
                f'- {len(new_users)} new users\n'
                f'- {len(new_chats)} new chats\n'
                f'- {len(new_follow_ups)} new follow ups\n'
                f'- {len(new_participants)} new participants\n'
            )

            if sum([len(new_users), len(new_chats), len(new_follow_ups), len(new_participants)]) == 0:
                print('nothing to do here')
                raise RuntimeError('not committing')
            if not live_run:
                print('THIS IS A DRY RUN ONLY - NOT COMMITTING')
                print('Run with --live_run to actually commit.')
                raise RuntimeError('not committing')
            print('COMMITTED')
    except Exception as e:
        if str(e) == 'not committing':
            pass
        else:
            raise


def get_or_create_anonymous_user(email):
    user, created = UserProfile.objects.get_or_create(
        email=email,
        slack_team_id=settings.SLACK_TEAM_ID,
        defaults={
            'real_name': 'anonymous',
            'slack_team_id': settings.SLACK_TEAM_ID,
        })
    return user, created
