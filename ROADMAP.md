# Roadmap: from open standard to referrable resource

**North star.** A New York court help center, public-access law library, or legal
aid intake desk can put lexgrade.org on its referral list for self-represented
litigants — and a Fourth Department staff attorney skimming the site for ten
seconds finds nothing that makes them hesitate.

**The gap, in one sentence.** The artifact is ready; the institution around it
is not. Everything on a court's referral checklist is satisfied (free, no data
collection, correct disclaimers, defers procedure to the court's own rules)
except one: nobody is named. Every phase below either closes that gap or builds
the on-ramp pro se litigants need once it's closed.

Phases are ordered by dependency, not calendar. Phase 0 blocks external
outreach (Phase 5); Phases 1–4 can proceed in parallel with it.

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
      sustained outside contributors" or "before any court/bar partnership is
      signed") so partners can see the succession story.

**Done when:** the About page answers "who do I call when this is wrong?" with
a name, not a working group.

## Phase 1 — The pro se front door (site + print)

*The homepage currently sells a practitioner instrument; the mission is access
to justice. Split the front door.*

- [ ] **Homepage dual path.** Alongside "Read the Standard →", add a
      co-equal path: "Filing without a lawyer? Start here →". Touchpoint:
      `sites/lexgrade.org/src/render.mjs` (homepage template).
- [ ] **New page: `/self-represented/`** built from the Standard's §9
      Plain-Language Quick Start. Eight questions, one screen, ~8th-grade
      reading level. Prominent up-front pointers to CourtHelp
      (nycourts.gov/courthelp) for the procedural side that Principle 1
      correctly defers, and the not-legal-advice disclaimer in plain words
      ("this checks the quality of a draft; it cannot tell you what to file").
- [ ] **One-page printable checklist (PDF + print CSS).** The quick-start
      table as a paper handout — court help centers, law libraries, and clinic
      tabling run on paper. Add a "Print this page" affordance and a direct
      `/checklist.pdf` link. Generate at build time in `build.mjs` so it can't
      drift from the source table.
- [ ] **Reading-level pass on all pro se-facing copy.** Target: a reader with
      no legal training gets through `/self-represented/` without a dictionary.
      Keep pa11y in CI; add the new page to `.pa11yci.json`.

**Done when:** a help-center volunteer can hand someone a single printed page
and say "check your papers against this before you file."

## Phase 2 — Packaging fixes (credibility with judicial readers)

*The content is ethics-forward; the packaging invites the wrong first
impression from exactly the people whose quiet approval is needed.*

- [ ] **Reframe the Technique Register index.** Move the ethics framing
      ("descriptive catalog of craft… candor is non-negotiable") above the
      category table on the `/techniques/` page, so the ten-second skim hits it
      first. Touchpoint: `render.mjs` techniques index template; register intro
      in `commons/standard/Technique_Register_v1.0.md`.
