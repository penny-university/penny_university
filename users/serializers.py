from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'password']

class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    chats = serializers.HyperlinkedIdentityField(view_name='user-chat-list')
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'url', 'real_name', 'user', 'chats']
