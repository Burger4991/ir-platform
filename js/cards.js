// Renders the content grid for a given day from UNIT.days[day]
// Called by nav.js switchDay()

function renderDayContent(day) {
  const grid = document.getElementById('content-grid');
  const dayData = UNIT.days[day];
  if (!dayData) { grid.innerHTML = '<p style="padding:20px;color:var(--text-muted)">No content for this day.</p>'; return; }

  grid.innerHTML = '';

  const isTeacherView = document.body.classList.contains('teacher-view');
  const isRevealAnswers = document.body.classList.contains('reveal-answers');

  // Build cards in order
  grid.appendChild(buildBellringerCard(dayData.bellringer, day, isRevealAnswers));
  grid.appendChild(buildOrganizerCard(dayData.organizer, isRevealAnswers));
  grid.appendChild(buildVocabCard(dayData.vocabulary, day));
  grid.appendChild(buildTeacherCard(dayData.teacherNotes, isTeacherView));
  if (dayData.textPassage) grid.appendChild(buildPassageCard(dayData.textPassage));
  grid.appendChild(buildEsolCard(dayData.esol));

  wireExpandCollapse();
  if (typeof updateProgressPanel === 'function') updateProgressPanel(day);
}

// ── Card factory ──
function makeCard(label, summary, bodyHTML, accentVar, extraClass) {
  const card = document.createElement('div');
  card.className = 'card' + (extraClass ? ' ' + extraClass : '');
  card.style.setProperty('--card-accent-color', `var(${accentVar})`);
  card.innerHTML = `
    <div class="card-header">
      <div>
        <div class="card-label">${label}</div>
        <div class="card-summary">${summary}</div>
      </div>
      <span class="card-toggle">▼ expand</span>
    </div>
    <div class="card-collapsed-hint">Click to view…</div>
    <div class="card-body">${bodyHTML}</div>`;
  return card;
}

// ── Bellringer ──
function buildBellringerCard(data, day, reveal) {
  if (!data) return makeCard('Bellringer', 'No bellringer data', '', '--card-bellringer');
  const wordsStr = data.words.join(', ');
  const questionsHTML = data.questions.map((q, qi) => `
    <div style="margin-bottom:14px;">
      <div class="bellringer-passage">${q.stem}</div>
      <div>
        ${q.options.map(o => `
          <div class="mc-option${o.correct ? ' correct' : ''}${o.correct && !reveal ? ' hidden' : ''}">
            <span>${o.letter}.</span>
            <span>${o.text}</span>
            <span class="answer-marker"> ✓</span>
          </div>`).join('')}
      </div>
      <div class="written-prompt">Written: ${q.writtenPrompt}</div>
      <div class="written-model${reveal ? ' visible' : ''}">${q.writtenModel}</div>
    </div>`).join('');

  return makeCard(
    `Bellringer · Day ${day}`,
    wordsStr,
    `<p style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">4 min timed · 2 MC + 1 written</p>${questionsHTML}`,
    '--card-bellringer'
  );
}

// ── Organizer ──
function buildOrganizerCard(data, reveal) {
  if (!data) return makeCard('Organizer', 'No organizer data', '', '--card-organizer');
  const grColors = { 'I Do':'#4a7c59', 'We Do':'#7aaa89', 'You Do w/ Partner':'#9c7e5a', 'You Do':'#bbb' };

  const tableRows = data.rows.map(row => {
    const color = grColors[row.label] || '#999';
    const cells = data.columns.map((col, ci) => {
      if (ci === 0) return `<td style="width:90px;vertical-align:middle;padding:6px 8px;border-top:1px solid var(--border-light);"><span class="gr-badge" style="background:${color}">${row.label}</span></td>`;
      const cellContent = row.cells[ci - 1] || '';
      if (row.isPreFilled) {
        return `<td style="padding:6px 8px;border-top:1px solid var(--border-light);color:var(--text-secondary);">
          <span class="exemplar-text">${cellContent}</span>
          <span class="hidden-hint">—</span>
        </td>`;
      }
      return `<td style="padding:6px 8px;border-top:1px solid var(--border-light);color:var(--text-muted);font-style:italic;">${cellContent || 'Students respond…'}</td>`;
    }).join('');
    return `<tr class="${row.isPreFilled ? 'exemplar' + (!reveal ? ' hidden' : '') : 'student'}">${cells}</tr>`;
  }).join('');

  const body = `
    <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">${data.benchmarkFocus}</div>
    <table class="organizer-table" style="width:100%;border-collapse:collapse;">
      <thead><tr><th style="width:90px;"></th>${data.columns.map(c=>`<th style="padding:6px 8px;text-align:left;font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;background:rgba(0,0,0,0.04);">${c}</th>`).join('')}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>`;

  return makeCard('Organizer · ' + data.benchmarkFocus.split('—')[0].trim(), data.columns.join(' · '), body, '--card-organizer');
}

