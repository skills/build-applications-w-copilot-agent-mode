#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ValidationError,
  assertValid,
  listFiles,
  readText,
  runChecks,
} from './validation-lib.mjs';

const numberedStepPattern = /^\.github\/steps\/(\d+)-.+\.md$/;
const workflowPattern = /^\.github\/workflows\/(.+)\.yml$/;

export function validateExercise(root = process.cwd()) {
  const stepFiles = listFiles(root, '.github/steps', /^\S+\.md$/)
    .filter((file) => numberedStepPattern.test(file))
    .sort();
  const workflowFiles = listFiles(root, '.github/workflows', /\.yml$/).sort();

  runChecks([
    ['Step content structure', () => {
      assertValid(stepFiles.length > 0, 'No numbered step files found');
      for (const file of stepFiles) {
        const content = readText(root, file);
        assertValid((content.match(/^### 📖 Theory:$/gm) ?? []).length === 1, `${file} must have exactly one Theory heading`);
        assertValid((content.match(/^### ⌨️ Activity:/gm) ?? []).length >= 1, `${file} must have at least one Activity heading`);
        assertValid(/Having trouble\? 🤷/.test(content), `${file} must include a recovery block`);

        for (const activity of content.split(/^### ⌨️ Activity:/gm).slice(1)) {
          assertValid(/^\d+\.\s+/m.test(activity), `${file} has an Activity without numbered instructions`);
        }
      }
    }],
    ['Step and workflow parity', () => {
      const workflows = new Map();
      for (const file of workflowFiles) {
        const content = readText(root, file);
        const name = content.match(/^name:\s*Step\s+(\d+)/m);
        if (name) {
          workflows.set(Number(name[1]), { file, content });
        }
      }

      for (const file of stepFiles) {
        const number = Number(file.match(numberedStepPattern)[1]);
        const workflow = workflows.get(number);
        assertValid(workflow, `Missing Step ${number} workflow`);
        if (number === stepFiles.length) {
          assertValid(
            workflow.file.endsWith(`${number}-last-step.yml`),
            `Final workflow must be named ${number}-last-step.yml`,
          );
          assertValid(/REVIEW_FILE:\s*["']?\.github\/steps\/x-review\.md/.test(workflow.content),
            'Final workflow must post .github/steps/x-review.md');
        }
      }

      for (const file of workflowFiles) {
        const content = readText(root, file);
        for (const match of content.matchAll(/(?:STEP_\d+_FILE|REVIEW_FILE):\s*["']([^"']+)["']/g)) {
          assertValid(fs.existsSync(path.join(root, match[1])), `${file} references missing ${match[1]}`);
        }
        for (const match of content.matchAll(/gh workflow enable "Step (\d+)"/g)) {
          assertValid(workflows.has(Number(match[1])), `${file} enables missing Step ${match[1]}`);
        }
      }
    }],
    ['Toolkit reference consistency', () => {
      const refs = workflowFiles.flatMap((file) => [
        ...readText(root, file).matchAll(/skills\/exercise-toolkit[^\s]*@([^\s"']+)/g),
      ].map((match) => match[1]));
      assertValid(refs.length > 0, 'No exercise-toolkit references found');
      assertValid(!refs.includes('main'), 'exercise-toolkit must not use @main');
      assertValid(new Set(refs).size === 1, `exercise-toolkit references differ: ${[...new Set(refs)].join(', ')}`);
    }],
    ['Workflow safety', () => {
      for (const file of workflowFiles) {
        const content = readText(root, file);
        assertValid(!/^permissions:\n(?: {2}\w+:\s*write\n?)+/m.test(content),
          `${file} grants write permissions at workflow scope`);
        if (/edit-mode:\s*replace/.test(content)) {
          assertValid(/comment-author:\s*github-actions\[bot\]/.test(content) &&
            /body-includes:\s*["']<!-- skills-step-feedback -->["']/.test(content),
          `${file} replaces an issue comment without author and marker scoping`);
        }
      }

      const start = readText(root, '.github/workflows/0-start-exercise.yml');
      assertValid(/!github\.event\.repository\.is_template/.test(start), 'Start workflow lacks template guard');
      const finalWorkflow = workflowFiles.find((file) => /-last-step\.yml$/.test(file));
      assertValid(finalWorkflow, 'Final workflow is missing');
      const finalContent = readText(root, finalWorkflow);
      assertValid(/github\.event\.pull_request\.merged\s*==\s*true/.test(finalContent),
        'Final workflow must require a merged pull request');
    }],
    ['Placeholder cleanup', () => {
      const files = ['README.md', ...listFiles(root, '.github', /\.(?:md|yml|yaml)$/)];
      const placeholder = /\breplace-me\b|\b(?:OWNER|REPO|ORG|TITLE|FEATURE)\b|<YOUR-[^>]+>|\[Step name\]|\[component\]/;
      for (const file of files) {
        assertValid(!placeholder.test(readText(root, file)), `${file} contains placeholder text`);
      }
    }],
  ]);
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    validateExercise();
  } catch (error) {
    const message = error instanceof ValidationError ? error.message : error.stack;
    console.error(message);
    process.exit(1);
  }
}
