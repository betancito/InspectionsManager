from django.db import models
from django.contrib.auth.models import Group, Permission, User
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import gettext_lazy as _

class RoleGroup(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.group.name} Role"
    
class UserRoles(models.Model):
    ROLE_CHOICES = [
        ('Admin', _('Admin')),
        ('Analyst', _('Analyst')),
        ('Inspector', _('Inspector')),
        ('Viewer', _('Viewer')),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role_group = models.CharField(max_length=255, blank=True, default='viewer', choices=ROLE_CHOICES)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"