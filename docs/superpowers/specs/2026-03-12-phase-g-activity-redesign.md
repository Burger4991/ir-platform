# Phase G — Activity-First Unit Redesign

## Goal

Replace the expand/collapse card grid with an activity-sequence layout that turns each day into an ordered set of interactive exercises. Students interact with content at the board using strategy tools (STOP, CUBES, RACE, CER). Teacher controls pacing and strategy activation from the toolbar.

## Design Decisions (Approved)

- **Layout:** Vertical scroll. All activities stacked in GR order, always expanded. No click-to-open.
- **Passage:** Slide-out drawer from right edge. Always accessible on every day of the unit.
- **Focus Mode:** Click "⊡ Focus" on any activity card → that activity fills the content area, others hidden. Step-through navigation inside. Escape or "Back to Day" returns to scroll.
- **No Split Screen:** Removed entirely.
- **Strategy Layer:** STOP / CUBES / RACE / CER activated from toolbar at any time. Independent toggles. Work in both scroll view and focus mode.
- **GR Phase Badge:** Visible on every activity card and inside focus mode.
- **Toolbar:** Collapsed into group buttons that open popover panels. Minimal top-level button count.
- **Stack:** Vanilla JS only. No framework migration.

---

## Architecture

### Adapter Pattern (no data migration)

Existing `data.js` files keep their current schema. A new `js/activities.js` file adapts the schema into an ordered activity array at render time — no changes to any unit's `data.js`.

```
data.js (unchanged schema)
    ↓
buildActivities(dayData) in activities.js
    ↓
ordered Activity[] array
    ↓
renderActivities() in cards.js (rewritten)
    ↓
DOM — vertical scroll of .activity elements
```

**Activity types produced by the adapter — full mapping:**

| Type | Source field | GR phase | Notes |
|------|-------------|----------|-------|
| `mc` | `bellringer.questions[i]` | `we-do` | One activity per question |
| `organizer-row` | `organizer.rows[i]` | Mapped from `row.label` (see below) | One activity per row |
| `vocabulary` | `vocabulary[i]` | `we-do` | One activity per word; ESOL frame attached |
| `written-response` | `raceFrames` | `you-do` | Only created if `raceFrames` exists; framework always `'race'` from current data |
| `passage-annotation` | `textPassage` | `i-do` | Only created if `textPassage` exists on the day |

**GR phase mapping from `row.label`:**

| row.label value | grPhase |
|----------------|---------|
| `'I Do'` | `'i-do'` |
| `'We Do'` | `'we-do'` |
| `'You Do w/ Partner'` | `'you-do-partner'` |
| `'You Do'` | `'you-do'` |

**Fields NOT converted to activities — handled separately:**

| Field | How it works in Phase G |
|-------|------------------------|
| `teacherNotes` | Rendered as a non-activity teacher-only block at the bottom of the day's activity list. Hidden unless `body.teacher-view` active. Not focusable. |
| `progressItems` | Powers the Progress panel (toolbar → popover → Progress checklist). Unchanged. |
| `pacingGuide` | Powers the Pacing Guide slide panel (toolbar → Tools popover → Pacing). Unchanged. |
| `exitTicket` | Powers the Exit Ticket overlay (toolbar → Tools popover → Exit Ticket). Unchanged. |
| `engageActivities` | Powers the Engage overlay (`js/engage.js`). Unchanged. The Engage button remains top-level or in the toolbar — not rendered as activities in the scroll. |
| `esol` | Passed into each `vocabulary` activity's data payload as `esolFrames: dayData.esol`. The vocabulary renderer uses `window.currentEsolLevel` to pick the correct tier, same as before. |

**CER framework:** No unit currently has CER-format data. The `written-response` activity type always uses `framework: 'race'` from the adapter. The CER toolbar toggle changes how the frame is *displayed* (as Claim / Evidence / Reasoning labels instead of Restate / Answer / Cite / Explain) — it does not require a separate data field. Both frameworks use the same underlying `raceFrames` data.

