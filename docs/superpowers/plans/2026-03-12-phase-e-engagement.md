# Phase E — Engagement & Formative Assessment Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-screen Engage panel with 5 activity types (Poll, Rating Scale, Binary Choice, Fillable Response, Think-Pair-Share Timer) — display-only, no backend, teacher-driven projection.

**Architecture:** A new `js/engage.js` handles all Engage panel logic (open/close, activity rendering, result counting via sessionStorage). CSS additions go into `css/main.css`. The `#btn-engage` button in the toolbar opens the overlay. All activity data comes from `UNIT.days[window.currentDay].engageActivities`. Phase C must be complete (toolbar infrastructure, `window.currentDay`). Phase D must have populated `engageActivities` arrays.

**Tech Stack:** Vanilla JS, Web Audio API (for TPS sound cues), sessionStorage (result persistence). No CDN or backend. All modern browser APIs.

**Prerequisites:** Phase C complete, Phase D complete (engageActivities filled in data.js).

**Spec:** `docs/superpowers/specs/2026-03-12-ir-platform-upgrade-design.md` — Phase E section

---

## File Structure

| File | Change |
|------|--------|
| `js/engage.js` | New — all Engage panel logic (~200 lines) |
| `css/main.css` | Add ~80 lines: Engage overlay + activity styles |
| `units/alicogia/index.html` | `#btn-engage` already in toolbar from Phase C; verify it exists |
| `units/alicogia/data.js` | `engageActivities` already added in Phase D; verify it exists |

Note: All stub `units/{id}/index.html` files were updated with `#btn-engage` in Phase C Task 8. All stub `units/{id}/data.js` files already have `engageActivities: []` from Phase B. No stub changes needed in Phase E.

---

## Chunk 1: Engage Overlay CSS

### Task 1: Add Engage overlay and activity styles to css/main.css

**Files:**
- Modify: `css/main.css`

- [ ] **Step 1: Read `css/main.css`** to find the end of the file and understand existing naming conventions.

- [ ] **Step 2: Append Engage overlay styles to `css/main.css`:**

