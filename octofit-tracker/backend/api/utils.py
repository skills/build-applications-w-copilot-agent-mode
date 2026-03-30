from django.utils import timezone
from django.db.models import Sum, Count, Q
from datetime import timedelta
from api.models import Leaderboard, Activity, Team, TeamMember, User


def generate_individual_leaderboard(metric='calories', period='weekly'):
    """Generate individual leaderboard entries"""
    now = timezone.now()
    
    if period == 'weekly':
        start_date = now - timedelta(days=7)
    elif period == 'monthly':
        start_date = now - timedelta(days=30)
    else:  # all_time
        start_date = None
    
    entries = []
    
    if metric == 'calories':
        if start_date:
            activities = Activity.objects.filter(timestamp__gte=start_date).values('user__id', 'user__username').annotate(total=Sum('calories_burned')).order_by('-total')
        else:
            activities = Activity.objects.values('user__id', 'user__username').annotate(total=Sum('calories_burned')).order_by('-total')
        
        for rank, activity in enumerate(activities[:100], 1):
            entries.append({
                'rank': rank,
                'entity_id': activity['user__id'],
                'entity_name': activity['user__username'],
                'score': float(activity['total'] or 0)
            })
    
    elif metric == 'activities':
        if start_date:
            activities = Activity.objects.filter(timestamp__gte=start_date).values('user__id', 'user__username').annotate(count=Count('id')).order_by('-count')
        else:
            activities = Activity.objects.values('user__id', 'user__username').annotate(count=Count('id')).order_by('-count')
        
        for rank, activity in enumerate(activities[:100], 1):
            entries.append({
                'rank': rank,
                'entity_id': activity['user__id'],
                'entity_name': activity['user__username'],
                'score': activity['count']
            })
    
    elif metric == 'consistency':
        users = User.objects.filter(role__in=['student', 'teacher']).annotate(streak=Count('current_streak')).order_by('-current_streak')
        for rank, user in enumerate(users[:100], 1):
            entries.append({
                'rank': rank,
                'entity_id': user.id,
                'entity_name': user.username,
                'score': float(user.current_streak)
            })
    
    leaderboard, created = Leaderboard.objects.update_or_create(
        leaderboard_type='individual',
        metric=metric,
        period=period,
        defaults={'entries': entries}
    )
    
    return leaderboard


def generate_team_leaderboard(metric='calories', period='weekly'):
    """Generate team leaderboard entries"""
    now = timezone.now()
    
    if period == 'weekly':
        start_date = now - timedelta(days=7)
    elif period == 'monthly':
        start_date = now - timedelta(days=30)
    else:  # all_time
        start_date = None
    
    entries = []
    teams = Team.objects.all()
    
    if metric == 'calories':
        for team in teams:
            members = team.members.all()
            if start_date:
                total = Activity.objects.filter(user__in=members, timestamp__gte=start_date).aggregate(Sum('calories_burned'))
            else:
                total = Activity.objects.filter(user__in=members).aggregate(Sum('calories_burned'))
            
            entries.append({
                'entity_id': team.id,
                'entity_name': team.name,
                'score': float(total['calories_burned__sum'] or 0)
            })
    
    elif metric == 'activities':
        for team in teams:
            members = team.members.all()
            if start_date:
                count = Activity.objects.filter(user__in=members, timestamp__gte=start_date).count()
            else:
                count = Activity.objects.filter(user__in=members).count()
            
            entries.append({
                'entity_id': team.id,
                'entity_name': team.name,
                'score': count
            })
    
    entries.sort(key=lambda x: x['score'], reverse=True)
    for rank, entry in enumerate(entries, 1):
        entry['rank'] = rank
    
    leaderboard, created = Leaderboard.objects.update_or_create(
        leaderboard_type='team',
        metric=metric,
        period=period,
        defaults={'entries': entries}
    )
    
    return leaderboard


def calculate_recommendations(user):
    """Calculate personalized workout recommendations"""
    from api.models import Workout, WorkoutRecommendation
    
    user_activities = Activity.objects.filter(user=user)
    user_workouts = WorkoutRecommendation.objects.filter(user=user, completed=True).values_list('workout_id', flat=True)
    
    recommended_workouts = []
    
    # Recommend based on fitness level
    difficulty = user.fitness_level
    available_workouts = Workout.objects.filter(difficulty_level=difficulty).exclude(id__in=user_workouts)[:5]
    
    for workout in available_workouts:
        reason = f"Recommended based on your {difficulty} fitness level"
        recommended_workouts.append({
            'workout': workout,
            'reason': reason
        })
    
    # Create recommendations
    for item in recommended_workouts:
        WorkoutRecommendation.objects.get_or_create(
            user=user,
            workout=item['workout'],
            defaults={
                'reason': item['reason'],
                'recommended_date': timezone.now()
            }
        )
    
    return recommended_workouts
