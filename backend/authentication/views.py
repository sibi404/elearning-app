from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_protect

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError,InvalidToken
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