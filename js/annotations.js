(function() {
  const canvas = document.getElementById('annotation-canvas');
  const annotToolbar = document.getElementById('annotation-toolbar');
  const ctx = canvas ? canvas.getContext('2d') : null;

  let isAnnotating = false;
  let isHighlighting = false;
  let isDrawing = false;
  let currentColor = '#e05050';
  let lastX = 0, lastY = 0;

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();

    // Color picker
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentColor = btn.dataset.color;
        document.querySelectorAll('.color-btn').forEach(b => b.classList.toggle('active', b === btn));
      });
    });

    // Toggle annotate mode
    const btnAnnotate = document.getElementById('btn-annotate');
    if (btnAnnotate) {
      btnAnnotate.addEventListener('click', () => {
        isAnnotating = !isAnnotating;
        if (isAnnotating) isHighlighting = false;
        btnAnnotate.classList.toggle('active', isAnnotating);
        canvas.classList.toggle('visible', isAnnotating);
        annotToolbar.classList.toggle('visible', isAnnotating);
        document.getElementById('btn-highlight').classList.remove('active');
      });
    }

    // Toggle highlight mode
    const btnHighlight = document.getElementById('btn-highlight');
    if (btnHighlight) {
      btnHighlight.addEventListener('click', () => {
        isHighlighting = !isHighlighting;
        if (isHighlighting) {
          isAnnotating = false;
          canvas.classList.remove('visible');
          annotToolbar.classList.remove('visible');
          document.getElementById('btn-annotate').classList.remove('active');
          enableTextHighlight();
        } else {
          disableTextHighlight();
        }
        btnHighlight.classList.toggle('active', isHighlighting);
      });
    }

    // Clear
    const btnClear = document.getElementById('btn-clear-annotations');
    if (btnClear) btnClear.addEventListener('click', clearAnnotations);

    // Canvas draw events
    if (canvas) {
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mouseleave', endDraw);
      canvas.addEventListener('touchstart', (e) => { e.preventDefault(); const t = e.touches[0]; startDraw({offsetX: t.clientX, offsetY: t.clientY}); });
      canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; draw({offsetX: t.clientX, offsetY: t.clientY}); });
      canvas.addEventListener('touchend', endDraw);
    }
  });

  function startDraw(e) {
    if (!isAnnotating) return;
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function draw(e) {
    if (!isDrawing || !isAnnotating) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  function endDraw() { isDrawing = false; }

  function enableTextHighlight() {
    document.querySelectorAll('.passage-para').forEach(el => {
      el.style.cursor = 'text';
    });
    document.addEventListener('mouseup', applyHighlight);
  }

  function disableTextHighlight() {
    document.querySelectorAll('.passage-para').forEach(el => el.style.cursor = '');
    document.removeEventListener('mouseup', applyHighlight);
  }

  function applyHighlight() {
    if (!isHighlighting) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    // Only highlight within passage text
    const passageText = document.getElementById('passage-text');
    if (!passageText || !passageText.contains(range.commonAncestorContainer)) return;
    const mark = document.createElement('mark');
    mark.style.background = currentColor + '55'; // semi-transparent
    mark.style.color = 'inherit';
    try { range.surroundContents(mark); } catch(e) {}
    sel.removeAllRanges();
  }

  window.clearAnnotations = function() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Remove highlight marks
    document.querySelectorAll('mark').forEach(m => {
      const parent = m.parentNode;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
    });
  };
})();
