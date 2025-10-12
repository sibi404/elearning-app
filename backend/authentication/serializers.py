from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data =  super().validate(attrs)
        data['role'] = self.user.profile.role
        data['username'] = self.user.username
        data['firstname'] = self.user.first_name
        data['lastname'] = self.user.last_name
        return data