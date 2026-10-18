// SPDX-License-Identifier: AGPL-3.0-only
//
// Pure, dependency-free HTML renderer for the open LexGrade Standard hub.
//
// Renders a W3C-spec-style static document: a fixed left ribbon, a sticky
// table of contents, a "Status of this document" front-matter block, and
// numbered principle/criteria sections. The PRODUCTION SURFACE SHIPS ZERO
// JAVASCRIPT — the output is pure HTML + a single static stylesheet
// (src/styles.css, composed and emitted by build.mjs; the sticky TOC is CSS
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
  <p class="site-footer__note">Not legal advice. LexGrade confers no authority; verify every citation before filing.</p>
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
  const addedIn = c.added_in ? ` <span class="added-in">Added in v${escapeHtml(String(c.added_in))}.</span>` : '';
  const source = c.source
    ? `<p class="source">Source: ${escapeHtml(String(c.source))}${addedIn}</p>`
    : addedIn
      ? `<p class="source">${addedIn.trim()}</p>`
      : '';

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
      ? `<p class="panel precondition">${
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
    subhead: `An open scoring instrument for ${escapeHtml(scope)}: ${principleWord} principles and ${escapeHtml(String(critCount))} graded criteria, each independently citable.`,
  })}

  <details class="panel sotd" open>
    <summary><span class="sotd-chevron" aria-hidden="true"></span>Status of this document</summary>
    <dl>
      <dt>This version</dt><dd>v${escapeHtml(version)} (current published edition)</dd>
      <dt>Machine-readable</dt><dd><a href="${API_URL}">/api/v1/standard.json</a> · <a href="/llms-full.txt">/llms-full.txt</a></dd>
      <dt>Source repository</dt><dd><a href="${REPO_URL}">${escapeHtml(REPO_URL.replace(/^https?:\/\//, ''))}</a></dd>
      <dt>Calibrated to</dt><dd>CPLR &amp; the Uniform Civil Rules (22 NYCRR Part 202)</dd>${
        standard.citationsVerified
          ? `\n      <dt>Citations verified</dt><dd>${escapeHtml(standard.citationsVerified)} (confirm provisions remain current)</dd>`
          : ''
      }
      <dt>License</dt><dd>${escapeHtml(license)} (content)</dd>
      <dt>Cite as</dt><dd><span id="lg-cite">&ldquo;${escapeHtml(title)}, LexGrade (lexgrade.org), ${escapeHtml(license)}.&rdquo;</span></dd>
    </dl>
    <p>This is the published LexGrade Standard, openly maintained under ${escapeHtml(license)}. It is not promulgated by any court, bar, or government body. The Standard's markdown text is the source of truth and is what <code>/llms-full.txt</code> serves verbatim; this page and the machine-readable <code>/api/v1/standard.json</code> catalog render from its structured derivative, and a build-blocking test holds every criterion ID, title, and weight in the derivative equal to the text, so the representations cannot drift apart silently. Every legal citation, whether in the Standard itself or in any motion drafted or assessed with it, must be independently verified before filing.</p>
  </details>

  <section class="abstract" aria-labelledby="abstract-h">
    <h2 id="abstract-h">Abstract</h2>
    <p>The LexGrade Standard (LGS) is an open instrument for scoring the quality of legal drafting. It defines ${principleWord} principles and ${escapeHtml(String(critCount))} graded criteria, calibrated against ${escapeHtml(scope)}. Each criterion is independently citable. The conformance grade is a weighted composite, and an ethics gate forces a deficient grade on any hallucinated citation.</p>
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
    <p class="subhead">LexGrade is an open instrument for grading legal motions. The principles, the weights, and the ethics gate are published in full, in human and machine-readable form.</p>
    <p class="callout home-evidence">Why an ethics gate? In one 2024 study, leading language models hallucinated in 58&ndash;88% of their answers to verifiable questions about federal court cases (<a href="https://doi.org/10.1093/jla/laae003">Dahl et al., <em>Large Legal Fictions</em></a>). The Standard treats a single fabricated citation as an automatic &minus;20, because candor toward the court is where grading has to start.</p>
  </header>
  <nav class="home-cards" aria-label="Start here">
    <a class="home-card" href="/standard">
      <h2 class="home-card__title">The LexGrade Standard <span class="home-card__v">v${escapeHtml(standardVersion)}</span></h2>
      <p class="home-card__desc">${escapeHtml(String(principleCount))} principles and ${escapeHtml(String(criteriaCount))} graded criteria, each independently citable.</p>
      <span class="home-card__cta">Read the Standard <span aria-hidden="true">→</span></span>
    </a>
    <a class="home-card" href="/techniques">
      <h2 class="home-card__title">Technique Register <span class="home-card__v">v${escapeHtml(techniqueVersion)}</span></h2>
      <p class="home-card__desc">${escapeHtml(String(techniqueCount))} named advocacy techniques, an informative companion to the Standard.</p>
      <span class="home-card__cta">Browse techniques <span aria-hidden="true">→</span></span>
    </a>
  </nav>
  <p class="home-note">The criteria come from real motion practice. A well-built motion serves everyone involved, including the court that has to decide it. <a href="/about">Why this exists <span aria-hidden="true">→</span></a></p>
  <aside class="panel home-invite" aria-label="Contribute">
    <p class="home-invite__lead">An open standard gets sharper when practicing lawyers argue with it. If you litigate, help shape the next version.</p>
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
    subhead: 'An open scoring standard grounded in real motion practice.',
  })}
  <section class="prose" aria-label="About LexGrade">
    <p>LexGrade is an open standard for scoring the quality of legal drafting. Its criteria come from active litigation in the New York State and federal courts, from trial-level motion practice through appeal in both systems. The criteria came from filing motions and reading what courts actually did with them, and from noticing over time what separates a motion a court can act on from one it cannot. They grew out of that experience rather than a style guide.</p>
    <p>One lesson sits at the center: a filing&#39;s job is to compel action. A well-built motion often does, sometimes even when the specific relief is denied.</p>
    <p>The calibration targets New York State Supreme Court motion practice, the venue the Standard was first built and verified against. The framework is built to extend to other courts and jurisdictions as it gets tested against them.</p>
    <h2>Who it&#39;s for</h2>
    <p>The people who most need a well-built motion are usually the least able to pay for one. Competent motion practice costs hours of a lawyer&#39;s time, which prices out most self-represented litigants, and they are now the majority of parties in many family and housing courts. LexGrade was built for that gap. It does not promise to win cases. What it offers is a written, checkable account of the difference between a motion a court can act on and one it cannot, and paired with a language model, that check becomes reproducible at almost no marginal cost.</p>
    <p>That is the point of opening it. A scoring standard a litigant can run against their own draft, and a technique register that names what experienced advocates do by instinct, turn knowledge that used to require a retainer into something a self-represented party can apply directly. The value is access: narrowing the gap between the drafting a court expects and the drafting most litigants can afford.</p>
    <h2>What it builds on</h2>
    <p>LexGrade did not appear from nothing. Its rubric method of weighted components, capped point values, and narrative performance bands builds on prior legal-writing assessment scholarship, and its calibration is measured against New York&#39;s governing rules. The sources are credited in full on the <a href="/references">references</a> page.</p>
    <p><strong>Validation status, stated plainly.</strong> The Standard is a single-author instrument: its criteria and weights have not yet been validated by independent graders, and it does not claim otherwise. The next milestone is an inter-rater reliability round — independent, bar-admitted graders scoring shared exemplars blind, with agreement measured by Krippendorff&#39;s &alpha; — and the calibration materials return to this site when that round is real. Until then, the honest claim is the smaller one: the criteria are published, stable, and citable, and every legal citation in the Standard itself has been verified against the official sources.</p>
    <h2>What this is and isn&#39;t</h2>
    <p>LexGrade is an open, independently maintained model of effective motion practice, published so others can use it, test it, and <a href="/contribute">improve it</a>. It is <strong>not</strong> promulgated by any court, bar, or government body, it confers no authority, and nothing here is legal advice. Every legal citation, whether in the Standard itself or in any motion drafted or assessed with it, must be independently verified before filing.</p>
    <p>The methodology is governed in the open and licensed CC-BY-SA 4.0, free to reuse and adapt with attribution. It belongs to its field rather than to any vendor, bar, or individual, and it improves by being argued over. The <a href="/standard">Standard</a> and the <a href="/techniques">Technique Register</a> carry the substance. This page is only the background.</p>
    <h2>When this is wrong</h2>
    <p>The Standard cites court rules and published scholarship, and both change. If a rule it cites has been renumbered or repealed, a citation is wrong, or a stated fact is out of date, <a href="${REPO_URL}/issues/new?template=correction.yml">open a correction</a> or email <a href="mailto:hello@lexgrade.org?subject=Correction">hello@lexgrade.org</a> with the subject &ldquo;Correction&rdquo;. Every report is acknowledged within 14 days. A confirmed error of fact is fixed in the current edition and recorded in the changelog. A correction that would change what a criterion requires goes through the public RFC process and ships in the next minor edition, with the report linked until it does. The full policy is in <a href="${REPO_URL}/blob/main/commons/GOVERNANCE.md#corrections">GOVERNANCE</a>.</p>
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
    subhead: 'An open, vendor-neutral standard shaped by the people who actually practice. It belongs to its field.',
  })}
  <section class="prose" aria-label="How to contribute">
    <p>A scoring standard is only worth what its consensus is worth. LexGrade is published under CC-BY-SA 4.0, governed in the open, and versioned so every change is traceable and citable. No vendor, bar, or single litigant owns it.</p>
    <h2>Where you come in</h2>
    <p>If you litigate, you know things the calibration does not yet. The most valuable contributions:</p>
    <ul>
      <li><strong>Propose or challenge a criterion.</strong> If a graded criterion is wrong, incomplete, or weighted poorly, make the case.</li>
      <li><strong>Calibrate a jurisdiction.</strong> The base targets New York State Supreme Court motion practice. Help extend it to other states or to federal trial and appellate practice.</li>
      <li><strong>Name a technique.</strong> The Technique Register is a living catalog of advocacy moves. If you rely on one it does not yet name, contribute it.</li>
    </ul>
    <h2>How changes happen</h2>
    <p>Substantive changes go through an <code>rfc:</code> proposal. It is stated in the open, discussed, accepted by rough consensus, and shipped in a versioned release that credits its contributors. No version claims to be endorsed by any court or bar.</p>
    <h2>Two ways to start</h2>
    <p><strong>On GitHub.</strong> Open an <a href="${REPO_URL}/issues/new">rfc: issue</a>, or read the <a href="${REPO_URL}/blob/main/.github/CONTRIBUTING.md">contribution guide</a> first.</p>
    <p><strong>Not on GitHub.</strong> Email <a href="mailto:contribute@lexgrade.org">contribute@lexgrade.org</a> with the idea, the jurisdiction, or the criterion you would change. A rough note is plenty, and it will be turned into a proposal with credit.</p>
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
    subhead: 'The criteria and weights are LexGrade&#39;s own. The method used to express them stands on prior work, credited here.',
  })}
  <section class="prose" aria-label="Sources and influences">
    <p>A standard should be candid about where it comes from. The sources below are credited because the method was genuinely drawn from them. Ideas and methods are free to build on, and the acknowledgment is owed regardless.</p>
    <h2>Scholarship</h2>
    <p>LexGrade&#39;s rubric-based approach (weighted components, capped point values, and narrative performance bands that reduce a grader&#39;s subjectivity to a shared vocabulary) builds on an established tradition in legal-writing assessment, in particular:</p>
    <ul>
      <li>Jessica Clark &amp; Christy DeSanctis, <em>Toward a Unified Grading Vocabulary: Using Rubrics in Legal Writing Courses</em>, 63 J. Legal Educ. 3 (2013).</li>
    </ul>
    <h2>Empirical grounding</h2>
    <p>The hallucination figures cited on the homepage and in the Standard&#39;s ethics-gate rationale come from:</p>
    <ul>
      <li>Matthew Dahl, Varun Magesh, Mirac Suzgun &amp; Daniel E. Ho, <em>Large Legal Fictions: Profiling Legal Hallucinations in Large Language Models</em>, 16 J. Legal Analysis 64 (2024), <a href="https://doi.org/10.1093/jla/laae003">doi:10.1093/jla/laae003</a>. The study measured hallucination rates in model answers to verifiable questions about federal court cases: 58% for ChatGPT-4, up to 88% for Llama 2.</li>
    </ul>
    <p>LexGrade adapts that pedagogy from the law-school classroom to motion practice. The criteria, weights, and examples are its own. No rubric text or appendix from the cited work is reproduced here; LexGrade states its criteria in its own words.</p>
    <h2>Calibration authority</h2>
    <p>The calibration is measured against the rules that govern the practice it scores: the New York Civil Practice Law and Rules (CPLR) and the Uniform Civil Rules for the Supreme and County Courts (22 NYCRR Part 202). These are primary legal authority, cited here as calibration references. No endorsement of LexGrade is implied.</p>
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
<link rel="stylesheet" href="/styles.css">
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
    subhead: `An informative companion to the Standard: ${escapeHtml(String(techniques.length))} named advocacy techniques, reported alongside the composite score without ever modifying it. The complete reference is also available as <a href="/api/v1/techniques.json">JSON</a> and in <a href="/llms-full.txt">llms-full.txt</a>.`,
  })}
  <section class="callout tech-ethos" aria-label="How to read this register">
    <p><strong>Read this first.</strong> The Register catalogs craft. Each named technique is a form of clarity, discipline, or preparation that makes the strongest <em>honest</em> version of a case easy for a busy court to act on. If a technique would require bending candor to the tribunal or fairness to the opponent, the Standard treats it as a defect.</p>
    <p>No technique is required for any grade, and a motion can score A+ with none present. The Register asks a different question: what does expert advocacy do that competent advocacy does not?</p>
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


// The stylesheet lives in src/styles.css — a real CSS file, so editors get
// syntax highlighting and there is no template-literal backtick hazard. The
// one dynamic piece is the .badge--<role> palette derived from ROLES above;
// build.mjs substitutes it at the /*__BADGE_ROLES__*/ placeholder so the
// generated rules keep their cascade position. Exported (rather than read
// here) so this module stays import-free and build.mjs remains the only
// module that touches the filesystem.
export const BADGE_ROLES_CSS = Object.entries(ROLES)
  .map(([k, r]) => `.badge--${k} { background: ${r.bg}; color: ${r.fg}; border-color: ${r.border}; }`)
  .join('\n');
