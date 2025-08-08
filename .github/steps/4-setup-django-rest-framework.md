## Step 4: Setup Django REST Framework, start the server, and test the API

In this step, we will accomplish the following:

- Setup the Django REST Framework.
- Start the server.
- Test the API using curl.

Copy and paste the following prompt(s) in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> [!TIP]
> - Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> - Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> - Keep files created and updated by Copilot agent mode until it is finished.
> - Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Setup Django REST Framework and test the REST API endpoints

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's setup codespace for the URL, start the server via VS Code launch.json, and test the API.
>
> 1. Create an environment variable OCTOFIT_API_BASE_URL by executing this command in your terminal export OCTOFIT_API_BASE_URL="$CODESPACE_NAME-8000.app.github.dev"
> 2. Update views.py and urls.py to replace the return for the REST API URL endpoints with the environment variable OCTOFIT_API_BASE_URL https://{OCTOFIT_API_BASE_URL} for Django and avoid certificate HTTPS issues.
> 3. Make sure the Django backend works on your codespace URL (i.e., the value of `OCTOFIT_API_BASE_URL`) by updating `ALLOWED_HOSTS` in `octofit-tracker/backend/octofit_tracker/settings.py`.
> 4. Test the API endpoints using curl command.
>```

> [!IMPORTANT]
> Don't start the Python Django app in the way that GitHub Copilot agent mode suggests hit
> **cancel**. Follow the next activity instead.

### :keyboard: Activity: Start the Python Django app and check the output

Now, let's actually try running the Django application! In the left sidebar, select the `Run and Debug` tab and then press the **Start Debugging** icon.

<img src="https://github.com/user-attachments/assets/baef4dfe-0751-45cb-9e16-8ff26ba9ff58" width=30% height=30%>

1. Now that we have updated our Django product to include our codespace name for the URL endpoint,
   let's check our changes in to our `build-octofit-app` branch.

1. With our new changes complete, please **commit** and **push** the changes to the `build-octofit-app` branch.

1. Wait a moment for Mona to check your work, provide feedback, and share the next lesson so we can keep working!

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your commit changes were made for the following files to the branch `build-octofit-app` and pushed/synchronized to GitHub:
  - `octofit-tracker/backend/octofit_tracker/settings.py`
  - `octofit-tracker/backend/octofit_tracker/views.py`
- If Mona found a mistake, simply make a correction and push your changes again. Mona will check your work as many times as needed.

</details>
