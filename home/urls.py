from django.urls import path, re_path

from . import views

urlpatterns = [
    path('thank-you/', views.thank_you, name='thank-you'),
    path('privacy/', views.privacy, name='privacy'),
    path('', views.index, name='index'),
    re_path(r'^.*/$', views.frontend, name='frontend'),
]
