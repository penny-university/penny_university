import pytest

from rest_framework.test import APIClient

# @pytest.mark.django_db
# def test_integration():
#     client = APIClient()
#     response = client.post('/bot/command/', data={
#         'token': ['5jmgqD3qXz6uXIkShw3MmZ8j'],
#         'team_id': ['TNJ631DFU'],
#         'team_domain': ['pennyjohn'],
#         'channel_id': ['CNQG95KG9'],
#         'channel_name': ['general'],
#         'user_id': ['UNKEQA7CK'],
#         'user_name': ['jfberryman'],
#         'command': ['/penny'],
#         'text': ['chat'],
#         'response_url': ['https://hooks.slack.com/commands/TNJ631DFU/1110991795223/tB4aaFOVRjEprl6QTuXKcNvz'],
#         'trigger_id': ['1119001099302.766207047538.2f4e162a14170b4540fd8df3b16418a7'],
#     })
#     import ipdb;ipdb.set_trace()
#     from common.utils import get_slack_client
#     sc = get_slack_client()
