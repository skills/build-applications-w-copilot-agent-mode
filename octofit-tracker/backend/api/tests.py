import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'octofit_config.settings')
django.setup()

from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from api.models import Activity, Team, TeamMember, Workout, WorkoutRecommendation, Leaderboard
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


class UserAuthenticationTests(APITestCase):
    """Test user authentication and registration"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_user_registration(self):
        """Test user can register with valid data"""
        data = {
            'username': 'testuser',
            'email': 'test@octofit.com',
            'password': 'securepass123',
            'password2': 'securepass123',
            'role': 'student'
        }
        response = self.client.post('/api/users/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
    
    def test_user_login(self):
        """Test user can login with valid credentials"""
        User.objects.create_user(username='alice', password='alice123', email='alice@octofit.com')
        data = {'username': 'alice', 'password': 'alice123'}
        response = self.client.post('/dj-rest-auth/login/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('key', response.data)


class ActivityTests(APITestCase):
    """Test activity logging and tracking"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='bob', password='bob123', email='bob@octofit.com')
        self.client.force_authenticate(user=self.user)
    
    def test_create_activity(self):
        """Test creating a new activity"""
        data = {
            'activity_type': 'running',
            'duration_minutes': 30,
            'calories_burned': 300,
            'intensity': 'moderate',
            'timestamp': timezone.now().isoformat()
        }
        response = self.client.post('/api/activities/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Activity.objects.count(), 1)
    
    def test_list_activities(self):
        """Test retrieving user's activities"""
        Activity.objects.create(
            user=self.user,
            activity_type='cycling',
            duration_minutes=45,
            calories_burned=400,
            intensity='high',
            timestamp=timezone.now()
        )
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class TeamTests(APITestCase):
    """Test team management functionality"""
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='pass123', email='user1@octofit.com')
        self.user2 = User.objects.create_user(username='user2', password='pass123', email='user2@octofit.com')
        self.client.force_authenticate(user=self.user1)
    
    def test_create_team(self):
        """Test creating a team"""
        data = {'name': 'Test Team', 'description': 'A test team'}
        response = self.client.post('/api/teams/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Team.objects.count(), 1)
    
    def test_join_team(self):
        """Test joining a team"""
        team = Team.objects.create(name='Test Team', owner=self.user1)
        TeamMember.objects.create(team=team, user=self.user1, role='owner')
        
        self.client.force_authenticate(user=self.user2)
        response = self.client.post(f'/api/teams/{team.id}/join/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(TeamMember.objects.filter(team=team, user=self.user2).exists())


class WorkoutTests(APITestCase):
    """Test workout and recommendation functionality"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='trainee', password='pass123', email='trainee@octofit.com')
        self.client.force_authenticate(user=self.user)
        
        self.workout = Workout.objects.create(
            name='Morning Run',
            description='5km run',
            difficulty_level='beginner',
            estimated_calories=300,
            exercises=[]
        )
    
    def test_list_workouts(self):
        """Test retrieving available workouts"""
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class LeaderboardTests(APITestCase):
    """Test leaderboard generation and retrieval"""
    
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='champ1', password='pass123', email='champ1@octofit.com')
        self.user2 = User.objects.create_user(username='champ2', password='pass123', email='champ2@octofit.com')
        
        Activity.objects.create(
            user=self.user1,
            activity_type='gym',
            duration_minutes=60,
            calories_burned=500,
            intensity='high',
            timestamp=timezone.now()
        )
        Activity.objects.create(
            user=self.user2,
            activity_type='running',
            duration_minutes=45,
            calories_burned=400,
            intensity='moderate',
            timestamp=timezone.now()
        )
        
        self.client.force_authenticate(user=self.user1)
    
    def test_get_leaderboard(self):
        """Test retrieving leaderboard"""
        response = self.client.get('/api/leaderboards/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
