// SPDX-License-Identifier: AGPL-3.0-only
//
// Build-time Open Graph card generator: a branded 1200×630 PNG per page so a
// shared link (a campus channel, a citation, a tweet) unfurls with an image.
// Hand-templated SVG → PNG via resvg-js — no satori. The site's own serif
// (Source Serif 4) is VENDORED in assets/fonts so the build is
// reproducible off any host (Cloudflare Pages, the extracted repo), never
// reliant on system fonts or the network. A DEV/build dependency
// only — the production HTML surface stays zero-JS.

import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';

const FONT_DIR = fileURLToPath(new URL('../assets/fonts/', import.meta.url));
// Passed as file paths: resvg-js's Node binding reads `fontFiles`; `fontBuffers`
// is honoured only by the wasm build and is silently ignored here.
const FONTS = [
  'SourceSerif4Display-Semibold.ttf',
  'SourceSerif4-Semibold.ttf',
  'SourceSerif4-Regular.ttf',
  // Arabic cards: Latin runs (the wordmark, version numbers) stay in the serif
  // above and Arabic falls through to this face.
  'NotoNaskhArabic-SemiBold.ttf',
  'NotoNaskhArabic-Regular.ttf',
].map((file) => FONT_DIR + file);

// Palette and faces mirror styles.css (:root), so a shared link previews as the
// page it opens: warm paper, the cream top bar, serif display headline.
const W = 1200;
const H = 630;
const PAGE = '#FAF8F4';
const PANEL = '#F4F0E8';
const BORDER = '#E4DFD6';
const HEADING = '#1A1613';
const MUTED = '#4C463F';
const ACCENT = '#7A1626';
const DISPLAY = 'Source Serif 4 Display';
const SERIF = 'Source Serif 4';
const ARABIC = 'Noto Naskh Arabic';
const BAR = 96;
const X = 80;

// The LexGrade mark (the bar-chart glyph), set in the top bar beside the wordmark.
const mark = (x) => `<g fill="${ACCENT}" transform="translate(${x},26) scale(0.18)"><g transform="translate(40,20)"><path d="M 0,144 L 36,144 L 36,204 L 180,204 L 180,240 L 0,240 Z"/><rect x="48" y="108" width="36" height="84"/><rect x="96" y="72" width="36" height="120"/><path d="M 144,36 L 162,18 L 180,36 L 180,192 L 144,192 Z"/></g></g>`;

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

// Greedy word-wrap at a fixed width, capped at `maxLines`.
function wrapAt(words, maxChars) {
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
  return lines;
}

// Balanced wrap, like CSS text-wrap: balance on the site's headings: keep the
// greedy line count but take the narrowest width that still achieves it, so
// the last line isn't left short ("Several Lines" alone under a full line).
function wrap(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/);
  const count = wrapAt(words, maxChars).length;
  let width = Math.max(...words.map((w) => w.length));
  while (width < maxChars && wrapAt(words, width).length > count) width++;
  return wrapAt(words, width).slice(0, maxLines);
}

const tspans = (lines, dy) =>
  lines.map((line, i) => `<tspan x="${X}" dy="${i === 0 ? 0 : dy}">${escapeXml(line)}</tspan>`).join('');

// Right-to-left lines. resvg shapes an Arabic run correctly, but it does not
// fall back between fonts inside one text element and drops a line whose
// tspans mix faces. So a mixed line ("معيار LexGrade v1.1") is split into its
// Arabic and Latin runs, each run is its own right-anchored <text> in its own
// face, and the runs are placed right to left by their measured widths.
const LATIN_WORD = /^[^\u0600-\u06FF]*[A-Za-z0-9][^\u0600-\u06FF]*$/;
const FONT_OPTIONS = { fontFiles: FONTS, defaultFontFamily: SERIF, loadSystemFonts: false };

function rtlRuns(line) {
  const runs = [];
  for (const word of String(line).split(' ')) {
    const latin = LATIN_WORD.test(word);
    const last = runs[runs.length - 1];
    if (last && last.latin === latin) last.text += ` ${word}`;
    else runs.push({ latin, text: word });
  }
  return runs;
}

