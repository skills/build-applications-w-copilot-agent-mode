## Step 3: Initialize and create the octofit_db MongoDB database, Django project/app, update Django project/app files, and populate the MongoDB database

In this step, we will accomplish the following:

- Set up the octofit_db MongoDB database structure.
- Update the octofit-tracker/backend/octofit_tracker app files:
  - settings, models, serializers, urls, views, tests, and admin files.
- Populate the octofit_db database with test data.
- Verify the test data is populated in the octofit_db database.

Copy and paste the following prompt(s) in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> [!NOTE]
> - Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> - Wait a moment for the Copilot to respond and press the `Continue` button to execute commands presented by Copilot agent mode.
> - Keep files created and updated by Copilot agent mode until it is finished.
> - Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Setup the Python Django project/app

In this activity we will leverage a feature in vscode called prompt files. A prompt file that has been created by the IT department for us to create our Django project application. Copy/paste the following prompt in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> /create-django-project
>```

> [!NOTE]
> - Wait a moment for the Copilot to respond and press the `Continue` button to execute each command presented by Copilot agent mode.
> - Keep files created and updated until the Copilot agent mode has finished.

> [!IMPORTANT]
> - Don't start the Python Django app in the way that GitHub Copilot agent mode suggests hit **cancel**.

### :keyboard: Activity: Initialize, create, and populate the octofit_db MongoDB database

Let's continue to leverage a prompt file that has been created by the IT department for us to initialize and create the octofit_db MongoDB database. Copy/paste the following prompt in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
>
> /init-populate-octofit_db
> ```

### :keyboard: Activity: Update the Python Django project/app files

Now let's create a prompt file of our own that we can share with other staff to develop to build the octofit-tracker app. Copy/paste the following prompt in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's add the following to a prompt file called `update-octofit-tracker-app.prompt.md` in the `.github/prompts` directory and add mode: 'agent' and model: GPT-4.1 to the prompt file.
>
> # Django App Updates
>
> - All Django project files are in the `octofit-tracker/backend/octofit_tracker` directory.
>
> 1. Update `settings.py` for MongoDB connection and CORS.
> 2. Update `models.py`, `serializers.py`, `urls.py`, `views.py`, `tests.py`, and `admin.py` to support users, teams, activities, leaderboard, and workouts collections.
> 3. Ensure `/` points to the api and `api_root` is present in `urls.py`.
> ```

> [!TIP]
> Use prompt files to define repeatable tasks and workflows.
>
> When writing prompts focus on **WHAT** needs to be done. You can reference instructions for the **HOW**.

See the [VS Code Docs: Prompt Files](https://code.visualstudio.com/docs/copilot/copilot-customization#_prompt-files-experimental) page for more information.

### :keyboard: Activity: Let's use the prompt file to update the Python Django project/app files

Copy/paste the following prompt in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> /update-octofit-tracker-app
> ```
>

> ❕ **Important:** Don't start the Python Django app in the way that GitHub Copilot agent mode suggests hit **cancel**.

1. Now that we have created the database structure, updated our Django project files, and populated the database, let's check our changes into our `build-octofit-app` branch.

1. With our new changes complete, please **commit** and **push** the changes to GitHub.

1. Wait a moment for Mona to check your work, provide feedback, and share the next lesson so we can keep working!

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your commit changes were made for the following files to the branch `build-octofit-app` and pushed/synchronized to GitHub:
  - `octofit-tracker/backend/octofit_tracker/settings.py`
  - `octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py`
- If Mona found a mistake, simply make a correction and push your changes again. Mona will check your work as many times as needed.

</details>