```css
/* ===== ENGAGE OVERLAY ===== */
.engage-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 24px 24px;
  overflow-y: auto;
}
.engage-overlay.hidden { display: none; }

.engage-header {
  width: 100%;
  max-width: 760px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.engage-title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-muted, #8892c8);
}
.engage-close {
  background: rgba(255,255,255,0.08);
  border: none;
  color: #fff;
  width: 32px; height: 32px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.engage-close:hover { background: rgba(255,255,255,0.15); }

/* Activity container */
.engage-activity {
  width: 100%;
  max-width: 760px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 32px;
}

/* Activity navigation */
.engage-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  width: 100%;
  max-width: 760px;
}
.engage-nav-btn {
  background: rgba(255,255,255,0.08);
  border: none; color: #fff;
  padding: 8px 16px; border-radius: 6px;
  font-size: 13px; cursor: pointer;
}
.engage-nav-btn:hover { background: rgba(255,255,255,0.15); }
.engage-nav-btn:disabled { opacity: 0.3; cursor: default; }
.engage-activity-counter {
  font-size: 12px; color: rgba(255,255,255,0.4);
  flex: 1; text-align: center;
}

/* Activity question/prompt */
.engage-question {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  margin-bottom: 28px;
}

/* === POLL styles === */
.poll-choices { display: flex; flex-direction: column; gap: 10px; }
.poll-choice {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 14px 18px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.poll-choice:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
.poll-choice.revealed-correct { border-color: #22c55e; background: rgba(34,197,94,0.1); }
.poll-choice-label {
  font-size: 16px; font-weight: 700; color: #fff;
  min-width: 28px;
}
.poll-choice-text { font-size: 16px; color: #e0e0ff; flex: 1; }
.poll-choice-count {
  font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.5);
  min-width: 32px; text-align: right;
}
.poll-bar-wrap {
  height: 4px; background: rgba(255,255,255,0.08);
  border-radius: 2px; margin-top: 6px; overflow: hidden;
}
.poll-bar {
  height: 100%; background: var(--accent, #6c4fad);
  border-radius: 2px; transition: width 0.3s ease;
}
.poll-reveal-btn {
  margin-top: 20px;
  padding: 10px 20px; border: none;
  background: rgba(108,79,173,0.3);
  border: 1px solid rgba(108,79,173,0.5);
  color: #c4b5fd; border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer;
}
.poll-reveal-btn:hover { background: rgba(108,79,173,0.5); }

/* === RATING SCALE styles === */
.rating-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
.rating-btn {
  flex: 1; min-width: 48px; min-height: 64px;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  font-size: 22px; font-weight: 700; color: #fff;
  cursor: pointer; display: flex;
  flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  transition: background 0.15s;
}
.rating-btn:hover { background: rgba(255,255,255,0.14); }
.rating-count { font-size: 11px; color: rgba(255,255,255,0.4); font-weight: 400; }
.rating-bar-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.rating-bar-label { font-size: 12px; color: rgba(255,255,255,0.5); min-width: 16px; text-align: right; }
.rating-bar-outer { flex: 1; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; }
.rating-bar-inner { height: 100%; background: var(--accent, #6c4fad); border-radius: 4px; transition: width 0.3s ease; }
.rating-total { margin-top: 12px; font-size: 12px; color: rgba(255,255,255,0.4); }

/* === BINARY CHOICE styles === */
.binary-btns { display: flex; gap: 16px; }
.binary-btn {
  flex: 1; min-height: 100px;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  font-size: 20px; font-weight: 800; color: #fff;
  cursor: pointer; display: flex;
  flex-direction: column; align-items: center; justify-content: center; gap: 8px;
  transition: background 0.15s, border-color 0.15s;
}
.binary-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); }
.binary-pct { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 400; }
.binary-split {
  display: flex; height: 10px; border-radius: 5px;
  overflow: hidden; margin-top: 14px; background: rgba(255,255,255,0.08);
}
.binary-split-a { background: var(--accent, #6c4fad); transition: width 0.3s ease; }
.binary-split-b { flex: 1; background: rgba(255,255,255,0.2); }

/* === FILLABLE RESPONSE styles === */
.fillable-prompt {
  font-size: 20px; font-weight: 700; color: #fff; line-height: 1.5; margin-bottom: 20px;
}
.fillable-frame {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 16px 20px;
  font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7;
  margin-bottom: 16px;
}
.fillable-timer {
  font-family: monospace; font-size: 32px; font-weight: 700; color: #e8e4ff;
  text-align: center; margin-bottom: 16px;
}
.fillable-timer-controls { display: flex; gap: 8px; justify-content: center; }
.fillable-timer-btn {
  padding: 8px 16px; border-radius: 6px; border: none;
  background: rgba(255,255,255,0.1); color: #fff;
  font-size: 13px; cursor: pointer;
}
.fillable-timer-btn:hover { background: rgba(255,255,255,0.18); }

/* === TPS TIMER styles === */
.tps-phase-label {
  font-size: 48px; font-weight: 900; color: #fff;
  text-align: center; margin-bottom: 16px;
  letter-spacing: 1px;
}
.tps-phase-icon { font-size: 40px; text-align: center; margin-bottom: 8px; }
.tps-prompt {
  font-size: 18px; color: rgba(255,255,255,0.7); text-align: center;
  margin-bottom: 28px; line-height: 1.5;
}
.tps-countdown {
  font-family: monospace; font-size: 56px; font-weight: 900;
  color: #e8e4ff; text-align: center; margin-bottom: 24px;
}
.tps-countdown.time-low { color: #ef4444; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.tps-next-btn {
  display: block; margin: 0 auto;
  padding: 14px 32px; border: none;
  background: rgba(108,79,173,0.4);
  border: 1px solid rgba(108,79,173,0.6);
  color: #fff; border-radius: 8px; font-size: 16px;
  font-weight: 700; cursor: pointer;
}
.tps-next-btn:hover { background: rgba(108,79,173,0.65); }
.tps-complete { font-size: 24px; color: #22c55e; text-align: center; font-weight: 700; }
```

