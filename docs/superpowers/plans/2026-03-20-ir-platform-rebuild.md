# IR Platform — Full Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the IR Platform from the ground up as a premium projection tool (Nearpod/IXL quality) that teachers open directly on a Promethean board, with a shared CSS/JS architecture, self-contained unit pages sourced from existing student materials, and a premium home dashboard embeddable on Google Sites via iframe.

**Architecture:** Shared `css/platform.css` + `js/unit.js` files are referenced by every unit page via relative paths. Each unit is a single `units/{id}/index.html` containing all content as an inline `const UNIT = {...}` JS object. The home page (`index.html`) renders a premium unit dashboard from `units-registry.js`. Everything is hosted on GitHub Pages; Google Sites embeds the root URL as a single iframe. No build step. No external dependencies except one QR code CDN (lazy-loaded on demand).

**Tech Stack:** Vanilla HTML/CSS/JS (ES6). No framework, no bundler. Hosted on GitHub Pages. Manual browser verification with `python3 -m http.server 8080`.

**Design Reference:** The dark design language of `~/Documents/Teaching/Units/AliCogia-LiteraryElements/AliCogia_D1-6_InteractiveLesson_v10.html` and `~/Documents/Teaching/Units/Shakuntala-Unit/Shakuntala_D1-4_TestPrep_Interactive_v9.html`. These files define the target aesthetic — match them exactly.

**Content Sources:**
- AliCogia: `~/Documents/Teaching/Units/AliCogia-LiteraryElements/AliCogia_D1-6_InteractiveLesson_v10.html`
- Shakuntala: `~/Documents/Teaching/Units/Shakuntala-Unit/Shakuntala_D1-4_TestPrep_Interactive_v9.html`
- Bloomers: `~/Documents/Teaching/Units/BlueJeans-Unit/Unit2_Bloomers_StudentPacket.md` + `Unit2_Bloomers_TeacherLessonPlan.md`
- MathInnovations: `~/Documents/Teaching/Units/MathInnovations-TextStructure/` (student packet + lesson plan)

---

## File Map

### New Files (Create)
| File | Responsibility |
|---|---|
| `css/platform.css` | All shared styles — design tokens, layout, components, unit page, home page |
| `js/unit.js` | All shared unit page logic — day nav, timer, STOP mode, Focus Mode, ESOL, GR badge, progress, toolbar |
| `index.html` | Premium home dashboard — unit grid, benchmark filter, search |
| `units/alicogia/index.html` | Ali Cogia unit — HTML shell + inline UNIT data + `<link>` to shared CSS/JS |
| `units/shakuntala/index.html` | Shakuntala unit — HTML shell + inline UNIT data |
| `units/bloomers/index.html` | Bloomers unit — HTML shell + inline UNIT data |
| `units/mathinnovations/index.html` | Math Innovations unit — HTML shell + inline UNIT data |
| `units-registry.js` | Simplified unit list for home page (replace existing) |

### Modified Files
| File | Change |
|---|---|
| `units/alicogia/downloads/` | Keep as-is — all existing PDFs stay |
| `units/shakuntala/downloads/` | Keep as-is |
| `units/bloomers/downloads/` | Keep as-is |
| `units/mathinnovations/downloads/` | Keep as-is |

### Deleted Files (Old Architecture)
```
css/main.css
css/themes.css
js/cards.js
js/activities.js
js/focus.js
js/toolbar.js
js/nav.js
js/annotations.js
js/passage-drawer.js
js/engage.js
js/cubes.js
js/timer.js
js/theme.js
js/home.js
units/alicogia/data.js
units/alicogia/data.js.bak
units/*/index.html       (all stub unit pages — necklace, daedalus, orpheus, etc.)
units/*/data.js          (all stub data files)
```
> Keep only the 4 unit folders that will have real content: alicogia, shakuntala, bloomers, mathinnovations.

---

## Design System Reference

Before writing any code, internalize these tokens (match v9/v10 exactly):

```css
:root {
  /* Backgrounds */
  --bg: #0f172a;          /* page background */
  --surface: #1e293b;     /* cards, panels, topbar */
  --surface-2: #334155;   /* hover states, nested surfaces */
  --border: #334155;      /* all borders */

  /* Text */
  --text: #f1f5f9;        /* primary text */
  --muted: #94a3b8;       /* secondary text, labels */

  /* Accents */
  --accent: #6366f1;      /* indigo — primary accent */
  --accent-rgb: 99,102,241;
  --green: #22c55e;
  --amber: #f59e0b;
  --red: #ef4444;
  --purple: #a855f7;
  --blue: #3b82f6;

  /* Per-day accent (overridden by unit.js) */
  --day-accent: #6366f1;
  --day-accent-rgb: 99,102,241;
  --day-accent-text: #a5b4fc;
  --day-accent-bg: #1e1b4b;
  --day-accent-border: #312e81;

  /* Layout */
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --transition: 0.2s ease;
}
```

Per-day accent color map (unit.js sets these on `document.documentElement`):
| Days | Accent | RGB | Text | Bg tint | Border |
|---|---|---|---|---|---|
| 1–2 | `#6366f1` (Indigo) | `99,102,241` | `#a5b4fc` | `#1e1b4b` | `#312e81` |
| 3–4 | `#10b981` (Emerald) | `16,185,129` | `#6ee7b7` | `#022c22` | `#064e3b` |
| 5–6 | `#f59e0b` (Amber) | `245,158,11` | `#fcd34d` | `#1c0a00` | `#78350f` |

---

## Unit Data Schema

Every unit page contains this inline at the bottom of the `<body>` before `unit.js`:

```js
const UNIT = {
  id: 'alicogia',
  title: 'The Story of Ali Cogia, Merchant of Baghdad',
  benchmark: 'ELA.10.R.1.1',
  benchmarkLabel: 'Literary Elements',
  benchmarkDescription: 'Analyze how an author develops and individualizes the responses of characters to situations using literary elements and devices.',
  days: 6,

  // Full passage — shared across all days
  passage: [
    { n: 1, text: 'In the reign of Haroun-al-Raschid...' },
    // ... all paragraphs
  ],

  // CUBES guide for this unit
  cubesGuide: [
    { letter: 'C', action: 'Circle unknown words', color: '#ef4444' },
    { letter: 'U', action: 'Underline key phrases', color: '#3b82f6' },
    { letter: 'B', action: 'Box turning points', color: '#22c55e' },
    { letter: 'E', action: 'Exclaim (!) for surprises', color: '#f59e0b' },
    { letter: 'S', action: 'Star passages that reveal theme', color: '#a855f7' },
  ],

  days: {
    1: {
      label: 'First Read — Foundation',
      grPhase: 'I Do',
      pacingGuide: { bellringer: 5, vocab: 5, passage: 15, organizer: 10, exitTicket: 5 },

      vocab: [
        {
          word: 'contented',
          pos: 'adjective',
          definition: 'satisfied and at ease; not wanting more than you have',
          sentence: 'Ali Cogia contented himself with modest profits.',
          stopLabel: null
        }
        // ... 2 more words
      ],

      bellringer: [
        {
          stem: 'Read: "...he contented himself with modest profits..." What does contented most likely mean?',
          choices: [
            { letter: 'A', text: 'Frustrated and restless', stopLabel: 'Opposite' },
            { letter: 'B', text: 'Satisfied and at ease', stopLabel: 'Proven', correct: true },
            { letter: 'C', text: 'Bored and indifferent', stopLabel: 'Tricky' },
            { letter: 'D', text: 'Proud and ambitious', stopLabel: 'Silly' },
          ],
          writtenPrompt: 'What does "contented" reveal about Ali Cogia\'s character?',
          modelResponse: 'The word "contented" reveals that Ali Cogia is satisfied with his life...'
        }
        // ... 1 more question
      ],

      organizer: [
        {
          grPhase: 'i-do',
          prompt: 'What literary element does the author use in paragraphs 1–2?',
          evidence: '"He contented himself with modest profits" (¶1)',
          analysis: 'This characterization shows Ali Cogia values contentment over ambition.',
          modelFilled: true
        },
        {
          grPhase: 'we-do',
          prompt: 'How does the recurring dream function as a literary device?',
          evidence: '',
          analysis: '',
          modelFilled: false
        }
        // ...
      ],

      exitTicket: {
        prompt: 'In 2–3 sentences: How does the author develop Ali Cogia as a trustworthy character?',
        frame: 'The author develops Ali Cogia as trustworthy by...'
      },

      esol: {
        l12: {
          frames: ['The character ___ is shown as ___ because ___.'],
          wordBank: ['contented', 'merchant', 'duty', 'pilgrimage']
        },
        l34: {
          frames: ['The author reveals that ___ by describing him as ___, which suggests ___.'],
          wordBank: []
        },
        l5: {
          frames: ['Through the characterization of ___, the author establishes ___ which foreshadows ___.']
        }
      }
    }
    // days 2–6 follow same shape
  },

  assessment: {
    achievementLevels: [
      { level: 2, label: 'Approaching', descriptor: 'Identifies a literary element with minimal textual support.' },
      { level: 3, label: 'Meets', descriptor: 'Explains how a literary element contributes to meaning using evidence.' },
      { level: 4, label: 'Exceeds', descriptor: 'Analyzes multiple literary elements and their relationship to theme.' },
      { level: 5, label: 'Mastery', descriptor: 'Evaluates the author\'s craft choices and their cumulative effect on meaning.' }
    ],
    mc: [
      // formal assessment MC questions (Days 5–6)
    ]
  },

  downloads: [
    { label: 'Student Packet', file: 'downloads/AliCogia_StudentPacket.pdf' },
    { label: 'Answer Key', file: 'downloads/AliCogia_AnswerKey.pdf' }
  ]
};
```

---

## Phase 1 — Cleanup

### Task 1: Delete Old Architecture

**Files:**
- Delete: all old JS files in `js/`
- Delete: `css/main.css`, `css/themes.css`
- Delete: `units/*/index.html` (stub units only — keep alicogia, shakuntala, bloomers, mathinnovations folders)
- Delete: `units/*/data.js` (all data files)
- Delete: `units/alicogia/data.js.bak`, `units/alicogia/activities.js.bak`, `units/alicogia/cards.js.bak`

