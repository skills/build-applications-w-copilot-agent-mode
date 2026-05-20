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
> - Update src/App.jsx and src/main.jsx
> - Update src/components/Activities.jsx
> - Update src/components/Leaderboard.jsx
> - Update src/components/Teams.jsx
> - Update src/components/Users.jsx
> - Update src/components/Workouts.jsx
> - Use react-router-dom for navigation
> - Use Vite environment variables via `import.meta.env`, for example `import.meta.env.VITE_CODESPACE_NAME`
> - Document that `VITE_CODESPACE_NAME` must be defined (for example in `.env.local`)
> - Use API endpoints under:
>   https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
> - Add a safe fallback if `VITE_CODESPACE_NAME` is unset to avoid `https://undefined-8000...` URLs
> - Keep compatibility with paginated and array responses
> ```

### :keyboard: Activity: Run and verify the presentation tier

Run the React app with the Vite dev server (for example, `npm run dev`) and open port `5173`.

1. Commit and push your changes.

1. Wait for Mona to verify and post the final lesson.

<details>
<summary>Having trouble? 🤷</summary><br/>

Confirm these files include the expected endpoint paths:

- `Activities.jsx` -> `/api/activities/`
- `Leaderboard.jsx` -> `/api/leaderboard/`
- `Teams.jsx` -> `/api/teams/`
- `Users.jsx` -> `/api/users/`
- `Workouts.jsx` -> `/api/workouts/`

</details>
