# Phase D — Content Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Populate AliCogia with the full Phase C schema, then build 3 new unit data.js files (Shakuntala, Bloomers, Math Innovations) from source teaching materials.

**Architecture:** D1 audits and completes the AliCogia `data.js` — it is the reference schema. D2–D4 each read their source HTML/PDF/MD, extract content into the same schema, and write a complete `data.js`. Each sub-phase is independently committable. Phase C must be complete before starting D (the schema fields being filled here are consumed by Phase C toolbar features).

**Tech Stack:** Static JS data files only. No build tools. Content extraction done by reading source files and writing `data.js`.

**Prerequisites:** Phase C complete (toolbar reads `pacingGuide`, `raceFrames`, `exitTicket`, ESOL tiers, STOP labels, `achievementLevels`).

**Spec:** `docs/superpowers/specs/2026-03-12-ir-platform-upgrade-design.md` — Phase D section

---

## File Structure

| File | Change |
|------|--------|
| `units/alicogia/data.js` | Add all Phase C schema fields; fill with real AliCogia content |
| `units/shakuntala/data.js` | Full replacement — stub file created by Phase B generator, now filled with real content |
| `units/shakuntala/downloads/` | New folder — copy PDF + student packet from source |
| `units/bloomers/data.js` | Full replacement — stub file created by Phase B generator, now filled with real content |
| `units/bloomers/downloads/` | New folder — copy PDF + student packet from source |
| `units/mathinnovations/data.js` | Full replacement — stub file created by Phase B generator, now filled with real content |
| `units/mathinnovations/downloads/` | New folder — copy PDF + student packet from source |
| `units-registry.js` | Set `status: 'live'`, correct `days: 4`, fix `benchmark`/`benchmarkLabel`/`title` for all three units |

**Hard prerequisite:** Phase B must be complete before Tasks 6–14. The stub `units/{id}/` folders and `data.js` files are created by the Phase B generator script. If Phase B has not run, D2–D4 tasks will have no target files to modify.

---

## Chunk 1: D1 — AliCogia Content Alignment Audit

### Task 1: Read and understand current AliCogia data.js

**Files:**
- Read: `units/alicogia/data.js`

- [ ] **Step 1: Read the current `units/alicogia/data.js`** in full.

- [ ] **Step 2: Make a checklist of what is missing vs. the Phase D spec.**

Required additions per the spec:

**In `meta`:**
- `benchmarkDescription: 'Analyze how an author develops and individualizes the responses of characters to situations using literary elements and devices'`

**Per day (days 1–6):**
- `pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 10 }`
- `exitTicket: { prompt: '...', frame: '...' }`
- `raceFrames: { task, restate, answer, cite, explain }`
- `engageActivities: [...]`
- ESOL migrated from flat to 3-tier: `{ l12: { frames, wordBank }, l34: { frames, wordBank: [] }, l5: { frames } }`

**Per MC question in bellringer:**
- `stopLabel: 'Silly' | 'Tricky' | 'Opposite' | 'Proven'`

**Per organizer row:**
- `phase: 'I Do' | 'We Do' | 'You Do w/ Partner' | 'You Do'`

**In `assessment`:**
- `achievementLevels: [{ level, label, descriptor }, ...]`

---

### Task 2: Update AliCogia data.js — meta and assessment

**Files:**
- Modify: `units/alicogia/data.js`

- [ ] **Step 1: Add `benchmarkDescription` to `meta`:**

```js
// In UNIT.meta, add after benchmarkLabel:
benchmarkDescription: 'Analyze how an author develops and individualizes the responses of characters to situations using literary elements and devices',
```

- [ ] **Step 2: Add `achievementLevels` to `UNIT.assessment`:**

```js
achievementLevels: [
  {
    level: 2,
    label: 'Approaching',
    descriptor: 'Identifies a literary element present in the text with minimal or indirect textual support.'
  },
  {
    level: 3,
    label: 'Meets',
    descriptor: 'Explains how a literary element contributes to character development using relevant textual evidence.'
  },
  {
    level: 4,
    label: 'Exceeds',
    descriptor: 'Analyzes the relationship between multiple literary elements and how the author uses them together to individualize a character\'s response to conflict.'
  },
  {
    level: 5,
    label: 'Mastery',
    descriptor: 'Evaluates the author\'s deliberate craft choices — including literary elements and devices — and their cumulative effect on how Ali Cogia is developed as a uniquely motivated, principled character.'
  }
]
```

