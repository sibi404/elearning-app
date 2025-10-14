from django.urls import path
from . import views

urlpatterns = [
    path('enrolled-courses/',views.get_enrolled_courses,name='get-enrolled-courses'),
]