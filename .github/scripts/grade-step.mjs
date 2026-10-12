#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError, assertValid, combinedText, readJson, readText, requireDependency } from './validation-lib.mjs';

function run(command, args, root) {
  execFileSync(command, args, { cwd: root, stdio: 'inherit' });
}
function containsAll(text, words, context) {
  for (const word of words) assertValid(new RegExp(word, 'i').test(text), `${context} must mention ${word}`);
}
function hasNonBlankValue(text, label) {
  const match = text.match(new RegExp(`^- ${label}:[ \t]*(\\S.*)$`, 'im'));
  assertValid(match && match[1].trim().length > 8, `Architecture plan must complete ${label}`);
}
export const checks = {
  'step1-architecture': (root) => {
    const architecture = readText(root, 'docs/architecture.md');
    containsAll(architecture, ['Presentation tier', 'Logic tier', 'Data tier', '8000', '5173', '27017', 'Activity tracking', 'Teams', 'Leaderboard', 'Workout suggestions'], 'Architecture document');
    for (const label of ['Presentation tier decision', 'Logic tier decision', 'Data tier decision', 'Activity tracking approach', 'Team management approach', 'Leaderboard approach', 'Workout suggestions approach']) hasNonBlankValue(architecture, label);
    containsAll(architecture, ['npm run test:data --prefix octofit-tracker/backend', 'npm run test:api --prefix octofit-tracker/backend', 'npm test --prefix octofit-tracker/frontend'], 'Test plan');
  },
  'step2-data': (root) => {
    const backend = readJson(root, 'octofit-tracker/backend/package.json');
    requireDependency(backend, 'mongoose');
    for (const file of ['User', 'Team', 'Activity', 'Workout']) {
      const text = readText(root, `octofit-tracker/backend/src/models/${file}.ts`);
      assertValid(/required\s*:\s*true/i.test(text), `${file} schema must include required validation`);
      assertValid(/Schema\s*\(/.test(text) && /model\s*\(/.test(text), `${file} must declare a Mongoose schema and model`);
    }
    const seed = readText(root, 'octofit-tracker/backend/src/scripts/seed.ts');
    assertValid(!/Learners implement|pending|TODO/i.test(seed), 'Seed script still contains starter placeholder text');
    containsAll(seed, ['User', 'Team', 'Activity', 'Workout', 'upsert|insertMany|create', 'deleteMany|bulkWrite'], 'Seed script');
    assertValid(readJson(root, 'octofit-tracker/backend/package.json').scripts?.seed, 'Backend package.json must define an npm run seed script');
  },
  'step3-api': (root) => {
    const backend = combinedText(root, 'octofit-tracker/backend/src');
    for (const path of ['/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts/suggestions']) assertValid(backend.includes(path.replace('/api', '')) || backend.includes(path), `Backend must expose ${path}`);
    containsAll(backend, ['status\\(400\\)|status: 400', 'getLeaderboard', 'suggestWorkouts', 'points', 'minutes'], 'API implementation');
  },
  'step4-frontend': (root) => {
    const pkg = readJson(root, 'octofit-tracker/frontend/package.json');
    assertValid(/^\^?19\./.test(requireDependency(pkg, 'react')), 'React dependency must be version 19');
    requireDependency(pkg, 'bootstrap');
    requireDependency(pkg, 'react-router-dom');
    const frontend = combinedText(root, 'octofit-tracker/frontend/src');
    containsAll(frontend, ['import.meta.env', 'localhost:8000', '/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts/suggestions/', 'role=[\"\']status', 'role=[\"\']alert', 'no activities|empty state'], 'Frontend implementation');
  },
  'step5-final': (root) => {
    checks['step1-architecture'](root);
    checks['step2-data'](root);
    checks['step3-api'](root);
    checks['step4-frontend'](root);
    run('npm', ['run', 'test:data', '--prefix', 'octofit-tracker/backend'], root);
    run('npm', ['run', 'test:api', '--prefix', 'octofit-tracker/backend'], root);
    run('npm', ['test', '--prefix', 'octofit-tracker/frontend'], root);
    run('npm', ['run', 'build', '--prefix', 'octofit-tracker/backend'], root);
    run('npm', ['run', 'build', '--prefix', 'octofit-tracker/frontend'], root);
  },
};
export function runCheck(checkName, root = process.cwd()) {
  const check = checks[checkName];
  assertValid(check, `Unknown validation check: ${checkName}`);
  check(root);
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try { runCheck(process.argv[2]); console.log(`PASS: ${process.argv[2]}`); }
  catch (error) { const message = error instanceof ValidationError ? error.message : error.stack; console.error(`FAIL: ${process.argv[2] ?? 'missing check name'}: ${message}`); process.exit(1); }
}
