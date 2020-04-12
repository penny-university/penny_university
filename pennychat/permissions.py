from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Allows access only to the user who owns the entity.
    """

    def has_permission(self, request, view):
        return bool(view.get_object().user_profile.user == request.user)
