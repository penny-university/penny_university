from unittest.mock import call, patch

from django.conf import settings
from background_task.signals import task_failed
import pytest

from matchmaking.matchmaker import MatchMaker
from matchmaking.tasks import _request_matches_task, periodically_request_matches
from background_task.models import CompletedTask, Task


class Boom(RuntimeError):
    pass


def test_request_matches_correctly_restarts_on_failure(mocker):
    """When request_matches_task is called, it connects to a django signal that will call request_matches_task to
    restart the cycle. We want to make sure that the restart happens AND that it doesn't restart multiple times (which
    could be the case if the django signal gets connected every time.
    """
    slack_team_id = 'T12345678'

    fail_in_run = 3
    mock_data = {'count': fail_in_run}

    def fail_after_a_few_calls(*args, **kwargs):
        """This simulates a request_matches_task failure by sending a django signal."""
        mock_data['count'] -= 1
        if mock_data['count'] == 0:
            # send failure for this slack team
            task_name = f'{_request_matches_task.__module__}.{_request_matches_task.__name__}'
            task_params = (
                '[[], {'
                f'"slack_team_id": "{slack_team_id}"'
                '}]'
            )
            completed_task = CompletedTask(task_name=task_name, task_params=task_params)
            task_failed.send(sender=Task.__class__, task_id='doesnt matter', completed_task=completed_task)

            # then send failure for some other slack team
            task_name = f'{_request_matches_task.__module__}.{_request_matches_task.__name__}'
            task_params = '[[], {"slack_team_id": "SOME_OTHER_TEAM"}]'
            completed_task = CompletedTask(task_name=task_name, task_params=task_params)
            task_failed.send(sender=Task.__class__, task_id='doesnt matter', completed_task=completed_task)
            raise Boom()

    with patch('matchmaking.tasks.request_matches', side_effect=fail_after_a_few_calls), \
         patch('matchmaking.tasks._make_matches_task'), \
         patch('matchmaking.tasks.periodically_request_matches') as mock_periodically_request_matches:

        # simulate running several times and eventually failing in request_matches
        for _ in range(fail_in_run):
            _request_matches_task(slack_team_id=slack_team_id)

        for call_args in mock_periodically_request_matches.call_args_list:
            assert call_args == call(slack_team_id), 'task restarted, but with wrong params'
        assert mock_periodically_request_matches.call_count == 1, \
            'count = 0 means we did not set the task back up, count > 1 means we sat it up multiple times'


@pytest.mark.django_db
def test_periodically_request_matches_handles_too_many_tasks():
    """When periodically_request_matches is called, we should delete the extra _request_matches_tasks and raise an error
    but not touch other tasks
    """
    slack_team_id = 'T123456'
    for _ in range(3):
        Task.objects.create(
            run_at='2020-10-05 11:11:11Z',
            task_name=f'{_request_matches_task.__module__}.{_request_matches_task.__name__}',
            task_params=f'"slack_team_id": "{slack_team_id}"',
        )
    Task.objects.create(
        run_at='2020-10-05 11:11:11Z',
        task_name=f'{_request_matches_task.__module__}.{_request_matches_task.__name__}',
        task_params='"slack_team_id": "SOME_OTHER_TEAM"',
    )
    Task.objects.create(
        run_at='2020-10-05 11:11:11Z',
        task_name='some.other.task',
        task_params='"whatever": "something"',
    )

    periodically_request_matches(slack_team_id=slack_team_id)

    remaining_tasks = set([f'{t.task_name}:{t.task_params}' for t in Task.objects.all()])
    assert 'matchmaking.tasks._request_matches_task:"slack_team_id": "T123456"' in remaining_tasks
    assert 'matchmaking.tasks._request_matches_task:"slack_team_id": "SOME_OTHER_TEAM"' in remaining_tasks
    assert 'some.other.task:"whatever": "something"' in remaining_tasks
    assert len(remaining_tasks) == 3, 'some of the tasks that were supposed to be deleted were not'


@pytest.mark.django_db
def test_periodically_request_matches():
    slack_team_id = 'T123456'
    with patch('matchmaking.tasks._request_matches_task') as mock_request_matches_task:
        mock_request_matches_task.__module__ = 'matchmaking.tasks'
        mock_request_matches_task.now.__name__ = '_request_matches_task'

        periodically_request_matches(slack_team_id=slack_team_id)

    assert mock_request_matches_task.call_count == 1
    assert mock_request_matches_task.call_args == call(
        slack_team_id=slack_team_id,
        repeat=settings.PERIOD_IN_DAYS * 24 * 3600,
    )


def test_request_matches_task():
    """Because the background tasks are run immediately in tests, we should hit everything in the entire chain."""
    with patch('matchmaking.tasks.request_matches') as mock_request_matches, \
         patch.object(MatchMaker, 'run') as mock_run, \
         patch('matchmaking.tasks.make_matches') as mock_make_matches, \
         patch('matchmaking.tasks.remind_matches') as mock_remind_matches:
        mock_run.return_value = [
            {'emails': ['a@xyz.com', 'b@xyz.com'], 'topic': 'history'},
            {'emails': ['c@xyz.com', 'd@xyz.com'], 'topic': 'match'},
        ]

        slack_team_id = 'T123456'
        _request_matches_task(slack_team_id)

        # request_matches
        assert mock_request_matches.call_count == 1
        assert mock_request_matches.call_args == call(slack_team_id)

        # make_matches
        assert mock_make_matches.call_args_list == [
            call('T123456', ['a@xyz.com', 'b@xyz.com'], 'history'),
            call('T123456', ['c@xyz.com', 'd@xyz.com'], 'match'),
        ]

        # remind_matches
        assert mock_remind_matches.call_count == 1
        assert mock_remind_matches.call_args == call(slack_team_id=slack_team_id)
