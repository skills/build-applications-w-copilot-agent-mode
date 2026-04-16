## Step 5: Build the React presentation tier of the multi-tier application

> [!NOTE]
> This step implements the **presentation tier** for your modern multi-tier application.

In this step, you will:

- Complete React 19 frontend components.
- Connect each view to the backend API routes.
- Use React Router for navigation.

### :keyboard: Activity: Implement frontend components and routing

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's update the React 19 presentation tier for this multi-tier application.
>
> - Update src/App.js and src/index.js
> - Update src/components/Activities.js
> - Update src/components/Leaderboard.js
> - Update src/components/Teams.js
> - Update src/components/Users.js
> - Update src/components/Workouts.js
> - Use react-router-dom for navigation
> - Use API endpoints under:
>   https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/[component]/
> - Keep compatibility with paginated and array responses
> ```

### :keyboard: Activity: Run and verify the presentation tier

Run the React app from VS Code debug tools and open port `3000`.

1. Commit and push your changes.

1. Wait for Mona to verify and post the final lesson.

<details>
<summary>Having trouble? 🤷</summary><br/>

Confirm these files include the expected endpoint paths:

- `Activities.js` -> `/api/activities/`
- `Leaderboard.js` -> `/api/leaderboard/`
- `Teams.js` -> `/api/teams/`
- `Users.js` -> `/api/users/`
- `Workouts.js` -> `/api/workouts/`

</details>
