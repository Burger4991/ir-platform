# Phase C — Platform Features + Toolbar Overhaul Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the toolbar with grouped icon+label buttons and implement all 20 new platform features (STOP mode, CUBES tools, sidebar nav, split-screen, student URL, QR code, flashcards, read-aloud, RACE panel, exit ticket, GR badge, and more).

**Architecture:** The toolbar HTML shell in `units/alicogia/index.html` is fully replaced with the new grouped structure. `js/nav.js` is rewritten to produce a sidebar instead of tab row. `js/toolbar.js` is rewritten with all existing + new features. `js/annotations.js` is updated with CUBES tool modes. `js/cards.js` gets STOP overlay, ESOL level selector, and Focus mode. New overlays (flashcards, QR, exit ticket, RACE panel) are rendered dynamically in JS. CSS additions go in `css/main.css`.

**Tech Stack:** Vanilla JS/HTML/CSS. `qrcode.min.js` from CDN for QR generation. `speechSynthesis` API (built-in, no CDN) for read-aloud. OpenDyslexic from CDN for dyslexia font. No test runner — browser verification.

**Prerequisite:** Phase B must be complete. All 23 stub `units/{id}/index.html` files exist and will need toolbar HTML updated (Task 1 covers alicogia; Task 9 covers all stubs).

**Spec:** `docs/superpowers/specs/2026-03-12-ir-platform-upgrade-design.md` — Phase C section

---

## File Structure

| File | Change |
|------|--------|
| `units/alicogia/index.html` | Full toolbar + sidebar HTML replacement |
| `css/main.css` | Add sidebar, tool-group, all new overlay/panel styles |
| `js/nav.js` | Full rewrite — sidebar nav, `window.currentDay` |
| `js/toolbar.js` | Full rewrite — all features, grouped layout |
| `js/annotations.js` | Rewrite annotation section — CUBES tool modes |
| `js/cards.js` | Add STOP overlay, ESOL level rendering, Focus mode |
| `units/alicogia/data.js` | Add schema fields: ESOL tiers, stopLabel, raceFrames, pacingGuide, exitTicket, benchmarkDescription |
| `units/{id}/index.html` (23 files) | Update with new toolbar HTML |

---

## Chunk 1: HTML Shell + CSS Foundation

### Task 1: Replace toolbar + layout HTML in units/alicogia/index.html

**Files:**
- Modify: `units/alicogia/index.html`

- [ ] **Step 1: Replace the entire `<body>` content of `units/alicogia/index.html` with the following.** Keep the `<head>` section unchanged. The key changes: toolbar becomes grouped, `.day-tabs` div is removed, new sidebar + content-area layout added, benchmark banner + GR badge + overlays appended.

