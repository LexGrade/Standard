/**
 * Pure, dependency-free path resolution for the offline Standard build.
 *
 * Kept free of any third-party import (no `yaml`) so `node --test` exercises it
 * without installing dependencies. loadStandard.mjs wires these to the real
 * filesystem.
 *
 * The site reads two local data files at build time: methodology.yaml (the
 * version source of truth) and the LGS criteria YAML. These resolvers locate
 * them by walking up to methodology.yaml, and they accept the commons content
 * either nested under commons/ (this repo: commons/standard/lgs-criteria.yaml)
 * or flattened at the data root (standard/lgs-criteria.yaml) — so a consumer
 * can vendor just the commons/ tree without code edits.
 */

import { dirname, resolve } from 'node:path';

/**
 * Resolve the data root — the directory holding methodology.yaml. The
 * LEXGRADE_DATA_ROOT env var short-circuits the search; otherwise walk up from
 * startDir to the first ancestor that contains methodology.yaml.
 *
 * @param {string} startDir
 * @param {(p: string) => boolean} exists
 * @param {string} [override]  value of LEXGRADE_DATA_ROOT, if set
 * @returns {string} absolute path to the data root
 */
export function resolveDataRoot(startDir, exists, override) {
  if (override) {
    return resolve(override);
  }

  let dir = resolve(startDir);
  for (;;) {
    if (exists(resolve(dir, 'methodology.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      break; // reached the filesystem root
    }
    dir = parent;
  }

  throw new Error(
    `methodology.yaml not found in any ancestor of ${startDir}. ` +
      'Set LEXGRADE_DATA_ROOT to the directory that holds it.',
  );
}

/**
 * Resolve the LGS criteria YAML under a data root, trying the nested layout
 * (commons/standard/...) then the flat layout (standard/...).
 *
 * @param {string} dataRoot
 * @param {(p: string) => boolean} exists
 * @returns {string} absolute path to lgs-criteria.yaml
 */
export function resolveCriteriaPath(dataRoot, exists) {
  const candidates = [
    resolve(dataRoot, 'commons/standard/lgs-criteria.yaml'), // nested (commons/)
    resolve(dataRoot, 'standard/lgs-criteria.yaml'), // flat (commons at data root)
  ];
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return candidate;
    }
  }

  throw new Error(`lgs-criteria.yaml not found. Tried: ${candidates.join(', ')}`);
}

/**
 * Resolve a commons document path recorded in methodology.yaml (which carries a
 * leading `commons/`, e.g. `commons/standard/LexGrade_Standard_v1.0.md`) under
 * a data root, across both layouts: nested (the `commons/` prefix is real) and
 * flat (the commons content sits at the data root, so the prefix is gone).
 *
 * @param {string} dataRoot
 * @param {string} manifestPath  a path as written in methodology.yaml
 * @param {(p: string) => boolean} exists
 * @returns {string} absolute path to the document
 */
export function resolveDocPath(dataRoot, manifestPath, exists) {
  const stripped = String(manifestPath).replace(/^commons\//, '');
  const candidates = [
    resolve(dataRoot, manifestPath), // nested (path includes commons/)
    resolve(dataRoot, stripped), // flat (commons content at the data root)
  ];
  for (const candidate of candidates) {
    if (exists(candidate)) {
      return candidate;
    }
  }

  throw new Error(`commons document not found for "${manifestPath}". Tried: ${candidates.join(', ')}`);
}
