---
name: Study 01 — Narrative Structures vs Narrative Techniques
status: planning
---

## Hypothesis
Does restructuring a story (changing *what shape* it takes) produce greater shifts in perceived meaning than reframing *how* it is narrated? And do either of these outperform a control condition?

## Design
- **Between-subjects**: participants randomly assigned to either Structures or Techniques category
- **Within category**: randomly assigned 3 of the 5 frames in their category
- Participants choose the order in which they visit their 3 assigned windows

## Conditions

**Narrative Structures** (3 randomly assigned from all 5):
- Hero's Journey (`windows/narrative-structures/heros-journey.md`)
- Redemption Arc (`windows/narrative-structures/redemption-arc.md`)
- Conversations with God (`windows/narrative-structures/conversations-with-god.md`)
- Bildungsroman (`windows/narrative-structures/bildungsroman.md`)
- Epiphany (`windows/narrative-structures/epiphany.md`)

**Narrative Techniques** (3 randomly assigned from all 5):
- Focalization (`windows/narrative-techniques/focalization.md`)
- Zoom (`windows/narrative-techniques/zoom.md`)
- Objects as Metaphors (`windows/narrative-techniques/objects-as-metaphors.md`)
- Nonlinear Narrative (`windows/narrative-techniques/nonlinear-narrative.md`)
- Sensory Detail (`windows/narrative-techniques/sensory-detail.md`)

**Control**
- Not included in CHI version — prioritising compelling interface over experimental rigour at this stage
- Control condition to be designed for PNAS follow-up (gold standard experimental version)

## Comparisons
1. Each individual intervention vs Control (ANOVA)
2. Structures category vs Techniques category vs Control

## Session Flow
1. Consent gate
2. T1 narrative (~300 words)
3. T1 meaning rating (in-world guest book scale)
4. *(if questionnaires toggled ON)* T1 questionnaire battery
5. 3 restorying windows (assigned category, random subset, participant-chosen order)
6. T2 narrative (~300 words)
7. T2 meaning rating (same scale)
8. *(if questionnaires toggled ON)* T2 questionnaire battery
9. Debrief

## Questionnaires
Toggle `questionnaires_enabled: true/false` to include/exclude for testing vs. live experiment.

| Scale | File | Status |
|---|---|---|
| MEMS | `questionnaires/MEMS.md` | active |
| MLQ | `questionnaires/MLQ.md` | active |
| PTGI | `questionnaires/PTGI.md` | active |
| NISE | `questionnaires/NISE.md` | pending access |

*Note: The in-world meaning scale (guest book) is the primary informal measure. Validated questionnaires are included to establish correlation with standard instruments.*

## Open Questions
- [x] Control condition — deferred to PNAS version
- [x] Session resumption: participant returns via URL → resume from last completed step; incomplete windows restart from beginning (partial window progress not saved); completed windows and narratives preserved
- [ ] Minimum/target N per condition
- [ ] IRB approval (Alan Turing Institute)
- [ ] Prolific recruitment + AI response detection (see CLAUDE.md)
- [ ] Access NISE scale (Lind et al., 2025)
- [x] Rating scale: 7-point visual post; top anchor "a story that changed everything — the kind you'd tell on your deathbed"; bottom anchor "a story still waiting to make sense"; no numbers visible to participant; 1–7 recorded in Supabase
