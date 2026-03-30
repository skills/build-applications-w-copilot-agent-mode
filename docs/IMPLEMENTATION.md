# OctoFit Tracker - Complete Implementation Guide

## Project Overview

OctoFit Tracker is a comprehensive fitness application featuring user authentication, activity tracking, team management, leaderboards, and personalized workout recommendations. Built with Django REST Framework and React.

## Architecture

```
┌─────────────────────────────────────────┐
│   React Frontend (Port 3000)            │
│   - Authentication & User Profiles      │
│   - Activity Logging Dashboard          │
│   - Team Management Interface           │
│   - Leaderboards Visualization          │
│   - Workout Recommendations Display     │
└────────────────┬────────────────────────┘
                 │ REST API (JSON)
┌────────────────▼────────────────────────┐
│   Django REST Backend (Port 8000)       │
│   - JWT Authentication                  │
│   - User Management & Profiles          │
│   - Activity CRUD Operations            │
│   - Team Management with Permissions    │
│   - Leaderboard Generation              │
│   - Recommendation Engine               │
└────────────────┬────────────────────────┘
                 │ ORM
┌────────────────▼────────────────────────┐
│   SQLite Database                       │
│   - Users, Activities, Teams            │
│   - Workouts, Recommendations           │
│   - Leaderboards Cache                  │
└─────────────────────────────────────────┘
```

## Setup Instructions

### Backend Setup

#### 1. Create Virtual Environment
```bash
cd octofit-tracker/backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Run Migrations
```bash
python manage.py migrate
```

#### 4. Populate Sample Data
```bash
python manage.py populate_db
```

#### 5. Generate Leaderboards
```bash
python manage.py generate_leaderboards
```

#### 6. Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### 7. Start Development Server
```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd octofit-tracker/frontend
npm install
```

#### 2. Set Environment Variables (Optional)
Create `.env` file:
```
REACT_APP_API_URL=http://localhost:8000/api
```

#### 3. Start Development Server
```bash
npm start
```

Application will open at `http://localhost:3000`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/users/
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@octofit.com",
  "password": "securepass123",
  "password2": "securepass123",
  "role": "student"
}
```

#### Login
```
POST /dj-rest-auth/login/
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}

Response:
{
  "key": "token_string_here"
}
```

#### Get Current User Profile
```
GET /api/users/me/
Authorization: Token token_string_here
```

### Activities

#### Log Activity
```
POST /api/activities/
Authorization: Token token_string_here
Content-Type: application/json

{
  "activity_type": "running",
  "duration_minutes": 30,
  "calories_burned": 300,
  "distance_km": 5.0,
  "intensity": "moderate",
  "description": "Morning run",
  "timestamp": "2026-03-30T10:30:00Z"
}
```

#### List User Activities
```
GET /api/activities/
Authorization: Token token_string_here

Optional filters:
- ?activity_type=running
- ?intensity=high
- ?ordering=-timestamp
```

#### Get Activity Statistics
```
GET /api/activities/stats/
Authorization: Token token_string_here

Response:
{
  "all_time": {
    "total_activities": 15,
    "total_calories": 3500,
    "total_distance": 75.5
  },
  "weekly": {
    "total_activities": 5,
    "total_calories": 1200
  },
  "monthly": {
    "total_activities": 12,
    "total_calories": 3200
  }
}
```

### Teams

#### Create Team
```
POST /api/teams/
Authorization: Token token_string_here

{
  "name": "Morning Runners",
  "description": "A team for early morning runners"
}
```

#### List Teams
```
GET /api/teams/
Authorization: Token token_string_here
```

#### Join Team
```
POST /api/teams/{team_id}/join/
Authorization: Token token_string_here
```

#### Get Team Members
```
GET /api/teams/{team_id}/members/
Authorization: Token token_string_here
```

#### Get Team Statistics
```
GET /api/teams/{team_id}/stats/
Authorization: Token token_string_here

Response:
{
  "total_members": 10,
  "total_activities": 50,
  "total_calories_burned": 15000
}
```

### Leaderboards

#### Get Individual Leaderboard
```
GET /api/leaderboards/?leaderboard_type=individual&metric=calories&period=weekly
Authorization: Token token_string_here

Optional metrics:
- calories: Total calories burned
- activities: Total number of activities
- consistency: Current streak

Optional periods:
- weekly
- monthly
- all_time
```

#### Get Team Leaderboard
```
GET /api/leaderboards/?leaderboard_type=team&metric=calories&period=weekly
Authorization: Token token_string_here
```

### Workouts

#### List Available Workouts
```
GET /api/workouts/
Authorization: Token token_string_here

Optional filters:
- ?difficulty_level=beginner
- ?search=morning
```

#### Get Workout Recommendations
```
GET /api/recommendations/
Authorization: Token token_string_here
```

#### Complete Recommendation
```
POST /api/recommendations/{recommendation_id}/complete/
Authorization: Token token_string_here

