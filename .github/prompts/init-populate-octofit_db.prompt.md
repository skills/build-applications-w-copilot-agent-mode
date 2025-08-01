---
mode: 'agent'
model: GPT-4.1
description: 'Initialize and populate the octofit_db database'
---

- Your task is to create the Django project in octofit-tracker/backend/octofit_tracker directory
- Activate the Python existing virtual environment octofit_tracker/backend/venv/bin/activate.


To init and populate the octofit_db database follow these steps.
1. Make sure the mongo service is running.
2. Initialize the mongo octofit_db database.
3. Create a correct table structure for users, teams, activity, leaderboard, and workouts collections.
4. Make sure there is a unique ID for the primary key for the user collection.
  ex. db.users.createIndex({ "email": 1 }, { unique: true })
4. Execute the command for me to create the database.
5. List the collections in the octofit_db database.
