#!/usr/bin/env node
const { execSync } = require('node:child_process');

function run(cmd) {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim();
}

const INTERVAL_MS = 30000; // 30s intervals
const MESSAGE = 'Windsurf progress update';

function hasChanges() {
  try {
    const out = run('git status --porcelain');
    return out.length > 0;
  } catch (e) {
    return false;
  }
}

function commitOnce() {
  try {
    if (!hasChanges()) return;
    run('git add -A');
    try {
      run(`git commit -m "${MESSAGE}" --no-verify`);
    } catch (e) {
      // no changes to commit or hook failed
      return;
    }
    try {
      run('git push');
    } catch (e) {
      // pushing may fail if no remote or offline; ignore
    }
    console.log(`[auto-commit] Committed: ${new Date().toISOString()}`);
  } catch (e) {
    console.error('[auto-commit] Error:', e?.message || e);
  }
}

console.log(`[auto-commit] Watching for changes every ${INTERVAL_MS / 1000}s…`);
commitOnce();
setInterval(commitOnce, INTERVAL_MS);
