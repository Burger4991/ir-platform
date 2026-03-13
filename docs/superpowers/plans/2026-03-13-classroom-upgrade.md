# Classroom Upgrade Implementation Plan
## Phase H (Clarity + Momentum) + Phase I (Visual Polish)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add activity type strips, instruction labels, step dots, sidebar day status, progress bar, activity done state, day complete overlay, per-day accent colors, focus mode attention anchor, and CSS transitions to the IR classroom platform.

**Architecture:** All changes are vanilla CSS/JS — no build step, no dependencies. CSS variables (`--day-accent` and friends) are set dynamically by `nav.js` on each day switch, flowing through all styled elements. JavaScript session state (`window.doneActivityIds`) tracks completion across re-renders. Focus Mode in `focus.js` calls into `cards.js` on exit to mark activities done.

**Tech Stack:** Vanilla HTML/CSS/JS. No test framework — verification is manual browser inspection using `python3 -m http.server 8080` from project root, then `http://localhost:8080/units/alicogia/`.

**Spec:** `docs/superpowers/specs/2026-03-13-classroom-upgrade-design.md`

---

## Chunk 1: CSS Foundation + HTML

---

### Task 1: CSS Variables and Card Glow Border

**Files:**
- Modify: `css/main.css` (lines 1–10 area for `:root` vars; lines 631–639 for `.activity`)

**Context:** The current `.activity` card uses `background: var(--bg-card)` with a phase-colored left border. We're replacing this with a per-day accent glow border. The `--day-accent` variables will be set dynamically by `nav.js` on day switch (Task 8), but need defaults here so the page renders correctly on load.

- [ ] **Step 1: Add CSS variables to `:root`**

Open `css/main.css`. At the very top, after the `*, *::before, *::after` reset block (line ~2), add this block:

```css
/* ── Per-day accent system — defaults overridden dynamically by nav.js ── */
:root {
  --day-accent: #6366f1;
  --day-accent-rgb: 99,102,241;
  --day-accent-text: #a5b4fc;
  --day-accent-bg: #1e1b4b;
  --day-accent-border: #312e81;
}
```

- [ ] **Step 2: Update `.activity` card border style**

Find the `.activity` block at line ~632:
```css
.activity {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--activity-phase-color, var(--accent));
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
```

Replace with:
```css
.activity {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-left: 3px solid var(--day-accent);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(var(--day-accent-rgb), 0.12), 0 4px 16px rgba(0,0,0,0.4);
  overflow: hidden;
  margin-bottom: 12px;
}
```

- [ ] **Step 3: Update `.activity-header` and `.activity-body` dividers to use accent**

Find `.activity-header` (~line 645) and add the accent-tinted border:
```css
.activity-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(var(--day-accent-rgb), 0.15);
  background: var(--bg-header);
}
```

- [ ] **Step 4: Add `prefers-reduced-motion` block**

At the very end of `css/main.css`, add:
```css
/* ── Accessibility: reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
```

- [ ] **Step 5: Verify in browser**

```bash
cd /Users/alexanderburger/Desktop/ir-platform && python3 -m http.server 8080
```
Open `http://localhost:8080/units/alicogia/`. Activity cards should now have a subtle indigo left border glow instead of the green phase border. The page should not be broken.

- [ ] **Step 6: Commit**

```bash
git add css/main.css
git commit -m "style: add day-accent CSS vars and update activity card glow border"
```

---

### Task 2: CSS for Type Strip, Instruction Labels, Step Dots, and Sidebar States

**Files:**
- Modify: `css/main.css` (append after existing `.activity-*` rules, ~line 706)

- [ ] **Step 1: Add activity type strip CSS**

After the `.activity-body` block (~line 703), add:
```css
/* ── Activity Type Strip (H1) ── */
.activity-type-strip {
  padding: 5px 14px;
  background: var(--day-accent-bg);
  border-bottom: 1px solid rgba(var(--day-accent-rgb), 0.2);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--day-accent-text);
}
```

- [ ] **Step 2: Add instruction label CSS**

```css
/* ── Instruction Labels (H2) ── */
.activity-instruction {
  font-size: 10px;
  font-weight: 700;
  color: var(--day-accent-text);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
  margin-top: 10px;
}
.activity-instruction:first-child { margin-top: 0; }
```

- [ ] **Step 3: Add step dot CSS**

```css
/* ── Step Dots (H3) ── */
.activity-step-dots {
  display: flex;
  gap: 4px;
  margin-left: auto;
  align-items: center;
}
.step-dot {
  width: 7px;
  height: 7px;
  border-radius: 99px;
  background: rgba(255,255,255,0.12);
  transition: background 0.2s, box-shadow 0.2s;
}
.step-dot--active {
  background: var(--day-accent);
  box-shadow: 0 0 6px rgba(var(--day-accent-rgb), 0.8);
}
.step-dot--done {
  background: #4ade80;
}
/* Hide step dots on completed cards */
.activity--done .activity-step-dots { display: none; }
```

- [ ] **Step 4: Add sidebar day status CSS**

