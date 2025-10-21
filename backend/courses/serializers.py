from rest_framework import serializers
from . models import Course,Lesson,LessonMaterials,LessonQuestion,QuestionOption,StudentAnswer


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


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class LessonMaterialSerializer(serializers.ModelSerializer):
    size = serializers.SerializerMethodField()

    class Meta:
        model = LessonMaterials
        fields = ['id','title','material_type','size']
    
    def get_size(self,obj):
        if obj.file:
            return obj.file.size
        return 0
    
class QuestionOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionOption
        fields = ['option_text']

class LessonQuestionSerializer(serializers.ModelSerializer):
    options = QuestionOptionSerializer(many=True,read_only=True)
    
    class Meta:
        model = LessonQuestion
        fields = ['timestamp','question_text','options','id']

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        request = self.context.get('request')
        student = request.user.student_profile
        answered = False
        if student:
            answered = StudentAnswer.objects.filter(student=student,question=instance,is_correct=True).exists()
            
        return {
            "time": rep["timestamp"],
            "id" : rep["id"],
            "question": rep["question_text"],
            "options": [opt["option_text"] for opt in rep["options"]],
            "answer": instance.options.filter(is_correct=True).first().option_text if instance.options.filter(is_correct=True).exists() else None,
            "answered": answered
        }