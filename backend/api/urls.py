from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.controllers.inspection_controller import InspectionViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'inspections', InspectionViewSet, basename='inspection')

urlpatterns = [
    path('', include(router.urls)),
    
    #JWTauth endpoints
    path("token/", views.CustomAuthView.as_view(), name='token_obtain_pair'),
    
    #This one is with the purpose of refreshing the token in case is needed by the front for auth reasons
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    
    #Path to API basic endpoint documentation
    path("docs/", views.index)
]
