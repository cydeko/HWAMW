# The House with A Million Windows (HWAMW)

## Project Overview

An interactive, LLM-driven web app that guides users through a psychological "restorying" intervention — helping them reframe and reinterpret their own life experiences through a choose-your-own-adventure interface.

The name and central metaphor is drawn from Henry James:
> "The house of fiction has in short not one window, but a million."

Each "window" in the house represents a different vantage point — a reframing of the user's personal story. The experience is navigated as a journey through the house, with each window offering a new perspective.

## Core Concept

- **Restorying intervention**: A paradigm from psychology in which people are guided to retell their life experiences from new angles, loosening the grip of a fixed narrative and opening up new meaning.
- **Structure**: Choose-your-own-adventure style progression through "the house," with each window corresponding to a different reframing lens.
- **LLM role**: The LLM drives the narrative, personalizes reframings to the user's story, and guides the journey through the house.

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| **Frontend** | Next.js | Vercel deployment; Framer Motion for animations when needed |
| **LLM Backend** | Ollama + Mistral on Google Colab | Exposed via ngrok; MVP/prototype phase only |
| **Database** | Supabase | PostgreSQL; free tier sufficient for research pilot |
| **Auth** | Participant ID via URL | Study links with embedded `?pid=abc123`; no login required |
| **Researcher dashboard** | Next.js `/admin` route | Password-gated; overview, participants table, individual session view |

### LLM Strategy
- MVP: Mistral via Ollama on Colab Pro (compute credits), tunneled via ngrok
- Scale (future): RunPod or Lambda Labs GPU rental running Ollama persistently
- Strong preference for open-source models over commercial APIs
- Model choice must be clearly documented for academic reproducibility (CHI)

### Architecture
```
User browser → Next.js API route → Ollama on Colab (via ngrok)
                     ↓
               Supabase (logging, session data)
```

## Input Modality Progression

The method by which participants submit their story changes across phases:

| Phase | Modality | Rationale |
|---|---|---|
| **Prototype** | Text (written) | Simplest to build; internal use only |
| **Research study** | Audio (spoken) | Prevents AI-generated responses on Prolific; more natural storytelling; manually verifiable |
| **Public / scale** | Text (written) | Appropriate when participation is voluntary and self-motivated |

### On AI-generated responses in research (flag for later)
When recruiting via Prolific, participants may use AI to generate story submissions. Two mitigation paths to investigate before running the study:

1. **Literature review** — search for established best practices in the experimental psychology / HCI literature for detecting or preventing AI-generated responses in online studies. Cross-reference with CHI methodological standards.
2. **Audio interface** — require participants to speak their story rather than type it. Rationale:
   - Point of friction: most people don't have audio generation easily to hand
   - Easier to verify manually: human vs. AI voice is obvious; human vs. AI text is not
   - More accessible: verbal storytelling doesn't presuppose writing ability or formal writing acumen
   - More natural for the restorying context

These investigations should happen before designing the Prolific study. Architecture should accommodate audio input as a future toggle without requiring a full rebuild.

## Publication Strategy

Two-paper arc from the same project:

| Paper | Venue | Primary contribution | Experimental rigour |
|---|---|---|---|
| **Paper 1** | CHI | Compelling interactive system; proof-of-concept effect | Suggestive, not definitive |
| **Paper 2** | PNAS (or similar) | Gold standard psych experiment; causal mechanism | Pre-registered RCT, control condition, power analysis |

HWAMW is Paper 1. Scope decisions should prioritise interface quality and interesting results over experimental precision. The rigorous follow-up comes later.

## Research Context

- **Institution**: Alan Turing Institute, London
- **Target venue**: CHI conference
- **IRB**: Long process at ATI; initiate once infrastructure is sufficiently defined to specify the exact experimental protocol
- **Transparency**: No deception. Participants are told upfront this is a research project informed by psychological science. The quality of the interface is itself a selling point for participation.
- **Participant-facing framing**: "An interactive narrative experience, informed by and informing psychological science" — compelling, accurate, non-clinical

## Conceptual Framework

### Three-way intersection
- **Restorying interventions** (psychology) × **LLM-powered interactive interfaces** (technology) × **Narrative/literature** (humanities)