- [ ] **Step 3: Commit**
```bash
git add units/alicogia/data.js
git commit -m "feat(D1): add benchmarkDescription and achievementLevels to AliCogia"
```

---

### Task 3: Update AliCogia data.js — ESOL migration (all 6 days)

**Files:**
- Modify: `units/alicogia/data.js`

- [ ] **Step 1: Read the existing ESOL data format in `data.js`.** It likely uses a flat format (single `esol` object or flat arrays). Identify all 6 days' ESOL data.

- [ ] **Step 2: Migrate each day's ESOL data to the 3-tier format.**

For each day, the new shape is:
```js
esol: {
  l12: {
    frames: ['Sentence frame 1', 'Sentence frame 2'],
    wordBank: ['word1', 'word2', 'word3', 'word4', 'word5']
  },
  l34: {
    frames: ['Slightly more complex frame 1', 'Frame 2'],
    wordBank: []
  },
  l5: {
    frames: ['Academic frame for near-proficient students']
  }
}
```

Rules:
- L1–2: simplest frames, always include wordBank (5–8 words from the passage)
- L3–4: moderately scaffolded frames, no wordBank
- L5: one academic frame with no scaffolding beyond the sentence starter

If existing ESOL data is already good, migrate it. If placeholders exist, write real frames based on the day's organizer content.

- [ ] **Step 3: Verify shape is correct** — each day has `esol.l12.frames`, `esol.l12.wordBank`, `esol.l34.frames`, `esol.l5.frames`.

- [ ] **Step 4: Commit**
```bash
git add units/alicogia/data.js
git commit -m "feat(D1): migrate AliCogia ESOL data to 3-tier l12/l34/l5 format"
```

---

### Task 4: Update AliCogia data.js — STOP labels and organizer phases

**Files:**
- Modify: `units/alicogia/data.js`

- [ ] **Step 1: Read the bellringer structure.** Each day's `bellringer.questions` array has MC questions. Each wrong answer choice needs a STOP label.

STOP strategy labels:
- **Silly** — absurd answer, easy to eliminate
- **Tricky** — sounds right, has a related word or partial truth, but misses the point
- **Opposite** — directly contradicts the correct answer
- **Proven** — the correct answer (proved by text evidence)

- [ ] **Step 2: Add `stopLabel` to each MC answer choice in all 6 days.**

The structure per answer choice:
```js
{ text: 'Answer text here', stopLabel: 'Tricky' }
```

The correct answer gets `stopLabel: 'Proven'`. Each wrong answer gets one of: Silly, Tricky, Opposite. Each set of 4 answer choices should use varied labels (not all Tricky).

- [ ] **Step 3: Add `phase` to each organizer row** across all 6 days.

The IR 6-day cycle:
- Day 1: I Do (teacher models)
- Day 2: We Do (class/pairs)
- Day 3: You Do w/ Partner
- Day 4: You Do
- Days 5–6: RACE/assessment (use 'You Do' or 'Assessment')

For each `progressItems` row, add:
```js
{ ..., phase: 'I Do' }  // or 'We Do', 'You Do w/ Partner', 'You Do'
```

- [ ] **Step 4: Commit**
```bash
git add units/alicogia/data.js
git commit -m "feat(D1): add STOP labels to MC choices and GR phase labels to organizer rows"
```

---

### Task 5: Update AliCogia data.js — pacingGuide, exitTicket, raceFrames per day

**Files:**
- Modify: `units/alicogia/data.js`

- [ ] **Step 1: Add `pacingGuide` to each of days 1–6.**

Standard IR pacing (minutes):
```js
// Days 1-4 (passage present):
pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 10 }

// Days 5-6 (RACE/review, no new passage):
pacingGuide: { bellringer: 5, vocab: 5, organizer: 20, teacher: 10, passage: 0 }
```

Adjust if the day's content suggests different timing.

- [ ] **Step 2: Add `exitTicket` to each of days 1–6.**

Each exit ticket should be specific to that day's content focus:
```js
// Day 1 example:
exitTicket: {
  prompt: 'What literary element does the author use in paragraph 3, and how does it develop Ali Cogia as a character?',
  frame: 'The author uses ___ to develop Ali Cogia as a character by...'
}
```

Write real, content-specific prompts based on each day's organizer focus.

- [ ] **Step 3: Add `raceFrames` to each of days 1–6.**

