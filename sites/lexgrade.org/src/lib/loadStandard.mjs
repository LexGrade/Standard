/**
 * Build-time data loader for the LexGrade Standard.
 *
 * Reads ONLY from local commons/ files — no network calls, no external API.
 * This is the offline-build litmus: the content build must succeed with no
 * internet access.
 *
 * Paths are resolved relocation-safely via paths.mjs: the data root is found
 * by walking up from process.cwd() to the first ancestor containing
 * methodology.yaml (or by honoring the LEXGRADE_DATA_ROOT env var), and
 * lgs-criteria.yaml is found whether the commons content sits under
 * commons/standard/ or at the data root. Still offline-only.
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';

import { resolveCriteriaPath, resolveDataRoot, resolveDocPath } from './paths.mjs';

// The Technique Register parser lives in @lexgrade/core — one implementation shared
// with the MCP server, so slugs and the field model can't drift. Re-exported so
// existing imports (`parseTechniques` from loadStandard) keep working.
export { parseTechniques, parseTechniqueFields, slugifyTechnique } from '@lexgrade/core';

/**
 * @typedef {Object} Principle
 * @property {string} id
 * @property {string} title
 * @property {'precondition'|'weighted'|'gate'} role
 * @property {number} weight
 * @property {string} source
 * @property {string} [note]
 */

/**
 * @typedef {Object} Criterion
 * @property {string} id          - e.g. "LGS 3.5"
 * @property {string} principle   - e.g. "P3"
 * @property {string} title
 * @property {string} requirement
 * @property {string} [source]
 * @property {number} [deduction]
 * @property {string} [deduction_note]
 */

/**
 * Convert a criterion id like "LGS 3.5" to a URL anchor: "lgs-3.5".
 * The canonical anchor format for a criterion id.
 * @param {string} id
 * @returns {string}
 */
export function toAnchor(id) {
  return id.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Load the LexGrade Standard from commons/ data files.
 * Returns the standard version, all principles, and criteria grouped by principle.
 */
export function loadStandard() {
  const dataRoot = resolveDataRoot(process.cwd(), existsSync, process.env.LEXGRADE_DATA_ROOT);

  // methodology.yaml is the single source of truth for versions.
  const methodology = parseYaml(readFileSync(resolve(dataRoot, 'methodology.yaml'), 'utf-8'));
  const standardVersion = methodology.current.standard;

  // lgs-criteria.yaml is the machine-readable derivative of the Standard.
  const lgs = parseYaml(readFileSync(resolveCriteriaPath(dataRoot, existsSync), 'utf-8'));

  /** @type {Principle[]} */
  const principles = lgs.principles;

  /** @type {Criterion[]} */
  const criteria = lgs.criteria;

  // Group criteria by principle id for the index page
  /** @type {Map<string, Criterion[]>} */
  const byPrinciple = new Map();
  for (const principle of principles) {
    byPrinciple.set(principle.id, []);
  }
  for (const criterion of criteria) {
    const bucket = byPrinciple.get(criterion.principle);
    if (bucket) bucket.push(criterion);
  }

  return {
    version: standardVersion,
    scope: lgs.scope,
    license: lgs.license,
    citationsVerified: lgs.citations_verified ?? null,
    principles,
    criteria,
    byPrinciple,
    conformanceLevels: lgs.conformance_levels ?? [],
    conformanceClaim: lgs.conformance_claim ?? null,
    automaticDemotions: lgs.automatic_demotion_rules ?? [],
    composite: lgs.composite ?? {},
  };
}

/**
 * Load the CC-BY-SA methodology bundle for the agent-readable /llms-full.txt:
 * the LexGrade Standard and the Technique Register, in that order. Paths come
 * from methodology.yaml (current versions), so a version bump rolls the bundle
 * forward.
 *
 * @returns {{version: string, documents: string[]}}
 */
export function loadBundle() {
  const dataRoot = resolveDataRoot(process.cwd(), existsSync, process.env.LEXGRADE_DATA_ROOT);
  const methodology = parseYaml(readFileSync(resolve(dataRoot, 'methodology.yaml'), 'utf-8'));

  const standardV = methodology.current.standard;
  const techniqueV = methodology.current.technique_register;

  const paths = [
    methodology.artifacts?.standard?.[standardV]?.path,
    methodology.artifacts?.technique_register?.[techniqueV]?.path,
  ].filter(Boolean);

  const documents = paths
    .map((p) => readFileSync(resolveDocPath(dataRoot, p, existsSync), 'utf-8').trim())
    .filter(Boolean);

  return { version: standardV, documents };
}

/**
 * Load the Technique Register markdown (the informative companion). Path comes
 * from methodology.yaml (current technique_register version).
 *
 * @returns {{version: string, markdown: string}}
 */
export function loadTechniqueRegister() {
  const dataRoot = resolveDataRoot(process.cwd(), existsSync, process.env.LEXGRADE_DATA_ROOT);
  const methodology = parseYaml(readFileSync(resolve(dataRoot, 'methodology.yaml'), 'utf-8'));
  const techniqueV = methodology.current.technique_register;
  const path = methodology.artifacts?.technique_register?.[techniqueV]?.path;
  const markdown = readFileSync(resolveDocPath(dataRoot, path, existsSync), 'utf-8');
  // The register carries its OWN version, which may diverge from the standard's.
  return { version: techniqueV, markdown, path };
}
