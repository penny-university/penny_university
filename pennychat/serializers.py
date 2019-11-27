from rest_framework import serializers
from .models import PennyChat, FollowUp


class FollowUpSerializer(serializers.HyperlinkedModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(view_name='chats-detail', read_only=True)

    class Meta:
        model = FollowUp
        fields = ['id', 'penny_chat', 'content', 'user', 'date']


class PennyChatSerializer(serializers.HyperlinkedModelSerializer):
    follow_ups = serializers.HyperlinkedRelatedField(many=True, view_name='follow-ups-detail', read_only=True)

    class Meta:
        model = PennyChat
        fields = ['id', 'title', 'description', 'date', 'user', 'follow_ups']
