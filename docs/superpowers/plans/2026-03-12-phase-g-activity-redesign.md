# Phase G — Activity-First Unit Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the expand/collapse card grid with a vertical-scroll activity sequence, add a slide-out passage drawer, redesign Focus Mode to zoom into individual activities with step-through, and collapse the toolbar into popover groups.

**Architecture:** An adapter (`js/activities.js`) converts the existing `data.js` schema into an ordered Activity array at render time — no data changes required. `js/cards.js` is rewritten to render activities instead of cards. A new `js/focus.js` handles Focus Mode step-through. `js/toolbar.js` is restructured around popover group buttons.

**Tech Stack:** Vanilla JS, HTML5, CSS custom properties. No framework, no build step. Deployed to GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-03-12-phase-g-activity-redesign.md`

---

## Chunk 1: CSS Foundation

### Task 1: CSS — activity styles, passage drawer, focus mode, popovers; remove card and split-screen styles

**Files:**
- Modify: `css/main.css`

**Context:** `main.css` is 693 lines. The card styles are at lines 133–144 (`.card`, `.card.expanded`, `.card-body`, `.card-header`, etc.). The content grid is at line 131. Split screen styles appear later in the file. All new styles are appended at the end.

- [ ] **Step 1: Read `css/main.css`** fully to identify every rule to remove.

  Key sections to remove:
  - Line 131: `.content-grid` — replace 2-column grid with single-column
  - Lines 133–144: `.card`, `.card.expanded`, `.card-body`, `.card-header`, `.card-toggle`, `.card-collapsed-hint`, `.card.dimmed`
  - Any `.split-screen` or `body.split-screen` rules
  - Any `.in-focus` rules on `.card`

- [ ] **Step 2: Edit `css/main.css` — replace the content-grid rule (line 131):**

  Old:
  ```css
  .content-grid { background: var(--bg-page); padding: 20px 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  ```
  New:
  ```css
  .content-grid { background: var(--bg-page); padding: 16px 24px; display: flex; flex-direction: column; gap: 12px; }
  ```

- [ ] **Step 3: Remove card styles from `css/main.css`** — delete the block from `.card {` through `.card.expanded .card-collapsed-hint { display: none; }` (lines 133–144 approximately). Leave all card content styles below (`.bellringer-passage`, `.mc-option`, etc.) — those are reused.

- [ ] **Step 4: Search `css/main.css` for `split-screen` and remove any matching rules. Also search for `body.focus-mode .card` and remove the old card-based focus mode block (approximately lines 439–441: `body.focus-mode .card:not(.in-focus)` and `body.focus-mode .card.in-focus`) — these become inert dead CSS and will cause confusion when reading the file.**

- [ ] **Step 5: Append the following new CSS block to the END of `css/main.css`:**

```css
/* ===== PHASE G: ACTIVITY LAYOUT ===== */

/* ── Activity Cards ── */
.activity {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--activity-phase-color, var(--accent));
  border-radius: 8px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.activity--i-do          { --activity-phase-color: #4a7c59; }
.activity--we-do         { --activity-phase-color: #7aaa89; }
.activity--you-do-partner{ --activity-phase-color: #9c7e5a; }
.activity--you-do        { --activity-phase-color: #888; }

.activity-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-light, var(--border));
  background: var(--bg-header);
}
.activity-gr-badge {
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 3px 7px;
  color: #fff;
  flex-shrink: 0;
}
.activity-gr-badge.gr-i-do           { background: #4a7c59; }
.activity-gr-badge.gr-we-do          { background: #7aaa89; }
.activity-gr-badge.gr-you-do-partner { background: #9c7e5a; }
.activity-gr-badge.gr-you-do         { background: #777; }

.activity-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.3px;
  flex: 1;
}
.activity-strategy-badges {
  display: flex;
  gap: 4px;
}
.activity-strategy-badge {
  font-size: 8px;
  font-weight: 700;
  border-radius: 3px;
  padding: 2px 5px;
}
.badge-stop  { background: rgba(220,38,38,0.15);  color: #ef4444; }
.badge-cubes { background: rgba(59,130,246,0.15); color: #3b82f6; }
.badge-race  { background: rgba(34,197,94,0.15);  color: #22c55e; }
.badge-cer   { background: rgba(234,179,8,0.15);  color: #ca8a04; }

.activity-focus-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: 4px;
  padding: 3px 7px;
  font-size: 10px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.activity-focus-btn:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

.activity-body {
  padding: 14px 16px;
}

/* Teacher notes block */
.teacher-notes-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 4px solid var(--card-teacher, #888);
  border-radius: 8px;
  padding: 12px 16px;
}
.teacher-notes-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.teacher-notes-body {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.7;
  white-space: pre-wrap;
}

/* MC options (new interactive style) */
.mc-option-btn {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  text-align: left;
  font-size: 13px;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg-page);
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 5px;
  transition: background 0.1s, border-color 0.1s;
}
.mc-option-btn:hover { background: var(--accent-light); border-color: var(--accent-border); }
.mc-option-btn.mc-selected { border-color: var(--accent); background: var(--accent-light); color: var(--text-primary); font-weight: 600; }
.mc-option-btn.mc-correct { border-color: #22c55e; background: rgba(34,197,94,0.1); color: #16a34a; }
.mc-option-btn.mc-eliminated { opacity: 0.35; text-decoration: line-through; pointer-events: none; }
.mc-letter { font-weight: 800; min-width: 18px; flex-shrink: 0; }
.mc-stop-label {
  display: none;
  font-size: 8px;
  font-weight: 800;
  border-radius: 3px;
  padding: 2px 5px;
  margin-left: auto;
  flex-shrink: 0;
}
body.stop-active .mc-stop-label { display: inline-block; }
.stop-proven   { background: #166534; color: #86efac; }
.stop-opposite { background: #7f1d1d; color: #fca5a5; }
.stop-silly    { background: #1e3a5f; color: #93c5fd; }
.stop-tricky   { background: #78350f; color: #fcd34d; }

/* Organizer exemplar text (I Do model) — hidden by default, revealed by Reveal Answers or Teacher View */
.exemplar-text { opacity: 0.15; }

/* RACE / CER frames in activities */
.activity-race-frame {
  margin-top: 12px;
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.2);
  border-radius: 6px;
  padding: 10px 14px;
}
/* CER label swap — hide cer-labels by default; swap on body.cer-active */
.cer-labels { display: none; }
body.cer-active .race-labels { display: none; }
body.cer-active .cer-labels  { display: block; }
.activity-frame-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 12px;
}
.activity-frame-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #22c55e;
  min-width: 52px;
  padding-top: 1px;
}
.activity-frame-text { color: var(--text-secondary); font-style: italic; line-height: 1.5; }

/* Organizer row inside activity */
.activity-org-row {
  display: grid;
  grid-template-columns: 80px 1fr 1fr;
  gap: 6px;
  margin-bottom: 6px;
}
.org-cell-badge {
  font-size: 8px;
  font-weight: 800;
  padding: 6px;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.org-cell-content {
  background: var(--bg-page);
  border-radius: 4px;
  padding: 7px 10px;
  font-size: 12px;
  color: var(--text-secondary);
}
.org-cell-placeholder {
  background: transparent;
  border: 1px dashed var(--border);
  border-radius: 4px;
  padding: 7px 10px;
  font-size: 11px;
  color: var(--text-muted);
  font-style: italic;
}

/* ── PASSAGE DRAWER ── */
.passage-drawer {
  position: fixed;
  top: var(--toolbar-total-height, 130px);
  right: 0;
  bottom: 0;
  width: 480px;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  box-shadow: -4px 0 24px rgba(0,0,0,0.15);
  z-index: 100;
  transform: translateX(100%);
  transition: transform 0.25s ease;
  display: flex;
  flex-direction: column;
}
.passage-drawer--open { transform: translateX(0); }

.passage-drawer-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.passage-drawer-tab {
  position: absolute;
  left: -32px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-right: none;
  border-radius: 6px 0 0 6px;
  padding: 12px 6px;
  cursor: pointer;
  writing-mode: vertical-rl;
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 4px;
}
.passage-drawer-tab:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

.passage-drawer-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.passage-drawer-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  flex: 1;
}
.passage-drawer-header button {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: 4px;
  padding: 3px 7px;
  font-size: 10px;
  cursor: pointer;
}
.passage-drawer-header button:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

.passage-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 16px;
  position: relative;
}
.passage-drawer-empty {
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
  padding: 24px 0;
}

#passage-drawer-canvas {
  position: absolute;
  top: 0; left: 0;
  pointer-events: none;
  z-index: 2;
}
#passage-drawer-canvas.visible { pointer-events: all; }

.passage-cubes-toolbar {
  display: none;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg-header);
}
.passage-cubes-toolbar.visible { display: flex; }

@media (max-width: 1023px) { .passage-drawer { width: 380px; } }
@media (max-width: 599px)  { .passage-drawer { width: 100vw; } }

/* ── FOCUS MODE ── */
body.focus-mode .content-area { overflow: hidden; }
body.focus-mode .activity { display: none; }
body.focus-mode .activity.activity-focused {
  display: block;
  position: fixed;
  top: var(--toolbar-total-height, 130px);
  left: var(--sidebar-width, 200px);
  right: 0;
  bottom: 0;
  z-index: 50;
  overflow-y: auto;
  background: var(--bg-page);
  padding: 0;
  border-radius: 0;
  border: none;
}
body.focus-mode .teacher-notes-block { display: none; }

.focus-header {
  display: none;
  position: fixed;
  top: var(--toolbar-total-height, 130px);
  left: var(--sidebar-width, 200px);
  right: 0;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border);
  padding: 8px 16px;
  z-index: 51;
  align-items: center;
  gap: 12px;
}
body.focus-mode .focus-header { display: flex; }

#focus-back-btn {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 11px;
  cursor: pointer;
}
#focus-back-btn:hover { background: var(--bg-card); }

.focus-step-label {
  font-size: 11px;
  color: var(--text-secondary);
  flex: 1;
}
.focus-step-dots {
  display: flex;
  gap: 5px;
  align-items: center;
}
.focus-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border);
  transition: background 0.15s;
}
.focus-dot.done   { background: #22c55e; }
.focus-dot.active { background: var(--accent); }

.focus-nav {
  display: none;
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width, 200px);
  right: 0;
  background: var(--bg-header);
  border-top: 1px solid var(--border);
  padding: 10px 16px;
  z-index: 51;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
body.focus-mode .focus-nav { display: flex; }

.focus-nav-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.focus-nav-btn:disabled { opacity: 0.35; cursor: default; }
.focus-nav-btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); font-weight: 700; }
.focus-nav-btn.primary:hover { opacity: 0.9; }
.focus-step-info { font-size: 11px; color: var(--text-muted); }

/* Focused activity inner padding (offset for fixed header/footer) */
.activity-focused .activity-header { padding-top: 52px; }
.activity-focused .activity-body   { padding-bottom: 64px; }

/* ── TOOLBAR POPOVERS ── */
.tool-group-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background: rgba(0,0,0,0.07);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  position: relative;
}
.tool-group-btn:hover { background: rgba(0,0,0,0.12); }
.tool-group-btn.active { background: var(--accent); color: #fff; }
.tool-group-btn.popover-open { background: var(--bg-card); border-bottom-left-radius: 0; border-bottom-right-radius: 0; }

.toolbar-popover {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 0 6px 6px 6px;
  padding: 6px;
  display: none;
  flex-direction: column;
  gap: 2px;
  z-index: 200;
  box-shadow: var(--shadow-lifted);
}
.toolbar-popover.popover--open { display: flex; }

.popover-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  font-size: 12px;
  padding: 7px 10px;
  border-radius: 5px;
  border: none;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.1s;
  white-space: nowrap;
}
.popover-btn:hover { background: rgba(0,0,0,0.06); }
.popover-btn.active { background: var(--accent); color: #fff; }
.popover-btn .popover-label { flex: 1; }
.popover-btn .popover-value { font-size: 10px; color: var(--text-muted); }
.popover-btn.active .popover-value { color: rgba(255,255,255,0.7); }
.popover-divider { height: 1px; background: var(--border); margin: 3px 0; }

/* Strategies popover — color-coded active states */
.popover-btn.strat-stop.active  { background: #7f1d1d; color: #fca5a5; }
.popover-btn.strat-cubes.active { background: #1e3a5f; color: #93c5fd; }
.popover-btn.strat-race.active  { background: #1e3a2e; color: #86efac; }
.popover-btn.strat-cer.active   { background: #3a2e1e; color: #fcd34d; }

/* Sidebar width CSS var (used by focus mode positioning) */
.page-layout { --sidebar-width: 200px; }
.page-layout .sidebar.collapsed ~ .content-area { --sidebar-width: 0px; }
```

- [ ] **Step 6: Verify the file saved correctly** — check that `.activity` styles exist and `.card.expanded` is gone:
  ```bash
  grep -n "\.card\.expanded\|\.activity {" /Users/alexanderburger/Desktop/ir-platform/css/main.css
  ```
  Expected: only `.activity {` found, no `.card.expanded`.

- [ ] **Step 7: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add css/main.css
  git commit -m "feat(G): add activity layout, passage drawer, focus mode, popover CSS; remove card styles"
  ```

---

## Chunk 2: Adapter + Activity Renderer

### Task 2: Create js/activities.js — the data adapter

**Files:**
- Create: `js/activities.js`

**Context:** This file converts the existing `data.js` day object into an ordered Activity array. The day object has: `bellringer`, `organizer`, `vocabulary`, `textPassage`, `esol`, `raceFrames`, `teacherNotes`, `progressItems`, `pacingGuide`, `exitTicket`, `engageActivities`. Only the first 5 + `raceFrames` + `textPassage` become activities.

- [ ] **Step 1: Create `js/activities.js` with the following content:**

```js
// js/activities.js
// Adapter: converts a data.js day object into an ordered Activity array.
// No changes to data.js files are required.

function buildActivities(dayData) {
  if (!dayData) return [];
  const activities = [];

  // ── Passage Annotation first (I Do — sets context before all other activities) ──
  if (dayData.textPassage && dayData.textPassage.paragraphs && dayData.textPassage.paragraphs.length) {
    activities.push({
      id: 'passage-annotation',
      type: 'passage-annotation',
      grPhase: 'i-do',
      title: 'Text Passage',
      strategies: ['cubes'],
      data: {
        paragraphs: dayData.textPassage.paragraphs,
        cubesGuide: dayData.textPassage.cubesGuide || []
      }
    });
  }

  // ── Bellringer MC questions ──
  if (dayData.bellringer && dayData.bellringer.questions) {
    dayData.bellringer.questions.forEach((q, i) => {
      activities.push({
        id: 'bellringer-q' + i,
        type: 'mc',
        grPhase: 'we-do',
        title: 'Bellringer · Q' + (i + 1),
        strategies: ['stop'],
        data: {
          stem: q.stem,
          options: q.options || [],
          writtenPrompt: q.writtenPrompt || null,
          writtenModel: q.writtenModel || null
        }
      });
    });
  }

  // ── Organizer rows (one activity per row) ──
  if (dayData.organizer && dayData.organizer.rows) {
    const benchmarkFocus = dayData.organizer.benchmarkFocus || '';
    const columns = dayData.organizer.columns || [];
    dayData.organizer.rows.forEach((row, i) => {
      activities.push({
        id: 'organizer-row-' + i,
        type: 'organizer-row',
        grPhase: labelToGrPhase(row.label),
        title: 'Organizer · ' + (row.label || ''),
        strategies: ['cubes'],
        data: {
          benchmarkFocus,
          columns,
          label: row.label,
          cells: row.cells || [],
          isPreFilled: !!row.isPreFilled
        }
      });
    });
  }

  // ── Vocabulary (one activity per word) ──
  if (dayData.vocabulary && dayData.vocabulary.length) {
    dayData.vocabulary.forEach((v, i) => {
      activities.push({
        id: 'vocab-' + i,
        type: 'vocabulary',
        grPhase: 'we-do',
        title: 'Vocabulary · ' + (v.word || ''),
        strategies: [],
        data: {
          word: v.word,
          partOfSpeech: v.partOfSpeech || '',
          definition: v.definition || '',
          exampleSentence: v.exampleSentence || '',
          esolFrames: dayData.esol || null
        }
      });
    });
  }

  // ── Written Response (RACE) ──
  if (dayData.raceFrames && dayData.raceFrames.task) {
    activities.push({
      id: 'written-response',
      type: 'written-response',
      grPhase: 'you-do',
      title: 'Written Response',
      strategies: ['race', 'cer'],
      data: {
        framework: 'race',
        prompt: dayData.raceFrames.task,
        frame: {
          restate: dayData.raceFrames.restate || '',
          answer:  dayData.raceFrames.answer  || '',
          cite:    dayData.raceFrames.cite    || '',
          explain: dayData.raceFrames.explain || ''
        }
      }
    });
  }

  return activities;
}

// Map row.label string to CSS-friendly grPhase key
function labelToGrPhase(label) {
  const map = {
    'I Do':               'i-do',
    'We Do':              'we-do',
    'You Do w/ Partner':  'you-do-partner',
    'You Do':             'you-do'
  };
  return map[label] || 'we-do';
}
```

- [ ] **Step 2: Verify the file was created:**
  ```bash
  wc -l /Users/alexanderburger/Desktop/ir-platform/js/activities.js
  ```
  Expected: ~90 lines.

- [ ] **Step 3: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add js/activities.js
  git commit -m "feat(G): add activities.js adapter — converts data.js schema to Activity array"
  ```

---

### Task 3: Rewrite js/cards.js — render activities instead of cards

**Files:**
- Modify: `js/cards.js`

**Context:** Current `cards.js` (235 lines) has `makeCard()`, `buildBellringerCard()`, `buildOrganizerCard()`, `buildVocabCard()`, `buildTeacherCard()`, `buildPassageCard()`, `buildEsolCard()`, `wireExpandCollapse()`, `applyRevealState()`, `applyTeacherView()`. The new version replaces the card factory with `renderActivities(day)` and individual activity renderer functions. `applyRevealState` and `applyTeacherView` are kept but updated for new DOM.

Note: `toolbar.js` calls `renderDayContent(window.currentDay)` when ESOL cycles (line 129 of toolbar.js). After this task, `renderDayContent` must still be defined (as an alias or the same function) so that toolbar.js doesn't break before it's updated in Task 7.

- [ ] **Step 1: Write the complete new `js/cards.js`:**

```js
// js/cards.js
// Renders the activity sequence for a given day using UNIT.days[day]
// Depends on: js/activities.js (buildActivities), UNIT global, window.currentEsolLevel

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Public entry point (called by nav.js on day switch) ──
function renderDayContent(day) {
  renderActivities(day);
}

function renderActivities(day) {
  const grid = document.getElementById('content-grid');
  if (!grid) return;

  // Coming-soon stub
  if (typeof UNIT !== 'undefined' && UNIT.meta && UNIT.meta.status === 'coming-soon') {
    grid.innerHTML = `
      <div style="text-align:center;padding:60px 24px;">
        <div style="font-size:48px;margin-bottom:16px;">📚</div>
        <div style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:8px;">${esc(UNIT.meta.title)}</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">${esc(UNIT.meta.benchmark)} — ${esc(UNIT.meta.benchmarkLabel)}</div>
        <div style="font-size:14px;color:var(--text-secondary);background:var(--accent-light);border:1px solid var(--accent-border);padding:12px 24px;border-radius:8px;display:inline-block;">Content coming soon</div>
      </div>`;
    return;
  }

  if (typeof UNIT === 'undefined') { grid.innerHTML = ''; return; }
  const dayData = UNIT.days[day];
  if (!dayData) { grid.innerHTML = '<p style="padding:20px;color:var(--text-muted)">No content for this day.</p>'; return; }

  const activities = buildActivities(dayData);
  grid.innerHTML = '';

  activities.forEach(activity => {
    grid.appendChild(buildActivityEl(activity));
  });

  // Teacher notes block (non-activity, hidden unless teacher-view)
  if (dayData.teacherNotes) {
    const notesBlock = document.createElement('div');
    notesBlock.className = 'teacher-notes-block teacher-only-hidden';
    notesBlock.innerHTML = `
      <div class="teacher-notes-label">👁 Teacher Notes</div>
      <div class="teacher-notes-body">${esc(dayData.teacherNotes)}</div>`;
    grid.appendChild(notesBlock);
  }

  // Re-apply current state
  applyRevealState(document.body.classList.contains('reveal-answers'));
  applyTeacherView(!document.body.classList.contains('student-view'));
  if (typeof updateProgressPanel === 'function') updateProgressPanel(day);
}

// ── Activity element builder ──
function buildActivityEl(activity) {
  const el = document.createElement('div');
  el.className = `activity activity--${activity.type} activity--${activity.grPhase}`;
  el.dataset.activityId = activity.id;

  const badgeHTML = `<span class="activity-gr-badge gr-${activity.grPhase}">${grPhaseLabel(activity.grPhase)}</span>`;
  const stratBadges = activity.strategies.map(s =>
    `<span class="activity-strategy-badge badge-${s}">${s.toUpperCase()}</span>`
  ).join('');

  el.innerHTML = `
    <div class="activity-header">
      ${badgeHTML}
      <span class="activity-title">${esc(activity.title)}</span>
      <div class="activity-strategy-badges">${stratBadges}</div>
      <button class="activity-focus-btn" data-id="${esc(activity.id)}" title="Focus Mode">⊡ Focus</button>
    </div>
    <div class="activity-body">
      ${buildActivityBody(activity)}
    </div>`;

  // Wire focus button
  el.querySelector('.activity-focus-btn').addEventListener('click', () => {
    if (typeof enterFocusMode === 'function') enterFocusMode(activity.id);
  });

  return el;
}

function grPhaseLabel(phase) {
  const map = { 'i-do':'I DO', 'we-do':'WE DO', 'you-do-partner':'YOU DO W/ PARTNER', 'you-do':'YOU DO' };
  return map[phase] || phase;
}

// ── Activity body by type ──
function buildActivityBody(activity) {
  switch (activity.type) {
    case 'mc':                return buildMcBody(activity.data);
    case 'organizer-row':     return buildOrganizerRowBody(activity.data);
    case 'vocabulary':        return buildVocabBody(activity.data);
    case 'written-response':  return buildWrittenResponseBody(activity.data);
    case 'passage-annotation':return buildPassageAnnotationBody(activity.data);
    default: return `<p style="color:var(--text-muted)">Unknown activity type: ${esc(activity.type)}</p>`;
  }
}

// ── MC ──
function buildMcBody(data) {
  const optionsHTML = data.options.map(o => `
    <button class="mc-option-btn${o.correct ? ' mc-answer-correct' : ''}"
            data-correct="${o.correct ? 'true' : 'false'}"
            data-stop-label="${esc(o.stopLabel || '')}">
      <span class="mc-letter">${esc(o.letter)}.</span>
      <span class="mc-text">${esc(o.text)}</span>
      <span class="mc-stop-label ${stopLabelClass(o.stopLabel)}">${esc(o.stopLabel || '')}</span>
    </button>`).join('');

  const writtenHTML = data.writtenPrompt ? `
    <div style="margin-top:12px;font-size:12px;color:var(--text-muted);">
      <strong>Written:</strong> ${esc(data.writtenPrompt)}
    </div>
    <div class="written-model" style="display:none;margin-top:6px;font-size:12px;color:var(--accent);font-style:italic;">${esc(data.writtenModel || '')}</div>` : '';

  return `
    <p style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">4 min timed · STOP strategy available</p>
    <p class="bellringer-passage">${esc(data.stem)}</p>
    <div class="mc-options-list" style="display:flex;flex-direction:column;gap:0;">${optionsHTML}</div>
    ${writtenHTML}`;
}

function stopLabelClass(label) {
  const map = { 'Proven':'stop-proven', 'Opposite':'stop-opposite', 'Silly':'stop-silly', 'Tricky':'stop-tricky' };
  return map[label] || '';
}

// ── Organizer Row ──
function buildOrganizerRowBody(data) {
  const phaseColors = { 'I Do':'#4a7c59', 'We Do':'#7aaa89', 'You Do w/ Partner':'#9c7e5a', 'You Do':'#888' };
  const color = phaseColors[data.label] || '#888';
  const cellsHTML = data.columns.slice(1).map((col, i) => {
    const content = data.cells[i] || '';
    if (data.isPreFilled && content) {
      return `<div class="org-cell-content exemplar-text">${esc(content)}</div>`;
    }
    return `<div class="org-cell-placeholder">${esc(content) || 'Students respond…'}</div>`;
  }).join('');

  return `
    <div style="font-size:10px;color:var(--text-muted);margin-bottom:8px;">${esc(data.benchmarkFocus)}</div>
    <div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;display:grid;grid-template-columns:80px 1fr 1fr;gap:6px;margin-bottom:4px;">
      <div></div>${data.columns.slice(1).map(c => `<div>${esc(c)}</div>`).join('')}
    </div>
    <div class="activity-org-row">
      <div class="org-cell-badge" style="background:${esc(color)}">${esc(data.label)}</div>
      ${cellsHTML}
    </div>`;
}

// ── Vocabulary ──
function buildVocabBody(data) {
  const level = window.currentEsolLevel || 'l34';
  const esol = data.esolFrames;
  let esolHTML = '';
  if (esol) {
    const tier = esol[level] || esol.l34 || esol;
    const frames = tier.frames || (Array.isArray(tier) ? tier : []);
    const wordBank = tier.wordBank || esol.wordBank || [];
    const levelLabel = { l12:'L1–2', l34:'L3–4', l5:'L5' }[level] || 'L3–4';
    if (frames.length || wordBank.length) {
      esolHTML = `
        <div class="vocab-esol-frame" style="margin-top:10px;padding:10px 12px;background:var(--bg-page);border-radius:6px;border:1px solid var(--border);">
          <div style="font-size:9px;font-weight:700;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">ESOL ${esc(levelLabel)} — Sentence Frames</div>
          ${frames.map(f => `<div style="font-size:12px;color:var(--text-secondary);font-style:italic;margin-bottom:4px;">"${esc(f.frame || f)}"</div>`).join('')}
          ${wordBank.length ? `<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">${wordBank.map(w => `<span style="background:var(--accent-light);border:1px solid var(--accent-border);border-radius:4px;padding:2px 7px;font-size:10px;color:var(--accent);">${esc(w)}</span>`).join('')}</div>` : ''}
        </div>`;
    }
  }

  // NOTE: class names (vocab-word, vocab-def, vocab-example, vocab-esol-frame) are required by
  // focus.js stepVocabWord/stepVocabDef/stepVocabFrame for progressive reveal via querySelectorAll.
  return `
    <div class="vocab-word" style="font-size:20px;font-weight:800;color:var(--text-primary);">${esc(data.word)}</div>
    <div class="vocab-pos" style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${esc(data.partOfSpeech)}</div>
    <div class="vocab-def" style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px;">${esc(data.definition)}</div>
    <div class="vocab-example" style="font-size:12px;color:var(--text-muted);font-style:italic;">"${esc(data.exampleSentence)}"</div>
    ${esolHTML}`;
}

// ── Written Response ──
// Single frame with .race-labels / .cer-labels inside.
// CSS toggles which set of labels shows: body.cer-active .race-labels { display:none } / body.cer-active .cer-labels { display:block }
function buildWrittenResponseBody(data) {
  const raceSteps = [
    { key: 'restate', label: 'R — Restate' },
    { key: 'answer',  label: 'A — Answer'  },
    { key: 'cite',    label: 'C — Cite'    },
    { key: 'explain', label: 'E — Explain' }
  ];
  const cerSteps = [
    { key: 'restate', label: 'Claim'     },
    { key: 'answer',  label: 'Evidence'  },
    { key: 'cite',    label: 'Reasoning' },
    { key: 'explain', label: 'Extension' }
  ];

  const makeRows = (steps) => steps.map(s => data.frame[s.key] ? `
    <div class="activity-frame-row">
      <span class="activity-frame-label">${esc(s.label)}</span>
      <span class="activity-frame-text">"${esc(data.frame[s.key])}"</span>
    </div>` : '').join('');

  return `
    <div style="font-size:13px;color:var(--text-primary);font-weight:600;margin-bottom:12px;">${esc(data.prompt)}</div>
    <div class="activity-race-frame">
      <div class="race-labels">${makeRows(raceSteps)}</div>
      <div class="cer-labels">${makeRows(cerSteps)}</div>
    </div>`;
}

// ── Passage Annotation ──
function buildPassageAnnotationBody(data) {
  const parasHTML = data.paragraphs.map(p =>
    `<p class="passage-para"><span class="para-num">[${esc(String(p.number))}]</span>${esc(p.text)}</p>`
  ).join('');

  const cubesHTML = data.cubesGuide.map(c =>
    `<div class="cubes-item">
      <span class="cubes-letter" style="color:var(--accent)">${esc(c.letter)}</span>
      <span class="cubes-action">${esc(c.action)}</span>
      <span class="cubes-example">e.g. "${esc(c.example)}"</span>
    </div>`
  ).join('');

  return `
    <p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">
      Use the <strong>Passage drawer (→)</strong> to annotate with CUBES tools.
    </p>
    <div id="passage-text">${parasHTML}</div>
    ${cubesHTML ? `<div class="cubes-guide" style="margin-top:14px;">
      <div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">CUBES Guide</div>
      ${cubesHTML}
    </div>` : ''}`;
}

// ── State: Reveal Answers ──
function applyRevealState(reveal) {
  // MC: show correct answer styling
  document.querySelectorAll('.mc-answer-correct').forEach(el => {
    el.classList.toggle('mc-correct', reveal);
  });
  // Written model answers
  document.querySelectorAll('.written-model').forEach(el => {
    el.style.display = reveal ? 'block' : 'none';
  });
  // Organizer exemplar rows
  document.querySelectorAll('.exemplar-text').forEach(el => {
    const row = el.closest('.activity--i-do');
    if (row) el.style.opacity = reveal ? '1' : '0.15';
  });
}

// ── State: Teacher View ──
function applyTeacherView(isTeacher) {
  document.querySelectorAll('.teacher-only-hidden').forEach(el => {
    el.style.display = isTeacher ? '' : 'none';
  });
}
```

- [ ] **Step 2: Add `<script src="../../js/activities.js"></script>` to `units/alicogia/index.html`** — place it before `<script src="../../js/cards.js"></script>`. Verify with:
  ```bash
  grep -n "activities.js\|cards.js" /Users/alexanderburger/Desktop/ir-platform/units/alicogia/index.html
  ```
  Expected: activities.js line number is lower than cards.js line number.

- [ ] **Step 3: Open `units/alicogia/index.html` in browser (file:// or local server). Switch to Day 1.** Verify:
  - Activities render in vertical scroll (no card headers with ▼ expand)
  - Bellringer questions show as MC option buttons
  - Organizer rows show with GR phase badge
  - Vocabulary shows word + definition
  - Teacher Notes block is visible (Teacher View is ON by default per toolbar.js line 90) — toggle Student View to hide it

- [ ] **Step 4: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add js/cards.js units/alicogia/index.html
  git commit -m "feat(G): rewrite cards.js — render activity sequence; add activities.js script tag"
  ```

---

## Chunk 3: Focus Mode

### Task 4: Create js/focus.js — Focus Mode with step-through

**Files:**
- Create: `js/focus.js`
- Modify: `units/alicogia/index.html` (add script tag + focus UI HTML)

**Context:** Focus Mode is triggered by clicking `⊡ Focus` on any activity card (wired in cards.js Task 3). It dims all other activities, shows the focused one full-screen, and provides step-through navigation. Steps vary by activity type (see spec). The toolbar-level `#btn-focus` enters focus mode on the topmost visible activity.

- [ ] **Step 1: Add Focus Mode HTML to `units/alicogia/index.html`** — insert immediately before `</body>`:

```html
  <!-- Focus Mode UI — shown/hidden by CSS via body.focus-mode class, no inline styles needed -->
  <div class="focus-header" id="focus-header">
    <button id="focus-back-btn">← Back to Day</button>
    <span class="focus-step-label" id="focus-step-label"></span>
    <div class="focus-step-dots" id="focus-step-dots"></div>
  </div>
  <div class="focus-nav" id="focus-nav">
    <button class="focus-nav-btn" id="focus-prev-btn">← Back</button>
    <span class="focus-step-info" id="focus-step-info"></span>
    <button class="focus-nav-btn primary" id="focus-next-btn">Next →</button>
  </div>
```

- [ ] **Step 2: Create `js/focus.js`:**

```js
// js/focus.js
// Focus Mode — zoom into a single activity with step-through navigation.
// Depends on: js/activities.js (buildActivities), js/cards.js (renderActivities),
//             UNIT global, window.currentDay

(function() {
  'use strict';

  let focusId = null;
  let currentStep = 0;
  let stepDefs = [];

  // ── Step definitions by activity type ──
  const STEPS = {
    'mc': [
      { label: 'Read',            action: stepMcRead },
      { label: 'Apply Strategy',  action: stepMcStrategy },
      { label: 'Interact',        action: stepMcInteract },
      { label: 'Confirm',         action: stepMcConfirm }
    ],
    'organizer-row-i-do': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'Teacher Models',  action: stepOrgIDoModel }
    ],
    'organizer-row-we-do': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'I Do Example',    action: stepOrgIDoModel },
      { label: 'Student Responds',action: stepOrgStudentFill },
      { label: 'Confirm',         action: stepOrgConfirm }
    ],
    'organizer-row-you-do': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'Student Responds',action: stepOrgStudentFill },
      { label: 'Confirm',         action: stepOrgConfirm }
    ],
    'organizer-row-you-do-partner': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'Partner Practice',action: stepOrgStudentFill },
      { label: 'Confirm',         action: stepOrgConfirm }
    ],
    'vocabulary': [
      { label: 'Word',            action: stepVocabWord },
      { label: 'Definition',      action: stepVocabDef },
      { label: 'Example + Frame', action: stepVocabFrame }
    ],
    'written-response': [
      { label: 'Prompt',          action: stepWrittenPrompt },
      { label: 'Frame',           action: stepWrittenFrame },
      { label: 'Model Response',  action: stepWrittenModel }
    ],
    'passage-annotation': [
      { label: 'Read ¶1–3',       action: stepPassageRead },
      { label: 'Read ¶4–6',       action: stepPassageRead2 },
      { label: 'CUBES Guide',     action: stepPassageCubes },
      { label: 'Annotate',        action: stepPassageAnnotate }
    ]
  };

  // ── Public API ──
  window.enterFocusMode = enterFocusMode;
  window.exitFocusMode  = exitFocusMode;

  // ── Init ──
  document.addEventListener('DOMContentLoaded', initFocus);

  function initFocus() {
    const backBtn  = document.getElementById('focus-back-btn');
    const prevBtn  = document.getElementById('focus-prev-btn');
    const nextBtn  = document.getElementById('focus-next-btn');

    if (backBtn) backBtn.addEventListener('click', exitFocusMode);
    if (prevBtn) prevBtn.addEventListener('click', prevStep);
    if (nextBtn) nextBtn.addEventListener('click', nextStep);

    // Toolbar-level Focus button — focuses topmost visible activity
    const btnFocusTop = document.getElementById('btn-focus');
    if (btnFocusTop) {
      btnFocusTop.addEventListener('click', () => {
        const activities = Array.from(document.querySelectorAll('.activity'));
        const topmost = activities.find(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top < window.innerHeight;
        });
        if (topmost && topmost.dataset.activityId) {
          enterFocusMode(topmost.dataset.activityId);
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // F — enter focus on topmost visible activity (works even when not in focus mode)
    if (e.key === 'f' || e.key === 'F') {
      if (!focusId) {
        const activities = Array.from(document.querySelectorAll('.activity'));
        const topmost = activities.find(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top < window.innerHeight;
        });
        if (topmost && topmost.dataset.activityId) enterFocusMode(topmost.dataset.activityId);
      }
      return;
    }
    if (!focusId) return;
    if (e.key === 'Escape')      { exitFocusMode(); return; }
    if (e.key === 'ArrowRight' || e.code === 'Space') { e.preventDefault(); nextStep(); }
    if (e.key === 'ArrowLeft')   { e.preventDefault(); prevStep(); }
  }

  // ── Enter / Exit ──
  function enterFocusMode(id) {
    focusId = id;
    currentStep = 0;

    // Determine step set
    const activityEl = document.querySelector(`[data-activity-id="${id}"]`);
    if (!activityEl) return;

    const type = getActivityType(activityEl);
    stepDefs = getStepDefs(activityEl, type);

    // Dim all others
    document.querySelectorAll('.activity').forEach(el => {
      if (el.dataset.activityId !== id) el.classList.add('activity-dimmed');
    });
    activityEl.classList.add('activity-focused');
    document.body.classList.add('focus-mode');
    // CSS body.focus-mode rules show .focus-header and .focus-nav automatically

    runStep(currentStep);
  }

  function exitFocusMode() {
    focusId = null;
    currentStep = 0;
    stepDefs = [];

    document.querySelectorAll('.activity').forEach(el => {
      el.classList.remove('activity-dimmed', 'activity-focused');
    });
    document.body.classList.remove('focus-mode');
    // CSS body.focus-mode removal hides .focus-header and .focus-nav automatically
  }

  // ── Step navigation ──
  function nextStep() {
    if (currentStep < stepDefs.length - 1) { currentStep++; runStep(currentStep); }
  }
  function prevStep() {
    if (currentStep > 0) { currentStep--; runStep(currentStep); }
  }

  function runStep(stepIndex) {
    const step = stepDefs[stepIndex];
    if (!step) return;

    updateStepUI(stepIndex);
    const activityEl = document.querySelector(`[data-activity-id="${focusId}"]`);
    if (activityEl && step.action) step.action(activityEl, stepIndex);
  }

  function updateStepUI(stepIndex) {
    const total = stepDefs.length;

    // Step label
    const labelEl = document.getElementById('focus-step-label');
    if (labelEl) labelEl.textContent = `Step ${stepIndex + 1} of ${total} — ${stepDefs[stepIndex].label}`;

    // Step info in nav
    const infoEl = document.getElementById('focus-step-info');
    if (infoEl) infoEl.textContent = `${stepDefs[stepIndex].label}`;

    // Dots
    const dotsEl = document.getElementById('focus-step-dots');
    if (dotsEl) {
      dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
        `<div class="focus-dot${i < stepIndex ? ' done' : i === stepIndex ? ' active' : ''}"></div>`
      ).join('');
    }

    // Prev/Next buttons
    const prevBtn = document.getElementById('focus-prev-btn');
    const nextBtn = document.getElementById('focus-next-btn');
    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) {
      nextBtn.textContent = stepIndex === total - 1 ? 'Done ✓' : 'Next →';
      nextBtn.onclick = stepIndex === total - 1 ? exitFocusMode : nextStep;
    }
  }

  // ── Helpers ──
  function getActivityType(el) {
    const classes = Array.from(el.classList);
    const typeClass = classes.find(c => c.startsWith('activity--') && !c.includes('i-do') && !c.includes('we-do') && !c.includes('you-do'));
    return typeClass ? typeClass.replace('activity--', '') : null;
  }

  function getStepDefs(el, type) {
    if (!type) return [{ label: 'View', action: () => {} }];
    if (type === 'organizer-row') {
      const grClass = Array.from(el.classList).find(c =>
        ['activity--i-do','activity--we-do','activity--you-do-partner','activity--you-do'].includes(c)
      );
      const grKey = grClass ? grClass.replace('activity--', '') : 'we-do';
      return STEPS['organizer-row-' + grKey] || STEPS['organizer-row-we-do'];
    }
    return STEPS[type] || [{ label: 'View', action: () => {} }];
  }

  // ── Step action functions ──

  // MC steps
  function stepMcRead(el) {
    el.querySelectorAll('.mc-stop-label').forEach(l => l.style.opacity = '0');
    el.querySelectorAll('.mc-option-btn').forEach(b => { b.disabled = false; b.classList.remove('mc-selected'); });
  }
  function stepMcStrategy(el) {
    el.querySelectorAll('.mc-stop-label').forEach(l => l.style.opacity = '1');
    if (document.body.classList.contains('cubes-active')) {
      const drawerTab = document.getElementById('passage-drawer-tab');
      if (drawerTab) drawerTab.click();
    }
  }
  function stepMcInteract(el) {
    el.querySelectorAll('.mc-option-btn').forEach(btn => {
      btn.disabled = false;
      btn.onclick = () => {
        el.querySelectorAll('.mc-option-btn').forEach(b => b.classList.remove('mc-selected'));
        btn.classList.add('mc-selected');
      };
    });
  }
  function stepMcConfirm(el) {
    el.querySelectorAll('.mc-answer-correct').forEach(b => b.classList.add('mc-correct'));
    el.querySelectorAll('.written-model').forEach(m => m.style.display = 'block');
  }

  // Organizer steps
  function stepOrgRead(el) {
    el.querySelectorAll('.org-cell-content, .org-cell-placeholder').forEach(c => c.style.outline = '');
  }
  function stepOrgIDoModel(el) {
    el.querySelectorAll('.exemplar-text').forEach(c => c.style.opacity = '1');
  }
  function stepOrgStudentFill(el) {
    el.querySelectorAll('.org-cell-placeholder').forEach(c => {
      c.style.outline = '2px dashed var(--accent)';
      c.style.outlineOffset = '2px';
    });
  }
  function stepOrgConfirm(el) {
    el.querySelectorAll('.exemplar-text').forEach(c => c.style.opacity = '1');
    el.querySelectorAll('.org-cell-placeholder').forEach(c => c.style.outline = '');
  }

  // Vocabulary steps — uses class names added by buildVocabBody in cards.js
  function stepVocabWord(el) {
    el.querySelectorAll('.vocab-def, .vocab-example, .vocab-esol-frame').forEach(c => c.style.display = 'none');
  }
  function stepVocabDef(el) {
    el.querySelectorAll('.vocab-def').forEach(c => c.style.display = '');
  }
  function stepVocabFrame(el) {
    el.querySelectorAll('.vocab-example, .vocab-esol-frame').forEach(c => c.style.display = '');
  }

  // Written response steps — single .activity-race-frame; CSS handles race/cer label swap
  function stepWrittenPrompt(el) {
    el.querySelectorAll('.activity-race-frame').forEach(f => f.style.display = 'none');
    el.querySelectorAll('.written-model').forEach(m => m.style.display = 'none');
  }
  function stepWrittenFrame(el) {
    el.querySelectorAll('.activity-race-frame').forEach(f => f.style.display = 'block');
    // CSS body.cer-active already swaps .race-labels/.cer-labels inside the frame
  }
  function stepWrittenModel(el) {
    el.querySelectorAll('.written-model').forEach(m => m.style.display = 'block');
  }

  // Passage annotation steps (4 steps per spec)
  function stepPassageRead(el) {
    // Step 1: Read ¶1–3 — hide CUBES guide; first half of passage visible
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = 'none');
  }
  function stepPassageRead2(el) {
    // Step 2: Read ¶4–6 — continue reading; passage already visible
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = 'none');
  }
  function stepPassageCubes(el) {
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = '');
  }
  function stepPassageAnnotate() {
    const drawerTab = document.getElementById('passage-drawer-tab');
    if (drawerTab) drawerTab.click();
  }

})();
```

- [ ] **Step 3: Add `<script src="../../js/focus.js"></script>` to `units/alicogia/index.html`** after `cards.js` but before `toolbar.js`.

- [ ] **Step 4: Verify in browser** — open `units/alicogia/index.html`, click `⊡ Focus` on the Bellringer Q1 activity. Verify:
  - Other activities disappear
  - Focus header shows "Step 1 of 4 — Read"
  - Four dots appear (first dot highlighted active, remaining three empty)
  - Next button advances to Step 2 (STOP labels should appear on MC options if STOP is active)
  - Escape exits focus mode and restores all activities

- [ ] **Step 5: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add js/focus.js units/alicogia/index.html
  git commit -m "feat(G): add focus.js — step-through focus mode for activities"
  ```

---

## Chunk 4: Passage Drawer

### Task 5: Add passage drawer HTML and JS to alicogia/index.html

**Files:**
- Modify: `units/alicogia/index.html`
- New: `js/passage-drawer.js`
- Modify: `js/nav.js`

**Context:** The passage drawer is a fixed-position panel on the right edge. It shows the current day's `textPassage` paragraphs and has CUBES annotation tools. It must be populated on every day switch (by `nav.js`). The CUBES tools inside the drawer use a second canvas (`#passage-drawer-canvas`).

- [ ] **Step 1: Add passage drawer HTML to `units/alicogia/index.html`** — insert immediately before the `<!-- Focus Mode UI -->` block added in Task 4:

```html
  <!-- Passage Drawer -->
  <div class="passage-drawer" id="passage-drawer">
    <button class="passage-drawer-tab" id="passage-drawer-tab" aria-label="Open passage">
      <span style="writing-mode:vertical-rl;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">📄 Passage</span>
    </button>
    <!-- passage-drawer-panel wraps all inner content (tab sticks out separately) -->
    <div class="passage-drawer-panel">
      <div class="passage-drawer-header">
        <span class="passage-drawer-title">Text Passage</span>
        <button id="btn-line-numbers-drawer" title="Toggle line numbers"># Lines</button>
        <button id="btn-read-aloud-drawer" title="Read passage aloud">🔊</button>
        <button id="passage-drawer-close" aria-label="Close passage">✕</button>
      </div>
      <div class="passage-drawer-body" id="passage-text-drawer"></div>
      <div class="passage-cubes-toolbar" id="passage-cubes-toolbar">
        <span style="font-size:11px;color:#aaa;margin-right:4px;">CUBES:</span>
        <div class="cubes-btn" data-cubes-drawer="circle"   style="background:#e05050" title="C — Circle">C</div>
        <div class="cubes-btn" data-cubes-drawer="underline" style="background:#4a80d0" title="U — Underline">U</div>
        <div class="cubes-btn" data-cubes-drawer="box"       style="background:#4aad6a" title="B — Box">B</div>
        <div class="cubes-btn" data-cubes-drawer="eliminate" style="background:#d0b020" title="E — Eliminate">E</div>
        <div class="cubes-btn" data-cubes-drawer="star"      style="background:#e08030" title="S — Star">S</div>
        <button id="passage-clear-canvas" style="font-size:11px;background:rgba(255,255,255,0.1);color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">Clear</button>
      </div>
      <canvas id="passage-drawer-canvas"></canvas>
    </div>
  </div>
```

- [ ] **Step 2: Add passage drawer JS** — create `js/passage-drawer.js`:

```js
// js/passage-drawer.js
// Passage drawer — open/close, populate on day switch, CUBES annotation inside.

(function() {
  'use strict';

  let drawerCanvasInitialized = false;

  document.addEventListener('DOMContentLoaded', initDrawer);

  function initDrawer() {
    const drawer  = document.getElementById('passage-drawer');
    const tab     = document.getElementById('passage-drawer-tab');
    const closeBtn= document.getElementById('passage-drawer-close');

    if (tab)      tab.addEventListener('click', toggleDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Line numbers toggle inside drawer
    const btnLineNums = document.getElementById('btn-line-numbers-drawer');
    if (btnLineNums) btnLineNums.addEventListener('click', () => {
      document.body.classList.toggle('line-numbers');
      btnLineNums.classList.toggle('active');
    });

    // Read aloud inside drawer
    const btnAloud = document.getElementById('btn-read-aloud-drawer');
    if (btnAloud) btnAloud.addEventListener('click', () => {
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); btnAloud.classList.remove('active'); return; }
      const body = document.getElementById('passage-text-drawer');
      if (!body) return;
      const text = body.innerText || body.textContent || '';
      if (!text.trim()) return;
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.9;
      utt.onend = () => btnAloud.classList.remove('active');
      speechSynthesis.speak(utt);
      btnAloud.classList.add('active');
    });

    // Clear canvas button
    const clearBtn = document.getElementById('passage-clear-canvas');
    if (clearBtn) clearBtn.addEventListener('click', clearDrawerCanvas);

    // CUBES drawer tool buttons
    const drawerCanvas = document.getElementById('passage-drawer-canvas');
    document.querySelectorAll('[data-cubes-drawer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.cubesDrawer;
        document.querySelectorAll('[data-cubes-drawer]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (drawerCanvas && typeof window.setDrawerTool === 'function') window.setDrawerTool(tool);
      });
    });
  }

  // Called by nav.js after day switch
  window.populatePassageDrawer = function(day) {
    const body = document.getElementById('passage-text-drawer');
    if (!body) return;

    if (typeof UNIT === 'undefined') return;
    const dayData = UNIT.days[day];
    const passage = dayData && dayData.textPassage;

    if (!passage || !passage.paragraphs || !passage.paragraphs.length) {
      body.innerHTML = '<p class="passage-drawer-empty">No passage for this day.</p>';
      return;
    }

    function esc(str) {
      return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    body.innerHTML = passage.paragraphs.map(p =>
      `<p class="passage-para"><span class="para-num">[${esc(String(p.number))}]</span>${esc(p.text)}</p>`
    ).join('');

    // Resize canvas to match body
    resizeDrawerCanvas();
  };

  function toggleDrawer() {
    const drawer = document.getElementById('passage-drawer');
    if (!drawer) return;
    const opening = !drawer.classList.contains('passage-drawer--open');
    drawer.classList.toggle('passage-drawer--open', opening);

    if (opening && !drawerCanvasInitialized) {
      drawerCanvasInitialized = true;
      if (typeof window.initAnnotations === 'function') window.initAnnotations('passage-drawer-canvas');
    }
    if (opening) resizeDrawerCanvas();

    // Show CUBES toolbar when opening
    const cubesToolbar = document.getElementById('passage-cubes-toolbar');
    if (cubesToolbar) cubesToolbar.classList.toggle('visible', opening);
  }

  function closeDrawer() {
    const drawer = document.getElementById('passage-drawer');
    if (drawer) drawer.classList.remove('passage-drawer--open');
    const cubesToolbar = document.getElementById('passage-cubes-toolbar');
    if (cubesToolbar) cubesToolbar.classList.remove('visible');
  }

  function resizeDrawerCanvas() {
    const canvas = document.getElementById('passage-drawer-canvas');
    const body   = document.getElementById('passage-text-drawer');
    if (!canvas || !body) return;
    const rect = body.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = body.scrollHeight;
    canvas.style.width  = rect.width + 'px';
    canvas.style.height = body.scrollHeight + 'px';
  }

  function clearDrawerCanvas() {
    const canvas = document.getElementById('passage-drawer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resizeDrawerCanvas);

})();
```

- [ ] **Step 3: Add passage drawer script tag to `units/alicogia/index.html`** — after `annotations.js`:
  ```html
  <script src="../../js/passage-drawer.js"></script>
  ```

- [ ] **Step 4: Edit `js/nav.js`** — add `window.populatePassageDrawer(day)` call inside `switchDay()` after `renderDayContent(day)`. Find the line with `renderDayContent` in nav.js and add one line after it:
  ```js
  if (typeof window.populatePassageDrawer === 'function') window.populatePassageDrawer(day);
  ```

- [ ] **Step 5: Verify in browser** — reload `units/alicogia/index.html`. Click the passage tab on the right edge. Verify:
  - Drawer slides open from right
  - Day 1 passage text appears with paragraph numbers
  - Switch to Day 2, close and reopen drawer — Day 2 passage appears (or "No passage" if that day has none)
  - ✕ button closes the drawer

- [ ] **Step 6: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add units/alicogia/index.html js/passage-drawer.js js/nav.js
  git commit -m "feat(G): add passage drawer HTML, passage-drawer.js, populate on day switch"
  ```

---

### Task 6: Modify js/annotations.js — add drawer canvas support

**Files:**
- Modify: `js/annotations.js`

**Context:** `annotations.js` is an IIFE (175 lines) targeting `#annotation-canvas`. The drawer needs the same drawing tools on `#passage-drawer-canvas`. The approach: expose `window.initDrawerAnnotations()` and `window.setDrawerTool(tool)` from inside the IIFE, which set up a separate canvas context with the same drawing functions.

- [ ] **Step 1: Read `js/annotations.js`** to understand the full structure before editing.

- [ ] **Step 2: Add drawer canvas support** — append the following code INSIDE the IIFE in `js/annotations.js`, just before the closing `})();` line:

```js
  // ── Drawer canvas (passage drawer) ──
  let drawerCanvas = null;
  let drawerCtx = null;
  let drawerTool = 'circle';
  let drawerDrawing = false;
  let drawerStartX = 0, drawerStartY = 0, drawerLastX = 0, drawerLastY = 0;

  // Exposed as window.initAnnotations(canvasId) per spec — parameterized for future surfaces
  window.initAnnotations = function(canvasId) {
    drawerCanvas = document.getElementById(canvasId);
    if (!drawerCanvas) return;
    drawerCtx = drawerCanvas.getContext('2d');
    drawerCanvas.classList.add('visible');

    drawerCanvas.addEventListener('mousedown', drawerStartDraw);
    drawerCanvas.addEventListener('mousemove', drawerDrawMove);
    drawerCanvas.addEventListener('mouseup',   drawerEndDraw);
    drawerCanvas.addEventListener('mouseleave',drawerEndDraw);
    drawerCanvas.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = drawerCanvas.getBoundingClientRect();
      drawerStartDraw({ offsetX: t.clientX - rect.left, offsetY: t.clientY - rect.top });
    });
    drawerCanvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const t = e.touches[0];
      const rect = drawerCanvas.getBoundingClientRect();
      drawerDrawMove({ offsetX: t.clientX - rect.left, offsetY: t.clientY - rect.top });
    });
    drawerCanvas.addEventListener('touchend', drawerEndDraw);
  };

  window.setDrawerTool = function(tool) { drawerTool = tool; };

  function drawerStartDraw(e) {
    drawerDrawing = true;
    drawerStartX = e.offsetX; drawerStartY = e.offsetY;
    drawerLastX = e.offsetX; drawerLastY = e.offsetY;
  }
  function drawerDrawMove(e) {
    if (!drawerDrawing || !drawerCtx) return;
    const color = toolColors[drawerTool] || '#e05050';
    drawerCtx.strokeStyle = color; drawerCtx.lineWidth = 3;
    drawerCtx.lineCap = 'round'; drawerCtx.lineJoin = 'round';
    if (drawerTool === 'circle' || drawerTool === 'box') {
      drawerCtx.clearRect(0, 0, drawerCanvas.width, drawerCanvas.height);
      drawerCtx.beginPath();
      if (drawerTool === 'circle') {
        const rx = (e.offsetX - drawerStartX) / 2, ry = (e.offsetY - drawerStartY) / 2;
        drawerCtx.ellipse(drawerStartX + rx, drawerStartY + ry, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
      } else {
        drawerCtx.rect(drawerStartX, drawerStartY, e.offsetX - drawerStartX, e.offsetY - drawerStartY);
      }
      drawerCtx.stroke();
    } else if (drawerTool === 'underline' || drawerTool === 'eliminate') {
      // underline = draw along text; eliminate = strikethrough (same gesture, different semantic)
      drawerCtx.beginPath();
      drawerCtx.moveTo(drawerLastX, drawerLastY);
      drawerCtx.lineTo(e.offsetX, e.offsetY);
      drawerCtx.stroke();
      drawerLastX = e.offsetX; drawerLastY = e.offsetY;
    }
  }
  function drawerEndDraw(e) {
    if (!drawerDrawing) return;
    drawerDrawing = false;
    if (drawerTool === 'star' && e && drawerCtx) {
      drawStar(drawerCtx, e.offsetX || drawerStartX, e.offsetY || drawerStartY, 5, 18, 8, toolColors['star']);
    }
  }
```

- [ ] **Step 3: Verify** — reload browser, open passage drawer, click C (circle tool), draw on the passage text. A red circle should appear on the canvas overlay.

- [ ] **Step 4: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add js/annotations.js
  git commit -m "feat(G): add drawer canvas annotation support to annotations.js"
  ```

---

## Chunk 5: Toolbar Redesign

### Task 7: Rewrite js/toolbar.js — popover groups, CER toggle, passage button, remove split-screen

**Files:**
- Modify: `js/toolbar.js`
- Modify: `units/alicogia/index.html` (update toolbar HTML)

**Context:** `toolbar.js` is 502 lines. The popover system replaces individual tool buttons with group buttons that open popover panels. The existing feature logic (STOP, ESOL cycling, benchmarks, RACE panel, flashcards, etc.) is preserved but moved inside popovers. The HTML toolbar in `index.html` must be updated to match the new group button structure.

- [ ] **Step 1: Update the toolbar HTML in `units/alicogia/index.html`** — replace the entire `<div class="toolbar" id="toolbar">...</div>` block with:

```html
    <div class="toolbar" id="toolbar">

      <!-- Timer Group -->
      <div class="tool-group" id="group-timer">
        <button class="tool-btn timer-display" id="timer-display" title="Start/Pause timer">⏱ <span id="timer-value">4:00</span></button>
        <button class="tool-btn tool-btn-sm" id="timer-play" title="Play/Pause">▶</button>
        <button class="tool-btn tool-btn-sm" id="timer-reset" title="Reset">↺</button>
        <button class="tool-btn tool-btn-sm" id="timer-edit" title="Edit duration">✎</button>
        <select id="timer-presets" class="timer-presets" title="Quick presets" aria-label="Timer quick presets">
          <option value="">⚡</option>
          <option value="120">2 min</option>
          <option value="180">3 min</option>
          <option value="300">5 min</option>
          <option value="480">8 min</option>
          <option value="720">12 min</option>
        </select>
        <input id="timer-edit-input" class="timer-edit-input" type="text" placeholder="4:00" style="display:none">
      </div>

      <!-- Focus Mode (top-level) -->
      <button class="tool-btn" id="btn-focus" title="Focus Mode"><span class="bi">⊡</span><span class="bl">Focus</span></button>

      <!-- Strategies Popover Group -->
      <div class="tool-group" style="position:relative;">
        <button class="tool-group-btn" id="btn-strategies" data-popover="popover-strategies">
          <span class="bi">🎯</span><span class="bl">Strategies</span> ▾
        </button>
        <div class="toolbar-popover" id="popover-strategies">
          <button class="popover-btn strat-stop" id="btn-stop" title="STOP Strategy">🛑 <span class="popover-label">STOP</span></button>
          <button class="popover-btn strat-cubes" id="btn-cubes-toggle" title="CUBES Annotation">◉ <span class="popover-label">CUBES</span></button>
          <button class="popover-btn strat-race" id="btn-race" title="RACE Writing Frame">✍ <span class="popover-label">RACE</span></button>
          <button class="popover-btn strat-cer" id="btn-cer" title="CER Writing Frame">🔬 <span class="popover-label">CER</span></button>
        </div>
      </div>

      <!-- Content Popover Group -->
      <div class="tool-group" style="position:relative;">
        <button class="tool-group-btn" id="btn-content" data-popover="popover-content">
          <span class="bi">📋</span><span class="bl">Content</span> ▾
        </button>
        <div class="toolbar-popover" id="popover-content">
          <button class="popover-btn" id="btn-passage" title="Passage Drawer">📄 <span class="popover-label">Passage</span></button>
          <button class="popover-btn" id="btn-teacher-view" title="Teacher View">👁 <span class="popover-label">Teacher View</span></button>
          <button class="popover-btn" id="btn-reveal" title="Reveal Answers">💡 <span class="popover-label">Reveal Answers</span></button>
          <button class="popover-btn" id="btn-esol" title="ESOL Level">🌐 <span class="popover-label">ESOL Off</span></button>
          <button class="popover-btn" id="btn-benchmark-banner" title="Benchmark Objective">🎯 <span class="popover-label">Objective</span></button>
          <button class="popover-btn" id="btn-gr-phase" title="GR Phase Badge">📋 <span class="popover-label">GR Phase</span></button>
        </div>
      </div>

      <!-- Tools Popover Group -->
      <div class="tool-group" style="position:relative;">
        <button class="tool-group-btn" id="btn-tools" data-popover="popover-tools">
          <span class="bi">🛠</span><span class="bl">Tools</span> ▾
        </button>
        <div class="toolbar-popover" id="popover-tools">
          <button class="popover-btn" id="btn-vocab-ref" title="Vocab Quick Reference">📖 <span class="popover-label">Vocab Ref</span></button>
          <button class="popover-btn" id="btn-vocab-flashcards" title="Vocab Flashcards">🃏 <span class="popover-label">Flashcards</span></button>
          <button class="popover-btn" id="btn-exit-ticket" title="Exit Ticket">🎟 <span class="popover-label">Exit Ticket</span></button>
          <button class="popover-btn" id="btn-read-aloud" title="Read Passage Aloud">🔊 <span class="popover-label">Read Aloud</span></button>
          <button class="popover-btn" id="btn-pacing" title="Pacing Guide">📅 <span class="popover-label">Pacing</span></button>
          <button class="popover-btn" id="btn-qr" title="Student QR Code">⬛ <span class="popover-label">QR Code</span></button>
          <button class="popover-btn" id="btn-dyslexia" title="Dyslexia Font">Df <span class="popover-label">Dyslexia</span></button>
          <button class="popover-btn" id="btn-high-contrast" title="High Contrast">◑ <span class="popover-label">Contrast</span></button>
          <button class="popover-btn" id="btn-achievement" title="Achievement Levels">🏆 <span class="popover-label">Levels</span></button>
          <button class="popover-btn" id="btn-print" title="Print / PDF" onclick="window.print()">🖨 <span class="popover-label">Print</span></button>
        </div>
      </div>

      <!-- Progress -->
      <button class="tool-btn" id="btn-progress" title="Progress checklist"><span class="bi">☑</span><span class="bl">Progress</span></button>
      <div class="progress-panel" id="progress-panel"></div>

      <!-- Engage -->
      <button class="tool-btn tool-engage" id="btn-engage" title="Engage Panel"><span class="bi">📊</span><span class="bl">Engage</span></button>

      <!-- Downloads (right-aligned) -->
      <button class="tool-btn tool-downloads" id="btn-downloads"><span class="bi">↓</span><span class="bl">Downloads</span></button>
      <div class="downloads-panel" id="downloads-panel"></div>
    </div>
```

- [ ] **Step 2: Remove the old CUBES group and STOP group from `units/alicogia/index.html`** — these were separate `<div class="tool-group" id="group-cubes">` and `<div class="tool-group" id="group-stop">` blocks. They are now inside the Strategies popover. Verify they don't remain in the HTML:
  ```bash
  grep -n "group-cubes\|group-stop\|btn-split-screen\|group-writing" /Users/alexanderburger/Desktop/ir-platform/units/alicogia/index.html
  ```
  Expected: no matches.

- [ ] **Step 3: Update `js/toolbar.js`** — add the popover system and new features. Insert these additions at the TOP of the DOMContentLoaded block (before the existing `// ── Student Mode ──` line):

```js
  // ── Popover System ──
  document.querySelectorAll('[data-popover]').forEach(groupBtn => {
    groupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const popoverId = groupBtn.dataset.popover;
      const popover = document.getElementById(popoverId);
      const isOpen = popover && popover.classList.contains('popover--open');

      // Close all popovers
      document.querySelectorAll('.toolbar-popover').forEach(p => {
        p.classList.remove('popover--open');
      });
      document.querySelectorAll('[data-popover]').forEach(b => b.classList.remove('popover-open'));

      // Open clicked one (if it was closed)
      if (!isOpen && popover) {
        popover.classList.add('popover--open');
        groupBtn.classList.add('popover-open');
      }
    });
  });
  // Close popovers on outside click or Escape
  document.addEventListener('click', () => {
    document.querySelectorAll('.toolbar-popover').forEach(p => p.classList.remove('popover--open'));
    document.querySelectorAll('[data-popover]').forEach(b => b.classList.remove('popover-open'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.toolbar-popover').forEach(p => p.classList.remove('popover--open'));
      document.querySelectorAll('[data-popover]').forEach(b => b.classList.remove('popover-open'));
    }
  });

  // ── Passage Drawer button (in Content popover) ──
  const btnPassage = document.getElementById('btn-passage');
  if (btnPassage) btnPassage.addEventListener('click', () => {
    const tab = document.getElementById('passage-drawer-tab');
    if (tab) tab.click();
  });

  // ── CER Strategy toggle ──
  const btnCer = document.getElementById('btn-cer');
  if (btnCer) btnCer.addEventListener('click', () => {
    const on = document.body.classList.toggle('cer-active');
    btnCer.classList.toggle('active', on);
    // Re-render to update frame labels
    if (typeof renderDayContent === 'function') renderDayContent(window.currentDay);
  });

  // ── CUBES toggle (inside Strategies popover) ──
  const btnCubesToggle = document.getElementById('btn-cubes-toggle');
  if (btnCubesToggle) btnCubesToggle.addEventListener('click', () => {
    const on = document.body.classList.toggle('cubes-active');
    btnCubesToggle.classList.toggle('active', on);
    if (on) {
      const tab = document.getElementById('passage-drawer-tab');
      if (tab) tab.click();
    }
  });
```

- [ ] **Step 4: Update the `body.stop-active` toggle** in toolbar.js — the existing STOP handler (line 17-21) references `#btn-stop`. Change it to also update body class `stop-active` (the new CSS name) instead of `stop-mode`:

  Find in toolbar.js:
  ```js
  const btnStop = document.getElementById('btn-stop');
  if (btnStop) btnStop.addEventListener('click', () => {
    const on = document.body.classList.toggle('stop-mode');
    btnStop.classList.toggle('active', on);
  });
  ```
  Replace with:
  ```js
  const btnStop = document.getElementById('btn-stop');
  if (btnStop) btnStop.addEventListener('click', () => {
    document.body.classList.toggle('stop-mode');  // keep for backward compat
    const on = document.body.classList.toggle('stop-active');
    btnStop.classList.toggle('active', on);
  });
  ```

- [ ] **Step 5: Remove the old Focus Mode handler** (lines 58-77 in toolbar.js) that referenced `.card.in-focus`. The new focus behavior is entirely in `js/focus.js`. The `#btn-focus` button is now wired in `focus.js`. Delete the old block:
  ```js
  // ── Focus Mode ──
  const btnFocus = document.getElementById('btn-focus');
  if (btnFocus) { ... }
  ```

- [ ] **Step 6: Remove the old Split Screen handler** (lines 79-84 in toolbar.js):
  ```js
  // ── Split Screen ──
  const btnSplit = document.getElementById('btn-split-screen');
  if (btnSplit) btnSplit.addEventListener('click', () => { ... });
  ```

- [ ] **Step 7: Update the ESOL cycle handler** — find `if (typeof renderDayContent === 'function') renderDayContent(window.currentDay)` (toolbar.js line 129). This already calls `renderDayContent` which is now an alias for `renderActivities` — no change needed.

- [ ] **Step 8: Verify in browser** — reload `units/alicogia/index.html`. Verify:
  - Toolbar shows: Timer · Focus · Strategies▾ · Content▾ · Tools▾ · Progress · Engage · Downloads
  - Clicking Strategies▾ opens popover with STOP, CUBES, RACE, CER buttons
  - Clicking STOP → body gets `stop-active` class → STOP labels appear on MC options
  - Clicking Content▾ → Passage button → drawer opens
  - Clicking outside any popover closes it
  - Escape closes open popovers

- [ ] **Step 9: Commit**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add js/toolbar.js units/alicogia/index.html
  git commit -m "feat(G): toolbar popover groups, CER toggle, passage button, remove split-screen"
  ```

---

## Chunk 6: Propagation

### Task 8: Propagate HTML changes to all unit pages and push

**Files:**
- Modify: `scripts/generate-stubs.js`
- Modify: `units/shakuntala/index.html`, `units/bloomers/index.html`, `units/mathinnovations/index.html`
- Modify: All 23 stub `units/{id}/index.html` files

**Context:** `generate-stubs.js` reads `units/alicogia/index.html` as the shell template and generates stubs for all `status: 'coming-soon'` units in `units-registry.js`. Re-running it after alicogia's HTML is finalized propagates all Phase G changes (passage drawer, focus UI, new toolbar, new script tags) to all stubs automatically. The 3 live units (shakuntala, bloomers, mathinnovations) get the same HTML changes manually.

- [ ] **Step 1: Verify `units/alicogia/index.html` has all required script tags** in the correct order:
  ```bash
  grep -n "\.js" /Users/alexanderburger/Desktop/ir-platform/units/alicogia/index.html | grep script
  ```
  Expected order: `data.js` → `theme.js` → `nav.js` → `activities.js` → `cards.js` → `focus.js` → `timer.js` → `toolbar.js` → `annotations.js` → `passage-drawer.js` → `engage.js`

- [ ] **Step 2: Re-run generate-stubs.js** to propagate the alicogia shell to all 23 stubs:
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform && node scripts/generate-stubs.js
  ```
  Expected output: `Generating N stub units...` then `✓ units/{id}/` for each, then `Done.`

- [ ] **Step 3: Update the 3 live unit index.html files** (shakuntala, bloomers, mathinnovations) — copy the alicogia template and replace only the `<title>` tag. Use explicit titles since `bloomers` and `mathinnovations` have multi-word names:
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  declare -A titles=(
    [shakuntala]="Shakuntala"
    [bloomers]="Bloomers & Blue Jeans"
    [mathinnovations]="Math Innovations"
  )
  for unit in shakuntala bloomers mathinnovations; do
    cp units/alicogia/index.html units/${unit}/index.html
    sed -i '' "s|<title>Ali Cogia · IR Platform</title>|<title>${titles[$unit]} · IR Platform</title>|" units/${unit}/index.html
  done
  ```

- [ ] **Step 4: Spot-check one stub and one live unit** to confirm script tags and HTML:
  ```bash
  grep -n "activities.js\|passage-drawer\|focus.js\|engage.js" /Users/alexanderburger/Desktop/ir-platform/units/storyofanhour/index.html
  grep -n "activities.js\|passage-drawer\|focus.js\|engage.js" /Users/alexanderburger/Desktop/ir-platform/units/shakuntala/index.html
  ```
  Expected: all 4 script tags found in both files.

- [ ] **Step 5: Final browser verification** — open `units/alicogia/index.html` in browser and test the full flow:
  - Day 1 loads with vertical scroll of activities (no expand/collapse cards)
  - Passage drawer tab visible on right edge; opens on click with Day 1 passage text
  - CUBES annotation works in drawer (draw a circle on text)
  - Focus Mode on Bellringer Q1: steps through Read → Apply Strategy → Interact → Confirm; Escape exits
  - Toolbar Strategies popover: STOP activates labels on MC options; RACE shows frames on written response; CER changes frame labels
  - Content popover: Teacher View toggles teacher notes; Reveal Answers shows correct MC option; ESOL cycles levels
  - Tools popover: Pacing, Exit Ticket, Flashcards, QR all open correctly
  - Switch to Day 2: activities update, passage drawer updates, timer resets
  - Test a stub unit (e.g., `units/storyofanhour/index.html`) — shows "Content coming soon" in the activity area, passage drawer tab visible

- [ ] **Step 6: Commit and push**
  ```bash
  cd /Users/alexanderburger/Desktop/ir-platform
  git add units/ scripts/generate-stubs.js
  git commit -m "feat(G): propagate Phase G HTML to all 23 stubs and 3 live units"
  git push origin main
  ```
