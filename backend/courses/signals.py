from django.dispatch import receiver
from django.db.models.signals import post_save,post_delete
from . models import LessonProgress,Lesson
from enrollments.models import Enrollment

from decimal import Decimal



def recalc_course_enrollments(course,old_total,new_total,deleted_lesson=None):
    enrollments = Enrollment.objects.filter(course=course)

    if new_total == 0:
        enrollments.update(progress=0, completed=False, last_viewed_lesson=None)
        return
    was_completed = False
    for enroll in enrollments:
        old_completed = round((float(enroll.progress) / 100) * old_total)

        if deleted_lesson is not None:
            was_completed = LessonProgress.objects.filter(
                student=enroll.student,
                lesson = deleted_lesson,
                completed = True,
            ).exists()

        if was_completed:
            old_completed -= 1

        if old_completed < 0:
            old_completed = 0
        
        new_progress = (old_completed / new_total) * 100
        new_progress = round(new_progress,1)

        enroll.progress = new_progress
        enroll.completed = new_progress >= 90

        if deleted_lesson and enroll.last_viewed_lesson_id == deleted_lesson.id:
            enroll.last_viewed_lesson = None
        
        enroll.save(update_fields = ['progress','completed','last_viewed_lesson'])



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


@receiver(post_save,sender=Lesson)
def handle_new_lesson(sender,instance,created,**kwargs):
    if not created:
        return
    
    course = instance.course

    new_total = course.lessons.count()
    old_total = new_total - 1

    recalc_course_enrollments(
       course=course,
       old_total=old_total,
       new_total=new_total,
   )


@receiver(post_delete,sender=Lesson)
def handle_delete_lesson(sender,instance,**kwargs):
    course = instance.course

    new_total = course.lessons.count()
    old_total = new_total + 1

    recalc_course_enrollments(
        course=course,
        old_total=old_total,
        new_total=new_total,
        deleted_lesson=instance
    )