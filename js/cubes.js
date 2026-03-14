// js/cubes.js
// CUBES annotation engine for passage text and MC stems.
// Depends on: UNIT.meta.id (for sessionStorage key), esc() from cards.js

(function() {
  'use strict';

  var STORAGE_KEY = 'cubes-annots-' + ((window.UNIT && UNIT.meta && UNIT.meta.id) || 'unit');
  var toolbarEl = null;
  var activeRange = null;

  // ── Init: called after page renders ──
  function init() {
    toolbarEl = createToolbar();
    document.body.appendChild(toolbarEl);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    document.addEventListener('mousedown', onMouseDown);
    restoreAnnotations();
  }

  // ── Toolbar ──
  function createToolbar() {
    var el = document.createElement('div');
    el.className = 'cubes-toolbar';
    el.style.display = 'none';
    el.innerHTML =
      '<button class="cubes-btn" data-cubes="C" title="Circle — unknown word">C</button>' +
      '<button class="cubes-btn" data-cubes="U" title="Underline — key phrase">U</button>' +
      '<button class="cubes-btn" data-cubes="B" title="Box — turning point">B</button>' +
      '<button class="cubes-btn" data-cubes="E" title="Exclamation — surprising detail">!</button>' +
      '<button class="cubes-btn" data-cubes="S" title="Star — reveals theme">★</button>' +
      '<button class="cubes-btn cubes-btn--clear" data-cubes="clear" title="Clear annotation">✕</button>';
    el.querySelectorAll('[data-cubes]').forEach(function(btn) {
      btn.addEventListener('mousedown', function(e) {
        e.preventDefault(); // prevent selection loss
        applyAnnotation(btn.dataset.cubes);
      });
    });
    return el;
  }

  function showToolbar(x, y) {
    toolbarEl.style.display = 'flex';
    // Keep toolbar within viewport
    var tbW = toolbarEl.offsetWidth || 200;
    var left = Math.min(x, window.innerWidth - tbW - 10);
    toolbarEl.style.left = Math.max(left, 10) + 'px';
    toolbarEl.style.top  = (y - 44) + 'px';
  }

  function hideToolbar() {
    toolbarEl.style.display = 'none';
    activeRange = null;
  }

  // ── Selection handling ──
  function onMouseUp(e) {
    // Give the browser a tick to finalize the selection
    setTimeout(function() {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        return;
      }
      var range = sel.getRangeAt(0);
      var container = range.commonAncestorContainer;
      var annotatable = findAnnotatable(container);
      if (!annotatable) { hideToolbar(); return; }

      activeRange = range.cloneRange();
      var rect = range.getBoundingClientRect();
      showToolbar(rect.left + window.scrollX + rect.width / 2 - 80, rect.top + window.scrollY);
    }, 10);
  }

  function onMouseDown(e) {
    if (e.target.closest('.cubes-toolbar')) return;
    hideToolbar();
  }

  function findAnnotatable(node) {
    var el = node.nodeType === 3 ? node.parentElement : node;
    return el.closest('.cubes-annotatable');
  }

  // ── Apply annotation ──
  function applyAnnotation(type) {
    if (!activeRange) return;
    var sel = window.getSelection();

    if (type === 'clear') {
      // Find any cubes <mark> that contains or overlaps the current selection (activeRange).
      // Walk up from the range's start container to find a mark to unwrap.
      if (activeRange) {
        var node = activeRange.startContainer;
        var el = node.nodeType === 3 ? node.parentElement : node;
        var mark = el.closest('mark.cubes-c, mark.cubes-u, mark.cubes-b');
        if (mark) {
          var parent = mark.parentNode;
          while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
          parent.removeChild(mark);
        }
      }
      hideToolbar();
      saveAnnotations();
      return;
    }

    if (type === 'C' || type === 'U' || type === 'B') {
      // Inline wrap: surround selection with a <mark class="cubes-X">
      var mark = document.createElement('mark');
      mark.className = 'cubes-' + type.toLowerCase();
      try {
        activeRange.surroundContents(mark);
      } catch(ex) {
        // Selection spans multiple nodes — use extractContents
        mark.appendChild(activeRange.extractContents());
        activeRange.insertNode(mark);
      }
      if (sel) sel.removeAllRanges();
    } else if (type === 'E' || type === 'S') {
      // Paragraph-level annotation: insert marker at end of the containing .passage-para
      var paraEl = findParagraph(activeRange.commonAncestorContainer);
      if (paraEl) {
        if (type === 'E') {
          insertExclamation(paraEl);
        } else {
          insertStar(paraEl);
        }
      }
      if (sel) sel.removeAllRanges();
    }

    hideToolbar();
    saveAnnotations();
  }

  function findParagraph(node) {
    var el = node.nodeType === 3 ? node.parentElement : node;
    return el.closest('.passage-para');
  }

  function insertExclamation(paraEl) {
    // Avoid duplicate
    if (paraEl.querySelector('.cubes-e-marker')) return;
    var marker = document.createElement('span');
    marker.className = 'cubes-e-marker';
    marker.textContent = ' !';
    paraEl.appendChild(marker);
    // Also add a small annotation note after the para
    var note = document.createElement('div');
    note.className = 'cubes-e-note';
    note.innerHTML = '<span class="cubes-note-label">!</span><input class="cubes-note-input" placeholder="Note about surprising detail…" />';
    paraEl.parentNode.insertBefore(note, paraEl.nextSibling);
    note.querySelector('.cubes-note-input').addEventListener('change', saveAnnotations);
  }

  function insertStar(paraEl) {
    if (paraEl.querySelector('.cubes-s-marker')) return;
    var marker = document.createElement('span');
    marker.className = 'cubes-s-marker';
    marker.textContent = ' ★';
    paraEl.appendChild(marker);
    var note = document.createElement('div');
    note.className = 'cubes-s-note';
    note.innerHTML = '<span class="cubes-note-label">★</span><input class="cubes-note-input" placeholder="Theme/summary note…" />';
    paraEl.parentNode.insertBefore(note, paraEl.nextSibling);
    note.querySelector('.cubes-note-input').addEventListener('change', saveAnnotations);
  }

  // ── sessionStorage persistence ──
  // Saves: passage innerHTML + all MC stem annotations (keyed by activity id)
  function saveAnnotations() {
    var passageEl = document.getElementById('passage-text');
    if (passageEl) {
      try { sessionStorage.setItem(STORAGE_KEY + '-passage', passageEl.innerHTML); } catch(e) {}
    }
    // Save MC stem annotations
    document.querySelectorAll('[data-activity-id]').forEach(function(card) {
      var stem = card.querySelector('.mc-annotatable-stem');
      if (stem) {
        var id = card.dataset.activityId;
        try { sessionStorage.setItem(STORAGE_KEY + '-stem-' + id, stem.innerHTML); } catch(e) {}
      }
    });
  }

  function restoreAnnotations() {
    // Restore passage — only if #passage-text exists in the current DOM
    var passageEl = document.getElementById('passage-text');
    if (passageEl) {
      var savedPassage = sessionStorage.getItem(STORAGE_KEY + '-passage');
      if (savedPassage) {
        passageEl.innerHTML = savedPassage;
        passageEl.querySelectorAll('.cubes-note-input').forEach(function(inp) {
          inp.addEventListener('change', saveAnnotations);
        });
      }
    }
    // Restore MC stem annotations
    document.querySelectorAll('[data-activity-id]').forEach(function(card) {
      var stem = card.querySelector('.mc-annotatable-stem');
      if (stem) {
        var id = card.dataset.activityId;
        var savedStem = sessionStorage.getItem(STORAGE_KEY + '-stem-' + id);
        if (savedStem) stem.innerHTML = savedStem;
      }
    });
  }

  // ── Expose clear function for Reset button (optional) ──
  window.clearCubesAnnotations = function() {
    sessionStorage.removeItem(STORAGE_KEY);
    var passageEl = document.getElementById('passage-text');
    if (passageEl) {
      // Rebuild from UNIT.passage
      passageEl.innerHTML = (UNIT.passage || []).map(function(p) {
        return '<p class="passage-para"><span class="para-num">[' + p.number + ']</span>' + esc(p.text) + '</p>';
      }).join('');
    }
  };

  // ── Auto-init when DOM is ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Wrap renderDayContent (defined in cards.js) so annotations restore after every day switch.
  // Load order: cubes.js loads after cards.js, so window.renderDayContent is already defined here.
  var _origRender = window.renderDayContent;
  window.renderDayContent = function(day) {
    if (_origRender) _origRender(day);
    // Use double-requestAnimationFrame to guarantee the DOM is painted before restore.
    requestAnimationFrame(function() {
      requestAnimationFrame(restoreAnnotations);
    });
  };

})();
