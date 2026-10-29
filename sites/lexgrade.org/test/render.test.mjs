// SPDX-License-Identifier: AGPL-3.0-only
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { escapeHtml, LOGO_SVG, renderAbout, renderContribute, renderHome, renderLlmsFull, renderNotFound, renderRedirect, renderReferences, renderStandard, renderTechnique, renderTechniques, stripScripts } from '../src/render.mjs';
import { cspScriptSrc } from '../src/lib/csp.mjs';
import { toHtml } from '../src/markdown.mjs';

// render.mjs reads LEXGRADE_REPO_URL at module load (default: the canonical
// repo). GitHub-link assertions track the same value rather than pinning a host,
// so the suite passes whatever LEXGRADE_REPO_URL the build is configured with.
const EXPECTED_REPO = process.env.LEXGRADE_REPO_URL || 'https://github.com/LexGrade/standard';

// A minimal stand-in for loadStandard()'s shape — enough to exercise every
// render branch (precondition principle, weighted, gate, criterion deduction).
const fixture = {
  version: '1.0',
  scope: 'New York State Supreme Court motion practice',
  license: 'CC-BY-SA-4.0',
  principles: [
    { id: 'P1', title: 'Procedural Integrity', role: 'precondition', weight: 0, note: 'Precondition.' },
    { id: 'P2', title: 'Problem Diagnosis', role: 'weighted', weight: 10 },
    { id: 'P7', title: 'Ethics and Candor', role: 'gate', weight: 0 },
  ],
  criteria: [
    { id: 'LGS 2.1', principle: 'P2', title: 'Question Characterization', requirement: 'The motion correctly characterizes the dispute.' },
    { id: 'LGS 7.1', principle: 'P7', title: 'Candor', requirement: 'No misrepresentation.', deduction: 10, deduction_note: 'per instance' },
  ],
  byPrinciple: new Map([
    ['P1', []],
    ['P2', [{ id: 'LGS 2.1', principle: 'P2', title: 'Question Characterization', requirement: 'The motion correctly characterizes the dispute.' }]],
    ['P7', [{ id: 'LGS 7.1', principle: 'P7', title: 'Candor', requirement: 'No misrepresentation.', deduction: 10, deduction_note: 'per instance' }]],
  ]),
  conformanceLevels: [
    { id: 'expert', label: 'Expert', composite_band: '90 or above', gate: 'P7 passes', descriptor: 'Highest bar', note: 'All categories.' },
    { id: 'deficient', label: 'Deficient', descriptor: 'Risk', note: 'Wrong vehicle.' },
  ],
  conformanceClaim: {
    required_elements: ['Level claimed', 'Version (LexGrade Standard v1.0)', 'Composite score and date'],
    asserts: 'That the composite fell in the claimed band and the gate held.',
    does_not_assert: 'That the filing is procedurally proper, that every citation was verified, or that the motion will be granted.',
  },
  automaticDemotions: [
    { condition: 'Any hallucinated citation', result: 'Deficient (regardless of composite score)' },
    { condition: 'Wrong procedural vehicle', result: 'Cannot exceed Competent' },
  ],
  composite: {
    cap: 98,
    formula: 'Composite = min(98, max(0, adjusted))',
    order_of_operations: ['Grade each principle 0–100.', 'Sum weighted points → /80.'],
    weights: { P2: 10, P3: 20 },
    weighted_points_total: 80,
    grade_scale: [{ letter: 'A+', range: '98', conformance: 'expert' }],
  },
};

test('renders the standard title, version, scope, and license', () => {
  const html = renderStandard(fixture);
  assert.match(html, /LexGrade Standard/);
  assert.match(html, /v1\.0/);
  assert.match(html, /CC-BY-SA-4\.0/);
  assert.match(html, /New York State Supreme Court/);
});