```html
<body class="theme-edtech">

  <nav class="nav">
    <a href="../../index.html" class="nav-logo">IR TEACHING SYSTEM</a>
    <div class="nav-links">
      <a href="../../index.html">← Units</a>
      <div class="theme-switcher">
        <button class="theme-btn active" data-theme="edtech">EdTech</button>
        <button class="theme-btn" data-theme="midnight">Midnight</button>
        <button class="theme-btn" data-theme="ocean">Ocean</button>
        <button class="theme-btn" data-theme="slate">Slate</button>
        <button class="theme-btn" data-theme="violet">Violet</button>
        <button class="theme-btn" data-theme="azure">Azure</button>
      </div>
    </div>
  </nav>

  <!-- Benchmark Banner (hidden by default) -->
  <div class="benchmark-banner" id="benchmark-banner" style="display:none">
    <span id="benchmark-banner-text"></span>
    <button onclick="document.getElementById('benchmark-banner').style.display='none'" style="background:none;border:none;color:inherit;cursor:pointer;font-size:14px;margin-left:12px;">✕</button>
  </div>

  <div class="unit-header" id="unit-header">
    <div class="unit-benchmark-label" id="unit-benchmark-label"></div>
    <div class="unit-title" id="unit-title"></div>
    <div class="unit-meta" id="unit-meta"></div>

    <!-- Toolbar (grouped) -->
    <div class="toolbar" id="toolbar">

      <!-- Timer Group -->
      <div class="tool-group" id="group-timer">
        <button class="tool-btn timer-display" id="timer-display" title="Start/Pause timer">⏱ <span id="timer-value">4:00</span></button>
        <button class="tool-btn tool-btn-sm" id="timer-play" title="Play/Pause">▶</button>
        <button class="tool-btn tool-btn-sm" id="timer-reset" title="Reset">↺</button>
        <button class="tool-btn tool-btn-sm" id="timer-edit" title="Edit duration">✎</button>
        <select id="timer-presets" class="timer-presets" title="Quick presets">
          <option value="">⚡</option>
          <option value="120">2 min</option>
          <option value="180">3 min</option>
          <option value="300">5 min</option>
          <option value="480">8 min</option>
          <option value="720">12 min</option>
        </select>
        <input id="timer-edit-input" class="timer-edit-input" type="text" placeholder="4:00" style="display:none">
      </div>

      <!-- View Group -->
      <div class="tool-group" id="group-view">
        <button class="tool-btn" id="btn-projection" title="Projection Mode (P)"><span class="bi">⛶</span><span class="bl">Project</span></button>
        <button class="tool-btn" id="btn-spotlight" title="Spotlight Mode"><span class="bi">◎</span><span class="bl">Spotlight</span></button>
        <button class="tool-btn" id="btn-font" title="Font Size"><span class="bi">Aa</span><span class="bl">Font</span></button>
        <button class="tool-btn" id="btn-focus" title="Focus Mode"><span class="bi">⊡</span><span class="bl">Focus</span></button>
        <button class="tool-btn" id="btn-split-screen" title="Split Screen"><span class="bi">▥</span><span class="bl">Split</span></button>
      </div>

      <!-- Content Group -->
      <div class="tool-group" id="group-content">
        <button class="tool-btn" id="btn-teacher-view" title="Teacher/Student View (T)"><span class="bi">👁</span><span class="bl">Teacher</span></button>
        <button class="tool-btn" id="btn-reveal" title="Reveal Answers"><span class="bi">💡</span><span class="bl">Answers</span></button>
        <button class="tool-btn" id="btn-esol" title="ESOL Level"><span class="bi">🌐</span><span class="bl">ESOL Off</span></button>
        <button class="tool-btn" id="btn-benchmark-banner" title="Benchmark Objective"><span class="bi">🎯</span><span class="bl">Objective</span></button>
        <button class="tool-btn" id="btn-gr-phase" title="GR Phase Badge"><span class="bi">📋</span><span class="bl">GR Phase</span></button>
      </div>

      <!-- Writing Group -->
      <div class="tool-group" id="group-writing">
        <button class="tool-btn" id="btn-race" title="RACE/ACE Writing Panel"><span class="bi">✍</span><span class="bl">RACE/ACE</span></button>
        <button class="tool-btn" id="btn-achievement" title="Achievement Levels"><span class="bi">🏆</span><span class="bl">Levels</span></button>
      </div>

      <!-- CUBES Group -->
      <div class="tool-group" id="group-cubes">
        <button class="tool-btn" id="btn-cubes-c" data-cubes="circle" title="C — Circle key words"><span class="bi cubes-c">C</span><span class="bl">Circle</span></button>
        <button class="tool-btn" id="btn-cubes-u" data-cubes="underline" title="U — Underline the question"><span class="bi cubes-u">U</span><span class="bl">Underline</span></button>
        <button class="tool-btn" id="btn-cubes-b" data-cubes="box" title="B — Box important terms"><span class="bi cubes-b">B</span><span class="bl">Box</span></button>
        <button class="tool-btn" id="btn-cubes-e" data-cubes="eliminate" title="E — Eliminate wrong answers"><span class="bi cubes-e">E</span><span class="bl">Eliminate</span></button>
        <button class="tool-btn" id="btn-cubes-s" data-cubes="star" title="S — Star important info"><span class="bi cubes-s">S</span><span class="bl">Star</span></button>
        <button class="tool-btn" id="btn-clear-annotations" title="Clear all annotations"><span class="bi">✕</span><span class="bl">Clear</span></button>
      </div>

      <!-- STOP Group -->
      <div class="tool-group" id="group-stop">
        <button class="tool-btn" id="btn-stop" title="STOP Analysis Mode"><span class="bi">🛑</span><span class="bl">STOP</span></button>
      </div>

      <!-- Tools Group -->
      <div class="tool-group" id="group-tools">
        <button class="tool-btn" id="btn-vocab-ref" title="Vocab Quick Reference"><span class="bi">📖</span><span class="bl">Vocab</span></button>
        <button class="tool-btn" id="btn-vocab-flashcards" title="Vocab Flashcards"><span class="bi">🃏</span><span class="bl">Flashcards</span></button>
        <button class="tool-btn" id="btn-exit-ticket" title="Exit Ticket"><span class="bi">🎟</span><span class="bl">Exit Ticket</span></button>
        <button class="tool-btn" id="btn-read-aloud" title="Read Passage Aloud"><span class="bi">🔊</span><span class="bl">Read Aloud</span></button>
        <button class="tool-btn" id="btn-line-numbers" title="Passage Line Numbers"><span class="bi">#</span><span class="bl">Line #s</span></button>
        <button class="tool-btn" id="btn-pacing" title="Pacing Guide"><span class="bi">📅</span><span class="bl">Pacing</span></button>
        <button class="tool-btn" id="btn-qr" title="Student QR Code"><span class="bi">⬛</span><span class="bl">QR Code</span></button>
        <button class="tool-btn" id="btn-dyslexia" title="Dyslexia Font"><span class="bi">Df</span><span class="bl">Dyslexia</span></button>
        <button class="tool-btn" id="btn-high-contrast" title="High Contrast"><span class="bi">◑</span><span class="bl">Contrast</span></button>
        <button class="tool-btn" id="btn-print" title="Print / PDF" onclick="window.print()"><span class="bi">🖨</span><span class="bl">Print</span></button>
      </div>

      <!-- Progress (standalone) -->
      <button class="tool-btn" id="btn-progress" title="Progress checklist"><span class="bi">☑</span><span class="bl">Progress</span></button>
      <div class="progress-panel" id="progress-panel"></div>

      <!-- Engage (standalone) -->
      <button class="tool-btn tool-engage" id="btn-engage" title="Engage Panel"><span class="bi">📊</span><span class="bl">Engage</span></button>

      <!-- Downloads (right-aligned) -->
      <button class="tool-btn tool-downloads" id="btn-downloads"><span class="bi">↓</span><span class="bl">Downloads</span></button>
      <div class="downloads-panel" id="downloads-panel"></div>
    </div>
  </div>

  <!-- GR Phase Badge (floating) -->
  <div class="gr-phase-badge" id="gr-badge" style="display:none"></div>

  <!-- Sidebar + Content layout -->
  <div class="page-layout">
    <div class="sidebar" id="sidebar">
      <div class="sidebar-unit-title" id="sidebar-unit-title"></div>
      <nav class="sidebar-days" id="sidebar-days"></nav>
      <div class="sidebar-card-links" id="sidebar-cards"></div>
      <button class="sidebar-toggle" id="sidebar-toggle" title="Collapse sidebar">‹</button>
    </div>
    <div class="content-area" id="content-area">
      <div class="content-grid" id="content-grid"></div>
    </div>
  </div>

  <!-- Assessment section -->
  <div class="assessment-section" id="assessment-section">
    <div class="assessment-header" id="assessment-toggle">Assessment Walkthrough <span>▼</span></div>
    <div class="assessment-body" id="assessment-body"></div>
  </div>

  <!-- Timer overlay (Projection Mode) -->
  <div class="timer-overlay" id="timer-overlay"></div>

  <!-- Annotation canvas -->
  <canvas id="annotation-canvas"></canvas>
  <div class="annotation-toolbar" id="annotation-toolbar">
    <span style="font-size:11px;color:#aaa;margin-right:4px;">CUBES:</span>
    <div class="cubes-btn active" data-cubes="circle" style="background:#e05050" title="C — Circle">C</div>
    <div class="cubes-btn" data-cubes="underline" style="background:#4a80d0" title="U — Underline">U</div>
    <div class="cubes-btn" data-cubes="box" style="background:#4aad6a" title="B — Box">B</div>
    <div class="cubes-btn" data-cubes="eliminate" style="background:#d0b020" title="E — Eliminate">E</div>
    <div class="cubes-btn" data-cubes="star" style="background:#e08030" title="S — Star">S</div>
    <div style="width:1px;height:20px;background:rgba(255,255,255,0.2);margin:0 4px;"></div>
    <button onclick="document.getElementById('btn-cubes-c').click()" style="font-size:11px;background:rgba(255,255,255,0.1);color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">Done</button>
  </div>

  <!-- RACE/ACE Panel -->
  <div class="slide-panel" id="race-panel" style="display:none">
    <div class="slide-panel-header">RACE/ACE Writing Guide <button class="panel-close" onclick="document.getElementById('race-panel').style.display='none'">✕</button></div>
    <div class="slide-panel-body" id="race-panel-body"></div>
  </div>

  <!-- Achievement Levels Panel -->
  <div class="slide-panel" id="achievement-panel" style="display:none">
    <div class="slide-panel-header">Achievement Levels <button class="panel-close" onclick="document.getElementById('achievement-panel').style.display='none'">✕</button></div>
    <div class="slide-panel-body" id="achievement-panel-body"></div>
  </div>

  <!-- Vocab Quick Reference Panel -->
  <div class="slide-panel" id="vocab-ref-panel" style="display:none">
    <div class="slide-panel-header">Vocabulary — Day <span id="vocab-ref-day"></span> <button class="panel-close" onclick="document.getElementById('vocab-ref-panel').style.display='none'">✕</button></div>
    <div class="slide-panel-body" id="vocab-ref-body"></div>
  </div>

  <!-- Pacing Guide Panel -->
  <div class="slide-panel" id="pacing-panel" style="display:none">
    <div class="slide-panel-header">Pacing Guide — Day <span id="pacing-day"></span> <button class="panel-close" onclick="document.getElementById('pacing-panel').style.display='none'">✕</button></div>
    <div class="slide-panel-body" id="pacing-body"></div>
  </div>

  <!-- Vocab Flashcard Overlay -->
  <div class="fullscreen-overlay" id="flashcard-overlay" style="display:none">
    <button class="overlay-close" onclick="document.getElementById('flashcard-overlay').style.display='none'">✕ Close</button>
    <div class="flashcard-container" id="flashcard-container"></div>
    <div class="flashcard-nav">
      <button id="flashcard-prev">← Prev</button>
      <span id="flashcard-counter"></span>
      <button id="flashcard-next">Next →</button>
    </div>
  </div>

  <!-- Exit Ticket Overlay -->
  <div class="fullscreen-overlay" id="exit-ticket-overlay" style="display:none">
    <button class="overlay-close" onclick="document.getElementById('exit-ticket-overlay').style.display='none'">✕ Close</button>
    <div class="exit-ticket-content" id="exit-ticket-content"></div>
  </div>

  <!-- QR Code Modal -->
  <div class="modal-overlay" id="qr-modal" style="display:none" onclick="this.style.display='none'">
    <div class="modal-box" onclick="event.stopPropagation()">
      <div class="modal-title">Student URL — Day <span id="qr-day-label"></span></div>
      <div id="qr-code-render"></div>
      <div class="modal-subtitle">Scan to open student view</div>
      <button class="modal-close" onclick="document.getElementById('qr-modal').style.display='none'">Close</button>
    </div>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <span class="footer-text">Built with the IR Teaching System</span>
    <div style="display:flex;gap:16px;">
      <span class="footer-text" id="prev-day-footer" style="cursor:pointer;color:var(--accent)"></span>
      <span class="footer-text" id="next-day-footer" style="cursor:pointer;color:var(--accent)"></span>
    </div>
  </footer>

  <script src="data.js"></script>
  <script src="../../js/theme.js"></script>
  <script src="../../js/nav.js"></script>
  <script src="../../js/cards.js"></script>
  <script src="../../js/timer.js"></script>
  <script src="../../js/toolbar.js"></script>
  <script src="../../js/annotations.js"></script>
  <script src="../../js/engage.js"></script>
</body>
```

- [ ] **Step 2: Open `units/alicogia/index.html` in browser — verify no console errors** (JS will fail to find some new elements but should not crash; toolbar renders visually)

- [ ] **Step 3: Commit**
```bash
git add units/alicogia/index.html
git commit -m "feat: replace toolbar with grouped layout, add sidebar + overlay shells"
```

