# Commons

The complete open LexGrade methodology: the Standard and its machine-readable
criteria, the Technique Register, the calibration evidence behind them, and the
templates for extending them to other forums.

## What's here

| Directory | Contents | License |
|-----------|----------|---------|
| `standard/` | The LexGrade Standard, the Technique Register, and `lgs-criteria.yaml` (the machine-readable catalog) | CC-BY-SA 4.0 |
| `calibration-set/` | Three exemplars on identical facts, graded A (95.6) / B− (80.1) / F (0), plus the scoring guide, the inter-rater reliability protocol, and the citation corpus | CC-BY-SA 4.0 |
| `system-prompt/` | The five-phase gated drafting system prompt (`system_prompt_v1.0.md`) | AGPL-3.0 |
| `extensions/` | Jurisdiction module and motion-type overlay templates, and jurisdiction modules in progress | AGPL-3.0 |

License texts: [`/LICENSE-AGPL`](../LICENSE-AGPL),
[`/LICENSE-CC-BY-SA`](../LICENSE-CC-BY-SA). Versions and canonical paths are
pinned in the repo-root [`methodology.yaml`](../methodology.yaml).

## Calibration and validation

The calibration set holds three drafts of the same motion, produced three
different ways and graded A, B−, and F. The
[Scoring Guide](calibration-set/Calibration_Set_Scoring_Guide.md) documents how
each was scored. Its stated limitation is that a single rater did the scoring,
which is why the
[Inter-Rater Reliability Protocol](calibration-set/Inter_Rater_Reliability_Protocol.md)
exists (Krippendorff's α ≥ 0.80 target). Independent graders are welcome:
see the [Call for Graders](calibration-set/Call_for_Graders.md) and submit via
the inter-rater scoring issue template.

There is also a machine analogue, the
[Machine Clarity Protocol](calibration-set/Machine_Clarity_Protocol.md), in
which independent language models grade the same exemplars. That tests whether
the criteria are written unambiguously enough for a machine to follow; it does
not validate anything. Reports from both series live in
[`calibration-set/results/`](calibration-set/results/).

## Governance, trademark, and forking

- [`GOVERNANCE.md`](GOVERNANCE.md) — decision rights, DCO posture, stewardship
- [`TRADEMARK.md`](TRADEMARK.md) — "LexGrade" service mark policy; nominative use is fine, renamed forks are welcomed
- [`FORK.md`](FORK.md) — how to fork safely
