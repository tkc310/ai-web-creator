#!/usr/bin/env node
// design-nexus static lint. Node 26.13.0+, no dependencies.
// Usage: node lint.mjs <file-or-dir>... [--design DESIGN.md] [--json]
// (--surface is accepted and ignored, so the same flags work for lint and render-check.)
// Exit: 0 clean, 2 floor findings, 1 usage error.
// Suppress: `design-nexus: keep R02 because <reason>` or `design-nexus-disable R02` anywhere in a file.
import fs from 'node:fs';
import path from 'node:path';
import {
  parseColor, hsl, normHex, readTokens, tokenColors, OVERUSED_FONTS, primaryFamily, printFindings, summarize, tierOf,
} from './lib.mjs';

const EXT = new Set(['.html', '.htm', '.css', '.scss', '.sass', '.less', '.jsx', '.tsx', '.js', '.ts', '.vue', '.svelte', '.astro', '.mdx']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.nuxt', 'out', 'coverage', '.design-nexus', 'vendor']);

const args = process.argv.slice(2);
const opt = { json: false, design: null, targets: [] };
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--json') opt.json = true;
  else if (args[i] === '--design') opt.design = args[++i];
  else if (args[i] === '--surface') i++;
  else if (args[i] === '--help' || args[i] === '-h') { usage(); process.exit(0); }
  else opt.targets.push(args[i]);
}
if (!opt.targets.length) { usage(); process.exit(1); }

function usage() {
  console.log('usage: node lint.mjs <file-or-dir>... [--design DESIGN.md] [--json]');
}

function walk(p, out) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(p)) if (!SKIP_DIRS.has(e)) walk(path.join(p, e), out);
  } else if (EXT.has(path.extname(p).toLowerCase())) out.push(p);
}

const files = [];
for (const t of opt.targets) walk(t, files);

// Auto-detect DESIGN.md next to the first target when not given.
if (!opt.design) {
  for (const t of opt.targets) {
    const dir = fs.statSync(t).isDirectory() ? t : path.dirname(t);
    const cand = path.join(dir, 'DESIGN.md');
    if (fs.existsSync(cand)) { opt.design = cand; break; }
  }
}
const tokens = opt.design && fs.existsSync(opt.design) ? readTokens(opt.design) : null;
const allowed = tokens ? new Set(Object.values(tokenColors(tokens)).map(normHex)) : null;

const findings = [];
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;
const snip = (s) => s.replace(/\s+/g, ' ').trim().slice(0, 120);

// Aggregate state across files.
const agg = { hexes: new Map(), motionAt: null, hasReducedMotion: false, radiusBig: [], blur: [], kept: new Map(), darkScheme: false, fontsUsed: new Map(), fontsLoaded: new Set(), anyLoader: false, props: new Map() };

// Faces that ship with common operating systems; declaring them needs no loader.
const SYSTEM_FONTS = /^(system-ui|-apple-system|blinkmacsystemfont|ui-[\w-]+|segoe ui|roboto|helvetica( neue)?|arial|georgia|times( new roman)?|verdana|tahoma|trebuchet ms|courier( new)?|menlo|monaco|consolas|sf (pro|mono)[\w ]*|hiragino[\w ]*|yu (gothic|mincho)|游ゴシック|游明朝|meiryo|メイリオ|ms (p?gothic|p?mincho)|sans-serif|serif|monospace|cursive|fantasy|emoji|math)$/i;

// Blanks out text between tags (keeping <style>, <script>, and the tags themselves) so offsets and line numbers still line up.
const maskTextNodes = (text) => text.replace(/(<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<!--[\s\S]*?-->|<[^>]*>)|[^<]+/g, (m, keep) => keep || m.replace(/[^\n]/g, ' '));

const safeDecode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

