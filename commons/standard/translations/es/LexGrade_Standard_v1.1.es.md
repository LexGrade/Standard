# Estándar LexGrade (LGS) — Versión 1.1

> **Traducción.** Este documento es una traducción al español del LexGrade Standard v1.1. El texto en inglés es el que rige; ante cualquier diferencia, vale el texto en inglés. Las citas de leyes, reglas, casos y obras se dejan en su forma original. En los tribunales de Nueva York los escritos se presentan en inglés, por lo que los términos que aparecen en los formularios se dan también en inglés entre paréntesis. Informe los errores de traducción por el canal de correcciones indicado en GOVERNANCE.md.

> **No es asesoría legal; no tiene autoridad.** LexGrade es un estándar abierto, mantenido de forma independiente; no ha sido promulgado por ningún tribunal, colegio de abogados ni organismo gubernamental, y no confiere ninguna autoridad. Nada de lo que aquí aparece es asesoría legal. Toda cita legal, ya sea en este documento o en cualquier moción redactada o evaluada con él, debe verificarse de forma independiente en el repertorio oficial antes de presentarla.

> El Estándar LexGrade (LGS) es la forma pública y citable de la metodología
> de evaluación de mociones de LexGrade: un estándar para puntuar mociones
> legales, inspirado en las Web Content Accessibility Guidelines del W3C
> (Principios → Criterios con ID estables → Niveles de conformidad).

**Nombre.** Estándar LexGrade (LGS). El nombre sigue la marca de servicio LexGrade.
Las bifurcaciones (forks) con otro nombre son expresamente bienvenidas conforme a
la política de marcas (véase GOVERNANCE.md).

**Alcance.** LGS v1.1 está calibrado para la práctica de mociones ante la Corte Suprema del Estado de Nueva York (New York State Supreme Court). Hace
referencia a la autoridad del Estado de Nueva York (CPLR, 22 NYCRR, NY RPC) **solo como fuente
de las expectativas de calidad que mide, nunca como requisitos que imponga.** El
**marco** de principios, pesos y niveles de conformidad es
neutral respecto de la jurisdicción, mientras que el **texto de los criterios y la calibración están anclados en Nueva York**.
Por eso, llevarlo a otro foro requiere un perfil jurisdiccional y no un simple
buscar y reemplazar. Varios criterios citan directamente autoridad específica de Nueva York (p. ej.,
números de reglas del CPLR o de 22 NYCRR); un perfil sustituye la autoridad que rige:
las FRCP en lugar del CPLR, las reglas locales en lugar de 22 NYCRR, la autoridad del circuito en lugar de la
autoridad de la Appellate Division.

**Destinatarios.** Autoevaluación de profesionales; evaluación comparativa de resultados de modelos de lenguaje (LLM); enseñanza de
la redacción jurídica; cita académica.

**Licencia.** CC-BY-SA 4.0. © 2026 LexGrade. Las obras derivadas deben llevar
la misma licencia y atribuir la autoría a LexGrade. Cítese como: "LexGrade Standard
v1.1, LexGrade (lexgrade.org), CC-BY-SA 4.0."

**Qué cambió en la v1.1.** Una revisión menor: se añadieron dos criterios (LGS 3.10
Síntesis de casos; LGS 5.6 Estructura analítica), una declaración de lo que se ha
demostrado y lo que no se ha demostrado que el instrumento mide (§3, *Validez y sus
límites*), y una regla sobre cómo se informa la puntuación compuesta (§6, *Informe de la
puntuación compuesta*). No cambió ningún peso, deducción, regla de filtro ni umbral de
conformidad, y no se movió ningún ID de criterio existente. La lista completa está en §13,
*Historial de ediciones*. La v1.0 sigue publicada y es citable.

**Nota de vigencia.** Todas las citas de leyes, reglamentos y estudios empíricos se
verificaron a febrero de 2026 y no se volvieron a verificar para la v1.1. Los
estudios académicos sobre educación jurídica añadidos en la v1.1 (§12) se verificaron a octubre de
2026. El 22 NYCRR se enmienda periódicamente; las tasas de alucinación de los LLM cambian a medida que
los modelos mejoran. Los usuarios deben confirmar que las disposiciones citadas siguen vigentes. Informe
las correcciones por el canal indicado en GOVERNANCE.md (*Correcciones*).

---

## Índice

1. Introducción
2. Cómo está estructurado el Estándar
3. Principios y pesos
4. Principios y criterios
   - Principio 1 — Integridad procesal (Condición previa)
   - Principio 2 — Diagnóstico del problema
   - Principio 3 — Autoridad legal
   - Principio 4 — Fundamento fáctico
   - Principio 5 — Redacción y organización
   - Principio 6 — Sofisticación estratégica
   - Principio 7 — Ética y franqueza (Filtro)
   - Principio 8 — Autoevaluación
5. Niveles de conformidad
6. Puntuación compuesta
7. Registro de Técnicas (informativo)
8. Seguimiento de resultados
9. Guía rápida en lenguaje sencillo
10. Hoja de puntuación
11. Tabla de correspondencias
12. Fundamento normativo
13. Versiones y licencia
---

## 1. Introducción

El **Estándar LexGrade (LGS)** es un marco de calidad abierto y citable
para evaluar la redacción de mociones legales. Estructura los criterios de
evaluación de la metodología LexGrade como criterios numerados y estables en un
formato por capas: Principios → Criterios, cada uno con un ID estable y un requisito
normativo, que se resuelven en Niveles de conformidad.

**Propósito.** LGS ofrece:

- Una referencia de cita estable para profesionales, educadores e investigadores.
- Una formulación pública de la metodología que un lector puede usar sin tener que descifrar
  una rúbrica de puntuación dirigida a profesionales.
- Una base para perfiles jurisdiccionales y ajustes por tipo de moción sin
  alterar los criterios de base.

**Qué es esto.** Un instrumento de evaluación en funcionamiento. Contiene todo el contenido
operativo necesario para calificar una moción: requisitos por criterio, descriptores
de las bandas de puntuación, una jerarquía de autoridades, deducciones automáticas, ajustes por tipo de moción,
una guía de evaluación comparativa, una guía rápida en lenguaje sencillo y una hoja de puntuación.

**Qué no es esto: un reglamento procesal.** LGS **no** reproduce el
CPLR, las Reglas Uniformes (Uniform Rules), las Reglas de Conducta Profesional (Rules of Professional Conduct) ni los requisitos de presentación
de ningún tribunal, y **no los sustituye.** Si un escrito es
procesalmente correcto (epígrafe (caption), notificación de moción (notice of motion), documentos de respaldo, notificación a las partes (service), extensión,
orden propuesta (proposed order)) lo determina la autoridad que rige en el tribunal donde se presenta,
no este Estándar (véase el Principio 1). LGS mide la **calidad de la redacción:** el
razonamiento, la autoridad, el fundamento fáctico, la redacción, la estrategia, la franqueza y la
autoevaluación de una moción.

**Cómo usar el Estándar.**

*Para la autoevaluación de profesionales.* Redacte su moción y luego puntúela
principio por principio con la Hoja de puntuación. Si
algún principio obtiene menos de A− (92), identifique la deficiencia específica y revise
antes de presentar. Preste atención a las deducciones automáticas:
una sola cita inventada (−20) puede bajar una A a una B.

*Para la evaluación comparativa de LLM.* Dé al modelo un caso hipotético (hechos, remedio solicitado, documentos
clave) y pídale una moción completa. Puntúe el resultado frente a cada
principio. **Contexto empírico:** en un estudio de 2024, los LLM de uso general
alucinaron en el 58–88% de sus respuestas a preguntas verificables sobre casos de
tribunales federales (Dahl et al., "Large Legal Fictions," 16 J. Legal Analysis 64
(2024)); incluso las principales herramientas de investigación jurídica con IA alucinaron en el 17–33% de
las respuestas (Magesh et al., "Hallucination-Free?," 22 J. Empirical Legal Stud.
216 (2025)). El paso de
verificación de citas no es opcional. Asigne a cada modelo un Nivel de conformidad con la
Guía de comparación de LLM. Cuando LGS aplica las normas de NY RPC
a los resultados de un LLM, usa las reglas de responsabilidad profesional como referencias de calidad,
no como afirmación de que los resultados de la IA estén sujetos al régimen disciplinario
de los abogados.

*Para la enseñanza de la redacción jurídica.* Distribuya el Estándar con antelación para que los estudiantes
conozcan el nivel exigido. Califique con la misma hoja; las deducciones y los modificadores dan
comentarios específicos y aplicables. Las preguntas del Principio 8 sirven como ejercicio
de reflexión aparte.

*Ajustes de peso según el destinatario.* Los pesos de base que figuran abajo se aplican a los tres
destinatarios. Los usuarios pueden ajustar ±5% por principio según el contexto (p. ej., los profesionales pueden
subir el Principio 6 para la revisión previa a la presentación; los educadores pueden subir el Principio 8;
quienes hacen evaluación comparativa pueden subir el Principio 3). Documente cualquier ajuste en la hoja.

---

## 2. Cómo está estructurado el Estándar

LGS está organizado por capas: grupos temáticos de requisitos estables y con nombre que se resuelven en
niveles de conformidad.

| Capa | LGS |
|-------|------|
| Tema | **Principio** (P1–P8) — un grupo temático de criterios relacionados |
| Requisito | **Criterio** (`LGS P.C`) — un único requisito normativo con un ID estable |
| Resultado | **Nivel de conformidad** (Experto / Competente / Deficiente) |

**ID de los criterios.** Un criterio se identifica con `LGS P.C`, donde `P` es el
número del Principio y `C` es el criterio dentro de ese Principio (p. ej.,
`LGS 3.5`). Los ID son estables entre revisiones menores; un criterio se renumera
solo cuando se reemplaza en lo sustancial, y en ese momento el ID anterior se retira (nunca
se reutiliza). Un criterio añadido en una revisión menor toma el siguiente número sin usar de
su Principio (la v1.1 añadió LGS 3.10 y LGS 5.6) y los ID existentes no se mueven.
Cada criterio enuncia un **requisito normativo** en lenguaje sencillo; la
columna "Fuente" remite al texto de la metodología subyacente que es su base
autorizada o, en el caso de un criterio añadido después de la v1.0, a la edición que lo introdujo y
a los estudios académicos en que se apoya.

**Dos filtros y seis Principios puntuados.** El Principio 1 es una **condición
previa** procesal que quien presenta el escrito cumple de forma independiente (LGS no la puntúa).
El Principio 7 es un **filtro de franqueza** con deducciones graduadas. Los seis Principios
puntuados (P2–P6, P8) componen la puntuación compuesta de 100 puntos. El Registro de Técnicas
(§7) es informativo y no modifica la puntuación compuesta.

