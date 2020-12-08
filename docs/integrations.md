Go to https://developers.google.com/calendar/quickstart/python?authuser=1 and enable the calendar API in order to get credentials for your dev account

Use: http://localhost:8000/integrations/google/auth-callback for your redirect uri

Copy credentials to these respective settings:
* export GOOGLE_CLIENT_ID
* export GOOGLE_CLIENT_SECRET
* export GOOGLE_REDIRECT_URI

Scopes = 'https://www.googleapis.com/auth/calendar.events'
Access type = offline
