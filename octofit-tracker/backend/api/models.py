from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    ]
    
    FITNESS_LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    age = models.IntegerField(null=True, blank=True, validators=[MinValueValidator(13), MaxValueValidator(120)])
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    fitness_level = models.CharField(max_length=15, choices=FITNESS_LEVEL_CHOICES, default='beginner')
    goals = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True, default='')
    avatar_url = models.URLField(blank=True, default='')
    
    total_calories_burned = models.FloatField(default=0)
    total_distance_km = models.FloatField(default=0)
    current_streak = models.IntegerField(default=0)
    longest_streak = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.role})"


class Activity(models.Model):
    ACTIVITY_TYPE_CHOICES = [
        ('running', 'Running'),
        ('cycling', 'Cycling'),
        ('gym', 'Gym'),
        ('swimming', 'Swimming'),
        ('yoga', 'Yoga'),
        ('other', 'Other'),
    ]
    
    INTENSITY_CHOICES = [
        ('low', 'Low'),
        ('moderate', 'Moderate'),
        ('high', 'High'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    duration_minutes = models.IntegerField(validators=[MinValueValidator(1)])
    calories_burned = models.FloatField(validators=[MinValueValidator(0)])
    distance_km = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0)])
    intensity = models.CharField(max_length=10, choices=INTENSITY_CHOICES)
    description = models.TextField(blank=True, default='')
    timestamp = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [models.Index(fields=['user', '-timestamp'])]
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type} ({self.duration_minutes}min)"


class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, default='')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_teams')
    members = models.ManyToManyField(User, through='TeamMember', related_name='teams')
    
    total_activities = models.IntegerField(default=0)
    total_calories_burned = models.FloatField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]
    
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('team', 'user')
        ordering = ['-joined_at']
    
    def __str__(self):
        return f"{self.user.username} in {self.team.name} ({self.role})"


class Workout(models.Model):
    DIFFICULTY_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    exercises = models.JSONField(default=list)
    difficulty_level = models.CharField(max_length=15, choices=DIFFICULTY_CHOICES)
    estimated_calories = models.FloatField()
    recommended_frequency = models.CharField(max_length=100, default='3 times a week')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class WorkoutRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_recommendations')
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    reason = models.TextField()
    recommended_date = models.DateTimeField()
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    feedback = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-recommended_date']
        indexes = [models.Index(fields=['user', '-recommended_date'])]
    
    def __str__(self):
        return f"{self.user.username} - {self.workout.name}"


class Leaderboard(models.Model):
    LEADERBOARD_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('team', 'Team'),
    ]
    
    METRIC_CHOICES = [
        ('calories', 'Calories Burned'),
        ('activities', 'Total Activities'),
        ('consistency', 'Consistency'),
    ]
    
    PERIOD_CHOICES = [
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
    ]
    
    leaderboard_type = models.CharField(max_length=20, choices=LEADERBOARD_TYPE_CHOICES)
    metric = models.CharField(max_length=20, choices=METRIC_CHOICES)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    entries = models.JSONField(default=list)
    
    generated_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('leaderboard_type', 'metric', 'period')
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.leaderboard_type} - {self.metric} ({self.period})"
