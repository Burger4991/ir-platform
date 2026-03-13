# Classroom Upgrade Design Spec
**Phase H — Clarity + Momentum | Phase I — Visual Polish**

Date: 2026-03-13
Status: Approved

---

## Problem Statement

The IR Platform is projected on a classroom screen for 10th grade Intensive Reading. Four problems were identified (ranked by priority):

1. **Unclear what to do** — students can't tell at a glance what an activity asks of them
2. **Navigation confusion** — no visual sense of where they are in a day or unit
3. **No momentum** — class feels static; no sense of progress moving forward
4. **Visual staleness** — every day looks identical; no visual variety or energy

---

## Solution Overview

Two implementation phases, both vanilla CSS/JS — no build step.

**Phase H** fixes problems 1, 2, and 3 (clarity + momentum).
**Phase I** fixes problem 4 (visual polish + per-day differentiation).

---

## Phase H — Clarity + Momentum

### H1. Activity Type Label Strip

Each activity card gets a top label strip that immediately identifies the activity type. In card view (not Focus Mode), the strip shows **only the activity type label** — no step context text. Step context is shown only in Focus Mode via the attention anchor (see I3).

**Labels by type:**
| Activity type | Label |
|---|---|
| `mc` | 📝 Multiple Choice |
| `vocabulary` | 📖 Vocabulary |
| `written-response` | ✍️ Written Response |
| `organizer-row` | 🗂 Organizer |
| `passage-annotation` | 🔍 Passage Annotation |

**Implementation:** Add a `.activity-type-strip` div as the first child of `.activity`, before the existing `.activity-header`. Populated in `buildActivityEl()` in `cards.js`. Strip background uses `var(--day-accent-bg)`.

### H2. Explicit Instruction Text

Inside each activity card body, add labeled instruction prompts that tell students exactly what to do.

**Per activity type:**
- **MC:** "👀 Read the passage stem carefully" above the passage; "✏️ Which answer is supported by the text?" above the options
- **Vocabulary:** "👀 Read the word and definition" above word; "✏️ Complete the sentence frame" above ESOL block
- **Written Response:** "✏️ Build your response using the frame below" above the RACE/CER frame
- **Organizer Row:** "✏️ Fill in your row" above the organizer cells
- **Passage Annotation:** "👀 Read and annotate the passage" above the passage text

**Implementation:** Add `.activity-instruction` styled `<div>` elements inside each activity body builder in `cards.js`. CSS class `.activity-instruction` — small caps, `var(--day-accent-text)` color, 700 weight, `font-size: 10px`, `letter-spacing: 0.5px`.

### H3. Step Dots in Card Header

Each activity card header shows dot indicators reflecting the number of Focus Mode steps for that activity type, with dot 0 glowing (active) in card view. In Focus Mode, the active dot updates as the user steps through. **Step dots are hidden (`display: none`) on cards with the `.activity--done` class** — the done checkmark in the title replaces them.

**Dot counts by type** (derived from actual `STEPS` object in `focus.js`):
| Type | GR Phase | Dots | Step labels |
|---|---|---|---|
| `mc` | — | 4 | Read, Apply Strategy, Interact, Confirm |
| `vocabulary` | — | 3 | Word, Definition, Example + Frame |
| `written-response` | — | 3 | Prompt, Frame, Model Response |
| `organizer-row` | `i-do` | 2 | Read, Teacher Models |
| `organizer-row` | `we-do` | 4 | Read, I Do Example, Student Responds, Confirm |
| `organizer-row` | `you-do` | 3 | Read, Student Responds, Confirm |
| `organizer-row` | `you-do-partner` | 3 | Read, Partner Practice, Confirm |
| `passage-annotation` | — | 4 | Read ¶1–3, Read ¶4–6, CUBES Guide, Annotate |

For `organizer-row`, `buildActivityEl()` reads `activity.grPhase` to determine dot count — the same GR phase that `getStepDefs()` in `focus.js` reads from element classes.

