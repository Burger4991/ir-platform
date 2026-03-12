# IR Platform Upgrade — Design Spec

**Date:** 2026-03-12
**Status:** Approved for planning

---

## Overview

The IR Platform launches at https://burger4991.github.io/ir-platform/ with one live unit (AliCogia, ELA.10.R.1.1) and 23 stubs. This spec covers all planned upgrades across five phases, each independently shippable.

---

## Phase A — Visual Redesign

### Goal
Replace the current 3-theme system with 6 visually distinctive themes. Make EdTech the default. Polish UX/UI across home page and unit pages.

### Themes

Each theme has a distinct visual *personality* — not just a color swap. Differences include card style, background treatment, tab style, and border approach.

| Theme | Personality | Card Style | Background | Tab Style |
|-------|-------------|------------|------------|-----------|
| **EdTech** (default) | Clean SaaS | White, soft purple shadow, rounded | Soft lavender (`#f4f3ff`) | Pill buttons |
| **Midnight** | True dark, premium | Glowing blue borders, dark bg card | Deep blue-black (`#0f1023`) | Pill with glow |
| **Ocean** | Editorial | Bold 4px left-border accent, no shadow | Pale blue (`#f0f9ff`) | Underline tabs |
| **Slate** | Minimal corporate | Top 3px accent bar, hairline border | Near-white (`#f8fafc`) | Boxed tabs |
| **Violet** | Immersive dark gradient | Glassmorphism (rgba bg + blur) | Deep purple gradient | Frosted pills |
| **Azure** | Frosted light gradient | Frosted glass (rgba + blur) | Blue gradient | Solid pills |

### CSS Architecture

- `css/themes.css` — one block per theme with all CSS custom properties
- Theme-specific card treatments applied via `.card` rules scoped to `body.theme-*`
- Glassmorphism themes (Violet, Azure) require `backdrop-filter: blur()` on `.card`
- Default changed from `theme-warm` to `theme-edtech` in `js/theme.js` and all `index.html` files

**New CSS variables added:**
- `--card-radius` — per-theme border radius (8px EdTech, 6px Midnight, 4px Ocean/Slate, 10px Violet/Azure)
- `--card-border-style` — controls left-border vs top-border vs full-border card treatment
- `--bg-gradient` — gradient string for Violet/Azure backgrounds
- `--blur-amount` — backdrop-filter value for glassmorphism themes

**Tab style is implemented via `body.theme-*` scoping on `.day-tab` elements**, not a separate CSS variable:
- EdTech/Midnight/Violet/Azure: `.day-tab { border-radius: 20px; }` (pill)
- Ocean: `.day-tab { border-radius: 0; border-bottom: 2px solid transparent; background: transparent; }` (underline)
- Slate: `.day-tab { border-radius: 4px; border: 1px solid var(--border); }` (boxed)

### UX/UI Polish (all themes)

**Typography:**
- Base font size: 15px (up from implicit browser default)
- Card title: 11px, 700 weight, letter-spacing 1px, uppercase
- Body text: 14px, line-height 1.6
- Passage text: 15px, line-height 1.75 (readability)

**Spacing:**
- Content grid padding: 20px (desktop), 12px (mobile)
- Card gap: 16px
- Card padding: 20px

**Transitions:**
- All interactive elements: `transition: 150ms ease`
- Card hover: subtle translateY(-2px) + shadow lift
- Button active: scale(0.97)

**Home Page:**
- Hero section: larger heading, unit count stat, cleaner layout
- Unit cards: show benchmark category color, cleaner description truncation
- Filter bar: pill-style active state per theme
- Empty state: improved illustration + message

**Unit Page:**
- Day tabs: theme-aware styling (pills/underlines/boxed per theme, see above)
- Section header (unit title/benchmark): tighter, more visual hierarchy
- Footer prev/next: styled as actual nav buttons

### Files Changed
- `css/themes.css` — full rewrite (6 themes)
- `css/main.css` — polish pass (typography, spacing, transitions, home, tabs)
- `js/theme.js` — default changed to `edtech`
- `units/alicogia/index.html` — `class="theme-edtech"` on body
- `index.html` — `class="theme-edtech"` on body