---

### Task 2: Add sidebar, tool-group, and overlay CSS to css/main.css

**Files:**
- Modify: `css/main.css` (append at end)

- [ ] **Step 1: Append the following to the END of `css/main.css`:**

```css
/* ── Tool Groups ── */
.toolbar { display:flex; align-items:center; gap:6px; padding:10px 16px 14px; flex-wrap:wrap; background:var(--bg-header); position:relative; }
.tool-group { display:flex; align-items:center; gap:2px; background:rgba(0,0,0,0.04); border:1px solid var(--border); border-radius:8px; padding:4px; flex-shrink:0; }
body.theme-midnight .tool-group, body.theme-violet .tool-group { background:rgba(255,255,255,0.04); }
.tool-btn { display:flex; flex-direction:column; align-items:center; gap:2px; font-size:11px; min-width:44px; padding:5px 8px; border-radius:6px; border:none; background:transparent; color:var(--text-secondary); cursor:pointer; transition:background 0.15s,color 0.15s; white-space:nowrap; }
.tool-btn:hover { background:rgba(0,0,0,0.07); color:var(--text-primary); }
.tool-btn.active { background:var(--accent); color:#fff; }
.tool-btn:active { transform:scale(0.96); }
.bi { font-size:14px; line-height:1; }
.bl { font-size:9px; font-weight:600; letter-spacing:0.3px; opacity:0.75; }
.tool-btn.active .bl { opacity:1; }
.tool-btn-sm { min-width:28px; padding:5px 4px; }
.timer-display { background:var(--accent) !important; color:#fff !important; font-weight:700; font-size:13px; min-width:72px; flex-direction:row; gap:4px; }
.timer-running { animation:pulse 1s infinite; }
.timer-presets { background:transparent; border:none; color:var(--text-muted); font-size:11px; cursor:pointer; padding:4px 2px; outline:none; }
.cubes-c { color:#e05050; font-weight:900; }
.cubes-u { color:#4a80d0; font-weight:900; }
.cubes-b { color:#4aad6a; font-weight:900; }
.cubes-e { color:#d0b020; font-weight:900; }
.cubes-s { color:#e08030; font-weight:900; }
.tool-engage { background:var(--accent-light) !important; color:var(--accent) !important; border:1px solid var(--accent-border) !important; }
.tool-downloads { margin-left:auto; background:var(--text-primary) !important; color:var(--bg-page) !important; }

/* ── Benchmark Banner ── */
.benchmark-banner { background:var(--accent); color:#fff; padding:8px 16px; font-size:12px; font-weight:600; display:flex; align-items:center; justify-content:space-between; }

/* ── Sidebar + Layout ── */
.page-layout { display:flex; min-height:calc(100vh - 200px); }
.sidebar { width:220px; background:var(--bg-header); border-right:1px solid var(--border); flex-shrink:0; position:relative; transition:width 0.2s; overflow:hidden; }
.sidebar.collapsed { width:0; }
.sidebar-unit-title { font-size:10px; font-weight:700; color:var(--text-muted); letter-spacing:1px; text-transform:uppercase; padding:14px 14px 8px; }
.sidebar-days { display:flex; flex-direction:column; gap:2px; padding:0 8px; }
.sidebar-day-btn { text-align:left; padding:8px 10px; border-radius:6px; border:none; background:transparent; color:var(--text-secondary); font-size:12px; cursor:pointer; transition:background 0.15s; white-space:nowrap; }
.sidebar-day-btn:hover { background:rgba(0,0,0,0.06); color:var(--text-primary); }
.sidebar-day-btn.active { background:var(--accent); color:#fff; font-weight:700; }
.sidebar-card-links { padding:8px; border-top:1px solid var(--border); margin-top:8px; }
.sidebar-card-link { font-size:10px; color:var(--text-muted); padding:4px 10px; border-radius:4px; cursor:pointer; display:block; transition:background 0.1s; }
.sidebar-card-link:hover { background:rgba(0,0,0,0.05); color:var(--text-primary); }
.sidebar-toggle { position:absolute; right:-12px; top:50%; transform:translateY(-50%); width:24px; height:24px; border-radius:50%; background:var(--bg-card); border:1px solid var(--border); cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center; z-index:10; box-shadow:var(--shadow); }
.sidebar.collapsed + .content-area { margin-left:0; }
.content-area { flex:1; min-width:0; }

/* ── GR Phase Badge ── */
.gr-phase-badge { position:fixed; bottom:20px; right:20px; background:var(--accent); color:#fff; padding:8px 16px; border-radius:20px; font-size:12px; font-weight:700; z-index:400; box-shadow:var(--shadow-lifted); pointer-events:none; }

/* ── Slide Panels ── */
.slide-panel { position:fixed; right:0; top:0; height:100vh; width:320px; background:var(--bg-card); border-left:1px solid var(--border); box-shadow:var(--shadow-lifted); z-index:300; overflow-y:auto; }
.slide-panel-header { padding:16px; font-size:13px; font-weight:700; color:var(--text-primary); border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; background:var(--bg-card); }
.slide-panel-body { padding:16px; }
.panel-close { background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:16px; }

/* ── Fullscreen Overlays ── */
.fullscreen-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:var(--bg-page); z-index:800; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:40px; }
.overlay-close { position:absolute; top:16px; right:16px; background:var(--accent); color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; }

/* ── Flashcard ── */
.flashcard-container { width:100%; max-width:560px; }
.flashcard { background:var(--bg-card); border:2px solid var(--border); border-radius:16px; padding:40px; min-height:240px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; transition:transform 0.2s; text-align:center; box-shadow:var(--shadow-lifted); }
.flashcard:hover { transform:scale(1.01); }
.flashcard-word { font-size:28px; font-weight:900; color:var(--text-primary); margin-bottom:8px; }
.flashcard-pos { font-size:12px; color:var(--text-muted); font-style:italic; margin-bottom:16px; }
.flashcard-def { font-size:16px; color:var(--text-secondary); line-height:1.5; display:none; }
.flashcard-example { font-size:13px; color:var(--text-muted); font-style:italic; margin-top:10px; display:none; }
.flashcard.flipped .flashcard-def, .flashcard.flipped .flashcard-example { display:block; }
.flashcard-hint { font-size:12px; color:var(--text-muted); margin-top:16px; }
.flashcard-nav { display:flex; align-items:center; gap:24px; margin-top:24px; font-size:14px; }
.flashcard-nav button { background:var(--accent); color:#fff; border:none; padding:8px 20px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; }

/* ── Exit Ticket ── */
.exit-ticket-content { width:100%; max-width:600px; text-align:center; }
.exit-ticket-prompt { font-size:22px; font-weight:800; color:var(--text-primary); line-height:1.4; margin-bottom:24px; }
.exit-ticket-frame { font-size:15px; color:var(--text-secondary); background:var(--accent-light); border:1px solid var(--accent-border); padding:16px 24px; border-radius:8px; font-style:italic; }

/* ── QR Modal ── */
.modal-overlay { position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:900; display:flex; align-items:center; justify-content:center; }
.modal-box { background:var(--bg-card); border-radius:16px; padding:32px; text-align:center; max-width:360px; }
.modal-title { font-size:16px; font-weight:700; color:var(--text-primary); margin-bottom:20px; }
.modal-subtitle { font-size:12px; color:var(--text-muted); margin-top:16px; }
.modal-close { margin-top:16px; background:var(--accent); color:#fff; border:none; padding:8px 24px; border-radius:6px; cursor:pointer; font-size:13px; font-weight:600; }

/* ── STOP Mode ── */
.stop-badge { display:none; font-size:9px; font-weight:700; padding:1px 6px; border-radius:8px; margin-left:6px; background:var(--accent-light); color:var(--accent); border:1px solid var(--accent-border); }
body.stop-mode .stop-badge { display:inline-block; }

/* ── Focus Mode ── */
body.focus-mode .card:not(.in-focus) { display:none; }
body.focus-mode .card.in-focus { grid-column:1/-1; }

/* ── Split Screen ── */
body.split-screen .content-grid { grid-template-columns:1fr 1fr; }
body.split-screen .card-passage, body.split-screen .card-organizer { grid-row:1; }

/* ── Student Mode ── */
body.student-mode .toolbar { display:none; }
body.student-mode .sidebar { display:none; }
body.student-mode .teacher-only-hidden { display:none !important; }
body.student-mode .teacher-badge { display:none; }

/* ── High Contrast ── */
body.high-contrast { --bg-page:#000; --bg-card:#000; --bg-header:#111; --bg-nav:#000; --text-primary:#fff; --text-secondary:#eee; --text-muted:#aaa; --border:#fff; --accent:#ff0; --shadow:none; }

/* ── Dyslexia Font ── */
body.dyslexia-font, body.dyslexia-font * { font-family:'OpenDyslexic', Arial, sans-serif !important; }

/* ── Line Numbers ── */
#passage-text { counter-reset:line-num; }
body.line-numbers .passage-para::before { counter-increment:line-num; content:counter(line-num); font-size:9px; color:var(--text-muted); font-weight:700; margin-right:8px; min-width:18px; display:inline-block; text-align:right; }

/* ── Print ── */
@media print {
  .toolbar, .nav, .sidebar, .footer, #timer-overlay, .annotation-toolbar,
  .gr-phase-badge, .slide-panel, .fullscreen-overlay, .modal-overlay,
  .benchmark-banner, #assessment-section { display:none !important; }
  .page-layout { display:block; }
  .content-grid { grid-template-columns:1fr; }
  .card { break-inside:avoid; margin-bottom:12px; }
}

/* Cubes annotation toolbar buttons */
.cubes-btn { width:28px; height:28px; border-radius:50%; border:2px solid transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:900; color:#fff; transition:transform 0.15s; }
.cubes-btn.active { border-color:#fff; transform:scale(1.15); }
```

