from django.urls import path
from . import views

urlpatterns = [
    path('google/auth-callback/', views.auth_callback, name='google-auth-callback')
]