Find the existing `.sidebar-day-btn` rules (~line 329) and add below them:
```css
/* ── Sidebar Day Status States (H4) ── */
.sidebar-day-btn { position: relative; display: flex; align-items: center; gap: 6px; }
.sidebar-day-indicator { font-size: 10px; flex-shrink: 0; width: 14px; text-align: center; }
.sidebar-day-label { flex: 1; }
.sidebar-day-status { font-size: 9px; letter-spacing: 0.5px; margin-left: auto; opacity: 0.8; }

.sidebar-day-btn.sidebar-day--active {
  background: rgba(var(--day-accent-rgb), 0.15);
  border: 1px solid rgba(var(--day-accent-rgb), 0.4);
  color: var(--day-accent-text);
  font-weight: 700;
  box-shadow: 0 0 12px rgba(var(--day-accent-rgb), 0.15);
}
.sidebar-day-btn.sidebar-day--active .sidebar-day-indicator {
  color: var(--day-accent);
  text-shadow: 0 0 6px rgba(var(--day-accent-rgb), 0.8);
}
.sidebar-day-btn.sidebar-day--done {
  background: rgba(16,185,129,0.08);
  color: #4ade80;
}
.sidebar-day-btn.sidebar-day--done .sidebar-day-indicator { color: #4ade80; }
.sidebar-day-btn.sidebar-day--upcoming {
  color: var(--text-muted);
  opacity: 0.6;
}
/* NOTE: .sidebar-day-btn.active override is intentionally NOT added here — it moves to Task 8
   where the JS that sets .sidebar-day--active is also wired, preventing a broken interim state. */
```

- [ ] **Step 5: Verify in browser**

Reload `http://localhost:8080/units/alicogia/`. No visual change yet (type strip and dots require JS changes), but the page should not be broken. Sidebar active day should still be highlighted (existing `.active` class).

- [ ] **Step 6: Commit**

```bash
git add css/main.css
git commit -m "style: add type strip, instruction labels, step dots, and sidebar status CSS"
```

---

### Task 3: CSS for Progress Bar, Done State, Day Complete Overlay, and Transitions

**Files:**
- Modify: `css/main.css` (append near end)

- [ ] **Step 1: Add day progress bar CSS**

```css
/* ── Day Progress Bar (H5) ── */
#day-progress-bar {
  padding: 10px 16px 8px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}
.day-progress-meta {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.day-progress-track {
  height: 5px;
  background: rgba(255,255,255,0.07);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 6px;
}
.day-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--day-accent), rgba(var(--day-accent-rgb),0.7));
  border-radius: 99px;
  transition: width 0.3s ease;
  width: 0%;
}
.day-progress-segments {
  display: flex;
  gap: 4px;
}
.day-progress-segment {
  flex: 1;
  height: 3px;
  border-radius: 99px;
  background: rgba(255,255,255,0.08);
  transition: background 0.25s ease;
}
.day-progress-segment--done   { background: #4ade80; }
.day-progress-segment--active { background: var(--day-accent); box-shadow: 0 0 6px rgba(var(--day-accent-rgb),0.6); }
```

- [ ] **Step 2: Add activity done state CSS**

```css
/* ── Activity Done State (H6) ── */
.activity--done {
  background: #0d2818;
  border-color: #1a3a22;
  border-left-color: #4ade80;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  opacity: 0.8;
  transition: background 0.3s ease, border-color 0.3s ease, opacity 0.3s ease;
}
.activity--done .activity-type-strip {
  background: rgba(74,222,128,0.06);
  border-bottom-color: rgba(74,222,128,0.15);
  color: #4ade80;
}
.activity--done .activity-title::before {
  content: "✓ ";
  color: #4ade80;
}
.activity--done .activity-body { display: none; }
.activity--done-expanded .activity-body { display: block; }
.activity-done-summary {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: #4ade80;
}
.activity-done-review-btn {
  margin-left: auto;
  font-size: 10px;
  background: transparent;
  color: #166534;
  border: 1px solid #166534;
  padding: 3px 9px;
  border-radius: 4px;
  cursor: pointer;
}
.activity-done-review-btn:hover { background: rgba(74,222,128,0.1); }
```

- [ ] **Step 3: Add day complete overlay CSS**

```css
/* ── Day Complete Overlay (H7) ── */
#day-complete-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.75);
  z-index: 850;
  align-items: center;
  justify-content: center;
}
#day-complete-overlay.visible { display: flex; }
.day-complete-card {
  background: linear-gradient(135deg, rgba(var(--day-accent-rgb),0.15), #0f172a 60%);
  border: 1px solid rgba(var(--day-accent-rgb), 0.3);
  border-radius: 16px;
  padding: 32px 40px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
.day-complete-emoji { font-size: 36px; margin-bottom: 10px; }
.day-complete-title { font-size: 22px; font-weight: 900; color: #f1f5f9; margin-bottom: 4px; }
.day-complete-subtitle { font-size: 13px; color: var(--day-accent-text); margin-bottom: 20px; }
.day-complete-stats { display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; }
.day-complete-stat { text-align: center; }
.day-complete-stat-value { font-size: 22px; font-weight: 800; color: var(--day-accent-text); }
.day-complete-stat-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
.day-complete-btn {
  background: rgba(var(--day-accent-rgb),0.2);
  color: var(--day-accent-text);
  border: 1px solid rgba(var(--day-accent-rgb),0.5);
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.day-complete-btn:hover { background: rgba(var(--day-accent-rgb),0.35); }
```

