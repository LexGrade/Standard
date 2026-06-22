// SPDX-License-Identifier: AGPL-3.0-only
//
// Build-time markdown → HTML. Isolated here (it imports `marked`) so render.mjs
// stays import-free. The output is sanitized by render.mjs's stripScripts before
// it reaches the page — the production surface ships zero JS.

import { Marked } from 'marked';

/** Escape text for safe interpolation into an HTML attribute. */
function escapeAttr(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * GitHub-compatible heading slug: lowercase, drop punctuation, spaces → hyphens.
 * The commons docs (e.g. GOVERNANCE.md) use GitHub's auto-generated heading
 * anchors for in-document links (`](#future-structure)`); without matching IDs
 * those links dangle, which fails the WCAG AAA gate (a named anchor with no
 * target). Mirrors github-slugger for the ASCII headings our docs use.
 *
 * @param {string} text
 * @returns {string}
 */
export function slugifyHeading(text) {
  return String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // drop punctuation; keep word chars, whitespace, hyphen
    .replace(/\s+/g, '-'); // spaces → single hyphen
}

/**
 * A stateful heading slugger that dedupes collisions by appending -1, -2, ….
 * Share ONE across multiple markdown documents that compose a single page, so a
 * heading repeated across docs still gets a unique id — duplicate ids fail the
 * AAA gate.
 *
 * @returns {(text: string) => string}
 */
export function createSlugger() {
  const seen = new Map();
  return (text) => {
    const base = slugifyHeading(text);
    if (!seen.has(base)) {
      seen.set(base, 0);
      return base;
    }
    const n = seen.get(base) + 1;
    seen.set(base, n);
    return `${base}-${n}`;
  };
}

/**
 * Render markdown to HTML, giving every heading a stable id and a § permalink
 * (the legal section sign — the right deep-link affordance for a legal standard,
 * not a generic #). Pass a shared `slugger` when several docs compose one page.
 *
 * @param {string} markdown
 * @param {(text: string) => string} [slugger] shared across a multi-doc page
 * @returns {string} HTML
 */
export function toHtml(markdown, slugger = createSlugger()) {
  const md = new Marked({ gfm: true });
  md.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const plain = this.parser.parseInline(tokens, this.parser.textRenderer);
        const slug = slugger(plain);
        const permalink = `<a class="heading-anchor" href="#${slug}" aria-label="Permalink to ${escapeAttr(plain)}">§</a>`;
        return `<h${depth} id="${slug}">${inner} ${permalink}</h${depth}>\n`;
      },
    },
  });
  return md.parse(String(markdown ?? ''));
}
