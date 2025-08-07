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

## OctoFit Tracker App structure

The section defines the OctoFit Tracker App's structure


The directory tree for the OctoFit Tracker App
octofit-tracker/
├── backend/
│   ├── venv/
└── frontend/


## Python virtual environment and requirements

The virtual environment should be created in octofit-tracker/backend/venv

Create a requirements.txt with the following Python required packages:

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

## mongodb-org service


- Running on Ubuntu 22.04
- Using systemd for service management
- mongodb-org is the official MongoDB package
- mongosh is the official client tool

## REACT Frontend App structure

```bash
npx create-react-app octofit-tracker/frontend

npm install bootstrap --prefix octofit-tracker/frontend

echo "import 'bootstrap/dist/css/bootstrap.min.css';" >> src/index.js

npm install react-router-dom --prefix octofit-tracker/frontend

```
