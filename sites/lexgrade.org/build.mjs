// SPDX-License-Identifier: AGPL-3.0-only
//
// Build the static open-Standard hub. This is a DEV-TIME Node tool; its OUTPUT
// is pure HTML + inline CSS with zero client JavaScript, ready to serve from
// Cloudflare Pages. No framework, no client runtime.
//
//   node build.mjs   ->   dist/standard/index.html  (+ dist/index.html homepage)
//
// Offline-build litmus: reads ONLY local commons/ data (methodology.yaml +
// lgs-criteria.yaml via loadStandard) — no network, no external API — so the
// site is self-contained and reproducible.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadBundle, loadStandard, loadTechniqueRegister, parseTechniques } from './src/lib/loadStandard.mjs';
import { cspScriptSrc } from './src/lib/csp.mjs';
import { toHtml } from './src/markdown.mjs';
import { appIcon, ogCard } from './src/og.mjs';
import { PAGES, LOGO_SVG, BADGE_ROLES_CSS, renderAbout, renderContribute, renderHome, renderReferences, renderLlmsFull, renderNotFound, renderStandard, renderTechnique, renderTechniques } from './src/render.mjs';

const SITE = 'https://lexgrade.org';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');

// Start from an empty dist so pages removed from the sources (renamed
// techniques, dropped routes) can't linger from a previous build and keep
// being served. Everything below regenerates the full output.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/** Write a self-contained page at dist/<path>/index.html (creates the dir). */
function writePage(path, html) {
  mkdirSync(resolve(OUT, path), { recursive: true });
  writeFileSync(resolve(OUT, path, 'index.html'), html);
}

const standard = loadStandard();

// Static "API": the machine-readable criteria catalog as JSON, served straight
// off the CDN at /api/v1/standard.json — no API service, no account. Emitted
// before the pages so the build's internal link-checker can resolve links to it.
const apiDir = resolve(OUT, 'api', 'v1');
mkdirSync(apiDir, { recursive: true });
writeFileSync(
  resolve(apiDir, 'standard.json'),
  JSON.stringify(
    {
      standard: 'LexGrade Standard',
      version: standard.version,
      license: standard.license,
      scope: standard.scope,
      citations_verified: standard.citationsVerified,
      cite_as: `LexGrade Standard v${standard.version}, LexGrade (lexgrade.org), ${standard.license}.`,
      principles: standard.principles,
      criteria: standard.criteria,
      conformance_levels: standard.conformanceLevels,
      conformance_claim: standard.conformanceClaim,
      automatic_demotion_rules: standard.automaticDemotions,
      composite: standard.composite,
    },
    null,
    2,
  ) + '\n',
);

mkdirSync(resolve(OUT, 'standard'), { recursive: true });
const standardHtml = renderStandard(standard);
writeFileSync(resolve(OUT, 'standard', 'index.html'), standardHtml);
// CSP source for the inline progressive-enhancement script(s) on /standard — the
// only scripted page. Hash the rendered bytes so the strict policy allows exactly
// those scripts and nothing else (every other page is script-free).
const cspScript = cspScriptSrc(standardHtml);
// The root (/) homepage is written further down, once the technique count is known.
// Custom 404 — Cloudflare Pages serves dist/404.html for any unmatched route.
writeFileSync(resolve(OUT, '404.html'), renderNotFound());
// The logo as a standalone file (favicon target + reusable asset).
writeFileSync(resolve(OUT, 'logo.svg'), LOGO_SVG);
// The stylesheet: static src/styles.css with the ROLES-derived badge palette
// substituted at its placeholder (see render.mjs), emitted as one cacheable
// file shared by every page.
writeFileSync(
  resolve(OUT, 'styles.css'),
  readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), 'src', 'styles.css'), 'utf-8')
    .replace('/*__BADGE_ROLES__*/', BADGE_ROLES_CSS),
);
// Self-contained narrative pages (no markdown source): provenance, the
// collaboration CTA, and the sources/influences credits.
writePage('about', renderAbout());
writePage('contribute', renderContribute());
writePage('references', renderReferences());

// /techniques — the Technique Register index, rendered from markdown at
// build time, PLUS one deep-linkable page per technique (/techniques/
// {slug}). Slugs are stable so a technique keeps the same URL across surfaces
// and over time — important for citations and deep links.
const techniques = loadTechniqueRegister();
const techniqueList = parseTechniques(techniques.markdown);
// Root (/) — a thin landing into the Standard and the Register (replaces the old
// redirect), now that both versions and the technique count are known.
writeFileSync(
  resolve(OUT, 'index.html'),
  renderHome({
    standardVersion: standard.version,
    principleCount: standard.principles.length,
    criteriaCount: standard.criteria.length,
    techniqueVersion: techniques.version,
    techniqueCount: techniqueList.length,
  }),
);
writePage('techniques', renderTechniques({ version: techniques.version, techniques: techniqueList, md: toHtml, editPath: techniques.path }));
for (const technique of techniqueList) {
  const dir = resolve(OUT, 'techniques', technique.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), renderTechnique({ technique, md: toHtml, editPath: techniques.path }));
}
// /api/v1/techniques.json — the complete register as structured data, so the
// reference is pulled from JSON rather than dumped onto a webpage. The full prose
// also stays in /llms-full.txt. Emitted into the api dir created above.
writeFileSync(
  resolve(apiDir, 'techniques.json'),
  JSON.stringify(
    {
      technique_register: techniques.version,
      license: standard.license,
      cite_as: `LexGrade Technique Register v${techniques.version}, LexGrade (lexgrade.org), ${standard.license}.`,
      count: techniqueList.length,
      techniques: techniqueList.map(({ number, name, slug, category, tier, definition, fields }) => ({
        number,
        name,
        slug,
        category,
        tier,
        definition,
        ...fields,
      })),
    },
    null,
    2,
  ) + '\n',
);

