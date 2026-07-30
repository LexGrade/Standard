# Jurisdictions

The LexGrade base rubric is jurisdiction-agnostic in structure. Jurisdiction modules carry the procedural rules, authority hierarchy, administrative layer, and failure modes specific to one court system. The Grader pulls the appropriate module at scoring time; citation verification does not vary by module — it operates against CourtListener, whose U.S. coverage is broad but not complete for every reporter series (and the offline fallback extractor recognizes a narrower reporter set still), so an unresolved citation can be a coverage gap rather than a fabrication.

## Module slug convention

Each module lives in its own slug-named directory under `commons/extensions/jurisdictions/`. The slug becomes the identifier used in `methodology.yaml` and by downstream implementations.

```
commons/extensions/jurisdictions/
├── ny-supreme-court/         Available — calibrated in the LexGrade Standard v1.0
│   ├── module.md             Procedural rules, authority hierarchy, admin layer
│   ├── README.md             Scope, reviewer attribution, version
│   └── examples/             Worked authority-hierarchy tables, motion-type examples
└── federal-district/         Planned
```

| Slug | Status | Notes |
|---|---|---|
| `ny-supreme-court` | Available | Extracted from the LexGrade Standard v1.0. NY Supreme Court (trial), with the Appellate Division, Fourth Department as controlling intermediate appellate authority. |
| `federal-district` | Planned | FRCP, local rules, CM/ECF requirements. Next module. |

Each available module is a lawyer-reviewed artifact. The reviewer's name and bar admission appear in the module's `README.md`. The same review standard applies to all modules regardless of who authors or funds them.

## Adding a module

1. Copy [`../jurisdiction-module-TEMPLATE.md`](../jurisdiction-module-TEMPLATE.md) into a new slug directory as `module.md`.
2. Fill every section. Leave no bracketed placeholders.
3. Provide at least one worked authority-hierarchy table in `examples/`.
4. Have an attorney admitted in that jurisdiction review the procedural rules and authority hierarchy sections. Record their name and bar admission in `README.md`.
5. Open a PR. Substantive review follows the decision tiers in [`GOVERNANCE.md`](../../GOVERNANCE.md).
6. On merge, register the module in `methodology.yaml` under a new `jurisdictions:` key (schema forthcoming).

## What does not vary by jurisdiction

- Citation verification — the verifier does not branch on jurisdiction. CourtListener's coverage is broad (federal courts and all 50 states) but not complete for every reporter series, and the offline fallback extractor recognizes a narrower reporter set — an unresolved citation can be a coverage gap, not necessarily a fabrication.
- The 7-section rubric structure and the 39-technique Technique Register — universal.
- The 5-phase gated workflow in the system prompt — universal.

## What varies by jurisdiction

- Procedural rules (motion practice, service, filing, page/word limits).
- Authority hierarchy (which courts are binding vs. persuasive; department/circuit splits).
- Administrative layer (local rules, individual part rules, e-filing system).
- Failure modes specific to the jurisdiction (e.g., confusing CPLR and FRCP standards in NY federal court filings).

## License

Jurisdiction modules inherit the AGPL-3.0 license of `commons/extensions/`. Forks of a module are welcomed and protected in perpetuity (see [`commons/FORK.md`](../../FORK.md)). The reviewer's attribution must be preserved across forks.