- [ ] **Step 4: Add transition CSS**

```css
/* ── Transitions (I4) ── */
#content-grid { transition: opacity 0.2s ease; }
.focus-body   { transition: opacity 0.15s ease; }
.sidebar-day-btn { transition: background 0.15s ease, box-shadow 0.15s ease, color 0.15s ease; }
#day-complete-overlay.visible {
  animation: overlay-in 0.25s ease forwards;
}
@keyframes overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.day-complete-card {
  animation: card-in 0.25s ease forwards;
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Focus Mode Attention Anchor (I3) ── */
.focus-attention-anchor {
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 900;
  color: var(--day-accent-text);
  text-align: center;
  letter-spacing: -0.5px;
  line-height: 1.1;
  margin: 8px 0;
  width: 100%;
}
```

- [ ] **Step 5: Verify in browser**

Reload. The page should look the same as before (CSS added but JS not yet wired). No broken layout.

- [ ] **Step 6: Commit**

```bash
git add css/main.css
git commit -m "style: add progress bar, done state, day complete overlay, and transition CSS"
```

---

### Task 4: HTML Additions to index.html

**Files:**
- Modify: `units/alicogia/index.html`

**Context:** Three new HTML elements needed: `#day-progress-bar` (inside `#content-area` before `#content-grid`), `#day-complete-overlay` (before closing `</body>`), and `.focus-attention-anchor` (inside `#focus-header`).

- [ ] **Step 1: Add day progress bar element**

Find line ~132 in `units/alicogia/index.html`:
```html
    <div class="content-area" id="content-area">
      <div class="content-grid" id="content-grid"></div>
    </div>
```

Replace with:
```html
    <div class="content-area" id="content-area">
      <div id="day-progress-bar" style="display:none">
        <div class="day-progress-meta">
          <span id="day-progress-label">Day 1</span>
          <span id="day-progress-count">0 / 0 activities</span>
        </div>
        <div class="day-progress-track">
          <div class="day-progress-fill" id="day-progress-fill"></div>
        </div>
        <div class="day-progress-segments" id="day-progress-segments"></div>
      </div>
      <div class="content-grid" id="content-grid"></div>
    </div>
```

- [ ] **Step 2: Add day complete overlay element**

Find the focus mode UI block (~line 260):
```html
  <!-- Focus Mode UI — shown/hidden by CSS via body.focus-mode class, no inline styles needed -->
```

Insert the following BEFORE that comment:
```html
  <!-- Day Complete Overlay (H7) -->
  <div id="day-complete-overlay">
    <div class="day-complete-card">
      <div class="day-complete-emoji" id="day-complete-emoji">🎉</div>
      <div class="day-complete-title" id="day-complete-title">Day Complete</div>
      <div class="day-complete-subtitle" id="day-complete-subtitle"></div>
      <div class="day-complete-stats">
        <div class="day-complete-stat">
          <div class="day-complete-stat-value" id="day-complete-count">0</div>
          <div class="day-complete-stat-label">Activities</div>
        </div>
      </div>
      <button class="day-complete-btn" id="day-complete-btn">Next Day →</button>
    </div>
  </div>

```

- [ ] **Step 3: Add attention anchor to focus header**

Find the focus header block (~line 261):
```html
  <div class="focus-header" id="focus-header">
    <button id="focus-back-btn">← Back to Day</button>
    <span class="focus-step-label" id="focus-step-label"></span>
    <div class="focus-step-dots" id="focus-step-dots"></div>
  </div>
```

Replace with:
```html
  <div class="focus-header" id="focus-header">
    <button id="focus-back-btn">← Back to Day</button>
    <span class="focus-step-label" id="focus-step-label"></span>
    <div class="focus-step-dots" id="focus-step-dots"></div>
    <div class="focus-attention-anchor" id="focus-attention-anchor"></div>
  </div>
```

- [ ] **Step 4: Verify in browser**

Reload. Progress bar is hidden (style="display:none" until JS wires it). Day complete overlay is hidden. Focus header has the anchor element (invisible until Focus Mode is entered). Page should look identical to before.

- [ ] **Step 5: Commit**

```bash
git add units/alicogia/index.html
git commit -m "feat: add day progress bar, day complete overlay, and focus attention anchor HTML"
```

---

## Chunk 2: cards.js

---

### Task 5: buildActivityEl — Type Strip and Step Dots

**Files:**
- Modify: `js/cards.js` (functions `buildActivityEl`, `grPhaseLabel`)

**Context:** `buildActivityEl(activity)` creates each card's DOM. We need to add a `.activity-type-strip` as the first child and `.activity-step-dots` inside `.activity-header`. The activity object has `.type` and `.grPhase` properties.

- [ ] **Step 1: Add type label map and dot count map**

In `cards.js`, add these two maps immediately before `buildActivityEl`:

