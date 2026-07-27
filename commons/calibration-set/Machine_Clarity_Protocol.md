# Machine Clarity Protocol — LexGrade Standard v1.0

**What this is.** The machine analogue of the human
[Inter-Rater Reliability Protocol](Inter_Rater_Reliability_Protocol.md): grade
the calibration exemplars with independent language models and report whether
they converge. It answers one question: is the published Standard unambiguous
enough for a machine to follow? When independent models from different vendors
land near the same composite, the criteria are written clearly. When they
diverge, that divergence is a rubric-refinement candidate, the same way human
disagreement is.

> **Consistency is not validity.** Models share training data and biases and
> can agree on the same wrong score. A clarity round guards *clarity* and
> catches drift after rubric edits; the human IRR rounds remain the
> ground-truth anchor. Never report "the models agree" as "the Standard is
> validated."

*Provenance.* The method and thresholds are adapted from an earlier
inter-model grading harness that predates this repository; the recording
lives here.

## Method

1. **Grader input.** The model receives the LexGrade Standard v1.0 (§§4–6:
   criteria, score bands, P7 deduction ladder, negative modifiers, composite
   formula) and one exemplar's full text. Nothing else — no Scoring Guide, no
   expected scores, no other model's output.
2. **Blind-by-procedure.** The Scoring Guide and expected composites are
   consulted only after the model's scores are final. If the operator or model
   already knows the expected scores, the round is recorded as **not blind**
   and reported as a consistency data point only.
3. **Output per exemplar.** A 0–100 grade for each scored principle (P2–P6,
   P8) with a one-line rationale each; P7 deductions itemized by criterion ID;
   negative modifiers itemized; the composite computed by the §6 formula,
   shown step by step.
4. **Context floor.** The grader model must accept the full Standard §§4–6
   plus the exemplar in one context. Models capped below roughly 8,000 tokens
   cannot run this protocol; attempting it produces silent truncation or
   request failures rather than grades. An earlier CI harness failed exactly
   this way and recorded vacuous passes. A round with zero completed grades
   must be recorded as a failed round.

## Thresholds

| Measure | Threshold |
|---------|-----------|
| Tolerance | A model's composite within ±10.0 points of the exemplar's expected score |
| Spread | Max−min composite across models for one exemplar ≤ 15.0 points |

A breach by itself does not condemn the model or the Standard. It flags one of
three things: the criteria are ambiguous at that exemplar, the expected score
needs re-derivation under the current formula, or the model could not follow
the worksheet. The round report says which.

## Recording

One markdown file per round in [`results/`](results/):

```
results/{year}-q{quarter}-clarity-round-{n}.md
```

Human IRR rounds keep their own naming
(`{year}-q{quarter}-irr-round-{n}.md`). The two series are never merged.
A clarity round can motivate a rubric edit, but only IRR rounds validate.

Each report contains, at minimum: date; grader model(s) and exact version
ids; blind or not-blind, and why; per-principle scores with rationales; the
step-by-step composite arithmetic; deltas against expected; and a
"rubric-refinement candidates" section for every breach or ambiguity
encountered while grading.

Licensed CC-BY-SA 4.0. © 2026 LexGrade.
