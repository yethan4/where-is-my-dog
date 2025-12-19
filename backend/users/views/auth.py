from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
    OpenApiExample
)

from ..serializers import UserSerializer, RegistrationSerializer


@extend_schema(
    request=RegistrationSerializer,
    responses={
        201: OpenApiResponse(
            response=UserSerializer,
            description="User registered successfully",
            examples=[
                OpenApiExample(
                    'Success',
                    value={
                        'user': {
                            'id': 1,
                            'username': 'john',
                            'email': 'john@example.com',
                            'phone': '123456789',
                            'profile_photo': None,
                            'email_verified': False,
                            'is_moderator': False,
                            'is_banned': False,
                            'created_at': '2025-12-18T13:00:00Z'
                        },
                        'tokens': {
                            'refresh': 'eyJ0eXAiOiJKV1QiLCJhbG...',
                            'access': 'eyJ0eXAiOiJKV1QiLCJhbG...'
                        }
                    }
                )
            ]
        ),
        400: OpenApiResponse(description="Validation error")
    },
    tags=['Authentication'],
    summary="Register new user",
    description="Create a new user account and receive JWT tokens"
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user account"""

    serializer = RegistrationSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    refresh = RefreshToken.for_user(user)

    tokens = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

    return Response({
        'user': UserSerializer(user).data,
        'tokens': tokens
    }, status=status.HTTP_201_CREATED)


@extend_schema(
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'username': {'type': 'string', 'example': 'john'},
                'password': {
                    'type': 'string',
                    'example': 'secret123',
                    'format': 'password'
                }
            },
            'required': ['username', 'password']
        }
    },
    responses={
        200: OpenApiResponse(
            response=UserSerializer,
            description="Login successful",
            examples=[
                OpenApiExample(
                    'Success',
                    value={
                        'user': {
                            'id': 1,
                            'username': 'john',
                            'email': 'john@example.com',
                            'phone': '123456789',
                            'profile_photo': None,
                            'email_verified': False,
                            'is_moderator': False,
                            'is_banned': False,
                            'created_at': '2025-12-18T13:00:00Z'
                        },
                        'tokens': {
                            'refresh': 'eyJ0eXAiOiJKV1QiLCJhbG...',
                            'access': 'eyJ0eXAiOiJKV1QiLCJhbG...'
                        }
                    }
                )
            ]
        ),
        401: OpenApiResponse(
            description="Invalid credentials",
            examples=[
                OpenApiExample(
                    'Error',
                    value={'error': 'Invalid credentials'}
                )
            ]
        )
    },
    tags=['Authentication'],
    summary="Login user",
    description="Authenticate user and receive JWT tokens"
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user and return JWT tokens"""

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    tokens = {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }

    return Response({
        'user': UserSerializer(user).data,
        'tokens': tokens
    })


@extend_schema(
    responses={
        200: UserSerializer,
        401: OpenApiResponse(
            description="Authentication credentials were not provided")
    },
    tags=['Authentication'],
    summary="Get current user",
    description="Retrieve currently authenticated user information"
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current logged-in user"""

    return Response(UserSerializer(request.user).data)
