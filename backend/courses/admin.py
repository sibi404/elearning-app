from django.contrib import admin
from . models import *

# Register your models here.

class CourseAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ("title",)}

class LessonAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug' : ("title","order")}

admin.site.register(Course,CourseAdmin)
admin.site.register(Lesson,LessonAdmin)