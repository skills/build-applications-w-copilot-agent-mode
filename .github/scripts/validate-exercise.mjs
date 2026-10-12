#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError, assertValid, listFiles, readText, runChecks } from './validation-lib.mjs';

const TOOLKIT_REF = 'v0.9.3';
const requiredSteps = [1, 2, 3, 4, 5];
function files(root, dir, pattern) { return listFiles(root, dir, pattern).sort(); }
function workflowName(text) { return text.match(/^name:\s*Step\s+(\d+)/m)?.[1]; }
function workflowJobIds(text) {
  const jobs = text.match(/^jobs:\s*\n([\s\S]*)$/m)?.[1] ?? '';
  return [...jobs.matchAll(/^  ([A-Za-z0-9_-]+):\s*$/gm)].map((match) => match[1]);
}
function jobBlock(text, name) {
  const lines = text.split(/\n/);
  const start = lines.findIndex((line) => line === `  ${name}:`);
  if (start < 0) return '';
  const body = [];
  for (const line of lines.slice(start)) {
    if (body.length > 0 && /^  [A-Za-z0-9_-]+:/.test(line)) break;
    body.push(line);
  }
  return body.join('\n');
}
function jobNeeds(block) {
  const value = block.match(/^    needs:\s*(.+)$/m)?.[1]?.trim();
  if (!value) return [];
  if (value.startsWith('[') && value.endsWith(']')) return value.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
  return [value];
}
function isMergeGated(jobId, blocks, visited = new Set()) {
  if (visited.has(jobId)) return false;
  visited.add(jobId);
  const block = blocks.get(jobId) ?? '';
  const condition = block.match(/^    if:\s*(.+)$/m)?.[1] ?? '';
  if (/github\.event\.pull_request\.merged\s*==\s*true/.test(condition)) return true;
  if (/\b(?:always|failure|cancelled)\s*\(/.test(condition)) return false;
  return jobNeeds(block).some((dependency) => isMergeGated(dependency, blocks, new Set(visited)));
}
function sectionBody(text, heading) {
  const lines = text.split(/\n/);
  const start = lines.findIndex((line) => line.startsWith(heading));
  if (start < 0) return '';
  const body = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{1,3} /.test(line)) break;
    body.push(line);
  }
  return body.join('\n');
}
export function validateExercise(root = process.cwd()) {
  const workflowFiles = files(root, '.github/workflows', /\.ya?ml$/);
  runChecks([
    ['Canonical files exist', () => {
      assertValid(fs.existsSync(path.join(root, 'README.md')), 'README.md is missing');
      for (const n of requiredSteps) assertValid(fs.existsSync(path.join(root, `.github/steps/${n}-step.md`)), `Missing .github/steps/${n}-step.md`);
      assertValid(fs.existsSync(path.join(root, '.github/steps/x-review.md')), 'Missing .github/steps/x-review.md');
      assertValid(fs.existsSync(path.join(root, '.github/workflows/0-start-exercise.yml')), 'Missing start workflow');
      for (const n of [1,2,3,4]) assertValid(fs.existsSync(path.join(root, `.github/workflows/${n}-step.yml`)), `Missing .github/workflows/${n}-step.yml`);
      assertValid(fs.existsSync(path.join(root, '.github/workflows/5-last-step.yml')), 'Missing final workflow');
      assertValid(!fs.existsSync(path.join(root, '.github/step-feedback')), 'Local duplicated step-feedback templates must be removed');
    }],
    ['README contract', () => {
      const readme = readText(root, 'README.md');
      assertValid(/template_owner=skills&template_name=build-applications-w-copilot-agent-mode/.test(readme), 'Copy Exercise badge has the wrong template owner or name');
      assertValid(/## Welcome/.test(readme) && /Having trouble\? 🤷/.test(readme), 'README must include welcome and troubleshooting sections');
      assertValid(/\.github\/images\/octofit-tracker\.png/.test(readme), 'README must reference the hero image');
    }],
    ['Step content structure', () => {
      for (const n of requiredSteps) {
        const file = `.github/steps/${n}-step.md`;
        const text = readText(root, file);
        assertValid((text.match(new RegExp(`^## Step ${n}:`, 'gm')) ?? []).length === 1, `${file} must have one Step ${n} heading`);
        assertValid((text.match(/^### 📖 Theory:/gm) ?? []).length === 1, `${file} must have exactly one Theory block`);
        assertValid(sectionBody(text, '### 📖 Theory:').replace(/\s/g, '').length > 80, `${file} Theory block has no real content`);
        assertValid((text.match(/^### ⌨️ Activity:/gm) ?? []).length >= 1, `${file} must have at least one Activity block`);
        assertValid(/^1\.\s+/m.test(sectionBody(text, '### ⌨️ Activity:')), `${file} Activity block must include numbered instructions`);
        assertValid(/Having trouble\? 🤷/.test(text), `${file} must include a troubleshooting details block`);
        for (const badge of text.matchAll(/!\[Static Badge\]\((https:\/\/img\.shields\.io\/badge\/(?:Prompt|Terminal|CLI-Prompt)[^)]+)\)/g)) {
          assertValid(text.slice(badge.index).match(/^!\[Static Badge\].*\n\s*>\s*\n\s*> ```/m), `${file} badge block must include a blank quote line and fenced block`);
        }
      }
    }],
    ['Workflow naming and chaining', () => {
      const names = new Map();
      for (const file of workflowFiles) {
        const text = readText(root, file);
        const num = workflowName(text);
        if (num) {
          assertValid(!names.has(`Step ${num}`), `${file} duplicates workflow name Step ${num}`);
          names.set(`Step ${num}`, file);
          const expectedPrefix = file.includes('0-start') ? 0 : Number(file.match(/(\d+)-/)?.[1]);
          assertValid(Number(num) === expectedPrefix, `${file} declares Step ${num}, expected Step ${expectedPrefix}`);
        }
        for (const match of text.matchAll(/(STEP_(\d+)_FILE|REVIEW_FILE):\s*"([^"]+)"/g)) {
          assertValid(fs.existsSync(path.join(root, match[3])), `${file} references missing ${match[3]}`);
          if (match[1] === 'REVIEW_FILE') assertValid(match[3] === '.github/steps/x-review.md', `${file} REVIEW_FILE must point to x-review.md`);
          else assertValid(match[3] === `.github/steps/${match[2]}-step.md`, `${file} ${match[1]} points to wrong step file`);
        }
      }
      for (const file of workflowFiles) {
        const text = readText(root, file);
        for (const match of text.matchAll(/gh workflow enable "([^"]+)"/g)) assertValid(names.has(match[1]), `${file} enables missing workflow ${match[1]}`);
      }
      const final = readText(root, '.github/workflows/5-last-step.yml');
      assertValid(/REVIEW_FILE/.test(final) && !/gh workflow enable/.test(final), 'Final workflow must post review and not enable another step');
    }],
    ['Toolkit and action pins', () => {
      for (const file of workflowFiles) {
        const text = readText(root, file);
        for (const match of text.matchAll(/skills\/exercise-toolkit[^\s]+@([^\s]+)/g)) assertValid(match[1] === TOOLKIT_REF, `${file} uses toolkit ${match[1]}`);
        if (/repository:\s*skills\/exercise-toolkit/.test(text)) assertValid(new RegExp(`ref:\\s*${TOOLKIT_REF}`).test(text), `${file} toolkit checkout must use ${TOOLKIT_REF}`);
        assertValid(!/actions\/checkout@(?!v6)/.test(text), `${file} must use actions/checkout@v6`);
        assertValid(!/GrantBirki\/comment@(?!v2\.1\.1)/.test(text), `${file} must use GrantBirki/comment@v2.1.1`);
        assertValid(!/peter-evans\/find-comment@(?!v4)/.test(text), `${file} must use peter-evans/find-comment@v4`);
      }
    }],
    ['Workflow safety and grading gates', () => {
      for (const file of workflowFiles) {
        const text = readText(root, file);
        assertValid(/^permissions:\s*\{\}/m.test(text), `${file} must set workflow-level permissions: {}`);
        const check = jobBlock(text, 'check_step_work');
        if (check) {
          assertValid(!/actions:\s*write/.test(check), `${file} check_step_work must not have actions: write`);
          assertValid(!/contents:\s*write/.test(check), `${file} check_step_work must not have contents: write`);
          assertValid(file.includes('5-last') ? /post_review_content:[\s\S]*?needs:\s*\[[^\]]*check_step_work/.test(text) : /post_next_step_content:[\s\S]*?needs:\s*\[[^\]]*check_step_work/.test(text), `${file} progression job must need check_step_work`);
          const ids = [...check.matchAll(/^        id:\s*([A-Za-z0-9_-]+)/gm)].map(m => m[1]).filter(id => id !== 'find-last-comment');
          for (const id of ids) assertValid(new RegExp(`steps\\.${id}\\.outcome`).test(check), `${file} result table missing ${id}`);
          assertValid(/continue-on-error:\s*true/.test(check) && /contains\(steps\.\*\.outcome, 'failure'\)/.test(check), `${file} grading checks must be continue-on-error and close with failure gate`);
          assertValid(/comment-author:\s*"?github-actions\[bot\]"?/.test(check) && /body-includes:\s*"[^"]+"/.test(check), `${file} find-comment must be scoped`);
        }
      }
      const start = readText(root, '.github/workflows/0-start-exercise.yml');
      assertValid(/!github\.event\.repository\.is_template/.test(start), 'Start workflow lacks template guard');
      const final = readText(root, '.github/workflows/5-last-step.yml');
      assertValid(/pull_request:[\s\S]*types:[\s\S]*closed/.test(final) && /github\.event\.pull_request\.merged\s*==\s*true/.test(final), 'Final workflow must require a merged pull request');
      const finalJobs = new Map(workflowJobIds(final).map((jobId) => [jobId, jobBlock(final, jobId)]));
      assertValid(finalJobs.has('finish_exercise'), 'Final workflow must define finish_exercise');
      for (const jobId of finalJobs.keys()) {
        assertValid(isMergeGated(jobId, finalJobs), `5-last-step.yml job ${jobId} must be gated on a merged pull request`);
      }
    }],
    ['Placeholder cleanup', () => {
      const targets = ['README.md', ...files(root, '.github', /\.(?:md|ya?ml)$/), ...files(root, 'docs', /\.md$/), ...files(root, '.vscode', /\.json$/)];
      for (const file of targets) assertValid(!/replace-me|\bOWNER\b|\bREPO\b|\bTITLE\b|\bFEATURE\b|Django|django/.test(readText(root, file)), `${file} contains placeholder or stale Django copy`);
      for (const [file, scope] of [
        ['.github/instructions/octofit_tracker_backend.instructions.md', 'octofit-tracker/backend/**'],
        ['.github/instructions/octofit_tracker_react_frontend.instructions.md', 'octofit-tracker/frontend/**'],
        ['.github/instructions/octofit_tracker_setup_project.instructions.md', '**/*'],
      ]) assertValid(new RegExp(`^applyTo:\\s*["']?${scope.replaceAll('*', '\\*')}["']?\\s*$`, 'm').test(readText(root, file)), `${file} must declare applyTo scope ${scope}`);
    }],
  ]);
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try { validateExercise(); }
  catch (error) { const message = error instanceof ValidationError ? error.message : error.stack; console.error(message); process.exit(1); }
}
