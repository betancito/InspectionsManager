import os
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.controllers.inspection_controller import InspectionViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from django.views.decorators.csrf import csrf_exempt
from django.conf.urls.static import static
from django.conf import settings

from . import views



urlpatterns = [
    #Inspections Paths
    path('inspections/', views.InspectionView.as_view(), name='inspections_all'),
    path('inspections/<int:id>/', views.InspectionView.as_view(), name='inspections_one'),
    path('inspections/complete/<int:id>/', csrf_exempt(views.CompleteInspectionView.as_view()), name='complete_inspection'),
    
    #JWTauth endpoints
    path("token/", views.CustomAuthView.as_view(), name='token_obtain_pair'),
    
    #This one is with the purpose of refreshing the token for session prevalence in the frontend
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    
    #This is to blacklist the tokens as soon as expired or blacklist the last one after generated
    path('token/blacklist', TokenBlacklistView.as_view(), name='token_blacklist'),
    
    #Path to API basic endpoint documentation
    path("docs/", views.index),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
