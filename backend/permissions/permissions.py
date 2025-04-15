from rest_framework import permissions


class HasRolePermission(permissions.BasePermission):
    """
    Custom permission to check if the user has a specific role
    """
    required_role = None
    
    def has_permission(self, request, view):
    # Printing role check for request required role
        print(f"Checking permission for role: {self.required_role}")
        
        # First check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            print("User not authenticated")
            return False

        # Check if the user has the UserRoles model related to them
        from permissions.models import UserRoles
        try:
            user_role = UserRoles.objects.get(user=request.user)
            role_match = user_role.role_group == self.required_role
            print(f"Role from DB: {user_role.role_group}, Required: {self.required_role}, Match: {role_match}")
            return role_match
        except UserRoles.DoesNotExist:
            print("No UserRoles found for this user")
            pass
        
        print("No role information found")
        return False

class IsAdminUser(HasRolePermission):
    """
    Permission to allow admin users access
    """
    required_role = 'admin'

class IsAnalystUser(HasRolePermission):
    """
    Permission to allow analyst users access
    """
    required_role = 'analyst'

class IsInspectorUser(HasRolePermission):
    """
    Permission to allow inspector users access
    """
    required_role = 'inspector'
    
class IsViewerUser(HasRolePermission):
    """
    Permission to allow viewer users access
    """
    required_role = 'viewer'


