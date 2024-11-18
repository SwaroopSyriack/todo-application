from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import Project,Todo

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ['id', 'project', 'title', 'description', 'is_completed', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, read_only=True)
    todos_stats = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'created_at', 'updated_at','todos', 'todos_stats']
        extra_kwargs = {"author": {"read_only": True}}
    
    def get_todos_stats(self, obj):
        return obj.get_todos_stats()
    
    

