#!/usr/bin/env node
// Checks the ```tokens block of a DESIGN.md for contrast and coherence before any code is written.
// Usage: node tokens-check.mjs DESIGN.md [--json]
// Exit: 0 ok, 2 floor findings, 1 usage error.
import fs from 'node:fs';
import { readTokens, parseColor, contrast, OVERUSED_FONTS, primaryFamily, printFindings, summarize, tierOf } from './lib.mjs';

const args = process.argv.slice(2);
const json = args.includes('--json');
const file = args.find((a) => !a.startsWith('--'));
if (!file || !fs.existsSync(file)) {
  console.log('usage: node tokens-check.mjs DESIGN.md [--json]');
  process.exit(1);
}

const tokens = readTokens(file);
const findings = [];
const add = (id, where, message) => findings.push({ id, tier: tierOf(id), where, message });

if (!tokens) {
  add('F01', file, 'No ```tokens block found; contrast cannot be checked');
} else {
  const DEFAULT_PAIRS = 'text/bg, muted/bg, text/surface, muted/surface, on-accent/accent, accent/bg';
  const pairs = (tokens.pairs || DEFAULT_PAIRS).split(',').map((p) => p.trim().split('/'));
  // Large-text and non-text pairs only need 3:1.
  const needs = (fg) => (/accent|border|icon|focus/.test(fg) && fg !== 'on-accent' ? 3 : 4.5);

  for (const scheme of ['', 'dark.']) {
    const get = (role) => tokens[`${scheme}color.${role}`];
    if (scheme && !get('bg')) continue;
    for (const [fg, bg] of pairs) {
      const a = parseColor(get(fg)), b = parseColor(get(bg));
      if (!a || !b) continue;
      const ratio = contrast(a, b);
      const min = needs(fg);
      const label = tokens[`label.${fg.replace(/-fg$/, '')}`];
      if (ratio < min) add('F01', label ? `component ${label}` : `${scheme}${fg}/${bg}`, `contrast ${ratio.toFixed(2)}:1 < ${min}:1 (${get(fg)} on ${get(bg)})`);
    }
    const roles = Object.keys(tokens).filter((k) => k.startsWith(`${scheme}color.`) && !k.includes('component-') && (scheme || !k.startsWith('dark.')));
    if (roles.length > 10) add('R08', `${scheme || 'light '}palette`, `${roles.length} color tokens; most interfaces need 4–8 plus status colors`);
  }

  // Dark scheme coherence: the dark bg should actually be dark, and vice versa.
  const lbg = parseColor(tokens['color.bg']), dbg = parseColor(tokens['dark.color.bg']);
  if (lbg && dbg && contrast(lbg, dbg) < 3) add('R08', 'dark.color.bg', 'Light and dark backgrounds are too similar; is the dark scheme really dark?');

  for (const role of ['display', 'body']) {
    const v = tokens[`font.${role}`];
    if (v && OVERUSED_FONTS.includes(primaryFamily(v))) add('R01', `font.${role}`, `"${primaryFamily(v)}" is an overused default`);
  }
  if (tokens['font.display'] && tokens['font.body'] && primaryFamily(tokens['font.display']) === primaryFamily(tokens['font.body'])) {
    add('N08', 'font', 'Display and body use the same family; fine if intentional, but state why');
  }
  const ratio = parseFloat(tokens['type.ratio']);
  if (tokens['type.ratio'] && (ratio < 1.1 || ratio > 1.618)) add('N08', 'type.ratio', `Type ratio ${ratio} is outside 1.1–1.618`);
  if (!tokens['space.base']) add('N08', 'space.base', 'No spacing base defined');
}

const counts = summarize(findings);
if (json) console.log(JSON.stringify({ tool: 'design-nexus-tokens', file, counts, findings }, null, 2));
else printFindings(findings, `design-nexus tokens: ${file}`);
process.exit(counts.floor ? 2 : 0);