- [ ] **Step 3: Verify no naming collisions** with existing CSS classes in `main.css`.

- [ ] **Step 4: Commit**
```bash
git add css/main.css
git commit -m "feat(E): add Engage overlay and all activity styles to main.css"
```

---

## Chunk 2: Engage Logic (js/engage.js)

### Task 2: Create js/engage.js — core structure and initialization

**Files:**
- Create: `js/engage.js`

- [ ] **Step 1: Create `js/engage.js` with the module structure:**

```js
// js/engage.js
// Engage panel — display-only formative assessment tools
// Reads UNIT.days[window.currentDay].engageActivities
// Stores result counts in sessionStorage

(function() {
  'use strict';

  let currentActivityIndex = 0;
  let activityResults = {};  // key: index, value: per-activity result object

  // Timer state — declared here so stopAllTimers (defined below) can reference both
  let fillableTimerInterval = null;
  let tpsTimerInterval = null;

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function storageKey(index) {
    return `ir-engage-${UNIT.meta.id}-day${window.currentDay}-activity${index}`;
  }

  function loadResult(index) {
    try {
      const raw = sessionStorage.getItem(storageKey(index));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveResult(index, data) {
    try {
      sessionStorage.setItem(storageKey(index), JSON.stringify(data));
    } catch (e) { /* sessionStorage full — ignore */ }
  }

  // ─── Public API ─────────────────────────────────────────────────────────────
  window.openEngage = openEngage;
  window.closeEngage = closeEngage;

  // ─── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initEngage);
})();
```

- [ ] **Step 2: Commit skeleton**
```bash
git add js/engage.js
git commit -m "feat(E): add engage.js skeleton with storage helpers and API"
```

---

### Task 3: Implement openEngage / closeEngage and activity navigation

**Files:**
- Modify: `js/engage.js`

- [ ] **Step 1: Add `initEngage`, `openEngage`, `closeEngage`, and navigation functions inside the IIFE:**

```js
function initEngage() {
  const openBtn = document.getElementById('btn-engage');
  if (openBtn) openBtn.addEventListener('click', openEngage);

  const closeBtn = document.getElementById('engage-close');
  if (closeBtn) closeBtn.addEventListener('click', closeEngage);

  const prevBtn = document.getElementById('engage-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => navigateTo(currentActivityIndex - 1));

  const nextBtn = document.getElementById('engage-next');
  if (nextBtn) nextBtn.addEventListener('click', () => navigateTo(currentActivityIndex + 1));
}

function openEngage() {
  const overlay = document.getElementById('engage-overlay');
  if (!overlay) return;
  currentActivityIndex = 0;
  overlay.classList.remove('hidden');
  renderActivity(0);
}

function closeEngage() {
  const overlay = document.getElementById('engage-overlay');
  if (overlay) overlay.classList.add('hidden');
  stopAllTimers();
}

function navigateTo(index) {
  const activities = getActivities();
  if (index < 0 || index >= activities.length) return;
  stopAllTimers();
  currentActivityIndex = index;
  renderActivity(index);
}

function getActivities() {
  if (typeof UNIT === 'undefined') return [];
  const day = UNIT.days[window.currentDay];
  if (!day) return [];
  return day.engageActivities || [];
}

function renderActivity(index) {
  const activities = getActivities();
  const activity = activities[index];
  const container = document.getElementById('engage-activity-container');
  const counter = document.getElementById('engage-activity-counter');
  const prevBtn = document.getElementById('engage-prev');
  const nextBtn = document.getElementById('engage-next');

  if (!container || !activity) {
    if (container) container.innerHTML = '<div style="color:rgba(255,255,255,0.4);text-align:center;padding:40px">No activities for this day.</div>';
    return;
  }

  if (counter) counter.textContent = `${index + 1} / ${activities.length}`;
  if (prevBtn) prevBtn.disabled = index === 0;
  if (nextBtn) nextBtn.disabled = index === activities.length - 1;

  // Load saved results if any
  activityResults[index] = loadResult(index) || getDefaultResult(activity);

  switch (activity.type) {
    case 'poll':    container.innerHTML = renderPoll(activity, index);    bindPoll(index); break;
    case 'rating':  container.innerHTML = renderRating(activity, index);  bindRating(index); break;
    case 'binary':  container.innerHTML = renderBinary(activity, index);  bindBinary(index); break;
    case 'fillable': container.innerHTML = renderFillable(activity, index); bindFillable(index); break;
    case 'tps':     container.innerHTML = renderTPS(activity, index);     bindTPS(index); break;
    default:        container.innerHTML = `<div style="color:#fff">Unknown activity type: ${esc(activity.type)}</div>`;
  }
}

function getDefaultResult(activity) {
  switch (activity.type) {
    case 'poll':    return { counts: {}, revealed: false };
    case 'rating':  return { counts: {} };
    case 'binary':  return { countA: 0, countB: 0 };
    case 'fillable': return { timerSeconds: 300, running: false, elapsed: 0 };
    case 'tps':     return { phase: 0, elapsed: 0 };
    default:        return {};
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add js/engage.js
git commit -m "feat(E): add engage open/close/navigate and activity dispatch"
```

