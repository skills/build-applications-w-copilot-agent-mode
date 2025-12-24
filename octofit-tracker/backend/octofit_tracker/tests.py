from django.test import TestCase
from .models import User, Team, Activity, Leaderboard, Workout

class ModelSmokeTest(TestCase):
    def test_user_creation(self):
        user = User.objects.create(email='test@example.com', name='Test User', team='Marvel')
        self.assertEqual(user.email, 'test@example.com')
    def test_team_creation(self):
        team = Team.objects.create(name='Marvel', description='Superhero team')
        self.assertEqual(team.name, 'Marvel')
    def test_activity_creation(self):
        activity = Activity.objects.create(user='test@example.com', activity_type='run', duration=30, date='2025-01-01')
        self.assertEqual(activity.activity_type, 'run')
    def test_leaderboard_creation(self):
        lb = Leaderboard.objects.create(user='test@example.com', points=100, rank=1)
        self.assertEqual(lb.rank, 1)
    def test_workout_creation(self):
        workout = Workout.objects.create(name='Pushups', description='Upper body', difficulty='Easy')
        self.assertEqual(workout.name, 'Pushups')
