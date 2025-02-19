from rest_framework import viewsets
from api.models.inspection import Inspection
from api.serializers.inspection_serializer import InspectionSerializer
from rest_framework.permissions import IsAuthenticated

class InspectionViewSet(viewsets.ModelViewSet):
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer
    permission_classes = [IsAuthenticated]