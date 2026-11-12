import fs from 'node:fs';
import path from 'node:path';

export class ValidationError extends Error {}

export function assertValid(condition, message) {
  if (!condition) {
    throw new ValidationError(message);
  }
}

export function readText(root, relativePath) {
  const filePath = path.join(root, relativePath);
  assertValid(fs.existsSync(filePath), `Missing required file: ${relativePath}`);
  return fs.readFileSync(filePath, 'utf8');
}

export function readJson(root, relativePath) {
  const text = readText(root, relativePath);
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new ValidationError(`${relativePath} is not valid JSON: ${error.message}`);
  }
}

export function listFiles(root, relativePath, pattern = /.*/) {
  const directory = path.join(root, relativePath);
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(relativePath, entry.name);
      return entry.isDirectory()
        ? listFiles(root, entryPath, pattern)
        : pattern.test(entryPath)
          ? [entryPath]
          : [];
    });
}

export function requireDependency(packageJson, dependency) {
  const version = packageJson.dependencies?.[dependency] ?? packageJson.devDependencies?.[dependency];
  assertValid(version, `Missing ${dependency} dependency`);
  return version;
}

export function requirePatterns(text, patterns, context) {
  const missing = patterns.filter((pattern) => !pattern.test(text));
  assertValid(
    missing.length === 0,
    `${context} is missing: ${missing.map((pattern) => pattern.description ?? pattern).join(', ')}`,
  );
}

export function combinedText(root, relativePath, pattern = /\.(?:js|jsx|ts|tsx)$/) {
  return listFiles(root, relativePath, pattern)
    .map((file) => readText(root, file))
    .join('\n');
}

export function runChecks(checks) {
  const failures = [];

  for (const [name, check] of checks) {
    try {
      check();
      console.log(`PASS: ${name}`);
    } catch (error) {
      failures.push(`${name}: ${error.message}`);
      console.error(`FAIL: ${name}: ${error.message}`);
    }
  }

  if (failures.length > 0) {
    throw new ValidationError(failures.join('\n'));
  }
}
