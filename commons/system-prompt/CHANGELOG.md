# System Prompt Changelog: v2.0 → v3.0

## Word count: 1,100 → 2,247 (~2x, still under 2,500 token target)

## Changes by Technique

### Technique 1: Expanded Structured Authority Tables
| Change | Location | Words Added |
|--------|----------|-------------|
| Added CPLR § 3212 summary judgment worked example | Phase 2 | +180 |
| Added explicit "count filled vs. empty cells" rule | Phase 2 authority_rules | +12 |
| **Subtotal** | | **+192** |

### Technique 2: Expanded Contrastive Prompting (BAD/GOOD Pairs)
| Change | Location | Words Added |
|--------|----------|-------------|
| Failure Mode 2: Hallucinated citation | Phase 4 | +120 |
| Failure Mode 3: Path dependence blindness | Phase 4 | +130 |
| Failure Mode 4: Multi-motion blindness | Phase 4 | +110 |
| Failure Mode 5: Advocacy deficit | Phase 4 | +100 |
| **Subtotal** | | **+460** |

### Technique 3: Strengthened Phase Gates
| Change | Location | Words Added |
|--------|----------|-------------|
| Gate 1: Added alternative vehicle + path dependence check | Phase 1 | +80 |
| Gate 2: Added "all citations verified, zero hallucinated" | Phase 2 | +15 |
| Gate 3: Added "each strong objection paired with Phase 2 authority" | Phase 3 | +20 |
| Gate 4: Added explicit four-component check + NYSCEF cross-ref | Phase 4 | +25 |
| Phase 5 items 7-8: Added path dependence + proposed order checks | Phase 5 | +30 |
| Proposed order strategy rule in drafting_rules | Phase 4 | +55 |
| Judicial path dependence check in Phase 1 | Phase 1 | +65 |
| **Subtotal** | | **+290** |

### Other
| Change | Location | Words Added |
|--------|----------|-------------|
| Rubric reference updated v3.6 → v4.5 | Header | 0 |
| Scoring table: Ethical section changed Gate → Gate (was 10%) | Phase 5 | 0 |
| Token estimate updated | Header | 0 |

## What Was NOT Changed
- Five-phase architecture: identical
- Phase 3 opposition table: identical
- Phase 4 four-component structure: identical
- Core authority_rules: identical (added one line)
- Worked Example 1 (DRL § 237): updated citations to match refactored motion
- Drafting rules 1-7: identical (added rule 8: proposed order strategy)

## Net Effect
- v2.0: 1 worked example, 1 BAD/GOOD pair, 4 generic gates
- v3.0: 2 worked examples, 5 BAD/GOOD pairs, 4 specific gates + path dependence check
