from django.urls import path
from . import views

from . teacher import views as teacher_view


urlpatterns = [
   path('get-lessons/<int:course_id>/',views.get_lessons,name='get-lessons'),
   path('lesson-details/<slug:slug>/',views.get_lesson_details,name='get-lesson-details'),
   path('get-course-announcements/',views.get_announcements,name='get-announcements'),
   path('get-lesson-materials/<int:lesson_id>/',views.get_lesson_materials,name='get-lesson-materials'),
   path('add-answer/',views.add_answer,name='add-answer'),
   path('update-progress/<int:lesson_id>/',views.update_lesson_progress,name='update-progress'),
   path('complete-lesson/<int:lesson_id>/',views.complete_lesson,name='complete-lesson'),
   path('download-material/<int:pk>/',views.download_material,name='download-material'),
   path('get-assignments/<int:lesson_id>/',views.get_lesson_assignments,name='lesson-assignments'),
   path('submit-assignment/<int:assignment_id>/',views.submit_assignment,name='submit-assignment'),

   path('teaching-courses-names/',teacher_view.teaching_courses_names,name='teaching-courses-names'),
   path('teacher-insight-data/',teacher_view.get_insight_data,name='teacher-insignt-data'),
   path('teaching-courses/',teacher_view.teaching_courses,name='teaching-courses'),
   path('teacher-course-list/',teacher_view.course_list,name='teacher-course-list'),
   path('<slug:course_slug>/',teacher_view.course_details,name='course_details'),
   path('<slug:slug>/students/',teacher_view.course_students_overview,name='course_student_overview'),
   path('add-course-announcement/',teacher_view.add_course_announcement,name='add-course-announcement'),
]