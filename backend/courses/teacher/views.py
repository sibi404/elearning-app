from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes

from courses.serializers import CourseAnnouncementSerializer,CourseSerializer
from courses.models import Course
from courses.permissions import IsTeacher

from django.db.models import Count,Avg

@api_view(['GET'])
@permission_classes([IsAuthenticated,IsTeacher])
def get_insight_data(request):
    teacher = request.user.teacher_profile
    print("COUNT : ",teacher.total_students)
    return Response({"total_students" : teacher.total_students,"total_lessons" : teacher.total_lessons},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated,IsTeacher])
def add_course_announcement(request):
    teacher = request.user.teacher_profile
    
    serilizer = CourseAnnouncementSerializer(data=request.data,context={'request':request})
    
    if serilizer.is_valid():
        serilizer.save(sender=request.user)
        return Response({"message" : "created"},status=status.HTTP_201_CREATED)
    
    return Response(serilizer.error,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsTeacher])
def teaching_courses_names(request):
    teacher = request.user.teacher_profile
    try:
        courses = Course.objects.filter(teacher=teacher).values('id','title')
        return Response(list(courses),status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error" : f"an unexpected error occured : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsTeacher])
def teaching_courses(request):
    teacher = request.user.teacher_profile
    try:
        courses = Course.objects.filter(teacher=teacher).annotate(
            total_students = Count('students'),
            overall_progress = Avg('enrollment__progress')
        ).only('id','title','slug')
        fields_to_include = ('id','title','slug','overall_progress','total_students')
        serializer = CourseSerializer(courses,many=True,fields=fields_to_include)
        
        return Response(serializer.data,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error" : f"an unexpected error occured : {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsTeacher])
def course_list(request):
    teacher = request.user.teacher_profile
    try:
        courses = Course.objects.filter(teacher=teacher).annotate(
            total_students = Count('students'),
            overall_progress = Avg('enrollment__progress'),
            total_lessons = Count('lessons',distinct=True),
            total_materials = Count('lessons__materials',distinct=True)
        ).only('id','title','slug')

        fields_to_include = ('id','title','slug','overall_progress','total_students','total_lessons','total_materials')

        serialzer = CourseSerializer(courses,many=True,fields=fields_to_include)
        
        return Response(serialzer.data,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error" : f"an unexpected error occured : {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)