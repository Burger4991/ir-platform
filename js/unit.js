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
    const done = [...doneActivityIds].filter(id => id.startsWith(`d${day}-`)).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `
      <div class="day-progress">
        <div class="day-progress-meta">
          <span class="day-label">Day ${day} — ${UNIT.days[day].label || ''}</span>
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

    // Update count display
    const meta = fill.closest('.day-progress')?.querySelector('.day-progress-meta span:last-child');
    if (meta) meta.textContent = `${done} / ${total} activities`;

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
    const totalDays = UNIT.meta?.days || Object.keys(UNIT.days).length;
    const isLast = currentDay >= totalDays;
    document.getElementById('dc-title').textContent = isLast ? 'Unit Complete! 🎉' : `Day ${currentDay} Complete`;
    document.getElementById('dc-sub').textContent = isLast
      ? `You finished all ${totalDays} days.`
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
    const promptEl = document.getElementById('et-prompt');
    const frameEl = document.getElementById('et-frame');
    if (promptEl) promptEl.textContent = et.prompt;
    if (frameEl) frameEl.textContent = et.frame || '';
    document.getElementById('exit-ticket-overlay')?.classList.add('visible');
    setTimer(300); // default 5 min
    toggleTimer();
  }

  // ── Focus Mode ─────────────────────────────────────
  function enterFocus(activityId) {
    focusActivityId = activityId;
    focusStep = 0;

    const el = document.querySelector(`[data-aid="${activityId}"]`);
    if (!el) return;

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
    document.getElementById('focus-overlay')?.classList.add('visible');
  }

  function buildMcFocusSteps(el) {
    const stem = el.querySelector('.mc-stem')?.outerHTML || '';
    const choices = el.querySelector('.mc-choices')?.outerHTML || '';
    const writtenBlock = el.querySelector('[style*="border-top"]');
    const written = writtenBlock ? writtenBlock.outerHTML : '';
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
    const anchorEl = document.getElementById('focus-anchor');
    const bodyEl = document.getElementById('focus-body');
    const dotsEl = document.getElementById('focus-dots');
    const infoEl = document.getElementById('focus-step-info');
    const prevBtn = document.getElementById('btn-focus-prev');
    const nextBtn = document.getElementById('btn-focus-next');

    if (anchorEl) anchorEl.textContent = step.anchor;
    if (bodyEl) bodyEl.innerHTML = step.html;
    if (dotsEl) {
      dotsEl.innerHTML = focusSteps.map((_, i) =>
        `<div class="step-dot${i === focusStep ? ' active' : i < focusStep ? ' done' : ''}"></div>`
      ).join('');
    }
    if (infoEl) infoEl.textContent = `Step ${focusStep + 1} of ${focusSteps.length}`;
    if (prevBtn) prevBtn.disabled = focusStep === 0;
    if (nextBtn) nextBtn.textContent = focusStep === focusSteps.length - 1 ? 'Done ✓' : 'Next →';
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
    document.getElementById('focus-overlay')?.classList.remove('visible');
    if (completedId) markActivityDone(completedId);
  }

  // ── Init ───────────────────────────────────────────
  function init() {
    // Load persisted done days
    const unitId = UNIT.id || UNIT.meta?.id || 'unit';
    doneDays = JSON.parse(localStorage.getItem(`ir-done-days-${unitId}`) || '[]');

    // Load initial timer (4 min default)
    setTimer(4 * 60);

    // Build day sidebar
    const sidebar = document.getElementById('day-sidebar');
    if (sidebar) {
      // Clear existing content but keep sidebar-toggle if present
      const toggle = sidebar.querySelector('.sidebar-toggle');
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

      if (toggle) sidebar.appendChild(toggle);
    }

    // Sidebar toggle
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
      document.getElementById('day-sidebar')?.classList.toggle('collapsed');
    });

    // Day complete overlay
    const dcBtn = document.getElementById('dc-btn');
    if (dcBtn) dcBtn.addEventListener('click', () => {
      document.getElementById('day-complete-overlay')?.classList.remove('visible');
      const totalDays = UNIT.meta?.days || Object.keys(UNIT.days).length;
      const isLast = currentDay >= totalDays;
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
      document.getElementById('exit-ticket-overlay')?.classList.remove('visible');
    });

    // Timer
    document.getElementById('btn-timer-play')?.addEventListener('click', toggleTimer);
    document.getElementById('btn-timer-reset')?.addEventListener('click', resetTimer);
    document.getElementById('timer-presets')?.addEventListener('change', e => {
      if (e.target.value) setTimer(parseInt(e.target.value));
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
