from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Permission to allow admin users access
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.groups.filter(name='Admin').exists()
        except:
            return False

class IsAnalystUser(permissions.BasePermission):
    """
    Permission to allow analyst users access
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.role_group == 'Analyst'
        except:
            return False

class IsInspectorUser(permissions.BasePermission):
    """
    Permission to allow inspector users access
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        try:
            return request.user.groups.filter(name='Inspector').exists()
        except:
            return False
    
class IsViewerUser(permissions.BasePermission):
    """
    Permission to allow viewer users access
    """
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Viewer').exists()


