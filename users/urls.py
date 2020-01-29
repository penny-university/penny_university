from django.urls import path
from .views import (
    UserProfileDetail,
    ListUserChats,
)

user_profile_detail = UserProfileDetail.as_view()
list_user_chats = ListUserChats.as_view()

urlpatterns = [
    path('<int:pk>/chats/', list_user_chats, name='user-chat-list'),
    path('<int:pk>/', user_profile_detail, name='userprofile-detail'),
]
