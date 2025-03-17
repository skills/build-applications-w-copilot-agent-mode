# Getting started - app frontend and backend creation

## Explain to GitHub Copilot the goals and steps

```text
I want to build an OctoFit Tracker app that will include the following:

* User authentication and profiles
* Activity logging and tracking
* Team creation and management
* Competitive leader board
* Personalized workout suggestions

It should be in one app

generate instructions in this order

1. Create the frontend and backend in the octofit-tracker directory structure of this repository in one command
2. Setup backend python venv and create a octofit-tracker/requirements.txt file
3. The octofit-tracker/backend directory will store the django project and app with the name octofit-tracker
4. The Django project octofit-tracker directory will have all the backend components for the app
5. Create the django app directly in the directory octofit_tracker/backend
6. Setup the octofit-tracker/frontend directory will store the react app with no subdirectories
7. Install react framework
8. Install bootstrap and import it
9. Commands to install mongodb via 'apt-get' 
10. Commands start mongodb with the 'sudo service mongodb start' and 'sudo service mongodb status'

Tha directory tree for the OctoFit Tracker App

octofit-tracker/
├── backend/
│   ├── venv/
│   ├── octofit_tracker/
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── settings.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    ├── package.json
    └── README.md

Create a requirements.txt with the following Python required packages

Django==4.1
djangorestframework==3.14.0
django-allauth==0.51.0
django-cors-headers==4.5.0
dj-rest-auth
djongo==1.3.6
pymongo==3.12
sqlparse==0.2.4
stack-data==0.6.3
sympy==1.12
tenacity==9.0.0
terminado==0.18.1
threadpoolctl==3.5.0
tinycss2==1.3.0
tornado==6.4.1
traitlets==5.14.3
types-python-dateutil==2.9.0.20240906
typing_extensions==4.9.0
tzdata==2024.2
uri-template==1.3.0
urllib3==2.2.3
wcwidth==0.2.13
webcolors==24.8.0
webencodings==0.5.1
websocket-client==1.8.0

All of the backend django app will be in octofit_tracker and do NOT create another app of any kind

Use a Python virtual environment and install all python dependencies from file octofit-tracker/requirements.txt in this workspace

The octofit-tracker/requirements.txt already contains all Django requirements. Django, djongo, sqlparse

Layout the directory structure with no redundant backend and frontend subdirectories

Use bootstrap for the frontend

Let's think about this step by step
```

### Cheat sheet of commands to use to create the OctoFit Tracker structure

```bash
mkdir -p octofit-tracker/{backend,frontend}

python3 -m venv octofit-tracker/backend/venv
source octofit-tracker/backend/venv/bin/activate
pip install -r octofit-tracker/requirements.txt

django-admin startproject octofit_tracker octofit-tracker/backend

npx create-react-app octofit-tracker/frontend

npm install bootstrap octofit-tracker/frontend

echo "import 'bootstrap/dist/css/bootstrap.min.css';" >> src/index.js

sudo apt-get update && sudo apt-get install -y mongodb && sudo service mongodb start && sudo service mongodb status
```

## Initialize the database, setup database and install apps in settings.py, models, serializers, urls, and views

Type the following prompt in GitHub Copilot Chat:

```text
In our next steps lets think step by step and setup the following in this order

1. Initialize the mongo octofit_db database and create a correct table structure for users, teams, activity, leaderboard, and workouts collections
2. Make sure there is a unique id for primary key for the user collection 
   ex. db.users.createIndex({ "email": 1 }, { unique: true })
3. settings.py in our django project for mongodb octofit_db database including localhost and the port
4. settings.py in our django project setup for all installed apps. ex djongo, octofit_tracker, rest_framework
5. In octofit_tracker project setup and use command touch models.py, serializers.py, urls.py, and views.py for users, teams, activity, leaderboard, and workouts
6. Generate code for models.py, serializers.py, and views.py and
7. make sure urls.py has a root, admin, and api endpoints
    urlpatterns = [
        path('', api_root, name='api-root'),  # Root endpoint
        path('admin/', admin.site.urls),  # Admin endpoint
        path('api/', include(router.urls)),  # API endpoint
    ]
```

### MongoDB commands to initialize and setup `octofit_db`

```bash
mongo --eval "db = db.getSiblingDB('octofit_db'); db.createCollection('users'); db.createCollection('teams'); db.createCollection('activity'); db.createCollection('leaderboard'); db.createCollection('workouts'); db.users.createIndex({ email: 1 }, { unique: true }); db.teams.createIndex({ name: 1 }, { unique: true }); db.activity.createIndex({ activity_id: 1 }, { unique: true }); db.leaderboard.createIndex({ leaderboard_id: 1 }, { unique: true }); db.workouts.createIndex({ workout_id: 1 }, { unique: true });"
```

### Check the database collections

