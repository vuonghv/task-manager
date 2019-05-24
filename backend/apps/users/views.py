from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.utils import timezone

from apps.users.auth import BearerAuthentication
from apps.users.models import User, AccessToken
from apps.users.serializers import (
    RegisterSerializer, UserSerializer, LoginSerializer, AccessTokenSerializer,
)


class UserRegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        if User.objects.filter(email=email).exists():
            return Response('Email already taken', status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(email=email)
        user.set_password(password)
        user.save()

        user_serializer = UserSerializer(user)
        return Response(user_serializer.data, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = authenticate(email=email, password=password)
        if not user:
            return Response('Wrong Email or Password', status=status.HTTP_401_UNAUTHORIZED)

        expired_time = timezone.now() + timezone.timedelta(days=30)
        token = AccessToken.objects.create(user_id=user.id, expired_time=expired_time)
        token_serializer = AccessTokenSerializer(token)
        return Response(token_serializer.data, status=status.HTTP_200_OK)


class UserLogoutView(APIView):

    def post(self, request, format=None):
        request.auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserDetailView(APIView):

    def get(self, request, format=None):
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)