**Dot HTML:** `.activity-step-dots` div appended inside `.activity-header`. Each dot is a `<div class="step-dot">` with `step-dot--active` on dot 0 by default.

**Focus Mode update path:** `updateStepUI()` in `focus.js` gets a **new secondary update** (in addition to the existing `#focus-step-dots` update):
```js
const cardEl = document.querySelector(`[data-activity-id="${focusId}"]`);
if (cardEl) {
  cardEl.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.toggle('step-dot--active', i === stepIndex);
    dot.classList.toggle('step-dot--done', i < stepIndex);
  });
}
```

### H4. Sidebar Day Status Indicators

Sidebar day buttons show three states:

| State | Visual |
|---|---|
| Done | ✓ green background tint, "Done" label right-aligned |
| Active (now) | ● glowing accent dot, accent border, "Now" label |
| Upcoming | ○ empty circle, muted text, no label |

"Done" state is persisted to `localStorage`. Key: `ir-done-days-<unitId>` where `unitId = UNIT.meta.id || UNIT.meta.title || 'default'`. Value: JSON array of completed day numbers.

A day is marked done when the user clicks the Next Day / Back to Day 1 button on the Day Complete summary screen (H7).

**Button HTML structure** (rebuilt from scratch each render via `buildDayButtons()`):
```html
<button class="sidebar-day-btn sidebar-day--active" data-day="2">
  <span class="sidebar-day-indicator">●</span>
  <span class="sidebar-day-label">Day 2 — Conflict</span>
  <span class="sidebar-day-status">Now</span>
</button>
```

**Implementation:**
- `nav.js` — on `switchDay(day)`, iterate all sidebar buttons: apply `.sidebar-day--done` if day is in the persisted done array, `.sidebar-day--active` for `day === currentDay`, `.sidebar-day--upcoming` otherwise. Replace existing `.active` class toggle.
- Load persisted done days at startup: `JSON.parse(localStorage.getItem('ir-done-days-' + unitId) || '[]')`
- `css/main.css` — style the three states using `var(--day-accent)` for active state

### H5. Day Progress Bar

A progress bar inside `#content-area` (above `#content-grid`) shows progress through the current day's activities.

- "Day N of M" — N is current day, **M is `UNIT.meta.days` (total days in unit)**
- "X / Y activities" — X completed, Y total
- Gradient fill bar using `var(--day-accent)` color
- Segment row below: one per activity, green when done, accent when active (first incomplete), gray when upcoming

Progress state: `window.doneActivityIds` — a `Set` (session-only, resets on reload). Populated by `markActivityDone(id)`.

**Activity count:** Use `buildActivities(UNIT.days[day]).length` — calls the existing `buildActivities()` function (already available in `cards.js` scope) to get the canonical count matching what was rendered.

**HTML placement:** First child of `#content-area`, before `#content-grid`:
```html
<div class="content-area" id="content-area">
  <div id="day-progress-bar">…</div>   <!-- ADD HERE -->
  <div class="content-grid" id="content-grid"></div>
</div>
```

**Implementation:**
- `cards.js` — `window.doneActivityIds = new Set()` at module scope (initialized once)
- `cards.js` — `window.markActivityDone(id)` — adds to set, calls `updateDayProgress(window.currentDay)`, applies `.activity--done`
- `cards.js` — `updateDayProgress(day)` — counts activities, updates bar HTML, re-applies `.activity--done` classes
- Called from: `renderActivities()` (initial render) and `markActivityDone()` (after each completion)
- **Known re-render paths:** `toolbar.js` calls `renderDayContent()` directly on CER toggle and ESOL toggle — `renderActivities()` fires in both paths, so done-state re-application inside `renderActivities()` covers all re-render cases, not just day switches
- CSS: `.day-progress-bar`, `.day-progress-fill`, `.day-progress-segments`, `.day-progress-segment`, `.day-progress-segment--done`, `.day-progress-segment--active`

### H6. Activity Done State

After a user exits Focus Mode for an activity, the card transitions to a "done" visual state.

