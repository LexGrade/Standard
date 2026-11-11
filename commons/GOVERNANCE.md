# LexGrade Commons — Governance

This document describes how decisions get made in the open commons (`commons/`),
how forking works, and how the trademark is handled. It is intentionally short:
the project is young, and the goal is to keep the methodology open and
contributable — not to build elaborate governance machinery before it is needed.

## Scope

This governs **`commons/`** only — the open methodology (the Standard and Technique
Register), licensed CC-BY-SA 4.0. The tooling (`sites/`, `packages/`) is licensed
AGPL-3.0-only. A service that anyone builds on the standard is **not** governed
by this document.

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
2. **Methodology changes** (weights, gate logic, criteria, version bumps) —
   open a public issue tagged `rfc:` first; merged by rough consensus after the RFC
   has been open ≥ 7 days. Significant changes get a version bump in `methodology.yaml`.
3. **Breaking changes** (a change of structure that breaks tooling; license changes) —
   tagged `rfc:breaking`, with 30 days' notice and broad agreement before merge.

## Corrections

The Standard cites court rules and published scholarship, and both change.
The Uniform Rules are amended by administrative order with little notice, and
a criterion that cites a renumbered or repealed rule is wrong until someone
says so. This section is the channel for saying so.

**How to report.** Open a [correction issue](https://github.com/LexGrade/standard/issues/new?template=correction.yml),
or email `hello@lexgrade.org` with the subject `Correction: <criterion or page>`.
Say where the error is, what the text says, what it should say, and the
authority for the change.

**Commitments.**

1. **Acknowledgment within 14 days.** Every report gets a reply saying whether
   it is confirmed, disputed, or still being checked.
2. **Errors of fact are routine changes.** A wrong rule number, citation, date,
   or quotation is corrected in the current edition under the routine path in
   *Decision-making* above, with a changelog entry naming the report. No RFC,
   no version bump. The `citations_verified` date in the catalog is updated
   when the correction touches a verified citation.
3. **Changes to what a criterion requires go through an RFC.** If the
   correction would change a requirement, a weight, or a deduction, it starts
   as an `rfc:` issue, and the fix ships in the next minor edition. The
   correction issue stays open and linked until then, so the known problem is
   on the record while the text is uncorrected.
4. **Published editions are never edited silently.** A correction to a
   published edition is recorded in the changelog and in the edition's
   history table. The prior wording stays in git history.

**What a correction is not.** Disagreement with a criterion, a weight, or a
score band is a proposal, and goes through the `rfc:` path. The corrections
channel is for the text being wrong about a fact.

## Translations

English is the source text of the Standard and the Technique Register, and it
is the text that governs. A translation makes that text readable in another
language; it is never a separate edition and never changes a requirement.

1. **A translation names the edition it translates** and is published only
   while it matches the current edition. A new edition ships with its
   translations updated; `methodology.yaml` records which edition each
   translates, and the build refuses one that trails.
2. **Where a translation and the English text differ, the English text
   stands.** The difference is an error in the translation and is reported
   through the corrections channel above.
3. **Fixing a translation is a routine change.** It needs no RFC, because it
   cannot change what a criterion requires. A change of meaning starts in the
   English text, through the paths in *Decision-making*.
4. **Numbers and identifiers are not translated.** Weights, deductions,
   thresholds, criterion IDs, technique numbers, and citations of rules, cases,
   and scholarship are the English catalog's. The translated catalog holds
   strings only.
5. **Review.** Each translation is reviewed by a qualified translator of legal
   Spanish (or of the language concerned) before it is first published, and the
   review is recorded in the changelog.

Translations live in `commons/standard/translations/<language>/` under
CC-BY-SA 4.0, like the text they translate.

## No CLA

Contributions are accepted under the repository's existing licenses, inbound =
outbound: by contributing, you license your contribution under the same terms
as the file you are changing, and nothing more.

A CLA would let the project relicense your contribution under different terms.
The project does not hold that power and does not want it: AGPL-3.0-only on the
tooling and CC-BY-SA 4.0 on the Standard exist for **permanence** — the methodology
cannot be quietly relicensed or absorbed into a closed product. Inbound = outbound gives the legal hygiene without the
relicensing escape hatch.

## License of contributions

By contributing you affirm your contribution is licensed under:

| If you're modifying… | Your contribution is licensed under… |
|---|---|
| `commons/standard/**` | CC-BY-SA 4.0 |
| `packages/**`, `sites/**` (tooling & sites) | AGPL-3.0-only |

If a PR touches both code and content, each file inherits its directory's license.

## Permanence commitments

Whatever stewardship structure comes later, these hold:

1. **`commons/` is never relicensed to a closed license.** The no-CLA,
   inbound = outbound posture is what makes this enforceable: the project never
   acquires the rights a relicense would need.
2. **Published editions keep their rights.** Every published edition stays under
   CC-BY-SA permanently, even if a later edition ships under different terms.
3. **The methodology stays forkable.** Renamed, attributed forks that follow the
   [forking guide below](#forking-lexgrade) are welcome; the trademark is never used
   to suppress them.

## Contributing

See [`/.github/CONTRIBUTING.md`](../.github/CONTRIBUTING.md) for the full workflow.

---

## Forking LexGrade

The LexGrade methodology is open and is meant to be forked. Courts, clinics,
educators, and tool builders work in different forums and for different
readers, and one publication cannot serve all of them. Other implementations
built on the open Standard are part of the design.

This section says what can be forked and how. Ambiguous fork rights tend to be
tested exactly when they matter most, so the rights below are stated in full
and are permanent, whoever stewards the project later.

### What can be forked

| Asset | License | What this permits |
|---|---|---|
| `commons/standard/` | CC-BY-SA 4.0 | Reproducing the Standard and Technique Register in a product UI, derivative scoring tools, training materials, academic papers, and journalism. Attribution required; derivatives must also be CC-BY-SA. |
| `sites/`, `packages/` (tooling) | AGPL-3.0 | Self-hosting or modifying the site and tooling, or building a derivative tool. The same AGPL obligations apply to any hosted derivative. |

### What cannot be forked

| Asset | Why not |
|---|---|
| The **"LexGrade"** name and logo | A service mark that identifies this publication of the Standard. Fork the code and content, and rename the fork. See the [trademark policy below](#trademark-policy). |
| Anything in `commons/` not yet published to a tagged release | Pre-release work may be revised before tagging and is not promised stable. |

### How to fork

1. **Clone the repo and keep only what is needed.** Most forks only want
   `commons/`: `git clone --filter=blob:none --sparse` followed by
   `git sparse-checkout set commons` fetches just the methodology.

2. **Pick a new name.** Anything that doesn't include "LexGrade" is fine, for
   example "[Clinic] Drafting Tool" or "[County] Legal Aid Motion Checklist".

3. **Add attribution.** A line in the README (or equivalent) such as:

   > Built on the **LexGrade Standard v1.1** ([lexgrade.org](https://lexgrade.org)), reused under CC-BY-SA 4.0 / AGPL-3.0. This is not an official LexGrade publication.

   Name the edition the fork is built on.

4. **Honor the licenses.** AGPL on the code and tools means a hosted service
   built on them is also AGPL, and its source must be made available to its
   users. CC-BY-SA on the Standard means derivatives stay CC-BY-SA and credit the
   original. Neither license requires asking permission.

5. **Track upstream, or pin.** The Standard moves from edition to edition, and
   backwards compatibility is not promised between major versions. A fork can
   pull each new edition or stay on the one it was built on.

### What will not be done to forks

- **No "please rebrand" letters to forks that follow this guide.** A fork that
  has been renamed and attributed is outside any claim the project has.
- **No demands for changes to a derivative.** A fork made under AGPL or
  CC-BY-SA belongs to its makers within those license terms. The project
  retains no veto.
- **No blocking a fork from later editions.** A fork can keep ingesting every
  published edition of the Standard. The CC-BY-SA license guarantees this.
- **No withdrawal of the open licenses on published editions.** Once an
  edition is out under CC-BY-SA, it stays under CC-BY-SA permanently, whatever
  terms a later edition carries.

### Rights that survive any change of stewardship

> **Every license granted in this repository remains valid in perpetuity under
> its original terms, whoever later stewards the project or holds the
> "LexGrade" mark.** A later steward or holder of the mark cannot revoke open
> licenses already granted, cannot relicense editions already published, and
> cannot prevent existing forks from continuing.
>
> Any later term that purports to limit these rights retroactively does not
> apply to anyone acting in good-faith reliance on the licenses as they stood
> at the time of the fork.

If a later steward tries to walk this back, the methodology should be forked
to a neutral fiscal sponsor and continued under another name. The project
matters more than the name.

### If a fork becomes the canonical one

A fork may serve a different jurisdiction, practice area, or community better
than this publication does. If that happens:

- The project will not contest it.
- The fork will be linked from this repository on request.
- If the fork becomes the de facto standard, the trademark stops being
  meaningful. That is the open ecosystem working as intended.

### Reporting a license violation or asking for clarification

- **License violation by a fork:** email `hello@lexgrade.org`, subject
  `License concern: <site or product>`. Reports are investigated within 30
  days.
- **Unsure whether a use is permitted:** email the same address, subject
  `Fork question: <use case>`. The answer comes in plain language.

### Acknowledgments

This guide draws on SQLite's "permissive forever" stance, Plausible Analytics'
fork-friendliness, and the counterexample of open-source license changes that
retroactively closed work a community had relied on.

---

## Trademark policy

**Last updated: 2026-11-11**

LexGrade is an **open standard**: free to implement, fork, and redistribute
under its licenses. The "LexGrade" name identifies this publication of the
Standard, at lexgrade.org and in this repository, so that a reader who sees
the name knows which text is meant. This policy keeps the name tied to that
text while leaving the content free to spread.

### Names and what they cover

| Thing | Status | What it means |
|---|---|---|
| **"LexGrade"** — word mark, logo, domain | Service mark | Not available for branding another product, service, or domain without written permission. |
| **"LexGrade Standard vX.Y"** | Name of the open standard | The phrase, naming the edition implemented, describes an implementation of the Standard and Technique Register, provided no endorsement is implied. |
| The Standard and Technique Register | Open content (CC-BY-SA 4.0; tooling AGPL-3.0) | Free to implement, fork, and redistribute under any name except "LexGrade." |

### Permitted without asking

- Implementing the Standard and Technique Register, and describing the
  result as "an implementation of the LexGrade Standard v1.1" (or whichever
  edition is implemented).
- Forking the open tooling under AGPL-3.0 and shipping it under another name
  (see the [forking guide above](#forking-lexgrade)).
- Citing "LexGrade" in writing, research, journalism, and reviews (nominative
  fair use).
- Linking to lexgrade.org.

### Requires written permission

- Branding a product or service "LexGrade …" (e.g. "LexGrade Pro").
- Using the logo or visual identity.
- Using a domain containing "lexgrade" in a way readers could confuse with
  lexgrade.org.
- Implying endorsement ("Recommended by LexGrade").

Email **hello@lexgrade.org**, subject `Trademark request: <use case>`.
Requests are answered within 30 days. Permission is generally granted for
nonprofit, academic, and clinic use, and denied where it would cause
confusion.

### Forks

A fork is renamed (anything without "LexGrade"), acknowledges the source —
*"Built on the LexGrade Standard v1.1 (lexgrade.org), under CC-BY-SA 4.0 /
AGPL-3.0"*, naming the edition it was built on — and claims no endorsement.
The full guide is in the [forking section above](#forking-lexgrade).

### Enforcement

- Nominative use is not policed, forks that follow this policy are left
  alone, and the perpetual fork rights above survive any transfer of the mark.
- Bad-faith confusion (for example, a paid "LexGrade" knockoff) is acted on,
  and every enforcement action is published in this repository.
- The mark transfers to a neutral fiscal host once the project reaches the
  scale described in [Stewardship](#stewardship).

### Status

"LexGrade" is a common-law service mark; a USPTO application is pending.
Trademark questions or disputes: **hello@lexgrade.org**.
