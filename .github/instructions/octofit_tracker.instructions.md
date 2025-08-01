---
applyTo: "octofit-tracker/**"
---
# Octofit-tracker Fitness App Structure Guidelines

## Explain the Octofit Tracker App goals and steps

I want to build an Octofit Tracker app that will include the following:

* User authentication and profiles
* Activity logging and tracking
* Team creation and management
* Competitive leader board
* Personalized workout suggestions

## Python Virtual environment and the OctoFit Tracker App structure

1. Create the frontend and backend in the octofit-tracker directory structure of this repository in one command
2. Setup backend the Python virtual environment in octofit_tracker/backend/venv
3. Create a octofit-tracker/backend/requirements.txt file
4. The octofit-tracker/backend directory will store the django project and app with the name octofit-tracker
5. The Django project octofit-tracker directory will have all the backend components for the app
6. Create the django app directly in the directory octofit_tracker/backend
7. Setup the octofit-tracker/frontend directory will store the react app with no subdirectories
8. Install react framework
9. Install bootstrap and import it
10. Commands to install mongodb via 'apt-get' 
11. Commands start mongodb with the 'sudo service mongodb start' and 'sudo service mongodb status'

The directory tree for the monafit Tracker App
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

## REACT Frontend App structure

```
npx create-react-app octofit-tracker/frontend

npm install bootstrap --prefix octofit-tracker/frontend

echo "import 'bootstrap/dist/css/bootstrap.min.css';" >> src/index.js

npm install react-router-dom --prefix octofit-tracker/frontend

```