---

## Phase B — Units Batch

### Goal
Generate all 23 stub unit folders so every home page card links to a real page. No dead links.

### Structure per unit

```
units/{id}/
  index.html   — identical shell to alicogia/index.html
  data.js      — minimal stub UNIT object
```

### Stub data.js shape

The `days` count and `benchmarkDescription` are pulled from the matching entry in `units-registry.js`, not hardcoded. The stub generator reads the registry to produce the correct value per unit.

```js
const UNIT = {
  meta: {
    id: '{id}',                          // from registry
    title: '{title}',                    // from registry
    benchmark: '{benchmark}',            // from registry
    benchmarkLabel: '{benchmarkLabel}',  // from registry
    benchmarkDescription: '',            // empty until Phase D fills it
    days: {days},                        // from registry.days (4 or 6)
    status: 'coming-soon'
  },
  days: {
    // generated for 1..{days}:
    1: { label: 'Day 1', progressItems: [], pacingGuide: {}, exitTicket: null, engageActivities: [] },
    // ...
  },
  assessment: {
    achievementLevels: []  // empty until Phase D fills it
  },
  downloads: []
};
```

### Coming-soon page behavior
- `cards.js` detects `UNIT.meta.status === 'coming-soon'`
- Renders a single full-width placeholder card: unit title, benchmark, "Content coming soon" message
- All toolbar features still work (timer, projection, themes)
- Day tabs rendered but content shows placeholder on all days

### Units to generate (23)
Pulled from `units-registry.js`. All 23 non-alicogia entries.

### Files Changed
- `units/{id}/index.html` — 23 new files
- `units/{id}/data.js` — 23 new files
- `js/cards.js` — add coming-soon detection + placeholder render

---

## Phase C — Platform Features + Toolbar Overhaul

### Goal
Redesign the toolbar using Option B (grouped icon+label buttons) and add all new classroom features.

### Toolbar Layout (Option B — Grouped)

Each group is a `<div class="tool-group">` with `border: 1px solid var(--border)` and `border-radius: 8px`. Each button is `<button class="tool-btn">` with icon on top, label below (flex-direction: column).

```
[Timer Group] [View Group] [Content Group] [Writing Group] [CUBES Group] [STOP] [Tools Group] [Progress] [Engage] [Downloads]
```

**Timer Group** — `<div class="tool-group" id="group-timer">`
- `<span id="timer-value">` — monospace 18px time display
- `#timer-play` — Play/Pause
- `#timer-reset` — Reset
- `#timer-edit` — Edit duration
- `#timer-presets` — dropdown button: 2 / 3 / 5 / 8 / 12 min. On select: sets `totalSeconds`, resets, starts countdown.

**View Group** — `<div class="tool-group" id="group-view">`
- `#btn-projection` — Projection (P key shortcut)
- `#btn-spotlight` — Spotlight
- `#btn-font` — Font size (Aa, cycles 3 levels)
- `#btn-focus` — Focus Mode (new)

**Content Group** — `<div class="tool-group" id="group-content">`
- `#btn-teacher-view` — Teacher View (T key, default active)
- `#btn-reveal` — Reveal Answers
- `#btn-esol` — ESOL Level (cycles: Off → L1–2 → L3–4 → L5 → Off; stores level as `0|1|2|3`)
- `#btn-benchmark-banner` — Benchmark Banner
- `#btn-gr-phase` — GR Phase Badge

**Writing Group** — `<div class="tool-group" id="group-writing">`
- `#btn-race` — RACE/ACE Panel
- `#btn-achievement` — Achievement Level Ladder

**CUBES Group** — `<div class="tool-group" id="group-cubes">`
- `#btn-cubes-c` — Circle mode
- `#btn-cubes-u` — Underline mode
- `#btn-cubes-b` — Box mode
- `#btn-cubes-e` — Eliminate mode (applies CSS strikethrough to clicked `.mc-choice` elements)
- `#btn-cubes-s` — Star stamp
- `#btn-clear-annotations` — Clear all

