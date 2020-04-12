from django.urls import include, path
from pennychat.views import UpdateDeleteFollowUp
from users.views import RegisterUser

# Wire up our API using automatic URL routing.

follow_up_detail = UpdateDeleteFollowUp.as_view()

urlpatterns = [
    path('auth/register/', RegisterUser.as_view(), name='register-user'),
    path('auth/', include('dj_rest_auth.urls')),
    path('chats/', include('pennychat.urls')),
    path('follow-ups/<int:pk>/', follow_up_detail, name='followup-detail'),
    path('users/', include('users.urls'))
]
