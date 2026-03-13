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
// NOTE: class names (vocab-word, vocab-def, vocab-example, vocab-esol-frame) are required by
// focus.js stepVocabWord/stepVocabDef/stepVocabFrame for progressive reveal via querySelectorAll.
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
// CSS handles exemplar-text opacity via body.reveal-answers .exemplar-text { opacity: 1 }
function applyRevealState(reveal) {
  // MC: show correct answer styling
  document.querySelectorAll('.mc-answer-correct').forEach(el => {
    el.classList.toggle('mc-correct', reveal);
  });
  // Written model answers
  document.querySelectorAll('.written-model').forEach(el => {
    el.style.display = reveal ? 'block' : 'none';
  });
}

// ── State: Teacher View ──
function applyTeacherView(isTeacher) {
  document.querySelectorAll('.teacher-only-hidden').forEach(el => {
    el.style.display = isTeacher ? '' : 'none';
  });
}
