---
applyTo: "**"
---
# Octofit-tracker Fitness App Setup and Structure Guidelines

## Explain the Octofit Tracker App goals and steps

I want to build an Octofit Tracker app that will include the following:

* User authentication and profiles
* Activity logging and tracking
* Team creation and management
* Competitive leader board
* Personalized workout suggestions

## Never change directories when agent mode is running commands

- Never change directories
- Instead point to the directory when issuing commands

## Forwarded ports

- 8000: public
- 3000: public
- 27017: private

Do not propose any other ports to forward or to make public

## OctoFit Tracker App structure

The section defines the OctoFit Tracker App's structure

```text
octofit-tracker/
├── backend/
│   ├── venv/
|   ├── octofit_tracker/
└── frontend/
```

## Create the OctoFit Tracker Python virtual environment 

- To create the virtual environment, run the following command:
  
  ```bash
  python3 -m venv octofit-tracker/backend/venv
  ```

## OctoFit Tracker Python required packages

### Create file octofit-tracker/backend/requirements.txt

- add the following to octofit-tracker/backend/requirements.txt
- Install the Python packages below only for our OctoFit Tracker project

```text
Django==4.1.7
djangorestframework==3.14.0
django-allauth==0.51.0
django-cors-headers==4.5.0
dj-rest-auth==2.2.6
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

## Python virtual environment requirements

Create a requirements.txt with the following Python required packages:
Install the requirements that we created in requirements.txt.

```bash
source octofit-tracker/backend/venv/bin/activate 
pip install -r octofit-tracker/backend/requirements.txt
```

## mongodb-org service and data creation

- always use `ps aux | grep mongod` for checking for mongod running
- mongodb-org is the official MongoDB package
- mongosh is the official client tool
- Always use Django's ORM, not direct MongoDB scripts to create the database structure and data
