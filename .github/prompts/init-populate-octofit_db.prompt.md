---
mode: 'agent'
model: GPT-4.1
description: 'Setup, configure, and populate the octofit_db database with test data for the Octofit Tracker Django app.'
---

# Environment Setup
- Use the existing Python virtual environment in `octofit-tracker/backend/venv`.
- Do not create a new Python virtual environment.
- Activate with: `source octofit-tracker/backend/venv/bin/activate`
- `mongodb-org-shell` is already installed; use `mongosh` to interact with MongoDB.
- The Django project is in `octofit-tracker/backend/octofit_tracker`.

# Database Initialization & Population
1. Ensure the MongoDB service is running.
2. Configure Django in `settings.py` to connect to the `octofit_db` database using Djongo, with no authentication or password required.
3. Make sure `octofit_tracker`, `rest_framework`, and `djongo` are in `INSTALLED_APPS`.
4. Enable CORS in `settings.py` to allow all origins, methods, and headers. Allow all hosts `*`.
5. Install and configure CORS middleware components.
6. Run `makemigrations` and `migrate` in the Python virtual environment.
7. Initialize the `octofit_db` database and create collections for users, teams, activities, leaderboard, and workouts.
8. Ensure a unique index on the `email` field for the user collection (e.g., `db.users.createIndex({ "email": 1 }, { unique: true })`).
9. Populate the database with test data for all collections using the Django management command in `octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py` 
  a. help message: 'Populate the octofit_db database with test data'.
  b. Django ORM for data deletion and insertion
  c. Make the sample data super heroes and use team marvel and team dc.
10. Verify the database and collections were created and populated successfully using `mongosh`.
11. List the collections in the `octofit_db` database and show sample documents from each.

# Verification
- After population, verify with `mongosh` that the `octofit_db` database contains the correct collections and test data.
- Confirm Django REST API endpoints are available for all collections.
