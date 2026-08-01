# LexGrade Commons — Governance

This document describes how decisions get made in the open commons (`commons/`),
how forking works, and how the trademark is handled. It is intentionally short:
the project is young, and the goal is to keep the methodology open and
contributable — not to build elaborate governance machinery before it is needed.

## Scope

This governs **`commons/`** only — the open methodology (the rubric and Technique
Register), licensed CC-BY-SA 4.0. The tooling (`sites/`, `packages/`) is licensed
AGPL-3.0-only. Any hosted or proprietary service built on the standard is **not**
governed by this document and is maintained separately.

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
2. **Methodology changes** (rubric weights, gate logic, criteria, version bumps) —
   open a public issue tagged `rfc:` first; merged by rough consensus after the RFC
   has been open ≥ 7 days. Significant changes get a version bump in `methodology.yaml`.
3. **Breaking changes** (rubric structure that breaks tooling; license changes) —
   tagged `rfc:breaking`, with 30 days' notice and broad agreement before merge.

## No CLA

Contributions are accepted under the repository's existing licenses, inbound =
outbound: by contributing, you license your contribution under the same terms
as the file you are changing, and nothing more.

A CLA would let the project relicense your contribution under different terms. We
never want that power: AGPL-3.0-only on the tooling and CC-BY-SA 4.0 on the rubric
exist for **permanence** — the methodology cannot be quietly relicensed or absorbed
into a closed product. Inbound = outbound gives the legal hygiene without the
relicensing escape hatch. (A `Signed-off-by:` trailer per the
[Developer Certificate of Origin](https://developercertificate.org/) is welcome
but not required.)

## License of contributions

By contributing you affirm your contribution is licensed under:

| If you're modifying… | Your contribution is licensed under… |
|---|---|
| `commons/standard/**` | CC-BY-SA 4.0 |
| `packages/**`, `sites/**` (tooling & sites) | AGPL-3.0-only |

If a PR touches both code and content, each file inherits its directory's license.

## Permanence commitments

Whatever stewardship structure comes later, these hold:

1. **`commons/` is never relicensed to a closed license.** The DCO (not CLA) is what
   makes this enforceable.
2. **Published rubric versions keep their rights.** v1.0 stays under CC-BY-SA forever,
   even if a later version ships under different terms.
3. **The methodology stays forkable.** Renamed, attributed forks that follow the
   [forking guide below](#forking-lexgrade) are welcome; the trademark is never used
   to suppress them.

## Contributing

See [`/.github/CONTRIBUTING.md`](../.github/CONTRIBUTING.md) for the full workflow.

---

## Forking LexGrade

The LexGrade methodology is open. It is designed to be forked — not as a courtesy
gesture, but because *the mission requires it*. Pro se litigants and legal-aid
clinics that can't pay for a hosted service need other people to ship other
implementations on top of the open rubric.

This section is the explicit "you can do this, here's how" guide. It exists
because open-source history teaches an expensive lesson: ambiguous fork rights
become weaponized exactly when they matter most. We will not do that. The rights
below are permanent, even if the SaaS LLC is later acquired by someone hostile.

### What you can fork

| Asset | License | What this lets you do |
|---|---|---|
| `commons/standard/` | CC-BY-SA 4.0 | Reproduce the rubric and technique register in your own product UI, derivative scoring tools, training materials, academic papers, journalism. Attribution required; derivatives must also be CC-BY-SA. |
| `sites/`, `packages/` (tooling) | AGPL-3.0 | Self-host or modify the site and tooling, build a derivative tool. Same AGPL obligations apply to any hosted derivative. |

### What you can NOT fork

| Asset | Why not |
|---|---|
| The proprietary LexGrade SaaS | Closed-source, all rights reserved; maintained in a separate, private repository. Not part of the open commons. |
| The **"LexGrade"** name and logo | Service mark of the SaaS LLC. Fork the code/content, rename your fork. See the [trademark policy below](#trademark-policy). |
| Customer data, user accounts, paid-feature configurations | Operational SaaS data, not in this repo. |
| Anything in `commons/` not yet published to a tagged release | Pre-release work may be revised before tagging; not promised stable. |

### How to fork (the safe path)

1. **Clone the repo, keep only what you're using.** Most forks only want
   `commons/` — you can `git clone --filter=blob:none --sparse` and
   `git sparse-checkout set commons` to grab just the methodology.

2. **Pick a new name.** Anything that doesn't include "LexGrade" is fine. Some
   examples that would be perfectly acceptable:
   - "MotionVet" / "BriefCheck" / "RubriQ"
   - "[Your Firm] Verify" / "[Your Clinic] Drafting Tool"
   - "Legal Aid Drafting Assistant — Cook County edition"

3. **Add attribution.** A line in your README (or equivalent) such as:

   > Built on the **LexGrade Methodology v1.0** ([lexgrade.org/methodology](https://lexgrade.org/methodology)), reused under AGPL-3.0 / CC-BY-SA 4.0. This is not an official LexGrade product.

4. **Honor the licenses.** AGPL on the code and tools means: if you ship a hosted
   service built on them, your derivative service code is also AGPL and must be
   made available to users. CC-BY-SA on the rubric means: derivatives stay
   CC-BY-SA and credit the original. Neither license requires you to ask
   permission; both require you to play fair.

5. **Track upstream if you want methodology updates.** The rubric will go from
   v1.0 → v1.1 → v2.0 over time. We don't promise backwards compatibility between
   major versions. If you want the changes, pull them; if you want to pin, pin.

### What we won't do to forks

We will not:

- **Send "please rebrand" letters to forks that follow this guide.** If you've
  renamed and attributed, we have no claim.
- **Demand changes to your derivative.** Once you fork under AGPL or CC-BY-SA,
  your code is yours within those license terms. We don't retain veto rights.
- **Block your fork from accepting our open data.** Your fork can keep ingesting
  our published rubric v1.1, v2.0, v3.0 forever. The CC-BY-SA license guarantees
  this.
- **Withdraw the open licenses on already-published versions.** Once rubric v1.0
  is out under CC-BY-SA, it stays under CC-BY-SA for that version, permanently.
  Even if the SaaS LLC pivots to closed-source for v2.0, the v1.0 you forked
  yesterday is yours forever.
- **Sell out the methodology.** If the SaaS LLC is ever acquired, every license
  issued for every version published before the acquisition remains valid under
  its existing terms. An acquirer cannot retroactively close what was opened.
  This is the AGPL/CC-BY-SA copyleft working as designed.

### Rights that survive any future acquisition

Because the open-source world has been burned by acquisitions that quietly closed
previously-open projects, we will state plainly:

> **Every license granted in this repository before the date of any future
> acquisition or change of control of the SaaS LLC remains valid in perpetuity
> under its original terms.** The new owner inherits the entity, the trademark,
> and the right to operate the hosted SaaS — but cannot revoke open licenses
> already granted, cannot relicense already-published versions, and cannot
> prevent existing forks from continuing.
>
> Any term in a future Terms of Service or Acceptable Use Policy that purports to
> retroactively limit these rights is void as applied to anyone acting in
> good-faith reliance on the licenses as they existed at the time of their fork.

If a future owner tries to walk this back, **the maintainer requests the
community fork the methodology to a neutral fiscal sponsor and continue without
us.** Better the project survive without the brand than the brand survive
without the project.

### If your fork becomes the canonical one

It's possible — desirable, even — that someone forks LexGrade and does it better.
Different jurisdictions, different practice areas, different community. If that
happens:

- We won't fight it.
- We'll link to your fork from `lexgrade.org/forks` if you ask us to.
- If your fork becomes the de facto standard while ours stagnates, the trademark
  stops being meaningful — that's a feature of the open ecosystem, not a bug.
  We'd rather have a thriving methodology under your name than a stagnant one
  under ours.

The mission is access to justice, not perpetuation of a particular brand.

### Reporting a license violation or asking for clarification

- **License violation by a fork:** email `hello@lexgrade.org`, subject
  `License concern: <site or product>`. We will investigate within 30 days.
- **Unsure if your use is okay:** email the same address, subject
  `Fork question: <your use case>`. We will tell you in plain language. We will
  not threaten.

### Acknowledgments

This guide was inspired by SQLite's "permissive forever" stance, Plausible
Analytics' fork-friendliness, and the painful counterexample of recent
open-source license changes that retroactively closed work the community had
relied on. We do not want to be a cautionary tale.

---

## Trademark policy

**Last updated: 2026-06-20**

LexGrade is two things: an **open standard** — free to implement, fork, and
redistribute under its licenses — and a **commercial product**, the canonical
hosted service. The standard is meant to spread; the "LexGrade" name identifies
the official implementation. This policy keeps the two from swallowing each
other.

### What you can call your work

| Thing | Status | What it means |
|---|---|---|
| **"LexGrade"** — word mark, logo, domain | Service mark of the SaaS LLC | Don't use it to brand your own product, service, or domain without written permission. |
| **"LexGrade Standard v1.0"** | Name of the open standard | Use this exact phrase to describe an implementation of the open rubric + Technique Register, as long as you don't imply endorsement. |
| The rubric and Technique Register | Open content (CC-BY-SA-4.0; tooling AGPL-3.0) | Implement, fork, and redistribute freely — under any name except "LexGrade." |

### Without asking, you may

- Implement the open rubric and Technique Register — describe it as "an
  implementation of the LexGrade Standard v1.0."
- Fork the open tooling under AGPL-3.0 and ship it under your own name (see the
  [forking guide above](#forking-lexgrade)).
- Cite "LexGrade" in writing, research, journalism, and reviews — nominative
  fair use.
- Link to lexgrade.org.

### With written permission

- Branding a product or service "LexGrade …" (e.g. "LexGrade Pro").
- Using the logo or visual identity.
- Using a domain containing "lexgrade" in a way users could confuse with the
  official service.
- Implying endorsement ("Recommended by LexGrade").

Email **hello@lexgrade.org**, subject `Trademark request: <use case>`. We
respond within 30 days; permission is generally granted for nonprofit,
academic, and clinic use, and denied where it would create user confusion.

### If you fork

Rename it (anything without "LexGrade"), acknowledge the source — *"Built on the
LexGrade Standard v1.0 (lexgrade.org), under AGPL-3.0 / CC-BY-SA-4.0"* — and
don't claim endorsement. Full guide in the [forking section above](#forking-lexgrade).

### What we will and won't do

- We **won't** police nominative use, bully forks that follow this policy, or
  sell the mark to a hostile acquirer — the perpetual fork rights above survive
  any acquisition.
- We **will** enforce against bad-faith confusion (a paid "LexGrade" knockoff),
  publish every enforcement action in this repository, and transfer the mark to
  a neutral fiscal host once the project reaches the scale described in
  [Stewardship](#stewardship).

### Status

"LexGrade" is a common-law service mark; a USPTO application is pending.
Trademark questions or disputes: **hello@lexgrade.org**.
