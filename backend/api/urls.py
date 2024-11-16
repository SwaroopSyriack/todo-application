from django.urls import path
from . import views

urlpatterns = [
    path("projects/",views.ProjectViewSet.as_view(),name="projects"),
    path("todo/",views.TodoViewSet.as_view(),name="todo"),
]   