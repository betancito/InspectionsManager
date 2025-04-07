#Rest Framework tools
from django.shortcuts import get_object_or_404, render
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView

#Models
from .models.inspection import Inspection

#Serializers
from .serializers.auth_serializers import CustomAuthSerializer
from .serializers.inspection_serializer import InspectionSerializer


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

    def post(self, request):
        print('post request', request.data)
        try:
            serializer = InspectionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)
            return Response(serializer.errors, status=400)
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
        
#Complete inspection methods

# class CompleteInspectionView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     authentication_classes = [JWTAuthentication]
    
    # @csrf_exempt
    # def put(self, request, id):
    #     try:
    #         inspection = Inspection.objects.get(pk=id)
    #         data = request.data.copy()
            
    #         if 'latitude' and 'longitude' and 'description' and 'photo' in data:
    #             data['completed_lat', ] = data.pop('latitude')
    #             data['completed_log']  = data.pop('longitude')
    #             data['completed_description']  = data.pop('description')
    #             data['completed_file']  = data.pop('photo')
    #             data['completed'] = True
    #             serializer = InspectionSerializer(inspection, data=data)
    #             serializer.save()
    #         elif  'completed_lat' and 'completed_log' and 'completed_description' and 'completed_file' in data:
    #             data['completed'] = True
    #             serializer = InspectionSerializer(inspection, data=data)
    #             serializer.save()
    #     except Exception as e:
    #         print(f"Error: {e}")
    #         return Response({'Error': str(e)})

class CompleteInspectionView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    
    def put(self, request, id):
        try:
            inspection = Inspection.objects.get(pk=id)
            
            # Get values directly from request.data
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
            description = request.data.get('description')
            photo = request.FILES.get('photo')
            
            if not all([latitude, longitude, description, photo]):
                return Response({"error": "Missing required fields"}, status=400)
            
            # Update the inspection
            inspection.completed_lat = float(latitude)
            inspection.completed_log = float(longitude)
            inspection.completed_description = description
            inspection.completed_file = photo
            inspection.completed = True
            inspection.save()
            
            # Return the updated inspection
            serializer = InspectionSerializer(inspection)
            return Response(serializer.data)
            
        except Inspection.DoesNotExist:
            return Response({"error": f"Inspection with id {id} not found"}, status=404)
        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
