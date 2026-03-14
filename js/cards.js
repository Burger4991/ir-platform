// js/cards.js
// Renders the activity sequence for a given day using UNIT.days[day]
// Depends on: js/activities.js (buildActivities), UNIT global, window.currentEsolLevel

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Session state: track which activities are done this session ──
window.doneActivityIds = new Set();

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

  if (typeof UNIT === 'undefined' || !UNIT.days) { grid.innerHTML = ''; return; }
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
  updateDayProgress(day);
  applyRevealState(document.body.classList.contains('reveal-answers'));
  applyTeacherView(!document.body.classList.contains('student-view'));
  if (typeof updateProgressPanel === 'function') updateProgressPanel(day);
}

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

// ── Type strip labels (H1) ──
const ACTIVITY_TYPE_LABELS = {
  'mc':                 '📝 Multiple Choice',
  'vocabulary':         '📖 Vocabulary',
  'written-response':   '✍️ Written Response',
  'organizer-row':      '🗂 Organizer',
  'organizer':          '🗂 Graphic Organizer',
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
  'organizer':                     3,
  'passage-annotation':            4
};
function getStepDotCount(type, grPhase, data) {
  if (type === 'organizer') {
    // 1 step per row + 1 confirm step
    return data && data.rows ? data.rows.length + 1 : 3;
  }
  if (type === 'organizer-row') return STEP_DOT_COUNTS['organizer-row-' + grPhase] || 3;
  return STEP_DOT_COUNTS[type] || 1;
}

// ── Activity element builder ──
function buildActivityEl(activity) {
  const el = document.createElement('div');
  el.className = `activity activity--${activity.type} activity--${activity.grPhase}`;
  el.dataset.activityId = activity.id;

  const badgeHTML = `<span class="activity-gr-badge gr-${esc(activity.grPhase)}">${esc(grPhaseLabel(activity.grPhase))}</span>`;
  const stratBadges = activity.strategies.map(s =>
    `<span class="activity-strategy-badge badge-${s}">${s.toUpperCase()}</span>`
  ).join('');

  const typeLabel = ACTIVITY_TYPE_LABELS[activity.type] || activity.type;
  const dotCount = getStepDotCount(activity.type, activity.grPhase, activity.data);
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

  // Wire focus button
  el.querySelector('.activity-focus-btn').addEventListener('click', () => {
    if (typeof enterFocusMode === 'function') enterFocusMode(activity.id);
  });

  // Wire STOP elimination mechanic on all MC option lists in this card
  el.querySelectorAll('.mc-options-list').forEach(list => wireMcElimination(list));

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
    case 'organizer':         return buildOrganizerBody(activity.data);
    case 'vocabulary':        return buildVocabBody(activity.data);
    case 'written-response':  return buildWrittenResponseBody(activity.data);
    case 'passage-annotation':return buildPassageAnnotationBody(activity.data);
    default: return `<p style="color:var(--text-muted)">Unknown activity type: ${esc(activity.type)}</p>`;
  }
}

// ── MC ──
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
    <div class="activity-instruction">👀 Read the question stem carefully. Use CUBES to annotate.</div>
    <p class="bellringer-passage mc-annotatable-stem cubes-annotatable">${esc(data.stem)}</p>
    <div class="activity-instruction">✂️ Eliminate 2 answer choices (S=Silly, T=Tricky, O=Opposite), then select the Proven answer.</div>
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
  return { 'Proven':'P — Proven', 'Silly':'S — Silly', 'Tricky':'T — Tricky', 'Opposite':'O — Opposite' }[label] || '';
}

function stopLabelClass(label) {
  const map = { 'Proven':'stop-proven', 'Opposite':'stop-opposite', 'Silly':'stop-silly', 'Tricky':'stop-tricky' };
  return map[label] || '';
}

