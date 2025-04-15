#Rest Framework tools and Pillow
import io
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.shortcuts import get_object_or_404, render
from PIL import Image

#Utils and auth tools
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from permissions.permissions import IsAdminUser, IsAnalystUser, IsInspectorUser, IsViewerUser

#Models
from .models.inspection import Inspection
from .models.activity import Activity
from permissions.models import UserRoles

#Serializers
from .serializers.auth_serializers import CustomAuthSerializer
from .serializers.inspection_serializer import InspectionSerializer
from .utils.photo_edit import edit_img
from .serializers.activity_serializer import ActivitySerializer
from .serializers.UserRegistrationSerializer import UserRegistrationSerializer
from .serializers.UserRegistrationSerializer import UserRoleSerializer


#View to render api index showing endpoints and basic usage
def index(request):
    return render(request, 'index.html')

#Custom JWT Endpoint gen to provide user type
class CustomAuthView(TokenObtainPairView):
    serializer_class = CustomAuthSerializer

#Registration Methods
class RegistrationView(APIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, *args, **kwargs):
        serializer = self.get_serializer(data=self.request.data)
        if serializer.is_valid():
            user = serializer.save()

            return Response({
                "user": serializer.data,
                "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#User Role Management Methods
class UserRolesView(APIView):
    permission_classes = (IsAuthenticated)
    
    def get(self, request):
        try:
            user_roles = UserRoles.objects.all()
            serializer = UserRoleSerializer(user_roles, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def put(self, request, id = None):
        try:
            if not id:
                return Response({'Error': 'ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = get_object_or_404(User, id=id)
            user_role, created = UserRoles.objects.get_or_create(user=user)
            
            role = request.data.get('role_group')
            if role not in ['admin', 'analyst', 'inspector', 'viewer']:
                return Response({'Error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_role.role_group = role
            user_role.save()
            
            return Response({'Success': f'User role updated to {role}'}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#Inspections Methods
class InspectionView(APIView):
    # Define class attributes for different permission combinations
    all_users = [IsAuthenticated()]
    admin_only = [IsAuthenticated(), IsAdminUser()]
    admin_analyst= [IsAuthenticated(), IsAdminUser() or IsAnalystUser()]
    admin_inspector = [IsAuthenticated(), IsAdminUser() or IsInspectorUser()]
    
    # Set Default permissions for method type based off role
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions based on the HTTP method.
        """
        if self.request.method == 'GET':
            # Any authenticated user can see inspections
            return self.all_users
        elif self.request.method in ['POST', 'PUT', 'DELETE']:
            # Only admin can create, update, or delete
            return self.admin_only
        return [] 
    
    
    #getAllOrGetOne
    def get(self, request, id=None):
        try:
            if id:
                inspection = get_object_or_404(Inspection, id=id)
                serializer = InspectionSerializer(inspection)
            else:
                inspections = Inspection.objects.all()
                serializer = InspectionSerializer(inspections, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error: {e}")
            return Response({'Error': str(e)})
    
    #Update one
    def put(self, request, id):
        try:
            inspection = get_object_or_404(Inspection, id=id)
            serializer = InspectionSerializer(inspection, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print(request.data)
        except Exception as e:
            print(f"Error: {e}")
            return Response({'Error': str(e)})

    #Delete
    def delete(self, request, id):
        try:
            inspection = get_object_or_404(Inspection, id=id)
            if not inspection:
                return Response(f'Error, inspection with id:{id} not found')
            else:
                inspection.delete()
                return Response(f'Inspection with id:{id} deleted successfully')
        except Exception as e:
            print(f"Error: {e}")
            return Response({'Error': str(e)})

    #Post
    def post(self, request):
        try:
            serializer = InspectionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
        except Exception as e:
            print(f"Error: {e}")
            return Response ({"Error": str(e)})

#Complete inspection methods
class CompleteInspectionView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser | IsInspectorUser]
    def put(self, request, id):
        ##Only admin and inspector can complete an inspection
        try:
            inspection = Inspection.objects.get(pk=id)
            # Get values from data
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            description = request.data.get('description')
            photo = request.FILES.get('photo')
            
            if not all([latitude, longitude, description, photo]):
                return Response({'Error': 'Missing required fields'}, status=400)
            
            # Set inspection fields to update
            inspection.completed_lat = float(latitude)
            inspection.completed_log = float(longitude)
            inspection.completed_description = description
            inspection.completed_file = photo
            inspection.completed = True
            
            # Block for Image edition (Map and description addition)
            try:
                img = Image.open(photo)
                lat = float(latitude)
                lon = float(longitude)
                
                # Get absolute path to your project directory
                
                # Try to use a default font - no specific path required
                try:
                    edited_img = edit_img(
                        img=img, 
                        description=description, 
                        latitude=lat, 
                        longitude=lon,
                        font=None  # Let the function handle font fallback
                    )
                    
                    # Prepare BytesIO buffer to save the edited image
                    img_io = io.BytesIO()
                    
                    # Determine the format from the original image if possible, otherwise default to JPEG
                    img_format = getattr(img, 'format', 'JPEG') or 'JPEG'
                    
                    # Save edited image to buffer
                    edited_img.save(img_io, format=img_format)
                    img_io.seek(0)
                    
                    # Create temporary memory image to save
                    edited_img_file = InMemoryUploadedFile(
                        img_io,
                        field_name="edited_file",
                        name=f"edited_{photo.name}",
                        content_type=f"image/{img_format.lower()}",
                        size=img_io.getbuffer().nbytes,
                        charset=None
                    )
                    
                    # Save the edited image to the model
                    inspection.completed_editedFile = edited_img_file
                except Exception as e:
                    # Log the error but continue with saving the inspection
                    print(f"Error editing image: {e}")
                    import traceback
                    traceback.print_exc()
            except Exception as e:
                print(f"Error processing image: {e}")
                import traceback
                traceback.print_exc()
                
            # Save the inspection record
            inspection.save()
            
            # Return Updated
            serializer = InspectionSerializer(inspection)
            return Response(serializer.data)
        
        except Inspection.DoesNotExist:
            return Response({'Error': f"Inspection with id {id} not found in records"}, status=404)
        
        except ValueError as e:
            return Response({"Error": str(e)}, status=400)
        
        except Exception as e:
            import traceback
            print(traceback.format_exc())
            return Response({'Error': str(e)}, status=500)
        
#Activities methods
class ActivityView(APIView):
    all_users = [IsAuthenticated()]
    admin_only = [IsAuthenticated(), IsAdminUser()]
    admin_analyst= [IsAuthenticated(), IsAdminUser() or IsAnalystUser()]
    admin_inspector = [IsAuthenticated(), IsAdminUser() or IsInspectorUser()]
    admin_analyst_inspector = [IsAuthenticated(), IsAdminUser() or IsAnalystUser() or IsInspectorUser()]
    
    # Set Default permissions for method type based off role
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions based on the HTTP method.
        """
        if self.request.method == 'GET':
            # Any authenticated user can see inspections
            return self.all_users
        elif self.request.method in ['POST', 'DELETE']:
            # Only admin can create or delete
            return self.admin_analyst
        elif self.request.method == 'PUT':
            # Only admin, analyst and inspector can update
            return self.admin_analyst_inspector
        return [] 
    
    permission_classes = (IsAuthenticated,)
    #Get all or one
    def get(self, request, *args, **kwargs):
        #Allow any authenticated user to check the tasks
        self.permission_classes = (IsAuthenticated,)
        if not kwargs:
            try:
                activities = Activity.objects.all()
                serializer = ActivitySerializer(activities, many=True)
                return Response(serializer.data)
            except Exception as e:
                print(f"Error: {e}")
                return Response({'Error': str(e)})
        elif 'activity_id' in kwargs:
            try:
                activity = get_object_or_404(Activity, id=kwargs['activity_id'])
                serializer = ActivitySerializer(activity)
                return Response(serializer.data)
            except Exception as e:
                print(f"Error: {e}")
                return Response({'Error': str(e)})
        elif 'inspection_id' in kwargs:
            try:
                activities = Activity.objects.filter(inspection_id=kwargs['inspection_id'])
                serializer = ActivitySerializer(activities, many=True)
                return Response(serializer.data)
            except Exception as e:
                print(f"Error: {e}")
                return Response({'Error': str(e)})

    #Create 
    def post(self, request, *args, **kwargs): 
        #Allow only admins analysts to add activities
        self.permission_classes = (IsAuthenticated, IsAdminUser, IsAnalystUser)       
        try:
            inspection_id = kwargs.get('inspection_id')
            # Check if inspection_id is provided
            if not inspection_id:
                return Response({'Error': 'inspection_id is required'}, status=400)
            
            # Collect Inspection model from Inspection number provided
            inspection = Inspection.objects.get(pk=inspection_id)
            
            # Handle creation of multiple activities if array is provided
            if len(request.data) > 1 and (type(request.data) == list):
                activity_data = request.data
                for activity in activity_data:
                    activity['inspection'] = inspection.id
                    serializer = ActivitySerializer(data=activity)
                    if serializer.is_valid():
                        try:
                            activity = serializer.save()
                        except Exception as e:
                            print(f"Error saving activity: {e}")
                            return Response({'Error': str(e)}, status=500)
                    else:
                        return 
                return Response(activity, status=201)
                
            # handle creation if only one activity
            else:
                data = request.data.copy()
                data['inspection'] = inspection.id
                serializer = ActivitySerializer(data=data)
                if serializer.is_valid():
                    # Set handle creation and success response
                    activity = serializer.save()
                    return Response(ActivitySerializer(activity).data, status=201)
                else:
                    return Response(serializer.errors, status=400)
        except Exception as e:

            # Log the error and print the request data for debugging
            return Response({'Error': str(e)}, status=500)

    #Update Activity
    def put(self, request, id):
        # only admin, analyst and inspector can update activities
        self.permission_classes = (IsAuthenticated, IsAdminUser, IsAnalystUser, IsInspectorUser)
        try:
            activity = get_object_or_404(Activity, id=id)
            serializer = ActivitySerializer(activity, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            print(request.data)
        except Exception as e:
            print(f"Error: {e}")
            return Response({'Error': str(e)})
    
    #Delete Activity
    def delete(self, request, id):
        #only admins and analysts can delete activities
        self.permission_classes = (IsAuthenticated, IsAdminUser, IsAnalystUser)
        try:
            activity = get_object_or_404(Activity, id=id)
            if not activity:
                return Response(f'Error, activity with id:{id} not found')
            else:
                activity.delete()
                return Response(f'Activity with id:{id} deleted successfully')
        except Exception as e:
            print(f"Error: {e}")
            return Response({'Error': str(e)})
        