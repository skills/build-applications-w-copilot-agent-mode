## Step 2: Initialize the modern multi-tier application stack

> [!NOTE]
> **Behind the scenes:** This exercise uses custom instruction files to guide Copilot for this multi-tier application setup.

In this step, you will initialize a modern **multi-tier application** foundation:

- Create `octofit-tracker/frontend` and `octofit-tracker/backend`.
- Initialize React 19 (presentation tier) with Vite.
- Initialize a Node.js + Express + TypeScript backend (logic tier).
- Add MongoDB support with Mongoose (data tier).

### :keyboard: Activity: Initialize frontend and backend package manifests

> ![Static Badge](https://img.shields.io/badge/-Prompt-text?style=flat-square&logo=github%20copilot&labelColor=512a97&color=ecd8ff)
>
> ```prompt
> Let's initialize the OctoFit Tracker modern multi-tier application.
>
> Follow the instructions exactly and execute step-by-step:
> - Create octofit-tracker/frontend and octofit-tracker/backend
> - Initialize React 19 in the frontend with Vite
> - Initialize backend package.json for Node.js + Express + TypeScript
> - Add mongoose for MongoDB data access
> - Keep ports at 3000 (frontend), 8000 (backend), and 27017 (MongoDB)
> ```

1. Commit and push to `build-octofit-app`.

1. Wait for Mona to check your work and post the next lesson.

<details>
<summary>Having trouble? 🤷</summary><br/>

Check these files exist and include expected dependencies:

- `octofit-tracker/frontend/package.json` with React 19.
- `octofit-tracker/backend/package.json` with `express` and `mongoose`.

</details>