```js
// ── Type strip labels (H1) ──
const ACTIVITY_TYPE_LABELS = {
  'mc':                 '📝 Multiple Choice',
  'vocabulary':         '📖 Vocabulary',
  'written-response':   '✍️ Written Response',
  'organizer-row':      '🗂 Organizer',
  'passage-annotation': '🔍 Passage Annotation'
};

// ── Step dot counts by type+phase (H3) — mirrors focus.js STEPS ──
const STEP_DOT_COUNTS = {
  'mc':                            4,
  'vocabulary':                    3,
  'written-response':              3,
  'organizer-row-i-do':            2,
  'organizer-row-we-do':           4,
  'organizer-row-you-do':          3,
  'organizer-row-you-do-partner':  3,
  'passage-annotation':            4
};
function getStepDotCount(type, grPhase) {
  if (type === 'organizer-row') return STEP_DOT_COUNTS['organizer-row-' + grPhase] || 3;
  return STEP_DOT_COUNTS[type] || 1;
}
```

- [ ] **Step 2: Update `buildActivityEl` to add type strip**

Find the current `buildActivityEl` function. At the start, after `el.dataset.activityId = activity.id;`, replace the `el.innerHTML = ...` assignment with an updated version that adds the type strip as the first child:

```js
  const typeLabel = ACTIVITY_TYPE_LABELS[activity.type] || activity.type;
  const dotCount = getStepDotCount(activity.type, activity.grPhase);
  const dotsHTML = Array.from({ length: dotCount }, (_, i) =>
    `<div class="step-dot${i === 0 ? ' step-dot--active' : ''}"></div>`
  ).join('');

  el.innerHTML = `
    <div class="activity-type-strip">${esc(typeLabel)}</div>
    <div class="activity-header">
      ${badgeHTML}
      <span class="activity-title">${esc(activity.title)}</span>
      <div class="activity-strategy-badges">${stratBadges}</div>
      <div class="activity-step-dots">${dotsHTML}</div>
      <button class="activity-focus-btn" data-id="${esc(activity.id)}" title="Focus Mode">⊡ Focus</button>
    </div>
    <div class="activity-body">
      ${buildActivityBody(activity)}
    </div>`;
```

Note: the `badgeHTML` and `stratBadges` variables are computed earlier in the function — keep those lines as-is.

- [ ] **Step 3: Verify in browser**

Reload. Each activity card should now have:
- A top strip with the activity type label (e.g., "📝 Multiple Choice")
- Step dots visible in the card header (indigo glowing dot for step 1, gray dots for rest)

- [ ] **Step 4: Commit**

```bash
git add js/cards.js
git commit -m "feat: add activity type strip and step dots to card header"
```

---

### Task 6: Body Builders — Instruction Labels

**Files:**
- Modify: `js/cards.js` (functions `buildMcBody`, `buildOrganizerRowBody`, `buildVocabBody`, `buildWrittenResponseBody`, `buildPassageAnnotationBody`)

**Context:** Each activity body builder needs `.activity-instruction` div elements added to guide students.

- [ ] **Step 1: Update `buildMcBody`**

Find `buildMcBody`. Replace the return template's opening:
```js
  return `
    <p style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">4 min timed · STOP strategy available</p>
    <p class="bellringer-passage">${esc(data.stem)}</p>
    <div class="mc-options-list" ...>${optionsHTML}</div>
```

With:
```js
  return `
    <div class="activity-instruction">👀 Read the passage stem carefully</div>
    <p class="bellringer-passage">${esc(data.stem)}</p>
    <div class="activity-instruction">✏️ Which answer is supported by the text?</div>
    <div class="mc-options-list" style="display:flex;flex-direction:column;gap:0;">${optionsHTML}</div>
    ${writtenHTML}`;
```

(Remove the old `<p style="font-size:11px...">4 min timed...</p>` line — it clutters the card.)

- [ ] **Step 2: Update `buildOrganizerRowBody`**

In `buildOrganizerRowBody`, before the final return template string, there's a benchmark focus line. Add an instruction label after the column headers:

In the return template, after the column header row div, add:
```js
    <div class="activity-instruction">✏️ Fill in your row</div>
```

Full return should look like:
```js
  return `
    <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;">${esc(data.benchmarkFocus)}</div>
    <div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:grid;grid-template-columns:80px 1fr 1fr;gap:6px;margin-bottom:4px;">
      <div></div>${data.columns.slice(1).map(c => `<div>${esc(c)}</div>`).join('')}
    </div>
    <div class="activity-instruction">✏️ Fill in your row</div>
    <div class="activity-org-row">
      <div class="org-cell-badge" style="background:${esc(color)}">${esc(data.label)}</div>
      ${cellsHTML}
    </div>`;
```

- [ ] **Step 3: Update `buildVocabBody`**

In `buildVocabBody`, add an instruction label at the very top (before `vocab-word`) and an ESOL instruction label conditionally:

```js
  return `
    <div class="activity-instruction">👀 Read the word and definition</div>
    <div class="vocab-word" style="font-size:20px;font-weight:800;color:var(--text-primary);">${esc(data.word)}</div>
    <div class="vocab-pos" style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${esc(data.partOfSpeech)}</div>
    <div class="vocab-def" style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px;">${esc(data.definition)}</div>
    <div class="vocab-example" style="font-size:12px;color:var(--text-muted);font-style:italic;">"${esc(data.exampleSentence)}"</div>
    ${esolHTML ? `<div class="activity-instruction">✏️ Complete the sentence frame</div>${esolHTML}` : ''}`;