**STOP Group** — `<div class="tool-group" id="group-stop">`
- `#btn-stop` — STOP Mode toggle

**Tools Group** — `<div class="tool-group" id="group-tools">`
- `#btn-vocab-ref` — Vocab Quick Reference flyout
- `#btn-exit-ticket` — Exit Ticket Mode
- `#btn-read-aloud` — Read Aloud (browser TTS)
- `#btn-dyslexia` — Dyslexia Font
- `#btn-high-contrast` — High Contrast
- `#btn-line-numbers` — Passage Line Numbers
- `#btn-print` — Print/PDF

**Progress** — `#btn-progress` (standalone, not grouped)

**Engage** — `#btn-engage` (standalone, opens full-screen overlay)

**Downloads** — `#btn-downloads` (standalone, right-aligned)

---

### STOP Mode — Implementation Detail

MC answer choices in `data.js` use this shape:
```js
{ text: 'The merchant values...', isCorrect: false, stopLabel: 'Silly' }
```

`cards.js` renders each MC choice as:
```html
<div class="mc-choice" data-stop-label="Silly">
  <span class="mc-letter">A</span>
  <span class="mc-text">The merchant values...</span>
  <span class="stop-badge" style="display:none">Silly</span>
</div>
```

When `#btn-stop` is active, `body.stop-mode` class is added. CSS rule:
```css
body.stop-mode .stop-badge { display: inline-block; }
```

STOP mode works on all `.mc-choice` elements anywhere on the page — bellringer, passage questions, assessment MC — because they all use the same class and data attribute.

---

### Sidebar Navigation — Implementation Detail

Replaces `.day-tabs` div entirely. New HTML in `index.html`:

```html
<div class="sidebar" id="sidebar">
  <div class="sidebar-unit-title" id="sidebar-unit-title"></div>
  <nav class="sidebar-days" id="sidebar-days"></nav>
  <div class="sidebar-cards" id="sidebar-cards"></div>
  <button class="sidebar-toggle" id="sidebar-toggle">‹</button>
</div>
<div class="content-area" id="content-area">
  <div class="content-grid" id="content-grid"></div>
</div>
```

`nav.js` rewrites:
- Removes `.day-tabs` build logic
- Builds `#sidebar-days` with `<button class="sidebar-day-btn" data-day="N">Day N</button>` per day
- `switchDay(day)` updates `window.currentDay = day` (exposed as global for QR, toolbar access)
- `#sidebar-cards` populated with card jump links after `renderDayContent` runs
- `#sidebar-toggle` collapses sidebar: `sidebar.classList.toggle('collapsed')`

CSS: sidebar width 220px, `content-area` has `margin-left: 220px` (or 0 when collapsed).

`window.currentDay` replaces the module-scoped `let currentDay` — exposed so `toolbar.js`, `engage.js`, and QR generator can read it.

---

### ESOL Level Selector — Data Schema

`data.js` ESOL shape (replaces current flat array format):

```js
esol: {
  l12: {
    frames: [
      'The author shows ___ when ___.',
      'This is an example of ___ because ___.'
    ],
    wordBank: ['character', 'conflict', 'resolution', 'evidence']
  },
  l34: {
    frames: [
      'The author develops ___ by showing ___.',
      'This literary element ___ is significant because ___.'
    ],
    wordBank: []
  },
  l5: {
    frames: [
      'Analyze how the author uses ___ to develop ___.'
    ]
  }
}
```

`cards.js` `buildEsolCard()` reads `UNIT.days[day].esol[level]` based on current ESOL level state (`'l12'|'l34'|'l5'`). When ESOL is Off, card is hidden as before.

**Migration from current format:** Current `esol: { frames: [...], wordBank: [...] }` in AliCogia is treated as `l34` equivalent. Phase D1 expands all 6 days to full 3-tier format.

---

### RACE/ACE Panel — Data Schema

```js
// Per day in data.js:
raceFrames: {
  task: 'Write a constructed response explaining how the author develops Ali Cogia as a character.',
  restate: 'The author develops Ali Cogia as a character by...',
  answer: 'Specifically, the author shows that Ali Cogia is ___ when...',
  cite: 'For example, in paragraph ___, the text states, "..."',
  explain: 'This evidence shows that Ali Cogia is ___ because...'
}
```

