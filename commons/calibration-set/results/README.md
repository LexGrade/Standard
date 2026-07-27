# Calibration set — round results

This directory holds two distinct report series for the LexGrade
calibration set, which are never merged:

- **Human IRR rounds** (`{year}-q{quarter}-irr-round-{n}.md`) — produced
  under [`../Inter_Rater_Reliability_Protocol.md`](../Inter_Rater_Reliability_Protocol.md).
  These are the ground truth; only IRR rounds validate.
- **Machine clarity rounds** (`{year}-q{quarter}-clarity-round-{n}.md`) —
  produced under [`../Machine_Clarity_Protocol.md`](../Machine_Clarity_Protocol.md).
  These test whether the Standard is machine-unambiguous; consistency,
  not validity.

## Naming convention

Each round is one markdown file:

```
{year}-q{quarter}-irr-round-{n}.md      (human IRR)
{year}-q{quarter}-clarity-round-{n}.md  (machine clarity)
```

Examples: `2026-q3-irr-round-1.md`, `2027-q1-irr-round-2.md`.

`{n}` is the round number within the quarter — a quarter normally
produces one round, but the convention supports more if grader
availability allows.

## What each report contains

The full template is described in
[`../Inter_Rater_Reliability_Protocol.md` — Output](../Inter_Rater_Reliability_Protocol.md#output).
At minimum: round metadata, per-rater per-section scores, Krippendorff's
α (overall and per-section), and a "rubric refinement candidates"
section linking to any follow-on issues.

## Why this directory is reserved before the first round

The first round has not been run yet; recruitment is in progress
(see the [Call for Graders](../Call_for_Graders.md)). The directory is
reserved ahead of time so the absence of IRR results stays visible, and
so anyone landing here can see the round is open for recruitment.

When the first round closes, this README will be updated with a link
to `2026-qN-irr-round-1.md`.
