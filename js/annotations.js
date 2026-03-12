(function() {
  const canvas = document.getElementById('annotation-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let currentTool = 'circle'; // circle | underline | box | star
  let isDrawing = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;

  const toolColors = { circle:'#e05050', underline:'#4a80d0', box:'#4aad6a', star:'#e08030' };

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();

    // CUBES toolbar buttons (floating annotation toolbar)
    document.querySelectorAll('.cubes-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentTool = btn.dataset.cubes;
        document.querySelectorAll('.cubes-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    // CUBES toolbar buttons in main toolbar
    document.querySelectorAll('[data-cubes]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.dataset.cubes;
        if (tool === 'eliminate') {
          // Eliminate: add CSS strikethrough to clicked .mc-choice elements
          toggleEliminateMode();
          btn.classList.toggle('active');
          return;
        }
        // Other tools: activate annotation canvas
        const alreadyActive = btn.classList.contains('active');
        document.querySelectorAll('[data-cubes]').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.cubes-btn').forEach(b => b.classList.remove('active'));
        if (alreadyActive) {
          // Toggle off
          canvas.classList.remove('visible');
          document.getElementById('annotation-toolbar').classList.remove('visible');
          return;
        }
        currentTool = tool;
        btn.classList.add('active');
        // Sync floating toolbar
        document.querySelectorAll('.cubes-btn').forEach(b => b.classList.toggle('active', b.dataset.cubes === tool));
        canvas.classList.add('visible');
        document.getElementById('annotation-toolbar').classList.add('visible');
      });
    });

    // Clear button
    const btnClear = document.getElementById('btn-clear-annotations');
    if (btnClear) btnClear.addEventListener('click', clearAnnotations);

    // Canvas draw events
    if (canvas) {
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', drawMove);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mouseleave', endDraw);
      canvas.addEventListener('touchstart', (e) => { e.preventDefault(); const t = e.touches[0]; startDraw({ offsetX: t.clientX, offsetY: t.clientY }); });
      canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; drawMove({ offsetX: t.clientX, offsetY: t.clientY }); });
      canvas.addEventListener('touchend', endDraw);
    }
  });

  function startDraw(e) {
    if (!canvas.classList.contains('visible')) return;
    isDrawing = true;
    startX = e.offsetX; startY = e.offsetY;
    lastX = e.offsetX; lastY = e.offsetY;
  }

  function drawMove(e) {
    if (!isDrawing) return;
    const color = toolColors[currentTool] || '#e05050';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (currentTool === 'circle' || currentTool === 'box') {
      // For circle/box: redraw a preview each frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Re-draw all committed strokes... simplified: just draw current
      ctx.beginPath();
      if (currentTool === 'circle') {
        const rx = (e.offsetX - startX) / 2;
        const ry = (e.offsetY - startY) / 2;
        const cx = startX + rx;
        const cy = startY + ry;
        ctx.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), 0, 0, 2 * Math.PI);
      } else {
        ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
      }
      ctx.stroke();
    } else if (currentTool === 'underline') {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      lastX = e.offsetX; lastY = e.offsetY;
    }
  }

  function endDraw(e) {
    if (!isDrawing) return;
    isDrawing = false;
    const color = toolColors[currentTool] || '#e05050';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    if (currentTool === 'star' && e) {
      drawStar(ctx, e.offsetX || startX, e.offsetY || startY, 5, 18, 8, color);
    }
    // circle/box/underline already drawn in drawMove
  }

  function drawStar(ctx, cx, cy, spikes, outerR, innerR, color) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerR);
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
      rot += step;
      ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerR);
    ctx.closePath();
    ctx.fillStyle = color + 'aa';
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // ── Eliminate Mode ──
  let eliminateMode = false;
  function toggleEliminateMode() {
    eliminateMode = !eliminateMode;
    if (eliminateMode) {
      document.querySelectorAll('.mc-choice').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', eliminateChoice);
      });
    } else {
      document.querySelectorAll('.mc-choice').forEach(el => {
        el.style.cursor = '';
        el.removeEventListener('click', eliminateChoice);
      });
    }
  }
  function eliminateChoice(e) {
    e.currentTarget.classList.toggle('eliminated');
  }

  window.clearAnnotations = function() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelectorAll('mark').forEach(m => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
    document.querySelectorAll('.mc-choice.eliminated').forEach(el => el.classList.remove('eliminated'));
  };
})();