**Done state appearance:**
- Card background shifts to a muted green tint (`#0d2818`)
- Card left border becomes green (`#4ade80`)
- Title shows "✓ [Title] — Complete"
- Body collapses (CSS: `.activity--done .activity-body { display: none }`)
- "Review ↓" button expands the original body on click (adds `.activity--done-expanded`)
- Step dots hidden: `.activity--done .activity-step-dots { display: none }`

**Done state persistence across day switches:** `renderActivities()` calls `updateDayProgress(day)` as its last step (before `applyRevealState` / `applyTeacherView`). Inside `updateDayProgress`, re-apply done state to all rendered cards:
```js
doneActivityIds.forEach(id => {
  const el = document.querySelector(`[data-activity-id="${id}"]`);
  if (el) el.classList.add('activity--done');
});
```
This single re-apply path in `updateDayProgress()` covers day switches, CER toggles, and ESOL toggles — all re-render paths converge through `renderActivities()`.

**`focus.js` exit sequence:** `exitFocusMode()` must capture the ID before nulling state:
```js
function exitFocusMode() {
  const completedId = focusId;   // capture BEFORE reset
  focusId = null;
  currentStep = 0;
  stepDefs = [];
  // … rest of cleanup …
  if (completedId && typeof window.markActivityDone === 'function') {
    window.markActivityDone(completedId);
  }
}
```

### H7. Day Complete Summary Screen

When all activities in a day are marked done, a summary overlay appears over the content area.

**Content:**
- Day number and label (e.g., "Day 2 Complete — Conflict")
- Activity count ("5 activities")
- Next day prompt button

**Last day edge case:** When `window.currentDay === UNIT.meta.days`, the overlay shows "Unit Complete! 🎉" and the button reads "Back to Day 1" (calls `switchDay(1)`). On any other day, button reads "Next Day →" and calls `switchDay(currentDay + 1)`.

**Button behavior:**
- Persists current day as done: read `ir-done-days-<unitId>` array, append `currentDay`, write back
- Calls `switchDay(...)` to navigate
- Hides the overlay

**z-index:** Use `z-index: 850` — above `.fullscreen-overlay` (800) and below `.modal-overlay` (900). Focus Mode is exited before all activities can be done, so no conflict with Focus Mode UI (z-index 50–51).

**Implementation:**
- Add `#day-complete-overlay` in `index.html` (`position: fixed`, `z-index: 850`)
- `updateDayProgress()` checks if done count equals total activity count; if so, populates and shows the overlay
- Overlay CSS in `css/main.css`

---

## Phase I — Visual Polish

### I1. Card Style: Accent Glow Border

Replace current card border style with:
- Dark solid background (`#0f172a`)
- `border: 1px solid #1e293b`
- `border-left: 3px solid var(--day-accent)`
- `box-shadow: 0 0 20px rgba(var(--day-accent-rgb), 0.12), 0 4px 16px rgba(0,0,0,0.4)`
- Section dividers: `border-bottom: 1px solid rgba(var(--day-accent-rgb), 0.15)` between type strip, header, and body

No blur, no transparency — solid and projection-safe.

### I2. Per-Day Accent Color System

`switchDay()` in `nav.js` calls `setDayAccent(day)` which sets both `--day-accent` **and `--accent`** on `document.documentElement` as inline styles. Setting `--accent` ensures all existing `var(--accent)` references in JS-generated inline styles (e.g., `stepOrgStudentFill` dashed outline, CUBES letter colors) pick up the per-day color automatically.

**Color map:**
| Days | Accent | Accent RGB | Accent text | Background tint | Border |
|---|---|---|---|---|---|
| 1–2 | `#6366f1` (Indigo) | `99,102,241` | `#a5b4fc` | `#1e1b4b` | `#312e81` |
| 3–4 | `#10b981` (Emerald) | `16,185,129` | `#6ee7b7` | `#022c22` | `#064e3b` |
| 5–6 | `#f59e0b` (Amber) | `245,158,11` | `#fcd34d` | `#1c0a00` | `#78350f` |

