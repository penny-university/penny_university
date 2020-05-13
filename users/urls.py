from django.urls import path
from .views import (
    UserDetail,
    ListUserChats,
)

user_detail = UserDetail.as_view()
user_chats_list = ListUserChats.as_view()

urlpatterns = [
    path('<int:pk>/chats/', user_chats_list, name='user-chat-list'),
    path('<int:pk>/', user_detail, name='user-detail'),
]
