#!/usr/bin/env python3
import argparse
import ast
from dateutil.parser import parse
import json
import mailbox
import os
import re

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
            message['date'] = 'Wed, 2 Nov 2017 14:36:37 -0800'
        if message['message_id'] == '<9d13d7dc-0611-43ca-9a0c-418be8469b5c@googlegroups.com>':
            message['date'] = 'Wed, 1 Dec 2017 12:34:56 -0700'

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


if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Extract and normalize content from penny university google forum. '
                    'Requires that you retrieve forum content here: https://takeout.google.com'
    )
    parser.add_argument(
        '--data_dump_path', dest='data_dump_path', action='store', help='unzipped google data dump path', required=True,
    )
    parser.add_argument(
        '--output_file', dest='output_file', action='store', help='where to dump the output', required=True,
    )
    args = parser.parse_args()

    mbox_path = os.path.join(args.data_dump_path, 'topics.mbox')
    print(mbox_path)
    mbox = mailbox.mbox(mbox_path)
    messages = get_messages(mbox)
    messages = special_case(messages)
    chats = get_chats(messages)
    with open(args.output_file, 'w') as f:
        f.write(json.dumps(chats))
