## Step 3: Build the logic and data tiers for the multi-tier application

> [!NOTE]
> **Behind the scenes:** Custom instructions and prompt files guide Copilot while building the logic and data tiers.

In this step, you will implement the backend of the **multi-tier application**:

- Configure MongoDB connection for `octofit_db`.
- Create Express routes for users, teams, activities, leaderboard, and workouts.
- Add a seed script to populate test data.

### :keyboard: Activity: Scaffold the logic tier

Use this prompt file:

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> /create-django-project
> ```

### :keyboard: Activity: Configure and seed the data tier

Use this prompt file:

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> /init-populate-octofit_db
> ```

1. Commit and push your backend changes.

1. Wait for Mona to validate and unlock the next step.

<details>
<summary>Having trouble? 🤷</summary><br/>

Confirm these files include expected content:

- `octofit-tracker/backend/src/config/database.ts` includes `octofit_db` and `mongoose`.
- `octofit-tracker/backend/src/scripts/seed.ts` includes a seed command description.

</details>
