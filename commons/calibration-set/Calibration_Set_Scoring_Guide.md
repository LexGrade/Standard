# CALIBRATION SET

**LexGrade Standard v1.0**

## Three-Band Exemplar Scoring Guide

**Fact Pattern:** DRL § 237(a)/(d) Monied Spouse Determination, Interim Counsel
Fees & Appraisal-Fee Advance
**Case:** Sample v. Sample, Index No. 000000/2026
**Court:** NY Supreme Court, Sample County (Hon. Taylor J. Bench, J.S.C.)

> **Fictionalized fact pattern; constructed specimens.** The parties (Sample v.
> Sample), counsel, judge, index number, business, and all dollar figures are
> invented for public demonstration — no real persons, entities, or financial
> data are depicted. Each exemplar was **authored as a calibration specimen**
> to represent its scoring band; none is a filed document, and none is raw
> model output. The authorities cited in Exemplars A and B are real published
> decisions whose pinpoint pages were verified against the published opinion
> texts (via CourtListener) on 2026-07-27; Exemplar C's citations are
> deliberately fabricated as an anti-pattern demonstration and are labeled as
> such.

---

### Purpose

This calibration set demonstrates that the LexGrade Standard v1.0 discriminates
between quality levels on identical facts. Three motions address the same
DRL § 237(a)/(d) application with the same case record, the same parties, and
the same relief sought. The rubric assigns different scores to each, and this
guide shows the full arithmetic so any reader can recompute every composite to
the decimal.

Licensed CC-BY-SA 4.0. © 2026 LexGrade.
Version 2.0 — July 2026 (replaces the withdrawn v1 exemplar set)

---

## 1. Overview

| Band | Description | Production Method | Score | Tier |
|------|-------------|-------------------|-------|------|
| A | Expert-band specimen, authored to satisfy the criteria | Constructed specimen | A (95.6) | Expert |
| B | Competent-band specimen with characteristic single-pass gaps | Constructed specimen | B− (80.1) | Competent |
| C | Deliberately flawed (wrong vehicle, fabricated cites) | Anti-pattern demonstration | F (0) | Deficient |

**Provenance, stated plainly.** These specimens were authored in July 2026 by
the LexGrade maintainers with model assistance, each written *to* its band: A to
satisfy the Expert criteria, B to reflect a competent single-pass draft's
characteristic gaps, C to exhibit the Critical LLM Failure Modes on purpose.
They replace an earlier exemplar set that was withdrawn. Constructed specimens
demonstrate that the rubric's bands are *separable* — that the criteria, applied
in order, sort the three documents correctly and reproducibly. They do not
demonstrate how any particular drafting method performs in the wild; that claim
requires genuine raw outputs, which a future round can add under this same
guide.

### 1.1 Scoring Methodology

This guide uses the reproducible composite formula from §6 of the LexGrade
Standard v1.0. The order of operations is fixed:

1. **Grade each scored principle 0–100** (P2, P3, P4, P5, P6, P8) using the
   per-principle bands in §4.
2. **Weighted subtotal.** Multiply each grade by its weight (P2 10%, P3 20%,
   P4 18%, P5 12%, P6 10%, P8 10%) and sum → a subtotal out of 80.
3. **Scale.** Divide by 0.80 → a 100-point basis.
4. **Apply the net modifier and P7 deductions on the 100-point basis.**
   Negative modifiers floor at −5; the composite floors at 0 and caps at 98.

**Ethical gate (P7):** pass/fail with graduated deductions. Any hallucinated
citation forces the Deficient tier regardless of composite (§5).

**Threshold gate (P1):** procedural compliance is a precondition the filer
confirms independently against the court's own rules; it is not scored. For
these specimens, Exemplars A and B are drafted procedurally complete on their
face and P1 is stipulated for calibration purposes; Exemplar C fails it on its
face (no index number, no return date, unsigned).

