from django.urls import path

from . import views

urlpatterns = [
    path('<int:pennychat_id>/', views.detail, name='detail'),
    path('', views.index, name='index')
]
