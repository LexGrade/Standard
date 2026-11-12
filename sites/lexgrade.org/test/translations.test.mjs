// SPDX-License-Identifier: AGPL-3.0-only
//
// Translations are welded to the English source the same way the catalog is
// welded to the Standard's markdown: a translation that drops a criterion, a
// technique, or a structural field, or that trails the current edition, fails
// here before it can be published.

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { test } from 'node:test';
import { parse as parseYaml } from 'yaml';

import { cspScriptSrc } from '../src/lib/csp.mjs';
import { DEFAULT_LANG, LANGS, dirOf, localPath, strings } from '../src/i18n.mjs';
import {
  REGISTER_LABELS,
  applyCatalogTranslation,
  loadBundle,
  loadStandard,
  loadTechniqueRegister,
  parseTechniques,
  standardSection,
  translationEntry,
} from '../src/lib/loadStandard.mjs';
import { resolveDataRoot } from '../src/lib/paths.mjs';
import { renderAbout, renderCheck, renderHome, renderStandard, renderTechnique, renderTechniques } from '../src/render.mjs';

const ROOT = resolveDataRoot(process.cwd(), existsSync, process.env.LEXGRADE_DATA_ROOT);
const methodology = parseYaml(readFileSync(resolve(ROOT, 'methodology.yaml'), 'utf-8'));
const TRANSLATED = LANGS.filter((l) => l !== DEFAULT_LANG);

test('localPath prefixes translated pages and leaves English paths alone', () => {
  assert.equal(localPath('en', '/check'), '/check');
  assert.equal(localPath('en', '/'), '/');
  assert.equal(localPath('es', '/check'), '/es/check');
  assert.equal(localPath('es', '/'), '/es');
  assert.equal(localPath('ar', '/check'), '/ar/check');
});

test('every site language has a translation registered for the current edition', () => {
  for (const lang of TRANSLATED) {
    for (const artifact of ['standard', 'technique_register', 'criteria']) {
      assert.doesNotThrow(() => translationEntry(methodology, lang, artifact), `${lang} ${artifact}`);
    }
  }
});

test('only right-to-left languages are marked rtl', () => {
  assert.equal(dirOf('en'), 'ltr');
  assert.equal(dirOf('es'), 'ltr');
  assert.equal(dirOf('ar'), 'rtl');
  assert.ok(!/ dir=/.test(renderAbout().slice(0, 40)));
  assert.match(renderAbout({ lang: 'ar' }), /^<!doctype html>\n<html lang="ar" dir="rtl">/);
});

test('a translation of an older edition is refused', () => {
  const stale = {
    current: { standard: '9.9', technique_register: '1.0' },
    translations: { es: { standard: { translates: '1.1', path: 'x.md' } } },
  };
  assert.throws(() => translationEntry(stale, 'es', 'standard'), /current edition is v9\.9/);
  assert.throws(() => translationEntry(stale, 'fr', 'standard'), /no "fr" translation/);
});

