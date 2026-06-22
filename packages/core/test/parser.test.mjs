// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { parseTechniqueFields, parseTechniques, slugifyTechnique } from '../index.mjs';

test('slugifyTechnique produces stable, URL-safe slugs', () => {
  assert.equal(slugifyTechnique('Weaponized Absence'), 'weaponized-absence');
  assert.equal(slugifyTechnique('Catch-22 Demand'), 'catch-22-demand');
  assert.equal(slugifyTechnique("The Concession That Isn't"), 'the-concession-that-isnt');
  assert.equal(slugifyTechnique("The Judge's Checklist"), 'the-judges-checklist');
});

const FIXTURE = `# Register
## TECHNIQUE DEFINITIONS

### 1. Weaponized Absence
*Category: Structural* *Tier: Foundational*
**Definition:** What is conspicuously missing.
Body line one.
**Requirements:**
1. First requirement
**Example:** The right way.
**Anti-pattern:** The wrong way.

---

### — TIER 2 —

### 2. Catch-22 Demand
*Category: Strategy*
**Definition:** A demand with no safe answer.
`;

test('parseTechniques splits numbered blocks, skips tier separators, and attaches the field model', () => {
  const t = parseTechniques(FIXTURE);
  assert.equal(t.length, 2);
  assert.deepEqual(t.map((x) => x.number), [1, 2]);
  assert.equal(t[0].slug, 'weaponized-absence');
  assert.equal(t[0].category, 'Structural');
  assert.equal(t[0].tier, 'Foundational');
  assert.equal(t[0].definition, 'What is conspicuously missing.');
  // The standardized field model is present (this is what the MCP previously lacked).
  assert.equal(t[0].fields.example, 'The right way.');
  assert.equal(t[0].fields.antiPattern, 'The wrong way.');
  assert.match(t[0].fields.requirements, /First requirement/);
  // Raw body is retained for full-text consumers (the MCP).
  assert.match(t[0].body, /Body line one/);
});

test('parseTechniqueFields buckets known labels and falls unknown labels through to notes', () => {
  const f = parseTechniqueFields('**Requirements:** do x\n**Strategic value:** high');
  assert.match(f.requirements, /do x/);
  assert.equal(f.notes.length, 1);
  assert.equal(f.notes[0].label, 'Strategic value');
});

test('parseTechniques returns [] when the definitions section is absent', () => {
  assert.deepEqual(parseTechniques('# No definitions here'), []);
});
