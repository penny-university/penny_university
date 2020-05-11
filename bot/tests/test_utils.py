from bot.utils import channel_lookup


def test_channel_lookup(mocker):
    fake_slack_client = mocker.Mock()
    resp = mocker.Mock()
    resp.data = {'channels': [{'name': 'general', 'id': 'C123456'}]}
    fake_slack_client.channels_list.return_value = resp

    with mocker.patch('bot.utils.get_slack_client', return_value=fake_slack_client):
        chan_id_1 = channel_lookup('general')
        chan_id_2 = channel_lookup('general')

    assert chan_id_1 == chan_id_2 == 'C123456'
    assert fake_slack_client.channels_list.call_count == 1, 'we must cache the channels_list call b/c it is expensive'
