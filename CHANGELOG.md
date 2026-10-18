# Changelog

All notable changes to the LexGrade Standard and this repository are recorded
here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The **standard itself** is versioned independently (currently **v1.0**); the
*Unreleased* section below accumulates changes accepted for the next edition.
Published editions stay published — a new edition never revokes a prior one.

## [Unreleased]

Changes accepted for the next edition accumulate here. Propose changes via an
`rfc:` issue — see [CONTRIBUTING](.github/CONTRIBUTING.md).

### Added
- **Corrections channel and SLA.** A `correction` issue template, a
  `Corrections` section in `GOVERNANCE.md`, and a "When this is wrong"
  section on the About page. Every report is acknowledged within 14 days;
  errors of fact are fixed in the current edition as routine changes;
  corrections that change a requirement go through an RFC and ship in the
  next minor edition, with the report linked until then. Governance only;
  no criterion, weight, or deduction changed.

### Changed
- **Launch scope cut to the core.** The published tree now holds the
  Standard, the Technique Register, the machine-readable catalog, and the
  site — and nothing that outruns its evidence. Withdrawn to git history,
  each with a return trigger on the [roadmap](ROADMAP.md): the calibration
  set and inter-rater reliability protocol (return with the first
  independent grader round), the filed-form assessments and the original
  exemplars (withdrawn earlier as insufficiently fictionalized for
  publication; a fully synthetic replacement set was authored and is
  withheld until the first round runs), the jurisdiction and motion-type
  extension templates (return with the first real jurisdiction profile),
  the drafting system prompt, and the MCP server. `FORK.md` and
  `TRADEMARK.md` are merged into `GOVERNANCE.md` unchanged in substance.
  No criterion, weight, or deduction changed.

### Fixed
- **Empirical citations stated precisely.** The Standard now describes the
  Dahl et al. finding as hallucination in 58–88% of answers to verifiable
  federal case-law questions (not "of legal citations"), corrects the Magesh
  et al. range to 17–33%, and cites both papers in their published form with
  DOIs (16 J. Legal Analysis 64 (2024); 22 J. Empirical Legal Stud. 216
  (2025)). No criterion, weight, or deduction changed.
- **§7 Register summary corrected to 39 techniques.** The Standard's §7
  category table mirrored an earlier 32-technique register; it now matches
  the Register's category index, and a test cross-checks the two documents
  so they cannot drift apart silently.

### Proposed
- **Validity and its limits** — make explicit what the composite supports as an inference (content validity + demonstrated discrimination) vs. what it does not yet (criterion/predictive validity), plus a consequential-validity (washback) caveat. *Framing only; foldable into v1.0.*
- **The composite is a gateway, not the product** — constrain how the score is presented/used so per-criterion findings + the Technique Register lead, not the number.
- **LGS 3.10 — Case Synthesis** (Principle 3) — a proposed new criterion for digesting multiple authorities into an explained rule, distinct from analogical reasoning (LGS 3.8).
- **LGS 5.6 — Analytical Structure** (Principle 5) — a proposed new criterion for rule → explanation → application → conclusion (the IRAC/CREAC/TREAT family).
- **LLM-grader reliability & validity study** — roadmap companion to the human IRR protocol.

Grounded in Clark & DeSanctis (2013), Gustafson (2024), Schwarcz & Farganis (2017), and Sargent & Curcio (2012); see the draft for the red-team record and open RFC decisions.

## [1.0.0] — 2026-02

### Added
- **LexGrade Standard v1.0** — 8 principles, 45 scored criteria, composite scoring
  formula, and three conformance levels (Expert / Competent / Deficient).
- **Technique Register v1.0** — 39 named advocacy techniques across 7 categories.
- **Calibration Set** — A (95.5) / B− (82) / F (38) exemplars on identical facts.
- **Machine-readable catalog** (`commons/standard/lgs-criteria.yaml`) and the
  static JSON catalog served at `/api/v1/standard.json`.
- **lexgrade.org site** (`sites/lexgrade.org`) — framework-free, zero-JS, WCAG 2.2 AAA.
- **MCP server** (`packages/mcp`) — serves the Standard to Claude and other MCP clients.
- Governance, trademark, and fork-safety policy; jurisdiction module for NY Supreme Court.

[Unreleased]: https://github.com/LexGrade/standard/compare/v1.0...HEAD
[1.0.0]: https://github.com/LexGrade/standard/releases/tag/v1.0
