from django.urls import path
from . import views

urlpatterns = [
    path('google/auth-request/', views.auth_request, name='google-auth-request'),
    path('google/auth-success/', views.auth_success, name='google-auth-success'),
]
