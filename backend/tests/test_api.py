import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from api.models.inspection import Inspection
import datetime

@pytest.fixture
def api_client():
    """Fixture to provide an API client"""
    return APIClient()

@pytest.fixture
def create_user():
    """Fixture to create a regular user"""
    def _create_user(username="testuser", password="testpassword123"):
        return User.objects.create_user(username=username, password=password)
    return _create_user

@pytest.fixture
def create_admin():
    """Fixture to create an admin user"""
    def _create_admin(username="admin", password="adminpassword123"):
        return User.objects.create_superuser(
            username=username, 
            password=password, 
            email="admin@example.com"
        )
    return _create_admin

@pytest.fixture
def create_inspection():
    """Fixture to create a test inspection"""
    def _create_inspection(title="Test Inspection"):
        return Inspection.objects.create(
            title=title,
            description="This is a test inspection",
            due_date=datetime.date.today(),
            latitude=37.7749,
            longitude=-122.4194,
            completed=False
        )
    return _create_inspection

@pytest.fixture
def user_token(api_client, create_user):
    """Fixture to get a token for a regular user"""
    user = create_user()
    url = reverse('token_obtain_pair')
    response = api_client.post(
        url, 
        {'username': 'testuser', 'password': 'testpassword123'},
        format='json'
    )
    return response.data['access']

@pytest.fixture
def admin_token(api_client, create_admin):
    """Fixture to get a token for an admin user"""
    admin = create_admin()
    url = reverse('token_obtain_pair')
    response = api_client.post(
        url, 
        {'username': 'admin', 'password': 'adminpassword123'},
        format='json'
    )
    return response.data['access']

@pytest.mark.django_db
class TestAuthentication:
    def test_login_success(self, api_client, create_user):
        """Test successful login with valid credentials"""
        user = create_user()
        url = reverse('token_obtain_pair')
        response = api_client.post(
            url, 
            {'username': 'testuser', 'password': 'testpassword123'},
            format='json'
        )
        
        assert response.status_code == 200
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_failure(self, api_client, create_user):
        """Test login failure with invalid credentials"""
        user = create_user()
        url = reverse('token_obtain_pair')
        response = api_client.post(
            url, 
            {'username': 'testuser', 'password': 'wrongpassword'},
            format='json'
        )
        
        assert response.status_code == 401
    
    def test_token_refresh(self, api_client, create_user):
        """Test token refresh endpoint"""
        user = create_user()
        
        # First get a token
        login_url = reverse('token_obtain_pair')
        login_response = api_client.post(
            login_url, 
            {'username': 'testuser', 'password': 'testpassword123'},
            format='json'
        )
        refresh_token = login_response.data['refresh']
        
        # Now try to refresh it
        refresh_url = reverse('token_refresh')
        refresh_response = api_client.post(
            refresh_url, 
            {'refresh': refresh_token},
            format='json'
        )
        
        assert refresh_response.status_code == 200
        assert 'access' in refresh_response.data

@pytest.mark.django_db
class TestInspectionCRUD:
    """Tests for CRUD operations on inspections"""
    
    def test_list_inspections(self, api_client, user_token, create_inspection):
        """Test listing inspections as an authenticated user"""
        inspection = create_inspection()
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
        
        url = reverse('inspections_all')
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert len(response.data) >= 1
    
    def test_get_inspection_detail(self, api_client, user_token, create_inspection):
        """Test getting a specific inspection by ID"""
        inspection = create_inspection()
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_token}')
        
        url = reverse('inspections_one', kwargs={'id': inspection.id})
        response = api_client.get(url)
        
        assert response.status_code == 200
        assert response.data['id'] == inspection.id
        assert response.data['title'] == "Test Inspection"
    
    def test_create_inspection(self, api_client, admin_token):
        """Test creating a new inspection"""
        api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
        
        data = {
            'title': 'New Inspection',
            'description': 'A new test inspection',
            'due_date': datetime.date.today().isoformat(),
            'latitude': 40.7128,
            'longitude': -74.0060,
        }
        
        url = reverse('inspections_all')
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == 201
        assert response.data['title'] == 'New Inspection'