- [ ] **Step 2: Verify in browser** — open `units/alicogia/index.html`
  - Sidebar visible on left (220px), content grid on right
  - Toolbar shows grouped buttons with icon+label layout
  - CUBES group shows C/U/B/E/S buttons in their colors

- [ ] **Step 3: Commit**
```bash
git add css/main.css
git commit -m "feat: add sidebar, tool-group, overlay, and all Phase C CSS"
```

---

## Chunk 2: nav.js Rewrite

### Task 3: Rewrite js/nav.js — sidebar navigation + window.currentDay

**Files:**
- Modify: `js/nav.js` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `js/nav.js` with:**

```js
// nav.js — Sidebar navigation, day switching, keyboard shortcuts
// Exposes: window.currentDay (number), window.switchDay (function)

window.currentDay = 1;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof UNIT === 'undefined') return;

  // ── Populate unit header ──
  const benchLabel = document.getElementById('unit-benchmark-label');
  const unitTitle  = document.getElementById('unit-title');
  const unitMeta   = document.getElementById('unit-meta');
  if (benchLabel) benchLabel.textContent = UNIT.meta.benchmark + ' — ' + UNIT.meta.benchmarkLabel;
  if (unitTitle)  unitTitle.textContent  = UNIT.meta.title;
  if (unitMeta)   unitMeta.textContent   = UNIT.meta.days + '-Day Unit';

  // ── Sidebar unit title ──
  const sidebarTitle = document.getElementById('sidebar-unit-title');
  if (sidebarTitle) sidebarTitle.textContent = UNIT.meta.title;

  // ── Build day buttons in sidebar ──
  const sidebarDays = document.getElementById('sidebar-days');
  if (sidebarDays) {
    for (let d = 1; d <= UNIT.meta.days; d++) {
      const btn = document.createElement('button');
      btn.className = 'sidebar-day-btn';
      btn.dataset.day = d;
      const dayData = UNIT.days[d];
      btn.textContent = dayData && dayData.label ? dayData.label : 'Day ' + d;
      btn.addEventListener('click', () => switchDay(d));
      sidebarDays.appendChild(btn);
    }
  }

  // ── Footer prev/next ──
  const prevFooter = document.getElementById('prev-day-footer');
  const nextFooter = document.getElementById('next-day-footer');

  // ── Sidebar toggle ──
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
    });
  }

  // ── Keyboard nav ──
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft'  && window.currentDay > 1)               switchDay(window.currentDay - 1);
    if (e.key === 'ArrowRight' && window.currentDay < UNIT.meta.days)  switchDay(window.currentDay + 1);
  });

  // ── Restore last day ──
  const savedDay = parseInt(localStorage.getItem('ir-last-day-' + UNIT.meta.id)) || 1;
  const startDay = (savedDay >= 1 && savedDay <= UNIT.meta.days) ? savedDay : 1;
  switchDay(startDay);

  function updateFooter() {
    if (prevFooter) prevFooter.textContent = window.currentDay > 1 ? '← Day ' + (window.currentDay - 1) : '';
    if (nextFooter) nextFooter.textContent = window.currentDay < UNIT.meta.days ? 'Day ' + (window.currentDay + 1) + ' →' : '';
    if (prevFooter) prevFooter.onclick = () => { if (window.currentDay > 1) switchDay(window.currentDay - 1); };
    if (nextFooter) nextFooter.onclick = () => { if (window.currentDay < UNIT.meta.days) switchDay(window.currentDay + 1); };
  }

  // Make switchDay accessible globally — toolbar.js and engage.js read window.currentDay
  window.switchDay = function switchDay(day) {
    window.currentDay = day;
    localStorage.setItem('ir-last-day-' + UNIT.meta.id, day);

    // Update sidebar button states
    document.querySelectorAll('.sidebar-day-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.day) === day);
    });

    updateFooter();

    // Reset GR phase badge on day change
    if (typeof window.resetGrPhase === 'function') window.resetGrPhase();

    // Clear annotations on day change
    if (typeof window.clearAnnotations === 'function') window.clearAnnotations();

    // Render content
    if (typeof renderDayContent === 'function') renderDayContent(day);
  };
});
```

- [ ] **Step 2: Open browser, verify**
  - Sidebar shows unit title + Day 1–6 buttons
  - Clicking a day button switches content
  - ArrowLeft/Right keyboard navigation works
  - Sidebar toggle (‹) collapses the sidebar

- [ ] **Step 3: Commit**
```bash
git add js/nav.js
git commit -m "feat: rewrite nav.js as sidebar navigation with window.currentDay"
```

---

## Chunk 3: toolbar.js Rewrite

### Task 4: Rewrite js/toolbar.js — all toolbar features

**Files:**
- Modify: `js/toolbar.js` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `js/toolbar.js` with the following:**

