from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    OpenApiExample,
)

from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D

import cloudinary.uploader


from ..models import Listing, Photo
from ..serializers import (
    ListingSerializer,
    PhotoSerializer,
    PhotoUploadSerializer,
    PhotoDeleteSerializer,
    LocationSerializer,
    SimilarListingSerializer
)

from ..services import DuplicateDetector


@extend_schema(tags=['Listings'])
class ListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing dog listings (lost and found).

    Provides CRUD operations and special actions:
    - List/Create/Update/Delete listings
    - Search nearby listings by location
    - Mark listings as found/returned
    """
    queryset = Listing.objects.all().order_by('-created_at')
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'status', 'breed', 'size', 'color', 'gender']
    search_fields = ['title', 'description', 'dog_name']

    def perform_create(self, serializer):
        """Automatically set the listing owner to the current user"""
        serializer.save(user=self.request.user)

    @extend_schema(
        summary="Mark listing as found/returned",
        description=(
            "Mark a listing as found (for lost dogs) or returned to owner "
            "(for found dogs). Only the listing owner can perform this action."
        ),
        request=None,
        responses={
            200: ListingSerializer,
            403: OpenApiResponse(
                description="Not the owner of this listing",
                examples=[
                    OpenApiExample(
                        'Forbidden',
                        value={'error': 'You can only mark your own listings'}
                    )
                ]
            )
        }
    )
    @action(detail=True, methods=['post'])
    def mark_found(self, request, pk=None):
        """
        Mark a listing as found/returned.
        Only the listing owner can mark their own listing.
        """
        listing = self.get_object()

        if listing.user != request.user:
            return Response(
                {'error': 'You can only mark your own listings'},
                status=status.HTTP_403_FORBIDDEN
            )

        if listing.type == 'lost':
            listing.status = Listing.STATUS_FOUND
        else:  # found
            listing.status = Listing.STATUS_RETURNED

        listing.save()

        serializer = self.get_serializer(listing)
        return Response(serializer.data)

    @extend_schema(
        summary="Find listings near a location",
        description=(
            "Search for lost or found dog listings within a specified radius "
            "of a geographic location. Results are ordered by distance (closest first)." # noqa
        ),
        parameters=[
            OpenApiParameter(
                name='latitude',
                type=float,
                location=OpenApiParameter.QUERY,
                required=True,
                description='Latitude coordinate (e.g., 51.2465 for Lublin)',
                examples=[
                    OpenApiExample(
                        'Lublin',
                        value=51.2465
                    )
                ]
            ),
            OpenApiParameter(
                name='longitude',
                type=float,
                location=OpenApiParameter.QUERY,
                required=True,
                description='Longitude coordinate (e.g., 22.5684 for Lublin)',
                examples=[
                    OpenApiExample(
                        'Lublin',
                        value=22.5684
                    )
                ]
            ),
            OpenApiParameter(
                name='radius_km',
                type=float,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Search radius in kilometers (default: 5, max: 10)', # noqa
                examples=[
                    OpenApiExample(
                        'Default',
                        value=5
                    )
                ]
            ),
            OpenApiParameter(
                name='type',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filter by listing type',
                enum=['lost', 'found']
            ),
        ],
        responses={
            200: ListingSerializer(many=True),
            400: OpenApiResponse(
                description="Invalid parameters",
                examples=[
                    OpenApiExample(
                        'Missing coordinates',
                        value={'error': 'latitude and longitude are required'}
                    ),
                    OpenApiExample(
                        'Invalid format',
                        value={'error': 'Invalid coordinates or radius'}
                    )
                ]
            )
        }
    )
    @action(detail=False, methods=['get'], url_path='nearby')
    def nearby(self, request):
        """
        Find listings near a location.

        Query params:
        - latitude (required)
        - longitude (required)
        - radius_km (optional, default 5)
        - type (optional: 'lost' or 'found')
        """

        lat = request.query_params.get('latitude')
        lng = request.query_params.get('longitude')
        radius_km = request.query_params.get('radius_km', 5)
        listing_type = request.query_params.get('type')

        if not lat or not lng:
            return Response(
                {'error': 'latitude and longitude are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lat = float(lat)
            lng = float(lng)
            radius_km = float(radius_km)
        except ValueError:
            return Response(
                {'error': 'Invalid coordinates or radius'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if radius_km > 10:
            radius_km = 10

        user_location = Point(lng, lat, srid=4326)

        queryset = Listing.objects.filter(
            locations__is_primary=True,
            locations__point__distance_lte=(user_location, D(km=radius_km))
        ).annotate(
            distance=Distance('locations__point', user_location)
        ).order_by('distance')

        if listing_type:
            queryset = queryset.filter(type=listing_type)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Upload photo for listing",
        description=(
            "Upload a photo to this listing. The photo will be uploaded to Cloudinary " # noqa
            "and a thumbnail will be automatically generated. Maximum 2 photos per listing." # noqa
        ),
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'photo': {
                        'type': 'string',
                        'format': 'binary',
                        'description': 'Photo file (JPEG, PNG, WebP, max 5MB)'
                    },
                    'order_index': {
                        'type': 'integer',
                        'default': 0,
                        'description': 'Order of photo display (0 = primary)'
                    }
                },
                'required': ['photo']
            }
        },
        responses={
            201: OpenApiResponse(
                response=PhotoSerializer,
                description="Photo uploaded successfully",
                examples=[
                    OpenApiExample(
                        'Success',
                        value={
                            'id': 1,
                            'cloudinary_url': 'https://res.cloudinary.com/.../dog.jpg', # noqa
                            'thumbnail_url': 'https://res.cloudinary.com/.../w_300,h_300/dog.jpg', # noqa
                            'order_index': 0,
                            'uploaded_at': '2024-12-20T10:30:00Z'
                        }
                    )
                ]
            ),
            400: OpenApiResponse(
                description="Validation error",
                examples=[
                    OpenApiExample(
                        'Max photos reached',
                        value={'error': 'A listing can have a maximum of 2 photos.'} # noqa
                    ),
                    OpenApiExample(
                        'File too large',
                        value={'photo': ['File size too large. Maximum size is 5MB.']} # noqa
                    ),
                    OpenApiExample(
                        'Invalid file type',
                        value={'photo': ['Invalid file type. Allowed types: JPEG, PNG, WebP.']} # noqa
                    )
                ]
            ),
            403: OpenApiResponse(
                description="Not the listing owner",
                examples=[
                    OpenApiExample(
                        'Forbidden',
                        value={'error': 'You can only add photo to your own listings'} # noqa
                    )
                ]
            ),
            404: OpenApiResponse(
                description="Listing not found"
            )
        }
    )
    @action(detail=True, methods=['post'])
    def upload_photo(self, request, pk=None):
        """
        Upload photo for a listing.
        Only the listing owner can add photo for their own listing.
        """
        listing = self.get_object()

        if listing.user != request.user:
            return Response(
                {'error': 'You can only add photo to your own listings'},
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data['listing'] = listing.id

        serializer = PhotoUploadSerializer(data=data)

        serializer.is_valid(raise_exception=True)

        photo = serializer.save()

        return Response(
            PhotoSerializer(photo).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Delete photo from listing",
        description=(
            "Delete a specific photo from this listing. "
            "Only the listing owner can delete photos. "
            "The photo will also be removed from Cloudinary."
        ),
        responses={
            200: OpenApiResponse(
                response=PhotoDeleteSerializer,
                description="Photo deleted successfully",
                examples=[
                    OpenApiExample(
                        'Success',
                        value={
                            'id': 5,
                            'message': 'Photo deleted successfully',
                            'deleted_at': '2025-12-20T22:30:00Z'
                        }
                    )
                ]
            ),
            403: OpenApiResponse(
                description="Not the listing owner",
                examples=[
                    OpenApiExample(
                        'Forbidden',
                        value={'error': 'You can only delete photos from your own listings'} # noqa
                    )
                ]
            ),
            404: OpenApiResponse(
                description="Photo not found in this listing",
                examples=[
                    OpenApiExample(
                        'Not Found',
                        value={'error': 'Photo not found in this listing'}
                    )
                ]
            ),
            500: OpenApiResponse(
                description="Server error - failed to delete photo from Cloudinary", # noqa
                examples=[
                    OpenApiExample(
                        'Server Error',
                        value={'error': 'Failed to delete photo: Connection timeout'} # noqa
                    )
                ]
            )
        }
    )
    @action(
        detail=True,
        methods=['delete'],
        url_path='photos/(?P<photo_id>[^/.]+)'
    )
    def delete_photo(self, request, pk=None, photo_id=None):
        """
        Delete a photo from listing.
        Only the listing owner can delete photos.
        """
        listing = self.get_object()

        if listing.user != request.user:
            return Response(
                {'error': 'You can only delete photos from your own listings'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            photo = listing.photos.get(id=photo_id)
        except Photo.DoesNotExist:
            return Response(
                {'error': 'Photo not found in this listing'},
                status=status.HTTP_404_NOT_FOUND
            )

        photo_id_deleted = photo.id
        cloudinary_public_id = photo.cloudinary_public_id

        try:
            if cloudinary_public_id:
                cloudinary.uploader.destroy(cloudinary_public_id)

            photo.delete()

            return Response(
                {
                    'id': photo_id_deleted,
                    'message': 'Photo deleted successfully',
                    'deleted_at': timezone.now()
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to delete photo: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @extend_schema(
        summary="Add new location to listing",
        description=(
            "Add a new location update to an existing listing. "
            "Any authenticated user can add a location if they spot the dog again." # noqa
        ),
        request=LocationSerializer,
        responses={
            201: LocationSerializer,
            400: OpenApiResponse(description="Validation error"),
            401: OpenApiResponse(description="Authentication required"),
            404: OpenApiResponse(description="Listing not found")
        }
    )
    @action(
        detail=True,
        methods=['post'],
        url_path='location'
    )
    def add_location(self, request, pk=None):
        listing = self.get_object()

        serializer = LocationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        location = serializer.save(
            added_by_user=request.user,
            listing=listing
            )

        return Response(
            LocationSerializer(location).data,
            status=status.HTTP_201_CREATED
        )

    @extend_schema(
        summary="Check for similar listings",
        description=(
            "Search for similar dog listings based on characteristics and location.\n\n" # noqa
            "**Use cases:**\n"
            "- search_type='found': Find duplicate 'found' reports (before creating new listing)\n" # noqa
            "- search_type='lost': Find potential owners (after creating 'found' listing)" # noqa
        ),
        request=SimilarListingSerializer,
        responses={
            200: ListingSerializer(many=True),
            400: OpenApiResponse(description="Validation error"),
        }
    )
    @action(
        detail=False,
        methods=['post'],
        url_path='check-similar'
    )
    def check_similar(self, request):
        """
        Find similar listings based on characteristics and location.
        """

        serializer = SimilarListingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        search_type = validated_data.pop('search_type')

        detector = DuplicateDetector(radius_km=2)
        similar_listings = detector.find_similar_listings(
            listing_data=validated_data,
            listing_type=search_type
        )

        return Response(
            ListingSerializer(similar_listings, many=True).data,
            status=status.HTTP_200_OK
        )
