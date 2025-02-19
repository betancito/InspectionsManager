from rest_framework import serializers
from api.models.inspection import Inspection

class InspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = '__all__'