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

1. Score each weighted section (II-A, II-B, III, IV, V, VII) on
   the rubric's 0–100 scale and record a per-section rationale.
2. Determine pass/fail on the two gates (Section I Threshold and
   Section VI Ethical). For Section VI, identify and itemize any
   hallucinated citations you find — each is an automatic −20 and a
   gate failure.
3. Apply automatic deductions explicitly using the values in the
   rubric (hallucinated citation −20, wrong vehicle −5, missing
   Memorandum of Law −5, missing Proposed Order −3, missing Statement
   of Net Worth −2).
4. Compute the composite per the scaling formula in the rubric.
5. **Flag any section where rubric ambiguity made the scoring call
   difficult.** This is the highest-value qualitative data the round
   produces.

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

Each round produces one markdown report at
[`commons/calibration-set/results/`](results/), named per the convention
described in [`results/README.md`](results/README.md). The report
includes:

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
current quarter (see [`../TRANSPARENCY.md`](../TRANSPARENCY.md)).
Participation is volunteer. When sponsorship reaches a level where
paid grader time is sustainable, this section will be updated and
prior volunteers will be invited first.
