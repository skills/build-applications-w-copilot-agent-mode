## Step 4: Setup django REST Framework, restart the server, and test the API

In this step, we will will accomplish the following:

- Setup the django REST Framework.
- Restart the server.
- Test the API using curl.

1. Open all files in the `docs` folder and keep this file open in the editor.
2. Click the GitHub Copilot Chat "COPILOT EDITS" tab click the :paperclip: and add "Open Editors" to the prompt.
3. Copy and paste the following prompt in the GitHub Copilot Chat "COPILOT EDITS" tab and select the "Agent" instead of "Edit" from the drop down where you are inserting the prompt.

>[!NOTE]
> Do not change the model from GPT-4o this will be an optional activity at the end of the course.
> Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> Keep files created and updated by Copilot agent mode until it is finished.
> Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Setup django REST Framework, restart the server, and test the API

```text
Based on the requirements in the docs/mergington-tech-policies.md file. Let's setup the django REST Framework, restart the server, and test the API.
1. Activate the python virtual environment.
2. Install the django REST Framework.
3. Update the octofit-tracker/backend/octofit_tracker/settings.py file to include the django REST Framework.
4. update views.py to replace the return for the rest api url endpiints with the codespace url https://[REPLACE-THIS-WITH-YOUR-CODESPACE-NAME]-8000.app.github.dev for django
  1.Replace [REPLACE-THIS-WITH-YOUR-CODESPACE-NAME] with your codespace name.
5. Activate the python virtual environment.
6. Restart the server.
7. Test the API using curl.
8. Verify the API is working correctly.

Don't proceed with the next activity until all of these steps are completed.
```

>[!IMPORTANT]
> Make sure to replace [REPLACE-THIS-WITH-YOUR-CODESPACE-NAME] with your codespace name.
> ex. https://redesigned-spork-g6pj46rr9hpp6x-8000.app.github.dev