**Criterios no aplicables (N/A).** Un criterio se marca **N/A** cuando el tipo de
moción lo hace improcedente, nunca para excusar un defecto. Ejemplos: LGS 6.3
(Estrategia de mociones múltiples) es N/A para una primera moción independiente sin escritos
relacionados; LGS 6.4 (Dominio interdisciplinario) es N/A cuando no interviene ningún campo
no jurídico; LGS 4.2 (Fundamento probatorio) es N/A para una cuestión puramente de derecho
que no se apoya en prueba documental. Los criterios cuyo texto ya incluye
"cuando corresponda", "cuando sea pertinente" o "si corresponde" son los candidatos explícitos
a N/A.

Un criterio N/A se **excluye del denominador de su principio**, donde
ni ayuda ni perjudica la puntuación. En concreto: califique un principio con los criterios
que **sí** se aplican y luego asigne a partir de ellos la calificación de 0–100 del principio; el
**peso del principio en §6 no cambia** (de modo que la puntuación compuesta sigue sumando 80
puntos ponderados y sigue siendo reproducible). N/A es un juicio sobre la aplicabilidad,
que se registra con una razón de una línea en la hoja. "El redactor lo omitió" es una
deficiencia que se puntúa bajo el criterio, nunca un N/A. En caso de duda, el
criterio **se aplica**; N/A es una excepción estrecha.

---

## 3. Principios y pesos

| ID | Principio | Fuente en la metodología | Función |
|----|-----------|--------------------|------|
| P1 | Integridad procesal | §I Cumplimiento de los requisitos de umbral | Condición previa — remitida a las reglas del tribunal; no se puntúa |
| P2 | Diagnóstico del problema | §II-A Diagnóstico del problema | Ponderado — 10% |
| P3 | Autoridad legal | §II-B Análisis jurídico y autoridad | Ponderado — 20% |
| P4 | Fundamento fáctico | §III Presentación de los hechos y respaldo probatorio | Ponderado — 18% |
| P5 | Redacción y organización | §IV Redacción y organización | Ponderado — 12% |
| P6 | Sofisticación estratégica | §V Sofisticación estratégica | Ponderado — 10% |
| P7 | Ética y franqueza | §VI Cumplimiento ético | Filtro + deducciones graduadas |
| P8 | Autoevaluación | §VII Autoevaluación y práctica reflexiva | Ponderado — 10% |

Los seis Principios puntuados (P2–P6, P8) suman **80 puntos ponderados**, que se escalan a una
puntuación compuesta de 100 puntos (§6). P1 es una condición previa; P7 es un filtro cuyas deducciones se
restan de la puntuación compuesta.

**Nota metodológica (calibración de los pesos).** Los pesos están calibrados según tres
factores: (1) la gravedad de las sanciones conforme a 22 NYCRR §130-1.1 (mayor peso donde los
errores dan lugar a sanciones); (2) el orden de prioridad de la decisión judicial (los tribunales
evalúan el cumplimiento de los requisitos de umbral antes que el fondo, y el fondo antes que el estilo); y
(3) el poder de discriminación para la evaluación comparativa de LLM (los principios en los que el resultado humano y el de la IA
más divergen reciben mayor peso). La deducción de −20 por citas alucinadas
refleja tanto su carácter sancionable como su frecuencia empírica.

### Validez y sus límites

Una puntuación solo tiene el significado de la inferencia que se quiere sostener con ella. Esta
subsección indica qué inferencias puede sostener hoy el Estándar y cuáles
no, para que nadie lea en un número más de lo que la evidencia permite. Es
normativa en cuanto a cómo se describen las puntuaciones (véase §6, *Informe de la
puntuación compuesta*) e informativa en cuanto a la base de evidencia del instrumento.

**Lo que el Estándar puede sostener.**

- *Validez de contenido.* Cada criterio remite a una fuente declarada: la
  jerarquía de autoridades, las reglas de conducta profesional, la regla de sanciones
  o estudios académicos identificados (§11, §12). Los criterios describen lo que las guías
  de práctica, las Reglas de Conducta Profesional y la pedagogía de la redacción jurídica
  ya tratan como los elementos de una moción sólida. Un lector puede auditar esa
  correspondencia línea por línea.
- *Un vocabulario compartido.* Los criterios dan a evaluadores, estudiantes y redactores
  los mismos términos con nombre para las mismas cualidades, que es el propósito
  primordial de una rúbrica en la enseñanza de la redacción jurídica (Clark & DeSanctis 2013).
  Cuando dos evaluadores que usan el Estándar discrepan, discrepan sobre algo que tiene
  nombre, y eso es lo que hace que la discrepancia pueda resolverse.
- *Discriminación a nivel del autor.* El instrumento separa escritos modelo redactados
  para ser Experto, Competente y Deficiente sobre hechos idénticos cuando su autor
  los puntúa. Eso solo muestra que el instrumento puede separar lo que su
  autor escribió para que quedara separado. No dice nada sobre la fiabilidad, por lo que esos
  materiales quedan fuera del árbol publicado hasta que evaluadores independientes los hayan
  puntuado (véase la hoja de ruta del proyecto).

**Lo que el Estándar todavía no puede sostener.**

- *Fiabilidad entre evaluadores.* No se ha realizado ninguna ronda con evaluadores independientes. Hasta
  que se mida el acuerdo (el objetivo previsto es un α de Krippendorff ≥ 0.80 en
  las calificaciones por principio), una puntuación compuesta refleja la aplicación de
  los criterios por un solo evaluador, y cabe esperar que las puntuaciones compuestas de dos evaluadores
  para la misma moción difieran.
- *Validez de criterio y predictiva.* No se ha medido ninguna correlación entre las puntuaciones LGS y
  los resultados (concesión, denegación, acuerdo, resultado en apelación).
  La §8 enuncia la hipótesis y la muestra que haría falta; sigue sin ponerse a prueba.
- *Validez de los pesos.* Los pesos de esta sección se fijaron con el razonamiento
  expuesto arriba, sin datos. Una ponderación distinta y defendible movería
  las puntuaciones compuestas varios puntos sin cambiar ningún hallazgo por criterio,
  lo cual es una de las razones por las que los hallazgos por criterio son el resultado principal
  (§6).
- *Transferencia.* La calibración corresponde a la práctica de mociones ante la Corte Suprema del Estado de Nueva York.
  No se ha medido nada en ningún otro foro. Un perfil jurisdiccional traslada
  el texto de los criterios; no lleva consigo evidencia de validez.

**Validez consecuencial (efecto de arrastre (washback)).** Una evaluación cambia lo que
mide. Redactar *para* los criterios puede producir la forma de una cualidad
sin su sustancia: una sección de "autoevaluación" que no nombra ninguna debilidad
real, un párrafo de autoridad adversa que no distingue nada, una
síntesis que repite una cadena de citas, un argumento reformado para exhibir una
técnica del Registro. Los sistemas de evaluación que no se diseñan ni se coordinan
teniendo en cuenta este efecto pierden validez a medida que se adoptan (Gustafson 2024).
El Estándar se protege contra ello de tres maneras, y los usuarios deben conservar las
tres: los descriptores de las bandas de puntuación premian el contenido *específico y con nombre* y limitan
el cumplimiento genérico al rango de la B; el Registro de Técnicas nunca se puntúa, de modo que
no se gana nada metiendo una técnica a la fuerza; y la regla de presentación de
la §6 pone los hallazgos por criterio antes que la puntuación compuesta, de modo que al redactor se le
dice qué se encontró antes de decirle un número. La evidencia de que los comentarios específicos
e individualizados mejoran el trabajo jurídico posterior (Sargent & Curcio 2012;
Schwarcz & Farganis 2017) es la razón por la que el instrumento está construido primero como un mecanismo
de retroalimentación y después como una puntuación.

**Qué significa esto para un usuario.** "Esta moción obtuvo 91 según LexGrade
Standard v1.1" es una afirmación sobre cómo un evaluador aplicó una rúbrica
publicada en una fecha indicada. No es una afirmación de que la moción será
concedida, de que otro evaluador llegaría a 91, ni de que una moción de 91 sea mejor
que una de 89 en algún aspecto que los hallazgos por criterio no muestren. El
proyecto invita a realizar los estudios de fiabilidad entre evaluadores y de resultados que cambiarían esta
subsección, y la revisará cuando existan.

---

## 4. Principios y criterios

### Principio 1 — Integridad procesal (Condición previa — remitida a las reglas del tribunal)

*El cumplimiento procesal es una condición previa que quien presenta el escrito debe satisfacer de forma independiente.
LGS no lo reproduce, no lo enumera ni lo puntúa. Un escrito que no es procesalmente
correcto no puede prosperar en cuanto al fondo; pero determinar qué exige ser "correcto"
corresponde a las reglas del tribunal donde se presenta, no a este Estándar.*

**Enunciado del principio.** Los requisitos de una moción correctamente formada —epígrafe,
notificación de moción, afirmación (affirmation) o declaración jurada (affidavit) de respaldo, memorando de derecho (memorandum of law), prueba
de notificación (proof of service), reglas individuales de la sala (individual-part rules), límites de extensión y orden propuesta— los fijan
las reglas del tribunal en el que se presenta la moción. LGS no las reproduce.
Repetir el derecho procesal duplicaría fuentes autorizadas que ya
rigen, quedaría desactualizado en el momento en que se enmiende una regla o difiera la práctica
de un condado, y está fuera del alcance propio de un estándar de calidad de redacción.

En la práctica ante la Corte Suprema del Estado de Nueva York, las fuentes que rigen son el **CPLR**
(en particular el Artículo 22; p. ej., CPLR 2103 notificación, 2106 afirmaciones, 2214 documentos
de la moción, 2219 órdenes), las **Reglas Civiles Uniformes para la Corte Suprema y las Cortes de
Condado (Uniform Civil Rules for the Supreme and County Courts)** (22 NYCRR Part 202, incluidos los límites de extensión de 202.8-b) y las
**Reglas Individuales de la Sala (Individual Part Rules)** del juez asignado. Quien presenta el escrito es responsable de
identificar y cumplir todos los requisitos que esas fuentes imponen.

> **Qué hace y qué no hace LGS aquí.** LGS **no** comprueba si su
> epígrafe, notificación de moción, documentos de respaldo, notificación a las partes, extensión u orden propuesta
> cumplen; esa determinación corresponde al reglamento del tribunal. Confirme
> el cumplimiento de forma independiente: los formularios del propio tribunal, una guía de práctica
> actualizada del CPLR, el centro de autoayuda de su tribunal o un abogado. **Un litigante sin abogado (pro se) no debe
> interpretar la ausencia de estos elementos en los criterios de LGS como permiso para omitirlos.
> Significa lo contrario: los exige la ley, que LGS
> deliberadamente no reproduce.** La única cuestión de integridad que LGS evalúa
> por sí mismo, si cada cita se refiere a una decisión que realmente existe,
> se puntúa bajo el Principio 7 (Ética y franqueza), donde corresponde como
> asunto del deber de franqueza.

Este Principio no contiene criterios LGS puntuados; los ID de criterios puntuados comienzan en
LGS 2.1.

