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

  // ── STOP Mode ──
  const btnStop = document.getElementById('btn-stop');
  if (btnStop) btnStop.addEventListener('click', () => {
    const on = document.body.classList.toggle('stop-mode');
    btnStop.classList.toggle('active', on);
  });

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
