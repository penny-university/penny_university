from rest_framework import (
    generics,
    views,
)
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)

from sentry_sdk import capture_exception

from common.permissions import (
    method_user_is_self,
    method_is_authenticated,
)
from pennychat.serializers import UserChatSerializer, FollowUpWriteSerializer
from pennychat.models import Participant, FollowUp
from .models import User
from .tokens import verification_token_generator
from .serializers import (
    RegisterUserSerializer,
    UserDetailSerializer,
    VerifyEmailSerializer,
    GenericEmailSerializer,
    AuthUserSerializer,
)


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer

    def post(self, request, format=None, **kwargs):
        user_data = request.data
        serializer = RegisterUserSerializer(data=user_data, context={'request': request})

        if serializer.is_valid():
            try:
                user = self.get_queryset().get(email=serializer.validated_data['email'])
                if user.is_verified:
                    return Response({'detail': 'User already exists.'}, status=HTTP_400_BAD_REQUEST)
                user.set_password(serializer.validated_data['password'])
                user.first_name = serializer.validated_data['first_name']
                user.last_name = serializer.validated_data['last_name']
                user.save()
            except User.DoesNotExist as e:
                capture_exception(e)
                user = serializer.save()
            token = verification_token_generator.make_token(user)
            user.send_verification_email(token=token)
            follow_up = request.data.get('follow_up', None)
            if follow_up:
                follow_up_serializer = FollowUpWriteSerializer(data={
                    'penny_chat': follow_up.get('chat_id', None),
                    'content': follow_up.get('content', None),
                    'user': user.id
                })
                if follow_up_serializer.is_valid():
                    follow_up_serializer.save()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class VerifyEmail(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = VerifyEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if verification_token_generator.check_token(user, serializer.validated_data['token']):
                    user.is_verified = True
                    user.save()
                    return Response(status=HTTP_204_NO_CONTENT)
                return Response({'detail': 'Verification token is invalid.'}, status=HTTP_400_BAD_REQUEST)
            except User.DoesNotExist as e:
                capture_exception(e)
                return Response(status=HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class SendVerificationEmail(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = GenericEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                token = verification_token_generator.make_token(user)
                user.send_verification_email(token=token)
                follow_up = request.data.get('follow_up', None)
                if follow_up:
                    follow_up_serializer = FollowUpWriteSerializer(data={
                        'penny_chat': follow_up.get('chat_id', None),
                        'content': follow_up.get('content', None),
                        'user': user.id
                    })
                    if follow_up_serializer.is_valid():
                        follow_up_serializer.save()
                return Response(status=HTTP_204_NO_CONTENT)
            except User.DoesNotExist as e:
                capture_exception(e)
                return Response({'detail': 'User with provided email does not exist.'}, status=HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserExists(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = GenericEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if not user.has_usable_password():
                    return Response({'detail': 'User has an unusable password.'}, status=HTTP_404_NOT_FOUND)
                if not user.is_verified:
                    return Response({'detail': 'User email has not been verified.'}, status=HTTP_403_FORBIDDEN)
                return Response(status=HTTP_204_NO_CONTENT)
            except User.DoesNotExist as e:
                capture_exception(e)
                return Response({'detail': 'User with provided email does not exist.'}, status=HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserDetail(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return UserDetailSerializer
        if self.request.method == 'PUT' or self.request.method == 'PATCH':
            return AuthUserSerializer
        return UserDetailSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    @method_is_authenticated
    @method_user_is_self
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    @method_is_authenticated
    @method_user_is_self
    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class ListUserChats(generics.GenericAPIView):
    """
    API endpoint listing chats associated with users
    """
    queryset = Participant.objects.all().order_by('-date')
    serializer_class = UserChatSerializer

    def get(self, request, pk, format=None):
        user_chats = Participant.objects.filter(user_id=pk)
        queryset = self.filter_queryset(user_chats)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
