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
// with downstream tools, so slugs and the field model can't drift. Re-exported so
// existing imports (`parseTechniques` from loadStandard) keep working.
export { REGISTER_LABELS, parseTechniques, parseTechniqueFields, slugifyTechnique } from '@lexgrade/core';

const SOURCE_LANG = 'en';

/** methodology.yaml, parsed, with the data root it was found in. */
function loadManifest() {
  const dataRoot = resolveDataRoot(process.cwd(), existsSync, process.env.LEXGRADE_DATA_ROOT);
  return { dataRoot, methodology: parseYaml(readFileSync(resolve(dataRoot, 'methodology.yaml'), 'utf-8')) };
}

/**
 * One artifact of a translation (`standard`, `technique_register`, `criteria`)
 * from methodology.yaml. Throws when the language has no such artifact, or when
 * it translates an edition other than the current one: a stale translation
 * must not be published as if it were the current text.
 *
 * @param {object} methodology
 * @param {string} lang
 * @param {'standard'|'technique_register'|'criteria'} artifact
 * @returns {{translates: string, path: string}}
 */
export function translationEntry(methodology, lang, artifact) {
  const entry = methodology.translations?.[lang]?.[artifact];
  if (!entry) throw new Error(`methodology.yaml has no "${lang}" translation of ${artifact}`);
  const current = methodology.current[artifact === 'criteria' ? 'standard' : artifact];
  if (String(entry.translates) !== String(current)) {
    throw new Error(
      `The "${lang}" translation of ${artifact} is of v${entry.translates}; the current edition is v${current}. ` +
        'Update the translation with the edition (see .github/CONTRIBUTING.md).',
    );
  }
  return entry;
}

/**
 * Lay a translation overlay over the English catalog. The overlay carries only
 * translated strings, keyed by id; every number, id, and threshold stays the
 * English catalog's, so a translation cannot change the Standard's arithmetic.
 * A string the overlay lacks keeps its English text (a test holds the overlay
 * complete).
 *
 * @param {object} lgs the parsed English lgs-criteria.yaml
 * @param {object} overlay the parsed translation overlay
 * @returns {object} a translated catalog of the same shape
 */
export function applyCatalogTranslation(lgs, overlay) {
  const levels = overlay.conformance_levels ?? {};
  const composite = overlay.composite ?? {};
  const names = composite.conformance_names ?? {};
  return {
    ...lgs,
    scope: overlay.scope ?? lgs.scope,
    citations_verified: overlay.citations_verified ?? lgs.citations_verified,
    principles: lgs.principles.map((p) => ({ ...p, ...(overlay.principles?.[p.id] ?? {}) })),
    criteria: lgs.criteria.map((c) => ({ ...c, ...(overlay.criteria?.[c.id] ?? {}) })),
    conformance_levels: (lgs.conformance_levels ?? []).map((l) => ({ ...l, ...(levels[l.id] ?? {}) })),
    conformance_claim: lgs.conformance_claim
      ? { ...lgs.conformance_claim, ...(overlay.conformance_claim ?? {}) }
      : lgs.conformance_claim,
    automatic_demotion_rules: (lgs.automatic_demotion_rules ?? []).map((r, i) => ({
      ...r,
      ...(overlay.automatic_demotion_rules?.[i] ?? {}),
    })),
    composite: lgs.composite
      ? {
          ...lgs.composite,
          order_of_operations: composite.order_of_operations ?? lgs.composite.order_of_operations,
          negative_modifiers: (lgs.composite.negative_modifiers ?? []).map((m, i) => ({
            ...m,
            ...(composite.negative_modifiers?.[i] ?? {}),
          })),
          grade_scale: (lgs.composite.grade_scale ?? []).map((g) => ({
            ...g,
            ...(composite.grade_scale?.[g.letter] ?? {}),
            conformance: names[g.conformance] ?? g.conformance,
          })),
        }
      : lgs.composite,
  };
}

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
 * In a language other than English the catalog's strings come from that
 * language's overlay; everything else is the English catalog.
 *
 * @param {string} [lang]
 */
export function loadStandard(lang = SOURCE_LANG) {
  // methodology.yaml is the single source of truth for versions.
  const { dataRoot, methodology } = loadManifest();
  const standardVersion = methodology.current.standard;

  // lgs-criteria.yaml is the machine-readable derivative of the Standard.
  let lgs = parseYaml(readFileSync(resolveCriteriaPath(dataRoot, existsSync), 'utf-8'));
  let editPath = 'commons/standard/lgs-criteria.yaml';
  if (lang !== SOURCE_LANG) {
    const entry = translationEntry(methodology, lang, 'criteria');
    lgs = applyCatalogTranslation(lgs, parseYaml(readFileSync(resolveDocPath(dataRoot, entry.path, existsSync), 'utf-8')));
    editPath = entry.path;
  }

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
    editPath,
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
 * @param {string} [lang]
 * @returns {{version: string, documents: string[]}}
 */
export function loadBundle(lang = SOURCE_LANG) {
  const { dataRoot, methodology } = loadManifest();

  const standardV = methodology.current.standard;
  const techniqueV = methodology.current.technique_register;

  const paths = (
    lang === SOURCE_LANG
      ? [methodology.artifacts?.standard?.[standardV]?.path, methodology.artifacts?.technique_register?.[techniqueV]?.path]
      : [translationEntry(methodology, lang, 'standard').path, translationEntry(methodology, lang, 'technique_register').path]
  ).filter(Boolean);

  const documents = paths
    .map((p) => readFileSync(resolveDocPath(dataRoot, p, existsSync), 'utf-8').trim())
    .filter(Boolean);

  return { version: standardV, documents };
}

/**
 * Load the Technique Register markdown (the informative companion). Path comes
 * from methodology.yaml (current technique_register version).
 *
 * @param {string} [lang]
 * @returns {{version: string, markdown: string, path: string}}
 */
export function loadTechniqueRegister(lang = SOURCE_LANG) {
  const { dataRoot, methodology } = loadManifest();
  const techniqueV = methodology.current.technique_register;
  const path =
    lang === SOURCE_LANG
      ? methodology.artifacts?.technique_register?.[techniqueV]?.path
      : translationEntry(methodology, lang, 'technique_register').path;
  const markdown = readFileSync(resolveDocPath(dataRoot, path, existsSync), 'utf-8');
  // The register carries its OWN version, which may diverge from the standard's.
  return { version: techniqueV, markdown, path };
}

/**
 * Pull one numbered top-level section ("## 9. …") out of the Standard markdown,
 * without its heading or trailing rule, so a page can present that section
 * verbatim and never drift from the source. Throws if the section is missing,
 * so a renumbered Standard fails the build instead of shipping an empty page.
 *
 * @param {string} markdown
 * @param {number} number
 * @returns {{title: string, body: string}}
 */
export function standardSection(markdown, number) {
  const re = new RegExp(`^## ${number}\\. (.+)$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm');
  const match = String(markdown ?? '').match(re);
  if (!match) throw new Error(`Standard section ${number} not found`);
  return { title: match[1].trim(), body: match[2].replace(/\n-{3,}\s*$/, '').trim() };
}
