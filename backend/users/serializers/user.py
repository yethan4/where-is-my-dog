from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model (read-only for now)
    """

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'phone',
            'profile_photo',
            'email_verified',
            'is_moderator',
            'is_banned',
            'created_at',
        )
        read_only_fields = (
            'id',
            'email_verified',
            'is_moderator',
            'is_banned',
            'created_at',
        )


class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """

    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'password',
            'password2',
            'phone',
        )
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {'input_type': 'password'}
            }
        }

    def validate(self, attrs):
        """
        Validate that passwords match
        """

        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Passwords do not match"
            })

        return attrs

    def create(self, validated_data):
        """
        Create user iwth hashed password
        """
        validated_data.pop('password2')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone', '')
        )

        return user