**Nota de evaluación comparativa.** Los modelos omiten con frecuencia la orden propuesta, la
certificación y el cumplimiento de las Reglas Individuales de la Sala. En los estudios del Stanford RegLab
(Dahl et al. 2024; Magesh et al. 2025), los elementos procesales de umbral
estuvieron entre los componentes que más a menudo faltaban en los textos jurídicos generados por LLM,
lo que revela si el entrenamiento refleja la práctica real de Nueva York o solo el derecho de los tratados. Un
entorno de evaluación comparativa puede registrar las omisiones procesales de forma descriptiva; no forman
parte de la puntuación compuesta de LGS.

---

### Principio 2 — Diagnóstico del problema (10%)

**Enunciado del principio.** La moción identifica correctamente la naturaleza del problema
jurídico —una cuestión puramente de derecho, una disputa de hecho que requiere desarrollo o una
cuestión mixta que requiere un encuadre cuidadoso— y selecciona la vía procesal
adecuada. La caracterización determina todas las decisiones analíticas posteriores.

| ID | Título | Requisito | Fuente |
|----|-------|-------------|--------|
| LGS 2.1 | Caracterización de la cuestión | La moción caracteriza correctamente la disputa como una cuestión de derecho, de hecho o mixta, y explica por qué. | §II-A, descriptor de A+ |
| LGS 2.2 | Selección de la vía procesal | La vía procesal seleccionada es la que obtiene el remedio solicitado con el expediente disponible; la moción enuncia los elementos de la vía y muestra que los hechos cumplen cada uno. | §II-A, descriptor de A+ |
| LGS 2.3 | Análisis de vías alternativas | La moción explica por qué se consideraron y se descartaron vías procesales alternativas. | §II-A, descriptor de A+ |
| LGS 2.4 | Vínculo entre diagnóstico y estrategia | La moción muestra cómo la caracterización del problema determina las decisiones analíticas y estratégicas posteriores. | §II-A, descriptor de A+ |

**Bandas de puntuación.**

| Puntuación | Criterios |
|-------|----------|
| A+ (98–100) | El diagnóstico es preciso, identifica la vía procesal exacta y explica por qué se descartaron las alternativas. Si el planteamiento del usuario sugiere una vía más fuerte, lo dice. Domina la relación entre el diagnóstico y la estrategia posterior. |
| A (95–97) | Diagnóstico correcto con la vía adecuada. Laguna menor: no aborda las alternativas o no explica por qué la vía elegida es la más fuerte. |
| A− (92–94) | Correcto en lo sustancial pero impreciso en el encuadre. La vía es adecuada pero no óptima. |
| B+ (88–91) | Se identifica el estándar correcto; al análisis le falta profundidad en un elemento importante del diagnóstico. |
| B (83–87) | Diagnóstico adecuado; caracterización superficial que no aborda los matices procesales. |
| B− (80–82) | Correcto a grandes rasgos pero contiene un error de diagnóstico significativo. |
| C+ (77–79) | Identifica mal el estándar o la naturaleza de la disputa; recuperable pero perjudicial. |
| C o inferior | Caracterización fundamentalmente errónea que lleva a la vía, el estándar o el remedio equivocados. |

**Nota de evaluación comparativa.** Los modelos suelen recurrir por defecto al tipo de moción más común (p. ej.,
sentencia sumaria (summary judgment)) sin comprobar si los hechos lo respaldan. Verifique si el
modelo considera vías alternativas.

---

### Principio 3 — Autoridad legal (20%)

**Enunciado del principio.** La moción identifica y aplica la autoridad que rige
con precisión, y demuestra una metodología de interpretación de la ley, el razonamiento
analógico como destreza afirmativa y la atención al fundamento de política pública. La autoridad
adversa se revela y se distingue.

| ID | Título | Requisito | Fuente |
|----|-------|-------------|--------|
| LGS 3.1 | Texto de la ley | Para cada argumento jurídico, se cita la ley aplicable y se transcribe su lenguaje operativo. | §II-B, Jerarquía de autoridades (a) |
| LGS 3.2 | Autoridad vinculante | Para cada argumento se cita al menos una decisión vinculante sobre hechos análogos. | §II-B, Jerarquía de autoridades (b) |
| LGS 3.3 | Autoridad persuasiva | La autoridad persuasiva (otros departamentos, tribunales federales, tratados) complementa la autoridad vinculante cuando corresponde. | §II-B, Jerarquía de autoridades (c) |
| LGS 3.4 | Fuentes administrativas y de práctica | Se identifican las órdenes administrativas, las Reglas Uniformes, los formularios de la OCA o las guías de práctica aplicables. | §II-B, Jerarquía de autoridades (d) |
| LGS 3.5 | Autoridad adversa | La autoridad contraria más fuerte se revela y se distingue de manera específica. | §II-B, Jerarquía de autoridades (e); NY RPC 3.3(a)(2) |
| LGS 3.6 | Carga de la prueba | La carga de la prueba se identifica correctamente, incluida la parte a la que corresponde en cada etapa. | §II-B, Criterios específicos de evaluación |
| LGS 3.7 | Metodología de interpretación de la ley | La interpretación avanza del texto → historia legislativa → propósito de política pública, no por mera afirmación. | §II-B, Criterios específicos de evaluación; Gluck |
| LGS 3.8 | Razonamiento analógico | El razonamiento analógico se emplea como destreza afirmativa, distinta de la de distinguir casos adversos. | §II-B, Criterios específicos de evaluación; Sherwin |
| LGS 3.9 | Fundamento de política pública | La moción aborda el propósito de política pública de la ley aplicable, no solo su texto. | §II-B, Criterios específicos de evaluación; Gluck |
| LGS 3.10 | Síntesis de casos | Cuando la regla aplicable se extrae de más de una autoridad, la moción enuncia la regla que esas autoridades establecen en conjunto, muestra cómo contribuye cada una y aplica la regla sintetizada; una secuencia de descripciones de casos o de paréntesis explicativos sin una regla enunciada no es una síntesis. | v1.1; Clark & DeSanctis |

**La síntesis de casos y el razonamiento analógico son destrezas distintas.** LGS 3.8
puntúa el uso de una *sola* autoridad: este caso se parece al nuestro en los aspectos
que le importaron a ese tribunal, así que su resultado debe seguirse aquí. LGS 3.10 puntúa
el paso anterior, el de digerir *varias* autoridades en una sola regla que el tribunal
pueda aplicar: "Leídos en conjunto, *A*, *B* y *C* resuelven que [regla], porque [lo que
cada uno aporta]". Una moción puede hacer una cosa sin la otra. La síntesis se puntúa
solo cuando más de una autoridad incide en la regla; cuando una sola
decisión que rige enuncia la regla, LGS 3.10 es N/A (§2), nunca una
deficiencia.

**Lista de verificación de la jerarquía de autoridades (obligatoria).** Para cada argumento jurídico distinto,
la moción debe completar las cinco categorías:

| Categoría | Contenido requerido | Clasificación de fuerza |
|----------|-----------------|-----------------|
| (a) Texto de la ley | Ley aplicable con su lenguaje operativo transcrito | Obligatoria |
| (b) Autoridad vinculante | Caso de la Court of Appeals o de la Appellate Division que rige, sobre hechos análogos | Que rige / De apoyo |
| (c) Autoridad persuasiva | Otros departamentos, tribunales federales, tratados, decisiones de primera instancia | De apoyo / De contexto |
| (d) Administrativa / de práctica | Formularios de la OCA, Reglas Uniformes, órdenes administrativas, guías de práctica | De apoyo / De contexto |
| (e) Autoridad adversa | El caso contrario más fuerte con la distinción prevista | Obligatoria |

La categoría (d) es la que más a menudo se pasa por alto: los formularios de la OCA, las Reglas
Uniformes y las órdenes administrativas.
La categoría (e) es obligatoria conforme a NY RPC 3.3(a)(2): el abogado debe revelar la autoridad que rige
directamente adversa que la parte contraria no haya revelado.

**Bandas de puntuación.**

| Puntuación | Criterios |
|-------|----------|
| A+ (98–100) | Las cinco categorías de autoridad completas y empleadas. Metodología de interpretación explícita. Razonamiento analógico mostrado como destreza afirmativa. Cuando varias autoridades inciden en la regla, se sintetizan en una sola regla enunciada antes de aplicarla. Autoridad adversa distinguida de manera específica. Fundamento de política pública abordado. Ninguna laguna conocida en la autoridad que rige. |
| A (95–97) | Dominio sólido de todas las categorías; laguna menor en una (p. ej., no se localizaron fuentes administrativas o de práctica, o no se abordó el fundamento de política pública). |
| A− (92–94) | Análisis sólido con una laguna significativa: falta una categoría de autoridad, o la autoridad adversa se aborda pero no se distingue del todo. |
| B+ (88–91) | Estándar correcto con autoridad adecuada; falta profundidad en un elemento importante. Puede apoyarse en menos de cuatro categorías. |
| B (83–87) | Exposición adecuada del derecho; depende en exceso de fuentes secundarias o de la recitación de manual sin aplicar la autoridad a los hechos. |
| B− (80–82) | Correcto a grandes rasgos pero contiene un error u omisión analíticos significativos. |
| C+ (77–79) | Identifica mal el estándar o la carga de la prueba; recuperable pero perjudicial. |
| C o inferior | Incomprensión fundamental del derecho aplicable; probablemente llevaría a la denegación. |

**Nota de evaluación comparativa.** Los modelos citan con frecuencia las leyes correctas pero las aplican
mecánicamente, sin metodología interpretativa. La mera afirmación "la ley
dispone", sin jurisprudencia que muestre cómo la aplican los tribunales, es el patrón de falla de LLM
más común en este Principio (deducción automática de −5). Un segundo patrón
es la cadena sin sintetizar: tres o cuatro casos descritos en secuencia, cada uno
con un paréntesis explicativo, y ninguna oración que enuncie qué regla establecen
en conjunto. LGS 3.10 puntúa eso como una lista.

---

### Principio 4 — Fundamento fáctico (18%)

**Enunciado del principio.** Toda afirmación de hecho importante está respaldada por
prueba admisible en la forma debida. La moción demuestra honestidad intelectual
sobre los límites de la prueba disponible sin ceder la posición jurídica.

| ID | Título | Requisito | Fuente |
|----|-------|-------------|--------|
| LGS 4.1 | Conocimiento personal | Las afirmaciones se basan en el conocimiento personal (el estándar que el CPLR fija para las afirmaciones de abogados y las declaraciones juradas de las partes). | §III, Criterios específicos de evaluación |
| LGS 4.2 | Fundamento probatorio | Cuando la moción se apoya en registros comerciales u otra prueba documental, se sienta el fundamento que exigen las reglas de prueba. | §III, Criterios específicos de evaluación |
| LGS 4.3 | Cita precisa de anexos | Toda afirmación importante está vinculada a un anexo (exhibit) específico, identificado por la letra o el número del anexo y la página o el párrafo. | §III, Criterios específicos de evaluación |
| LGS 4.4 | Lista de anexos completa | Todo anexo mencionado en la afirmación aparece en la lista de anexos, y todo elemento de la lista se menciona en la afirmación. | §III, Criterios específicos de evaluación |
| LGS 4.5 | Honestidad probatoria | La moción reconoce lo que el expediente muestra y lo que no muestra, sin ceder la posición jurídica. | §III, descriptor de A+; Sherwin |

