from datetime import datetime, timezone

import pytest
from unittest.mock import call

from users.management.commands.notify_users_about_activity import Command


def test_handle(mocker):
    command = Command()
    get_recent_followup_queryset = mocker.patch('users.management.commands.notify_users_about_activity.get_recent_followup_queryset')  # noqa
    notify_about_activity = mocker.patch('users.management.commands.notify_users_about_activity.notify_about_activity')
    with get_recent_followup_queryset, notify_about_activity:
        options = {
            'live_run': False,
            'range_start': '2002-01-14T00:00:00Z',
            'range_end': '2020-08-14T00:00:00Z',
            'yesterday': False,
            'filter_emails': 'jfberryman@gmail.com,nick.chouard@gmail.com',
        }
        command.handle(**options)
        assert get_recent_followup_queryset.call_args == call(
            datetime(2002, 1, 14, 0, 0, tzinfo=timezone.utc),
            datetime(2020, 8, 14, 0, 0, tzinfo=timezone.utc),
            ['jfberryman@gmail.com', 'nick.chouard@gmail.com'],
        )
