#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ValidationError, assertValid, listFiles, readText, runChecks } from './validation-lib.mjs';
import { contractHash, protectedContracts } from './grade-step.mjs';

const TOOLKIT_REF = 'v0.9.3';
// Matches only the toolkit v0.9.3 progress templates: watching-for-progress.md, checking-work.md, and the step results comment.
const PROGRESS_COMMENT_REGEX = String.raw`watch your progress in the background|Looks like you are making progress|## Step \d+ - (Passed|Fail)`;
const ACTION_PINS = { 'actions/checkout': 'v6', 'GrantBirki/comment': 'v2.1.1', 'peter-evans/find-comment': 'v4' };
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
// Only a plain conjunction is accepted: the merge predicate must be a top-level && term,
// with no ||, negation, or grouping that could let an unmerged pull request through.
function conditionRequiresMerged(condition) {
  const expression = condition.trim().replace(/^\$\{\{\s*([\s\S]*?)\s*\}\}$/, '$1').trim();
  if (/\|\||!(?!=)|[()]/.test(expression)) return false;
  return expression.split('&&').some((term) => /^github\.event\.pull_request\.merged\s*==\s*true$/.test(term.trim()));
}
function yamlScalar(value) {
  const trimmed = value.replace(/\s+#.*$/, '').trim();
  return trimmed.match(/^(['"])(.*)\1$/)?.[2] ?? trimmed;
}
// The safety checks below read workflows line by line, so require block mappings with unquoted keys.
// Expression and quoted-string contents, comments, block scalar bodies, and an empty `{}` are ignored.
const BLOCK_SCALAR_HEADER = /:\s*[|>](?:[+-]?[1-9]?|[1-9][+-])\s*(?:#.*)?$/;
function flowStyleLines(text) {
  const lines = text.split(/\n/);
  const flagged = [];
  let scalarIndent = -1;
  for (const [index, line] of lines.entries()) {
    const indent = line.match(/^\s*/)[0].length;
    if (scalarIndent >= 0) {
      if (!line.trim() || indent > scalarIndent) continue;
      scalarIndent = -1;
    }
    const code = line.replace(/\$\{\{.*?\}\}/g, '').replace(/"(?:[^"\\]|\\.)*"|'(?:[^']|'')*'/g, '""').replace(/\s#.*$/, '').replace(/^\s*#.*$/, '');
    if (/[{}]/.test(code.replace(/:\s*\{\}\s*$/, ':')) || /^\s*(?:-\s+)?["']/.test(line.replace(/\$\{\{.*?\}\}/g, '')) && /^\s*(?:-\s+)?""\s*:/.test(code)) flagged.push(index + 1);
    if (BLOCK_SCALAR_HEADER.test(code)) scalarIndent = indent;
  }
  return flagged;
}
function checkoutRepositories(text) {
  const lines = text.split(/\n/);
  const repositories = [];
  for (const [index, line] of lines.entries()) {
    const match = line.match(/^(\s*)(?:-\s+)?uses:\s*['"]?actions\/checkout@/i);
    if (!match) continue;
    const stepIndent = line.startsWith(`${match[1]}- `) ? match[1].length : match[1].length - 2;
    // YAML key order is insignificant, so scan the whole step, including keys before `uses:`.
    let start = index;
    while (start > 0 && !(lines[start].match(/^\s*/)[0].length === stepIndent && /^\s*-\s/.test(lines[start]))) start -= 1;
    for (let cursor = start; cursor < lines.length; cursor += 1) {
      const next = cursor === start ? lines[cursor].replace(/^(\s*)-\s+/, '$1  ') : lines[cursor];
      if (!next.trim()) continue;
      const indent = next.match(/^\s*/)[0].length;
      if (cursor > start && (indent < stepIndent || (indent === stepIndent && /^\s*-\s/.test(next)))) break;
      const repository = next.match(/^\s*['"]?repository['"]?:\s*(.+)$/i)?.[1];
      if (repository) {
        let value = yamlScalar(repository);
        if (BLOCK_SCALAR_HEADER.test(`:${repository}`)) {
          const keyIndent = indent;
          const scalarLines = [];
          let end = cursor + 1;
          for (; end < lines.length; end += 1) {
            const scalarLine = lines[end];
            const scalarIndent = scalarLine.match(/^\s*/)[0].length;
            if (scalarLine.trim() && scalarIndent <= keyIndent) break;
            scalarLines.push(scalarLine.trim());
          }
          value = scalarLines.join(' ');
          cursor = end - 1;
        }
        repositories.push(value);
      } else {
        const flowRepository = next.match(/(?:\{|,)\s*['"]?repository['"]?:\s*(.*?)(?=,\s*[\w-]+\s*:|})/i);
        if (flowRepository) repositories.push(flowRepository[1].trim().replace(/^['"]|['"]$/g, ''));
      }
    }
  }
  return repositories;
}
function toolkitCheckoutRefs(text) {
  const lines = text.split(/\n/);
  const refs = lines.flatMap((line, index) => {
    const match = line.match(/^(\s*)repository:\s*(.+)$/);
    if (!match || yamlScalar(match[2]).toLowerCase() !== 'skills/exercise-toolkit') return [];
    const indent = match[1];
    let start = index;
    while (start > 0 && lines[start - 1].startsWith(indent) && lines[start - 1].trim()) start -= 1;
    let end = index;
    while (end + 1 < lines.length && lines[end + 1].startsWith(indent) && lines[end + 1].trim()) end += 1;
    const siblings = lines.slice(start, end + 1).filter((candidate) => candidate.startsWith(indent) && !/^\s/.test(candidate.slice(indent.length)));
    const ref = siblings.map((candidate) => candidate.match(/^\s*ref:\s*(.+)$/)?.[1]).find(Boolean);
    return [ref ? yamlScalar(ref) : null];
  });
  // Any other mention of the toolkit repository (flow mappings, anchors, etc.) cannot be verified.
  const mentions = lines.filter((line) => /skills\/exercise-toolkit(?![\w./-]*@)/i.test(line.replace(/^\s*#.*$/, ''))).length;
  return mentions === refs.length ? refs : [...refs, 'unrecognized checkout'];
}
function isMergeGated(jobId, blocks, visited = new Set()) {
  if (visited.has(jobId)) return false;
  visited.add(jobId);
  const block = blocks.get(jobId) ?? '';
  const condition = block.match(/^    if:\s*(.+)$/m)?.[1] ?? '';
  if (/github\.event\.pull_request\.merged\s*==\s*true/.test(condition)) return conditionRequiresMerged(condition);
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
        for (const match of text.matchAll(/skills\/exercise-toolkit[^\s@]*@([^\s'\"#]+)/gi)) assertValid(match[1] === TOOLKIT_REF, `${file} uses toolkit ${match[1]}`);
        const flowLines = flowStyleLines(text);
        assertValid(flowLines.length === 0, `${file} must use block-style YAML with unquoted keys; flow-style or quoted-key steps bypass action safety checks (lines ${flowLines.join(', ')})`);
        for (const repository of checkoutRepositories(text)) assertValid(!/\$\{\{/.test(repository), `${file} actions/checkout repository must be a literal value, found ${repository}`);
        for (const ref of toolkitCheckoutRefs(text)) assertValid(ref === TOOLKIT_REF, `${file} toolkit checkout must use ${TOOLKIT_REF} (found ${ref ?? 'no ref'})`);
        for (const [action, pin] of Object.entries(ACTION_PINS)) {
          for (const match of text.matchAll(new RegExp(`uses:\\s*['"]?${action.replace('/', '\\/')}@([^\\s'"#]+)`, 'gi'))) assertValid(match[1] === pin, `${file} must use ${action}@${pin} (found ${match[1]})`);
        }
        assertValid(!/^\s*(?:-\s+)?uses:\s*['"]?(?!\.\/|docker:\/\/)[^\s'"#@]+['"]?\s*(?:#.*)?$/m.test(text), `${file} has an action without a version pin`);
        if (/workflows\/[1-5]-/.test(file)) assertValid(!/run:\s*npm (?:run |)(?:test|build)/.test(text), `${file} must grade through grade-step.mjs, not learner-editable npm scripts`);
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
          const ids = [...check.matchAll(/^        id:\s*([A-Za-z0-9_-]+)/gm)].map(m => m[1]).filter((id) => !new RegExp(`id:\\s*${id}\\s*\\n\\s*uses:\\s*peter-evans/find-comment@`).test(check));
          for (const id of ids) assertValid(new RegExp(`steps\\.${id}\\.outcome`).test(check), `${file} result table missing ${id}`);
          assertValid(/continue-on-error:\s*true/.test(check) && /contains\(steps\.\*\.outcome, 'failure'\)/.test(check), `${file} grading checks must be continue-on-error and close with failure gate`);
        }
        const steps = text.split(/\n(?=\s+-\s+(?:name|id|uses|run|if):)/);
        for (const step of steps.filter((candidate) => /^\s*edit-mode:\s*["']?replace\b/m.test(candidate))) {
          const lookupId = step.match(/^\s*comment-id:\s*\$\{\{\s*steps\.([A-Za-z0-9_-]+)\.outputs\.comment-id\s*\}\}\s*$/m)?.[1];
          const lookup = lookupId && steps.find((candidate) => new RegExp(`^\\s*(?:-\\s+)?id:\\s*["']?${lookupId}["']?\\s*$`, 'm').test(candidate));
          assertValid(lookup && /uses:\s*peter-evans\/find-comment@/.test(lookup) && /^\s*comment-author:\s*["']?github-actions\[bot\]["']?\s*$/m.test(lookup) && lookup.split('\n').some((line) => line.trim() === `body-regex: '${PROGRESS_COMMENT_REGEX}'`),
            `${file} find-comment must be scoped: every edit-mode: replace must use comment-id from a peter-evans/find-comment step filtered by github-actions[bot] and body-regex: '${PROGRESS_COMMENT_REGEX}'`);
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
    ['Codespaces API exposure', () => {
      const vite = readText(root, 'octofit-tracker/frontend/vite.config.ts');
      assertValid(/proxy:\s*\{[^}]*['"]\/api['"]\s*:\s*['"]http:\/\/localhost:8000['"]/.test(vite), 'Vite must proxy /api to http://localhost:8000 so the API port can stay private');
      const devcontainer = readText(root, '.devcontainer/devcontainer.json');
      for (const port of ['8000', '5173', '27017']) {
        const attributes = devcontainer.match(new RegExp(`"${port}"\\s*:\\s*\\{([^}]*)\\}`))?.[1] ?? '';
        assertValid(!/"visibility"\s*:\s*"(?!private")/.test(attributes), `devcontainer.json must not set port ${port} visibility to anything but private`);
      }
      const postStart = readText(root, '.devcontainer/post_start.sh');
      assertValid(!/\b(?:8000|5173|27017):(?!private\b)\w+/.test(postStart), 'post_start.sh must not make the unauthenticated API, frontend, or MongoDB ports public');
      for (const port of ['8000', '5173', '27017']) assertValid(new RegExp(`gh cs ports visibility ${port}:private\\b`).test(postStart), `post_start.sh must set port ${port} to private`);
      const validation = readText(root, '.github/workflows/validate-exercise.yml');
      assertValid(/^\s*if:\s*github\.event\.repository\.is_template\s*$/m.test(validation), 'validate-exercise.yml must only run in the template repository; learner copies intentionally diverge from the starter');
      assertValid((validation.match(/^\s*-\s*["']?\.vscode\/\*\*["']?\s*$/gm) ?? []).length === 2, 'validate-exercise.yml must trigger on .vscode/** for both pull_request and push');
      const welcome = readText(root, '.devcontainer/welcome-message.txt');
      assertValid(!/\bpublic\b/i.test(welcome), 'welcome-message.txt must not describe any port as public; ports 8000 and 5173 stay private');
      const client = readText(root, 'octofit-tracker/frontend/src/api/client.ts');
      assertValid(!/app\.github\.dev|CODESPACE_NAME/.test(client), 'The API client must use relative /api paths through the Vite proxy, not a public Codespaces URL');
    }],
    ['Protected grading contracts', () => {
      for (const [file, expected] of Object.entries(protectedContracts)) assertValid(contractHash(root, file) === expected, `${file} changed; update protectedContracts in grade-step.mjs with: node .github/scripts/grade-step.mjs print-contract-hashes`);
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
