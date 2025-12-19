from rest_framework import serializers
from ..models import Location


class LocationSerializer(serializers.ModelSerializer):
    """
    Serializer for Location model.
    Handles geographic data for listings.

    Note: 'point' field (PostGIS geometry) is excluded from API.
    Instead, we expose latitude/longitude which are auto-populated
    from the point field in the model's save() method.
    """

    class Meta:
        model = Location
        fields = (
            'id',
            'latitude',
            'longitude',
            'address',
            'location_type',
            'is_primary',
            'notes',
            'accuracy_meters',
            'created_at',
        )
        read_only_fields = (
            'id',
            'created_at',
            'latitude',
            'longitude',
        )
