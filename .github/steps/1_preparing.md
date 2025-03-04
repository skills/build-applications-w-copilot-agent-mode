## Step 1: Preparing to build your application with GitHub Copilot agent mode

### Prerequisites

- GitHub account
- GitHub Copilot license

### OctoFit Tracker technology stack

- NodeJS: Version v20.17.0
- ReactJS: Version v18.3.1
- Python Django: Version v4.1

### Ok, let's get to developing! :mechanical_arm:

Before we get started on your extension, we have to configure our development environment.
Fortunately, this has been bootstrapped for us with a pre-configured [Codespace](https://github.com/features/codespaces).

This development environment includes:

- The Node.js runtime.
- A template GitHub Extension (javascript web app service).
- [VS Code](https://code.visualstudio.com/) launch settings to start your extension in debug mode.

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
   - Our `.github/steps` folder contains the instructions to guide Copilot agent mode to build your application. More on that in the next steps!


1. Create a new branch named `my-ghc-application`. Ensure it is checked out in VS Code and published to GitHub.

   - Note: Creating this branch triggers the next step in your exercise.
