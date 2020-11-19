import random
import string
from datetime import timedelta

from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

from django.conf import settings


class GoogleCalendar:
    def __init__(self, credentials, calendar_id='primary'):
        self.service = build('calendar', 'v3', credentials=credentials)
        self.calendar_id = calendar_id
        self.events = self.service.events()

    def add_conference_call_to_event(self, event_id):
        event_patch = {
            'conferenceData': {
                'createRequest': {
                    'requestId': random_string_generator()
                }
            }
        }
        self.events.patch(
            calendarId=self.calendar_id,
            eventId=event_id,
            body=event_patch,
            conferenceDataVersion=1,
        ).execute()

        # Fetch updated event and return it
        return self.events.get(calendarId=self.calendar_id, eventId=event_id).execute()

    @staticmethod
    def build_event_data(summary, description, start, end):
        if not end:
            end = start + timedelta(hours=1)
        data = {
            'summary': summary,
            'description': description,
            'start': {
                'dateTime': start.isoformat(),
            },
            'end': {
                'dateTime': end.isoformat(),
            }
        }
        return data

    def create_event(self, summary, description, start, end=None, with_meet=True):
        data = GoogleCalendar.build_event_data(summary, description, start, end)
        event_data = self.events.insert(calendarId='primary', body=data).execute()

        if with_meet:
            event_data = self.add_conference_call_to_event(event_id=event_data['id'])

        return event_data

    def update_event(self, event_id, summary, description, start, end=None):
        data = GoogleCalendar.build_event_data(summary, description, start, end)
        self.events.patch(calendarId='primary', eventId=event_id, body=data).execute()


def get_google_flow():
    client_secrets = {
        "web": {
            "client_id": settings.GOOGLE_AUTH['CLIENT_ID'],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_secret": settings.GOOGLE_AUTH['CLIENT_SECRET'],
            "redirect_uris": [settings.GOOGLE_AUTH['REDIRECT_URI']]
        }
    }

    flow = Flow.from_client_config(
        client_secrets,
        scopes=['https://www.googleapis.com/auth/calendar.events'],
    )

    flow.redirect_uri = settings.GOOGLE_AUTH['REDIRECT_URI']

    return flow


def get_authorization_url(user_email):
    flow = get_google_flow()

    authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true',
        state=urlsafe_base64_encode(force_bytes(user_email))
    )

    return authorization_url


def build_credentials(google_credentials):
    return Credentials(**{
        'token': google_credentials.token,
        'refresh_token': google_credentials.refresh_token,
        'token_uri': "https://oauth2.googleapis.com/token",
        'client_id': settings.GOOGLE_AUTH['CLIENT_ID'],
        'client_secret': settings.GOOGLE_AUTH['CLIENT_SECRET'],
        'scopes': [s.scope for s in google_credentials.scopes.all()]
    })


def random_string_generator(length=16):
    return ''.join(random.choice(string.ascii_letters + string.punctuation) for x in range(length))
