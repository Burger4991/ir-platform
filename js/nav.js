// nav.js — Sidebar navigation, day switching, keyboard shortcuts
// Exposes: window.currentDay (number), window.switchDay (function)

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
    for (let d = 1; d <= UNIT.meta.days; d++) {
      const btn = document.createElement('button');
      btn.className = 'sidebar-day-btn';
      btn.dataset.day = d;
      const dayData = UNIT.days[d];
      btn.textContent = dayData && dayData.label ? dayData.label : 'Day ' + d;
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

  // ── Restore last day ──
  const savedDay = parseInt(localStorage.getItem('ir-last-day-' + UNIT.meta.id)) || 1;
  const startDay = (savedDay >= 1 && savedDay <= UNIT.meta.days) ? savedDay : 1;
  switchDay(startDay);

  function updateFooter() {
    if (prevFooter) prevFooter.textContent = window.currentDay > 1 ? '← Day ' + (window.currentDay - 1) : '';
    if (nextFooter) nextFooter.textContent = window.currentDay < UNIT.meta.days ? 'Day ' + (window.currentDay + 1) + ' →' : '';
    if (prevFooter) prevFooter.onclick = () => { if (window.currentDay > 1) switchDay(window.currentDay - 1); };
    if (nextFooter) nextFooter.onclick = () => { if (window.currentDay < UNIT.meta.days) switchDay(window.currentDay + 1); };
  }

  // Make switchDay accessible globally — toolbar.js and engage.js read window.currentDay
  window.switchDay = function switchDay(day) {
    window.currentDay = day;
    localStorage.setItem('ir-last-day-' + UNIT.meta.id, day);

    // Update sidebar button states
    document.querySelectorAll('.sidebar-day-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.day) === day);
    });

    updateFooter();

    // Reset GR phase badge on day change
    if (typeof window.resetGrPhase === 'function') window.resetGrPhase();

    // Clear annotations on day change
    if (typeof window.clearAnnotations === 'function') window.clearAnnotations();

    // Render content
    if (typeof renderDayContent === 'function') renderDayContent(day);
    if (typeof window.populatePassageDrawer === 'function') window.populatePassageDrawer(day);
  };
});