test('PROGRESSIVE ENHANCEMENT — the standard page is complete without JS; any script is enhancement-only', () => {
  const html = renderStandard(fixture);
  // The full spec is server-rendered: a no-JS reader gets every section, the real
  // TOC links, the cite text. JS is never required to read or navigate the Standard.
  assert.match(html, /LexGrade Standard/);
  assert.match(html, /id="p2"/); // sections are static
  assert.match(html, /id="conformance-claims"/);
  assert.match(html, /<nav class="toc"/); // the TOC is real anchor links, not JS-built
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="lg-cite"/); // citation text is present (the Copy button is the enhancement)
  // The enhancement is a SINGLE inline script, with no inline handlers or javascript: URLs.
  assert.equal((html.match(/<script\b/gi) || []).length, 1, 'exactly one enhancement script');
  assert.ok(!/<[a-z][^>]*\son\w+\s*=/i.test(html), 'no inline on* event handlers');
  assert.ok(!/javascript:/i.test(html), 'no javascript: URLs');
});

test('CSP script-src hashes exactly the inline script(s) the page ships', () => {
  const html = renderStandard(fixture);
  const src = cspScriptSrc(html);
  // /standard ships one inline enhancement script → one well-formed sha256 source.
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.match(src, /^'sha256-[A-Za-z0-9+/]+={0,2}'$/);
  assert.equal(src, cspScriptSrc(html), 'deterministic for the same input');
  // A script-free page yields 'none' (every non-spec page).
  assert.equal(cspScriptSrc('<!doctype html><p>no script here</p>'), "'none'");
  // Two scripts → two space-separated hashes (future-proof, not silently dropped).
  assert.equal(cspScriptSrc('<script>a()</script><script>b()</script>').split(' ').length, 2);
});

test('renders each principle as a numbered section with canonical criterion anchors', () => {
  const html = renderStandard(fixture);
  assert.match(html, /id="p2"/);
  assert.match(html, /id="p7"/);
  assert.match(html, /id="lgs-2\.1"/); // canonical criterion anchor format
  assert.match(html, /Question Characterization/);
  assert.match(html, /Problem Diagnosis/);
});

test('pairs every status colour with a text label and surfaces deductions', () => {
  const html = renderStandard(fixture);
  assert.match(html, /Precondition/); // role text, never colour-only
  assert.match(html, /Weighted/);
  assert.match(html, /Gate/);
  assert.match(html, /Deduction/); // gate criterion's deduction is shown
});

test('renders the conformance-levels and composite-scoring sections from the catalog data', () => {
  const html = renderStandard(fixture);
  // Conformance levels — labelled section + each level, deep-linkable.
  assert.match(html, /id="conformance-levels"/);
  assert.match(html, /Conformance levels/);
  assert.match(html, /Expert/);
  assert.match(html, /Deficient/);
  // Composite scoring — formula, a weight, and a grade letter.
  assert.match(html, /id="composite-scoring"/);
  assert.match(html, /Composite scoring/);
  assert.match(html, /Composite = min\(98/);
  assert.match(html, /<table class="data"/);
  assert.match(html, /A\+/);
  // Both appear in the table of contents.
  assert.match(html, /href="#conformance-levels"/);
  assert.match(html, /href="#composite-scoring"/);
});

test('surfaces the conformance-claim limits and the automatic-demotion rules from the catalog', () => {
  const html = renderStandard(fixture);
  assert.match(html, /id="conformance-claims"/);
  assert.match(html, /Conformance claims/);
  // The required elements of a well-formed claim.
  assert.match(html, /Version \(LexGrade Standard v1\.0\)/);
  // The integrity boundary lawyers/judges check first — what a claim does NOT assert.
  assert.match(html, /does <em>not<\/em> assert/);
  assert.match(html, /the motion will be granted/);
  // The candor gate's teeth — automatic demotions, table-rendered.
  assert.match(html, /id="automatic-demotions"/);
  assert.match(html, /Any hallucinated citation/);
  assert.match(html, /Deficient \(regardless of composite score\)/);
  // Reachable from the table of contents.
  assert.match(html, /href="#conformance-claims"/);
});

test('omits the appendix sections when the catalog has no conformance/composite data', () => {
  const bare = { ...fixture, conformanceLevels: [], conformanceClaim: null, automaticDemotions: [], composite: {} };
  const html = renderStandard(bare);
  assert.ok(!/id="conformance-levels"/.test(html));
  assert.ok(!/id="conformance-claims"/.test(html));
  assert.ok(!/id="composite-scoring"/.test(html));
});

test('carries the accessibility floor: skip link, landmarks, focusable main', () => {
  const html = renderStandard(fixture);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<nav class="toc"/);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.match(html, /<html lang="en">/);
});

