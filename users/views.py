from rest_framework import (
    mixins,
    generics,
    views,
)
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_403_FORBIDDEN,
    HTTP_404_NOT_FOUND,
)

from pennychat.serializers import UserChatSerializer
from pennychat.models import Participant
from .models import User
from .tokens import verification_token_generator
from .serializers import (
    UserSerializer,
    VerifyEmailSerializer,
    GenericEmailSerializer,
)


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, format=None, **kwargs):
        user_data = request.data
        serializer = UserSerializer(data=user_data, context={'request': request})

        if serializer.is_valid():
            try:
                user = self.get_queryset().get(email=serializer.validated_data['email'])
                if user.is_verified:
                    return Response({'detail': 'User already exists.'}, status=HTTP_400_BAD_REQUEST)
                user.set_password(serializer.validated_data['password'])
                user.first_name = serializer.validated_data['first_name']
                user.last_name = serializer.validated_data['last_name']
            except User.DoesNotExist:
                user = serializer.save()
            token = verification_token_generator.make_token(user)
            user.send_verification_email(token=token)
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
            except User.DoesNotExist:
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
                return Response(status=HTTP_204_NO_CONTENT)
            except User.DoesNotExist:
                return Response({'detail': 'User with provided email does not exist.'}, status=HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserExists(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = GenericEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            try:
                user = User.objects.get(email=serializer.validated_data['email'])
                if not user.is_verified:
                    return Response({'detail': 'User email has not been verified.'}, status=HTTP_403_FORBIDDEN)
                return Response(status=HTTP_204_NO_CONTENT)
            except User.DoesNotExist:
                return Response({'detail': 'User with provided email does not exist.'}, status=HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserDetail(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


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