const HYPE = [
  'lorem ipsum', 'welcome to', 'unlock the', 'unlock your', 'elevate your', 'seamless', 'seamlessly',
  'revolutionize', 'revolutionary', 'supercharge', 'empower', 'next-generation', 'next-gen', 'cutting-edge',
  'game-changer', 'game changing', 'game-changing', 'unleash', 'take your .{1,20} to the next level',
  '革新的な', '次世代の', 'シームレスな', 'を加速', '圧倒的な', '新時代の',
];
// Notes about the page itself (R19). Kept narrow: words a real product page would not say to its visitors.
const META = [
  'sample data', 'placeholder (?:name|text|image|photo|copy|logo)', 'dummy (?:data|text|content)', 'replace (?:this |it )?with (?:a |the )?real',
  'before (?:publishing|launch|going live)', 'not the real (?:screen|product|data)', 'draft note', '\\bTODO\\b', '\\bTBD\\b',
  'サンプルデータ', 'ダミー', '表示見本', '見本の(?:時刻|データ|画面|数字)', '仮の(?:名前|文章|データ|画像|写真|店名|住所)', '実際の画面ではありません', '公開前に(?:確認|差し替え)', '差し替えてください', '差し替え予定', '架空のデータ',
];
const META_RE = new RegExp(`(${META.join('|')})`, 'gi');
const HYPE_RE = new RegExp(`(${HYPE.join('|')})`, 'gi');
const CJK_RE = /[぀-ヿ㐀-鿿]/;
const EMOJI_RE = /\p{Extended_Pictographic}/u;

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const ext = path.extname(file).toLowerCase();
  const rel = path.relative(process.cwd(), file) || file;
  const isMarkup = !['.css', '.scss', '.sass', '.less'].includes(ext);
  const isHtmlDoc = /<html[\s>]/i.test(text);
  const hasCJK = CJK_RE.test(text.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''));

  const kept = new Map();
  for (const m of text.matchAll(/design-nexus:\s*keep\s+([FRN]\d{2})\s+because\s+([^\n*>]+)/gi)) kept.set(m[1].toUpperCase(), m[2].trim());
  const disabled = new Set();
  for (const m of text.matchAll(/design-nexus-disable\s+([FRN]\d{2}(?:[\s,]+[FRN]\d{2})*)/gi)) {
    for (const id of m[1].split(/[\s,]+/)) disabled.add(id.toUpperCase());
  }

  const seenAt = new Set();
  const add = (id, idx, message, raw) => {
    if (disabled.has(id)) return;
    const key = `${id}:${idx == null ? "" : lineOf(text, idx)}:${id === "R03" ? "" : message}`;
    if (seenAt.has(key)) return;
    seenAt.add(key);
    const f = { id, tier: tierOf(id), file: rel, line: idx == null ? null : lineOf(text, idx), message };
    if (raw) f.snippet = snip(raw);
    if (kept.has(id)) {
      if (id.startsWith('F')) f.message += ' (floor checks cannot be kept)';
      else f.kept = kept.get(id);
    }
    findings.push(f);
  };
  const each = (re, fn) => { for (const m of text.matchAll(re)) fn(m); };

  // F02 focus removed without a focus-visible replacement in this file
  const hasFocusStyle = /:focus-visible|focus-visible:|:focus\s*\{[^}]*(outline|box-shadow|border)|focus:ring|focus:outline-|focus-within:ring/.test(text);
  each(/outline\s*:\s*(none|0)\b|\boutline-none\b/g, (m) => {
    if (!hasFocusStyle) add('F02', m.index, 'Focus outline removed with no :focus-visible style in this file', m[0]);
  });

  if (isMarkup) {
    // F03 / N04 images
    each(/<(img|Image)\b([^>]*?)\/?>/g, (m) => {
      const attrs = m[2];
      if (!/\balt\s*=/.test(attrs)) add('F03', m.index, `<${m[1]}> without alt`, m[0]);
      if (m[1] === 'img' && !/\bwidth\s*=/.test(attrs) && !/\bheight\s*=/.test(attrs) && !/\bfill\b/.test(attrs)) {
        add('N04', m.index, '<img> without width/height (layout shift)', m[0]);
      }
    });

    // F04 / N05 document basics
    if (isHtmlDoc) {
      const htmlTag = text.match(/<html\b[^>]*>/i);
      if (htmlTag && !/\blang\s*=/.test(htmlTag[0])) add('F04', htmlTag.index, '<html> without lang', htmlTag[0]);
      if (!/<meta[^>]+name=["']viewport["']/i.test(text)) add('F04', null, 'Missing viewport meta');
      if (!/<title>[^<]+<\/title>/i.test(text)) add('N05', null, 'Missing <title>');
      if (!/<meta[^>]+name=["']description["']/i.test(text)) add('N05', null, 'Missing meta description');
    }

    // F06 click handlers on non-interactive elements
    each(/<(div|span|li|p|section|article|img|td|tr)\b([^>]*?)\b(onClick|onclick|@click|v-on:click|on:click)\s*=([^>]*)>/g, (m) => {
      const attrs = m[2] + m[4];
      if (!/\brole\s*=/.test(attrs) || !/\btab[iI]ndex\s*=/.test(attrs)) {
        add('F06', m.index, `Click handler on <${m[1]}> without role and tabIndex; use <button> or <a>`, m[0]);
      }
    });

    // F07 inputs without labels
    each(/<(input|select|textarea)\b([^>]*?)\/?>/g, (m) => {
      const attrs = m[2];
      const type = (attrs.match(/\btype\s*=\s*["']?(\w+)/) || [])[1];
      if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) return;
      if (/\baria-label(ledby)?\s*=/.test(attrs) || /\btitle\s*=/.test(attrs)) return;
      const id = (attrs.match(/\bid\s*=\s*["'{]?([\w-]+)/) || [])[1];
      if (id && new RegExp(`(for|htmlFor)\\s*=\\s*["'{]?${id}\\b`).test(text)) return;
      const before = text.slice(Math.max(0, m.index - 400), m.index);
      const lastOpen = before.lastIndexOf('<label');
      if (lastOpen !== -1 && before.indexOf('</label>', lastOpen) === -1) return;
      add('F07', m.index, `<${m[1]}> without a label${/placeholder=/.test(attrs) ? ' (placeholder is not a label)' : ''}`, m[0]);
    });

    // F10 icon-only buttons/links without accessible name
    // The svg alternative may not run past its own </svg>, or a labelled icon button would match up to a later icon-only one.
    each(/<(button|a)\b([^>]*)>\s*(<svg(?:(?!<\/svg>)[\s\S])*<\/svg>|<[A-Z]\w*(?:Icon)?\b[^>]*\/>|<i\b[^>]*><\/i>|<span[^>]*class=["'][^"']*icon[^"']*["'][^>]*><\/span>)\s*<\/\1>/g, (m) => {
      const attrs = m[2];
      if (/\baria-label(ledby)?\s*=|\btitle\s*=/.test(attrs)) return;
      if (/<title>/.test(m[3])) return;
      add('F10', m.index, `Icon-only <${m[1]}> without aria-label`, m[0]);
    });

    // R05 emoji as icons in headings, buttons, list items
    each(/<(h[1-6]|button|li|a)\b[^>]*>([^<]{0,160})/g, (m) => {
      if (EMOJI_RE.test(m[2])) add('R05', m.index, `Emoji used as an icon in <${m[1]}>`, m[0]);
    });

    // R09 template hero CTA pair
    const ctaPair = /(get started|start free|try (it )?free)[\s\S]{0,400}(learn more|see how it works|watch demo)/i.exec(text);
    if (ctaPair) add('R09', ctaPair.index, 'Template hero CTA pair ("Get started" + "Learn more"); write actions specific to this product', ctaPair[0].slice(0, 80));

    // R11 numbered markers
    const markers = [...text.matchAll(/>\s*0[1-9]\.?\s*</g)];
    if (markers.length >= 3) add('R11', markers[0].index, `${markers.length} numbered markers (01/02/03…): confirm they encode a real sequence`);
  }

  // R10 hype/template copy (skip code comments)
  const textOnly = text.replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, (s) => ' '.repeat(s.length));
  const hype = new Set();
  for (const m of textOnly.matchAll(HYPE_RE)) {
    const k = m[1].toLowerCase();
    if (hype.has(k)) continue;
    hype.add(k);
    add('R10', m.index, `Template/hype copy: "${m[1]}"`);
  }

  // R19 the page talks about itself: notes to the owner or reviewer left in visible copy or alt text
  if (isMarkup) {
    const visible = text.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<!--[\s\S]*?-->/gi, (s) => s.replace(/[^\n]/g, ' '))
      .replace(/<[^>]*>/g, (tag) => {
        const alt = tag.match(/\balt\s*=\s*("[^"]*"|'[^']*')/i);
        return alt ? ' '.repeat(tag.indexOf(alt[1])) + alt[1] + ' '.repeat(tag.length - tag.indexOf(alt[1]) - alt[1].length) : ' '.repeat(tag.length);
      });
    const seen = new Set();
    for (const m of visible.matchAll(META_RE)) {
      const k = m[1].toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      add('R19', m.index, `Note to the owner or reviewer in visible copy: "${m[1]}"; move it to NOTES.md`);
    }
  }

  // F12 tiny text
  each(/font-size\s*:\s*([\d.]+)(px|rem|em)\b/g, (m) => {
    const px = m[2] === 'px' ? +m[1] : +m[1] * 16;
    if (px < 12) add('F12', m.index, `Font size ${m[1]}${m[2]} is below 12px`, m[0]);
  });
  each(/\btext-\[(\d+(?:\.\d+)?)(px|rem)\]/g, (m) => {
    const px = m[2] === 'px' ? +m[1] : +m[1] * 16;
    if (px < 12) add('F12', m.index, `Font size ${m[1]}${m[2]} is below 12px`, m[0]);
  });

  // R01 overused primary font
  const fontDecls = [
    ...[...text.matchAll(/font-family\s*:\s*([^;}{"\n]+(?:"[^"]*"[^;}{\n]*)*)/g)].map((m) => [m.index, m[1]]),
    ...[...text.matchAll(/fontFamily\s*:\s*\[?\s*["'`]([^"'`]+)/g)].map((m) => [m.index, m[1]]),
    ...[...text.matchAll(/fonts\.googleapis\.com\/css2?\?family=([\w+]+)/g)].map((m) => [m.index, m[1].replace(/\+/g, ' ')]),
    ...[...text.matchAll(/import\s*\{\s*(\w+)\s*\}\s*from\s*["']next\/font\/google["']/g)].map((m) => [m.index, m[1].replace(/_/g, ' ')]),
  ];
  const seenFont = new Set();
  for (const [idx, decl] of fontDecls) {
    const fam = primaryFamily(decl);
    if (fam.startsWith('var(') || fam === 'inherit') continue;
    if (OVERUSED_FONTS.includes(fam) && !seenFont.has(fam)) {
      seenFont.add(fam);
      add('R01', idx, `"${fam}" as the primary family; choose a face with a voice that fits the subject`);
    }
    if (/noto sans jp/i.test(decl) && decl.split(',').length <= 2 && !seenFont.has('noto')) {
      seenFont.add('noto');
      add('R01', idx, 'Noto Sans JP alone; consider a Latin pairing or a family with more voice (see japanese.md)');
    }
  }

  // R02 purple/indigo gradients
  each(/\b(from|via|to)-(indigo|purple|violet|fuchsia)-\d{2,3}\b/g, (m) => add('R02', m.index, 'Purple/indigo gradient utility', m[0]));
  each(/(linear|radial|conic)-gradient\(([^;]*?)\)\s*[;"'}]/g, (m) => {
    const hexes = m[2].match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) || [];
    const purple = hexes.some((h) => {
      const c = parseColor(h);
      if (!c) return false;
      const { h: hue, s, l } = hsl(c);
      return hue >= 235 && hue <= 300 && s > 0.35 && l > 0.2 && l < 0.85;
    });
    if (purple) add('R02', m.index, 'Purple/indigo gradient', m[0]);
  });

  // R03 gradient text
  each(/background-clip\s*:\s*text|\bbg-clip-text\b/g, (m) => add('R03', m.index, 'Gradient-filled text', m[0]));

  // R12 transition: all
  each(/transition\s*:\s*all\b|\btransition-all\b/g, (m) => add('R12', m.index, 'transition: all; list the properties you animate', m[0]));

  // R14 Japanese typesetting
  if (hasCJK) {
    each(/font-style\s*:\s*italic|\bitalic\b(?=[^<>]*["'])/g, (m) => add('R14', m.index, 'Italic with Japanese text (no true italic in Japanese fonts)', m[0]));
    each(/letter-spacing\s*:\s*-[\d.]+|\btracking-(tight|tighter)\b/g, (m) => add('R14', m.index, 'Negative letter-spacing with Japanese text', m[0]));
    // Line-height is checked by render-check.mjs on multi-line Japanese text, where it can tell body copy from labels and numerals.

  }

  // N01 z-index
  each(/z-index\s*:\s*(\d{4,})|\bz-\[(\d{4,})\]/g, (m) => add('N01', m.index, `z-index ${m[1] || m[2]}; use a layering scale`, m[0]));
  // N02 !important
  const imp = [...text.matchAll(/!important/g)];
  if (imp.length > 5) add('N02', imp[0].index, `${imp.length} !important declarations`);
  // N03 inline styles
  if (isMarkup) {
    const inl = [...text.matchAll(/\sstyle\s*=\s*["{]/g)];
    if (inl.length > 10) add('N03', inl[0].index, `${inl.length} inline styles; move values into tokens`);
  }
  // N07 heading balance
  if (/<h1\b/.test(text) && !/text-wrap\s*:\s*balance|\btext-balance\b/.test(text) && isHtmlDoc) {
    add('N07', null, 'Headings without text-wrap: balance');
  }

  // aggregates
  for (const [id, why] of kept) if (!agg.kept.has(id)) agg.kept.set(id, why);
  if (/prefers-color-scheme\s*:\s*dark|\[data-theme=["']?dark|\.dark\s*[{,]/.test(text)) agg.darkScheme = true;
  for (const [idx, decl] of fontDecls) {
    const fam = primaryFamily(decl);
    if (!fam || /^(var\(|inherit|initial)/.test(fam) || SYSTEM_FONTS.test(fam)) continue;
    if (!agg.fontsUsed.has(fam)) agg.fontsUsed.set(fam, { file: rel, line: lineOf(text, idx) });
  }
  // Custom properties that hold a font stack: a family-like name, and a value that is quoted or a comma list.
  for (const m of text.matchAll(/--((?:[\w-]*-)?(?:font|family|serif|sans|mono|display|typeface)(?:-[\w-]+)?)\s*:\s*([^;}\n]+)/gi)) {
    if (/size|weight|wght|line|leading|lh|tracking|spacing|feature|settings|variation|color|colour|shadow|style|stretch|case|variant|scale|ratio|width|height|gap|radius|transform|opsz|axis/i.test(m[1])) continue;
    if (!/^\s*["']|,/.test(m[2])) continue;
    const fam = primaryFamily(m[2]);
    if (fam && !/^(var\(|[\d.#-]|rgb|hsl|oklch|inherit|normal|bold)/.test(fam) && !SYSTEM_FONTS.test(fam) && !agg.fontsUsed.has(fam)) agg.fontsUsed.set(fam, { file: rel, line: lineOf(text, m.index) });
  }
  for (const m of text.matchAll(/@font-face\s*\{[^}]*font-family\s*:\s*["']?([^;"'}]+)/g)) agg.fontsLoaded.add(m[1].trim().toLowerCase());
  for (const m of text.matchAll(/fonts\.googleapis\.com\/css2?\?([^"'\s)]+)/g)) {
    // css2 repeats family=; the legacy css API separates families with |.
    for (const f of m[1].matchAll(/family=([^&"']+)/g)) {
      for (const one of safeDecode(f[1]).split('|')) agg.fontsLoaded.add(one.split(':')[0].replace(/\+/g, ' ').trim().toLowerCase());
    }
  }
  for (const m of text.matchAll(/from\s*["']next\/font\/google["']|from\s*["']@fontsource|fonts\.bunny\.net|use\.typekit\.net|fontshare\.com/g)) agg.anyLoader = true;
  for (const m of text.matchAll(/--([\w-]+)\s*:\s*([^;}\n]+)/g)) if (!agg.props.has(m[1].toLowerCase())) agg.props.set(m[1].toLowerCase(), m[2].trim());
  // In markup, only styles, scripts, and tag attributes hold colors; "#214" in body text is a ticket number.
  const colorText = isMarkup ? maskTextNodes(text) : text;
  for (const m of colorText.matchAll(/#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-fA-F])/g)) {
    const before = text.slice(Math.max(0, m.index - 6), m.index);
    if (/&$|href=["']?$|url\([^)]*$/.test(before)) continue;
    // An all-digit "#221" in a script string is a ticket or issue number unless it sits where a color value does.
    if (/^#\d+$/.test(m[0]) && !(/[:=(,'"`]\s*$/.test(before) && /^\s*(?:['"`),;}!]|$)/m.test(colorText.slice(m.index + m[0].length, m.index + m[0].length + 3)))) continue;
    const h = normHex(m[0]);
    if (!h) continue;
    if (!agg.hexes.has(h)) agg.hexes.set(h, { file: rel, line: lineOf(text, m.index) });
  }
  const mot = /@keyframes|\banimation\s*:|\banimate-[a-z]|framer-motion|from ["']motion|gsap|\btransition\s*:\s*(?!none)/.exec(text);
  if (mot && !agg.motionAt) agg.motionAt = { file: rel, line: lineOf(text, mot.index) };
  if (/prefers-reduced-motion|motion-reduce:|motion-safe:|useReducedMotion|reducedMotion/.test(text)) agg.hasReducedMotion = true;
  for (const m of text.matchAll(/border-radius\s*:\s*(\d+)px|\brounded-(2xl|3xl|\[\d+px\])/g)) {
    const px = m[1] ? +m[1] : null;
    if (px !== null && (px < 16 || px >= 999)) continue;
    agg.radiusBig.push({ file: rel, line: lineOf(text, m.index) });
  }
  for (const m of text.matchAll(/backdrop-filter\s*:\s*blur|\bbackdrop-blur(-\w+)?\b/g)) agg.blur.push({ file: rel, line: lineOf(text, m.index) });
}

// Cross-file checks
const push = (id, at, message) => findings.push({ id, tier: tierOf(id), file: at?.file, line: at?.line, message });
if (agg.motionAt && !agg.hasReducedMotion) push('F05', agg.motionAt, 'Motion without any prefers-reduced-motion handling');
if (agg.radiusBig.length > 8) push('R06', agg.radiusBig[0], `${agg.radiusBig.length} large radii (≥16px); reserve big radius for elements that need it`);
if (agg.blur.length > 3) push('R07', agg.blur[0], `${agg.blur.length} backdrop blurs; glass on many surfaces reads as template`);
if (allowed) {
  const off = [...agg.hexes.entries()].filter(([h]) => !allowed.has(h));
  for (const [h, at] of off.slice(0, 10)) push('R08', at, `${h} is not a DESIGN.md token`);
  if (off.length > 10) push('R08', null, `…and ${off.length - 10} more off-token colors`);
} else if (agg.hexes.size > (agg.darkScheme ? 24 : 12)) {
  push('R08', [...agg.hexes.values()][0], `${agg.hexes.size} distinct hex colors; consolidate into 4–8 tokens per scheme`);
}
// N09 the design record and the code disagree: a DESIGN.md color the code never uses (by value or by a matching custom property).
// Only when the scan includes the theme, i.e. at least half the token colors were found; linting one component alone says nothing.
if (tokens) {
  const colors = Object.entries(tokenColors(tokens)).filter(([k]) => !/component-/.test(k));
  // A same-named custom property in another color syntax (oklch, rgb) counts as present; one with a different hex does not.
  const propFor = (k) => [k.replace(/^(dark\.)?color\./, ''), k.replace(/^dark\./, '').replace(/\./g, '-')].map((n) => agg.props.get(n)).find(Boolean);
  const missing = colors.filter(([k, v]) => {
    if (agg.hexes.has(normHex(v))) return false;
    const p = propFor(k);
    return !p || /^#[0-9a-f]{3,8}$/i.test(p);
  });
  if (colors.length && missing.length <= colors.length / 2) {
    for (const [k, v] of missing) {
      const p = propFor(k);
      push('N09', { file: opt.design }, `DESIGN.md token ${k} (${v}) ${p ? `is ${p} in the code` : 'does not appear in the code'}; make the record match what ships`);
    }
  }
}
// R16 fonts named in CSS but never loaded: the page silently falls back to a default face.
if (!agg.anyLoader) {
  for (const [fam, at] of agg.fontsUsed) {
    if (!agg.fontsLoaded.has(fam)) push('R16', at, `"${fam}" is declared but never loaded (@font-face, a font CDN link, or next/font); visitors without it installed see a fallback`);
  }
}
// Cross-file findings honor a keep anywhere in the scanned files.
for (const f of findings) {
  if (!f.kept && ['R06', 'R07', 'R08', 'R16'].includes(f.id) && agg.kept.has(f.id)) f.kept = agg.kept.get(f.id);
}

const counts = summarize(findings);
if (opt.json) {
  console.log(JSON.stringify({ tool: 'design-nexus-lint', files: files.length, design: opt.design || null, counts, findings }, null, 2));
} else {
  printFindings(findings, `design-nexus lint: ${files.length} file(s)${opt.design ? `, tokens from ${opt.design}` : ''}`);
  if (counts.floor) console.log('\nFloor findings remain: the work is not done.');
}
process.exit(counts.floor ? 2 : 0);
