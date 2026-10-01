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

function withoutComments(content) {
  return content.replace(/^\s*#.*$/gm, '');
}

function jobBlocks(content) {
  const jobs = new Map();
  const matches = [...content.matchAll(/^ {2}([A-Za-z0-9_-]+):\s*$/gm)]
    .filter((match) => content.slice(0, match.index).trimEnd().endsWith('jobs:') ||
      /^ {2}[A-Za-z0-9_-]+:\s*$/m.test(content.slice(match.index)));

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const end = matches[index + 1]?.index ?? content.length;
    const block = content.slice(match.index, end);
    if (/^ {4}(?:name|uses|runs-on|if|needs|permissions|steps):/m.test(block)) {
      jobs.set(match[1], block);
    }
  }
  return jobs;
}

function needsForJob(block) {
  const inline = block.match(/^ {4}needs:\s*\[([^\]]*)\]/m);
  if (inline) {
    return inline[1].split(',').map((value) => value.trim()).filter(Boolean);
  }
  const multiline = block.match(/^ {4}needs:\s*\n((?:^ {6}-\s*\S+\s*$\n?)*)/m);
  return multiline ? [...multiline[1].matchAll(/^ {6}-\s*(\S+)/gm)].map((match) => match[1]) : [];
}

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
        const content = withoutComments(readText(root, file));
        const topLevelPermissions = content.match(/^permissions:\s*(.*)\n((?:^ {2}.+\n?)*)/m);
        if (topLevelPermissions) {
          const permissionText = `${topLevelPermissions[1]}\n${topLevelPermissions[2]}`;
          assertValid(
            !/\bwrite-all\b|(?:^|[,{])\s*[\w-]+\s*:\s*write\b/m.test(permissionText),
            `${file} grants write permissions at workflow scope`,
          );
        }

        const steps = content.split(/(?=^ {6}-\s+(?:name|id|uses):)/m);
        const findComments = new Set();
        for (const step of steps) {
          if (/uses:\s*peter-evans\/find-comment@/.test(step) &&
              /comment-author:\s*github-actions\[bot\]/.test(step) &&
              /body-includes:\s*["']<!-- skills-step-feedback -->["']/.test(step)) {
            const id = step.match(/^ {8}id:\s*([A-Za-z0-9_-]+)/m)?.[1];
            if (id) {
              findComments.add(id);
            }
          }
        }
        for (const step of steps.filter((candidate) => /edit-mode:\s*replace/.test(candidate))) {
          const sourceId = step.match(/comment-id:\s*\$\{\{\s*steps\.([A-Za-z0-9_-]+)\.outputs\.comment-id\s*\}\}/)?.[1];
          assertValid(
            sourceId && findComments.has(sourceId),
            `${file} replaces an issue comment without a matching scoped find-comment step`,
          );
        }
      }

      const start = readText(root, '.github/workflows/0-start-exercise.yml');
      assertValid(/!github\.event\.repository\.is_template/.test(start), 'Start workflow lacks template guard');
      const finalWorkflow = workflowFiles.find((file) => /-last-step\.yml$/.test(file));
      assertValid(finalWorkflow, 'Final workflow is missing');
      const finalContent = withoutComments(readText(root, finalWorkflow));
      const jobs = jobBlocks(finalContent);
      const mergeCondition = /github\.event\.pull_request\.merged\s*==\s*true/;
      const gated = new Map();
      const isGated = (name, visiting = new Set()) => {
        if (gated.has(name)) return gated.get(name);
        if (visiting.has(name)) return false;
        const block = jobs.get(name);
        if (!block) return false;
        if (mergeCondition.test(block.match(/^ {4}if:\s*(.+)$/m)?.[1] ?? '')) {
          gated.set(name, true);
          return true;
        }
        const next = new Set(visiting).add(name);
        const needs = needsForJob(block);
        const result = needs.length > 0 && needs.every((dependency) => isGated(dependency, next));
        gated.set(name, result);
        return result;
      };
      assertValid(
        jobs.size > 0 && [...jobs.keys()].every((name) => isGated(name)),
        'Every final workflow job must require a merged pull request directly or through gated dependencies',
      );
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
