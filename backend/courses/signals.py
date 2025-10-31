from django.dispatch import receiver
from django.db.models.signals import post_save
from . models import LessonProgress,Lesson
from enrollments.models import Enrollment

from decimal import Decimal

@receiver(post_save,sender=LessonProgress)
def update_enrollment_progress(sender,instance,**kwargs):
    student = instance.student
    course = instance.lesson.course

    enrollment = Enrollment.objects.filter(student=student,course=course).first()
    if enrollment:
        total_lessons = Lesson.objects.filter(course=course).count()
        if total_lessons == 0:
            enrollment.progress = 0
            enrollment.completed = False
            enrollment.save()
            return
    
    completed_lessons = LessonProgress.objects.filter(student=student,lesson__course=course,completed=True).count()

    progress_percent = (completed_lessons/total_lessons) * 100
    progress_percent = Decimal(str(round(progress_percent, 1)))

    enrollment.progress = progress_percent
    enrollment.completed = progress_percent >= 90
    enrollment.last_viewed_lesson = instance.lesson
    enrollment.save()