import os

def test_conftest_has_been_run():
    assert os.environ['CONFTEST_HAS_BEEN_RUN'] == 'true', \
        """It is important conftest.py be run because it checks that real keys are not defined during testing."""