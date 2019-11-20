from rest_framework import serializers
from .models import PennyChat


class PennyChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PennyChat
        fields = ['id', 'title', 'description', 'date', 'invitees', 'channels', 'view', 'user', 'status']
