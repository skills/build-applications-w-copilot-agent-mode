import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkFinalComposition, checks } from '../.github/scripts/grade-step.mjs';
import { validateExercise } from '../.github/scripts/validate-exercise.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
function temp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'octofit-validation-')); }
function write(root, file, content) { const p = path.join(root, file); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, content); }
function copyMetadata() { const root = temp(); fs.copyFileSync(path.join(repositoryRoot, 'README.md'), path.join(root, 'README.md')); fs.cpSync(path.join(repositoryRoot, '.github'), path.join(root, '.github'), { recursive: true });
  fs.cpSync(path.join(repositoryRoot, '.devcontainer'), path.join(root, '.devcontainer'), { recursive: true });
  for (const file of ['octofit-tracker/frontend/vite.config.ts', 'octofit-tracker/frontend/src/api/client.ts']) { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.copyFileSync(path.join(repositoryRoot, file), path.join(root, file)); }
  return root;
}
function copyAll() { const root = copyMetadata(); for (const dir of ['docs','octofit-tracker']) fs.cpSync(path.join(repositoryRoot, dir), path.join(root, dir), { recursive: true, filter: (source) => !source.includes(`${path.sep}node_modules`) && !source.includes(`${path.sep}dist`) }); return root; }
function completedFixture() {
  const root = copyAll();
  const architecture = path.join(root, 'docs/architecture.md');
  fs.writeFileSync(architecture, fs.readFileSync(architecture, 'utf8')
    .replaceAll(/^- (.*(?:decision|approach)):\s*$/gm, '- $1: Use the documented contract and preserve tier boundaries.'));
  for (const model of ['User', 'Team', 'Activity', 'Workout']) {
    write(root, `octofit-tracker/backend/src/models/${model}.ts`, `import { Schema, model } from 'mongoose';\nconst schema = new Schema({ name: { type: String, required: true } });\nexport const ${model} = model('${model}', schema);\n`);
  }
  write(root, 'octofit-tracker/backend/src/scripts/seed.ts', `import { Activity, Team, User, Workout } from '../models/index.js';\nexport async function seed() {\n  await User.updateOne({}, {}, { upsert: true });\n  await Team.updateOne({}, {}, { upsert: true });\n  await Activity.updateOne({}, {}, { upsert: true });\n  await Workout.updateOne({}, {}, { upsert: true });\n}\n`);
  write(root, 'octofit-tracker/backend/tests/data.contract.test.ts', `it('seeds representative data idempotently and preserves a sentinel', async () => { await seed(); await seed(); expect(sentinel).toBeDefined(); });`);
  write(root, 'octofit-tracker/backend/src/services/completed-contract.ts', `response.status(400); getLeaderboard(); suggestWorkouts(); points; minutes;`);
  for (const [component, route] of [['Activities', 'activities'], ['Teams', 'teams'], ['Leaderboard', 'leaderboard'], ['Workouts', 'workouts/suggestions/mona%40example.com']]) {
    write(root, `octofit-tracker/frontend/src/components/${component}.tsx`, `import { getJson } from '../api/client.js';\nexport async function load${component}() { return getJson<unknown>('/api/${route}'); }\n`);
  }
  write(root, 'octofit-tracker/frontend/src/completed-contract.tsx', `const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'; const paths = ['/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts/suggestions/']; const states = ['role="status"', 'role="alert"', 'No activities']; export { base, paths, states };`);
  return root;
}

test('exercise metadata passes structural and safety validation', () => {
  assert.doesNotThrow(() => validateExercise(repositoryRoot));
});

test('starter scaffold does not pass learner grading before implementation', () => {
  for (const name of ['step1-architecture', 'step2-data', 'step3-api', 'step4-frontend']) {
    assert.throws(() => checks[name](repositoryRoot));
  }
});

test('completed learner fixture satisfies step 1 through final composition checks', () => {
  const root = completedFixture();
  for (const name of ['step1-architecture', 'step2-data', 'step3-api', 'step4-frontend']) {
    assert.doesNotThrow(() => checks[name](root), `${name} should accept a completed fixture`);
  }
  assert.doesNotThrow(() => checkFinalComposition(root));
});

test('missing canonical step file is rejected', () => {
  const root = copyMetadata();
  fs.renameSync(path.join(root, '.github/steps/2-step.md'), path.join(root, '.github/steps/2-data.md'));
  assert.throws(() => validateExercise(root), /Missing \.github\/steps\/2-step\.md/);
});

