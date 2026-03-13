// js/passage-drawer.js
// Passage drawer — open/close, populate on day switch, CUBES annotation inside.

(function() {
  'use strict';

  let drawerCanvasInitialized = false;

  document.addEventListener('DOMContentLoaded', initDrawer);

  function initDrawer() {
    const drawer  = document.getElementById('passage-drawer');
    const tab     = document.getElementById('passage-drawer-tab');
    const closeBtn= document.getElementById('passage-drawer-close');

    if (tab)      tab.addEventListener('click', toggleDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Line numbers toggle inside drawer
    const btnLineNums = document.getElementById('btn-line-numbers-drawer');
    if (btnLineNums) btnLineNums.addEventListener('click', () => {
      document.body.classList.toggle('line-numbers');
      btnLineNums.classList.toggle('active');
    });

    // Read aloud inside drawer
    const btnAloud = document.getElementById('btn-read-aloud-drawer');
    if (btnAloud) btnAloud.addEventListener('click', () => {
      if (window.speechSynthesis && window.speechSynthesis.speaking) { window.speechSynthesis.cancel(); btnAloud.classList.remove('active'); return; }
      const body = document.getElementById('passage-text-drawer');
      if (!body) return;
      const text = body.innerText || body.textContent || '';
      if (!text.trim()) return;
      if (!window.speechSynthesis) return;
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.9;
      utt.onend = () => btnAloud.classList.remove('active');
      window.speechSynthesis.speak(utt);
      btnAloud.classList.add('active');
    });

    // Clear canvas button
    const clearBtn = document.getElementById('passage-clear-canvas');
    if (clearBtn) clearBtn.addEventListener('click', clearDrawerCanvas);

    // CUBES drawer tool buttons
    const drawerCanvas = document.getElementById('passage-drawer-canvas');
    document.querySelectorAll('[data-cubes-drawer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.cubesDrawer;
        document.querySelectorAll('[data-cubes-drawer]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (drawerCanvas && typeof window.setDrawerTool === 'function') window.setDrawerTool(tool);
      });
    });
  }

  // Called by nav.js after day switch
  window.populatePassageDrawer = function(day) {
    const body = document.getElementById('passage-text-drawer');
    if (!body) return;

    if (typeof UNIT === 'undefined') return;
    const dayData = UNIT.days[day];
    const passage = dayData && dayData.textPassage;

    if (!passage || !passage.paragraphs || !passage.paragraphs.length) {
      body.innerHTML = '<p class="passage-drawer-empty">No passage for this day.</p>';
      return;
    }

    function esc(str) {
      return String(str || '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    body.innerHTML = passage.paragraphs.map(p =>
      `<p class="passage-para"><span class="para-num">[${esc(String(p.number))}]</span>${esc(p.text)}</p>`
    ).join('');

    // Resize canvas to match body
    resizeDrawerCanvas();
  };

  function toggleDrawer() {
    const drawer = document.getElementById('passage-drawer');
    if (!drawer) return;
    const opening = !drawer.classList.contains('passage-drawer--open');
    drawer.classList.toggle('passage-drawer--open', opening);

    if (opening && !drawerCanvasInitialized) {
      drawerCanvasInitialized = true;
      if (typeof window.initAnnotations === 'function') window.initAnnotations('passage-drawer-canvas');
    }
    if (opening) resizeDrawerCanvas();

    // Show CUBES toolbar when opening
    const cubesToolbar = document.getElementById('passage-cubes-toolbar');
    if (cubesToolbar) cubesToolbar.classList.toggle('visible', opening);
  }

  function closeDrawer() {
    const drawer = document.getElementById('passage-drawer');
    if (drawer) drawer.classList.remove('passage-drawer--open');
    const cubesToolbar = document.getElementById('passage-cubes-toolbar');
    if (cubesToolbar) cubesToolbar.classList.remove('visible');
  }

  function resizeDrawerCanvas() {
    const canvas = document.getElementById('passage-drawer-canvas');
    const body   = document.getElementById('passage-text-drawer');
    if (!canvas || !body) return;
    const rect = body.getBoundingClientRect();
    canvas.width  = rect.width;
    canvas.height = body.scrollHeight;
    canvas.style.width  = rect.width + 'px';
    canvas.style.height = body.scrollHeight + 'px';
  }

  function clearDrawerCanvas() {
    const canvas = document.getElementById('passage-drawer-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener('resize', resizeDrawerCanvas);

})();