For units longer than 6 days, palette cycles.
Formula: `const palette = [indigo, emerald, amber][Math.floor((day - 1) / 2) % 3]`

**CSS variables set per day:**
```css
--day-accent: #6366f1;
--day-accent-rgb: 99,102,241;
--day-accent-text: #a5b4fc;
--day-accent-bg: #1e1b4b;
--day-accent-border: #312e81;
--accent: #6366f1;   /* mirrors --day-accent for backward compat */
```

**Default values** (Day 1–2 indigo) set in `:root` in `css/main.css`.

**Theme switcher interaction:** The toolbar's theme buttons apply a body class that sets CSS `--accent` via a class rule. Because `setDayAccent()` sets `--accent` as an **inline style on `:root`** (`document.documentElement.style.setProperty`), it wins over any class-based rule. If the user switches themes mid-session, `theme.js` must call `setDayAccent(window.currentDay)` after applying the new theme body class, to restore the per-day inline override. The per-day accent intentionally overrides the theme accent color — this is by design.

### I3. Focus Mode Attention Anchor

In Focus Mode, a large bold verb label in `.focus-header` tells students exactly what to do at each step. It is the most visually prominent text on screen.

**Anchor text defined by a `STEP_ANCHORS` map keyed by `[typeKey][stepIndex]`**, mirroring the `STEPS` arrays in `focus.js`. `typeKey` for `organizer-row` includes the GR phase (same resolution logic as `getStepDefs()`):

```js
const STEP_ANCHORS = {
  'mc':                           ['Read the Passage',      'Apply Your Strategy',  'Pick Your Answer',    'Check Your Answer'],
  'vocabulary':                   ['Read the Word',         'Read the Definition',  'Write an Example'],
  'written-response':             ['Read the Prompt',       'Build Your Response',  'Check the Model'],
  'organizer-row-i-do':           ['Read the Example',      'Watch the Model'],
  'organizer-row-we-do':          ['Read the Example',      'See the I Do',         'Fill In Your Row',    'Check Your Answer'],
  'organizer-row-you-do':         ['Read the Example',      'Fill In Your Row',     'Check Your Answer'],
  'organizer-row-you-do-partner': ['Read the Example',      'Fill In Your Row',     'Check Your Answer'],
  'passage-annotation':           ['Read Paragraphs 1–3',   'Read Paragraphs 4–6',  'Review CUBES Guide',  'Annotate the Passage']
};
```

`anchorKey` is computed in `enterFocusMode()` — for `organizer-row`, use `'organizer-row-' + grPhase`; for all others, use the type string. Store `anchorKey` alongside `stepDefs` in IIFE-scoped `let` variables.

`updateStepUI(stepIndex)` sets: `anchorEl.textContent = (STEP_ANCHORS[anchorKey] || [])[stepIndex] || stepDefs[stepIndex].label`

**Anchor element:** `.focus-attention-anchor` div inside `#focus-header` in `index.html`. Style: `font-size: clamp(28px, 4vw, 40px)`, `font-weight: 900`, `color: var(--day-accent-text)`, `text-align: center`.

### I4. CSS Transitions

Smooth transitions for key state changes — all CSS, no JS animation libraries:

| Transition | CSS property | Duration |
|---|---|---|
| Day switch (content fade) | `opacity` on `#content-grid` | 200ms ease |
| Focus Mode step change | `opacity` on `.focus-body` | 150ms ease |
| Activity done state | `background-color`, `border-color` | 300ms ease |
| Day complete overlay | `opacity`, `transform: translateY` | 250ms ease |
| Sidebar day button hover | `background-color`, `box-shadow` | 150ms ease |

