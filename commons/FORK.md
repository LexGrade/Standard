# Forking LexGrade

The LexGrade methodology is open. It is designed to be forked — not as a courtesy gesture, but because *the mission requires it*. Pro se litigants and legal-aid clinics that can't pay for the hosted SaaS need other people to ship other implementations on top of the open rubric.

This document is the explicit "you can do this, here's how" guide. It exists because open-source history teaches an expensive lesson: ambiguous fork rights become weaponized exactly when they matter most. We will not do that. The rights below are permanent, even if the SaaS LLC is later acquired by someone hostile.

---

## What you can fork

| Asset | License | What this lets you do |
|---|---|---|
| `commons/standard/` | CC-BY-SA 4.0 | Reproduce the rubric and technique register in your own product UI, derivative scoring tools, training materials, academic papers, journalism. Attribution required; derivatives must also be CC-BY-SA. |
| `packages/mcp/` | AGPL-3.0 | Self-host or modify the MCP server, build a derivative tool. Same AGPL obligations apply to any hosted derivative. |

## What you can NOT fork

| Asset | Why not |
|---|---|
| The proprietary LexGrade SaaS | Closed-source, all rights reserved; maintained in a separate, private repository. Not part of the open commons. |
| The **"LexGrade"** name and logo | Service mark of the SaaS LLC. Fork the code/content, rename your fork. See [`TRADEMARK.md`](TRADEMARK.md). |
| Customer data, user accounts, paid-feature configurations | Operational SaaS data, not in this repo. |
| Anything in `commons/` not yet published to a tagged release | Pre-release work may be revised before tagging; not promised stable. |

## How to fork (the safe path)

1. **Clone the repo, keep only what you're using.** Most forks only want `commons/` — you can `git clone --filter=blob:none --sparse` and `git sparse-checkout set commons` to grab just the methodology.

2. **Pick a new name.** Anything that doesn't include "LexGrade" is fine. Some examples that would be perfectly acceptable:
   - "MotionVet" / "BriefCheck" / "RubriQ"
   - "[Your Firm] Verify" / "[Your Clinic] Drafting Tool"
   - "Legal Aid Drafting Assistant — Cook County edition"

3. **Add attribution.** A line in your README (or equivalent) such as:

   > Built on the **LexGrade Methodology v1.0** ([lexgrade.org/methodology](https://lexgrade.org/methodology)), reused under AGPL-3.0 / CC-BY-SA 4.0. This is not an official LexGrade product.

4. **Honor the licenses.** AGPL on the code and tools means: if you ship a hosted service built on them, your derivative service code is also AGPL and must be made available to users. CC-BY-SA on the rubric means: derivatives stay CC-BY-SA and credit the original. Neither license requires you to ask permission; both require you to play fair.

5. **Track upstream if you want methodology updates.** The rubric will go from v1.0 → v1.1 → v2.0 over time. We don't promise backwards compatibility between major versions. If you want the changes, pull them; if you want to pin, pin.

## What we won't do to forks

We will not:

- **Send "please rebrand" letters to forks that follow this guide.** If you've renamed and attributed, we have no claim.
- **Demand changes to your derivative.** Once you fork under AGPL or CC-BY-SA, your code is yours within those license terms. We don't retain veto rights.
- **Block your fork from accepting our open data.** Your fork can keep ingesting our published rubric v1.1, v2.0, v3.0 forever. The CC-BY-SA license guarantees this.
- **Withdraw the open licenses on already-published versions.** Once rubric v1.0 is out under CC-BY-SA, it stays under CC-BY-SA for that version, permanently. Even if the SaaS LLC pivots to closed-source for v2.0, the v1.0 you forked yesterday is yours forever.
- **Sell out the methodology.** If the SaaS LLC is ever acquired, every license issued for every version published before the acquisition remains valid under its existing terms. An acquirer cannot retroactively close what was opened. This is the AGPL/CC-BY-SA copyleft working as designed.

## Rights that survive any future acquisition

Because the open-source world has been burned by acquisitions that quietly closed previously-open projects, we will state plainly:

> **Every license granted in this repository before the date of any future acquisition or change of control of the SaaS LLC remains valid in perpetuity under its original terms.** The new owner inherits the entity, the trademark, and the right to operate the hosted SaaS — but cannot revoke open licenses already granted, cannot relicense already-published versions, and cannot prevent existing forks from continuing.
>
> Any term in a future Terms of Service or Acceptable Use Policy that purports to retroactively limit these rights is void as applied to anyone acting in good-faith reliance on the licenses as they existed at the time of their fork.

If a future owner tries to walk this back, **the maintainer requests the community fork the methodology to a neutral fiscal sponsor and continue without us.** Better the project survive without the brand than the brand survive without the project.

## If your fork becomes the canonical one

It's possible — desirable, even — that someone forks LexGrade and does it better. Different jurisdictions, different practice areas, different community. If that happens:

- We won't fight it.
- We'll link to your fork from `lexgrade.org/forks` if you ask us to.
- If your fork becomes the de facto standard while ours stagnates, the trademark stops being meaningful — that's a feature of the open ecosystem, not a bug. We'd rather have a thriving methodology under your name than a stagnant one under ours.

The mission is access to justice, not perpetuation of a particular brand.

## Reporting a license violation or asking for clarification

- **License violation by a fork:** email `hello@lexgrade.org`, subject `License concern: <site or product>`. We will investigate within 30 days.
- **Unsure if your use is okay:** email the same address, subject `Fork question: <your use case>`. We will tell you in plain language. We will not threaten.

## Acknowledgments

This document was inspired by SQLite's "permissive forever" stance, Plausible Analytics' fork-friendliness, and the painful counterexample of recent open-source license changes that retroactively closed work the community had relied on. We do not want to be a cautionary tale.
