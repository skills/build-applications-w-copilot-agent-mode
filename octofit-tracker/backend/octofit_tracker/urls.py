"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
from django.urls import path
from .api_root import api_root

# Placeholder views for endpoints (to be replaced with real views)
from django.http import JsonResponse
def users_view(request):
    return JsonResponse({"message": "Users endpoint"})
def teams_view(request):
    return JsonResponse({"message": "Teams endpoint"})
def activities_view(request):
    return JsonResponse({"message": "Activities endpoint"})
def leaderboard_view(request):
    return JsonResponse({"message": "Leaderboard endpoint"})
def workouts_view(request):
    return JsonResponse({"message": "Workouts endpoint"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/users/', users_view, name='users'),
    path('api/teams/', teams_view, name='teams'),
    path('api/activities/', activities_view, name='activities'),
    path('api/leaderboard/', leaderboard_view, name='leaderboard'),
    path('api/workouts/', workouts_view, name='workouts'),
]
