from django.shortcuts import render
from django.utils import timezone
from django.core.paginator import Paginator
from django.http import HttpResponseRedirect
from rest_framework import generics
from .models import PennyChat, FollowUp
from .forms import FollowUpForm
from .serializers import PennyChatSerializer


def index(request):
    chats_list = PennyChat.objects.filter(date__lte=timezone.now())
    paginator = Paginator(chats_list, 10)

    page = request.GET.get('page')
    chats = paginator.get_page(page)
    return render(request, 'pennychat/index.html', context={'chats': chats})


def detail(request, pennychat_pk):
    chat = PennyChat.objects.get(pk=pennychat_pk)

    if request.method == 'POST':
        form = FollowUpForm(request.POST)
        if form.is_valpk():
            content = form.cleaned_data['follow_up']
            FollowUp.objects.create(content=content, penny_chat=chat, user='Anonymous')
            return HttpResponseRedirect(request.path_info)

    else:
        form = FollowUpForm()

    return render(request, 'pennychat/detail.html', context={'chat': chat, 'form': form})


# class PennyChatList(APIView):
#     """
#         List all Penny Chats, or create a new Penny Chat.
#         """
#     def get(self, request, format=None):
#         snippets = PennyChat.objects.all()
#         serializer = PennyChatSerializer(snippets, many=True)
#         return Response(serializer.data)
#
#     def post(self, request, format=None):
#         data = JSONParser().parse(request)
#         serializer = PennyChatSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class PennyChatDetail(APIView):
#     """
#     Retrieve, update or delete a Penny Chat.
#     """
#     def get_object(self, pk):
#         try:
#             return PennyChat.objects.get(pk=pk)
#         except PennyChat.DoesNotExist:
#             return Http404
#
#     def get(self, request, pk, format=None):
#         penny_chat = self.get_object(pk=pk)
#         serializer = PennyChatSerializer(penny_chat)
#         return Response(serializer.data)
#
#     def put(self, request, pk, format=None):
#         penny_chat = self.get_object(pk)
#         data = JSONParser().parse(request)
#         serializer = PennyChatSerializer(penny_chat, data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#     def delete(self, request, pk, format=None):
#         penny_chat = self.get_object(pk)
#         penny_chat.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


class PennyChatList(generics.ListCreateAPIView):
    queryset = PennyChat.objects.all()
    serializer_class = PennyChatSerializer


class PennyChatDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PennyChat.objects.all()
    serializer_class = PennyChatSerializer
