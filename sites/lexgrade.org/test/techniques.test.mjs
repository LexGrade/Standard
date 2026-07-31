// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { existsSync, readFileSync } from 'node:fs';

import { parse as parseYaml } from 'yaml';

import { loadBundle, loadTechniqueRegister, parseTechniqueFields, parseTechniques, slugifyTechnique } from '../src/lib/loadStandard.mjs';
import { resolveCriteriaPath, resolveDataRoot } from '../src/lib/paths.mjs';

// slugifyTechnique must be stable and deterministic so a technique keeps the
// same URL across surfaces and over time.
test('slugifyTechnique produces stable slugs for the register names', () => {
  assert.equal(slugifyTechnique('Weaponized Absence'), 'weaponized-absence');
  assert.equal(slugifyTechnique('Catch-22 Demand'), 'catch-22-demand');
  assert.equal(slugifyTechnique("The Concession That Isn't"), 'the-concession-that-isnt');
  assert.equal(slugifyTechnique("The Judge's Checklist"), 'the-judges-checklist');
  assert.equal(slugifyTechnique('Reader-Drawn Conclusions'), 'reader-drawn-conclusions');
});

// Pure-parser contract on a minimal fixture: numbered blocks become techniques,
// tier separators and preamble fall through, metadata is lifted.
const FIXTURE = `# Register
## TECHNIQUE DEFINITIONS

### 1. Weaponized Absence
*Category: Structural* *Tier: Foundational*
**Definition:** What is conspicuously missing.
Body line one.
**Requirements:**
1. First requirement
2. Second requirement
**Example:** The right way.
**Anti-pattern:** The wrong way.

### — TIER 1: INFORMAL —

### 2. The Concession That Isn't
*Category: Rhetorical*
**Definition:** A concession that concedes nothing.
Body two.

## NEXT SECTION
### 99. Not A Technique (outside the section)
`;

test('parseTechniques splits numbered blocks and skips tier separators', () => {
  const techniques = parseTechniques(FIXTURE);

  assert.equal(techniques.length, 2);
  assert.deepEqual(
    techniques.map((t) => t.number),
    [1, 2],
  );
  assert.equal(techniques[0].slug, 'weaponized-absence');
  assert.equal(techniques[0].category, 'Structural');
  assert.equal(techniques[0].tier, 'Foundational');
  assert.equal(techniques[0].definition, 'What is conspicuously missing.');
  assert.match(techniques[0].body, /Body line one\./);
  // The "### — TIER 1 —" divider and the out-of-section "### 99." are excluded.
  assert.ok(!techniques.some((t) => t.number === 99));
});

// The standardized field model is attached to each technique and drives both the
// per-technique page and /api/v1/techniques.json.
test('parseTechniques attaches the standardized field model', () => {
  const t = parseTechniques(FIXTURE)[0];
  // Requirements stay as raw markdown (rendered to an <ol> at build time).
  assert.match(t.fields.requirements, /1\. First requirement/);
  assert.match(t.fields.requirements, /2\. Second requirement/);
  assert.equal(t.fields.example, 'The right way.');
  assert.equal(t.fields.antiPattern, 'The wrong way.');
  // The definition is lifted to the top level, not duplicated into fields.
  assert.equal(t.fields.notes.length, 0);
});

test('parseTechniqueFields buckets known labels and falls unknown labels through to notes', () => {
  const f = parseTechniqueFields(
    "**Example:** Good.\n\n**Anti-pattern:** Bad.\n\n**Why it's expert:** Because.\n\n**Strategic value:** A note.\n\n**Distinguished from X:** A difference.",
  );
  assert.equal(f.example, 'Good.');
  assert.equal(f.antiPattern, 'Bad.');
  assert.equal(f.why.label, "Why it's expert");
  assert.equal(f.distinctions[0].label, 'Distinguished from X');
  assert.equal(f.notes[0].label, 'Strategic value');
  assert.equal(f.notes[0].text, 'A note.');
});

// The inter-technique "---" separator must never leak into the last field — the
// blocker the verification pass caught on all technique pages.
test('parseTechniqueFields strips a trailing thematic break from the last field', () => {
  const f = parseTechniqueFields('**Anti-pattern:** The wrong way.\n\n---');
  assert.equal(f.antiPattern, 'The wrong way.');
  const g = parseTechniqueFields('**Requirements:**\n1. One\n2. Two\n---');
  assert.ok(!/-{3,}/.test(g.requirements), 'no trailing dashes survive in requirements');
  assert.match(g.requirements, /2\. Two/);
});

test('parseTechniques returns [] when the definitions section is absent', () => {
  assert.deepEqual(parseTechniques('# Just a title\nno definitions here'), []);
});

// Integration: the real register parses to a contiguous, uniquely-slugged set.
// No hardcoded count — the canonical total lives once in lgs-criteria.yaml (and
// is cross-checked below). This asserts the structure that catches add/drop/dup
// drift, so growing the register never requires touching a magic number here.
test('the real register parses to a contiguous, uniquely-slugged set of techniques', () => {
  const { markdown } = loadTechniqueRegister();
  const techniques = parseTechniques(markdown);

  assert.ok(techniques.length > 0);
  assert.deepEqual(
    techniques.map((t) => t.number),
    Array.from({ length: techniques.length }, (_, i) => i + 1),
    'technique numbers are contiguous 1..N',
  );

  const slugs = techniques.map((t) => t.slug);
  assert.equal(new Set(slugs).size, techniques.length, 'every technique slug is unique');
  assert.ok(slugs.includes('uncharacterized-omission'));
  assert.ok(slugs.includes('adverse-party-sourcing'));
  assert.ok(slugs.includes('the-judges-checklist'));
  // No empty slugs, no leftover tier dividers.
  assert.ok(slugs.every((s) => s.length > 0));
});

