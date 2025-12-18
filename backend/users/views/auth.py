from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from backend.users.serializers.user import UserSerializer

from ..serializers import RegistrationSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user

    POST /api/auth/register/
    {
        "username": "john",
        "email": "john@example.com", 
        "password": "secret123",
        "password2": "secret123",
        "phone": "123456789"
    }

    Returns:
    - user: User data
    - tokens: JWT access & refresh tokens
    """

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


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user and return JWT tokens

    POST /api/auth/login/
    {
        "username": "john",
        "password": "secret123"
    }
    """

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Get current logged-in user

    GET /api/auth/me/
    Headers: Authorization: Bearer <access_token>
    """

    return Response(UserSerializer(request.user).data)
