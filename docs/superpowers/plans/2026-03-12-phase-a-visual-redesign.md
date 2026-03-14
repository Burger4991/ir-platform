# Phase A — Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3-theme system with 6 visually distinctive themes, make EdTech the default, and polish UX/UI across the platform.

**Architecture:** Pure CSS changes — new `themes.css` with 6 theme blocks plus additions to `main.css` for theme-specific card treatments (Ocean left-border, Slate top-bar, Midnight glow, Violet/Azure glassmorphism), tab styles, background gradients, and typography/spacing polish. JS change is a one-liner default.

**Tech Stack:** Vanilla CSS custom properties, no build tools. Verification is browser-only — open `index.html` and `units/alicogia/index.html` in browser, toggle themes, check visuals.

**Spec:** `docs/superpowers/specs/2026-03-12-ir-platform-upgrade-design.md` — Phase A section

---

## File Structure

| File | Change |
|------|--------|
| `css/themes.css` | Full rewrite — 6 themes replacing 3 |
| `css/main.css` | Add ~120 lines at end: theme-specific card/tab overrides, bg gradients, typography, spacing, transitions, home polish |
| `js/theme.js` | Change default fallback from `'warm'` to `'edtech'` |
| `index.html` | Change `<body class="theme-warm">` → `<body class="theme-edtech">` |
| `units/alicogia/index.html` | Change `<body class="theme-warm">` → `<body class="theme-edtech">` |

---

## Chunk 1: Theme CSS + Defaults

### Task 1: Rewrite css/themes.css

**Files:**
- Modify: `css/themes.css` (full rewrite)

- [ ] **Step 1: Replace the entire contents of `css/themes.css` with the following:**

