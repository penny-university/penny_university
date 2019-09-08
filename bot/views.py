import json
import logging

from django.conf import settings
import slack

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.clickjacking import xframe_options_exempt

from bot.processors.greeting import GreetingBotModule
from bot.processors.base import (
    Bot,
    Event,
)

slack_client = slack.WebClient(token=settings.SLACK_API_KEY)
bot = Bot(event_processors=[GreetingBotModule(slack_client)])


def index(request):
    return HttpResponse("At least something works.")


@xframe_options_exempt
@csrf_exempt
def hook(request):
    blob = json.loads(request.body)
    message_logger = logging.getLogger('messages')
    message_logger.info(request.body)

    if 'challenge' in blob:
        return HttpResponse(json.loads(request.body)['challenge'])
    else:
        print(blob)
        event = blob['event']
        is_bot = False
        if 'subtype' in event and event['subtype'] == 'bot_message':
            is_bot = True
        if not is_bot:
            bot(Event(event))
        return HttpResponse('')


@xframe_options_exempt
@csrf_exempt
def interactive(request):
    payload = json.loads(request.POST['payload'])
    message_logger = logging.getLogger('messages')
    message_logger.info(request.POST['payload'])

    bot(Event(payload))

    return HttpResponse('')
