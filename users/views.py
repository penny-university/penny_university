from rest_framework import mixins, generics

from .models import UserProfile
from .serializers import UserProfileSerializer


class UserProfileDetail(mixins.RetrieveModelMixin, generics.GenericAPIView):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