- [ ] **Soften the 3–4 most adversarial-sounding technique names.**
      Candidates: "Catch-22 Demand," "Recursive Bind," "Burden-Shift
      Choreography," "The Concession That Isn't." Definitions stay; the labels
      are what gets screenshotted. Rename via `rfc:` issue per GOVERNANCE.md
      (these are register entries — routine-to-methodology tier; retire old
      names as aliases so citations don't break).
- [ ] **Surface the hallucination statistics on the homepage.** "General-purpose
      LLMs hallucinate 58–88% of legal citations" (Dahl et al. 2024) is the
      sentence that makes a court administrator forward the link. One sentence,
      cited, above the fold.
- [ ] **Per-criterion `last_verified` dates.** Add a `last_verified:` field to
      each criterion citing 22 NYCRR/CPLR authority in
      `commons/standard/lgs-criteria.yaml`; render it on criterion pages.
      The Uniform Rules get amended by administrative order with little
      fanfare — a stale rule citation in a quality standard is a credibility
      wound. Add a calendar reminder / recurring issue to re-verify quarterly.

**Done when:** a Presiding Justice's counsel skimming `/techniques/` sees the
candor framing before the category table, and every NY-rule citation carries a
visible freshness date.

## Phase 3 — The usable path (LLM + MCP recipe)

*A pro se litigant cannot self-score 45 criteria. The realistic path is the
LLM pairing already built via the MCP server — but it must be documented with
the verification step made structurally unskippable.*

- [ ] **New page: `/score-your-draft/`** — a documented, safe recipe: paste
      your draft, run it against the standard (via an LLM with the lexgrade MCP
      server, or the published `llms-full.txt`), read the per-principle
      feedback, **then verify every citation against the official reporter
      before filing**. The verification step is written into the canonical
      prompt itself, not left as a footnote.
- [ ] **Publish the canonical scoring prompt** as a copy-paste block and as a
      file in the repo (`packages/mcp/PROMPT.md` or similar), so downstream
      tools converge on one prompt with the candor gate and verification step
      baked in.
- [ ] **MCP quick-start for non-developers.** The current MCP instructions
      assume a developer (`claude mcp add…`). Add a plain-English path for
      clinic staff and law librarians — likely Claude Desktop config or a
      hosted-tool pointer, whatever is honestly maintainable.
- [ ] **Failure-mode honesty box.** On `/score-your-draft/`, state plainly what
      pairing with an LLM cannot do: it cannot verify citations, cannot know
      the local part rules, cannot substitute for legal advice. This box is
      what makes the page referrable rather than dangerous.

**Done when:** a law librarian can walk a patron through scoring a draft
motion in one sitting, and the citation-verification step cannot be skipped
without deliberately editing the prompt.

## Phase 4 — Appellate Division jurisdiction profile

*Proof that the profile mechanism works, aimed at the filings pro se parties
actually make in the appellate courts.*

- [ ] **Draft `profiles/ny-appellate-division/`** substituting 22 NYCRR
      Part 1250 (statewide appellate practice rules) and departmental local
      rules for the trial-court authority in the base criteria, per the
      Standard's own porting note (§ Scope).
- [ ] **Motion-type overlays for the high-volume pro se motions:** poor person
      relief (CPLR 1101), assignment of counsel, extensions, stays pending
      appeal, leave to appeal. These are the single most common pro se filings
      in the Appellate Division.
- [ ] **Structure it as the template profile** — document the porting process
      itself (`profiles/README.md`) so the Second Circuit / other-state forks
      the trademark policy invites have a worked example.

**Done when:** someone scoring a CPLR 1101 motion in the Fourth Department has
criteria that cite Part 1250, not trial-court rules — and the diff between base
and profile is small enough to read in one sitting.

## Phase 5 — Validation and outreach ladder

*Sequenced: validation partner first, then credibility cross-links, then
institutional referrals. Each rung makes the next one easier to climb.
Blocked on Phase 0.*

- [ ] **Inter-rater reliability study.** The Standard's §3 methodology note
      admits it hasn't been validated and invites testing. Partner with a
      legal-writing program (University at Buffalo, Syracuse, Cornell) — two
      independent graders scoring the same motion set; publish agreement stats
      on the About page whatever they show. Until this exists, educators will
      cite the Standard but not adopt it.
- [ ] **Cornell LII cross-link.** The machine-readable open-standard angle is
      squarely their mission; one inbound link from LII is instant credibility
      with every audience downstream.
- [ ] **Legal aid pilots (Fourth Department footprint).** LawNY, Legal Aid
      Society of Rochester, Volunteer Legal Services Project of Monroe County,
      Erie County VLP: offer the printed checklist + `/score-your-draft/`
      walkthrough for intake/clinic use; collect what confuses people; feed it
      back into Phase 1 copy.
- [ ] **Bar association CLE.** Monroe and Erie County Bar Associations; NYSBA
      legal-writing CLE track and the NYSBA Task Force on AI (the LLM
      benchmarking sections are ready-made for their guidance work).
- [ ] **The institutional ask, last.** Permanent Commission on Access to
      Justice and the UCS Office for Justice Initiatives — this is the kind of
      resource their annual report catalogs, but only after the named-steward,
      pilot, and validation rungs exist. Arrive with: named editor, advisory
      reviewers, reliability data, two legal aid pilots, and the printed
      checklist in use.

**Done when:** lexgrade.org appears on a court-adjacent referral list that the
project didn't write itself.

---

## Sequencing at a glance

```
Phase 0  Accountability          ──────►  Phase 5  Outreach ladder
Phase 1  Pro se front door       ──┐         ▲
Phase 2  Packaging fixes         ──┼─────────┘  (5 needs 0 strictly;
Phase 3  LLM/MCP recipe          ──┘             1–3 make 5's asks credible)
Phase 4  Appellate profile       ─────►  strengthens 5's court-facing ask
```

Rough effort: Phases 0–2 are days of work each (0 is mostly recruiting, not
writing). Phase 3 is a week-scale docs-and-page effort. Phase 4 is the first
real methodology project (RFC process, weeks). Phase 5 runs for months and is
mostly relationships, not code.

## What this roadmap deliberately does not do

- **No scoring service, no accounts, no hosted grader.** The zero-JS,
  no-data-collection posture is a referral asset; don't trade it away.
- **No outcome-tracking push (§8 of the Standard).** Courts are sensitive to
  anything that reads as "scoring judges' responses." Leave it informative.
- **No endorsement-seeking from courts or grievance committees.** The goal is
  to be *referrable*, not endorsed; asking for endorsement invites a "no" that
  forecloses the quieter yes.
