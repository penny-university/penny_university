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


slack = slack.WebClient(token=settings.SLACKER_KEY)
bot = Bot(event_processors=[GreetingBotModule(slack)])


def index(request):
    return HttpResponse("Screwing around, setting up a django server, making sure I can get through firewall, exercising old neurons, learning 'screen'")


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
            # channel = 'CHCM2MFHU'
            bot(Event(event))
            # text = event['text']
            # slack.chat.post_message('#penny-playground', text)
        return HttpResponse('')


@xframe_options_exempt
@csrf_exempt
def interactive(request):
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
            # channel = 'CHCM2MFHU'
            # bot(Event(event))
            # text = event['text']
            slack.chat.post_message('#penny-playground', blob)
        return HttpResponse('')
