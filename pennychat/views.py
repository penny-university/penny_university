from rest_framework import generics

from .models import PennyChat, FollowUp
from .serializers import PennyChatSerializer, FollowUpSerializer


class PennyChatList(generics.ListCreateAPIView):
    queryset = PennyChat.objects.all()
    serializer_class = PennyChatSerializer


class PennyChatDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PennyChat.objects.all()
    serializer_class = PennyChatSerializer


class FollowUpList(generics.ListCreateAPIView):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer


class FollowUpDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer
