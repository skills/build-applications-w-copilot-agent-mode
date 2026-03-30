"""octofit_config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
"""
import os
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def api_root(request):
    return Response({
        'users': request.build_absolute_uri('/api/users/'),
        'activities': request.build_absolute_uri('/api/activities/'),
        'teams': request.build_absolute_uri('/api/teams/'),
        'workouts': request.build_absolute_uri('/api/workouts/'),
        'recommendations': request.build_absolute_uri('/api/recommendations/'),
        'leaderboards': request.build_absolute_uri('/api/leaderboards/'),
    })

codespace_name = os.environ.get('CODESPACE_NAME')
if codespace_name:
    base_url = f"https://{codespace_name}-8000.app.github.dev"
else:
    base_url = "http://localhost:8000"

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path('dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
]
