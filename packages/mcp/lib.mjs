// SPDX-License-Identifier: AGPL-3.0-only
//
// Offline data loader for the LexGrade Standard MCP server.
//
// Reads ONLY local files from this repository (methodology.yaml + commons/*) — no
// network, no account, no proprietary API. Mirrors the same offline-first
// posture as the site build: the standard is data, and an agent can read it
// without phoning home. Kept dependency-light (only `yaml`) so it is trivially
// auditable.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

// The Technique Register parser is shared with the site via @lexgrade/core — one
// implementation, so a technique has the same slug and field model on lexgrade.org
// and over MCP. Re-exported so existing importers (and tests) keep working.
import { parseTechniques, slugifyTechnique } from '@lexgrade/core';
export { parseTechniques, slugifyTechnique } from '@lexgrade/core';

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve the data root — the directory that holds methodology.yaml.
 * LEXGRADE_DATA_ROOT short-circuits the search; otherwise walk up from this
 * module (and, as a fallback, the working directory) to the first ancestor that
 * has methodology.yaml. Works whether the server is run from the repo, via
 * `npx github:LexGrade/standard`, or with the data root set explicitly.
 *
 * @returns {string} absolute path to the data root
 */
export function resolveDataRoot() {
  const override = process.env.LEXGRADE_DATA_ROOT;
  if (override) return resolve(override);

  for (const start of [HERE, process.cwd()]) {
    let dir = resolve(start);
    for (;;) {
      if (existsSync(resolve(dir, 'methodology.yaml'))) return dir;
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  throw new Error(
    'methodology.yaml not found in any ancestor of this package or the working ' +
      'directory. Set LEXGRADE_DATA_ROOT to the directory that holds it.',
  );
}

// commons docs are recorded in methodology.yaml with a leading `commons/`. Resolve
// across both the full repo layout (prefix is real) and a flattened layout (commons
// content at the data root), so the loader survives either packaging.
function resolveDocPath(root, manifestPath) {
  const stripped = String(manifestPath).replace(/^commons\//, '');
  for (const candidate of [resolve(root, manifestPath), resolve(root, stripped)]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error(`commons document not found for "${manifestPath}".`);
}

function resolveCriteriaPath(root) {
  for (const candidate of [
    resolve(root, 'commons/standard/lgs-criteria.yaml'),
    resolve(root, 'standard/lgs-criteria.yaml'),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('lgs-criteria.yaml not found.');
}

let _cache = null;

/**
 * Load the entire LexGrade Standard from local files (cached). Returns the
 * version manifest, the machine-readable criteria catalog, the full standard +
 * technique-register markdown, the parsed techniques, and the calibration guide.
 *
 * @returns {{
 *   root: string,
 *   version: string,
 *   methodology: object,
 *   catalog: object,
 *   standardMarkdown: string,
 *   techniqueMarkdown: string,
 *   scoringGuide: string,
 *   techniques: Array<object>,
 * }}
 */
export function load() {
  if (_cache) return _cache;

  const root = resolveDataRoot();
  const methodology = parseYaml(readFileSync(resolve(root, 'methodology.yaml'), 'utf-8'));
  const catalog = parseYaml(readFileSync(resolveCriteriaPath(root), 'utf-8'));

  const stdV = methodology.current.standard;
  const trV = methodology.current.technique_register;

  const standardMarkdown = readFileSync(
    resolveDocPath(root, methodology.artifacts.standard[stdV].path),
    'utf-8',
  );
  const techniqueMarkdown = readFileSync(
    resolveDocPath(root, methodology.artifacts.technique_register[trV].path),
    'utf-8',
  );
  const scoringGuide = methodology.calibration_set?.scoring_guide
    ? readFileSync(resolveDocPath(root, methodology.calibration_set.scoring_guide), 'utf-8')
    : '';

  _cache = {
    root,
    version: stdV,
    methodology,
    catalog,
    standardMarkdown,
    techniqueMarkdown,
    scoringGuide,
    techniques: parseTechniques(techniqueMarkdown),
  };
  return _cache;
}

/** The criteria catalog as a plain JSON-serializable object (the "static API"). */
export function catalogJson() {
  const { catalog, methodology } = load();
  return {
    standard: catalog.standard,
    version: catalog.version,
    license: catalog.license,
    scope: catalog.scope,
    cite_as: `LexGrade Standard v${catalog.version}, LexGrade (lexgrade.org), ${catalog.license}.`,
    current: methodology.current,
    principles: catalog.principles ?? [],
    criteria: catalog.criteria ?? [],
    conformance_levels: catalog.conformance_levels ?? [],
    conformance_claim: catalog.conformance_claim ?? null,
    automatic_demotion_rules: catalog.automatic_demotion_rules ?? [],
    composite: catalog.composite ?? {},
    technique_register: catalog.technique_register ?? {},
  };
}

/** All principles. */
export function listPrinciples() {
  return load().catalog.principles ?? [];
}

/** Criteria, optionally filtered by principle id (e.g. "P3"). */
export function listCriteria(principle) {
  const all = load().catalog.criteria ?? [];
  if (!principle) return all;
  const p = String(principle).toUpperCase();
  return all.filter((c) => String(c.principle).toUpperCase() === p);
}

/** One criterion by id, accepting "LGS 3.5", "lgs 3.5", or "3.5". */
export function getCriterion(id) {
  const want = String(id).toLowerCase().replace(/^lgs\s*/, '').trim();
  return (load().catalog.criteria ?? []).find(
    (c) => String(c.id).toLowerCase().replace(/^lgs\s*/, '').trim() === want,
  );
}

/** Techniques, optionally filtered by category (case-insensitive). */
export function listTechniques(category) {
  const all = load().techniques;
  if (!category) return all;
  const c = String(category).toLowerCase();
  return all.filter((t) => (t.category ?? '').toLowerCase() === c);
}

/** One technique by slug or number. */
export function getTechnique(id) {
  const techniques = load().techniques;
  const asNum = Number(id);
  if (Number.isInteger(asNum) && asNum > 0) {
    return techniques.find((t) => t.number === asNum);
  }
  const slug = slugifyTechnique(id);
  return techniques.find((t) => t.slug === slug);
}

/**
 * Keyword search across criteria (id/title/requirement) and techniques
 * (name/definition/body). Case-insensitive substring match.
 *
 * @param {string} query
 * @returns {{criteria: Array<object>, techniques: Array<object>}}
 */
export function search(query) {
  const q = String(query ?? '').trim().toLowerCase();
  if (!q) return { criteria: [], techniques: [] };

  const criteria = listCriteria().filter((c) =>
    [c.id, c.title, c.requirement, c.source].some((f) => String(f ?? '').toLowerCase().includes(q)),
  );
  const techniques = load().techniques
    .filter((t) =>
      [t.name, t.category, t.tier, t.definition, t.body].some((f) =>
        String(f ?? '').toLowerCase().includes(q),
      ),
    )
    .map(({ body, ...rest }) => rest); // omit full body in search hits

  return { criteria, techniques };
}
