from django.urls import path
from .views import UserProfileDetail


user_profile_detail = UserProfileDetail.as_view()

urlpatterns = [
    path('<int:pk>/', user_profile_detail, name='userprofile-detail')
]
