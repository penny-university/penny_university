from datetime import timedelta
import json

from background_task.signals import task_failed
from background_task.models import Task
from sentry_sdk import capture_message

from common.utils import background
from matchmaking.common import request_matches


def periodically_request_matches(slack_team_id, period_in_days, days_after_request_to_make_match, days_after_match_to_remind):
    # first check if we already have a task for this slack team
    # this is a little lazy way to implement this, and it ties our implementation to background_tasks, but
    # I'd rather not yet think through and create a whole new model for SlackTeamsWithAutomatedMatchMaking or something.
    # We'll learn more and create that later.
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
        period_in_days=period_in_days,
        days_after_request_to_make_match=days_after_request_to_make_match,
        days_after_match_to_remind=days_after_match_to_remind,
        repeat=period_in_days,#TODO! change to days e.g. *3600*24
    )


def _request_matches_task_name():
    return f'{_request_matches_task.__module__}.{_request_matches_task.now.__name__}'


def request_matches():
    #TODO! import the real version of this
    pass

@background
def _request_matches_task(slack_team_id, period_in_days, days_after_request_to_make_match, days_after_match_to_remind):
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
        periodically_request_matches(
            task_params['slack_team_id'],
            period_in_days,
            days_after_request_to_make_match,
            days_after_match_to_remind,
        )

    # if this task fails, then this callback will reschedule it for next time
    # the dispatch_uid will ensure that even though task_failed.connect is called each time this task runs,
    # this callback will only be used once per task
    task_failed.connect(set_up_again, dispatch_uid=f'request_matches_task_for_{slack_team_id}')
    print(f'FAKE REQUEST MATCHES (will remind in {days_after_request_to_make_match} days')
    request_matches()
    _make_matches_task(
        days_after_match_to_remind=days_after_match_to_remind,
        schedule=timedelta(seconds=days_after_request_to_make_match),#TODO! change to days
    )


@background
def _make_matches_task(days_after_match_to_remind):
    #TODO! this is fake
    print(f'FAKE MAKE MATCHES (will remind in {days_after_match_to_remind} days')
    _remind_matches_task(
        schedule=timedelta(seconds=days_after_match_to_remind),#TODO! change to days
    )


@background
def _remind_matches_task():
    #TODO! this is fake
    print('FAKE REMIND MATCHES')

