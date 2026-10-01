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
    write(
      root,
      `octofit-tracker/frontend/src/components/${resource}.jsx`,
      `export default function ${resource}() { return <main>${resource}</main>; }`,
    );
  }
  write(
    root,
    'octofit-tracker/frontend/src/App.jsx',
    `import { BrowserRouter } from 'react-router-dom';
     export default function App() { return <BrowserRouter />; }`,
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
  assert.throws(() => validateExercise(root), /without author and marker scoping/);
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
  const root = temporaryDirectory();
  write(
    root,
    'octofit-tracker/frontend/src/api.js',
    `import { createBrowserRouter } from 'react-router-dom';
     const api = \`https://\${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev\`;
     export const routes = ['activities', 'leaderboard', 'teams', 'users', 'workouts']
       .map((resource) => \`\${api}/api/\${resource}/\`);
     export { createBrowserRouter };`,
  );
  assert.throws(() => checks['step5-api-config'](root), /localhost:8000/);
});