```css
/* ── EdTech (default) — Clean SaaS, soft lavender ── */
:root,
body.theme-edtech {
  --bg-page:       #f4f3ff;
  --bg-header:     #eeecff;
  --bg-card:       #ffffff;
  --bg-card-hover: #faf9ff;
  --bg-nav:        #1a1a2e;
  --bg-filter:     #f4f3ff;
  --border:        #dddaf5;
  --border-light:  #eceaff;
  --accent:        #6c4fad;
  --accent-light:  #f0ecff;
  --accent-border: #c4b8f0;
  --text-primary:  #1a1a2e;
  --text-secondary:#4a3a7a;
  --text-muted:    #8a7ab0;
  --text-nav:      #e8e4ff;
  --text-nav-muted:rgba(232,228,255,0.5);
  --shadow:        0 2px 12px rgba(108,79,173,0.1);
  --shadow-lifted: 0 6px 20px rgba(108,79,173,0.2);
  --card-bellringer:#6c4fad;
  --card-organizer: #3a8a5a;
  --card-vocab:     #9040a0;
  --card-teacher:   #4060a0;
  --card-passage:   #7060a0;
  --card-esol:      #a060c0;
}

/* ── Midnight — True dark, glowing blue borders ── */
body.theme-midnight {
  --bg-page:       #0f1023;
  --bg-header:     #141530;
  --bg-card:       #181930;
  --bg-card-hover: #1e2040;
  --bg-nav:        #0a0a1a;
  --bg-filter:     #0f1023;
  --border:        rgba(67,97,238,0.25);
  --border-light:  rgba(67,97,238,0.12);
  --accent:        #4361ee;
  --accent-light:  rgba(67,97,238,0.15);
  --accent-border: rgba(67,97,238,0.4);
  --text-primary:  #c8d4ff;
  --text-secondary:#8892c8;
  --text-muted:    #5560a0;
  --text-nav:      #c8d4ff;
  --text-nav-muted:rgba(200,212,255,0.4);
  --shadow:        0 0 0 1px rgba(67,97,238,0.2), 0 0 20px rgba(67,97,238,0.06);
  --shadow-lifted: 0 0 0 1px rgba(67,97,238,0.4), 0 0 30px rgba(67,97,238,0.15);
  --card-bellringer:#4361ee;
  --card-organizer: #3a9a6a;
  --card-vocab:     #a060d0;
  --card-teacher:   #4090d0;
  --card-passage:   #4cc9f0;
  --card-esol:      #c060e0;
}

/* ── Ocean — Editorial, bold left-border cards ── */
body.theme-ocean {
  --bg-page:       #f0f9ff;
  --bg-header:     #e0f2fe;
  --bg-card:       #ffffff;
  --bg-card-hover: #f8fdff;
  --bg-nav:        #0d2d4a;
  --bg-filter:     #f0f9ff;
  --border:        #bae6fd;
  --border-light:  #e0f2fe;
  --accent:        #0ea5e9;
  --accent-light:  #e0f2fe;
  --accent-border: #7dd3fc;
  --text-primary:  #0c2340;
  --text-secondary:#0369a1;
  --text-muted:    #64748b;
  --text-nav:      #e0f0ff;
  --text-nav-muted:rgba(224,240,255,0.5);
  --shadow:        none;
  --shadow-lifted: 0 2px 8px rgba(14,165,233,0.1);
  --card-bellringer:#0ea5e9;
  --card-organizer: #0d9488;
  --card-vocab:     #6366f1;
  --card-teacher:   #0284c7;
  --card-passage:   #0891b2;
  --card-esol:      #7c3aed;
}

/* ── Slate — Minimal corporate, top-accent bars ── */
body.theme-slate {
  --bg-page:       #f8fafc;
  --bg-header:     #f1f5f9;
  --bg-card:       #ffffff;
  --bg-card-hover: #fafbfc;
  --bg-nav:        #1e293b;
  --bg-filter:     #f8fafc;
  --border:        #e2e8f0;
  --border-light:  #f1f5f9;
  --accent:        #38bdf8;
  --accent-light:  #f0f9ff;
  --accent-border: #bae6fd;
  --text-primary:  #0f172a;
  --text-secondary:#334155;
  --text-muted:    #64748b;
  --text-nav:      #e2e8f0;
  --text-nav-muted:rgba(226,232,240,0.5);
  --shadow:        0 1px 3px rgba(0,0,0,0.04);
  --shadow-lifted: 0 4px 12px rgba(0,0,0,0.08);
  --card-bellringer:#38bdf8;
  --card-organizer: #34d399;
  --card-vocab:     #a78bfa;
  --card-teacher:   #60a5fa;
  --card-passage:   #94a3b8;
  --card-esol:      #c084fc;
}

/* ── Violet — Immersive dark gradient, glassmorphism cards ── */
body.theme-violet {
  --bg-page:       #1e1045;
  --bg-header:     #251560;
  --bg-card:       rgba(255,255,255,0.07);
  --bg-card-hover: rgba(255,255,255,0.11);
  --bg-nav:        #120a30;
  --bg-filter:     #1e1045;
  --border:        rgba(139,92,246,0.3);
  --border-light:  rgba(139,92,246,0.15);
  --accent:        #8b5cf6;
  --accent-light:  rgba(139,92,246,0.2);
  --accent-border: rgba(139,92,246,0.5);
  --text-primary:  #ede9fe;
  --text-secondary:#c4b5fd;
  --text-muted:    #7c6aad;
  --text-nav:      #ede9fe;
  --text-nav-muted:rgba(237,233,254,0.4);
  --shadow:        0 4px 24px rgba(0,0,0,0.3);
  --shadow-lifted: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);
  --card-bellringer:#8b5cf6;
  --card-organizer: #10b981;
  --card-vocab:     #ec4899;
  --card-teacher:   #60a5fa;
  --card-passage:   #a78bfa;
  --card-esol:      #f472b6;
}

/* ── Azure — Frosted tech, light gradient ── */
body.theme-azure {
  --bg-page:       #eff6ff;
  --bg-header:     #dbeafe;
  --bg-card:       rgba(255,255,255,0.72);
  --bg-card-hover: rgba(255,255,255,0.88);
  --bg-nav:        #1e3a8a;
  --bg-filter:     #eff6ff;
  --border:        rgba(59,130,246,0.2);
  --border-light:  rgba(59,130,246,0.1);
  --accent:        #1d4ed8;
  --accent-light:  rgba(59,130,246,0.1);
  --accent-border: rgba(59,130,246,0.3);
  --text-primary:  #1e3a8a;
  --text-secondary:#1d4ed8;
  --text-muted:    #3b82f6;
  --text-nav:      #dbeafe;
  --text-nav-muted:rgba(219,234,254,0.5);
  --shadow:        0 4px 16px rgba(59,130,246,0.12);
  --shadow-lifted: 0 8px 24px rgba(59,130,246,0.2);
  --card-bellringer:#1d4ed8;
  --card-organizer: #059669;
  --card-vocab:     #7c3aed;
  --card-teacher:   #0369a1;
  --card-passage:   #0284c7;
  --card-esol:      #9333ea;
}
```