// The inked width of one run, from resvg's own layout of it.
function runWidth(text, attrs) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * 2}" height="200"><text x="${W}" y="120" ${attrs}>${escapeXml(text)}</text></svg>`;
  return new Resvg(svg, { font: FONT_OPTIONS }).getBBox()?.width ?? 0;
}

/**
 * The <text> elements for right-to-left lines hanging from `right`.
 *
 * @param {string[]} lines
 * @param {{right: number, top: number, lead: number, size: number, weight: number, latinFamily: string, fill: string}} o
 */
function rtlText(lines, { right, top, lead, size, weight, latinFamily, fill }) {
  const gap = size * 0.26; // a word space
  return lines
    .map((line, i) => {
      let x = right;
      return rtlRuns(line)
        .map((run) => {
          const attrs = `font-family="${run.latin ? latinFamily : ARABIC}" font-weight="${weight}" font-size="${size}"`;
          // Right-to-left marks keep an Arabic run's edge punctuation on its own side.
          const text = run.latin ? run.text : `\u200F${run.text}\u200F`;
          const el = `<text x="${x.toFixed(1)}" y="${top + i * lead}" text-anchor="end" ${attrs} fill="${fill}">${escapeXml(text)}</text>`;
          x -= runWidth(run.text, attrs) + gap;
          return el;
        })
        .join('');
    })
    .join('\n  ');
}

/**
 * Render a branded 1200×630 OG card to a PNG buffer.
 *
 * A right-to-left card (`dir: 'rtl'`, for Arabic) is the mirror image: the mark
 * and the text hang from the right edge.
 *
 * @param {{title: string, subtitle?: string, dir?: 'ltr'|'rtl'}} opts
 * @returns {Buffer}
 */
export function ogCard({ title, subtitle = 'Open scoring instrument for legal drafting quality', dir = 'ltr' }) {
  const rtl = dir === 'rtl';

  const titleLines = wrap(title, 27, 3);
  const subLines = wrap(subtitle, 64, 2);
  const titleSize = 76;
  const titleLead = 84;
  const subLead = 44;
  // Vertically centre the headline block in the paper below the bar. No footer:
  // every platform already prints the domain under the image.
  const block = titleLines.length * titleLead + 28 + subLines.length * subLead;
  const titleTop = BAR + Math.round((H - BAR - block) / 2) + titleSize - 14;
  const subTop = titleTop + (titleLines.length - 1) * titleLead + 28 + subLead;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAGE}"/>
  <rect width="${W}" height="${BAR}" fill="${PANEL}"/>
  <rect y="${BAR}" width="${W}" height="2" fill="${BORDER}"/>
  ${mark(rtl ? W - X - 47 : X)}
  <text x="${rtl ? W - 138 : 138}" y="62"${rtl ? ' text-anchor="end"' : ''} font-family="${SERIF}" font-weight="600" font-size="34" letter-spacing="-0.3" fill="${HEADING}">LexGrade</text>
${
    rtl
      ? `${rtlText(titleLines, { right: W - X, top: titleTop, lead: titleLead, size: titleSize, weight: 600, latinFamily: DISPLAY, fill: HEADING })}
  ${rtlText(subLines, { right: W - X, top: subTop, lead: subLead, size: 31, weight: 400, latinFamily: SERIF, fill: MUTED })}`
      : `<text x="${X}" y="${titleTop}" font-family="${DISPLAY}" font-weight="600" font-size="${titleSize}" letter-spacing="-1" fill="${HEADING}">${tspans(titleLines, titleLead)}</text>
  <text x="${X}" y="${subTop}" font-family="${SERIF}" font-size="31" fill="${MUTED}">${tspans(subLines, subLead)}</text>`
  }
</svg>`;

  return Buffer.from(
    new Resvg(svg, {
      font: FONT_OPTIONS,
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
