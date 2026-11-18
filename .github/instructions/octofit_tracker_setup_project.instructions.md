---
applyTo: "**/*"
---

# OctoFit project setup instructions

Preserve these constraints across every tier:

- Use MongoDB on port 27017, the Express API on port 8000, and Vite on port 5173.
- Keep presentation, logic, and data responsibilities separated.
- Prefer small test-driven changes over broad regeneration.
- Do not introduce authentication in this exercise; leave it as a follow-up challenge.
- Do not commit, push, or open pull requests. Each push to `build-octofit-app` triggers exercise grading, so the learner reviews, commits, and pushes after the tier's tests pass.
