// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createSlugger, slugifyHeading, toHtml } from '../src/markdown.mjs';

test('toHtml renders bold and a GFM table', () => {
  assert.match(toHtml('**Definition:** x'), /<strong>Definition:<\/strong>/);
  const table = toHtml('| A | B |\n|---|---|\n| 1 | 2 |');
  assert.match(table, /<table>/);
  assert.match(table, /<td>1<\/td>/);
});

test('slugifyHeading matches GitHub auto-anchors so in-doc links resolve', () => {
  assert.equal(slugifyHeading('Future structure'), 'future-structure');
  assert.equal(slugifyHeading('DCO, not CLA'), 'dco-not-cla');
  assert.equal(slugifyHeading('Entity firewall'), 'entity-firewall');
});

test('toHtml gives every heading an id and a § permalink (not #)', () => {
  const html = toHtml('## Future structure\n\nsee [below](#future-structure)');
  assert.match(html, /<h2 id="future-structure">/);
  // The deep-link affordance is the legal section sign, with an accessible label.
  assert.match(html, /<a class="heading-anchor" href="#future-structure" aria-label="Permalink to Future structure">§<\/a>/);
  // The in-document link now has a real target (no dangling anchor → AAA).
  assert.match(html, /href="#future-structure"/);
});

test('a shared slugger dedupes ids repeated across a multi-doc page', () => {
  const slugger = createSlugger();
  const a = toHtml('## License', slugger);
  const b = toHtml('## License', slugger);
  assert.match(a, /id="license"/);
  assert.match(b, /id="license-1"/); // unique across the two docs — no duplicate-id AAA failure
});
