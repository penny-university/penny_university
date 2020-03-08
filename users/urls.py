from django.urls import path
from .views import (
    CreateUser,
    UserProfileDetail,
    ListUserChats,
)

user_profile_detail = UserProfileDetail.as_view()
user_chats_list = ListUserChats.as_view()

urlpatterns = [
    path('<int:pk>/chats/', user_chats_list, name='user-chat-list'),
    path('<int:pk>/', user_profile_detail, name='userprofile-detail'),
    path('', CreateUser.as_view(), name='create-user'),
]