// Agent-readable bundle: the CC-BY-SA methodology as raw markdown (plain text).
const bundle = loadBundle();
writeFileSync(resolve(OUT, 'llms-full.txt'), renderLlmsFull(bundle));

// Open Graph cards — one branded 1200×630 PNG per page (build-time, from vendored
// fonts) so a shared link unfurls with an image. The card SET derives from PAGES
// (so a new page can't ship without a card); the two versioned pages get their
// title/subtitle computed from source — version and the live technique count —
// rather than hardcoded.
const OG = resolve(OUT, 'og');
mkdirSync(OG, { recursive: true });
const techniqueCategories = new Set(techniqueList.map((t) => t.category)).size;
for (const page of PAGES) {
  let { title, subtitle } = page.og;
  if (page.id === 'standard') {
    title = `LexGrade Standard v${standard.version}`;
  } else if (page.id === 'techniques') {
    title = `Technique Register v${techniques.version}`;
    subtitle = `${techniqueList.length} named advocacy techniques across ${techniqueCategories} categories`;
  }
  writeFileSync(resolve(OG, `${page.id}.png`), ogCard({ title, subtitle }));
}
for (const technique of techniqueList) {
  writeFileSync(resolve(OG, `technique-${technique.slug}.png`), ogCard({ title: technique.name, subtitle: 'LexGrade Technique Register' }));
}

// The square app/touch icon (the mark on the brand accent).
writeFileSync(resolve(OUT, 'apple-touch-icon.png'), appIcon(180));

// SEO / discoverability: a sitemap of every canonical page + robots pointing to it.
// The page set derives from PAGES; the per-technique pages are appended.
const sitemapPaths = [
  ...PAGES.map((p) => p.path),
  ...techniqueList.map((t) => `/techniques/${t.slug}`),
];
const lastmod = new Date().toISOString().slice(0, 10);
writeFileSync(
  resolve(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths
    .map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
writeFileSync(resolve(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

// Cloudflare Pages edge headers. The machine-readable data is meant to be
// consumed cross-origin (agents, downstream tools), so it carries permissive
// CORS; static assets cache hard; and a strict CSP enforces the zero-JS surface
// at the edge (no scripts can ever load, even if markup regressed).
writeFileSync(
  resolve(OUT, '_headers'),
  [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    `  Content-Security-Policy: default-src 'self'; script-src ${cspScript}; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; base-uri 'self'; form-action 'none'`,
    '',
    '/api/*',
    '  Access-Control-Allow-Origin: *',
    '  Cache-Control: public, max-age=3600',
    '',
    '/styles.css',
    '  Cache-Control: public, max-age=3600',
    '',
    '/llms-full.txt',
    // .txt carries no in-band encoding marker (unlike HTML's <meta charset>), and
    // with nosniff on, the browser obeys the header verbatim — without an explicit
    // charset it defaults to Latin-1 and every UTF-8 em-dash renders as "â€".
    '  Content-Type: text/plain; charset=utf-8',
    '  Access-Control-Allow-Origin: *',
    '  Cache-Control: public, max-age=3600',
    '',
    '/og/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '',
  ].join('\n'),
);

// Self-check: every internal link + in-page anchor must resolve. A spec site can't
// ship dead links; this fails the build (and CI) before a broken reference goes
// public. Crawls the just-written dist/ — paths to a file/dir, and #anchors to ids.
{
  const htmls = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = resolve(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith('.html')) htmls.push(p);
    }
  })(OUT);
  const idsOf = (html) => new Set([...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));
  const fileFor = (p) => {
    const clean = p.split('#')[0];
    if (clean === '' || clean === '/') return resolve(OUT, 'index.html');
    const base = resolve(OUT, '.' + clean);
    if (existsSync(base) && statSync(base).isFile()) return base;
    if (existsSync(resolve(base, 'index.html'))) return resolve(base, 'index.html');
    return null;
  };
  const broken = [];
  for (const f of htmls) {
    const html = readFileSync(f, 'utf-8');
    const rel = f.replace(OUT, '');
    for (const h of [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).filter((h) => h.startsWith('/') || h.startsWith('#'))) {
      if (h.startsWith('#')) {
        if (!idsOf(html).has(h.slice(1))) broken.push(`${rel} -> ${h} (missing in-page id)`);
        continue;
      }
      const tgt = fileFor(h);
      if (!tgt) broken.push(`${rel} -> ${h} (no file)`);
      else if (h.includes('#') && !idsOf(readFileSync(tgt, 'utf-8')).has(h.split('#')[1])) broken.push(`${rel} -> ${h} (missing anchor)`);
    }
  }
  if (broken.length) {
    console.error(`\nBroken internal links (${broken.length}):\n  ${broken.join('\n  ')}`);
    process.exit(1);
  }
}

console.log(
  `Built LexGrade Standard v${standard.version}: ${standard.criteria.length} criteria → dist/standard/index.html` +
    ` + /techniques (+ ${techniqueList.length} technique pages)` +
    ` + llms-full.txt (${bundle.documents.length} documents)` +
    ` + ${PAGES.length + techniqueList.length} OG cards + sitemap.xml + robots.txt`,
);
