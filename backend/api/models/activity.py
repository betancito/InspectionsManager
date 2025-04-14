from django.db import models
from django.contrib.auth.models import User

class Activity(models.Model):
    inspection = models.ForeignKey('Inspection', on_delete=models.CASCADE, related_name='activities')
    title = models.CharField(max_length=255, blank=False, null=False)
    in_charge_of = models.CharField(max_length=50, blank=False, null=False)
    description = models.CharField(max_length=255, blank=False, null=False)
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities_created', default=None)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities_updated', default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=50, choices=[('PENDING', 'Pending'), ('IN_PROGRESS', 'In Progress'), ('COMPLETED', 'Completed')], default='PENDING')

def __str__(self):
    return self.title