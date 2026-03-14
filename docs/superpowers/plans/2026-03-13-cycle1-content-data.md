# Cycle 1 — Content + Data Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure data.js to match the student packet exactly, add CUBES annotation interactivity to the passage, replace 4 split organizer cards with 1 consolidated card, and replace passive MC display with an active STOP elimination mechanic.

**Architecture:** This is a vanilla HTML/CSS/JS project with no build step. All changes are to plain JS files loaded via `<script>` tags in `units/alicogia/index.html`. The renderer pipeline is: `data.js` → `activities.js` (adapter) → `cards.js` (HTML builder) → `focus.js` (step-through). We add one new file (`js/cubes.js`) and touch all existing pipeline files.

**Tech Stack:** Vanilla JS (ES5-compatible), CSS custom properties, sessionStorage for annotation persistence, Selection API for text markup.

**IR Framework Context:** This unit follows the 6-day IR cycle. Days 1–2 build foundation (first read + CUBES annotation). Days 3–4 analyze text (graphic organizer with GR model). Days 5–6 assess and apply (MC assessment + written response). STOP labels on MC choices: **S**illy (obviously wrong), **T**ricky (partially true), **O**pposite (contradicts text), **P**roven (supported by text evidence). CUBES for passage: **C**ircle unknown words, **U**nderline key phrases, **B**ox turning points, **E**xclamation (!) for surprising details, **S**tar (★) passages that reveal theme.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `units/alicogia/data.js` | **Rewrite** | Full Option C restructure — shared passage (all 18 ¶), day activities match student packet |
| `js/activities.js` | **Modify** | Read from `UNIT.passage`, handle `organizer` and `comprehensionMC` types |
| `js/cards.js` | **Modify** | Add `buildOrganizerBody()`, update `buildMcBody()` for STOP elimination, update type maps |
| `js/cubes.js` | **Create** | CUBES annotation engine — text selection → toolbar → visual markup → sessionStorage |
| `js/focus.js` | **Modify** | New `organizer` step defs, updated `passage-annotation` steps, updated MC steps |
| `css/main.css` | **Modify** | Styles for: cubes markup (circle/underline/box/note/star), MC elimination states, consolidated organizer |
| `units/alicogia/index.html` | **Modify** | Add `<script src="../../js/cubes.js">` as the **last** script tag, after `engage.js` and before `</body>` |

---

## Chunk 1: Data Layer

### Task 1: Rewrite data.js — Full Option C Restructure

**Files:**
- Modify: `units/alicogia/data.js`

**What changes:**
1. Extract the full 18-paragraph passage to `UNIT.passage` (shared across all days)
2. Add `UNIT.cubesGuide` at the top level (used by all days)
3. Each day keeps: `label`, `bellringer`, `vocabulary`, `esol`
4. Day 1 adds: `comprehensionMC` (4 questions from student packet)
5. Day 2 adds: `comprehensionMC` (4 questions from student packet, ¶10–18 focus)
6. Days 3–4 add: `organizer` with only the rows for that day (Day 3 = I Do + We Do; Day 4 = You Do w/ Partner + You Do)
7. Day 5 adds: `assessmentMC` (formal STOP assessment, questions from student packet Q9–Q15)
8. Day 6 adds: `raceFrames` (written response)
9. Remove: per-day `textPassage` (passage is now shared), `raceFrames` from Days 1–4
10. Add paragraphs 17–18 (see source note below)

