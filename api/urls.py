from django.urls import include, path
from pennychat.views import UpdateDeleteFollowUp

# Wire up our API using automatic URL routing.

follow_up_detail = UpdateDeleteFollowUp.as_view()

urlpatterns = [
    path('chats/', include('pennychat.urls')),
    path('follow-ups/<int:pk>/', follow_up_detail, name='followup-detail'),
    path('users/', include('users.urls'))
]