### Focus Mode

`window.currentFocusId = null` tracks state. When a user clicks `⊡ Focus` on activity `N`:
- `window.currentFocusId` set to that activity's id
- All `.activity` elements get `display:none` via `.activity-dimmed`
- Target activity gets `.activity-focused` (positioned to fill `.content-area`, `z-index: 50`)
- `body.focus-mode` class added
- `js/focus.js` initializes step-through for that activity's type

**`.activity-dimmed` uses `display:none`** (not opacity) to prevent layout issues and preserve scroll position on exit. On exit, all `.activity-dimmed` elements restore to `display:block`, `.activity-focused` removed, `body.focus-mode` removed.

**Toolbar-level Focus button** (`#btn-focus`): Enters focus mode on the first `.activity` element currently intersecting the viewport (use `IntersectionObserver` or `getBoundingClientRect()` to find topmost visible activity). This gives teachers a quick "zoom into whatever's on screen" shortcut without clicking on a specific activity card.

### Passage Drawer

Fixed-position panel, right edge, `width: 480px`, `transform: translateX(100%)` when closed, `transform: translateX(0)` when open. Transition: `transform 0.25s ease`. Toggle class `.passage-drawer--open` on the drawer element itself.

**When there is no `textPassage` on the current day:** The drawer tab remains visible but opens to a message: "No passage for this day." The passage button in the Content popover is not disabled — teacher may still open the drawer. The `passage-annotation` activity type is simply not created by the adapter for that day.

**CUBES inside the drawer:** `js/annotations.js` is currently written as an IIFE targeting `#annotation-canvas` globally. Phase G adds a second canvas `#passage-drawer-canvas` inside the drawer. `annotations.js` is modified to accept a target canvas ID. `window.initAnnotations(canvasId)` is called once for the global canvas (on page load) and once for the drawer canvas (when the drawer first opens). CUBES tool state is shared (same active tool, same colors) but drawings are separate per canvas.

---

## File Structure

| File | Change |
|------|--------|
| `js/activities.js` | **New** — `buildActivities(dayData)` returns Activity[] |
| `js/focus.js` | **New** — Focus Mode: enter/exit, step-through per type, keyboard |
| `js/cards.js` | **Rewrite** — replace card factory with `renderActivities(day)` |
| `js/annotations.js` | **Modify** — accept target canvas ID; expose `window.initAnnotations(canvasId)` |
| `css/main.css` | **Modify** — remove card styles; add activity, focus, drawer, popover styles |
| `js/toolbar.js` | **Modify** — popover groups; add CER toggle; remove Split Screen |
| `units/alicogia/index.html` | **Modify** — add passage drawer HTML; remove split-screen button; add drawer canvas |
| `scripts/generate-stubs.js` | **Modify** — propagate new HTML to all unit pages |

---

## Activity Schema (internal, built by adapter)

```js
{
  id: String,            // 'bellringer-q0', 'organizer-row-2', 'vocab-0', 'written-response', 'passage-annotation'
  type: String,          // 'mc' | 'organizer-row' | 'vocabulary' | 'written-response' | 'passage-annotation'
  grPhase: String,       // 'i-do' | 'we-do' | 'you-do-partner' | 'you-do'
  title: String,         // display label e.g. 'Bellringer · Q1', 'Organizer · I Do', 'Vocabulary · contented'
  strategies: String[],  // relevant strategies: subset of ['stop','cubes','race','cer']
  data: Object           // type-specific payload
}
```

**Type-specific `data` payloads:**

