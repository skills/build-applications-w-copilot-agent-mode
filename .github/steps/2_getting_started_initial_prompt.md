## Step 2: Getting started: The initial prompt GitHub Copilot agent mode

### :keyboard: Prompt for GitHub Copilot in agent mode

```text
Create a full stack application based on the markdown files in the .github/steps markdown files provided.

Let's take this step by step 
1 - Understand the story of creating the fitness application in 0_story.md
2 - Be aware of the technology stack outlined in 1_perparing.md
3 - Create the application based on the instructions provided in the 2_getting_started_initial_prompt.md and the correct versions. The react framework, python django, and mongodb. 
4 - Create all necessary files and commands to create files and the overall directory structure under a octofit-tracker directory and create a requirements.txt in the octofit-tracker directory for python required packages.
5 - Provide commands to run the application.
```

#### Content for GitHub Copilot agent mode to evaluate to build the OctoFit Tracker app

```text
I want to build an OctoFit Tracker app that will include the following:

* User authentication and profiles
* Activity logging and tracking
* Team creation and management
* Competitive leader boards
* Personalized workout suggestions

It should be in one app

generate instructions in this order

1. Create the frontend and backend in the octofit-tracker directory of this repository in one command
2. Setup backend python venv and install octofit-tracker/requirements.txt first
3. The octofit-tracker/backend directory will store the django project and app with the name octofit-tracker
4. The Django project octofit-tracker directory will have all the backend components for the app
5. Create the django app directly in the directory octofit_tracker/backend
6. Setup the octofit-tracker/frontend directory will store the react app with no subdirectories
7. install react framework
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

Python required packages

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

Important to avoid using public code and we do NOT need to initialize the git repository

```

<details>
<summary>Instructions for Copilot agent mode to use to create the OctoFit Tracker structure</summary>

```bash
mkdir -p octofit-tracker/{backend,frontend}

python3 -m venv octofit-tracker/backend/venv
source octofit-tracker/backend/venv/bin/activate
pip install -r octofit-tracker/requirements.txt

django-admin startproject octofit_tracker octofit-tracker/backend

npx create-react-app octofit-tracker/frontend

cd ../frontend
npm install bootstrap

echo "import 'bootstrap/dist/css/bootstrap.min.css';" >> src/index.js

sudo apt-get update
sudo apt-get install -y mongodb

sudo service mongodb start
sudo service mongodb status
```

</details>
