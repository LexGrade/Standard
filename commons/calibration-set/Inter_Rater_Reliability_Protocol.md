# Inter-Rater Reliability Protocol

**Document version:** 1.0 — May 2026
**Companion to:** [`Calibration_Set_Scoring_Guide.md`](Calibration_Set_Scoring_Guide.md)
**Issue template:** [`.github/ISSUE_TEMPLATE/inter-rater-scoring.md`](../../.github/ISSUE_TEMPLATE/inter-rater-scoring.md)
**License:** CC-BY-SA 4.0

---

## Why this protocol exists

The Scoring Guide states the limitation plainly:

> **Single-rater limitation:** This calibration set was scored by a single rater (the rubric's author). Inter-rater reliability testing with 3+ independent graders is required to validate scoring consistency.

A grading rubric that has only ever been applied by its author is a
hypothesis, not an instrument. Until independent graders apply the
rubric to the same exemplars and produce convergent scores, every
LexGrade score is downstream of one person's judgment. That is a
credibility ceiling we want to break through, and this protocol is the
mechanism.

Inter-rater reliability (IRR) work is *not* about producing the
"correct" score for any given exemplar. It is about answering a
different question: *given the published rubric, do trained independent
graders converge on similar scores?* Convergence validates the rubric.
Sustained divergence is evidence the rubric needs refinement — not
evidence that graders are wrong.

## Who can grade

The current calibration set is NY-flavored (DRL § 237(a), NY Supreme
Court, Sample County). To grade, you should be:

- **A New York-admitted attorney** (active or inactive registration)
  with motion-practice experience — matrimonial, family, or
  general-civil litigation. Law-school clinic faculty count. Recent
  graduates with a year of motion-drafting experience count.
- Willing to grade **blind**: read the exemplars before reading the
  Scoring Guide. (You may read the rubric itself — that's the
  instrument you're applying.)
- Comfortable having your scores published in the round's report.
  Anonymous publication is available; opt in or out on the issue
  template.

When jurisdiction modules expand beyond New York (federal district
court, CA Superior, TX district are on the post-MVP roadmap), this
section will list the corresponding bar admissions per module.

## What participation involves

**One full round = three exemplars graded = approximately 3–4 hours of
your time.** That estimate covers:

- Reading the three exemplars (Exemplar A expert-band specimen, Exemplar B
  single-pass competent-band specimen, Exemplar C deliberately flawed).
  Roughly 30–40 minutes each.
- Applying the LexGrade Standard v1.0 section-by-section, recording per-section
  scores and the rationale for any automatic deductions.
- Filing one GitHub issue per exemplar using the [inter-rater scoring
  template](../../.github/ISSUE_TEMPLATE/inter-rater-scoring.md).

You receive:

- Access to the three exemplars under [`commons/calibration-set/`](.),
  each published in full.
- The current rubric ([`commons/standard/LexGrade_Standard_v1.0.md`](../standard/LexGrade_Standard_v1.0.md))
  and technique register.
- No prior exposure to the Scoring Guide. The maintainer can answer
  procedural questions in the issue thread but will not pre-resolve
  ambiguities; ambiguities are the data.

## Scoring method

Apply the LexGrade Standard v1.0 exactly as written. Specifically:

1. Grade each scored principle (P2, P3, P4, P5, P6, P8) on the
   rubric's 0–100 scale per the §4 score bands, and record a
   per-principle rationale.
2. Determine pass/fail on the two gates: the Principle 1 threshold
   precondition and the Principle 7 candor gate. For Principle 7,
   identify and itemize every violation against the §4 deduction
   ladder by criterion ID (e.g., a hallucinated citation is LGS 7.1,
   −20 per instance, and forces the Deficient tier).
3. Itemize any negative modifiers per §6 (capped at −5 total; never
   double-charge a defect already deducted under Principle 7).
4. Compute the composite by the §6 formula, step by step: weighted
   subtotal /80 → ÷0.80 → apply net modifier and P7 deductions →
   clamp to [0, 98].
5. **Flag any criterion where rubric ambiguity made the scoring call
   difficult.** This is the highest-value qualitative data the round
   produces.

The deduction values live in the Standard itself (§4, Principle 7
ladder; §6, negative modifiers) — apply them from the published
Standard, not from memory or from this protocol.

Do *not* read the Scoring Guide before completing your scoring. The
guide exists to explain *why* the published scores landed where they
did; reading it first contaminates the independent-rater signal.

## Agreement threshold

The round-level statistic is **Krippendorff's alpha (α)** computed
across raters on the per-section ordinal scores. Krippendorff's alpha
is the appropriate choice for ordinal data with multiple raters and
tolerates missing scores when individual raters do not complete every
section, which keeps the protocol resilient to real-world dropouts.

- **α ≥ 0.80** is the conventional "good agreement" threshold for
  ordinal data and the bar this round targets.
- **0.667 ≤ α < 0.80** is acceptable for tentative conclusions and
  surfaces specific sections for rubric refinement.
- **α < 0.667** indicates the rubric is producing rater-dependent
  scores in its current form. The corrective is a rubric revision PR
  citing the IRR round, not a reshuffling of raters.

Where we cannot reach α ≥ 0.80, the round report documents the gap
candidly and proposes targeted rubric refinements. That is a
*successful* IRR round — it produces evidence the rubric needs work.
"We failed to reach 0.80, here is what we will change" is more
credible than a forced 0.80 result.

Percent agreement (the simpler statistic) will also be reported per
section so a reader can see which sections drove most of the
disagreement. Percent agreement is not used as the headline statistic
because it doesn't correct for chance agreement on ordinal scales.

## Resolving disagreement

Disagreement is the point. When graders diverge, the resolution path
is **not** "the maintainer decides which score is right." The path
is:

1. The round report names the sections with the most disagreement.
2. A GitHub issue is opened for each — labeled `rubric-refinement` —
   linking to the conflicting scores and the per-grader rationales.
3. A PR proposes a rubric clarification (more precise rubric text,
   added examples, a tightened scoring band). The PR is reviewed under
   the [GOVERNANCE.md](../GOVERNANCE.md) conflict-of-interest
   process; the maintainer publicly states which hat they are wearing
   in the review.
4. Subsequent IRR rounds re-test the refined rubric.

This is the same posture the [GOVERNANCE.md](../GOVERNANCE.md)
document takes throughout: disagreement gets handled in public, with a
record, not by quiet maintainer fiat.

## Output

Each round produces one markdown report in
`commons/calibration-set/results/` (the directory is created when the
first report lands). Two report series share it and are never merged:

```
{year}-q{quarter}-irr-round-{n}.md      (human IRR — this protocol)
{year}-q{quarter}-clarity-round-{n}.md  (machine clarity — see below)
```

`{n}` is the round number within the quarter — normally one, but the
convention supports more if grader availability allows. Only IRR rounds
validate; clarity rounds test machine-legibility (see
[Machine clarity rounds](#machine-clarity-rounds)).

The IRR report includes:

- Round number, dates, and rubric version graded against.
- Number of raters, jurisdictions represented, and (if opted in) names.
- Per-exemplar per-section scores from each rater in a table.
- Krippendorff's α (overall and per-section), with percent-agreement
  per section as a secondary statistic.
- The published reference scores from the Scoring Guide alongside
  the rater scores — for comparison, not as the answer key.
- A "rubric refinement candidates" section listing any sections where
  raters flagged ambiguity, with the corresponding rubric-refinement
  issues linked.

Reports are CC-BY-SA 4.0 like the rest of the calibration set. Forks
applying LexGrade to other jurisdictions are encouraged to run their
own rounds and publish their own results.

## How to participate

If you are eligible and willing:

1. Email `hello@lexgrade.org` (subject line: `IRR round
   participation`) so the maintainer can coordinate exemplar access
   and round timing.
2. Once you have the materials, score blind.
3. File one issue per exemplar via the
   [inter-rater scoring template](../../.github/ISSUE_TEMPLATE/inter-rater-scoring.md).
4. Engage in the round-report PR review when it lands. Your name (or
   `Grader N`) appears in the report per your preference.

The maintainer does not have a budget for paid grader time in the
current quarter. Participation is volunteer. When sponsorship reaches
a level where paid grader time is sustainable, this section will be
updated and prior volunteers will be invited first.

---

## Machine clarity rounds

The machine analogue of the human protocol above: grade the calibration
exemplars with independent language models and report whether they
converge. It answers one question: is the published Standard unambiguous
enough for a machine to follow? When independent models from different
vendors land near the same composite, the criteria are written clearly.
When they diverge, that divergence is a rubric-refinement candidate, the
same way human disagreement is.

> **Consistency is not validity.** Models share training data and biases
> and can agree on the same wrong score. A clarity round guards *clarity*
> and catches drift after rubric edits; the human IRR rounds remain the
> ground-truth anchor. Never report "the models agree" as "the Standard
> is validated."

*Provenance.* The method and thresholds are adapted from an earlier
inter-model grading harness that predates this repository; the recording
lives here.

### Method

1. **Grader input.** The model receives the LexGrade Standard v1.0
   (§§4–6: criteria, score bands, P7 deduction ladder, negative
   modifiers, composite formula) and one exemplar's full text. Nothing
   else — no Scoring Guide, no expected scores, no other model's output.
2. **Blind-by-procedure.** The Scoring Guide and expected composites are
   consulted only after the model's scores are final. If the operator or
   model already knows the expected scores, the round is recorded as
   **not blind** and reported as a consistency data point only.
3. **Output per exemplar.** A 0–100 grade for each scored principle
   (P2–P6, P8) with a one-line rationale each; P7 deductions itemized by
   criterion ID; negative modifiers itemized; the composite computed by
   the §6 formula, shown step by step.
4. **Context floor.** The grader model must accept the full Standard
   §§4–6 plus the exemplar in one context. Models capped below roughly
   8,000 tokens cannot run this protocol; attempting it produces silent
   truncation or request failures rather than grades. An earlier harness
   failed exactly this way and recorded vacuous passes. A round with zero
   completed grades must be recorded as a failed round.

### Thresholds

| Measure | Threshold |
|---------|-----------|
| Tolerance | A model's composite within ±10.0 points of the exemplar's expected score |
| Spread | Max−min composite across models for one exemplar ≤ 15.0 points |

A breach by itself does not condemn the model or the Standard. It flags
one of three things: the criteria are ambiguous at that exemplar, the
expected score needs re-derivation under the current formula, or the
model could not follow the worksheet. The round report says which.

### Recording

One markdown file per round, named per the convention in
[Output](#output). Each clarity report contains, at minimum: date;
grader model(s) and exact version ids; blind or not-blind, and why;
per-principle scores with rationales; the step-by-step composite
arithmetic; deltas against expected; and a "rubric-refinement
candidates" section for every breach or ambiguity encountered while
grading. A clarity round can motivate a rubric edit, but only IRR
rounds validate.
