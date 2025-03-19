## Step 3: Initialize and create the octofit_db MongoDB database, update Django project/app files, and populate the MongoDB database

In this step, we will will accomplish the following:

- Setup the octofig_db mongoDB database structure.
- Update the octofit-tracker/backend/octofit_tracker app files.
  - settings, models, serializers, urls, views, tests, admins files.
- Populate the octofit_db database with test data.
- Verify the test data is populated in the octofit_db database.

1. Open all files in the `docs` folder and keep this file open in the editor.
2. Click the GitHub Copilot Chat "COPILOT EDITS" tab click the :paperclip: and add "Open Editors" to the prompt.
3. Copy and paste the following prompt in the GitHub Copilot Chat "COPILOT EDITS" tab and select the "Agent" instead of "Edit" from the drop down where you are inserting the prompt.

>[!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> Keep files created and updated by Copilot agent mode until it is finished.
> Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Initialize and create the octofit_db MongoDB database

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's initialize the octofit_db database.

1. Initialize the mongo octofit_db database.
2. Create a correct table structure for users, teams, activity, leaderboard, and workouts collections.
3. Make sure there is a unique id for primary key for the user collection.
   ex. db.users.createIndex({ "email": 1 }, { unique: true })
4. Execute the command for me to create the database.
5. List the collections in the octofit_db database.

Don't proceed with the next activity until all of these steps are completed.
```

> [!IMPORTANT]
> You may need to prompt agent mode and tell it that "the command is cutoff".
> you can also click in the command and go to the end to view the "Continue" button.

### :keyboard: Activity: Update the pdate Django project/app files

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's update the octofit-tracker/backend/octofit_tracker app files.

1. Update the octofit-tracker/backend/octofit_tracker/settings.py file to include the mongoDB database connection.
2. Update the octofit-tracker/backend/octofit_tracker/models.py file to include the models for users, teams, activity, leaderboard, and workouts collections.
3. Update the octofit-tracker/backend/octofit_tracker/serializers.py file to include the serializers for users, teams, activity, leaderboard, and workouts collections.
4. Update the octofit-tracker/backend/octofit_tracker/urls.py file to include the urls for users, teams, activity, leaderboard, and workouts collections.
5. Update the octofit-tracker/backend/octofit_tracker/views.py file to include the views for users, teams, activity, leaderboard, and workouts collections.
6. Update the octofit-tracker/backend/octofit_tracker/tests.py file to include the tests for users, teams, activity, leaderboard, and workouts collections.
7. Update the octofit-tracker/backend/octofit_tracker/admin.py file to include the admin for users, teams, activity, leaderboard, and workouts collections.
8. Enable CORS in the octofit-tracker/backend/octofit_tracker/settings.py file to allow cross-origin requests from the frontend React app and allow all origins, methods, and headers.

Don't proceed with the next activity until all of these steps are completed.
```

### :keyboard: Activity: populate the octofit_db database with test data from Django project/app files

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's populate the octofit_db database with test data.

1. Create a test data file in the octofit-tracker/backend/octofit_tracker directory.
2. Make sure the Python Django server is running in the Python virtual environment makemigrations and migrate the database.
3. Populate the octofit_db database with test data for users, teams, activities, leaderboard, and workouts collections.
4. Verify the test data is populated in the octofit_db database.

Don't proceed with the next activity until all of these steps are completed.
```

> [!IMPORTANT]
> You may need to prompt agent mode and tell it that "the command is cutoff".
