from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework import serializers

from django.contrib.auth.models import User

from . models import UsersProfile,Student

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data =  super().validate(attrs)
        data['role'] = self.user.profile.role
        data['username'] = self.user.username
        data['firstname'] = self.user.first_name
        data['lastname'] = self.user.last_name
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','email','password','first_name','last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        ) 
        return user