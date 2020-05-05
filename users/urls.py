from django.urls import path
from .views import (
    UserProfileDetail,
    UserProfileList,
    ListUserChats,
)

user_profile_detail = UserProfileDetail.as_view()
user_profile_list = UserProfileList.as_view()
user_chats_list = ListUserChats.as_view()

urlpatterns = [
    path('<int:pk>/chats/', user_chats_list, name='user-chat-list'),
    path('profile/<int:pk>/', user_profile_detail, name='userprofile-detail'),
    path('profile/', user_profile_list, name='userprofile-list'),
]
