from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny

from . models import Lesson,LessonMaterials,LessonQuestion,StudentAnswer,QuestionOption
from authentication.models import Student
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
        question_serializer = LessonQuestionSerializer(questions,many=True,context={'request': request})
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_answer(request):
    print(request.data)
    question = get_object_or_404(LessonQuestion,id=request.data.get('questionId'))
    option = get_object_or_404(QuestionOption,question=question,option_text=request.data.get('option'))
    is_correct_value = option.is_correct
    answer, created = StudentAnswer.objects.update_or_create(
        student=request.user.student_profile,
        question=question,
        defaults={
            'selected_option': option,
            'is_correct': is_correct_value,
        }
    )
    return Response({"Message" : "Success","is_correct" : answer.is_correct},status=status.HTTP_201_CREATED)

