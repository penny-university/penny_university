from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password as django_password_validation
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import PasswordResetForm
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import exceptions, serializers, status
from common.utils import build_url
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

    def validate_password(self, value):
        django_password_validation(value)
        return value

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


class CustomPasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password_reset_form_class = PasswordResetForm

    def validate_email(self, value):
        self.reset_form = self.password_reset_form_class(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError('Error')

        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Invalid e-mail address')
        return value

    def save(self):
        request = self.context.get('request')

        user = User.objects.get(email=self.reset_form.cleaned_data['email'])

        reset_password_url = build_url(
            settings.FRONT_END_HOST,
            'reset-password',
            token=default_token_generator.make_token(user),
            uid=urlsafe_base64_encode(force_bytes(user.pk))
        )

        opts = {
            'use_https': request.is_secure(),
            'from_email': '"Penny University" <reset@pennyuniversity.org>',
            'subject_template_name': 'users/reset_password_subject.txt',
            'email_template_name': 'users/reset_password_email.txt',
            'html_email_template_name': 'users/reset_password_email.html',
            'request': request,
            'extra_email_context': {
                'reset_password_url': reset_password_url
            }
        }
        self.reset_form.save(**opts)