---

### Task 4: Implement Poll activity

**Files:**
- Modify: `js/engage.js`

- [ ] **Step 1: Add `renderPoll` and `bindPoll`:**

```js
function renderPoll(activity, index) {
  const result = activityResults[index];
  const total = activity.choices.reduce((sum, _, i) => sum + (result.counts[i] || 0), 0);

  const choicesHTML = activity.choices.map((choice, i) => {
    const count = result.counts[i] || 0;
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    const isCorrect = result.revealed && String.fromCharCode(65 + i) === activity.correct;
    return `
      <div class="poll-choice${isCorrect ? ' revealed-correct' : ''}" data-choice-index="${i}">
        <span class="poll-choice-label">${String.fromCharCode(65 + i)}</span>
        <span class="poll-choice-text">${esc(choice)}</span>
        <span class="poll-choice-count">${count}</span>
      </div>
      <div class="poll-bar-wrap">
        <div class="poll-bar" style="width:${pct}%"></div>
      </div>`;
  }).join('');

  const revealLabel = result.revealed ? 'Answer Revealed' : 'Reveal Answer';
  return `
    <div class="engage-question">${esc(activity.question)}</div>
    <div class="poll-choices" id="poll-choices-${index}">${choicesHTML}</div>
    <button class="poll-reveal-btn" id="poll-reveal-${index}"${result.revealed ? ' disabled' : ''}>${revealLabel}</button>`;
}

function bindPoll(index) {
  document.querySelectorAll(`#poll-choices-${index} .poll-choice`).forEach(el => {
    el.addEventListener('click', () => {
      const i = parseInt(el.dataset.choiceIndex, 10);
      const result = activityResults[index];
      result.counts[i] = (result.counts[i] || 0) + 1;
      saveResult(index, result);
      renderActivity(index);  // re-render with updated counts
    });
  });

  const revealBtn = document.getElementById(`poll-reveal-${index}`);
  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      activityResults[index].revealed = true;
      saveResult(index, activityResults[index]);
      renderActivity(index);
    });
  }
}
```

- [ ] **Step 2: Commit**
```bash
git add js/engage.js
git commit -m "feat(E): add Poll activity render and interaction"
```

---

### Task 5: Implement Rating Scale activity

**Files:**
- Modify: `js/engage.js`

- [ ] **Step 1: Add `renderRating` and `bindRating`:**

```js
function renderRating(activity, index) {
  const result = activityResults[index];
  const scale = activity.scale || 5;
  const total = Object.values(result.counts).reduce((a, b) => a + b, 0);

  const btnsHTML = Array.from({ length: scale }, (_, i) => {
    const val = i + 1;
    const count = result.counts[val] || 0;
    return `<button class="rating-btn" data-val="${val}">
      ${val}
      <span class="rating-count">${count}</span>
    </button>`;
  }).join('');

  const barsHTML = Array.from({ length: scale }, (_, i) => {
    const val = i + 1;
    const count = result.counts[val] || 0;
    const pct = total > 0 ? Math.round(count / total * 100) : 0;
    return `<div class="rating-bar-row">
      <span class="rating-bar-label">${val}</span>
      <div class="rating-bar-outer"><div class="rating-bar-inner" style="width:${pct}%"></div></div>
      <span class="rating-bar-label">${count}</span>
    </div>`;
  }).join('');

  return `
    <div class="engage-question">${esc(activity.prompt)}</div>
    <div class="rating-buttons" id="rating-btns-${index}">${btnsHTML}</div>
    <div style="margin-top:20px">${barsHTML}</div>
    <div class="rating-total">Total responses: ${total}</div>`;
}

