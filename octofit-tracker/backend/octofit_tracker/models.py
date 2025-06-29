# models.py for octofit_tracker Django app

from django.db import models
from djongo import models as djongo_models

# Define your models here following the requirements in the docs

class User(models.Model):
    _id = djongo_models.ObjectIdField()
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    # Add other fields as needed

    class Meta:
        app_label = 'octofit_tracker'

class Team(models.Model):
    _id = djongo_models.ObjectIdField()
    name = models.CharField(max_length=100)
    members = models.ManyToManyField('User')

    class Meta:
        app_label = 'octofit_tracker'

class Activity(models.Model):
    _id = djongo_models.ObjectIdField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    duration = models.IntegerField()
    date = models.DateTimeField()

    class Meta:
        app_label = 'octofit_tracker'

class Leaderboard(models.Model):
    _id = djongo_models.ObjectIdField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    points = models.IntegerField()

    class Meta:
        app_label = 'octofit_tracker'

class Workout(models.Model):
    _id = djongo_models.ObjectIdField()
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField()

    class Meta:
        app_label = 'octofit_tracker'
