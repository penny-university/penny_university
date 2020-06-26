import logging
from django.db.models import Q
from rest_framework import viewsets, mixins, generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from .models import PennyChat, FollowUp, Participant
from .serializers import PennyChatSerializer, FollowUpSerializer, FollowUpWriteSerializer
from common.permissions import IsOwner, method_is_authenticated, perform_is_authenticated
from django_filters.rest_framework import DjangoFilterBackend

logger = logging.getLogger(__name__)


class PennyChatViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows penny chats to be viewed or edited.
    """
    queryset = PennyChat.objects.all().order_by('-date')
    serializer_class = PennyChatSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['participants__user_id']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @perform_is_authenticated
    def perform_create(self, serializer):
        chat = serializer.save()
        participant = Participant.objects.create(user=self.request.user, penny_chat=chat, role=Participant.ORGANIZER)
        participant.save()

    @perform_is_authenticated
    def perform_update(self, serializer):
        if self.get_object().get_organizer() != self.request.user:
            raise PermissionDenied
        super().perform_update(serializer)

    @perform_is_authenticated
    def perform_destroy(self, instance):
        if self.get_object().get_organizer() != self.request.user:
            raise PermissionDenied
        super().perform_destroy(instance)


class ListCreateFollowUps(generics.GenericAPIView):
    """
    API endpoint that allows follow ups to be viewed or edited based on the foreign key of their associated chat.
    """
    serializer_class = FollowUpSerializer

    def get_queryset(self):
        """
        Queryset all followups by verified users for the chat id in the url
        """
        pk = self.kwargs['pk']
        return FollowUp.objects.filter(
            Q(penny_chat_id=pk),
            Q(user__is_verified=True) | Q(historical=True)).order_by('date')

    def get(self, request, pk, format=None):
        follow_ups = self.get_queryset()
        queryset = self.filter_queryset(follow_ups)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @method_is_authenticated
    def post(self, request, pk, format=None):
        follow_up_data = dict(request.data)
        follow_up_data['penny_chat'] = pk
        serializer = FollowUpWriteSerializer(data=follow_up_data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UpdateDeleteFollowUp(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    """
    API endpoint that allows follow ups to be updated or deleted.
    """
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
