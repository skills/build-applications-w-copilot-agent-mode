# Maintainer validation

Run these checks before publishing or after changing exercise content, automation, the devcontainer, or the starter scaffold.

```bash
node .github/scripts/validate-exercise.mjs
node --test tests/exercise-validation.test.mjs
npm ci --prefix octofit-tracker/backend
npm ci --prefix octofit-tracker/frontend
npm run build --prefix octofit-tracker/backend
npm run build --prefix octofit-tracker/frontend
```

The starter application tests are intentionally red until a learner implements each capability. Use the grading script checks and negative fixtures to verify the exercise contract.

## Reset and publication checklist

1. Confirm the repository is configured as a template and `0-start-exercise.yml` has its automatic `push` trigger.
2. Confirm all numbered workflows use the same `skills/exercise-toolkit@v0.9.3` pin. The toolkit start workflow disables every numbered workflow, then Step 0 enables Step 1.
3. Create a fresh repository from the template and confirm the exercise issue appears without manually dispatching a workflow.
4. Intentionally fail each graded step once and confirm its marked feedback comment is replaced rather than duplicated.
5. To reset a disposable test copy, delete the exercise issue and recreate the repository from the template. Do not manually enable later step workflows in the published template.
6. Close a pull request without merging and confirm the exercise remains open; then merge a passing pull request and confirm the final review is posted.
