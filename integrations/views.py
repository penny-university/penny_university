from django.shortcuts import redirect
from django.utils.http import urlsafe_base64_decode
from django.conf import settings

from sentry_sdk import capture_exception

from common.utils import build_url
from integrations.models import GoogleCredentials, GoogleCredentialsScope
from integrations.google import get_google_flow
from users.models import User


def auth_callback(request):
    error = request.GET.get('error')
    if error:
        url = build_url(settings.FRONT_END_HOST, 'google-integration', status='error', message=error)
        capture_exception(Exception(error))
    else:
        user_email_bytes = urlsafe_base64_decode(request.GET.get('state'))
        user_email = user_email_bytes.decode('utf-8') if user_email_bytes is not None else None

        user = User.objects.get(email=user_email)

        flow = get_google_flow()
        flow.fetch_token(authorization_response=request.get_raw_uri())

        user_credentials, created = GoogleCredentials.objects.get_or_create(
            user=user,
            defaults={
                'token': flow.credentials.token,
                'refresh_token': flow.credentials.refresh_token,
            }
        )

        if created:
            for scope in flow.credentials.scopes:
                GoogleCredentialsScope.objects.create(scope=scope, credentials=user_credentials)

        url = build_url(settings.FRONT_END_HOST, 'google-integration', status='success')
    return redirect(url)
