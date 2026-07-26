# Extensions

LexGrade ships with two extension points: **jurisdiction modules** and **motion-type overlays**. Both are templates today — contributions welcome.

## Jurisdiction Modules

The base rubric is jurisdiction-agnostic. Jurisdiction modules provide swappable components for specific court systems.

- **New York Supreme Court** — fully built into the LexGrade Standard v1.0 (no separate module needed)

### Planned

- Federal district court (FRCP, local rules, CM/ECF requirements)

### Module Structure

Each module specifies:
- Procedural rules (motion practice requirements, service, filing)
- Authority hierarchy (which courts are binding, persuasive, etc.)
- Administrative layer (local rules, part rules, court forms)
- Failure modes specific to the jurisdiction

See [`jurisdiction-module-TEMPLATE.md`](jurisdiction-module-TEMPLATE.md) for the full template.

## Motion-Type Overlays

Motion-type overlays adjust rubric section weights for specific motion types (e.g., summary judgment emphasizes factual presentation; fee applications emphasize arithmetic proof).

See [`motion-type-overlay-TEMPLATE.md`](motion-type-overlay-TEMPLATE.md) for the full template.

---

© 2026 LexGrade. All rights reserved. | LexGrade
