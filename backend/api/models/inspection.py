from django.db import models
from django.contrib.auth.models import User


#Method to update files to media
def upload_to(instance, filename):
    return f"inspection_photo/{filename}"

def upload_to_original(instance, filename):
    id = instance.pk
    return f"inspection_photo/{id}/original/{filename}"

def upload_to_edited(instance, filename):
    id = instance.pk 
    return f"inspection_photo/{id}/edited/{filename}"


#InspectionModel
class Inspection(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.CharField(max_length=512, blank=False, null=False)
    due_date = models.DateField(blank=False, null=False)
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inspections_updated', default=None)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inspections_created', default=None)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)
    completed = models.BooleanField(null = False, blank=False, default=False)
    completed_description = models.CharField(max_length=512, null=True, blank=True)
    completed_lat = models.FloatField(null=True, blank=True)
    completed_log = models.FloatField(null=True, blank=True)
    completed_file = models.ImageField(upload_to=upload_to_original, null=True, blank=True)
    completed_editedFile = models.ImageField(upload_to=upload_to_edited, null=True, blank=True)




    def __str__(self):
        return self.title