// SPDX-License-Identifier: AGPL-3.0-only
//
// Source-of-truth weld for the Standard's two representations.
//
// The human-authored markdown (LexGrade_Standard_v1.0.md → llms-full.txt) and
// the hand-maintained structured catalog (lgs-criteria.yaml → /standard page +
// /api/v1/standard.json) describe the same instrument from two files. Nothing
// mechanical generates one from the other, so this suite is what makes the
// "they cannot silently diverge" claim in both files true: a one-sided edit to
// either representation fails CI here.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

import { parse as parseYaml } from 'yaml';

import { loadBundle } from '../src/lib/loadStandard.mjs';
import { resolveCriteriaPath, resolveDataRoot } from '../src/lib/paths.mjs';

const md = loadBundle().documents[0];
const catalog = parseYaml(
  readFileSync(resolveCriteriaPath(resolveDataRoot(process.cwd(), existsSync), existsSync), 'utf-8'),
);

test('every catalog criterion id and title appears in the Standard markdown', () => {
  for (const c of catalog.criteria) {
    assert.ok(md.includes(c.id), `${c.id} missing from the markdown`);
    assert.ok(md.includes(c.title), `${c.id} title ${JSON.stringify(c.title)} missing from the markdown`);
  }
});

// Criterion ids in the markdown, excluding version strings: criterion numbering
// starts at .1, so "LGS 1.0" / "LGS 2.0" are always edition references, never
// criteria (while LGS 7.10 is a real criterion and must not be excluded).
const mdCriterionIds = () => new Set((md.match(/LGS \d+\.\d+/g) ?? []).filter((id) => !/^LGS \d+\.0$/.test(id)));

test('the markdown mentions no criterion id the catalog lacks', () => {
  const catalogIds = new Set(catalog.criteria.map((c) => c.id));
  const orphans = [...mdCriterionIds()].filter((id) => !catalogIds.has(id));
  assert.deepEqual(orphans, [], 'markdown references criterion ids absent from lgs-criteria.yaml');
});

test('criterion count matches between the two representations', () => {
  assert.equal(catalog.criteria.length, mdCriterionIds().size, 'criteria count (yaml vs unique ids in markdown)');
});

test('weighted principle headings in the markdown carry the catalog weights', () => {
  for (const p of catalog.principles) {
    if (!p.weight) continue; // P1 (precondition) and P7 (gate) carry no percentage heading
    const n = p.id.slice(1);
    const heading = `Principle ${n} — ${p.title} (${p.weight}%)`;
    assert.ok(md.includes(heading), `expected heading ${JSON.stringify(heading)} in the markdown`);
  }
});

test('the weighted principles sum to the 80-point subtotal both files claim', () => {
  const sum = catalog.principles.reduce((a, p) => a + (p.weight ?? 0), 0);
  assert.equal(sum, 80, 'catalog weights sum');
  assert.ok(md.includes('**Subtotal (P2–P6, P8)** | **80%**'), 'markdown §6 subtotal row');
});
