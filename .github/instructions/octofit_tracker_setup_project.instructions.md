---
applyTo: "**"
---
# Octofit Tracker Multi-tier Application Setup Guidelines

## Application goals

Build an Octofit Tracker **multi-tier application** with:

- User authentication and profiles
- Activity logging and tracking
- Team creation and management
- Competitive leaderboard
- Personalized workout suggestions

## Command execution rules

- Never change directories in commands.
- Always reference target paths directly.

## Forwarded ports

- 8000: public (logic/API tier)
- 3000: public (presentation tier)
- 27017: private (data tier)

Do not propose any other ports to forward or make public.

## Project structure

```text
octofit-tracker/
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    └── package.json
```

## Stack requirements

### Presentation tier

- React 19 with Vite
- react-router-dom for navigation
- bootstrap for styling

### Logic tier

- Node.js (LTS)
- Express
- TypeScript

### Data tier

- MongoDB (`mongodb-org`)
- Mongoose for data access

## MongoDB service expectations

- Always use `ps aux | grep mongod` to check whether mongod is running.
- `mongodb-org` is the official MongoDB package.
- `mongosh` is the official client tool.
- Use Mongoose models from the logic tier for schema/data work instead of ad-hoc raw scripts.
