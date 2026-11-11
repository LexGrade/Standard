// SPDX-License-Identifier: AGPL-3.0-only
//
// Site languages. English is the source and the text that governs; every other
// language is a translation published under /<lang>/. This module holds the
// strings the renderer needs in each language (site chrome, the Standard page,
// the Technique Register pages) and the translated copy of the narrative pages.
// Pure and import-free, like render.mjs, so `node --test` needs no dependencies.
//
// The English strings here are the exact text render.mjs emitted before the
// site had a second language; tests hold them in place.

export const DEFAULT_LANG = 'en';
export const LANGS = ['en', 'es'];

/** The name a language switch link shows for each language, in that language. */
export const LANG_NAMES = { en: 'English', es: 'Español' };

/**
 * A language-neutral site path ("/check") as served in `lang`: unchanged for
 * English, prefixed for a translation ("/es/check"; the home page is "/es").
 *
 * @param {string} lang
 * @param {string} path
 * @returns {string}
 */
export function localPath(lang, path) {
  if (lang === DEFAULT_LANG) return path;
  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}

const en = {
  skip: 'Skip to main content',
  tocLabel: 'Table of contents',
  homeAria: 'LexGrade — home',
  navAria: 'Standard sections',
  sections: 'Sections',
  secondaryAria: 'Secondary',
  footerMeta: 'LexGrade: open methodology, licensed CC-BY-SA 4.0. &copy; LexGrade.',
  footerNote: 'Not legal advice. LexGrade confers no authority; verify every citation before filing.',
  translationNote: '',
  foundError: (editUrl, issuesUrl) =>
    `Found an error? <a href="${editUrl}">Edit this page on GitHub</a> or <a href="${issuesUrl}">open an issue</a>.`,
  numberWords: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'],
  pages: {
    home: { label: 'Home', og: { title: 'An open standard for scoring legal motions.', subtitle: 'Principles, weights, and the ethics gate, published in full' } },
    standard: { label: 'Standard', og: { title: 'LexGrade Standard', subtitle: 'Open scoring instrument for legal drafting quality' } },
    techniques: { label: 'Techniques', og: { title: 'Technique Register', subtitle: 'Named advocacy techniques, the informative companion' } },
    about: { label: 'About', og: { title: 'About LexGrade', subtitle: 'Grounded in real motion practice' } },
    check: { label: 'Check your own motion', og: { title: 'Checking your own motion', subtitle: 'For anyone filing without a lawyer' } },
    contribute: { label: 'Contribute', og: { title: 'Contribute to LexGrade', subtitle: 'An open, collaborative standard — help shape it' } },
    references: { label: 'References', og: { title: 'Sources & influences', subtitle: 'What LexGrade builds on, credited in full' } },
  },
  standard: {
    name: 'LexGrade Standard',
    roles: { precondition: 'Precondition', weighted: 'Weighted', gate: 'Gate' },
    deduction: (points) => `<strong>Deduction:</strong> ${points} points per instance`,
    addedIn: (v) => `Added in v${v}.`,
    source: 'Source: ',
    permalinkTo: 'Permalink to ',
    p1Fallback:
      'Procedural Integrity is a precondition the filer satisfies against the court&#39;s rules. LGS does not score it; graded criteria begin at LGS 2.1.',
    noCriteria: 'No graded criteria for this principle.',
    levelRows: { composite: 'Composite', gate: 'Gate', precondition: 'Precondition' },
    levelsHeading: 'Conformance levels',
    levelsNote:
      'A motion conforms at Expert, Competent, or Deficient. A claim is version-specific and does not transfer to revisions — each must be re-graded.',
    cap: (n) => `<strong>Cap:</strong> ${n} — no motion scores above this.`,
    weightsCaption: (total) => `Weighted principles (total ${total} points)`,
    weightsHeaders: ['Principle', 'Weight'],
    gradeCaption: 'Grade scale',
    gradeHeaders: ['Letter', 'Range', 'Conformance'],
    compositeHeading: 'Composite scoring',
    claimsHeading: 'Conformance claims',
    claimsNote:
      'A conformance claim is version-specific and is made for one motion as graded; it does not transfer to revisions, which must be re-graded.',
    wellFormed: 'A well-formed LexGrade conformance claim states all of:',
    asserts: '<strong>A claim asserts:</strong>',
    disclaims: '<strong>A claim does <em>not</em> assert:</strong>',
    demotionCaption: 'Automatic demotions — applied regardless of composite score',
    demotionHeaders: ['Condition', 'Result'],
    description: (title, principleWord, critCount, license) =>
      `${title} — open scoring instrument for legal drafting. ${principleWord} principles, ${critCount} graded criteria, ${license}.`,
    subhead: (scope, principleWord, critCount) =>
      `An open scoring instrument for ${scope}: ${principleWord} principles and ${critCount} graded criteria, each independently citable.`,
    sotdSummary: 'Status of this document',
    thisVersion: 'This version',
    currentEdition: (v) => `v${v} (current published edition)`,
    machineReadable: 'Machine-readable',
    sourceRepo: 'Source repository',
    calibratedTo: 'Calibrated to',
    calibratedToValue: 'CPLR &amp; the Uniform Civil Rules (22 NYCRR Part 202)',
    citationsVerified: 'Citations verified',
    citationsVerifiedNote: '(confirm provisions remain current)',
    license: 'License',
    licenseNote: '(content)',
    citeAs: 'Cite as',
    copy: null,
    sotdNote:
      'This Standard is not promulgated by any court, bar, or government body. Verify every legal citation independently before filing, including those in the Standard. The markdown text, served at <code>/llms-full.txt</code>, is the source of truth. This page and <code>/api/v1/standard.json</code> are built from a structured copy checked against it.',
    abstractHeading: 'Abstract',
    abstract: (principleWord, critCount, scope) =>
      `The LexGrade Standard (LGS) is an open instrument for scoring the quality of legal drafting. It defines ${principleWord} principles and ${critCount} graded criteria, calibrated against ${scope}. Each criterion is independently citable. The conformance grade is a weighted composite, and an ethics gate forces a deficient grade on any hallucinated citation.`,
    footer: (editUrl, issuesUrl) =>
      `Found an error? <a href="${editUrl}">Edit this page on GitHub</a> or <a href="${issuesUrl}">open an issue</a>. Substantive changes go through an <code>rfc:</code> issue.`,
  },
  techniques: {
    heading: 'LexGrade Technique Register',
    subhead: (count, jsonUrl, llmsUrl) =>
      `${count} named advocacy techniques, reported alongside the composite score without ever modifying it. The complete reference is also available as <a href="${jsonUrl}">JSON</a> and in <a href="${llmsUrl}">llms-full.txt</a>.`,
    calloutAria: 'How to read this register',
    callout: `<p><strong>Read this first.</strong> The Register catalogs craft. Each named technique is a form of clarity, discipline, or preparation that makes the strongest <em>honest</em> version of a case easy for a busy court to act on. If a technique would require bending candor to the tribunal or fairness to the opponent, the Standard treats it as a defect.</p>
    <p>No technique is required for any grade, and a motion can score A+ with none present. The Register asks a different question: what does expert advocacy do that competent advocacy does not?</p>`,
    uncategorized: 'Uncategorized',
    docTitle: (version) => `LexGrade Standard v${version} — Technique Register`,
    description: (count) =>
      `The LexGrade Technique Register: ${count} named advocacy techniques. Informative companion to the Standard. CC-BY-SA 4.0.`,
    partOfSpeech: (category, tier) => `${category} technique${tier ? ` · Tier ${tier}` : ''}`,
    definition: 'Definition',
    example: 'Example',
    antiPattern: 'Anti-pattern',
    requirements: 'Requirements',
    howItDiffers: 'How it differs',
    all: '← All techniques',
    pageTitle: (name) => `${name} — LexGrade Technique Register`,
    fallbackDescription: (name) => `${name} — a named advocacy technique in the LexGrade Technique Register. CC-BY-SA 4.0.`,
    ogSubtitle: 'LexGrade Technique Register',
    ogIndexSubtitle: (count, categories) => `${count} named advocacy techniques across ${categories} categories`,
  },
};