```js
// mc
{
  stem,
  options: [{ letter, text, correct, stopLabel }],
  writtenPrompt,   // may be null
  writtenModel     // may be null
}

// organizer-row
{
  benchmarkFocus,  // string, shown above the row
  columns,         // column header labels array
  label,           // 'I Do' | 'We Do' | 'You Do w/ Partner' | 'You Do'
  cells,           // array of cell content strings
  isPreFilled      // boolean
}

// vocabulary
{
  word, partOfSpeech, definition, exampleSentence,
  esolFrames       // full dayData.esol object — renderer picks tier via window.currentEsolLevel
}

// written-response
{
  framework: 'race',   // always 'race' from current data; display label changes if body.cer-active
  prompt,              // raceFrames.task
  frame: { restate, answer, cite, explain }
}

// passage-annotation
{
  paragraphs,    // array of { number, text }
  cubesGuide     // array of { letter, action, example }
}
```

---

## Components

### 1. Activity Card (`.activity`)

Always expanded. Never has a click-to-open toggle.

```html
<div class="activity activity--{type} activity--{grPhase}" data-activity-id="{id}">
  <div class="activity-header">
    <span class="activity-gr-badge gr-{grPhase}">{I DO | WE DO | YOU DO W/ PARTNER | YOU DO}</span>
    <span class="activity-title">{title}</span>
    <div class="activity-strategy-badges">{badge per strategy in activity.strategies}</div>
    <button class="activity-focus-btn" data-id="{id}" title="Focus Mode">⊡</button>
  </div>
  <div class="activity-body">
    {type-specific content — see below}
  </div>
</div>
```

**MC body:**
- Question stem paragraph
- Options: `<button class="mc-option" data-correct="{bool}" data-stop-label="{label}">` — clickable to select/eliminate
- `.stop-label` span inside each option, hidden by default, visible when `body.stop-active`
- `.mc-option.correct` highlighted when `body.reveal-answers`
- Clicking an option while `body.stop-active` toggles `.mc-option--eliminated` (CSS: `opacity:0.4; text-decoration:line-through`)
- `writtenPrompt` shown below options if present; `writtenModel` shown only when `body.reveal-answers`

**Organizer-row body:**
- Benchmark focus label (small, muted)
- Three-column row: GR badge | cell 1 | cell 2 (or more columns per data)
- I Do rows (`isPreFilled: true`): cells shown normally; hidden unless `body.reveal-answers` or `body.teacher-view`
- We Do / You Do rows: cells show placeholder text ("Students respond…") in italic

**Vocabulary body:**
- Word (large, bold) + part of speech
- Definition
- Example sentence
- ESOL frame section below, level-aware (reads `window.currentEsolLevel`, re-renders on ESOL cycle)

**Written-response body:**
- Prompt text
- Frame scaffold always visible (not toggle-gated):
  - When `body.cer-active`: labels show as Claim / Evidence / Reasoning
  - Otherwise: labels show as Restate / Answer / Cite / Explain
- Model response hidden unless `body.reveal-answers`

**Passage-annotation body:**
- Numbered paragraphs
- CUBES annotation guide (static reference, not interactive — annotation happens in the passage drawer)
- Note: "Use the Passage drawer (→) to annotate"

**Teacher notes block** (below all activities, not an Activity type):
```html
<div class="teacher-notes-block teacher-only-hidden">
  <div class="teacher-notes-label">👁 Teacher Notes</div>
  <div class="teacher-notes-body">{teacherNotes text}</div>
</div>
```
Hidden via `.teacher-only-hidden` same as before. `applyTeacherView()` in `cards.js` toggles it.

### 2. Passage Drawer

