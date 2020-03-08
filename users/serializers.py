from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import UserProfile


class UserSerializer(serializers.ModelSerializer):
    username = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = get_user_model()
        fields = ['username', 'password']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            # All of our usernames are emails, but we still need the email field for other uses.
            email=validated_data['username'],
            password=validated_data['password'],
        )

        return user


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    chats = serializers.HyperlinkedIdentityField(view_name='user-chat-list')
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'url', 'real_name', 'user', 'chats']
