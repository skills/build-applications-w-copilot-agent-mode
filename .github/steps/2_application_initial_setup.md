## Step 2: The initial application setup: Directory structure, Python requirements, Django project/app, and MongoDB

In this step, we will accomplish the following:

- Create the octofit-tracker application directory structure.
- Create the octofit-tracker/backend and octofit-tracker/frontend directories.
- Create the octofit-tracker/backend/requirements.txt file. 

1. Open all files in the `docs` folder and keep this file open in the editor.
2. Click the GitHub Copilot Chat "COPILOT EDITS" tab click the :paperclip: and add "Open Editors" to the prompt.
3. Copy and paste the following prompt in the GitHub Copilot Chat "COPILOT EDITS" tab and select the "Agent" instead of "Edit" from the drop down where you are inserting the prompt.

>[!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> Keep files created and updated by Copilot agent mode until it is finished.
> Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Prompt for GitHub Copilot in agent mode to start the creation of our application

```text
Let's take the following step by step and generate instructions in this order and execute the commands.
Use docs/mergington-tech-policies.md as a guide for the project structure and requirements.

1. Understand the story of creating the fitness application from the docs/octofit_story.md file.
2. Create the initial directory structure for the octofit-tracker application octofit-tracker/backend, octofit-tracker/frontend.
3. Setup the backend python virtual environment, requirements.txt, and install required packages.

Don't proceed with the next activity until all of these steps are completed.
```

> [!IMPORTANT]
> Once the above activity installs all the required packages, proceed to the next activity.

### :keyboard: Activity: Setup the Python Django project/app

```text
based on the requirements in the docs/mergington-tech-policies.md file, let's setup the Python Django project/app and run the server.

1. The octofit-tracker/backend directory will store the django project and app with the name octofit-tracker.
2. Setup the additional configuration for the django project/app with the name octofit-tracker.
3. Run makemigrations and migrate the database before running the server.
4. Run the server in the Python virtual environment and verify it is running.

Don't proceed with the next activity until all of these steps are completed.
```

Wait a moment for the Copilot to respond and press the continue button to execute each command presented by Copilot agent mode.
Keep files creating and updating until the Copilot agent mode has finished.

### :keyboard: Activity: Let's install and start the mongoDB database

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's install the mongoDB database.

1. Install mongoDB and make sure the command is complete.

Don't proceed with the next activity until all of these steps are completed.
```

> [!NOTE]
> You may need to stop if the copilot agent mode is in a spinning loop, but the command will have executed.

### :keyboard: Activity: Let's start the mongoDB database and verify it is running

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's start the mongoDB database and verify it is running.

1. Start the mongoDB
2. Verify the mongoDB is running

Don't proceed with the next activity until all of these steps are completed.
```