test('missing Theory content is rejected', () => {
  const root = copyMetadata();
  const step = path.join(root, '.github/steps/3-step.md');
  fs.writeFileSync(step, fs.readFileSync(step, 'utf8').replace(/### 📖 Theory:[\s\S]*?### ⌨️ Activity:/, '### 📖 Theory:\n\n### ⌨️ Activity:'));
  assert.throws(() => validateExercise(root), /Theory block/);
});

test('path-specific Copilot instructions require applyTo frontmatter', () => {
  const root = copyMetadata();
  const instruction = path.join(root, '.github/instructions/octofit_tracker_react_frontend.instructions.md');
  fs.writeFileSync(instruction, fs.readFileSync(instruction, 'utf8').replace(/^---\napplyTo:.*\n---\n/m, ''));
  assert.throws(() => validateExercise(root), /must declare applyTo scope octofit-tracker\/frontend/);
});

test('unscoped replace-mode comments are rejected', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/2-step.yml');
  fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace('          comment-author: "github-actions[bot]"\n', ''));
  assert.throws(() => validateExercise(root), /find-comment must be scoped/);
});

test('grading must gate progression', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/3-step.yml');
  fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace('needs: [find_exercise, check_step_work]', 'needs: [find_exercise]'));
  assert.throws(() => validateExercise(root), /must need check_step_work/);
});

test('mixed toolkit refs are rejected', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/4-step.yml');
  fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replaceAll('v0.9.3', 'v0.9.0'));
  assert.throws(() => validateExercise(root), /uses toolkit v0\.9\.0|checkout must use/);
});

test('final workflow cannot enable another step', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/5-last-step.yml');
  fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8') + '\n# bad\nrun: gh workflow enable "Step 1"\n');
  assert.throws(() => validateExercise(root), /not enable another step/);
});

test('final completion job cannot bypass the merged pull request gate', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/5-last-step.yml');
  const text = fs.readFileSync(workflow, 'utf8')
    .replace('    if: github.event.pull_request.merged == true\n    name: Finish Exercise', '    name: Finish Exercise')
    .replace('    needs: [find_exercise, post_review_content]\n    permissions:', '    permissions:');
  fs.writeFileSync(workflow, text);
  assert.throws(() => validateExercise(root), /job finish_exercise must be gated on a merged pull request/);
});

test('final job condition cannot bypass the merge predicate with OR', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/5-last-step.yml');
  const text = fs.readFileSync(workflow, 'utf8').replace(
    '    if: github.event.pull_request.merged == true\n    name: Finish Exercise',
    "    if: github.event.pull_request.merged == true || github.event.action == 'closed'\n    name: Finish Exercise",
  );
  fs.writeFileSync(workflow, text);
  assert.throws(() => validateExercise(root), /job finish_exercise must be gated on a merged pull request/);
});

test('final job condition cannot bypass the merge predicate with a negated OR branch', () => {
  for (const condition of [
    'github.event.pull_request.merged == true || !(github.event.pull_request.merged == true)',
    '!(github.event.pull_request.merged == true)',
    '${{ github.event.pull_request.merged == true || always() }}',
  ]) {
    const root = copyMetadata();
    const workflow = path.join(root, '.github/workflows/5-last-step.yml');
    fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace(
      '    if: github.event.pull_request.merged == true\n    name: Finish Exercise',
      `    if: ${condition}\n    name: Finish Exercise`,
    ));
    assert.throws(() => validateExercise(root), /job finish_exercise must be gated on a merged pull request/, condition);
  }
});

test('each toolkit checkout must pin the release ref', () => {
  const mixed = copyMetadata();
  const mixedWorkflow = path.join(mixed, '.github/workflows/1-step.yml');
  fs.writeFileSync(mixedWorkflow, fs.readFileSync(mixedWorkflow, 'utf8').replace('          ref: v0.9.3', '          ref: v0.9.0'));
  assert.throws(() => validateExercise(mixed), /toolkit checkout must use v0\.9\.3 \(found v0\.9\.0\)/);

  for (const [label, replacement] of [
    ['quoted', '          repository: "skills/exercise-toolkit" # toolkit\n          path: exercise-toolkit\n          ref: main'],
    ['single-quoted', "          repository: 'skills/exercise-toolkit'\n          path: exercise-toolkit\n          ref: 'main'"],
  ]) {
    const root = copyMetadata();
    const workflow = path.join(root, '.github/workflows/2-step.yml');
    fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace('          repository: skills/exercise-toolkit\n          path: exercise-toolkit\n          ref: v0.9.3', replacement));
    assert.throws(() => validateExercise(root), /toolkit checkout must use v0\.9\.3 \(found main\)/, label);
  }

  const flow = copyMetadata();
  const flowWorkflow = path.join(flow, '.github/workflows/3-step.yml');
  fs.writeFileSync(flowWorkflow, fs.readFileSync(flowWorkflow, 'utf8').replace('        with:\n          repository: skills/exercise-toolkit\n          path: exercise-toolkit\n          ref: v0.9.3', '        with: { repository: skills/exercise-toolkit, path: exercise-toolkit, ref: main }'));
  assert.throws(() => validateExercise(flow), /found unrecognized checkout/);

  const quotedPinned = copyMetadata();
  const quotedWorkflow = path.join(quotedPinned, '.github/workflows/4-step.yml');
  fs.writeFileSync(quotedWorkflow, fs.readFileSync(quotedWorkflow, 'utf8').replaceAll('          repository: skills/exercise-toolkit\n          path: exercise-toolkit\n          ref: v0.9.3', '          repository: "skills/exercise-toolkit"\n          path: exercise-toolkit\n          ref: "v0.9.3" # latest release'));
  assert.doesNotThrow(() => validateExercise(quotedPinned));

  const missing = copyMetadata();
  const missingWorkflow = path.join(missing, '.github/workflows/1-step.yml');
  fs.writeFileSync(missingWorkflow, fs.readFileSync(missingWorkflow, 'utf8').replace('          ref: v0.9.3\n', ''));
  assert.throws(() => validateExercise(missing), /toolkit checkout must use v0\.9\.3 \(found no ref\)/);
});

