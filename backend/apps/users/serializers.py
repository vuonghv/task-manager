from rest_framework import serializers

from apps.users.models import User, AccessToken


class RegisterSerializer(serializers.Serializer):
    """Validate user register data"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class LoginSerializer(serializers.Serializer):
    """Validate login data"""
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'date_joined',
                  'is_active', 'first_name', 'last_name')


class AccessTokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = AccessToken
        fields = ('key', 'created', 'expired_time')
