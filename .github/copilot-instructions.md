# Copilot Instructions for MonaFit Tracker App

## Project Overview

This repository contains the MonaFit Tracker app, which includes:
- User authentication and profiles
- Activity logging and tracking
- Team creation and management
- Competitive leaderboard
- Personalized workout suggestions

The app consists of a Django backend (using MongoDB via Djongo) and a React frontend (using Bootstrap for styling). All backend code is in a single Django app called `monafit_tracker`.

---

## Directory Structure

```
monafit-tracker/
├── backend/
│   ├── venv/
│   ├── monafit_tracker/
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
```

---

## Backend Setup

- Use Python virtual environment in `monafit-tracker/backend/venv`.
- All backend code (models, serializers, views, urls) is in `monafit-tracker/backend/monafit_tracker/`.
- Install dependencies from `monafit-tracker/backend/requirements.txt` (see below for required packages).
- Use Djongo to connect Django to MongoDB. Database name: `monafit_db`.
- Do **not** create additional Django apps; use only `monafit_tracker`.
- Example `settings.py` is provided in the documentation.
- Use the provided models, serializers, views, and urls structure for users, teams, activities, leaderboard, and workouts.
- Use the provided `populate_db.py` management command to initialize and populate the database with sample data.

### requirements.txt (Python dependencies)

```
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
```

---

## Frontend Setup

- The frontend is a React app in `monafit-tracker/frontend` (no subdirectories for the app itself).
- Use Bootstrap for styling. Import Bootstrap in `src/index.js`.
- Use React Router for navigation.
- Example `package.json` and `App.js` are provided in the documentation.
- Use the provided `App.css` for styling.
- Components to implement: Users, Activities, Teams, Leaderboard, Workouts, Login, Register, Profile, Dashboard, Settings, Home.
- Use the Codespace URL for all API endpoints (see below).

---

## MongoDB Setup

- Install MongoDB using `apt-get`.
- Start MongoDB with `sudo service mongodb start`.
- Use the provided MongoDB shell commands to create collections and indexes.

---

## API Endpoints

- All API endpoints should use the Codespace URL format:
  `http://<codespace-name>-8000.app.github.dev/api/<resource>/?format=api`
- Replace `<codespace-name>` with the actual Codespace name.
- Example endpoints: users, teams, activities, leaderboard, workouts.

---

## Development Workflow

1. Set up the directory structure as shown above.
2. Set up the Python virtual environment and install backend dependencies.
3. Set up the Django project and app as described.
4. Set up the React frontend and install dependencies.
5. Set up MongoDB and initialize collections.
6. Use the provided management command to populate the database.
7. Use the Codespace URL for all API calls in the frontend.
8. Run the Django server and React development server as needed.

---

## Additional Notes

- Do not create redundant backend or frontend subdirectories.
- All backend logic must reside in the `monafit_tracker` Django app.
- Always use the Codespace URL for API endpoints in the frontend.
- Use the provided code samples for models, serializers, views, urls, and React components as a reference.