```html
<div class="passage-drawer" id="passage-drawer">
  <button class="passage-drawer-tab" id="passage-drawer-tab" aria-label="Open passage">
    <span>📄 Passage</span>
  </button>
  <div class="passage-drawer-panel">
    <div class="passage-drawer-header">
      <span class="passage-drawer-title">Text Passage</span>
      <button id="btn-line-numbers-drawer" title="Toggle line numbers"># Lines</button>
      <button id="btn-read-aloud-drawer" title="Read passage aloud">🔊</button>
      <button id="passage-drawer-close" aria-label="Close passage">✕</button>
    </div>
    <div class="passage-drawer-body" id="passage-text-drawer">
      <!-- paragraphs injected by nav.js on day switch -->
    </div>
    <div class="passage-cubes-toolbar" id="passage-cubes-toolbar">
      <span style="font-size:11px;color:#aaa;margin-right:4px;">CUBES:</span>
      <div class="cubes-btn active" data-cubes="circle">C</div>
      <div class="cubes-btn" data-cubes="underline">U</div>
      <div class="cubes-btn" data-cubes="box">B</div>
      <div class="cubes-btn" data-cubes="eliminate">E</div>
      <div class="cubes-btn" data-cubes="star">S</div>
      <button id="passage-clear-annotations">Clear</button>
    </div>
    <canvas id="passage-drawer-canvas"></canvas>
  </div>
</div>
```

**Behavior:**
- Tab always visible on right edge (even when drawer closed)
- Clicking tab or `#btn-passage` in Content popover toggles `.passage-drawer--open`
- Width: `480px` fixed; on viewport < 600px: `100vw` (full width)
- Passage text populated by `nav.js` on day switch: reads `UNIT.days[day].textPassage` and injects paragraphs into `#passage-text-drawer`. If no `textPassage`: injects "No passage for this day."
- `#passage-drawer-canvas` sized to `passage-drawer-body` dimensions; resized on drawer open and window resize
- `window.initAnnotations('passage-drawer-canvas')` called first time the drawer opens

### 3. Focus Mode

**Entry:** User clicks `⊡` button on any `.activity` card. OR user clicks `#btn-focus` in toolbar (enters focus on topmost visible activity via `IntersectionObserver`).

**Exit:** Escape key, clicking `#focus-back-btn` ("← Back to Day"), or clicking outside the focused activity area.

**DOM changes on enter:**
```js
document.querySelectorAll('.activity').forEach(el => {
  if (el.dataset.activityId !== id) el.classList.add('activity-dimmed');  // display:none
});
target.classList.add('activity-focused');
document.body.classList.add('focus-mode');
```

**Focus mode UI injected above the focused activity:**
```html
<div class="focus-header" id="focus-header">
  <button id="focus-back-btn">← Back to Day</button>
  <div class="focus-step-label" id="focus-step-label">Step 1 of 4 — Read</div>
  <div class="focus-step-dots" id="focus-step-dots"><!-- dots --></div>
</div>
<div class="focus-nav" id="focus-nav">
  <button id="focus-prev-btn" disabled>← Back</button>
  <button id="focus-next-btn">Next →</button>
</div>
```

Both `#focus-header` and `#focus-nav` are fixed-position elements (not inside the activity DOM). They appear/disappear with `body.focus-mode`.

**Steps per activity type:**

| Type | Step 1 | Step 2 | Step 3 | Step 4 |
|------|--------|--------|--------|--------|
| `mc` | Read — stem + all options, no labels | Apply Strategy — STOP labels visible (if active), passage drawer opens (if CUBES active) | Interact — student taps to select/eliminate | Confirm — correct answer highlighted, written prompt shown |
| `organizer-row` (We Do / You Do) | Read — benchmark focus + column headers | I Do model shown (if prior I Do row exists in `organizer.rows`) | Student responds — placeholder cells highlighted with dashed border | Confirm — exemplar row revealed (if `reveal-answers` active) |
| `organizer-row` (I Do) | Read — benchmark focus | Teacher models — exemplar shown | — | — (2 steps only) |
| `vocabulary` | Word only (definition hidden) | Definition revealed | Example sentence + ESOL frame shown | — (3 steps) |
| `written-response` | Prompt shown, frame hidden | RACE/CER frame revealed | Model response shown (if `reveal-answers`) | — (3 steps) |
| `passage-annotation` | Read ¶1–3 | Read ¶4–6 (paginated if >6 ¶) | CUBES guide shown | Passage drawer opens for annotation |

**Keyboard:** `ArrowRight` / `Space` = Next step. `ArrowLeft` = Back step. `Escape` = exit focus mode.

