from rest_framework import serializers
from api.models.activity import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['title', 'description', 'in_charge_of', 'latitude', 'longitude', 'inspection']