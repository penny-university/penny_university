from django.db import models

from users.models import User


class GoogleCredentials(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='google_credentials')
    token = models.TextField()
    refresh_token = models.TextField()


class GoogleCredentialsScope(models.Model):
    scope = models.TextField()
    credentials = models.ForeignKey(GoogleCredentials, on_delete=models.CASCADE, related_name='scopes')
