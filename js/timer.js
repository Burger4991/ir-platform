(function() {
  let totalSeconds = 4 * 60;
  let remaining = totalSeconds;
  let intervalId = null;
  let isRunning = false;

  const display = document.getElementById('timer-value');
  const overlay = document.getElementById('timer-overlay');
  const playBtn = document.getElementById('timer-play');
  const resetBtn = document.getElementById('timer-reset');
  const editBtn = document.getElementById('timer-edit');
  const editInput = document.getElementById('timer-edit-input');
  const timerDisplayBtn = document.getElementById('timer-display');

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  function updateDisplay() {
    const t = formatTime(remaining);
    display.textContent = t;
    overlay.textContent = t;
    overlay.classList.toggle('urgent', remaining <= 30 && remaining > 0);
    if (remaining === 0) {
      overlay.textContent = '0:00 ⏰';
      stop();
      playAlarm();
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    playBtn.textContent = '⏸';
    timerDisplayBtn.classList.add('timer-running');
    // Show overlay in projection mode
    if (document.body.classList.contains('projection-mode')) overlay.classList.add('visible');
    intervalId = setInterval(() => { remaining--; updateDisplay(); }, 1000);
  }

  function stop() {
    isRunning = false;
    playBtn.textContent = '▶';
    timerDisplayBtn.classList.remove('timer-running');
    clearInterval(intervalId);
    intervalId = null;
  }

  function reset() {
    stop();
    remaining = totalSeconds;
    updateDisplay();
    overlay.classList.remove('visible');
  }

  function playAlarm() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.start(); osc.stop(ctx.currentTime + 1.5);
    } catch(e) {}
  }

  function parseInput(val) {
    val = val.trim();
    if (val.includes(':')) {
      const [m, s] = val.split(':').map(Number);
      return (m || 0) * 60 + (s || 0);
    }
    const n = parseInt(val);
    if (!isNaN(n)) return n * 60; // treat plain number as minutes
    return null;
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();

    playBtn.addEventListener('click', () => isRunning ? stop() : start());
    resetBtn.addEventListener('click', reset);
    timerDisplayBtn.addEventListener('click', () => isRunning ? stop() : start());

    editBtn.addEventListener('click', () => {
      editInput.style.display = editInput.style.display === 'none' ? 'inline-block' : 'none';
      if (editInput.style.display !== 'none') {
        editInput.value = formatTime(remaining);
        editInput.focus(); editInput.select();
      }
    });

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const secs = parseInput(editInput.value);
        if (secs !== null && secs > 0) {
          stop(); totalSeconds = secs; remaining = secs; updateDisplay();
        }
        editInput.style.display = 'none';
      }
      if (e.key === 'Escape') { editInput.style.display = 'none'; }
    });

    // Space bar shortcut
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); isRunning ? stop() : start(); }
      if (e.key === 'r' || e.key === 'R') reset();
    });
  });

  // Expose for projection mode toggle
  window.timerShowOverlay = (show) => {
    if (show && isRunning) overlay.classList.add('visible');
    else overlay.classList.remove('visible');
  };
})();
