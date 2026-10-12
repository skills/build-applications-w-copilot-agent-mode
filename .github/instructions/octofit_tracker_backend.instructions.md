---
applyTo: "octofit-tracker/backend/**"
---

# OctoFit backend instructions

- Use Express, TypeScript, Mongoose, and explicit service functions.
- Keep routes under `/api/` and return deliberate 4xx responses for invalid input.
- Keep model validation in Mongoose schemas and business behavior in services.
- Use the shared database configuration instead of hard-coded connection logic.
- Seed stable demo records with upserts; never clear collections that may contain user data, and reconcile an existing demo user's previous team membership when moving that fixture.
