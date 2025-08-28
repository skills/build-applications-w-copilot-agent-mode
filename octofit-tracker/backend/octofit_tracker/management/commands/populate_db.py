
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from octofit_tracker import models as octo_models
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Drop collections directly to avoid PK issues for all models
        # Drop collections directly using pymongo
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']
        db['users'].drop()
        db['team'].drop()
        db['activity'].drop()
        db['leaderboard'].drop()
        db['workout'].drop()

        # Create Teams
        marvel = octo_models.Team.objects.create(name='Marvel')
        dc = octo_models.Team.objects.create(name='DC')

        # Create Users (Superheroes)
        users = [
            User.objects.create_user(username='ironman', email='ironman@marvel.com', password='password', team=marvel),
            User.objects.create_user(username='captainamerica', email='cap@marvel.com', password='password', team=marvel),
            User.objects.create_user(username='batman', email='batman@dc.com', password='password', team=dc),
            User.objects.create_user(username='superman', email='superman@dc.com', password='password', team=dc),
        ]

        # Create Activities
        activities = [
            octo_models.Activity.objects.create(user=users[0], type='Run', duration=30, calories=300),
            octo_models.Activity.objects.create(user=users[1], type='Swim', duration=45, calories=400),
            octo_models.Activity.objects.create(user=users[2], type='Bike', duration=60, calories=500),
            octo_models.Activity.objects.create(user=users[3], type='Yoga', duration=50, calories=200),
        ]

        # Create Workouts
        workouts = [
            octo_models.Workout.objects.create(name='Morning Cardio', description='Cardio for all heroes'),
            octo_models.Workout.objects.create(name='Strength Training', description='Strength for all heroes'),
        ]

        # Create Leaderboard
        for user in users:
            octo_models.Leaderboard.objects.create(user=user, points=100)

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data!'))
