---
applyTo: "octofit-tracker/backend/**"
---
# Octofit Tracker Logic + Data Tier Guidelines

## Logic tier (Node.js + Express + TypeScript)

- Build API routes under `/api/`.
- Keep API service on port `8000`.
- Use environment-aware Codespaces URLs via `CODESPACE_NAME`.

Example base URL logic:

```ts
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';
```

## Data tier (MongoDB + Mongoose)

- Use Mongoose models for users, teams, activities, leaderboard, and workouts.
- Connect to `octofit_db`.
- Validate endpoints with `curl` after wiring routes.