### Pairwise connections
| Pair | Concept |
|---|---|
| Narrative × Interface | Interactive writing |
| Interface × Restorying | Dynamic restorying — traversing novel paths in restorying space rather than fixed prompts |
| Restorying × Narrative | Expanded story space — the history of literature as a resource for reframing |

### Academic grounding
- Core: Rogers et al. (2023, JPSP) — "Seeing your life story as a Hero's Journey increases meaning in life" (Dan McAdams co-author)
- Mechanism: narrative frame shapes perceived meaning independent of content; even holding events constant, different frames yield different perceived meaning
- Limitation of Rogers: only tests hero's journey — HWAMW expands the frame space dramatically
- Study design: narrative at T1 → meaning questionnaires → restorying prompts → narrative at T2 → meaning questionnaires; compare qualitative narrative changes + quantitative meaning scores

### Literary touchstones
- **Henry James**: "The house of fiction has not one window but a million" — core metaphor
- **Borges**: Library of Babel, Garden of Forking Paths — structural and metafictional precedent; the house IS the library, the windows ARE the forking paths
- **Matt Haig, The Midnight Library**: adjacent territory (different lives as books) but counterfactual rather than restoried — distinction worth making explicit in the paper

### Why LLMs
- Work well with constraints (style, length, tone)
- Fully interactive — narratives can be adaptable and contestable
- Useful for exploring the range of existing narrative conventions and likely tellings
- Their **derivative nature is both acknowledged and desired** — LLM stories are presented as eye-opening possibilities, not the final word
- User agency is key

### Why interactive fiction
- Gamified interactions lower pressure — writing a personal narrative is daunting; answering a game prompt to see what happens next is easy
- Fictional settings encourage open-mindedness and exploration
- Discovery-oriented rather than goal/task-oriented — the ideal user wants to be surprised
- More fun

### Task structure
- **Phase 1**: Articulate personal narrative (drafting) — general direction, personal context, implied audience (self)
- **Phase 2**: Restory it (revision) — specific objectives, same context and audience
- Measure: qualitative differences in narratives + quantitative meaning questionnaire scores

## Narrative Design

### Experience Structure (in order)
1. **The Hook** — atmospheric opening; user is walking late at night, feeling stuck
2. **List of Troubles** — user selects what's on their mind (1-3 from list); interspersed with brief flavor-text narrative choices (path forks, puddles, etc.) that change atmosphere without affecting data
3. **List of Qualities** — user selects personal qualities (1-3); includes "show me more" and "none of the above" options
4. **Description of Qualities** — open-ended elaboration on selected qualities
5. **First Look** — discovering the house; all paths lead to approaching the gate
6. **Prompting the Original Narrative (T1)** — gatekeeper asks for a story (~300 words); user chooses which trouble to tell; this is the T1 narrative measure
7. **Eliciting Detail** — LLM generates plot summary and character list for user to confirm/correct; user describes each character briefly
8. **Motivations** — user selects what they want from life (1-3) + open-ended elaboration
9. **Baseline Meaning Rating (T1)** — in-world as the gatekeeper's "guest book" — a meaningfulness scale; where does this story belong on the post?
10. **Name** — gatekeeper asks what to carve; user gives their name/handle
11. **In the House** — user chooses from available windows (described by visual/sensory attributes corresponding to narrative style)
12. **Through the Frame** — LLM generates a restoried version of their story in the window's style; user responds ("go on" / "that's not quite right"); this is the restorying intervention
13. **Gatekeeper pt. 2 (T2)** — user rewrites their story (~300 words); can copy from any window but final text is their own; this is the T2 narrative measure
14. **Final Meaning Rating (T2)** — same scale as T1; gatekeeper updates the engraving position

### The Gatekeeper
Central character throughout. Slightly mysterious, dry humor, never clinical. Facilitates without explaining. Collects data without feeling like data collection.

### The Windows
Each window = one restorying frame. Selected by visual/sensory description (not by explicit narrative label). The description does the work of setting expectations without prescribing the experience.

