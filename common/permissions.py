from functools import wraps

from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Allows access only to the user who owns the entity.
    This method requires that the view's object has a User attached.
    """

    def has_permission(self, request, view):
        return bool(view.get_object().user == request.user)


def perform_is_authenticated(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """
        Checks whether the user is authenticated. If not, it raises a NotAuthenticated exception.
        This decorator is meant to be used when extending the perform actions in a viewset, such as perform_create().
        """
        request = args[0].request
        if not request.auth:
            raise NotAuthenticated
        return func(*args, **kwargs)

    return wrapper


def method_is_authenticated(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """
        Checks whether the user is authenticated. If not, it raises a NotAuthenticated exception.
        This decorator is meant to be used when writing HTTP methods for APIViews, such as get() and put().
        """
        request = args[1]
        if not request.auth:
            raise NotAuthenticated
        return func(*args, **kwargs)

    return wrapper


def method_user_is_self(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        """
        Checks whether the object being accessed is the authenticated user.
        If not, it raises a PermissionDenied exception.
        This decorator is meant to be used when writing HTTP methods for APIViews, such as get() and put().
        """
        user = args[0].get_object()
        request = args[1]
        if not request.user == user:
            raise PermissionDenied
        return func(*args, **kwargs)

    return wrapper