```bash
mongo --eval "db = db.getSiblingDB('octofit_db'); printjson(db.getCollectionNames());"
```

### Sample settings.py

```json
# FILE: octofit_tracker/settings.py

DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'octofit_db',
        'HOST': 'localhost',
        'PORT': 27017,
    }
}
```

```json
# FILE: octofit_tracker/settings.py

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'djongo',
    'octofit_tracker',
]
```

### Sample code for models.py, serializers.py, views.py, and urls.py

#### models.py

```python
# FILE: octofit-tracker/backend/octofit_tracker/models.py

from djongo import models

class User(models.Model):
    _id = models.ObjectIdField()
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)

class Team(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    members = models.ArrayReferenceField(to=User, on_delete=models.CASCADE)

class Activity(models.Model):
    _id = models.ObjectIdField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=100)
    duration = models.DurationField()

class Leaderboard(models.Model):
    _id = models.ObjectIdField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField()

class Workout(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=100)
    description = models.TextField()
```

#### serializers.py

```python
# FILE: octofit-tracker/backend/octofit_tracker/serializers.py

from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout
from bson import ObjectId

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return ObjectId(data)

class UserSerializer(serializers.ModelSerializer):
    _id = ObjectIdField()

    class Meta:
        model = User
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    _id = ObjectIdField()
    members = UserSerializer(many=True)

    class Meta:
        model = Team
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    _id = ObjectIdField()
    user = ObjectIdField()

    class Meta:
        model = Activity
        fields = '__all__'

class LeaderboardSerializer(serializers.ModelSerializer):
    _id = ObjectIdField()
    user = ObjectIdField()

    class Meta:
        model = Leaderboard
        fields = '__all__'

class WorkoutSerializer(serializers.ModelSerializer):
    _id = ObjectIdField()

    class Meta:
        model = Workout
        fields = '__all__'
```

#### views.py

```python
# FILE: octofit-tracker/backend/octofit_tracker/views.py

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer
from .models import User, Team, Activity, Leaderboard, Workout

@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'teams': reverse('team-list', request=request, format=format),
        'activity': reverse('activity-list', request=request, format=format),
        'leaderboard': reverse('leaderboard-list', request=request, format=format),
        'workouts': reverse('workout-list', request=request, format=format),
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
```

#### urls.py

```python
# FILE: octofit-tracker/backend/octofit_tracker/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TeamViewSet, ActivityViewSet, LeaderboardViewSet, WorkoutViewSet, api_root

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'teams', TeamViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'leaderboard', LeaderboardViewSet)
router.register(r'workouts', WorkoutViewSet)

urlpatterns = [
    path('', api_root, name='api-root'),  # Root endpoint
    path('admin/', admin.site.urls),  # Admin endpoint
    path('api/', include(router.urls)),  # API endpoint
]
```

## Populate the databse with sample data

```text
Let's use manage.py to get the database setup and populated based on fields in models.py

- Create populate_db.py as a manage.py command so it initializes and deletes previous data and recreates it
- populate_db.py creates users, teams, activity, leaderboard, and workouts
- users will be super hero users
- Include steps to migrate in the octofit_tracker project
```

### Commands to create the directory structure for populate_db.py

```bash
mkdir -p octofit-tracker/backend/octofit_tracker/management/commands
touch octofit-tracker/backend/octofit_tracker/management/__init__.py
touch octofit-tracker/backend/octofit_tracker/management/commands/__init__.py
touch octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py
```

### Sample code for populate_db.py

