from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from django.utils import timezone

# Create your models here.

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(upload_to='course_thumbnails/',blank=True,null=True)
    duration = models.PositiveIntegerField(default=0)
    teacher = models.ForeignKey('authentication.Teacher',on_delete=models.CASCADE)
    slug = models.SlugField(default="",null=False,unique=True)
    active = models.BooleanField(default=True)

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
    order = models.PositiveIntegerField(default=1)
    about = models.TextField(null=True)
    slug = models.SlugField(default="",null=False,unique=True)

    class Meta:
        ordering = ['order']
        unique_together = ('course','order')
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.order}")

        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.course.title} - {self.title} : {self.order}"
    
class LessonProgress(models.Model):
    student = models.ForeignKey('authentication.Student',on_delete=models.CASCADE,related_name='lesson_progress')
    lesson = models.ForeignKey('courses.Lesson',on_delete=models.CASCADE,related_name='progress_records')
    progress = models.DecimalField(max_digits=6,decimal_places=1,default=0.0)
    percentage = models.DecimalField(max_digits=4,decimal_places=1,default=0.0)
    completed = models.BooleanField(default=False)
    last_watched = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student','lesson')

    
    def clean(self):
        if self.completed and self.percentage < 90:
            raise ValidationError("Cannot mark as complete unless progress is 90 or above.")


    def save(self, *args, **kwargs):
        if self.percentage >= 90:
            self.completed = True
        else:
            self.completed = False
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.student.user.username} - {self.lesson.title} : {self.progress}s , {self.percentage}%"
    

class LessonMaterials(models.Model):
    MATERIAL_TYPE_CHOICES = [
        ('pdf','PDF'),
        ('doc','DOC'),
        ('ppt','PPT'),
    ]

    lesson = models.ForeignKey(Lesson,on_delete=models.CASCADE,related_name='materials')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='lesson_materials/')
    material_type = models.CharField(max_length=10,choices=MATERIAL_TYPE_CHOICES,default='pdf')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"

class LessonQuestion(models.Model):
    lesson = models.ForeignKey('Lesson', on_delete=models.CASCADE, related_name='questions')
    timestamp = models.PositiveIntegerField(
        help_text="Time in seconds when this question should appear in the video"
    )
    question_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lesson.title} - Question at {self.timestamp}s"


class QuestionOption(models.Model):
    question = models.ForeignKey(LessonQuestion, on_delete=models.CASCADE, related_name='options')
    option_text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.question.lesson.title} - Option: {self.option_text}"


class StudentAnswer(models.Model):
    student = models.ForeignKey('authentication.Student', on_delete=models.CASCADE)
    question = models.ForeignKey(LessonQuestion, on_delete=models.CASCADE)
    selected_option = models.ForeignKey(QuestionOption, on_delete=models.CASCADE)
    answered_at = models.DateTimeField(auto_now_add=True)
    is_correct = models.BooleanField(editable=False)

    def save(self, *args, **kwargs):
        self.is_correct = self.selected_option.is_correct
    
        super().save(*args, **kwargs)


    class Meta:
        unique_together = ('student', 'question')

    def __str__(self):
        return f"{self.student} - {self.question} - Correct: {self.is_correct}"
    

class LessonAssignment(models.Model):
    lesson = models.ForeignKey('Lesson',on_delete=models.CASCADE,related_name='assignments')
    title = models.CharField(max_length=225)
    description = models.TextField(blank=True,null=True)
    file = models.FileField(upload_to='assignment_files/',blank=True,null=True)
    due_date = models.DateTimeField(blank=True,null=True)
    created_at = models.DateTimeField( auto_now_add=True)
    slug = models.SlugField(default="",null=False,unique=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1

            # Ensure slug uniqueness
            while LessonAssignment.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.lesson.title} - {self.title}"


class AssignmentSubmission(models.Model):
    GRADE_CHOICES = [
        ('A+', 'A+'),
        ('A', 'A'),
        ('B+', 'B+'),
        ('B', 'B'),
        ('C+', 'C+'),
        ('C', 'C'),
        ('D', 'D'),
        ('F', 'F'),
    ]
    assignment = models.ForeignKey('LessonAssignment', on_delete=models.CASCADE, related_name='submissions')
    student = models.ForeignKey('authentication.Student', on_delete=models.CASCADE, related_name='assignment_submissions')
    file = models.FileField(upload_to='student_submissions/')
    submitted_at = models.DateTimeField(auto_now_add=True)
    grade = models.CharField(max_length=2,null=True,blank=True,choices=GRADE_CHOICES)
    feedback = models.TextField(blank=True, null=True)
    graded_at = models.DateTimeField(blank=True, null=True)
    is_graded = models.BooleanField(default=False)

    class Meta:
        unique_together = ('assignment', 'student')
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.assignment.title} - {self.student.user.username}"

    def grade_submission(self, grade, feedback=None):
        self.grade = grade
        self.feedback = feedback
        self.is_graded = True
        self.graded_at = timezone.now()
        self.save()


class CourseAnnouncement(models.Model):
    course = models.ForeignKey('Course',on_delete=models.CASCADE,related_name='announcements')
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='sent_announcements')
    title = models.CharField(max_length=225)
    content = models.TextField()
    published_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def __str__(self):
        return f"{self.course} - {self.title}"