### 4. Strategy Layer

Four independent body-class toggles:

| Toggle | Body class | CSS effect | Scope |
|--------|-----------|------------|-------|
| STOP | `body.stop-active` | `.stop-label { display: inline }` on `.mc-option` | All mc activities |
| CUBES | `body.cubes-active` | Passage drawer opens; `.passage-cubes-toolbar { display: flex }` | Passage drawer |
| RACE | `body.race-active` | `.race-frame { display: block }` on written-response | All written-response activities |
| CER | `body.cer-active` | `.cer-labels` shown instead of `.race-labels` in same frame | All written-response activities |

CER and RACE can both be active simultaneously — CER overrides the label display only, not the frame content.

---

## Toolbar Redesign — Popover Groups

The toolbar shows a minimal set of top-level buttons. Group buttons open absolute-positioned popover panels with their full tool set. One popover open at a time; clicking another group closes the current one. Clicking outside any popover or pressing Escape closes it.

**Top-level toolbar buttons (always visible):**
```
[⏱ 4:00 | ▶ | ↺]   [⊡ Focus]   [Strategies ▾]   [Content ▾]   [Tools ▾]   [📊 Engage]   [↓ Downloads]
```

**Popover contents:**

**Strategies ▾**
- 🛑 STOP (toggle, shows active state)
- ◉ CUBES (toggle — opens passage drawer)
- ✍ RACE (toggle)
- 🔬 CER (toggle)

**Content ▾**
- 📄 Passage (opens passage drawer)
- 👁 Teacher View (toggle)
- 💡 Reveal Answers (toggle)
- 🌐 ESOL Level (cycles L1–2 / L3–4 / L5, shows current)
- 🎯 Benchmark Obj. (shows benchmark banner)
- 📋 GR Phase Badge

**Tools ▾**
- 📖 Vocab Ref
- 🃏 Flashcards
- 🎟 Exit Ticket
- 🔊 Read Aloud
- 📅 Pacing
- ⬛ QR Code
- Df Dyslexia Font
- ◑ High Contrast
- 🖨 Print

**Progress** stays as a standalone button (same as before, opens progress panel). Moved inside Content popover is also acceptable but keeping it top-level preserves current behavior.

**Popover implementation:** Each group button has a `data-popover="{id}"`. JS in `toolbar.js` toggles a `.popover--open` class on the corresponding popover panel `div`. Popovers are `position:absolute`, `top: 100%`, `left: 0`, `z-index: 200`, `min-width: 180px`, styled consistently.

---

## CSS Changes

**Remove:**
- `.card`, `.card-header`, `.card-body`, `.card-toggle`, `.card-collapsed-hint`
- `.card.expanded` and all card expand/collapse rules
- `.content-grid { grid-template-columns: 1fr 1fr }` (2-column grid)
- `.split-screen` and `body.split-screen` rules