// ── Vocabulary ──
function buildVocabCard(vocab, day) {
  if (!vocab || !vocab.length) return makeCard('Vocabulary', 'No vocabulary data', '', '--card-vocab');
  const items = vocab.map(v => `
    <div class="vocab-item">
      <div>
        <div class="vocab-word">${v.word}</div>
        <div class="vocab-pos">${v.partOfSpeech}</div>
        <div class="vocab-example">"${v.exampleSentence}"</div>
      </div>
      <div class="vocab-def">${v.definition}</div>
    </div>`).join('');
  return makeCard(`Vocabulary · Day ${day}`, vocab.map(v=>v.word).join(', '), `<div class="vocab-list">${items}</div>`, '--card-vocab');
}

// ── Teacher Notes ──
function buildTeacherCard(notes, isTeacherView) {
  const card = makeCard(
    'Teacher Notes',
    'Instructional guidance',
    `<div class="teacher-note-body">${notes || 'No teacher notes for this day.'}</div>`,
    '--card-teacher',
    isTeacherView ? '' : 'teacher-only-hidden'
  );
  // Add teacher badge to header
  const label = card.querySelector('.card-label');
  label.innerHTML += ' <span class="teacher-badge">👁 Teacher Only</span>';
  return card;
}

// ── Text Passage ──
function buildPassageCard(passage) {
  const parasHTML = passage.paragraphs.map(p =>
    `<p class="passage-para"><span class="para-num">[${p.number}]</span>${p.text}</p>`
  ).join('');
  const cubesHTML = passage.cubesGuide.map(c =>
    `<div class="cubes-item">
      <span class="cubes-letter" style="color:var(--accent)">${c.letter}</span>
      <span class="cubes-action">${c.action}</span>
      <span class="cubes-example">e.g. "${c.example}"</span>
    </div>`
  ).join('');
  const body = `
    <div id="passage-text">${parasHTML}</div>
    <div class="cubes-guide">
      <div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">CUBES Annotation Guide</div>
      ${cubesHTML}
    </div>`;
  return makeCard('Text Passage', `Paragraphs ${passage.paragraphs[0].number}–${passage.paragraphs[passage.paragraphs.length-1].number}`, body, '--card-passage');
}

// ── ESOL Scaffolds ──
function buildEsolCard(esol) {
  if (!esol) return makeCard('ESOL Scaffolds', 'No ESOL data', '', '--card-esol', 'esol-card');
  const framesHTML = esol.frames.map(f =>
    `<div class="esol-frame"><span class="esol-level-badge">${f.level}</span>${f.frame}</div>`
  ).join('');
  const wordBankHTML = esol.wordBank && esol.wordBank.length
    ? `<div style="margin-top:10px;"><div style="font-size:9px;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Word Bank</div><div class="esol-word-bank">${esol.wordBank.map(w=>`<span class="esol-word">${w}</span>`).join('')}</div></div>`
    : '';
  const body = `<div class="esol-frame-list">${framesHTML}</div>${wordBankHTML}${esol.l1Note ? `<div style="font-size:11px;color:var(--text-muted);margin-top:8px;">${esol.l1Note}</div>` : ''}`;
  return makeCard('ESOL Scaffolds · Levels 1–3', 'Sentence frames + word bank', body, '--card-esol', 'esol-card');
}

// ── Expand / Collapse ──
function wireExpandCollapse() {
  document.querySelectorAll('.card').forEach(card => {
    const header = card.querySelector('.card-header');
    const toggle = card.querySelector('.card-toggle');
    header.addEventListener('click', () => {
      const isExpanded = card.classList.toggle('expanded');
      toggle.textContent = isExpanded ? '▲ collapse' : '▼ expand';

      // Spotlight mode: dim others when one expands
      if (document.body.classList.contains('spotlight-mode') && isExpanded) {
        document.querySelectorAll('.card').forEach(c => {
          c.classList.toggle('spotlight-focus', c === card);
          c.classList.toggle('dimmed', c !== card);
        });
      } else if (document.body.classList.contains('spotlight-mode') && !isExpanded) {
        document.querySelectorAll('.card').forEach(c => {
          c.classList.remove('spotlight-focus', 'dimmed');
        });
      }
    });
  });
}

// Called when reveal state changes — re-evaluates all MC answers + organizer exemplars
function applyRevealState(reveal) {
  document.querySelectorAll('.mc-option.correct').forEach(el => el.classList.toggle('hidden', !reveal));
  document.querySelectorAll('.written-model').forEach(el => el.classList.toggle('visible', reveal));
  document.querySelectorAll('.organizer-table tr.exemplar').forEach(el => el.classList.toggle('hidden', !reveal));
}

// Called when teacher view changes
function applyTeacherView(isTeacher) {
  document.querySelectorAll('.teacher-only-hidden').forEach(el => {
    el.style.display = isTeacher ? '' : 'none';
  });
}