**Single-rater limitation:** this set was scored by its authors. Inter-rater
reliability testing with 3+ independent graders is required to validate scoring
consistency — the protocol, agreement threshold (Krippendorff's α ≥ 0.80), and
submission route are in
[`Inter_Rater_Reliability_Protocol.md`](Inter_Rater_Reliability_Protocol.md).

**Key finding:** the rubric produces a 95.6-point spread across three motions
on identical facts (95.6 vs. 80.1 vs. 0). The separations are driven by
specific, verifiable criteria — exhibit-tied factual foundations, authority
hierarchy depth with verified pinpoints, argumentative structure, proposed-order
completeness, self-assessment, and the candor gate — not by impressionistic
quality judgments.

---

## 2. Exemplar A — Expert-Band Specimen

**File:** [`exemplar-a/Exemplar_A_Expert_Band.md`](exemplar-a/Exemplar_A_Expert_Band.md)

| Principle | Weight | Grade | Points | Rationale (anchors) |
|-----------|--------|-------|--------|---------------------|
| P2 Diagnosis | 10% | 96 | 9.60 | Correct vehicle and statute pairing (§ 237(a) + (d)); burden sequence stated (presumption + who rebuts); alternatives considered and rejected on the record (Statement of Limitations ¶ 5). |
| P3 Authority | 20% | 95 | 19.00 | Statute quoted once, accurately paraphrased elsewhere; four real cases across the hierarchy (two Court of Appeals, 2d Dept, 1st Dept) with verified pinpoints; policy purpose engaged; adverse position (equal-split default) engaged fairly and distinguished. |
| P4 Factual | 18% | 96 | 17.28 | Every figure tied to an exhibit with page pinpoints; exhibit list table cross-referenced by paragraph; knowledge foundations distinguished (personal vs. documentary); 202.16(k) compliance addressed candidly. |
| P5 Writing | 12% | 95 | 11.40 | Argumentative point headings (full-sentence contentions); disciplined structure; restrained tone; disparity table; no blanks. |
| P6 Strategy | 10% | 95 | 9.50 | Proposed order complete with service provision and 20-day deadlines; reallocation clause frames the relief as protective of both sides; counterarguments anticipated and answered (employment; deferral). |
| P8 Self-Assessment | 10% | 97 | 9.70 | Statement of Limitations names the strongest ground for denial, the evidentiary dependence on produced returns, and the provisional nature of the § 237(d) advance. |

```
subtotal = 9.60 + 19.00 + 17.28 + 11.40 + 9.50 + 9.70 = 76.48 / 80
scaled   = 76.48 ÷ 0.80                               = 95.60
modifiers: none | P7 deductions: none (gate PASS)
Composite = 95.6  →  A  →  Expert
```

All three Expert conditions hold (§5): the candor gate passes with no
deductions, P1 is confirmed (stipulated as above), and the composite is ≥ 90.

---

## 3. Exemplar B — Competent-Band Specimen

**File:** [`exemplar-b/Exemplar_B_Single_Pass.md`](exemplar-b/Exemplar_B_Single_Pass.md)

| Principle | Weight | Grade | Points | Rationale (anchors) |
|-----------|--------|-------|--------|---------------------|
| P2 Diagnosis | 10% | 87 | 8.70 | Correct vehicle and statutes; presumption identified; no alternative-vehicle analysis and no diagnosis→strategy linkage. |
| P3 Authority | 20% | 84 | 16.80 | Statute paraphrased, never quoted; one Court of Appeals case (O'Shea) cited without a pinpoint; the interim-timing and expert-fee points are argued from common sense with no case law; purpose of the statute genuinely engaged. |
| P4 Factual | 18% | 84 | 15.12 | Figures specific and internally consistent, affirmed on personal knowledge; **zero exhibit references**, no exhibit list, no net-worth recital. |
| P5 Writing | 12% | 89 | 10.68 | Prose is clear and civil; topic-style headings rather than argumentative ones; blanks left in the notice (return time) and an undated signature line; legal argument bleeds into affirmation ¶¶ 8–9, 13. |
| P6 Strategy | 10% | 86 | 8.60 | Proposed order present but minimal — no service provision, no payment deadline; adverse demand letter engaged in a single sentence; without-prejudice framing preserved. |
| P8 Self-Assessment | 10% | 50 | 5.00 | Entirely absent. Scored, not N/A, per §2 ("the drafter omitted it" is a deficiency under the criterion). |

```
subtotal = 8.70 + 16.80 + 15.12 + 10.68 + 8.60 + 5.00 = 64.90 / 80
scaled   = 64.90 ÷ 0.80                                = 81.13
net modifier = −1 (bare statutory assertion: the § 237(d)
               point is argued with no case law)
P7 deductions: none (gate PASS — every citation real and accurate)
Composite = 81.13 − 1 = 80.1  →  B−  →  Competent
```

The 15.5-point gap to Exemplar A decomposes into verifiable absences: the
exhibit layer (P4), the authority hierarchy beyond a single case (P3), the
argumentative-heading and completeness layer (P5, P6), and the entire
self-assessment (P8).

---

## 4. Exemplar C — Deliberately Flawed

**File:** [`exemplar-c/Exemplar_C_Deliberately_Flawed.md`](exemplar-c/Exemplar_C_Deliberately_Flawed.md)

| Principle | Weight | Grade | Points | Rationale (anchors) |
|-----------|--------|-------|--------|---------------------|
| P2 Diagnosis | 10% | 30 | 3.00 | Wrong vehicle (emergency OSC + sanctions for a fee application); discretionary standard misstated as mandatory; CPLR 3126 invoked with no discovery order; FRCP 11 cited in a CPLR action. |
| P3 Authority | 20% | 20 | 4.00 | Two fabricated citations and one fabricated quotation; no real case law; the only real authority (O'Shea) is misused. |
| P4 Factual | 18% | 25 | 4.50 | No exhibits, no net-worth statement; central income claim ($500,000) contradicts the produced record and rests on "everyone knows." |
| P5 Writing | 12% | 45 | 5.40 | Coherent and readable — which is what makes the anti-pattern instructive — but inflammatory, conclusory, and demand-driven. |
| P6 Strategy | 10% | 15 | 1.50 | No proposed order; relief overreach ($50,000 for a pro se movant; sanctions in lieu of allocation); ultimatum to the court ("rule within 5 days"). |
| P8 Self-Assessment | 10% | 0 | 0.00 | None; the document admits no weakness of any kind. |

**P7 deduction ledger (the gate fails):**

| ID | Violation | Deduction |
|----|-----------|-----------|
| LGS 7.1 | Fabricated citation — "Krantz v. Krantz, 89 A.D.4th 233" | −20 |
| LGS 7.1 | Fabricated citation — "Sample v. Moiety, 121 Misc.3d 998" | −20 |
| LGS 7.2 | Fabricated holding — quotation attributed to O'Shea ("counsel fees are mandatory whenever incomes differ") | −15 |
| LGS 7.5 | Wrong procedural vehicle | −10 |
| LGS 7.7 | Ad hominem ("fraud," "obstructionist") | −10 |
| | **Total** | **−75** |

```
subtotal = 3.00 + 4.00 + 4.50 + 5.40 + 1.50 + 0.00 = 18.40 / 80
scaled   = 18.40 ÷ 0.80                             = 23.00
Composite = 23.00 − 75 = −52  →  floored at 0  →  F  →  Deficient
```

Deficient three times over (§5): the candor gate fails, the composite is below
80, and the hallucination override applies. Note the arithmetic lesson: the
candor deductions (−75) exceed the document's entire scaled base (23.0). Under
this Standard there is no quality of prose that outruns fabricated authority.

---

## 5. Citation Verification Record

The real authorities in Exemplars A and B, verified against the published
opinion texts on 2026-07-27:

| Authority | Verified | Pinpoints used |
|-----------|----------|----------------|
| O'Shea v. O'Shea, 93 N.Y.2d 187 (1999) | Court of Appeals, decided 1999-04-29 | 190 (purpose; "wealthier litigant's wallet"), 193 (discretion; litigational parity; wearing-down) |
| DeCabrera v. Cabrera-Rosete, 70 N.Y.2d 879 (1987) | Court of Appeals, decided 1987-12-15 | 881 ("Indigency is not a prerequisite"; relative circumstances) |
| Prichep v. Prichep, 52 A.D.3d 61 (2d Dept 2008) | App. Div., decided 2008-05-06 | 65–66 (interim fees not deferred absent stated good cause) |
| Charpié v. Charpié, 271 A.D.2d 169 (1st Dept 2000) | App. Div., decided 2000-07-13 | 171–172 (finite resources; both parties' circumstances) |

Exemplar C's three "authorities" are fabricated by design and exist nowhere.

---

## 6. Running Your Own Round

Independent graders are the point. See the
[Call for Graders](Call_for_Graders.md) and the
[Inter-Rater Reliability Protocol](Inter_Rater_Reliability_Protocol.md);
machine consistency rounds follow the
[Machine Clarity Protocol](Machine_Clarity_Protocol.md). Round reports land in
[`results/`](results/) whatever they show.
