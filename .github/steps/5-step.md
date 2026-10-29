## Step 5: Verify the system and merge a reviewed pull request

Continue on the `build-octofit-app` branch and keep each Copilot request bounded by the tests for this tier.

### 📖 Theory: Integration evidence before merge

Passing isolated tests is necessary but not sufficient for a multi-tier application. The final verification should prove the data, API, and UI contracts agree, then use a pull request to review the complete change as one system. Copilot can summarize and review the diff, but you remain responsible for checking the evidence and resolving issues before merge.

### ⌨️ Activity: Verify the system and merge a reviewed pull request

1. Run the complete verification suite and both production builds.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run test:data --prefix octofit-tracker/backend
   > npm run test:api --prefix octofit-tracker/backend
   > npm test --prefix octofit-tracker/frontend
   > npm run build --prefix octofit-tracker/backend
   > npm run build --prefix octofit-tracker/frontend
   > ```

1. Confirm MongoDB is running, then start the API in a dedicated terminal and leave it running.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > ps aux | grep mongod
   > npm run seed --prefix octofit-tracker/backend
   > npm run dev --prefix octofit-tracker/backend
   > ```

1. In a second terminal, start the frontend and leave it running.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm run dev --prefix octofit-tracker/frontend -- --host 0.0.0.0
   > ```

1. Open forwarded port 5173, verify all four user journeys, and trigger at least one visible error path.

1. Open a pull request from `build-octofit-app` to `main`, include test evidence, and use Copilot Summary or code review to inspect the multi-tier diff.

1. Address valid findings, rerun the checks, and merge the pull request.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Do not merge a closed or failing pull request.
- Confirm environment-aware URLs use the Codespaces name only when present.
- Check the Actions run for the first failing tier and reproduce it locally.
- If the final check fails after merging, fix the issue on `build-octofit-app`, rerun the tests above, and merge a new pull request into `main`. Final grading runs on merged pull requests only.

</details>
