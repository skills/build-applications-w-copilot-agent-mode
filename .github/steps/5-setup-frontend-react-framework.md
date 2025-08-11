## Step 5: Setup the frontend React framework, update the components, and start OctoFit Tracker app

In this step, we will accomplish the following:

- Setup the octofit-tracker frontend React framework.
- Update the following components to include the React framework:
  - src/App.js
  - src/index.js
  - src/components/Activities.js
  - src/components/Leaderboard.js
  - src/components/Teams.js
  - src/components/Users.js
  - src/components/Workouts.js
- Start the React app and check the output.

Copy and paste the following prompt(s) in the GitHub Copilot Chat and select the "Agent" instead of "Ask" or "Edit" from the drop down where you are inserting the prompt.

> [!NOTE]
> - Keep in mind that the Copilot agent mode is conversational so it may ask you questions and you can ask it questions too.
> - Wait a moment for the Copilot to respond and press the continue button to execute commands presented by Copilot agent mode.
> - Keep files created and updated by Copilot agent mode until it is finished.
> - Agent mode has the ability to evaluate your code base and execute commands and add/refactor/delete parts of your code base and automatically self heal if it or you makes a mistake in the process.

### :keyboard: Activity: Install the octofit-tracker frontend React framework

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's setup the octofit-tracker frontend React  framework and
> ensure everything is created in the `octofit-tracker/frontend` directory by using `--prefix`
>
> 1. Make sure the the octofit-tracker/frontend directory exists.
> 2. create the react app
> 3. Install react, bootstrap, and react-router-dom
> 4. Import bootstrap css in the src/index.js file.
> 5. Don't change .gitignore file
>```

### :keyboard: Activity: Update the octofit-tracker frontend React components

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's update the octofit-tracker frontend React components.
>
> - Update the following components to include the React framework to point to the backend REST API:
>   - src/App.js
>   - src/index.js
>   - src/components/Activities.js
>   - src/components/Leaderboard.js
>   - src/components/Teams.js
>   - src/components/Users.js
>   - src/components/Workouts.js
> - In each component replace the fetch url with the codespace url
>   https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/[component]/
>   for the Django rest framework backend.
>   make sure all components are pulling data from the REST api endpoint
>   for display in the REACT frontend
> - Make sure to use the correct port and protocol http or https.
> - Update src/App.js to include the main navigation for all components.
> - Make sure react-router-dom is used for the navigation menu.
> - The react app should show the navigation menu and the components.
> - Update all components to log the fetched data and make them compatible with both paginated (.results) and plain array responses.
> - Add console.log statements to each component to log the fetched data and the REST API endpoints.
> ```

### :keyboard: Activity: Start the react app and check the output

Now, let's actually try running the react application! In the left sidebar, select the `Run and Debug` tab and then press the **Start Debugging** icon.

<img src="https://github.com/user-attachments/assets/8ab08e4e-539a-4ca9-8270-be4b1f0df176"  width=30% height=30%>

Go to the running React Frontend url that pops up for port 3000 that looks like the following:

<img alt="react-frontend-port" src="https://github.com/user-attachments/assets/a0c8b213-ee5f-46dd-8675-686a7ba0818f" width=30% height=30%>

Once you open it in your web browser it should look like the following:

<img alt="react-frontend-app" src="https://github.com/user-attachments/assets/f7f1a076-c259-49f6-8aa5-9ebcd5f0698d" width=50% height=50%>

### :keyboard: Activity: Let's add some formatting, structuring, and styling to the octofit tracker app

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's style this like App.css and make it look nice.
>
> - Let's make the App.js and all components javascript files in the app are consistent with the following:
>   - Use bootstrap tables for the data in all javascript components.
>   - Use bootstrap buttons for the buttons.
>   - Use bootstrap headings for the headings.
>   - Use bootstrap links for the links.
>   - Use bootstrap navigation for the navigation menu.
>   - Use bootstrap forms for the forms.
>   - Use bootstrap cards for the cards.
>   - Use bootstrap modals for the modals.
>```

### :keyboard: Optional Activity: Let's make the octofit tracker app look nice, pretty, and add some color

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's style this like App.css and make it look nice.
> 
> -  Edit the App.css file to do the following:
>   - Add some color to the background.
>   - Add some color to the text.
>   - Add some color to the tables.
>   - Add some color to the buttons.
>   - Add some color to the headings.
>   - Add some color to the links.
>   - Add some color to the navigation menu.
> - Add the octofitapp-small logo justified to the left to the app and make it look nice.
> - Add a favicon to the app and make it look nice.
>```

### :keyboard: Optional Activity: Iterate on the appearance and try different models

> [!TIP]
> - Try creating your own prompts to change the application appearance, add features, and try different models.

1. Now that we have created the React frontend for all application components, let's check our changes in to our `build-octofit-app` branch.

1. With our new changes complete, please **commit** and **push** the changes to the `build-octofit-app` branch.

1. Wait a moment for Mona to check your work, provide feedback, and share the next lesson so we can keep working!

<details>
<summary>Having trouble? 🤷</summary><br/>

If you don't get feedback, here are some things to check:

- Make sure your commit changes were made for the following files to the branch `build-octofit-app` and pushed/synchronized to GitHub:
  - `octofit-tracker/frontend/src/components/Activities.js` and it contains `-8000.app.github.dev/api/activities/`
  - `octofit-tracker/frontend/src/components/Leaderboard.js` and it contains `-8000.app.github.dev/api/leaderboard/`
  - `octofit-tracker/frontend/src/components/Teams.js` and it contains `-8000.app.github.dev/api/teams/`
  - `octofit-tracker/frontend/src/components/Users.js` and it contains `-8000.app.github.dev/api/users/`
  - `octofit-tracker/frontend/src/components/Workouts.js` and it contains `-8000.app.github.dev/api/workouts/`
- If Mona found a mistake, simply make a correction and push your changes again. Mona will check your work as many times as needed.

</details>
