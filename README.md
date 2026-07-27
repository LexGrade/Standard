# LexGrade Standard

An open standard for grading the quality of legal motions, with a companion register of the advocacy techniques that distinguish expert work from competent work.

LexGrade is an open, independently maintained model of effective motion practice, published openly so others can use it, test it, and [improve it](.github/CONTRIBUTING.md). It is **not** promulgated by any court, bar, or government body, it confers no authority, and **nothing here is legal advice**. Every legal citation in any LexGrade output must be independently verified before filing.

## What's here

- **The Standard** — principles and graded criteria, calibrated against New York State Supreme Court motion practice, each independently citable.
- **The Technique Register** — a descriptive catalog of named advocacy techniques. It is informative only: reported alongside the composite score, and it never modifies the score.
- **The Calibration Set** — three exemplars on identical facts (A 95.6 / B− 80.1 / F 0) demonstrating the Standard discriminates, with a scoring guide and an inter-rater reliability protocol open to independent graders.
- **The System Prompt** — the five-phase gated drafting workflow the Standard was calibrated against.
- **Extensions** — templates for porting the Standard to other jurisdictions and motion types.
- **Live site** — <https://lexgrade.org>
- **Machine-readable** — `/api/v1/standard.json`, `/api/v1/techniques.json`, and `/llms-full.txt`, plus an MCP server that serves the standard to Claude and other MCP clients.

## Repository layout

| Path | What |
|------|------|
| `commons/standard/` | Source of truth: the Standard, the Technique Register, and `lgs-criteria.yaml` |
| `commons/calibration-set/` | Exemplars A/B−/F + scoring guide + inter-rater reliability protocol + citation corpus |
| `commons/system-prompt/` | The five-phase gated drafting system prompt (AGPL) |
| `commons/extensions/` | Jurisdiction + motion-type overlay templates (AGPL) |
| `sites/lexgrade.org/` | The static, zero-JS site (framework-free Node build → HTML/CSS) |
| `packages/core/` | Shared register/standard parser |
| `packages/mcp/` | Model Context Protocol server (local, read-only, no network, no account) |
| `methodology.yaml` | Version manifest |

## Develop

Requires Node ≥ 18.

```sh
npm install
npm test          # all workspaces (site, core, mcp)
npm run build     # build the static site into sites/lexgrade.org/dist
npm run serve     # serve the built site locally
```

## Use with Claude (MCP)

```sh
claude mcp add lexgrade -- node packages/mcp/index.mjs
```

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md). Substantive changes to the standard go through an `rfc:` issue so the reasoning is on the record. Security reports: see [SECURITY.md](SECURITY.md).

## License

- **Content** (the Standard, the Technique Register, the criteria, the calibration set, the assessments) — CC-BY-SA 4.0 · [LICENSE-CC-BY-SA](LICENSE-CC-BY-SA)
- **Code and operational artifacts** (the site, the build, the MCP server, the system prompt, the extension templates) — AGPL-3.0-only · [LICENSE-AGPL](LICENSE-AGPL)

Per-directory licensing is tabulated in [`commons/README.md`](commons/README.md).

Trademark and fork policy: [`commons/TRADEMARK.md`](commons/TRADEMARK.md) and [`commons/FORK.md`](commons/FORK.md). "LexGrade" is a common-law service mark; nominative use is fine and renamed forks are welcomed.
