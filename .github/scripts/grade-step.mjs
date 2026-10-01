#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ValidationError,
  assertValid,
  combinedText,
  listFiles,
  readJson,
  readText,
  requireDependency,
  requirePatterns,
} from './validation-lib.mjs';

const resources = ['users', 'teams', 'activities', 'leaderboard', 'workouts'];
const resourceModels = {
  users: 'user',
  teams: 'team',
  activities: 'activity',
  leaderboard: 'leaderboard',
  workouts: 'workout',
};

export const checks = {
  'step2-react': (root) => {
    const packageJson = readJson(root, 'octofit-tracker/frontend/package.json');
    const version = requireDependency(packageJson, 'react');
    assertValid(/(?:^|[^\d])19(?:\.|$)/.test(version), `React must use major version 19, found ${version}`);
  },
  'step2-express': (root) => {
    const packageJson = readJson(root, 'octofit-tracker/backend/package.json');
    requireDependency(packageJson, 'express');
    assertValid(
      listFiles(root, 'octofit-tracker/backend/src', /\.(?:ts|js)$/).length > 0,
      'Backend source files are missing',
    );
  },
  'step2-mongoose': (root) => {
    const packageJson = readJson(root, 'octofit-tracker/backend/package.json');
    requireDependency(packageJson, 'mongoose');
    readText(root, 'octofit-tracker/backend/tsconfig.json');
  },
  'step3-database': (root) => {
    const database = readText(root, 'octofit-tracker/backend/src/config/database.ts');
    requirePatterns(
      database,
      [/mongoose/i, /octofit_db/i, /mongodb:\/\/|MONGODB_URI/i],
      'Database configuration',
    );
  },
  'step3-models': (root) => {
    const modelFiles = listFiles(root, 'octofit-tracker/backend/src/models', /\.(?:ts|js)$/);
    const modelText = modelFiles.map((file) => `${file}\n${readText(root, file)}`).join('\n');
    assertValid(modelFiles.length >= resources.length, 'Create a Mongoose model file for each application resource');
    for (const resource of resources) {
      assertValid(new RegExp(resourceModels[resource], 'i').test(modelText), `Missing ${resource} model`);
    }
    requirePatterns(modelText, [/Schema/i, /model\s*\(/i], 'Mongoose models');
  },
  'step3-seed': (root) => {
    const seed = readText(root, 'octofit-tracker/backend/src/scripts/seed.ts');
    assertValid(!/\bTODO\b/i.test(seed), 'Seed script still contains a TODO placeholder');
    requirePatterns(
      seed,
      [
        /Seed the octofit_db database with test data/i,
        /(?:insertMany|create|save)\s*\(/i,
        /mongoose\.connect|connectDB|connectDatabase/i,
      ],
      'Seed script',
    );
    for (const resource of resources) {
      assertValid(new RegExp(resourceModels[resource], 'i').test(seed), `Seed script does not populate ${resource}`);
    }
  },
  'step3-routes': (root) => {
    const backend = combinedText(root, 'octofit-tracker/backend/src');
    for (const resource of resources) {
      assertValid(
        new RegExp(`/api/${resource}/?`, 'i').test(backend),
        `Backend does not expose /api/${resource}/`,
      );
    }
  },
  'step4-hosting': (root) => {
    const server = readText(root, 'octofit-tracker/backend/src/server.ts');
    requirePatterns(
      server,
      [/CODESPACE_NAME/, /-8000\.app\.github\.dev/, /localhost:8000/, /(?:PORT|listen\s*\()\D*8000/i],
      'API server',
    );
  },
  'step4-api': (root) => checks['step3-routes'](root),
  'step5-dependencies': (root) => {
    const packageJson = readJson(root, 'octofit-tracker/frontend/package.json');
    requireDependency(packageJson, 'react-router-dom');
    requireDependency(packageJson, 'bootstrap');
  },
  'step5-components': (root) => {
    const frontendFiles = listFiles(root, 'octofit-tracker/frontend/src', /\.(?:jsx|tsx)$/);
    const names = frontendFiles.map((file) => path.basename(file).toLowerCase());
    for (const resource of resources) {
      assertValid(
        names.some((name) => name.startsWith(resource.toLowerCase())),
        `Missing ${resource} React component`,
      );
    }
    readText(root, 'octofit-tracker/frontend/src/App.jsx');
    readText(root, 'octofit-tracker/frontend/src/main.jsx');
  },
  'step5-api-config': (root) => {
    const frontend = combinedText(root, 'octofit-tracker/frontend/src');
    requirePatterns(
      frontend,
      [/import\.meta\.env/, /VITE_CODESPACE_NAME/, /localhost:8000/, /react-router-dom/i],
      'React presentation tier',
    );
    for (const resource of resources) {
      assertValid(new RegExp(`/api/${resource}/?`, 'i').test(frontend), `Frontend does not use /api/${resource}/`);
    }
    assertValid(!/https:\/\/\$\{[^}]*VITE_CODESPACE_NAME[^}]*\}-8000/.test(frontend) || /localhost:8000/.test(frontend),
      'Codespaces API URL must include a localhost fallback');
  },
};

export function runCheck(checkName, root = process.cwd()) {
  const check = checks[checkName];
  assertValid(check, `Unknown validation check: ${checkName}`);
  check(root);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    runCheck(process.argv[2]);
    console.log(`PASS: ${process.argv[2]}`);
  } catch (error) {
    const message = error instanceof ValidationError ? error.message : error.stack;
    console.error(`FAIL: ${process.argv[2] ?? 'missing check name'}: ${message}`);
    process.exit(1);
  }
}