{
  "feedback": "Great workout!"
}
```

## Database Schema

### User Model
- id (Primary Key)
- username (Unique)
- email (Unique)
- role (student, teacher, admin)
- age (13-120)
- gender (M, F, O)
- fitness_level (beginner, intermediate, advanced)
- goals (JSON list)
- bio, avatar_url
- Statistics: total_calories_burned, total_distance_km, current_streak, longest_streak
- Timestamps: created_at, updated_at

### Activity Model
- id (Primary Key)
- user_id (Foreign Key to User)
- activity_type (running, cycling, gym, swimming, yoga, other)
- duration_minutes (Required, > 0)
- calories_burned (Required, >= 0)
- distance_km (Optional)
- intensity (low, moderate, high)
- description (Optional)
- timestamp (Activity datetime)
- Timestamps: created_at, updated_at

### Team Model
- id (Primary Key)
- name (Unique)
- description
- owner_id (Foreign Key to User)
- members (Many-to-Many through TeamMember)
- Statistics: total_activities, total_calories_burned
- Timestamps: created_at, updated_at

### TeamMember Model
- team_id, user_id (Composite Primary Key)
- role (owner, admin, member)
- joined_at (Timestamp)

### Workout Model
- id (Primary Key)
- name
- description
- exercises (JSON list)
- difficulty_level (beginner, intermediate, advanced)
- estimated_calories
- recommended_frequency
- Timestamps: created_at, updated_at

### WorkoutRecommendation Model
- id (Primary Key)
- user_id (Foreign Key)
- workout_id (Foreign Key)
- reason (Text)
- recommended_date
- completed (Boolean)
- completed_at (Optional)
- feedback (Optional)
- Timestamps: created_at, updated_at

### Leaderboard Model
- id (Primary Key)
- leaderboard_type (individual, team)
- metric (calories, activities, consistency)
- period (weekly, monthly, all_time)
- entries (JSON list of rankings)
- Timestamps: generated_at, updated_at

## Sample Users (For Testing)

| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | admin123 | admin | admin@octofit.com |
| alice | alice123 | teacher | alice@octofit.com |
| bob | bob123 | student | bob@octofit.com |
| charlie | charlie123 | student | charlie@octofit.com |
| diana | diana123 | teacher | diana@octofit.com |

## Features Overview

### Phase 1: System Design ✅
- Architecture defined
- Database schema designed
- API endpoints documented

### Phase 2: User Management ✅
- User registration and authentication
- Role-based access control
- User profiles with editable fields
- Password hashing with Django's built-in system

### Phase 3: Activity Tracking ✅
- Log activities with type, duration, calories, distance
- CRUD operations for activities
- Weekly/monthly aggregation in stats endpoint
- Activity filtering and sorting

### Phase 4: Team Management ✅
- Create and manage teams
- Join/leave teams
- Team member roles (owner, admin, member)
- Team activity aggregation

### Phase 5: Leaderboards ✅
- Individual leaderboards by calories, activities, consistency
- Team leaderboards
- Weekly, monthly, all-time periods
- Automatically generated and cached

### Phase 6: Workout Recommendations ✅
- Rule-based recommendation engine
- Recommendations based on fitness level
- Daily/weekly workout plans
- Completion tracking with feedback

### Phase 7: Code Quality ✅
- Modular, reusable components
- Clean separation of concerns
- DRY principles applied
- Error handling throughout

### Phase 8: Testing ✅
- Unit tests for all viewsets
- API endpoint testing
- Authentication testing
- Business logic validation

### Phase 9: Documentation ✅
- Complete setup guide
- API documentation with examples
- Database schema documentation
- Architecture overview

## Testing

### Run Backend Tests
```bash
cd octofit-tracker/backend
source venv/bin/activate
python manage.py test api
```

### Test with cURL

#### Register User
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test_user",
    "email": "test@octofit.com",
    "password": "testpass123",
    "password2": "testpass123",
    "role": "student"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8000/dj-rest-auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "test_user", "password": "testpass123"}'
```

#### Log Activity
```bash
curl -X POST http://localhost:8000/api/activities/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "activity_type": "running",
    "duration_minutes": 30,
    "calories_burned": 300,
    "intensity": "moderate",
    "timestamp": "2026-03-30T10:30:00Z"
  }'
```

## Deployment

### Production Checklist
- [ ] Set DEBUG = False in settings.py
- [ ] Update ALLOWED_HOSTS with production domain
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up database backups
- [ ] Configure static files serving
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

### Environment Variables
```
DEBUG=False
SECRET_KEY=your_secret_key_here
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@host/dbname
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Troubleshooting

### 404 Not Found on API Endpoints
- Ensure Django is running on correct port (8000)
- Check that API urls are properly configured in settings

### CORS Errors
- Verify frontend URL is in CORS_ALLOWED_ORIGINS
- Check that corsheaders middleware is installed and enabled

### Authentication Failures
- Ensure token is properly sent in Authorization header
- Token format should be: `Authorization: Token <token_string>`

### Database Errors
- Run migrations: `python manage.py migrate`
- Check database file permissions
- Ensure all models are registered in admin.py

## Performance Optimizations

1. **Leaderboard Caching**: Pre-computed and stored in database
2. **Query Optimization**: Proper use of select_related and prefetch_related
3. **Pagination**: Default 20 items per page on list endpoints
4. **Throttling**: 100 requests/hour for anonymous, 1000 for authenticated users
5. **Indexing**: Database indexes on frequently queried fields

## Future Enhancements

- [ ] Social features (friend requests, activity sharing)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and progress tracking
- [ ] Integration with wearable devices
- [ ] Push notifications
- [ ] AI-powered personalized coaching
- [ ] Payment system for premium features
- [ ] Real-time activity updates with WebSockets

## Support

For issues or questions, please refer to the API documentation or contact the development team.

## License

OctoFit Tracker is licensed under the MIT License.