- [ ] **Step 1: Remove old JS files**
```bash
cd ~/Desktop/ir-platform
rm js/cards.js js/activities.js js/focus.js js/toolbar.js js/nav.js
rm js/annotations.js js/passage-drawer.js js/engage.js js/cubes.js
rm js/timer.js js/theme.js js/home.js
rm js/cards.js.bak js/activities.js.bak 2>/dev/null; true
```

- [ ] **Step 2: Remove old CSS**
```bash
rm css/main.css css/themes.css
```

- [ ] **Step 3: Remove stub unit folders**
```bash
# Remove all unit folders EXCEPT the 4 with real content
cd units
for dir in */; do
  dir="${dir%/}"
  case "$dir" in
    alicogia|shakuntala|bloomers|mathinnovations) echo "Keep: $dir" ;;
    *) echo "Remove: $dir" && rm -rf "$dir" ;;
  esac
done
cd ..
```

- [ ] **Step 4: Remove old data files**
```bash
rm units/alicogia/data.js units/alicogia/data.js.bak 2>/dev/null; true
rm units/shakuntala/data.js 2>/dev/null; true
rm units/bloomers/data.js 2>/dev/null; true
rm units/mathinnovations/data.js 2>/dev/null; true
```

- [ ] **Step 5: Verify clean state**
```bash
ls js/        # should be empty
ls css/       # should be empty
ls units/     # should show: alicogia  bloomers  mathinnovations  shakuntala
```

---

## Phase 2 — CSS Foundation

### Task 2: Build `css/platform.css`

**Files:**
- Create: `css/platform.css`

This is the single CSS file for the entire platform. It covers: design tokens, reset, layout primitives, topbar/nav, home page, unit page shell, activity cards, MC questions, vocab, organizer, toolbar, overlays, and print styles. Match the v9/v10 design language exactly.

- [ ] **Step 1: Create the file with design tokens and reset**

```css
/* =====================================================
   IR PLATFORM — platform.css
   Design reference: AliCogia v10 + Shakuntala v9
   ===================================================== */

/* ── Design Tokens ── */
:root {
  --bg: #0f172a;
  --surface: #1e293b;
  --surface-2: #334155;
  --border: #334155;
  --text: #f1f5f9;
  --muted: #94a3b8;
  --accent: #6366f1;
  --accent-rgb: 99,102,241;
  --green: #22c55e;
  --amber: #f59e0b;
  --red: #ef4444;
  --purple: #a855f7;
  --blue: #3b82f6;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow: 0 4px 24px rgba(0,0,0,0.3);
  --transition: 0.2s ease;

  /* Per-day accent — defaults to indigo, overridden by unit.js */
  --day-accent: #6366f1;
  --day-accent-rgb: 99,102,241;
  --day-accent-text: #a5b4fc;
  --day-accent-bg: #1e1b4b;
  --day-accent-border: #312e81;
}

/* Light mode */
body.light {
  --bg: #f8fafc;
  --surface: #ffffff;
  --surface-2: #f1f5f9;
  --border: #e2e8f0;
  --text: #0f172a;
  --muted: #64748b;
  --shadow: 0 4px 24px rgba(0,0,0,0.06);
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.65;
  font-size: 16px;
}

/* ── Typography ── */
h1 { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 800; }
h2 { font-size: clamp(1.2rem, 2.5vw, 1.75rem); font-weight: 700; }
h3 { font-size: 1.1rem; font-weight: 700; }
p { line-height: 1.7; }

/* ── Utilities ── */
.badge {
  display: inline-flex; align-items: center;
  padding: 0.2rem 0.65rem; border-radius: 999px;
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase;
}
.badge-indigo { background: rgba(99,102,241,0.15); color: #a5b4fc; }
.badge-green  { background: rgba(34,197,94,0.15);  color: #86efac; }
.badge-amber  { background: rgba(245,158,11,0.15); color: #fcd34d; }
.badge-purple { background: rgba(168,85,247,0.15); color: #d8b4fe; }
.badge-blue   { background: rgba(59,130,246,0.15); color: #93c5fd; }

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0ms !important; animation-duration: 0ms !important; }
}
```

- [ ] **Step 2: Add shared button styles + topbar**

```css
/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: none;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: background var(--transition), transform var(--transition);
  white-space: nowrap;
}
.btn:active { transform: scale(0.97); }
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { background: #4f46e5; }
.btn-ghost { background: var(--surface-2); color: var(--text); }
.btn-ghost:hover { background: #475569; }
.btn-ghost.active { background: var(--day-accent); color: #fff; }

/* ── Platform Topbar (home page) ── */
.platform-topbar {
  height: 60px; background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 2rem; position: sticky; top: 0; z-index: 100;
}
.platform-topbar .logo {
  font-size: 0.85rem; font-weight: 800; letter-spacing: 1.5px;
  text-transform: uppercase; color: var(--text); text-decoration: none;
}
.platform-topbar .logo span { color: var(--day-accent); }

/* ── Unit Topbar ── */
.unit-topbar {
  height: 56px; background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 1rem;
  padding: 0 1.25rem; position: sticky; top: 0; z-index: 100;
  flex-shrink: 0;
}
.unit-topbar .tb-back {
  color: var(--muted); text-decoration: none; font-size: 0.85rem;
  font-weight: 600; white-space: nowrap;
  transition: color var(--transition);
}
.unit-topbar .tb-back:hover { color: var(--text); }
.unit-topbar .tb-divider { width: 1px; height: 20px; background: var(--border); }
.unit-topbar .tb-title {
  font-size: 0.9rem; font-weight: 700; color: var(--text);
  flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.unit-topbar .tb-tools { display: flex; align-items: center; gap: 0.5rem; }
```

- [ ] **Step 3: Add home page styles**

```css
/* ── Home: Hero ── */
.home-hero {
  padding: 3rem 2rem 2rem;
  text-align: center;
}
.home-hero .hero-kicker {
  font-size: 0.8rem; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; color: var(--day-accent); margin-bottom: 0.75rem;
}
.home-hero h1 { margin-bottom: 0.75rem; }
.home-hero p { color: var(--muted); font-size: 1rem; max-width: 540px; margin: 0 auto 2rem; }

/* ── Home: Filter bar ── */
.filter-bar {
  display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;
  padding: 0.75rem 2rem; border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.filter-bar .filter-label { font-size: 0.8rem; color: var(--muted); font-weight: 600; }
.filter-btn {
  padding: 0.35rem 0.9rem; border-radius: 999px;
  border: 1px solid var(--border); background: transparent;
  color: var(--muted); font-size: 0.8rem; font-weight: 600;
  cursor: pointer; transition: all var(--transition);
}
.filter-btn:hover, .filter-btn.active {
  background: var(--day-accent); border-color: var(--day-accent); color: #fff;
}
.search-input {
  margin-left: auto; padding: 0.35rem 0.75rem; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--surface-2);
  color: var(--text); font-size: 0.85rem; width: 200px;
  outline: none; transition: border-color var(--transition);
}
.search-input:focus { border-color: var(--day-accent); }

/* ── Home: Unit Grid ── */
.units-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem; padding: 2rem;
}

/* ── Home: Unit Card ── */
.unit-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); overflow: hidden; cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  display: flex; flex-direction: column;
}
.unit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  border-color: var(--day-accent);
}
.unit-card-header {
  padding: 1.25rem 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
}
.unit-card-benchmark {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; color: var(--day-accent-text); margin-bottom: 0.5rem;
}
.unit-card-title {
  font-size: 1rem; font-weight: 700; line-height: 1.3; margin-bottom: 0.35rem;
}
.unit-card-days { font-size: 0.75rem; color: var(--muted); }
.unit-card-body { padding: 1rem 1.25rem; flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
.unit-card-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.5; flex: 1; }
.unit-card-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.unit-card-tags .tag {
  padding: 0.15rem 0.5rem; border-radius: 999px;
  background: var(--surface-2); color: var(--muted);
  font-size: 0.7rem; font-weight: 600;
}
.unit-card-cta {
  font-size: 0.85rem; font-weight: 700; color: var(--day-accent);
  text-align: right; margin-top: auto;
}
```

- [ ] **Step 4: Add unit page layout + day navigation**

```css
/* ── Unit page app shell ── */
.unit-app {
  display: flex; flex-direction: column; height: 100vh; overflow: hidden;
}
.unit-body { display: flex; flex: 1; overflow: hidden; }

/* ── Day sidebar ── */
.day-sidebar {
  width: 200px; background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0;
  transition: width var(--transition);
}
.day-sidebar.collapsed { width: 0; overflow: hidden; }
.day-sidebar-title {
  padding: 1rem; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; color: var(--muted);
  border-bottom: 1px solid var(--border);
}
.day-btn {
  display: flex; flex-direction: column; gap: 0.2rem;
  padding: 0.75rem 1rem; border: none; background: transparent;
  color: var(--muted); cursor: pointer; text-align: left; width: 100%;
  border-left: 3px solid transparent;
  transition: all var(--transition);
}
.day-btn:hover { background: var(--surface-2); color: var(--text); }
.day-btn.active {
  background: var(--day-accent-bg); color: var(--day-accent-text);
  border-left-color: var(--day-accent);
}
.day-btn.done { color: var(--green); }
.day-btn .day-btn-label { font-size: 0.8rem; font-weight: 700; }
.day-btn .day-btn-sub { font-size: 0.7rem; opacity: 0.7; }
.sidebar-toggle {
  margin-top: auto; padding: 0.75rem; border: none; background: transparent;
  color: var(--muted); cursor: pointer; font-size: 1rem; text-align: right;
  border-top: 1px solid var(--border);
  transition: color var(--transition);
}
.sidebar-toggle:hover { color: var(--text); }

/* ── Content area ── */
.content-area {
  flex: 1; overflow-y: auto; padding: 1.5rem;
  transition: opacity 0.2s ease;
}
.content-area.fading { opacity: 0; }

/* ── Day progress bar ── */
.day-progress {
  margin-bottom: 1.25rem; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
}
.day-progress-meta {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 0.5rem; font-size: 0.8rem; color: var(--muted);
}
.day-progress-meta .day-label { font-weight: 700; color: var(--day-accent-text); }
.day-progress-track {
  height: 4px; background: var(--surface-2); border-radius: 2px; overflow: hidden;
}
.day-progress-fill {
  height: 100%; background: var(--day-accent);
  transition: width 0.3s ease; border-radius: 2px;
}
```

