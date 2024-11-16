"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from api.views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework.routers import DefaultRouter
from api.views import ProjectViewSet,TodoViewSet


router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'todo', TodoViewSet, basename='todo')

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/",RegisterView.as_view(),name='register'),
    path("api/token",TokenObtainPairView.as_view(),name="get_token"),
    path("api/token/refresh/",TokenRefreshView.as_view(),name="refresh"),
    path("api-auth/",include("rest_framework.urls")),
    path('api/', include(router.urls)),
]