RACE/ACE panel reads `UNIT.days[window.currentDay].raceFrames`.

---

### Achievement Level Ladder — Data Schema

```js
// In UNIT.assessment:
achievementLevels: [
  { level: 2, label: 'Approaching', descriptor: 'Identifies a literary element with minimal textual support.' },
  { level: 3, label: 'Meets',       descriptor: 'Explains how a literary element contributes to meaning using relevant evidence.' },
  { level: 4, label: 'Exceeds',     descriptor: 'Analyzes the relationship between multiple literary elements and overall theme with precise evidence.' },
  { level: 5, label: 'Mastery',     descriptor: 'Evaluates the author\'s deliberate craft choices and their cumulative effect on meaning and reader interpretation.' }
]
```

---

### Additional Features

**Focus Mode**
- `#btn-focus` in View group
- When active, all `.card` elements get `display:none` except the one that currently has mouse focus or was last clicked
- Click any card to bring it into focus
- `body.focus-mode` class; CSS: `.focus-mode .card { display:none } .focus-mode .card.in-focus { display:block }`

**Split-Screen Mode**
- Toolbar toggle: adds `body.split-screen` class
- CSS: `#content-grid` switches to `grid-template-columns: 1fr 1fr`; `.card-passage` and `.card-organizer` span full height
- Only meaningful on days with both passage and organizer; toolbar button disabled on days without

**Print / PDF Mode**
- `window.print()` triggered by `#btn-print`
- `@media print` CSS in `main.css`: hides `.toolbar`, `.nav`, `.footer`, `.sidebar`, `#timer-overlay`, `.annotation-toolbar`
- Cards render as clean blocks, page-break-inside: avoid

**Student-Safe URL** (`?mode=student`)
- `nav.js` checks `new URLSearchParams(location.search).get('mode') === 'student'` on load
- If true: adds `body.student-mode` class, sets `window.studentMode = true`
- CSS: `.student-mode .toolbar { display:none }` + `.student-mode .teacher-only-hidden { display:none }`
- QR code button calls `generateStudentQR(window.currentDay)` — builds URL with `?mode=student&day=N`

**QR Code Generator**
- Loads `qrcode.min.js` from CDN (`https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js`) on first use
- Renders QR into `<div id="qr-modal">` overlay
- URL: `${location.origin}${location.pathname}?mode=student&day=${window.currentDay}`
- Auto-closes after 30 seconds via `setTimeout`
- `window.currentDay` used for day param (see Sidebar Navigation section)

**Pacing Guide Overlay**
- `#btn-pacing` in Tools group opens small panel near timer
- Reads `UNIT.days[window.currentDay].pacingGuide`
- Displays as a small table: Activity | Minutes
- `pacingGuide` keys: `bellringer`, `vocab`, `organizer`, `teacher`, `passage`
- (No separate `esol` key — ESOL scaffolds are embedded within organizer time)

**Center Rotation Timer Presets**
- Dropdown within Timer group: `<select id="timer-presets"><option value="120">2 min</option>...`
- On change: `totalSeconds = value; remaining = value; stop(); start()`

**Vocab Flashcard Mode**
- `#btn-vocab-ref` opens fullscreen `.flashcard-overlay`
- Reads `UNIT.days[window.currentDay].vocab` array
- State: `currentCard = 0`, `flipped = false`
- Space: flip card (show definition + example); ArrowRight/ArrowLeft: advance/back
- Click card: flip

**Passage Line Numbers**
- `#btn-line-numbers` toggles `body.line-numbers` class
- CSS: `body.line-numbers .passage-para { counter-increment: line-num; } body.line-numbers .passage-para::before { content: counter(line-num); ... }`
- `#passage-text` gets `counter-reset: line-num` in base CSS

**Dyslexia Font Toggle**
- `#btn-dyslexia` first click: injects `<link>` to OpenDyslexic CDN font; adds `body.dyslexia-font`
- CSS: `body.dyslexia-font, body.dyslexia-font * { font-family: 'OpenDyslexic', sans-serif !important; }`