- [ ] **Step 5: Add activity card styles**

```css
/* ── Activity cards ── */
.activity {
  background: var(--surface); border: 1px solid var(--border);
  border-left: 3px solid var(--day-accent);
  border-radius: var(--radius); overflow: hidden; margin-bottom: 1rem;
  box-shadow: 0 0 20px rgba(var(--day-accent-rgb), 0.08), 0 2px 8px rgba(0,0,0,0.25);
  transition: border-color var(--transition), box-shadow var(--transition);
}
.activity.done {
  border-left-color: var(--green);
  box-shadow: 0 0 20px rgba(34,197,94,0.08);
}
.activity-type-strip {
  padding: 0.35rem 1rem; font-size: 0.7rem; font-weight: 700;
  letter-spacing: 0.5px; text-transform: uppercase;
  background: var(--day-accent-bg); color: var(--day-accent-text);
  border-bottom: 1px solid var(--day-accent-border);
}
.activity.done .activity-type-strip {
  background: rgba(34,197,94,0.1); color: var(--green);
  border-bottom-color: rgba(34,197,94,0.2);
}
.activity-header {
  padding: 0.75rem 1rem 0.5rem;
  display: flex; align-items: flex-start; gap: 0.75rem;
  border-bottom: 1px solid rgba(var(--day-accent-rgb), 0.1);
}
.activity-header h3 { font-size: 0.9rem; font-weight: 700; flex: 1; }
.activity-body { padding: 1rem; }
.activity-instruction {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; color: var(--day-accent-text);
  margin-bottom: 0.5rem;
}

/* Done state */
.activity.done .activity-body { display: none; }
.activity.done.expanded .activity-body { display: block; }
.activity-done-bar {
  padding: 0.5rem 1rem; display: flex; align-items: center; justify-content: space-between;
  color: var(--green); font-size: 0.8rem; font-weight: 700;
}
.btn-review {
  font-size: 0.75rem; color: var(--muted); background: none; border: none;
  cursor: pointer; transition: color var(--transition);
}
.btn-review:hover { color: var(--text); }

/* ── MC Question (STOP strategy) ── */
.mc-question { margin-bottom: 1.25rem; }
.mc-stem {
  font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem;
  padding: 0.75rem; background: var(--surface-2); border-radius: var(--radius-sm);
}
.mc-choices { display: flex; flex-direction: column; gap: 0.5rem; }
.mc-choice {
  display: flex; align-items: flex-start; gap: 0.75rem;
  padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);
  border: 1px solid var(--border); cursor: pointer;
  transition: all var(--transition); position: relative;
}
.mc-choice:hover { border-color: var(--day-accent); background: var(--day-accent-bg); }
.mc-choice.eliminated {
  opacity: 0.35; text-decoration: line-through; cursor: default;
}
.mc-choice.selected { border-color: var(--day-accent); background: var(--day-accent-bg); }
.mc-choice.correct-reveal { border-color: var(--green); background: rgba(34,197,94,0.1); }
.mc-choice.wrong-reveal { opacity: 0.4; }
.mc-letter {
  width: 24px; height: 24px; border-radius: 999px;
  border: 2px solid var(--border); display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 800; flex-shrink: 0;
  transition: all var(--transition);
}
.mc-choice.selected .mc-letter { border-color: var(--day-accent); color: var(--day-accent); }
.mc-choice.correct-reveal .mc-letter { border-color: var(--green); color: var(--green); background: rgba(34,197,94,0.2); }
.mc-text { font-size: 0.9rem; line-height: 1.5; flex: 1; }
.stop-badge {
  display: none; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.5px;
  text-transform: uppercase; padding: 0.1rem 0.4rem; border-radius: 4px;
  margin-left: auto; flex-shrink: 0;
}
body.stop-mode .stop-badge { display: inline-block; }
.stop-badge.silly    { background: rgba(148,163,184,0.2); color: var(--muted); }
.stop-badge.opposite { background: rgba(239,68,68,0.15);  color: var(--red); }
.stop-badge.tricky   { background: rgba(245,158,11,0.15); color: var(--amber); }
.stop-badge.proven   { background: rgba(34,197,94,0.15);  color: var(--green); }

/* ── Vocab card ── */
.vocab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; }
.vocab-word-card {
  background: var(--surface-2); border-radius: var(--radius-sm);
  padding: 1rem; border: 1px solid var(--border);
}
.vocab-word { font-size: 1.1rem; font-weight: 800; color: var(--day-accent-text); }
.vocab-pos { font-size: 0.7rem; color: var(--muted); margin-bottom: 0.35rem; font-style: italic; }
.vocab-def { font-size: 0.85rem; line-height: 1.5; margin-bottom: 0.5rem; }
.vocab-sentence { font-size: 0.8rem; color: var(--muted); font-style: italic; line-height: 1.5; }

/* ── Graphic Organizer ── */
.organizer { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.organizer th {
  background: var(--day-accent-bg); color: var(--day-accent-text);
  padding: 0.6rem 0.85rem; text-align: left; font-size: 0.75rem;
  font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
  border: 1px solid var(--day-accent-border);
}
.organizer td {
  padding: 0.75rem 0.85rem; border: 1px solid var(--border);
  vertical-align: top; line-height: 1.5;
}
.organizer tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
.org-phase-badge {
  display: inline-block; font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.5px; text-transform: uppercase;
  padding: 0.1rem 0.45rem; border-radius: 4px; margin-bottom: 0.35rem;
}
.phase-i-do      { background: rgba(99,102,241,0.15); color: #a5b4fc; }
.phase-we-do     { background: rgba(34,197,94,0.15);  color: #86efac; }
.phase-you-do    { background: rgba(245,158,11,0.15); color: #fcd34d; }
.phase-partner   { background: rgba(168,85,247,0.15); color: #d8b4fe; }

/* ── Passage ── */
.passage-text {
  font-size: 1rem; line-height: 1.85; max-width: 72ch;
  margin: 0 auto; padding: 0.5rem 0;
}
.passage-para { margin-bottom: 1rem; position: relative; }
.para-num {
  display: inline-block; width: 1.75rem; font-size: 0.7rem; font-weight: 700;
  color: var(--muted); vertical-align: top; padding-top: 0.2rem;
  flex-shrink: 0;
}
.passage-para-inner { display: flex; gap: 0.5rem; }

/* ── ESOL scaffold ── */
.esol-scaffold {
  margin-top: 1rem; padding: 0.85rem 1rem;
  background: rgba(59,130,246,0.08); border-radius: var(--radius-sm);
  border: 1px solid rgba(59,130,246,0.2);
}
.esol-label { font-size: 0.7rem; font-weight: 700; color: #93c5fd; margin-bottom: 0.5rem; }
.esol-frame { font-size: 0.9rem; color: var(--text); margin-bottom: 0.35rem; font-style: italic; }
.esol-wordbank { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.5rem; }
.esol-word {
  padding: 0.15rem 0.5rem; border-radius: 4px;
  background: rgba(59,130,246,0.15); color: #93c5fd; font-size: 0.75rem; font-weight: 600;
}

/* ── Exit ticket overlay ── */
.exit-ticket-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.95);
  display: flex; align-items: center; justify-content: center;
  z-index: 800; opacity: 0; pointer-events: none;
  transition: opacity 0.25s ease;
}
.exit-ticket-overlay.visible { opacity: 1; pointer-events: auto; }
.exit-ticket-card {
  background: var(--surface); border-radius: var(--radius);
  border: 1px solid var(--day-accent); padding: 2.5rem;
  max-width: 600px; width: 90%; text-align: center;
  box-shadow: 0 0 60px rgba(var(--day-accent-rgb), 0.2);
}
.exit-ticket-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--day-accent-text); margin-bottom: 0.75rem; }
.exit-ticket-prompt { font-size: 1.2rem; font-weight: 700; line-height: 1.5; margin-bottom: 1.25rem; }
.exit-ticket-frame {
  font-size: 1rem; color: var(--muted); font-style: italic; line-height: 1.6;
  background: var(--surface-2); padding: 1rem; border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
}

/* ── Timer ── */
.timer-display {
  font-family: "Courier New", monospace; font-size: 1rem; font-weight: 800;
  min-width: 52px; text-align: center; color: var(--text);
}
.timer-display.warning { color: var(--amber); }
.timer-display.critical { color: var(--red); }

/* ── GR phase badge (floating) ── */
.gr-badge {
  position: fixed; bottom: 1.5rem; right: 1.5rem;
  padding: 0.5rem 1rem; border-radius: var(--radius-sm);
  font-size: 0.8rem; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;
  box-shadow: var(--shadow); z-index: 400; pointer-events: none;
}

/* ── Achievement level panel ── */
.achievement-levels { display: flex; flex-direction: column; gap: 0.5rem; }
.level-row {
  display: flex; gap: 0.75rem; align-items: flex-start;
  padding: 0.75rem; border-radius: var(--radius-sm);
  border: 1px solid var(--border);
}
.level-num {
  width: 28px; height: 28px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: 800; flex-shrink: 0;
  background: var(--surface-2); color: var(--text);
}
.level-label { font-size: 0.75rem; font-weight: 700; }
.level-desc { font-size: 0.8rem; color: var(--muted); line-height: 1.4; }

/* ── Slide panels (toolbar flyouts) ── */
.panel {
  position: fixed; right: 0; top: 56px; width: 320px;
  height: calc(100vh - 56px); background: var(--surface);
  border-left: 1px solid var(--border); z-index: 300;
  transform: translateX(100%); transition: transform 0.25s ease;
  display: flex; flex-direction: column; overflow: hidden;
}
.panel.open { transform: translateX(0); }
.panel-header {
  padding: 1rem 1.25rem; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
}
.panel-header h3 { font-size: 0.9rem; font-weight: 700; }
.panel-close {
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 1.1rem; transition: color var(--transition);
}
.panel-close:hover { color: var(--text); }
.panel-body { padding: 1rem 1.25rem; overflow-y: auto; flex: 1; }

/* ── Day complete overlay ── */
.day-complete-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,0.9);
  display: none; align-items: center; justify-content: center; z-index: 850;
}
.day-complete-overlay.visible { display: flex; }
.day-complete-card {
  background: var(--surface); border-radius: var(--radius);
  border: 1px solid var(--day-accent); padding: 3rem;
  text-align: center; max-width: 460px; width: 90%;
  box-shadow: 0 0 80px rgba(var(--day-accent-rgb), 0.25);
}
.day-complete-emoji { font-size: 3rem; margin-bottom: 1rem; }
.day-complete-title { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
.day-complete-sub { color: var(--muted); margin-bottom: 2rem; }

/* ── Focus Mode ── */
.focus-overlay {
  position: fixed; inset: 0; background: var(--bg);
  z-index: 50; display: none; flex-direction: column;
}
.focus-overlay.visible { display: flex; }
.focus-header {
  background: var(--surface); border-bottom: 1px solid var(--border);
  padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
}
.focus-anchor {
  font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 900;
  color: var(--day-accent-text); flex: 1; text-align: center;
}
.focus-body { flex: 1; overflow-y: auto; padding: 2rem; max-width: 800px; margin: 0 auto; width: 100%; }
.focus-nav {
  background: var(--surface); border-top: 1px solid var(--border);
  padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between;
  flex-shrink: 0;
}
.focus-step-dots { display: flex; gap: 0.35rem; }
.step-dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: var(--border); transition: all var(--transition);
}
.step-dot.active { background: var(--day-accent); transform: scale(1.3); }
.step-dot.done { background: var(--green); }

/* ── Print ── */
@media print {
  .unit-topbar, .day-sidebar, .day-progress, .toolbar-strip,
  .panel, .focus-overlay, .day-complete-overlay, .exit-ticket-overlay,
  .gr-badge, .btn { display: none !important; }
  .content-area { padding: 0; overflow: visible; }
  .activity { break-inside: avoid; box-shadow: none; border: 1px solid #ccc; }
}
```

