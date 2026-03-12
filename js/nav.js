// Renders unit metadata, day tabs, and triggers card rendering per day.
// Depends on: UNIT (from data.js), renderDayContent (from cards.js)

let currentDay = 1;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof UNIT === 'undefined') return;

  // Restore last day from localStorage
  const savedDay = parseInt(localStorage.getItem('ir-last-day-' + UNIT.meta.id)) || 1;

  // Unit header metadata
  document.getElementById('unit-benchmark-label').textContent =
    `${UNIT.meta.benchmark} · ${UNIT.meta.benchmarkLabel}`;
  document.getElementById('unit-title').textContent = UNIT.meta.title;
  document.getElementById('unit-meta').textContent =
    `${UNIT.meta.text} · Paragraphs ${UNIT.meta.paragraphs} · ${UNIT.meta.days}-Day Unit`;

  // Build day tabs
  const tabContainer = document.getElementById('day-tabs');
  for (let d = 1; d <= UNIT.meta.days; d++) {
    const tab = document.createElement('div');
    tab.className = 'day-tab' + (d === savedDay ? ' active' : '');
    tab.textContent = 'Day ' + d;
    tab.dataset.day = d;
    tab.addEventListener('click', () => switchDay(d));
    tabContainer.appendChild(tab);
  }

  // Footer prev/next
  document.getElementById('prev-day-footer').addEventListener('click', () => {
    if (currentDay > 1) switchDay(currentDay - 1);
  });
  document.getElementById('next-day-footer').addEventListener('click', () => {
    if (currentDay < UNIT.meta.days) switchDay(currentDay + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' && currentDay < UNIT.meta.days) switchDay(currentDay + 1);
    if (e.key === 'ArrowLeft' && currentDay > 1) switchDay(currentDay - 1);
  });

  switchDay(savedDay);
});

function switchDay(day) {
  currentDay = day;
  localStorage.setItem('ir-last-day-' + UNIT.meta.id, day);

  // Update tabs
  document.querySelectorAll('.day-tab').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.day) === day);
  });

  // Update footer nav
  const prev = document.getElementById('prev-day-footer');
  const next = document.getElementById('next-day-footer');
  prev.textContent = day > 1 ? `← Day ${day - 1}` : '';
  next.textContent = day < UNIT.meta.days ? `Day ${day + 1} →` : '';

  // Clear annotation canvas on day switch
  if (typeof clearAnnotations === 'function') clearAnnotations();

  // Render cards (defined in cards.js)
  if (typeof renderDayContent === 'function') renderDayContent(day);
}
