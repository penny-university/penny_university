from django.urls import path

from . import views

urlpatterns = [
    path('thank-you/', views.thank_you, name='thank-you'),
    path('', views.index, name='index')
]
