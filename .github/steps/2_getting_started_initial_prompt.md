## Step 2: Getting started: The initial prompt GitHub Copilot agent mode

In this step, as the gym teacher at Mergington High School, you will use GitHub Copilot agent mode to create a full stack application based on markdown files in the `docs` directory provided in the codebase. 

### :keyboard: Activity: Prompt for GitHub Copilot in agent mode to start the creation of our application

1 - Click the GitHub Copilot Chat "COPILOT EDITS" tab click the :paperclip: and add the codebase and the folder/docs to the context

2 - Copy and past the following prompt in the GitHub Copilot Chat "COPILOT EDITS" tab and select the "Agent" instead of "Edit" from the drop down where you are adding the prompt.

>[!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.

```text
Create a full stack application based on the markdown files in the markdown files provided in the main README.md and docs directory.

Let's take this step by step 
1 - Understand the story of creating the fitness application from the docs/exercise_background.md file.
2 - Create the application structure based on the instructions provided in the docs/app_instructions_for_copilot.md with the correct versions in the octofit-tracker directory. The React framework, Python Django, and Mongodb. 
```
Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

Wait a moment for the Copilot to respond and press the continue button which will launch a new terminal window to execute each command presented by Copilot agent mode to create the application structure.

> [!NOTE]
> If there any questions, in the Copilot terminal answer `(y)` by hitting enter/return and follow the instructions provided.

### :keyboard: Activity: GitHub Copilot agent mode creating and updating files

Now let's prompt agent mode to create and update all files required for the React framework, Python Django, and Mongodb.

```text
Now that we have the structure let's continue to create the files required for the React framework, Python Django, and Mongodb based on the docs/app_instructions_for_copilot.md file.

1 - Create and update all files required for the React framework, Python Django, and Mongodb.
2 - Create a requirements.txt in the octofit-tracker directory for python required packages.
3 - Create react framework and other npm packages required for the project.
```

Wait a moment for the Copilot to respond and press the continue button which will launch a new terminal window to execute each command presented by Copilot agent mode to create the application structure.
