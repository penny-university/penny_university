import json
import os

from flask import (
    Flask,
    request,
    jsonify,
)
import slack

slack_client = slack.WebClient(token=os.environ['SLACK_API_KEY'])

app = Flask(__name__)


@app.route('/bot/interactive/', methods=['POST'])
def interactive():
    print_stuff('/bot/interactive/', request)
    return jsonify({})

@app.route('/bot/hook/', methods=['POST'])
def hook():
    data = request.get_json()
    print_stuff('/bot/hook/', request)
    if data.get('event', {}).get('subtype', '') != 'bot_message':
        slack_client.chat_postMessage(channel='#general', text='what is up')
    return jsonify({})


@app.route('/bot/command/', methods=['POST'])
def command():
    print_stuff('/bot/command/', request)
    return jsonify({})


def print_stuff(path, request):
    print(f'{path}\nJSON: {json.dumps(request.json, indent=2)}\nARGS: {json.dumps(request.args, indent=2)}\nFORM: {json.dumps(request.form, indent=2)}\n-----------------------------------------\n\n')
