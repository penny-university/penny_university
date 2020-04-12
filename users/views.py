from django.contrib.auth.models import User

from rest_framework import mixins, generics
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.authtoken.models import Token

from pennychat.serializers import UserChatSerializer
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer
from pennychat.models import Participant


class RegisterUser(generics.CreateAPIView):
    queryset = User.objects.all()

    def post(self, request, format=None, **kwargs):
        user_data = request.data
        serializer = UserSerializer(data=user_data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            user_profiles = UserProfile.objects.filter(email=user.email)
            for profile in user_profiles:
                profile.user = user
                profile.save()
            token = Token.objects.create(user=user)
            return Response(data={'key': token.key, 'user': serializer.data})
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UserProfileDetail(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class ListUserChats(generics.GenericAPIView):
    """
    API endpoint listing chats associated with users
    """
    queryset = Participant.objects.all().order_by('-date')
    serializer_class = UserChatSerializer

    def get(self, request, pk, format=None):
        user_chats = Participant.objects.filter(user_profile_id=pk)
        queryset = self.filter_queryset(user_chats)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