**High Contrast Mode**
- `body.high-contrast` class
- CSS: `--bg-page: #000; --bg-card: #000; --text-primary: #fff; --border: #fff; --accent: #ff0;` etc.

**GR Phase Badge**
- `#btn-gr-phase` in Content group cycles: `['I Do', 'We Do', 'You Do w/ Partner', 'You Do', '']`
- Renders as floating badge: `<div id="gr-badge" class="gr-badge">I Do</div>` positioned fixed bottom-right
- Badge hidden when empty string
- `nav.js` `switchDay()` resets GR phase to `'I Do'`

**Benchmark Objective Banner**
- `#btn-benchmark-banner` toggles `<div id="benchmark-banner" class="benchmark-banner">` below nav
- Text: `Today's Focus: ${UNIT.meta.benchmark} — ${UNIT.meta.benchmarkDescription}`
- Dismissable via ✕ button on banner

**Exit Ticket Mode**
- `#btn-exit-ticket` opens fullscreen overlay
- Reads `UNIT.days[window.currentDay].exitTicket`: `{ prompt: '...', frame: '...' }`
- Shows prompt + frame prominently; includes timer (default 5 min)
- `body.student-mode`: hides writing frame, shows only prompt (display-only for students)

**Read Aloud**
- Uses `window.speechSynthesis` (built into all modern browsers, no CDN)
- `#btn-read-aloud`: reads `UNIT.days[window.currentDay].textPassage.paragraphs` joined with spaces
- Toggle stops/starts; highlights `.passage-para` as each is read via `onboundary` event

### Files Changed
- `js/toolbar.js` — full rewrite (grouped layout, all new features)
- `js/annotations.js` — CUBES tool modes replace color picker
- `js/cards.js` — STOP overlay, ESOL level display, coming-soon, Focus Mode targeting
- `js/nav.js` — sidebar replaces tabs, `window.currentDay` exposed
- `js/engage.js` — new file (Phase E)
- `css/main.css` — all new component styles (sidebar, groups, panels, overlays, print, student-mode)
- `units/alicogia/index.html` — new toolbar HTML, sidebar HTML, remove `.day-tabs`
- `units/alicogia/data.js` — add `pacingGuide`, `exitTicket`, `raceFrames`, `benchmarkDescription`, ESOL tiers, STOP labels per MC choice
- All `units/{id}/index.html` from Phase B — updated with new toolbar + sidebar structure

---

## Phase D — Content

### D1 — AliCogia Content Alignment Audit

Before building new units, audit and complete the AliCogia `data.js` for full Phase C/E compatibility. AliCogia is the reference unit — it must be schema-complete before other units are templated.

**Schema additions required:**

```js
// meta additions:
benchmarkDescription: 'Analyze how an author develops and individualizes the responses of characters to situations using literary elements and devices'

// Per day additions:
pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 10 }
exitTicket: { prompt: 'How does the author use [element] to develop Ali Cogia?', frame: 'The author develops Ali Cogia by...' }
raceFrames: { task: '...', restate: '...', answer: '...', cite: '...', explain: '...' }
engageActivities: [ ... ]  // see Phase E schema

// ESOL — migrate from flat format to 3-tier:
esol: {
  l12: { frames: [...], wordBank: [...] },
  l34: { frames: [...], wordBank: [] },
  l5:  { frames: [...] }
}

// Per MC question in bellringer.questions[]:
stopLabel: 'Tricky'  // Silly | Tricky | Opposite | Proven

// Per organizer row — confirm GR phase:
phase: 'I Do' | 'We Do' | 'You Do w/ Partner' | 'You Do'

// assessment additions:
achievementLevels: [
  { level: 2, label: 'Approaching', descriptor: '...' },
  { level: 3, label: 'Meets',       descriptor: '...' },
  { level: 4, label: 'Exceeds',     descriptor: '...' },
  { level: 5, label: 'Mastery',     descriptor: '...' }
]
```

