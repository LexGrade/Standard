# Changelog

All notable changes to the LexGrade Standard and this repository are recorded
here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

The **standard itself** is versioned independently (published: **v1.0**;
proposed: **v1.1**); the *Unreleased* section below accumulates changes
accepted for the next edition. Published editions stay published — a new
edition never revokes a prior one.

## [Unreleased]

Changes accepted for the next edition accumulate here. Propose changes via an
`rfc:` issue — see [CONTRIBUTING](.github/CONTRIBUTING.md).

### Added — LexGrade Standard v1.1 (proposed)

The next edition of the Standard, `commons/standard/LexGrade_Standard_v1.1.md`,
pinned as current in `methodology.yaml`; v1.0 stays in the tree, published and
citable. A minor release under §13: no weight, deduction, gate rule, or
conformance threshold changed, and no existing criterion ID moved. The
Technique Register is unchanged at v1.0.

- **LGS 3.10 — Case Synthesis** (Principle 3). Where the rule is drawn from
  more than one authority, the motion states the rule they establish together
  and shows how each contributes, then applies it. Distinct from analogical
  reasoning (LGS 3.8), which scores the use of a single authority. N/A where
  one controlling decision states the rule.
- **LGS 5.6 — Analytical Structure** (Principle 5). Each argument's rule,
  explanation, application, and conclusion are each locatable (the
  CREAC/IRAC family), conclusion-first; reconciled in the text with the
  Register's Anchor Paragraph.
- **§3 — Validity and its limits.** States what the composite can support
  (content validity, a shared grading vocabulary, author-level
  discrimination) and what it cannot yet (inter-rater reliability,
  criterion/predictive validity, weight validity, transfer to other forums),
  with a consequential-validity (washback) caveat and the three design guards
  against it.
- **§6 — Reporting the composite.** The composite is a gateway, not the
  product. A reported grading leads with the per-criterion findings, always
  carries the conformance-claim elements, rounds to an integer, keeps the
  Register on its own line, and compares motions by profile. In education
  the findings go to the student first. The worksheet gains a "per-criterion
  findings attached" line.
- **§12 — Legal-education and assessment scholarship.** Clark & DeSanctis
  (63 J. Legal Educ. 3 (2013)), Sargent & Curcio (61 J. Legal Educ. 379
  (2012)), Schwarcz & Farganis (67 J. Legal Educ. 139 (2017)), and Gustafson
  (73 J. Legal Educ. no. 1 (2024)), each linked to its publisher page.
- **§13 — Edition history** table, and a rule that a criterion added in a
  minor release takes the next unused number in its Principle.
- **Technique Register v1.0.13.** "Standard criterion served" notes on #6
  The Anchor Paragraph, #26 Borrowed Authority, #28 The Court's Own
  Precedent, #38 The Judge's Checklist, and #39 Argumentative Point Headings,
  saying which v1.1 criteria each serves. Informative only; count, categories,
  and definitions unchanged. The Register's manifest version stays 1.0.

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
- **Worksheet Technique Register denominator** (v1.1). The §10 worksheet
  still read `__/32`; it now reads `__/39`.
- **LGS 5.5 text harmonized** (v1.1). The catalog's requirement for Audience
  Calibration still referred to "the assigned justice's known preferences";
  it now matches the Standard's text (local practice, applicable standards,
  procedural posture). The criteria-sync test compares IDs and titles, not
  requirement text, which is how this drift survived.

### Moved to the roadmap
- **LLM-grader reliability and validity study** — now a Phase 2 item in
  [ROADMAP.md](ROADMAP.md), sequenced after the human inter-rater round.

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
