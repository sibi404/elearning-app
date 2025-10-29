from django.shortcuts import get_object_or_404
from django.http import FileResponse,Http404
from django.db import transaction

from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from . models import Lesson,LessonMaterials,LessonQuestion,StudentAnswer,QuestionOption,LessonProgress
from . serializers import LessonListSerializer,LessonSerializer,LessonMaterialSerializer,LessonQuestionSerializer,StudentAnswerSerializer
from enrollments.models import Enrollment

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lessons(request,course_id):
    lessons = Lesson.objects.filter(course=course_id)

    if not lessons.exists():
        return Response({"Message" : "No lesson found for this course"},status=status.HTTP_404_NOT_FOUND)
    serializer = LessonListSerializer(lessons,many=True,context={'request' : request})

    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_lesson_details(request,slug):
    lesson = get_object_or_404(Lesson,slug=slug)
    questions = LessonQuestion.objects.filter(lesson=lesson)
    try:
        serializer = LessonSerializer(lesson,context={'request': request})
        question_serializer = LessonQuestionSerializer(questions,many=True,context={'request': request})
    except Exception as e:
        return Response({"error" : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
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

def download_material(request,pk):
    try:
        material = LessonMaterials.objects.get(pk=pk)
        response = FileResponse(material.file.open('rb'),as_attachment=True,filename=material.title)
        return response
    except LessonMaterials.DoesNotExist:
        raise Http404("Material not found")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_lesson_progress(request,lesson_id):
    try:
        student = getattr(request.user,'student_profile',None)
        if not student:
            return Response(
                {"error" : "User is not a student"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        time_str = request.data.get('time')
        if time_str is None:
            return Response(
                {"error" : "Missing time in request body"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        percentage_str = request.data.get('percentage')
        if percentage_str is None:
            return Response(
                {'error' : 'Missing percentage in request body'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            time = float(time_str)
            percentage = float(percentage_str)
        except (TypeError,ValueError):
            return Response(
                {"error" : "time or percentage is not a valid number"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            progress,created = LessonProgress.objects.get_or_create(
                student = student,
                lesson_id = lesson_id,
                defaults = {'progress' : time,'percentage' : percentage}
            )

            if not created and time > progress.progress:
                progress.progress = time
                progress.percentage = percentage if percentage < 97 else 100.0
                progress.save(update_fields=['progress','percentage','completed'])

        return Response(
            {"message" : "Progress saved succesfully"},
            status=status.HTTP_200_OK
        )
    
    except Exception as e:
        return Response(
            {'error' : f"An unexpected error occured : {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_lesson(request,lesson_id):
    student = getattr(request.user,'student_profile',None)
    if not student:
        return Response({"error" : "User is not student"},status=status.HTTP_403_FORBIDDEN)
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"error" : "Lesson not found"},status=status.HTTP_404_NOT_FOUND)
    
    lesson_progress,created = LessonProgress.objects.get_or_create(student=student,lesson=lesson)

    lesson_progress.completed = True
    lesson_progress.save()

    course_progress = None
    if lesson_progress.completed:
        course_progress = Enrollment.objects.values_list('progress',flat=True).get(student=student,course=lesson.course)

    return Response({
        "completed" : lesson_progress.completed,
        "course_progress" : course_progress
    },status=status.HTTP_200_OK)