```js
function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {

  // ── Student Mode ──
  const params = new URLSearchParams(location.search);
  if (params.get('mode') === 'student') {
    document.body.classList.add('student-mode');
    window.studentMode = true;
  }

  // ── Projection Mode ──
  const btnProjection = document.getElementById('btn-projection');
  if (btnProjection) {
    btnProjection.addEventListener('click', toggleProjection);
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'p' || e.key === 'P') toggleProjection();
      if (e.key === 't' || e.key === 'T') toggleTeacherView();
    });
  }
  function toggleProjection() {
    const on = document.body.classList.toggle('projection-mode');
    if (btnProjection) btnProjection.classList.toggle('active', on);
    if (typeof timerShowOverlay === 'function') timerShowOverlay(on);
  }

  // ── Spotlight ──
  const btnSpotlight = document.getElementById('btn-spotlight');
  if (btnSpotlight) btnSpotlight.addEventListener('click', () => {
    const on = document.body.classList.toggle('spotlight-mode');
    btnSpotlight.classList.toggle('active', on);
    if (!on) document.querySelectorAll('.card').forEach(c => c.classList.remove('dimmed', 'spotlight-focus'));
  });

  // ── Font Size ──
  const fontSizes = ['', 'font-large', 'font-xlarge'];
  let fontIndex = 0;
  const btnFont = document.getElementById('btn-font');
  if (btnFont) btnFont.addEventListener('click', () => {
    document.body.classList.remove(...fontSizes.filter(Boolean));
    fontIndex = (fontIndex + 1) % fontSizes.length;
    if (fontSizes[fontIndex]) document.body.classList.add(fontSizes[fontIndex]);
    btnFont.classList.toggle('active', fontIndex > 0);
  });

  // ── Focus Mode ──
  const btnFocus = document.getElementById('btn-focus');
  if (btnFocus) {
    btnFocus.addEventListener('click', () => {
      const on = document.body.classList.toggle('focus-mode');
      btnFocus.classList.toggle('active', on);
      if (on) {
        document.querySelectorAll('.card').forEach(card => {
          card.addEventListener('click', () => {
            document.querySelectorAll('.card').forEach(c => c.classList.remove('in-focus'));
            card.classList.add('in-focus');
          }, { once: false });
        });
        const first = document.querySelector('.card');
        if (first) first.classList.add('in-focus');
      } else {
        document.querySelectorAll('.card').forEach(c => c.classList.remove('in-focus'));
      }
    });
  }

  // ── Split Screen ──
  const btnSplit = document.getElementById('btn-split-screen');
  if (btnSplit) btnSplit.addEventListener('click', () => {
    const on = document.body.classList.toggle('split-screen');
    btnSplit.classList.toggle('active', on);
  });

  // ── Teacher / Student View ──
  const btnTeacher = document.getElementById('btn-teacher-view');
  let isTeacherView = true;
  if (btnTeacher) {
    btnTeacher.classList.add('active');
    applyTeacherViewState(true);
    btnTeacher.addEventListener('click', toggleTeacherView);
  }
  function toggleTeacherView() {
    isTeacherView = !isTeacherView;
    if (btnTeacher) btnTeacher.classList.toggle('active', isTeacherView);
    applyTeacherViewState(isTeacherView);
  }
  function applyTeacherViewState(show) {
    document.body.classList.toggle('student-view', !show);
    document.querySelectorAll('.teacher-only-hidden').forEach(el => el.style.display = show ? '' : 'none');
    if (typeof applyTeacherView === 'function') applyTeacherView(show);
  }

  // ── Reveal Answers ──
  const btnReveal = document.getElementById('btn-reveal');
  let answersRevealed = false;
  if (btnReveal) btnReveal.addEventListener('click', () => {
    answersRevealed = !answersRevealed;
    document.body.classList.toggle('reveal-answers', answersRevealed);
    btnReveal.classList.toggle('active', answersRevealed);
    if (typeof applyRevealState === 'function') applyRevealState(answersRevealed);
  });

  // ── ESOL Level (cycles Off → L1-2 → L3-4 → L5 → Off) ──
  const esolLevels = [null, 'l12', 'l34', 'l5'];
  const esolLabels = ['ESOL Off', 'ESOL L1–2', 'ESOL L3–4', 'ESOL L5'];
  let esolIndex = 0;
  window.currentEsolLevel = null;
  const btnEsol = document.getElementById('btn-esol');
  if (btnEsol) btnEsol.addEventListener('click', () => {
    esolIndex = (esolIndex + 1) % esolLevels.length;
    window.currentEsolLevel = esolLevels[esolIndex];
    const labelEl = btnEsol.querySelector('.bl');
    if (labelEl) labelEl.textContent = esolLabels[esolIndex];
    btnEsol.classList.toggle('active', esolIndex > 0);
    document.body.classList.remove('esol-mode');
    if (esolIndex > 0) document.body.classList.add('esol-mode');
    if (typeof renderDayContent === 'function') renderDayContent(window.currentDay);
  });

  // ── Benchmark Banner ──
  const btnBanner = document.getElementById('btn-benchmark-banner');
  const banner = document.getElementById('benchmark-banner');
  const bannerText = document.getElementById('benchmark-banner-text');
  if (btnBanner && banner) {
    btnBanner.addEventListener('click', () => {
      const visible = banner.style.display !== 'none';
      banner.style.display = visible ? 'none' : 'flex';
      btnBanner.classList.toggle('active', !visible);
      if (!visible && typeof UNIT !== 'undefined') {
        const desc = UNIT.meta.benchmarkDescription || UNIT.meta.benchmarkLabel || '';
        if (bannerText) bannerText.textContent = UNIT.meta.benchmark + ' — ' + desc;
      }
    });
  }

  // ── GR Phase Badge ──
  const grPhases = ['I Do', 'We Do', 'You Do w/ Partner', 'You Do'];
  let grIndex = -1;
  const grBadge = document.getElementById('gr-badge');
  const btnGr = document.getElementById('btn-gr-phase');
  window.resetGrPhase = function() { grIndex = -1; if (grBadge) grBadge.style.display = 'none'; if (btnGr) btnGr.classList.remove('active'); };
  if (btnGr) btnGr.addEventListener('click', () => {
    grIndex = (grIndex + 1) % (grPhases.length + 1);
    const phase = grPhases[grIndex % grPhases.length];
    if (grIndex >= grPhases.length) { window.resetGrPhase(); return; }
    if (grBadge) { grBadge.textContent = phase; grBadge.style.display = 'block'; }
    btnGr.classList.add('active');
    const labelEl = btnGr.querySelector('.bl');
    if (labelEl) labelEl.textContent = phase;
  });

  // ── RACE/ACE Panel ──
  const btnRace = document.getElementById('btn-race');
  const racePanel = document.getElementById('race-panel');
  const racePanelBody = document.getElementById('race-panel-body');
  if (btnRace && racePanel) {
    btnRace.addEventListener('click', () => {
      const visible = racePanel.style.display !== 'none';
      racePanel.style.display = visible ? 'none' : 'block';
      btnRace.classList.toggle('active', !visible);
      if (!visible) renderRacePanel();
    });
  }
  function renderRacePanel() {
    if (!racePanelBody || typeof UNIT === 'undefined') return;
    const day = window.currentDay || 1;
    const frames = (UNIT.days[day] && UNIT.days[day].raceFrames) || {};
    if (!frames.task) { racePanelBody.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No RACE frames for this day.</p>'; return; }
    const steps = [
      { key: 'restate', label: 'R — Restate', color: '#6c4fad' },
      { key: 'answer',  label: 'A — Answer',  color: '#3a8a5a' },
      { key: 'cite',    label: 'C — Cite',    color: '#4060a0' },
      { key: 'explain', label: 'E — Explain', color: '#9040a0' }
    ];
    racePanelBody.innerHTML = `
      <p style="font-size:13px;font-weight:700;color:var(--text-primary);margin-bottom:16px;">${esc(frames.task)}</p>
      ${steps.map(s => frames[s.key] ? `
        <div style="margin-bottom:12px;padding:10px 12px;background:var(--bg-page);border-radius:6px;border-left:3px solid ${s.color}">
          <div style="font-size:10px;font-weight:700;color:${s.color};letter-spacing:1px;margin-bottom:4px;">${esc(s.label)}</div>
          <div style="font-size:12px;color:var(--text-secondary);font-style:italic;">"${esc(frames[s.key])}"</div>
        </div>` : '').join('')}`;
  }

  // ── Achievement Levels Panel ──
  const btnAchievement = document.getElementById('btn-achievement');
  const achievementPanel = document.getElementById('achievement-panel');
  const achievementBody = document.getElementById('achievement-panel-body');
  if (btnAchievement && achievementPanel) {
    btnAchievement.addEventListener('click', () => {
      const visible = achievementPanel.style.display !== 'none';
      achievementPanel.style.display = visible ? 'none' : 'block';
      btnAchievement.classList.toggle('active', !visible);
      if (!visible) renderAchievementPanel();
    });
  }
  function renderAchievementPanel() {
    if (!achievementBody || typeof UNIT === 'undefined') return;
    const levels = (UNIT.assessment && UNIT.assessment.achievementLevels) || [];
    if (!levels.length) { achievementBody.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No achievement levels defined for this unit.</p>'; return; }
    achievementBody.innerHTML = levels.map(l => `
      <div style="margin-bottom:12px;padding:12px;background:var(--bg-page);border-radius:6px;">
        <div style="font-size:10px;font-weight:700;color:var(--accent);letter-spacing:1px;text-transform:uppercase;">Level ${esc(l.level)} — ${esc(l.label)}</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:6px;line-height:1.5;">${esc(l.descriptor)}</div>
      </div>`).join('');
  }

  // ── Vocab Quick Reference Panel ──
  const btnVocabRef = document.getElementById('btn-vocab-ref');
  const vocabRefPanel = document.getElementById('vocab-ref-panel');
  const vocabRefBody = document.getElementById('vocab-ref-body');
  const vocabRefDay = document.getElementById('vocab-ref-day');
  if (btnVocabRef && vocabRefPanel) {
    btnVocabRef.addEventListener('click', () => {
      const visible = vocabRefPanel.style.display !== 'none';
      vocabRefPanel.style.display = visible ? 'none' : 'block';
      btnVocabRef.classList.toggle('active', !visible);
      if (!visible) renderVocabRef();
    });
  }
  function renderVocabRef() {
    const day = window.currentDay || 1;
    if (vocabRefDay) vocabRefDay.textContent = day;
    if (!vocabRefBody || typeof UNIT === 'undefined') return;
    const vocab = (UNIT.days[day] && UNIT.days[day].vocab) || [];
    if (!vocab.length) { vocabRefBody.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No vocabulary for this day.</p>'; return; }
    vocabRefBody.innerHTML = vocab.map(v => `
      <div style="padding:10px 0;border-bottom:1px solid var(--border-light);">
        <span style="font-weight:800;color:var(--text-primary);font-size:14px;">${esc(v.word)}</span>
        <span style="font-size:10px;color:var(--text-muted);font-style:italic;margin-left:6px;">${esc(v.partOfSpeech || '')}</span>
        <div style="font-size:12px;color:var(--text-secondary);margin-top:4px;">${esc(v.definition)}</div>
        ${v.example ? `<div style="font-size:11px;color:var(--text-muted);font-style:italic;margin-top:3px;">"${esc(v.example)}"</div>` : ''}
      </div>`).join('');
  }

  // ── Pacing Guide Panel ──
  const btnPacing = document.getElementById('btn-pacing');
  const pacingPanel = document.getElementById('pacing-panel');
  const pacingBody = document.getElementById('pacing-body');
  const pacingDay = document.getElementById('pacing-day');
  if (btnPacing && pacingPanel) {
    btnPacing.addEventListener('click', () => {
      const visible = pacingPanel.style.display !== 'none';
      pacingPanel.style.display = visible ? 'none' : 'block';
      btnPacing.classList.toggle('active', !visible);
      if (!visible) renderPacingGuide();
    });
  }
  function renderPacingGuide() {
    const day = window.currentDay || 1;
    if (pacingDay) pacingDay.textContent = day;
    if (!pacingBody || typeof UNIT === 'undefined') return;
    const guide = (UNIT.days[day] && UNIT.days[day].pacingGuide) || {};
    const labels = { bellringer:'Bellringer', vocab:'Vocabulary', organizer:'Organizer', teacher:'Teacher Notes', passage:'Passage' };
    const rows = Object.entries(guide).filter(([,v]) => v > 0).map(([k,v]) => `
      <tr><td style="padding:6px 8px;font-size:12px;color:var(--text-secondary);">${esc(labels[k] || k)}</td><td style="padding:6px 8px;font-size:12px;font-weight:700;color:var(--text-primary);text-align:right;">${esc(v)} min</td></tr>`).join('');
    if (!rows) { pacingBody.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">No pacing guide for this day.</p>'; return; }
    const total = Object.values(guide).reduce((a,b) => a + b, 0);
    pacingBody.innerHTML = `<table style="width:100%;border-collapse:collapse;">${rows}<tr style="border-top:2px solid var(--border);"><td style="padding:8px;font-size:12px;font-weight:700;color:var(--text-primary);">Total</td><td style="padding:8px;font-size:12px;font-weight:700;color:var(--accent);text-align:right;">${total} min</td></tr></table>`;
  }

  // ── Exit Ticket ──
  const btnExitTicket = document.getElementById('btn-exit-ticket');
  const exitOverlay = document.getElementById('exit-ticket-overlay');
  const exitContent = document.getElementById('exit-ticket-content');
  if (btnExitTicket && exitOverlay) {
    btnExitTicket.addEventListener('click', () => {
      const visible = exitOverlay.style.display !== 'none';
      exitOverlay.style.display = visible ? 'none' : 'flex';
      btnExitTicket.classList.toggle('active', !visible);
      if (!visible) renderExitTicket();
    });
  }
  function renderExitTicket() {
    const day = window.currentDay || 1;
    if (!exitContent || typeof UNIT === 'undefined') return;
    const et = (UNIT.days[day] && UNIT.days[day].exitTicket) || {};
    if (!et.prompt) { exitContent.innerHTML = '<p style="color:var(--text-muted);font-size:16px;">No exit ticket for this day.</p>'; return; }
    exitContent.innerHTML = `
      <div class="exit-ticket-prompt">${esc(et.prompt)}</div>
      ${et.frame && !window.studentMode ? `<div class="exit-ticket-frame">${esc(et.frame)}</div>` : ''}`;
  }

  // ── Read Aloud ──
  const btnReadAloud = document.getElementById('btn-read-aloud');
  let speechUtterance = null;
  if (btnReadAloud) {
    btnReadAloud.addEventListener('click', () => {
      if (speechSynthesis.speaking) { speechSynthesis.cancel(); btnReadAloud.classList.remove('active'); return; }
      const day = window.currentDay || 1;
      if (typeof UNIT === 'undefined' || !UNIT.days[day] || !UNIT.days[day].textPassage) return;
      const paras = UNIT.days[day].textPassage.paragraphs || [];
      const text = paras.map(p => p.text || '').join(' ');
      if (!text) return;
      speechUtterance = new SpeechSynthesisUtterance(text);
      speechUtterance.rate = 0.9;
      speechUtterance.onend = () => btnReadAloud.classList.remove('active');
      speechSynthesis.speak(speechUtterance);
      btnReadAloud.classList.add('active');
    });
  }

  // ── Dyslexia Font ──
  const btnDyslexia = document.getElementById('btn-dyslexia');
  if (btnDyslexia) {
    btnDyslexia.addEventListener('click', () => {
      const on = document.body.classList.toggle('dyslexia-font');
      btnDyslexia.classList.toggle('active', on);
      if (on && !document.getElementById('opendyslexic-font')) {
        const link = document.createElement('link');
        link.id = 'opendyslexic-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.cdnfonts.com/css/opendyslexic';
        document.head.appendChild(link);
      }
    });
  }

  // ── High Contrast ──
  const btnContrast = document.getElementById('btn-high-contrast');
  if (btnContrast) btnContrast.addEventListener('click', () => {
    const on = document.body.classList.toggle('high-contrast');
    btnContrast.classList.toggle('active', on);
  });

  // ── Line Numbers ──
  const btnLines = document.getElementById('btn-line-numbers');
  if (btnLines) btnLines.addEventListener('click', () => {
    const on = document.body.classList.toggle('line-numbers');
    btnLines.classList.toggle('active', on);
  });

  // ── QR Code ──
  const btnQr = document.getElementById('btn-qr');
  const qrModal = document.getElementById('qr-modal');
  const qrRender = document.getElementById('qr-code-render');
  const qrDayLabel = document.getElementById('qr-day-label');
  if (btnQr && qrModal) {
    btnQr.addEventListener('click', () => {
      const day = window.currentDay || 1;
      const url = location.origin + location.pathname + '?mode=student&day=' + day;
      if (qrDayLabel) qrDayLabel.textContent = day;
      qrModal.style.display = 'flex';
      if (qrRender) {
        qrRender.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
          new QRCode(qrRender, { text: url, width: 200, height: 200 });
        } else {
          // Load qrcode.js on first use
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
          s.onload = () => new QRCode(qrRender, { text: url, width: 200, height: 200 });
          document.head.appendChild(s);
        }
      }
      // Auto-close after 30 seconds
      setTimeout(() => { if (qrModal.style.display !== 'none') qrModal.style.display = 'none'; }, 30000);
    });
  }

  // ── Vocab Flashcards ──
  const btnFlashcards = document.getElementById('btn-vocab-flashcards');
  const flashcardOverlay = document.getElementById('flashcard-overlay');
  const flashcardContainer = document.getElementById('flashcard-container');
  const flashcardCounter = document.getElementById('flashcard-counter');
  let flashState = { index: 0, flipped: false, vocab: [] };
  if (btnFlashcards && flashcardOverlay) {
    btnFlashcards.addEventListener('click', () => {
      const visible = flashcardOverlay.style.display !== 'none';
      flashcardOverlay.style.display = visible ? 'none' : 'flex';
      btnFlashcards.classList.toggle('active', !visible);
      if (!visible) initFlashcards();
    });
    document.getElementById('flashcard-prev').addEventListener('click', () => { flashState.index = Math.max(0, flashState.index - 1); flashState.flipped = false; renderFlashcard(); });
    document.getElementById('flashcard-next').addEventListener('click', () => { flashState.index = Math.min(flashState.vocab.length - 1, flashState.index + 1); flashState.flipped = false; renderFlashcard(); });
    document.addEventListener('keydown', (e) => {
      if (flashcardOverlay.style.display === 'none') return;
      if (e.code === 'Space') { e.preventDefault(); flashState.flipped = !flashState.flipped; renderFlashcard(); }
      if (e.key === 'ArrowRight') { flashState.index = Math.min(flashState.vocab.length - 1, flashState.index + 1); flashState.flipped = false; renderFlashcard(); }
      if (e.key === 'ArrowLeft') { flashState.index = Math.max(0, flashState.index - 1); flashState.flipped = false; renderFlashcard(); }
    });
  }
  function initFlashcards() {
    const day = window.currentDay || 1;
    flashState.vocab = (typeof UNIT !== 'undefined' && UNIT.days[day] && UNIT.days[day].vocab) || [];
    flashState.index = 0; flashState.flipped = false;
    renderFlashcard();
  }
  function renderFlashcard() {
    if (!flashcardContainer) return;
    const vocab = flashState.vocab;
    if (!vocab.length) { flashcardContainer.innerHTML = '<p style="color:var(--text-muted)">No vocabulary for this day.</p>'; return; }
    const v = vocab[flashState.index];
    flashcardContainer.innerHTML = `
      <div class="flashcard${flashState.flipped ? ' flipped' : ''}" onclick="this.classList.toggle('flipped')">
        <div class="flashcard-word">${esc(v.word)}</div>
        ${v.partOfSpeech ? `<div class="flashcard-pos">${esc(v.partOfSpeech)}</div>` : ''}
        <div class="flashcard-def">${esc(v.definition)}</div>
        ${v.example ? `<div class="flashcard-example">"${esc(v.example)}"</div>` : ''}
        <div class="flashcard-hint">${flashState.flipped ? 'Click to flip back' : 'Click or press Space to reveal'}</div>
      </div>`;
    if (flashcardCounter) flashcardCounter.textContent = (flashState.index + 1) + ' / ' + vocab.length;
  }

  // ── Downloads Panel ──
  const btnDownloads = document.getElementById('btn-downloads');
  const downloadsPanel = document.getElementById('downloads-panel');
  const btnProgress = document.getElementById('btn-progress');
  const progressPanel = document.getElementById('progress-panel');
  if (btnDownloads && downloadsPanel) {
    btnDownloads.addEventListener('click', (e) => { e.stopPropagation(); downloadsPanel.classList.toggle('visible'); if (progressPanel) progressPanel.classList.remove('visible'); });
    if (typeof UNIT !== 'undefined' && UNIT.downloads) {
      UNIT.downloads.forEach(dl => {
        const item = document.createElement('div');
        item.className = 'download-item';
        item.textContent = '📄 ' + dl.label;
        item.addEventListener('click', () => window.open('downloads/' + dl.filename, '_blank'));
        downloadsPanel.appendChild(item);
      });
    }
  }
  if (btnProgress && progressPanel) {
    btnProgress.addEventListener('click', (e) => { e.stopPropagation(); progressPanel.classList.toggle('visible'); if (downloadsPanel) downloadsPanel.classList.remove('visible'); });
  }
  document.addEventListener('click', () => {
    if (downloadsPanel) downloadsPanel.classList.remove('visible');
    if (progressPanel) progressPanel.classList.remove('visible');
  });

  // ── Assessment Section ──
  const assessToggle = document.getElementById('assessment-toggle');
  const assessBody   = document.getElementById('assessment-body');
  if (assessToggle) {
    assessToggle.addEventListener('click', () => {
      assessBody.classList.toggle('visible');
      assessToggle.querySelector('span').textContent = assessBody.classList.contains('visible') ? '▲' : '▼';
    });
    renderAssessment();
  }

  function renderAssessment() {
    if (typeof UNIT === 'undefined' || !UNIT.assessment) return;
    const a = UNIT.assessment;
    if (!a.stopProtocol) return;
    const stop = a.stopProtocol;
    const stepsHTML = (stop.steps || []).map(s => `
      <div class="stop-cell">
        <div class="stop-letter">${esc(s.letter)}</div>
        <div class="stop-label">${esc(s.label)}</div>
        <div class="stop-desc">${esc(s.description)}</div>
      </div>`).join('');
    const tiersHTML = (a.raceGuide && a.raceGuide.tiers || []).map(t => `
      <div style="margin-bottom:10px;padding:10px 12px;background:var(--bg-page);border-radius:6px;">
        <div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">${esc(t.tier)} — ${esc(t.label)}</div>
        <div style="font-size:12px;color:var(--text-secondary);font-style:italic;">"${esc(t.frame)}"</div>
      </div>`).join('');
    assessBody.innerHTML = `
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">STOP Protocol</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${esc(stop.description || '')}</div>
        <div class="stop-grid">${stepsHTML}</div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">RACE/ACE Constructed Response</div>
        ${tiersHTML}
      </div>`;
  }
});

// ── Progress Panel (called from nav.js after day switch) ──
function updateProgressPanel(day) {
  const panel = document.getElementById('progress-panel');
  if (!panel || typeof UNIT === 'undefined') return;
  const items = (UNIT.days[day] && UNIT.days[day].progressItems) || [];
  const storageKey = 'ir-progress-' + UNIT.meta.id + '-day' + day;
  const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
  panel.innerHTML = `<div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Day ${day} Progress</div>`;
  items.forEach((item, i) => {
    const checked = saved.includes(i);
    const el = document.createElement('div');
    el.className = 'progress-item' + (checked ? ' done' : '');
    el.innerHTML = `<input type="checkbox" ${checked ? 'checked' : ''}> ${item}`;
    el.querySelector('input').addEventListener('change', (e) => {
      const current = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const updated = e.target.checked ? [...new Set([...current, i])] : current.filter(x => x !== i);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      el.classList.toggle('done', e.target.checked);
    });
    panel.appendChild(el);
  });
}
```

