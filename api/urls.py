from django.urls import include, path
from django.conf.urls import url
from pennychat.views import UpdateDeleteFollowUp
from users.views import (
    RegisterUser,
    UserExists,
    VerifyEmail,
    SendVerificationEmail,
    LoginView,
)

# Wire up our API using automatic URL routing.

follow_up_detail = UpdateDeleteFollowUp.as_view()

urlpatterns = [
    path('auth/register/', RegisterUser.as_view(), name='register-user'),
    path('auth/verify/', VerifyEmail.as_view(), name='verify-email'),
    path('auth/verification-email/', SendVerificationEmail.as_view(), name='verification-email'),
    path('auth/exists/', UserExists.as_view(), name='user-exists'),
    path('auth/login/', LoginView.as_view(), name='rest-login'),
    path('auth/', include('dj_rest_auth.urls')),
    path('chats/', include('pennychat.urls')),
    path('follow-ups/<int:pk>/', follow_up_detail, name='followup-detail'),
    path('users/', include('users.urls'))
]