function bindRating(index) {
  document.querySelectorAll(`#rating-btns-${index} .rating-btn`).forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val, 10);
      const result = activityResults[index];
      result.counts[val] = (result.counts[val] || 0) + 1;
      saveResult(index, result);
      renderActivity(index);
    });
  });
}
```

- [ ] **Step 2: Commit**
```bash
git add js/engage.js
git commit -m "feat(E): add Rating Scale activity render and interaction"
```

---

### Task 6: Implement Binary Choice activity

**Files:**
- Modify: `js/engage.js`

- [ ] **Step 1: Add `renderBinary` and `bindBinary`:**

```js
function renderBinary(activity, index) {
  const result = activityResults[index];
  const total = result.countA + result.countB;
  const pctA = total > 0 ? Math.round(result.countA / total * 100) : 50;
  const pctB = total > 0 ? Math.round(result.countB / total * 100) : 50;

  return `
    <div class="engage-question">${esc(activity.prompt)}</div>
    <div class="binary-btns">
      <button class="binary-btn" id="binary-a-${index}">
        ${esc(activity.optionA)}
        <span class="binary-pct">${result.countA} (${pctA}%)</span>
      </button>
      <button class="binary-btn" id="binary-b-${index}">
        ${esc(activity.optionB)}
        <span class="binary-pct">${result.countB} (${pctB}%)</span>
      </button>
    </div>
    <div class="binary-split">
      <div class="binary-split-a" style="width:${pctA}%"></div>
      <div class="binary-split-b"></div>
    </div>`;
}

function bindBinary(index) {
  const btnA = document.getElementById(`binary-a-${index}`);
  const btnB = document.getElementById(`binary-b-${index}`);
  if (btnA) btnA.addEventListener('click', () => {
    activityResults[index].countA++;
    saveResult(index, activityResults[index]);
    renderActivity(index);
  });
  if (btnB) btnB.addEventListener('click', () => {
    activityResults[index].countB++;
    saveResult(index, activityResults[index]);
    renderActivity(index);
  });
}
```

- [ ] **Step 2: Commit**
```bash
git add js/engage.js
git commit -m "feat(E): add Binary Choice activity render and interaction"
```

---

### Task 7: Implement Fillable Response Display activity

**Files:**
- Modify: `js/engage.js`

- [ ] **Step 1: Add `renderFillable`, `bindFillable`, and `stopAllTimers` helper:**

Note: `fillableTimerInterval` and `tpsTimerInterval` are already declared in the Task 2 skeleton at the top of the IIFE. Do NOT redeclare them here.

```js
function stopAllTimers() {
  if (fillableTimerInterval) { clearInterval(fillableTimerInterval); fillableTimerInterval = null; }
  if (tpsTimerInterval) { clearInterval(tpsTimerInterval); tpsTimerInterval = null; }
}

