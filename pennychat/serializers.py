from rest_framework import serializers

from .models import PennyChat, FollowUp
from users.models import UserProfile
from users.serializers import UserProfileSerializer


class PennyChatSerializer(serializers.HyperlinkedModelSerializer):
    follow_ups = serializers.HyperlinkedIdentityField(view_name='followup-list')
    user = UserProfileSerializer(read_only=True)

    def perform_create(self, serializer):
        # this will eventually be replaced by user = self.request.user
        user = UserProfile.objects.get(id=56)
        serializer.save(user=user)

    class Meta:
        model = PennyChat
        fields = ['id', 'url', 'title', 'description', 'date', 'user', 'follow_ups']


class FollowUpSerializer(serializers.HyperlinkedModelSerializer):
    penny_chat = serializers.HyperlinkedRelatedField(
        queryset=PennyChat.objects.all(),
        view_name='pennychat-detail'
    )
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = FollowUp
        fields = ['id', 'penny_chat', 'content', 'date', 'user']
