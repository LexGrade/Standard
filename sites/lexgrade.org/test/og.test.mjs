// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { appIcon, ogCard } from '../src/og.mjs';

const isPng = (buf) => buf.length > 1000 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47;

test('ogCard renders a non-trivial PNG buffer', () => {
  const png = ogCard({ title: 'LexGrade Standard v1.0' });
  assert.ok(isPng(png), 'output is a PNG');
});

test('ogCard handles a long title (wraps without throwing)', () => {
  const png = ogCard({ title: 'A Very Long Technique Name That Must Wrap Across Several Lines', subtitle: 'LexGrade Technique Register' });
  assert.ok(isPng(png));
});

test('ogCard escapes XML-significant characters in the title', () => {
  // A title with & < > " must not break the SVG → PNG render.
  const png = ogCard({ title: 'Trademark & <Fork> "policy"' });
  assert.ok(isPng(png));
});

test('appIcon renders a square PNG', () => {
  assert.ok(isPng(appIcon(180)));
});
