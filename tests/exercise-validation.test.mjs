import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { checks } from '../.github/scripts/grade-step.mjs';
import { validateExercise } from '../.github/scripts/validate-exercise.mjs';

const repositoryRoot = path.resolve(import.meta.dirname, '..');

function temporaryDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'skills-exercise-validation-'));
}

function write(root, relativePath, content) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function copyExerciseMetadata() {
  const root = temporaryDirectory();
  fs.copyFileSync(path.join(repositoryRoot, 'README.md'), path.join(root, 'README.md'));
  fs.cpSync(path.join(repositoryRoot, '.github'), path.join(root, '.github'), { recursive: true });
  return root;
}

function createCompletedLearnerApp() {
  const root = temporaryDirectory();
  write(root, 'octofit-tracker/frontend/package.json', JSON.stringify({
    scripts: { build: 'vite build' },
    dependencies: {
      react: '^19.0.0',
      'react-router-dom': '^7.0.0',
      bootstrap: '^5.3.0',
    },
  }));
  write(root, 'octofit-tracker/backend/package.json', JSON.stringify({
    scripts: { build: 'tsc' },
    dependencies: { express: '^5.0.0', mongoose: '^8.0.0' },
  }));
  write(root, 'octofit-tracker/backend/tsconfig.json', '{}');
  write(
    root,
    'octofit-tracker/backend/src/config/database.ts',
    `import mongoose from 'mongoose';
     export const connectDatabase = () =>
       mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db');`,
  );

  for (const resource of ['User', 'Team', 'Activity', 'Leaderboard', 'Workout']) {
    write(
      root,
      `octofit-tracker/backend/src/models/${resource}.ts`,
      `import { Schema, model } from 'mongoose';
       export default model('${resource}', new Schema({ name: String }));`,
    );
  }

  write(
    root,
    'octofit-tracker/backend/src/scripts/seed.ts',
    `import mongoose from 'mongoose';
     import User from '../models/User';
     import Team from '../models/Team';
     import Activity from '../models/Activity';
     import Leaderboard from '../models/Leaderboard';
     import Workout from '../models/Workout';
     // Seed the octofit_db database with test data
     await mongoose.connect('mongodb://localhost:27017/octofit_db');
     await User.insertMany([{ name: 'Mona' }]);
     await Team.insertMany([{ name: 'Octocats' }]);
     await Activity.insertMany([{ name: 'Run' }]);
     await Leaderboard.insertMany([{ name: 'Weekly' }]);
     await Workout.insertMany([{ name: 'Intervals' }]);`,
  );
  write(
    root,
    'octofit-tracker/backend/src/server.ts',
    `const port = Number(process.env.PORT || 8000);
     const baseUrl = process.env.CODESPACE_NAME
       ? \`https://\${process.env.CODESPACE_NAME}-8000.app.github.dev\`
       : 'http://localhost:8000';
     app.get('/api/users/', handler);
     app.get('/api/teams/', handler);
     app.get('/api/activities/', handler);
     app.get('/api/leaderboard/', handler);
     app.get('/api/workouts/', handler);
     app.listen(port);
     export { baseUrl };`,
  );

  for (const resource of ['Activities', 'Leaderboard', 'Teams', 'Users', 'Workouts']) {
    const endpoint = resource.toLowerCase();
    write(
      root,
      `octofit-tracker/frontend/src/components/${resource}.jsx`,
      `export default function ${resource}() {
         fetch(apiBase + '/api/${endpoint}/');
         return <main>${resource}</main>;
       }`,
    );
  }
  write(
    root,
    'octofit-tracker/frontend/src/App.jsx',
    `import { BrowserRouter, Route, Routes } from 'react-router-dom';
     import Activities from './components/Activities';
     import Leaderboard from './components/Leaderboard';
     import Teams from './components/Teams';
     import Users from './components/Users';
     import Workouts from './components/Workouts';
     export default function App() {
       return <BrowserRouter><Routes>
         <Route path="/activities" element={<Activities />} />
         <Route path="/leaderboard" element={<Leaderboard />} />
         <Route path="/teams" element={<Teams />} />
         <Route path="/users" element={<Users />} />
         <Route path="/workouts" element={<Workouts />} />
       </Routes></BrowserRouter>;
     }`,
  );
  write(root, 'octofit-tracker/frontend/src/main.jsx', `import 'bootstrap/dist/css/bootstrap.min.css';`);
  write(
    root,
    'octofit-tracker/frontend/src/api.js',
    `const apiBase = import.meta.env.VITE_CODESPACE_NAME
       ? \`https://\${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev\`
       : 'http://localhost:8000';
     export const endpoints = [
       '/api/activities/',
       '/api/leaderboard/',
       '/api/teams/',
       '/api/users/',
       '/api/workouts/',
     ].map((path) => apiBase + path);`,
  );
  return root;
}

test('exercise metadata passes structural and safety validation', () => {
  assert.doesNotThrow(() => validateExercise(repositoryRoot));
});

test('a complete learner journey satisfies every grading check', () => {
  const root = createCompletedLearnerApp();
  for (const check of Object.values(checks)) {
    assert.doesNotThrow(() => check(root));
  }
});

test('a missing Theory block is rejected', () => {
  const root = copyExerciseMetadata();
  const step = path.join(root, '.github/steps/2-application-initial-setup.md');
  fs.writeFileSync(step, fs.readFileSync(step, 'utf8').replace('### 📖 Theory:', '### Background'));
  assert.throws(() => validateExercise(root), /exactly one Theory heading/);
});

