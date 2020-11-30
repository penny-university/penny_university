from common.utils import background
from matchmaking.common import request_matches


@background
def request_matches_and_schedule_make_matches():
    request_matches()