- [ ] **Step 6: Verify CSS loads correctly**

```bash
cd ~/Desktop/ir-platform
python3 -m http.server 8080
```

Open `http://localhost:8080` — should show a blank page with `#0f172a` background (no errors in DevTools console).

- [ ] **Step 7: Commit**
```bash
cd ~/Desktop/ir-platform
git add css/platform.css
git commit -m "feat: add platform.css — full design system (dark, Nearpod-quality)"
```

---

## Phase 3 — Home Dashboard

### Task 3: Build `index.html` (Home Page)

**Files:**
- Create: `index.html` (replaces existing)
- Create: `units-registry.js` (replaces existing)

The home dashboard renders unit cards from `units-registry.js`. Filter by benchmark category. Click a card → navigate to the unit page. Premium dark design with a clean topbar, hero section, and unit grid.

- [ ] **Step 1: Create simplified `units-registry.js`**

```js
window.UNITS = [
  {
    id: 'alicogia',
    title: 'The Story of Ali Cogia, Merchant of Baghdad',
    benchmark: 'ELA.10.R.1.1',
    benchmarkLabel: 'Literary Elements',
    category: 'R.1 Literary',
    accentClass: 'badge-indigo',
    description: 'Character, setting, conflict, and symbolism in a classic Arabian Nights tale about trust, temptation, and betrayal.',
    tags: ['One Thousand and One Nights', 'ESOL Ready', '6 Days'],
    path: 'units/alicogia/',
    status: 'live'
  },
  {
    id: 'shakuntala',
    title: 'Shakuntala',
    benchmark: 'ELA.10.R.1.1',
    benchmarkLabel: 'Literary Elements',
    category: 'R.1 Literary',
    accentClass: 'badge-amber',
    description: 'Literary elements in the ancient Indian play — character, conflict, and symbolism across Acts IV and V.',
    tags: ['Drama', 'World Literature', 'Test Prep', '4 Days'],
    path: 'units/shakuntala/',
    status: 'live'
  },
  {
    id: 'bloomers',
    title: 'Corsets, Bloomers & Blue Jeans',
    benchmark: 'ELA.10.R.2.1',
    benchmarkLabel: 'Central Idea',
    category: 'R.2 Informational',
    accentClass: 'badge-blue',
    description: 'Central idea and text structure in an informational article about 500 years of fashion as a reflection of social values.',
    tags: ['Informational', 'Fashion History', 'Test Prep', '4 Days'],
    path: 'units/bloomers/',
    status: 'live'
  },
  {
    id: 'mathinnovations',
    title: 'The Source of Mathematical Innovations',
    benchmark: 'ELA.10.R.2.2',
    benchmarkLabel: 'Text Structure',
    category: 'R.2 Informational',
    accentClass: 'badge-blue',
    description: 'Analyzing text structure, central idea, and vocabulary in a history of mathematical discoveries spanning cultures and centuries.',
    tags: ['Informational', 'Text Structure', 'Test Prep', '4 Days'],
    path: 'units/mathinnovations/',
    status: 'live'
  }
];
```

- [ ] **Step 2: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IR Teaching System · Mr. Burger</title>
  <link rel="stylesheet" href="css/platform.css">
</head>
<body>
  <div class="unit-app" style="height:auto;overflow:visible;">

    <header class="platform-topbar">
      <a href="#" class="logo">IR <span>Teaching System</span></a>
      <div style="display:flex;align-items:center;gap:0.75rem;">
        <span style="font-size:0.75rem;color:var(--muted);">10th Grade · Florida BEST ELA · Mr. Burger</span>
      </div>
    </header>

    <section class="home-hero">
      <div class="hero-kicker">Intensive Reading · Promethean Board</div>
      <h1>IR Teaching System</h1>
      <p>Benchmark-aligned units for 10th grade Intensive Reading — built for projection, STOP strategy, ESOL scaffolds, and gradual release built in.</p>
    </section>

    <div class="filter-bar">
      <span class="filter-label">Filter:</span>
      <button class="filter-btn active" data-cat="all">All Units</button>
      <button class="filter-btn" data-cat="R.1 Literary">R.1 Literary</button>
      <button class="filter-btn" data-cat="R.2 Informational">R.2 Informational</button>
      <button class="filter-btn" data-cat="R.3 Figurative">R.3 Figurative</button>
      <button class="filter-btn" data-cat="Test Prep">Test Prep</button>
      <input class="search-input" id="search" type="text" placeholder="Search units…">
    </div>

    <div class="units-grid" id="units-grid"></div>

    <footer style="padding:2rem;text-align:center;border-top:1px solid var(--border);margin-top:2rem;">
      <span style="font-size:0.75rem;color:var(--muted);">IR Platform · Mr. Burger · Miami-Dade County Public Schools</span>
    </footer>

  </div>

  <script src="units-registry.js"></script>
  <script>
    const grid = document.getElementById('units-grid');
    const search = document.getElementById('search');
    let cat = 'all';

    function render() {
      const q = search.value.toLowerCase();
      const filtered = window.UNITS.filter(u => {
        if (u.status !== 'live') return false;
        if (cat !== 'all' && u.category !== cat) return false;
        if (q && !u.title.toLowerCase().includes(q) && !u.description.toLowerCase().includes(q)) return false;
        return true;
      });

      grid.innerHTML = '';
      filtered.forEach(u => {
        const card = document.createElement('div');
        card.className = 'unit-card';
        card.innerHTML = `
          <div class="unit-card-header">
            <div class="unit-card-benchmark">
              <span class="badge ${u.accentClass}">${u.benchmark}</span>
              &nbsp;${u.benchmarkLabel}
            </div>
            <div class="unit-card-title">${u.title}</div>
          </div>
          <div class="unit-card-body">
            <p class="unit-card-desc">${u.description}</p>
            <div class="unit-card-tags">${u.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <div class="unit-card-cta">Open Unit →</div>
          </div>
        `;
        card.addEventListener('click', () => { window.location.href = u.path; });
        grid.appendChild(card);
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="padding:2rem;color:var(--muted);text-align:center;">No units match this filter.</p>';
      }
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cat = btn.dataset.cat;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        render();
      });
    });

    search.addEventListener('input', render);
    render();
  </script>
</body>
</html>
```

- [ ] **Step 3: Verify home page**

```bash
python3 -m http.server 8080
```

Check at `http://localhost:8080`:
- Background `#0f172a` dark
- 4 unit cards render with correct titles, benchmarks, descriptions
- Filter buttons work — clicking "R.1 Literary" shows 2 units
- Search filters by title and description
- Clicking a card navigates to `/units/{id}/` (will 404 until units are built — expected)
- No console errors

- [ ] **Step 4: Commit**
```bash
git add index.html units-registry.js
git commit -m "feat: build premium home dashboard with unit grid and benchmark filter"
```

---

## Phase 4 — Shared Unit JS

### Task 4: Build `js/unit.js`

**Files:**
- Create: `js/unit.js`

