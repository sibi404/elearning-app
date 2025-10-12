from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_protect

from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
# Create your views here.

@method_decorator(ensure_csrf_cookie,name='dispatch')
class MyTokenObtainPairView(TokenObtainPairView):

    def post(self,request,*args,**kwargs):
        response = super().post(request,*args,**kwargs)

        refresh = response.data.get('refresh')
        print(refresh)
        access = response.data.get('access')

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
        
        serializer = self.get_serializer(data={"refresh" : refresh_token})
        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data["access"]
        response = Response({"access": access_token}, status=status.HTTP_200_OK)

        return response