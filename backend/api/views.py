from django.contrib.auth.models import User
from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from api.serializers import RegisterSerializer, ProjectSerializer, TodoSerializer
from api.models import Project, Todo
from django.http import JsonResponse
from api.utils import export_summary_to_gist


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(author=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['get'])
    def todos(self, request, pk=None):
        """
        Get all todos for a specific project
        """
        project = self.get_object()
        todos = project.todos.all()
        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        Get todo statistics for a specific project
        """
        project = self.get_object()
        return Response(project.get_todos_stats())
    

class TodoViewSet(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Todo.objects.all()
        project_id = self.request.query_params.get('project')
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        return queryset.filter(project__author=self.request.user)

    def create(self, request, *args, **kwargs):
        project_id = request.data.get('project')
        if not project_id:
            return Response(
                {'error': 'Project ID is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project = get_object_or_404(Project, id=project_id)
        
        # Verify user has permission to add todos to this project
        if project.author != request.user:
            return Response(
                {'error': 'You do not have permission to add todos to this project'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=['patch'])
    def toggle_complete(self, request, pk=None):
        """
        Toggle the completion status of a todo
        """
        todo = self.get_object()
        todo.is_completed = not todo.is_completed
        todo.save()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)

def gist_export(request, project_id):
    if request.method == "GET":
        gist_url = export_summary_to_gist(project_id)
        if "Gist created successfully" in gist_url:
            return JsonResponse({"success": True, "url": gist_url.split(": ")[1]})
        else:
            return JsonResponse({"success": False, "error": gist_url})
    return JsonResponse({"success": False, "error": "Invalid request method."})
    
