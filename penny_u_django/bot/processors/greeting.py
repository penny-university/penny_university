from bot.processors.base import (
    BotModule,
    event_filter_factory,
)

CHANNEL_NAME__ID = {
    'data': 'C41403LBA',
    'web': 'C414TFTCH',
    'random': 'C41DZGE8K',
    'general': 'C41G02RK4',
    'deutsch': 'C41Q2A527',
    'django': 'C41QX2KRS',
    'python': 'C42D67CNA',
    'meta-penny': 'C42G2A4LF',
    'sfpenny': 'C44K5JAR4',
    'jobs': 'C5WT843FU',
    'rust': 'C66LPHCLU',
    'data-nerds-projects': 'C68MH0E8L',
    'javascript': 'C6GTBL3L5',
    'job': 'CDM9N259S',
    'penny-playground': 'CHCM2MFHU',
    'book-club': 'CHP0FA4J1'
}


@event_filter_factory
def in_room(room):
    def filter_func(event):
        return event['channel'] == CHANNEL_NAME__ID[room]

    return filter_func


@event_filter_factory
def is_event_type(type):
    def filter_func(event):
        return event['subtype'] == type

    return filter_func


class GreetingBotModule(BotModule):
    GREETING_MESSAGE = '''*Welcome to Penny University*

Penny University is a self-organizing, peer-to-peer learning community. In Penny U there are no "mentors" or "mentees" but rather peers that enjoy learning together, socially. 
• If you have something you can teach, then let it be known. 
• If you have something you want to learn, then reach out to the community or to an individual and ask for help - buy them a coffee or lunch, or jump on a Google Hangout. (This is called a Penny Chat.)
• And when your Penny Chat is complete, show your appreciation by posting a Penny Chat review in our <http://pennyuniversity.org|forum>. Teach us a little of what you have learned.

Penny U is on the move. If all goes well then I, your trusty robot sidekick, will gain super powers in the coming months. I will help you find the answers you're looking for. I will also replace our lowly <http://pennyuniversity.org|Google Groups home page> with something a little more... appealing. If you want to help use out then let <@U42HCBFEF> and <@UES202FV5> know.
'''

    def __init__(self, slack):
        self.slack = slack
        self.existing_users = []

    @in_room('general')
    @is_event_type('channel_join')
    def welcome_user(self, event):
        if event['user'] not in self.existing_users:
            self.slack.chat_postMessage(channel=event['user'], text=GreetingBotModule.GREETING_MESSAGE)
            self.existing_users.append(event['user'])

