// SPDX-License-Identifier: AGPL-3.0-only
//
// Build-time Open Graph card generator: a branded 1200×630 PNG per page so a
// shared link (a campus channel, a citation, a tweet) unfurls with an image.
// Hand-templated SVG → PNG via resvg-js — no satori. Fonts are VENDORED
// (assets/fonts) so the build is reproducible off any host (Cloudflare Pages,
// the extracted repo), never reliant on system fonts. A DEV/build dependency
// only — the production HTML surface stays zero-JS.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';

const FONT_DIR = fileURLToPath(new URL('../assets/fonts/', import.meta.url));
const FONTS = [readFileSync(FONT_DIR + 'DejaVuSans.ttf'), readFileSync(FONT_DIR + 'DejaVuSans-Bold.ttf')];

const W = 1200;
const H = 630;
const ACCENT = '#7A1626';
const INK = '#1A1613';
const MUTED = '#5A534C';
const BG = '#FAF8F4';

// The LexGrade mark (the bar-chart glyph), placed top-left on the card.
const MARK = `<g fill="${ACCENT}" transform="translate(80,70) scale(0.2)"><g transform="translate(40,20)"><path d="M 0,144 L 36,144 L 36,204 L 180,204 L 180,240 L 0,240 Z"/><rect x="48" y="108" width="36" height="84"/><rect x="96" y="72" width="36" height="120"/><path d="M 144,36 L 162,18 L 180,36 L 180,192 L 144,192 Z"/></g></g>`;

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Naive word-wrap to fit the headline width — long titles split across ≤3 lines.
function wrap(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line && (line + ' ' + word).length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

/**
 * Render a branded 1200×630 OG card to a PNG buffer.
 *
 * @param {{title: string, subtitle?: string}} opts
 * @returns {Buffer}
 */
export function ogCard({ title, subtitle = 'Open scoring instrument for legal drafting quality' }) {
  const lines = wrap(title, 20);
  const titleTop = 300;
  const lineHeight = 86;
  const tspans = lines
    .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');
  const subtitleY = titleTop + (lines.length - 1) * lineHeight + 70;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="18" height="${H}" fill="${ACCENT}"/>
  ${MARK}
  <text x="146" y="112" font-family="DejaVu Sans" font-weight="700" font-size="36" fill="${INK}">LexGrade</text>
  <text x="80" y="206" font-family="DejaVu Sans" font-size="26" letter-spacing="4" fill="${MUTED}">OPEN STANDARD</text>
  <text x="80" y="${titleTop}" font-family="DejaVu Sans" font-weight="700" font-size="78" fill="${INK}">${tspans}</text>
  <text x="80" y="${subtitleY}" font-family="DejaVu Sans" font-size="30" fill="${MUTED}">${escapeXml(subtitle)}</text>
  <text x="80" y="566" font-family="DejaVu Sans" font-size="24" fill="${MUTED}">CC-BY-SA 4.0 · lexgrade.org</text>
</svg>`;

  return Buffer.from(
    new Resvg(svg, {
      font: { fontBuffers: FONTS, defaultFontFamily: 'DejaVu Sans', loadSystemFonts: false },
    })
      .render()
      .asPng(),
  );
}

/**
 * Render the square app/touch icon (the mark on the brand accent) to a PNG.
 *
 * @param {number} size
 * @returns {Buffer}
 */
export function appIcon(size = 180) {
  const scale = size / 260;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 260 260">
  <rect width="260" height="260" rx="44" fill="${ACCENT}"/>
  <g fill="#ffffff" transform="translate(40,20)"><path d="M 0,144 L 36,144 L 36,204 L 180,204 L 180,240 L 0,240 Z"/><rect x="48" y="108" width="36" height="84"/><rect x="96" y="72" width="36" height="120"/><path d="M 144,36 L 162,18 L 180,36 L 180,192 L 144,192 Z"/></g>
</svg>`;
  void scale;
  return Buffer.from(new Resvg(svg).render().asPng());
}
