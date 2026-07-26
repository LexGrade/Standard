// SPDX-License-Identifier: AGPL-3.0-only
//
// Pure, dependency-free HTML renderer for the open LexGrade Standard hub.
//
// Renders a W3C-spec-style static document: a fixed left ribbon, a sticky
// table of contents, a "Status of this document" front-matter block, and
// numbered principle/criteria sections. The PRODUCTION SURFACE SHIPS ZERO
// JAVASCRIPT — the output is pure HTML + inline CSS (the sticky TOC is CSS
// `position: sticky`; the front matter is a native <details> disclosure;
// no <script>, no inline handlers). A test in test/render.test.mjs guards
// the no-JS rule so a regression fails CI.
//
// Import-free on purpose so `node --test` exercises it without installing
// dependencies; build.mjs wires it to loadStandard() + the filesystem.

const SITE_ORIGIN = 'https://lexgrade.org';
const CANONICAL_URL = `${SITE_ORIGIN}/standard`;
// The machine-readable catalog is a static asset emitted by the build (no API
// service): /api/v1/standard.json, served straight off the CDN, same origin.
const API_URL = '/api/v1/standard.json';
// The GitHub source repo backing the "Edit this page" / "open an issue" links and
// the SOTD source row. Env-overridable (set LEXGRADE_REPO_URL in CI / Cloudflare
// Pages); defaults to the canonical open repository.
const REPO_URL = process.env.LEXGRADE_REPO_URL || 'https://github.com/LexGrade/standard';

// The LexGrade logo. Standalone form (correct xmlns) for the favicon + /logo.svg;
// an inline form (currentColor, aria-hidden) for the in-page masthead. An SVG is
// markup, not script — the zero-JS guarantee is unaffected.
export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260" role="img" aria-label="LexGrade">
  <g fill="#1a1a1a" transform="translate(40, 20)">
    <path d="M 0,144 L 36,144 L 36,204 L 180,204 L 180,240 L 0,240 Z"/>
    <rect x="48" y="108" width="36" height="84"/>
    <rect x="96" y="72" width="36" height="120"/>
    <path d="M 144,36 L 162,18 L 180,36 L 180,192 L 144,192 Z"/>
  </g>
</svg>
`;

// Progressive-enhancement script for the STANDARD PAGE ONLY. The page is fully
// readable and navigable without it — content is server-rendered, the TOC is real
// anchor links, the citation is plain selectable text. With JS it adds two
// niceties that degrade to nothing: a scroll-spy that marks the active TOC entry
// (aria-current), and a Copy button beside the citation (only in a secure context
// where the clipboard API exists). No dependencies, no inline handlers.
const ENHANCE_SCRIPT = `<script>
(function () {
  var cite = document.getElementById('lg-cite');
  if (cite && navigator.clipboard && window.isSecureContext) {
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'cite-copy'; btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy the citation');
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(cite.textContent.replace(/[“”"]/g, '').trim()).then(function () {
        btn.textContent = 'Copied ✓'; btn.classList.add('is-copied');
        setTimeout(function () { btn.textContent = 'Copy'; btn.classList.remove('is-copied'); }, 1600);
      }).catch(function () {});
    });
    cite.insertAdjacentElement('afterend', btn);
  }
  var pairs = [];
  Array.prototype.forEach.call(document.querySelectorAll('.toc a[href^="#"]'), function (a) {
    var sec = document.getElementById(a.getAttribute('href').slice(1));
    if (sec) pairs.push({ a: a, sec: sec });
  });
  if (pairs.length) {
    var cur = null;
    var update = function () {
      // Reading line just below the top: the active entry is the deepest section
      // whose heading has scrolled to (or above) it — i.e. whatever sits at the
      // top of the viewport. A small offset (not a fraction of the height) keeps
      // short, stacked criteria from activating the entry below the current one.
      var line = 72, best = null, i;
      for (i = 0; i < pairs.length; i++) {
        if (pairs[i].sec.getBoundingClientRect().top - line <= 0) best = pairs[i];
      }
      var t = best ? best.a : null;
      if (t !== cur) { if (cur) cur.removeAttribute('aria-current'); cur = t; if (cur) cur.setAttribute('aria-current', 'location'); }
    };
    update();
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  }
})();
</script>`;

/**
 * The sticky sidebar rail holding the Table of contents. ONE source of the TOC
 * shell shared by every two-column page (the Standard and the Technique
 * Register), so the markup — and the CSS hooks the scroll-spy keys off — can't
 * drift between them. `toc` is the pre-rendered `<li>` list items.
 *
 * @param {string} toc rendered `<li>` entries for the `<ol class="toc-list">`
 * @returns {string}
 */
function tocSidebar(toc) {
  return `<aside class="sidebar">
<nav class="toc" aria-labelledby="toc-h">
  <p class="toc-label" id="toc-h">Table of contents</p>
  <ol class="toc-list">
${toc}
  </ol>
</nav>
</aside>`;
}

function siteMasthead() {
  return `<a class="masthead" href="/" aria-label="LexGrade — home"><svg class="logo" viewBox="0 0 260 260" aria-hidden="true" focusable="false"><g fill="currentColor" transform="translate(40,20)"><path d="M 0,144 L 36,144 L 36,204 L 180,204 L 180,240 L 0,240 Z"/><rect x="48" y="108" width="36" height="84"/><rect x="96" y="72" width="36" height="120"/><path d="M 144,36 L 162,18 L 180,36 L 180,192 L 144,192 Z"/></g></svg><span class="wordmark">LexGrade</span></a>`;
}

// The single registry of the site's pages — the ONE source for the top nav, the
// footer, the sitemap, and the OG cards (build.mjs imports it). Adding or removing
// a page is a one-line edit here; none of those four surfaces can drift from it.
//   nav    — appears in the left top-bar nav (Standard/Techniques/About)
//   footer — appears in the secondary footer link row
//   og     — title/subtitle for the page's Open Graph card (build may override
//            with version/counts for the dynamic pages)
export const PAGES = [
  { id: 'home', path: '/', label: 'Home', nav: false, footer: false, og: { title: 'LexGrade', subtitle: 'Open scoring for legal drafting quality' } },
  { id: 'standard', path: '/standard', label: 'Standard', nav: true, footer: false, og: { title: 'LexGrade Standard', subtitle: 'Open scoring instrument for legal drafting quality' } },
  { id: 'techniques', path: '/techniques', label: 'Techniques', nav: true, footer: false, og: { title: 'Technique Register', subtitle: 'Named advocacy techniques, the informative companion' } },
  { id: 'about', path: '/about', label: 'About', nav: true, footer: true, og: { title: 'About LexGrade', subtitle: 'Grounded in real motion practice' } },
  { id: 'contribute', path: '/contribute', label: 'Contribute', nav: false, footer: true, og: { title: 'Contribute to LexGrade', subtitle: 'An open, collaborative standard — help shape it' } },
  { id: 'references', path: '/references', label: 'References', nav: false, footer: true, og: { title: 'Sources & influences', subtitle: 'What LexGrade builds on, credited in full' } },
];

/** One <a> for a PAGES entry, marked aria-current when it's the active page. */
function navLink({ id, path, label }, current) {
  return `<a href="${path}"${id === current ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a>`;
}

/**
 * Cross-page nav (the PAGES entries flagged `nav`). Renders the SAME links twice
 * from one list: an inline bar (desktop) and a zero-JS <details> disclosure
 * (mobile, a "Sections" toggle). CSS shows exactly one per breakpoint, so the
 * other is display:none — never announced or focusable. No force-open hack
 * (closed-<details> content is hidden via content-visibility in current engines,
 * which a display override can't reliably defeat); showing one outright is robust.
 *
 * @param {string} current the active page id
 * @returns {string}
 */
function siteNav(current) {
  const navItems = PAGES.filter((p) => p.nav);
  const bar = navItems.map((p) => navLink(p, current)).join('');
  // The mobile "Sections" disclosure also carries Contribute: the desktop CTA
  // button is hidden on phones, so every destination lives in one menu there.
  const menu = navItems
    .concat(PAGES.filter((p) => p.id === 'contribute'))
    .map((p) => navLink(p, current))
    .join('');
  return `<nav class="sitenav" aria-label="Standard sections"><div class="sitenav-bar">${bar}</div><details class="sitenav-menu"><summary class="sitenav-summary">Sections</summary><div class="sitenav-list">${menu}</div></details></nav>`;
}

/**
 * The primary call to action — "Contribute" — pinned to the right of the top bar,
 * the slot the left-grouped nav deliberately leaves open. LexGrade is an open,
 * collaborative standard; this is the door in. Marked aria-current on /contribute.
 *
 * @param {string} current the active page id
 * @returns {string}
 */
function siteCta(current) {
  return `<a class="cta" href="/contribute"${current === 'contribute' ? ' aria-current="page"' : ''}>Contribute</a>`;
}

/**
 * The shared full-width top bar: masthead + nav grouped left, the Contribute CTA
 * pinned right. ONE source for every page (two-column and solo), so the site
 * chrome can't drift between shells.
 *
 * @param {string} current the active page id
 * @returns {string}
 */
function topbar(current) {
  return `<header class="topbar">
${siteMasthead()}
${current ? siteNav(current) : ''}
${siteCta(current)}
</header>`;
}

/**
 * The shared site footer on every page: a secondary-link row (the PAGES entries
 * flagged `footer` — the pages that don't sit in the top nav) + the license line.
 * Driven by PAGES so it never lists a page that isn't built; GitHub is appended as
 * the lone external link.
 *
 * @param {string} current the active page id
 * @returns {string}
 */
function siteFooter(current) {
  const links = PAGES.filter((p) => p.footer).map((p) => navLink(p, current)).join('');
  return `<footer class="site-footer">
  <nav class="site-footer__nav" aria-label="Secondary">${links}<a href="${REPO_URL}">GitHub</a></nav>
  <p class="site-footer__meta">LexGrade — open methodology, licensed CC-BY-SA 4.0. &copy; 2026 LexGrade.</p>
  <p class="site-footer__note">Not legal advice. LexGrade confers no authority — verify every citation before filing.</p>
</footer>`;
}

/**
 * Open Graph + Twitter card tags so a shared link (a campus channel, a citation)
 * unfurls with the page's title + description + a branded image instead of a bare
 * URL. `image` is a root-relative path to a build-generated OG card; absent, the
 * card degrades to a text `summary`.
 *
 * @param {{title: string, description: string, url: string, image?: string}} opts
 * @returns {string}
 */
function socialMeta({ title, description, url, image }) {
  const imageUrl = image ? `${SITE_ORIGIN}${image}` : null;
  const imageTags = imageUrl
    ? `
<meta property="og:image" content="${escapeHtml(imageUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`
    : '';
  return `<meta property="og:type" content="website">
<meta property="og:site_name" content="LexGrade Standard">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${escapeHtml(url)}">${imageTags}
<meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">`;
}