function wireMcElimination(list) {
  if (list.dataset.wired === 'true') return;
  list.dataset.wired = 'true';

  function getState()      { return list.dataset.state; }
  function setElimCount(n) { list.dataset.elimCount = n; }
  function getElimCount()  { return parseInt(list.dataset.elimCount || '0'); }

  // Elimination button clicks
  list.querySelectorAll('.mc-stop-elim-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (getState() !== 'eliminating') return;
      const wrap = btn.closest('.mc-option-wrap');
      if (wrap.classList.contains('mc-option--eliminated')) return; // already eliminated

      // Mark the chosen STOP letter active
      btn.closest('.mc-stop-elim-btns').querySelectorAll('.mc-stop-elim-btn').forEach(b => b.classList.remove('mc-stop-elim-btn--active'));
      btn.classList.add('mc-stop-elim-btn--active');
      wrap.classList.add('mc-option--eliminated');
      wrap.dataset.assignedStop = btn.dataset.stop;
      setElimCount(getElimCount() + 1);

      if (getElimCount() >= 2) {
        list.dataset.state = 'selecting';
        // Unlock remaining (non-eliminated) choices
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
    <div class="activity-instruction">✏️ Fill in your row</div>
    <div class="activity-org-row">
      <div class="org-cell-badge" style="background:${esc(color)}">${esc(data.label)}</div>
      ${cellsHTML}
    </div>`;
}

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
      if (isDone) {
        // Pre-filled row: always use prefilled class, show content or leave blank
        return `<div class="org-card-cell org-card-cell--prefilled">${esc(content)}</div>`;
      }
      // Non-prefilled: first column shows the element label as a hint
      if (ci === 0 && content) {
        return `<div class="org-card-cell org-card-cell--hint">${esc(content)}</div>`;
      }
      // Non-prefilled: remaining columns are student workspace
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
    <div class="activity-instruction">📖 Use the passage to analyze ${esc(data.benchmarkFocus)}</div>
    <div class="org-card-table">
      <div class="org-card-header">
        <div></div>
        ${colHeaders}
      </div>
      ${rowsHTML}
    </div>`;
}

// ── Vocabulary ──
// NOTE: class names (vocab-word, vocab-def, vocab-example, vocab-esol-frame) are required by
// focus.js stepVocabWord/stepVocabDef/stepVocabFrame for progressive reveal via querySelectorAll.
function buildVocabBody(data) {
  const level = window.currentEsolLevel;  // null when ESOL is off
  const esol = data.esolFrames;
  let esolHTML = '';
  if (esol && level) {  // only render ESOL block when a level is active
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

  return `
    <div class="activity-instruction">👀 Read the word and definition</div>
    <div class="vocab-word" style="font-size:20px;font-weight:800;color:var(--text-primary);">${esc(data.word)}</div>
    <div class="vocab-pos" style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">${esc(data.partOfSpeech)}</div>
    <div class="vocab-def" style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:6px;">${esc(data.definition)}</div>
    <div class="vocab-example" style="font-size:12px;color:var(--text-muted);font-style:italic;">"${esc(data.exampleSentence)}"</div>
    ${esolHTML ? `<div class="activity-instruction">✏️ Complete the sentence frame</div>${esolHTML}` : ''}`;
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
    <div class="activity-instruction">✏️ Build your response using the frame below</div>
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
    <div class="activity-instruction">👀 Read and annotate the passage</div>
    <div id="passage-text">${parasHTML}</div>
    ${cubesHTML ? `<div class="cubes-guide" style="margin-top:14px;">
      <div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">CUBES Guide</div>
      ${cubesHTML}
    </div>` : ''}`;
}

// ── State: Reveal Answers ──
// CSS handles exemplar-text opacity via body.reveal-answers .exemplar-text { opacity: 1 }
function applyRevealState(reveal) {
  // MC: show correct answer styling (legacy — no-ops on new markup)
  document.querySelectorAll('.mc-answer-correct').forEach(el => {
    el.classList.toggle('mc-correct', reveal);
  });
  // Written model answers
  document.querySelectorAll('.written-model').forEach(el => {
    el.style.display = reveal ? 'block' : 'none';
  });
  // MC reveal: in reveal mode, skip elimination — show all STOP badges immediately.
  // Hide justification wrap (textarea + submit) when reveal is active — student may have
  // reached 'justifying' state before teacher toggled reveal, so we must hide explicitly.
  // When reveal is turned off, reset STOP elimination state so students can still interact.
  document.querySelectorAll('.mc-options-list').forEach(list => {
    if (reveal) {
      list.dataset.state = 'confirmed';
      list.querySelectorAll('.mc-stop-badge').forEach(b => b.classList.remove('mc-stop-badge--hidden'));
      const justifyWrap = list.closest('.activity-body') && list.closest('.activity-body').querySelector('.mc-justify-wrap');
      if (justifyWrap) justifyWrap.style.display = 'none';
    } else {
      // Reset STOP elimination state so students can still interact
      list.dataset.state = 'eliminating';
      list.dataset.elimCount = '0';
      // Re-hide all STOP badges
      list.querySelectorAll('.mc-stop-badge').forEach(b => b.classList.add('mc-stop-badge--hidden'));
      // Remove eliminated/selected states from all option wraps
      list.querySelectorAll('.mc-option-wrap').forEach(w => {
        w.classList.remove('mc-option-wrap--eliminated', 'mc-option-wrap--selected');
        w.querySelectorAll('.mc-stop-elim-btn').forEach(btn => btn.classList.remove('mc-stop-elim-btn--active'));
      });
      // Hide justify wrap
      list.querySelectorAll('.mc-justify-wrap').forEach(w => { w.style.display = 'none'; });
    }
  });
}

// ── State: Teacher View ──
function applyTeacherView(isTeacher) {
  document.querySelectorAll('.teacher-only-hidden').forEach(el => {
    el.style.display = isTeacher ? '' : 'none';
  });
}
