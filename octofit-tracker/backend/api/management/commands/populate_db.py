from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import User, Workout, Activity, Leaderboard
from datetime import timedelta
import random


class Command(BaseCommand):
    help = 'Populate database with initial data'
    
    def handle(self, *args, **options):
        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@octofit.com', 'admin123', role='admin')
            self.stdout.write(self.style.SUCCESS('Created admin user'))
        
        # Create sample users
        if User.objects.count() <= 1:
            users_data = [
                {'username': 'alice', 'email': 'alice@octofit.com', 'role': 'teacher', 'fitness_level': 'advanced'},
                {'username': 'bob', 'email': 'bob@octofit.com', 'role': 'student', 'fitness_level': 'intermediate'},
                {'username': 'charlie', 'email': 'charlie@octofit.com', 'role': 'student', 'fitness_level': 'beginner'},
                {'username': 'diana', 'email': 'diana@octofit.com', 'role': 'teacher', 'fitness_level': 'advanced'},
            ]
            
            for user_data in users_data:
                password = user_data['username'] + '123'
                user = User.objects.create_user(
                    username=user_data['username'],
                    email=user_data['email'],
                    password=password,
                    role=user_data['role'],
                    fitness_level=user_data['fitness_level'],
                    age=random.randint(20, 50),
                    goals=['fitness', 'health']
                )
                self.stdout.write(self.style.SUCCESS(f'Created user: {user_data["username"]}'))
        
        # Create sample workouts
        if Workout.objects.count() == 0:
            workouts_data = [
                {
                    'name': 'Morning Run',
                    'description': 'Light 5km running session',
                    'difficulty_level': 'beginner',
                    'estimated_calories': 300,
                    'exercises': [
                        {'name': 'Warm-up', 'duration_minutes': 5, 'intensity': 'low'},
                        {'name': 'Running', 'duration_minutes': 30, 'intensity': 'moderate'},
                        {'name': 'Cool-down', 'duration_minutes': 5, 'intensity': 'low'},
                    ]
                },
                {
                    'name': 'HIIT Workout',
                    'description': 'High Intensity Interval Training',
                    'difficulty_level': 'advanced',
                    'estimated_calories': 500,
                    'exercises': [
                        {'name': 'Burpees', 'duration_minutes': 1, 'reps': 10, 'intensity': 'high'},
                        {'name': 'Push-ups', 'duration_minutes': 1, 'reps': 20, 'intensity': 'high'},
                        {'name': 'Squats', 'duration_minutes': 1, 'reps': 30, 'intensity': 'high'},
                    ]
                },
                {
                    'name': 'Yoga Session',
                    'description': 'Relaxing yoga for flexibility',
                    'difficulty_level': 'beginner',
                    'estimated_calories': 150,
                    'exercises': [
                        {'name': 'Stretching', 'duration_minutes': 20, 'intensity': 'low'},
                        {'name': 'Breathing', 'duration_minutes': 10, 'intensity': 'low'},
                    ]
                },
            ]
            
            for workout_data in workouts_data:
                Workout.objects.create(**workout_data)
                self.stdout.write(self.style.SUCCESS(f'Created workout: {workout_data["name"]}'))
        
        # Create sample activities
        if Activity.objects.count() == 0:
            users = User.objects.filter(role='student')
            activity_types = ['running', 'cycling', 'gym', 'swimming', 'yoga']
            
            for user in users:
                for _ in range(5):
                    Activity.objects.create(
                        user=user,
                        activity_type=random.choice(activity_types),
                        duration_minutes=random.randint(20, 90),
                        calories_burned=random.uniform(150, 500),
                        distance_km=random.uniform(2, 15),
                        intensity=random.choice(['low', 'moderate', 'high']),
                        timestamp=timezone.now() - timedelta(days=random.randint(1, 30))
                    )
                self.stdout.write(self.style.SUCCESS(f'Created activities for {user.username}'))
        
        self.stdout.write(self.style.SUCCESS('Database populated successfully'))
