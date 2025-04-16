from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from permissions.models import UserRoles
class CustomAuthSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        #Custom field for user class
        token['is_admin'] = user.is_superuser
        token['email'] = user.email
        try:
            token['role_group'] = UserRoles.objects.get(user=user).role_group
        except:
            token['role_group'] = None
            
        return token