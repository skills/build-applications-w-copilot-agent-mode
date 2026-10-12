## Step 4: Build and test the React presentation tier

Continue on the `build-octofit-app` branch and keep each Copilot request bounded by the tests for this tier.

### 📖 Theory: UI states are part of the contract

The presentation tier should make loading, empty, success, and error states visible while keeping API URL construction out of individual components. React Router provides navigable capability views, and component tests prove that API data becomes accessible, meaningful interface output. Testing these states makes Copilot-generated UI easier to trust and maintain.

### ⌨️ Activity: Build and test the React presentation tier

1. Inspect the shared API client, route stubs, and component tests.

1. Ask Copilot for the smallest UI change from one failing test.

   > ![Static Badge](https://img.shields.io/badge/Prompt-text?style=for-the-badge&logo=github-copilot&logoColor=white&labelColor=purple&color=purple)
   >
   > ```text
   > Use the failing frontend test to implement the smallest UI change. Reuse the shared API client and preserve loading, empty, and error states.
   > ```

1. Repeat for activities, teams, leaderboard, and workout suggestions. Every route needs loading, empty, success, and error states, and workout suggestions must call `/api/workouts/suggestions/:userEmail` for a seeded user such as `mona@example.com`.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm test --prefix octofit-tracker/frontend
   > ```

1. Build and manually inspect the Vite app on port 5173.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run build --prefix octofit-tracker/frontend
   > npm run dev --prefix octofit-tracker/frontend -- --host 0.0.0.0
   > ```

1. Commit and push the presentation tier.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Keep the shared API client on relative `/api` paths (with an optional `import.meta.env.VITE_API_BASE_URL` override). The Vite proxy forwards them to port 8000, which stays private.
- Keep fetch logic out of repeated components: each route component imports `getJson` from `src/api/client.ts` and never calls `fetch` directly.
- Check accessible names and semantic status/error output when tests fail.

</details>