**Window mechanism:**
- LLM receives: story profile (T1 narrative, characters, motivations) + frame description + internal prompts (used as reasoning scaffold, not shown to participant)
- LLM generates the complete restoried narrative silently, structured as 3 distinct sections
- Sections are revealed one at a time; participant responds after each
- "Go on…" → reveal next section
- "That's not quite right…" + brief feedback → regenerate from current section onwards; earlier sections locked
- Written in second person ("you") throughout
- Each section is self-contained and emotionally complete, making the next feel necessary — not arbitrary division
- Section structure is frame-specific (defined in each window file) — e.g. Focalization = 3 perspectives; Nonlinear = peak / seed / revelation

**Example window prompt (Hemingway / Hills Like White Elephants):**
> Rewrite this story inspired by Hemingway's "Hills Like White Elephants": reveal tension subtly through dialogue between two major characters; a physical journey symbolizes the protagonist's difficult decision, whose mind is made up (but only alluded to) by the end. Style: short sentences, dialogue without tags.

### Window Library

#### Architecture
Windows are defined in standalone files, decoupled from app code. Each experiment specifies which windows are active via a config file. This allows new frames to be added at any time without touching the app.

```
windows/
  genre/              ← spy, detective, fantasy, sci-fi, romance, legal thriller, etc.
  literary-styles/    ← Hemingway, Henry James, Poe, etc. (short story templates)
  narrative-structures/ ← hero's journey, redemption arc, tragedy, etc.
  approaches/         ← stream of consciousness, non-linear, sensory detail, etc.

experiments/
  study-01-literary-styles.md   ← lists active windows for a given study
  study-02-genre-fiction.md
```

**Each window file contains:**
- User-facing sensory/visual description (what they see when choosing)
- LLM prompt template (style directive + plot intervention)
- Category and tags
- Any style notes or example texts

**Each experiment config contains:**
- Which window files are active
- Any study-specific parameters

#### Known Categories (working list — add freely)
| Category | Examples |
|---|---|
| Genre fiction | spy, detective, fantasy, sci-fi, romance, legal thriller |
| Literary styles | Hemingway, Henry James, Poe |
| Narrative structures | hero's journey, redemption arc, tragedy |
| Approaches | stream of consciousness, non-linear narrative, sensory detail |

#### Defined Frames (10 total)
Each frame has 5 prompts. Stored in `windows/` directory.

**Narrative Structures** (5 active) — *what shape the story takes*
| Frame | Description |
|---|---|
| Hero's Journey | Quest from familiar into challenge; departure, trials, return |
| Redemption Arc | Fall from grace followed by recovery; setback as catalyst |
| Conversations with God | Justifying experience to a transcendent witness |
| Bildungsroman | Moral/psychological development from naivety to maturity |
| Epiphany | Organised around a discrete moment of sudden insight |

**Narrative Techniques** (5 active) — *how the story is told*
| Frame | Description |
|---|---|
| Focalization | Retelling from multiple perspectives (self, other, observer) |
| Zoom | Varying temporal distance (yesterday → deathbed) |
| Objects as Metaphors | Physical objects as symbolic anchors for meaning |
| Nonlinear Narrative | Juxtaposing distant moments; revealing connections invisible in linear time |
| Sensory Detail | Grounding meaning in embodied, visceral experience |

**Library** — future frames go here; not used in any current study

#### Planned Studies

**Study 01 — Structures vs Techniques**
- Conditions: Hero's Journey, Redemption Arc, Conversations with God, Focalization, Zoom, Objects as Metaphor + Control
- Comparison 1: Individual interventions vs Control (ANOVA)
- Comparison 2: Structures category vs Techniques category vs Control
- Each participant does exactly 3 windows
- Window assignment method: TBD (all-same-category / cross-category / random from set of 6)

**Library (future studies):** Bildungsroman, Epiphany, Nonlinear Narrative, Sensory Detail, genre fiction, literary author styles

### Open Design Questions
1. What narrative styles/frames populate the window library beyond Hemingway?
2. What happens when user says "that's not quite right" — retry, or user-directed correction?
3. Minimum number of windows per session for research validity?
4. Architecture of the window content management system

## Key Design Principles

- The user's story is always the center — the LLM serves the narrative, not the other way around.
- The house metaphor should feel coherent and immersive, not gimmicky.
- Psychological safety matters: the interface should feel warm, exploratory, and non-clinical.