test('escapeHtml neutralises angle brackets, ampersands, and quotes', () => {
  assert.equal(escapeHtml('<a> & "b" \''), '&lt;a&gt; &amp; &quot;b&quot; &#39;');
});

test('renderNotFound is a noindex recovery page with nav, links back, and ships zero JS', () => {
  const html = renderNotFound();
  assert.match(html, /Page not found/);
  // noindex, never a canonical (it must not be indexed as a real page).
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.ok(!/rel="canonical"/.test(html), '404 must not carry a canonical');
  // Recovery: the nav + links to the main pages.
  assert.match(html, /<nav class="sitenav"/);
  assert.match(html, /href="\/standard"/);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.ok(!/<script/i.test(html), 'the 404 must ship zero JS');
});

test('renderRedirect emits a zero-JS meta-refresh to the target', () => {
  const html = renderRedirect('/standard');
  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, /url=\/standard/);
  assert.ok(!/<script/i.test(html), 'the redirect must not use JavaScript');
});

test('renderHome is a real landing on its own canonical, with entry cards into both docs, zero JS', () => {
  const html = renderHome({ standardVersion: '1.0', principleCount: 8, criteriaCount: 45, techniqueVersion: '1.0', techniqueCount: 39 });
  // Claims the root URL (no redirect, no /standard canonical).
  assert.match(html, /rel="canonical" href="https:\/\/lexgrade\.org\/"/);
  assert.ok(!/http-equiv="refresh"/.test(html), 'the homepage is a page, not a redirect');
  // Two entry cards, one per top-level document, with the live counts.
  assert.match(html, /class="home-card" href="\/standard"/);
  assert.match(html, /class="home-card" href="\/techniques"/);
  assert.match(html, /45 graded criteria/);
  assert.match(html, /39 named advocacy techniques/);
  // A Contribute teaser turns the homepage into a collaboration on-ramp.
  assert.match(html, /class="home-invite__link" href="\/contribute"/);
  // Shared chrome + the zero-JS guarantee.
  assert.match(html, /class="masthead"/);
  assert.match(html, /<main id="main" tabindex="-1">/);
  assert.ok(!/<script/i.test(html), 'the homepage must ship zero JS');
});

test('the masthead links to the homepage root, not /standard', () => {
  assert.match(renderStandard(fixture), /class="masthead" href="\/"/);
});

test('the masthead is a mark, not a link — no hover underline (global a:hover is cancelled)', () => {
  // The rules live in the external stylesheet now, not the rendered HTML.
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf-8');
  // No wordmark-specific underline rule…
  assert.ok(!/\.wordmark\s*\{[^}]*text-decoration/.test(css));
  assert.ok(!/masthead:hover\s+\.wordmark/.test(css));
  // …and .masthead:hover explicitly kills the inherited a:hover underline.
  assert.match(css, /\.masthead:hover\s*\{[^}]*text-decoration:\s*none/);
});

test('renderReferences credits the source method without relicensing its text, on its own canonical', () => {
  const html = renderReferences();
  assert.match(html, /rel="canonical" href="https:\/\/lexgrade\.org\/references"/);
  // The scholarship is cited.
  assert.match(html, /Clark &amp; (?:Christy )?DeSanctis/);
  assert.match(html, /Toward a Unified Grading Vocabulary/);
  assert.match(html, /63 J\. Legal Educ\. 3 \(2013\)/);
  // Candor about scope: method credited, criteria are LexGrade's own, no text reproduced.
  assert.match(html, /No rubric text or appendix from the cited work is reproduced/);
  // Calibration authority is also surfaced.
  assert.match(html, /CPLR/);
  assert.ok(!/<script/i.test(html), 'the references page must ship zero JS');
});

