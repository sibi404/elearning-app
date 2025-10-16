from django.db import models
from django.core.exceptions import ValidationError
from django.utils.text import slugify

# Create your models here.

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/',blank=True,null=True)
    duration = models.PositiveIntegerField(default=0)
    teacher = models.ForeignKey('authentication.Teacher',on_delete=models.CASCADE)
    slug = models.SlugField(default="",null=False,unique=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}")

        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title



class Lesson(models.Model):
    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name='lessons')
    title = models.CharField(max_length=100)
    video_id = models.CharField(max_length=20)
    order = models.PositiveIntegerField(default=0)
    about = models.TextField(null=True)
    progress = models.DecimalField(max_digits=5,decimal_places=1,default=0.0)
    completed = models.BooleanField(default=False)
    slug = models.SlugField(default="",null=False,unique=True)

    class Meta:
        ordering = ['order']

    def clean(self):
        if self.completed and self.progress < 90:
            raise ValidationError("Cannot mark as complete unless progress is 90 or above.")
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.order}")

        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.course.title} - {self.title} : {self.order}"