**Day switch fade — async pattern required:** Setting opacity to 0 and then immediately to 1 in the same synchronous call will be batched by the browser and never render. Use `requestAnimationFrame` to allow the browser to paint the fade-out before re-rendering:
```js
const grid = document.getElementById('content-grid');
if (grid) grid.style.opacity = '0';
requestAnimationFrame(() => {
  renderDayContent(day);
  requestAnimationFrame(() => {
    if (grid) grid.style.opacity = '1';
  });
});
```
The outer `rAF` allows the browser to paint the fade-out; the inner `rAF` after `renderDayContent()` allows the new content to paint before fading in.

All transitions respect `prefers-reduced-motion: reduce`:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0ms !important; }
}
```

---

## Architecture

### Files Modified
| File | Changes |
|---|---|
| `css/main.css` | Add Phase H/I styles: type strip, instruction labels, step dots (+ hidden in done state), sidebar states, progress bar, done state, overlay, glow border, transitions; `:root` defaults for `--day-accent` vars |
| `js/cards.js` | `buildActivityEl()` — type strip (H1), step dots (H3); body builders — instruction labels (H2); `window.doneActivityIds`, `window.markActivityDone()`, `updateDayProgress()` (H5/H6); re-apply done state in `renderActivities()` via `updateDayProgress()` |
| `js/nav.js` | `switchDay()` — `setDayAccent(day)` (I2); sidebar status classes (H4); day fade via `requestAnimationFrame` (I4); theme.js must call `setDayAccent(window.currentDay)` after theme switch |
| `js/focus.js` | `enterFocusMode()` — compute `anchorKey` (I3); `updateStepUI()` — card dot update (H3), attention anchor text (I3); `exitFocusMode()` — capture `completedId` before reset, call `window.markActivityDone(completedId)` (H6); `STEP_ANCHORS` map |
| `units/alicogia/index.html` | `#day-progress-bar` in `#content-area` before `#content-grid` (H5); `#day-complete-overlay` `z-index: 850` (H7); `.focus-attention-anchor` in `#focus-header` (I3) |

### Session State
```js
window.doneActivityIds = new Set()  // activity IDs completed this session; re-applied after every renderActivities() call
```

### localStorage Keys
- `ir-done-days-<unitId>` — JSON array of completed day numbers
- `unitId = UNIT.meta.id || UNIT.meta.title || 'default'`

### CSS Variables (`:root` defaults, updated dynamically by `setDayAccent()`)
```css
--day-accent          /* primary accent; also set as --accent for backward compat */
--day-accent-rgb      /* RGB tuple for rgba() */
--day-accent-text     /* light text color for labels */
--day-accent-bg       /* dark tinted background for strips */
--day-accent-border   /* muted border */
--accent              /* mirrors --day-accent */
```

### z-index Reference
Existing values (from `css/main.css`): timer=9000, modal=900, fullscreen=800, annotation toolbar=600, annotation canvas=500, GR badge=400, slide panel=300, downloads/progress panels=200, focus-header=100–1000.
Day complete overlay: **850** (above fullscreen, below modal, never conflicts with Focus Mode since all activities must be done to trigger it).

---

## Out of Scope

- Sound effects or audio feedback
- Student-facing login or individual tracking
- Backend or server-side changes
- Changes to `data.js` schema
- Changes to `css/themes.css` — themes continue to work; per-day accent intentionally overrides `--accent` via inline style

---

## Success Criteria

1. A student can identify what to do in an activity within 2 seconds of the card appearing
2. The sidebar clearly shows which days are done vs. active vs. upcoming
3. The progress bar advances as activities are completed through Focus Mode
4. The accent color visibly shifts between day groups (1–2 indigo, 3–4 emerald, 5–6 amber)
5. The Focus Mode attention anchor is the most prominent text on screen during each step
6. All transitions feel smooth (day fade, step fade, done-state transition)
7. Done state survives day switching and toolbar re-renders (CER, ESOL toggles)
8. The Day Complete overlay shows "Unit Complete! 🎉" on the final day with "Back to Day 1"
9. Theme switcher still works mid-session (per-day accent re-applied after theme change)
10. No regressions to existing functionality (Focus Mode steps, ESOL, toolbar, annotations)