function renderFillable(activity, index) {
  const result = activityResults[index];
  const raceFrame = activity.useRaceFrame
    ? (UNIT.days[window.currentDay].raceFrames || null)
    : null;

  const frameHTML = raceFrame ? `
    <div class="fillable-frame">
      <strong>Restate:</strong> ${esc(raceFrame.restate)}<br>
      <strong>Answer:</strong> ${esc(raceFrame.answer)}<br>
      <strong>Cite:</strong> ${esc(raceFrame.cite)}<br>
      <strong>Explain:</strong> ${esc(raceFrame.explain)}
    </div>` : '';

  const totalSec = result.timerSeconds || 300;
  const elapsed = result.elapsed || 0;
  const remaining = Math.max(0, totalSec - elapsed);
  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');

  return `
    <div class="fillable-prompt">${esc(activity.prompt)}</div>
    ${frameHTML}
    <div class="fillable-timer" id="fillable-timer-${index}">${mins}:${secs}</div>
    <div class="fillable-timer-controls">
      <button class="fillable-timer-btn" id="fillable-start-${index}">${result.running ? 'Pause' : 'Start'}</button>
      <button class="fillable-timer-btn" id="fillable-reset-${index}">Reset</button>
    </div>`;
}

function bindFillable(index) {
  const startBtn = document.getElementById(`fillable-start-${index}`);
  const resetBtn = document.getElementById(`fillable-reset-${index}`);

  if (startBtn) startBtn.addEventListener('click', () => {
    const result = activityResults[index];
    if (result.running) {
      result.running = false;
      stopAllTimers();
    } else {
      result.running = true;
      fillableTimerInterval = setInterval(() => {
        result.elapsed = (result.elapsed || 0) + 1;
        if (result.elapsed >= result.timerSeconds) {
          result.running = false;
          clearInterval(fillableTimerInterval);
          fillableTimerInterval = null;
        }
        saveResult(index, result);
        // Update display without full re-render
        const display = document.getElementById(`fillable-timer-${index}`);
        if (display) {
          const rem = Math.max(0, result.timerSeconds - result.elapsed);
          display.textContent = `${String(Math.floor(rem / 60)).padStart(2,'0')}:${String(rem % 60).padStart(2,'0')}`;
        }
      }, 1000);
    }
    saveResult(index, result);
    // Re-render to update button label
    const container = document.getElementById('engage-activity-container');
    if (container) {
      const activity = getActivities()[index];
      container.innerHTML = renderFillable(activity, index);
      bindFillable(index);
    }
  });

  if (resetBtn) resetBtn.addEventListener('click', () => {
    stopAllTimers();
    activityResults[index].elapsed = 0;
    activityResults[index].running = false;
    saveResult(index, activityResults[index]);
    renderActivity(index);
  });
}
```

- [ ] **Step 2: Commit**
```bash
git add js/engage.js
git commit -m "feat(E): add Fillable Response display activity with countdown timer"
```

---

### Task 8: Implement Think-Pair-Share Timer activity

**Files:**
- Modify: `js/engage.js`

- [ ] **Step 1: Add `renderTPS`, `bindTPS`, and TPS timer with sound cue:**

Note: `tpsTimerInterval` is already declared in the Task 2 skeleton. Do NOT redeclare it here.

```js
const TPS_PHASES = ['Think', 'Pair', 'Share'];
const TPS_ICONS = ['🤔', '👥', '🗣️'];

function playTone(frequency, duration) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* audio unavailable */ }
}

function getTpsPhaseSeconds(activity, phaseIndex) {
  return [activity.thinkSeconds, activity.pairSeconds, activity.shareSeconds][phaseIndex] || 0;
}