- [ ] **Step 2: Open browser, verify all features work:**
  - Teacher View toggle (T key)
  - Projection mode (P key)
  - ESOL cycling (Off → L1–2 → L3–4 → L5 → Off)
  - GR Phase Badge (click cycles, resets on day change)
  - RACE/ACE panel opens with day content
  - Achievement panel opens
  - Vocab ref panel opens with day vocab
  - Pacing guide panel opens
  - Exit ticket overlay opens
  - Read aloud plays passage text
  - Dyslexia font toggles
  - High contrast toggles
  - Line numbers toggle on passage
  - QR code modal opens (may take a moment to load qrcode.js)
  - Flashcards: Space flips, arrows navigate
  - Downloads and progress panels still work

- [ ] **Step 3: Commit**
```bash
git add js/toolbar.js
git commit -m "feat: rewrite toolbar.js with all Phase C grouped features"
```

---

## Chunk 4: CUBES + STOP

### Task 5: Rewrite CUBES tools in js/annotations.js

**Files:**
- Modify: `js/annotations.js` (rewrite annotation drawing section)

- [ ] **Step 1: Replace the entire contents of `js/annotations.js` with:**

```js
(function() {
  const canvas = document.getElementById('annotation-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let currentTool = 'circle'; // circle | underline | box | star
  let isDrawing = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;

  const toolColors = { circle:'#e05050', underline:'#4a80d0', box:'#4aad6a', star:'#e08030' };

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();

    // CUBES toolbar buttons (floating annotation toolbar)
    document.querySelectorAll('.cubes-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTool = btn.dataset.cubes;
        document.querySelectorAll('.cubes-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    // CUBES toolbar buttons in main toolbar
    document.querySelectorAll('[data-cubes]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.cubes;
        if (tool === 'eliminate') {
          // Eliminate: add CSS strikethrough to clicked .mc-choice elements
          toggleEliminateMode();
          btn.classList.toggle('active');
          return;
        }
        // Other tools: activate annotation canvas
        const alreadyActive = btn.classList.contains('active');
        document.querySelectorAll('[data-cubes]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.cubes-btn').forEach(b => b.classList.remove('active'));
        if (alreadyActive) {
          // Toggle off
          canvas.classList.remove('visible');
          document.getElementById('annotation-toolbar').classList.remove('visible');
          return;
        }
        currentTool = tool;
        btn.classList.add('active');
        // Sync floating toolbar
        document.querySelectorAll('.cubes-btn').forEach(b => b.classList.toggle('active', b.dataset.cubes === tool));
        canvas.classList.add('visible');
        document.getElementById('annotation-toolbar').classList.add('visible');
      });
    });

    // Clear button
    const btnClear = document.getElementById('btn-clear-annotations');
    if (btnClear) btnClear.addEventListener('click', clearAnnotations);

    // Canvas draw events
    if (canvas) {
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', drawMove);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mouseleave', endDraw);
      canvas.addEventListener('touchstart', (e) => { e.preventDefault(); const t = e.touches[0]; startDraw({ offsetX: t.clientX, offsetY: t.clientY }); });
      canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; drawMove({ offsetX: t.clientX, offsetY: t.clientY }); });
      canvas.addEventListener('touchend', endDraw);
    }
  });

  function startDraw(e) {
    if (!canvas.classList.contains('visible')) return;
    isDrawing = true;
    startX = e.offsetX; startY = e.offsetY;
    lastX = e.offsetX; lastY = e.offsetY;
  }

  function drawMove(e) {
    if (!isDrawing) return;
    const color = toolColors[currentTool] || '#e05050';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'circle' || currentTool === 'box') {
      // For circle/box: redraw a preview each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Re-draw all committed strokes... simplified: just draw current
      ctx.beginPath();
      if (currentTool === 'circle') {
        const rx = (e.offsetX - startX) / 2;
        const ry = (e.offsetY - startY) / 2;
        const cx = startX + rx;
        const cy = startY + ry;
        ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
      } else {
        ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
      }
      ctx.stroke();
    } else if (currentTool === 'underline') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      lastX = e.offsetX; lastY = e.offsetY;
    }
  }

  function endDraw(e) {
    if (!isDrawing) return;
    isDrawing = false;
    const color = toolColors[currentTool] || '#e05050';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    if (currentTool === 'star' && e) {
      drawStar(ctx, e.offsetX || startX, e.offsetY || startY, 5, 18, 8, color);
    }
    // circle/box/underline already drawn in drawMove
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR, color) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fillStyle = color + 'aa';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // ── Eliminate Mode ──
  let eliminateMode = false;
  function toggleEliminateMode() {
    eliminateMode = !eliminateMode;
    if (eliminateMode) {
      document.querySelectorAll('.mc-choice').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', eliminateChoice);
      });
    } else {
      document.querySelectorAll('.mc-choice').forEach(el => {
        el.style.cursor = '';
        el.removeEventListener('click', eliminateChoice);
      });
    }
  }
  function eliminateChoice(e) {
    e.currentTarget.classList.toggle('eliminated');
  }

  window.clearAnnotations = function() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelectorAll('mark').forEach(m => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    document.querySelectorAll('.mc-choice.eliminated').forEach(el => el.classList.remove('eliminated'));
  };
})();
```

