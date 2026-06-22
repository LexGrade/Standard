# Changelog

All notable changes to the LexGrade Standard and this repository are recorded
here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The **standard itself** is versioned independently (currently **v1.0**); the
*Unreleased* section below accumulates changes accepted for the next edition (the
[working draft](commons/standard/drafts/README.md)). Published editions stay
published — a new edition never revokes a prior one.

## [Unreleased]

Working draft of the next edition (`working_draft.standard: "1.1"` in
`methodology.yaml`), captured in
[`commons/standard/drafts/LexGrade_Standard_v1.1-DRAFT.md`](commons/standard/drafts/LexGrade_Standard_v1.1-DRAFT.md).
Propose changes via an `rfc:` issue — see [CONTRIBUTING](.github/CONTRIBUTING.md).

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
- **Technique Register v1.0** — 32 named advocacy techniques across 7 categories.
- **Calibration Set** — A (95.5) / B− (82) / F (38) exemplars on identical facts.
- **Machine-readable catalog** (`commons/standard/lgs-criteria.yaml`) and the
  static JSON catalog served at `/api/v1/standard.json`.
- **lexgrade.org site** (`sites/lexgrade.org`) — framework-free, zero-JS, WCAG 2.2 AAA.
- **MCP server** (`packages/mcp`) — serves the Standard to Claude and other MCP clients.
- Governance, trademark, and fork-safety policy; jurisdiction module for NY Supreme Court.

[Unreleased]: https://github.com/LexGrade/standard/compare/v1.0...HEAD
[1.0.0]: https://github.com/LexGrade/standard/releases/tag/v1.0
