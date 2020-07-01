from common.utils import build_url


def test_build_url():
    url = build_url('http://test.com', 'verify', first='param1', second='param2')

    assert 'http://test.com/verify?first=param1&second=param2' in url
