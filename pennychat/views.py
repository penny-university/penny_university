from rest_framework import viewsets, views, mixins, generics
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
        # this will eventually be replaced by user = self.request.user
        user = UserProfile.objects.get(id=56)
        serializer.save(user=user)


class ListCreateFollowUps(views.APIView):
    """
    API endpoint that allows follow ups to be viewed or edited based on the foreign key of their associated chat.
    """
    serializer_class = FollowUpSerializer

    def get(self, request, pk, format=None):
        follow_ups = FollowUp.objects.filter(penny_chat_id=pk)
        serializer = FollowUpSerializer(follow_ups, context={'request': request}, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        follow_up_data = request.data
        penny_chat_url = reverse('pennychat-detail', args=[pk], request=request)
        follow_up_data['penny_chat'] = penny_chat_url
        serializer = FollowUpSerializer(data=follow_up_data, context={'request': request})
        if serializer.is_valid():
            user = UserProfile.objects.get(id=56)
            serializer.save(user=user)
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UpdateDeleteFollowUp(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
