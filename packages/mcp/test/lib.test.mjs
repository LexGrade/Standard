// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  catalogJson,
  getCriterion,
  getTechnique,
  listCriteria,
  listPrinciples,
  listTechniques,
  load,
  search,
  slugifyTechnique,
} from '../lib.mjs';

test('load() reads the standard offline from the monorepo', () => {
  const d = load();
  assert.equal(d.version, '1.0');
  assert.ok(d.standardMarkdown.length > 1000, 'standard markdown is present');
  assert.ok(d.techniqueMarkdown.includes('TECHNIQUE DEFINITIONS'));
});

test('list_principles returns a contiguous P1..Pn set', () => {
  const p = listPrinciples();
  assert.ok(p.length > 0, 'has principles');
  // Contiguous ids P1..Pn — catches a dropped or renumbered principle without
  // hardcoding the count (which would drift if the standard ever changes).
  assert.deepEqual(
    p.map((x) => x.id),
    Array.from({ length: p.length }, (_, i) => `P${i + 1}`),
    'principle ids are contiguous P1..Pn',
  );
});

test('list_criteria filters by principle, and every criterion maps to a real principle', () => {
  const all = listCriteria();
  assert.ok(all.length > 0, 'has criteria');
  // Structural integrity instead of a magic count: every criterion belongs to a
  // principle that actually exists, so an orphaned or mistyped principle ref fails.
  const principleIds = new Set(listPrinciples().map((p) => p.id));
  assert.ok(all.every((c) => principleIds.has(c.principle)), 'every criterion references a real principle');
  const p3 = listCriteria('P3');
  assert.ok(p3.length > 0);
  assert.ok(p3.every((c) => c.principle === 'P3'));
});

test('get_criterion accepts "LGS 3.5", "3.5", and is case-insensitive', () => {
  const a = getCriterion('LGS 3.5');
  const b = getCriterion('3.5');
  const c = getCriterion('lgs 3.5');
  assert.ok(a && b && c);
  assert.equal(a.id, b.id);
  assert.equal(a.id, c.id);
  assert.equal(a.title, 'Adverse Authority');
});

test('the register is a contiguous, uniquely-slugged set of techniques', () => {
  const t = listTechniques();
  assert.ok(t.length > 0, 'register is non-empty');
  // Contiguous numbering 1..N — catches a dropped, duplicated, or misnumbered
  // technique without hardcoding a count that drifts as the register grows.
  assert.deepEqual(
    t.map((x) => x.number),
    Array.from({ length: t.length }, (_, i) => i + 1),
    'technique numbers are contiguous 1..N',
  );
  // Every technique has a distinct slug (no collisions across the whole register).
  assert.equal(new Set(t.map((x) => x.slug)).size, t.length);
});

test('get_technique works by number and slug', () => {
  const byNum = getTechnique('8');
  assert.ok(byNum);
  const bySlug = getTechnique(byNum.slug);
  assert.equal(byNum.number, bySlug.number);
});

test('slugifyTechnique normalizes names', () => {
  assert.equal(slugifyTechnique("The Judge's Checklist"), 'the-judges-checklist');
});

test('search finds criteria by keyword', () => {
  const r = search('adverse authority');
  assert.ok(r.criteria.some((c) => c.id === 'LGS 3.5'));
});

test('catalogJson is a complete, serializable snapshot', () => {
  const j = catalogJson();
  assert.equal(j.version, '1.0');
  assert.ok(j.cite_as.includes('CC-BY-SA'));
  assert.ok(Array.isArray(j.criteria) && j.criteria.length >= 40);
  assert.ok(j.composite && j.composite.cap === 98);
  JSON.stringify(j); // must not throw
});