This is the engine powering every unit page. It reads `window.UNIT` (defined inline in each unit's HTML) and handles all interactivity: day navigation with per-day accent colors, progress tracking, activity completion, STOP mode, Focus Mode step-through, timer, GR phase badge, ESOL level toggle, exit ticket overlay, and downloads panel.

It exposes one entry point: `IR.init()` called from each unit page after UNIT is defined.

- [ ] **Step 1: Create `js/unit.js` — module structure and day navigation**

```js
/* =====================================================
   IR Platform — unit.js
   Reads window.UNIT, powers all unit page interactivity
   ===================================================== */

const IR = (() => {
  // ── State ──────────────────────────────────────────
  let currentDay = 1;
  let esolLevel = 'off';    // 'off' | 'l12' | 'l34' | 'l5'
  let stopMode = false;
  let grPhase = '';
  let timerInterval = null;
  let timerSeconds = 0;
  let timerRemaining = 0;
  let timerRunning = false;
  let doneActivityIds = new Set();
  let doneDays = [];
  let focusActivityId = null;
  let focusStep = 0;
  let focusSteps = [];

  // ── Per-day accent palette ─────────────────────────
  const PALETTE = [
    null,  // index 0 unused
    // Days 1–2: Indigo
    { accent:'#6366f1', rgb:'99,102,241', text:'#a5b4fc', bg:'#1e1b4b', border:'#312e81' },
    { accent:'#6366f1', rgb:'99,102,241', text:'#a5b4fc', bg:'#1e1b4b', border:'#312e81' },
    // Days 3–4: Emerald
    { accent:'#10b981', rgb:'16,185,129', text:'#6ee7b7', bg:'#022c22', border:'#064e3b' },
    { accent:'#10b981', rgb:'16,185,129', text:'#6ee7b7', bg:'#022c22', border:'#064e3b' },
    // Days 5–6: Amber
    { accent:'#f59e0b', rgb:'245,158,11', text:'#fcd34d', bg:'#1c0a00', border:'#78350f' },
    { accent:'#f59e0b', rgb:'245,158,11', text:'#fcd34d', bg:'#1c0a00', border:'#78350f' },
  ];

  function getPalette(day) {
    const idx = ((day - 1) % 6) + 1;
    return PALETTE[idx] || PALETTE[1];
  }

  function setDayAccent(day) {
    const p = getPalette(day);
    const r = document.documentElement;
    r.style.setProperty('--day-accent', p.accent);
    r.style.setProperty('--day-accent-rgb', p.rgb);
    r.style.setProperty('--day-accent-text', p.text);
    r.style.setProperty('--day-accent-bg', p.bg);
    r.style.setProperty('--day-accent-border', p.border);
  }

  // ── Day navigation ─────────────────────────────────
  function switchDay(day) {
    currentDay = day;
    setDayAccent(day);
    updateDaySidebar();

    // Fade transition
    const area = document.getElementById('content-area');
    if (area) {
      area.classList.add('fading');
      requestAnimationFrame(() => {
        renderDay(day);
        requestAnimationFrame(() => area.classList.remove('fading'));
      });
    } else {
      renderDay(day);
    }

    // Reset GR badge to day's default phase
    const dayData = UNIT.days[day];
    grPhase = dayData ? (dayData.grPhase || '') : '';
    updateGrBadge();
  }

  function updateDaySidebar() {
    document.querySelectorAll('.day-btn').forEach(btn => {
      const d = parseInt(btn.dataset.day);
      btn.classList.toggle('active', d === currentDay);
      btn.classList.toggle('done', doneDays.includes(d));
    });
  }

  // ── Render day content ─────────────────────────────
  function renderDay(day) {
    const grid = document.getElementById('content-area');
    if (!grid) return;
    const dayData = UNIT.days[day];
    if (!dayData) { grid.innerHTML = '<p style="padding:2rem;color:var(--muted)">No content for this day.</p>'; return; }

    const sections = [];
    sections.push(buildProgressBar(day));
    if (dayData.bellringer) sections.push(buildBellringerSection(dayData.bellringer));
    if (dayData.vocab) sections.push(buildVocabSection(dayData.vocab));
    if (dayData.passage) sections.push(buildPassageSection(dayData.passage));
    if (dayData.organizer) sections.push(buildOrganizerSection(dayData.organizer));
    if (dayData.assessmentMC) sections.push(buildMcSection(dayData.assessmentMC, 'Assessment — Multiple Choice'));
    if (dayData.writtenResponse) sections.push(buildWrittenSection(dayData.writtenResponse));

    grid.innerHTML = sections.join('');
    attachActivityListeners();
    reapplyDoneState();
  }

  // ── Progress bar ───────────────────────────────────
  function buildProgressBar(day) {
    const total = countActivities(day);
    const done = doneActivityIds.size;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `
      <div class="day-progress">
        <div class="day-progress-meta">
          <span class="day-label">Day ${day} — ${UNIT.days[day].label}</span>
          <span>${done} / ${total} activities</span>
        </div>
        <div class="day-progress-track">
          <div class="day-progress-fill" id="progress-fill" style="width:${pct}%"></div>
        </div>
      </div>`;
  }

  function countActivities(day) {
    const d = UNIT.days[day];
    if (!d) return 0;
    let n = 0;
    if (d.bellringer) n += d.bellringer.length;
    if (d.vocab) n += 1;
    if (d.organizer) n += d.organizer.length;
    if (d.assessmentMC) n += d.assessmentMC.length;
    if (d.writtenResponse) n += 1;
    return n;
  }

  function updateProgressBar() {
    const fill = document.getElementById('progress-fill');
    if (!fill) return;
    const total = countActivities(currentDay);
    const done = [...doneActivityIds].filter(id => id.startsWith(`d${currentDay}-`)).length;
    fill.style.width = total ? `${Math.round((done / total) * 100)}%` : '0%';

    // Check day complete
    if (total > 0 && done >= total) showDayComplete();
  }

  function markActivityDone(id) {
    doneActivityIds.add(id);
    const el = document.querySelector(`[data-aid="${id}"]`);
    if (el) applyDoneState(el);
    updateProgressBar();
  }

  function applyDoneState(el) {
    el.classList.add('done');
    const body = el.querySelector('.activity-body');
    if (!body) return;
    if (!el.querySelector('.activity-done-bar')) {
      const bar = document.createElement('div');
      bar.className = 'activity-done-bar';
      bar.innerHTML = `<span>✓ Complete</span><button class="btn-review">Review ↓</button>`;
      bar.querySelector('.btn-review').addEventListener('click', () => el.classList.toggle('expanded'));
      el.appendChild(bar);
    }
  }

  function reapplyDoneState() {
    doneActivityIds.forEach(id => {
      const el = document.querySelector(`[data-aid="${id}"]`);
      if (el) applyDoneState(el);
    });
  }

  // ── Day complete ───────────────────────────────────
  function showDayComplete() {
    const overlay = document.getElementById('day-complete-overlay');
    if (!overlay || overlay.classList.contains('visible')) return;
    const isLast = currentDay === UNIT.days.length || currentDay === UNIT.meta?.days;
    document.getElementById('dc-title').textContent = isLast ? 'Unit Complete! 🎉' : `Day ${currentDay} Complete`;
    document.getElementById('dc-sub').textContent = isLast
      ? `You finished all ${UNIT.meta?.days || currentDay} days.`
      : `${countActivities(currentDay)} activities completed`;
    document.getElementById('dc-btn').textContent = isLast ? 'Back to Day 1' : 'Next Day →';
    overlay.classList.add('visible');

    // Persist done day
    const unitId = UNIT.id || UNIT.meta?.id || 'unit';
    const key = `ir-done-days-${unitId}`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (!saved.includes(currentDay)) saved.push(currentDay);
    localStorage.setItem(key, JSON.stringify(saved));
    doneDays = saved;
    updateDaySidebar();
  }

  // ── Build activity sections ────────────────────────

  function activityWrap(id, typeLabel, titleHtml, bodyHtml) {
    return `
      <div class="activity" data-aid="${id}">
        <div class="activity-type-strip">${typeLabel}</div>
        <div class="activity-header"><h3>${titleHtml}</h3></div>
        <div class="activity-body">${bodyHtml}</div>
      </div>`;
  }

  function buildBellringerSection(questions) {
    return questions.map((q, i) => {
      const id = `d${currentDay}-bellringer-${i}`;
      const choices = q.choices.map((c, ci) => `
        <div class="mc-choice" data-idx="${ci}" data-correct="${c.correct || false}">
          <span class="mc-letter">${c.letter}</span>
          <span class="mc-text">${c.text}</span>
          <span class="stop-badge ${(c.stopLabel||'').toLowerCase()}">${c.stopLabel || ''}</span>
        </div>`).join('');

      const written = q.writtenPrompt ? `
        <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)">
          <div class="activity-instruction">✍️ Written Response</div>
          <p style="font-size:0.9rem;margin-bottom:0.5rem">${q.writtenPrompt}</p>
          ${q.modelResponse ? `<div id="model-${id}" style="display:none;margin-top:0.5rem;padding:0.75rem;background:rgba(34,197,94,0.08);border-radius:8px;font-size:0.85rem;color:var(--muted)">${q.modelResponse}</div>` : ''}
        </div>` : '';

      const body = `
        <div class="activity-instruction">👀 Read the stem carefully</div>
        <div class="mc-question">
          <div class="mc-stem">${q.stem}</div>
          <div class="mc-choices">${choices}</div>
        </div>
        ${written}
        <button class="btn btn-ghost" style="margin-top:0.75rem;font-size:0.8rem" onclick="IR.enterFocus('${id}')">Step Through →</button>`;

      return activityWrap(id, '📝 Bellringer', `Question ${i + 1}`, body);
    }).join('');
  }

  function buildVocabSection(words) {
    const id = `d${currentDay}-vocab`;
    const cards = words.map(w => `
      <div class="vocab-word-card">
        <div class="vocab-word">${w.word}</div>
        <div class="vocab-pos">${w.pos}</div>
        <div class="vocab-def">${w.definition}</div>
        <div class="vocab-sentence">"${w.sentence}"</div>
      </div>`).join('');

    const esol = buildEsolBlock(currentDay);

    const body = `
      <div class="activity-instruction">📖 Read each word, definition, and example</div>
      <div class="vocab-grid">${cards}</div>
      ${esol}`;

    return activityWrap(id, '📖 Vocabulary', `Day ${currentDay} Vocabulary`, body);
  }

  function buildPassageSection(paragraphs) {
    const id = `d${currentDay}-passage`;
    const paras = paragraphs.map(p => `
      <div class="passage-para">
        <div class="passage-para-inner">
          <span class="para-num">${p.n}</span>
          <span>${p.text}</span>
        </div>
      </div>`).join('');
    const body = `
      <div class="activity-instruction">👀 Read and annotate the passage</div>
      <div class="passage-text">${paras}</div>`;
    return activityWrap(id, '🔍 Passage', 'Text Passage', body);
  }

  function buildOrganizerSection(rows) {
    const phaseLabel = { 'i-do':'I Do', 'we-do':'We Do', 'you-do':'You Do', 'you-do-partner':'You Do w/ Partner' };
    return rows.map((row, i) => {
      const id = `d${currentDay}-org-${i}`;
      const phaseClass = `phase-${row.grPhase}`;
      const phaseText = phaseLabel[row.grPhase] || row.grPhase;
      const body = `
        <div class="activity-instruction">✏️ Fill in your row</div>
        <span class="org-phase-badge ${phaseClass}">${phaseText}</span>
        <table class="organizer" style="margin-top:0.5rem">
          <thead><tr><th>Prompt</th><th>Evidence</th><th>Analysis</th></tr></thead>
          <tbody>
            <tr>
              <td>${row.prompt}</td>
              <td>${row.evidence || '<span style="color:var(--muted);font-style:italic">Student writes here</span>'}</td>
              <td>${row.analysis || '<span style="color:var(--muted);font-style:italic">Student writes here</span>'}</td>
            </tr>
          </tbody>
        </table>`;
      return activityWrap(id, '🗂 Graphic Organizer', `${phaseText} — Organizer Row ${i + 1}`, body);
    }).join('');
  }

  function buildMcSection(questions, sectionTitle) {
    return questions.map((q, i) => {
      const id = `d${currentDay}-mc-${i}`;
      const choices = q.choices.map((c, ci) => `
        <div class="mc-choice" data-idx="${ci}" data-correct="${c.correct || false}">
          <span class="mc-letter">${c.letter}</span>
          <span class="mc-text">${c.text}</span>
          <span class="stop-badge ${(c.stopLabel||'').toLowerCase()}">${c.stopLabel || ''}</span>
        </div>`).join('');
      const body = `
        <div class="activity-instruction">👀 Read the stem carefully — use CUBES to eliminate</div>
        <div class="mc-question">
          <div class="mc-stem">${q.stem}</div>
          <div class="mc-choices">${choices}</div>
        </div>
        <button class="btn btn-ghost" style="margin-top:0.75rem;font-size:0.8rem" onclick="IR.enterFocus('${id}')">Step Through →</button>`;
      return activityWrap(id, '📝 Multiple Choice', `${sectionTitle} — Q${i + 1}`, body);
    }).join('');
  }

  function buildWrittenSection(wr) {
    const id = `d${currentDay}-written`;
    const body = `
      <div class="activity-instruction">✍️ Build your response using the frame below</div>
      <p style="font-size:0.95rem;line-height:1.6;margin-bottom:0.75rem">${wr.prompt}</p>
      ${wr.frame ? `<div style="padding:0.85rem;background:var(--day-accent-bg);border:1px solid var(--day-accent-border);border-radius:8px;font-style:italic;color:var(--day-accent-text)">${wr.frame}</div>` : ''}
      ${wr.modelResponse ? `<div id="model-${id}" style="display:none;margin-top:0.75rem;padding:0.85rem;background:rgba(34,197,94,0.08);border-radius:8px;font-size:0.85rem">${wr.modelResponse}</div>` : ''}`;
    return activityWrap(id, '✍️ Written Response', wr.title || 'Written Response', body);
  }

  function buildEsolBlock(day) {
    if (esolLevel === 'off') return '';
    const dayData = UNIT.days[day];
    if (!dayData || !dayData.esol) return '';
    const tier = dayData.esol[esolLevel];
    if (!tier) return '';
    const frames = (tier.frames || []).map(f => `<div class="esol-frame">${f}</div>`).join('');
    const wb = (tier.wordBank && tier.wordBank.length)
      ? `<div class="esol-wordbank">${tier.wordBank.map(w => `<span class="esol-word">${w}</span>`).join('')}</div>` : '';
    const levelLabel = { l12: 'Level 1–2', l34: 'Level 3–4', l5: 'Level 5' }[esolLevel] || esolLevel;
    return `<div class="esol-scaffold"><div class="esol-label">🌐 ESOL Scaffold — ${levelLabel}</div>${frames}${wb}</div>`;
  }

  // ── MC interaction ─────────────────────────────────
  function attachActivityListeners() {
    document.querySelectorAll('.mc-choice').forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('eliminated')) return;
        const siblings = el.parentElement.querySelectorAll('.mc-choice');
        siblings.forEach(s => s.classList.remove('selected'));
        el.classList.add('selected');
      });
    });
  }

  // ── STOP mode ──────────────────────────────────────
  function toggleStop() {
    stopMode = !stopMode;
    document.body.classList.toggle('stop-mode', stopMode);
    const btn = document.getElementById('btn-stop');
    if (btn) btn.classList.toggle('active', stopMode);
  }

  // ── ESOL toggle ────────────────────────────────────
  function cycleEsol() {
    const levels = ['off', 'l12', 'l34', 'l5'];
    esolLevel = levels[(levels.indexOf(esolLevel) + 1) % levels.length];
    const btn = document.getElementById('btn-esol');
    if (btn) {
      const labels = { off: '🌐 ESOL Off', l12: '🌐 L1–2', l34: '🌐 L3–4', l5: '🌐 L5' };
      btn.textContent = labels[esolLevel];
      btn.classList.toggle('active', esolLevel !== 'off');
    }
    renderDay(currentDay);
  }

  // ── GR Phase badge ─────────────────────────────────
  function cycleGrPhase() {
    const phases = ['', 'I Do', 'We Do', 'You Do w/ Partner', 'You Do'];
    grPhase = phases[(phases.indexOf(grPhase) + 1) % phases.length];
    updateGrBadge();
  }

  function updateGrBadge() {
    const badge = document.getElementById('gr-badge');
    if (!badge) return;
    if (!grPhase) { badge.style.display = 'none'; return; }
    const classes = { 'I Do':'phase-i-do', 'We Do':'phase-we-do', 'You Do w/ Partner':'phase-partner', 'You Do':'phase-you-do' };
    badge.className = `gr-badge org-phase-badge ${classes[grPhase] || ''}`;
    badge.textContent = grPhase;
    badge.style.display = 'inline-block';
  }

  // ── Timer ──────────────────────────────────────────
  function setTimer(seconds) {
    timerSeconds = seconds;
    timerRemaining = seconds;
    timerRunning = false;
    clearInterval(timerInterval);
    renderTimerDisplay();
  }

  function toggleTimer() {
    if (timerRunning) {
      clearInterval(timerInterval);
      timerRunning = false;
    } else {
      if (timerRemaining <= 0) timerRemaining = timerSeconds;
      timerRunning = true;
      timerInterval = setInterval(() => {
        timerRemaining--;
        renderTimerDisplay();
        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerRunning = false;
          playTimerAlarm();
        }
      }, 1000);
    }
    const btn = document.getElementById('btn-timer-play');
    if (btn) btn.textContent = timerRunning ? '⏸' : '▶';
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerRemaining = timerSeconds;
    renderTimerDisplay();
    const btn = document.getElementById('btn-timer-play');
    if (btn) btn.textContent = '▶';
  }

  function renderTimerDisplay() {
    const el = document.getElementById('timer-value');
    if (!el) return;
    const m = Math.floor(timerRemaining / 60);
    const s = timerRemaining % 60;
    el.textContent = `${m}:${String(s).padStart(2, '0')}`;
    const display = el.closest('.timer-display');
    if (display) {
      display.classList.toggle('warning', timerRemaining <= 60 && timerRemaining > 10);
      display.classList.toggle('critical', timerRemaining <= 10);
    }
  }

  function playTimerAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.start(); osc.stop(ctx.currentTime + 0.8);
    } catch(e) {}
  }

  // ── Reveal answers ─────────────────────────────────
  function revealAnswers() {
    document.querySelectorAll('.mc-choice').forEach(el => {
      const correct = el.dataset.correct === 'true';
      el.classList.toggle('correct-reveal', correct);
      el.classList.toggle('wrong-reveal', !correct);
    });
    document.querySelectorAll('[id^="model-"]').forEach(el => el.style.display = 'block');
  }

  // ── Exit ticket ────────────────────────────────────
  function showExitTicket() {
    const dayData = UNIT.days[currentDay];
    if (!dayData || !dayData.exitTicket) return;
    const et = dayData.exitTicket;
    document.getElementById('et-prompt').textContent = et.prompt;
    document.getElementById('et-frame').textContent = et.frame || '';
    document.getElementById('exit-ticket-overlay').classList.add('visible');
    setTimer(300); // default 5 min
    toggleTimer();
  }

  // ── Focus Mode ─────────────────────────────────────
  // Simplified step-through: navigate through an activity's content one piece at a time
  function enterFocus(activityId) {
    focusActivityId = activityId;
    focusStep = 0;

    const el = document.querySelector(`[data-aid="${activityId}"]`);
    if (!el) return;

    // Build steps from activity type strip
    const typeStrip = el.querySelector('.activity-type-strip')?.textContent?.trim() || '';
    if (typeStrip.includes('Bellringer') || typeStrip.includes('Multiple Choice')) {
      focusSteps = buildMcFocusSteps(el);
    } else if (typeStrip.includes('Vocabulary')) {
      focusSteps = buildVocabFocusSteps(el);
    } else if (typeStrip.includes('Organizer')) {
      focusSteps = buildOrganizerFocusSteps(el);
    } else if (typeStrip.includes('Written')) {
      focusSteps = buildWrittenFocusSteps(el);
    } else {
      focusSteps = [{ anchor: 'Read Carefully', html: el.querySelector('.activity-body')?.innerHTML || '' }];
    }

    renderFocusStep();
    document.getElementById('focus-overlay').classList.add('visible');
  }

  function buildMcFocusSteps(el) {
    const stem = el.querySelector('.mc-stem')?.outerHTML || '';
    const choices = el.querySelector('.mc-choices')?.outerHTML || '';
    const written = el.querySelector('[id^="model-"]')?.parentElement?.outerHTML || '';
    return [
      { anchor: 'Read the Stem', html: stem },
      { anchor: 'Apply CUBES', html: stem + choices },
      { anchor: 'Pick Your Answer', html: choices },
      { anchor: 'Check Your Answer', html: written || '<p style="color:var(--muted)">Discuss your reasoning.</p>' }
    ];
  }

  function buildVocabFocusSteps(el) {
    const cards = [...el.querySelectorAll('.vocab-word-card')];
    return cards.map((c, i) => ({ anchor: `Word ${i + 1} of ${cards.length}`, html: c.outerHTML }));
  }

  function buildOrganizerFocusSteps(el) {
    const badge = el.querySelector('.org-phase-badge')?.outerHTML || '';
    const table = el.querySelector('.organizer')?.outerHTML || '';
    return [
      { anchor: 'Read the Prompt', html: badge + table },
      { anchor: 'Find Evidence', html: table },
      { anchor: 'Write Your Analysis', html: table }
    ];
  }

  function buildWrittenFocusSteps(el) {
    const prompt = el.querySelector('p')?.outerHTML || '';
    const frame = el.querySelector('[style*="day-accent-bg"]')?.outerHTML || '';
    return [
      { anchor: 'Read the Prompt', html: prompt },
      { anchor: 'Use the Frame', html: prompt + frame },
    ];
  }

  function renderFocusStep() {
    const step = focusSteps[focusStep];
    if (!step) return;
    document.getElementById('focus-anchor').textContent = step.anchor;
    document.getElementById('focus-body').innerHTML = step.html;

    // Step dots
    const dotsEl = document.getElementById('focus-dots');
    if (dotsEl) {
      dotsEl.innerHTML = focusSteps.map((_, i) => `<div class="step-dot${i === focusStep ? ' active' : i < focusStep ? ' done' : ''}"></div>`).join('');
    }

    document.getElementById('focus-step-info').textContent = `Step ${focusStep + 1} of ${focusSteps.length}`;
    document.getElementById('btn-focus-prev').disabled = focusStep === 0;
    document.getElementById('btn-focus-next').textContent = focusStep === focusSteps.length - 1 ? 'Done ✓' : 'Next →';
  }

  function focusNext() {
    if (focusStep < focusSteps.length - 1) {
      focusStep++;
      renderFocusStep();
    } else {
      exitFocus();
    }
  }

  function focusPrev() {
    if (focusStep > 0) { focusStep--; renderFocusStep(); }
  }

  function exitFocus() {
    const completedId = focusActivityId;
    focusActivityId = null;
    focusStep = 0;
    focusSteps = [];
    document.getElementById('focus-overlay').classList.remove('visible');
    if (completedId) markActivityDone(completedId);
  }

  // ── Init ───────────────────────────────────────────
  function init() {
    // Load persisted done days
    const unitId = UNIT.id || UNIT.meta?.id || 'unit';
    doneDays = JSON.parse(localStorage.getItem(`ir-done-days-${unitId}`) || '[]');

    // Load initial timer
    setTimer(4 * 60);

    // Build day sidebar
    const sidebar = document.getElementById('day-sidebar');
    if (sidebar) {
      sidebar.innerHTML = '';
      const titleEl = document.createElement('div');
      titleEl.className = 'day-sidebar-title';
      titleEl.textContent = UNIT.title || UNIT.meta?.title || '';
      sidebar.appendChild(titleEl);

      const days = UNIT.days;
      const dayCount = UNIT.meta?.days || Object.keys(days).length;
      for (let d = 1; d <= dayCount; d++) {
        const btn = document.createElement('button');
        btn.className = 'day-btn';
        btn.dataset.day = d;
        const dayData = days[d] || {};
        btn.innerHTML = `<span class="day-btn-label">Day ${d}</span><span class="day-btn-sub">${dayData.label || ''}</span>`;
        btn.addEventListener('click', () => switchDay(d));
        sidebar.appendChild(btn);
      }
    }

    // Sidebar toggle
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
      document.getElementById('day-sidebar')?.classList.toggle('collapsed');
    });

    // Day complete overlay buttons
    const dcBtn = document.getElementById('dc-btn');
    if (dcBtn) dcBtn.addEventListener('click', () => {
      document.getElementById('day-complete-overlay').classList.remove('visible');
      const isLast = currentDay === (UNIT.meta?.days || Object.keys(UNIT.days).length);
      switchDay(isLast ? 1 : currentDay + 1);
    });

    // Focus overlay buttons
    document.getElementById('btn-focus-next')?.addEventListener('click', focusNext);
    document.getElementById('btn-focus-prev')?.addEventListener('click', focusPrev);
    document.getElementById('btn-focus-back')?.addEventListener('click', exitFocus);

    // Toolbar buttons
    document.getElementById('btn-stop')?.addEventListener('click', toggleStop);
    document.getElementById('btn-esol')?.addEventListener('click', cycleEsol);
    document.getElementById('btn-gr-phase')?.addEventListener('click', cycleGrPhase);
    document.getElementById('btn-reveal')?.addEventListener('click', revealAnswers);
    document.getElementById('btn-exit-ticket')?.addEventListener('click', showExitTicket);
    document.getElementById('btn-exit-ticket-close')?.addEventListener('click', () => {
      document.getElementById('exit-ticket-overlay').classList.remove('visible');
    });

    // Timer
    document.getElementById('btn-timer-play')?.addEventListener('click', toggleTimer);
    document.getElementById('btn-timer-reset')?.addEventListener('click', resetTimer);
    document.getElementById('timer-presets')?.addEventListener('change', e => {
      if (e.target.value) { setTimer(parseInt(e.target.value)); }
    });

    // Light mode toggle
    document.getElementById('btn-light')?.addEventListener('click', () => {
      document.body.classList.toggle('light');
    });

    // Switch to day 1
    switchDay(1);
  }

  // ── Public API ─────────────────────────────────────
  return { init, switchDay, toggleStop, cycleEsol, enterFocus, focusNext, focusPrev, exitFocus };
})();
```

