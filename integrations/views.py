from django.http import HttpResponse
from django.utils.http import urlsafe_base64_decode

from integrations.models import GoogleCredentials, GoogleCredentialsScope
from integrations.google import get_google_flow
from users.models import User


def auth_success(request):
    error = request.GET.get('error')
    # TODO: Redirect to frontend page
    if error:
        return HttpResponse(f"<h1/>There was an error authorizing with Google.</h1><p>{request.GET.get('error')}</p>")

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

    # TODO: Redirect to frontend page
    return HttpResponse("<h1/>Yay, you authorized G Cal!</h1>")
