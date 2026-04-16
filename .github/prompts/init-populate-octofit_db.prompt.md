---
mode: 'agent'
model: GPT-5.3-Codex
description: 'Configure MongoDB and seed octofit_db for the Octofit multi-tier application'
---

Set up and populate the data tier for `octofit-tracker/backend`.

Requirements:

1. Use MongoDB with Mongoose.
2. Use connection string for local MongoDB on port `27017` and database `octofit_db`.
3. Create Mongoose models for users, teams, activities, leaderboard, and workouts.
4. Add a seed script at `src/scripts/seed.ts`.
5. Include this help/description text in the seed script comments or logs:
   `Seed the octofit_db database with test data`.
6. Insert realistic sample data for all collections.
7. Verify data creation with API route responses.
