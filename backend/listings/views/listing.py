from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    OpenApiExample
)

from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D

from ..models import Listing
from ..serializers import ListingSerializer


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
