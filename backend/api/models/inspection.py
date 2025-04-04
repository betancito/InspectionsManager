from django.db import models

#Method to update files to media
def upload_to(instance, filename):
    return f"inspection_photo/{filename}"


#InspectionModel
class Inspection(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.CharField(max_length=512, blank=False, null=False)
    due_date = models.DateField(blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    latitude = models.FloatField(null=False, blank=False)
    longitude = models.FloatField(null=False, blank=False)
    completed = models.BooleanField(null = False, blank=False)
    completed_description = models.CharField(max_length=512, null=True, blank=True)
    completed_lat = models.FloatField(null=True, blank=True)
    completed_log = models.FloatField(null=True, blank=True)
    completed_file = models.ImageField(upload_to=upload_to, null=True, blank=True)




    def __str__(self):
        return self.title