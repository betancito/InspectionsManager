import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from pytest import raises

from api.models.inspection import Inspection

# Access to database
@pytest.mark.django_db
def test_inspection_creation():
    inspection = Inspection.objects.create(
        title="Test Inspection",
        description="This is a test inspection",
        due_date="2023-10-01",
        latitude=37.7749,
        longitude=-122.4194,
    )
    
    # Check if the inspection was created successfully
    assert inspection.title == "Test Inspection"
    assert inspection.description == "This is a test inspection"
    assert str(inspection.due_date) == "2023-10-01"
    assert inspection.latitude == 37.7749
    assert inspection.longitude == -122.4194
    assert inspection.completed is False  # Default value check
    
    # Check string representation
    assert str(inspection) == "Test Inspection"

@pytest.mark.django_db
def test_required_fields():
    """Test that all required fields raise ValidationError when missing."""
    
    # Base valid inspection data
    valid_data = {
        'title': 'Test Inspection',
        'description': 'This is a test inspection',
        'due_date': '2023-10-01',
        'latitude': 37.7749,
        'longitude': -122.4194,
    }
    
    # Test each required field by removing it one at a time
    required_fields = ['title', 'description', 'due_date', 'latitude', 'longitude']
    
    for field in required_fields:
        # Create a copy of the valid data and remove the current field
        test_data = valid_data.copy()
        test_data.pop(field)
        
        # Create inspection without the required field
        inspection = Inspection(**test_data)
        
        # The validation should fail
        with pytest.raises(ValidationError) as excinfo:
            inspection.full_clean()
        
        # Verify the error is about the missing field
        assert field in str(excinfo.value)
        
    # Test empty strings for CharField fields
    for field in ['title', 'description']:
        test_data = valid_data.copy()
        test_data[field] = ''
        
        inspection = Inspection(**test_data)
        
        with pytest.raises(ValidationError) as excinfo:
            inspection.full_clean()
        
        assert field in str(excinfo.value)
    
    # Verify a valid inspection passes validation
    valid_inspection = Inspection(**valid_data)
    try:
        valid_inspection.full_clean()
    except ValidationError:
        pytest.fail("Validation error raised for valid inspection data")