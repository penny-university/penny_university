from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('', views.api_root),
    path('chats/', include('pennychat.urls'))
]

urlpatterns = format_suffix_patterns(urlpatterns)
