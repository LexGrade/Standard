# LexGrade Standard (LGS) — Version 1.1

> **Not legal advice; no authority.** LexGrade is an open standard, independently maintained — not promulgated by any court, bar, or government body, and it confers no authority. Nothing here is legal advice. Every legal citation, whether in this document or in any motion drafted or assessed with it, must be independently verified against the official reporter before filing.

> The LexGrade Standard (LGS) is the public, citable form of the LexGrade
> motion-assessment methodology: a standard for scoring legal motions, modeled
> on the W3C Web Content Accessibility Guidelines (Principles → Criteria with
> stable IDs → Conformance Levels).

**Name.** LexGrade Standard (LGS). The name follows the LexGrade service mark.
Renamed forks are explicitly welcome under the trademark policy (see
GOVERNANCE.md).

**Scope.** LGS v1.1 is calibrated to New York State Supreme Court motion practice. It
references New York State authority (CPLR, 22 NYCRR, NY RPC) **only as the source
of the quality expectations it measures, never as requirements it imposes.** The
**framework** of principles, weights, and conformance levels is
jurisdiction-neutral, while the **criterion text and calibration are NY-anchored**.
Porting to another forum therefore takes a jurisdiction profile rather than a
find-and-replace. Several criteria cite NY-specific authority directly (e.g.
CPLR/22 NYCRR rule numbers); a profile substitutes the controlling authority:
FRCP for the CPLR, local rules for 22 NYCRR, circuit authority for Appellate
Division authority.

**Audiences.** Practitioner self-assessment; LLM output benchmarking; legal
writing education; academic citation.

**License.** CC-BY-SA 4.0. © 2026 LexGrade. Derived works must carry
the same license and attribute LexGrade. Cite as: "LexGrade Standard
v1.1, LexGrade (lexgrade.org), CC-BY-SA 4.0."

**What changed in v1.1.** A minor revision: two criteria added (LGS 3.10
Case Synthesis; LGS 5.6 Analytical Structure), a statement of what the
instrument has and has not been shown to measure (§3, *Validity and its
limits*), and a rule for how the composite is reported (§6, *Reporting the
composite*). No weight, deduction, gate rule, or conformance threshold
changed, and no existing criterion ID moved. The full list is in §13,
*Edition history*. v1.0 stays published and citable.

