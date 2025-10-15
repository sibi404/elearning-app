from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from authentication.models import Student
from courses.serializers import CourseSerializer
from . serializers import EnrollmentSerializer

# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_enrolled_courses(request):
    student = get_object_or_404(Student, user=request.user)
    enrollments = student.enrollment_set.select_related('course')
    serializer = EnrollmentSerializer(enrollments,many=True,context={'request' : request})
    completed_count = enrollments.filter(completed=True).count()

    return Response({
        "completed_count" : completed_count,
        "enrollments" : serializer.data
    },status=status.HTTP_200_OK)

