## Step 1: Hello GitHub Copilot agent mode

Welcome to your **"Build applications with GitHub Copilot agent mode"** exercise! :robot:

In this exercise, you will be using GitHub Copilot agent mode to build an application that tracks your fitness goals and progress. 🏋️‍♂️🏃‍♀️💪

### What is GitHub Copilot agent mode?

Copilot agent mode can create apps from scratch, perform refactorings across multiple files, write and run tests, and migrate legacy code to modern frameworks. It can automatically generate documentation, integrate new libraries, or help answer questions about a complex codebase. Copilot agent mode helps you be super-productive by having an AI collaborator that understands the workspace. It can orchestrate your inner development flow while keeping you in control.

Copilot agent mode operates in a more autonomous and dynamic manner to achieve the desired outcome. To process a request, Copilot loops over the following steps and iterates multiple times as needed:

Determines the relevant context and files to edit autonomously.
Offers both code changes and terminal commands to complete the task. For example, Copilot might compile code, install packages, run tests, and more.
Monitors the correctness of code edits and terminal command output and iterates to remediate issues.

> [!TIP]
> You can learn more about GitHub Copilot agent mode in the [Use agent mode documentation](https://code.visualstudio.com/docs/copilot/copilot-edits#_use-agent-mode-preview).
>
> [!NOTE]
 Copilot agent mode is a preview feature available in [Visual Studio Code Insiders](https://code.visualstudio.com/insiders).

Your most common interactions with Gitub Copilot will likely be:

- **Inline suggestions**: As you type, Copilot uses the nearby context to suggest code directly in your editor. This will be a familiar interaction if you have used code completion tools like [Intellisense](https://code.visualstudio.com/docs/editor/intellisense), except that the completions may be entire functions.
- **Copilot Chat**: A dedicated chat panel that lets you ask coding related questions. This will feel familiar if you have used online AI assistant chats. The big difference however, is that your project files will provide automatic context to provide tailored responses.
- **Copilot Edits**: Similar to Copilot Chat, but less conversational and more big picture or goal oriented.
- **Copilot agent mode**: Operates in a more autonomous and dynamic manner to achieve the desired outcome. To process a request, Copilot loops over the following steps and iterates multiple times as needed:
  - Determines the relevant context and files to edit autonomously.
  - Offers both code changes and terminal commands to complete the task. For example, Copilot might compile code, install packages, run tests, and more.
  - Monitors the correctness of code edits and terminal command output and iterates to remediate issues.

> [!TIP]
> You can learn more about current and preview features in the [GitHub Copilot Features](https://docs.github.com/en/copilot/about-github-copilot/github-copilot-features) documentation.
>
> [!TIP]
> You can also select different [models](https://docs.github.com/en/github-models) and [extensions](https://github.com/features/copilot/extensions), but that's for a different lesson!

Before we get started on developing an application in GitHub Copilot agent mode, we have to configure our development environment.
Fortunately, this has been bootstrapped for us with a pre-configured [Codespace](https://github.com/features/codespaces).

This development environment includes:

- React.js frontend.
- Django REST Framework backend.
- MongoDB database.
- The Node.js runtime.
- The Python runtime.
  - forwardPorts
    - 3000, // React default port
    - 8000, // Django default port
    - 27017 // MongoDB default port
- VS Code extensions:
  - GitHub Copilot/Copilot Chat insiders
  - Python
  - Markdown linter
- [VS Code](https://code.visualstudio.com/) launch settings to start your application in debug mode.

### :keyboard: Activity: Getting to know your GitHub Copilot agent mode development environment

1. Right-click the below button to open the **Create Codespace** page in a new tab.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

   - The free tier of Codespaces that comes with all GitHub accounts is fine, assuming you still have minutes available.
   - The default Codespace settings are fine.

1. Confirm the **Repository** field is your copy of the exercise, not the original, then click the green **Create Codespace** button.

   - ✅ Your copy: `/{{{full_repo_name}}}`
   - ❌ Original: `/skills/build-applications-w-copilot-agent-mode`

1. Wait a moment for Visual Studio Code to load.

1. Before we continue let's take a moment to familiarize ourselves with the project folder.

   - The left navigation bar is where you can access the file explorer, debugger, and search.
   - The lower panel (Ctrl+J) shows the debugger output, allows running terminal commands, and allows configuring the web service ports.
   - Our docs folder contains the another sample application repository that will give Copilot agent mode context to build your application. More on that in the next steps!

1. At the top of VS Code, locate and click the Copilot icon to open a Copilot Chat panel.

<img width="150" alt="image" src="https://github.com/user-attachments/assets/5e64db46-95cb-415d-badc-b6b8677f10c1" />

1. If this is your first, time using GitHub Copilot, you will have to accept the usage terms to continue.
    - Click the **Accept** button to continue.
    - If you are using Copilot Chat for the first time, you will also have to accept the usage terms to continue.
    - Click the **Accept** button to continue.

### :keyboard: Activity: Use Copilot to help remember a terminal command 🙋

Great work! Now that we are familiar with the app and we know it works, let's ask copilot for help starting a branch so we can do some customizing.

1. If not already there, return to VS Code.

1. In the bottom panel, select the **Terminal** tab. On the right side, click the plus `+` sign to create a new terminal window.

   > **Note:** This will avoid stopping the existing debug session that is hosting our web application service.

1. Within the new terminal window, `right click` and select `Copilot` then `Terminal Inline Chat`. Alternately, you can use the keyboard shortcut `Ctrl + I` (windows) or `Cmd + I` (mac).

1. Let's ask Copilot to help us remember a command we have forgotten: creating a branch and publishing it

   > <img width="13px" src="https://github.com/user-attachments/assets/98fd5d2e-ea29-4a4a-9212-c7050e177a69" /> **Prompt**
   >
   > ```prompt
   > Hey copilot, how can I create and publish a new Git branch?
   > ```

   > **Tip:** This is a simple example, but Copilot is great at providing more tailored commands that might involve loops, pattern matching, file modification, and more! Don't be afraid to ask Copilot for a suggestion. Just remember it is a suggestion and you should always verify it first to be safe.

1. Copilot probably gave us a command like the following. Rather than manually modify it, let's respond back to tell Copilot to use a particular name.

   ```bash
   git checkout -b {new_branch_name}
   git push -u origin {new_branch_name}
   ```

   > <img width="13px" src="https://github.com/user-attachments/assets/98fd5d2e-ea29-4a4a-9212-c7050e177a69" /> **Prompt**
   >
   > ```prompt
   > Awesome! Thanks, Copilot! Let's use the
   > branch name "build-ocotofit-app".
   > ```

   > **Tip:** If Copilot doesn't give you quite what you want, you can always continue explaining what you need. Copilot will remember the conversation history for follow-up responses.

1. Now that we are happy with the command, press the `Run` button to let Copilot run it for us. No need to copy and paste!

1. After a moment, look in the VS Code lower status bar, on the left, to see the active branch. It should now say `build-ocotofit-app`. If so, you are all done with this step!

1. Now that your branch is pushed to GitHub, Mona should already be busy checking your work. Give her a moment and keep watch in the comments. You will see her respond with progress info and the next lesson.

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your created the branch with the exact name `build-ocotofit-app`. No prefixes or suffixes.
- Make sure the branch was indeed published to your repository.

</details>