```

Note: The inline styles on `vocab-word`, `vocab-pos`, `vocab-def`, and `vocab-example` are preserved from the original function — copy them exactly from `buildVocabBody` in the current source to avoid breaking the layout.

- [ ] **Step 4: Update `buildWrittenResponseBody`**

In `buildWrittenResponseBody`, add an instruction label above the RACE frame:

```js
  return `
    <div style="font-size:13px;color:var(--text-primary);font-weight:600;margin-bottom:12px;">${esc(data.prompt)}</div>
    <div class="activity-instruction">✏️ Build your response using the frame below</div>
    <div class="activity-race-frame">
      <div class="race-labels">${makeRows(raceSteps)}</div>
      <div class="cer-labels">${makeRows(cerSteps)}</div>
    </div>`;
```

- [ ] **Step 5: Update `buildPassageAnnotationBody`**

Add an instruction label above the passage:

```js
  return `
    <div class="activity-instruction">👀 Read and annotate the passage</div>
    <div id="passage-text">${parasHTML}</div>
    ${cubesHTML ? `<div class="cubes-guide" style="margin-top:14px;">
      <div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">CUBES Guide</div>
      ${cubesHTML}
    </div>` : ''}`;
```

(Remove the old `<p style="font-size:11px...">Use the Passage drawer (→)...</p>` line.)

- [ ] **Step 6: Verify in browser**

Reload. Each activity card body should show instruction labels in the accent text color. The MC card should show "👀 Read the passage stem carefully" above the passage text, etc.

- [ ] **Step 7: Commit**

```bash
git add js/cards.js
git commit -m "feat: add instruction labels to all activity body builders"
```

---

### Task 7: Session State, markActivityDone, updateDayProgress, renderActivities update

**Files:**
- Modify: `js/cards.js`

**Context:** This task adds the session state Set, the `markActivityDone` function called by `focus.js` on exit, and `updateDayProgress` which updates the progress bar HTML and re-applies done state after renders.

- [ ] **Step 1: Add session state at top of cards.js**

After the `esc()` function (line ~9), add:

```js
// ── Session state: track which activities are done this session ──
window.doneActivityIds = new Set();
```

- [ ] **Step 2: Add `window.markActivityDone`**

After `renderActivities()`, add:

```js
// ── Mark an activity done (called by focus.js on exit) ──
window.markActivityDone = function markActivityDone(id) {
  if (!id) return;
  window.doneActivityIds.add(id);
  const cardEl = document.querySelector(`[data-activity-id="${id}"]`);
  if (cardEl) applyDoneState(cardEl, id);
  updateDayProgress(window.currentDay);
};

function applyDoneState(cardEl, id) {
  if (!cardEl.classList.contains('activity--done')) {
    cardEl.classList.add('activity--done');
    // Add the done summary bar with review button
    const titleEl = cardEl.querySelector('.activity-title');
    const title = titleEl ? titleEl.textContent : 'Activity';
    const summaryEl = document.createElement('div');
    summaryEl.className = 'activity-done-summary';
    summaryEl.innerHTML = `
      <span style="color:#4ade80;font-weight:700;">${esc(title)} — Complete</span>
      <button class="activity-done-review-btn" data-id="${esc(id)}">Review ↓</button>`;
    summaryEl.querySelector('.activity-done-review-btn').addEventListener('click', () => {
      cardEl.classList.toggle('activity--done-expanded');
      summaryEl.querySelector('.activity-done-review-btn').textContent =
        cardEl.classList.contains('activity--done-expanded') ? 'Collapse ↑' : 'Review ↓';
    });
    cardEl.appendChild(summaryEl);
  }
}
```

- [ ] **Step 3: Add `updateDayProgress`**

Add after `markActivityDone`:

```js
// ── Update the day progress bar and re-apply done states ──
function updateDayProgress(day) {
  const barEl    = document.getElementById('day-progress-bar');
  const fillEl   = document.getElementById('day-progress-fill');
  const segsEl   = document.getElementById('day-progress-segments');
  const labelEl  = document.getElementById('day-progress-label');
  const countEl  = document.getElementById('day-progress-count');
  if (!barEl || typeof UNIT === 'undefined' || !UNIT.days) return;

  const activities = buildActivities(UNIT.days[day]);
  const total = activities.length;
  if (total === 0) { barEl.style.display = 'none'; return; }
  barEl.style.display = '';

  // Count done activities for THIS day
  const doneActivities = activities.filter(a => window.doneActivityIds.has(a.id));
  const doneCount = doneActivities.length;

  // Update text
  if (labelEl) labelEl.textContent = 'Day ' + day + ' of ' + UNIT.meta.days;
  if (countEl) countEl.textContent = doneCount + ' / ' + total + ' activities';

  // Fill bar
  const pct = total > 0 ? (doneCount / total) * 100 : 0;
  if (fillEl) fillEl.style.width = pct + '%';

  // Segments
  if (segsEl) {
    segsEl.innerHTML = activities.map((a, i) => {
      const done = window.doneActivityIds.has(a.id);
      const active = !done && i === doneCount; // first incomplete
      const cls = done ? 'day-progress-segment--done' : active ? 'day-progress-segment--active' : '';
      return `<div class="day-progress-segment ${cls}"></div>`;
    }).join('');
  }

  // Re-apply done state to all cards (survives day switch and toolbar re-renders)
  window.doneActivityIds.forEach(id => {
    const cardEl = document.querySelector(`[data-activity-id="${id}"]`);
    if (cardEl && !cardEl.classList.contains('activity--done')) {
      applyDoneState(cardEl, id);
    }
  });

  // Show day complete overlay if all done
  if (doneCount === total) showDayCompleteOverlay(day, total);
}
```

- [ ] **Step 4: Add `showDayCompleteOverlay`**

```js
function showDayCompleteOverlay(day, totalActivities) {
  const overlay  = document.getElementById('day-complete-overlay');
  const emoji    = document.getElementById('day-complete-emoji');
  const title    = document.getElementById('day-complete-title');
  const subtitle = document.getElementById('day-complete-subtitle');
  const countEl  = document.getElementById('day-complete-count');
  const btn      = document.getElementById('day-complete-btn');
  if (!overlay) return;

  const isLastDay = day >= UNIT.meta.days;
  const dayData   = UNIT.days[day];
  const dayLabel  = dayData && dayData.label ? dayData.label : '';

  if (emoji)    emoji.textContent    = isLastDay ? '🏆' : '🎉';
  if (title)    title.textContent    = isLastDay ? 'Unit Complete!' : 'Day ' + day + ' Complete';
  if (subtitle) subtitle.textContent = isLastDay ? 'Great work this unit!' : (dayLabel || '');
  if (countEl)  countEl.textContent  = totalActivities;
  if (btn) {
    btn.textContent = isLastDay ? 'Back to Day 1' : 'Day ' + (day + 1) + ' →';
    btn.onclick = () => {
      // Persist done day to localStorage
      const unitId = (UNIT.meta && (UNIT.meta.id || UNIT.meta.title)) || 'default';
      const key = 'ir-done-days-' + unitId;
      const done = JSON.parse(localStorage.getItem(key) || '[]');
      if (!done.includes(day)) { done.push(day); localStorage.setItem(key, JSON.stringify(done)); }
      overlay.classList.remove('visible');
      if (typeof window.switchDay === 'function') {
        window.switchDay(isLastDay ? 1 : day + 1);
      }
    };
  }
  overlay.classList.add('visible');
}
```

- [ ] **Step 5: Call `updateDayProgress` at end of `renderActivities`**

Find the end of `renderActivities()`, just before the closing `}`. The current last lines are:
```js
  applyRevealState(document.body.classList.contains('reveal-answers'));
  applyTeacherView(!document.body.classList.contains('student-view'));
  if (typeof updateProgressPanel === 'function') updateProgressPanel(day);
