from rest_framework import viewsets, views, mixins, generics
from rest_framework.reverse import reverse
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_204_NO_CONTENT, HTTP_400_BAD_REQUEST

from .models import PennyChat, FollowUp
from .serializers import PennyChatSerializer, FollowUpSerializer


class PennyChatViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = PennyChat.objects.all().order_by('-date')
    serializer_class = PennyChatSerializer


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
        follow_up_data['user'] = 'Anonymous'
        serializer = FollowUpSerializer(data=follow_up_data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


class UpdateDeleteFollowUp(mixins.UpdateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = FollowUp.objects.all()
    serializer_class = FollowUpSerializer

    def put(self, request, *args, **kwargs):
        follow_up = self.get_object()
        follow_up.content = request.data['content']
        if request.data['content']:
            follow_up.save()
            return Response(status=HTTP_204_NO_CONTENT)
        return Response({'content': 'This field is required.'}, status=HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        self.destroy(self, request, *args, **kwargs)
