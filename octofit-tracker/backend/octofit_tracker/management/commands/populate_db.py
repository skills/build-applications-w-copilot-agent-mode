from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data.'

    def handle(self, *args, **kwargs):
        # Users
        user1 = User.objects.create(email='alice@example.com', name='Alice', password='alicepass')
        user2 = User.objects.create(email='bob@example.com', name='Bob', password='bobpass')
        user3 = User.objects.create(email='carol@example.com', name='Carol', password='carolpass')

        # Teams
        team1 = Team.objects.create(name='Team Alpha')
        team2 = Team.objects.create(name='Team Beta')
        team1.members.add(user1, user2)
        team2.members.add(user3)

        # Activities
        Activity.objects.create(user=user1, activity_type='Running', duration=30, date=datetime(2025, 6, 1, 8, 0))
        Activity.objects.create(user=user2, activity_type='Cycling', duration=45, date=datetime(2025, 6, 2, 9, 0))
        Activity.objects.create(user=user3, activity_type='Swimming', duration=60, date=datetime(2025, 6, 3, 10, 0))

        # Leaderboard
        Leaderboard.objects.create(team=team1, points=150)
        Leaderboard.objects.create(team=team2, points=100)

        # Workouts
        Workout.objects.create(name='Pushups', description='Do 20 pushups', duration=10)
        Workout.objects.create(name='Situps', description='Do 30 situps', duration=15)
        Workout.objects.create(name='Squats', description='Do 40 squats', duration=20)

        self.stdout.write(self.style.SUCCESS('Test data populated successfully.'))