Each day needs a specific writing task tied to that day's reading:
```js
raceFrames: {
  task: 'Write a constructed response explaining how the author uses [element] in [paragraph X] to develop Ali Cogia.',
  restate: 'The author uses ___ to develop Ali Cogia in this passage.',
  answer: 'Specifically, the author reveals that Ali Cogia is ___ when...',
  cite: 'For example, in paragraph ___, the text states, "..."',
  explain: 'This evidence shows that Ali Cogia is ___ because...'
}
```

- [ ] **Step 4: Add `engageActivities` stub to each of days 1–6.**

At minimum 1 activity per day. Activities will be fully built in Phase E. For now, add at least a poll and a TPS activity per day so Phase E has content to render:

```js
// Day 1 example:
engageActivities: [
  {
    type: 'poll',
    question: 'Which literary element does the author use most in this passage?',
    choices: ['A. Characterization', 'B. Conflict', 'C. Setting', 'D. Symbol'],
    correct: 'A'
  },
  {
    type: 'tps',
    prompt: 'What does this passage reveal about Ali Cogia\'s character?',
    thinkSeconds: 60,
    pairSeconds: 90,
    shareSeconds: 0
  }
]
```

- [ ] **Step 5: Verify the full schema is complete** by reviewing all 6 days against the checklist from Task 1 Step 2.

- [ ] **Step 6: Commit**
```bash
git add units/alicogia/data.js
git commit -m "feat(D1): add pacingGuide, exitTicket, raceFrames, engageActivities to all 6 days"
```

---

## Chunk 2: D2 — Shakuntala Unit

### Task 6: Read Shakuntala source files

**Files:**
- Read: `~/Documents/Teaching/Units/Shakuntala-Unit/Shakuntala_D1-4_TestPrep_Interactive_v9.html`
- Read: `~/Documents/Teaching/Units/Shakuntala-Unit/Unit2_Shakuntala_TeacherLessonPlan.md`

- [ ] **Step 1: Read the interactive HTML file.** Extract:
  - Text passage (Acts IV & V excerpts) — the actual paragraph text
  - Vocabulary words + definitions (wistfulness, reverence, presentment + any others)
  - Bellringer MC questions for each day
  - Organizer rows per day

- [ ] **Step 2: Read the teacher lesson plan.** Extract:
  - Daily learning objectives
  - Teacher notes / modeling language
  - RACE frames per day
  - Exit ticket prompts
  - ESOL scaffolds

---

### Task 7: Write units/shakuntala/data.js

**Files:**
- Modify: `units/shakuntala/data.js` (replace stub content)

- [ ] **Step 1: Write the full `UNIT` object** using the content extracted in Task 6.

The shape must follow AliCogia exactly. Key differences:
- `meta.id: 'shakuntala'`
- `meta.title: 'Shakuntala'`
- `meta.benchmark: 'ELA.10.R.1.1'`
- `meta.benchmarkLabel: 'Literary Elements'`
- `meta.benchmarkDescription: 'Analyze how an author develops and individualizes the responses of characters to situations using literary elements and devices'`
- `meta.days: 4`
- `meta.status: 'live'`

Days 1–4 only. Each day gets:
- `bellringer` with 2 MC + 1 written prompt; each MC choice has `stopLabel`
- `vocab` array (3 words minimum per day)
- `progressItems` (organizer rows with `phase` labels)
- `teacherNotes`
- `esol` (3 tiers)
- `textPassage` (present on Days 1–4)
- `pacingGuide`
- `exitTicket`
- `raceFrames`
- `engageActivities` (≥ 1 per day)

`assessment.achievementLevels` for ELA.10.R.1.1 (similar to AliCogia but Shakuntala-specific descriptors).

`downloads: []` (PDF upload handled separately).

- [ ] **Step 2: Verify `meta.days: 4`** and that no Day 5/6 keys exist in the `days` object.

- [ ] **Step 3: Commit**
```bash
git add units/shakuntala/data.js
git commit -m "feat(D2): build Shakuntala unit data.js from source materials"
```

---

### Task 8: Copy source files and update units-registry.js — Shakuntala

**Files:**
- Modify: `units-registry.js`
- Create: `units/shakuntala/downloads/` (folder)

- [ ] **Step 1: Create the downloads folder and copy source PDFs:**
```bash
mkdir -p /Users/alexanderburger/Desktop/ir-platform/units/shakuntala/downloads
# Copy any PDF or student packet files from the source directory:
cp ~/Documents/Teaching/Units/Shakuntala-Unit/*.pdf /Users/alexanderburger/Desktop/ir-platform/units/shakuntala/downloads/ 2>/dev/null || true
```

