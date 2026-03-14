# Phase B — Units Batch Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate all 23 stub unit folders so every home page card links to a live page instead of a dead link.

**Architecture:** A Node.js generator script reads `units-registry.js`, iterates over all non-alicogia entries, and writes `units/{id}/index.html` + `units/{id}/data.js` for each. Then `cards.js` gets a coming-soon detection branch so stub pages render a clean placeholder instead of crashing. All 23 stubs use the Phase A `units/alicogia/index.html` as a template shell.

**Tech Stack:** Node.js (for generator script, run once, not committed to production). Output is static HTML/JS files. No test runner — verification is browser-based.

**Prerequisite:** Phase A must be complete. The `units/alicogia/index.html` shell copied into stubs should already have the EdTech default and 6 theme buttons.

**Spec:** `docs/superpowers/specs/2026-03-12-ir-platform-upgrade-design.md` — Phase B section

---

## File Structure

| File | Change |
|------|--------|
| `scripts/generate-stubs.js` | New — one-time generator script |
| `units/{id}/index.html` | 23 new files (generated) |
| `units/{id}/data.js` | 23 new files (generated) |
| `js/cards.js` | Add coming-soon detection + placeholder render (~20 lines) |

---

## Chunk 1: Coming-Soon Detection in cards.js

### Task 1: Add coming-soon handling to js/cards.js

This must be done BEFORE running the generator, so stub pages don't crash when cards.js tries to render real content from empty data.

**Files:**
- Modify: `js/cards.js`

- [ ] **Step 1: Find the `renderDayContent` function in `js/cards.js`.** It starts at approximately line 10 (search for `function renderDayContent`).

- [ ] **Step 2: Add a coming-soon early-return at the top of `renderDayContent`:**

Find:
```js
function renderDayContent(day) {
```

Replace with:
```js
function renderDayContent(day) {
  if (typeof UNIT !== 'undefined' && UNIT.meta.status === 'coming-soon') {
    const grid = document.getElementById('content-grid');
    if (grid) grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 24px;">
        <div style="font-size:48px;margin-bottom:16px;">📚</div>
        <div style="font-size:20px;font-weight:800;color:var(--text-primary);margin-bottom:8px;">${esc(UNIT.meta.title)}</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">${esc(UNIT.meta.benchmark)} — ${esc(UNIT.meta.benchmarkLabel)}</div>
        <div style="font-size:14px;color:var(--text-secondary);background:var(--accent-light);border:1px solid var(--accent-border);padding:12px 24px;border-radius:8px;display:inline-block;">Content coming soon</div>
      </div>`;
    return;
  }
```

- [ ] **Step 3: In `js/nav.js`, find where day tabs are built.** The tabs loop builds one tab per day. Add a guard so tabs still render for coming-soon units — but the content shows the placeholder on every day. No change needed to the tab loop itself since it reads `UNIT.meta.days` correctly.

- [ ] **Step 4: Verify coming-soon works manually**
  - Temporarily edit `units/alicogia/data.js`: change `status: 'live'` to `status: 'coming-soon'`
  - Open `units/alicogia/index.html` in browser
  - Should show the centered placeholder card instead of day content
  - Revert the change to `units/alicogia/data.js`

- [ ] **Step 5: Commit**
```bash
git add js/cards.js
git commit -m "feat: add coming-soon placeholder render to cards.js"
```

---

## Chunk 2: Generator Script + Stub Generation

### Task 2: Write and run the stub generator

**Files:**
- Create: `scripts/generate-stubs.js`
- Create: `units/{id}/index.html` (23 files via script)
- Create: `units/{id}/data.js` (23 files via script)

- [ ] **Step 1: Check that Node.js is available**
```bash
node --version
# Expected: v18.x.x or higher
```

- [ ] **Step 2: Create the `scripts/` directory**
```bash
mkdir -p /Users/alexanderburger/Desktop/ir-platform/scripts
```

- [ ] **Step 3: Read the current `units-registry.js` to get the full list of units.** The file defines `window.UNITS_REGISTRY` — the generator script needs to parse it. The easiest approach: copy the array into the script directly as a JS constant.

- [ ] **Step 4: Create `scripts/generate-stubs.js` with the following content:**

```js
#!/usr/bin/env node
// Run from ir-platform root: node scripts/generate-stubs.js
// Generates stub index.html + data.js for all coming-soon units.