```

Insert `updateDayProgress(day)` **before** `applyRevealState` and `applyTeacherView` — the spec requires this order so done-state collapsing happens before reveal-state and teacher-view visibility are applied:

```js
  updateDayProgress(day);   // ← ADD HERE (before applyRevealState)
  applyRevealState(document.body.classList.contains('reveal-answers'));
  applyTeacherView(!document.body.classList.contains('student-view'));
  if (typeof updateProgressPanel === 'function') updateProgressPanel(day);
```

Remove the original `applyRevealState`, `applyTeacherView`, and `updateProgressPanel` lines and replace with the block above (4 lines total, `updateDayProgress` first).

**Note:** `window.markActivityDone` is defined in this task but will not be called until Task 9 wires `focus.js` to call it on exit. The progress bar will show "0 / N activities" until Task 9 is complete — that is expected.

- [ ] **Step 6: Verify in browser**

1. Reload the page. The progress bar should appear above the content grid showing "Day 1 of 6" and "0 / N activities"
2. Open the browser console — no errors
3. Segments should show (all gray initially)

- [ ] **Step 7: Commit**

```bash
git add js/cards.js
git commit -m "feat: add session done state, progress bar, and day complete overlay logic"
```

---

## Chunk 3: nav.js and focus.js

---

### Task 8: nav.js — Per-Day Accent, Sidebar Status, Day Fade, Theme Hook

**Files:**
- Modify: `js/nav.js`
- Modify: `js/theme.js`

**Context:** `switchDay()` needs to set CSS accent variables, update sidebar button states with the new three-class system, and fade the content grid. `theme.js` needs a one-line hook so theme switching re-applies the per-day accent.

- [ ] **Step 1: Add `setDayAccent` helper to nav.js**

In `nav.js`, before `document.addEventListener('DOMContentLoaded', ...)`, add:

```js
// ── Per-day accent color system (I2) ──
const DAY_PALETTES = [
  // Days 1-2: Indigo
  { accent:'#6366f1', rgb:'99,102,241', text:'#a5b4fc', bg:'#1e1b4b', border:'#312e81' },
  // Days 3-4: Emerald
  { accent:'#10b981', rgb:'16,185,129', text:'#6ee7b7', bg:'#022c22', border:'#064e3b' },
  // Days 5-6: Amber
  { accent:'#f59e0b', rgb:'245,158,11', text:'#fcd34d', bg:'#1c0a00', border:'#78350f' }
];

