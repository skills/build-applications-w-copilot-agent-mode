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

function resourceModelFile(root, resource) {
  const modelName = resourceModels[resource];
  const modelFiles = listFiles(root, 'octofit-tracker/backend/src/models', /\.(?:ts|js)$/);
  const file = modelFiles.find((candidate) =>
    path.basename(candidate, path.extname(candidate)).toLowerCase() === modelName,
  );
  assertValid(file, `Missing ${resource} model file`);
  return readText(root, file);
}

function resourceComponent(root, resource) {
  const files = listFiles(root, 'octofit-tracker/frontend/src', /\.(?:jsx|tsx)$/);
  const file = files.find((candidate) =>
    path.basename(candidate, path.extname(candidate)).toLowerCase().startsWith(resource),
  );
  assertValid(file, `Missing ${resource} React component`);
  return { file, text: readText(root, file) };
}

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
    for (const resource of resources) {
      const modelText = resourceModelFile(root, resource);
      requirePatterns(
        modelText,
        [/\bSchema\s*\(/i, /\bmodel\s*\(/i],
        `${resource} model file`,
      );
    }
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
      const modelName = resourceModels[resource];
      assertValid(
        new RegExp(`\\b${modelName}\\s*\\.\\s*(?:insertMany|create)\\s*\\(`, 'i').test(seed) ||
          new RegExp(`new\\s+${modelName}\\s*\\([^)]*\\)\\s*\\.\\s*save\\s*\\(`, 'is').test(seed),
        `Seed script does not write ${resource} data`,
      );
    }
  },
  'step3-routes': (root) => {
    const backend = combinedText(root, 'octofit-tracker/backend/src');
    for (const resource of resources) {
      assertValid(
        new RegExp(
          `\\b(?:app|router)\\s*\\.\\s*(?:use|get|post|put|patch|delete|all)\\s*\\(\\s*['"\`]\\/api\\/${resource}\\/?['"\`]`,
          'i',
        ).test(backend),
        `Backend does not register an Express route for /api/${resource}/`,
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
    for (const resource of resources) {
      resourceComponent(root, resource);
    }
    readText(root, 'octofit-tracker/frontend/src/App.jsx');
    readText(root, 'octofit-tracker/frontend/src/main.jsx');
  },
  'step5-api-config': (root) => {
    const frontend = combinedText(root, 'octofit-tracker/frontend/src');
    const app = readText(root, 'octofit-tracker/frontend/src/App.jsx');
    requirePatterns(
      frontend,
      [/import\.meta\.env/, /VITE_CODESPACE_NAME/, /localhost:8000/, /react-router-dom/i],
      'React presentation tier',
    );
    for (const resource of resources) {
      const { file, text } = resourceComponent(root, resource);
      assertValid(
        new RegExp(`/api/${resource}/?`, 'i').test(text) && /\b(?:fetch|axios)\b/i.test(text),
        `${file} must request /api/${resource}/`,
      );
      const componentName = path.basename(file, path.extname(file));
      assertValid(
        new RegExp(`\\b${componentName}\\b`).test(app) &&
          new RegExp(`(?:path\\s*=\\s*|path\\s*:)\\s*['"\`]\\/?${resource}\\/?['"\`]`, 'i').test(app),
        `App.jsx must route /${resource} to ${componentName}`,
      );
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
