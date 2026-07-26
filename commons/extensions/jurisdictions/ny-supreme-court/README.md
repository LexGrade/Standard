# NY Supreme Court — Jurisdiction Module

**Slug:** `ny-supreme-court`  
**Status:** Available (in extraction from the LexGrade Standard v1.0)  
**Reviewer:** *To be assigned. Module currently mirrors the NY-flavored content baked into the LexGrade Standard v1.0; full lawyer review is the next step before the module is treated as authoritative independent of the rubric.*  
**Bar admission required for review:** Admitted to practice in New York State, with civil motion practice experience in NY Supreme Court (any County).

## Scope

This module covers civil motion practice in **New York State Supreme Court**, the trial-level court of general jurisdiction in New York. Other New York courts (Civil Court, Surrogate's Court, Family Court, City Courts) are out of scope and would receive their own modules.

## Status of the module

The LexGrade Standard v1.0 was originally written against NY Supreme Court practice. As a result, the worked authority-hierarchy tables and Failure Mode examples in the rubric are already NY-shaped. This module exists to:

1. **Formalize the implicit jurisdiction scope** so users and forks know what the rubric is calibrated against.
2. **Provide a stable extraction target** as the LexGrade Standard evolves toward jurisdiction-neutral phrasing, with NY-specific content moving here.
3. **Set the template** for the federal-district module planned next.

Until extraction is complete, this module is documentary, not operative — the rubric remains the source of truth. The marketing site reflects this honestly: *"Calibrated to New York Supreme Court (LexGrade Standard v1.0)."*

## Module contents

The full module follows the structure of [`../../jurisdiction-module-TEMPLATE.md`](../../jurisdiction-module-TEMPLATE.md). Key sections:

- **Procedural rules** — CPLR governs civil practice. Motion practice under CPLR § 2214 (notice of motion) and CPLR § 2215 (cross-motion). 22 NYCRR §§ 202 (Uniform Civil Rules) and the Individual Part Rules of the assigned justice.
- **Authority hierarchy** — Binding: NY Court of Appeals, then the controlling Appellate Division Department (the **Fourth Department** for this module's default venue). Persuasive: the other three Departments, trial-level decisions, federal courts on state-law questions. Departmental splits are tracked explicitly.
- **Administrative layer** — Filing via NYSCEF (e-filing); Individual Part Rules; Commercial Division Rules where applicable.
- **Failure modes** — Confusing CPLR with FRCP; missing 22 NYCRR § 130-1.1 sanctions exposure for hallucinated citations; defective return-date calculation; ignoring Part Rules.

Worked examples — including the DRL § 237(a) fee-application authority hierarchy already in the LexGrade Standard v1.0 — will live in [`examples/`](examples/) once extraction completes.

## License

AGPL-3.0, inheriting from `commons/extensions/`. Reviewer attribution is preserved across forks per [`../../README.md § License`](../README.md).
