## Step 3: Setup of the Django project and MongoDB database

In this step, we will will accomplish the following:
- Setup the octofig_db mongoDB database structure.
- Update the octofit-tracker/backend/octofit_tracker app files.
  - settings, models, serializers, urls, views, tests, admins files.

### :keyboard: Activity: Initialize and create the octofit_db database

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's initialize the octofit_db database.

1. Initialize the mongo octofit_db database
2. Create a correct table structure for users, teams, activity, leaderboard, and workouts collections
3. Make sure there is a unique id for primary key for the user collection 
   ex. db.users.createIndex({ "email": 1 }, { unique: true })
4. List the collections in the octofit_db database

Don't proceed with the next activity until all of these steps are completed.
```
Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
Keep files created and updated by Copilot agent mode until it is finished.

> [!NOTE]
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
