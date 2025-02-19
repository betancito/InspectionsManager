import random
from faker import Faker
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models.inspection import Inspection

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
            User.objects.create_superuser("admin", "admin@example.com", "supersecret123")
            #Message to advice admin user was created
            self.stdout.write(self.style.WARNING("Created test Admin User. (TO KNOW THE CREDENTIALS READ THE DOCUMENTATION)"))
            
        #Create Inspector
        if not User.objects.filter(username="inspector").exists():
            #Inspector user creation
            User.objects.create_user("inspector", "inspector@example.com", "supersecret123")
            #Message to advice inspector user was created
            self.stdout.write(self.style.WARNING("Created test Inspector User. (TO KNOW THE CREDENTIALS READ THE DOCUMENTATION)"))
            
        #for inspections
        for i in range (5):
            #Variables for creation faking
            title= fake.sentence(nb_words=2),
            description = fake.paragraph(nb_sentences=3)
            due_date = fake.date_between(start_date="today", end_date="+30d")
            latitude = round(random.uniform(-90, 90), 6)
            longitude = round(random.uniform(-180, 180), 6)
            
            #Creation of inspection using faked variables 
            inspection = Inspection.objects.create(
                title = title,
                description = description,
                due_date = due_date,
                latitude = latitude,
                longitude = longitude
            )
            
            #Message to advice creation
            self.stdout.write(self.style.WARNING(f"Created inspection: {title}"))
        
        #Message to advice process completion
        self.stdout.write(self.style.SUCCESS("Database seeding complete!"))
