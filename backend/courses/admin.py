from django.contrib import admin
from . import models

# Register your models here.

class CourseAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ("title",)}

class LessonAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug' : ("title","order")}

admin.site.register(models.Course,CourseAdmin)
admin.site.register(models.Lesson,LessonAdmin)
admin.site.register(models.LessonMaterials)
admin.site.register(models.StudentAnswer)
admin.site.register(models.LessonQuestion)
admin.site.register(models.QuestionOption)
admin.site.register(models.LessonProgress)