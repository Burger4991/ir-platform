document.addEventListener('DOMContentLoaded', () => {
  // ── Projection Mode ──
  const btnProjection = document.getElementById('btn-projection');
  btnProjection.addEventListener('click', toggleProjection);
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'p' || e.key === 'P') toggleProjection();
    if (e.key === 't' || e.key === 'T') toggleTeacherView();
  });

  function toggleProjection() {
    const on = document.body.classList.toggle('projection-mode');
    btnProjection.classList.toggle('active', on);
    if (typeof timerShowOverlay === 'function') timerShowOverlay(on);
  }

  // ── Spotlight Mode ──
  const btnSpotlight = document.getElementById('btn-spotlight');
  btnSpotlight.addEventListener('click', () => {
    const on = document.body.classList.toggle('spotlight-mode');
    btnSpotlight.classList.toggle('active', on);
    if (!on) {
      document.querySelectorAll('.card').forEach(c => c.classList.remove('dimmed', 'spotlight-focus'));
    }
  });

  // ── Font Size ──
  const fontSizes = ['', 'font-large', 'font-xlarge'];
  let fontIndex = 0;
  const btnFont = document.getElementById('btn-font');
  btnFont.addEventListener('click', () => {
    document.body.classList.remove(...fontSizes.filter(Boolean));
    fontIndex = (fontIndex + 1) % fontSizes.length;
    if (fontSizes[fontIndex]) document.body.classList.add(fontSizes[fontIndex]);
    btnFont.classList.toggle('active', fontIndex > 0);
    btnFont.textContent = ['A± Font', 'A+ Large', 'A++ XL'][fontIndex];
  });

  // ── Teacher / Student View ──
  const btnTeacher = document.getElementById('btn-teacher-view');
  let isTeacherView = true;
  btnTeacher.classList.add('active');
  applyTeacherViewState(true);

  btnTeacher.addEventListener('click', toggleTeacherView);

  function toggleTeacherView() {
    isTeacherView = !isTeacherView;
    btnTeacher.textContent = isTeacherView ? '👁 Teacher View' : '👤 Student View';
    btnTeacher.classList.toggle('active', isTeacherView);
    applyTeacherViewState(isTeacherView);
  }

  function applyTeacherViewState(show) {
    document.body.classList.toggle('student-view', !show);
    document.querySelectorAll('.card.teacher-only-hidden, .teacher-only-hidden').forEach(el => {
      el.style.display = show ? '' : 'none';
    });
    if (typeof applyTeacherView === 'function') applyTeacherView(show);
  }

  // ── Reveal Answers ──
  const btnReveal = document.getElementById('btn-reveal');
  let answersRevealed = false;
  btnReveal.addEventListener('click', () => {
    answersRevealed = !answersRevealed;
    document.body.classList.toggle('reveal-answers', answersRevealed);
    btnReveal.classList.toggle('active', answersRevealed);
    if (typeof applyRevealState === 'function') applyRevealState(answersRevealed);
  });

  // ── ESOL Mode ──
  const btnEsol = document.getElementById('btn-esol');
  btnEsol.addEventListener('click', () => {
    const on = document.body.classList.toggle('esol-mode');
    btnEsol.classList.toggle('active', on);
  });

  // ── Downloads Panel ──
  const btnDownloads = document.getElementById('btn-downloads');
  const downloadsPanel = document.getElementById('downloads-panel');
  btnDownloads.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadsPanel.classList.toggle('visible');
    progressPanel.classList.remove('visible');
  });

  // Build downloads list from UNIT.downloads
  if (typeof UNIT !== 'undefined' && UNIT.downloads) {
    UNIT.downloads.forEach(dl => {
      const item = document.createElement('div');
      item.className = 'download-item';
      item.textContent = '📄 ' + dl.label;
      item.addEventListener('click', () => {
        window.open('downloads/' + dl.filename, '_blank');
      });
      downloadsPanel.appendChild(item);
    });
  }

  // ── Progress Panel ──
  const btnProgress = document.getElementById('btn-progress');
  const progressPanel = document.getElementById('progress-panel');
  btnProgress.addEventListener('click', (e) => {
    e.stopPropagation();
    progressPanel.classList.toggle('visible');
    downloadsPanel.classList.remove('visible');
  });

  // Close panels on outside click
  document.addEventListener('click', () => {
    downloadsPanel.classList.remove('visible');
    progressPanel.classList.remove('visible');
  });

  // Assessment section toggle
  const assessToggle = document.getElementById('assessment-toggle');
  const assessBody = document.getElementById('assessment-body');
  if (assessToggle) {
    assessToggle.addEventListener('click', () => {
      assessBody.classList.toggle('visible');
      assessToggle.querySelector('span').textContent =
        assessBody.classList.contains('visible') ? '▲' : '▼';
    });
    renderAssessment();
  }

  function renderAssessment() {
    if (typeof UNIT === 'undefined' || !UNIT.assessment) return;
    const a = UNIT.assessment;
    const stop = a.stopProtocol;
    const stepsHTML = stop.steps.map(s => `
      <div class="stop-cell">
        <div class="stop-letter">${s.letter}</div>
        <div class="stop-label">${s.label}</div>
        <div class="stop-desc">${s.description}</div>
      </div>`).join('');

    const tiersHTML = a.raceGuide.tiers.map(t => `
      <div style="margin-bottom:10px;padding:10px 12px;background:var(--bg-page);border-radius:6px;">
        <div style="font-size:10px;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">${t.tier} — ${t.label}</div>
        <div style="font-size:12px;color:var(--text-secondary);font-style:italic;">"${t.frame}"</div>
      </div>`).join('');

    assessBody.innerHTML = `
      <div style="margin-bottom:16px;">
        <div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:4px;">STOP Protocol</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px;">${stop.description}</div>
        <div class="stop-grid">${stepsHTML}</div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--text-primary);margin-bottom:8px;">RACE/ACE Constructed Response</div>
        ${tiersHTML}
      </div>`;
  }
});

// Called from cards.js to update panel content per day
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
