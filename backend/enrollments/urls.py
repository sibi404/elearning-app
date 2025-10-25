from django.urls import path
from . import views

urlpatterns = [
    path('enrolled-courses/',views.get_enrolled_courses,name='get-enrolled-courses'),
    path('get-lastviewed-lesson/<int:course_id>/',views.get_last_viewed_lesson,name='get-last-viewed-lesson'),
    path('update-lastviewed-lesson/<int:lesson_id>/',views.update_lastviewed_lesson,name='update-last-viewed-lesson'),
]