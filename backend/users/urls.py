from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)
from drf_spectacular.utils import extend_schema

from .views.auth import register, login, current_user

TokenRefreshView = extend_schema(tags=['Authentication'])(TokenRefreshView)
TokenVerifyView = extend_schema(tags=['Authentication'])(TokenVerifyView)

app_name = 'users'

urlpatterns = [
    # Registration & Login
    path('auth/register/', register, name='register'),
    path('auth/login/', login, name='login'),
    path('auth/me/', current_user, name='current_user'),

    # JWT Token Management
    path(
        'auth/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
