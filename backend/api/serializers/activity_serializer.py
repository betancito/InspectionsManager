from rest_framework import serializers
from api.models.activity import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['title', 'in_charge_of', 'description', 'latitude', 'longitude', 'inspection', 'created_by', 'updated_by', 'status']