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
// Dependency-free on purpose so `node --test` exercises it without installing
// anything; build.mjs wires it to loadStandard() + the filesystem. Its one
// import is the sibling string table (src/i18n.mjs), which is as pure as this.
//
// Every page renders in a language (`lang`, English by default). English is the
// source text; a translation is served under /<lang>/ with the same anchors.

import { DEFAULT_LANG, LANGS, LANG_NAMES, PAGES_ES, localPath, strings } from './i18n.mjs';

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
    var copy = cite.getAttribute('data-copy') || 'Copy', copied = cite.getAttribute('data-copied') || 'Copied ✓';
    btn.type = 'button'; btn.className = 'cite-copy'; btn.textContent = copy;
    btn.setAttribute('aria-label', cite.getAttribute('data-copy-label') || 'Copy the citation');
    btn.addEventListener('click', function () {
      navigator.clipboard.writeText(cite.textContent.replace(/[“”"]/g, '').trim()).then(function () {
        btn.textContent = copied; btn.classList.add('is-copied');
        setTimeout(function () { btn.textContent = copy; btn.classList.remove('is-copied'); }, 1600);
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
function tocSidebar(toc, lang = DEFAULT_LANG) {
  return `<aside class="sidebar">
<nav class="toc" aria-labelledby="toc-h">
  <p class="toc-label" id="toc-h">${strings(lang).tocLabel}</p>
  <ol class="toc-list">
${toc}
  </ol>
</nav>
</aside>`;
}

function siteMasthead(lang = DEFAULT_LANG) {
  return `<a class="masthead" href="${localPath(lang, '/')}" aria-label="${strings(lang).homeAria}"><svg class="logo" viewBox="0 0 260 260" aria-hidden="true" focusable="false"><g fill="currentColor" transform="translate(40,20)"><path d="M 0,144 L 36,144 L 36,204 L 180,204 L 180,240 L 0,240 Z"/><rect x="48" y="108" width="36" height="84"/><rect x="96" y="72" width="36" height="120"/><path d="M 144,36 L 162,18 L 180,36 L 180,192 L 144,192 Z"/></g></svg><span class="wordmark">LexGrade</span></a>`;
}

// The single registry of the site's pages — the ONE source for the top nav, the
// footer, the sitemap, and the OG cards (build.mjs imports it). Adding or removing
// a page is a one-line edit here; none of those four surfaces can drift from it.
//   nav    — appears in the left top-bar nav (Standard/Techniques/About)
//   footer — appears in the secondary footer link row
// Each page's label and Open Graph title/subtitle live in src/i18n.mjs, one set
// per language; the English ones are spread onto the entries here (`label`,
// `og`), and the build may override og with version/counts for dynamic pages.
export const PAGES = [
  { id: 'home', path: '/', nav: false, footer: false },
  { id: 'standard', path: '/standard', nav: true, footer: false },
  { id: 'techniques', path: '/techniques', nav: true, footer: false },
  { id: 'about', path: '/about', nav: true, footer: true },
  { id: 'check', path: '/check', nav: true, footer: true },
  { id: 'contribute', path: '/contribute', nav: false, footer: true },
  { id: 'references', path: '/references', nav: false, footer: true },
].map((page) => ({ ...page, ...strings(DEFAULT_LANG).pages[page.id] }));

/** The Open Graph card for a page id in a language ("/og/check.png", "/og/es-check.png"). */
export function ogImage(id, lang = DEFAULT_LANG) {
  return `/og/${lang === DEFAULT_LANG ? '' : `${lang}-`}${id}.png`;
}

/**
 * A narrative page in translation: the shared header and prose section around
 * the translated copy from i18n.mjs, in the same shell as the English page.
 */
function translatedPage(id, page, lang) {
  const body = `${docHeader({ title: page.title, subhead: page.subhead })}
  <section class="prose" aria-label="${escapeHtml(page.aria)}">
${page.body}
  </section>`;
  return documentShell({
    title: page.docTitle,
    description: page.description,
    bodyHtml: body,
    canonical: `/${id}`,
    current: id,
    image: ogImage(id, lang),
    lang,
  });
}

/** One <a> for a PAGES entry, marked aria-current when it's the active page. */
function navLink({ id, path }, current, lang = DEFAULT_LANG) {
  const label = strings(lang).pages[id].label;
  return `<a href="${localPath(lang, path)}"${id === current ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a>`;
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
/**
 * Links to the same page in each other language, named in that language. A
 * page with no counterpart (the 404) passes no path and gets the home pages.
 */
function languageLinks(lang, path, className = '') {
  return LANGS.filter((l) => l !== lang)
    .map((l) => `<a${className ? ` class="${className}"` : ''} href="${localPath(l, path ?? '/')}" lang="${l}" hreflang="${l}">${LANG_NAMES[l]}</a>`)
    .join('');
}

function siteNav(current, lang = DEFAULT_LANG, path = null) {
  const t = strings(lang);
  const navItems = PAGES.filter((p) => p.nav);
  const bar = navItems.map((p) => navLink(p, current, lang)).join('');
  // The mobile "Sections" disclosure also carries Contribute and the language
  // switch: the desktop CTA and language link are hidden on phones, so every
  // destination lives in one menu there.
  const menu = navItems
    .concat(PAGES.filter((p) => p.id === 'contribute'))
    .map((p) => navLink(p, current, lang))
    .join('')
    .concat(languageLinks(lang, path));
  return `<nav class="sitenav" aria-label="${t.navAria}"><div class="sitenav-bar">${bar}</div><details class="sitenav-menu"><summary class="sitenav-summary">${t.sections}</summary><div class="sitenav-list">${menu}</div></details></nav>`;
}

/**
 * The primary call to action — "Contribute" — pinned to the right of the top bar,
 * the slot the left-grouped nav deliberately leaves open. LexGrade is an open,
 * collaborative standard; this is the door in. Marked aria-current on /contribute.
 *
 * @param {string} current the active page id
 * @returns {string}
 */
function siteCta(current, lang = DEFAULT_LANG) {
  return `<a class="cta" href="${localPath(lang, '/contribute')}"${current === 'contribute' ? ' aria-current="page"' : ''}>${strings(lang).pages.contribute.label}</a>`;
}

/**
 * The shared full-width top bar: masthead + nav grouped left, the Contribute CTA
 * pinned right. ONE source for every page (two-column and solo), so the site
 * chrome can't drift between shells.
 *
 * @param {string} current the active page id
 * @returns {string}
 */
function topbar(current, lang = DEFAULT_LANG, path = null) {
  return `<header class="topbar">
${siteMasthead(lang)}
${current ? siteNav(current, lang, path) : ''}
${languageLinks(lang, path, 'lang-switch')}
${siteCta(current, lang)}
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
function siteFooter(current, lang = DEFAULT_LANG, path = null) {
  const t = strings(lang);
  const links = PAGES.filter((p) => p.footer).map((p) => navLink(p, current, lang)).join('');
  const others = languageLinks(lang, path);
  return `<footer class="site-footer">
  <nav class="site-footer__nav" aria-label="${t.secondaryAria}">${links}<a href="${REPO_URL}">GitHub</a>${others}</nav>
  <p class="site-footer__meta">${t.footerMeta}</p>
  <p class="site-footer__note">${t.footerNote}</p>${t.translationNote ? `\n  <p class="site-footer__note">${t.translationNote}</p>` : ''}
</footer>`;
}

// Social previews show ~125 characters before truncating mid-word, so the
// og/twitter copy is clipped here; <meta name="description"> keeps the full text
// for search engines, which show more.
const PREVIEW_MAX = 125;

/**
 * Clip a description for a social preview: whole sentences while they fit,
 * else the last whole word plus an ellipsis.
 *
 * @param {string} text
 * @returns {string}
 */
export function previewText(text, max = PREVIEW_MAX) {
  const str = String(text ?? '').trim();
  if (str.length <= max) return str;
  const head = str.slice(0, max);
  const sentenceEnd = head.lastIndexOf('. ');
  if (sentenceEnd >= max / 2) return head.slice(0, sentenceEnd + 1);
  const wordEnd = str.slice(0, max).lastIndexOf(' ');
  return `${str.slice(0, wordEnd).replace(/[\s,;:—–-]+$/, '')}…`;
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
  const preview = previewText(description);
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
<meta property="og:description" content="${escapeHtml(preview)}">
<meta property="og:url" content="${escapeHtml(url)}">${imageTags}
<meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(preview)}">`;
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
function spellNumber(n, lang = DEFAULT_LANG) {
  return strings(lang).numberWords[n] ?? String(n);
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

function renderCriterion(c, lang = DEFAULT_LANG) {
  const t = strings(lang).standard;
  const a = anchor(c.id);
  const deduction =
    c.deduction !== undefined && c.deduction !== null
      ? `<p class="deduction">${t.deduction(escapeHtml(String(c.deduction)))}${
          c.deduction_note ? ` (${escapeHtml(String(c.deduction_note))})` : ''
        }</p>`
      : '';
  const addedIn = c.added_in ? ` <span class="added-in">${t.addedIn(escapeHtml(String(c.added_in)))}</span>` : '';
  const source = c.source
    ? `<p class="source">${t.source}${escapeHtml(String(c.source))}${addedIn}</p>`
    : addedIn
      ? `<p class="source">${addedIn.trim()}</p>`
      : '';

  return `<section class="criterion" id="${a}" aria-labelledby="${a}-h">
    <h3 id="${a}-h"><span class="num">${escapeHtml(sectionNumber(c.id))}</span> ${escapeHtml(c.title)} <a class="self-link" href="#${a}" aria-label="${t.permalinkTo}${escapeHtml(c.id)}">${escapeHtml(c.id)}</a></h3>
    <p class="requirement">${escapeHtml(String(c.requirement ?? '').trim())}</p>
    ${deduction}
    ${source}
  </section>`;
}

function renderPrinciple(p, criteria, lang = DEFAULT_LANG) {
  const t = strings(lang).standard;
  const id = String(p.id).toLowerCase();
  const role = t.roles[p.role] ?? String(p.role);
  // Colour is always paired with the role text — never colour-only (WCAG 1.4.1).
  const badge = `<span class="badge badge--${escapeHtml(p.role)}">${escapeHtml(role)}${
    p.weight > 0 ? ` · ${escapeHtml(String(p.weight))}%` : ''
  }</span>`;
  const note = p.note ? `<p class="note">${escapeHtml(String(p.note).trim())}</p>` : '';

  // A principle with no graded criteria says so once: its own note when it has
  // one, otherwise this fallback line.
  const body =
    criteria.length === 0
      ? p.note
        ? ''
        : `<p class="precondition">${
          p.id === 'P1'
            ? t.p1Fallback
            : t.noCriteria
          }</p>`
      : `<div class="criteria">\n${criteria.map((c) => renderCriterion(c, lang)).join('\n')}\n</div>`;

  return `<section class="principle" id="${id}" aria-labelledby="${id}-h">
  <h2 id="${id}-h"><span class="num">${escapeHtml(sectionNumber(p.id))}.</span> ${escapeHtml(p.title)} ${badge}</h2>
  ${note}
  ${body}
</section>`;
}

function renderConformanceLevels(levels, lang = DEFAULT_LANG) {
  if (!levels.length) {
    return '';
  }
  const t = strings(lang).standard;

  const cards = levels
    .map((l) => {
      const rows = [
        l.composite_band ? [t.levelRows.composite, l.composite_band] : null,
        l.gate ? [t.levelRows.gate, l.gate] : null,
        l.precondition ? [t.levelRows.precondition, l.precondition] : null,
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
  <h2 id="conformance-levels-h">${t.levelsHeading}</h2>
  <p class="note">${t.levelsNote}</p>
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

function renderComposite(c, lang = DEFAULT_LANG) {
  if (!c || Object.keys(c).length === 0) {
    return '';
  }
  const t = strings(lang).standard;

  const cap = c.cap !== undefined ? `<p class="meta">${t.cap(escapeHtml(String(c.cap)))}</p>` : '';
  const formula = c.formula ? `<pre class="formula">${escapeHtml(String(c.formula).trim())}</pre>` : '';
  const steps = Array.isArray(c.order_of_operations)
    ? `<ol class="steps">${c.order_of_operations.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>`
    : '';
  const weights = c.weights
    ? dataTable({
        caption: t.weightsCaption(c.weighted_points_total ?? ''),
        headers: t.weightsHeaders,
        rows: Object.entries(c.weights).map(([k, v]) => [k, `${v}%`]),
      })
    : '';
  const grades = Array.isArray(c.grade_scale)
    ? dataTable({
        caption: t.gradeCaption,
        headers: t.gradeHeaders,
        rows: c.grade_scale.map((g) => [g.letter, g.range, g.conformance]),
      })
    : '';

  return `<section class="principle" id="composite-scoring" aria-labelledby="composite-scoring-h">
  <h2 id="composite-scoring-h">${t.compositeHeading}</h2>
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
function renderConformanceClaim(claim, demotions = [], lang = DEFAULT_LANG) {
  if (!claim && (!demotions || demotions.length === 0)) {
    return '';
  }
  const t = strings(lang).standard;

  const elements = Array.isArray(claim?.required_elements)
    ? `<p>${t.wellFormed}</p>
    <ol class="claim-elements">${claim.required_elements.map((e) => `<li>${escapeHtml(e)}</li>`).join('')}</ol>`
    : '';

  const asserts = claim?.asserts
    ? `<p class="claim-asserts">${t.asserts} ${escapeHtml(String(claim.asserts).trim())}</p>`
    : '';

  // The integrity boundary — the disclaimer a judge / ethics reviewer checks first.
  const disclaims = claim?.does_not_assert
    ? `<p class="claim-disclaims">${t.disclaims} ${escapeHtml(String(claim.does_not_assert).trim())}</p>`
    : '';

  const demotionTable = demotions.length
    ? dataTable({
        id: 'automatic-demotions',
        caption: t.demotionCaption,
        headers: t.demotionHeaders,
        rows: demotions.map((d) => [d.condition, d.result]),
      })
    : '';

  return `<section class="principle" id="conformance-claims" aria-labelledby="conformance-claims-h">
  <h2 id="conformance-claims-h">${t.claimsHeading}</h2>
  <p class="note">${t.claimsNote}</p>
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
export function renderStandard(standard, { lang = DEFAULT_LANG } = {}) {
  const t = strings(lang).standard;
  const { version, scope, license, principles, criteria, byPrinciple } = standard;
  const conformanceLevels = standard.conformanceLevels ?? [];
  const conformanceClaim = standard.conformanceClaim ?? null;
  const automaticDemotions = standard.automaticDemotions ?? [];
  const composite = standard.composite ?? {};
  const title = `${t.name} v${version}`;
  // The citation names the English edition in every language: that is the text
  // that governs, and the form the Standard itself prescribes.
  const citeTitle = `LexGrade Standard v${version}`;
  const critCount = criteria.length;
  // Counts derive from the source data, never hardcoded — the prose can't drift
  // from the catalog. spellNumber keeps the principle count in words (the spec's
  // voice); the larger criteria count stays a numeral.
  const principleWord = spellNumber(principles.length, lang);
  const description = t.description(title, capitalize(principleWord), critCount, license);

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

  const sections = principles.map((p) => renderPrinciple(p, byPrinciple.get(p.id) ?? [], lang)).join('\n');

  const hasClaim = Boolean(conformanceClaim) || automaticDemotions.length > 0;
  const appendixToc = [
    conformanceLevels.length ? `    <li><a href="#conformance-levels">${t.levelsHeading}</a></li>` : '',
    hasClaim ? `    <li><a href="#conformance-claims">${t.claimsHeading}</a></li>` : '',
    Object.keys(composite).length ? `    <li><a href="#composite-scoring">${t.compositeHeading}</a></li>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const appendix = [
    renderConformanceLevels(conformanceLevels, lang),
    renderConformanceClaim(conformanceClaim, automaticDemotions, lang),
    renderComposite(composite, lang),
  ]
    .filter(Boolean)
    .join('\n');

  const apiUrl = lang === DEFAULT_LANG ? API_URL : `/api/v1/standard.${lang}.json`;
  const llmsUrl = localPath(lang, '/llms-full.txt');
  const copyAttrs = t.copy
    ? ` data-copy="${escapeHtml(t.copy.copy)}" data-copied="${escapeHtml(t.copy.copied)}" data-copy-label="${escapeHtml(t.copy.label)}"`
    : '';
  const body = `${docHeader({
    title: `${t.name} <span class="version">v${escapeHtml(version)}</span>`,
    subhead: t.subhead(escapeHtml(scope), principleWord, escapeHtml(String(critCount))),
  })}

  <details class="panel sotd" open>
    <summary><span class="sotd-chevron" aria-hidden="true"></span>${t.sotdSummary}</summary>
    <dl>
      <dt>${t.thisVersion}</dt><dd>${t.currentEdition(escapeHtml(version))}</dd>
      <dt>${t.machineReadable}</dt><dd><a href="${apiUrl}">${apiUrl}</a> · <a href="${llmsUrl}">${llmsUrl}</a></dd>
      <dt>${t.sourceRepo}</dt><dd><a href="${REPO_URL}">${escapeHtml(REPO_URL.replace(/^https?:\/\//, ''))}</a></dd>
      <dt>${t.calibratedTo}</dt><dd>${t.calibratedToValue}</dd>${
        standard.citationsVerified
          ? `\n      <dt>${t.citationsVerified}</dt><dd>${escapeHtml(standard.citationsVerified)} ${t.citationsVerifiedNote}</dd>`
          : ''
      }
      <dt>${t.license}</dt><dd>${escapeHtml(license)} ${t.licenseNote}</dd>
      <dt>${t.citeAs}</dt><dd><span id="lg-cite"${lang === DEFAULT_LANG ? '' : ' lang="en"'}${copyAttrs}>&ldquo;${escapeHtml(citeTitle)}, LexGrade (lexgrade.org), ${escapeHtml(license)}.&rdquo;</span></dd>
    </dl>
    <p>${t.sotdNote}</p>
  </details>

  <section class="abstract" aria-labelledby="abstract-h">
    <h2 id="abstract-h">${t.abstractHeading}</h2>
    <p>${t.abstract(principleWord, escapeHtml(String(critCount)), escapeHtml(scope))}</p>
  </section>

${sections}
${appendix}

  <footer class="doc-footer">
    <p class="gh-links">${t.footer(`${REPO_URL}/edit/main/${escapeHtml(standard.editPath ?? 'commons/standard/lgs-criteria.yaml')}`, `${REPO_URL}/issues/new`)}</p>
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
    image: ogImage('standard', lang),
    toc: appendixToc ? `${toc}\n${appendixToc}` : toc,
    lang,
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
export function renderHome({ standardVersion, principleCount, criteriaCount, techniqueVersion, techniqueCount, lang = DEFAULT_LANG }) {
  if (lang === 'es') {
    const page = PAGES_ES.home({
      standardVersion: escapeHtml(standardVersion),
      principleCount: escapeHtml(String(principleCount)),
      criteriaCount: escapeHtml(String(criteriaCount)),
      techniqueVersion: escapeHtml(techniqueVersion),
      techniqueCount: escapeHtml(String(techniqueCount)),
    });
    return documentShell({ title: page.docTitle, description: page.description, bodyHtml: page.body, canonical: '/', current: 'home', image: ogImage('home', lang), lang });
  }
  const body = `  <header class="home-hero">
    <h1 class="home-title">An open standard for scoring legal motions.</h1>
    <p class="subhead">Its principles, weights, and penalties are published in full.</p>
    <p class="home-check">Filing without a lawyer? <a href="/check">Check your own motion <span aria-hidden="true">→</span></a> LexGrade is not legal advice.</p>
    <p class="callout home-evidence">Candor toward the court comes first. A single fabricated citation costs 20 points and makes the motion Deficient, whatever its score.</p>
  </header>
  <nav class="home-cards" aria-label="Standard and Technique Register">
    <a class="home-card" href="/standard">
      <h2 class="home-card__title">The LexGrade Standard <span class="home-card__v">v${escapeHtml(standardVersion)}</span></h2>
      <p class="home-card__desc">${escapeHtml(String(principleCount))} principles and ${escapeHtml(String(criteriaCount))} graded criteria, each citable on its own.</p>
      <span class="home-card__cta">Read the Standard <span aria-hidden="true">→</span></span>
    </a>
    <a class="home-card" href="/techniques">
      <h2 class="home-card__title">Technique Register <span class="home-card__v">v${escapeHtml(techniqueVersion)}</span></h2>
      <p class="home-card__desc">${escapeHtml(String(techniqueCount))} named advocacy techniques. Optional: they never change the score.</p>
      <span class="home-card__cta">Browse techniques <span aria-hidden="true">→</span></span>
    </a>
  </nav>
  <p class="home-note">The criteria come from New York State and federal motion practice. <a href="/about">About LexGrade <span aria-hidden="true">→</span></a></p>
  <aside class="home-invite" aria-label="Contribute">
    <p class="home-invite__lead">If you litigate, help shape the Standard.</p>
    <a class="home-invite__link" href="/contribute">Contribute to LexGrade <span aria-hidden="true">→</span></a>
  </aside>`;
  return documentShell({
    title: 'LexGrade — Open scoring for legal drafting quality',
    description:
      'An open standard for scoring legal motions: the principles, weights, and penalties, published in full. CC-BY-SA 4.0.',
    bodyHtml: body,
    canonical: '/',
    current: 'home',
    image: '/og/home.png',
  });
}

/**
 * Render the /about page — the project's provenance. LexGrade's criteria were
 * drawn from motion practice in the New York State and federal courts, not a
 * style guide; this page states that grounding in an institutional voice while
 * reinforcing the same limit the Standard carries (no authority, not legal
 * advice). The narrative is site-specific copy (like the 404), not part of the
 * CC-BY-SA commons, so it lives here rather than in a markdown source. The
 * standard is intentionally described without reference to any individual.
 *
 * @returns {string}
 */
export function renderAbout({ lang = DEFAULT_LANG } = {}) {
  if (lang === 'es') return translatedPage('about', PAGES_ES.about({ repo: REPO_URL }), lang);
  const body = `${docHeader({
    title: 'About LexGrade',
    subhead: 'An open scoring standard for legal drafting.',
  })}
  <section class="prose" aria-label="About LexGrade">
    <p>LexGrade&#39;s criteria come from motion practice in the New York State and federal courts. The premise is that a filing&#39;s job is to compel action.</p>
    <h2>Who it&#39;s for</h2>
    <p>LexGrade is for anyone drafting a motion, including people filing without a lawyer. The Standard sets out, in a form anyone can check, what separates a motion a court can act on from one it cannot. The Technique Register names what experienced advocates do by instinct. Neither promises to win cases.</p>
    <h2>Status</h2>
    <p>The Standard is calibrated to New York State Supreme Court motion practice. Its criteria and weights have not been independently validated. Legal citations are verified against official sources, with the date shown on the Standard. The method builds on the scholarship credited in <a href="/references">References</a>.</p>
    <h2>Limits</h2>
    <p>LexGrade is <strong>not</strong> promulgated by any court, bar, or government body, it confers no authority, and nothing here is legal advice. Verify every legal citation independently before filing, including those in the Standard.</p>
    <p>The <a href="/standard">Standard</a> and <a href="/techniques">Technique Register</a> are licensed CC-BY-SA 4.0 and governed in the open. Anyone can use, test, or <a href="/contribute">improve</a> them.</p>
    <h2>Corrections</h2>
    <p>To report a changed rule, a wrong citation, or an out-of-date fact, <a href="${REPO_URL}/issues/new?template=correction.yml">open a correction</a> or email <a href="mailto:hello@lexgrade.org?subject=Correction">hello@lexgrade.org</a>. Reports go to the LexGrade Working Group and are acknowledged within 14 days. Errors of fact are corrected in the current edition and logged in the changelog. Changes to what a criterion requires go through the public RFC process. See the <a href="${REPO_URL}/blob/main/commons/GOVERNANCE.md#corrections">corrections policy</a>.</p>
  </section>`;
  return documentShell({
    title: 'About — LexGrade',
    description:
      'LexGrade is an open scoring standard for legal drafting, drawn from motion practice in New York State and federal courts. CC-BY-SA 4.0.',
    bodyHtml: body,
    canonical: '/about',
    current: 'about',
    image: '/og/about.png',
  });
}

/**
 * Render the /check page — the plain-language entry point for people filing
 * without a lawyer (the printed poster's QR code lands on the homepage, which
 * links here). The quick-start table is the Standard's own §9, rendered from
 * the markdown at build time so it cannot drift; only the framing around it is
 * site copy. Audience, not authorship: the page speaks to self-represented
 * readers and never describes who wrote the Standard.
 *
 * @param {{version: string, quickStartHtml: string}} opts
 * @returns {string}
 */
export function renderCheck({ version, quickStartHtml, lang = DEFAULT_LANG }) {
  // Each principle in the §9 table links to its section of the Standard, so
  // "take them one at a time" is one click, not a hunt.
  const linked = stripScripts(quickStartHtml).replace(
    /<td>P([1-8])\. ([^<]+)<\/td>/g,
    `<td><a href="${localPath(lang, '/standard')}#p$1">P$1.&nbsp;$2</a></td>`,
  );
  if (lang === 'es') return translatedPage('check', PAGES_ES.check({ version: escapeHtml(version), quickStartHtml: linked }), lang);
  const body = `${docHeader({
    title: 'Checking your own motion',
    subhead: 'For anyone filing without a lawyer.',
  })}
  <section class="prose" aria-label="How to check a motion">
    <h2>Before you file</h2>
    <p>A motion asks the judge to decide or order something in your case.</p>
    <ol>
      <li>Follow the court&#39;s filing rules first, such as the notice of motion and proof of service. LexGrade doesn&#39;t cover them.</li>
      <li>Check your draft against each principle below. Each links to its requirements in the Standard.</li>
      <li>Look up every case and statute you cite and confirm it says what you claim. AI tools invent cases, and courts have sanctioned people for citing them.</li>
    </ol>
    <h2>The eight principles</h2>
    <div class="quick-start wide-tables">
    <p>From §9 of LexGrade Standard v${escapeHtml(version)}</p>
${linked}
    </div>
    <h2>What it can&#39;t do</h2>
    <p>LexGrade is not legal advice and can&#39;t predict a ruling. It was written for New&nbsp;York State Supreme Court; other courts&#39; rules differ.</p>
    <h2>Something unclear?</h2>
    <p>Email <a href="mailto:contribute@lexgrade.org?subject=Unclear">contribute@lexgrade.org</a> and say what.</p>
  </section>`;
  return documentShell({
    title: 'Checking your own motion — LexGrade',
    description:
      'How to check a motion against the LexGrade Standard, for anyone filing without a lawyer. Not legal advice.',
    bodyHtml: body,
    canonical: '/check',
    current: 'check',
    image: '/og/check.png',
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
export function renderContribute({ lang = DEFAULT_LANG } = {}) {
  if (lang === 'es') return translatedPage('contribute', PAGES_ES.contribute({ repo: REPO_URL }), lang);
  const body = `${docHeader({
    title: 'Help build the standard',
    subhead: 'How to propose changes to the Standard.',
  })}
  <section class="prose" aria-label="How to contribute">
    <h2>Where you come in</h2>
    <ul>
      <li><strong>Propose or challenge a criterion.</strong> If one is wrong, incomplete, or weighted poorly, make the case.</li>
      <li><strong>Calibrate a jurisdiction.</strong> Help extend the Standard beyond New York State Supreme Court motion practice.</li>
      <li><strong>Name a technique.</strong> If you rely on one the Technique Register doesn&#39;t name, add it.</li>
    </ul>
    <h2>How changes happen</h2>
    <p>Substantive changes start as a public <code>rfc:</code> proposal, are accepted by rough consensus, and ship in a versioned release that credits contributors.</p>
    <h2>Two ways to start</h2>
    <p><strong>On GitHub.</strong> Open an <a href="${REPO_URL}/issues/new">rfc: issue</a>, or read the <a href="${REPO_URL}/blob/main/.github/CONTRIBUTING.md">contribution guide</a>.</p>
    <p><strong>By email.</strong> Send <a href="mailto:contribute@lexgrade.org">contribute@lexgrade.org</a> a rough note. It will be turned into a proposal, with credit.</p>
    <p class="note">LexGrade confers no authority and nothing here is legal advice. Contributing creates no attorney–client relationship and no professional obligation.</p>
  </section>`;
  return documentShell({
    title: 'Contribute — LexGrade',
    description:
      'Help shape LexGrade: propose criteria, calibrate new jurisdictions, and name techniques. An open standard, CC-BY-SA 4.0.',
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
export function renderReferences({ lang = DEFAULT_LANG } = {}) {
  if (lang === 'es') return translatedPage('references', PAGES_ES.references(), lang);
  const body = `${docHeader({
    title: 'Sources &amp; influences',
    subhead: 'The criteria and weights are LexGrade&#39;s own. The method builds on the work credited here.',
  })}
  <section class="prose" aria-label="Sources and influences">
    <h2>Scholarship</h2>
    <p>LexGrade&#39;s rubric method (weighted components, capped point values, and narrative performance bands) adapts legal-writing assessment scholarship to motion practice, in particular:</p>
    <ul>
      <li>Jessica Clark &amp; Christy DeSanctis, <em>Toward a Unified Grading Vocabulary: Using Rubrics in Legal Writing Courses</em>, 63 J. Legal Educ. 3 (2013).</li>
    </ul>
    <p>No rubric text or appendix from the cited work is reproduced here; LexGrade states its criteria in its own words.</p>
    <h2>Empirical grounding</h2>
    <p>The hallucination figures in the Standard&#39;s ethics-gate rationale come from:</p>
    <ul>
      <li>Matthew Dahl, Varun Magesh, Mirac Suzgun &amp; Daniel E. Ho, <em>Large Legal Fictions: Profiling Legal Hallucinations in Large Language Models</em>, 16 J. Legal Analysis 64 (2024), <a href="https://doi.org/10.1093/jla/laae003">doi:10.1093/jla/laae003</a>. The study measured hallucination rates in model answers to verifiable questions about federal court cases: 58% for ChatGPT-4, up to 88% for Llama 2.</li>
    </ul>
    <h2>Calibration authority</h2>
    <p>The calibration is measured against the New York Civil Practice Law and Rules (CPLR) and the Uniform Civil Rules for the Supreme and County Courts (22 NYCRR Part 202).</p>
    <p class="note">Building on a source does not imply that source endorses LexGrade. LexGrade confers no authority, and nothing here is legal advice. To report a misused or uncredited source, see <a href="/contribute">Contribute</a>.</p>
  </section>`;
  return documentShell({
    title: 'References — LexGrade',
    description:
      'The scholarship LexGrade\'s rubric method builds on, and the legal authority it calibrates against. CC-BY-SA 4.0.',
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
export function renderLlmsFull({ version, documents, lang = DEFAULT_LANG }) {
  if (lang === 'es') {
    const header = [
      '# LexGrade — Metodología completa (traducción al español)',
      '',
      '> La metodología abierta completa de LexGrade, en traducción, concatenada para agentes.',
      '> Esta es una traducción. El texto en inglés es el que rige: https://lexgrade.org/llms-full.txt',
      '> Licencia CC-BY-SA 4.0. (C) 2026 LexGrade.',
      `> Cítese como: "LexGrade Standard v${version}, LexGrade (lexgrade.org), CC-BY-SA 4.0."`,
      `> Fuente canónica y navegable: ${SITE_ORIGIN}/es/standard`,
      '',
      'Documentos a continuación, en orden: el Estándar LexGrade y el Registro de Técnicas.',
    ].join('\n');
    return `${header}\n\n---\n\n${documents.join('\n\n---\n\n')}\n`;
  }
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
function githubFooter(editPath, lang = DEFAULT_LANG) {
  if (!editPath) {
    return '';
  }
  return `  <footer class="doc-footer">
    <p class="gh-links">${strings(lang).foundError(`${REPO_URL}/edit/main/${escapeHtml(editPath)}`, `${REPO_URL}/issues/new`)}</p>
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
function documentShell({ title, description, bodyHtml, canonical = '/standard', current, image, editPath, noindex = false, toc = null, lang = DEFAULT_LANG }) {
  // Each page declares its OWN canonical URL — a shared one would tell search
  // engines every solo page is a duplicate of /standard. `canonical` is the
  // language-neutral path ("/check"); the page's own URL adds the language
  // prefix. A noindex page (the 404) carries no canonical and no alternates.
  const canonicalUrl = `${SITE_ORIGIN}${localPath(lang, canonical)}`;
  const alternates = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${escapeHtml(`${SITE_ORIGIN}${localPath(l, canonical)}`)}">`)
    .concat(`<link rel="alternate" hreflang="x-default" href="${escapeHtml(`${SITE_ORIGIN}${canonical}`)}">`)
    .join('\n');
  const indexTag = noindex
    ? '<meta name="robots" content="noindex">'
    : `<link rel="canonical" href="${escapeHtml(canonicalUrl)}">\n${alternates}`;
  return `<!doctype html>
<html lang="${lang}">
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
<a class="skip-link" href="#main">${strings(lang).skip}</a>
${
  toc
    ? `${topbar(current, lang, noindex ? null : canonical)}
<div class="layout">
${tocSidebar(toc, lang)}
<main id="main" tabindex="-1">
${bodyHtml}
${githubFooter(editPath, lang)}
</main>
</div>`
    : `<div class="layout layout--solo">
${topbar(current, lang, noindex ? null : canonical)}
<main id="main" tabindex="-1">
${bodyHtml}
${githubFooter(editPath, lang)}
</main>
</div>`
}
${siteFooter(current, lang, noindex ? null : canonical)}
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
 * source markdown file ever contains raw HTML. Defensive — the commons markdown
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
export function renderTechniques({ version, techniques = [], md = (s) => s, editPath, lang = DEFAULT_LANG }) {
  const t = strings(lang).techniques;
  const base = localPath(lang, '/techniques');
  // Render a one-line definition inline (strip the wrapping <p> markdown adds).
  const inline = (raw) => stripScripts(md(raw)).replace(/^\s*<p>([\s\S]*?)<\/p>\s*$/, '$1');

  // Group by category in first-appearance order (no hardcoded category list — a
  // new category appears from the data alone). The full register text is NOT
  // dumped here; it lives on each technique's own page, in /api/v1/techniques.json,
  // and in /llms-full.txt. This page is a scannable, single-column human index.
  const order = [];
  const byCategory = new Map();
  for (const tech of techniques) {
    const cat = tech.category || t.uncategorized;
    if (!byCategory.has(cat)) {
      byCategory.set(cat, []);
      order.push(cat);
    }
    byCategory.get(cat).push(tech);
  }

  const groups = order
    .map((cat) => {
      const rows = byCategory
        .get(cat)
        .map(
          (tech) => `      <li class="tech-row"><a href="${base}/${escapeHtml(tech.slug)}">
        <span class="tech-row__num">${escapeHtml(String(tech.number))}</span>
        <span class="tech-row__body">
          <span class="tech-row__name">${escapeHtml(tech.name)}</span>${
            tech.definition ? `\n          <span class="tech-row__def">${inline(tech.definition)}</span>` : ''
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
    title: `${t.heading} <span class="version">v${escapeHtml(version)}</span>`,
    subhead: t.subhead(
      escapeHtml(String(techniques.length)),
      lang === DEFAULT_LANG ? '/api/v1/techniques.json' : `/api/v1/techniques.${lang}.json`,
      localPath(lang, '/llms-full.txt'),
    ),
  })}
  <section class="callout tech-ethos" aria-label="${t.calloutAria}">
    ${t.callout}
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
    title: t.docTitle(version),
    description: t.description(techniques.length),
    bodyHtml: body,
    canonical: '/techniques',
    current: 'techniques',
    image: ogImage('techniques', lang),
    editPath,
    toc,
    lang,
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
export function renderTechnique({ technique, md = (s) => s, editPath, lang = DEFAULT_LANG }) {
  const t = strings(lang).techniques;
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
    <h2 class="sr-only">${t.definition}</h2>
${category ? `    <p class="def__pos">${t.partOfSpeech(escapeHtml(category), tier ? escapeHtml(tier) : '')}</p>\n` : ''}    <div class="field__text def__text">${stripScripts(md(definition))}</div>
  </div>`
    : '';

  // Example (correct) and Anti-pattern (incorrect) — single-column exemplar
  // quotes, distinguished by the accent (anti-pattern carries the maroon rule).
  const example = fields.example
    ? `  <div class="example">
    <h2 class="example__label"><span aria-hidden="true">✓</span> ${t.example}</h2>
    ${richText(fields.example)}
  </div>`
    : '';
  const anti = fields.antiPattern
    ? `  <div class="antipattern">
    <h2 class="antipattern__label"><span aria-hidden="true">✗</span> ${t.antiPattern}</h2>
    ${richText(fields.antiPattern)}
  </div>`
    : '';

  const reqs = fields.requirements ? field(t.requirements, richText(fields.requirements)) : '';
  const why = fields.why ? field(fields.why.label, richText(fields.why.text), true) : '';
  const distinctions =
    fields.distinctions && fields.distinctions.length
      ? field(
          t.howItDiffers,
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
  <p class="prose"><a href="${localPath(lang, '/techniques')}">${t.all}</a></p>`;

  return documentShell({
    title: t.pageTitle(name),
    description: definition ? `${name}: ${definition}` : t.fallbackDescription(name),
    bodyHtml: body,
    canonical: `/techniques/${slug}`,
    current: 'techniques',
    image: ogImage(`technique-${slug}`, lang),
    editPath,
    lang,
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
