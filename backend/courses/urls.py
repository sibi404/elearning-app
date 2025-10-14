from django.urls import path
from . import views

urlpatterns = [
    path('get-courselist/',views.get_course,name='get-courselist'),
]