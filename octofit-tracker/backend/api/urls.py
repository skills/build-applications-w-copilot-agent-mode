from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    UserViewSet, ActivityViewSet, TeamViewSet, WorkoutViewSet,
    WorkoutRecommendationViewSet, LeaderboardViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'teams', TeamViewSet, basename='team')
router.register(r'workouts', WorkoutViewSet, basename='workout')
router.register(r'recommendations', WorkoutRecommendationViewSet, basename='recommendation')
router.register(r'leaderboards', LeaderboardViewSet, basename='leaderboard')

urlpatterns = [
    path('', include(router.urls)),
]