function renderTPS(activity, index) {
  const result = activityResults[index];
  const phase = result.phase || 0;

  if (phase >= 3) {
    return `
      <div class="tps-prompt">${esc(activity.prompt)}</div>
      <div class="tps-complete">✓ Think-Pair-Share Complete</div>`;
  }

  const phaseSec = getTpsPhaseSeconds(activity, phase);
  const elapsed = result.elapsed || 0;
  const remaining = phaseSec === 0 ? null : Math.max(0, phaseSec - elapsed);

  const countdownHTML = remaining === null
    ? '<div class="tps-countdown">—</div>'
    : `<div class="tps-countdown${remaining <= 10 ? ' time-low' : ''}" id="tps-countdown-${index}">
        ${String(Math.floor(remaining / 60)).padStart(2,'0')}:${String(remaining % 60).padStart(2,'0')}
       </div>`;

  const nextLabel = phase < 2 ? `Next: ${TPS_PHASES[phase + 1]}` : 'Done';

  return `
    <div class="tps-prompt">${esc(activity.prompt)}</div>
    <div class="tps-phase-icon">${TPS_ICONS[phase]}</div>
    <div class="tps-phase-label">${TPS_PHASES[phase]}</div>
    ${countdownHTML}
    <button class="tps-next-btn" id="tps-next-${index}">${nextLabel}</button>`;
}

function bindTPS(index) {
  const activity = getActivities()[index];
  const result = activityResults[index];
  const phase = result.phase || 0;

  if (phase >= 3) return;

  const phaseSec = getTpsPhaseSeconds(activity, phase);

  // Auto-start countdown if phase has a duration
  if (phaseSec > 0) {
    tpsTimerInterval = setInterval(() => {
      result.elapsed = (result.elapsed || 0) + 1;
      if (result.elapsed >= phaseSec) {
        clearInterval(tpsTimerInterval);
        tpsTimerInterval = null;
        playTone(880, 0.3);
        result.elapsed = 0;
        result.phase = (result.phase || 0) + 1;
        saveResult(index, result);
        renderActivity(index);
        return;
      }
      saveResult(index, result);
      const display = document.getElementById(`tps-countdown-${index}`);
      if (display) {
        const rem = phaseSec - result.elapsed;
        display.textContent = `${String(Math.floor(rem / 60)).padStart(2,'0')}:${String(rem % 60).padStart(2,'0')}`;
        if (rem <= 10) display.classList.add('time-low');
      }
    }, 1000);
  }

  const nextBtn = document.getElementById(`tps-next-${index}`);
  if (nextBtn) nextBtn.addEventListener('click', () => {
    stopAllTimers();
    result.elapsed = 0;
    result.phase = (result.phase || 0) + 1;
    saveResult(index, result);
    playTone(660, 0.3);
    renderActivity(index);
  });
}
```

- [ ] **Step 2: Commit**
```bash
git add js/engage.js
git commit -m "feat(E): add Think-Pair-Share timer activity with phase transitions and sound cue"
```

---

## Chunk 3: HTML Integration and Verification

### Task 9: Add engage.js script tag + overlay HTML to alicogia and all stub unit pages

**Context:** Phase C adds toolbar infrastructure but does NOT add `engage.js` (it's a Phase E file). The engage overlay HTML and script tag must be added in this phase.

**Files:**
- Modify: `units/alicogia/index.html`
- Modify: All `units/{id}/index.html` stub files (23 stubs from Phase B)

- [ ] **Step 1: Read `units/alicogia/index.html`.** Find where scripts are loaded at the bottom (near `</body>`). Note what IDs already exist in the toolbar.

- [ ] **Step 2: Add `<script src="../../js/engage.js"></script>`** to `units/alicogia/index.html` in the script block at the bottom, after `toolbar.js`.

- [ ] **Step 3: Add the Engage overlay HTML** to `units/alicogia/index.html` immediately before `</body>`:

```html
<!-- Engage Overlay -->
<div id="engage-overlay" class="engage-overlay hidden">
  <div class="engage-header">
    <span class="engage-title">Engage</span>
    <button class="engage-close" id="engage-close">✕</button>
  </div>
  <div class="engage-activity" id="engage-activity-container"></div>
  <div class="engage-nav">
    <button class="engage-nav-btn" id="engage-prev">← Prev</button>
    <span class="engage-activity-counter" id="engage-activity-counter"></span>
    <button class="engage-nav-btn" id="engage-next">Next →</button>
  </div>