// Single source of truth for a principle role's presentation: the human label,
// the badge label lookup, AND the generated .badge--<role> CSS all derive from
// this one object, so they cannot drift. Adding a role is a one-line edit here.
const ROLES = {
  precondition: { label: 'Precondition', bg: 'transparent', fg: 'var(--muted)', border: 'var(--border)' },
  weighted: { label: 'Weighted', bg: 'var(--border-2)', fg: 'var(--heading)', border: 'var(--border)' },
  gate: { label: 'Gate', bg: '#F6E7E5', fg: 'var(--accent)', border: '#E8CFC9' },
};

// Google Fonts for the spec's typography: Source Serif 4 (body/prose/headings),
// IBM Plex Sans (UI chrome, nav, labels, section numbers), IBM Plex Mono (ids,
// code, numerals). Loaded via <link> markup — zero-JS, and the offline-build
// litmus is about the BUILD emitting no script, not about runtime asset loading.
// display=swap keeps text visible while the webfont arrives; the CSS fallbacks
// (Georgia / system-ui / ui-monospace) render identically offline.
const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&display=swap">`;

// Accent colour for mobile-chrome theming + the OG cards (the deeper maroon).
const THEME_COLOR = '#7A1626';

/** Escape text for safe interpolation into HTML element or attribute content. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** "P2" -> "2"; "LGS 3.5" -> "3.5". The LGS id already encodes the section number. */
function sectionNumber(id) {
  return String(id).replace(/^P/, '').replace(/^LGS\s+/i, '').trim();
}

/** "LGS 3.5" -> "lgs-3.5" — the canonical criterion anchor. */
function anchor(id) {
  return String(id).toLowerCase().replace(/\s+/g, '-');
}

// Spell small counts as words (the spec's prose voice); fall back to the numeral
// past the table. Lets count-bearing copy derive from source instead of hardcoding.
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
function spellNumber(n) {
  return NUMBER_WORDS[n] ?? String(n);
}

