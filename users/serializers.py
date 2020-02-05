from rest_framework import serializers

from .models import UserProfile


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    chats = serializers.HyperlinkedIdentityField(view_name='user-chat-list')

    class Meta:
        model = UserProfile
        fields = ['id', 'url', 'real_name', 'chats']
