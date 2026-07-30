# LexGrade Standard

An open standard for grading the quality of legal motions, with a companion register of the advocacy techniques that distinguish expert work from competent work.

LexGrade is an open, independently maintained model of effective motion practice, published openly so others can use it, test it, and [improve it](.github/CONTRIBUTING.md). It is **not** promulgated by any court, bar, or government body, it confers no authority, and **nothing here is legal advice**. Every legal citation in any LexGrade output must be independently verified before filing.

## What's here

- **The Standard** — principles and graded criteria, calibrated against New York State Supreme Court motion practice, each independently citable.
- **The Technique Register** — a descriptive catalog of named advocacy techniques. It is informative only: reported alongside the composite score, and it never modifies the score.
- **Live site** — <https://lexgrade.org>
- **Machine-readable** — `/api/v1/standard.json`, `/api/v1/techniques.json`, and `/llms-full.txt`.

The launch scope is deliberately small: the two documents, the site that
presents them, and nothing that outruns its evidence. Validation materials
(a calibration set and an inter-rater reliability program), jurisdiction
extension templates, and integration tooling are planned — see
[ROADMAP.md](ROADMAP.md) — and ship when they are real.

## Repository layout

| Path | What |
|------|------|
| `commons/standard/` | Source of truth: the Standard, the Technique Register, and `lgs-criteria.yaml` |
| `sites/lexgrade.org/` | The static, zero-JS site (framework-free Node build → HTML/CSS) |
| `packages/core/` | Shared register/standard parser |
| `methodology.yaml` | Version manifest |

## Develop

Requires Node ≥ 18.

```sh
npm install
npm test          # all workspaces (site, core)
npm run build     # build the static site into sites/lexgrade.org/dist
npm run serve     # serve the built site locally
```

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md). Substantive changes to the standard go through an `rfc:` issue so the reasoning is on the record. Security reports: see [SECURITY.md](SECURITY.md).

## License

- **Content** (the Standard, the Technique Register, the criteria) — CC-BY-SA 4.0 · [LICENSE-CC-BY-SA](LICENSE-CC-BY-SA)
- **Code** (the site, the build, the parser) — AGPL-3.0-only · [LICENSE-AGPL](LICENSE-AGPL)

Per-directory licensing is tabulated in [`commons/README.md`](commons/README.md).

Trademark and fork policy: [`commons/GOVERNANCE.md`](commons/GOVERNANCE.md). "LexGrade" is a common-law service mark; nominative use is fine and renamed forks are welcomed.