- [ ] **Step 2: Also remove the two old theme blocks** (`body.theme-warm` and `body.theme-dark`) — they are now replaced by the new themes above. The `:root, body.theme-edtech` block is the new default.

- [ ] **Step 3: Verify in browser**
  - Open `index.html` in browser
  - Click Warm → page should show lavender (#f4f3ff) bg, purple nav
  - Open theme switcher — you'll update the buttons in Task 3; for now just confirm CSS loaded without errors in DevTools console

- [ ] **Step 4: Commit**
```bash
git add css/themes.css
git commit -m "feat: rewrite themes.css with 6 distinctive themes (EdTech, Midnight, Ocean, Slate, Violet, Azure)"
```

---

### Task 2: Add theme-specific overrides + polish to css/main.css

**Files:**
- Modify: `css/main.css` (append ~120 lines before the closing `@media` block)

The existing `.card` rule at line 134 has `border-radius: 10px` and `box-shadow: var(--shadow)` — these are the EdTech defaults. The new rules below use `body.theme-*` scoping to override per theme without touching the base rule.

- [ ] **Step 1: Insert the following block at the END of `css/main.css`, just before the `@media (max-width: 768px)` block at line 244:**

```css
/* ── Typography Polish ── */
body { font-size: 15px; }
.card-label { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; }
.card-body { font-size: 14px; line-height: 1.6; }
.passage-para { font-size: 15px; line-height: 1.75; }
.card-header { padding: 14px 16px 12px; }
.card-body { padding: 0 16px 16px; }
.content-grid { gap: 16px; }

/* ── Transition Polish ── */
.card { transition: box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease; }
.card:hover:not(.dimmed) { transform: translateY(-2px); }
.tool-btn { transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease; }
.tool-btn:active { transform: scale(0.97); }
.filter-btn { transition: all 0.15s ease; }

/* ── Home Page Polish ── */
.hero h1 { font-size: 36px; }
.stat-num { font-size: 28px; }
.unit-card { border-radius: 12px; }
.filter-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
.unit-card-cta { border-radius: 8px; }

/* ── Background Gradients (Violet, Azure) ── */
body.theme-violet { background: linear-gradient(160deg, #1e1045 0%, #2d1b69 100%) fixed; }
body.theme-azure  { background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%) fixed; }

/* ── Midnight: glowing card borders ── */
body.theme-midnight .card {
  background: var(--bg-card);
  border: 1px solid rgba(67,97,238,0.25);
  box-shadow: 0 0 0 1px rgba(67,97,238,0.15), 0 0 20px rgba(67,97,238,0.06);
}
body.theme-midnight .card:hover:not(.dimmed) {
  box-shadow: 0 0 0 1px rgba(67,97,238,0.4), 0 0 30px rgba(67,97,238,0.15);
}
body.theme-midnight .day-tab.active { box-shadow: 0 0 10px var(--accent); }

/* ── Ocean: left-border cards, underline tabs ── */
body.theme-ocean .card {
  border: none;
  border-left: 4px solid var(--card-accent-color, var(--accent));
  border-radius: 0 10px 10px 0;
  box-shadow: none;
}
body.theme-ocean .card .card-header { border-top: none; }
body.theme-ocean .card:hover:not(.dimmed) { box-shadow: 2px 2px 12px rgba(14,165,233,0.12); }
body.theme-ocean .day-tabs { background: #fff; border-bottom: 2px solid var(--border); }
body.theme-ocean .day-tab {
  border-radius: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  background: transparent;
}
body.theme-ocean .day-tab.active {
  border-bottom-color: var(--accent);
  background: transparent;
  color: var(--accent);
}

/* ── Slate: top-accent bar cards, boxed tabs ── */
body.theme-slate .card { border-radius: 4px; }
body.theme-slate .card .card-header { border-top: 3px solid var(--card-accent-color, var(--accent)); border-radius: 0; }
body.theme-slate .day-tabs { gap: 6px; padding: 8px 24px; border-bottom: 1px solid var(--border); background: var(--bg-page); }
body.theme-slate .day-tab {
  border: 1px solid var(--border);
  border-radius: 4px;
  border-bottom-color: var(--border);
  margin-bottom: 0;
}
body.theme-slate .day-tab.active {
  background: var(--text-primary);
  color: #fff;
  border-color: var(--text-primary);
}

/* ── Violet: glassmorphism cards, frosted pills ── */
body.theme-violet .card {
  background: rgba(255,255,255,0.07);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(139,92,246,0.3);
}
body.theme-violet .card:hover:not(.dimmed) {
  background: rgba(255,255,255,0.11);
}
body.theme-violet .day-tab.active { box-shadow: 0 0 10px var(--accent); }

/* ── Azure: frosted glass cards ── */
body.theme-azure .card {
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(59,130,246,0.2);
}
body.theme-azure .card:hover:not(.dimmed) {
  background: rgba(255,255,255,0.88);
}
```

- [ ] **Step 2: Verify in browser — open `units/alicogia/index.html`**
  - Switch to Midnight: cards should have subtle blue glow borders on dark background
  - Switch to Ocean: cards should have left-border only (no surrounding border), tabs underlined
  - Switch to Slate: cards should have top accent bar, tabs are boxed
  - Switch to Violet: deep purple gradient background, translucent cards
  - Switch to Azure: blue gradient background, frosted glass cards
  - Switch to EdTech: clean white cards on lavender, standard pill tabs

- [ ] **Step 3: Commit**
```bash
git add css/main.css
git commit -m "feat: add theme-specific card/tab treatments and UX polish to main.css"
```

---

### Task 3: Update default theme

**Files:**
- Modify: `js/theme.js` (1 line)
- Modify: `index.html` (1 line)
- Modify: `units/alicogia/index.html` (1 line)

- [ ] **Step 1: In `js/theme.js`, find the line:**
```js
const saved = localStorage.getItem('ir-theme') || 'warm';
```
Change to:
```js
const saved = localStorage.getItem('ir-theme') || 'edtech';
```

- [ ] **Step 2: In `index.html` line 10, change:**
```html
<body class="theme-warm">
```
To:
```html
<body class="theme-edtech">
```

- [ ] **Step 3: In `units/alicogia/index.html` line 10, change:**
```html
<body class="theme-warm">
```
To:
```html
<body class="theme-edtech">
```

- [ ] **Step 4: Update theme switcher buttons** in both `index.html` and `units/alicogia/index.html`. Find the theme-switcher div and replace with 6 buttons:
```html
<div class="theme-switcher">
  <button class="theme-btn active" data-theme="edtech">EdTech</button>
  <button class="theme-btn" data-theme="midnight">Midnight</button>
  <button class="theme-btn" data-theme="ocean">Ocean</button>
  <button class="theme-btn" data-theme="slate">Slate</button>
  <button class="theme-btn" data-theme="violet">Violet</button>
  <button class="theme-btn" data-theme="azure">Azure</button>
</div>
```

- [ ] **Step 5: Verify in browser**
  - Open `index.html` in a fresh private window (no localStorage)
  - Page should load with EdTech theme (lavender bg, purple nav) by default
  - All 6 theme buttons visible in nav
  - Click each — theme switches correctly, active button highlighted
  - Open `units/alicogia/index.html` — same behavior

- [ ] **Step 6: Clear localStorage and verify EdTech is default**
  - In DevTools: Application → LocalStorage → delete `ir-theme` key → refresh
  - Should load EdTech theme

- [ ] **Step 7: Commit**
```bash
git add js/theme.js index.html units/alicogia/index.html
git commit -m "feat: make EdTech default theme, add all 6 theme switcher buttons"
```

---

## Chunk 2: Push

- [ ] **Push to GitHub**
```bash
git push origin main
```

- [ ] **Verify on GitHub Pages** (https://burger4991.github.io/ir-platform/)
  - Site loads with EdTech theme
  - All 6 themes work
  - Midnight/Ocean/Slate/Violet/Azure all look correct on both home and unit pages
