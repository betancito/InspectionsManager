from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    #Inspections Paths
    path('inspections/', views.InspectionView.as_view(), name='inspections-all'),
    path('inspections/<int:id>/', views.InspectionView.as_view(), name='inspections-one'),
    path('inspections/complete/<int:id>/', views.CompleteInspectionView.as_view(), name='completeInspection'),
    
    #JWTauth endpoints
    path("token/", views.CustomAuthView.as_view(), name='token_obtain_pair'),
    
    #This one is with the purpose of refreshing the token in case is needed by the front for auth reasons
    path("token/refresh/", TokenRefreshView.as_view(), name='token_refresh'),
    
    #Path to API basic endpoint documentation
    path("docs/", views.index)
]