**Bandas de puntuación.**

| Puntuación | Criterios |
|-------|----------|
| A+ (98–100) | Cada afirmación vinculada a un anexo específico con una cita precisa (con página o párrafo). Declaraciones juradas basadas en conocimiento personal. Prueba autenticada. Honestidad intelectual sobre los límites probatorios sin ceder la posición. Lista de anexos completa y con referencias cruzadas. |
| A (95–97) | Respaldo sólido con una laguna menor: una afirmación sin cita precisa, o un anexo mencionado pero que no figura en la lista. |
| A− (92–94) | Respaldo adecuado; deficiencias menores (p. ej., testimonio de oídas (hearsay) en una declaración jurada de respaldo sin que se identifique una excepción). |
| B+ (88–91) | La mayoría de los hechos están respaldados, pero una o dos afirmaciones importantes se apoyan en una caracterización y no en prueba. |
| B (83–87) | Relato adecuado, pero los anexos se mencionan de forma general y no con especificidad. |
| B− (80–82) | La presentación de los hechos contiene lagunas que la parte contraria podría aprovechar en su oposición. |
| C+ (77–79) | Hechos importantes enunciados sin respaldo probatorio; se apoya en las afirmaciones del abogado como prueba. |
| C o inferior | Fundamento fáctico insuficiente para sostener el remedio solicitado. |

**Criterios específicos de evaluación.** Requisito de conocimiento personal cumplido;
fundamento documental sentado donde se requiere; anexos autenticados y mencionados
con especificidad (letra o número del anexo + página o párrafo); honestidad intelectual
sobre los límites probatorios (Sherwin); lista de anexos completa en ambos sentidos.
(El CPLR es la fuente de las expectativas de fundamento que estos criterios miden
—p. ej., CPLR 2106 para las afirmaciones y 4518 para los registros comerciales—, pero LGS califica
si se sentó el fundamento, no si el escrito cumple la regla
procesal, lo cual determina el tribunal.)

**Nota de evaluación comparativa.** Los modelos enuncian hechos con seguridad sin vincularlos a
anexos específicos. Una afirmación que dice "El demandado ganó $X" sin citar
el anexo que lo prueba es deficiente, sea o no cierta la
aseveración.

---

### Principio 5 — Redacción y organización (12%)

**Enunciado del principio.** La moción demuestra sabiduría práctica (Kronman): la
integración de la destreza analítica y el buen juicio, expresada mediante una
redacción clara y económica, calibrada al contexto institucional (Wizner) — se lee
como escrita para este tribunal, este juez, esta postura procesal.

| ID | Título | Requisito | Fuente |
|----|-------|-------------|--------|
| LGS 5.1 | Encabezados argumentativos | Los encabezados de punto son argumentativos y sustantivos, no descriptivos. | §IV, Criterios específicos de evaluación; Commercial Division Rule 17 |
| LGS 5.2 | Tono | Contundente por la prueba y no por la retórica; respetuoso con el tribunal y con el abogado de la parte contraria. | §IV, Criterios específicos de evaluación |
| LGS 5.3 | Economía | Cada párrafo hace avanzar el argumento; se omite la recitación innecesaria. | §IV, Criterios específicos de evaluación |
| LGS 5.4 | Estructura de las citas | La autoridad se presenta así: la ley antes que la jurisprudencia, lo vinculante antes que lo persuasivo, la aplicación antes que la refutación. | §IV, Criterios específicos de evaluación |
| LGS 5.5 | Adecuación al destinatario | La moción está calibrada a la práctica local del tribunal, a los estándares aplicables y a la postura procesal. | §IV, Criterios específicos de evaluación; Wizner |
| LGS 5.6 | Estructura analítica | Cada argumento tiene una estructura analítica visible: la conclusión o la regla enunciada primero, la regla explicada a partir de su autoridad, la regla aplicada a los hechos del expediente y la conclusión reiterada (la familia CREAC / IRAC); el lector puede ubicar cada paso, y ningún paso falta ni se funde con otro. | v1.1; Clark & DeSanctis |

**Lo que LGS 5.6 exige y lo que no exige.** Pregunta si un lector puede
encontrar la regla, su explicación, su aplicación y la conclusión de cada
argumento. No exige una sigla en particular ni un párrafo por paso, y el
único orden que fija es el de la conclusión primero. El párrafo ancla del
Registro de Técnicas (primero el impacto) es compatible con él: el hecho y
la autoridad más fuertes van al frente, y la estructura sigue. Una moción que
recita reglas sin aplicarlas al expediente, o que aplica hechos a una regla
que nunca enunció, se queda corta aquí por más pulida que sea la prosa.
LGS 5.4 y LGS 5.6 se puntúan de manera independiente. 5.4 pregunta en qué
orden aparecen las autoridades; 5.6 pregunta si el razonamiento que las usa
está completo. Una moción puede cumplir uno sin el otro.

**Bandas de puntuación.**

| Puntuación | Criterios |
|-------|----------|
| A+ (98–100) | Encabezados de punto argumentativos y sustantivos. Tono respetuoso y contundente por la prueba. Redacción económica — la notificación de moción (notice of motion) por sí sola comunica el argumento central. La estructura sigue ley → autoridad vinculante → aplicación de manera constante. La regla, la explicación, la aplicación y la conclusión de cada argumento son visibles por separado. Calibrada a la práctica local y a la postura del tribunal. |
| A (95–97) | Redacción sólida, estructura clara. Una debilidad menor: un encabezado descriptivo, o una leve verbosidad en una sección. |
| A− (92–94) | Redacción competente; organización lógica pero no optimizada. Puede seguir la cronología en lugar del argumento. |
| B+ (88–91) | Organización adecuada; clara, pero le falta economía o fuerza argumentativa en los encabezados de punto. |
| B (83–87) | Redacción funcional; desorganizada en algunas partes o dependiente de texto de plantilla. |
| B− (80–82) | La redacción debilita un fondo que por lo demás es adecuado, por mala organización o mal tono. |
| C+ (77–79) | Tono desorganizado o incendiario que predispondría al tribunal en contra. |
| C o inferior | Poco clara, argumentativa en el tono y no en el fondo, o fundamentalmente desorganizada. |

**Nota de evaluación comparativa.** Los modelos producen con facilidad el
*vocabulario* de la estructura analítica (un encabezado, un párrafo de regla,
una conclusión) y fallan con más frecuencia en el paso de la aplicación: los
hechos del expediente se resumen cerca de la regla en lugar de aplicarse a
sus elementos. Verifique si cada elemento de la regla está emparejado con un
hecho citado.

---

### Principio 6 — Sofisticación estratégica (10%)

**Enunciado del principio.** La moción considera cómo encaja en la postura general
del litigio, crea un expediente favorable para la revisión en apelación y demuestra
dominio de los conocimientos no jurídicos pertinentes — incluido el momento oportuno
entre mociones múltiples.

| ID | Título | Requisito | Fuente |
|----|-------|-------------|--------|
| LGS 6.1 | Calidad de la orden propuesta | La orden propuesta (proposed order) enumera los documentos de respaldo (según CPLR 2219); cada párrafo de «SE ORDENA» (ORDERED) corresponde a un solo punto del remedio; se incluyen una disposición sobre notificación y una fecha límite de cumplimiento; está lista para la firma sin modificaciones. | §V, Criterios específicos de evaluación; Clermont |
| LGS 6.2 | Postura para la apelación | La moción crea un expediente limpio para la apelación, preserva los argumentos y evita concesiones innecesarias. | §V, Criterios específicos de evaluación; Clermont |
| LGS 6.3 | Estrategia de mociones múltiples | Cuando la moción forma parte de una secuencia, son evidentes el momento, el orden y la interacción con otras mociones pendientes. | §V, Criterios específicos de evaluación |
| LGS 6.4 | Dominio interdisciplinario | Se demuestra el conocimiento no jurídico pertinente (análisis financiero, expedientes médicos, tecnología) cuando corresponde. | §V, Criterios específicos de evaluación; Rakoff |
| LGS 6.5 | Consideración del acceso a la justicia | La moción considera el impacto en las partes sin abogado o con pocos recursos cuando es pertinente. | §V, Criterios específicos de evaluación; Wizner |

**Bandas de puntuación.**

| Puntuación | Criterios |
|-------|----------|
| A+ (98–100) | Orden propuesta lista para la firma, con fechas límite de cumplimiento. Expediente limpio para la apelación. Estrategia de mociones múltiples evidente — el momento, el orden y la interacción con otras mociones fortalecen la solicitud. Dominio interdisciplinario cuando es pertinente. |
| A (95–97) | Fuerte conciencia estratégica; una laguna menor (la orden propuesta necesita una revisión menor, o no se aborda el contexto de mociones múltiples). |
| A− (92–94) | Estrategia adecuada; orden propuesta presente pero imprecisa; postura para la apelación considerada pero no optimizada. |
| B+ (88–91) | Aborda la cuestión inmediata pero no la postura general del litigio. |
| B (83–87) | Moción adecuada con conciencia estratégica limitada; orden propuesta ausente o genérica. |
| B− (80–82) | Puede prosperar en la cuestión puntual, pero crea problemas para la postura futura. |
| C+ (77–79) | Falta de conciencia estratégica; debilita la posición general del cliente. |
| C o inferior | Estratégicamente contraproducente; el juicio sobre la presentación debió haberla impedido. |

---

### Principio 7 — Ética y franqueza (Filtro + deducciones graduadas)

*Este Principio es un filtro de aprobado o reprobado con deducciones graduadas.
Toda deducción que se active reduce la puntuación compuesta en los puntos indicados.
Cualquier cita alucinada, sea cual sea la puntuación compuesta, coloca automáticamente
la moción en el nivel de conformidad Deficiente.*

**Enunciado del principio.** La moción cumple con el deber de franqueza del redactor
ante el tribunal y con los estándares de responsabilidad profesional aplicables.
Las citas son reales, la autoridad adversa se revela y las afirmaciones de hecho
son exactas.

