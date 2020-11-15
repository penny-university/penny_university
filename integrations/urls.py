from django.urls import path
from . import views

urlpatterns = [
    path('google/auth-success/', views.auth_success, name='google-auth-success')
]
