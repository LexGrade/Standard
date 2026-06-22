// SPDX-License-Identifier: AGPL-3.0-only
//
// Compute the Content-Security-Policy `script-src` value for a rendered page: a
// space-separated list of 'sha256-…' source hashes, one per inline <script> the
// page actually ships, so a strict CSP allows exactly those scripts and nothing
// else. A page with no inline script yields 'none'. Hashing the rendered bytes
// (rather than the source template) guarantees the header matches what the
// browser sees — including any <script> that grows attributes later.

import { createHash } from 'node:crypto';

/**
 * @param {string} html  the fully-rendered page HTML
 * @returns {string} a CSP script-src value: "'sha256-…' 'sha256-…'" or "'none'"
 */
export function cspScriptSrc(html) {
  const hashes = [...String(html ?? '').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(
    (m) => `'sha256-${createHash('sha256').update(m[1], 'utf8').digest('base64')}'`,
  );
  return hashes.length ? hashes.join(' ') : "'none'";
}
