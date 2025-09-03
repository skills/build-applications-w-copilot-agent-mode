## Step 1: Hello GitHub Copilot agent mode

Welcome to your **"Build applications with GitHub Copilot agent mode"** exercise! :robot:

In this exercise, you will be using GitHub Copilot agent mode to build an application that tracks your fitness goals and progress. 🏋️‍♂️🏃‍♀️💪

### What is GitHub Copilot agent mode?

Copilot agent mode can create apps from scratch, refactor across multiple files, write and run tests, and migrate legacy code to modern frameworks. It can automatically generate documentation, integrate new libraries, or help answer questions about a complex codebase. Copilot agent mode helps you be super-productive by having an AI collaborator that understands the workspace. It can orchestrate your inner development flow while keeping you in control.

Copilot agent mode operates in a more autonomous and dynamic manner to achieve the desired outcome. To process a request, Copilot loops over the following steps and iterates multiple times as needed:

Determines the relevant context and files to edit autonomously.
Offers both code changes and terminal commands to complete the task. For example, Copilot might compile code, install packages, run tests, and more.
Monitors the correctness of code edits and terminal command output and iterates to remediate issues.

> [!NOTE]
> You can learn more about GitHub Copilot agent mode in the [Use agent mode documentation](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode).

### :keyboard: Activity: Getting to know your GitHub Copilot agent mode development environment

1. Right-click the below button to open the **Create Codespace** page in a new tab.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

   - The free tier of Codespaces that comes with all GitHub accounts is fine, assuming you still have minutes available.
   - The default Codespace settings are fine.

1. Confirm the **Repository** field is your copy of the exercise, not the original, then click the green **Create Codespace** button.

   - ✅ Your copy: `/{{full_repo_name}}`
   - ❌ Original: `/skills/build-applications-w-copilot-agent-mode`

1. Wait a moment for Visual Studio Code to load.

1. Before we continue let's take a moment to familiarize ourselves with the project folder.

   - The left navigation bar is where you can access the file explorer, debugger, and search.
   - The lower panel (Ctrl+J) shows the debugger output, allows running terminal commands, and allows configuring the web service ports.
   - Our docs folder contains the another sample application repository that will give Copilot agent mode context to build your application. More on that in the next steps!

1. At the top of VS Code, locate and click the Copilot icon to open a Copilot Chat panel.

   <img width="150" alt="image" src="https://github.com/user-attachments/assets/5e64db46-95cb-415d-badc-b6b8677f10c1" />

1. If this is your first time using GitHub Copilot, you will have to accept the usage terms to continue.
    - Click the **Accept** button to continue.

### :keyboard: Activity: Use Copilot agent mode to create a branch and publish it. 🙋

Great work! Let's ask copilot for help starting a branch so we can do some customizing.

> [!NOTE]
> - Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> - Wait a moment for the Copilot to respond and press the **Continue** button to execute commands presented by Copilot agent mode.

1. If not already there, return to VS Code.
1. Open the GitHub Copilot Chat window if not already open.
1. Copy and paste the following prompt in the GitHub Copilot Chat and select the **Agent** instead of **Ask** or **Edit** from the drop down where you are inserting the prompt.

   <img src="https://github.com/user-attachments/assets/b9e291be-d835-4de0-ac1c-35a6ec3ea72d" width=30% height=30%>

1. Let's ask Copilot agent mode to help us remember the command and create the branch `build-octofit-app` and publishing it

   > ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
   >
   > ```prompt
   > Please create and publish a new Git branch called build-octofit-app
   > ```

   Copilot agent mode will respond and prompt you to **continue** to execute the command.<br/>

   <img src=https://github.com/user-attachments/assets/d1652fc1-78e5-49c6-9303-b455815eea8f width=40% height=40%>

1. Now that we are happy with the command, press the `Continue` button to let Copilot agent mode run it for us. No need to copy and paste!

1. After a moment, look in the VS Code lower status bar, on the left, to see the active branch. It should now say `build-octofit-app`. If so, you are all done with this step!

1. Now that your branch is pushed to GitHub, Mona should already be busy checking your work. Give her a moment and keep watch in the comments. You will see her respond with progress info and the next lesson.

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your created the branch with the exact name `build-octofit-app`. No prefixes or suffixes.
- Make sure the branch was indeed published to your repository.

</details>
