// js/engage.js
// Engage panel — display-only formative assessment tools
// Reads UNIT.days[window.currentDay].engageActivities
// Stores result counts in sessionStorage

(function() {
  'use strict';

  let currentActivityIndex = 0;
  let activityResults = {};  // key: index, value: per-activity result object

  // Timer state — declared here so stopAllTimers can reference both
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

  // ─── Init ───────────────────────────────────────────────────────────────────

  function initEngage() {
    const openBtn = document.getElementById('btn-engage');
    if (openBtn) openBtn.addEventListener('click', openEngage);

    const closeBtn = document.getElementById('engage-close');
    if (closeBtn) closeBtn.addEventListener('click', closeEngage);

    const prevBtn = document.getElementById('engage-prev');
    if (prevBtn) prevBtn.addEventListener('click', () => navigateTo(currentActivityIndex - 1));

    const nextBtn = document.getElementById('engage-next');
    if (nextBtn) nextBtn.addEventListener('click', () => navigateTo(currentActivityIndex + 1));
  }

  // ─── Open / Close ──────────────────────────────────────────────────────────

  function openEngage() {
    const overlay = document.getElementById('engage-overlay');
    if (!overlay) return;
    currentActivityIndex = 0;
    overlay.classList.remove('hidden');
    renderActivity(0);
  }

  function closeEngage() {
    const overlay = document.getElementById('engage-overlay');
    if (overlay) overlay.classList.add('hidden');
    stopAllTimers();
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  function navigateTo(index) {
    const activities = getActivities();
    if (index < 0 || index >= activities.length) return;
    stopAllTimers();
    currentActivityIndex = index;
    renderActivity(index);
  }

  function getActivities() {
    if (typeof UNIT === 'undefined') return [];
    const day = UNIT.days[window.currentDay];
    if (!day) return [];
    return day.engageActivities || [];
  }

  function renderActivity(index) {
    const activities = getActivities();
    const activity = activities[index];
    const container = document.getElementById('engage-activity-container');
    const counter = document.getElementById('engage-activity-counter');
    const prevBtn = document.getElementById('engage-prev');
    const nextBtn = document.getElementById('engage-next');

    if (!container || !activity) {
      if (container) container.innerHTML = '<div style="color:rgba(255,255,255,0.4);text-align:center;padding:40px">No activities for this day.</div>';
      return;
    }

    if (counter) counter.textContent = `${index + 1} / ${activities.length}`;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === activities.length - 1;

    // Load saved results if any
    activityResults[index] = loadResult(index) || getDefaultResult(activity);

    switch (activity.type) {
      case 'poll':     container.innerHTML = renderPoll(activity, index);     bindPoll(index);     break;
      case 'rating':   container.innerHTML = renderRating(activity, index);   bindRating(index);   break;
      case 'binary':   container.innerHTML = renderBinary(activity, index);   bindBinary(index);   break;
      case 'fillable': container.innerHTML = renderFillable(activity, index); bindFillable(index); break;
      case 'tps':      container.innerHTML = renderTPS(activity, index);      bindTPS(index);      break;
      default:         container.innerHTML = `<div style="color:#fff">Unknown activity type: ${esc(activity.type)}</div>`;
    }
  }

  function getDefaultResult(activity) {
    switch (activity.type) {
      case 'poll':     return { counts: {}, revealed: false };
      case 'rating':   return { counts: {} };
      case 'binary':   return { countA: 0, countB: 0 };
      case 'fillable': return { timerSeconds: 300, running: false, elapsed: 0 };
      case 'tps':      return { phase: 0, elapsed: 0 };
      default:         return {};
    }
  }

  // ─── Timers ─────────────────────────────────────────────────────────────────

  function stopAllTimers() {
    if (fillableTimerInterval) { clearInterval(fillableTimerInterval); fillableTimerInterval = null; }
    if (tpsTimerInterval) { clearInterval(tpsTimerInterval); tpsTimerInterval = null; }
  }

  // ─── POLL ──────────────────────────────────────────────────────────────────

  function renderPoll(activity, index) {
    const result = activityResults[index];
    const total = activity.choices.reduce((sum, _, i) => sum + (result.counts[i] || 0), 0);

    const choicesHTML = activity.choices.map((choice, i) => {
      const count = result.counts[i] || 0;
      const pct = total > 0 ? Math.round(count / total * 100) : 0;
      const isCorrect = result.revealed && String.fromCharCode(65 + i) === activity.correct;
      return `
        <div class="poll-choice${isCorrect ? ' revealed-correct' : ''}" data-choice-index="${i}">
          <span class="poll-choice-label">${String.fromCharCode(65 + i)}</span>
          <span class="poll-choice-text">${esc(choice)}</span>
          <span class="poll-choice-count">${count}</span>
        </div>
        <div class="poll-bar-wrap">
          <div class="poll-bar" style="width:${pct}%"></div>
        </div>`;
    }).join('');

    const revealLabel = result.revealed ? 'Answer Revealed' : 'Reveal Answer';
    return `
      <div class="engage-question">${esc(activity.question)}</div>
      <div class="poll-choices" id="poll-choices-${index}">${choicesHTML}</div>
      <button class="poll-reveal-btn" id="poll-reveal-${index}"${result.revealed ? ' disabled' : ''}>${revealLabel}</button>`;
  }

  function bindPoll(index) {
    document.querySelectorAll(`#poll-choices-${index} .poll-choice`).forEach(el => {
      el.addEventListener('click', () => {
        const i = parseInt(el.dataset.choiceIndex, 10);
        const result = activityResults[index];
        result.counts[i] = (result.counts[i] || 0) + 1;
        saveResult(index, result);
        renderActivity(index);
      });
    });

    const revealBtn = document.getElementById(`poll-reveal-${index}`);
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        activityResults[index].revealed = true;
        saveResult(index, activityResults[index]);
        renderActivity(index);
      });
    }
  }

  // ─── RATING SCALE ──────────────────────────────────────────────────────────

  function renderRating(activity, index) {
    const result = activityResults[index];
    const scale = activity.scale || 5;
    const total = Object.values(result.counts).reduce((a, b) => a + b, 0);

    const btnsHTML = Array.from({ length: scale }, (_, i) => {
      const val = i + 1;
      const count = result.counts[val] || 0;
      return `<button class="rating-btn" data-val="${val}">
        ${val}
        <span class="rating-count">${count}</span>
      </button>`;
    }).join('');

    const barsHTML = Array.from({ length: scale }, (_, i) => {
      const val = i + 1;
      const count = result.counts[val] || 0;
      const pct = total > 0 ? Math.round(count / total * 100) : 0;
      return `<div class="rating-bar-row">
        <span class="rating-bar-label">${val}</span>
        <div class="rating-bar-outer"><div class="rating-bar-inner" style="width:${pct}%"></div></div>
        <span class="rating-bar-label">${count}</span>
      </div>`;
    }).join('');

    return `
      <div class="engage-question">${esc(activity.prompt)}</div>
      <div class="rating-buttons" id="rating-btns-${index}">${btnsHTML}</div>
      <div style="margin-top:20px">${barsHTML}</div>
      <div class="rating-total">Total responses: ${total}</div>`;
  }

  function bindRating(index) {
    document.querySelectorAll(`#rating-btns-${index} .rating-btn`).forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.val, 10);
        const result = activityResults[index];
        result.counts[val] = (result.counts[val] || 0) + 1;
        saveResult(index, result);
        renderActivity(index);
      });
    });
  }

  // ─── BINARY CHOICE ─────────────────────────────────────────────────────────

  function renderBinary(activity, index) {
    const result = activityResults[index];
    const total = result.countA + result.countB;
    const pctA = total > 0 ? Math.round(result.countA / total * 100) : 50;
    const pctB = total > 0 ? Math.round(result.countB / total * 100) : 50;

    return `
      <div class="engage-question">${esc(activity.prompt)}</div>
      <div class="binary-btns">
        <button class="binary-btn" id="binary-a-${index}">
          ${esc(activity.optionA)}
          <span class="binary-pct">${result.countA} (${pctA}%)</span>
        </button>
        <button class="binary-btn" id="binary-b-${index}">
          ${esc(activity.optionB)}
          <span class="binary-pct">${result.countB} (${pctB}%)</span>
        </button>
      </div>
      <div class="binary-split">
        <div class="binary-split-a" style="width:${pctA}%"></div>
        <div class="binary-split-b"></div>
      </div>`;
  }

  function bindBinary(index) {
    const btnA = document.getElementById(`binary-a-${index}`);
    const btnB = document.getElementById(`binary-b-${index}`);
    if (btnA) btnA.addEventListener('click', () => {
      activityResults[index].countA++;
      saveResult(index, activityResults[index]);
      renderActivity(index);
    });
    if (btnB) btnB.addEventListener('click', () => {
      activityResults[index].countB++;
      saveResult(index, activityResults[index]);
      renderActivity(index);
    });
  }

  // ─── FILLABLE RESPONSE ─────────────────────────────────────────────────────

  function renderFillable(activity, index) {
    const result = activityResults[index];
    const raceFrame = activity.useRaceFrame
      ? (UNIT.days[window.currentDay].raceFrames || null)
      : null;

    const frameHTML = raceFrame ? `
      <div class="fillable-frame">
        <strong>Restate:</strong> ${esc(raceFrame.restate)}<br>
        <strong>Answer:</strong> ${esc(raceFrame.answer)}<br>
        <strong>Cite:</strong> ${esc(raceFrame.cite)}<br>
        <strong>Explain:</strong> ${esc(raceFrame.explain)}
      </div>` : '';

    const totalSec = result.timerSeconds || 300;
    const elapsed = result.elapsed || 0;
    const remaining = Math.max(0, totalSec - elapsed);
    const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
    const secs = String(remaining % 60).padStart(2, '0');

    return `
      <div class="fillable-prompt">${esc(activity.prompt)}</div>
      ${frameHTML}
      <div class="fillable-timer" id="fillable-timer-${index}">${mins}:${secs}</div>
      <div class="fillable-timer-controls">
        <button class="fillable-timer-btn" id="fillable-start-${index}">${result.running ? 'Pause' : 'Start'}</button>
        <button class="fillable-timer-btn" id="fillable-reset-${index}">Reset</button>
      </div>`;
  }

  function bindFillable(index) {
    const startBtn = document.getElementById(`fillable-start-${index}`);
    const resetBtn = document.getElementById(`fillable-reset-${index}`);

    if (startBtn) startBtn.addEventListener('click', () => {
      const result = activityResults[index];
      if (result.running) {
        result.running = false;
        stopAllTimers();
      } else {
        result.running = true;
        fillableTimerInterval = setInterval(() => {
          result.elapsed = (result.elapsed || 0) + 1;
          if (result.elapsed >= result.timerSeconds) {
            result.running = false;
            clearInterval(fillableTimerInterval);
            fillableTimerInterval = null;
          }
          saveResult(index, result);
          const display = document.getElementById(`fillable-timer-${index}`);
          if (display) {
            const rem = Math.max(0, result.timerSeconds - result.elapsed);
            display.textContent = `${String(Math.floor(rem / 60)).padStart(2,'0')}:${String(rem % 60).padStart(2,'00')}`;
          }
        }, 1000);
      }
      saveResult(index, result);
      // Re-render to update button label
      const container = document.getElementById('engage-activity-container');
      if (container) {
        const activity = getActivities()[index];
        container.innerHTML = renderFillable(activity, index);
        bindFillable(index);
      }
    });

    if (resetBtn) resetBtn.addEventListener('click', () => {
      stopAllTimers();
      activityResults[index].elapsed = 0;
      activityResults[index].running = false;
      saveResult(index, activityResults[index]);
      renderActivity(index);
    });
  }

  // ─── THINK-PAIR-SHARE ──────────────────────────────────────────────────────

  const TPS_PHASES = ['Think', 'Pair', 'Share'];
  const TPS_ICONS = ['🤔', '👥', '🗣️'];

  function playTone(frequency, duration) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) { /* audio unavailable */ }
  }

  function getTpsPhaseSeconds(activity, phaseIndex) {
    return [activity.thinkSeconds, activity.pairSeconds, activity.shareSeconds][phaseIndex] || 0;
  }

  function renderTPS(activity, index) {
    const result = activityResults[index];
    const phase = result.phase || 0;

    if (phase >= 3) {
      return `
        <div class="tps-prompt">${esc(activity.prompt)}</div>
        <div class="tps-complete">✓ Think-Pair-Share Complete</div>`;
    }

    const phaseSec = getTpsPhaseSeconds(activity, phase);
    const elapsed = result.elapsed || 0;
    const remaining = phaseSec === 0 ? null : Math.max(0, phaseSec - elapsed);

    const countdownHTML = remaining === null
      ? '<div class="tps-countdown">—</div>'
      : `<div class="tps-countdown${remaining <= 10 ? ' time-low' : ''}" id="tps-countdown-${index}">
          ${String(Math.floor(remaining / 60)).padStart(2,'0')}:${String(remaining % 60).padStart(2,'00')}
         </div>`;

    const nextLabel = phase < 2 ? `Next: ${TPS_PHASES[phase + 1]}` : 'Done';

    return `
      <div class="tps-prompt">${esc(activity.prompt)}</div>
      <div class="tps-phase-icon">${TPS_ICONS[phase]}</div>
      <div class="tps-phase-label">${TPS_PHASES[phase]}</div>
      ${countdownHTML}
      <button class="tps-next-btn" id="tps-next-${index}">${nextLabel}</button>`;
  }

  function bindTPS(index) {
    const activity = getActivities()[index];
    const result = activityResults[index];
    const phase = result.phase || 0;

    if (phase >= 3) return;

    const phaseSec = getTpsPhaseSeconds(activity, phase);

    if (phaseSec > 0) {
      tpsTimerInterval = setInterval(() => {
        result.elapsed = (result.elapsed || 0) + 1;
        if (result.elapsed >= phaseSec) {
          clearInterval(tpsTimerInterval);
          tpsTimerInterval = null;
          playTone(880, 0.3);
          result.elapsed = 0;
          result.phase = (result.phase || 0) + 1;
          saveResult(index, result);
          renderActivity(index);
          return;
        }
        saveResult(index, result);
        const display = document.getElementById(`tps-countdown-${index}`);
        if (display) {
          const rem = phaseSec - result.elapsed;
          display.textContent = `${String(Math.floor(rem / 60)).padStart(2,'0')}:${String(rem % 60).padStart(2,'00')}`;
          if (rem <= 10) display.classList.add('time-low');
        }
      }, 1000);
    }

    const nextBtn = document.getElementById(`tps-next-${index}`);
    if (nextBtn) nextBtn.addEventListener('click', () => {
      stopAllTimers();
      result.elapsed = 0;
      result.phase = (result.phase || 0) + 1;
      saveResult(index, result);
      playTone(660, 0.3);
      renderActivity(index);
    });
  }

  // ─── Public API ─────────────────────────────────────────────────────────────
  window.openEngage = openEngage;
  window.closeEngage = closeEngage;

  // ─── Init ───────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initEngage);
})();