- [ ] **Step 2: Verify unit.js loads without errors**

Create a minimal test page `units/test/index.html`:
```html
<!DOCTYPE html><html><head><link rel="stylesheet" href="../../css/platform.css"></head>
<body>
<script>const UNIT = { id:'test', meta:{ days:1 }, days:{ 1:{ label:'Test Day', bellringer:[], vocab:[] } } };</script>
<script src="../../js/unit.js"></script>
<script>IR.init();</script>
</body></html>
```

Open `http://localhost:8080/units/test/` — no console errors.

- [ ] **Step 3: Delete test page, commit**
```bash
rm -rf units/test
git add js/unit.js
git commit -m "feat: build unit.js — shared unit page engine (day nav, STOP, focus mode, timer, ESOL, GR badge)"
```

---

## Phase 5 — Unit HTML Shell Template

### Task 5: Define the Unit Page HTML Structure

Every unit page shares the same HTML shell. The only difference between units is the `const UNIT = {...}` block. Document the canonical shell here — used as the template for all 4 unit pages.

**Unit page HTML shell (reference only — not a file):**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{UNIT_TITLE} · IR Platform</title>
  <link rel="stylesheet" href="../../css/platform.css">
</head>
<body>

  <!-- Top bar -->
  <header class="unit-topbar">
    <a href="../../" class="tb-back">← IR Platform</a>
    <span class="tb-divider"></span>
    <span class="tb-title">{UNIT_TITLE}</span>
    <div class="tb-tools">
      <!-- Timer -->
      <div style="display:flex;align-items:center;gap:0.25rem;background:var(--surface-2);border-radius:8px;padding:0.25rem 0.5rem;">
        <span class="timer-display"><span id="timer-value">4:00</span></span>
        <button class="btn btn-ghost" id="btn-timer-play" style="min-width:32px;padding:0.25rem 0.5rem;" title="Play/Pause">▶</button>
        <button class="btn btn-ghost" id="btn-timer-reset" style="min-width:32px;padding:0.25rem 0.5rem;" title="Reset">↺</button>
        <select id="timer-presets" style="background:var(--surface-2);color:var(--muted);border:none;font-size:0.75rem;cursor:pointer;" title="Quick presets">
          <option value="">⚡</option>
          <option value="120">2 min</option>
          <option value="180">3 min</option>
          <option value="300">5 min</option>
          <option value="480">8 min</option>
          <option value="720">12 min</option>
        </select>
      </div>
      <!-- Tool buttons -->
      <button class="btn btn-ghost" id="btn-stop" title="STOP Strategy">🛑 STOP</button>
      <button class="btn btn-ghost" id="btn-esol" title="ESOL Level">🌐 ESOL Off</button>
      <button class="btn btn-ghost" id="btn-gr-phase" title="GR Phase">📋 GR</button>
      <button class="btn btn-ghost" id="btn-reveal" title="Reveal Answers">💡 Reveal</button>
      <button class="btn btn-ghost" id="btn-exit-ticket" title="Exit Ticket">🎟 Exit</button>
      <button class="btn btn-ghost" id="btn-light" title="Toggle Light Mode">☀</button>
    </div>
  </header>

  <!-- App body: sidebar + content -->
  <div class="unit-app" style="height:calc(100vh - 56px);">
    <div class="unit-body">
      <nav class="day-sidebar" id="day-sidebar">
        <!-- populated by unit.js -->
        <button class="sidebar-toggle" id="sidebar-toggle">‹</button>
      </nav>
      <main class="content-area" id="content-area">
        <!-- populated by unit.js renderDay() -->
      </main>
    </div>
  </div>

  <!-- GR phase badge (floating, bottom-right) -->
  <div class="gr-badge" id="gr-badge" style="display:none"></div>

  <!-- Day complete overlay -->
  <div class="day-complete-overlay" id="day-complete-overlay">
    <div class="day-complete-card">
      <div class="day-complete-emoji">🎉</div>
      <div class="day-complete-title" id="dc-title"></div>
      <div class="day-complete-sub" id="dc-sub"></div>
      <button class="btn btn-primary" id="dc-btn" style="margin-top:1.5rem;width:100%;justify-content:center;"></button>
    </div>
  </div>

  <!-- Exit ticket overlay -->
  <div class="exit-ticket-overlay" id="exit-ticket-overlay">
    <div class="exit-ticket-card">
      <div class="exit-ticket-label">🎟 Exit Ticket — Day {DAY}</div>
      <div class="exit-ticket-prompt" id="et-prompt"></div>
      <div class="exit-ticket-frame" id="et-frame"></div>
      <button class="btn btn-ghost" id="btn-exit-ticket-close">Close</button>
    </div>
  </div>

  <!-- Focus Mode overlay -->
  <div class="focus-overlay" id="focus-overlay">
    <div class="focus-header">
      <button class="btn btn-ghost" id="btn-focus-back" style="font-size:0.8rem;">← Back</button>
      <div class="focus-anchor" id="focus-anchor"></div>
      <div class="focus-step-dots" id="focus-dots"></div>
    </div>
    <div class="focus-body" id="focus-body"></div>
    <div class="focus-nav">
      <button class="btn btn-ghost" id="btn-focus-prev">← Back</button>
      <span class="focus-step-info" id="focus-step-info" style="font-size:0.8rem;color:var(--muted)"></span>
      <button class="btn btn-primary" id="btn-focus-next">Next →</button>
    </div>
  </div>

  <!-- UNIT DATA — replace this block per unit -->
  <script>
  const UNIT = {
    // ... unit-specific data
  };
  </script>
  <script src="../../js/unit.js"></script>
  <script>IR.init();</script>
