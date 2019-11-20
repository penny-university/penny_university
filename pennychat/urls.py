from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    # path('<int:pennychat_id>/', views.detail, name='detail'),
    # path('', views.index, name='index')
    path('<int:pk>', views.PennyChatDetail.as_view()),
    path('', views.PennyChatList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)