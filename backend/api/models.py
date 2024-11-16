from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Project(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE,null=True,related_name="projects")

    def __str__(self):
        return self.title
    
    def get_todos_stats(self):
        completed_count = self.todos.filter(is_completed=True).count()
        total_count = self.todos.count()
        return {
            'completed': completed_count,
            'pending': total_count - completed_count,
            'total': total_count
        }

class Todo(models.Model):
    project = models.ForeignKey(Project, related_name='todos', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
