from rest_framework import serializers
from . models import Course


class CourseSerializer(serializers.ModelSerializer):
    teacher = serializers.StringRelatedField()
    thumbnail = serializers.ImageField(read_only=True)
    class Meta:
        model = Course
        fields = '__all__'