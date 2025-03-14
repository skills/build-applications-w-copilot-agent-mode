## Step 2: Getting started: The initial prompt to setup the application structure and Python requirements

In this step, we will will accomplish the following:
- Create the octofit-tracker application directory structure.
- Create the octofit-tracker/backend and octofit-tracker/frontend directories.
- Create the octofit-tracker/backend/requirements.txt file. 

### :keyboard: Activity: Prompt for GitHub Copilot in agent mode to start the creation of our application

1. Open all files in the `docs` folder and keep this file open in the editor.
2. Click the GitHub Copilot Chat "COPILOT EDITS" tab click the :paperclip: and add "Open Editors" to the prompt.
3. Copy and paste the following prompt in the GitHub Copilot Chat "COPILOT EDITS" tab and select the "Agent" instead of "Edit" from the drop down where you are inserting the prompt.
>[!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.

```text
Let's take thhe following step by step and generate instructions in this order and execute the commands.
Use docs/mergington-tech-policies.md as a guide for the project structure and requirements.

1. Understand the story of creating the fitness application from the docs/octofit_story.md file.
2. Create the initial directory structure for the octofit-tracker application octofit-tracker/backend, octofit-tracker/frontend.
3. Setup the backend python virtual environment, requirements.txt, and install required packages.

Don't proceed with the next activity until all of these steps are completed.
```

Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

Wait a moment for the Copilot to respond and press the continue button which will launch a new terminal window to execute each command presented by Copilot agent mode to create the application structure.
Keep files creating and updating until the Copilot agent mode has finished.

> [!NOTE]
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> GitHub Copilot agent mode will create the directory structure and install the required packages for the React framework, Python Django, and MongoDB. It will also create and edit files for the project as needed.
> If there any questions, in the Copilot terminal answer `(y)` by hitting enter/return key and follow the instructions provided.
> It may not create the requirements.txt file at first but GitHub Copilot agent mode should recognize the error and create it in the next response.

### :keyboard: Activity: Setup the Python Django project/app

```text
Now let's prompt agent mode to setup the Python Django project/app based on the requirements in the docs/mergington-tech-policies.md file.

1. The octofit-tracker/backend directory will store the django project and app with the name octofit-tracker.
2. Start the django project and app with the name octofit-tracker and verify it is running.

Don't proceed with the next activity until all of these steps are completed.
```

Wait a moment for the Copilot to respond and press the continue button to execute each command presented by Copilot agent mode.
Keep files creating and updating until the Copilot agent mode has finished.

### :keyboard: Activity: Let's install and start the mongoDB database

```text
Now let's prompt GitHub Copilot agent mode install and start the mongoDB based on the requirements in the docs/mergington-tech-policies.md file.

Don't proceed with the next activity until all of these steps are completed.
```

Wait a moment for the Copilot to respond and press the continue button to execute each command presented by Copilot agent mode.
Keep files creating and updating until the Copilot agent mode has finished.