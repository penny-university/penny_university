from django.urls import path
from .views import PennyChatViewSet, ListCreateFollowUps, UpdateDeleteFollowUp

penny_chat_list = PennyChatViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

penny_chat_detail = PennyChatViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

follow_up_list = ListCreateFollowUps.as_view()
follow_up_detail = UpdateDeleteFollowUp.as_view()

urlpatterns = [
    path('', penny_chat_list, name='pennychat-list'),
    path('<int:pk>/', penny_chat_detail, name='pennychat-detail'),
    path('<int:pk>/follow-ups/', follow_up_list, name='followup-list'),
    path('follow-ups/<int:pk>', follow_up_detail, name='followup-detail')
]
