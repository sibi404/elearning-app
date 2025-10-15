from rest_framework import serializers

from . models import Enrollment
from courses.serializers import CourseSerializer

class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer()
    class Meta:
        model = Enrollment
        fields = ['course','progress','completed','enrolled_on']
    
    def validate_progress(self,value):
        if value < 0:
            value = 0
        elif value > 100:
            value = 100
        return value
    
    def validate(self, attrs):
        if attrs.get('completed') and attrs.get('progress', self.instance.progress if self.instance else 0) < 90:
            raise serializers.ValidationError("Cannot mark as complete unless progress is 100.")
        return attrs