| ID | Título | Requisito | Deducción | Fuente |
|----|-------|-------------|-----------|--------|
| LGS 7.1 | Sin citas inventadas | Ninguna cita se refiere a un caso que no existe. | −20 por cada ocurrencia | NY RPC 3.3; 22 NYCRR 130-1.1; Mata v. Avianca |
| LGS 7.2 | Sin fallos inventados | Ningún fallo de un caso se cita de forma incorrecta ni se inventa. | −15 | NY RPC 3.3(a)(1) |
| LGS 7.3 | Autoridad adversa revelada | Se revela toda la autoridad que rige y que es directamente adversa. | −15 | NY RPC 3.3(a)(2) |
| LGS 7.4 | Sin declaraciones falsas de hecho | Ninguna declaración de hecho sustancial es falsa. | −15 | NY RPC 3.3(a)(1); 22 NYCRR 130-1.1 |
| LGS 7.5 | Vía procesal correcta | La vía elegida corresponde al remedio solicitado. | −10 | Rakoff; CPLR 3211 vs. 3212 |
| LGS 7.6 | Autoridad que rige citada | La moción cita la autoridad que rige para cada argumento jurídico. | −10 | ABA Standards; NY RPC 1.1 |
| LGS 7.7 | Sin ataques personales | Ningún ataque personal contra el abogado de la parte contraria ni contra una parte. | −10 | 22 NYCRR 130-1.1(c) |
| LGS 7.8 | Ninguna decisión de primera instancia citada como vinculante | Ninguna decisión de primera instancia se cita como autoridad vinculante. | −5 | Jerarquía de tribunales de NY |
| LGS 7.9 | Uso de metodología interpretativa | Los argumentos sobre la ley emplean metodología interpretativa, no la mera afirmación. | −5 | Gluck |
| LGS 7.10 | Cumplimiento de los límites de extensión | El escrito respeta los límites de extensión que imponen las reglas del tribunal ante el que se presenta. | −5 | 22 NYCRR 202.8-b (el cumplimiento lo define el tribunal) |
| LGS 7.11 | Certificación presentada | Se presenta toda certificación de citas que exijan las reglas del tribunal. | −5 | 22 NYCRR 130-1.1-a (el requisito lo define el tribunal) |
| LGS 7.12 | Cadenas de citas explicadas | Toda cadena de citas incluye un paréntesis explicativo sobre la pertinencia de cada caso. | −3 | Clermont; estándares profesionales |

> LGS 7.10 y 7.11 deducen por el incumplimiento de los requisitos procesales del
> **tribunal**; la *definición* de esos requisitos es el reglamento del tribunal,
> no este Estándar (de conformidad con el Principio 1). Aparecen aquí, en el
> filtro de franqueza, porque las reglas de certificación y de extensión existen
> para vigilar la franqueza y la carga que se impone al tribunal.

**Nota de evaluación comparativa.** Las citas alucinadas son la falla más
descalificante de un modelo de lenguaje (LLM). Los LLM de uso general alucinaron
en el 58–88% de las respuestas a preguntas verificables de jurisprudencia
(Dahl et al. 2024); incluso las herramientas especializadas de investigación
jurídica alucinaron en el 17–33% de las respuestas (Magesh et al. 2025). Una
sola cita inventada vale −20 y es sancionable en la práctica (Mata v.
Avianca, S.D.N.Y. 2023), y activa el descenso automático a Deficiente sea cual
sea la puntuación compuesta.

---

### Principio 8 — Autoevaluación (10%)

**Enunciado del principio.** El producto del trabajo contiene una **autoevaluación
escrita y separada** que nombra las debilidades de la propia moción, enfrenta el
argumento más fuerte en su contra y explica las decisiones de criterio que la
sustentan. El Principio 8 puntúa lo que está **en la página** — un registro crítico
y franco que acompaña a la moción — no una afirmación inobservable sobre el estado
mental del redactor. Es la contraparte metacognitiva de la defensa: el mismo
borrador, examinado por su autor como lo haría un adversario.

*Dónde se ubica.* La autoevaluación es una sección rotulada (un memorando de
presentación, una nota de "limitaciones" o una tarjeta de puntuación adjunta) que
responde las cinco preguntas que siguen. Califíquela por lo que la sección
realmente dice: cada uno de LGS 8.1–8.5 se cumple solo con una respuesta
**específica y con nombre** — un genérico "la moción es sólida" no cumple
ninguno. Ofrecer corregir las debilidades *después* de la entrega no es
autoevaluación; la evaluación debe acompañar al borrador que evalúa.

| ID | Título | Requisito | Fuente |
|----|-------|-------------|--------|
| LGS 8.1 | Motivo más fuerte para denegar | La moción identifica el motivo más fuerte por el cual el tribunal podría denegarla y aborda ese motivo. | §VII, Pregunta 1 |
| LGS 8.2 | Anticipación del contraargumento | La moción identifica el mejor contraargumento del abogado de la parte contraria y muestra dónde queda anticipado. | §VII, Pregunta 2 |
| LGS 8.3 | Juicio sobre la presentación | La moción explica por qué es apropiado presentarla y qué alternativas se consideraron y se descartaron. | §VII, Pregunta 3; Kronman |
| LGS 8.4 | Impacto en las partes vulnerables | La moción considera el impacto en las partes sin abogado o con pocos recursos. | §VII, Pregunta 4; Wizner |
| LGS 8.5 | Solidez en apelación | La moción identifica qué argumentos quedan preservados para la apelación y qué se ha concedido, si algo. | §VII, Pregunta 5; Clermont |

**Preguntas de autoevaluación (responda cada una después de redactar).**

1. ¿Cuál es el motivo más fuerte por el cual el tribunal podría denegar esta moción?
   ¿Cómo lo ha abordado?
2. ¿Cuál es el mejor contraargumento del abogado de la parte contraria? ¿En qué
   parte de la moción queda anticipado?
3. ¿Debió presentarse esta moción? (Kronman — juicio sobre la presentación.) ¿Qué
   alternativas se consideraron y se descartaron?
4. ¿Cómo afecta esta moción a las partes sin abogado o con pocos recursos?
   (Wizner — impacto en las partes vulnerables.)
5. Si se deniega la moción, ¿qué argumentos quedan preservados para la apelación?
   ¿Qué se ha concedido? (Clermont — solidez en apelación.)

**Bandas de puntuación.**

| Puntuación | Criterios |
|-------|----------|
| A+ (98–100) | Identifica debilidades específicas y propone correcciones. Enfrenta con honestidad el contraargumento más fuerte. Explica el juicio sobre la presentación. Considera a las partes vulnerables. Evalúa la solidez en apelación. |
| A (95–97) | Autoevaluación sólida con una laguna (identifica debilidades pero no propone correcciones, u omite la solidez en apelación). |
| A− (92–94) | Adecuada; identifica la mayoría de los problemas, pero el análisis es superficial. |
| B+ (88–91) | Reconoce limitaciones pero no enfrenta el contraargumento más fuerte. |
| B (83–87) | Mínima; afirma que la moción es "sólida" sin identificar vulnerabilidades específicas. |
| C+ o inferior | Sin autoevaluación significativa; incapaz de identificar debilidades o de enfrentar contraargumentos. |

**Nota de evaluación comparativa.** La autoevaluación es donde más se separan
los profesionales humanos y el resultado de los LLM. La mayoría de los modelos no
ofrece debilidades por iniciativa propia si no se le pide. Un modelo que identifica
debilidades reales en su propio borrador obtiene una puntuación más alta que uno
que declara que su trabajo es "completo y bien fundamentado".

---

## 5. Niveles de conformidad

LGS define tres niveles de conformidad, que se derivan directamente de las bandas
de la puntuación compuesta de §6 — no se introducen umbrales nuevos. Los niveles son
**mutuamente excluyentes y exhaustivos**: toda moción cae exactamente en uno. Los
límites de las bandas de la puntuación compuesta que figuran abajo son idénticos a
los límites de la escala de calificaciones de §6 (90/89 es el límite
Experto/Competente; 80/79 es el límite Competente/Deficiente), de modo que las
dos secciones nunca pueden asignar una misma puntuación a dos niveles.

**Cada nivel se determina por tres condiciones, verificadas en un orden fijo**:
(1) el **filtro** — el filtro de franqueza del Principio 7
se supera y no hay ninguna cita alucinada; (2) la **condición previa** —
quien presenta el escrito ha confirmado el cumplimiento procesal del Principio 1;
(3) la **banda de la puntuación compuesta**. Una moción es conforme al nivel Experto
o Competente solo cuando se cumplen **todas** las condiciones de ese nivel; una sola
condición del filtro que falle hace descender la moción a Deficiente sea cual sea su
puntuación compuesta (véanse las Reglas de descenso automático más abajo).

### Nivel: Experto

Una moción alcanza el nivel **Experto** cuando se cumple **todo** lo siguiente:

1. **Filtro.** El filtro de franqueza del Principio 7 se supera (sin deducciones
   automáticas) y no hay ninguna cita alucinada.
2. **Condición previa.** Quien presenta el escrito ha confirmado de manera
   independiente el cumplimiento procesal del Principio 1.
3. **Banda de la puntuación compuesta.** La puntuación compuesta es de **90 o más**
   (escala de calificaciones de §6: A−, A o A+).

*La vara más alta, alcanzable con una metodología disciplinada.* **Indicadores
observables:** se emplean las cinco categorías de autoridad;
la autoridad adversa se distingue; la orden propuesta está lista para la firma;
la autoevaluación identifica debilidades reales; cero citas alucinadas.

### Nivel: Competente

Una moción alcanza el nivel **Competente** cuando se cumple **todo** lo siguiente:

1. **Filtro.** El filtro de franqueza del Principio 7 se supera y no hay ninguna
   cita alucinada.
2. **Condición previa.** Quien presenta el escrito ha confirmado de manera
   independiente el cumplimiento procesal del Principio 1.
3. **Banda de la puntuación compuesta.** La puntuación compuesta es de **80 a 89
   inclusive** (escala de calificaciones de §6: B−, B o B+).

*El piso práctico del trabajo profesional.*
**Indicadores observables:** estándar y vía correctos; al menos tres categorías
de autoridad; lagunas en la autoridad adversa o en la orden propuesta; autoevaluación limitada.

### Nivel: Deficiente

Una moción es **Deficiente** cuando se cumple **cualquiera** de lo siguiente (basta
con uno):

1. **El filtro falla.** El filtro de franqueza del Principio 7 falla, O
2. **Por debajo de la banda.** La puntuación compuesta es de **79 o menos** (escala
   de calificaciones de §6: C+ e inferiores), O
3. **Anulación por alucinación.** Hay alguna cita alucinada — sea cual sea
   la puntuación compuesta.

*No conforme — el escrito presenta un riesgo de responsabilidad profesional y es
poco probable que prospere en cuanto al fondo tal como se presentó.* **Indicadores
observables:** vía equivocada, categorías de autoridad faltantes, ninguna autoridad
adversa, orden propuesta de plantilla, ninguna autoevaluación, citas alucinadas.

### Declaraciones de conformidad

Una **declaración de conformidad** afirma que una moción específica alcanza un nivel
determinado. Una declaración está bien formada solo si indica los cinco elementos
que siguen; una declaración a la que le falte algún elemento no es una declaración
de conformidad LGS:

