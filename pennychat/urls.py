from django.urls import path

from . import views

urlpatterns = [
    path('',
         views.PennyChatList.as_view(),
         name='chats-list'),
    path('<int:pk>/',
         views.PennyChatDetail.as_view(),
         name='chats-detail'),
    path('follow-ups/',
         views.FollowUpList.as_view(),
         name='follow-ups-list'),
    path('follow-ups/<int:pk>/',
         views.FollowUpDetail.as_view(),
         name='follow-ups-detail')
]
