## Step 3: Update Django models and views

In this step, we will accomplish the following:

- Update the Django models and views.
- Create the initial app structure.

1. Open all files in the `docs` folder and keep this file open in the editor.
2. Click the GitHub Copilot Chat click the :paperclip: and add "Open Editors" to the prompt.
3. Copy and paste the following prompt in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

>[!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> Keep files created and updated by Copilot agent mode until it is finished.
> Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Update the Django models and views

> **Prompt**
>
> ```prompt
>Based on the example monafit tracker app in the docs/mona-high-school-fitness-tracker.md file and use octofit as the name for Mergington's high school's app. Let's setup the Django models and views.
> 
> 1. Update the models.py file to include models for activities, teams, users, and workouts.
> 2. Update the views.py file to include RESTful API endpoints for activities, leaderboard, teams, users, and workouts.
> 3. Create a templates folder with necessary HTML templates.
> 4. Create a static folder with necessary CSS and JS files.
> 5. Create initial data for the models.
>
> Don't proceed with the next activity until all of these steps are completed.
>```

Now that we have updated our Django models and views, let's check our changes in to our `build-octofit-app` branch.
With our new changes complete, please **commit** and **push** the changes to GitHub.

Wait a moment for Mona to check your work, provide feedback, and share the final lesson. Almost done!

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your commit changes were made for the following files to the branch `build-octofit-app` and pushed/synchronized to GitHub:
  - `octofit-tracker/backend/octofit_tracker/models.py`
  - `octofit-tracker/backend/octofit_tracker/views.py`
- If Mona found a mistake, simply make a correction and push your changes again. Mona will check your work as many times as needed.

</details>