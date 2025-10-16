from rest_framework import serializers
from . models import Course,Lesson


class CourseSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()
    thumbnail = serializers.ImageField(read_only=True)
    total_students = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'thumbnail', 'duration', 'teacher', 'total_students','slug']
    
    def get_total_students(self,obj):
        return obj.students.count()
    
 
class LessonListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id','title','completed','slug']