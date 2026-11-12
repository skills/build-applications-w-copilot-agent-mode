#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError, assertValid, combinedText, readJson, readText, requireDependency } from './validation-lib.mjs';

// Maintainer-owned contracts. Grading runs these directly instead of learner-editable npm scripts,
// and refuses to run if they changed. Update hashes with: node .github/scripts/grade-step.mjs print-contract-hashes
export const protectedContracts = {
  'octofit-tracker/backend/tests/data.contract.test.ts': '36c3d304979a185b3490deac5ee16d658badc03cc4927440e7bad08dace9b28c',
  'octofit-tracker/backend/tests/api.contract.test.ts': '2457654fb2cb30ed54b61b1b775fa05aad4f4e2208850d535d3691c8186ad489',
  'octofit-tracker/backend/tsconfig.json': '52ae7740b2c43a72f7306679d38fe15bc376384ea08eef7d913bfc633e6298b5',
  'octofit-tracker/frontend/tests/app.contract.test.tsx': 'd28ab0e9d63f4f7a40720ded2eef1a0c3184d420175441b5f3fc27b36e2aff4d',
  'octofit-tracker/frontend/vite.config.ts': 'e8b5bc71b12b61578feb676693c968983f47a6d7b962c063e25dda65996740c5',
  'octofit-tracker/frontend/tsconfig.json': '5cf5302ccdedebce59ab6734e9d8ffdc1091d828b6b527215ac33c0e17753596',
};
export function contractHash(root, file) {
  return crypto.createHash('sha256').update(readText(root, file).replace(/\r\n/g, '\n')).digest('hex');
}
export function verifyContracts(root) {
  for (const [file, expected] of Object.entries(protectedContracts)) {
    assertValid(fs.existsSync(path.join(root, file)), `Protected contract ${file} is missing; restore it from the template`);
    assertValid(contractHash(root, file) === expected, `Protected contract ${file} was modified; restore it with: git checkout origin/main -- ${file}`);
  }
  for (const app of ['backend', 'frontend']) {
    const extras = fs.readdirSync(path.join(root, 'octofit-tracker', app)).filter((name) => /^(?:vitest\.(?:config|workspace)|vite\.config)\./.test(name) && !(app === 'frontend' && name === 'vite.config.ts'));
    assertValid(extras.length === 0, `Remove extra test configuration from octofit-tracker/${app}: ${extras.join(', ')}`);
  }
}
function tool(root, app, binary, args) {
  verifyContracts(root);
  const cwd = path.join(root, 'octofit-tracker', app);
  execFileSync(path.join(cwd, 'node_modules', '.bin', binary), args, { cwd, stdio: 'inherit' });
}
const contractRuns = {
  'contract-data': (root) => tool(root, 'backend', 'vitest', ['run', 'tests/data.contract.test.ts']),
  'contract-api': (root) => tool(root, 'backend', 'vitest', ['run', 'tests/api.contract.test.ts']),
  'build-backend': (root) => tool(root, 'backend', 'tsc', ['--noEmit', '-p', 'tsconfig.json']),
  'contract-frontend': (root) => tool(root, 'frontend', 'vitest', ['run', 'tests/app.contract.test.tsx']),
  'build-frontend': (root) => { tool(root, 'frontend', 'tsc', ['--noEmit', '-p', 'tsconfig.json']); tool(root, 'frontend', 'vite', ['build']); },
};
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
    containsAll(architecture, ['Camada de apresentação', 'Camada de lógica', 'Camada de dados', '3000', '8000', '27017', 'Registro de atividades', 'Equipes', 'Placar', 'Sugestões de treino'], 'Architecture document');
    for (const label of ['Decisão da camada de apresentação', 'Decisão da camada de lógica', 'Decisão da camada de dados', 'Abordagem para registro de atividades', 'Abordagem para gerenciamento de equipes', 'Abordagem para o placar', 'Abordagem para sugestões de treino']) hasNonBlankValue(architecture, label);
    containsAll(architecture, ['npm run test:data --prefix octofit-tracker/backend', 'npm run test:api --prefix octofit-tracker/backend', 'npm test --prefix octofit-tracker/frontend'], 'Test plan');
  },
  'step2-data': (root) => {
    const backend = readJson(root, 'octofit-tracker/backend/package.json');
    requireDependency(backend, 'mongoose');
    for (const file of ['User', 'Team', 'Activity', 'Workout']) {
      const text = readText(root, `octofit-tracker/backend/src/models/${file}.ts`);
      assertValid(/\brequired\s*:\s*(?:true\b|\[\s*true\s*,)/.test(text), `${file} schema must include required validation`);
      assertValid(/Schema\s*\(/.test(text) && /model\s*\(/.test(text), `${file} must declare a Mongoose schema and model`);
    }
    const seed = readText(root, 'octofit-tracker/backend/src/scripts/seed.ts');
    assertValid(!/Learners implement|pending|TODO/i.test(seed), 'Seed script still contains starter placeholder text');
    containsAll(seed, ['User', 'Team', 'Activity', 'Workout', 'upsert|findOneAndUpdate|updateOne'], 'Seed script');
    assertValid(!/deleteMany\s*\(\s*\{\s*\}\s*\)/.test(seed), 'Seed script must not clear unrelated application records');
    assertValid(readJson(root, 'octofit-tracker/backend/package.json').scripts?.seed, 'Backend package.json must define an npm run seed script');
    const tests = readText(root, 'octofit-tracker/backend/tests/data.contract.test.ts');
    containsAll(tests, ['seed\\(\\)', 'idempotently', 'sentinel'], 'Seed contract test');
  },
  'step3-api': (root) => {
    const backend = combinedText(root, 'octofit-tracker/backend/src');
    for (const path of ['/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts/suggestions']) assertValid(backend.includes(path.replace('/api', '')) || backend.includes(path), `Backend must expose ${path}`);
    assertValid(/\/workouts\/suggestions\/:userEmail/.test(backend), 'Workout suggestions route must identify the seeded user by email');
    assertValid(!/not implemented yet|ainda não implementad[ao]|não foi implementad[ao]/i.test(backend), 'Replace the starter service placeholders; the API contract tests define the required behavior');
    containsAll(backend, ['getLeaderboard', 'suggestWorkouts', 'points', 'minutes'], 'API implementation');
  },
  'step4-frontend': (root) => {
    const pkg = readJson(root, 'octofit-tracker/frontend/package.json');
    assertValid(/^\^?19\./.test(requireDependency(pkg, 'react')), 'React dependency must be version 19');
    requireDependency(pkg, 'bootstrap');
    requireDependency(pkg, 'react-router-dom');
    const frontend = combinedText(root, 'octofit-tracker/frontend/src');
    containsAll(frontend, ['import.meta.env', '/api/activities', '/api/teams', '/api/leaderboard', '/api/workouts/suggestions/', 'role=[\"\']status', 'role=[\"\']alert', 'sem atividades|nenhuma atividade'], 'Frontend implementation');
    for (const component of ['Activities', 'Teams', 'Leaderboard', 'Workouts']) {
      const text = readText(root, `octofit-tracker/frontend/src/components/${component}.tsx`);
      assertValid(/import\s*\{[^}]*\bgetJson\b[^}]*\}\s*from\s*['"][./]*api\/client(?:\.js|\.ts)?['"]/.test(text) && /\bgetJson\s*[<(]/.test(text), `${component}.tsx must load data through getJson from src/api/client.ts`);
      assertValid(!/\bfetch\s*\(/.test(text), `${component}.tsx must not call fetch directly; use the shared API client`);
    }
  },
  'step5-final': (root) => {
    checkFinalComposition(root);
    verifyContracts(root);
    for (const name of ['contract-data', 'contract-api', 'contract-frontend', 'build-backend', 'build-frontend']) contractRuns[name](root);
  },
  ...contractRuns,
};
export function checkFinalComposition(root) {
  checks['step1-architecture'](root);
  checks['step2-data'](root);
  checks['step3-api'](root);
  checks['step4-frontend'](root);
  const backendScripts = readJson(root, 'octofit-tracker/backend/package.json').scripts ?? {};
  const frontendScripts = readJson(root, 'octofit-tracker/frontend/package.json').scripts ?? {};
  for (const script of ['test:data', 'test:api', 'build']) assertValid(backendScripts[script], `Backend package.json must define ${script}`);
  for (const script of ['test', 'build']) assertValid(frontendScripts[script], `Frontend package.json must define ${script}`);
}
export function runCheck(checkName, root = process.cwd()) {
  const check = checks[checkName];
  assertValid(check, `Unknown validation check: ${checkName}`);
  check(root);
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain && process.argv[2] === 'print-contract-hashes') {
  for (const file of Object.keys(protectedContracts)) console.log(`  '${file}': '${contractHash(process.cwd(), file)}',`);
} else if (isMain) {
  try { runCheck(process.argv[2]); console.log(`PASS: ${process.argv[2]}`); }
  catch (error) { const message = error instanceof ValidationError ? error.message : error.stack; console.error(`FAIL: ${process.argv[2] ?? 'missing check name'}: ${message}`); process.exit(1); }
}