</body>
</html>
```

---

## Phase 6 — Migrate AliCogia

### Task 6: Build `units/alicogia/index.html`

**Files:**
- Create: `units/alicogia/index.html`
- Source: `~/Documents/Teaching/Units/AliCogia-LiteraryElements/AliCogia_D1-6_InteractiveLesson_v10.html`

Read the v10 source file carefully. Extract: all 18 passage paragraphs, all day structures (bellringer questions + vocab per day, organizer rows, assessment MC). Map into the `UNIT` schema. The HTML shell is copied from Task 5.

- [ ] **Step 1: Read and extract content from v10**

Open `~/Documents/Teaching/Units/AliCogia-LiteraryElements/AliCogia_D1-6_InteractiveLesson_v10.html` and identify:
- All passage paragraphs (¶1–18)
- Day 1: bellringer vocab words + MC questions, passage
- Day 2: bellringer vocab + MC questions, passage
- Day 3: organizer rows (I Do + We Do)
- Day 4: organizer rows (You Do Partner + You Do)
- Day 5: formal assessment MC questions
- Day 6: written response prompt + RACE frame
- Vocab words per day (3 per day)
- Exit ticket prompts per day
- STOP labels on all MC choices (Silly/Tricky/Opposite/Proven)

- [ ] **Step 2: Build `units/alicogia/index.html`**

Use the shell from Task 5. Replace title, add full `const UNIT = {...}` block with all content extracted in Step 1. Ensure:
- `id: 'alicogia'`
- `meta.days: 6`
- `passage` contains all 18 paragraphs at top level
- All 6 days defined with correct structure
- All MC choices have `stopLabel` values
- All organizer rows have `grPhase` values
- `esol` blocks defined at all 3 tiers for days 1–4
- `exitTicket` defined for all 6 days
- `assessment.achievementLevels` defined (4 levels)
- `downloads` array pointing to existing files in `downloads/`

- [ ] **Step 3: Verify in browser**

```bash
python3 -m http.server 8080
```

Check `http://localhost:8080/units/alicogia/`:
- Unit loads, topbar shows "Ali Cogia" title
- Sidebar shows 6 day buttons
- Switching days changes content and accent color (indigo → emerald → amber)
- STOP button toggles STOP labels on all MC choices
- Focus Mode: clicking "Step Through →" opens focus overlay, steps work, exits and marks activity done
- Timer: play/pause/reset work; presets change timer
- Exit ticket opens, shows prompt and frame
- Progress bar advances as activities are completed
- Day complete overlay appears when all done
- "← IR Platform" returns to home

