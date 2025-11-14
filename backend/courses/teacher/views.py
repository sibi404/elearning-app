from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view,permission_classes

from courses.serializers import CourseAnnouncementSerializer,CourseSerializer,AssignmentListSerializer,AssignmentSubmissionSerializer,GradeSubmissionSerializer
from courses.models import Course,AssignmentSubmission,LessonAssignment
from courses.permissions import IsTeacher

from enrollments.models import Enrollment

from django.db.models import Count,Avg,Q
from django.shortcuts import get_object_or_404

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


@api_view(['GET'])
@permission_classes([IsTeacher])
def course_details(request,course_slug):
    try:
        course = Course.objects.annotate(
            overall_progress = Avg('enrollment__progress'),
            total_lessons = Count('lessons',distinct=True),

        ).get(slug=course_slug)

        fields_to_include = ('id','title','overall_progress','total_students','total_lessons')

        serializer = CourseSerializer(course,fields=fields_to_include)

        return Response(serializer.data,status=status.HTTP_200_OK)
    except Course.DoesNotExist:
        return Response({"error" : "Course not found"},status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error" : f"an unexpected error occured : {str(e)}"},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_students_overview(request, slug):
    try:
        course = Course.objects.get(slug=slug)
    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

    total_assignments = LessonAssignment.objects.filter(lesson__course=course).count()

    enrollments = Enrollment.objects.filter(course=course).select_related('student__user')

    students_data = []
    for enrollment in enrollments:
        student = enrollment.student
        submitted_count = AssignmentSubmission.objects.filter(
            assignment__lesson__course=course,
            student=student
        ).count()

        students_data.append({
            "student_id": student.user.id,
            "name": student.user.get_full_name() or student.user.username,
            "email":student.user.email,
            "progress": float(enrollment.progress),
            "assignments_submitted": submitted_count,
            "total_assignments": total_assignments
        })

    return Response(students_data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsTeacher])
def course_assignments(request,course_slug):
    assignments = LessonAssignment.objects.filter(lesson__course__slug=course_slug).annotate(
        total_submissions = Count('submissions'),
        graded_count = Count('submissions',filter=Q(submissions__is_graded=True)),
        pending_count = Count('submissions',filter=Q(submissions__is_graded=False)),
    )

    serializer = AssignmentListSerializer(assignments,many=True)
    return Response(serializer.data,status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsTeacher])
def assignment_submissions(request,assignment_slug):
    assignment = get_object_or_404(LessonAssignment,slug=assignment_slug)

    submissions = AssignmentSubmission.objects.select_related(
        "student","student__user"
    ).filter(assignment=assignment)

    serializer = AssignmentSubmissionSerializer(submissions,many=True)

    return Response(serializer.data,status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsTeacher])
def grade_submission(request,submission_id):
    try:
        submission = AssignmentSubmission.objects.get(id=submission_id)
    except AssignmentSubmission.DoesNotExist:
        return Response({"error" : "Submission not found"},status=status.HTTP_404_NOT_FOUND)
    
    serializer = GradeSubmissionSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    grade = serializer.validated_data["grade"]
    feedback = serializer.validated_data.get("feedback","")

    submission.grade_submission(grade=grade,feedback=feedback)

    updated_data = AssignmentSubmissionSerializer(submission).data

    return Response(updated_data,status=status.HTTP_200_OK)
    
