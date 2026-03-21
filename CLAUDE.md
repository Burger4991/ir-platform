# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Static HTML/CSS/JS classroom projection tool for 10th grade Intensive Reading instruction. No build step, no framework, no dependencies. Hosted on GitHub Pages; embeddable in Google Sites via iframe.

**Current status:** "Scorched earth" rebuild in progress per `/docs/superpowers/plans/2026-03-20-ir-platform-rebuild.md`. Old architecture exists but is being replaced.

## Local Development

```bash
python3 -m http.server 8080
# Browse: http://localhost:8080/
```

Deployment = git push to main → GitHub Pages auto-deploys.

## Target Architecture (Rebuild)

| File | Role |
|------|------|
| `index.html` | Home dashboard — reads from `units-registry.js` |
| `units-registry.js` | Master unit metadata list |
| `css/platform.css` | Single shared stylesheet (replaces `css/main.css` + `css/themes.css`) |
| `js/unit.js` | Single shared unit page script (replaces all 14 files in `js/`) |
| `units/{id}/index.html` | Self-contained unit page with inline `const UNIT = {...}` data object |
| `units/{id}/downloads/` | PDFs — preserved as-is |

Unit pages load shared files via relative paths: `../../css/platform.css`, `../../js/unit.js`.

## Unit Data Schema

Each unit page contains an inline `const UNIT` with this shape:

```js
const UNIT = {
  meta: { id, title, benchmark, benchmarkLabel, benchmarkDescription, days, tags, ... },
  passage: [{ number, text }, ...],
  cubesGuide: [{ letter, symbol, action, example }, ...],  // or CBU for Bloomers
  days: {
    1: {
      bellringer: { words, questions: [{ stem, options: [{ letter, text, correct, stopLabel }], writtenPrompt, writtenModel }] },
      vocabulary: [{ word, partOfSpeech, definition, exampleSentence }],
      comprehensionMC: { title, questions: [{ stem, options }] },
      writtenPrompt, writtenModel, // ... organizers etc.
    },
    // days 2–6 same shape
  }
}
```

## Design System

**Dark palette:**
- `--bg: #0f172a` (page bg), `--surface: #1e293b` (cards/topbar), `--surface-2: #334155` (hover/nested)
- `--text: #f1f5f9`, `--muted: #94a3b8`, `--border: #334155`

**Per-day accent system:**
| Days | Accent | Color |
|------|--------|-------|
| 1–2 | Indigo | `#6366f1` |
| 3–4 | Emerald | `#10b981` |
| 5–6 | Amber | `#f59e0b` |

**Layout:** `--radius: 12px`, sticky nav, flex card grid.

## Live Units & Content Sources

| Unit | Source File |
|------|-------------|
| `alicogia` | `~/Documents/Teaching/Units/AliCogia-LiteraryElements/AliCogia_D1-6_InteractiveLesson_v10.html` |
| `shakuntala` | `~/Documents/Teaching/Units/Shakuntala-Unit/Shakuntala_D1-4_TestPrep_Interactive_v9.html` |
| `bloomers` | `~/Documents/Teaching/Units/BlueJeans-Unit/` (uses **CBU** annotation, not CUBES) |
| `mathinnovations` | `~/Documents/Teaching/Units/MathInnovations-TextStructure/` |

Read permissions for these are already set in `.claude/settings.local.json`.

All other units in `units/` are stubs — delete them in Phase 1 of the rebuild.
