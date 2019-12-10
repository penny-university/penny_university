from rest_framework import serializers
from .models import PennyChat, FollowUp


class PennyChatSerializer(serializers.HyperlinkedModelSerializer):
    follow_ups = serializers.HyperlinkedIdentityField(view_name='followup-list')

    class Meta:
        model = PennyChat
        fields = ['id', 'url', 'title', 'description', 'date', 'user', 'follow_ups']


class FollowUpSerializer(serializers.HyperlinkedModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(
        queryset=PennyChat.objects.all(),
        view_name='pennychat-detail'
    )

    class Meta:
        model = FollowUp
        fields = ['id', 'penny_chat', 'content', 'date', 'user']
