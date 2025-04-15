import random
import string
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models.inspection import Inspection
from api.models.activity import Activity
from permissions.models import UserRoles

fake = Faker()

class Command(BaseCommand):
    #Help message for knowledge on what the command can do
    help = "Seeds the database with test users and inspections"
    
    def handle(self, *args, **options):
        #Message to advice database is being seeded
        self.stdout.write(self.style.SUCCESS("Starting database seeding..."))
        
        #Create admin
        if not User.objects.filter(username="admin").exists():
            #Admin User creation
            user = User.objects.create_superuser("admin", "admin@example.com", "supersecret123")
            UserRoles.objects.create(user=user, role_group="admin")
            #Message to advice admin user was created
            self.stdout.write(self.style.WARNING("Created test Admin User. (TO KNOW THE CREDENTIALS READ THE DOCUMENTATION)"))
            
        #Create analyst
        if not User.objects.filter(username="analyst").exists():
            #Inspector user creation
            user = User.objects.create_user("analyst", "analyst@example.com", "supersecret123")
            UserRoles.objects.create(user=user, role_group="analyst")
            #Message to advice inspector user was created
            self.stdout.write(self.style.WARNING("Created test Inspector User. (TO KNOW THE CREDENTIALS READ THE DOCUMENTATION)"))
            
        #Create Inspector
        if not User.objects.filter(username="inspector").exists():
            #Inspector user creation
            user = User.objects.create_user("inspector", "inspector@example.com", "supersecret123")
            UserRoles.objects.create(user=user, role_group="inspector")
            #Message to advice inspector user was created
            self.stdout.write(self.style.WARNING("Created test Inspector User. (TO KNOW THE CREDENTIALS READ THE DOCUMENTATION)"))
        
        #Create viewer
        if not User.objects.filter(username="viewer").exists():
            #Viewer user creation
            user = User.objects.create_user("viewer", 'viewer@example.com', 'supersecret123')
            UserRoles.objects.create(user=user, role_group="viewer")
            #Message to advice viewer user was created
            self.stdout.write(self.style.WARNING("Created test Viewer User. (TO KNOW THE CREDENTIALS READ THE DOCUMENTATION)"))
            
            
        #for inspections
        for i in range (5):
            #Variables for faking creation
            name= fake.name(),
            title = str(name).replace("(", "")
            title = str(title).replace(")", "")
            title = str(title).replace("'", "")
            title = str(title).replace(",", "")
            description = fake.paragraph(nb_sentences=3)
            due_date = fake.date_between(start_date="today", end_date="+30d")
            latitude = round(random.uniform(-2, 12), 6)
            longitude = round(random.uniform(-76, -68), 6)
            created_by = User.objects.get(username="admin")
            updated_by = User.objects.get(username="admin")
            completed = False
            
            #Creation of inspection using faked variables 
            inspection = Inspection.objects.create(
                title = title,
                description = description,
                due_date = due_date,
                latitude = latitude,
                longitude = longitude,
                completed = completed,
                created_by = created_by,
                updated_by = updated_by,
            )
            
            #Message to advice creation
            self.stdout.write(self.style.WARNING(f"Created inspection: {title}"))
        
        #for activities
        for i in range (10):
            #Variables for faking creation
            fakeName= fake.name(),
            in_charge_of = str(fakeName).replace("(", "")
            in_charge_of = str(in_charge_of).replace(")", "")
            in_charge_of = str(in_charge_of).replace("'", "")
            in_charge_of = str(in_charge_of).replace(",", "")
            title = fake.paragraph(nb_sentences=1)
            description = fake.paragraph(nb_sentences=3)
            latitude = round(random.uniform(-2, 12), 6)
            longitude = round(random.uniform(-76, -68), 6)
            created_by = User.objects.get(username="admin")
            updated_by = User.objects.get(username="admin")
            inspection_id = Inspection.objects.get(id=random.randint(1, 5))
            
            #Creation of activity using faked variables 
            activity = Activity.objects.create(
                inspection= inspection_id,
                title = title,
                in_charge_of = in_charge_of,
                description = description,
                latitude = latitude,
                longitude = longitude,
                created_by = created_by,
                updated_by = updated_by,
            )
            
            #Message to advice creation
            self.stdout.write(self.style.WARNING(f"Created activity: {title}"))
        
        #Message to advice process completion
        self.stdout.write(self.style.SUCCESS("Database seeding complete!"))