test('every page carries the shared site footer with secondary links incl. References', () => {
  const html = renderStandard(fixture);
  assert.match(html, /<footer class="site-footer">/);
  assert.match(html, /<a href="\/references">References<\/a>/);
  assert.match(html, /<a href="\/about">About<\/a>/);
  // Footer is registry-driven and on every shell — present on a solo page too.
  assert.match(renderContribute(), /<footer class="site-footer">/);
  assert.match(renderReferences(), /<a href="\/references" aria-current="page">References<\/a>/);
  // The "not legal advice" caveat rides the shared footer, so it reaches every
  // page — incl. a technique page or the home a stranger lands on from search,
  // not just the pages that already spell it out in prose.
  assert.match(html, /Not legal advice\. LexGrade confers no authority/);
  assert.match(
    renderTechnique({ technique: { number: 1, name: 'Anchor Paragraph', slug: 'anchor-paragraph', definition: 'x' } }),
    /Not legal advice\. LexGrade confers no authority/,
  );
  assert.match(
    renderHome({ standardVersion: '1.0', principleCount: 8, criteriaCount: 45, techniqueVersion: '1.0', techniqueCount: 39 }),
    /Not legal advice\. LexGrade confers no authority/,
  );
});

test('renderAbout states the provenance and its limits, on its own canonical, zero JS', () => {
  const html = renderAbout();
  assert.match(html, /rel="canonical" href="https:\/\/lexgrade\.org\/about"/);
  // Provenance: stated generically in an institutional voice (NY State + federal).
  assert.match(html, /New York State and federal courts/);
  // De-personalization guard: the page describes the standard, never its author.
  // The criteria's grounding stays; the person leaves. These authorial phrasings
  // were intentionally removed (the litigation is live) and must not reappear —
  // the maintainer stays visible only as the GitHub commit author, never in the
  // product's voice. Note: audience references ("self-represented litigants" as
  // users) are fine; only the *authored-by* framing is forbidden.
  assert.ok(
    !/built by a self-represented litigant|one litigant(?:&#39;|')s working model|the creator of LexGrade/i.test(html),
    'no authorial / personal-provenance framing on the about page',
  );
  // The procedural-craft lesson is kept; the case-identifying specifics are not.
  assert.match(html, /a filing&#39;s job is to compel action/);
  // Privacy guard: while the underlying litigation is live, the page must not name
  // the specific venues or the extraordinary-writ proceeding that fingerprint the
  // case. These were intentionally removed and must not be reintroduced.
  assert.ok(
    !/Monroe County|Fourth Department|Western District|Second Circuit|mandamus|Article 78/i.test(html),
    'no case-identifying venue or proceeding details',
  );
  assert.ok(!/against (?:a |two |sitting )?judges?/i.test(html), 'no adversarial-to-judiciary framing');
  // The limit it must carry, same as the Standard: no authority, not legal advice.
  assert.match(html, /not<\/strong> promulgated by any court/);
  assert.match(html, /nothing here is legal advice/);
  // Reachable substance + shared chrome.
  assert.match(html, /href="\/standard"/);
  assert.match(html, /href="\/techniques"/);
  assert.ok(!/<script/i.test(html), 'the about page must ship zero JS');
});

test('the About page is reachable from the cross-page nav on every page', () => {
  assert.match(renderStandard(fixture), /<a href="\/about"[^>]*>About<\/a>/);
  assert.match(renderAbout(), /<a href="\/about" aria-current="page">About<\/a>/);
});

test('every page carries the Contribute CTA, marked current on /contribute', () => {
  // The reserved right-of-the-top-bar slot now holds the primary action.
  assert.match(renderStandard(fixture), /<a class="cta" href="\/contribute">Contribute<\/a>/);
  assert.match(renderHome({ standardVersion: '1.0', principleCount: 8, criteriaCount: 45, techniqueVersion: '1.0', techniqueCount: 39 }), /<a class="cta" href="\/contribute">Contribute<\/a>/);
  assert.match(renderContribute(), /<a class="cta" href="\/contribute" aria-current="page">Contribute<\/a>/);
});

test('renderContribute invites attorneys via both channels, on its own canonical, zero JS', () => {
  const html = renderContribute();
  assert.match(html, /rel="canonical" href="https:\/\/lexgrade\.org\/contribute"/);
  // The high-value contributions are named.
  assert.match(html, /Propose or challenge a criterion/);
  assert.match(html, /Calibrate a jurisdiction/);
  assert.match(html, /Name a technique/);
  // Open-standard process: rough consensus via rfc:, versioned, attributed.
  assert.match(html, /rough consensus/);
  assert.match(html, /rfc: issue/);
  // Both on-ramps: GitHub issues and the non-GitHub email path.
  assert.match(html, new RegExp(`href="${EXPECTED_REPO.replace(/[/.]/g, '\\$&')}/issues/new"`));
  assert.match(html, /href="mailto:contribute@lexgrade\.org"/);
  // Carries the standard's limit, and the contribution-specific disclaimer.
  assert.match(html, /no attorney–client relationship/);
  assert.ok(!/<script/i.test(html), 'the contribute page must ship zero JS');
});

test('stripScripts removes script tags, inline handlers, and javascript: URLs', () => {
  const dirty = '<p onclick="x()">hi</p><script>alert(1)</script><a href="javascript:void(0)">x</a>';
  const clean = stripScripts(dirty);
  assert.ok(!/<script/i.test(clean));
  assert.ok(!/onclick=/i.test(clean));
  assert.ok(!/javascript:/i.test(clean));
});

test('renderTechniques renders a category-grouped card index with a sticky TOC + scroll-spy', () => {
  const html = renderTechniques({
    version: '1.0',
    md: toHtml,
    techniques: [
      { number: 1, name: 'Unrebutted Absence', slug: 'unrebutted-absence', category: 'Factual', definition: 'What is conspicuously missing.' },
      { number: 2, name: 'Catch-22 Demand', slug: 'catch-22-demand', category: 'Strategy', definition: 'A demand with no safe answer.' },
    ],
  });
  assert.match(html, /Technique Register/);
  assert.match(html, /class="tech-group__h"[^>]*>Factual</); // grouped by category
  assert.match(html, /class="tech-group__h"[^>]*>Strategy</);
  assert.match(html, /class="tech-row__num">1</); // medium numeral in the gutter
  assert.match(html, /class="tech-row__def">What is conspicuously missing\./); // one-line def, <p> unwrapped
  assert.match(html, /href="\/api\/v1\/techniques\.json"/); // machines pull JSON, not a dumped page
  assert.match(html, /<main id="main" tabindex="-1">/); // a11y floor via the shell
  // Progressively enhanced like the Standard: sticky sidebar TOC + scroll-spy,
  // with exactly one enhancement script. The page is complete without it.
  assert.match(html, /<aside class="sidebar">\s*<nav class="toc"/); // sidebar rail, same as the Standard
  assert.match(html, /<a href="#factual">Factual<\/a>/); // TOC anchors to the category section by its clean id
  assert.match(html, /<section class="tech-group" id="factual"/); // section carries the human anchor
  assert.equal((html.match(/<script\b/gi) || []).length, 1, 'exactly one enhancement script, like the Standard');
});

test('renderTechniques links each technique to its own deep-linkable page', () => {
  const html = renderTechniques({
    version: '1.0',
    md: toHtml,
    techniques: [
      { number: 1, name: 'Unrebutted Absence', slug: 'unrebutted-absence', category: 'Factual', definition: 'x' },
      { number: 2, name: 'Catch-22 Demand', slug: 'catch-22-demand', category: 'Strategy', definition: 'y' },
    ],
  });
  assert.match(html, /href="\/techniques\/unrebutted-absence"/);
  assert.match(html, /href="\/techniques\/catch-22-demand"/);
});

test('renderTechnique renders the standardized fields with its own canonical and ships zero JS', () => {
  const html = renderTechnique({
    md: toHtml,
    technique: {
      number: 1,
      name: 'Unrebutted Absence',
      slug: 'unrebutted-absence',
      category: 'Factual',
      tier: null,
      definition: 'What is conspicuously missing.',
      fields: {
        example: 'State the absence with a legal hook.',
        antiPattern: 'Name the absence and editorialize.',
        requirements: '1. The absence is tied to a duty\n2. The reader draws the conclusion',
        why: null,
        distinctions: [{ label: 'Distinguished from Drafter Invisibility', text: 'A different axis.' }],
        notes: [{ label: 'Strategic value', text: 'High.' }],
      },
    },
  });
  assert.match(html, /<h1>Unrebutted Absence/);
  assert.match(html, /class="def__pos">Factual technique</); // dictionary-style qualifier
  assert.match(html, /What is conspicuously missing\./); // definition rendered
  assert.match(html, /<h2 class="example__label"[\s\S]*?Example/); // DO callout, real heading
  assert.match(html, /<h2 class="antipattern__label"[\s\S]*?Anti-pattern/); // DON'T callout, real heading
  assert.match(html, /<h2 class="field__label">Requirements<\/h2>/); // labels are real headings (a11y)
  assert.match(html, /The absence is tied to a duty/); // requirements rendered as a list
  assert.match(html, /How it differs/); // distinctions field
  assert.match(html, /Strategic value/); // unrecognized label preserved as a note
  assert.match(html, /rel="canonical" href="https:\/\/lexgrade\.org\/techniques\/unrebutted-absence"/);
  assert.match(html, /href="\/techniques"/); // back to the register
  assert.ok(!/<script/i.test(html), 'production surface must ship zero JS');
});

test('every page carries the cross-page site nav with the active page marked', () => {
  const std = renderStandard(fixture);
  assert.match(std, /<nav class="sitenav"/);
  assert.match(std, /href="\/techniques"/); // can reach techniques from the Standard
  // The active page is marked (constant-weight aria-current accent, not a font change).
  assert.match(std, /<a href="\/standard" aria-current="page">Standard<\/a>/);

  const tech = renderTechniques({ version: '1.0', techniques: [] });
  assert.match(tech, /<a href="\/techniques" aria-current="page">Techniques<\/a>/);
  assert.match(tech, /href="\/standard"/); // can reach the standard from techniques
});
test('the mobile nav is a zero-JS <details> disclosure rendered from the same links', () => {
  const std = renderStandard(fixture);
  // The disclosure: a native <summary> toggle (no script) wrapping the link list.
  assert.match(std, /<details class="sitenav-menu"><summary class="sitenav-summary">Sections<\/summary><div class="sitenav-list">/);
  // The same links render in BOTH the desktop bar and the mobile list (one array,
  // shown one-per-breakpoint), so the active link appears twice — never zero.
  const active = (std.match(/<a href="\/standard" aria-current="page">Standard<\/a>/g) || []).length;
  assert.equal(active, 2, 'active link present in both the bar and the disclosure list');
  // The nav mechanism is a native <details> (proven above), never a JS toggle — no
  // inline handler rides on it. (The page's lone enhancement script is unrelated.)
  assert.ok(!/<(?:details|summary)[^>]*\son\w+\s*=/i.test(std), 'the disclosure nav uses no inline JS handler');
});

test('pages carry Open Graph + Twitter social meta with a branded image', () => {
  const std = renderStandard(fixture);
  assert.match(std, /<meta property="og:title" content="LexGrade Standard v1\.0">/);
  assert.match(std, /<meta property="og:url" content="https:\/\/lexgrade\.org\/standard">/);
  // The OG image promotes the card to a large-image unfurl.
  assert.match(std, /<meta property="og:image" content="https:\/\/lexgrade\.org\/og\/standard\.png">/);
  assert.match(std, /<meta name="twitter:card" content="summary_large_image">/);
  // Mobile-chrome theming + touch icon.
  assert.match(std, /<meta name="theme-color" content="#7A1626">/);
  assert.match(std, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png">/);
});

test('loads the spec webfonts and keeps the sidebar shell on the Standard page', () => {
  const std = renderStandard(fixture);
  // The typographic system: Source Serif 4 + IBM Plex Sans/Mono via <link> (zero-JS).
  assert.match(std, /fonts\.googleapis\.com\/css2\?family=IBM\+Plex\+Mono/);
  assert.match(std, /Source\+Serif\+4/);
  assert.match(std, /rel="preconnect" href="https:\/\/fonts\.gstatic\.com"/);
  // The site nav now sits in a top bar (masthead + nav) on the Standard page too,
  // and the sidebar rail holds only the Table of contents.
  assert.match(std, /<header class="topbar">[\s\S]*?class="masthead"[\s\S]*?<nav class="sitenav"/);
  assert.match(std, /<aside class="sidebar">\s*<nav class="toc"/);
  // The redundant metadata strip above the title is gone.
  assert.ok(!/class="metastrip"/.test(std), 'the metastrip is removed');
});

test('each page declares its OWN canonical URL (not a shared /standard)', () => {
  const tech = renderTechniques({ version: '1.0', html: '<p>x</p>', techniques: [] });
  assert.match(tech, /rel="canonical" href="https:\/\/lexgrade\.org\/techniques"/);
});

test('every page footer points to GitHub to edit the source file or open an issue', () => {
  // The two-column Standard page links its rendered source (the criteria catalog).
  const std = renderStandard(fixture);
  assert.match(std, /Edit this page on GitHub/);
  assert.ok(std.includes(`href="${EXPECTED_REPO}/edit/main/commons/standard/lgs-criteria.yaml"`));
  assert.ok(std.includes(`href="${EXPECTED_REPO}/issues/new"`));

  // The techniques source path is threaded in (version-safe, from methodology.yaml).
  const tech = renderTechniques({ version: '1.0', html: '<p>x</p>', techniques: [], editPath: 'commons/standard/Technique_Register_v1.0.md' });
  assert.match(tech, /\/edit\/main\/commons\/standard\/Technique_Register_v1\.0\.md"/);
});

test('renderLlmsFull concatenates the CC-BY-SA bundle with a cite-as header, in order', () => {
  const txt = renderLlmsFull({
    version: '1.0',
    documents: ['# LexGrade Standard\nbody', '# Technique Register\nbody'],
  });
  assert.match(txt, /# LexGrade — Full Methodology/);
  assert.match(txt, /Cite as: "LexGrade Standard v1\.0, LexGrade \(lexgrade\.org\), CC-BY-SA 4\.0\."/);
  // documents joined by the --- separator, Standard first
  const parts = txt.split('\n---\n');
  assert.ok(parts.length >= 3, 'header + two documents separated by ---');
  assert.ok(txt.indexOf('# LexGrade Standard') < txt.indexOf('# Technique Register'));
});

test('every page carries the logo masthead + favicon, and the standalone SVG has a valid namespace', () => {
  const std = renderStandard(fixture);
  assert.match(std, /class="masthead"/);
  assert.match(std, /class="logo"/);
  assert.match(std, /rel="icon" href="\/logo\.svg"/);
  // documentShell-based pages get it too:
  const doc = renderReferences();
  assert.match(doc, /class="masthead"/);
  assert.match(doc, /rel="icon" href="\/logo\.svg"/);
  // The standalone SVG must use the REAL namespace, never the broken http://w3.org:
  assert.match(LOGO_SVG, /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
  assert.ok(!/http:\/\/w3\.org/.test(LOGO_SVG), 'must not use the broken xmlns');
  // The logo SVG is markup, never script (the page's lone enhancement script aside).
  assert.ok(!/<script/i.test(LOGO_SVG));
});

test('the README logo copies draw the same mark as LOGO_SVG (only the fill differs)', () => {
  // The repo README shows committed light/dark copies of the logo (dist/ is
  // build output). They must keep the site's geometry so the two can't drift.
  const shapes = (svg) => svg.match(/<(path|rect)\b[^>]*\/>/g).join('\n');
  for (const variant of ['light', 'dark']) {
    const copy = readFileSync(new URL(`../../../.github/assets/lexgrade-logo-${variant}.svg`, import.meta.url), 'utf8');
    assert.equal(shapes(copy), shapes(LOGO_SVG), `${variant} logo geometry matches LOGO_SVG`);
  }
});
