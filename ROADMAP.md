# Roadmap: from open standard to referrable institution

**What lexgrade.org is.** The institutional home of the open standard: the
Standard, the Technique Register, the machine-readable catalog, and nothing
else. It is deliberately vendor-neutral, with no product, no accounts, no
scoring service, and no data collection. Consumer-facing surfaces built on the
standard (a pro se on-ramp, a guided draft-scoring walkthrough, printed
checklists for help centers) are downstream implementations, maintained
separately and outside this repo's scope, as GOVERNANCE.md already provides
for hosted services. This roadmap covers only the commons: the standard and
its site.

**North star.** The standard becomes the thing institutions cite and
downstream tools build on: courts, clinics, legal aid organizations, and
educators can point to lexgrade.org the way they point to a published
specification, because it is accountable, current, validated, and neutral.

**The messaging principle: the judge test.** Every page must pass this: *a
judge who lands here should be glad it exists.* The standard raises the floor
of what arrives on the docket (better-diagnosed problems, real citations,
provable facts, candor as a gate), and that serves the court as much as the
filer.
Any copy that reads as advantage-seeking, gamesmanship, or marketing fails the
test and gets rewritten. (This is why the Technique Register's candor framing
sits above its category table, and why the homepage leads with the
hallucination evidence rather than a pitch.)

**The gap.** The artifact is ready and the institution around it is not.
Everything on an institutional-citation checklist is satisfied except one
item: nobody is named.

Phases are ordered by dependency, not calendar. Phase 0 blocks external
outreach (Phase 4); Phases 1–3 can proceed in parallel with it.

---

## Phase 0 — Accountability (the blocker)

*Nothing external moves until this ships. Small in effort, decisive in effect.*

- [ ] **Name a steward.** List at least one named editor — with bar admission
      and affiliation — on the About page and in `commons/GOVERNANCE.md`.
      "LexGrade Working Group" stays as the collective, but it must resolve to
      at least one accountable human.
- [ ] **Recruit 2–3 advisory reviewers.** A legal-writing professor, a legal
      aid attorney, and/or a retired judge or court attorney. Listed by name on
      the About page. Their job is annual review sign-off, not day-to-day work.
- [ ] **Publish a corrections channel and SLA.** A `corrections@` address (or
      GitHub issue template) plus a stated commitment: stale-rule reports
      acknowledged within N days, criterion corrections in the next minor
      version. Add to About and `GOVERNANCE.md`.