for (const lang of TRANSLATED) {
  const en = loadStandard();
  const tr = loadStandard(lang);

  test(`[${lang}] the catalog overlay translates every principle and criterion, and no others`, () => {
    const overlay = parseYaml(readFileSync(resolve(ROOT, translationEntry(methodology, lang, 'criteria').path), 'utf-8'));
    assert.equal(overlay.language, lang);
    assert.deepEqual(Object.keys(overlay.principles).sort(), en.principles.map((p) => p.id).sort());
    assert.deepEqual(Object.keys(overlay.criteria).sort(), en.criteria.map((c) => c.id).sort());
    for (const p of en.principles) assert.ok(overlay.principles[p.id].title, `${p.id} title`);
    for (const c of en.criteria) {
      assert.ok(overlay.criteria[c.id].title, `${c.id} title`);
      assert.ok(overlay.criteria[c.id].requirement, `${c.id} requirement`);
    }
    // Strings only: nothing numeric may be carried by a translation.
    const numeric = (v) => (typeof v === 'number' ? [v] : v && typeof v === 'object' ? Object.values(v).flatMap(numeric) : []);
    assert.deepEqual(numeric(overlay), []);
  });

  test(`[${lang}] translating the catalog changes no id, weight, deduction, or threshold`, () => {
    const pick = (s) => ({
      principles: s.principles.map(({ id, role, weight }) => ({ id, role, weight })),
      criteria: s.criteria.map(({ id, principle, deduction, added_in }) => ({ id, principle, deduction, added_in })),
      levels: s.conformanceLevels.map(({ id, min_composite, max_composite, requires }) => ({ id, min_composite, max_composite, requires })),
      cap: s.composite.cap,
      weights: s.composite.weights,
      modifiers: s.composite.negative_modifiers.map((m) => m.deduction),
      ranges: s.composite.grade_scale.length,
    });
    assert.deepEqual(pick(tr), pick(en));
    assert.equal(tr.version, en.version);
    assert.notEqual(tr.criteria[0].title, en.criteria[0].title);
  });

  test(`[${lang}] an overlay missing a string falls back to the English text`, () => {
    const lgs = { principles: [{ id: 'P2', title: 'Problem Diagnosis', weight: 10 }], criteria: [{ id: 'LGS 2.1', title: 'T', requirement: 'R' }] };
    const out = applyCatalogTranslation(lgs, { principles: {}, criteria: { 'LGS 2.1': { title: 'Título' } } });
    assert.equal(out.principles[0].title, 'Problem Diagnosis');
    assert.deepEqual(out.criteria[0], { id: 'LGS 2.1', title: 'Título', requirement: 'R' });
  });

  test(`[${lang}] the translated Standard states the same criteria as the catalog overlay`, () => {
    const md = loadBundle(lang).documents[0];
    const rows = new Map();
    for (const line of md.split('\n')) {
      const m = line.match(/^\| (LGS \d+\.\d+) \| ([^|]+) \| ([^|]+) \|.*\|$/);
      if (m && !rows.has(m[1])) rows.set(m[1], { title: m[2].trim(), requirement: m[3].trim() });
    }
    assert.deepEqual([...rows.keys()].sort(), en.criteria.map((c) => c.id).sort());
    for (const c of tr.criteria) {
      assert.equal(rows.get(c.id).title, c.title, `${c.id} title`);
      assert.equal(rows.get(c.id).requirement, String(c.requirement).trim(), `${c.id} requirement`);
    }
    // Every numbered top-level section of the English edition is present.
    const sections = (text) => [...text.matchAll(/^## (\d+)\. /gm)].map((m) => m[1]);
    assert.deepEqual(sections(md), sections(loadBundle().documents[0]));
    // §9 feeds /<lang>/check: one row per principle.
    const quick = standardSection(md, 9).body;
    assert.equal([...quick.matchAll(/^\| P[1-8]\. /gm)].length, 8);
  });

  test(`[${lang}] the translated Register has every technique, with the same fields`, () => {
    const enList = parseTechniques(loadTechniqueRegister().markdown);
    const trList = parseTechniques(loadTechniqueRegister(lang).markdown, REGISTER_LABELS[lang]);
    assert.deepEqual(trList.map((t) => t.number), enList.map((t) => t.number));
    const shape = (f) => [Boolean(f.example), Boolean(f.antiPattern), Boolean(f.requirements), Boolean(f.why), f.distinctions.length, f.notes.length];
    const categories = new Map();
    for (const [i, t] of trList.entries()) {
      const source = enList[i];
      assert.ok(t.name && t.definition && t.category, `#${t.number} name, definition, category`);
      assert.equal(Boolean(t.tier), Boolean(source.tier), `#${t.number} tier`);
      assert.deepEqual(shape(t.fields), shape(source.fields), `#${t.number} fields`);
      // One translated category per English category, used consistently.
      assert.equal(categories.get(source.category) ?? t.category, t.category, `#${t.number} category`);
      categories.set(source.category, t.category);
    }
    assert.equal(new Set(categories.values()).size, categories.size);
  });

  test(`[${lang}] translated pages declare their language, their own URL, and their counterpart`, () => {
    const html = renderCheck({ version: '1.1', quickStartHtml: '<table><tr><td>P4. Fundamento fáctico</td></tr></table>', lang });
    // A right-to-left language also declares its direction on the root element.
    assert.match(html, new RegExp(`<html lang="${lang}"${dirOf(lang) === 'rtl' ? ' dir="rtl"' : ''}>`));
    assert.match(html, new RegExp(`rel="canonical" href="https://lexgrade\\.org/${lang}/check"`));
    assert.match(html, /hreflang="en" href="https:\/\/lexgrade\.org\/check"/);
    assert.match(html, new RegExp(`hreflang="${lang}" href="https://lexgrade\\.org/${lang}/check"`));
    assert.match(html, /hreflang="x-default" href="https:\/\/lexgrade\.org\/check"/);
    // Principles link into the translated Standard; the switch links back to English.
    assert.match(html, new RegExp(`<a href="/${lang}/standard#p4">P4\\.&nbsp;Fundamento fáctico</a>`));
    assert.match(html, /<a class="lang-switch" href="\/check" lang="en" hreflang="en">English<\/a>/);
    assert.ok(!/<script/i.test(html));
    // The English page links to the translation and is otherwise unchanged in language.
    const english = renderCheck({ version: '1.1', quickStartHtml: '' });
    assert.match(english, /<html lang="en">/);
    assert.match(english, new RegExp(`<a class="lang-switch" href="/${lang}/check" lang="${lang}" hreflang="${lang}">`));
  });

  test(`[${lang}] every translated page says the English text governs, and names no author`, () => {
    const pages = [
      renderHome({ standardVersion: '1.1', principleCount: 8, criteriaCount: 47, techniqueVersion: '1.0', techniqueCount: 39, lang }),
      renderAbout({ lang }),
      renderStandard(tr, { lang }),
    ];
    for (const html of pages) {
      assert.ok(html.includes(strings(lang).translationNote));
      assert.ok(!/built by a self-represented litigant|the creator of LexGrade/i.test(html));
    }
  });

  test(`[${lang}] the translated Standard page keeps English anchors, the English citation, and the one script`, () => {
    const html = renderStandard(tr, { lang });
    for (const c of en.criteria) assert.ok(html.includes(`id="${c.id.toLowerCase().replace(/\s+/g, '-')}"`), c.id);
    assert.match(html, /id="lg-cite" lang="en"[^>]*>&ldquo;LexGrade Standard v/);
    assert.equal(cspScriptSrc(html), cspScriptSrc(renderStandard(en)));
  });

  test(`[${lang}] translated technique pages keep the English slug`, () => {
    const enList = parseTechniques(loadTechniqueRegister().markdown);
    const first = { ...parseTechniques(loadTechniqueRegister(lang).markdown, REGISTER_LABELS[lang])[0], slug: enList[0].slug };
    const index = renderTechniques({ version: '1.0', techniques: [first], lang });
    assert.ok(index.includes(`href="/${lang}/techniques/${enList[0].slug}"`));
    const page = renderTechnique({ technique: first, lang });
    assert.match(page, new RegExp(`rel="canonical" href="https://lexgrade\\.org/${lang}/techniques/${enList[0].slug}"`));
    assert.ok(page.includes(`href="/${lang}/techniques"`));
  });
}
