# Octofit API endpoints for Codespaces compatibility
from django.http import JsonResponse
from django.conf import settings
import os

def api_root(request):
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        api_base = f"https://{codespace_name}-8000.app.github.dev"
    else:
        api_base = "http://localhost:8000"
    return JsonResponse({
        "users": f"{api_base}/api/users/",
        "teams": f"{api_base}/api/teams/",
        "activities": f"{api_base}/api/activities/",
        "leaderboard": f"{api_base}/api/leaderboard/",
        "workouts": f"{api_base}/api/workouts/",
    })