```python
# FILE: octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py

from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from django.conf import settings
from pymongo import MongoClient
from datetime import timedelta
from bson import ObjectId

class Command(BaseCommand):
    help = 'Populate the database with test data for users, teams, activity, leaderboard, and workouts'

    def handle(self, *args, **kwargs):
        # Connect to MongoDB
        client = MongoClient(settings.DATABASES['default']['HOST'], settings.DATABASES['default']['PORT'])
        db = client[settings.DATABASES['default']['NAME']]

        # Drop existing collections
        db.users.drop()
        db.teams.drop()
        db.activity.drop()
        db.leaderboard.drop()
        db.workouts.drop()

        # Create users
        users = [
            User(_id=ObjectId(), username='superman', email='superman@heroes.com', password='superpassword'),
            User(_id=ObjectId(), username='batman', email='batman@heroes.com', password='batpassword'),
            User(_id=ObjectId(), username='wonderwoman', email='wonderwoman@heroes.com', password='wonderpassword'),
            User(_id=ObjectId(), username='flash', email='flash@heroes.com', password='flashpassword'),
            User(_id=ObjectId(), username='aquaman', email='aquaman@heroes.com', password='aquapassword'),
        ]
        User.objects.bulk_create(users)

        # Create teams
        team = Team(_id=ObjectId(), name='Justice League')
        team.save()
        for user in users:
            team.members.add(user)

        # Create activities
        activities = [
            Activity(_id=ObjectId(), user=users[0], activity_type='Flying', duration=timedelta(hours=1)),
            Activity(_id=ObjectId(), user=users[1], activity_type='Martial Arts', duration=timedelta(hours=2)),
            Activity(_id=ObjectId(), user=users[2], activity_type='Training', duration=timedelta(hours=1, minutes=30)),
            Activity(_id=ObjectId(), user=users[3], activity_type='Running', duration=timedelta(minutes=30)),
            Activity(_id=ObjectId(), user=users[4], activity_type='Swimming', duration=timedelta(hours=1, minutes=15)),
        ]
        Activity.objects.bulk_create(activities)

        # Create leaderboard entries
        leaderboard_entries = [
            Leaderboard(_id=ObjectId(), user=users[0], score=100),
            Leaderboard(_id=ObjectId(), user=users[1], score=90),
            Leaderboard(_id=ObjectId(), user=users[2], score=95),
            Leaderboard(_id=ObjectId(), user=users[3], score=85),
            Leaderboard(_id=ObjectId(), user=users[4], score=80),
        ]
        Leaderboard.objects.bulk_create(leaderboard_entries)

        # Create workouts
        workouts = [
            Workout(_id=ObjectId(), name='Super Strength Training', description='Training for super strength'),
            Workout(_id=ObjectId(), name='Martial Arts Training', description='Training for martial arts'),
            Workout(_id=ObjectId(), name='Amazonian Training', description='Training for Amazonian warriors'),
            Workout(_id=ObjectId(), name='Speed Training', description='Training for super speed'),
            Workout(_id=ObjectId(), name='Aquatic Training', description='Training for underwater activity'),
        ]
        Workout.objects.bulk_create(workouts)

        self.stdout.write(self.style.SUCCESS('Successfully populated the database with test data.'))
```

### Run the following commands to migrate the database and populate it with data

```bash
python octofit-tracker/backend/manage.py octofit-tracker/backend/makemigrations
python octofit-tracker/backend/manage.py octofit-tracker/backend/migrate
python octofit-tracker/backendmanage.py octofit-tracker/backend/populate_db
```

## Using the Codespace endpoint to access the Django REST API endpoints

```text
Let's do the following step by step

- Update #file:octofit-tracker/backend/octofit_tracker/views.py to replace the return for the rest api url endpiints with the codespace url http://[REPLACE-THIS-WITH-YOUR-CODESPACE-NAME]-8000.app.github.dev for django
- Replace <codespace-name> with [REPLACE-THIS-WITH-YOUR-CODESPACE-NAME]
- Run the Django server

HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "users": "http://localhost:8000/api/users/?format=api",
    "teams": "http://localhost:8000/api/teams/?format=api",
    "activities": "http://localhost:8000/api/activities/?format=api",
    "leaderboard": "http://localhost:8000/api/leaderboard/?format=api",
    "workouts": "http://localhost:8000/api/workouts/?format=api"
}

becomes

HTTP 200 OK Allow: GET, HEAD, OPTIONS Content-Type: application/json Vary: Accept

{ 
    "users": "http://<codespace-name>-8000.app.github.dev/users/api/users/?format=api",
    "teams": "http://<codespace-name>-8000.app.github.dev/api/teams/?format=api",
    "activities": "http://<codespace-name>-8000.app.github.dev/api/activities/?format=api",
    "leaderboard": "http://<codespace-name>-8000.app.github.dev/api/leaderboard/?format=api",
    "workouts": "http://<codespace-name>-8000.app.github.dev/api/workouts/?format=api" 
}
```

## Update to views.py

```python
# FILE: octofit-tracker/backend/octofit_tracker/views.py

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .serializers import UserSerializer, TeamSerializer, ActivitySerializer, LeaderboardSerializer, WorkoutSerializer
from .models import User, Team, Activity, Leaderboard, Workout

@api_view(['GET'])
def api_root(request, format=None):
    base_url = 'http://[REPLACE-THIS-WITH-YOUR-CODESPACE-NAME]-8000.app.github.dev/'
    return Response({
        'users': base_url + 'api/users/?format=api',
        'teams': base_url + 'api/teams/?format=api',
        'activities': base_url + 'api/activities/?format=api',
        'leaderboard': base_url + 'api/leaderboard/?format=api',
        'workouts': base_url + 'api/workouts/?format=api'
    })

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all()
    serializer_class = LeaderboardSerializer

class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
```

## Run the server via manage.py

```bash
python manage.py runserver
```

## Setup the frontend React app

```bash
mkdir -p octofit-tracker/frontend

npx create-react-app octofit-tracker/frontend

npm install bootstrap octofit-tracker/frontend

echo "import 'bootstrap/dist/css/bootstrap.min.css';" >> src/index.js
```
