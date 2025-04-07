from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

class CustomAuthSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        #Custom field for user class
        token['is_admin'] = user.is_superuser
        token['email'] = user.email
        
        return token