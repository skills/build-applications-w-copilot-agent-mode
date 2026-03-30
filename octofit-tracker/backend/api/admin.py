from django.contrib import admin
from api.models import User, Activity, Team, TeamMember, Workout, WorkoutRecommendation, Leaderboard


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'fitness_level', 'created_at')
    list_filter = ('role', 'fitness_level', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'duration_minutes', 'calories_burned', 'timestamp')
    list_filter = ('activity_type', 'intensity', 'timestamp')
    search_fields = ('user__username', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'total_members', 'total_calories_burned', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name', 'description', 'owner__username')
    readonly_fields = ('created_at', 'updated_at')
    
    def total_members(self, obj):
        return obj.members.count()


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'team', 'role', 'joined_at')
    list_filter = ('role', 'joined_at')
    search_fields = ('user__username', 'team__name')


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'difficulty_level', 'estimated_calories', 'created_at')
    list_filter = ('difficulty_level', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(WorkoutRecommendation)
class WorkoutRecommendationAdmin(admin.ModelAdmin):
    list_display = ('user', 'workout', 'recommended_date', 'completed', 'created_at')
    list_filter = ('completed', 'recommended_date', 'created_at')
    search_fields = ('user__username', 'workout__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('leaderboard_type', 'metric', 'period', 'updated_at')
    list_filter = ('leaderboard_type', 'metric', 'period')
    readonly_fields = ('generated_at', 'updated_at')
