// SPDX-License-Identifier: AGPL-3.0-only
//
// @lexgrade/core — the ONE Technique Register parser.
//
// Both surfaces that turn the register markdown into structured techniques — the
// lexgrade.org site build and the @lexgrade/mcp server — import this module, so
// slugs, fields, and the split logic cannot drift between them. Pure and
// dependency-free (no filesystem, no deps) so it is trivially auditable and
// unit-tested in isolation.

/**
 * Slugify a technique name to a URL/id segment. Stable and deterministic so a
 * technique keeps the same slug on lexgrade.org, over MCP, and over time —
 * important for citations and deep links. Lowercase; fold diacritics; drop
 * apostrophes/punctuation; collapse whitespace and separators to single hyphens.
 * The register's names are ASCII English.
 *
 * @param {string} name
 * @returns {string}
 */
export function slugifyTechnique(name) {
  return String(name ?? '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // fold diacritics
    .replace(/_+/g, '-') // underscores become separators
    .replace(/@/g, '-at-')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, '') // keep letters, numbers, whitespace, hyphen
    .replace(/[\s-]+/g, '-') // collapse to a single separator
    .replace(/^-+|-+$/g, '');
}

/**
 * Split one technique's body markdown into the standardized field model the site
 * renders and /api/v1/techniques.json exposes. Fields are delimited by
 * `**Label:**` markers; the `*Source:*`/`*Category:*`/`*Tier:*` italic meta lines
 * (single asterisk) are ignored here — they're lifted in parseTechniques. Bucketed
 * by label so the rendered order is fixed regardless of source order; unrecognized
 * labels fall through to `notes` so nothing is dropped.
 *
 * Values are kept as RAW markdown (rendered to HTML at build time, so tables,
 * lists, and emphasis survive); a trailing thematic break ("---", the
 * inter-technique separator) is stripped so it never leaks into the last field.
 *
 * @param {string} body
 * @returns {{example:?string, antiPattern:?string, requirements:?string, why:?{label:string,text:string}, distinctions:Array<{label:string,text:string}>, notes:Array<{label:string,text:string}>}}
 */
export function parseTechniqueFields(body) {
  const md = String(body ?? '');
  const fields = { example: null, antiPattern: null, requirements: null, why: null, distinctions: [], notes: [] };

  const markers = [...md.matchAll(/\*\*([^*\n]+?):\*\*[ \t]*/g)];
  for (let i = 0; i < markers.length; i++) {
    const label = markers[i][1].trim().replace(/\s+/g, ' '); // normalize odd spacing before dispatch
    const from = markers[i].index + markers[i][0].length;
    const to = i + 1 < markers.length ? markers[i + 1].index : md.length;
    const value = md.slice(from, to).replace(/\s*-{3,}\s*$/, '').trim(); // drop trailing "---"
    if (!value) continue;

    const l = label.toLowerCase();
    if (l === 'definition') continue; // lifted to technique.definition
    else if (l.startsWith('example')) fields.example = value;
    else if (l === 'anti-pattern') fields.antiPattern = value;
    else if (l === 'requirements') fields.requirements = value;
    else if (l.startsWith("why it's")) fields.why = { label, text: value };
    else if (l.startsWith('distinguished from') || l.startsWith('relationship to'))
      fields.distinctions.push({ label, text: value });
    else fields.notes.push({ label, text: value });
  }
  return fields;
}

/**
 * Parse the Technique Register markdown into individual techniques so each gets
 * its own deep-linkable identity (number, name, slug, category, tier, definition,
 * the standardized `fields` model, and the raw `body`). Pure (no filesystem).
 * Techniques live under "## TECHNIQUE DEFINITIONS" as `### N. Name` blocks; tier
 * separators (`### — TIER … —`) and preamble fall through.
 *
 * @param {string} markdown
 * @returns {Array<{number:number, name:string, slug:string, category:?string, tier:?string, definition:?string, fields:object, body:string}>}
 */
export function parseTechniques(markdown) {
  const md = String(markdown ?? '');
  const start = md.indexOf('## TECHNIQUE DEFINITIONS');
  if (start === -1) return [];

  const afterHeading = md.indexOf('\n', start);
  if (afterHeading === -1) return [];

  const nextH2 = md.indexOf('\n## ', afterHeading + 1);
  const section = nextH2 === -1 ? md.slice(afterHeading) : md.slice(afterHeading, nextH2);

  const techniques = [];
  for (const raw of section.split(/^### /m)) {
    const chunk = raw.trim();
    if (chunk === '') continue;

    const nl = chunk.indexOf('\n');
    const heading = (nl === -1 ? chunk : chunk.slice(0, nl)).trim();

    // "N. Name" only — tier separators ("— TIER 1 … —") and preamble fall through.
    const m = heading.match(/^(\d+)\.\s+(.+)$/);
    if (!m) continue;

    const name = m[2].trim();
    const category = chunk.match(/\*Category:\s*([^*\n]+)\*/);
    const tier = chunk.match(/\*Tier:\s*([^*\n]+)\*/);
    const definition = chunk.match(/\*\*Definition:\*\*\s*([^\n]+)/);

    const body = nl === -1 ? '' : chunk.slice(nl).trim();
    techniques.push({
      number: Number(m[1]),
      name,
      slug: slugifyTechnique(name),
      category: category ? category[1].trim() : null,
      tier: tier ? tier[1].trim() : null,
      definition: definition ? definition[1].trim() : null,
      fields: parseTechniqueFields(body),
      body,
    });
  }

  return techniques;
}
