from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta

from api.models import User, Activity, Team, TeamMember, Workout, WorkoutRecommendation, Leaderboard
from api.serializers import (
    UserSerializer, UserCreateSerializer, ActivitySerializer, TeamSerializer,
    WorkoutSerializer, WorkoutRecommendationSerializer, LeaderboardSerializer,
    TeamMemberSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role', 'fitness_level']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        user = self.get_object()
        activities = Activity.objects.filter(user=user)
        
        stats = {
            'total_activities': activities.count(),
            'total_calories_burned': activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            'total_distance_km': activities.aggregate(Sum('distance_km'))['distance_km__sum'] or 0,
            'current_streak': user.current_streak,
            'longest_streak': user.longest_streak,
            'teams_count': user.teams.count(),
        }
        return Response(stats)


class ActivityViewSet(viewsets.ModelViewSet):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['activity_type', 'intensity']
    ordering_fields = ['timestamp', 'calories_burned', 'duration_minutes']
    ordering = ['-timestamp']
    
    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        activities = Activity.objects.filter(user=request.user)
        
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        stats = {
            'all_time': {
                'total_activities': activities.count(),
                'total_calories': activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
                'total_distance': activities.aggregate(Sum('distance_km'))['distance_km__sum'] or 0,
            },
            'weekly': {
                'total_activities': activities.filter(timestamp__date__gte=week_ago).count(),
                'total_calories': activities.filter(timestamp__date__gte=week_ago).aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            },
            'monthly': {
                'total_activities': activities.filter(timestamp__date__gte=month_ago).count(),
                'total_calories': activities.filter(timestamp__date__gte=month_ago).aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
            }
        }
        return Response(stats)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['total_calories_burned', 'total_activities', 'created_at']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        team = serializer.save(owner=self.request.user)
        TeamMember.objects.create(team=team, user=self.request.user, role='owner')
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        team = self.get_object()
        if TeamMember.objects.filter(team=team, user=request.user).exists():
            return Response({'detail': 'Already a member'}, status=status.HTTP_400_BAD_REQUEST)
        
        TeamMember.objects.create(team=team, user=request.user, role='member')
        return Response({'detail': 'Joined team successfully'})
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        team = self.get_object()
        member = TeamMember.objects.filter(team=team, user=request.user).first()
        
        if not member:
            return Response({'detail': 'Not a member'}, status=status.HTTP_400_BAD_REQUEST)
        if member.role == 'owner':
            return Response({'detail': 'Owner cannot leave'}, status=status.HTTP_400_BAD_REQUEST)
        
        member.delete()
        return Response({'detail': 'Left team successfully'})
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        team = self.get_object()
        members = TeamMember.objects.filter(team=team)
        serializer = TeamMemberSerializer(members, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        team = self.get_object()
        members = team.members.all()
        activities = Activity.objects.filter(user__in=members)
        
        stats = {
            'total_members': members.count(),
            'total_activities': activities.count(),
            'total_calories_burned': activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
        }
        return Response(stats)


class WorkoutViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['difficulty_level']
    search_fields = ['name', 'description']


class WorkoutRecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutRecommendationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['completed']
    ordering_fields = ['recommended_date', 'created_at']
    ordering = ['-recommended_date']
    
    def get_queryset(self):
        return WorkoutRecommendation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        recommendation = self.get_object()
        recommendation.completed = True
        recommendation.completed_at = timezone.now()
        if 'feedback' in request.data:
            recommendation.feedback = request.data['feedback']
        recommendation.save()
        
        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)


class LeaderboardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['leaderboard_type', 'metric', 'period']
