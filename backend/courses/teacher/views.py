from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes

from courses.serializers import CourseAnnouncementSerializer,CourseProgressSerializer,CourseSerializer
from courses.models import Course

from django.db.models import Count,Avg


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_course_announcement(request):
    teacher = getattr(request.user,'teacher_profile',None)
    if not teacher:
        return Response({"error" : "User is not a teacher"},status=status.HTTP_403_FORBIDDEN)
    
    serilizer = CourseAnnouncementSerializer(data=request.data,context={'request':request})
    
    if serilizer.is_valid():
        serilizer.save(sender=request.user)
        return Response({"message" : "created"},status=status.HTTP_201_CREATED)
    
    return Response(serilizer.error,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def teaching_courses_names(request):
    teacher = getattr(request.user,'teacher_profile',None)
    if not teacher:
        return Response({"error" : "User is not a teacher"},status=status.HTTP_403_FORBIDDEN)
    try:
        courses = Course.objects.filter(teacher=teacher).values('id','title')
        return Response(list(courses),status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error" : f"an unexpected error occured : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def teaching_courses(request):
    teacher = getattr(request.user,'teacher_profile',None)
    if not teacher:
        return Response({"error":"User is not a teacher"},status=status.HTTP_403_FORBIDDEN)
    try:
        courses = Course.objects.filter(teacher=teacher).annotate(
            total_students = Count('students'),
            overall_progress = Avg('enrollment__progress')
        ).only('id','title','slug')
        fields_to_include = ('id','title','slug','overall_progress','total_students')
        serializer = CourseSerializer(courses,many=True,fields=fields_to_include)
        print(serializer.data)
        
        return Response(serializer.data,status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error" : f"an unexpected error occured : {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)