#!/usr/bin/env node
/*
 * real-estate-quiz.test.js — INVARIANT guard for real-estate-quiz.html
 *
 * Rule (non-negotiable): every question in BANK must offer a per-question book/source
 * page after it is answered — either q.book.imgs (with q.book.page) OR q.pageImg.
 * The in-app "Search the book" box is a secondary tool and is NOT a substitute.
 *
 * Run before every deploy:   node real-estate-quiz.test.js
 * Exits 0 if every question has proof; exits 1 (and lists offenders) otherwise.
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, 'real-estate-quiz.html');
const html = fs.readFileSync(FILE, 'utf8');

function extractArray(varName) {
  const marker = 'const ' + varName + ' = [';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error('Could not find ' + varName + ' in ' + FILE);
  const arrStart = html.indexOf('[', start);
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = arrStart; i < html.length; i++) {
    const c = html[i];
    if (inStr) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') { inStr = true; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  return JSON.parse(html.slice(arrStart, end + 1));
}

function hasProof(q) {
  const bookImgs = !!(q.book && q.book.imgs && Object.keys(q.book.imgs).length);
  return bookImgs || !!q.pageImg;
}

const BANK = extractArray('BANK');
const missing = BANK.filter(q => !hasProof(q));

console.log('Questions in BANK: ' + BANK.length);
console.log('With book/source page proof: ' + (BANK.length - missing.length));
console.log('Missing proof: ' + missing.length);

if (missing.length) {
  console.error('\nINVARIANT BROKEN — these questions have no book/source page:');
  for (const q of missing) {
    console.error('  - ' + q.id + ' (ch ' + q.ch + ', ' + (q.source || '?') + ')');
  }
  console.error('\nFix: attach q.book.imgs + q.book.page (scanned pages) or q.pageImg (rendered page).');
  process.exit(1);
}

console.log('\nOK — every question has a "See it in the book" path. Invariant holds.');
process.exit(0);
