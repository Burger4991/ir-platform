// nav.js — Sidebar navigation, day switching, keyboard shortcuts
// Exposes: window.currentDay (number), window.switchDay (function)

// ── Local escape helper (esc is not available from cards.js here) ──
function navEsc(str) { return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ── Per-day accent color system (I2) ──
const DAY_PALETTES = [
  // Days 1-2: Indigo
  { accent:'#6366f1', rgb:'99,102,241', text:'#a5b4fc', bg:'#1e1b4b', border:'#312e81' },
  // Days 3-4: Emerald
  { accent:'#10b981', rgb:'16,185,129', text:'#6ee7b7', bg:'#022c22', border:'#064e3b' },
  // Days 5-6: Amber
  { accent:'#f59e0b', rgb:'245,158,11', text:'#fcd34d', bg:'#1c0a00', border:'#78350f' }
];

window.setDayAccent = function setDayAccent(day) {
  const palette = DAY_PALETTES[Math.floor((day - 1) / 2) % 3];
  const root = document.documentElement;
  root.style.setProperty('--day-accent',        palette.accent);
  root.style.setProperty('--day-accent-rgb',    palette.rgb);
  root.style.setProperty('--day-accent-text',   palette.text);
  root.style.setProperty('--day-accent-bg',     palette.bg);
  root.style.setProperty('--day-accent-border', palette.border);
  root.style.setProperty('--accent',            palette.accent); // backward compat
};

window.currentDay = 1;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof UNIT === 'undefined') return;

  // ── Populate unit header ──
  const benchLabel = document.getElementById('unit-benchmark-label');
  const unitTitle  = document.getElementById('unit-title');
  const unitMeta   = document.getElementById('unit-meta');
  if (benchLabel) benchLabel.textContent = UNIT.meta.benchmark + ' — ' + UNIT.meta.benchmarkLabel;
  if (unitTitle)  unitTitle.textContent  = UNIT.meta.title;
  if (unitMeta)   unitMeta.textContent   = UNIT.meta.days + '-Day Unit';

  // ── Sidebar unit title ──
  const sidebarTitle = document.getElementById('sidebar-unit-title');
  if (sidebarTitle) sidebarTitle.textContent = UNIT.meta.title;

  // ── Build day buttons in sidebar ──
  const sidebarDays = document.getElementById('sidebar-days');
  if (sidebarDays) {
    const unitId = (UNIT.meta && (UNIT.meta.id || UNIT.meta.title)) || 'default';
    const doneDays = JSON.parse(localStorage.getItem('ir-done-days-' + unitId) || '[]');

    for (let d = 1; d <= UNIT.meta.days; d++) {
      const btn = document.createElement('button');
      btn.className = 'sidebar-day-btn';
      btn.dataset.day = d;
      const dayData = UNIT.days[d];
      const label = dayData && dayData.label ? 'Day ' + d + ' — ' + dayData.label : 'Day ' + d;
      const isDone = doneDays.includes(d);
      btn.innerHTML = `
        <span class="sidebar-day-indicator">${isDone ? '✓' : '○'}</span>
        <span class="sidebar-day-label">${navEsc(label)}</span>
        <span class="sidebar-day-status">${isDone ? 'Done' : ''}</span>`;
      btn.addEventListener('click', () => switchDay(d));
      sidebarDays.appendChild(btn);
    }
  }

  // ── Footer prev/next ──
  const prevFooter = document.getElementById('prev-day-footer');
  const nextFooter = document.getElementById('next-day-footer');

  // ── Sidebar toggle ──
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹';
    });
  }

  // ── Keyboard nav ──
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft'  && window.currentDay > 1)               switchDay(window.currentDay - 1);
    if (e.key === 'ArrowRight' && window.currentDay < UNIT.meta.days)  switchDay(window.currentDay + 1);
  });

  function updateFooter() {
    if (prevFooter) prevFooter.textContent = window.currentDay > 1 ? '← Day ' + (window.currentDay - 1) : '';
    if (nextFooter) nextFooter.textContent = window.currentDay < UNIT.meta.days ? 'Day ' + (window.currentDay + 1) + ' →' : '';
    if (prevFooter) prevFooter.onclick = () => { if (window.currentDay > 1) window.switchDay(window.currentDay - 1); };
    if (nextFooter) nextFooter.onclick = () => { if (window.currentDay < UNIT.meta.days) window.switchDay(window.currentDay + 1); };
  }

  // Make switchDay accessible globally — toolbar.js and engage.js read window.currentDay
  window.switchDay = function switchDay(day) {
    window.setDayAccent(day);
    window.currentDay = day;
    localStorage.setItem('ir-last-day-' + UNIT.meta.id, day);

    // Update sidebar button states (3-state: done / active / upcoming)
    const unitId2 = (UNIT.meta && (UNIT.meta.id || UNIT.meta.title)) || 'default';
    const doneDays2 = JSON.parse(localStorage.getItem('ir-done-days-' + unitId2) || '[]');
    document.querySelectorAll('.sidebar-day-btn').forEach(btn => {
      const d = parseInt(btn.dataset.day);
      const isDone = doneDays2.includes(d);
      const isActive = d === day;
      btn.classList.remove('sidebar-day--done', 'sidebar-day--active', 'sidebar-day--upcoming', 'active');
      btn.classList.add(isDone ? 'sidebar-day--done' : isActive ? 'sidebar-day--active' : 'sidebar-day--upcoming');
      // Update indicator and status text
      const indicator = btn.querySelector('.sidebar-day-indicator');
      const status = btn.querySelector('.sidebar-day-status');
      if (indicator) indicator.textContent = isDone ? '✓' : isActive ? '●' : '○';
      if (status) status.textContent = isDone ? 'Done' : isActive ? 'Now' : '';
    });

    updateFooter();

    // Reset GR phase badge on day change
    if (typeof window.resetGrPhase === 'function') window.resetGrPhase();

    // Clear annotations on day change
    if (typeof window.clearAnnotations === 'function') window.clearAnnotations();

    // Render content with fade transition (I4)
    const grid = document.getElementById('content-grid');
    if (grid) grid.style.opacity = '0';
    requestAnimationFrame(() => {
      if (typeof renderDayContent === 'function') renderDayContent(day);
      if (typeof window.populatePassageDrawer === 'function') window.populatePassageDrawer(day);
      requestAnimationFrame(() => { if (grid) grid.style.opacity = '1'; });
    });
  };

  // ── Restore last day (must be after window.switchDay is defined) ──
  const savedDay = parseInt(localStorage.getItem('ir-last-day-' + UNIT.meta.id)) || 1;
  const startDay = (savedDay >= 1 && savedDay <= UNIT.meta.days) ? savedDay : 1;
  window.switchDay(startDay);
});
