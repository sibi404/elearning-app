from django.urls import path
from . import views

urlpatterns = [
   path('get-lessons/<int:course_id>/',views.get_lessons,name='get-lessons'),
]