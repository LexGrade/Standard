# Contributing to the LexGrade Standard

Thanks for helping improve the open standard for scoring legal-drafting quality.
Contributions of all sizes are welcome — typo fixes, rubric and technique-register
improvements, tooling, and proposals for the next edition.

A scoring standard is only worth what its consensus is worth. LexGrade is
published under CC-BY-SA 4.0, governed in the open, and versioned so every change
is traceable and citable. It is not owned by a vendor, a bar, or any individual —
it improves by being argued over.

## Ways to contribute

- **Pull request** against the source of truth in `commons/standard/` (the Standard,
  the Technique Register, `lgs-criteria.yaml`) or the site/code.
- **Issue** — <https://github.com/LexGrade/standard/issues/new>
- **Email** — `contribute@lexgrade.org` with the idea, the jurisdiction, or the
  criterion you would change. A rough note is plenty; it will be turned into a
  proposal, with credit.

## Workflow

1. **Fork**, branch, and open a pull request. By contributing you agree your
   contribution is licensed under the file's existing license (inbound =
   outbound; see the table below). There is **no CLA** — so the methodology
   can never be quietly relicensed. See
   [`commons/GOVERNANCE.md`](../commons/GOVERNANCE.md).

2. Run the checks before pushing:

   ```bash
   npm install
   npm test          # all workspaces — run before opening a PR
   npm run build     # the static site must build cleanly, offline
   ```

   Requires Node ≥ 18.

## How changes are decided

Anything that changes the *substance* of the standard — adding, removing, or
reweighting a criterion or principle, changing the calibration, or adding or
altering a technique — starts as an issue titled `rfc: <change>`, so the
reasoning is on the record before code. Editorial fixes, typos, and site/build
changes can go straight to a PR.

- **Routine changes** (typos, clarifications) — merged after one review.
- **Methodology changes** (rubric weights, gate logic, new techniques, criteria) —
  open an issue tagged `rfc:` first; the maintainer merges after the RFC has been
  open ≥ 7 days. Significant changes get a version bump.
- **Breaking changes** — tagged `rfc:breaking`, 30 days' notice.

See [`commons/GOVERNANCE.md`](../commons/GOVERNANCE.md) for the full process.

## Highest-value contributions

If you litigate, you know things the calibration does not yet. Especially
valuable:

- Calibration against courts and jurisdictions beyond New York State Supreme Court.
- Real-world outcomes that confirm or contradict a criterion or technique.
- Inter-rater reliability data.
- Citations and authority that sharpen a requirement.
- Technique Register improvements, and proposals for the next edition (open an
  `rfc:` issue).

## A note on the tests

The technique, principle, and criteria counts are **guarded against drift**: there
are no hand-maintained magic numbers in the tests, and the Standard's two
representations are welded together by CI. Concretely:

- **Editing or adding a criterion** — change both the Standard markdown
  (`LexGrade_Standard_v1.0.md`) and the catalog (`lgs-criteria.yaml`). A test
  holds every criterion ID, title, count, and weight equal between the two; a
  one-sided edit fails the build.
- **Adding a technique** — update the Register's own summary tables (Category
  Index, count line, distribution, template table), the `technique_register`
  block in `lgs-criteria.yaml`, and the Standard's §7 category table. Tests
  cross-check all of them against the technique blocks and will tell you
  exactly what's inconsistent.

## Licensing of contributions

Each file inherits its directory's license — you can't accidentally contribute
under different terms:

| If you're modifying… | Your contribution is licensed under… |
|---|---|
| `commons/standard/**` (the methodology) | CC-BY-SA-4.0 |
| `sites/**`, `packages/**` (code & tools) | AGPL-3.0-only |

## Conduct

Be civil and argue in good faith. Disagreement about the substance of the standard
is the point; personal hostility is not.
