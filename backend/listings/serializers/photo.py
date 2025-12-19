from rest_framework import serializers
from ..models import Photo


class PhotoSerializer(serializers.ModelSerializer):
    """
    Serializer for Photo model.
    Used for displaying photos attached to listings.
    """

    class Meta:
        model = Photo
        fields = (
            'id',
            'cloudinary_url',
            'thumbnail_url',
            'order_index',
            'uploaded_at',
        )
        read_only_fields = (
            'id',
            'thumbnail_url',
            'uploaded_at',
        )
