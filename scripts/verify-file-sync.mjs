#!/usr/bin/env node
/**
 * verify-file-sync.mjs
 * Prüft, ob erwartete Dateiänderungen wirklich erfolgt sind.
 * Versucht bei Abweichungen zweimal mit Node-FS zu reparieren,
 * fällt dann auf PowerShell zurück.
 */
import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

if (process.argv.length < 3) {
  console.error('Usage: node verify-file-sync.mjs <expected-changes.json>');
  process.exit(1);
}

const root = process.cwd();
const planPath = process.argv[2];

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function ensureDir(d) { await fs.mkdir(d, { recursive: true }); }

async function applyNode(ch) {
  const target = join(root, ch.path);
  switch (ch.action) {
    case 'create':
    case 'edit':
      await ensureDir(dirname(target));
      await fs.writeFile(target, ch.content || '', 'utf8');
      break;
    case 'delete':
      if (await exists(target)) await fs.unlink(target);
      break;
  }
}

function applyPS(ch) {
  const t = join(root, ch.path).replace(/\\/g, '/');
  let cmd = '';
  switch (ch.action) {
    case 'create':
    case 'edit': {
      const c = (ch.content || '').replace(/`/g, '``').replace(/"/g, '`"');
      cmd = `New-Item -Path '${t}' -ItemType File -Force | Out-Null; Set-Content -Path '${t}' -Value "${c}"`;
      break;
    }
    case 'delete':
      cmd = `if (Test-Path '${t}') { Remove-Item -Path '${t}' -Force }`;
      break;
  }
  if (cmd) execSync(`powershell.exe -ExecutionPolicy Bypass -Command "${cmd}"`);
}

async function verified(ch) {
  const p = join(root, ch.path);
  return ch.action === 'delete' ? !(await exists(p)) : await exists(p);
}

(async () => {
  const plan = JSON.parse(await fs.readFile(planPath, 'utf8'));
  for (const ch of plan) {
    if (await verified(ch)) continue;
    await applyNode(ch);
    if (await verified(ch)) continue;
    await applyNode(ch);
    if (await verified(ch)) continue;
    console.warn('Fallback PowerShell:', ch.path);
    applyPS(ch);
    if (!(await verified(ch))) {
      console.error('Failed to sync:', ch.path);
      process.exitCode = 1;
    }
  }
  if (process.exitCode !== 1) console.log('All changes synced.');
})();
