from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,AllowAny

from . models import Lesson,LessonMaterials,LessonQuestion,StudentAnswer,QuestionOption
from authentication.models import Student
from . serializers import LessonListSerializer,LessonSerializer,LessonMaterialSerializer,LessonQuestionSerializer,StudentAnswerSerializer

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
    serializer = StudentAnswerSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    validated_data = serializer.validated_data
    question_id = validated_data['questionId']
    option_id = validated_data['optionId']

    try:
        option = QuestionOption.objects.select_related('question').get(
            id = option_id,
            question_id = question_id
        )
    except QuestionOption.DoesNotExist:
        return Response(
            {"details" : "Question or Option not found, or Option does not belong to Question."},
            status=status.HTTP_404_NOT_FOUND)
    
    is_correct_value = option.is_correct
    answer, created = StudentAnswer.objects.update_or_create(
        student=request.user.student_profile,
        question=option.question,
        defaults={
            'selected_option': option,
            'is_correct': is_correct_value,
        }
    )
    return Response({"Message" : "Success","is_correct" : answer.is_correct},status=status.HTTP_201_CREATED)

