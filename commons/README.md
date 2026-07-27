# Commons

The complete open LexGrade methodology: the Standard and its machine-readable
criteria, the Technique Register, the calibration evidence behind them, and the
templates for extending them to other forums.

## What's here

| Directory | Contents | License |
|---|---|---|
| `standard/` | The LexGrade Standard, the Technique Register, and `lgs-criteria.yaml` (the machine-readable catalog) | CC-BY-SA 4.0 |
| `calibration-set/` | Three exemplars on identical facts — A (95.5) / B− (82) / F (38) — proving the Standard discriminates, plus the scoring guide, the inter-rater reliability protocol, and the citation corpus | CC-BY-SA 4.0 |
| `assessments/` | LexGrade Standard assessments of real filed motions | CC-BY-SA 4.0 |
| `system-prompt/` | The five-phase gated drafting system prompt (`system_prompt_v1.0.md`) | AGPL-3.0 |
| `extensions/` | Jurisdiction module + motion-type overlay templates, and jurisdiction modules in progress | AGPL-3.0 |

License texts: [`/LICENSE-AGPL`](../LICENSE-AGPL),
[`/LICENSE-CC-BY-SA`](../LICENSE-CC-BY-SA). Versions and canonical paths are
pinned in the repo-root [`methodology.yaml`](../methodology.yaml).

## Calibration and validation

The calibration set is the evidence layer: identical facts, three drafts, three
grades. The [Scoring Guide](calibration-set/Calibration_Set_Scoring_Guide.md)
documents how each was scored; its stated limitation — single-rater scoring —
is addressed by the
[Inter-Rater Reliability Protocol](calibration-set/Inter_Rater_Reliability_Protocol.md)
(Krippendorff's α ≥ 0.80 target). Independent graders are welcome:
see the [Call for Graders](calibration-set/Call_for_Graders.md) and submit via
the inter-rater scoring issue template.

The machine analogue is the
[Machine Clarity Protocol](calibration-set/Machine_Clarity_Protocol.md) —
independent language models grading the same exemplars to test whether the
criteria are machine-unambiguous (consistency, never validity). Reports from
both series live in [`calibration-set/results/`](calibration-set/results/).

## Governance, trademark, and forking

- [`GOVERNANCE.md`](GOVERNANCE.md) — decision rights, DCO posture, stewardship
- [`TRADEMARK.md`](TRADEMARK.md) — "LexGrade" service mark policy; nominative use is fine, renamed forks are welcomed
- [`FORK.md`](FORK.md) — how to fork safely