const fs = require('fs');
const path = require('path');

// Read registry (strip window.UNITS_REGISTRY = assignment)
const registrySource = fs.readFileSync('units-registry.js', 'utf8');
const registryJSON = registrySource
  .replace(/^window\.UNITS_REGISTRY\s*=\s*/, '')
  .replace(/;\s*$/, '');
const registry = eval('(' + registryJSON + ')'); // safe: local file

// Read alicogia index.html as shell template
const shellTemplate = fs.readFileSync('units/alicogia/index.html', 'utf8');

const stubs = registry.filter(u => u.status === 'coming-soon');
console.log(`Generating ${stubs.length} stub units...`);

stubs.forEach(unit => {
  const dir = path.join('units', unit.id);
  fs.mkdirSync(dir, { recursive: true });

  // ── index.html ──
  // Replace alicogia-specific title and data.js reference — everything else is identical
  const html = shellTemplate
    .replace(/<title>Ali Cogia.*?<\/title>/, `<title>${unit.title} · IR Platform</title>`)
    .replace(/data-theme="warm" /, '')  // remove any lingering warm refs
    ;
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  // ── data.js ──
  const days = unit.days || 6;
  const daysObj = Array.from({ length: days }, (_, i) => i + 1)
    .map(d => `    ${d}: { label: 'Day ${d}', progressItems: [], pacingGuide: {}, exitTicket: null, engageActivities: [] }`)
    .join(',\n');

  const dataJs = `const UNIT = {
  meta: {
    id: ${JSON.stringify(unit.id)},
    title: ${JSON.stringify(unit.title)},
    benchmark: ${JSON.stringify(unit.benchmark)},
    benchmarkLabel: ${JSON.stringify(unit.benchmarkLabel)},
    benchmarkDescription: '',
    days: ${days},
    status: 'coming-soon'
  },
  days: {
${daysObj}
  },
  assessment: {
    achievementLevels: []
  },
  downloads: []
};

if (typeof module !== 'undefined') module.exports = UNIT;
`;
  fs.writeFileSync(path.join(dir, 'data.js'), dataJs);

  console.log(`  ✓ units/${unit.id}/`);
});

console.log(`Done. ${stubs.length} stubs generated.`);
```

- [ ] **Step 5: Run the generator from the ir-platform root**
```bash
cd /Users/alexanderburger/Desktop/ir-platform
node scripts/generate-stubs.js
```
Expected output:
```
Generating 23 stub units...
  ✓ units/shakuntala/
  ✓ units/bloomers/
  ... (21 more)
Done. 23 stubs generated.
```

- [ ] **Step 6: Verify the output**
```bash
ls units/ | wc -l
# Expected: 24 (alicogia + 23 stubs)

ls units/shakuntala/
# Expected: data.js  index.html

head -15 units/shakuntala/data.js
# Expected: UNIT meta with id: "shakuntala", status: "coming-soon"
```

- [ ] **Step 7: Open a stub page in browser**
  - Open `units/shakuntala/index.html` in browser
  - Should show: unit title, benchmark, "Content coming soon" centered placeholder
  - All 6 themes should work via theme switcher
  - Timer should work
  - No console errors

- [ ] **Step 8: Verify home page links work**
  - Open `index.html` in browser
  - Click any coming-soon unit card — should navigate to stub page (not 404)

- [ ] **Step 9: Update `units-registry.js`** to add `days` field for any units that are 4-day test prep units. Check the registry and ensure Shakuntala, Bloomers, and MathInnovations have `days: 4`. All others default to `days: 6`. The generator already reads this field.

- [ ] **Step 10: Commit**
```bash
git add units/ scripts/generate-stubs.js js/cards.js units-registry.js
git commit -m "feat: generate 23 stub unit pages with coming-soon placeholders"
```

- [ ] **Step 11: Push**
```bash
git push origin main
```

- [ ] **Step 12: Verify on GitHub Pages**
  - All 24 unit cards on home page link to real pages (no 404s)
  - Coming-soon stubs show placeholder content
