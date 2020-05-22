from rest_framework import exceptions, serializers
from dj_rest_auth.serializers import LoginSerializer

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


class CustomLoginSerializer(LoginSerializer):
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = self._validate_username_email(email, '', password)
        if user:
            if not user.is_verified:
                raise exceptions.ValidationError('User email has not been verified.')
        else:
            raise exceptions.ValidationError('Unable to log in with provided credentials.')

        attrs['user'] = user
        return attrs


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(min_length=24, max_length=24)
    email = serializers.EmailField()