const es = {
  skip: 'Saltar al contenido principal',
  tocLabel: 'Índice',
  homeAria: 'LexGrade — inicio',
  navAria: 'Secciones del Estándar',
  sections: 'Secciones',
  secondaryAria: 'Navegación secundaria',
  footerMeta: 'LexGrade: metodología abierta, con licencia CC-BY-SA 4.0. &copy; LexGrade.',
  footerNote:
    'No es asesoría legal. LexGrade no confiere autoridad alguna; verifique cada cita antes de presentar su escrito.',
  translationNote:
    'Traducción automática al español, pendiente de revisión por un traductor. El texto en inglés es el que rige; si encuentra un error, repórtelo a <a href="mailto:hello@lexgrade.org?subject=Correction">hello@lexgrade.org</a>.',
  foundError: (editUrl, issuesUrl) =>
    `¿Encontró un error? <a href="${editUrl}">Edite esta página en GitHub</a> o <a href="${issuesUrl}">abra un issue</a>.`,
  numberWords: ['cero', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce'],
  pages: {
    home: { label: 'Inicio', og: { title: 'Un estándar abierto para calificar mociones legales.', subtitle: 'Principios, pesos y el filtro ético, publicados íntegramente' } },
    standard: { label: 'Estándar', og: { title: 'Estándar LexGrade', subtitle: 'Instrumento abierto para calificar la calidad de la redacción legal' } },
    techniques: { label: 'Técnicas', og: { title: 'Registro de Técnicas', subtitle: 'Técnicas de abogacía con nombre, el complemento informativo' } },
    about: { label: 'Acerca de', og: { title: 'Acerca de LexGrade', subtitle: 'Basado en la práctica real de mociones' } },
    check: { label: 'Revise su propia moción', og: { title: 'Cómo revisar su propia moción', subtitle: 'Para quien presenta un escrito sin abogado' } },
    contribute: { label: 'Contribuir', og: { title: 'Contribuya a LexGrade', subtitle: 'Un estándar abierto y colaborativo: ayude a darle forma' } },
    references: { label: 'Referencias', og: { title: 'Fuentes e influencias', subtitle: 'En qué se apoya LexGrade, con el crédito completo' } },
  },
  standard: {
    name: 'Estándar LexGrade',
    roles: { precondition: 'Condición previa', weighted: 'Ponderado', gate: 'Filtro' },
    deduction: (points) => `<strong>Deducción:</strong> ${points} puntos por instancia`,
    addedIn: (v) => `Añadido en la v${v}.`,
    source: 'Fuente: ',
    permalinkTo: 'Enlace permanente a ',
    p1Fallback:
      'La integridad procesal es una condición previa que quien presenta el escrito cumple conforme a las reglas del tribunal. LGS no la califica; los criterios calificados comienzan en LGS 2.1.',
    noCriteria: 'Este principio no tiene criterios calificados.',
    levelRows: { composite: 'Puntuación compuesta', gate: 'Filtro', precondition: 'Condición previa' },
    levelsHeading: 'Niveles de conformidad',
    levelsNote:
      'Una moción se ubica en el nivel Experto, Competente o Deficiente. Una declaración corresponde a una versión específica y no se traslada a las revisiones: cada una debe calificarse de nuevo.',
    cap: (n) => `<strong>Tope:</strong> ${n}. Ninguna moción obtiene una puntuación mayor.`,
    weightsCaption: (total) => `Principios ponderados (total: ${total} puntos)`,
    weightsHeaders: ['Principio', 'Peso'],
    gradeCaption: 'Escala de calificaciones',
    gradeHeaders: ['Letra', 'Rango', 'Conformidad'],
    compositeHeading: 'Puntuación compuesta',
    claimsHeading: 'Declaraciones de conformidad',
    claimsNote:
      'Una declaración de conformidad corresponde a una versión específica y se hace para una moción tal como fue calificada; no se traslada a las revisiones, que deben calificarse de nuevo.',
    wellFormed: 'Una declaración de conformidad LexGrade bien formada indica todo lo siguiente:',
    asserts: '<strong>Una declaración afirma:</strong>',
    disclaims: '<strong>Una declaración <em>no</em> afirma:</strong>',
    demotionCaption: 'Descensos automáticos: se aplican sea cual sea la puntuación compuesta',
    demotionHeaders: ['Condición', 'Resultado'],
    description: (title, principleWord, critCount, license) =>
      `${title}: instrumento abierto para calificar la redacción legal. ${principleWord} principios, ${critCount} criterios calificados, ${license}.`,
    subhead: (scope, principleWord, critCount) =>
      `Un instrumento abierto de calificación para ${scope}: ${principleWord} principios y ${critCount} criterios calificados, cada uno citable por separado.`,
    sotdSummary: 'Estado de este documento',
    thisVersion: 'Esta versión',
    currentEdition: (v) => `v${v} (edición publicada vigente), en traducción`,
    machineReadable: 'Legible por máquina',
    sourceRepo: 'Repositorio fuente',
    calibratedTo: 'Calibrado según',
    calibratedToValue: 'CPLR y las Uniform Civil Rules (22 NYCRR Part 202)',
    citationsVerified: 'Citas verificadas',
    citationsVerifiedNote: '(confirme que las disposiciones sigan vigentes)',
    license: 'Licencia',
    licenseNote: '(contenido)',
    citeAs: 'Cítese como',
    copy: { copy: 'Copiar', copied: 'Copiado ✓', label: 'Copiar la cita' },
    sotdNote:
      'Este Estándar no ha sido promulgado por ningún tribunal, colegio de abogados ni organismo gubernamental. Verifique por su cuenta cada cita legal antes de presentar un escrito, incluidas las del Estándar. Esta página es una traducción: el texto en inglés es el que rige. El texto en markdown, servido en <code>/es/llms-full.txt</code>, es la fuente de esta traducción. Esta página y <code>/api/v1/standard.es.json</code> se generan a partir de una copia estructurada.',
    abstractHeading: 'Resumen',
    abstract: (principleWord, critCount, scope) =>
      `El Estándar LexGrade (LGS) es un instrumento abierto para calificar la calidad de la redacción legal. Define ${principleWord} principios y ${critCount} criterios calificados, calibrados según ${scope}. Cada criterio puede citarse por separado. La calificación de conformidad es una puntuación compuesta ponderada, y un filtro ético impone la calificación de deficiente ante cualquier cita alucinada.`,
    footer: (editUrl, issuesUrl) =>
      `¿Encontró un error? <a href="${editUrl}">Edite esta página en GitHub</a> o <a href="${issuesUrl}">abra un issue</a>. Los cambios de fondo pasan por un issue <code>rfc:</code>.`,
  },
  techniques: {
    heading: 'Registro de Técnicas LexGrade',
    subhead: (count, jsonUrl, llmsUrl) =>
      `${count} técnicas de abogacía con nombre, que se reportan junto a la puntuación compuesta sin modificarla nunca. La referencia completa también está disponible en <a href="${jsonUrl}">JSON</a> y en <a href="${llmsUrl}">llms-full.txt</a>.`,
    calloutAria: 'Cómo leer este registro',
    callout: `<p><strong>Lea esto primero.</strong> El Registro cataloga el oficio. Cada técnica con nombre es una forma de claridad, disciplina o preparación que hace que la versión <em>honesta</em> más sólida de un caso sea fácil de resolver para un tribunal ocupado. Si una técnica exigiera faltar a la franqueza ante el tribunal o al trato justo a la parte contraria, el Estándar la trata como un defecto.</p>
    <p>Ninguna técnica es obligatoria para ninguna calificación, y una moción puede obtener A+ sin que aparezca ninguna. El Registro hace otra pregunta: ¿qué hace la abogacía experta que la abogacía competente no hace?</p>`,
    uncategorized: 'Sin categoría',
    docTitle: (version) => `Estándar LexGrade v${version} — Registro de Técnicas`,
    description: (count) =>
      `El Registro de Técnicas LexGrade: ${count} técnicas de abogacía con nombre. Complemento informativo del Estándar. CC-BY-SA 4.0.`,
    partOfSpeech: (category, tier) => `Técnica de ${String(category).toLowerCase()}${tier ? ` · Nivel ${tier}` : ''}`,
    definition: 'Definición',
    example: 'Ejemplo',
    antiPattern: 'Antipatrón',
    requirements: 'Requisitos',
    howItDiffers: 'En qué se diferencia',
    all: '← Todas las técnicas',
    pageTitle: (name) => `${name} — Registro de Técnicas LexGrade`,
    fallbackDescription: (name) => `${name}: una técnica de abogacía con nombre en el Registro de Técnicas LexGrade. CC-BY-SA 4.0.`,
    ogSubtitle: 'Registro de Técnicas LexGrade',
    ogIndexSubtitle: (count, categories) => `${count} técnicas de abogacía con nombre en ${categories} categorías`,
  },
};

const STRINGS = { en, es };

/** The string table for a language (English when the language is unknown). */
export function strings(lang) {
  return STRINGS[lang] ?? STRINGS[DEFAULT_LANG];
}

// ── Narrative pages in translation ─────────────────────────────────────────
// Each entry returns what its English renderer in render.mjs builds inline: the
// header (title, subhead), the body HTML after the header, and the <title> and
// description. `repo` is the source repository URL; `p` prefixes a site path.

const p = (path) => localPath('es', path);
const ARROW = '<span aria-hidden="true">→</span>';

export const PAGES_ES = {
  home: ({ standardVersion, principleCount, criteriaCount, techniqueVersion, techniqueCount }) => ({
    docTitle: 'LexGrade — Calificación abierta de la calidad de la redacción legal',
    description:
      'Un estándar abierto para calificar mociones legales: los principios, los pesos y las penalizaciones, publicados íntegramente. CC-BY-SA 4.0.',
    body: `  <header class="home-hero">
    <h1 class="home-title">Un estándar abierto para calificar mociones legales.</h1>
    <p class="subhead">Sus principios, pesos y penalizaciones se publican íntegramente.</p>
    <p class="home-check">¿Presenta un escrito sin abogado? <a href="${p('/check')}">Revise su propia moción ${ARROW}</a> LexGrade no es asesoría legal.</p>
    <p class="callout home-evidence">La franqueza ante el tribunal va primero. Una sola cita inventada cuesta 20 puntos y hace que la moción sea Deficiente, sea cual sea su puntuación.</p>
  </header>
  <nav class="home-cards" aria-label="Estándar y Registro de Técnicas">
    <a class="home-card" href="${p('/standard')}">
      <h2 class="home-card__title">El Estándar LexGrade <span class="home-card__v">v${standardVersion}</span></h2>
      <p class="home-card__desc">${principleCount} principios y ${criteriaCount} criterios calificados, cada uno citable por separado.</p>
      <span class="home-card__cta">Leer el Estándar ${ARROW}</span>
    </a>
    <a class="home-card" href="${p('/techniques')}">
      <h2 class="home-card__title">Registro de Técnicas <span class="home-card__v">v${techniqueVersion}</span></h2>
      <p class="home-card__desc">${techniqueCount} técnicas de abogacía con nombre. Opcionales: nunca cambian la puntuación.</p>
      <span class="home-card__cta">Ver las técnicas ${ARROW}</span>
    </a>
  </nav>
  <p class="home-note">Los criterios provienen de la práctica de mociones en los tribunales estatales de Nueva York y en los federales. <a href="${p('/about')}">Acerca de LexGrade ${ARROW}</a></p>
  <aside class="home-invite" aria-label="Contribuir">
    <p class="home-invite__lead">Si usted litiga, ayude a dar forma al Estándar.</p>
    <a class="home-invite__link" href="${p('/contribute')}">Contribuya a LexGrade ${ARROW}</a>
  </aside>`,
  }),

  about: ({ repo }) => ({
    title: 'Acerca de LexGrade',
    subhead: 'Un estándar abierto de calificación para la redacción legal.',
    docTitle: 'Acerca de — LexGrade',
    description:
      'LexGrade es un estándar abierto de calificación para la redacción legal, basado en la práctica de mociones en los tribunales estatales de Nueva York y en los federales. CC-BY-SA 4.0.',
    aria: 'Acerca de LexGrade',
    body: `    <p>Los criterios de LexGrade provienen de la práctica de mociones en los tribunales estatales de Nueva York y en los federales. La premisa es que la función de un escrito es lograr que el tribunal actúe.</p>
    <h2>A quién va dirigido</h2>
    <p>LexGrade es para cualquier persona que redacte una moción, incluidas las que presentan sus escritos sin abogado. El Estándar expone, de una forma que cualquiera puede comprobar, qué distingue una moción sobre la que un tribunal puede actuar de una sobre la que no puede. El Registro de Técnicas pone nombre a lo que los litigantes con experiencia hacen por instinto. Ninguno de los dos promete ganar casos.</p>
    <h2>Estado</h2>
    <p>El Estándar está calibrado para la práctica de mociones en la Corte Suprema del Estado de Nueva York (<span lang="en">New&nbsp;York State Supreme Court</span>). Sus criterios y pesos no han sido validados de forma independiente. Las citas legales se verifican contra las fuentes oficiales, y la fecha aparece en el Estándar. El método se apoya en los trabajos académicos acreditados en <a href="${p('/references')}">Referencias</a>.</p>
    <h2>Límites</h2>
    <p>LexGrade <strong>no</strong> ha sido promulgado por ningún tribunal, colegio de abogados ni organismo gubernamental, no confiere autoridad alguna, y nada de lo que aquí aparece es asesoría legal. Verifique por su cuenta cada cita legal antes de presentar un escrito, incluidas las del Estándar.</p>
    <p>El <a href="${p('/standard')}">Estándar</a> y el <a href="${p('/techniques')}">Registro de Técnicas</a> tienen licencia CC-BY-SA 4.0 y se gobiernan de forma abierta. Cualquiera puede usarlos, ponerlos a prueba o <a href="${p('/contribute')}">mejorarlos</a>.</p>
    <h2>Correcciones</h2>
    <p>Para informar de una regla que cambió, una cita equivocada o un dato desactualizado, <a href="${repo}/issues/new?template=correction.yml">abra una corrección</a> o escriba a <a href="mailto:hello@lexgrade.org?subject=Correction">hello@lexgrade.org</a>. Los informes llegan al Grupo de Trabajo de LexGrade y se acusa recibo en un plazo de 14 días. Los errores de hecho se corrigen en la edición vigente y se registran en el historial de cambios. Los cambios en lo que exige un criterio pasan por el proceso público de RFC. Consulte la <a href="${repo}/blob/main/commons/GOVERNANCE.md#corrections" hreflang="en">política de correcciones</a> (en inglés).</p>`,
  }),

  check: ({ version, quickStartHtml }) => ({
    title: 'Cómo revisar su propia moción',
    subhead: 'Para quien presenta un escrito sin abogado.',
    docTitle: 'Cómo revisar su propia moción — LexGrade',
    description:
      'Cómo revisar una moción con el Estándar LexGrade, para quien presenta un escrito sin abogado. No es asesoría legal.',
    aria: 'Cómo revisar una moción',
    body: `    <h2>Antes de presentarla</h2>
    <p>Una moción le pide al juez que decida u ordene algo en su caso. En los tribunales de Nueva York los escritos se presentan en inglés.</p>
    <ol>
      <li>Primero cumpla con las reglas del tribunal para presentar escritos, como la notificación de moción (<span lang="en">notice of motion</span>) y la prueba de notificación (<span lang="en">proof of service</span>). LexGrade no las cubre.</li>
      <li>Compare su borrador con cada principio de la tabla. Cada uno enlaza con sus requisitos en el Estándar.</li>
      <li>Busque cada caso y cada ley que cite y confirme que dice lo que usted afirma. Las herramientas de inteligencia artificial inventan casos, y los tribunales han sancionado a personas por citarlos.</li>
    </ol>
    <h2>Los ocho principios</h2>
    <div class="quick-start wide-tables">
    <p>De la §9 del Estándar LexGrade v${version}</p>
${quickStartHtml}
    </div>
    <h2>Lo que no puede hacer</h2>
    <p>LexGrade no es asesoría legal y no puede predecir una decisión. Se escribió para la Corte Suprema del Estado de Nueva York (<span lang="en">New&nbsp;York State Supreme Court</span>); las reglas de otros tribunales son distintas.</p>
    <h2>¿Algo no está claro?</h2>
    <p>Escriba a <a href="mailto:contribute@lexgrade.org?subject=Unclear">contribute@lexgrade.org</a> y diga qué.</p>`,
  }),

  contribute: ({ repo }) => ({
    title: 'Ayude a construir el estándar',
    subhead: 'Cómo proponer cambios al Estándar.',
    docTitle: 'Contribuir — LexGrade',
    description:
      'Ayude a dar forma a LexGrade: proponga criterios, calibre nuevas jurisdicciones y nombre técnicas. Un estándar abierto, CC-BY-SA 4.0.',
    aria: 'Cómo contribuir',
    body: `    <h2>Dónde puede aportar</h2>
    <ul>
      <li><strong>Proponga o cuestione un criterio.</strong> Si alguno es incorrecto, está incompleto o tiene un peso inadecuado, presente sus razones.</li>
      <li><strong>Calibre una jurisdicción.</strong> Ayude a extender el Estándar más allá de la práctica de mociones en la Corte Suprema del Estado de Nueva York.</li>
      <li><strong>Nombre una técnica.</strong> Si usted se apoya en una que el Registro de Técnicas no nombra, agréguela.</li>
    </ul>
    <h2>Cómo se hacen los cambios</h2>
    <p>Los cambios de fondo comienzan como una propuesta pública <code>rfc:</code>, se aceptan por consenso general y se publican en una edición con número de versión que da crédito a quienes contribuyeron.</p>
    <h2>Dos formas de empezar</h2>
    <p><strong>En GitHub.</strong> Abra un <a href="${repo}/issues/new">issue rfc:</a>, o lea la <a href="${repo}/blob/main/.github/CONTRIBUTING.md" hreflang="en">guía de contribución</a> (en inglés).</p>
    <p><strong>Por correo electrónico.</strong> Envíe una nota breve a <a href="mailto:contribute@lexgrade.org">contribute@lexgrade.org</a>. Se convertirá en una propuesta, con crédito.</p>
    <p class="note">LexGrade no confiere autoridad alguna y nada de lo que aquí aparece es asesoría legal. Contribuir no crea una relación abogado-cliente ni ninguna obligación profesional.</p>`,
  }),

  references: () => ({
    title: 'Fuentes e influencias',
    subhead: 'Los criterios y los pesos son propios de LexGrade. El método se apoya en los trabajos acreditados aquí.',
    docTitle: 'Referencias — LexGrade',
    description:
      'Los trabajos académicos en que se apoya el método de rúbrica de LexGrade y la autoridad legal contra la que se calibra. CC-BY-SA 4.0.',
    aria: 'Fuentes e influencias',
    body: `    <h2>Trabajos académicos</h2>
    <p>El método de rúbrica de LexGrade (componentes ponderados, valores de puntos con tope y bandas descriptivas de desempeño) adapta a la práctica de mociones los estudios sobre la evaluación de la redacción legal, en particular:</p>
    <ul>
      <li lang="en">Jessica Clark &amp; Christy DeSanctis, <em>Toward a Unified Grading Vocabulary: Using Rubrics in Legal Writing Courses</em>, 63 J. Legal Educ. 3 (2013).</li>
    </ul>
    <p>No se reproduce aquí ningún texto de rúbrica ni apéndice de la obra citada; LexGrade expone sus criterios con sus propias palabras.</p>
    <h2>Base empírica</h2>
    <p>Las cifras de alucinación en la justificación del filtro ético del Estándar provienen de:</p>
    <ul>
      <li><span lang="en">Matthew Dahl, Varun Magesh, Mirac Suzgun &amp; Daniel E. Ho, <em>Large Legal Fictions: Profiling Legal Hallucinations in Large Language Models</em>, 16 J. Legal Analysis 64 (2024)</span>, <a href="https://doi.org/10.1093/jla/laae003">doi:10.1093/jla/laae003</a>. El estudio midió las tasas de alucinación en las respuestas de los modelos a preguntas verificables sobre casos de tribunales federales: 58% en ChatGPT-4 y hasta 88% en Llama 2.</li>
    </ul>
    <h2>Autoridad de calibración</h2>
    <p>La calibración se mide contra las <span lang="en">New York Civil Practice Law and Rules</span> (CPLR) y las <span lang="en">Uniform Civil Rules for the Supreme and County Courts</span> (22 NYCRR Part 202).</p>
    <p class="note">Apoyarse en una fuente no implica que esa fuente respalde a LexGrade. LexGrade no confiere autoridad alguna, y nada de lo que aquí aparece es asesoría legal. Para informar de una fuente mal utilizada o sin crédito, consulte <a href="${p('/contribute')}">Contribuir</a>.</p>`,
  }),
};
