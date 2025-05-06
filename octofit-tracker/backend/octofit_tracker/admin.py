from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email")


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("user", "activity_type", "duration")


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ("user", "score")


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