- [ ] **Step 2: Add `.mc-choice.eliminated` style to `css/main.css`:**
```css
.mc-choice.eliminated { opacity: 0.4; text-decoration: line-through; }
```

- [ ] **Step 3: Verify CUBES tools in browser:**
  - Click C in toolbar → canvas appears → drag to draw oval circle
  - Click U → draws underline stroke
  - Click B → draws rectangle
  - Click E (Eliminate) → clicking MC answer choices strikes them through
  - Click S → stamps a star where you click
  - Click Clear → removes all annotations and eliminations

- [ ] **Step 4: Commit**
```bash
git add js/annotations.js css/main.css
git commit -m "feat: CUBES annotation tools (circle/underline/box/star/eliminate)"
```

---

### Task 6: Add STOP mode and ESOL level display to js/cards.js

**Files:**
- Modify: `js/cards.js`

- [ ] **Step 1: In `js/cards.js`, update `buildBellringerCard` (and all MC question renders) to include `data-stop-label` and `.stop-badge` on each answer choice.**

Find where MC options are rendered in `buildBellringerCard`. The current MC option HTML looks like:
```js
`<div class="mc-option${q.options[i].isCorrect ? ' correct' : ''}${q.options[i].isCorrect ? ' hidden' : ''}">
  <span class="mc-letter">${esc(letters[i])}</span>...`
```

