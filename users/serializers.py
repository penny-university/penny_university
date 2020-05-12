from django.contrib.auth import get_user_model

from rest_framework import serializers

from .models import SocialProfile


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['email'],
            # All of our usernames are emails, but we still need the email field for other uses.
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        return user


class SocialProfileSerializer(serializers.HyperlinkedModelSerializer):
    chats = serializers.HyperlinkedIdentityField(view_name='user-chat-list')
    user = UserSerializer(read_only=True)

    class Meta:
        model = SocialProfile
        fields = ['id', 'url', 'real_name', 'user', 'chats']