- [ ] **Step 4: Commit**
```bash
git add units/alicogia/index.html
git commit -m "feat: migrate Ali Cogia unit — 6-day, full content from v10 source"
```

---

## Phase 7 — Migrate Shakuntala

### Task 7: Build `units/shakuntala/index.html`

**Files:**
- Create: `units/shakuntala/index.html`
- Source: `~/Documents/Teaching/Units/Shakuntala-Unit/Shakuntala_D1-4_TestPrep_Interactive_v9.html`
- Source: `~/Documents/Teaching/Units/Shakuntala-Unit/Unit2_Shakuntala_StudentPacket.md`

Same process as Task 6. Shakuntala is a 4-day unit. Days 1–2 use Indigo, Days 3–4 use Emerald. Read v9 source for all content.

- [ ] **Step 1: Read and extract content from v9 + student packet**
- [ ] **Step 2: Build `units/shakuntala/index.html`** using Task 5 shell with `meta.days: 4`
- [ ] **Step 3: Verify in browser** — same checklist as Task 6, but 4 days
- [ ] **Step 4: Commit**
```bash
git add units/shakuntala/index.html
git commit -m "feat: migrate Shakuntala unit — 4-day test prep from v9 source"
```

---

## Phase 8 — Build Bloomers

### Task 8: Build `units/bloomers/index.html`

**Files:**
- Create: `units/bloomers/index.html`
- Source: `~/Documents/Teaching/Units/BlueJeans-Unit/Unit2_Bloomers_StudentPacket.md`
- Source: `~/Documents/Teaching/Units/BlueJeans-Unit/Unit2_Bloomers_TeacherLessonPlan.md`

Bloomers is a 4-day informational unit (ELA.10.R.2.1 — Central Idea). Read both source files to extract all content. This unit does NOT have an existing interactive HTML — build it fresh from the student packet and lesson plan.

- [ ] **Step 1: Read both source files completely**

Key content to extract from student packet:
- Vocab: `avant-garde`, `accentuated`, `renouncing` (plus any per-day words)
- Bellringer MC questions per day with STOP labels
- Annotation guide (Circle/Box/Underline system — this unit uses CBU, not CUBES)
- All passage paragraphs
- Organizer rows per day with GR phases
- Assessment MC questions
- Written response prompts

- [ ] **Step 2: Build `units/bloomers/index.html`**

Note: This unit uses Circle/Box/Underline annotation (not CUBES). Set `cubesGuide` to reflect CBU. STOP labels still apply to MC choices.

- [ ] **Step 3: Verify in browser** — same checklist, 4 days
- [ ] **Step 4: Commit**
```bash
git add units/bloomers/index.html
git commit -m "feat: build Bloomers unit — 4-day central idea from student packet"
```

---

## Phase 9 — Build Math Innovations

### Task 9: Build `units/mathinnovations/index.html`

**Files:**
- Create: `units/mathinnovations/index.html`
- Source: `~/Documents/Teaching/Units/MathInnovations-TextStructure/` (read all .md files)

Math Innovations is a 4-day informational unit (ELA.10.R.2.2 — Text Structure). Same process as Task 8.

- [ ] **Step 1: Read all source files in MathInnovations-TextStructure/**
```bash
ls ~/Documents/Teaching/Units/MathInnovations-TextStructure/
```
Read the student packet and lesson plan.

- [ ] **Step 2: Build `units/mathinnovations/index.html`**
- [ ] **Step 3: Verify in browser** — same checklist, 4 days
- [ ] **Step 4: Commit**
```bash
git add units/mathinnovations/index.html
git commit -m "feat: build Math Innovations unit — 4-day text structure from student packet"
```

---

## Phase 10 — Integration + Deployment

### Task 10: End-to-End Verification + Google Sites

**Files:** None — verification only

- [ ] **Step 1: Full platform navigation test**

```bash
python3 -m http.server 8080
```

Test flow:
1. Open `http://localhost:8080` — home dashboard loads
2. Filter by "R.1 Literary" → shows 2 units
3. Click Ali Cogia → unit loads, Day 1 active, indigo accent
4. Navigate to Day 3 → accent changes to emerald
5. Click STOP → STOP badges appear on all MC choices
6. Click a "Step Through →" button → Focus Mode opens
7. Step through all steps → exits, marks activity done, progress bar advances
8. Complete all Day 1 activities → Day Complete overlay appears
9. Click "Next Day →" → Day 2 loads, Day 1 shows as done in sidebar
10. "← IR Platform" → returns to home
11. Repeat for all 4 units

- [ ] **Step 2: Push to GitHub Pages**
```bash
cd ~/Desktop/ir-platform
git push origin main
```

Wait ~2 minutes for GitHub Pages to deploy. Verify at `https://burger4991.github.io/ir-platform/`.

- [ ] **Step 3: Test Google Sites iframe**

In Google Sites:
- Edit page → Insert → Embed → paste `https://burger4991.github.io/ir-platform/`
- Preview → verify platform loads inside iframe
- Navigate to a unit → verify unit loads within iframe
- Test at full-screen (Promethean board dimensions: 1920×1080)

- [ ] **Step 4: Final commit**
```bash
git add .
git commit -m "chore: deployment verified — IR Platform rebuild complete"
git push
```

---

## Verification Checklist

Before marking the rebuild complete, every item must pass:

**Home page:**
- [ ] Dark background `#0f172a`, premium card design
- [ ] 4 unit cards, correct benchmarks and descriptions
- [ ] Filter by category works
- [ ] Search works

**Each unit page (run for all 4):**
- [ ] Loads without console errors
- [ ] Sidebar shows correct number of days
- [ ] Accent color changes per day group (indigo/emerald/amber)
- [ ] STOP mode toggles badge labels on all MC choices
- [ ] Focus Mode steps through activity, exits, marks done, advances progress
- [ ] Progress bar reflects completion
- [ ] Day Complete overlay triggers on day finish
- [ ] Exit ticket opens with correct prompt
- [ ] ESOL cycles through off/L1-2/L3-4/L5 with correct frames
- [ ] GR badge cycles through phases
- [ ] Timer works (play/pause/reset/presets)
- [ ] Reveal shows correct answers
- [ ] Light mode toggle works
- [ ] Print hides UI chrome
- [ ] "← IR Platform" navigates home

**Google Sites:**
- [ ] iframe loads and is usable at 1920×1080
- [ ] All navigation works within iframe