</div>
```

- [ ] **Step 4: Read `units-registry.js`** to get the IDs of all stub units. Then for each stub `units/{id}/index.html`:
  - Add `<script src="../../js/engage.js"></script>` in the script block
  - Add the engage overlay HTML before `</body>`

  Use a script approach to avoid doing 23 manual edits:
  ```bash
  # From ir-platform root — adds engage.js script tag to all stub unit index.html files
  for dir in units/*/; do
    id=$(basename "$dir")
    if [ "$id" != "alicogia" ] && [ -f "$dir/index.html" ]; then
      # Add script tag before </body> if not already present
      if ! grep -q "engage.js" "$dir/index.html"; then
        sed -i '' 's|</body>|<script src="../../js/engage.js"></script>\n</body>|' "$dir/index.html"
      fi
      # Add overlay HTML before </body> if not already present
      if ! grep -q "engage-overlay" "$dir/index.html"; then
        sed -i '' 's|</body>|<div id="engage-overlay" class="engage-overlay hidden"><div class="engage-header"><span class="engage-title">Engage</span><button class="engage-close" id="engage-close">✕</button></div><div class="engage-activity" id="engage-activity-container"></div><div class="engage-nav"><button class="engage-nav-btn" id="engage-prev">← Prev</button><span class="engage-activity-counter" id="engage-activity-counter"></span><button class="engage-nav-btn" id="engage-next">Next →</button></div></div>\n</body>|' "$dir/index.html"
      fi
    fi
  done
  ```

- [ ] **Step 5: Spot-check 2–3 stub files** to confirm overlay and script were added correctly.

- [ ] **Step 6: Commit**
```bash
git add units/
git commit -m "feat(E): add engage.js script tag and overlay HTML to all unit pages"
```

---

### Task 10: Manual browser verification

- [ ] **Step 1: Open `units/alicogia/index.html` in browser.**

- [ ] **Step 2: Click the Engage toolbar button.** The full-screen overlay should open.

- [ ] **Step 3: Test each activity type:**
  - **Poll:** Click answer choices — count increments, bar grows. Click "Reveal Answer" — correct choice highlights green.
  - **Rating Scale:** Click numbers — count increments under each number, bars update.
  - **Binary Choice:** Click each side — counts update, split bar resizes.
  - **Fillable Response:** Start/pause/reset timer works. If `useRaceFrame: true`, RACE frames display below prompt.
  - **TPS:** Phase label shows "Think", countdown runs. Click Next → "Pair" phase begins with sound cue. Share phase (no countdown) shows — button advances to Done.

- [ ] **Step 4: Test navigation:**
  - Prev/Next buttons advance through activities.
  - Counter shows "1 / N" correctly.
  - Results persist when navigating back (sessionStorage working).

- [ ] **Step 5: Test close:**
  - Close button (✕) dismisses overlay.
  - Reopening overlay resets to activity 1 (but sessionStorage counts remain).

- [ ] **Step 6: Switch days and reopen Engage.** Activities should change to the new day's `engageActivities`.

- [ ] **Step 7: Test with a coming-soon stub unit** (any stub that has `engageActivities: []`). Engage should open and show "No activities for this day." gracefully.

- [ ] **Step 8: Commit final**
```bash
git add js/engage.js css/main.css units/alicogia/index.html
git commit -m "feat(E): complete Engage panel — all 5 activity types, navigation, sessionStorage"
git push origin main
```

- [ ] **Step 9: Verify on GitHub Pages**
  - AliCogia unit page — Engage button opens panel
  - All 5 activity types render and respond to taps
  - No console errors