test('checkout repositories must be literal values', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/1-step.yml');
  fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace('          repository: skills/exercise-toolkit\n          path: exercise-toolkit\n          ref: v0.9.3', '          repository: ${{ vars.TOOLKIT_REPOSITORY }}\n          path: exercise-toolkit\n          ref: main'));
  assert.throws(() => validateExercise(root), /actions\/checkout repository must be a literal value/);
});

test('progress comment lookup matches every state of the toolkit progress comment', () => {
  const pattern = fs.readFileSync(path.join(repositoryRoot, '.github/workflows/2-step.yml'), 'utf8').match(/body-regex:\s*'([^']+)'/)[1];
  const regex = new RegExp(pattern);
  for (const body of ["I'll watch your progress in the background", 'Nice! Looks like you are making progress.', '## Step 2 - Fail ❌']) assert.match(body, regex);
  assert.doesNotMatch('## Step 2: Model the data tier', regex);
});

test('unauthenticated API port must stay private behind the Vite proxy', () => {
  const publicPort = copyAll();
  const postStart = path.join(publicPort, '.devcontainer/post_start.sh');
  fs.writeFileSync(postStart, fs.readFileSync(postStart, 'utf8').replace('8000:private', '8000:public'));
  assert.throws(() => validateExercise(publicPort), /must not make the unauthenticated API/);

  const noProxy = copyAll();
  const vite = path.join(noProxy, 'octofit-tracker/frontend/vite.config.ts');
  fs.writeFileSync(vite, fs.readFileSync(vite, 'utf8').replace(", proxy: { '/api': 'http://localhost:8000' }", ''));
  assert.throws(() => validateExercise(noProxy), /Vite must proxy \/api/);
});

test('workflow-level write permissions are rejected', () => {
  const root = copyMetadata();
  const workflow = path.join(root, '.github/workflows/1-step.yml');
  fs.writeFileSync(workflow, fs.readFileSync(workflow, 'utf8').replace('permissions: {}', 'permissions:\n  contents: write'));
  assert.throws(() => validateExercise(root), /permissions: \{\}/);
});

test('step one requires a completed architecture plan', () => {
  const root = copyAll();
  assert.throws(() => checks['step1-architecture'](root), /Architecture plan must complete/);
  const architecture = path.join(root, 'docs/architecture.md');
  fs.writeFileSync(architecture, fs.readFileSync(architecture, 'utf8').replaceAll('decision:', 'decision: keep boundaries clear').replaceAll('approach:', 'approach: implement from tests'));
  assert.doesNotThrow(() => checks['step1-architecture'](root));
});

test('data grader rejects placeholder seed script', () => {
  const root = copyAll();
  assert.throws(() => checks['step2-data'](root), /required validation|placeholder/);
});

test('frontend grader requires shared API usage and visible states', () => {
  const root = copyAll();
  write(root, 'octofit-tracker/frontend/src/components/Activities.tsx', 'export default function Activities(){ return <h1>Activities</h1>; }');
  assert.throws(() => checks['step4-frontend'](root), /Frontend implementation/);
});

test('frontend grader rejects components that bypass the shared API client', () => {
  const root = completedFixture();
  write(root, 'octofit-tracker/frontend/src/components/Teams.tsx', `import { getJson } from '../api/client.js';\nexport async function loadTeams() { await getJson<unknown>('/api/teams'); return (await fetch('http://localhost:8000/api/teams')).json(); }\n`);
  assert.throws(() => checks['step4-frontend'](root), /Teams\.tsx must not call fetch directly/);
});
