#!/usr/bin/env zx
import fs from 'fs';
import { $ } from 'zx';

$.shell = 'powershell.exe';  // Windows PowerShell verwenden
$.prefix = 'powershell.exe -ExecutionPolicy Bypass -Command ';

const FILE = 'Development_Checklist.md';
const TASK = process.argv[2];

let md = fs.readFileSync(FILE, 'utf8');
md = md.replace(
  new RegExp(`- \\[ \\] (.*${TASK}.*)`, 'i'),
  '- [x] $1',
);

fs.writeFileSync(FILE, md);
await $`git add ${FILE}`;