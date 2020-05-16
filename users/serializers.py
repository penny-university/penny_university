from rest_framework import serializers

from .models import User, SocialProfile


class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ['id', 'real_name', 'slack_team_id']


class UserSerializer(serializers.HyperlinkedModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    chats = serializers.HyperlinkedIdentityField(view_name='user-chat-list')

    class Meta:
        model = User
        fields = ['id', 'url', 'email', 'password', 'first_name', 'last_name', 'chats']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            # All of our usernames are emails, but we still need the email field for other uses.
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )

        return user