1. **Nivel declarado** — Experto, Competente o Deficiente.
2. **Versión** — "LexGrade Standard v1.1." Las declaraciones son específicas de
   cada versión; los niveles no son comparables entre versiones mayores. Las
   versiones menores comparten pesos, lógica del filtro y umbrales, por lo que los
   niveles son comparables entre las ediciones 1.x, pero una declaración nombra la
   edición exacta con la que se calificó: una declaración v1.0 no se reformula
   como declaración v1.1 sin volver a calificar.
3. **Puntuación compuesta** y la fecha de calificación.
4. **Perfil jurisdiccional** — la calibración base de NY, o un perfil con nombre
   (véase **Alcance**).
5. **Evaluador** — autoevaluación, el o los evaluadores humanos con nombre, o el
   modelo y la configuración usados para una calificación automatizada.

**Lo que una declaración afirma — y lo que no.** La declaración de un nivel afirma
solamente que, en la versión indicada y en la fecha indicada, la puntuación compuesta
de la moción cayó en la banda de ese nivel **y** que se cumplieron las condiciones de
filtro y de condición previa del nivel. **No** afirma que el escrito sea procesalmente
correcto (esa es la responsabilidad de quien presenta el escrito según el Principio 1,
confirmada de manera independiente), ni que se haya verificado cada cita
(la verificación es obligatoria, pero es un acto de quien hace la declaración, no una
garantía del Estándar), ni que la moción será concedida. Una declaración vale para una
moción tal como fue calificada; no se transfiere a las revisiones, que deben volver a calificarse.

### Reglas de descenso automático (evaluación comparativa de modelos)

- Cualquier cita alucinada → **Deficiente**, sea cual sea la puntuación compuesta.
- Vía procesal equivocada → no puede superar **Competente**.
- Falta el memorando de derecho (memorandum of law) → no puede superar **Competente**.
- No se aborda ninguna autoridad adversa → no puede superar **Competente**.

### Modos de falla críticos de los LLM

1. **Citas alucinadas.** La falla más descalificante. Verifique cada caso.
   Medido por respuesta a consultas de jurisprudencia: 58–88% (LLM de uso general) / 17–33%
   (IA jurídica especializada).
2. **Confusión de jurisdicción.** Mezclar el procedimiento federal y el estatal; citar
   el departamento equivocado como vinculante; aplicar estándares de las FRCP en una moción bajo el CPLR.
3. **Déficit de defensa.** Producir memorandos neutrales cuando la tarea es la práctica
   persuasiva de mociones. La moción debe argumentar, no solo informar.
4. **Ausencia metacognitiva.** Incapacidad de autoevaluarse. La mayoría de los modelos no
   identifica debilidades en su propio resultado si no se le pide.
5. **Ceguera ante mociones múltiples.** Tratar las mociones de forma aislada, sin atender
   al orden, al momento o a la interacción con otras mociones pendientes.
6. **Dependencia de la trayectoria judicial.** Cuando un tribunal ha firmado una serie de
   órdenes propuestas de una de las partes, cada una se convierte en el punto de partida de la
   siguiente. Algunos abogados aprovechan esto presentando órdenes propuestas repetidas, cada
   una de las cuales mueve el punto de partida de manera gradual. Las mociones que no tienen
   esto en cuenta — a la defensiva (obligando al tribunal a reevaluar el expediente completo)
   o a la ofensiva (redactando órdenes que establecen puntos de partida favorables) — están
   estratégicamente incompletas.
7. **Modos de falla del Registro de Técnicas:** *glosa editorial sobre hechos negativos*
   (añadir lenguaje calificativo a las ausencias de hecho); *escalada del remedio*
   (calibrar el remedio hacia arriba para igualar la fuerza de la prueba — lo contrario de la
   práctica experta); *invisibilidad plana* (invisibilidad del redactor por defecto, sin
   tensión controlada); *encaje forzado de técnicas* (forzar técnicas para inflar
   el conteo del Registro).

---

## 6. Puntuación compuesta

Esta sección es autosuficiente: define por completo la fórmula de la puntuación
compuesta y es reproducible — un lector que reciba las seis calificaciones de los
principios, las deducciones de P7 y los modificadores negativos puede recalcular la
puntuación compuesta hasta el decimal.

### Distribución de pesos

| Principio | Peso | Función |
|-----------|--------|------|
| P1 Integridad procesal | Condición previa | Se remite a las reglas del tribunal; no se puntúa |
| P2 Diagnóstico del problema | 10% | /10 puntos |
| P3 Autoridad legal | 20% | /20 puntos |
| P4 Fundamento fáctico | 18% | /18 puntos |
| P5 Redacción y organización | 12% | /12 puntos |
| P6 Sofisticación estratégica | 10% | /10 puntos |
| P7 Ética y franqueza | Filtro + deducciones | Las deducciones se restan de la puntuación compuesta |
| P8 Autoevaluación | 10% | /10 puntos |
| **Subtotal (P2–P6, P8)** | **80%** | **/80 puntos** |

### Fórmula de la puntuación compuesta

Calcule en este orden exacto; cada paso toma el resultado del paso anterior.

1. **Califique cada principio puntuado de 0 a 100.** Use las bandas de puntuación
   por principio de §4 (son descriptores de 0 a 100 para un solo principio, no la
   escala de calificaciones de la puntuación compuesta que figura más abajo).
2. **Puntos ponderados.** Multiplique la calificación de 0 a 100 de cada principio
   por su peso y sume: `subtotal = Σ (gradeₚ ÷ 100 × weightₚ)` sobre P2, P3, P4, P5,
   P6, P8. El resultado es sobre **80** puntos.
3. **Lleve a una base de 100 puntos.** `scaled = subtotal ÷ 0.80`.
4. **Aplique los modificadores sobre la base de 100 puntos.** `adjusted = scaled + net modifier − P7 deductions`,
   donde el **modificador neto** (net modifier) es la suma con signo de los modificadores
   positivos menos los modificadores negativos (los modificadores negativos tienen un piso
   de −5; véase más abajo), y las **deducciones de P7** (P7 deductions) son la suma de las
   deducciones del Principio 7 de §4.
5. **Piso y tope.** Limite el resultado al rango `[0, 98]`. El tope de A+ es 98.

```
subtotal  = Σ (gradeₚ ÷ 100 × weightₚ)        over P2,P3,P4,P5,P6,P8   → /80
scaled    = subtotal ÷ 0.80                                            → /100
adjusted  = scaled + net modifier − P7 deductions
Composite = min(98, max(0, adjusted))
```

Las deducciones de P7 y los modificadores negativos se aplican **después** de
llevar a la base de 100 puntos, directamente sobre esa base, de modo que un mismo
punto nunca se deduce en dos escalas.

### Dos mecanismos de penalización distintos (sin doble conteo)

LGS tiene dos canales de penalización separados; un mismo defecto se carga a
**exactamente uno** de ellos, nunca a los dos:

| Mecanismo | Dónde se define | Qué penaliza | Magnitud |
|-----------|---------------|-----------------|-----------|
| **Deducciones de franqueza de P7** | §4, tabla del Principio 7 | Violaciones del filtro de franqueza — citas o fallos inventados, autoridad adversa no revelada, hechos falsos, vía equivocada, ataques personales, etc. | −20 a −3 según la escala de §4 |
| **Modificadores negativos** | Esta sección | Ajustes de calidad por deficiencias *ajenas a la franqueza* que no hayan sido ya captadas por una deducción de P7 | −1 a −2, con un tope de −5 en total |

Una cita alucinada se carga **una sola vez**, bajo LGS 7.1 (−20, obliga a
Deficiente). **No** es además un modificador negativo — el modificador anterior de
"−10 por cita alucinada" se elimina para poner fin al doble conteo. Un defecto de
autoridad adversa faltante que ya activa la deducción de LGS 7.3 (−15) tampoco
recibe además el modificador de −2; el modificador de −2 se aplica solo cuando el
tratamiento de la autoridad adversa es *escaso* sin llegar a ser una violación del
filtro de franqueza.

### Modificadores negativos (máximo −5)

| Modificador | Deducción |
|----------|-----------|
| Afirmación desnuda sobre la ley (sin jurisprudencia) | −1 cada una |
| Tratamiento escaso de la autoridad adversa (no es una violación de LGS 7.3) | −2 |

El canal de modificadores negativos tiene un tope de **−5** en total, de modo que
los ajustes de calidad nunca pueden desbordar la puntuación compuesta; las fallas
graves de franqueza pasan, en cambio, por la escala de P7.

**Tope de puntuación.** La puntuación compuesta máxima es 98 (A+).

### Informe de la puntuación compuesta

La puntuación compuesta es una puerta de entrada, no el producto. Existe para que
una moción pueda ubicarse en un nivel de conformidad y para que dos calificaciones
de la misma moción puedan compararse. El producto de una calificación LGS es el
conjunto de hallazgos por criterio: para cada criterio, si se cumple, se queda
corto o es N/A, y para cada deficiencia, el defecto específico de la moción. Las
reglas siguientes rigen la forma de informar una calificación. Son normativas para
cualquiera que haga una declaración de conformidad (§5) y para cualquier
herramienta que presente resultados LGS. Para cualquier otro uso son informativas.

1. **Los hallazgos antes que el número.** Una calificación informada comienza con
   los hallazgos por criterio y la escala del Principio 7 (cada deducción, con
   la cita o la declaración que la activó). La puntuación compuesta, la letra
   y el nivel de conformidad vienen después. Una puntuación compuesta informada
   sin los hallazgos que la respaldan no es un resultado LGS bien formado.
2. **Nunca el número solo.** La puntuación compuesta nunca se presenta sin los
   cinco elementos de una declaración de conformidad (§5): nivel, versión,
   puntuación y fecha, perfil, evaluador. "LGS 91" sin nada más no es un resultado LGS.
3. **Enteros.** La fórmula se reproduce hasta el decimal; el instrumento no
   tiene resolución hasta el decimal (§3, *Validez y sus límites*). Informe la
   puntuación compuesta como un entero, redondeando la mitad hacia arriba.
4. **El Registro se mantiene aparte.** El conteo del Registro de Técnicas y las
   técnicas observadas se informan en su propia línea. Nunca se suman a la
   puntuación compuesta ni se usan para deshacer empates en ella.
5. **Las comparaciones muestran perfiles.** Dos mociones, o dos modelos, se comparan
   poniendo lado a lado sus calificaciones por principio y sus hallazgos por criterio.
   Un orden de clasificación basado solo en la puntuación compuesta pretende una
   precisión que el instrumento no tiene.
6. **En la enseñanza, los hallazgos son la retroalimentación.** Cuando el Estándar
   se usa para calificar trabajos de estudiantes, los hallazgos por criterio y las
   respuestas del Principio 8 son lo que el estudiante recibe primero; el número puede
   omitirse por completo. La retroalimentación específica e individualizada es lo que,
   según la evidencia, mejora el trabajo jurídico posterior (Sargent & Curcio 2012;
   Schwarcz & Farganis 2017).

La hoja de puntuación (§10) incluye una línea para confirmar que los hallazgos por
criterio acompañan a la puntuación compuesta.

