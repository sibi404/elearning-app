from django.shortcuts import get_object_or_404,get_list_or_404

from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from . models import Lesson,LessonMaterials,LessonQuestion
from . serializers import LessonListSerializer,LessonSerializer,LessonMaterialSerializer,LessonQuestionSerializer

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons(request,course_id):
    lessons = Lesson.objects.filter(course=course_id)

    if not lessons.exists():
        return Response({"Message" : "No lesson found for this course"},status=status.HTTP_404_NOT_FOUND)
    serializer = LessonListSerializer(lessons,many=True)

    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_details(request,slug):
    lesson = get_object_or_404(Lesson,slug=slug)
    questions = LessonQuestion.objects.filter(lesson=lesson)
    try:
        serializer = LessonSerializer(lesson)
        question_serializer = LessonQuestionSerializer(questions,many=True)
    except Exception as e:
        return Response({"error" : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    print(question_serializer.data)
    return Response({'lessonDetails' : serializer.data,'lessonQuestions' : question_serializer.data},status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_materials(request,lesson_id):
    lesson = get_object_or_404(Lesson,id=lesson_id)
    materials = LessonMaterials.objects.filter(lesson=lesson)
    try:
        serializer = LessonMaterialSerializer(materials,many=True)
    except Exception as e:
        return Response({"error" : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response(serializer.data,status=status.HTTP_200_OK)
