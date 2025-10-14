from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from authentication.models import Student
from courses.serializers import CourseSerializer

# Create your views here.


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_enrolled_courses(request):
    student = get_object_or_404(Student, user=request.user)
    courses = student.courses.all()
    serializer = CourseSerializer(courses,many=True,context={'request': request})
    return Response(serializer.data,status=status.HTTP_200_OK)