- [ ] **Step 2: Find the Shakuntala entry** in `units-registry.js`.

- [ ] **Step 3: Update the Shakuntala registry entry:**
  - `status: 'coming-soon'` → `status: 'live'`
  - `days: 6` → `days: 4` (Shakuntala is a 4-day test prep unit)

- [ ] **Step 4: Verify secondary benchmarks** for Shakuntala are noted. The spec lists `ELA.10.R.1.1 · ELA.10.R.1.3 · ELA.10.R.3.1`. The registry `benchmark` field holds the primary (`ELA.10.R.1.1`). If the registry has a `benchmarks` array or similar field, add R.1.3 and R.3.1 there. If not, add a comment in `data.js` meta: `// Additional benchmarks: ELA.10.R.1.3, ELA.10.R.3.1`.

- [ ] **Step 5: Commit**
```bash
git add units-registry.js units/shakuntala/downloads/
git commit -m "feat(D2): mark Shakuntala live, correct days:4, copy downloads"
```

---

## Chunk 3: D3 — Bloomers Unit

### Task 9: Read Bloomers source files

**Files:**
- Read PDF: `~/Documents/Teaching/Units/BlueJeans-Unit/Bloomers Blue Jeans.pdf` (primary source — actual text passage)
- Read: `~/Documents/Teaching/Units/BlueJeans-Unit/Unit2_Bloomers_TeacherLessonPlan.md` (daily structure, scaffolds, RACE frames)

- [ ] **Step 1: Read the PDF first.** The PDF contains the actual source text ("Corsets, Bloomers, and Blue Jeans"). Extract the full passage paragraph-by-paragraph — this becomes `textPassage.paragraphs` in `data.js`.

- [ ] **Step 2: Read the teacher lesson plan.** Extract:
  - Daily learning objectives
  - Vocabulary words (avant-garde, accentuated, renouncing + any others per day)
  - Bellringer MC questions per day
  - Organizer rows per day
  - RACE frames per day
  - Exit ticket prompts
  - ESOL scaffolds and word banks

Note: This is an informational text — benchmarks ELA.10.R.2.1 (Central Idea) and ELA.10.R.2.2 (Text Structure). Organizer rows should reflect central idea analysis, not literary elements.

---

### Task 10: Write units/bloomers/data.js

**Files:**
- Modify: `units/bloomers/data.js` (replace stub content)

- [ ] **Step 1: Write the full `UNIT` object** following the same schema as D2.

Key differences from Shakuntala:
- `meta.id: 'bloomers'`
- `meta.title: 'Corsets, Bloomers & Blue Jeans'`
- `meta.benchmark: 'ELA.10.R.2.1'` (primary)
- `meta.benchmarkLabel: 'Central Idea'`
- `meta.benchmarkDescription: 'Analyze how an author develops and refines a central idea over the course of a text'`
- `meta.days: 4`
- `meta.status: 'live'`

Writing framework is **RACE** (not CER). `raceFrames` should reflect central idea analysis:
```js
raceFrames: {
  task: 'Write a RACE response explaining how the author develops the central idea in this passage.',
  restate: 'The author develops the central idea that...',
  answer: 'Specifically, the author shows that ___ by...',
  cite: 'For example, in paragraph ___, the text states, "..."',
  explain: 'This evidence supports the central idea because...'
}
```

`assessment.achievementLevels` should reflect ELA.10.R.2.1 (central idea), not literary elements.

- [ ] **Step 2: Verify all 4 days are present** and schema-complete.

- [ ] **Step 3: Commit**
```bash
git add units/bloomers/data.js
git commit -m "feat(D3): build Bloomers unit data.js from source materials"
```

---

### Task 11: Copy source files and update units-registry.js — Bloomers

**Files:**
- Modify: `units-registry.js`
- Create: `units/bloomers/downloads/` (folder)

- [ ] **Step 1: Create the downloads folder and copy source PDFs:**
```bash
mkdir -p /Users/alexanderburger/Desktop/ir-platform/units/bloomers/downloads
cp "~/Documents/Teaching/Units/BlueJeans-Unit/"*.pdf /Users/alexanderburger/Desktop/ir-platform/units/bloomers/downloads/ 2>/dev/null || true
```

- [ ] **Step 2: Find the Bloomers entry** in `units-registry.js`.

- [ ] **Step 3: Update the Bloomers registry entry:**
  - `status: 'coming-soon'` → `status: 'live'`
  - `days: 6` → `days: 4`
  - `benchmark` → `'ELA.10.R.2.1'` (correct if wrong)
  - `benchmarkLabel` → `'Central Idea'` (not "Text Structure" — Text Structure belongs to Math Innovations)
  - `title` → `'Corsets, Bloomers & Blue Jeans'` (correct if truncated)

