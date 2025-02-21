from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers.auth_serializers import CustomAuthSerializer

#View to render api index showing endpoints and basic usage
def index(request):
    return render(request, 'index.html')

#Custom JWT gen to provide user type
class CustomAuthView(TokenObtainPairView):
    serializer_class = CustomAuthSerializer