from django.http import HttpResponse
from django.shortcuts import redirect
from django.conf import settings
import google_auth_oauthlib.flow


def auth_request(request):
    client_secrets = {
        "web": {
            "client_id": settings.GOOGLE_AUTH['CLIENT_ID'],
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "client_secret": settings.GOOGLE_AUTH['CLIENT_SECRET'],
            "redirect_uris": [settings.GOOGLE_AUTH['REDIRECT_URI']]
        }
    }

    flow = google_auth_oauthlib.flow.Flow.from_client_config(
        client_secrets,
        scopes=['https://www.googleapis.com/auth/calendar.events'],
    )

    flow.redirect_uri = settings.GOOGLE_AUTH['REDIRECT_URI']

    authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type='offline',
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes='true',
    )

    return redirect(authorization_url)


def auth_success(request):
    return HttpResponse("<h1/>Yay, you authorized G Cal!</h1>")
