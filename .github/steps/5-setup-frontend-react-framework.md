## Step 5: Build the React presentation tier of the multi-tier application

> [!NOTE]
> This step implements the **presentation tier** for your modern multi-tier application.

In this step, you will:

- Complete React 19 frontend components.
- Connect each view to the backend API routes.
- Use React Router for navigation.

### 📖 Theory:

React components turn API data into navigable views. A shared environment-aware API base URL prevents deployment details from leaking into every component, while a local fallback keeps the same interface usable outside Codespaces.

### ⌨️ Activity: Implement frontend components and routing

1. Ask Copilot to implement the React presentation tier.

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
   > - Use /api/activities/, /api/leaderboard/, /api/teams/, /api/users/, and /api/workouts/
   > - Add a safe localhost fallback if `VITE_CODESPACE_NAME` is unset
   > - Keep compatibility with paginated and array responses
   > ```

### ⌨️ Activity: Run and verify the presentation tier

1. Start the Vite development server.

   > ![Static Badge](https://img.shields.io/badge/-Terminal-0969da?style=flat-square&logo=gnometerminal&logoColor=white&labelColor=0969da)
   >
   > ```bash
   > npm run dev --prefix octofit-tracker/frontend
   > ```

1. Open forwarded port `5173` and confirm each navigation view loads data without browser errors.

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
