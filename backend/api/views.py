#Rest Framework tools and Pillow
import io

from django.core.files.uploadedfile import InMemoryUploadedFile
from django.shortcuts import get_object_or_404, render
from PIL import Image

#Utils and tools
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

#Models
from .models.inspection import Inspection

#Serializers
from .serializers.auth_serializers import CustomAuthSerializer
from .serializers.inspection_serializer import InspectionSerializer
from .utils.photo_edit import edit_img


#View to render api index showing endpoints and basic usage
def index(request):
    return render(request, 'index.html')

#Custom JWT Endpoint gen to provide user type
class CustomAuthView(TokenObtainPairView):
    serializer_class = CustomAuthSerializer

#Inspections Methods
class InspectionView(APIView):   
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
    def put(self, request, id):
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