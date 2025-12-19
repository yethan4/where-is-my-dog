from rest_framework import serializers
from ..models import Listing
from . import PhotoSerializer, LocationSerializer


class ListingSerializer(serializers.ModelSerializer):
    """
    Main serializer for Listing model.
    Includes nested photos and locations.
    """

    photos = PhotoSerializer(many=True, read_only=True)
    locations = LocationSerializer(many=True, read_only=True)

    primary_location = serializers.SerializerMethodField()
    photo_count = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = (
            'id',
            'type',
            'status',
            'title',
            'description',
            'breed',
            'size',
            'color',
            'gender',
            'has_collar',
            'collar_color',
            'dog_name',
            'age_estimate',
            'special_marks',
            'fostering_address',
            'reward_offered',
            'search_radius_km',
            'photos',
            'photo_count',
            'locations',
            'primary_location',
            'created_at',
            'updated_at',
        )
        read_only_fields = (
            'id',
            'created_at',
            'updated_at',
        )

    def get_primary_location(self, obj):
        """
        Returns the primary (most recent) location for this listing.
        """
        primary = obj.locations.filter(is_primary=True).first()
        if primary:
            return LocationSerializer(primary).data
        return None

    def get_photo_count(self, obj):
        """
        Returns the total number of photos for this listing.
        """
        return obj.photos.count()

    def validate_search_radius_km(self, value):
        """
        Custom validation for search radius.
        For Lublin area, we limit radius to 1-10 km.
        """
        if value < 1 or value > 10:
            raise serializers.ValidationError(
                "Search radius must be between 1 and 10 km for Lublin area"
            )
        return value