**Content alignment checklist per day:**
- [ ] Bellringer: 2 MC + 1 written prompt, each MC has `stopLabel`
- [ ] Vocab: 3 words with definition, example sentence, text context quote
- [ ] Organizer: 4 rows with correct `phase` labels, I Do pre-filled with real evidence quote
- [ ] Teacher notes: substantive (not placeholder text)
- [ ] ESOL: all 3 tiers present (L1–2 with wordBank, L3–4, L5)
- [ ] Passage: present Days 1–4, absent Days 5–6
- [ ] `pacingGuide` set per day
- [ ] `exitTicket` set per day
- [ ] `raceFrames` set per day
- [ ] `engageActivities` ≥ 1 activity per day
- [ ] `achievementLevels` defined in `assessment`

### D2 — Shakuntala Unit

| Field | Value |
|-------|-------|
| **ID** | `shakuntala` |
| **Title** | Shakuntala |
| **Text** | "Shakuntala" by Kālidāsa (Excerpts from Acts IV & V) |
| **Type** | Literary — Classical Sanskrit Drama |
| **Days** | 4 (test prep unit) |
| **Benchmarks** | ELA.10.R.1.1 · ELA.10.R.1.3 · ELA.10.R.3.1 |
| **Writing** | CER (Claim-Evidence-Reasoning) |
| **Annotation** | CUBES |
| **Vocab** | wistfulness · reverence · presentment |
| **Source files** | `~/Documents/Teaching/Units/Shakuntala-Unit/` |
| **Key source** | `Shakuntala_D1-4_TestPrep_Interactive_v9.html` + `Unit2_Shakuntala_TeacherLessonPlan.md` |

**Note:** 4-day unit — `UNIT.meta.days = 4`. Platform supports variable day count via `nav.js`. No Day 5–6.

### D3 — Corsets, Bloomers & Blue Jeans Unit

| Field | Value |
|-------|-------|
| **ID** | `bloomers` |
| **Title** | Corsets, Bloomers & Blue Jeans |
| **Text** | "Corsets, Bloomers, and Blue Jeans" |
| **Type** | Informational — Historical Analysis |
| **Days** | 4 (test prep unit) |
| **Benchmarks** | ELA.10.R.2.1 · ELA.10.R.2.2 |
| **Writing** | RACE |
| **Vocab** | avant-garde · accentuated · renouncing |
| **Source files** | `~/Documents/Teaching/Units/BlueJeans-Unit/` |
| **Key source** | `Bloomers Blue Jeans.pdf` + `Unit2_Bloomers_TeacherLessonPlan.md` |

### D4 — Math Innovations Unit

| Field | Value |
|-------|-------|
| **ID** | `mathinnovations` |
| **Title** | The Source of Mathematical Innovations |
| **Text** | "The Source of Mathematical Innovations" |
| **Type** | Informational — Historical Analysis |
| **Days** | 4 (test prep unit) |
| **Benchmarks** | ELA.10.R.2.2 · ELA.10.R.2.3 |
| **Writing** | RACE |
| **Vocab** | immortality · sexagesimal · collective |
| **Source files** | `~/Documents/Teaching/Units/MathInnovations-TextStructure/` |
| **Key source** | `Math Innovations.pdf` + `Unit3_MathInnovations_TeacherLessonPlan.md` |

### Process per unit (D2–D4)
1. Extract content from source HTML/MD/PDF into `data.js` following AliCogia schema
2. Use 4-day schema (days 1–4 only)
3. Copy downloads (PDF + student packet) to `units/{id}/downloads/`
4. Add `engageActivities`, `pacingGuide`, `exitTicket`, `raceFrames` per day
5. Add ESOL frames at all 3 tiers with word banks for L1–2
6. Add STOP labels to all MC answer choices
7. Add `achievementLevels` to `assessment`
8. Update `units-registry.js` status to `live`
9. Update the stub `data.js` created in Phase B with full content

---

## Phase E — Engagement & Formative Assessment (Display-Only)

### Goal
Add a dedicated **Engage panel** for teacher-driven in-class formative assessment. No student devices, no backend. Teacher projects on screen; students respond by hand signal, whiteboard, or verbal. Teacher taps to record and display live results.

