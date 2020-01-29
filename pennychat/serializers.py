from rest_framework import serializers

from .models import (
    PennyChat,
    FollowUp,
    Participant,
)
from users.serializers import UserProfileSerializer


class ParticipantSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = ['user', 'role']


class PennyChatSerializer(serializers.HyperlinkedModelSerializer):
    follow_ups = serializers.HyperlinkedIdentityField(view_name='followup-list')
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = PennyChat
        fields = ['id', 'url', 'title', 'description', 'date', 'follow_ups', 'participants']


class UserChatSerializer(serializers.ModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(
        queryset=PennyChat.objects.all(),
        view_name='pennychat-detail'
    )

    class Meta:
        model = Participant
        fields = ['penny_chat', 'role']


class FollowUpSerializer(serializers.HyperlinkedModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(
        queryset=PennyChat.objects.all(),
        view_name='pennychat-detail'
    )
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = FollowUp
        fields = ['id', 'url', 'penny_chat', 'content', 'date', 'user']
