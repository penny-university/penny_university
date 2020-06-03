from django.contrib.auth import authenticate
from rest_framework import exceptions, serializers, status

from .models import User, SocialProfile


class SocialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialProfile
        fields = ['id', 'real_name', 'slack_team_id']


class RegisterUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name']

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


class AuthUserSerializer(serializers.HyperlinkedModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['id', 'url', 'first_name', 'last_name', 'email']


class UserDetailSerializer(serializers.HyperlinkedModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = User
        fields = ['id', 'url', 'first_name', 'last_name']


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(self.context['request'], username=email, password=password)
        if user:
            if not user.is_verified:
                raise exceptions.ValidationError('User email has not been verified.', code=status.HTTP_403_FORBIDDEN)
        else:
            raise exceptions.ValidationError(
                'Unable to log in with provided credentials.',
                code=status.HTTP_401_UNAUTHORIZED,
            )

        attrs['user'] = user
        return attrs


class VerifyEmailSerializer(serializers.Serializer):
    token = serializers.CharField(required=True, min_length=24, max_length=24)
    email = serializers.EmailField(required=True)


class GenericEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