- [ ] **Step 4: Commit**
```bash
git add units-registry.js units/bloomers/downloads/
git commit -m "feat(D3): mark Bloomers live, correct registry fields, copy downloads"
```

---

## Chunk 4: D4 — Math Innovations Unit

### Task 12: Read Math Innovations source files

**Files:**
- Read: `~/Documents/Teaching/Units/MathInnovations-TextStructure/Unit3_MathInnovations_TeacherLessonPlan.md`
- Read PDF: `~/Documents/Teaching/Units/MathInnovations-TextStructure/Math Innovations.pdf` (if readable)

- [ ] **Step 1: Read the teacher lesson plan.** Extract:
  - Text passage ("The Source of Mathematical Innovations")
  - Vocabulary words (immortality, sexagesimal, collective + others)
  - Bellringer MC questions per day
  - Organizer rows per day
  - RACE frames
  - Exit tickets
  - ESOL scaffolds

- [ ] **Step 2: Read the PDF.** Extract the source text passage.

Note: This is informational — benchmarks ELA.10.R.2.2 (Text Structure) and ELA.10.R.2.3. Organizer rows should reflect text structure analysis (compare/contrast, cause/effect, problem/solution, chronological, descriptive).

---

### Task 13: Write units/mathinnovations/data.js

**Files:**
- Modify: `units/mathinnovations/data.js` (replace stub content)

- [ ] **Step 1: Write the full `UNIT` object** following the same schema.

Key differences:
- `meta.id: 'mathinnovations'`
- `meta.title: 'The Source of Mathematical Innovations'`
- `meta.benchmark: 'ELA.10.R.2.2'` (primary)
- `meta.benchmarkLabel: 'Text Structure'`
- `meta.benchmarkDescription: 'Analyze the structure an author uses to organize a text and how it contributes to meaning'`
- `meta.days: 4`
- `meta.status: 'live'`

Writing framework is **RACE**. `raceFrames` should reflect text structure analysis:
```js
raceFrames: {
  task: 'Write a RACE response explaining how the author\'s use of text structure contributes to meaning.',
  restate: 'The author uses ___ text structure to organize this passage.',
  answer: 'Specifically, the author structures the text to show...',
  cite: 'For example, in paragraph ___, the text states, "..."',
  explain: 'This structure helps the reader understand the central idea because...'
}
```

`assessment.achievementLevels` should reflect ELA.10.R.2.2 (text structure analysis).

- [ ] **Step 2: Verify all 4 days are present** and schema-complete.

- [ ] **Step 3: Commit**
```bash
git add units/mathinnovations/data.js
git commit -m "feat(D4): build Math Innovations unit data.js from source materials"
```

---

### Task 14: Copy source files and update units-registry.js — Math Innovations

**Files:**
- Modify: `units-registry.js`
- Create: `units/mathinnovations/downloads/` (folder)

- [ ] **Step 1: Create the downloads folder and copy source PDFs:**
```bash
mkdir -p /Users/alexanderburger/Desktop/ir-platform/units/mathinnovations/downloads
cp "~/Documents/Teaching/Units/MathInnovations-TextStructure/"*.pdf /Users/alexanderburger/Desktop/ir-platform/units/mathinnovations/downloads/ 2>/dev/null || true
```

- [ ] **Step 2: Find the Math Innovations entry** in `units-registry.js`.

- [ ] **Step 3: Update the Math Innovations registry entry:**
  - `status: 'coming-soon'` → `status: 'live'`
  - `days: 6` → `days: 4`
  - `benchmark` → `'ELA.10.R.2.2'` (correct if it shows `ELA.10.R.2.1`)
  - `benchmarkLabel` → `'Text Structure'`

- [ ] **Step 4: Final commit and push**
```bash
git add units-registry.js units/mathinnovations/downloads/
git commit -m "feat(D4): mark Math Innovations live, correct registry fields, copy downloads"
git push origin main
```

- [ ] **Step 5: Verify on GitHub Pages**
  - AliCogia unit: all 6 days show new schema fields (STOP overlay on MC, ESOL level toggle cycles 3 tiers, pacing guide shows correct times, exit ticket shows prompt)
  - Shakuntala, Bloomers, Math Innovations: home page cards show `status: live` (no "coming soon" badge); click through shows real content
