from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_protect,csrf_exempt
from django.db import transaction,IntegrityError
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError,InvalidToken

from . serializers import UserSerializer,UserProfileSerializer
from . models import UsersProfile,Student
# Create your views here.

@method_decorator(ensure_csrf_cookie,name='dispatch')
class MyTokenObtainPairView(TokenObtainPairView):

    def post(self,request,*args,**kwargs):
        response = super().post(request,*args,**kwargs)

        refresh = response.data.get('refresh')

        if refresh:
            response.set_cookie(
                key='refresh_token',
                value=refresh,
                httponly=True,
                secure=True,
                samesite='None',
            )

            del response.data['refresh']
        return response

@method_decorator(csrf_protect,name='dispatch')
class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer

    def post(self,request,*args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response({"detail" : "No refresh token in cookie"},status=status.HTTP_401_UNAUTHORIZED)
        

        try:
            serializer = self.get_serializer(data={"refresh" : refresh_token})
            serializer.is_valid(raise_exception=True)
            access_token = serializer.validated_data["access"]
            response = Response({"access": access_token}, status=status.HTTP_200_OK)

            return response
        except (TokenError,InvalidToken):
            response = Response({
                "details" : "Refresh token is invalid or expired"
            },
            status=status.HTTP_401_UNAUTHORIZED
            )

            response.delete_cookie("refresh_token")
            return response

@csrf_exempt
@api_view(['POST'])
def student_signup_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                user = serializer.save()
                UsersProfile.objects.create(user=user, role="STUDENT")
                Student.objects.create(user=user)

            return Response({"message" : "SUCCESS"},status=status.HTTP_201_CREATED)
        
        except IntegrityError as e:
            return Response({"error" : str(e)},status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            return Response({"error" : "Someting went wrong"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def check_username(request):
    username = request.query_params.get('username')
    
    if not username:
        return Response({"error" : "Username parameter is required"},status=status.HTTP_400_BAD_REQUEST)
    
    exists = User.objects.filter(username=username).exists()

    return Response({"exists" : exists},status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info_view(request):
    user_profile = get_object_or_404(UsersProfile,user=request.user)
    serializer = UserProfileSerializer(user_profile)

    return Response(serializer.data,status=status.HTTP_200_OK)

    

@api_view(['POST'])
def logout_view(request):
    response = Response({
        "detail" : "Logged out successfully"
    },status=status.HTTP_200_OK)

    response.delete_cookie(
        key="refresh_token",
        samesite="None",
    )
    return response