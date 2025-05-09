from rest_framework import serializers
from django.contrib.auth.models import User
from permissions.models import UserRoles

#Serializer for user registration
class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    role_group = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password', 'first_name', 'last_name', 'role_group')
    
    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        role_group = validated_data.pop('role_group')
        user = User.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        UserRoles.objects.create(
            user=user,
            role_group=role_group
        )
        return user