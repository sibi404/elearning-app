from django.urls import path

from . views import MyTokenObtainPairView,CookieTokenRefreshView,logout_view,student_signup_view,check_username,user_info_view

from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('signup/student/',student_signup_view,name='student_signup'),
    path('user-info/',user_info_view,name='user-info'),
    path('check-username/',check_username,name='check-username'),
    path('logout/',logout_view,name='logout'),
]