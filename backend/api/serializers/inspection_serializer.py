from rest_framework import serializers

from api.models.inspection import Inspection


# In serializers/inspection_serializer.py
class InspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = '__all__'
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Handle potentially invalid float fields
        try:
            if data.get('completed_lat') and not isinstance(data['completed_lat'], float):
                data['completed_lat'] = None
        except (ValueError, TypeError):
            data['completed_lat'] = None
            
        try:
            if data.get('completed_log') and not isinstance(data['completed_log'], float):
                data['completed_log'] = None
        except (ValueError, TypeError):
            data['completed_log'] = None
            
        return data