**Currency note.** All statutory, regulatory, and empirical citations were
verified as of February 2026 and were not re-verified for v1.1. The
legal-education scholarship added in v1.1 (§12) was verified as of October
2026. The 22 NYCRR is periodically amended; LLM hallucination rates change as
models improve. Users should confirm cited provisions remain current. Report
corrections to the maintainer.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [How the Standard Is Structured](#2-how-the-standard-is-structured)
3. [Principles and Weights](#3-principles-and-weights)
4. [Principles and Criteria](#4-principles-and-criteria)
   - [Principle 1 — Procedural Integrity (Precondition)](#principle-1-procedural-integrity-precondition-deferred-to-court-rules)
   - [Principle 2 — Problem Diagnosis](#principle-2-problem-diagnosis-10)
   - [Principle 3 — Legal Authority](#principle-3-legal-authority-20)
   - [Principle 4 — Factual Foundation](#principle-4-factual-foundation-18)
   - [Principle 5 — Writing and Organization](#principle-5-writing-and-organization-12)
   - [Principle 6 — Strategic Sophistication](#principle-6-strategic-sophistication-10)
   - [Principle 7 — Ethics and Candor (Gate)](#principle-7-ethics-and-candor-gate-graduated-deductions)
   - [Principle 8 — Self-Assessment](#principle-8-self-assessment-10)
5. [Conformance Levels](#5-conformance-levels)
6. [Composite Scoring](#6-composite-scoring)
7. [Technique Register (Informative)](#7-technique-register-informative)
8. [Outcome Tracking](#8-outcome-tracking)
9. [Plain-Language Quick Start](#9-plain-language-quick-start)
10. [Scoring Worksheet](#10-scoring-worksheet)
11. [Mapping Table](#11-mapping-table)
12. [Regulatory Foundation](#12-regulatory-foundation)
13. [Versioning and License](#13-versioning-and-license)
---

## 1. Introduction

The **LexGrade Standard (LGS)** is an open, citable quality
framework for evaluating legal-motion drafting. It structures the assessment
criteria from the LexGrade methodology as numbered, stable criteria in a
layered format: Principles → Criteria, each with a stable ID and a normative
requirement, resolving to Conformance Levels.

**Purpose.** LGS provides:

- A stable citation target for practitioners, educators, and researchers.
- A public articulation of the methodology that a reader can use without parsing
  a practitioner-facing scoring rubric.
- A foundation for jurisdiction profiles and motion-type overlays without
  altering the base criteria.

**What this is.** A working assessment instrument. It carries the full operative
content needed to grade a motion: per-criterion requirements, score-band
descriptors, an authority hierarchy, automatic deductions, motion-type overlays,
a benchmarking guide, a plain-language quick start, and a scoring worksheet.

**What this is not: a procedural rulebook.** LGS does **not** restate the
CPLR, the Uniform Rules, the Rules of Professional Conduct, or any court's filing
requirements, and is **not a substitute for them.** Whether a filing is
procedurally proper (caption, notice, supporting papers, service, length,
proposed order) is governed by the controlling authority of the filing court,
not by this Standard (see Principle 1). LGS measures **drafting quality:** the
reasoning, authority, factual foundation, writing, strategy, candor, and
self-assessment in a motion.

**How to use the Standard.**

*For practitioner self-assessment.* Draft your motion, then score it
principle by principle using the [Scoring Worksheet](#10-scoring-worksheet). If
any principle scores below A− (92), identify the specific deficiency and revise
before filing. Watch the [automatic deductions](#principle-7-ethics-and-candor-gate-graduated-deductions):
a single fabricated citation (−20) can drop an A to a B.

*For LLM benchmarking.* Give the model a case scenario (facts, relief sought, key
documents) and ask for a complete motion. Score the output against each
principle. **Empirical context:** in a 2024 study, general-purpose LLMs
hallucinated in 58–88% of their answers to verifiable questions about federal
court cases (Dahl et al., "Large Legal Fictions," 16 J. Legal Analysis 64
(2024)); even leading AI legal research tools hallucinated in 17–33% of
responses (Magesh et al., "Hallucination-Free?," 22 J. Empirical Legal Stud.
216 (2025)). The citation
verification step is not optional. Map each model to a Conformance Level using the
[LLM Comparison Guide](#5-conformance-levels). When LGS applies NY RPC standards
to LLM outputs, it uses professional-responsibility rules as quality benchmarks,
not as assertions that AI outputs are subject to attorney disciplinary
enforcement.

*For legal writing education.* Distribute the Standard in advance so students
know the bar. Grade with the same worksheet; the deductions and modifiers give
specific, actionable feedback. Principle 8's prompts work as a separate
reflective exercise.

*Audience weight adjustments.* The baseline weights below apply to all three
audiences. Users may adjust ±5% per principle by context (e.g., practitioners may
raise Principle 6 for pre-filing review; educators may raise Principle 8;
benchmarkers may raise Principle 3). Document any adjustment on the worksheet.

---

## 2. How the Standard Is Structured

LGS is layered: themed groups of stable, named requirements that resolve to
conformance levels.

| Layer | LGS |
|-------|------|
| Theme | **Principle** (P1–P8) — a thematic group of related criteria |
| Requirement | **Criterion** (`LGS P.C`) — a single normative requirement with a stable ID |
| Result | **Conformance Level** (Expert / Competent / Deficient) |

**Criterion IDs.** A criterion is identified by `LGS P.C`, where `P` is the
Principle number and `C` is the criterion within that Principle (e.g.,
`LGS 3.5`). IDs are stable across minor revisions; a criterion is renumbered
only when substantively replaced, at which point the prior ID is retired (never
reused). A criterion added in a minor revision takes the next unused number in
its Principle (v1.1 added LGS 3.10 and LGS 5.6) and existing IDs do not move.
Each criterion states a **normative requirement** in plain language; the
"Source" column links the underlying methodology text that is its authoritative
basis, or, for a criterion added after v1.0, the edition that introduced it and
the scholarship it rests on.

**Two gates and six scored Principles.** Principle 1 is a procedural
**precondition** the filer satisfies independently (not scored by LGS).
Principle 7 is a **candor gate** with graduated deductions. The six scored
Principles (P2–P6, P8) carry the 100-point composite. The Technique Register
(§7) is informative and does not modify the composite.

**Not-applicable (N/A) criteria.** A criterion is marked **N/A** when the motion
type makes it inapposite — never to excuse a defect. Examples: LGS 6.3
(Multi-Motion Strategy) is N/A for a standalone first motion with no related
filings; LGS 6.4 (Interdisciplinary Command) is N/A where no non-legal domain is
implicated; LGS 4.2 (Evidentiary Foundation) is N/A for a pure question of law
that relies on no documentary evidence. Criteria whose text already includes
"where applicable," "where relevant," or "if applicable" are the explicit N/A
candidates.

An N/A criterion is **dropped from its principle's denominator**, where it
neither helps nor hurts the score. Concretely: grade a principle on the criteria
that **do** apply, then assign the principle's 0–100 grade from those; the
principle's **weight in §6 is unchanged** (so the composite still totals 80
weighted points and stays reproducible). N/A is a judgment about applicability,
recorded with a one-line reason on the worksheet. "The drafter omitted it" is a
deficiency scored under the criterion, never an N/A. When in doubt, the
criterion **applies**; N/A is a narrow exception.

---

## 3. Principles and Weights

| ID | Principle | Methodology Source | Role |
|----|-----------|--------------------|------|
| P1 | Procedural Integrity | §I Threshold Compliance | Precondition — deferred to court rules; not scored |
| P2 | Problem Diagnosis | §II-A Problem Diagnosis | Weighted — 10% |
| P3 | Legal Authority | §II-B Legal Analysis & Authority | Weighted — 20% |
| P4 | Factual Foundation | §III Factual Presentation & Evidentiary Support | Weighted — 18% |
| P5 | Writing and Organization | §IV Writing & Organization | Weighted — 12% |
| P6 | Strategic Sophistication | §V Strategic Sophistication | Weighted — 10% |
| P7 | Ethics and Candor | §VI Ethical Compliance | Gate + graduated deductions |
| P8 | Self-Assessment | §VII Self-Assessment & Reflective Practice | Weighted — 10% |

The six scored Principles (P2–P6, P8) total **80 weighted points**, scaled to a
100-point composite (§6). P1 is a precondition; P7 is a gate whose deductions are
subtracted from the composite.

**Methodology note (weight calibration).** Weights are calibrated to three
factors: (1) sanctions severity under 22 NYCRR §130-1.1 (higher weight where
errors trigger sanctions); (2) judicial decision-priority sequence (courts
evaluate threshold compliance before substance, substance before style); and
(3) discriminative power for LLM benchmarking (principles where human and AI
output diverge most receive higher weight). The −20 deduction for hallucinated
citations reflects both sanctionability and empirical frequency.

### Validity and its limits

A score is only as meaningful as the inference it is used to support. This
subsection states which inferences the Standard can bear today and which it
cannot, so that nobody reads more into a number than the evidence allows. It
is normative for how scores are described (see §6, *Reporting the
composite*) and informative about the instrument's evidence base.

**What the Standard can support.**

- *Content validity.* Every criterion traces to a stated source: the
  authority hierarchy, the rules of professional conduct, the sanctions rule,
  or named scholarship (§11, §12). The criteria describe what practice
  guides, the Rules of Professional Conduct, and legal-writing pedagogy
  already treat as the elements of a sound motion. A reader can audit that
  mapping line by line.
- *A shared vocabulary.* The criteria give graders, students, and drafters
  the same named terms for the same qualities, which is the first-order
  purpose of a rubric in legal writing instruction (Clark & DeSanctis 2013).
  When two graders using the Standard disagree, they disagree about a named
  thing, and that is what makes the disagreement resolvable.
- *Author-level discrimination.* The instrument separates exemplars written
  to be Expert, Competent, and Deficient on identical facts when its author
  scores them. That shows only that the instrument can separate what its
  author wrote to be separated. It says nothing about reliability, so those
  materials stay out of the published tree until independent graders have
  scored them (see the project roadmap).

**What the Standard cannot yet support.**

- *Inter-rater reliability.* No independent grader round has been run. Until
  agreement is measured (the planned target is Krippendorff's α ≥ 0.80 on
  per-principle grades), a composite reflects one grader's application of
  the criteria, and two graders' composites for the same motion should be
  expected to differ.
- *Criterion and predictive validity.* No correlation between LGS scores and
  outcomes (grant, denial, settlement, appellate result) has been measured.
  §8 states the hypothesis and the sample it would take; it remains untested.
- *Weight validity.* The weights in this section were set by the reasoning
  stated above, without data. A different, defensible weighting would move
  composites by several points without changing any per-criterion finding,
  which is one reason the per-criterion findings are the primary output
  (§6).
- *Transfer.* The calibration is New York State Supreme Court motion practice.
  Nothing has been measured in any other forum. A jurisdiction profile ports
  the criterion text; it does not carry validity evidence with it.

**Consequential validity (washback).** An assessment changes what it
measures. Drafting *to* the criteria can produce the form of a quality
without its substance: a "self-assessment" section that names no real
weakness, an adverse-authority paragraph that distinguishes nothing, a
synthesis that restates a string citation, an argument reshaped to display a
Register technique. Assessment systems that are not designed and coordinated
with this effect in mind lose validity as they are adopted (Gustafson 2024).
The Standard guards against it in three ways, and users should preserve all
three: the score-band descriptors reward *specific, named* content and cap
generic compliance at the B range; the Technique Register is never scored, so
there is nothing to gain by shoehorning a technique; and the reporting rule in
§6 puts the per-criterion findings ahead of the composite, so a drafter is
told what was found before being told a number. The evidence that specific,
individualized feedback improves later legal work (Sargent & Curcio 2012;
Schwarcz & Farganis 2017) is why the instrument is built as a feedback device
first and a score second.

**What this means for a user.** "This motion scored 91 under LexGrade
Standard v1.1" is a statement about how one grader applied a published
rubric on a stated date. It is not a statement that the motion will be
granted, that another grader would reach 91, or that a 91 motion is better
than an 89 motion in any respect the per-criterion findings do not show. The
project invites the inter-rater and outcome studies that would change this
subsection, and will revise it when they exist.

---

## 4. Principles and Criteria

### Principle 1 — Procedural Integrity (Precondition — Deferred to Court Rules)

*Procedural compliance is a precondition the filer must satisfy independently.
LGS does not restate, enumerate, or score it. A filing that is not procedurally
proper cannot succeed on the merits — but the determination of what "proper"
requires belongs to the rules of the filing court, not to this Standard.*

**Principle statement.** The requirements for a properly formed motion — caption,
notice of motion, supporting affirmation or affidavit, memorandum of law, proof
of service, individual-part rules, length limits, and proposed order — are fixed
by the rules of the court in which the motion is filed. LGS does not reproduce
them. Restating procedural law would duplicate authoritative sources that already
control, would go stale the moment a rule is amended or a county's practice
differs, and is outside the proper scope of a drafting-quality standard.

In New York State Supreme Court practice the controlling sources are the **CPLR**
(notably Article 22 — e.g., CPLR 2103 service, 2106 affirmations, 2214 motion
papers, 2219 orders), the **Uniform Civil Rules for the Supreme and County
Courts** (22 NYCRR Part 202, including the length limits of 202.8-b), and the
**Individual Part Rules** of the assigned justice. The filer is responsible for
identifying and meeting every requirement those sources impose.

> **What LGS does and does not do here.** LGS does **not** check whether your
> caption, notice, supporting papers, service, length, or proposed order
> comply; that determination belongs to the court's rulebook. Confirm
> compliance independently: the court's own forms, a current CPLR practice
> guide, your court's self-help center, or counsel. **A pro se filer must not
> read the absence of these items from the LGS criteria as permission to omit
> them. It means the opposite: they are required by law, which LGS
> deliberately does not restate.** The one integrity question LGS itself
> evaluates, whether every citation refers to a decision that actually exists,
> is scored under Principle 7 (Ethics and Candor), where it belongs as a
> duty-of-candor matter.

This Principle carries no scored LGS criteria; scored criterion IDs begin at
LGS 2.1.

**Benchmarking note.** Models frequently omit the proposed order, the
certification, and Individual Part Rules compliance. In the Stanford RegLab
studies (Dahl et al. 2024; Magesh et al. 2025), threshold procedural elements
were among the most commonly absent components of LLM-generated legal output —
revealing whether training reflects actual NY practice or only treatise law. A
benchmark harness may record procedural omissions descriptively; they are not
part of the LGS composite.

---

### Principle 2 — Problem Diagnosis (10%)

**Principle statement.** The motion correctly identifies the nature of the legal
problem — a pure question of law, a factual dispute requiring development, or a
mixed question requiring careful framing — and selects the appropriate procedural
vehicle. The characterization drives every subsequent analytical choice.

| ID | Title | Requirement | Source |
|----|-------|-------------|--------|
| LGS 2.1 | Question Characterization | The motion correctly characterizes the dispute as a question of law, fact, or mixed — and explains why. | §II-A, A+ descriptor |
| LGS 2.2 | Vehicle Selection | The selected procedural vehicle is the one that secures the relief sought on the available record; the motion states the vehicle's elements and shows the facts meet each. | §II-A, A+ descriptor |
| LGS 2.3 | Alternative Vehicle Analysis | The motion explains why alternative procedural vehicles were considered and rejected. | §II-A, A+ descriptor |
| LGS 2.4 | Diagnosis-to-Strategy Linkage | The motion shows how the problem characterization drives downstream analytical and strategic choices. | §II-A, A+ descriptor |

**Score bands.**

| Score | Criteria |
|-------|----------|
| A+ (98–100) | Diagnosis is precise, identifies the exact procedural vehicle, and explains why alternatives were rejected. If the user's framing suggests a stronger vehicle, says so. Commands the relationship between diagnosis and downstream strategy. |
| A (95–97) | Correct diagnosis with appropriate vehicle. Minor gap: does not address alternatives or does not explain why the chosen vehicle is strongest. |
| A− (92–94) | Correct in substance but imprecise in framing. Vehicle is appropriate but not optimal. |
| B+ (88–91) | Correct standard identified; analysis lacks depth on one material element of the diagnosis. |
| B (83–87) | Adequate diagnosis; surface-level characterization without engaging procedural nuance. |
| B− (80–82) | Correct in broad strokes but contains a meaningful diagnostic error. |
| C+ (77–79) | Misidentifies the standard or nature of the dispute; recoverable but damaging. |
| C or below | Fundamental mischaracterization driving the wrong vehicle, standard, or relief. |

**Benchmarking note.** Models often default to the most common motion type (e.g.,
summary judgment) without testing whether the facts support it. Check whether the
model considers alternative vehicles.

---

### Principle 3 — Legal Authority (20%)

**Principle statement.** The motion identifies and applies controlling authority
with precision, demonstrating statutory-interpretation methodology, analogical
reasoning as an affirmative skill, and engagement with policy rationale. Adverse
authority is disclosed and distinguished.

| ID | Title | Requirement | Source |
|----|-------|-------------|--------|
| LGS 3.1 | Statutory Text | For each legal argument, the governing statute is cited with operative language quoted. | §II-B, Authority Hierarchy (a) |
| LGS 3.2 | Binding Authority | At least one binding decision on analogous facts is cited for each argument. | §II-B, Authority Hierarchy (b) |
| LGS 3.3 | Persuasive Authority | Persuasive authority (other departments, federal courts, treatises) supplements binding authority where appropriate. | §II-B, Authority Hierarchy (c) |
| LGS 3.4 | Administrative and Practice Sources | Applicable administrative orders, Uniform Rules, OCA forms, or practice guides are identified. | §II-B, Authority Hierarchy (d) |
| LGS 3.5 | Adverse Authority | The strongest contrary authority is disclosed and distinguished with specificity. | §II-B, Authority Hierarchy (e); NY RPC 3.3(a)(2) |
| LGS 3.6 | Burden of Proof | The burden of proof is correctly identified, including which party bears it at each stage. | §II-B, Specific Evaluation Criteria |
| LGS 3.7 | Statutory-Interpretation Methodology | Interpretation proceeds from text → legislative history → policy purpose, not bare assertion. | §II-B, Specific Evaluation Criteria; Gluck |
| LGS 3.8 | Analogical Reasoning | Analogical reasoning is deployed as an affirmative skill, distinct from distinguishing adverse cases. | §II-B, Specific Evaluation Criteria; Sherwin |
| LGS 3.9 | Policy Rationale | The motion engages the policy purpose of the governing statute, not only its text. | §II-B, Specific Evaluation Criteria; Gluck |
| LGS 3.10 | Case Synthesis | Where the governing rule is drawn from more than one authority, the motion states the rule those authorities together establish, shows how each contributes to it, and applies the synthesized rule; a sequence of case descriptions or parentheticals without a stated rule is not a synthesis. | v1.1; Clark & DeSanctis |

**Case synthesis and analogical reasoning are different skills.** LGS 3.8
scores the use of a *single* authority: this case is like ours in the respects
that mattered to that court, so its result should follow here. LGS 3.10 scores
the step before that, digesting *several* authorities into one rule the court
can apply: "Read together, *A*, *B*, and *C* hold that [rule], because [what
each adds]." A motion can do either without the other. Synthesis is scored
only where more than one authority bears on the rule; where a single
controlling decision states the rule, LGS 3.10 is N/A (§2), never a
deficiency.

**Authority Hierarchy Checklist (required).** For each distinct legal argument,
the motion should fill all five categories:

| Category | Content Required | Strength Rating |
|----------|-----------------|-----------------|
| (a) Statutory text | Governing statute with operative language quoted | Mandatory |
| (b) Binding authority | Court of Appeals or controlling Appellate Division case on analogous facts | Controlling / Supportive |
| (c) Persuasive authority | Other departments, federal courts, treatises, trial-level decisions | Supportive / Background |
| (d) Administrative / practice | OCA forms, Uniform Rules, administrative orders, practice guides | Supportive / Background |
| (e) Adverse authority | Strongest contrary case with planned distinction | Mandatory |

Category (d) is the competitive edge — OCA forms, Uniform Rules, and
administrative orders are what opposing counsel and other AI tools miss.
Category (e) is mandatory under NY RPC 3.3(a)(2): counsel must disclose directly
adverse controlling authority not disclosed by the opposition.

**Score bands.**

| Score | Criteria |
|-------|----------|
| A+ (98–100) | All five authority categories filled and deployed. Interpretation methodology explicit. Analogical reasoning shown as an affirmative skill. Where several authorities bear on the rule, they are synthesized into one stated rule before it is applied. Adverse authority distinguished specifically. Policy rationale engaged. No known gap in controlling authority. |
| A (95–97) | Strong command across categories; minor gap in one (e.g., administrative/practice sources not located, or policy rationale not engaged). |
| A− (92–94) | Strong analysis with one meaningful gap: a missing authority category, or adverse authority addressed but not fully distinguished. |
| B+ (88–91) | Correct standard with adequate authority; lacks depth on one material element. May rely on fewer than four categories. |
| B (83–87) | Adequate statement of law; over-relies on secondary sources or hornbook recitation without applying authority to facts. |
| B− (80–82) | Correct in broad strokes but contains a meaningful analytical error or omission. |
| C+ (77–79) | Misidentifies the standard or burden of proof; recoverable but damaging. |
| C or below | Fundamental misunderstanding of governing law; would likely result in denial. |

**Benchmarking note.** Models frequently cite correct statutes but apply them
mechanically without interpretive methodology. The bare assertion "the statute
provides" without case law showing how courts apply it is the most common LLM
failure pattern in this Principle (−5 automatic deduction). A second pattern
is the unsynthesized string: three or four cases described in sequence, each
with a parenthetical, and no sentence stating what rule they establish
together. LGS 3.10 scores that as a list.

---

### Principle 4 — Factual Foundation (18%)

**Principle statement.** Every material factual assertion is supported by
admissible evidence in proper form. The motion demonstrates intellectual honesty
about the limits of available evidence without conceding the legal position.

| ID | Title | Requirement | Source |
|----|-------|-------------|--------|
| LGS 4.1 | Personal Knowledge | Affirmations rest on personal knowledge (the standard the CPLR sets for attorney affirmations and party affidavits). | §III, Specific Evaluation Criteria |
| LGS 4.2 | Evidentiary Foundation | Where business records or other documentary evidence are relied upon, the foundation the rules of evidence require is laid. | §III, Specific Evaluation Criteria |
| LGS 4.3 | Pinpoint Exhibit Citation | Every material assertion is tied to a specific exhibit, identified by exhibit letter/number and page or paragraph. | §III, Specific Evaluation Criteria |
| LGS 4.4 | Exhibit List Completeness | Every exhibit referenced in the affirmation appears on the exhibit list, and every item on the list is referenced in the affirmation. | §III, Specific Evaluation Criteria |
| LGS 4.5 | Evidentiary Honesty | The motion acknowledges what the record does and does not show, without conceding the legal position. | §III, A+ descriptor; Sherwin |

**Score bands.**

| Score | Criteria |
|-------|----------|
| A+ (98–100) | Every assertion mapped to a specific exhibit with a pinpoint cite. Affidavits on personal knowledge. Evidence authenticated. Intellectual honesty about evidentiary limits without conceding the position. Exhibit list complete and cross-referenced. |
| A (95–97) | Strong support with one minor gap: one assertion without a pinpoint cite, or one exhibit referenced but not on the list. |
| A− (92–94) | Adequate support; minor deficiencies (e.g., hearsay in a supporting affidavit without an exception identified). |
| B+ (88–91) | Most facts supported, but one or two material assertions rely on characterization rather than evidence. |
| B (83–87) | Adequate recitation, but exhibits are referenced generally rather than with specificity. |
| B− (80–82) | Factual presentation contains gaps an opponent could press on opposition. |
| C+ (77–79) | Material facts stated without evidentiary support; relies on counsel's assertions as proof. |
| C or below | Factual foundation insufficient to support the relief sought. |

**Specific evaluation criteria.** Personal-knowledge requirement satisfied;
documentary foundation laid where required; exhibits authenticated and referenced
with specificity (exhibit letter/number + page/paragraph); intellectual honesty
about evidentiary limits (Sherwin); exhibit list complete in both directions.
(The CPLR is the source of the foundation expectations these criteria measure —
e.g., CPLR 2106 for affirmations and 4518 for business records — but LGS grades
whether the foundation was laid, not whether the filing satisfies the procedural
rule, which is the court's determination.)

**Benchmarking note.** Models state facts confidently without tying them to
specific exhibits. An affirmation that says "Defendant earned $X" without citing
the exhibit that proves it is deficient regardless of whether the assertion is
true.

---

### Principle 5 — Writing and Organization (12%)

**Principle statement.** The motion demonstrates practical wisdom (Kronman): the
integration of analytical skill and sound judgment expressed through clear,
economical writing calibrated to the institutional context (Wizner) — it reads as
written for this court, this judge, this posture.

| ID | Title | Requirement | Source |
|----|-------|-------------|--------|
| LGS 5.1 | Argumentative Point Headings | Point headings are argumentative and substantive, not descriptive. | §IV, Specific Evaluation Criteria; Commercial Division Rule 17 |
| LGS 5.2 | Tone | Forceful through evidence rather than rhetoric; respectful toward the court and opposing counsel. | §IV, Specific Evaluation Criteria |
| LGS 5.3 | Economy | Every paragraph advances the argument; unnecessary recitation is omitted. | §IV, Specific Evaluation Criteria |
| LGS 5.4 | Citation Structure | Authority is presented statute-before-case-law, binding-before-persuasive, application-before-rebuttal. | §IV, Specific Evaluation Criteria |
| LGS 5.5 | Audience Calibration | The motion is calibrated to the court's local practice, the applicable standards, and the procedural posture. | §IV, Specific Evaluation Criteria; Wizner |
| LGS 5.6 | Analytical Structure | Each argument has a visible analytical structure: the conclusion or rule stated first, the rule explained from its authority, the rule applied to the record facts, and the conclusion restated (the CREAC / IRAC family); the reader can locate each step, and no step is missing or merged into another. | v1.1; Clark & DeSanctis |

**What LGS 5.6 does and does not require.** It asks whether a reader can
find the rule, its explanation, its application, and the conclusion for each
argument. It does not require a particular acronym or one paragraph per
step, and the only ordering it fixes is conclusion-first. The Technique
Register's Anchor Paragraph (impact-first) is consistent with it: the
strongest fact and authority lead, and the structure follows. A motion that
recites rules without applying them to the record, or applies facts to a
rule it never stated, falls short here however polished the prose is.
LGS 5.4 and LGS 5.6 are scored independently. 5.4 asks in what order the
authorities appear; 5.6 asks whether the reasoning that uses them is
complete. A motion can satisfy either without the other.

**Score bands.**

| Score | Criteria |
|-------|----------|
| A+ (98–100) | Point headings argumentative and substantive. Tone respectful and forceful through the evidence. Writing economical — the Notice of Motion alone communicates the core argument. Structure follows statute → binding → application consistently. Each argument's rule, explanation, application, and conclusion are each visible. Calibrated to the court's local practice and posture. |
| A (95–97) | Strong writing, clear structure. One minor weakness: one descriptive heading, or slight verbosity in one section. |
| A− (92–94) | Competent writing; organization logical but not optimized. May follow chronology rather than argument. |
| B+ (88–91) | Adequate organization; clear but lacks economy or argumentative force in point headings. |
| B (83–87) | Functional writing; disorganized in places or reliant on boilerplate. |
| B− (80–82) | Writing undermines otherwise adequate substance through poor organization or tone. |
| C+ (77–79) | Disorganized or inflammatory tone that would prejudice the court. |
| C or below | Unclear, argumentative in tone rather than substance, or fundamentally disorganized. |

**Benchmarking note.** Models produce the *vocabulary* of analytical
structure readily (a heading, a rule paragraph, a conclusion) and most often
fail at the application step: the record facts are summarized near the rule
rather than applied to its elements. Check whether each element of the rule
is matched to a cited fact.

---

### Principle 6 — Strategic Sophistication (10%)

**Principle statement.** The motion considers how it fits the broader litigation
posture, creates a favorable record for appellate review, and demonstrates
command of relevant non-legal domain knowledge — including multi-motion timing.

| ID | Title | Requirement | Source |
|----|-------|-------------|--------|
| LGS 6.1 | Proposed Order Quality | The proposed order recites the supporting papers (per CPLR 2219); each ORDERED paragraph tracks one relief item; a service provision and compliance deadline are included; it is ready for signature without modification. | §V, Specific Evaluation Criteria; Clermont |
| LGS 6.2 | Appellate Posture | The motion creates a clean appellate record, preserves arguments, and avoids unnecessary concessions. | §V, Specific Evaluation Criteria; Clermont |
| LGS 6.3 | Multi-Motion Strategy | Where the motion is part of a sequence, the timing, sequencing, and interaction with other pending motions is evident. | §V, Specific Evaluation Criteria |
| LGS 6.4 | Interdisciplinary Command | Relevant non-legal domain knowledge (financial analysis, medical records, technology) is demonstrated where applicable. | §V, Specific Evaluation Criteria; Rakoff |
| LGS 6.5 | Access-to-Justice Calibration | The motion considers the impact on unrepresented or under-resourced parties where relevant. | §V, Specific Evaluation Criteria; Wizner |

**Score bands.**

| Score | Criteria |
|-------|----------|
| A+ (98–100) | Proposed order ready for signature with compliance deadlines. Clean appellate record. Multi-motion strategy evident — timing, sequencing, and interaction with other motions strengthen the application. Interdisciplinary command where relevant. |
| A (95–97) | Strong strategic awareness; minor gap (proposed order needs minor revision, or multi-motion context not addressed). |
| A− (92–94) | Adequate strategy; proposed order present but imprecise; appellate posture considered but not optimized. |
| B+ (88–91) | Addresses the immediate issue but not the broader litigation posture. |
| B (83–87) | Adequate motion with limited strategic awareness; proposed order absent or generic. |
| B− (80–82) | May succeed on the narrow issue but creates problems for future posture. |
| C+ (77–79) | Strategic unawareness; undermines the client's broader position. |
| C or below | Strategically counterproductive; filing judgment should have prevented it. |

---

### Principle 7 — Ethics and Candor (Gate + Graduated Deductions)

*This Principle is a pass/fail gate with graduated deductions. Any triggered
deduction reduces the composite by the stated points. Any hallucinated citation,
regardless of composite score, automatically places the motion at the Deficient
conformance level.*

**Principle statement.** The motion complies with the drafter's duty of candor
toward the tribunal and with applicable professional-responsibility standards.
Citations are real, adverse authority is disclosed, and factual representations
are accurate.

| ID | Title | Requirement | Deduction | Source |
|----|-------|-------------|-----------|--------|
| LGS 7.1 | No Fabricated Citations | No citation refers to a case that does not exist. | −20 per instance | NY RPC 3.3; 22 NYCRR 130-1.1; Mata v. Avianca |
| LGS 7.2 | No Fabricated Holdings | No case holding is misquoted or fabricated. | −15 | NY RPC 3.3(a)(1) |
| LGS 7.3 | Adverse Authority Disclosed | All directly adverse controlling authority is disclosed. | −15 | NY RPC 3.3(a)(2) |
| LGS 7.4 | No False Statements of Fact | No material statement of fact is false. | −15 | NY RPC 3.3(a)(1); 22 NYCRR 130-1.1 |
| LGS 7.5 | Correct Procedural Vehicle | The chosen vehicle matches the relief sought. | −10 | Rakoff; CPLR 3211 vs. 3212 |
| LGS 7.6 | Controlling Authority Cited | The motion cites the controlling authority for each legal argument. | −10 | ABA Standards; NY RPC 1.1 |
| LGS 7.7 | No Ad Hominem | No ad hominem attack on opposing counsel or a party. | −10 | 22 NYCRR 130-1.1(c) |
| LGS 7.8 | No Trial Decision as Binding | No trial-level decision is cited as binding authority. | −5 | NY court hierarchy |
| LGS 7.9 | Interpretive Methodology Used | Statutory arguments deploy interpretive methodology, not bare assertion. | −5 | Gluck |
| LGS 7.10 | Procedural Length Compliance | The filing observes the length limits the filing court's rules impose. | −5 | 22 NYCRR 202.8-b (compliance defined by the court) |
| LGS 7.11 | Certification Filed | Any certification of citations the court's rules require is filed. | −5 | 22 NYCRR 130-1.1-a (requirement defined by the court) |
| LGS 7.12 | String Citations Explained | Any string citation includes a parenthetical explaining each case's relevance. | −3 | Clermont; professional standards |

> LGS 7.10 and 7.11 deduct for non-compliance with the **court's** procedural
> requirements; the *definition* of those requirements is the court's rulebook,
> not this Standard (consistent with Principle 1). They appear here, in the
> candor gate, because the certification and length rules exist to police candor
> and burden on the court.

**Benchmarking note.** Hallucinated citations are the most disqualifying LLM
failure. General-purpose LLMs hallucinated in 58–88% of answers to verifiable
case-law questions (Dahl et al. 2024); even specialized legal research tools
hallucinated in 17–33% of responses (Magesh et al. 2025). One fabricated
citation is −20 and is sanctionable in practice (Mata v.
Avianca, S.D.N.Y. 2023), and triggers automatic demotion to Deficient regardless
of composite score.

---

### Principle 8 — Self-Assessment (10%)

**Principle statement.** The work product contains a **discrete, written
self-assessment** that names the motion's own weaknesses, engages the strongest
case against it, and explains the judgment calls behind it. Principle 8 scores
what is **on the page** — a candid critical record accompanying the motion — not
an unobservable claim about the drafter's state of mind. It is the metacognitive
counterpart to advocacy: the same draft, examined adversarially by its author.

*Where it lives.* The self-assessment is a labeled section (a cover memo, a
"limitations" note, or an attached scorecard) answering the five prompts below.
Grade it on what the section actually says: each of LGS 8.1–8.5 is satisfied only
by a **specific, named** response — a generic "the motion is strong" satisfies
none of them. Offering to fix weaknesses *after* delivery is not self-assessment;
the assessment must accompany the draft it evaluates.

| ID | Title | Requirement | Source |
|----|-------|-------------|--------|
| LGS 8.1 | Strongest Ground for Denial | The motion identifies the single strongest ground on which the court could deny it and addresses that ground. | §VII, Prompt 1 |
| LGS 8.2 | Counter-Argument Preemption | The motion identifies opposing counsel's best counter-argument and shows where it is preempted. | §VII, Prompt 2 |
| LGS 8.3 | Filing Judgment | The motion articulates why filing is appropriate and what alternatives were considered and rejected. | §VII, Prompt 3; Kronman |
| LGS 8.4 | Vulnerable-Party Impact | The motion considers the impact on unrepresented or under-resourced parties. | §VII, Prompt 4; Wizner |
| LGS 8.5 | Appellate Resilience | The motion identifies which arguments are preserved for appeal and what, if anything, has been conceded. | §VII, Prompt 5; Clermont |

**Self-assessment prompts (answer each after drafting).**

1. What is the single strongest ground on which the court could deny this motion?
   How have you addressed it?
2. What is opposing counsel's best counter-argument? Where in the motion is it
   preempted?
3. Should this motion have been filed at all? (Kronman — filing judgment.) What
   alternatives were considered and rejected?
4. How does this motion affect unrepresented or under-resourced parties?
   (Wizner — impact on vulnerable parties.)
5. If the motion is denied, what arguments are preserved for appeal? What has
   been conceded? (Clermont — appellate resilience.)

**Score bands.**

| Score | Criteria |
|-------|----------|
| A+ (98–100) | Identifies specific weaknesses with proposed fixes. Engages the strongest counter-argument honestly. Articulates filing judgment. Considers vulnerable parties. Assesses appellate resilience. |
| A (95–97) | Strong self-assessment with one gap (identifies weaknesses but proposes no fixes, or omits appellate resilience). |
| A− (92–94) | Adequate; identifies most issues but analysis is surface-level. |
| B+ (88–91) | Acknowledges limitations but does not engage the strongest counter-argument. |
| B (83–87) | Minimal; states the motion is "strong" without identifying specific vulnerabilities. |
| C+ or below | No meaningful self-assessment; unable to identify weaknesses or engage counter-arguments. |

**Benchmarking note.** Self-assessment is where human practitioners and LLM
output diverge most. Most models will not volunteer weaknesses unless prompted. A
model that identifies real weaknesses in its own draft scores higher than one
that declares its work "comprehensive and well-supported."

---

## 5. Conformance Levels

LGS defines three conformance levels, mapped directly from the composite bands
of §6 — no new thresholds are introduced. The levels are **mutually exclusive
and exhaustive**: every motion lands in exactly one. The composite-band edges
below are identical to the grade-scale edges in §6 (90/89 is the
Expert/Competent boundary; 80/79 is the Competent/Deficient boundary), so the
two sections can never assign one score to two levels.

**Each level is determined by three conditions, tested in a fixed order**:
(1) the **gate** — the Principle 7 candor
gate passes and no hallucinated citation is present; (2) the **precondition** —
the filer has confirmed Principle 1 procedural compliance; (3) the **composite
band**. A motion conforms to Expert or Competent only when **all** of that
level's conditions hold; a single failed gate condition demotes the motion to
Deficient regardless of its composite (see Automatic Demotion Rules below).

### Level: Expert

A motion reaches **Expert** when **all** of the following hold:

1. **Gate.** The Principle 7 candor gate passes (no automatic deductions) and no
   hallucinated citation is present.
2. **Precondition.** The filer has independently confirmed Principle 1
   procedural compliance.
3. **Composite band.** The composite score is **90 or above** (§6 grade scale:
   A−, A, or A+).

*The highest bar, achievable through disciplined methodology.* **Observable
indicators:** all five authority categories deployed;
adverse authority distinguished; proposed order ready for signature;
self-assessment identifies real weaknesses; zero hallucinated citations.

### Level: Competent

A motion reaches **Competent** when **all** of the following hold:

1. **Gate.** The Principle 7 candor gate passes and no hallucinated citation is
   present.
2. **Precondition.** The filer has independently confirmed Principle 1
   procedural compliance.
3. **Composite band.** The composite score is **80 to 89 inclusive** (§6 grade
   scale: B−, B, or B+).

*The practical floor for professional work.*
**Observable indicators:** correct standard and vehicle; at least three authority
categories; gaps in adverse authority or proposed order; limited self-assessment.

### Level: Deficient

A motion is **Deficient** when **any** of the following holds (any one is
sufficient):

1. **Gate fails.** The Principle 7 candor gate fails, OR
2. **Below band.** The composite score is **79 or below** (§6 grade scale:
   C+ and below), OR
3. **Hallucination override.** Any hallucinated citation is present — regardless
   of composite score.

*Non-conformant — the filing presents professional-responsibility risk and is
unlikely to succeed on the merits as submitted.* **Observable indicators:** wrong
vehicle, missing authority categories, no adverse authority, boilerplate proposed
order, no self-assessment, hallucinated citations.

### Conformance Claims

A **conformance claim** asserts that a specific motion meets a named level.
A claim is well-formed only if it states all five elements below; a claim
missing any element is not a LGS conformance claim:

1. **Level claimed** — Expert, Competent, or Deficient.
2. **Version** — "LexGrade Standard v1.1." Claims are version-specific; levels
   are not comparable across major versions. Minor versions share weights,
   gate logic, and thresholds, so levels are comparable across 1.x editions,
   but a claim names the exact edition graded: a v1.0 claim is not restated
   as a v1.1 claim without re-grading.
3. **Composite score** and the date graded.
4. **Jurisdiction profile** — the base NY calibration, or a named profile
   (see **Scope**).
5. **Grader** — self-assessment, the named human grader(s), or the model and
   settings used for an automated grade.

**What a claim asserts — and what it does not.** A claim of a level asserts only
that, at the stated version and on the stated date, the motion's composite fell
in that level's band **and** the level's gate and precondition conditions held.
It does **not** assert that the filing is procedurally proper (that is the
filer's Principle 1 responsibility, confirmed independently), that every citation
was verified (verification is mandatory but is the claimant's act, not the
Standard's guarantee), or that the motion will be granted. A claim is for one
motion as graded; it does not transfer to revisions, which must be re-graded.

### Automatic Demotion Rules (LLM benchmarking)

- Any hallucinated citation → **Deficient**, regardless of composite score.
- Wrong procedural vehicle → cannot exceed **Competent**.
- Missing Memorandum of Law → cannot exceed **Competent**.
- No adverse authority addressed → cannot exceed **Competent**.

### Critical LLM Failure Modes

1. **Hallucinated citations.** The most disqualifying failure. Verify every case.
   Measured per response to case-law queries: 58–88% (general LLMs) / 17–33%
   (specialized legal AI).
2. **Jurisdiction confusion.** Mixing federal and state procedure; citing the
   wrong department as binding; applying FRCP standards in a CPLR motion.
3. **Advocacy deficit.** Producing neutral memoranda when the task is persuasive
   motion practice. The motion should argue, not just inform.
4. **Metacognitive absence.** Inability to self-assess. Most models will not
   identify weaknesses in their own output unless prompted.
5. **Multi-motion blindness.** Treating motions in isolation, ignoring
   sequencing, timing, or interaction with other pending motions.
6. **Judicial path dependence.** When a court has signed a series of proposed
   orders from one side, each becomes the baseline for the next. Some counsel
   press this by filing repeated proposed orders that each move the baseline
   incrementally. Motions that fail to account for this — defensively
   (forcing the court to reassess the full record) or offensively (drafting
   orders that establish favorable baselines) — are strategically incomplete.
7. **Technique Register failure modes:** *editorial gloss on negative facts*
   (adding characterizing language to factual absences); *relief escalation*
   (calibrating relief up to match evidentiary strength — the opposite of expert
   practice); *flat invisibility* (drafter invisibility by default, lacking
   controlled tension); *technique shoehorning* (forcing techniques to inflate
   the Register count).

---

## 6. Composite Scoring

This section is self-contained: it defines the composite formula in full and is
reproducible — a reader given the six principle grades, the P7 deductions, and
the negative modifiers can recompute the composite to the decimal.

### Weight distribution

| Principle | Weight | Role |
|-----------|--------|------|
| P1 Procedural Integrity | Precondition | Deferred to court rules; not scored |
| P2 Problem Diagnosis | 10% | /10 points |
| P3 Legal Authority | 20% | /20 points |
| P4 Factual Foundation | 18% | /18 points |
| P5 Writing and Organization | 12% | /12 points |
| P6 Strategic Sophistication | 10% | /10 points |
| P7 Ethics and Candor | Gate + deductions | Deductions subtracted from composite |
| P8 Self-Assessment | 10% | /10 points |
| **Subtotal (P2–P6, P8)** | **80%** | **/80 points** |

### Composite formula

Compute in this exact order; each step takes the previous step's output.

1. **Grade each scored principle 0–100.** Use the per-principle score bands in
   §4 (these are 0–100 descriptors for a single principle, not the composite
   grade scale below).
2. **Weighted points.** Multiply each principle's 0–100 grade by its weight and
   sum: `subtotal = Σ (gradeₚ ÷ 100 × weightₚ)` over P2, P3, P4, P5, P6, P8. The
   result is out of **80** points.
3. **Scale to a 100-point basis.** `scaled = subtotal ÷ 0.80`.
4. **Apply modifiers on the 100-point basis.** `adjusted = scaled + net modifier
   − P7 deductions`, where the **net modifier** is the signed sum of any positive
   modifiers minus the negative modifiers (negative modifiers floor at −5; see
   below), and **P7 deductions** is the sum of the §4 Principle 7 deductions.
5. **Floor and cap.** Clamp to the range `[0, 98]`. The A+ cap is 98.

```
subtotal  = Σ (gradeₚ ÷ 100 × weightₚ)        over P2,P3,P4,P5,P6,P8   → /80
scaled    = subtotal ÷ 0.80                                            → /100
adjusted  = scaled + net modifier − P7 deductions
Composite = min(98, max(0, adjusted))
```

P7 deductions and negative modifiers are applied **after** scaling, directly on
the 100-point basis, so the same point is never deducted on two scales.

### Two distinct penalty mechanisms (no double-counting)

LGS has two separate penalty channels; a single defect is charged to **exactly
one** of them, never both:

| Mechanism | Where defined | What it charges | Magnitude |
|-----------|---------------|-----------------|-----------|
| **P7 candor deductions** | §4, Principle 7 table | Candor-gate violations — fabricated citations/holdings, undisclosed adverse authority, false facts, wrong vehicle, ad hominem, etc. | −20 to −3 per the §4 ladder |
| **Negative modifiers** | This section | Quality nudges for *non-candor* shortfalls not already caught by a P7 deduction | −1 to −2, capped at −5 total |

A hallucinated citation is charged **once**, under LGS 7.1 (−20, forces
Deficient). It is **not** also a negative modifier — the prior "−10 hallucinated
citation" modifier is removed to end the double-count. A missing-adverse-authority
defect that already triggers the LGS 7.3 deduction (−15) is likewise not also
charged the −2 modifier; the −2 modifier applies only where adverse authority is
*thin* without rising to a candor-gate violation.

### Negative modifiers (−5 max)

| Modifier | Deduction |
|----------|-----------|
| Bare statutory assertion (no case law) | −1 each |
| Thin adverse-authority treatment (not a LGS 7.3 violation) | −2 |

The negative-modifier channel is capped at **−5** total, so quality nudges can
never swamp the composite; serious candor failures run through the P7 ladder
instead.

**Score cap.** The maximum composite score is 98 (A+).

### Reporting the composite

The composite is a gateway, not the product. It exists so that a motion can
be placed in a conformance level and so that two gradings of the same motion
can be compared. The product of an LGS grading is the set of per-criterion
findings: for each criterion, whether it is satisfied, short, or N/A, and
for each shortfall, the specific defect in the motion. The following rules
govern how a grading is reported. They are normative for anyone making a
conformance claim (§5) and for any tool that presents LGS results. For any
other use they are informative.

1. **Findings before the number.** A reported grading leads with the
   per-criterion findings and the Principle 7 ladder (each deduction, with
   the citation or statement that triggered it). The composite, the letter,
   and the conformance level follow. A composite reported without the
   findings behind it is not a well-formed LGS result.
2. **Never the number alone.** The composite is never presented without the
   five elements of a conformance claim (§5): level, version, score and
   date, profile, grader. "LGS 91" with nothing else is not an LGS result.
3. **Integers.** The formula reproduces to the decimal; the instrument does
   not resolve to the decimal (§3, *Validity and its limits*). Report the
   composite as an integer, rounding half up.
4. **The Register stays separate.** The Technique Register count and the
   techniques observed are reported on their own line. They are never added
   to the composite or used to break ties in it.
5. **Comparisons show profiles.** Two motions, or two models, are compared by
   their per-principle grades and per-criterion findings side by side. A
   rank ordering by composite alone claims a precision the instrument does
   not have.
6. **For education, the findings are the feedback.** Where the Standard is
   used to grade student work, the per-criterion findings and the Principle 8
   responses are what the student receives first; the number may be withheld
   entirely. Specific, individualized feedback is what the evidence shows
   improves subsequent legal work (Sargent & Curcio 2012; Schwarcz & Farganis
   2017).

The worksheet (§10) carries a line for confirming that the per-criterion
findings accompany the composite.

### Grade scale

The grade-scale band edges are aligned to the §5 conformance boundaries: the
A−/B+ seam sits at **90/89** (the Expert/Competent boundary) and the B−/C+ seam
sits at **80/79** (the Competent/Deficient boundary). No score maps to two
conformance levels.

| Letter | Numeric Range | Conformance Level |
|--------|--------------|-------------------|
| A+ | 98 | Expert |
| A | 95–97 | Expert |
| A− | 90–94 | Expert |
| B+ | 86–89 | Competent |
| B | 83–85 | Competent |
| B− | 80–82 | Competent |
| C+ and below | 79 and below | Deficient |

*Note on the two scales.* The §4 per-principle bands (e.g. "B+ (88–91)") grade a
**single principle** and are intentionally finer-grained; the composite grade
scale above maps the **final composite** to a letter and conformance level. They
share letter labels but are different instruments — a principle can earn "B+
(88–91)" while the motion's composite lands in a different band.

### Motion-type overlays

The base LGS weights apply to all motion types. The overlays below adjust
weights and add threshold requirements for common motion types without altering
LGS criterion IDs. Document the applicable overlay on the worksheet.

| Motion Type | Weight Adjustments | Required Framework | Additional Threshold Items |
|-------------|--------------------|--------------------|----------------------------|
| Summary Judgment (CPLR 3212) | P4 →23%; P5 →7% | Alvarez v. Prospect Hosp.; Zuckerman v. City of NY | Statement of Material Facts (§202.8-g if applicable) |
| Dismissal (CPLR 3211) | P2 →15%; P4 →13% | Leon v. Martinez; EBCI (§3211(a)(7)) | Identify the specific §3211(a) subdivision |
| Contempt (Jud. Law §753) | P4 →23%; P5 →7% | Clear mandate + willful disobedience; civil vs. criminal | Certified copy of the violated order |
| Discovery (§3124/§3126) | Base weights apply | Proportionality; Allen v. Crowell-Weedon | Good-faith conferral affirmation (§202.7) |

---

## 7. Technique Register (Informative)

The 39-technique Technique Register is an **informative companion** to the
Standard. Techniques are not criteria: a motion can satisfy every LGS criterion
at the Expert level with zero techniques present. The Register answers a different
question — not "is this motion good?" but "how does this motion persuade?" It is
reported alongside the composite score but does not modify it.

| Category | Count | Technique IDs |
|----------|-------|---------------|
| Factual | 4 | #1–#4 |
| Writing | 7 | #5–#11 |
| Strategy | 13 | #12–#24 |
| Voice | 4 | #25–#28 |
| Ethos | 2 | #29–#30 |
| Credibility | 3 | #31–#33 |
| Structure | 6 | #34–#39 |

See the Technique Register (companion document) for full definitions.

---

## 8. Outcome Tracking

For filed motions, record the outcome on the worksheet: Granted, Granted in Part
(specify items), Denied (record the court's stated reason and map it to an LGS
Principle), Withdrawn, or Settled. Target correlation: motions scoring A (95+)
should be granted or prompt settlement 80%+ of the time. Divergence indicates the
weights should be recalibrated. This hypothesis is untested and requires 50–100
graded motions with outcomes to validate.

---

## 9. Plain-Language Quick Start

For users who are not attorneys.

| Principle | What it checks | Analogy |
|-----------|----------------|---------|
| P1. Procedural Integrity | Did you follow the court's filing rules? (The court defines these — LGS does not.) | Like a tax return: missing a required form = rejected. Check the court's rules. |
| P2. Problem Diagnosis | Correct type of legal problem identified? | Wrong diagnosis = wrong treatment. |
| P3. Legal Authority | Right laws and cases supporting your request? | Five categories: statute, binding, persuasive, administrative, adverse. |
| P4. Factual Foundation | Facts proven with specific documents? | Every claim needs a receipt. |
| P5. Writing | Clear, organized, respectful tone? | Persuade through evidence, not emotion. |
| P6. Strategy | Considers the bigger picture? | Chess, not checkers. |
| P7. Ethics and Candor | Citations real, adverse law disclosed, facts accurate? | Honesty toward the court is non-negotiable. |
| P8. Self-Assessment | Can the drafter name their own weaknesses? | Honest mirror, not a cheerleader. |

**Key terms.**

| Term | Definition |
|------|-----------|
| Binding authority | A higher court's decision the judge must follow (Court of Appeals, Appellate Division). |
| Adverse authority | The strongest legal argument against your position. You must address it — ignoring it is an ethical violation. |
| Proposed order | A draft of the decision you want the judge to sign, ready for signature. |
| Hallucinated citation | A case reference that does not exist. AI tools frequently invent these. Every citation must be verified. |

---

## 10. Scoring Worksheet

Complete one worksheet per motion (or per model, for benchmarking).

| Principle | Weight | Grade | Points | Notes / Flags |
|-----------|--------|-------|--------|---------------|
| P1. Procedural Integrity | Precondition | — | — | Confirmed against court rules? (filer) |
| P2. Problem Diagnosis | 10% | | /10 | |
| P3. Legal Authority | 20% | | /20 | |
| P4. Factual Foundation | 18% | | /18 | |
| P5. Writing and Organization | 12% | | /12 | |
| P6. Strategic Sophistication | 10% | | /10 | |
| P7. Ethics and Candor (gate) | Gate | | | Total deductions: ___ |
| P8. Self-Assessment | 10% | | /10 | |
| **Subtotal (P2–P6, P8)** | **80%** | | **/80** | |
| Scaled subtotal (÷ 0.80) | | | /100 | Subtotal ÷ 0.80 → 100-point basis |
| Net Modifier (signed) | | | | Positive − negative; negatives floor at −5 |
| P7 Ethical Deductions | | | | From the §4 Principle 7 ladder |
| **COMPOSITE SCORE** | | | **/100** | Scaled + net modifier − P7 deductions, clamped [0, 98]; report as an integer |
| Per-criterion findings attached | Required | | | Findings and P7 ladder precede the composite (§6, Reporting) |
| Technique Register | Non-scored | | __/39 | Informative; kept separate from the score |

| Field | Entry |
|-------|-------|
| Motion Type | |
| Calibration Overlay Applied | |
| Weight Adjustments (if any) | |
| Model / Drafter | |
| Date Graded | |
| Grader | |
| Conformance Level | Expert / Competent / Deficient |
| Outcome (if filed) | Granted / Granted in Part / Denied / Withdrawn / Settled |
| Court's Stated Reason (if denied) | |
| LGS Principle Mapped to Denial | |

---

## 11. Mapping Table

Every scored LGS criterion maps to its source. v1.0 carried the source
methodology over without addition or omission. v1.1 adds two criteria
(LGS 3.10, LGS 5.6) whose source is the v1.1 revision record and the
scholarship named in §12, marked "v1.1" below; nothing was dropped. Principle 1
is a precondition and carries no scored criteria.

| LGS Criterion ID | Title | Methodology Source |
|-------------------|-------|--------------------|
| LGS 2.1 | Question Characterization | §II-A, A+ descriptor |
| LGS 2.2 | Vehicle Selection | §II-A, A+ descriptor |
| LGS 2.3 | Alternative Vehicle Analysis | §II-A, A+ descriptor |
| LGS 2.4 | Diagnosis-to-Strategy Linkage | §II-A, A+ descriptor |
| LGS 3.1 | Statutory Text | §II-B, Authority Hierarchy (a) |
| LGS 3.2 | Binding Authority | §II-B, Authority Hierarchy (b) |
| LGS 3.3 | Persuasive Authority | §II-B, Authority Hierarchy (c) |
| LGS 3.4 | Administrative and Practice Sources | §II-B, Authority Hierarchy (d) |
| LGS 3.5 | Adverse Authority | §II-B, Authority Hierarchy (e); NY RPC 3.3(a)(2) |
| LGS 3.6 | Burden of Proof | §II-B, Specific Evaluation Criteria |
| LGS 3.7 | Statutory-Interpretation Methodology | §II-B, Specific Evaluation Criteria; Gluck |
| LGS 3.8 | Analogical Reasoning | §II-B, Specific Evaluation Criteria; Sherwin |
| LGS 3.9 | Policy Rationale | §II-B, Specific Evaluation Criteria; Gluck |
| LGS 3.10 | Case Synthesis | v1.1; Clark & DeSanctis |
| LGS 4.1 | Personal Knowledge | §III, Specific Evaluation Criteria |
| LGS 4.2 | Evidentiary Foundation | §III, Specific Evaluation Criteria |
| LGS 4.3 | Pinpoint Exhibit Citation | §III, Specific Evaluation Criteria |
| LGS 4.4 | Exhibit List Completeness | §III, Specific Evaluation Criteria |
| LGS 4.5 | Evidentiary Honesty | §III, A+ descriptor; Sherwin |
| LGS 5.1 | Argumentative Point Headings | §IV; Commercial Division Rule 17 |
| LGS 5.2 | Tone | §IV, Specific Evaluation Criteria |
| LGS 5.3 | Economy | §IV, Specific Evaluation Criteria |
| LGS 5.4 | Citation Structure | §IV, Specific Evaluation Criteria |
| LGS 5.5 | Audience Calibration | §IV, Specific Evaluation Criteria; Wizner |
| LGS 5.6 | Analytical Structure | v1.1; Clark & DeSanctis |
| LGS 6.1 | Proposed Order Quality | §V, Specific Evaluation Criteria; Clermont |
| LGS 6.2 | Appellate Posture | §V, Specific Evaluation Criteria; Clermont |
| LGS 6.3 | Multi-Motion Strategy | §V, Specific Evaluation Criteria |
| LGS 6.4 | Interdisciplinary Command | §V, Specific Evaluation Criteria; Rakoff |
| LGS 6.5 | Access-to-Justice Calibration | §V, Specific Evaluation Criteria; Wizner |
| LGS 7.1 | No Fabricated Citations | §VI, Automatic Deductions |
| LGS 7.2 | No Fabricated Holdings | §VI, Automatic Deductions |
| LGS 7.3 | Adverse Authority Disclosed | §VI, Automatic Deductions; NY RPC 3.3(a)(2) |
| LGS 7.4 | No False Statements of Fact | §VI, Automatic Deductions |
| LGS 7.5 | Correct Procedural Vehicle | §VI, Automatic Deductions |
| LGS 7.6 | Controlling Authority Cited | §VI, Automatic Deductions; NY RPC 1.1 |
| LGS 7.7 | No Ad Hominem | §VI, Automatic Deductions; 22 NYCRR 130-1.1(c) |
| LGS 7.8 | No Trial Decision as Binding | §VI, Automatic Deductions |
| LGS 7.9 | Interpretive Methodology Used | §VI, Automatic Deductions; Gluck |
| LGS 7.10 | Procedural Length Compliance | §VI, Automatic Deductions; 22 NYCRR 202.8-b |
| LGS 7.11 | Certification Filed | §VI, Automatic Deductions; 22 NYCRR 130-1.1-a |
| LGS 7.12 | String Citations Explained | §VI, Automatic Deductions; Clermont |
| LGS 8.1 | Strongest Ground for Denial | §VII, Prompt 1 |
| LGS 8.2 | Counter-Argument Preemption | §VII, Prompt 2 |
| LGS 8.3 | Filing Judgment | §VII, Prompt 3; Kronman |
| LGS 8.4 | Vulnerable-Party Impact | §VII, Prompt 4; Wizner |
| LGS 8.5 | Appellate Resilience | §VII, Prompt 5; Clermont |

**Total LGS criteria: 47**, across Principles P2–P8 (Principle 1 is a procedural
precondition with no criteria; 45 in v1.0, two added in v1.1). P2–P6 and P8 are **band-scored** and carry the
100-point composite; P7 criteria are **candor-gate prohibitions** applied as
deductions, not band-scored.

---

## 12. Regulatory Foundation

Every criterion traces to one or more of the following authorities. They are the
**source of the quality expectations LGS measures**, not requirements LGS
imposes (procedural requirements are the filing court's; see Principle 1).

**Statutory / regulatory.** CPLR §§2101, 2103, 2106, 2214, 2219, 3120, 3124,
3126, 3211, 3212, 4518 (procedure, motion practice, evidence); 22 NYCRR §§130-1.1,
130-1.1-a, 202.1 et seq., 202.7, 202.8-a, 202.8-b (sanctions, certification, motion
procedure); NY RPC Rules 1.1, 3.1, 3.3, 3.4 (competence,
meritorious claims, candor, fairness); ABA Standards for Imposing Lawyer
Sanctions; Commercial Division Rules 17, 19-a.

**Scholarly.**

- Martha Minow & Todd D. Rakoff, "[A Case for Another Case Method](https://scholarship.law.vanderbilt.edu/vlr/vol60/iss2/11/)," 60 Vand. L. Rev. 597 (2007) — problem diagnosis.
- Abbe R. Gluck, "[The States as Laboratories of Statutory Interpretation](https://www.yalelawjournal.org/article/the-states-as-laboratories-of-statutory-interpretation-methodological-consensus-and-the-new-modified-textualism)," 119 Yale L.J. 1750 (2010) — statutory interpretation and legislative purpose.
- Emily Sherwin, "[A Defense of Analogical Reasoning in Law](https://chicagounbound.uchicago.edu/uclrev/vol66/iss4/3/)," 66 U. Chi. L. Rev. 1179 (1999) — analogical reasoning.
- Anthony T. Kronman, *[The Lost Lawyer: Failing Ideals of the Legal Profession](https://www.hup.harvard.edu/books/9780674539273)* (Harvard University Press 1993) — practical wisdom and filing judgment.
- Stephen Wizner, "[The Law School Clinic: Legal Education in the Interests of Justice](https://ir.lawnet.fordham.edu/flr/vol70/iss5/29/)," 70 Fordham L. Rev. 1929 (2002) — institutional context and access to justice.
- Kevin M. Clermont, "[Staying Faithful to the Standards of Proof](https://scholarship.law.cornell.edu/clr/vol104/iss6/2/)," 104 Cornell L. Rev. 1457 (2020) — standards of decision and the standard of review.
- Bryan A. Garner, *[The Elements of Legal Style](https://global.oup.com/academic/product/the-elements-of-legal-style-9780195141627)* (2d ed., Oxford University Press 2002) — writing and citation standards.

**Legal-education and assessment scholarship (added in v1.1).** These
sources concern how legal writing is assessed. They ground the two v1.1
criteria and the validity and reporting provisions.

- Jessica L. Clark & Christy H. DeSanctis, "[Toward a Unified Grading Vocabulary: Using Rubrics in Legal Writing Courses](https://jle.aals.org/home/vol63/iss1/2)," 63 J. Legal Educ. 3 (2013) — rubrics as a shared, named vocabulary for the qualities of legal writing; the basis for LGS 3.10 and LGS 5.6 as separately named criteria.
- Carol Springer Sargent & Andrea A. Curcio, "[Empirical Evidence That Formative Assessments Improve Final Exams](https://jle.aals.org/home/vol61/iss3/4/)," 61 J. Legal Educ. 379 (2012) — formative feedback improved subsequent performance by up to a letter grade; why the findings, not the number, are the output.
- Daniel Schwarcz & Dion Farganis, "[The Impact of Individualized Feedback on Law Student Performance](https://scholarship.law.umn.edu/faculty_articles/644)," 67 J. Legal Educ. 139 (2017) — a natural experiment: individualized feedback raised performance by about a third of a grade increment, controlling for entering credentials.
- Lindsey P. Gustafson, "[The Compounding Effects of Assessment: How Our Failure to Coordinate Formative Assessments May Impact Their Validity](https://jle.aals.org/home/vol73/iss1/4)," 73 J. Legal Educ. no. 1 (2024) — validity of an assessment system as a whole, and how uncoordinated assessment erodes it; the basis for the consequential-validity caveat in §3.

**Empirical LLM research.** Matthew Dahl, Varun Magesh, Mirac Suzgun & Daniel E.
Ho, "[Large Legal Fictions: Profiling Legal Hallucinations in Large Language
Models](https://doi.org/10.1093/jla/laae003)," 16 J. Legal Analysis 64 (2024) —
hallucination in 58–88% of answers to verifiable federal case-law questions,
across GPT-4, GPT-3.5, PaLM 2, and Llama 2; Varun Magesh, Faiz Surani, Matthew
Dahl, Mirac Suzgun, Christopher D. Manning & Daniel E. Ho,
"[Hallucination-Free? Assessing the Reliability of Leading AI Legal Research
Tools](https://doi.org/10.1111/jels.12413)," 22 J. Empirical Legal Stud. 216
(2025) — hallucination in 17–33% of responses from RAG-based legal research
tools; Mata v. Avianca, Inc., No. 22-cv-1461 (S.D.N.Y. 2023) — landmark
sanctions for AI-generated fabricated citations.

---

## 13. Versioning and License

**This document:** LexGrade Standard v1.1.

**Stack coupling.** LGS v1.1 is pinned in `methodology.yaml` together with the
Technique Register at v1.0, which v1.1 does not change.

**Versioning intent.** Minor revisions that add criteria or techniques, or
clarify existing text, without changing weights, deductions, gate logic, or
conformance thresholds produce a minor release (1.1, 1.2, …). A change to
weights, gate logic, or conformance thresholds requires a major release (2.0).
Criterion IDs are stable across minor releases; a criterion added in a minor
release takes the next unused number in its Principle.

**Edition history.**

| Edition | Status | Changes |
|---------|--------|---------|
| v1.0 | Published, February 2026 | Initial edition: 8 principles, 45 criteria, composite formula, three conformance levels. Remains published and citable. |
| v1.1 | Proposed | Adds LGS 3.10 (Case Synthesis) and LGS 5.6 (Analytical Structure); adds §3 *Validity and its limits* and §6 *Reporting the composite*; adds the legal-education scholarship in §12; corrects the worksheet's Technique Register denominator to 39. No weight, deduction, gate rule, or threshold changed. |

**License.** CC-BY-SA 4.0. © 2026 LexGrade. Cite as: "LexGrade Standard v1.1,
LexGrade (lexgrade.org), CC-BY-SA 4.0." Renamed forks must update the
attribution to their chosen name per the trademark policy (see GOVERNANCE.md).

---

---

*Questions, corrections, and contributions are welcome as issues or pull
requests in the LexGrade repository.*
