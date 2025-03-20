from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId
from datetime import timedelta

class Command(BaseCommand):
    help = 'Populate the database with test data for users, teams, activities, leaderboard, and workouts'

    def handle(self, *args, **kwargs):
        # Clear existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create users
        users = [
            User(_id=ObjectId(), username='user1', email='user1@example.com', password='password1'),
            User(_id=ObjectId(), username='user2', email='user2@example.com', password='password2'),
            User(_id=ObjectId(), username='user3', email='user3@example.com', password='password3'),
        ]
        User.objects.bulk_create(users)

        # Create teams
        team1 = Team(_id=ObjectId(), name='Team A')
        team1.save()
        team1.members.add(users[0], users[1])

        team2 = Team(_id=ObjectId(), name='Team B')
        team2.save()
        team2.members.add(users[2])

        # Create activities
        activities = [
            Activity(_id=ObjectId(), user=users[0], activity_type='Running', duration=timedelta(minutes=30)),
            Activity(_id=ObjectId(), user=users[1], activity_type='Cycling', duration=timedelta(minutes=45)),
            Activity(_id=ObjectId(), user=users[2], activity_type='Swimming', duration=timedelta(minutes=60)),
        ]
        Activity.objects.bulk_create(activities)

        # Create leaderboard entries
        leaderboard_entries = [
            Leaderboard(_id=ObjectId(), user=users[0], score=100),
            Leaderboard(_id=ObjectId(), user=users[1], score=90),
            Leaderboard(_id=ObjectId(), user=users[2], score=80),
        ]
        Leaderboard.objects.bulk_create(leaderboard_entries)

        # Create workouts
        workouts = [
            Workout(_id=ObjectId(), name='Workout A', description='Description A'),
            Workout(_id=ObjectId(), name='Workout B', description='Description B'),
            Workout(_id=ObjectId(), name='Workout C', description='Description C'),
        ]
        Workout.objects.bulk_create(workouts)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with test data.'))