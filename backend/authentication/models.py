from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from phonenumber_field.modelfields import PhoneNumberField

from enrollments.models import Enrollment

# Create your models here.

class UserRole(models.TextChoices):
    STUDENT = 'STUDENT','Student'
    TEACHER = 'TEACHER', 'Teacher'
    MANAGEMENT = 'MANAGEMENT', 'Management'


class UsersProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='profile')
    phone_number = PhoneNumberField(blank=True)
    date_joined = models.DateField(default=timezone.now)
    role = models.CharField(
        max_length=30,
        choices=UserRole.choices
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Student(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE, primary_key=True, related_name='student_profile')
    date_of_birth = models.DateField(null=True,blank=True)
    courses = models.ManyToManyField('courses.Course',through=Enrollment,related_name='students')

    def __str__(self):
        return self.user.username


class Teacher(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True, related_name='teacher_profile')

    def __str__(self):
        return self.user.get_full_name() or self.user.first_name

class Management(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,primary_key=True,related_name='management_profile')

    def __str__(self):
        return self.user.first_name