from django.urls import path
from . import views

urlpatterns = [
   path('get-lessons/<int:course_id>/',views.get_lessons,name='get-lessons'),
   path('lesson-details/<slug:slug>/',views.get_lesson_details,name='get-lesson-details'),
   path('get-lesson-materials/<int:lesson_id>/',views.get_lesson_materials,name='get-lesson-materials'),
   path('add-answer/',views.add_answer,name='add-answer'),
   path('update-progress/<int:lesson_id>/',views.update_lesson_progress,name='update-progress'),
   path('complete-lesson/<int:lesson_id>/',views.complete_lesson,name='complete-lesson'),
   path('download-material/<int:pk>/',views.download_material,name='download-material'),
]