// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { resolveCriteriaPath, resolveDataRoot, resolveDocPath } from '../src/lib/paths.mjs';

test('resolveDataRoot honors the LEXGRADE_DATA_ROOT override', () => {
  assert.equal(resolveDataRoot('/anywhere', () => false, '/data/root'), '/data/root');
});

test('resolveDataRoot walks up to the data root from a nested site dir', () => {
  const exists = (p) => p === '/repo/methodology.yaml';
  assert.equal(resolveDataRoot('/repo/sites/lexgrade.org', exists), '/repo');
});

test('resolveDataRoot finds the data root one level up (flat layout)', () => {
  const exists = (p) => p === '/standard/methodology.yaml';
  assert.equal(resolveDataRoot('/standard/site', exists), '/standard');
});

test('resolveDataRoot throws a directive error when methodology.yaml is absent', () => {
  assert.throws(() => resolveDataRoot('/x/y', () => false), /LEXGRADE_DATA_ROOT/);
});

test('resolveCriteriaPath tries the nested layout first', () => {
  const exists = (p) => p === '/repo/commons/standard/lgs-criteria.yaml';
  assert.equal(resolveCriteriaPath('/repo', exists), '/repo/commons/standard/lgs-criteria.yaml');
});

test('resolveCriteriaPath falls back to the flat layout', () => {
  const exists = (p) => p === '/standard/standard/lgs-criteria.yaml';
  assert.equal(resolveCriteriaPath('/standard', exists), '/standard/standard/lgs-criteria.yaml');
});

test('resolveCriteriaPath throws listing both candidates when neither exists', () => {
  assert.throws(() => resolveCriteriaPath('/r', () => false), /lgs-criteria\.yaml not found/);
});

test('resolveDocPath resolves a methodology.yaml commons path in the nested layout', () => {
  const exists = (p) => p === '/repo/commons/standard/LexGrade_Standard_v1.0.md';
  assert.equal(
    resolveDocPath('/repo', 'commons/standard/LexGrade_Standard_v1.0.md', exists),
    '/repo/commons/standard/LexGrade_Standard_v1.0.md',
  );
});

test('resolveDocPath strips the commons/ prefix in the flat layout', () => {
  const exists = (p) => p === '/standard/standard/LexGrade_Standard_v1.0.md';
  assert.equal(
    resolveDocPath('/standard', 'commons/standard/LexGrade_Standard_v1.0.md', exists),
    '/standard/standard/LexGrade_Standard_v1.0.md',
  );
});

test('resolveDocPath throws naming the path when neither candidate exists', () => {
  assert.throws(
    () => resolveDocPath('/r', 'commons/standard/X.md', () => false),
    /commons document not found for "commons\/standard\/X\.md"/,
  );
});
