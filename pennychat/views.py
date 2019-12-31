from rest_framework import viewsets, mixins, generics
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from users.models import UserProfile
from .models import PennyChat, FollowUp
from .serializers import PennyChatSerializer, FollowUpSerializer


class PennyChatViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = PennyChat.objects.all().order_by('-date')
    serializer_class = PennyChatSerializer

    def perform_create(self, serializer):
        # get or create an anonymous user since we don't have auth
        # this will eventually be replaced by user = self.request.user
        user, created = UserProfile.objects.get_or_create(
            real_name='Anonymous Profile',
            defaults={
                'email': 'anonymous@profile.com'
            })
        serializer.save(user=user)


class ListCreateFollowUps(generics.GenericAPIView):
    """
    API endpoint that allows follow ups to be viewed or edited based on the foreign key of their associated chat.
    """
    serializer_class = FollowUpSerializer

    def get(self, request, pk, format=None):
        follow_ups = FollowUp.objects.filter(penny_chat_id=pk)
        queryset = self.filter_queryset(follow_ups)

        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def post(self, request, pk, format=None):
        follow_up_data = request.data
        penny_chat_url = reverse('pennychat-detail', args=[pk], request=request)
        follow_up_data['penny_chat'] = penny_chat_url
        serializer = FollowUpSerializer(data=follow_up_data, context={'request': request})
        if serializer.is_valid():
            user, created = UserProfile.objects.get_or_create(
                real_name='Anonymous Profile',
                defaults={
                    'email': 'anonymous@profile.com'
                })
            serializer.save(user=user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UpdateDeleteFollowUp(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    """
    API endpoint that allows follow ups to be updated or deleted.
    """
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
