from rest_framework import permissions

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user,'teacher_profile')

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return hasattr(request.user,'student_profile')