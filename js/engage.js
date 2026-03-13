// js/engage.js
// Engage panel — display-only formative assessment tools
// Reads UNIT.days[window.currentDay].engageActivities
// Stores result counts in sessionStorage

(function() {
  'use strict';

  let currentActivityIndex = 0;
  let activityResults = {};  // key: index, value: per-activity result object

  // Timer state — declared here so stopAllTimers (defined below) can reference both
  let fillableTimerInterval = null;
  let tpsTimerInterval = null;

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function storageKey(index) {
    return `ir-engage-${UNIT.meta.id}-day${window.currentDay}-activity${index}`;
  }

  function loadResult(index) {
    try {
      const raw = sessionStorage.getItem(storageKey(index));
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function saveResult(index, data) {
    try {
      sessionStorage.setItem(storageKey(index), JSON.stringify(data));
    } catch (e) { /* sessionStorage full — ignore */ }
  }

  // ─── Public API ─────────────────────────────────────────────────────────────
  window.openEngage = openEngage;
  window.closeEngage = closeEngage;

  // ─── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initEngage);
})();
