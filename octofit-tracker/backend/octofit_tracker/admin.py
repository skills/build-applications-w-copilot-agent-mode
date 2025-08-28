from django.contrib import admin
from .models import User, Team, Activity, Workout, Leaderboard

admin.site.register(User)
admin.site.register(Team)
admin.site.register(Activity)
admin.site.register(Workout)
admin.site.register(Leaderboard)