window.setDayAccent = function setDayAccent(day) {
  const palette = DAY_PALETTES[Math.floor((day - 1) / 2) % 3];
  const root = document.documentElement;
  root.style.setProperty('--day-accent',        palette.accent);
  root.style.setProperty('--day-accent-rgb',    palette.rgb);
  root.style.setProperty('--day-accent-text',   palette.text);
  root.style.setProperty('--day-accent-bg',     palette.bg);
  root.style.setProperty('--day-accent-border', palette.border);
  root.style.setProperty('--accent',            palette.accent); // backward compat
};
```

- [ ] **Step 2: Add theme.js hook**

Open `js/theme.js`. Find the `applyTheme` function (line ~21). At the very end of the function body, before the closing `}`, add:

```js
    // Re-apply per-day accent after theme change (day accent wins over theme accent)
    if (typeof window.setDayAccent === 'function') window.setDayAccent(window.currentDay || 1);
```

The full end of `applyTheme` should look like:
```js
  function applyTheme(t) {
    document.body.className = document.body.className.replace(/\btheme-\w+\b/g, '').trim();
    document.body.classList.add('theme-' + t);
    // ... (existing lines) ...
    if (typeof window.setDayAccent === 'function') window.setDayAccent(window.currentDay || 1);
  }
```

- [ ] **Step 3: Update `switchDay` — call setDayAccent + day fade**

Inside `window.switchDay`, at the very top of the function body (before the localStorage line), add:

```js
    window.setDayAccent(day);
```

Then find where `renderDayContent(day)` is called and wrap it in the `requestAnimationFrame` fade pattern:

Replace:
```js
    // Render content
    if (typeof renderDayContent === 'function') renderDayContent(day);
    if (typeof window.populatePassageDrawer === 'function') window.populatePassageDrawer(day);
```

With:
```js
    // Render content with fade transition (I4)
    const grid = document.getElementById('content-grid');
    if (grid) grid.style.opacity = '0';
    requestAnimationFrame(() => {
      if (typeof renderDayContent === 'function') renderDayContent(day);
      if (typeof window.populatePassageDrawer === 'function') window.populatePassageDrawer(day);
      requestAnimationFrame(() => { if (grid) grid.style.opacity = '1'; });
    });
```

- [ ] **Step 4: Update sidebar button HTML and class logic**

Find the day button `for` loop inside `DOMContentLoaded` — look for `const sidebarDays = document.getElementById('sidebar-days');` (~line 22). Replace the entire `if (sidebarDays) { ... }` block:

```js
  if (sidebarDays) {
    const unitId = (UNIT.meta && (UNIT.meta.id || UNIT.meta.title)) || 'default';
    const doneDays = JSON.parse(localStorage.getItem('ir-done-days-' + unitId) || '[]');

    for (let d = 1; d <= UNIT.meta.days; d++) {
      const btn = document.createElement('button');
      btn.className = 'sidebar-day-btn';
      btn.dataset.day = d;
      const dayData = UNIT.days[d];
      const label = dayData && dayData.label ? 'Day ' + d + ' — ' + dayData.label : 'Day ' + d;
      const isDone = doneDays.includes(d);
      btn.innerHTML = `
        <span class="sidebar-day-indicator">${isDone ? '✓' : '○'}</span>
        <span class="sidebar-day-label">${esc(label)}</span>
        <span class="sidebar-day-status">${isDone ? 'Done' : ''}</span>`;
      btn.addEventListener('click', () => switchDay(d));
      sidebarDays.appendChild(btn);
    }
  }
```

Then update `switchDay`'s sidebar state update section. Replace:
```js
    document.querySelectorAll('.sidebar-day-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.day) === day);
    });
```

With:
```js
    const unitId2 = (UNIT.meta && (UNIT.meta.id || UNIT.meta.title)) || 'default';
    const doneDays2 = JSON.parse(localStorage.getItem('ir-done-days-' + unitId2) || '[]');
    document.querySelectorAll('.sidebar-day-btn').forEach(btn => {
      const d = parseInt(btn.dataset.day);
      const isDone = doneDays2.includes(d);
      const isActive = d === day;
      btn.classList.remove('sidebar-day--done', 'sidebar-day--active', 'sidebar-day--upcoming', 'active');
      // 'active' class removed here — the old CSS rule is also neutralised in this same task
      btn.classList.add(isDone ? 'sidebar-day--done' : isActive ? 'sidebar-day--active' : 'sidebar-day--upcoming');
      // Update indicator and status text
      const indicator = btn.querySelector('.sidebar-day-indicator');
      const status = btn.querySelector('.sidebar-day-status');
      if (indicator) indicator.textContent = isDone ? '✓' : isActive ? '●' : '○';
      if (status) status.textContent = isDone ? 'Done' : isActive ? 'Now' : '';
    });