**Add:**
- `.activity` — `width:100%; background:var(--bg-card); border-left:4px solid var(--activity-phase-color); border-radius:8px; margin-bottom:12px; padding:16px`
- `--activity-phase-color`: set via `.activity--i-do { --activity-phase-color: #4a7c59 }` etc.
- `.activity-header` — flex row: badge + title + strategies + focus button
- `.activity-gr-badge` — pill, background/color by phase
- `.activity-focus-btn` — small, ghost button; top-right corner; visible on hover
- `.activity-focused` — `position:fixed; inset:var(--toolbar-height) 0 0 var(--sidebar-width); z-index:50; overflow-y:auto; background:var(--bg-main); padding:24px`
- `.activity-dimmed` — `display:none`
- `body.focus-mode .content-area` — overflow hidden (prevents scroll behind focused activity)
- `.passage-drawer` — `position:fixed; top:var(--toolbar-height); right:0; bottom:0; width:480px; transform:translateX(100%); transition:transform 0.25s ease; background:var(--bg-card); z-index:100`
- `.passage-drawer--open` — `transform:translateX(0)`
- `.passage-drawer-tab` — `position:absolute; left:-28px; top:50%; transform:translateY(-50%); writing-mode:vertical-rl`
- `.focus-header` — fixed below toolbar, above content; shown only when `body.focus-mode`
- `.focus-nav` — fixed above footer; Back + Next buttons; shown only when `body.focus-mode`
- `.focus-step-dots` — flex row of dots
- `.toolbar-popover` — `position:absolute; top:100%; background:var(--bg-card); border:1px solid var(--border); border-radius:8px; padding:8px; display:none; flex-direction:column; gap:4px; z-index:200`
- `.toolbar-popover.popover--open` — `display:flex`
- `.stop-label` — `display:none` by default; `body.stop-active .stop-label { display:inline }`
- `.race-frame` — `display:none` by default (but written-response activities show it by default — override: `.activity--written-response .race-frame { display:block }`)
- `.cer-active .race-labels` → `display:none`; `.cer-active .cer-labels` → `display:block`

---

## Responsive Behavior

- **Viewport ≥ 1024px:** Passage drawer `width:480px`. Sidebar visible. Full toolbar.
- **Viewport 600–1023px:** Passage drawer `width:380px`. Sidebar collapses by default.
- **Viewport < 600px:** Passage drawer `width:100vw`. Sidebar hidden. Toolbar groups collapse to icons only (no label text).

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ArrowRight` / `Space` | Next step in focus mode |
| `ArrowLeft` | Previous step in focus mode |
| `Escape` | Exit focus mode; close open popover; close passage drawer |
| `F` | Enter focus mode on topmost visible activity |
| `P` | Projection mode (existing) |
| `T` | Teacher view toggle (existing) |
| `ArrowLeft` / `ArrowRight` (outside focus) | Previous / next day (existing) |

---

## Stub Page HTML Changes

`generate-stubs.js` reads `units/alicogia/index.html` as the shell template (existing behavior). The only HTML additions needed in all unit pages are:
1. Passage drawer markup (added to `alicogia/index.html` in Phase G Task 5)
2. `#passage-drawer-canvas` element
3. Removal of `#btn-split-screen` from toolbar

All other HTML (script tags, overlays, nav, toolbar groups) already matches across all pages from Phase C's stub generation. After alicogia is updated, re-running `generate-stubs.js` propagates to all 23 stubs. The 3 live units (shakuntala, bloomers, mathinnovations) must be updated manually or via a targeted sed pass.

---

## What Does NOT Change

- All `data.js` schemas
- `js/timer.js`
- `js/theme.js`
- `js/nav.js` (calls `renderActivities(day)` instead of `renderDayContent(day)` — one-line change)
- `js/engage.js`
- All existing overlay panels: vocab-ref, pacing, achievement, race-panel, exit-ticket, flashcard, qr-modal
- ESOL level cycling logic
- Reveal Answers body class
- Teacher View body class
- Projection Mode
- Spotlight Mode
- Progress checklist
- Downloads panel

---

## Implementation Order

1. **CSS** — activity styles, passage drawer, focus mode, popover styles, remove card/split-screen styles
2. **activities.js** — `buildActivities(dayData)` adapter
3. **cards.js** — rewrite `renderDayContent` → `renderActivities`; teacher-notes block; `applyRevealState` / `applyTeacherView` updated for new DOM
4. **focus.js** — enter/exit, step-through per type, IntersectionObserver for toolbar button, keyboard
5. **Passage Drawer HTML + JS** — add to `alicogia/index.html`; populate on day switch; drawer canvas init
6. **annotations.js** — add `window.initAnnotations(canvasId)` entry point for drawer canvas
7. **toolbar.js** — popover group system; CER toggle; remove Split Screen; wire Passage button
8. **generate-stubs.js + propagate** — update alicogia shell, regenerate 23 stubs, patch 3 live units
