from django.db import models

# Create your models here.

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/',blank=True,null=True)
    duration = models.PositiveIntegerField(default=0)
    teacher = models.ForeignKey('authentication.Teacher',on_delete=models.CASCADE)

    def __str__(self):
        return self.title



class Lesson(models.Model):
    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name='lessons')
    title = models.CharField(max_length=100)
    video_id = models.CharField(max_length=20)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.course.title} - {self.title}"