```

Also add the CSS override that neutralises the old `.active` rule — do this in the SAME commit as the JS change so there's no broken interim state. Append to `css/main.css`:
```css
/* Neutralise old .active sidebar rule — new .sidebar-day--active handles this (Task 8) */
.sidebar-day-btn.active { background: transparent; color: inherit; font-weight: normal; }
```

Note: `esc` is not defined in nav.js — add a local minimal version at the top of the file:
```js
function navEsc(str) { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
```
And use `navEsc(label)` in the button innerHTML above.

- [ ] **Step 5: Verify in browser**

1. Reload. The accent color should be indigo (Day 1).
2. Switch to Day 3. Accent color should shift to emerald green.
3. Switch to Day 5. Accent color should shift to amber.
4. The content grid should briefly fade out and back in on day switch.
5. The sidebar should show the active day with "●" and "Now".
6. Switch themes from the toolbar — accent color should snap back to the day's color.

- [ ] **Step 6: Commit**

```bash
git add js/nav.js js/theme.js css/main.css
git commit -m "feat: add per-day accent colors, sidebar status, and day-switch fade"
```

---

### Task 9: focus.js — Attention Anchor, Card Dot Update, completedId Capture

**Files:**
- Modify: `js/focus.js`

**Context:** Three additions to `focus.js`: (1) `STEP_ANCHORS` map + `anchorKey` variable, computed in `enterFocusMode`, rendered in `updateStepUI`; (2) card dot update in `updateStepUI`; (3) capture `focusId` into `completedId` before nulling in `exitFocusMode`, then call `window.markActivityDone`.

- [ ] **Step 1: Add STEP_ANCHORS map**

Inside the IIFE, after the `STEPS` object (~line 57), add:

```js
  // ── Attention anchor text per step (I3) ──
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

- [ ] **Step 2: Add `anchorKey` scoped variable**

After `let stepDefs = [];` (line ~11), add:
```js
  let anchorKey = '';
```

- [ ] **Step 3: Compute `anchorKey` in `enterFocusMode`**

In `enterFocusMode(id)`, after `stepDefs = getStepDefs(activityEl, type);`, add:
```js
    // Compute anchor key for STEP_ANCHORS lookup
    if (type === 'organizer-row') {
      const grClass = Array.from(activityEl.classList).find(c =>
        ['activity--i-do','activity--we-do','activity--you-do-partner','activity--you-do'].includes(c)
      );
      const grKey = grClass ? grClass.replace('activity--', '') : 'we-do';
      anchorKey = 'organizer-row-' + grKey;
    } else {
      anchorKey = type || '';
    }
```

- [ ] **Step 4: Update `updateStepUI` — add anchor + card dots**

In `updateStepUI(stepIndex)`, after the existing `dotsEl` block, add:

```js
    // Attention anchor (I3)
    const anchorEl = document.getElementById('focus-attention-anchor');
    if (anchorEl) {
      const anchors = STEP_ANCHORS[anchorKey] || [];
      anchorEl.textContent = anchors[stepIndex] || stepDefs[stepIndex].label;
    }

    // Card step dots (H3)
    if (focusId) {
      const cardEl = document.querySelector(`[data-activity-id="${focusId}"]`);
      if (cardEl) {
        cardEl.querySelectorAll('.step-dot').forEach((dot, i) => {
          dot.classList.toggle('step-dot--active', i === stepIndex);
          dot.classList.toggle('step-dot--done',   i < stepIndex);
        });
      }
    }
```

- [ ] **Step 5: Update `exitFocusMode` — capture id before reset, call markActivityDone**

Find `exitFocusMode()` (~line 137). Replace the entire function:

```js
  function exitFocusMode() {
    const completedId = focusId;   // capture BEFORE reset
    focusId = null;
    currentStep = 0;
    stepDefs = [];
    anchorKey = '';

    document.querySelectorAll('.activity').forEach(el => {
      el.classList.remove('activity-dimmed', 'activity-focused');
    });
    document.body.classList.remove('focus-mode');

    // Clear attention anchor
    const anchorEl = document.getElementById('focus-attention-anchor');
    if (anchorEl) anchorEl.textContent = '';

    // Mark completed activity done
    if (completedId && typeof window.markActivityDone === 'function') {
      window.markActivityDone(completedId);
    }
  }
```

- [ ] **Step 6: Verify in browser**

1. Reload, navigate to Day 1.
2. Click ⊡ Focus on the first activity (Passage Annotation). Focus Mode opens.
3. The `.focus-attention-anchor` element should show "Read Paragraphs 1–3" in large bold text.
4. Press Space or click Next →. Anchor updates to "Read Paragraphs 4–6". Step dot on the card advances.
5. Step through to the end and click "Done ✓". The card should shift to the green done state and collapse.
6. The progress bar segment for that activity should turn green.
7. Step through all activities. When the last one completes, the Day Complete overlay should appear.
8. Click "Day 2 →". Should navigate to Day 2 with emerald accent color. Day 1 sidebar button should show "✓ Done".

- [ ] **Step 7: Commit**

```bash
git add js/focus.js
git commit -m "feat: add attention anchor, card dot updates, and activity done marking to focus.js"
```

---

## Final Verification

- [ ] Test all 6 days — accent shifts: Days 1–2 indigo, 3–4 emerald, 5–6 amber
- [ ] Test theme switcher — switching theme mid-session keeps the day accent color
- [ ] Test ESOL toggle — content re-renders, done state preserved on completed cards
- [ ] Test CER toggle — same as ESOL
- [ ] Test keyboard nav (ArrowLeft/ArrowRight) — day switch with fade works
- [ ] Test Focus Mode on all activity types — correct anchor text for each type
- [ ] Test on a unit with <6 days — no crash, palette cycles correctly
- [ ] No console errors on any day

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete classroom upgrade — Phase H clarity+momentum + Phase I visual polish"
```
