# Exercise validation

Run the repository-owned validation before publishing:

```bash
node .github/scripts/validate-exercise.mjs
node --test tests/exercise-validation.test.mjs
```

The structural validator checks step completeness, step/workflow parity, toolkit pinning, workflow permissions, safe issue-comment replacement, final merge gating, and leftover placeholders.

The negative fixture suite confirms that:

- Missing Theory content is rejected.
- Unsafe issue-comment replacement is rejected.
- Closing an unmerged pull request cannot finish the exercise.
- A fresh template cannot pass Step 2 before the learner creates the application.
- A placeholder seed script cannot pass Step 3.
- Frontend API configuration without a localhost fallback cannot pass Step 5.
- Every resource defines its own Mongoose schema and model.
- Seed data is written for every required resource.
- API path strings without Express route registration are rejected.
- Every resource view requests its own endpoint and is connected to React Router.
- Mixed read/write workflow-level permissions are rejected.
- Every replace-mode comment update traces to its own safely scoped lookup.
- A merge expression in an unused comment cannot satisfy final workflow gating.

## Fresh-template publication check

Before releasing a new version:

1. Create a repository from the template.
2. Confirm only Step 0 is enabled initially.
3. Follow the issue from Step 1 through Step 6 using a new `build-octofit-app` branch.
4. Intentionally fail each graded step once and confirm the feedback identifies the missing behavior.
5. Add an issue comment before retrying a failed step and confirm automation updates only the marked feedback comment.
6. Close one pull request without merging and confirm the exercise remains open.
7. Merge a passing pull request and confirm both application tiers build before the final review is posted.
