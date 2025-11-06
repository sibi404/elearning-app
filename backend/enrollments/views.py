from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from authentication.models import Student
from . serializers import EnrollmentSerializer
from . models import Enrollment
from courses.models import Lesson
from courses.serializers import LessonListSerializer

# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_enrolled_courses(request):
    student = get_object_or_404(Student, user=request.user)
    enrollments = student.enrollment_set.select_related('course')
    serializer = EnrollmentSerializer(enrollments,many=True,context={'request' : request,'course_fields' : ('id', 'title', 'description', 'thumbnail', 'duration', 'teacher', 'total_students','slug')})
    completed_count = enrollments.filter(completed=True).count()

    return Response({
        "completed_count" : completed_count,
        "enrollments" : serializer.data
    },status=status.HTTP_200_OK)


@api_view(['GET'])
def get_last_viewed_lesson(request, course_id):
    enrollment = Enrollment.objects.select_related('last_viewed_lesson').filter(
        student=request.user.student_profile,
        course_id=course_id
    ).first()
    
    if enrollment and enrollment.last_viewed_lesson:
        serializer = LessonListSerializer(enrollment.last_viewed_lesson)
        return Response(serializer.data,status=status.HTTP_200_OK)
    else:
        return Response({"message": "No last_viewed_lesson found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_lastviewed_lesson(request,lesson_id):
    try:
        lesson = Lesson.objects.get(id=lesson_id)
        enrollment = Enrollment.objects.get(student=request.user.student_profile,course=lesson.course)
        enrollment.last_viewed_lesson = lesson
        enrollment.save()
        return Response({"message" : "Last viewed lesson updated."},status=status.HTTP_200_OK)
    except Lesson.DoesNotExist:
        return Response({"error" : "Lesson not found"},status=status.HTTP_404_NOT_FOUND)
    except Enrollment.DoesNotExist:
        return Response({"error" : "Enrollment not found"},status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error" : f"An unexpeted error occured : {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
