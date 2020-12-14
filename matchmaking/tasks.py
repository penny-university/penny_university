from datetime import timedelta, timezone, datetime
import json

from background_task.signals import task_failed
from background_task.models import Task
from sentry_sdk import capture_message, capture_exception

from common.utils import background
from matchmaking.common import request_matches, make_matches, remind_matches
from matchmaking.matchmaker import MatchMaker

PERIOD_IN_DAYS = 15
DAYS_AFTER_REQUEST_TO_MAKE_MATCH = 7
DAYS_AFTER_MATCH_TO_REMIND = 7


def periodically_request_matches(slack_team_id):
    """first check if we already have a task for this slack team"""
    # this is a little lazy way to implement this, and it ties our implementation to background_tasks, but
    # I'd rather not think through and create a whole new model for SlackTeamsWithAutomatedMatchMaking just yet.
    existing_request_match_tasks = Task.objects.filter(
        task_name=_request_matches_task_name(),
        task_params__contains=f'"slack_team_id": "{slack_team_id}"',
    )
    if len(existing_request_match_tasks) >= 1:
        if len(existing_request_match_tasks) > 1:
            capture_message(
                'multiple _request_match_tasks for slack team',
                extras={'slack_team_id': slack_team_id},
            )
            for task in existing_request_match_tasks[1:]:
                task.delete()
        raise RuntimeError(f'_request_match_task already exists for {slack_team_id}')

    _request_matches_task(
        # NOTE it is important to use key word args here because the `set_up_again` refers to the args by name
        slack_team_id=slack_team_id,
        repeat=PERIOD_IN_DAYS * 3600 * 24,  # best I can tell, this arg must be specified in seconds
    )


def _request_matches_task_name():
    return f'{_request_matches_task.__module__}.{_request_matches_task.now.__name__}'


@background
def _request_matches_task(slack_team_id):
    """Runs request_matches and then schedules make_matches. Importantly this also connects failure of this task to a
    callback that starts it over again.
    """
    def set_up_again(**kwargs):
        if 'completed_task' not in kwargs:
            return

        completed_task = kwargs['completed_task']
        if completed_task.task_name != _request_matches_task_name():
            # wrong task
            return

        task_params = json.loads(completed_task.task_params)[1]
        if 'slack_team_id' not in task_params:
            capture_message('slack_team_id not found in task_params')
            return
        if task_params['slack_team_id'] != slack_team_id:
            # wrong slack team id
            return

        capture_message('setting up request_matches_task again', extras={'slack_team_id': slack_team_id})
        periodically_request_matches(task_params['slack_team_id'])

    try:
        # if this task fails, then this callback will reschedule it for next time
        # the dispatch_uid will ensure that even though task_failed.connect is called each time this task runs,
        # this callback will only be used once per task
        task_failed.connect(set_up_again, dispatch_uid=f'request_matches_task_for_{slack_team_id}')

        request_matches(slack_team_id)
        _make_matches_task(slack_team_id=slack_team_id, schedule=timedelta(days=DAYS_AFTER_REQUEST_TO_MAKE_MATCH))
    except Exception as e:
        capture_exception(e)


@background
def _make_matches_task(slack_team_id):
    """Runs make_matches and then schedules remind_matches."""
    try:
        matches = MatchMaker(
            match_request_since_date=datetime.now().astimezone(timezone.utc) - timedelta(weeks=2)
        ).run()
        for match in matches:
            make_matches(slack_team_id, match['emails'], match['topic'])

        _remind_matches_task(slack_team_id=slack_team_id, schedule=timedelta(days=DAYS_AFTER_MATCH_TO_REMIND))
    except Exception as e:
        capture_exception(e)


@background
def _remind_matches_task(slack_team_id):
    """Runs remind_matches."""
    try:
        remind_matches(slack_team_id=slack_team_id)
    except Exception as e:
        capture_exception(e)
