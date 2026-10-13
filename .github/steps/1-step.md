## Step 1: Read the architecture and establish a test baseline

Welcome @{{ login }}! You are extending OctoFit Tracker for a school fitness program. Start by reading the contracts and making the current failures reproducible.

### 📖 Theory: Contracts before generation

Agent mode is most reliable when it has explicit boundaries and executable acceptance criteria. The architecture document explains ownership across React, Express, and MongoDB, while the failing test suites show which behavior is intentionally incomplete. Reading both before editing lets you ask Copilot for a bounded plan instead of a broad application-generation prompt.

### ⌨️ Activity: Read the architecture and establish a test baseline

1. Open the button below in a new tab and create a Codespace for your copy of the exercise using the default configuration.

   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/{{full_repo_name}}?quickstart=1)

1. In the Codespace, create and publish a working branch named `build-octofit-app`.

1. Check whether MongoDB is running before you run integration tests.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > ps aux | grep mongod
   > ```

1. Install both tier dependencies and capture the red test baseline.

   > ![Static Badge](https://img.shields.io/badge/Terminal-text?logo=gnometerminal&labelColor=0969da&color=ddf4ff)
   >
   > ```bash
   > npm ci --prefix octofit-tracker/backend
   > npm ci --prefix octofit-tracker/frontend
   > npm test --prefix octofit-tracker/backend
   > npm test --prefix octofit-tracker/frontend
   > ```

1. Ask Copilot to inspect before editing.

   > ![Static Badge](https://img.shields.io/badge/Prompt-text?style=for-the-badge&logo=github-copilot&logoColor=white&labelColor=purple&color=purple)
   >
   > ```text
   > Read docs/architecture.md and summarize the tier boundaries, current failing tests, and the smallest safe implementation order. Do not edit files.
   > ```

1. Complete the implementation decisions and test plan in `docs/architecture.md`, then commit and push your branch.

<details>
<summary>Having trouble? 🤷</summary><br/>

- Use `--prefix` so every command runs from the repository root.
- Only ports 8000, 5173, and 27017 should appear in app configuration.
- If MongoDB is not running, follow the Codespaces setup notes before continuing.

</details>