**Paragraph 17–18 source:** The answer key (`downloads/AliCogia_D1-6_AnswerKey_20260308.docx`) confirms ¶17 contains: "he recorked the vase so well that Ali Cogia will never know it has been touched." Extend from the existing ¶13–16 content using this quote as the anchor. ¶17 = the merchant recorks and conceals. ¶18 = the conclusion (Ali Cogia discovers the fraud and seeks justice — consistent with the story's moral theme). Use the standard public domain text from *One Thousand and One Nights* (Project Gutenberg) for exact wording if needed.

**Comprehension MC questions for Day 1 (from student packet):**
- Q1: Why does Ali Cogia make the pilgrimage? → B (recurring dream convinced him it's his religious duty)
- Q2: What is Ali Cogia's main problem? → C (worried about safely leaving his thousand gold pieces)
- Q3: What kind of person is Ali Cogia? → B (trustworthy and willing to follow his conscience)
- Q4: What does the recurring dream suggest about his society? → B (religious duty is highly valued)

**Comprehension MC questions for Day 2 (from student packet):**
- Q1: After seven years, what does Ali Cogia decide? → B (Return to Baghdad to retrieve his gold)
- Q2: What does the merchant's wife advise him NOT to do? → B (not keep the gold — Ali Cogia might return)
- Q3: Why does the merchant finally open the vase? → C (He cannot resist temptation/greed)
- Q4: What does the merchant do after taking the gold? → A (He refills with olives and recorks it to hide the theft)

**Assessment MC for Day 5** (formal STOP protocol, from student packet Q9–Q15):
These are benchmark-aligned literary analysis questions. Include at minimum Q11–Q14 from the packet (dialogue, setting, symbol, theme). Each option MUST have a `stopLabel` field.

- [ ] **Step 1: Back up the current data.js**
  ```bash
  cp units/alicogia/data.js units/alicogia/data.js.bak
  ```

- [ ] **Step 2: Write the new data.js**

  The file must export a global `UNIT` constant with this top-level shape:
  ```js
  const UNIT = {
    meta: { /* unchanged */ },
    passage: [
      // All 18 paragraphs as { number, text } objects
      // ¶1–16: copy from existing data.js (already have correct text)
      // ¶17: "The merchant, having satisfied himself that every trace of his fraud was concealed,
      //        had recorked the vase so carefully that Ali Cogia could not possibly tell it had been touched."
      // ¶18: "But Ali Cogia, upon opening the vase, found only olives — not a single gold piece remained.
      //        Shocked and grieved, he went directly to the cadi to seek justice, and told his story."
    ],
    cubesGuide: [
      { letter: 'C', symbol: 'circle',    action: 'Circle unknown words',                    example: 'contented, Mussulman' },
      { letter: 'U', symbol: 'underline', action: 'Underline key phrases (character, conflict)', example: '"contented himself with modest profits"' },
      { letter: 'B', symbol: 'box',       action: 'Box turning points or important moments',  example: 'The merchant opens the vase' },
      { letter: 'E', symbol: 'exclaim',   action: 'Exclamation (!) for surprising details',   example: 'The same dream repeated 3 times' },
      { letter: 'S', symbol: 'star',      action: 'Star (★) passages that reveal theme',      example: '"He could not resist the temptation"' }
    ],
    days: {
      1: {
        label: 'First Read — Foundation',
        bellringer: { /* existing Day 1 bellringer — keep unchanged */ },
        vocabulary:  [ /* existing Day 1 vocabulary — keep unchanged */ ],
        comprehensionMC: {
          title: 'Comprehension Check',
          questions: [
            // 4 questions from student packet Day 1 (listed above)
            // Each option: { letter, text, correct: bool, stopLabel: 'Silly'|'Tricky'|'Opposite'|'Proven' }
          ]
        },
        esol: { /* existing Day 1 esol — keep unchanged */ }
      },
      2: {
        label: 'Complete Reading',
        bellringer: { /* existing Day 2 bellringer — keep unchanged */ },
        vocabulary:  [ /* existing Day 2 vocabulary — keep unchanged */ ],
        comprehensionMC: {
          title: 'Comprehension Check — ¶10–18',
          questions: [ /* 4 questions from student packet Day 2 (listed above) */ ]
        },
        esol: { /* existing Day 2 esol — keep unchanged */ }
      },
      3: {
        label: 'Organizer — I Do & We Do',
        bellringer: { /* existing Day 3 bellringer — keep unchanged */ },
        vocabulary:  [ /* existing Day 3 vocabulary — keep unchanged */ ],
        organizer: {
          benchmarkFocus: 'Literary Elements — Character',
          columns: ['Literary Element', 'Evidence from Text'],
          rows: [
            { label: 'I Do', cells: ['Character — Ali Cogia', 'Ali Cogia is described as a merchant who "contented himself with the modest profits produced by his trade" (¶1). He is not greedy and lives honorably.'], isPreFilled: true },
            { label: 'We Do', cells: ['Setting', ''], isPreFilled: false }
          ]
        },
        esol: { /* existing Day 3 esol — keep unchanged */ }
      },
      4: {
        label: 'Organizer — You Do',
        bellringer: { /* existing Day 4 bellringer — keep unchanged */ },
        vocabulary:  [ /* existing Day 4 vocabulary — keep unchanged */ ],
        organizer: {
          benchmarkFocus: 'Literary Elements — Conflict & Symbol',
          columns: ['Literary Element', 'Evidence from Text'],
          rows: [
            { label: 'You Do w/ Partner', cells: ['Conflict', ''], isPreFilled: false },
            { label: 'You Do',            cells: ['Symbol',   ''], isPreFilled: false }
          ]
        },
        esol: { /* existing Day 4 esol — keep unchanged */ }
      },
      5: {
        label: 'Assessment — STOP Protocol',
        bellringer: { /* existing Day 5 bellringer — keep unchanged */ },
        vocabulary:  [ /* existing Day 5 vocabulary — keep unchanged */ ],
        assessmentMC: {
          title: 'Literary Elements Assessment',
          questions: [
            // 4–5 questions from student packet Q11–Q14
            // Use exact text and options from the packet
            // Each option must have stopLabel
          ]
        },
        esol: { /* existing Day 5 esol — keep unchanged */ }
      },
      6: {
        label: 'Written Response',
        bellringer: { /* existing Day 6 bellringer — keep unchanged */ },
        vocabulary:  [ /* existing Day 6 vocabulary — keep unchanged */ ],
        raceFrames:  { /* existing Day 6 raceFrames — keep unchanged */ },
        esol: { /* existing Day 6 esol — keep unchanged */ }
      }
    }
  };
  ```

  **Where to find existing content:** Copy from `units/alicogia/data.js.bak`. Look for:
  - `days.1.bellringer` → already has context clue questions with `stopLabel` on each option
  - `days.1.vocabulary` → 3 words with definition and example
  - `days.1.esol` → l12/l34/l5 frames
  - Same pattern for days 2–6
  - `days.6.raceFrames` (line ~600 in bak) for the written response

- [ ] **Step 3: Verify the file loads**
  Open `units/alicogia/index.html` in browser (via file:// or local server). Open DevTools console. Check: `UNIT.passage.length` should be `18`, `UNIT.cubesGuide.length` should be `5`, `UNIT.days[3].organizer.rows.length` should be `2`.

- [ ] **Step 4: Commit**
  ```bash
  git add units/alicogia/data.js
  git commit -m "feat(data): rewrite data.js — shared passage, day-aligned activities, comprehensionMC, consolidated organizer"
  ```

---

### Task 2: Update activities.js — New Activity Types

**Files:**
- Modify: `js/activities.js`

**What changes:**
1. Passage always comes from `UNIT.passage` (not `dayData.textPassage`)
2. Add `organizer` type handler (replaces multiple `organizer-row` activities with 1 card)
3. Add `comprehensionMC` and `assessmentMC` type handlers (same shape as `mc`)
4. Remove `organizer-row` loop (dead code after data.js rewrite)

- [ ] **Step 1: Back up `activities.js`**
  ```bash
  cp js/activities.js js/activities.js.bak
  ```

- [ ] **Step 2: Open `js/activities.js`** and read the current `buildActivities` function

- [ ] **Step 3: Replace `buildActivities` with this updated version**

  ```js
  function buildActivities(dayData) {
    if (!dayData) return [];
    const activities = [];

    // ── Passage — always from UNIT.passage (all 18 paragraphs, all days) ──
    if (typeof UNIT !== 'undefined' && UNIT.passage && UNIT.passage.length) {
      activities.push({
        id: 'passage-annotation',
        type: 'passage-annotation',
        grPhase: 'i-do',
        title: 'Text Passage — Ali Cogia',
        strategies: ['cubes'],
        data: {
          paragraphs: UNIT.passage,
          cubesGuide: (UNIT.cubesGuide || [])
        }
      });
    }

    // ── Bellringer MC (context clues vocabulary) ──
    if (dayData.bellringer && dayData.bellringer.questions) {
      dayData.bellringer.questions.forEach((q, i) => {
        activities.push({
          id: 'bellringer-q' + i,
          type: 'mc',
          grPhase: 'we-do',
          title: 'Bellringer · Q' + (i + 1),
          strategies: ['cubes', 'stop'],
          data: {
            stem: q.stem,
            options: q.options || [],
            writtenPrompt: q.writtenPrompt || null,
            writtenModel: q.writtenModel || null
          }
        });
      });
    }

    // ── Comprehension MC (Days 1–2: after first/complete read) ──
    if (dayData.comprehensionMC && dayData.comprehensionMC.questions) {
      dayData.comprehensionMC.questions.forEach((q, i) => {
        activities.push({
          id: 'comprehension-q' + i,
          type: 'mc',
          grPhase: 'you-do',
          title: (dayData.comprehensionMC.title || 'Comprehension') + ' · Q' + (i + 1),
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

    // ── Consolidated Organizer (Days 3–4: single card, all rows for that day) ──
    if (dayData.organizer && dayData.organizer.rows) {
      activities.push({
        id: 'organizer',
        type: 'organizer',
        grPhase: 'we-do',  // mixed — card itself shows GR per row
        title: 'Graphic Organizer — ' + (dayData.organizer.benchmarkFocus || ''),
        strategies: ['cubes'],
        data: {
          benchmarkFocus: dayData.organizer.benchmarkFocus || '',
          columns:        dayData.organizer.columns || [],
          rows:           dayData.organizer.rows || []
        }
      });
    }

    // ── Vocabulary (one card per word) ──
    const vocabItems = dayData.vocabulary || dayData.vocab || [];
    vocabItems.forEach((v, i) => {
      activities.push({
        id: 'vocab-' + i,
        type: 'vocabulary',
        grPhase: 'we-do',
        title: 'Vocabulary · ' + (v.word || ''),
        strategies: [],
        data: {
          word:           v.word,
          partOfSpeech:   v.partOfSpeech || '',
          definition:     v.definition || '',
          exampleSentence: v.exampleSentence || v.example || '',
          esolFrames:     dayData.esol || null
        }
      });
    });

    // ── Assessment MC (Day 5: formal STOP protocol) ──
    if (dayData.assessmentMC && dayData.assessmentMC.questions) {
      dayData.assessmentMC.questions.forEach((q, i) => {
        activities.push({
          id: 'assessment-q' + i,
          type: 'mc',
          grPhase: 'you-do',
          title: (dayData.assessmentMC.title || 'Assessment') + ' · Q' + (i + 1),
          strategies: ['stop'],
          data: {
            stem: q.stem,
            options: q.options || [],
            writtenPrompt: q.writtenPrompt || null,
            writtenModel:  q.writtenModel  || null
          }
        });
      });
    }

    // ── Written Response (Day 6: RACE/CER) ──
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
  ```

  **Note on `labelToGrPhase`:** This function is no longer called by `buildActivities` after the rewrite (the new `organizer` type doesn't use it). Keep it in the file to avoid breaking any external callers — it is harmless dead code.

- [ ] **Step 4: Verify in browser**
  Switch to Day 3. Check DevTools: `buildActivities(UNIT.days[3])` should return an array where one element has `type: 'organizer'` and `data.rows.length === 2`. Day 1 should have a passage card, 2 bellringer MC cards, 4 comprehensionMC cards, 3 vocab cards.

- [ ] **Step 5: Commit**
  ```bash
  git add js/activities.js
  git commit -m "feat(activities): shared passage + organizer/comprehensionMC/assessmentMC activity types"
  ```

---

## Chunk 2: Core UI Components

### Task 3: Consolidated Organizer Card

**Files:**
- Modify: `js/cards.js`
- Modify: `css/main.css`

**What changes:**
- Add `buildOrganizerBody(data)` function to `cards.js`
- Register `'organizer'` type in `ACTIVITY_TYPE_LABELS` and `STEP_DOT_COUNTS`
- Add case for `'organizer'` in `buildActivityBody()`
- Add CSS classes: `.org-card-table`, `.org-card-row`, `.org-card-row--i-do`, `.org-card-row--we-do`, `.org-card-row--you-do-partner`, `.org-card-row--you-do`, `.org-card-cell`, `.org-card-cell--prefilled`, `.org-card-header`

**Design:** Single card showing all rows (per day's organizer data). Column headers use benchmark language. I Do row has green tint and pre-filled content. We Do / You Do rows show the literary element label in column 1 and a dashed placeholder in column 2. GR phase badge appears on the left side of each row.

- [ ] **Step 1: Back up `cards.js`**
  ```bash
  cp js/cards.js js/cards.js.bak
  ```

- [ ] **Step 2: Add `'organizer'` to the two maps in `cards.js`**

  In `ACTIVITY_TYPE_LABELS` add:
  ```js
  'organizer': '🗂 Graphic Organizer'
  ```

  In `STEP_DOT_COUNTS` add:
  ```js
  'organizer': 3   // default — Days 3 and 4 each have 2 rows + 1 confirm = 3 steps
  ```
  **Note:** This hardcoded `3` works as long as each day's organizer has exactly 2 rows. If the row count changes, the dot display in the card header will be wrong (though Focus Mode itself uses `buildOrganizerSteps` which is correct regardless). The `getStepDotCount` function below overrides this dynamically — the STEP_DOT_COUNTS entry is only a fallback.

  Update `getStepDotCount` to handle the `organizer` type dynamically:
  ```js
  function getStepDotCount(type, grPhase, data) {
    if (type === 'organizer') {
      // 1 step per row + 1 confirm step
      return data && data.rows ? data.rows.length + 1 : 3;
    }
    if (type === 'organizer-row') return STEP_DOT_COUNTS['organizer-row-' + grPhase] || 3;
    return STEP_DOT_COUNTS[type] || 1;
  }
  ```

  Update the call site in `buildActivityEl`:
  ```js
  const dotCount = getStepDotCount(activity.type, activity.grPhase, activity.data);
  ```

- [ ] **Step 3: Add case to `buildActivityBody`**
  ```js
  case 'organizer': return buildOrganizerBody(activity.data);
  ```

- [ ] **Step 4: Add `buildOrganizerBody` function**

  Add after `buildOrganizerRowBody`:
  ```js
  // ── Consolidated Organizer Card (all GR rows in one card) ──
  function buildOrganizerBody(data) {
    const GR_COLORS = {
      'I Do':              '#4a7c59',
      'We Do':             '#7aaa89',
      'You Do w/ Partner': '#9c7e5a',
      'You Do':            '#64748b'
    };

    const colHeaders = data.columns.slice(1).map(c =>
      `<div class="org-card-col-header">${esc(c)}</div>`
    ).join('');

    const rowsHTML = data.rows.map((row, i) => {
      const color  = GR_COLORS[row.label] || '#64748b';
      const isDone = row.isPreFilled;
      const cells  = data.columns.slice(1).map((col, ci) => {
        const content = (row.cells || [])[ci] || '';
        if (isDone && content) {
          return `<div class="org-card-cell org-card-cell--prefilled">${esc(content)}</div>`;
        }
        // First data column (literary element) shows the label as a hint if no content
        if (ci === 0 && content) {
          return `<div class="org-card-cell org-card-cell--hint">${esc(content)}</div>`;
        }
        return `<div class="org-card-cell org-card-cell--blank">Students respond…</div>`;
      }).join('');

      const rowClass = isDone ? 'org-card-row org-card-row--prefilled' : 'org-card-row';
      return `
        <div class="${rowClass}" data-org-row-index="${i}">
          <div class="org-card-phase-badge" style="background:${esc(color)};">${esc(row.label)}</div>
          ${cells}
        </div>`;
    }).join('');

    return `
      <div class="activity-instruction">📖 Use the passage and organizer to analyze ${esc(data.benchmarkFocus)}</div>
      <div class="org-card-table">
        <div class="org-card-header">
          <div></div>
          ${colHeaders}
        </div>
        ${rowsHTML}
      </div>`;
  }
  ```

- [ ] **Step 5: Add CSS to `css/main.css`** — append before the `prefers-reduced-motion` block

  ```css
  /* ── Consolidated Organizer Card ── */
  .org-card-table {
    display: flex;
    flex-direction: column;
    gap: 0;
    border: 1px solid var(--border);
    border-radius: 6px;
    overflow: hidden;
    margin-top: 8px;
  }
  .org-card-header,
  .org-card-row {
    display: grid;
    grid-template-columns: 100px 1fr 1fr;
    gap: 0;
  }
  .org-card-header {
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--border);
    padding: 5px 10px;
  }
  .org-card-col-header {
    font-size: 9px;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 4px 8px;
  }
  .org-card-row {
    border-bottom: 1px solid var(--border);
    padding: 6px 10px;
    align-items: start;
    gap: 6px;
    transition: background 0.2s;
  }
  .org-card-row:last-child { border-bottom: none; }
  .org-card-row--prefilled { background: rgba(74,222,128,0.05); }
  .org-card-row--focused { outline: 2px solid var(--day-accent); outline-offset: -2px; }
  .org-card-phase-badge {
    font-size: 7px;
    font-weight: 800;
    color: #fff;
    padding: 3px 7px;
    border-radius: 3px;
    white-space: nowrap;
    align-self: start;
    margin-top: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .org-card-cell {
    font-size: 11px;
    line-height: 1.5;
    padding: 5px 8px;
    border-radius: 4px;
  }
  .org-card-cell--prefilled {
    background: var(--bg-surface);
    color: #4ade80;
    font-style: italic;
  }
  .org-card-cell--hint {
    background: var(--bg-surface);
    color: var(--text-secondary);
  }
  .org-card-cell--blank {
    background: var(--bg-surface);
    color: var(--text-muted);
    font-style: italic;
  }
  ```

- [ ] **Step 6: Verify in browser**
  Navigate to Day 3. Confirm one organizer card appears with 2 rows (I Do green, We Do normal). Navigate to Day 4. Confirm 2 rows (You Do w/ Partner, You Do).

- [ ] **Step 7: Commit**
  ```bash
  git add js/cards.js css/main.css
  git commit -m "feat(organizer): consolidated organizer card — all GR rows in one card"
  ```

---

### Task 4: STOP Elimination MC Mechanic

**Files:**
- Modify: `js/cards.js`
- Modify: `css/main.css`

**Mechanic:**
1. Student sees 4 answer choices. Each has [S] [T] [O] buttons.
2. Student clicks a STOP letter on a choice to mark it as eliminated (grayed, crossed out).
3. Must eliminate exactly 2 choices before the remaining choices unlock for final selection.
4. Student taps their Proven answer (now a clickable choice button).
5. A justification textarea appears: *"Why is this the proven answer? Cite the text."*
6. Student types justification → clicks "Submit" → card shows correct STOP labels.

**State machine:** `'eliminating'` (0–1 eliminations done) → `'selecting'` (2 eliminated, can pick) → `'justifying'` (answer picked, write justification) → `'confirmed'` (submitted).

In **teacher/reveal mode**: all STOP labels visible immediately, no elimination required.

- [ ] **Step 1: Back up `focus.js`** (Task 4 modifies cards.js which was backed up in Task 3; also back up focus.js now for Task 6)
  ```bash
  cp js/focus.js js/focus.js.bak
  ```

- [ ] **Step 2: Replace `buildMcBody` in `cards.js`**

  ```js
  function buildMcBody(data) {
    const optionsHTML = data.options.map((o, idx) => {
      const stopBtns = ['S', 'T', 'O'].map(letter =>
        `<button class="mc-stop-elim-btn" data-stop="${letter}" data-idx="${idx}" title="${stopFullLabel(letter)}">${letter}</button>`
      ).join('');

      return `
        <div class="mc-option-wrap" data-idx="${idx}" data-correct="${o.correct ? 'true' : 'false'}" data-stop-label="${esc(o.stopLabel || '')}">
          <div class="mc-stop-elim-btns">${stopBtns}</div>
          <div class="mc-option-text">
            <span class="mc-letter">${esc(o.letter)}.</span>
            <span class="mc-text">${esc(o.text)}</span>
          </div>
          <span class="mc-stop-badge ${stopLabelClass(o.stopLabel)} mc-stop-badge--hidden">${esc(stopShortLabel(o.stopLabel || ''))}</span>
        </div>`;
    }).join('');

    const writtenHTML = data.writtenPrompt ? `
      <div class="written-model" style="display:none;margin-top:6px;font-size:12px;color:var(--accent);font-style:italic;">${esc(data.writtenModel || '')}</div>` : '';

    return `
      <div class="activity-instruction">👀 Read the question stem carefully. Use CUBES to annotate the stem.</div>
      <p class="bellringer-passage mc-annotatable-stem">${esc(data.stem)}</p>
      <div class="activity-instruction">✂️ Eliminate 2 answer choices using STOP (S=Silly, T=Tricky, O=Opposite), then select the Proven answer.</div>
      <div class="mc-options-list" data-elim-count="0" data-state="eliminating">${optionsHTML}</div>
      <div class="mc-justify-wrap" style="display:none;">
        <div class="activity-instruction">✍️ Why is this the proven answer? Cite the text.</div>
        <textarea class="mc-justify-input" rows="3" placeholder="This is the proven answer because the text says..."></textarea>
        <button class="mc-submit-btn">Submit ✓</button>
      </div>
      ${writtenHTML}`;
  }

  function stopFullLabel(letter) {
    return { S: 'Silly — obviously wrong', T: 'Tricky — partially true', O: 'Opposite — contradicts text' }[letter] || letter;
  }

  function stopShortLabel(label) {
    return { 'Proven':'P — Proven', 'Silly':'S — Silly', 'Tricky':'T — Tricky', 'Opposite':'O — Opposite' }[label] || label;
  }
  ```

- [ ] **Step 3: Add MC interaction wiring in `buildActivityEl`**

  After the focus button wire-up, add:
  ```js
  // Wire STOP elimination mechanic
  el.querySelectorAll('.mc-options-list').forEach(list => wireMcElimination(list));
  ```

  Add `wireMcElimination` function to `cards.js`:
  ```js
  function wireMcElimination(list) {
    function getState() { return list.dataset.state; }
    function setElimCount(n) { list.dataset.elimCount = n; }
    function getElimCount() { return parseInt(list.dataset.elimCount || '0'); }

    // Elimination button clicks
    list.querySelectorAll('.mc-stop-elim-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (getState() !== 'eliminating') return;
        const wrap = btn.closest('.mc-option-wrap');
        if (wrap.classList.contains('mc-option--eliminated')) return; // already eliminated

        // Assign the chosen STOP letter and eliminate
        btn.closest('.mc-stop-elim-btns').querySelectorAll('.mc-stop-elim-btn').forEach(b => b.classList.remove('mc-stop-elim-btn--active'));
        btn.classList.add('mc-stop-elim-btn--active');
        wrap.classList.add('mc-option--eliminated');
        wrap.dataset.assignedStop = btn.dataset.stop;
        setElimCount(getElimCount() + 1);

        if (getElimCount() >= 2) {
          list.dataset.state = 'selecting';
          // Unlock remaining choices
          list.querySelectorAll('.mc-option-wrap:not(.mc-option--eliminated)').forEach(w => {
            w.classList.add('mc-option--selectable');
            w.addEventListener('click', function onSelect() {
              if (list.dataset.state !== 'selecting') return;
              list.dataset.state = 'justifying';
              w.classList.add('mc-option--selected');
              list.querySelectorAll('.mc-option--selectable').forEach(s => s.classList.remove('mc-option--selectable'));
              // Show justification
              const justifyWrap = list.closest('.activity-body').querySelector('.mc-justify-wrap');
              if (justifyWrap) justifyWrap.style.display = '';
              w.removeEventListener('click', onSelect);
            });
          });
        }
      });
    });

    // Submit button
    const submitBtn = list.closest('.activity-body').querySelector('.mc-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', function() {
        if (list.dataset.state !== 'justifying') return;
        list.dataset.state = 'confirmed';
        // Reveal all correct STOP badges
        list.querySelectorAll('.mc-option-wrap').forEach(w => {
          w.querySelector('.mc-stop-badge').classList.remove('mc-stop-badge--hidden');
        });
        // Reveal written model if present
        list.closest('.activity-body').querySelectorAll('.written-model').forEach(m => m.style.display = 'block');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitted ✓';
      });
    }
  }
  ```

- [ ] **Step 4: Update `applyRevealState` to handle teacher reveal mode**

  In the existing `applyRevealState(reveal)` function, add:
  ```js
  // MC reveal: in reveal mode, skip elimination — show all badges
  document.querySelectorAll('.mc-options-list').forEach(list => {
    if (reveal) {
      list.dataset.state = 'confirmed';
      list.querySelectorAll('.mc-stop-badge').forEach(b => b.classList.remove('mc-stop-badge--hidden'));
    }
  });
  ```

- [ ] **Step 5: Add CSS for STOP elimination to `css/main.css`**

  ```css
  /* ── STOP Elimination MC ── */
  .mc-option-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-bottom: 1px solid var(--border);
    border-radius: 0;
    cursor: default;
    transition: background 0.15s, opacity 0.15s;
  }
  .mc-option-wrap:last-child { border-bottom: none; }
  .mc-option-wrap.mc-option--selectable {
    cursor: pointer;
    background: rgba(var(--day-accent-rgb), 0.05);
  }
  .mc-option-wrap.mc-option--selectable:hover {
    background: rgba(var(--day-accent-rgb), 0.12);
  }
  .mc-option-wrap.mc-option--eliminated {
    opacity: 0.38;
  }
  .mc-option-wrap.mc-option--eliminated .mc-option-text {
    text-decoration: line-through;
    color: var(--text-muted);
  }
  .mc-option-wrap.mc-option--selected {
    background: rgba(74,222,128,0.08);
    border-left: 3px solid #4ade80;
  }
  .mc-option-text {
    flex: 1;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.5;
  }
  .mc-letter {
    font-weight: 700;
    color: var(--text-primary);
    margin-right: 4px;
  }
  .mc-stop-elim-btns {
    display: flex;
    gap: 3px;
    flex-shrink: 0;
  }
  .mc-stop-elim-btn {
    font-size: 9px;
    font-weight: 800;
    padding: 2px 5px;
    border-radius: 3px;
    border: 1px solid var(--border);
    background: var(--bg-surface);
    color: var(--text-muted);
    cursor: pointer;
    letter-spacing: 0.5px;
    transition: background 0.1s, color 0.1s;
  }
  .mc-stop-elim-btn:hover { background: var(--bg-card); color: var(--text-primary); }
  .mc-stop-elim-btn--active { background: #7f1d1d; color: #fca5a5; border-color: #7f1d1d; }
  .mc-stop-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 3px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .mc-stop-badge--hidden { visibility: hidden; }
  .stop-proven  { background: rgba(74,222,128,0.15); color: #4ade80; }
  .stop-silly   { background: rgba(239,68,68,0.12);  color: #f87171; }
  .stop-tricky  { background: rgba(245,158,11,0.15); color: #fbbf24; }
  .stop-opposite{ background: rgba(99,102,241,0.15); color: #a5b4fc; }
  .mc-justify-wrap {
    margin-top: 12px;
    padding: 10px 12px;
    background: var(--bg-surface);
    border-radius: 6px;
    border: 1px solid var(--border);
  }
  .mc-justify-input {
    width: 100%;
    background: var(--bg-page);
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-primary);
    font-size: 12px;
    padding: 8px;
    resize: vertical;
    margin-top: 6px;
    font-family: inherit;
  }
  .mc-submit-btn {
    margin-top: 8px;
    padding: 6px 16px;
    background: var(--day-accent);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
  .mc-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .mc-annotatable-stem { cursor: text; user-select: text; }
  ```

- [ ] **Step 6: Remove the old `stopLabelClass` function** if it's now unused, or update it to map to the new badge classes:
  ```js
  function stopLabelClass(label) {
    const map = { 'Proven':'stop-proven', 'Opposite':'stop-opposite', 'Silly':'stop-silly', 'Tricky':'stop-tricky' };
    return map[label] || '';
  }
  ```

- [ ] **Step 7: Verify in browser**
  Open Day 1. Find a bellringer MC card. Verify: [S][T][O] buttons appear on each choice. Click S on choice A → it grays out. Click T on choice C → it grays out. Choices B and D should now be selectable (cursor pointer, slight highlight). Click choice B → justify textarea appears. Type a response → click Submit → STOP badges reveal on all choices.

- [ ] **Step 8: Commit**
  ```bash
  git add js/cards.js css/main.css
  git commit -m "feat(mc): STOP elimination mechanic — eliminate 2, select proven, justify"
  ```

---

## Chunk 3: CUBES Annotation Engine

### Task 5: CUBES Annotation Engine

**Files:**
- Create: `js/cubes.js`
- Modify: `css/main.css`
- Modify: `units/alicogia/index.html`

**How it works:**
- User selects text in a `.cubes-annotatable` element (passage or MC stem)
- A floating CUBES toolbar appears near the selection with buttons: C U B E S
- **C** (Circle): Wraps selection in `<mark class="cubes-c">` — CSS adds oval border
- **U** (Underline): Wraps in `<mark class="cubes-u">` — CSS underlines with accent color
- **B** (Box): Wraps in `<mark class="cubes-b">` — CSS adds rectangular border
- **E** (Exclaim): Inserts a `<span class="cubes-e-marker">!</span>` after the paragraph containing the selection; shows a small inline annotation
- **S** (Star): Inserts a `<div class="cubes-s-note">★ <input></div>` after the paragraph containing the selection
- Annotations stored in `sessionStorage` keyed by `cubes-annots-alicogia` as a JSON array of `{ paraNum, type, text }` objects
- On page load / day switch: restore annotations from sessionStorage

**IMPORTANT:** The passage paragraphs are inside `.passage-para` elements with `<span class="para-num">` at the start. Text selection must only wrap the text nodes, not the paragraph number span.

- [ ] **Step 1: Create `js/cubes.js`**

  ```js
  // js/cubes.js
  // CUBES annotation engine for passage text and MC stems.
  // Depends on: UNIT.meta.id (for sessionStorage key)

  (function() {
    'use strict';

    var STORAGE_KEY = 'cubes-annots-' + ((window.UNIT && UNIT.meta && UNIT.meta.id) || 'unit');
    var toolbarEl = null;
    var activeRange = null;

    // ── Init: called after page renders ──
    function init() {
      toolbarEl = createToolbar();
      document.body.appendChild(toolbarEl);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onMouseUp);
      document.addEventListener('mousedown', onMouseDown);
      restoreAnnotations();
    }

    // ── Toolbar ──
    function createToolbar() {
      var el = document.createElement('div');
      el.className = 'cubes-toolbar';
      el.style.display = 'none';
      el.innerHTML =
        '<button class="cubes-btn" data-cubes="C" title="Circle — unknown word">C</button>' +
        '<button class="cubes-btn" data-cubes="U" title="Underline — key phrase">U</button>' +
        '<button class="cubes-btn" data-cubes="B" title="Box — turning point">B</button>' +
        '<button class="cubes-btn" data-cubes="E" title="Exclamation — surprising detail">!</button>' +
        '<button class="cubes-btn" data-cubes="S" title="Star — reveals theme">★</button>' +
        '<button class="cubes-btn cubes-btn--clear" data-cubes="clear" title="Clear annotation">✕</button>';
      el.querySelectorAll('[data-cubes]').forEach(function(btn) {
        btn.addEventListener('mousedown', function(e) {
          e.preventDefault(); // prevent selection loss
          applyAnnotation(btn.dataset.cubes);
        });
      });
      return el;
    }

    function showToolbar(x, y) {
      toolbarEl.style.display = 'flex';
      // Keep toolbar within viewport
      var tbW = toolbarEl.offsetWidth || 200;
      var left = Math.min(x, window.innerWidth - tbW - 10);
      toolbarEl.style.left = Math.max(left, 10) + 'px';
      toolbarEl.style.top  = (y - 44) + 'px';
    }

    function hideToolbar() {
      toolbarEl.style.display = 'none';
      activeRange = null;
    }

    // ── Selection handling ──
    function onMouseUp(e) {
      // Give the browser a tick to finalize the selection
      setTimeout(function() {
        var sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          return;
        }
        var range = sel.getRangeAt(0);
        var container = range.commonAncestorContainer;
        var annotatable = findAnnotatable(container);
        if (!annotatable) { hideToolbar(); return; }

        activeRange = range.cloneRange();
        var rect = range.getBoundingClientRect();
        showToolbar(rect.left + window.scrollX + rect.width / 2 - 80, rect.top + window.scrollY);
      }, 10);
    }

    function onMouseDown(e) {
      if (e.target.closest('.cubes-toolbar')) return;
      hideToolbar();
    }

    function findAnnotatable(node) {
      var el = node.nodeType === 3 ? node.parentElement : node;
      return el.closest('.cubes-annotatable');
    }

    // ── Apply annotation ──
    function applyAnnotation(type) {
      if (!activeRange) return;
      var sel = window.getSelection();

      if (type === 'clear') {
        // Find any cubes <mark> that contains or overlaps the current selection (activeRange).
        // Walk up from the range's start container to find a mark to unwrap.
        if (activeRange) {
          var node = activeRange.startContainer;
          var el = node.nodeType === 3 ? node.parentElement : node;
          var mark = el.closest('mark.cubes-c, mark.cubes-u, mark.cubes-b');
          if (mark) {
            var parent = mark.parentNode;
            while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
            parent.removeChild(mark);
          }
        }
        hideToolbar();
        saveAnnotations();
        return;
      }

      if (type === 'C' || type === 'U' || type === 'B') {
        // Inline wrap: surround selection with a <mark class="cubes-X">
        var mark = document.createElement('mark');
        mark.className = 'cubes-' + type.toLowerCase();
        try {
          activeRange.surroundContents(mark);
        } catch(ex) {
          // Selection spans multiple nodes — use extractContents
          mark.appendChild(activeRange.extractContents());
          activeRange.insertNode(mark);
        }
        if (sel) sel.removeAllRanges();
      } else if (type === 'E' || type === 'S') {
        // Paragraph-level annotation: insert marker at end of the containing .passage-para
        var paraEl = findParagraph(activeRange.commonAncestorContainer);
        if (paraEl) {
          if (type === 'E') {
            insertExclamation(paraEl);
          } else {
            insertStar(paraEl);
          }
        }
        if (sel) sel.removeAllRanges();
      }

      hideToolbar();
      saveAnnotations();
    }

    function findParagraph(node) {
      var el = node.nodeType === 3 ? node.parentElement : node;
      return el.closest('.passage-para');
    }

    function insertExclamation(paraEl) {
      // Avoid duplicate
      if (paraEl.querySelector('.cubes-e-marker')) return;
      var marker = document.createElement('span');
      marker.className = 'cubes-e-marker';
      marker.textContent = ' !';
      paraEl.appendChild(marker);
      // Also add a small annotation note after the para
      var note = document.createElement('div');
      note.className = 'cubes-e-note';
      note.innerHTML = '<span class="cubes-note-label">!</span><input class="cubes-note-input" placeholder="Note about surprising detail…" />';
      paraEl.parentNode.insertBefore(note, paraEl.nextSibling);
      note.querySelector('.cubes-note-input').addEventListener('change', saveAnnotations);
    }

    function insertStar(paraEl) {
      if (paraEl.querySelector('.cubes-s-marker')) return;
      var marker = document.createElement('span');
      marker.className = 'cubes-s-marker';
      marker.textContent = ' ★';
      paraEl.appendChild(marker);
      var note = document.createElement('div');
      note.className = 'cubes-s-note';
      note.innerHTML = '<span class="cubes-note-label">★</span><input class="cubes-note-input" placeholder="Theme/summary note…" />';
      paraEl.parentNode.insertBefore(note, paraEl.nextSibling);
      note.querySelector('.cubes-note-input').addEventListener('change', saveAnnotations);
    }

    // ── sessionStorage persistence ──
    // Saves: passage innerHTML + all MC stem annotations (keyed by activity id)
    function saveAnnotations() {
      var passageEl = document.getElementById('passage-text');
      if (passageEl) {
        try { sessionStorage.setItem(STORAGE_KEY + '-passage', passageEl.innerHTML); } catch(e) {}
      }
      // Save MC stem annotations
      document.querySelectorAll('[data-activity-id]').forEach(function(card) {
        var stem = card.querySelector('.mc-annotatable-stem');
        if (stem) {
          var id = card.dataset.activityId;
          try { sessionStorage.setItem(STORAGE_KEY + '-stem-' + id, stem.innerHTML); } catch(e) {}
        }
      });
    }

    function restoreAnnotations() {
      // Restore passage — only if #passage-text exists in the current DOM
      var passageEl = document.getElementById('passage-text');
      if (passageEl) {
        var savedPassage = sessionStorage.getItem(STORAGE_KEY + '-passage');
        if (savedPassage) {
          passageEl.innerHTML = savedPassage;
          passageEl.querySelectorAll('.cubes-note-input').forEach(function(inp) {
            inp.addEventListener('change', saveAnnotations);
          });
        }
      }
      // Restore MC stem annotations
      document.querySelectorAll('[data-activity-id]').forEach(function(card) {
        var stem = card.querySelector('.mc-annotatable-stem');
        if (stem) {
          var id = card.dataset.activityId;
          var savedStem = sessionStorage.getItem(STORAGE_KEY + '-stem-' + id);
          if (savedStem) stem.innerHTML = savedStem;
        }
      });
    }

    // ── Expose clear function for Reset button (optional) ──
    window.clearCubesAnnotations = function() {
      sessionStorage.removeItem(STORAGE_KEY);
      var passageEl = document.getElementById('passage-text');
      if (passageEl) {
        // Rebuild from UNIT.passage
        passageEl.innerHTML = (UNIT.passage || []).map(function(p) {
          return '<p class="passage-para"><span class="para-num">[' + p.number + ']</span>' + esc(p.text) + '</p>';
        }).join('');
      }
    };

    // ── Auto-init when DOM is ready ──
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // Wrap renderDayContent (defined in cards.js) so annotations restore after every day switch.
    // Load order: cubes.js loads after cards.js, so window.renderDayContent is already defined here.
    var _origRender = window.renderDayContent;
    window.renderDayContent = function(day) {
      if (_origRender) _origRender(day);
      // Use requestAnimationFrame (not setTimeout) to guarantee the DOM is painted before restore.
      // cards.js uses double-rAF for its own fade — we use a single rAF here, which runs after
      // the render rAF queued inside renderDayContent completes.
      requestAnimationFrame(function() {
        requestAnimationFrame(restoreAnnotations);
      });
    };

  })();
  ```

  **Note:** `esc()` from cards.js is already global — available to cubes.js. Load order: cubes.js loads after cards.js.

- [ ] **Step 2: Add `cubes-annotatable` class to passage element in `buildPassageAnnotationBody`**

  In `cards.js`, find `buildPassageAnnotationBody` and change:
  ```js
  return `
    <div class="activity-instruction">👀 Read and annotate the passage</div>
    <div id="passage-text" class="cubes-annotatable">${parasHTML}</div>
    ...`
  ```
  (add `class="cubes-annotatable"` to the `#passage-text` div)

  Also add `.cubes-annotatable` to the MC stem in `buildMcBody`. The stem paragraph already has class `mc-annotatable-stem` — add `cubes-annotatable` to it:
  ```js
  <p class="bellringer-passage mc-annotatable-stem cubes-annotatable">${esc(data.stem)}</p>
  ```

- [ ] **Step 3: Add `<script>` to `units/alicogia/index.html`**

  The current script order ends with `engage.js`. Add `cubes.js` as the **last** script, after `engage.js`:
  ```html
  <script src="../../js/engage.js"></script>
  <script src="../../js/cubes.js"></script>   <!-- ADD THIS LINE -->
  </body>
  ```
  **Why last:** `cubes.js` wraps `window.renderDayContent` (defined in `cards.js`) and uses `esc()` (also `cards.js`). Loading last guarantees both are defined. `cubes.js` is an IIFE that captures `_origRender = window.renderDayContent` at parse time — if `cards.js` hasn't run yet, this silently breaks. Loading after `engage.js` prevents this.

- [ ] **Step 4: Add CSS for CUBES annotations to `css/main.css`**

  ```css
  /* ── CUBES Annotation Engine ── */
  .cubes-toolbar {
    position: absolute;
    z-index: 9500;
    display: flex;
    gap: 4px;
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 5px 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    pointer-events: all;
  }
  .cubes-btn {
    font-size: 11px;
    font-weight: 800;
    width: 26px;
    height: 26px;
    border-radius: 4px;
    border: 1px solid #334155;
    background: #0f172a;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.1s, color 0.1s;
  }
  .cubes-btn:hover { background: #1e293b; color: #f1f5f9; }
  .cubes-btn[data-cubes="C"]     { color: #fbbf24; } /* yellow — circle */
  .cubes-btn[data-cubes="U"]     { color: #60a5fa; } /* blue — underline */
  .cubes-btn[data-cubes="B"]     { color: #34d399; } /* green — box */
  .cubes-btn[data-cubes="E"]     { color: #fb923c; } /* orange — exclaim */
  .cubes-btn[data-cubes="S"]     { color: #c084fc; } /* purple — star */
  .cubes-btn--clear              { color: #f87171; }

  /* Inline annotation marks */
  mark.cubes-c {
    background: transparent;
    border: 2px solid #fbbf24;
    border-radius: 50%;          /* oval circle effect */
    padding: 0 3px;
    color: inherit;
  }
  mark.cubes-u {
    background: transparent;
    text-decoration: underline;
    text-decoration-color: #60a5fa;
    text-decoration-thickness: 2px;
    color: inherit;
  }
  mark.cubes-b {
    background: transparent;
    border: 2px solid #34d399;
    border-radius: 3px;
    padding: 0 2px;
    color: inherit;
  }

  /* Paragraph-level markers */
  .cubes-e-marker { color: #fb923c; font-weight: 800; font-size: 13px; }
  .cubes-s-marker { color: #c084fc; font-weight: 800; font-size: 13px; }

  /* Annotation note rows */
  .cubes-e-note,
  .cubes-s-note {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px 4px 14px;
    margin: -2px 0 4px;
    background: rgba(255,255,255,0.02);
    border-left: 3px solid transparent;
    border-radius: 0 4px 4px 0;
  }
  .cubes-e-note { border-left-color: #fb923c; }
  .cubes-s-note { border-left-color: #c084fc; }
  .cubes-note-label {
    font-size: 12px;
    font-weight: 800;
    flex-shrink: 0;
  }
  .cubes-e-note .cubes-note-label { color: #fb923c; }
  .cubes-s-note .cubes-note-label { color: #c084fc; }
  .cubes-note-input {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px dashed #334155;
    color: var(--text-secondary);
    font-size: 11px;
    font-style: italic;
    padding: 2px 4px;
    outline: none;
    font-family: inherit;
  }
  .cubes-note-input::placeholder { color: var(--text-muted); }
  ```

- [ ] **Step 5: Verify in browser**
  Navigate to Day 1. The passage card should appear. Select a word in the passage → CUBES toolbar appears. Click C → word gets yellow oval border. Select a phrase → click U → blue underline appears. Click E on a paragraph area → `!` marker and note input appear after that paragraph. Click S → `★` marker and input appear.

  Test MC stem: select text in a bellringer question stem → toolbar appears → click B → green box appears around text.

- [ ] **Step 6: Commit**
  ```bash
  git add js/cubes.js css/main.css units/alicogia/index.html
  git commit -m "feat(cubes): CUBES annotation engine — circle/underline/box/exclaim/star on passage and MC stems"
  ```

---

## Chunk 4: Focus Mode Updates

### Task 6: Update focus.js — New Step Defs

**Files:**
- Modify: `js/focus.js`

**What changes:**
1. Add `'organizer'` to `STEPS` — step through each row in the day's organizer card
2. Update `passage-annotation` steps — no longer references ¶1–3 / ¶4–6 chunks (all 18 paragraphs always present); simplified to: Read → CUBES Guide → Annotate
3. Update MC steps for STOP elimination — step 2 is now "Eliminate 2 Choices" (show S/T/O buttons), step 3 is "Select Proven" (unlock choices)
4. Update `STEP_ANCHORS` to match
5. Update `getStepDefs` to handle `'organizer'` type

- [ ] **Step 1: Update `STEPS` in `focus.js`**

  Replace the `passage-annotation` entry:
  ```js
  'passage-annotation': [
    { label: 'Read',        action: stepPassageRead   },
    { label: 'CUBES Guide', action: stepPassageCubes  },
    { label: 'Annotate',    action: stepPassageAnnotate }
  ],
  ```

  Replace the `mc` entry:
  ```js
  'mc': [
    { label: 'Read Stem',      action: stepMcRead      },
    { label: 'CUBES Stem',     action: stepMcCubes     },
    { label: 'Eliminate 2',    action: stepMcEliminate },
    { label: 'Select Proven',  action: stepMcSelect    },
    { label: 'Justify',        action: stepMcJustify   }
  ],
  ```

  Add `'organizer'` — steps are dynamic (built per row count), so use a sentinel:
  ```js
  'organizer': 'dynamic',  // handled by getStepDefs
  ```

- [ ] **Step 2: Update `STEP_DOT_COUNTS` mirroring in `focus.js`** — `passage-annotation` now 3 steps, `mc` now 5 steps

  Update `STEP_ANCHORS`:
  ```js
  'mc': ['Read the Stem', 'Annotate with CUBES', 'Eliminate 2 Choices', 'Select Your Answer', 'Justify Your Choice'],
  'passage-annotation': ['Read the Passage', 'Review CUBES Guide', 'Annotate the Passage'],
  'organizer': [], // built dynamically
  ```

- [ ] **Step 3: Update `getStepDefs` to handle `'organizer'`**

  ```js
  function getStepDefs(el, type) {
    if (!type) return [{ label: 'View', action: function() {} }];
    if (type === 'organizer-row') {
      var grClass = Array.from(el.classList).find(function(c) {
        return ['activity--i-do','activity--we-do','activity--you-do-partner','activity--you-do'].includes(c);
      });
      var grKey = grClass ? grClass.replace('activity--', '') : 'we-do';
      return STEPS['organizer-row-' + grKey] || STEPS['organizer-row-we-do'];
    }
    if (type === 'organizer') {
      return buildOrganizerSteps(el);
    }
    return STEPS[type] || [{ label: 'View', action: function() {} }];
  }

  function buildOrganizerSteps(el) {
    var rows = el.querySelectorAll('.org-card-row');
    var steps = [];
    rows.forEach(function(row, i) {
      var badge = row.querySelector('.org-card-phase-badge');
      var label = badge ? badge.textContent.trim() : ('Row ' + (i + 1));
      steps.push({
        label: label,
        action: function(actEl, stepIdx) { stepOrgRow(actEl, stepIdx); }
      });
    });
    // Final confirm step
    steps.push({ label: 'Confirm', action: stepOrgRowConfirm });
    return steps;
  }
  ```

- [ ] **Step 4: Add new step action functions**

  ```js
  // Organizer row focus — highlight the current row
  function stepOrgRow(el, stepIdx) {
    el.querySelectorAll('.org-card-row').forEach(function(row, i) {
      row.classList.toggle('org-card-row--focused', i === stepIdx);
    });
  }
  function stepOrgRowConfirm(el) {
    el.querySelectorAll('.org-card-row').forEach(function(row) {
      row.classList.remove('org-card-row--focused');
    });
    el.querySelectorAll('.org-card-cell--prefilled').forEach(function(c) {
      c.style.opacity = '1';
    });
  }

  // Updated passage steps (3 steps)
  function stepPassageRead(el) {
    el.querySelectorAll('.cubes-guide').forEach(function(g) { g.style.display = 'none'; });
  }
  // stepPassageCubes already exists — shows .cubes-guide
  // stepPassageAnnotate already exists — opens drawer tab (keep as-is but note drawer may be removed later)

  // New MC step actions
  function stepMcCubes(el) {
    // Highlight the stem — prompt student to annotate with CUBES
    el.querySelectorAll('.mc-annotatable-stem').forEach(function(s) {
      s.style.outline = '2px dashed var(--day-accent)';
      s.style.outlineOffset = '4px';
    });
  }
  function stepMcEliminate(el) {
    // Remove stem highlight, enable S/T/O buttons
    el.querySelectorAll('.mc-annotatable-stem').forEach(function(s) { s.style.outline = ''; });
    el.querySelectorAll('.mc-stop-elim-btn').forEach(function(b) { b.style.opacity = '1'; });
  }
  function stepMcSelect(el) {
    // Show which choices are currently selectable (after 2 eliminated)
    var list = el.querySelector('.mc-options-list');
    if (list && list.dataset.state === 'eliminating') {
      // If student hasn't eliminated 2 yet, prompt them
      var instruction = el.querySelector('.activity-instruction:last-of-type');
      if (instruction) instruction.style.color = '#fbbf24';
    }
  }
  function stepMcJustify(el) {
    // Only show justify box if student has already selected a Proven answer.
    // The state machine in wireMcElimination sets list.dataset.state = 'justifying' after selection.
    var list = el.querySelector('.mc-options-list');
    var state = list ? list.dataset.state : '';
    var justWrap = el.querySelector('.mc-justify-wrap');
    if (justWrap && (state === 'justifying' || state === 'confirmed')) {
      justWrap.style.display = '';
      var inp = justWrap.querySelector('.mc-justify-input');
      if (inp && state === 'justifying') inp.focus();
    } else if (justWrap) {
      // Student hasn't selected yet — prompt them to complete the elimination first
      var instruction = el.querySelector('.activity-instruction');
      if (instruction) {
        instruction.style.color = '#fbbf24';
        instruction.textContent = '⚠️ Eliminate 2 choices and select your Proven answer first.';
      }
    }
  }
  ```

  **Note:** Replace the OLD `stepMcRead`, `stepMcStrategy`, `stepMcInteract`, `stepMcConfirm` functions with `stepMcRead` (keep existing — hides stop labels) and the new functions above. Update `stepMcRead` to be compatible with the new markup (no `.mc-stop-label` elements — they're now `.mc-stop-badge`):
  ```js
  function stepMcRead(el) {
    el.querySelectorAll('.mc-stop-badge').forEach(function(l) { l.classList.add('mc-stop-badge--hidden'); });
    el.querySelectorAll('.mc-option-wrap').forEach(function(b) { b.classList.remove('mc-option--selected'); });
  }
  ```

- [ ] **Step 5: Update `STEP_DOT_COUNTS` mirror in `cards.js`** to match new step counts

  ```js
  'mc':                  5,   // was 4
  'passage-annotation':  3,   // was 4
  'organizer':           3,   // default — actual count is dynamic (rows + 1)
  ```

  Update `getStepDotCount` to handle `organizer` dynamically (already done in Task 3 Step 1).

- [ ] **Step 6: Update `STEP_ANCHORS` in `focus.js`** for `organizer`

  In `enterFocusMode`, after `stepDefs = getStepDefs(activityEl, type)`, build the organizer anchor list dynamically:
  ```js
  if (type === 'organizer') {
    var rows = activityEl.querySelectorAll('.org-card-row');
    var dynamicAnchors = [];
    rows.forEach(function(row) {
      var badge = row.querySelector('.org-card-phase-badge');
      dynamicAnchors.push(badge ? badge.textContent.trim() : 'Current Row');
    });
    dynamicAnchors.push('Confirm Your Responses');
    STEP_ANCHORS['organizer'] = dynamicAnchors;
  }
  ```

- [ ] **Step 7: Verify in browser**
  Enter Focus Mode on the organizer card (Day 3). Step 1 should highlight the I Do row. Step 2 highlights We Do row. Step 3 is Confirm. The anchor text should update per row.

  Enter Focus Mode on a bellringer MC. Steps: Read Stem → Annotate with CUBES → Eliminate 2 → Select Your Answer → Justify.

- [ ] **Step 8: Commit**
  ```bash
  git add js/focus.js js/cards.js
  git commit -m "feat(focus): update step defs — organizer row steps, 5-step MC, 3-step passage"
  ```

---

## Verification Checklist

Before calling this plan complete, verify the following in browser:

- [ ] `UNIT.passage.length === 18` in DevTools console
- [ ] Day 1: passage card (all 18 ¶), 2 bellringer MC, 4 comprehension MC, 3 vocab cards
- [ ] Day 2: passage card, 2 bellringer MC, 4 comprehension MC, 3 vocab cards
- [ ] Day 3: passage card, 2 bellringer MC, organizer card (2 rows: I Do + We Do), 3 vocab
- [ ] Day 4: passage card, 2 bellringer MC, organizer card (2 rows: You Do w/ Partner + You Do), 3 vocab
- [ ] Day 5: passage card, 2 bellringer MC, 4–5 assessment MC, 3 vocab
- [ ] Day 6: passage card, 2 bellringer MC, written response, 3 vocab
- [ ] STOP elimination: clicking S/T/O eliminates and grays a choice; after 2 eliminated, remaining choices become clickable; selecting one shows justification textarea; submit reveals STOP badges
- [ ] CUBES annotation: select text in passage → toolbar appears → C wraps in oval circle → U underlines blue → B boxes green → E adds `!` marker and note input → S adds `★` and summary input
- [ ] CUBES on MC stem: select text in bellringer question stem → toolbar appears → markup applies
- [ ] Organizer Focus Mode: steps through rows one at a time, highlighting the active row
- [ ] Annotations persist across day switches (sessionStorage)