Replace with a structure that also adds `.mc-choice` class and `.stop-badge`:
```js
const optHTML = q.options.map((opt, i) => `
  <div class="mc-choice mc-option${opt.isCorrect ? ' correct hidden' : ''}" data-stop-label="${esc(opt.stopLabel || '')}">
    <span class="mc-letter">${esc(letters[i])}</span>
    <span class="mc-text">${esc(opt.text)}</span>
    <span class="stop-badge">${esc(opt.stopLabel || '')}</span>
    ${opt.isCorrect ? '<span class="answer-marker"> ✓</span>' : ''}
  </div>`).join('');
```

Apply the same pattern to any other MC rendering locations in `cards.js` (assessment MC, passage questions MC).

- [ ] **Step 2: Update `buildEsolCard` to support 3-tier ESOL levels.**

Find `buildEsolCard` function. Currently renders `UNIT.days[day].esol.frames`. Update to:

```js
function buildEsolCard(day) {
  const esol = UNIT.days[day] && UNIT.days[day].esol;
  if (!esol) return null;
  const level = window.currentEsolLevel || 'l34';
  const tier = esol[level] || esol.l34 || esol;
  const frames = tier.frames || (Array.isArray(tier) ? tier : []);
  const wordBank = tier.wordBank || [];
  const levelLabel = { l12: 'L1–2', l34: 'L3–4', l5: 'L5' }[level] || '';
  // ... rest of buildEsolCard using frames and wordBank from the selected tier
```

- [ ] **Step 3: Add `btn-stop` wiring to STOP mode in cards.js or toolbar.js:**

In `js/toolbar.js` (already written above), add at the top of DOMContentLoaded:
```js
// ── STOP Mode ──
const btnStop = document.getElementById('btn-stop');
if (btnStop) btnStop.addEventListener('click', () => {
  const on = document.body.classList.toggle('stop-mode');
  btnStop.classList.toggle('active', on);
});
```

- [ ] **Step 4: Verify in browser:**
  - Enable STOP mode → all MC answer choices show their STOP label badges
  - Cycle ESOL to L1–2 → ESOL card shows L1–2 frames + word bank
  - Cycle to L3–4 → shows L3–4 frames
  - Cycle to L5 → shows L5 frames only

- [ ] **Step 5: Commit**
```bash
git add js/cards.js js/toolbar.js
git commit -m "feat: STOP mode overlay on MC choices, 3-tier ESOL level display"
```

---

## Chunk 5: Student Mode + Stub Updates

### Task 7: Verify student URL mode

**Files:**
- Test only (student mode is already implemented in toolbar.js above)

- [ ] **Step 1: Test student mode in browser**
  - Navigate to `units/alicogia/index.html?mode=student`
  - Toolbar should be hidden
  - Teacher-only cards should be hidden
  - Teacher badges hidden
  - Timer, passage, bellringer still visible

- [ ] **Step 2: Test QR code generation**
  - Click QR Code button in toolbar
  - Modal appears with QR code
  - URL in QR should include `?mode=student&day=1`

### Task 8: Copy new toolbar HTML to all stub unit pages

**Files:**
- Modify: `units/{id}/index.html` (23 files)

- [ ] **Step 1: Update the generator script or manually copy** the new `units/alicogia/index.html` body content to all 23 stub pages. The simplest approach is to re-run the generator after updating the template:

```bash
cd /Users/alexanderburger/Desktop/ir-platform
node scripts/generate-stubs.js
```

This overwrites all 23 stub `index.html` files with the updated shell (which now includes the full grouped toolbar, sidebar, and all overlays).

- [ ] **Step 2: Verify a stub page has the new toolbar:**
  - Open `units/shakuntala/index.html`
  - Should show grouped toolbar, sidebar, coming-soon placeholder
  - No console errors

- [ ] **Step 3: Create `js/engage.js` as an empty stub** so the script tag doesn't 404:

```js
// engage.js — Engagement panel (implemented in Phase E)
```

- [ ] **Step 4: Commit and push**
```bash
git add units/ js/engage.js
git commit -m "feat: update all 23 stub pages with Phase C toolbar shell"
git push origin main
```