- [ ] **Decide the fiscal-host question deliberately.** GOVERNANCE.md currently
      defers it; replace the open-ended deferral with a trigger ("when X
      sustained outside contributors" or "before any institutional partnership
      is signed") so partners can see the succession story. Neutrality of the
      commons matters doubly when proprietary services build on the standard —
      the .org must never read as a vendor's marketing surface.

**Done when:** the About page answers "who do I call when this is wrong?" with
a specific person's name.

## Phase 1 — Credibility with judicial readers

*The content is ethics-forward; the packaging must make sure a ten-second skim
sees that first.*

- [x] **Reframe the Technique Register index.** The candor framing ("a
      descriptive catalog of craft… a technique that requires bending candor is
      a defect, not a feature") now sits above the category table on
      `/techniques`, so the skim hits it before any technique name.
- [x] **Surface the hallucination statistics on the homepage.** "Leading
      language models hallucinated in 58–88% of their answers to verifiable
      questions about federal court cases" (Dahl et al. 2024), with the −20
      automatic deduction, as a quiet cited callout in the hero, written to
      read as documentation rather than marketing.
- [x] **Citation-currency visibility.** `citations_verified` added to
      `lgs-criteria.yaml` (source of truth), surfaced in the /standard "Status
      of this document" block and in `/api/v1/standard.json` — driven from
      data, so it can't drift.
- [ ] **Per-criterion `last_verified` dates.** Finer-grained than the
      standard-level date: stamp each criterion that cites 22 NYCRR/CPLR
      authority, render it on the criterion. Establish a quarterly
      re-verification pass (recurring issue) — the Uniform Rules get amended by
      administrative order with little fanfare.
- [ ] **Soften the 3–4 most adversarial-sounding technique names.**
      Candidates: "Catch-22 Demand," "Recursive Bind," "Burden-Shift
      Choreography," "The Concession That Isn't." Definitions stay; the labels
      are what gets screenshotted. Via `rfc:` issue per GOVERNANCE.md; retire
      old names as aliases so citations don't break.

**Done when:** a Presiding Justice's counsel skimming any page finds the
candor framing before anything that could read as gamesmanship, and every
NY-rule citation carries a visible freshness date.

## Phase 2 — Validation

*The Standard's §3 methodology note admits it hasn't been validated through
inter-rater reliability testing, and invites it. The launch scope holds no
validation materials on purpose: a calibration set (three graded exemplars on
identical facts, a criterion-by-criterion scoring guide) and an inter-rater
reliability protocol (Krippendorff's α ≥ 0.80 target, blind scoring, a machine
clarity-round analogue) were drafted, and are withheld from the published tree
until the first round with independent graders is actually running — evidence
ships when it is evidence.*

- [ ] **Recruit the graders.** Partner with a legal-writing program
      (University at Buffalo, Syracuse, Cornell) and/or recruit 3+ independent
      bar-admitted scorers directly.
- [ ] **Publish the calibration set and protocol with the round.** The
      exemplars, scoring guide, IRR protocol, and submission template land in
      `commons/calibration-set/` when the first round opens, so the repo never
      carries an empty graders roll or an unrun protocol.
- [ ] **Publish agreement statistics** in `commons/calibration-set/results/`
      and on the About page, whatever they show. Until this exists, educators
      will cite the Standard but not adopt it.
- [ ] **Surface the calibration evidence on lexgrade.org** once real — a
      /calibration page rendered from the commons source.

**Done when:** the About page carries reliability data with named independent
graders behind it.

## Phase 3 — Jurisdiction profiles (proof the framework travels)

- [ ] **Draft the first profile: NY Appellate Division motion practice.**
      Substitute 22 NYCRR Part 1250 (statewide appellate practice rules) and
      departmental local rules for trial-court authority, per the Standard's
      own porting note. Appellate motions — poor person relief (CPLR 1101),
      assignment of counsel, extensions, stays — are the highest-volume
      self-represented filings in the appellate courts, which makes this
      profile the one downstream access-to-justice tools need first.
- [ ] **Document the porting process itself** (`profiles/README.md`) so the
      renamed forks the trademark policy invites have a worked example.

**Done when:** the diff between base and profile is small enough to read in
one sitting, and the process doc lets a stranger port the next forum.

## Phase 4 — Outreach ladder

*Sequenced: validation first, then credibility cross-links, then institutional
citation. Each rung makes the next easier. Blocked on Phase 0.*

- [ ] **Cornell LII cross-link.** The machine-readable open-standard angle is
      squarely their mission; one inbound link from LII is instant credibility
      with every audience downstream.
- [ ] **Legal-writing programs and clinics.** Offer the Standard as a grading
      rubric (UB, Syracuse, Cornell; then the Legal Writing Institute / ALWD
      circuit). Adoption here is what makes the citation form real.
- [ ] **Legal aid and pro bono organizations** (LawNY, Legal Aid Society of
      Rochester, VLSP Monroe, Erie County VLP): the standard as a training and
      review reference for staff and volunteers. Downstream consumer surfaces
      are where their clients meet it; the .org is where their attorneys do.
- [ ] **Bar associations** (Monroe, Erie, NYSBA legal-writing CLE, NYSBA Task
      Force on AI): the LLM-benchmarking sections are ready-made CLE material,
      and the ethics gate is the frame bar groups want for AI-assisted filings.
- [ ] **The institutional ask, last.** Permanent Commission on Access to
      Justice / UCS Office for Justice Initiatives — arrive with the named
      steward, reliability data, an adopted-in-a-classroom rubric, and the LII
      link already in hand.

**Done when:** lexgrade.org is cited by an institution that the project didn't
solicit copy from.

---

## Sequencing at a glance

```
Phase 0  Accountability      ──────►  Phase 4  Outreach ladder
Phase 1  Judicial credibility ──┐        ▲
Phase 2  Validation           ──┼────────┘  (4 needs 0 strictly;
Phase 3  Jurisdiction profiles──┘            1–3 make 4's asks credible)
```

Rough effort: Phase 0 is mostly recruiting, not writing. Phase 1 is largely
shipped; the remainder (per-criterion dates, technique renames) is days plus
one RFC cycle. Phase 2 is a semester-scale partnership. Phase 3 is the first
real methodology project (RFC process, weeks). Phase 4 runs for months and is
relationships, not code.

## Deferred surfaces

Drafted but deliberately absent from the launch tree, each waiting on its
trigger (all of it lives in git history and returns when earned):

- **Calibration set + IRR protocol** — returns with the first real grader
  round (Phase 2).
- **Jurisdiction and motion-type extension templates** — return with the
  first real jurisdiction profile (Phase 3).
- **Drafting system prompt** — a downstream tool, not part of the standard;
  returns, if at all, as a separately maintained implementation.
- **MCP server** — returns when there is demonstrated demand for
  machine-served access beyond the existing JSON API and llms-full.txt.

## What this roadmap deliberately does not do

- **No consumer surface on the .org.** No scoring service, no accounts, no
  hosted grader, no "start here" funnels. The institutional, zero-JS,
  no-data-collection posture is the asset; downstream implementations carry
  the consumer experience.
- **No outcome-tracking push (§8 of the Standard).** Courts are sensitive to
  anything that reads as "scoring judges' responses." Leave it informative.
- **No endorsement-seeking from courts or grievance committees.** The goal is
  to be citable. Asking for endorsement invites a "no" that forecloses the
  quieter yes.
