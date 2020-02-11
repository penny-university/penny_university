from rest_framework import mixins, generics

from pennychat.serializers import UserChatSerializer
from .models import UserProfile
from .serializers import UserProfileSerializer
from pennychat.models import Participant


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
        user_chats = Participant.objects.filter(user_id=pk)
        queryset = self.filter_queryset(user_chats)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