### Escala de calificaciones

Los límites de las bandas de la escala de calificaciones están alineados con los
límites de conformidad de §5: el límite A−/B+ está en **90/89** (el límite
Experto/Competente) y el límite B−/C+ está en **80/79** (el límite
Competente/Deficiente). Ninguna puntuación corresponde a dos niveles de conformidad.

| Letra | Rango numérico | Nivel de conformidad |
|--------|--------------|-------------------|
| A+ | 98 | Experto |
| A | 95–97 | Experto |
| A− | 90–94 | Experto |
| B+ | 86–89 | Competente |
| B | 83–85 | Competente |
| B− | 80–82 | Competente |
| C+ e inferiores | 79 o menos | Deficiente |

*Nota sobre las dos escalas.* Las bandas por principio de §4 (p. ej., "B+ (88–91)")
califican un **solo principio** y son intencionalmente más finas; la escala de
calificaciones de la puntuación compuesta que figura arriba hace corresponder la
**puntuación compuesta final** con una letra y un nivel de conformidad. Comparten las
letras, pero son instrumentos distintos — un principio puede obtener "B+
(88–91)" mientras la puntuación compuesta de la moción cae en una banda diferente.

### Ajustes por tipo de moción

Los pesos base de LGS se aplican a todos los tipos de moción. Los ajustes que siguen
modifican los pesos y añaden requisitos mínimos para tipos de moción comunes sin
alterar los ID de los criterios LGS. Anote en la hoja de puntuación el ajuste aplicable.

| Tipo de moción | Ajustes de peso | Marco requerido | Elementos mínimos adicionales |
|-------------|--------------------|--------------------|----------------------------|
| Sentencia sumaria (summary judgment, CPLR 3212) | P4 →23%; P5 →7% | Alvarez v. Prospect Hosp.; Zuckerman v. City of NY | Declaración de hechos materiales (Statement of Material Facts) (§202.8-g si corresponde) |
| Desestimación (dismissal, CPLR 3211) | P2 →15%; P4 →13% | Leon v. Martinez; EBCI (§3211(a)(7)) | Identificar la subdivisión específica de §3211(a) |
| Desacato (contempt, Jud. Law §753) | P4 →23%; P5 →7% | Mandato claro + desobediencia deliberada; civil vs. penal | Copia certificada de la orden incumplida |
| Descubrimiento de prueba (discovery, §3124/§3126) | Se aplican los pesos base | Proporcionalidad; Allen v. Crowell-Weedon | Afirmación (affirmation) de consulta de buena fe (§202.7) |

---

## 7. Registro de Técnicas (informativo)

El Registro de Técnicas, de 39 técnicas, es un **complemento informativo** del
Estándar. Las técnicas no son criterios: una moción puede cumplir todos los criterios LGS
en el nivel Experto sin que haya ninguna técnica presente. El Registro responde a una
pregunta distinta — no "¿es buena esta moción?" sino "¿cómo persuade esta moción?". Se
informa junto con la puntuación compuesta, pero no la modifica.

| Categoría | Cantidad | ID de las técnicas |
|----------|-------|---------------|
| Hechos | 4 | #1–#4 |
| Redacción | 7 | #5–#11 |
| Estrategia | 13 | #12–#24 |
| Voz | 4 | #25–#28 |
| Ethos | 2 | #29–#30 |
| Credibilidad | 3 | #31–#33 |
| Estructura | 6 | #34–#39 |

Consulte el Registro de Técnicas (documento complementario) para ver las definiciones completas.

---

## 8. Seguimiento de resultados

Para las mociones presentadas, anote el resultado en la hoja de puntuación: Concedida
(Granted), Concedida en parte (Granted in Part) (especifique los puntos), Denegada
(Denied) (anote el motivo expresado por el tribunal y asócielo con un Principio de LGS),
Retirada (Withdrawn) o Resuelta por acuerdo (Settled). Correlación objetivo: las
mociones con puntuación A (95+) deberían concederse o provocar un acuerdo el 80% o más
de las veces. Una divergencia indica que los pesos deben recalibrarse. Esta hipótesis
no ha sido probada y requiere de 50 a 100 mociones calificadas con resultados para validarse.

---

## 9. Guía rápida en lenguaje sencillo

Para quienes no son abogados.

| Principio | Qué verifica | Analogía |
|-----------|----------------|---------|
| P1. Integridad procesal | ¿Siguió las reglas de presentación del tribunal? (Las define el tribunal — LexGrade no.) | Como una declaración de impuestos: si falta un formulario obligatorio, se rechaza. Consulte las reglas del tribunal. |
| P2. Diagnóstico del problema | ¿Se identificó el tipo correcto de problema legal? | Diagnóstico equivocado = tratamiento equivocado. |
| P3. Autoridad legal | ¿Las leyes y los casos correctos respaldan su solicitud? | Cinco categorías: ley, vinculante, persuasiva, administrativa, adversa. |
| P4. Fundamento fáctico | ¿Los hechos están probados con documentos específicos? | Cada afirmación necesita un recibo. |
| P5. Redacción | ¿Tono claro, organizado y respetuoso? | Persuada con pruebas, no con emoción. |
| P6. Estrategia | ¿Considera el panorama general? | Ajedrez, no damas. |
| P7. Ética y franqueza | ¿Citas reales, derecho adverso revelado, hechos exactos? | La honestidad ante el tribunal no es negociable. |
| P8. Autoevaluación | ¿Puede el redactor nombrar sus propias debilidades? | Un espejo honesto, no un animador. |

**Términos clave.**

| Término | Definición |
|------|-----------|
| Autoridad vinculante | Una decisión de un tribunal superior que el juez debe seguir (Court of Appeals, Appellate Division). |
| Autoridad adversa | El argumento legal más fuerte en contra de su posición. Usted debe abordarlo — ignorarlo es una violación ética. |
| Orden propuesta | Un borrador de la decisión que usted quiere que el juez firme, listo para la firma. |
| Cita alucinada | Una referencia a un caso que no existe. Las herramientas de IA las inventan con frecuencia. Toda cita debe verificarse. |

---

## 10. Hoja de puntuación

Complete una hoja por moción (o por modelo, para la evaluación comparativa).

| Principio | Peso | Calificación | Puntos | Notas / Alertas |
|-----------|--------|-------|--------|---------------|
| P1. Integridad procesal | Condición previa | — | — | ¿Confirmado con las reglas del tribunal? (quien presenta el escrito) |
| P2. Diagnóstico del problema | 10% | | /10 | |
| P3. Autoridad legal | 20% | | /20 | |
| P4. Fundamento fáctico | 18% | | /18 | |
| P5. Redacción y organización | 12% | | /12 | |
| P6. Sofisticación estratégica | 10% | | /10 | |
| P7. Ética y franqueza (filtro) | Filtro | | | Total de deducciones: ___ |
| P8. Autoevaluación | 10% | | /10 | |
| **Subtotal (P2–P6, P8)** | **80%** | | **/80** | |
| Subtotal llevado a base 100 (÷ 0.80) | | | /100 | Subtotal ÷ 0.80 → base de 100 puntos |
| Modificador neto (con signo) | | | | Positivos − negativos; los negativos tienen un piso de −5 |
| Deducciones éticas de P7 | | | | De la escala del Principio 7 de §4 |
| **PUNTUACIÓN COMPUESTA** | | | **/100** | Subtotal en base 100 + modificador neto − deducciones de P7, limitado a [0, 98]; informe como un entero |
| Hallazgos por criterio adjuntos | Obligatorio | | | Los hallazgos y la escala de P7 preceden a la puntuación compuesta (§6, Informe) |
| Registro de Técnicas | No puntuado | | __/39 | Informativo; se mantiene aparte de la puntuación |

| Campo | Dato |
|-------|-------|
| Tipo de moción | |
| Ajuste de calibración aplicado | |
| Ajustes de peso (si los hay) | |
| Modelo / Redactor | |
| Fecha de calificación | |
| Evaluador | |
| Nivel de conformidad | Experto / Competente / Deficiente |
| Resultado (si se presentó) | Concedida / Concedida en parte / Denegada / Retirada / Resuelta por acuerdo |
| Motivo expresado por el tribunal (si se denegó) | |
| Principio de LGS asociado con la denegación | |

---

## 11. Tabla de correspondencias

Cada criterio LGS puntuado corresponde a su fuente. La v1.0 trasladó la metodología
de origen sin añadidos ni omisiones. La v1.1 añade dos criterios
(LGS 3.10, LGS 5.6) cuya fuente es el registro de revisión de la v1.1 y la
doctrina académica nombrada en §12, marcados "v1.1" abajo; no se eliminó nada. El
Principio 1 es una condición previa y no tiene criterios puntuados.

