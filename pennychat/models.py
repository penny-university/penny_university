from django.db import models


class PennyChat(models.Model):
    DRAFT_STATUS = 1
    SHARED_STATUS = 2
    STATUS_CHOICES = (
        (DRAFT_STATUS, 'Draft'),
        (SHARED_STATUS, 'Shared')
    )

    title = models.TextField()
    description = models.TextField()
    date = models.DateTimeField(null=True)
    invitees = models.TextField()
    channels = models.TextField()
    view = models.TextField()
    user = models.TextField()
    user_tz = models.TextField()
    template_channel = models.TextField()
    status = models.CharField(max_length=2, choices=STATUS_CHOICES, default=DRAFT_STATUS)
