from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission    
from django.contrib.contenttypes.models import ContentType
from api.models import Inspection, Activity

class Command(BaseCommand):
    help = 'Create default groups and assign permissions'

    def handle(self, *args, **kwargs):
        
        #Group creation
        admin_group, created = Group.objects.get_or_create(name='Admin')
        analyst_group, created = Group.objects.get_or_create(name='Analyst')
        inspector_group, created = Group.objects.get_or_create(name='Inspector')
        viewer_group, created = Group.objects.get_or_create(name='Viewer')
        
        #Get content types
        inspection_type = ContentType.objects.get_for_model(Inspection)
        activity_type = ContentType.objects.get_for_model(Activity)
        
        #define permissions for groups
        admin_permissions = Permission.objects.filter(
            content_type__in=[inspection_type, activity_type]
        )
        #set admin permissions
        admin_group.permissions.set(admin_permissions)
        
        ##Set custom permissions for analyst group and inspector Group
        #Inspections
        view_inspection = Permission.objects.get(
            codename='view_inspection',
            content_type=inspection_type
        )
        add_inspection = Permission.objects.get(
            codename='add_inspection',
            content_type=inspection_type
        )
        change_inspection = Permission.objects.get(
            codename='change_inspection',
            content_type=inspection_type
        )
        delete_inspection = Permission.objects.get(
            codename='delete_inspection',
            content_type=inspection_type
        )
        
        #activities
        view_activity = Permission.objects.get(
            codename='view_activity',
            content_type=activity_type
        )
        add_activity = Permission.objects.get(
            codename='add_activity',
            content_type=activity_type
        )
        change_activity = Permission.objects.get(
            codename='change_activity',
            content_type=activity_type
        )
        delete_activity = Permission.objects.get(
            codename='delete_activity',
            content_type=activity_type
        )
        
        #Create permissions for analyst group
        analyst_permissions = [
            view_inspection,
            change_inspection,
            view_activity,
            add_activity,
            change_activity,
            delete_activity
        ]
        
        #Create permissions for inspector group
        inspector_permissions = [
            view_inspection,
            change_inspection,
            view_activity,
            change_activity,
        ]
        
        #Create permission stack for viewer group
        viewer_permissions = [
            view_inspection,
            view_activity,
        ]
        
        #Assign permissions to groups
        analyst_group.permissions.set(analyst_permissions)
        inspector_group.permissions.set(inspector_permissions)
        viewer_group.permissions.set(viewer_permissions)
        
        # Print success message
        self.stdout.write(self.style.SUCCESS('Default groups and permissions created successfully. If you wish to customize it more please check the documentation.'))