### Toolbar Entry Point
Single `#btn-engage` button (standalone, not grouped) opens a full-screen `.engage-overlay`. All other toolbar buttons remain accessible; overlay has its own close button.

### Activity Types

**1. Poll (Multiple Choice)**
- Question + 2–5 answer choice tiles (large, projected-friendly)
- Teacher taps each tile to increment count; animated CSS bar chart builds live
- "Reveal answer" button highlights correct choice
- Data source: `engageActivities[n]` where `type === 'poll'`

**2. Rating Scale**
- Prompt + row of number buttons (1–5 or 1–10 per `scale` field)
- Teacher taps each number as students raise hands
- Bar chart shows distribution

**3. Binary Choice**
- Two large buttons (`optionA` / `optionB`)
- Teacher taps each; split percentage displayed as two-bar chart

**4. Fillable Response Display**
- Full-screen prompt + optional RACE frame (`raceFrames.task` from current day)
- Timer runs (default 5 min, editable)
- No data collection — display only
- Data source: `engageActivities[n]` where `type === 'fillable'`

**5. Think-Pair-Share Timer**
- Three configurable phases: Think → Pair → Share
- Each phase displays prominently with large label
- Sound cue on phase transition: Web Audio API tone (same approach as existing `timer.js` alarm — `AudioContext`, oscillator, 0.3s fade)
- Data source: `engageActivities[n]` where `type === 'tps'`

### Data Storage
Result counts stored in `sessionStorage` only (cleared on page close). Key: `ir-engage-{unitId}-day{N}-activity{i}`.

### Full `engageActivities` Data Schema

```js
engageActivities: [
  {
    type: 'poll',
    question: 'Which evidence best supports the theme?',
    choices: ['A. "He walked away..."', 'B. "She never returned..."', 'C. "The door remained..."'],
    correct: 'B'
  },
  {
    type: 'rating',
    prompt: 'How confident are you identifying the theme? (1 = not sure, 5 = very confident)',
    scale: 5
  },
  {
    type: 'binary',
    prompt: 'Is this strong or weak evidence?',
    optionA: 'Strong',
    optionB: 'Weak'
  },
  {
    type: 'fillable',
    prompt: 'Using evidence from the text, explain how the author develops Ali Cogia as a character.',
    useRaceFrame: true   // if true, shows raceFrames.task + sentence starters alongside prompt
  },
  {
    type: 'tps',
    prompt: 'What literary element does the author use most effectively, and why?',
    thinkSeconds: 60,
    pairSeconds: 120,
    shareSeconds: 0   // 0 = open-ended (no countdown for share phase)
  }
]
```

### Files Changed
- `js/engage.js` — new file, all Engage panel logic
- `css/main.css` — Engage overlay styles
- `units/alicogia/index.html` — `#btn-engage` added to toolbar
- All `units/{id}/index.html` from Phase B — `#btn-engage` included in toolbar shell
- `units/alicogia/data.js` — `engageActivities` added per day
- All `units/{id}/data.js` from Phase B — `engageActivities: []` stub field included

---

## Phase F — Live Polling (Future)

Deferred. Requires Firebase or Supabase account setup (~15 min one-time setup). Will add:
- Google Forms QR integration for writing submissions
- Live MC polling with real-time results on teacher screen
- Student device response via unique session URL

---

## Implementation Order

```
Phase A → Phase B → Phase C → Phase D1 → Phase D2–D4 → Phase E → Phase F (future)
```

- **A before B:** stub templates need the EdTech default and updated HTML shell
- **B before C:** Phase C rewrites toolbar HTML in all unit `index.html` files — must exist first
- **C before D1:** D1 fills Phase C schema fields (`pacingGuide`, `raceFrames`, ESOL tiers, etc.) — schema must be defined in code first
- **D1 before D2–D4:** AliCogia is the reference schema; D2–D4 are templated from it
- **C before E:** Engage panel uses toolbar infrastructure and `window.currentDay`
- **D before E content:** `engageActivities` in data.js filled during D, used by E
