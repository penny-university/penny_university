from django.urls import path
from .views import (
    SocialProfileDetail,
    ListUserChats,
)

social_profile_detail = SocialProfileDetail.as_view()
user_chats_list = ListUserChats.as_view()

urlpatterns = [
    path('<int:pk>/chats/', user_chats_list, name='user-chat-list'),
    path('<int:pk>/', social_profile_detail, name='socialprofile-detail'),
]
