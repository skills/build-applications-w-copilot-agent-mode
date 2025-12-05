## Step 2: The initial application setup: Directory structure, Python requirements, and MongoDB

> [!NOTE]
> **Behind the scenes:** This exercise uses custom instruction files that help guide GitHub Copilot's responses. The instruction file `.github/instructions/octofit_tracker_setup_project.instructions.md` contains project structure guidelines, Python package requirements, and MongoDB configuration that Copilot references when generating code for this step.

In this step, we will accomplish the following:

- Create the octofit-tracker application directory structure.
- Create the octofit-tracker/backend and octofit-tracker/frontend directories.
- Create the octofit-tracker/backend/requirements.txt file.

> [!NOTE]
> Copy and paste the following prompt(s) in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.
> - Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> - Wait a moment for the Copilot to respond and press the `Continue` button to execute commands presented by Copilot agent mode.
> - Keep files created and updated by Copilot agent mode until it is finished.
> - Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

**Open up a new Copilot Chat session by hitting the plus `+` icon in the Copilot Chat pane.**

### :keyboard: Activity: Prompt for GitHub Copilot in agent mode to start the creation of our application

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's take the following step by step execute the commands.
> 
> Follow the instructions
>
> - Follow the OctoFit Tracker App structure
> - Follow the Python virtual environment creation
> - Create the requirements.txt file
> - Install the Python requirements from the file created
>```

1. Now that we have created the app directory structure, setup a Python virtual environment, and Copilot agent mode helped write a `requirements.txt` to install all project dependencies, let's check our changes in to our `build-octofit-app` branch.

1. With our new changes complete, please **commit** and **push** the changes to branch `build-octofit-app`.

1. Wait a moment for Mona to check your work, provide feedback, and share the next lesson so we can keep working!

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your commit changes were made for the following file to the branch `build-octofit-app` and pushed/synchronized to GitHub:
  - `octofit-tracker/backend/requirements.txt` and it contains the package `Django==4.1`
- If Mona found a mistake, simply make a correction and push your changes again. Mona will check your work as many times as needed.

</details>
