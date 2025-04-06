## Step 2: The initial application setup: Directory structure, Python requirements, and MongoDB

In this step, we will accomplish the following:

- Create the octofit-tracker application directory structure.
- Create the octofit-tracker/backend and octofit-tracker/frontend directories.
- Create the octofit-tracker/backend/requirements.txt file.

1. Open all files in the `docs` folder and keep this file open in the editor.
2. Click the GitHub Copilot Chat click the :paperclip: and add "Open Editors" to the prompt.
3. Copy and paste the following prompt in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

<img src="https://github.com/user-attachments/assets/e172f5c0-bc2a-45a9-a301-9af8bfbd6a2e" width=60% height=60%>

> [!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> Keep files created and updated by Copilot agent mode until it is finished.
> Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Prompt for GitHub Copilot in agent mode to start the creation of our application

> **Prompt**
>
> ```prompt
> Let's take the following step by step and generate instructions in this order and execute the commands.
> Use docs/mona-high-school-fitness-tracker.md as a guide for the project structure and requirements.
>
> 1. Understand the story of creating the fitness application from the docs/octofit_story.md file.
> 2. Create the initial directory structure for the octofit-tracker application octofit-tracker/backend, octofit-tracker/frontend.
> 3. Setup the backend python virtual environment, requirements.txt based on docs/mona-high-school-fitness-tracker.md, and install required packages.
>
> Don't proceed with the next activity until all of these steps are completed.
>```
>

> [!IMPORTANT]
> Once the above activity installs all the required packages, proceed to the next activity.

### :keyboard: Activity: Let's install mongoDB

> **Prompt**
>
> ```prompt
> Based on the example monafit tracker app in the docs/mona-high-school-fitness-tracker.md file and use octofit as the name for mergington's high schools app. > Let's install mongoDB.
>
> 1. Install mongoDB and make sure the command is complete.
>
> Don't proceed with the next activity until all of these steps are completed.
>```

> [!IMPORTANT]
> If the command completes in the terminal but agent mode shows it is still running click stop.
> You may need to paste the prompt again in agent mode.

### :keyboard: Activity: Let's start and verify mongoDB is running

> **Prompt**
>
> ```prompt
> Based on the example monafit tracker app in the docs/mona-high-school-fitness-tracker.md file and use octofit as the name for mergington's high schools app. > Let's start and verify mongoDB is running.
>
> 1. Start the mongoDB service.
> 2. Verify the mongoDB service running.
>
> Don't proceed with the next activity until all of these steps are completed.
>```

> [!NOTE]
> You may not need to run this step if it was already started in the previous step.

> [!IMPORTANT]
> If the command completes in the terminal but agent mode shows it is still running click stop.
> You may need to paste the prompt again in agent mode.

1. Now that we have created the app directory structure, setup a Python virtual environment, and Copilot agent mode helped write a requirements.txt to install all project dependencies let's check our changes in to our `build-octofit-app` branch.

1. With our new changes complete, please **commit** and **push** the changes to GitHub.

1. Wait a moment for Mona to check your work, provide feedback, and share the final lesson. Almost done!

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your commit changes were made for the following file to the branch `build-octofit-app` and pushed/synchronized to GitHub:
  - `octofit-tracker/backend/requirements.txt` and it contains the package `Django==4.1`
- If Mona found a mistake, simply make a correction and push your changes again. Mona will check your work as many times as needed.

</details>
