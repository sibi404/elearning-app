from django.db import models
from django.utils import timezone


# Create your models here.
class Enrollment(models.Model):
    student = models.ForeignKey('authentication.Student',on_delete=models.CASCADE)
    course = models.ForeignKey('courses.Course',on_delete=models.CASCADE)
    enrolled_on = models.DateTimeField(default=timezone.now)
    progress = models.DecimalField(max_digits=5,decimal_places=2,default=0.0)
    completed = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student','course')
    
    def __str__(self):
        return f"{self.student.user.username} : {self.course.title} ({self.progress}%)"