// Anti-drift guard: the hand-maintained technique_register metadata in
// lgs-criteria.yaml (total, category counts, ids) must match the parsed register
// (the markdown source of truth). This is what caught the 32→38 drift.
test('lgs-criteria.yaml technique_register matches the parsed register', () => {
  const register = parseTechniques(loadTechniqueRegister().markdown);
  const yaml = parseYaml(readFileSync(resolveCriteriaPath(resolveDataRoot(process.cwd(), existsSync), existsSync), 'utf-8'));
  const tr = yaml.technique_register;

  // Total matches the parsed count.
  assert.equal(tr.total, register.length, 'technique_register.total');

  // Group the parsed register by category in first-appearance order.
  const order = [];
  const byCat = new Map();
  for (const t of register) {
    if (!byCat.has(t.category)) {
      byCat.set(t.category, []);
      order.push(t.category);
    }
    byCat.get(t.category).push(t.number);
  }

  // Category names, in order, and each category's count + ids match exactly.
  assert.deepEqual(tr.categories.map((c) => c.name), order, 'category names / order');
  for (const c of tr.categories) {
    const ids = byCat.get(c.name);
    assert.equal(c.count, ids.length, `count for ${c.name}`);
    assert.deepEqual(c.ids, ids, `ids for ${c.name}`);
  }
});

// Anti-drift guard #2: the register markdown's OWN summary tables — the Category
// Index, the per-technique template table, the "Technique Count: __/N" line, and
// the Category Distribution — must stay consistent with the ### technique blocks
// they summarize. Nothing checked these before, so adding a technique block while
// forgetting one of the tables would drift silently. This closes that gap.
test('the register markdown summary tables match its technique blocks', () => {
  const { markdown } = loadTechniqueRegister();
  const techniques = parseTechniques(markdown);

  const order = [];
  const byCat = new Map();
  for (const t of techniques) {
    if (!byCat.has(t.category)) {
      byCat.set(t.category, []);
      order.push(t.category);
    }
    byCat.get(t.category).push(t.number);
  }

  // Category Index table rows: | Category | Count | #id, #id, … |
  for (const [cat, nums] of byCat) {
    const m = markdown.match(new RegExp(`\\|\\s*${cat}\\s*\\|\\s*(\\d+)\\s*\\|\\s*([^|]+)\\|`));
    assert.ok(m, `Category Index row for ${cat}`);
    assert.equal(Number(m[1]), nums.length, `Category Index count for ${cat}`);
    const ids = (m[2].match(/#(\d+)/g) || []).map((s) => Number(s.slice(1)));
    assert.deepEqual(ids, nums, `Category Index ids for ${cat}`);
  }

  // "Technique Count: ___/N" reflects the real total.
  const countLine = markdown.match(/Technique Count:[^/]*\/(\d+)/);
  assert.ok(countLine, 'Technique Count line present');
  assert.equal(Number(countLine[1]), techniques.length, 'Technique Count total');

  // Category Distribution: "- Category: ___/N" per category.
  for (const [cat, nums] of byCat) {
    const d = markdown.match(new RegExp(`-\\s*${cat}:[^/]*\\/(\\d+)`));
    assert.ok(d, `distribution line for ${cat}`);
    assert.equal(Number(d[1]), nums.length, `distribution count for ${cat}`);
  }

  // Template table: every technique block has a "| N | Name | Category |" row.
  for (const t of techniques) {
    assert.match(
      markdown,
      new RegExp(`\\|\\s*${t.number}\\s*\\|\\s*[^|]+?\\s*\\|\\s*${t.category}\\s*\\|`),
      `template row for #${t.number} (${t.category})`,
    );
  }
});

// The Standard's §7 summary (the "N-technique" count and the category table)
// must mirror the Register itself — this is the guard against the two documents
// drifting apart, which has happened once (§7 said 32 while the Register held 39).
test('the Standard §7 summary mirrors the Register: total and per-category counts', () => {
  const techniques = parseTechniques(loadTechniqueRegister().markdown);
  const standardMd = loadBundle().documents[0];

  const headline = standardMd.match(/The (\d+)-technique Technique Register/);
  assert.ok(headline, 'Standard §7 names a technique count');
  assert.equal(Number(headline[1]), techniques.length, '§7 headline count');

  const section = standardMd.split(/^## 7\. Technique Register/m)[1]?.split(/^## /m)[0];
  assert.ok(section, 'Standard has a §7 Technique Register section');

  const byCat = new Map();
  for (const t of techniques) byCat.set(t.category, (byCat.get(t.category) ?? 0) + 1);

  const rows = [...section.matchAll(/^\| ([A-Za-z]+) \| (\d+) \|/gm)];
  assert.equal(rows.length, byCat.size, '§7 table lists every Register category');
  let total = 0;
  for (const [, cat, count] of rows) {
    assert.equal(Number(count), byCat.get(cat), `§7 count for ${cat}`);
    total += Number(count);
  }
  assert.equal(total, techniques.length, '§7 table counts sum to the Register total');
});