test('an unsafe replace-mode comment lookup is rejected', () => {
  const root = copyExerciseMetadata();
  const workflow = path.join(root, '.github/workflows/2-application-initial-setup.yml');
  fs.writeFileSync(
    workflow,
    fs.readFileSync(workflow, 'utf8').replace('          comment-author: github-actions[bot]\n', ''),
  );
  assert.throws(() => validateExercise(root), /matching scoped find-comment step/);
});

test('a closed but unmerged pull request cannot complete the exercise', () => {
  const root = copyExerciseMetadata();
  const workflow = path.join(root, '.github/workflows/6-last-step.yml');
  fs.writeFileSync(
    workflow,
    fs.readFileSync(workflow, 'utf8').replaceAll('github.event.pull_request.merged == true', 'always()'),
  );
  assert.throws(() => validateExercise(root), /require a merged pull request/);
});

test('the starter template cannot pass Step 2 before learner setup', () => {
  for (const checkName of ['step2-react', 'step2-express', 'step2-mongoose']) {
    assert.throws(() => checks[checkName](repositoryRoot), /Missing required file/);
  }
});

test('a TODO-only seed script is rejected', () => {
  const root = temporaryDirectory();
  write(
    root,
    'octofit-tracker/backend/src/scripts/seed.ts',
    `import mongoose from 'mongoose';
     // Seed the octofit_db database with test data
     // TODO: Add users, teams, activities, leaderboard, and workouts
     mongoose.connect('mongodb://localhost:27017/octofit_db');`,
  );
  assert.throws(() => checks['step3-seed'](root), /TODO placeholder/);
});

test('frontend API configuration without a local fallback is rejected', () => {
  const root = createCompletedLearnerApp();
  const api = path.join(root, 'octofit-tracker/frontend/src/api.js');
  fs.writeFileSync(
    api,
    fs.readFileSync(api, 'utf8').replace(": 'http://localhost:8000'", ": ''"),
  );
  assert.throws(() => checks['step5-api-config'](root), /localhost:8000/);
});

test('every model file must declare its own schema and model', () => {
  const root = createCompletedLearnerApp();
  write(root, 'octofit-tracker/backend/src/models/Team.ts', 'export default {};');
  assert.throws(() => checks['step3-models'](root), /teams model file is missing/);
});

test('the seed script must write every resource', () => {
  const root = createCompletedLearnerApp();
  const seed = path.join(root, 'octofit-tracker/backend/src/scripts/seed.ts');
  fs.writeFileSync(seed, fs.readFileSync(seed, 'utf8').replace(
    "await Team.insertMany([{ name: 'Octocats' }]);",
    "console.log(Team.modelName);",
  ));
  assert.throws(() => checks['step3-seed'](root), /does not write teams data/);
});

test('endpoint strings without Express registration are rejected', () => {
  const root = createCompletedLearnerApp();
  const server = path.join(root, 'octofit-tracker/backend/src/server.ts');
  fs.writeFileSync(server, `export const endpoints = [
    '/api/users/', '/api/teams/', '/api/activities/', '/api/leaderboard/', '/api/workouts/'
  ];`);
  assert.throws(() => checks['step3-routes'](root), /does not register an Express route/);
});

test('resource views must request their own API and be routed', () => {
  const root = createCompletedLearnerApp();
  write(
    root,
    'octofit-tracker/frontend/src/components/Teams.jsx',
    'export default function Teams() { return <main>Teams</main>; }',
  );
  assert.throws(() => checks['step5-api-config'](root), /Teams\.jsx must request \/api\/teams\//);
});

test('any workflow-level write permission is rejected', () => {
  const root = copyExerciseMetadata();
  const workflow = path.join(root, '.github/workflows/2-application-initial-setup.yml');
  fs.writeFileSync(
    workflow,
    fs.readFileSync(workflow, 'utf8').replace(
      'env:\n',
      'permissions:\n  contents: read\n  pull-requests: write\n\nenv:\n',
    ),
  );
  assert.throws(() => validateExercise(root), /grants write permissions at workflow scope/);
});

test('every replace operation must use its own scoped comment lookup', () => {
  const root = copyExerciseMetadata();
  const workflow = path.join(root, '.github/workflows/2-application-initial-setup.yml');
  fs.writeFileSync(
    workflow,
    fs.readFileSync(workflow, 'utf8').replace(
      'comment-id: ${{ steps.find-last-comment.outputs.comment-id }}\n          edit-mode: replace\n          file: .github/step-feedback/step-results-table.md',
      'comment-id: ${{ steps.unsafe-comment.outputs.comment-id }}\n          edit-mode: replace\n          file: .github/step-feedback/step-results-table.md',
    ),
  );
  assert.throws(() => validateExercise(root), /matching scoped find-comment step/);
});

test('an unused merge expression does not gate completion', () => {
  const root = copyExerciseMetadata();
  const workflow = path.join(root, '.github/workflows/6-last-step.yml');
  fs.writeFileSync(
    workflow,
    fs.readFileSync(workflow, 'utf8')
      .replaceAll('if: github.event.pull_request.merged == true', 'if: always()')
      .replace('jobs:\n', 'jobs:\n  # github.event.pull_request.merged == true\n'),
  );
  assert.throws(() => validateExercise(root), /Every final workflow job must require a merged pull request/);
});