| ID del criterio LGS | Título | Fuente en la metodología |
|-------------------|-------|--------------------|
| LGS 2.1 | Caracterización de la cuestión | §II-A, descriptor de A+ |
| LGS 2.2 | Selección de la vía procesal | §II-A, descriptor de A+ |
| LGS 2.3 | Análisis de vías alternativas | §II-A, descriptor de A+ |
| LGS 2.4 | Vínculo entre diagnóstico y estrategia | §II-A, descriptor de A+ |
| LGS 3.1 | Texto de la ley | §II-B, Jerarquía de autoridades (a) |
| LGS 3.2 | Autoridad vinculante | §II-B, Jerarquía de autoridades (b) |
| LGS 3.3 | Autoridad persuasiva | §II-B, Jerarquía de autoridades (c) |
| LGS 3.4 | Fuentes administrativas y de práctica | §II-B, Jerarquía de autoridades (d) |
| LGS 3.5 | Autoridad adversa | §II-B, Jerarquía de autoridades (e); NY RPC 3.3(a)(2) |
| LGS 3.6 | Carga de la prueba | §II-B, Criterios específicos de evaluación |
| LGS 3.7 | Metodología de interpretación de la ley | §II-B, Criterios específicos de evaluación; Gluck |
| LGS 3.8 | Razonamiento analógico | §II-B, Criterios específicos de evaluación; Sherwin |
| LGS 3.9 | Fundamento de política pública | §II-B, Criterios específicos de evaluación; Gluck |
| LGS 3.10 | Síntesis de casos | v1.1; Clark & DeSanctis |
| LGS 4.1 | Conocimiento personal | §III, Criterios específicos de evaluación |
| LGS 4.2 | Fundamento probatorio | §III, Criterios específicos de evaluación |
| LGS 4.3 | Cita precisa de anexos | §III, Criterios específicos de evaluación |
| LGS 4.4 | Lista de anexos completa | §III, Criterios específicos de evaluación |
| LGS 4.5 | Honestidad probatoria | §III, descriptor de A+; Sherwin |
| LGS 5.1 | Encabezados argumentativos | §IV; Commercial Division Rule 17 |
| LGS 5.2 | Tono | §IV, Criterios específicos de evaluación |
| LGS 5.3 | Economía | §IV, Criterios específicos de evaluación |
| LGS 5.4 | Estructura de las citas | §IV, Criterios específicos de evaluación |
| LGS 5.5 | Adecuación al destinatario | §IV, Criterios específicos de evaluación; Wizner |
| LGS 5.6 | Estructura analítica | v1.1; Clark & DeSanctis |
| LGS 6.1 | Calidad de la orden propuesta | §V, Criterios específicos de evaluación; Clermont |
| LGS 6.2 | Postura para la apelación | §V, Criterios específicos de evaluación; Clermont |
| LGS 6.3 | Estrategia de mociones múltiples | §V, Criterios específicos de evaluación |
| LGS 6.4 | Dominio interdisciplinario | §V, Criterios específicos de evaluación; Rakoff |
| LGS 6.5 | Consideración del acceso a la justicia | §V, Criterios específicos de evaluación; Wizner |
| LGS 7.1 | Sin citas inventadas | §VI, Deducciones automáticas |
| LGS 7.2 | Sin fallos inventados | §VI, Deducciones automáticas |
| LGS 7.3 | Autoridad adversa revelada | §VI, Deducciones automáticas; NY RPC 3.3(a)(2) |
| LGS 7.4 | Sin declaraciones falsas de hecho | §VI, Deducciones automáticas |
| LGS 7.5 | Vía procesal correcta | §VI, Deducciones automáticas |
| LGS 7.6 | Autoridad que rige citada | §VI, Deducciones automáticas; NY RPC 1.1 |
| LGS 7.7 | Sin ataques personales | §VI, Deducciones automáticas; 22 NYCRR 130-1.1(c) |
| LGS 7.8 | Ninguna decisión de primera instancia citada como vinculante | §VI, Deducciones automáticas |
| LGS 7.9 | Uso de metodología interpretativa | §VI, Deducciones automáticas; Gluck |
| LGS 7.10 | Cumplimiento de los límites de extensión | §VI, Deducciones automáticas; 22 NYCRR 202.8-b |
| LGS 7.11 | Certificación presentada | §VI, Deducciones automáticas; 22 NYCRR 130-1.1-a |
| LGS 7.12 | Cadenas de citas explicadas | §VI, Deducciones automáticas; Clermont |
| LGS 8.1 | Motivo más fuerte para denegar | §VII, Pregunta 1 |
| LGS 8.2 | Anticipación del contraargumento | §VII, Pregunta 2 |
| LGS 8.3 | Juicio sobre la presentación | §VII, Pregunta 3; Kronman |
| LGS 8.4 | Impacto en las partes vulnerables | §VII, Pregunta 4; Wizner |
| LGS 8.5 | Solidez en apelación | §VII, Pregunta 5; Clermont |

**Total de criterios LGS: 47**, en los Principios P2–P8 (el Principio 1 es una condición
previa procesal sin criterios; 45 en la v1.0, dos añadidos en la v1.1). P2–P6 y P8 se **puntúan por bandas** y componen la
puntuación compuesta de 100 puntos; los criterios de P7 son **prohibiciones del filtro de franqueza** que se aplican como
deducciones, no se puntúan por bandas.

---

## 12. Fundamento normativo

Cada criterio se remonta a una o más de las autoridades siguientes. Son la
**fuente de las expectativas de calidad que LGS mide**, no requisitos que LGS
imponga (los requisitos procesales son los del tribunal ante el que se presenta el
escrito; véase el Principio 1).

**Leyes y reglamentos.** CPLR §§2101, 2103, 2106, 2214, 2219, 3120, 3124,
3126, 3211, 3212, 4518 (procedimiento, práctica de mociones, prueba); 22 NYCRR §§130-1.1,
130-1.1-a, 202.1 et seq., 202.7, 202.8-a, 202.8-b (sanciones, certificación, procedimiento
de mociones); NY RPC Rules 1.1, 3.1, 3.3, 3.4 (competencia,
reclamaciones con mérito, franqueza, equidad); ABA Standards for Imposing Lawyer
Sanctions; Commercial Division Rules 17, 19-a.

**Doctrina académica.**

- Martha Minow & Todd D. Rakoff, "[A Case for Another Case Method](https://scholarship.law.vanderbilt.edu/vlr/vol60/iss2/11/)," 60 Vand. L. Rev. 597 (2007) — diagnóstico del problema.
- Abbe R. Gluck, "[The States as Laboratories of Statutory Interpretation](https://www.yalelawjournal.org/article/the-states-as-laboratories-of-statutory-interpretation-methodological-consensus-and-the-new-modified-textualism)," 119 Yale L.J. 1750 (2010) — interpretación de la ley y propósito legislativo.
- Emily Sherwin, "[A Defense of Analogical Reasoning in Law](https://chicagounbound.uchicago.edu/uclrev/vol66/iss4/3/)," 66 U. Chi. L. Rev. 1179 (1999) — razonamiento analógico.
- Anthony T. Kronman, *[The Lost Lawyer: Failing Ideals of the Legal Profession](https://www.hup.harvard.edu/books/9780674539273)* (Harvard University Press 1993) — sabiduría práctica y juicio sobre la presentación.
- Stephen Wizner, "[The Law School Clinic: Legal Education in the Interests of Justice](https://ir.lawnet.fordham.edu/flr/vol70/iss5/29/)," 70 Fordham L. Rev. 1929 (2002) — contexto institucional y acceso a la justicia.
- Kevin M. Clermont, "[Staying Faithful to the Standards of Proof](https://scholarship.law.cornell.edu/clr/vol104/iss6/2/)," 104 Cornell L. Rev. 1457 (2020) — estándares de decisión y el estándar de revisión.
- Bryan A. Garner, *[The Elements of Legal Style](https://global.oup.com/academic/product/the-elements-of-legal-style-9780195141627)* (2d ed., Oxford University Press 2002) — estándares de redacción y de citas.

**Doctrina sobre enseñanza del derecho y evaluación (añadida en la v1.1).** Estas
fuentes tratan de cómo se evalúa la redacción jurídica. Fundamentan los dos
criterios de la v1.1 y las disposiciones sobre validez e informe.

- Jessica L. Clark & Christy H. DeSanctis, "[Toward a Unified Grading Vocabulary: Using Rubrics in Legal Writing Courses](https://jle.aals.org/home/vol63/iss1/2)," 63 J. Legal Educ. 3 (2013) — las rúbricas como un vocabulario compartido y con nombre para las cualidades de la redacción jurídica; la base de LGS 3.10 y LGS 5.6 como criterios con nombre propio.
- Carol Springer Sargent & Andrea A. Curcio, "[Empirical Evidence That Formative Assessments Improve Final Exams](https://jle.aals.org/home/vol61/iss3/4/)," 61 J. Legal Educ. 379 (2012) — la retroalimentación formativa mejoró el desempeño posterior hasta en una calificación de letra; por qué el resultado son los hallazgos y no el número.
- Daniel Schwarcz & Dion Farganis, "[The Impact of Individualized Feedback on Law Student Performance](https://scholarship.law.umn.edu/faculty_articles/644)," 67 J. Legal Educ. 139 (2017) — un experimento natural: la retroalimentación individualizada elevó el desempeño en cerca de un tercio de un escalón de calificación, controlando por las credenciales de ingreso.
- Lindsey P. Gustafson, "[The Compounding Effects of Assessment: How Our Failure to Coordinate Formative Assessments May Impact Their Validity](https://jle.aals.org/home/vol73/iss1/4)," 73 J. Legal Educ. 59 (2024) — la validez de un sistema de evaluación en su conjunto, y cómo la evaluación sin coordinación la erosiona; la base de la advertencia sobre validez consecuencial de §3.

**Investigación empírica sobre LLM.** Matthew Dahl, Varun Magesh, Mirac Suzgun & Daniel E.
Ho, "[Large Legal Fictions: Profiling Legal Hallucinations in Large Language Models](https://doi.org/10.1093/jla/laae003)," 16 J. Legal Analysis 64 (2024) —
alucinación en el 58–88% de las respuestas a preguntas verificables de jurisprudencia federal,
en GPT-4, GPT-3.5, PaLM 2 y Llama 2; Varun Magesh, Faiz Surani, Matthew
Dahl, Mirac Suzgun, Christopher D. Manning & Daniel E. Ho,
"[Hallucination-Free? Assessing the Reliability of Leading AI Legal Research Tools](https://doi.org/10.1111/jels.12413)," 22 J. Empirical Legal Stud. 216
(2025) — alucinación en el 17–33% de las respuestas de herramientas de investigación
jurídica basadas en RAG; Mata v. Avianca, Inc., No. 22-cv-1461 (S.D.N.Y. 2023) — sanciones
emblemáticas por citas inventadas generadas por IA.

---

## 13. Versiones y licencia

**Este documento:** LexGrade Standard v1.1.

**Acoplamiento del conjunto.** LGS v1.1 está fijado en `methodology.yaml` junto con el
Registro de Técnicas en su v1.0, que la v1.1 no cambia.

**Criterio de versiones.** Las revisiones menores que añaden criterios o técnicas, o
aclaran el texto existente, sin cambiar pesos, deducciones, lógica del filtro ni
umbrales de conformidad producen una versión menor (1.1, 1.2, …). Un cambio en los
pesos, la lógica del filtro o los umbrales de conformidad requiere una versión mayor (2.0).
Los ID de los criterios son estables entre versiones menores; un criterio añadido en una
versión menor toma el siguiente número sin usar de su Principio.

**Historial de ediciones.**

| Edición | Estado | Cambios |
|---------|--------|---------|
| v1.0 | Publicada, febrero de 2026 | Edición inicial: 8 principios, 45 criterios, fórmula de la puntuación compuesta, tres niveles de conformidad. Sigue publicada y se puede citar. |
| v1.1 | Publicada, octubre de 2026 | Añade LGS 3.10 (Síntesis de casos) y LGS 5.6 (Estructura analítica); añade en §3 *Validez y sus límites* y en §6 *Informe de la puntuación compuesta*; añade en §12 la doctrina sobre enseñanza del derecho; corrige a 39 el denominador del Registro de Técnicas en la hoja de puntuación. No cambió ningún peso, deducción, regla del filtro ni umbral. Corregida en el mismo texto, noviembre de 2026: la cita precisa de la primera página de Gustafson en §12 (59); "LexGrade" en lugar de "LGS" en la tabla en lenguaje sencillo de §9; redacción neutral para la nota de la categoría (d) en §4, Principio 3, y la remisión a las correcciones en la nota de vigencia. |

**Licencia.** CC-BY-SA 4.0. © 2026 LexGrade. Cítese como: "LexGrade Standard v1.1,
LexGrade (lexgrade.org), CC-BY-SA 4.0." Las bifurcaciones con otro nombre deben actualizar
la atribución al nombre que elijan, conforme a la política de marcas (véase GOVERNANCE.md).

---

---

*Las preguntas, correcciones y contribuciones son bienvenidas como issues o pull
requests en el repositorio de LexGrade.*
