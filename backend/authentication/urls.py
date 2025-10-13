from django.urls import path

from . views import MyTokenObtainPairView,CookieTokenRefreshView,logout_view

from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('logout/',logout_view,name='logout'),
]