/** Capitalize the first letter (for sentence-initial spelled numbers). */
function capitalize(s) {
  const str = String(s ?? '');
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/**
 * The shared page header: the <h1> and an optional subhead. Both are raw HTML so
 * callers keep their `<span class="version">` markup; this just stamps the
 * consistent .doc-header structure every page shares.
 *
 * @param {{title: string, subhead?: string}} opts
 * @returns {string}
 */
function docHeader({ title, subhead = '' }) {
  return `  <header class="doc-header">
    <h1>${title}</h1>${subhead ? `\n    <p class="subhead">${subhead}</p>` : ''}
  </header>`;
}

function renderCriterion(c) {
  const a = anchor(c.id);
  const deduction =
    c.deduction !== undefined && c.deduction !== null
      ? `<p class="deduction"><strong>Deduction:</strong> ${escapeHtml(String(c.deduction))} points per instance${
          c.deduction_note ? ` (${escapeHtml(String(c.deduction_note))})` : ''
        }</p>`
      : '';
  const source = c.source ? `<p class="source">Source: ${escapeHtml(String(c.source))}</p>` : '';

  return `<section class="criterion" id="${a}" aria-labelledby="${a}-h">
    <h3 id="${a}-h"><span class="num">${escapeHtml(sectionNumber(c.id))}</span> ${escapeHtml(c.title)} <a class="self-link" href="#${a}" aria-label="Permalink to ${escapeHtml(c.id)}">${escapeHtml(c.id)}</a></h3>
    <p class="requirement">${escapeHtml(String(c.requirement ?? '').trim())}</p>
    ${deduction}
    ${source}
  </section>`;
}

function renderPrinciple(p, criteria) {
  const id = String(p.id).toLowerCase();
  const role = ROLES[p.role]?.label ?? String(p.role);
  // Colour is always paired with the role text — never colour-only (WCAG 1.4.1).
  const badge = `<span class="badge badge--${escapeHtml(p.role)}">${escapeHtml(role)}${
    p.weight > 0 ? ` · ${escapeHtml(String(p.weight))}%` : ''
  }</span>`;
  const note = p.note ? `<p class="note">${escapeHtml(String(p.note).trim())}</p>` : '';

  const body =
    criteria.length === 0
      ? `<p class="precondition">${
          p.id === 'P1'
            ? 'Procedural Integrity is a precondition the filer satisfies against the court&#39;s rules. LGS does not score it; graded criteria begin at LGS 2.1.'
            : 'No graded criteria for this principle.'
        }</p>`
      : `<div class="criteria">\n${criteria.map(renderCriterion).join('\n')}\n</div>`;

  return `<section class="principle" id="${id}" aria-labelledby="${id}-h">
  <h2 id="${id}-h"><span class="num">${escapeHtml(sectionNumber(p.id))}.</span> ${escapeHtml(p.title)} <span class="pid">${escapeHtml(p.id)}</span> ${badge}</h2>
  ${note}
  ${body}
</section>`;
}

function renderConformanceLevels(levels) {
  if (!levels.length) {
    return '';
  }

  const cards = levels
    .map((l) => {
      const rows = [
        l.composite_band ? ['Composite', l.composite_band] : null,
        l.gate ? ['Gate', l.gate] : null,
        l.precondition ? ['Precondition', l.precondition] : null,
      ].filter(Boolean);
      const meta = rows
        .map(([k, v]) => `<p class="meta"><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</p>`)
        .join('\n      ');
      const desc = l.descriptor ? `<p class="requirement"><em>${escapeHtml(l.descriptor)}</em></p>` : '';
      const note = l.note ? `<p class="requirement">${escapeHtml(String(l.note).trim())}</p>` : '';
      return `<div class="criterion" id="conformance-${escapeHtml(l.id)}">
      <h3>${escapeHtml(l.label)}</h3>
      ${meta}
      ${desc}
      ${note}
    </div>`;
    })
    .join('\n');

  return `<section class="principle" id="conformance-levels" aria-labelledby="conformance-levels-h">
  <h2 id="conformance-levels-h">Conformance levels</h2>
  <p class="note">A motion conforms at Expert, Competent, or Deficient. A claim is version-specific and does not transfer to revisions — each must be re-graded.</p>
  <div class="criteria">
${cards}
  </div>
</section>`;
}

/**
 * A `<table class="data">` from a caption, column headers, and rows of cells.
 * Every value is escaped, headers carry scope="col" (the AAA requirement). One
 * source for the spec's data tables so their markup can't drift.
 *
 * @param {{caption:string, headers:string[], rows:Array<Array<*>>, id?:string}} opts
 * @returns {string}
 */
function dataTable({ caption, headers, rows, id }) {
  const idAttr = id ? ` id="${escapeHtml(id)}"` : '';
  const head = headers.map((h) => `<th scope="col">${escapeHtml(h)}</th>`).join('');
  const body = rows
    .map((r) => `<tr>${r.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join('')}</tr>`)
    .join('');
  return `<table class="data"${idAttr}>
      <caption>${escapeHtml(caption)}</caption>
      <thead><tr>${head}</tr></thead>
      <tbody>${body}</tbody>
    </table>`;
}

function renderComposite(c) {
  if (!c || Object.keys(c).length === 0) {
    return '';
  }

  const cap = c.cap !== undefined ? `<p class="meta"><strong>Cap:</strong> ${escapeHtml(String(c.cap))} — no motion scores above this.</p>` : '';
  const formula = c.formula ? `<pre class="formula">${escapeHtml(String(c.formula).trim())}</pre>` : '';
  const steps = Array.isArray(c.order_of_operations)
    ? `<ol class="steps">${c.order_of_operations.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`
    : '';
  const weights = c.weights
    ? dataTable({
        caption: `Weighted principles (total ${c.weighted_points_total ?? ''} points)`,
        headers: ['Principle', 'Weight'],
        rows: Object.entries(c.weights).map(([k, v]) => [k, `${v}%`]),
      })
    : '';
  const grades = Array.isArray(c.grade_scale)
    ? dataTable({
        caption: 'Grade scale',
        headers: ['Letter', 'Range', 'Conformance'],
        rows: c.grade_scale.map((g) => [g.letter, g.range, g.conformance]),
      })
    : '';

  return `<section class="principle" id="composite-scoring" aria-labelledby="composite-scoring-h">
  <h2 id="composite-scoring-h">Composite scoring</h2>
  ${cap}
  ${formula}
  ${steps}
  ${weights}
  ${grades}
</section>`;
}

/**
 * Render the "Conformance claims" section: what a well-formed claim states, what
 * it asserts, and — the part lawyers, judges, and ethics counsel ask for first —
 * what it explicitly does NOT assert, plus the automatic-demotion rules that give
 * the candor gate its teeth. All from the catalog's `conformance_claim` +
 * `automatic_demotion_rules` (authored data, anti-drift-guarded), surfaced here
 * because a published spec must state its own limits, not bury them.
 *
 * @param {object|null} claim the conformance_claim block
 * @param {Array<{condition: string, result: string}>} demotions
 * @returns {string}
 */
function renderConformanceClaim(claim, demotions = []) {
  if (!claim && (!demotions || demotions.length === 0)) {
    return '';
  }

  const elements = Array.isArray(claim?.required_elements)
    ? `<p>A well-formed LexGrade conformance claim states all of:</p>
    <ol class="claim-elements">${claim.required_elements.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ol>`
    : '';

  const asserts = claim?.asserts
    ? `<p class="claim-asserts"><strong>A claim asserts:</strong> ${escapeHtml(String(claim.asserts).trim())}</p>`
    : '';

  // The integrity boundary — the disclaimer a judge / ethics reviewer checks first.
  const disclaims = claim?.does_not_assert
    ? `<p class="claim-disclaims"><strong>A claim does <em>not</em> assert:</strong> ${escapeHtml(String(claim.does_not_assert).trim())}</p>`
    : '';

  const demotionTable = demotions.length
    ? dataTable({
        id: 'automatic-demotions',
        caption: 'Automatic demotions — applied regardless of composite score',
        headers: ['Condition', 'Result'],
        rows: demotions.map((d) => [d.condition, d.result]),
      })
    : '';

  return `<section class="principle" id="conformance-claims" aria-labelledby="conformance-claims-h">
  <h2 id="conformance-claims-h">Conformance claims</h2>
  <p class="note">A conformance claim is version-specific and is made for one motion as graded; it does not transfer to revisions, which must be re-graded.</p>
  ${elements}
  ${asserts}
  ${disclaims}
  ${demotionTable}
</section>`;
}

/**
 * Render the complete static Standard page (W3C-spec layout, zero client JS).
 *
 * @param {{version: string, scope: string, license: string, principles: Array, criteria: Array, byPrinciple: Map, conformanceLevels?: Array, conformanceClaim?: object, automaticDemotions?: Array, composite?: object}} standard
 * @returns {string} a full HTML document
 */
export function renderStandard(standard) {
  const { version, scope, license, principles, criteria, byPrinciple } = standard;
  const conformanceLevels = standard.conformanceLevels ?? [];
  const conformanceClaim = standard.conformanceClaim ?? null;
  const automaticDemotions = standard.automaticDemotions ?? [];
  const composite = standard.composite ?? {};
  const title = `LexGrade Standard v${version}`;
  const critCount = criteria.length;
  // Counts derive from the source data, never hardcoded — the prose can't drift
  // from the catalog. spellNumber keeps the principle count in words (the spec's
  // voice); the larger criteria count stays a numeral.
  const principleWord = spellNumber(principles.length);
  const description = `${title} — open scoring instrument for legal drafting quality. ${capitalize(principleWord)} principles, ${critCount} graded criteria, ${license}.`;

  const toc = principles
    .map((p) => {
      const crits = byPrinciple.get(p.id) ?? [];
      const sub = crits
        .map(
          (c) =>
            `      <li><a href="#${anchor(c.id)}"><span class="num">${escapeHtml(sectionNumber(c.id))}</span> ${escapeHtml(c.title)}</a></li>`,
        )
        .join('\n');
      return `    <li>
      <a href="#${String(p.id).toLowerCase()}"><span class="num">${escapeHtml(sectionNumber(p.id))}</span> ${escapeHtml(p.title)}</a>${
        sub ? `\n      <ol>\n${sub}\n      </ol>` : ''
      }
    </li>`;
    })
    .join('\n');

  const sections = principles.map((p) => renderPrinciple(p, byPrinciple.get(p.id) ?? [])).join('\n');

  const hasClaim = Boolean(conformanceClaim) || automaticDemotions.length > 0;
  const appendixToc = [
    conformanceLevels.length ? '    <li><a href="#conformance-levels">Conformance levels</a></li>' : '',
    hasClaim ? '    <li><a href="#conformance-claims">Conformance claims</a></li>' : '',
    Object.keys(composite).length ? '    <li><a href="#composite-scoring">Composite scoring</a></li>' : '',
  ]
    .filter(Boolean)
    .join('\n');

  const appendix = [
    renderConformanceLevels(conformanceLevels),
    renderConformanceClaim(conformanceClaim, automaticDemotions),
    renderComposite(composite),
  ]
    .filter(Boolean)
    .join('\n');

  const body = `${docHeader({
    title: `LexGrade Standard <span class="version">v${escapeHtml(version)}</span>`,
    subhead: `An open scoring instrument for ${escapeHtml(scope)} — ${principleWord} principles and ${escapeHtml(String(critCount))} graded criteria, each independently citable.`,
  })}

  <details class="sotd" open>
    <summary><span class="sotd-chevron" aria-hidden="true"></span>Status of this document</summary>
    <dl>
      <dt>This version</dt><dd>v${escapeHtml(version)} (current published edition)</dd>
      <dt>Machine-readable</dt><dd><a href="${API_URL}">/api/v1/standard.json</a> · <a href="/llms-full.txt">/llms-full.txt</a></dd>
      <dt>Source repository</dt><dd><a href="${REPO_URL}">${escapeHtml(REPO_URL.replace(/^https?:\/\//, ''))}</a></dd>
      <dt>Authority</dt><dd>CPLR &amp; the Uniform Civil Rules (22 NYCRR Part 202)</dd>${
        standard.citationsVerified
          ? `\n      <dt>Citations verified</dt><dd>${escapeHtml(standard.citationsVerified)} — confirm cited provisions remain current before relying on them</dd>`
          : ''
      }
      <dt>License</dt><dd>${escapeHtml(license)} (content)</dd>
      <dt>Cite as</dt><dd><span id="lg-cite">&ldquo;${escapeHtml(title)}, LexGrade (lexgrade.org), ${escapeHtml(license)}.&rdquo;</span></dd>
    </dl>
    <p>This is the published LexGrade Standard, openly maintained by LexGrade under ${escapeHtml(license)} — not promulgated by any court, bar, or government body. The human-readable Standard text is the source of truth; this page and the machine-readable <code>/api/v1/standard.json</code> catalog are generated from the same criteria source, so they cannot drift. All legal citations in any LexGrade output must be independently verified before filing.</p>
  </details>

  <section class="abstract" aria-labelledby="abstract-h">
    <h2 id="abstract-h">Abstract</h2>
    <p>The LexGrade Standard (LGS) is an open instrument for scoring the quality of legal drafting. It defines ${principleWord} principles and ${escapeHtml(String(critCount))} graded criteria, calibrated against ${escapeHtml(scope)}. Each criterion is independently citable; the conformance grade is a weighted composite, with an ethics gate that forces a deficient grade on any hallucinated citation.</p>
  </section>

${sections}
${appendix}

  <footer class="doc-footer">
    <p>${escapeHtml(title)}, LexGrade (lexgrade.org), ${escapeHtml(license)}. &copy; 2026 LexGrade.</p>
    <p class="gh-links">Found an error? <a href="${REPO_URL}/edit/main/commons/standard/lgs-criteria.yaml">Edit this page on GitHub</a> or <a href="${REPO_URL}/issues/new">open an issue</a>. Substantive changes go through an <code>rfc:</code> issue.</p>
  </footer>`;

  // The Standard shares the same two-column shell as every other TOC page
  // (documentShell), so the head, top bar, sidebar rail, and scroll-spy script
  // live in exactly one place. Its bespoke footer (the citation + rfc note) is
  // carried in the body, so no editPath is passed.
  return documentShell({
    title,
    description,
    bodyHtml: body,
    canonical: '/standard',
    current: 'standard',
    image: '/og/standard.png',
    toc: appendixToc ? `${toc}\n${appendixToc}` : toc,
  });
}

/**
 * A zero-JS root redirect to the canonical /standard page (meta refresh, not
 * a script). Cloudflare Pages serves dist/index.html at the site root.
 *
 * @param {string} to
 * @returns {string}
 */
export function renderRedirect(to) {
  const url = escapeHtml(to);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>LexGrade Standard</title>
<meta http-equiv="refresh" content="0; url=${url}">
<link rel="canonical" href="${CANONICAL_URL}">
<link rel="icon" href="/logo.svg" type="image/svg+xml">
</head>
<body>
<p>Redirecting to the <a href="${url}">LexGrade Standard</a>.</p>
</body>
</html>
`;
}

/**
 * Render the site homepage (/) — a thin landing that claims the root URL instead
 * of bouncing it to /standard: a one-line value proposition and two entry cards
 * into the Standard and the Technique Register. Indexable on its own canonical,
 * and the surface a future marketing page grows from. Shares the solo shell, so
 * it carries the same top bar and ships zero JS.
 *
 * @param {{standardVersion: string, principleCount: number, criteriaCount: number, techniqueVersion: string, techniqueCount: number}} opts
 * @returns {string}
 */
export function renderHome({ standardVersion, principleCount, criteriaCount, techniqueVersion, techniqueCount }) {
  const body = `  <header class="home-hero">
    <h1 class="home-title">Scoring the quality of legal drafting.</h1>
    <p class="subhead">LexGrade is an open instrument for grading legal motions — transparent principles, weighted criteria, and an ethics gate, all openly published and machine-readable.</p>
    <p class="home-evidence">Why an ethics gate? General-purpose language models hallucinate 58&ndash;88% of legal citations (Dahl et al., <em>Large Legal Fictions</em>, 2024). Under the Standard, a single fabricated citation is an automatic &minus;20 — candor toward the court is the floor, not a style point.</p>
  </header>
  <nav class="home-cards" aria-label="Start here">
    <a class="home-card" href="/standard">
      <h2 class="home-card__title">The LexGrade Standard <span class="home-card__v">v${escapeHtml(standardVersion)}</span></h2>
      <p class="home-card__desc">${escapeHtml(String(principleCount))} principles and ${escapeHtml(String(criteriaCount))} graded criteria, each independently citable.</p>
      <span class="home-card__cta">Read the Standard <span aria-hidden="true">→</span></span>
    </a>
    <a class="home-card" href="/techniques">
      <h2 class="home-card__title">Technique Register <span class="home-card__v">v${escapeHtml(techniqueVersion)}</span></h2>
      <p class="home-card__desc">${escapeHtml(String(techniqueCount))} named advocacy techniques — an informative companion to the Standard.</p>
      <span class="home-card__cta">Browse techniques <span aria-hidden="true">→</span></span>
    </a>
  </nav>
  <p class="home-note">Grounded in real motion practice, not theory. A better-built motion serves everyone — both parties, and the court that has to decide it. <a href="/about">Why this exists <span aria-hidden="true">→</span></a></p>
  <aside class="home-invite" aria-label="Contribute">
    <p class="home-invite__lead">An open, collaborative standard — shaped by the people who practice, owned by no one. If you litigate, help shape it.</p>
    <a class="home-invite__link" href="/contribute">Contribute to LexGrade <span aria-hidden="true">→</span></a>
  </aside>`;
  return documentShell({
    title: 'LexGrade — Open scoring for legal drafting quality',
    description:
      'LexGrade is an open standard for scoring the quality of legal drafting: principles, graded criteria, and a named technique register. CC-BY-SA 4.0.',
    bodyHtml: body,
    canonical: '/',
    current: 'home',
    image: '/og/home.png',
  });
}

/**
 * Render the /about page — the project's provenance. LexGrade's criteria were
 * drawn from active litigation in the New York State and federal courts, not a
 * style guide; this page states that grounding in an institutional voice while
 * reinforcing the same limit the Standard carries (no authority, not legal
 * advice). The narrative is site-specific copy (like the 404), not part of the
 * CC-BY-SA commons, so it lives here rather than in a markdown source. The
 * standard is intentionally described without reference to any individual.
 *
 * @returns {string}
 */
export function renderAbout() {
  const body = `${docHeader({
    title: 'About LexGrade',
    subhead: 'An open scoring standard grounded in real motion practice — the learnings, opened up.',
  })}
  <section class="prose" aria-label="About LexGrade">
    <p>LexGrade is an open standard for scoring the quality of legal drafting. Its criteria were drawn from active litigation in the New York State and federal courts — trial-level motion practice through appeal in both systems. They did not come from a style guide. They came from filing motions, reading what courts actually do with them, and noticing what separates a motion a court can act on from one it cannot.</p>
    <p>One lesson sits at the center of the criteria: a filing&#39;s job is to compel action, and a well-built one often does — sometimes even when the specific relief is denied.</p>
    <p>The calibration targets New York State Supreme Court motion practice, the venue the Standard was first built and verified against. The framework is built to extend to other courts and jurisdictions as it is tested against them.</p>
    <h2>Who it&#39;s for</h2>
    <p>The people who most need a well-built motion are the least able to pay for one. Competent motion practice has a price — hours of a lawyer&#39;s time — that prices out most self-represented litigants, who are now the majority of parties in many family and housing courts. LexGrade is built for that gap. It does not promise to win cases; it makes the difference between a motion a court can act on and one it cannot <em>legible</em>, and — paired with a language model — reproducible at almost no marginal cost.</p>
    <p>That is the point of opening it. A scoring standard a litigant can run against their own draft, and a technique register that names what experienced advocates do by instinct, turn knowledge that used to require a retainer into something a self-represented party can apply directly. The value is not persuasion for its own sake; it is access — narrowing the gap between the drafting a court expects and the drafting most litigants can afford.</p>
    <h2>What it builds on</h2>
    <p>LexGrade did not appear from nothing. Its rubric method — weighted components, capped point values, and narrative performance bands — builds on prior legal-writing assessment scholarship, and its calibration is measured against New York&#39;s governing rules. The sources are credited in full on the <a href="/references">references</a> page.</p>
    <h2>What this is — and isn&#39;t</h2>
    <p>LexGrade is an open, independently maintained model of effective motion practice, published openly so others can use it, test it, and <a href="/contribute">improve it</a>. It is <strong>not</strong> promulgated by any court, bar, or government body, it confers no authority, and nothing here is legal advice. Every legal citation in any LexGrade output must be independently verified before filing.</p>
    <p>Governed in the open and licensed CC-BY-SA 4.0 — free to reuse and adapt with attribution — LexGrade belongs to its field rather than to any vendor, bar, or individual: a shared reference that improves by being argued over. The <a href="/standard">Standard</a> and the <a href="/techniques">Technique Register</a> are the substance; this page is just the why.</p>
  </section>`;
  return documentShell({
    title: 'About — LexGrade',
    description:
      'LexGrade is an open scoring standard grounded in active litigation across New York State and federal courts — an independently maintained, vendor-neutral reference. CC-BY-SA 4.0.',
    bodyHtml: body,
    canonical: '/about',
    current: 'about',
    image: '/og/about.png',
  });
}

/**
 * Render the /contribute page — the collaboration call to action. LexGrade is an
 * open, vendor-neutral, versioned standard that belongs to its field, not any one
 * person, and that practitioners refine. The page speaks to attorneys, names the highest-value
 * contributions, explains the rough-consensus rfc: process, and offers two
 * on-ramps — GitHub for the technical, a plain email for everyone else.
 *
 * @returns {string}
 */
export function renderContribute() {
  const body = `${docHeader({
    title: 'Help build the standard',
    subhead: 'An open, vendor-neutral standard that gets sharper when the people who actually practice shape it. It belongs to its field, not to any one person.',
  })}
  <section class="prose" aria-label="How to contribute">
    <p>A scoring standard is only worth what its consensus is worth. LexGrade is published under CC-BY-SA 4.0, governed in the open, and versioned so every change is traceable and citable. It is not owned by a vendor, a bar, or a single litigant — it is a shared reference, and it improves by being argued over.</p>
    <h2>Where you come in</h2>
    <p>If you litigate, you know things the calibration does not yet. The most valuable contributions:</p>
    <ul>
      <li><strong>Propose or challenge a criterion.</strong> If a graded criterion is wrong, incomplete, or weighted poorly, make the case. Disagreement, argued well, is how the standard earns trust.</li>
      <li><strong>Calibrate a jurisdiction.</strong> The base targets New York State Supreme Court motion practice. Help extend it — other states, federal trial and appellate practice — so the standard travels.</li>
      <li><strong>Name a technique.</strong> The Technique Register is a living catalog of advocacy moves. If you rely on one it does not yet name, contribute it.</li>
    </ul>
    <h2>How changes happen</h2>
    <p>Substantive changes go through an <code>rfc:</code> proposal — stated in the open, discussed, accepted by rough consensus, and shipped in a versioned release that credits its contributors. Nothing changes by fiat, and no version claims to be endorsed by any court or bar.</p>
    <h2>Two ways to start</h2>
    <p><strong>On GitHub.</strong> Open an <a href="${REPO_URL}/issues/new">rfc: issue</a>, or read the <a href="${REPO_URL}/blob/main/.github/CONTRIBUTING.md">contribution guide</a> first.</p>
    <p><strong>Not on GitHub.</strong> Email <a href="mailto:contribute@lexgrade.org">contribute@lexgrade.org</a> with the idea, the jurisdiction, or the criterion you would change. A rough note is plenty — it will be turned into a proposal, with credit.</p>
    <p class="note">LexGrade confers no authority and nothing here is legal advice. Contributing creates no attorney–client relationship and no professional obligation.</p>
  </section>`;
  return documentShell({
    title: 'Contribute — LexGrade',
    description:
      'Help shape LexGrade — an open, vendor-neutral standard for scoring legal drafting. Propose criteria, calibrate jurisdictions, name techniques. CC-BY-SA 4.0.',
    bodyHtml: body,
    canonical: '/contribute',
    current: 'contribute',
    image: '/og/contribute.png',
  });
}

/**
 * Render the /references page — sources and influences. LexGrade's rubric method
 * descends from existing legal-writing assessment scholarship; crediting it is
 * both honest and exactly the candor the Standard's own ethics gate demands. Only
 * the method/ideas are credited — LexGrade states its own criteria in its own
 * words, so no third party's copyrighted text is reproduced or relicensed here.
 *
 * @returns {string}
 */
export function renderReferences() {
  const body = `${docHeader({
    title: 'Sources &amp; influences',
    subhead: 'LexGrade is not all original, and says so. The criteria and weights are its own; the method it uses to express them stands on prior work.',
  })}
  <section class="prose" aria-label="Sources and influences">
    <p>A standard earns trust partly by being candid about where it comes from — the same candor LexGrade asks of the motions it scores. What follows is credited because the method was genuinely drawn from it. Ideas and methods are free to build on; the acknowledgment is owed regardless.</p>
    <h2>Scholarship</h2>
    <p>LexGrade&#39;s rubric-based approach — weighted components, capped point values, and narrative performance bands that reduce a grader&#39;s subjectivity to a shared vocabulary — builds on an established tradition in legal-writing assessment, in particular:</p>
    <ul>
      <li>Jessica Clark &amp; Christy DeSanctis, <em>Toward a Unified Grading Vocabulary: Using Rubrics in Legal Writing Courses</em>, 63 J. Legal Educ. 3 (2013).</li>
    </ul>
    <p>LexGrade adapts that pedagogy from the law-school classroom to motion practice. The criteria, weights, and examples are its own; the method is not ours alone. No rubric text or appendix from the cited work is reproduced here — LexGrade states its criteria in its own words.</p>
    <h2>Calibration authority</h2>
    <p>The calibration is measured against the rules that govern the practice it scores: the New York Civil Practice Law and Rules (CPLR) and the Uniform Civil Rules for the Supreme and County Courts (22 NYCRR Part 202). These are primary legal authority, cited as calibration references — not endorsements of LexGrade.</p>
    <p class="note">Building on a source does not imply that source endorses LexGrade. LexGrade confers no authority, and nothing here is legal advice. If you believe a source is used improperly or should be credited, <a href="/contribute">tell us</a>.</p>
  </section>`;
  return documentShell({
    title: 'References — LexGrade',
    description:
      'Sources and influences behind LexGrade — the legal-writing assessment scholarship its rubric method builds on, and the legal authority it calibrates against. CC-BY-SA 4.0.',
    bodyHtml: body,
    canonical: '/references',
    current: 'references',
    image: '/og/references.png',
  });
}

/**
 * Render the agent-readable /llms-full.txt — the CC-BY-SA methodology bundle as
 * raw markdown, concatenated for one-shot ingestion (plain text, no HTML). Only
 * the CC-BY-SA methodology is bundled; the AGPL-licensed code is never included.
 *
 * @param {{version: string, documents: string[]}} bundle
 * @returns {string}
 */
export function renderLlmsFull({ version, documents }) {
  const header = [
    '# LexGrade — Full Methodology',
    '',
    '> The complete open methodology behind LexGrade, concatenated for agents.',
    '> Licensed CC-BY-SA 4.0. (C) 2026 LexGrade.',
    `> Cite as: "LexGrade Standard v${version}, LexGrade (lexgrade.org), CC-BY-SA 4.0."`,
    `> Canonical, browseable source: ${CANONICAL_URL}`,
    '',
    'Documents below, in order: the LexGrade Standard and the Technique Register.',
  ].join('\n');

  return `${header}\n\n---\n\n${documents.join('\n\n---\n\n')}\n`;
}

/**
 * The "Edit this page on GitHub / open an issue" footer. The interim bridge to
 * contribution: GitHub stays the source of record, and every page points at the
 * exact source file it was generated from (`/edit/main/{path}` opens GitHub's
 * editor, forking for non-collaborators — the normal PR funnel) plus the issue
 * tracker. `editPath` is the repo-relative source path; absent → no footer.
 *
 * @param {string} [editPath] repo-relative path to the page's source file
 * @returns {string}
 */
function githubFooter(editPath) {
  if (!editPath) {
    return '';
  }
  return `  <footer class="doc-footer">
    <p class="gh-links">Found an error? <a href="${REPO_URL}/edit/main/${escapeHtml(editPath)}">Edit this page on GitHub</a> or <a href="${REPO_URL}/issues/new">open an issue</a>.</p>
  </footer>`;
}

/**
 * The shared single-column document chrome (head, inline CSS, skip link,
 * decorative ribbon, focusable main) for hub pages without the criteria TOC.
 * renderStandard keeps its own two-column shell; secondary pages use this.
 *
 * @param {{title: string, description: string, bodyHtml: string, editPath?: string}} opts
 * @returns {string}
 */
function documentShell({ title, description, bodyHtml, canonical = '/standard', current, image, editPath, noindex = false, toc = null }) {
  // Each page declares its OWN canonical URL — a shared one would tell search
  // engines every solo page is a duplicate of /standard. Accept a path or a
  // full URL. A noindex page (the 404) carries no canonical.
  const canonicalUrl = canonical.startsWith('http') ? canonical : `${SITE_ORIGIN}${canonical}`;
  const indexTag = noindex
    ? '<meta name="robots" content="noindex">'
    : `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
${indexTag}
${socialMeta({ title, description, url: canonicalUrl, image })}
<link rel="icon" href="/logo.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="${THEME_COLOR}">
${FONT_LINKS}
<style>${CSS}</style>
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${
  toc
    ? `${topbar(current)}
<div class="layout">
${tocSidebar(toc)}
<main id="main" tabindex="-1">
${bodyHtml}
${githubFooter(editPath)}
</main>
</div>`
    : `<div class="layout layout--solo">
${topbar(current)}
<main id="main" tabindex="-1">
${bodyHtml}
${githubFooter(editPath)}
</main>
</div>`
}
${siteFooter(current)}
${toc ? ENHANCE_SCRIPT + '\n' : ''}</body>
</html>
`;
}

/**
 * Render the custom 404 page (Cloudflare Pages serves dist/404.html for any
 * unmatched route). Carries the full nav + masthead so a lost visitor recovers,
 * and is noindex (no canonical) — it must never be indexed as a real page.
 *
 * @returns {string}
 */
export function renderNotFound() {
  const body = `${docHeader({
    title: 'Page not found',
    subhead: 'That page isn&#39;t part of the LexGrade Standard. It may have moved, or the link may be wrong.',
  })}
  <section class="prose" aria-labelledby="nf-h">
    <h2 id="nf-h">Try one of these</h2>
    <ul>
      <li><a href="/standard">The LexGrade Standard</a> — the principles and graded criteria</li>
      <li><a href="/techniques">The Technique Register</a></li>
    </ul>
  </section>`;
  return documentShell({
    title: 'Page not found — LexGrade Standard',
    description: 'That page is not part of the LexGrade Standard.',
    bodyHtml: body,
    current: '404',
    noindex: true,
  });
}


/**
 * Strip anything executable so the production surface stays zero-JS even if a
 * source markdown file ever contains raw HTML. Defensive — our commons markdown
 * has none today, but the guarantee must not depend on that.
 *
 * @param {string} html
 * @returns {string}
 */
export function stripScripts(html) {
  return String(html ?? '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<script\b[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript:/gi, '')
    // Repo-relative doc links (e.g. FORK.md, ../GOVERNANCE.md) don't resolve on
    // the web; the only repo links the site shows are the "Edit this page" footer
    // and the repo path in the SOTD. Unwrap any link whose target isn't
    // site-internal (/), an in-page anchor (#), or absolute (http/mailto).
    .replace(/<a\b[^>]*\shref="(?!https?:|\/|#|mailto:)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, '$1');
}

/**
 * Render the /techniques page from already-rendered (build-time)
 * markdown HTML, sanitized to ship zero JS and wrapped in the shared shell.
 *
 * @param {{version: string, html: string}} opts
 * @returns {string}
 */
export function renderTechniques({ version, techniques = [], md = (s) => s, editPath }) {
  // Render a one-line definition inline (strip the wrapping <p> markdown adds).
  const inline = (raw) => stripScripts(md(raw)).replace(/^\s*<p>([\s\S]*?)<\/p>\s*$/, '$1');

  // Group by category in first-appearance order (no hardcoded category list — a
  // new category appears from the data alone). The full register text is NOT
  // dumped here; it lives on each technique's own page, in /api/v1/techniques.json,
  // and in /llms-full.txt. This page is a scannable, single-column human index.
  const order = [];
  const byCategory = new Map();
  for (const t of techniques) {
    const cat = t.category || 'Uncategorized';
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
      order.push(cat);
    }
    byCategory.get(cat).push(t);
  }

  const groups = order
    .map((cat) => {
      const rows = byCategory
        .get(cat)
        .map(
          (t) => `      <li class="tech-row"><a href="/techniques/${escapeHtml(t.slug)}">
        <span class="tech-row__num">${escapeHtml(String(t.number))}</span>
        <span class="tech-row__body">
          <span class="tech-row__name">${escapeHtml(t.name)}</span>${
            t.definition ? `\n          <span class="tech-row__def">${inline(t.definition)}</span>` : ''
          }
        </span>
      </a></li>`,
        )
        .join('\n');
      const catId = escapeHtml(anchor(cat));
      // The section carries the clean, human anchor (#factual); the heading keeps a
      // derived id only so aria-labelledby can point at it.
      return `    <section class="tech-group" id="${catId}" aria-labelledby="${catId}-h">
      <h2 id="${catId}-h" class="tech-group__h">${escapeHtml(cat)}</h2>
      <ul class="tech-list">
${rows}
      </ul>
    </section>`;
    })
    .join('\n');

  // The brand lives in the H1 (like "LexGrade Standard"), so the two top-level
  // documents share one title structure and neither needs a brand-repeating
  // eyebrow above the masthead.
  const body = `${docHeader({
    title: `LexGrade Technique Register <span class="version">v${escapeHtml(version)}</span>`,
    subhead: `An informative companion to the Standard — ${escapeHtml(String(techniques.length))} named advocacy techniques, reported alongside the composite score but never modifying it. The complete reference is also available as <a href="/api/v1/techniques.json">JSON</a> and in <a href="/llms-full.txt">llms-full.txt</a>.`,
  })}
  <section class="tech-ethos" aria-label="How to read this register">
    <p><strong>Read this first.</strong> The Register is a descriptive catalog of craft, not a playbook for getting one over on a court. Every technique here is a form of clarity, discipline, or preparation — making the strongest <em>honest</em> version of a case easy for a busy court to act on. A technique that requires bending candor to the tribunal or fairness to the opponent is a defect, not a feature.</p>
    <p>No technique is required for any grade: a motion can score A+ with zero techniques present. The Register answers a different question — what does expert advocacy do that competent advocacy does not?</p>
  </section>
  <div class="technique">
${groups}
  </div>`;
  // Sidebar TOC: one entry per category, anchored to its section (#factual).
  // These are real same-page anchors, so the shared scroll-spy marks the active one.
  const toc = order
    .map((cat) => `    <li><a href="#${escapeHtml(anchor(cat))}">${escapeHtml(cat)}</a></li>`)
    .join('\n');
  return documentShell({
    title: `LexGrade Standard v${version} — Technique Register`,
    description: `The LexGrade Technique Register: ${techniques.length} named advocacy techniques. Informative companion to the Standard. CC-BY-SA 4.0.`,
    bodyHtml: body,
    canonical: '/techniques',
    current: 'techniques',
    image: '/og/techniques.png',
    editPath,
    toc,
  });
}

/**
 * Render one technique's standalone, deep-linkable page (/techniques/
 * {slug}) from its standardized field model — a fixed visual order with shared UI
 * tokens, regardless of which fields a given technique happens to have. The
 * citable unit: a single named technique with its own canonical URL. Ships zero JS.
 *
 * @param {{technique: {number:number, name:string, slug:string, category:?string, tier:?string, definition:?string, fields?:object}, editPath?:string}} opts
 * @returns {string}
 */
export function renderTechnique({ technique, md = (s) => s, editPath }) {
  const { number, name, slug, category, tier, definition, fields = {} } = technique;

  // Every field value is raw markdown → HTML (so tables, lists, and emphasis
  // survive), sanitized to ship zero JS, in one shared rich-text container.
  const richText = (raw) => `<div class="field__text">${stripScripts(md(raw))}</div>`;
  // Generic labeled field. The label is a real <h2> (heading hierarchy for AT);
  // appearance comes from the class. `soft` gives supplementary notes a
  // sentence-case sub-heading (the source casing) instead of all-caps — long
  // labels like "LLM failure mode (7a — …)" don't belong in letter-spaced caps.
  const field = (label, inner, soft = false) => `  <div class="field">
    <h2 class="${soft ? 'note-label' : 'field__label'}">${escapeHtml(label)}</h2>
    ${inner}
  </div>`;

  // Definition — the dictionary entry; the category is the "part of speech".
  const def = definition
    ? `  <div class="def">
    <h2 class="sr-only">Definition</h2>
${category ? `    <p class="def__pos">${escapeHtml(category)} technique${tier ? ` · Tier ${escapeHtml(tier)}` : ''}</p>\n` : ''}    <div class="field__text def__text">${stripScripts(md(definition))}</div>
  </div>`
    : '';

  // Example (correct) and Anti-pattern (incorrect) — single-column exemplar
  // quotes, distinguished by the accent (anti-pattern carries the maroon rule).
  const example = fields.example
    ? `  <div class="example">
    <h2 class="example__label"><span aria-hidden="true">✓</span> Example</h2>
    ${richText(fields.example)}
  </div>`
    : '';
  const anti = fields.antiPattern
    ? `  <div class="antipattern">
    <h2 class="antipattern__label"><span aria-hidden="true">✗</span> Anti-pattern</h2>
    ${richText(fields.antiPattern)}
  </div>`
    : '';

  const reqs = fields.requirements ? field('Requirements', richText(fields.requirements)) : '';
  const why = fields.why ? field(fields.why.label, richText(fields.why.text), true) : '';
  const distinctions =
    fields.distinctions && fields.distinctions.length
      ? field(
          'How it differs',
          `<dl class="tech-dl">
${fields.distinctions.map((d) => `      <dt>${escapeHtml(d.label)}</dt><dd>${stripScripts(md(d.text))}</dd>`).join('\n')}
    </dl>`,
        )
      : '';
  const notes = (fields.notes || []).map((n) => field(n.label, richText(n.text), true)).join('\n');

  const body = `${docHeader({
    title: `${escapeHtml(name)} <span class="version">#${escapeHtml(String(number))}</span>`,
  })}
  <div class="technique">
${[def, example, anti, reqs, why, distinctions, notes].filter(Boolean).join('\n')}
  </div>
  <hr>
  <p class="prose"><a href="/techniques">← All techniques</a></p>`;

  return documentShell({
    title: `${name} — LexGrade Technique Register`,
    description: definition
      ? `${name}: ${definition}`
      : `${name} — a named advocacy technique in the LexGrade Technique Register. CC-BY-SA 4.0.`,
    bodyHtml: body,
    canonical: `/techniques/${slug}`,
    current: 'techniques',
    image: `/og/technique-${slug}.png`,
    editPath,
  });
}


const CSS = `
:root {
  --page: #FAF8F4;
  --panel: #F4F0E8;
  --soft: #F6F2EA;
  --card: #FFFFFF;
  --text: #211D1A;
  --heading: #1A1613;
  /* Mockup specced --muted #5A534C / --muted-2 #6E655C; both fall just under the
     AAA 7:1 floor on the warm paper at body size, so they're darkened here until
     every text/background pair clears 7:1 (the deliberate AAA tradeoff). */
  --muted: #4C463F;
  --muted-2: #544D46;
  --link: #2B4C7E;
  --accent: #7A1626;
  --accent-deep: #5E101C;
  --border: #E4DFD6;
  --border-2: #EDE7DC;
  --measure: 42rem;
  /* Golden-ratio (φ ≈ 1.618) spacing scale for type rhythm. */
  --space-2xs: 0.382rem; /* φ⁻² */
  --space-xs: 0.618rem;  /* φ⁻¹ */
  --space-s: 1rem;       /* base */
  --space-m: 1.618rem;   /* φ¹ */
  --space-l: 2.618rem;   /* φ² */
  --space-xl: 4.236rem;  /* φ³ */
  --serif: 'Source Serif 4', Georgia, 'Times New Roman', serif;
  --sans: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--serif);
  font-optical-sizing: auto;
  color: var(--text);
  background: var(--page);
  line-height: 1.65;
  font-variant-numeric: oldstyle-nums proportional-nums;
  /* Prevent orphans/widows everywhere: text-wrap-style is inherited, so this
     reaches paragraphs, list items, table cells, and definitions automatically.
     Progressive — older engines fall back to normal wrapping. */
  text-wrap: pretty;
}
h1, h2, h3, h4 { font-family: var(--serif); color: var(--heading); text-wrap: balance; font-optical-sizing: auto; }
/* Short display blocks read better balanced than ragged-with-no-orphan. */
.subhead, .def__text p { text-wrap: balance; }
a { color: var(--link); text-decoration-thickness: from-font; text-underline-offset: .12em; }
a:hover { color: var(--accent-deep); text-decoration: underline; }
a:focus-visible, summary:focus-visible, [tabindex]:focus-visible {
  outline: 3px solid var(--accent); outline-offset: 2px; border-radius: 3px;
}
:target { scroll-margin-top: 1.5rem; }
.num, .pid, .self-link, .formula, code, table.data td { font-variant-numeric: lining-nums tabular-nums; }
.skip-link { position: absolute; left: -9999px; top: 0; background: var(--heading); color: #fff; padding: .6rem 1rem; z-index: 10; font-family: var(--sans); }
.skip-link:focus { left: .5rem; top: .5rem; }

/* ── Shared top bar + page shells ─────────────────────────────────────────── */
/* The spec page is a two-column grid (sticky TOC rail + content) under the top
   bar; every other page is a single centered column under the same top bar. */
.layout { display: grid; grid-template-columns: 21.5rem minmax(0, 1fr); align-items: start; min-height: 100vh; }
.layout--solo { display: block; }

/* Pinned full-height rail: min-height keeps the panel filling the viewport even
   when the TOC is short (a few categories), so the cream rail never cuts off
   mid-page; max-height + overflow lets a long TOC scroll within it. */
.sidebar {
  position: sticky; top: 0; align-self: start;
  min-height: 100vh; max-height: 100vh; overflow-y: auto;
  background: var(--panel);
  border-right: 1px solid var(--border);
  padding: 1.75rem 1.5rem 2rem;
}

main { padding: 2.875rem 4.5rem 5rem; min-width: 0; }
.layout main { max-width: 1080px; }
/* All solo doc pages share one centered reading column at ~the measure, so the
   header and body line up and prose-heavy and table pages read consistently. */
.layout--solo main { max-width: 50rem; margin: 0 auto; padding: 2.875rem 1.5rem 5rem; }

/* ONE shared full-width top bar on every page: masthead + nav grouped at the
   left, so the site nav is identical everywhere and never jumps when navigating.
   The right edge is left open for a future CTA (which can claim it with
   margin-left: auto). */
.topbar { display: flex; align-items: center; justify-content: flex-start; flex-wrap: wrap; gap: .6rem 2rem; padding: 1.05rem 2rem; border-bottom: 1px solid var(--border); background: var(--panel); }

/* ── Masthead + primary nav ──────────────────────────────────────────────── */
.masthead { display: inline-flex; align-items: center; gap: .55rem; text-decoration: none; color: var(--heading); }
/* text-decoration: none cancels the global a:hover underline — the masthead is a
   brand mark, not a body link, so it never underlines on hover. */
.masthead:hover { color: var(--heading); text-decoration: none; }
/* The wordmark is the brand, set in the serif (like the spec itself); the nav
   around it stays sans. It never underlines — a logo is a mark, not a link. */
.masthead .wordmark { font-family: var(--serif); font-weight: 600; font-size: 1.3rem; letter-spacing: -.01em; }
.masthead .logo { width: 1.85rem; height: 1.85rem; display: block; flex: none; color: var(--accent); }

.sitenav { font-family: var(--sans); font-size: .92rem; }
.sitenav a { text-decoration: none; color: var(--muted); }
.sitenav a:hover { color: var(--accent-deep); }
.sitenav a[aria-current="page"] { color: var(--heading); }
.sitenav-menu { display: none; }

/* Inline row of links with an accent underline on the active one. */
.topbar .sitenav-bar { display: flex; flex-wrap: wrap; gap: .4rem 1.4rem; }
.topbar .sitenav-bar a { padding: .15rem 0; border-bottom: 2px solid transparent; }
.topbar .sitenav-bar a[aria-current="page"] { border-bottom-color: var(--accent); }

/* The Contribute CTA — pinned to the right of the top bar (margin-left: auto
   claims the slot the left-grouped nav leaves open). A solid accent button so it
   reads as the primary action, distinct from the plain nav links. */
.cta { margin-left: auto; font-family: var(--sans); font-size: .9rem; font-weight: 600; line-height: 1; text-decoration: none; color: #fff; background: var(--accent); border: 1px solid var(--accent); padding: .5rem 1rem; border-radius: 7px; white-space: nowrap; }
.cta:hover { background: var(--accent-deep); border-color: var(--accent-deep); color: #fff; text-decoration: none; }
.cta[aria-current="page"] { background: var(--accent-deep); border-color: var(--accent-deep); }

/* ── Sidebar table of contents ────────────────────────────────────────────── */
.toc { font-family: var(--sans); }
.toc-label { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted-2); margin: 0 0 var(--space-xs); padding: 0 .75rem; }
.toc-label::after { content: ""; display: block; height: 1px; background: var(--border); margin-top: .65rem; }
.toc ol { list-style: none; margin: 0; padding: 0; }
.toc-list { font-size: .9rem; }
.toc-list > li { margin-bottom: .15rem; }
.toc-list > li > a { font-weight: 500; color: var(--heading); }
.toc-list ol { margin: .15rem 0 .55rem .9rem; border-left: 1px solid var(--border); padding-left: .7rem; }
.toc-list ol a { font-size: .85rem; color: var(--muted); }
/* A 2px gutter reserved on every entry (transparent until active) so the active
   accent bar is a straight vertical line, not a curved one, and toggling it never
   shifts the text. Left corners stay square so the bar reads as a rule. */
.toc a { text-decoration: none; display: flex; gap: .45rem; padding: .22rem .75rem; border-radius: 0 4px 4px 0; border-left: 2px solid transparent; transition: background-color .15s ease, border-color .15s ease, color .15s ease; }
.toc-list ol a { padding: .18rem .55rem; }
.toc a:hover { background: var(--border-2); color: var(--accent-deep); }
.toc .num { color: var(--accent); font-size: .82em; flex: none; }
/* Scroll-spy active entry — set by the enhancement script (aria-current); absent
   and harmless without JS. Colour pairs with the left accent rule, never colour-only. */
.toc a[aria-current] { color: var(--accent); background: var(--border-2); border-left-color: var(--accent); }
.toc a[aria-current] .num { color: var(--accent); }

/* Copy-cite button — injected by the enhancement script only where the clipboard
   API exists; the citation text is always present and selectable without JS. */
.cite-copy { font-family: var(--sans); font-weight: 600; font-size: 12px; color: var(--accent); background: none; border: 1px solid var(--border); border-radius: 6px; padding: 3px 11px; margin-left: 12px; cursor: pointer; }
.cite-copy:hover { background: var(--border-2); }
.cite-copy.is-copied { color: #156b3a; border-color: #a9d4be; }
.cite-copy:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.toc-list ol a .num { color: var(--muted-2); }

/* ── Document header ──────────────────────────────────────────────────────── */
.doc-header { border-bottom: 1px solid var(--border); padding-bottom: var(--space-m); margin-bottom: var(--space-l); }
.doc-header h1 { font-size: clamp(2rem, 4.5vw, 2.9rem); line-height: 1.12; margin: 0; letter-spacing: -.012em; font-weight: 600; }
.doc-header .version { color: var(--muted-2); font-weight: 400; }
.subhead { color: var(--muted); max-width: var(--measure); margin: .9rem 0 0; font-size: 1.12rem; line-height: 1.55; }

/* ── Home landing ─────────────────────────────────────────────────────────── */
/* A thin landing at the root: a value-proposition hero over two entry cards.
   Reuses the solo reading column + shared tokens, so it stays on-system. */
.home-hero { margin: var(--space-l) 0 var(--space-l); }
.home-title { font-size: clamp(2.1rem, 5vw, 3rem); line-height: 1.1; letter-spacing: -.015em; font-weight: 600; margin: 0; }
/* The evidence line — the one cited fact that explains the ethics gate. A quiet
   callout, not a banner: it should read as documentation, not marketing. */
.home-evidence { font-family: var(--sans); font-size: .95rem; color: var(--muted); max-width: var(--measure); margin: 1.1rem 0 0; padding: .85rem 1.1rem; background: var(--soft); border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0; }
.home-cards { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-s); }
.home-card { display: flex; flex-direction: column; gap: .5rem; padding: 1.6rem 1.5rem; background: var(--card); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: inherit; transition: border-color .15s ease, transform .15s ease; }
.home-card:hover { border-color: var(--accent); color: inherit; text-decoration: none; transform: translateY(-2px); }
.home-card__title { font-family: var(--serif); font-size: 1.3rem; font-weight: 600; margin: 0; }
.home-card__v { color: var(--muted-2); font-weight: 400; font-size: .9em; }
.home-card__desc { color: var(--muted); margin: 0; flex: 1; }
.home-card__cta { font-family: var(--sans); font-size: .9rem; font-weight: 600; color: var(--accent); margin-top: .4rem; }
.home-card:hover .home-card__cta { text-decoration: underline; }
.home-note { font-family: var(--sans); font-size: .95rem; color: var(--muted); margin: var(--space-l) 0 0; }
/* Contribute teaser — a soft callout that turns the homepage into an on-ramp for
   collaboration, distinct from the two document cards above it. */
.home-invite { margin: var(--space-m) 0 0; padding: 1.1rem 1.35rem; background: var(--soft); border: 1px solid var(--border); border-radius: 10px; display: flex; flex-wrap: wrap; align-items: baseline; gap: .35rem 1rem; }
.home-invite__lead { margin: 0; flex: 1 1 16rem; font-family: var(--sans); font-size: .95rem; color: var(--muted); }
.home-invite__link { font-family: var(--sans); font-weight: 600; font-size: .95rem; color: var(--accent); text-decoration: none; white-space: nowrap; }
.home-invite__link:hover { color: var(--accent-deep); text-decoration: underline; }
@media (max-width: 40rem) { .home-cards { grid-template-columns: 1fr; } }

/* ── Status of this document ──────────────────────────────────────────────── */
.sotd { border: 1px solid var(--border); border-radius: 10px; padding: 0 1.5rem; margin-bottom: 2.5rem; background: var(--soft); }
.sotd summary { cursor: pointer; font-family: var(--serif); font-weight: 600; font-size: 1.15rem; color: var(--heading); padding: 1.1rem 0; list-style: none; display: flex; align-items: center; gap: .6rem; }
.sotd summary::-webkit-details-marker { display: none; }
.sotd-chevron { width: .55rem; height: .55rem; border-right: 2px solid var(--accent); border-bottom: 2px solid var(--accent); transform: rotate(45deg); transition: transform .15s ease; flex: none; }
.sotd[open] .sotd-chevron { transform: rotate(-135deg); }
.sotd dl { display: grid; grid-template-columns: max-content 1fr; gap: .5rem 1.5rem; margin: 0 0 1.25rem; font-size: .96rem; }
.sotd dt { font-family: var(--sans); font-size: .76rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted-2); align-self: center; }
.sotd dd { margin: 0; }
.sotd p { max-width: var(--measure); margin: 0 0 1.25rem; color: var(--muted); }
.sotd code { font-family: var(--mono); font-size: .88em; }

.abstract { margin-bottom: var(--space-l); }
.abstract h2, .principle h2 { font-size: 1.6rem; font-weight: 600; }
.abstract p { max-width: var(--measure); }

/* ── Principle sections ───────────────────────────────────────────────────── */
.principle { margin-bottom: var(--space-l); }
.principle h2 { display: flex; flex-wrap: wrap; align-items: baseline; gap: .65rem; border-bottom: 1px solid var(--border); padding-bottom: .6rem; margin-bottom: 1rem; letter-spacing: -.01em; }
.principle h2 .num { color: var(--accent); font-weight: 500; }
.pid { font-family: var(--mono); font-size: .8rem; color: var(--muted-2); letter-spacing: 0; }
.note { color: var(--muted); font-style: italic; max-width: var(--measure); }
.precondition { max-width: var(--measure); color: var(--muted); background: var(--soft); border: 1px solid var(--border); border-radius: 10px; padding: 1.1rem 1.35rem; }

.criteria { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.4rem; }
.criterion { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 1.15rem 1.4rem; }
.criterion h3 { display: flex; flex-wrap: wrap; align-items: baseline; gap: .55rem; font-size: 1.18rem; font-weight: 600; margin: 0 0 .55rem; }
.criterion h3 .num { font-size: .9rem; color: var(--accent); font-weight: 500; }
.self-link { font-family: var(--mono); font-size: .76rem; text-decoration: none; color: var(--muted); padding: .1rem .45rem; border: 1px solid var(--border); border-radius: 5px; margin-left: auto; }
.self-link:hover { color: var(--accent-deep); border-color: var(--accent); text-decoration: none; }
.requirement { margin: 0; max-width: var(--measure); }
.source { font-family: var(--sans); font-size: .82rem; color: var(--muted-2); margin: .65rem 0 0; }
.deduction { font-family: var(--sans); font-size: .85rem; color: var(--accent-deep); margin: .55rem 0 0; }

/* Role badges — colour always paired with the role text (WCAG 1.4.1). Only the
   candor gate carries the brand red; precondition and weighted are tonal warm
   neutrals (no off-system blue), all clearing AAA 7:1 on the warm paper. */
.badge { font-family: var(--sans); font-size: .72rem; font-weight: 500; letter-spacing: .02em; padding: .18em .6em; border-radius: 999px; border: 1px solid var(--border); white-space: nowrap; }
${Object.entries(ROLES)
  .map(([k, r]) => `.badge--${k} { background: ${r.bg}; color: ${r.fg}; border-color: ${r.border}; }`)
  .join('\n')}

/* Screen-reader-only (visible to assistive tech, removed from the visual flow). */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

/* Technique Register — elevated, single-column reading layout. One reading
   column (var(--measure)); every section reads top-to-bottom. */
.technique { max-width: var(--measure); }

/* Definition — the dictionary entry; the category is the "part of speech". */
.def { margin: 0 0 var(--space-l); padding-left: 1.2rem; border-left: 3px solid var(--accent); }
.def__pos { font-family: var(--sans); font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 var(--space-xs); }
.def__text, .def__text p { font-family: var(--serif); font-size: 1.3rem; line-height: 1.5; color: var(--heading); margin: 0; }

/* Example (correct) / Anti-pattern (incorrect) — single-column exemplar quotes.
   The anti-pattern carries the maroon rule + label; the example reads calm. */
.example, .antipattern { margin: var(--space-m) 0; padding-left: 1.2rem; border-left: 3px solid var(--border); }
.antipattern { border-left-color: var(--accent); }
.example__label, .antipattern__label { display: flex; align-items: center; gap: .45rem; font-family: var(--sans); font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 var(--space-xs); }
.example__label { color: var(--muted); }
.antipattern__label { color: var(--accent); }
.example .field__text, .antipattern .field__text { font-family: var(--serif); font-size: 1.05rem; color: var(--heading); }

/* Generic labeled field (Requirements, Why it's expert, How it differs, notes). */
.field { margin: var(--space-m) 0; }
.field__label { font-family: var(--sans); font-size: .72rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 var(--space-xs); }
/* Supplementary notes: a calm sentence-case sub-heading (source casing kept),
   so long labels read as prose, not a shout. */
.note-label { font-family: var(--sans); font-size: .92rem; font-weight: 600; color: var(--heading); margin: 0 0 var(--space-xs); }

/* Shared rich-text container for every field value (raw markdown → HTML). */
.field__text { line-height: 1.65; color: var(--ink); }
.field__text > :first-child { margin-top: 0; }
.field__text > :last-child { margin-bottom: 0; }
.field__text p { margin: .7rem 0; }
.field__text ul, .field__text ol { margin: .7rem 0; padding-left: 0; list-style: none; }
.field__text li { position: relative; padding-left: 1.4rem; margin: .5rem 0; }
.field__text ul > li::before { content: "—"; position: absolute; left: 0; color: var(--accent); }
.field__text ol { counter-reset: tech-li; }
.field__text ol > li::before { content: counter(tech-li) "."; counter-increment: tech-li; position: absolute; left: 0; font-family: var(--mono); font-size: .85em; color: var(--muted-2); }
.field__text code { font-family: var(--mono); font-size: .88em; background: var(--soft); padding: .1em .35em; border-radius: 4px; }
.field__text table { border-collapse: collapse; width: 100%; margin: .9rem 0; font-size: .92rem; background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.field__text th, .field__text td { border-bottom: 1px solid var(--border-2); padding: .5rem .8rem; text-align: left; }
.field__text tr:last-child td { border-bottom: none; }
.field__text th { font-family: var(--sans); font-weight: 600; font-size: .82rem; background: var(--panel); }
.tech-dl { margin: 0; }
.tech-dl dt { font-family: var(--sans); font-size: .82rem; font-weight: 600; color: var(--heading); margin-top: .9rem; }
.tech-dl dd { margin: .25rem 0 0; line-height: 1.6; }
.tech-dl dd p { margin: 0; }

/* Technique index — single-column, category-grouped rows with a medium serif
   numeral in a gutter and hairline rules between rows (scannable, not dominant). */
/* "Read this first" ethos block on the register index — the candor framing sits
   above the category groups so a skimming reader meets it before any technique
   name. Shares the evidence-callout look: documentation, not a warning banner. */
.tech-ethos { max-width: var(--measure); margin: 0 0 var(--space-m); padding: 1rem 1.35rem; background: var(--soft); border: 1px solid var(--border); border-left: 3px solid var(--accent); border-radius: 0 10px 10px 0; }
.tech-ethos p { margin: 0 0 .7rem; color: var(--muted); }
.tech-ethos p:last-child { margin-bottom: 0; }

.tech-group { margin: var(--space-l) 0; }
.tech-group__h { font-family: var(--sans); font-size: .76rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 0 0 var(--space-2xs); }
.tech-list { list-style: none; margin: 0; padding: 0; }
.tech-row { margin: 0; }
.tech-row a { display: grid; grid-template-columns: 2.25rem 1fr; gap: var(--space-s); align-items: baseline; padding: .9rem .25rem; border-top: 1px solid var(--border); text-decoration: none; color: inherit; transition: background .15s ease; }
.tech-row:last-child a { border-bottom: 1px solid var(--border); }
.tech-row a:hover { background: var(--panel); }
.tech-row__num { font-family: var(--serif); font-size: 1.5rem; line-height: 1; color: var(--muted-2); font-variant-numeric: oldstyle-nums; text-align: right; }
.tech-row__body { min-width: 0; }
.tech-row__name { display: block; font-family: var(--serif); font-weight: 600; font-size: 1.05rem; color: var(--heading); }
.tech-row a:hover .tech-row__name { color: var(--accent); }
.tech-row__def { display: block; margin-top: .25rem; font-size: .9rem; line-height: 1.5; color: var(--muted); }

.claim-elements { max-width: var(--measure); }
.claim-asserts, .claim-disclaims { max-width: var(--measure); border-left: 3px solid var(--border); padding: .35rem 0 .35rem 1.1rem; margin: 1.1rem 0; }
/* The integrity boundary (what a passing score does NOT mean) gets the accent —
   the line a judge and an ethics reviewer check first. Colour pairs with the
   "does not assert" text, never colour alone (WCAG 1.4.1). */
.claim-disclaims { border-left-color: var(--accent); }

.meta { margin: .3rem 0; font-size: .94rem; }
.formula { background: var(--soft); border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.25rem; overflow: auto; font-family: var(--mono); font-size: .82rem; line-height: 1.55; white-space: pre-wrap; max-width: var(--measure); }
.steps { max-width: var(--measure); }
table.data { border-collapse: collapse; margin: 1.4rem 0; font-size: .94rem; background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
table.data caption { font-family: var(--sans); text-align: left; color: var(--muted-2); font-size: .8rem; text-transform: uppercase; letter-spacing: .05em; margin-bottom: .5rem; }
table.data th, table.data td { border-bottom: 1px solid var(--border-2); padding: .55rem .85rem; text-align: left; }
table.data tr:last-child td { border-bottom: none; }
table.data th { font-family: var(--sans); font-weight: 600; font-size: .82rem; background: var(--panel); color: var(--heading); }

.doc-footer { border-top: 1px solid var(--border); margin-top: 3.5rem; padding-top: 1.4rem; color: var(--muted); font-family: var(--sans); font-size: .85rem; }
.doc-footer p { margin: .4rem 0; }
.gh-links { color: var(--muted); }

/* Shared site footer (every page): secondary links + license. Full-bleed below
   the content, in the panel tone so it reads as site chrome, like the top bar. */
.site-footer { border-top: 1px solid var(--border); background: var(--panel); padding: 1.5rem 2rem; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .6rem 1.5rem; font-family: var(--sans); font-size: .85rem; }
.site-footer__nav { display: flex; flex-wrap: wrap; gap: .4rem 1.2rem; }
.site-footer__nav a { color: var(--muted); text-decoration: none; }
.site-footer__nav a:hover { color: var(--accent-deep); text-decoration: underline; }
.site-footer__nav a[aria-current="page"] { color: var(--heading); }
.site-footer__meta { margin: 0; color: var(--muted-2); }
.site-footer__note { flex-basis: 100%; margin: 0; color: var(--muted-2); font-size: .8rem; }
@media (max-width: 60rem) { .site-footer { padding: 1.5rem 1.25rem; } }

/* ── Prose (rendered markdown pages) ──────────────────────────────────────── */
.prose { max-width: var(--measure); }
.prose h2 { font-size: 1.6rem; font-weight: 600; line-height: 1.2; margin-top: var(--space-l); letter-spacing: -.01em; }
.prose h3 { font-size: 1.22rem; font-weight: 600; line-height: 1.25; margin-top: var(--space-m); }
.prose table { border-collapse: collapse; margin: 1.4rem 0; font-size: .94rem; background: var(--card); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.prose th, .prose td { border-bottom: 1px solid var(--border-2); padding: .55rem .85rem; text-align: left; }
.prose tr:last-child td { border-bottom: none; }
.prose th { font-family: var(--sans); font-weight: 600; font-size: .82rem; background: var(--panel); }
.prose code { font-family: var(--mono); font-size: .88em; background: var(--soft); padding: .1em .35em; border-radius: 4px; }
/* Identifiers in table cells (slugs, paths) stay on one line instead of fragmenting at hyphens. */
.prose th code, .prose td code { white-space: nowrap; }
.prose pre { overflow-x: auto; }
.prose pre code { background: none; padding: 0; white-space: pre; }
.prose hr, hr { border: none; border-top: 1px solid var(--border); margin: 2.5rem 0; }
.prose ul, .prose ol { padding-left: 1.4rem; }
.prose li + li { margin-top: .4rem; }
.prose li > ul, .prose li > ol { margin-top: .4rem; }

/* The § permalink on a rendered-markdown heading (the legal section sign — the
   deep-link affordance for a legal standard). Muted, constant-weight at rest;
   accent + underline on hover/focus (state never rides on font-weight). */
/* The § permalink floats in the left gutter, outside the text column. */
.prose :is(h1, h2, h3, h4, h5, h6) { position: relative; }
.heading-anchor { position: absolute; left: -1.5em; top: 50%; transform: translateY(-50%); font-family: var(--sans); font-size: .85em; line-height: 1; text-decoration: none; color: var(--muted-2); transition: color .15s ease; }
.prose :is(h1, h2, h3, h4, h5, h6):hover .heading-anchor, .heading-anchor:focus-visible { color: var(--accent); }
@media (max-width: 60rem) { .heading-anchor { left: -1.1em; } }

@media (max-width: 60rem) {
  /* The top bar (brand + "Sections" disclosure) leads, the document follows, and
     the long TOC drops to a footer rail (content-first — the TOC never dumps
     above the document). The sidebar dissolves so its TOC orders after main.
     align-items: stretch is explicit: the base grid sets align-items: start, which
     in a flex column shrinks each row (the top bar) to content width instead of
     spanning — stretch keeps the bar and main full-bleed. */
  .layout { display: flex; flex-direction: column; align-items: stretch; }
  .sidebar { display: contents; }
  .topbar { flex-direction: column; align-items: stretch; gap: .35rem; padding: 1.25rem 1.25rem 1rem; }
  main { order: 2; padding: 1.5rem 1.25rem 3.5rem; }
  .toc { order: 3; border-top: 1px solid var(--border); padding: 1.75rem 1.25rem 2.5rem; }
  .layout--solo main { padding-left: 1.25rem; padding-right: 1.25rem; }

  /* The top-bar nav collapses to the zero-JS <details> disclosure ("Sections")
     on phones. The context selector matches the base rule's specificity so the
     override lands. */
  .topbar .sitenav-bar { display: none; }
  .topbar .sitenav { margin-top: .25rem; }
  /* Contribute moves into the "Sections" disclosure on phones (see siteNav), so
     the standalone CTA button is hidden here — one menu holds every destination. */
  .cta { display: none; }
  .sitenav-menu { display: block; margin-bottom: .5rem; }
  /* A button-like disclosure with a custom chevron (matching the SOTD), rather
     than the raw default ▶ marker. */
  .sitenav-summary { cursor: pointer; padding: .55rem 0; color: var(--heading); font-family: var(--sans); font-weight: 600; list-style: none; display: flex; align-items: center; gap: .55rem; }
  .sitenav-summary::-webkit-details-marker { display: none; }
  .sitenav-summary::before { content: ""; width: .5rem; height: .5rem; border-right: 2px solid var(--accent); border-bottom: 2px solid var(--accent); transform: rotate(-45deg); transition: transform .15s ease; flex: none; }
  .sitenav-menu[open] .sitenav-summary::before { transform: rotate(45deg); }
  .sitenav-list { display: flex; flex-direction: column; padding-top: .35rem; }
  .sitenav-list a { padding: .6rem 0 .6rem .65rem; border-left: 3px solid transparent; }
  .sitenav-list a[aria-current="page"] { border-left-color: var(--accent); color: var(--heading); }

  /* Compact TOC: top-level sections only; nested per-criterion links collapse.
     Keep a left inset so the active item's accent border doesn't crowd its
     label (matches the desktop rail's .75rem gutter). */
  .toc-label { padding-left: .75rem; }
  .toc a { padding-left: .75rem; }
  .toc-list ol { display: none; }

  /* Tables fill the column on a phone so the caption spans full width and a
     short table (e.g. the 2-column weights) fills the card instead of shrinking
     to a left-hugging sliver. display:table (NOT block) is the key: a block
     table stretches its outer box to 100% but the rows collapse into an
     anonymous table that shrinks to content width — the dead-space bug this
     replaces. Wide tables wrap their cells to fit rather than overflow. */
  table.data, .prose table { display: table; width: 100%; max-width: 100%; table-layout: auto; }
  table.data td, table.data th, .prose td, .prose th { overflow-wrap: anywhere; }
  /* Front matter reads as stacked label-over-value on a phone. */
  .sotd dl { grid-template-columns: 1fr; gap: 0; }
  .sotd dt { margin-top: .9rem; }
  .sotd dt:first-of-type { margin-top: 0; }
  .sotd dd { margin: .15rem 0 0; }

  .principle { margin-bottom: 2.5rem; }
  .abstract { margin-bottom: 2.25rem; }
  .self-link { margin-left: 0; }

  /* Touch targets ≥44px on phones — satisfies the WCAG 2.5.5 (AAA) target size
     the site claims, and makes the nav, TOC, and CTA comfortable to thumb-tap.
     (Desktop keeps its tighter pointer-friendly sizing above.) */
  .sitenav-summary { min-height: 2.75rem; }
  .sitenav-list a { min-height: 2.75rem; display: flex; align-items: center; }
  .toc a { min-height: 2.75rem; align-items: center; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { animation: none !important; transition: none !important; }
}
`;
