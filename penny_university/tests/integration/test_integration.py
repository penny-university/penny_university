import pytest

from rest_framework.test import APIClient

# @pytest.mark.django_db
# def test_integration():
#     # TODO! start here
#     client = APIClient()
#     response = client.post('/bot/command/', data={
#         'token': ['xxxxx'],
#         'team_id': ['T1234567'],
#         'team_domain': ['pennyjohn'],
#         'channel_id': ['C1234567'],
#         'channel_name': ['general'],
#         'user_id': ['U1234567'],
#         'user_name': ['jfberryman'],
#         'command': ['/penny'],
#         'text': ['chat'],
#         'response_url': ['https://hooks.slack.com/commands/TNJ631DFU/1110991795223/tB4aaFOVRjEprl6QTuXKcNvz'],
#         'trigger_id': ['1119001099302.766207047538.2f4e162a14170b4540fd8df3b16418a7'],
#     })
#     from common.utils import get_slack_client
#     sc = get_slack_client()
#     sc.mock_log_all_calls()
