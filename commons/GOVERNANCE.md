# LexGrade Commons — Governance

This document describes how decisions get made in the open commons (`commons/`).
It is intentionally short: the project is young, and the goal is to keep the
methodology open and contributable — not to build elaborate governance machinery
before it is needed.

## Scope

This governs **`commons/`** only — the open methodology (the rubric and Technique
Register), licensed CC-BY-SA 4.0. The tooling (`sites/`, `packages/`) is licensed
AGPL-3.0-only. Any hosted or proprietary service built on the standard is **not**
governed by this document and is maintained separately.

## Stewardship

LexGrade is maintained in the open by the **LexGrade Working Group** — the people
who contribute to and review the commons. The Working Group keeps the methodology
coherent, reviews proposals, and merges changes.

As the contributor base grows, a formal stewardship model and a neutral fiscal
host will be adopted so the standard has independent legal standing and can outlive
any single contributor. That step is deferred until there is enough sustained
outside contribution to warrant it; this document will be updated when it happens.

## Decision-making

1. **Routine changes** (typos, clarifications, new failure-mode examples, new
   Technique Register entries) — merged after one round of review.
2. **Methodology changes** (rubric weights, gate logic, criteria, version bumps) —
   open a public issue tagged `rfc:` first; merged by rough consensus after the RFC
   has been open ≥ 7 days. Significant changes get a version bump in `methodology.yaml`.
3. **Breaking changes** (rubric structure that breaks tooling; license changes) —
   tagged `rfc:breaking`, with 30 days' notice and broad agreement before merge.

## DCO, not CLA

Contributions are accepted under the **[Developer Certificate of Origin](https://developercertificate.org/)**
(DCO), not a Contributor License Agreement. Every commit is signed off:

```bash
git commit -s -m "your message"
```

A CLA would let the project relicense your contribution under different terms. We
never want that power: AGPL-3.0-only on the tooling and CC-BY-SA 4.0 on the rubric
exist for **permanence** — the methodology cannot be quietly relicensed or absorbed
into a closed product. The DCO gives the legal hygiene without the relicensing
escape hatch. This is the same model used by Linux, Docker, and most copyleft
projects that take community ownership seriously.

## License of contributions

By signing off your commit you affirm your contribution is licensed under:

| If you're modifying… | Your contribution is licensed under… |
|---|---|
| `commons/standard/**` | CC-BY-SA 4.0 |
| `packages/**`, `sites/**` (tooling & sites) | AGPL-3.0-only |

If a PR touches both code and content, each file inherits its directory's license.

## Permanence commitments

Whatever stewardship structure comes later, these hold:

1. **`commons/` is never relicensed to a closed license.** The DCO (not CLA) is what
   makes this enforceable.
2. **Published rubric versions keep their rights.** v1.0 stays under CC-BY-SA forever,
   even if a later version ships under different terms.
3. **The methodology stays forkable.** Renamed, attributed forks that follow
   [`FORK.md`](FORK.md) are welcome; the trademark is never used to suppress them.

## Trademark

"LexGrade" is a service mark used to identify the canonical implementation; the full
policy is in [`TRADEMARK.md`](TRADEMARK.md). The methodology itself is open — anyone
may implement "LexGrade Methodology v1.0" under the existing AGPL / CC-BY-SA licenses
without asking. Forks must rename; see [`FORK.md`](FORK.md). This is the same posture
as Mozilla/Firefox and Red Hat/RHEL: open implementation, controlled brand.

## Contributing

See [`/.github/CONTRIBUTING.md`](../.github/CONTRIBUTING.md) for the full workflow.
