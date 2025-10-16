from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . models import Lesson
from . serializers import LessonListSerializer

# Create your views here.

@api_view(['GET'])
def get_lessons(request,course_id):
    lessons = Lesson.objects.filter(course=course_id)

    if not lessons.exists():
        return Response({"Message" : "No lesson found for this course"},status=status.HTTP_404_NOT_FOUND)
    serializer = LessonListSerializer(lessons,many=True)
    
    return Response(serializer.data,status=status.HTTP_200_OK)
