// js/focus.js
// Focus Mode — zoom into a single activity with step-through navigation.
// Depends on: js/activities.js (buildActivities), js/cards.js (renderActivities),
//             UNIT global, window.currentDay

(function() {
  'use strict';

  let focusId = null;
  let currentStep = 0;
  let stepDefs = [];
  let anchorKey = '';
  var sessionAnchors = null;

  // ── Step definitions by activity type ──
  const STEPS = {
    'mc': [
      { label: 'Read Stem',     action: stepMcRead      },
      { label: 'CUBES Stem',    action: stepMcCubes     },
      { label: 'Eliminate 2',   action: stepMcEliminate },
      { label: 'Select Proven', action: stepMcSelect    },
      { label: 'Justify',       action: stepMcJustify   }
    ],
    'organizer': 'dynamic',  // handled by getStepDefs → buildOrganizerSteps
    'vocabulary': [
      { label: 'Word',            action: stepVocabWord },
      { label: 'Definition',      action: stepVocabDef },
      { label: 'Example + Frame', action: stepVocabFrame }
    ],
    'written-response': [
      { label: 'Prompt',          action: stepWrittenPrompt },
      { label: 'Frame',           action: stepWrittenFrame },
      { label: 'Model Response',  action: stepWrittenModel }
    ],
    'passage-annotation': [
      { label: 'Read',        action: stepPassageRead    },
      { label: 'CUBES Guide', action: stepPassageCubes   },
      { label: 'Annotate',    action: stepPassageAnnotate }
    ]
  };

  // ── Attention anchor text per step (I3) ──
  const STEP_ANCHORS = {
    'mc':                           ['Read the Stem', 'Annotate with CUBES', 'Eliminate 2 Choices', 'Select Your Answer', 'Justify Your Choice'],
    'vocabulary':                   ['Read the Word',         'Read the Definition',  'Write an Example'],
    'written-response':             ['Read the Prompt',       'Build Your Response',  'Check the Model'],
    'passage-annotation':           ['Read the Passage', 'Review CUBES Guide', 'Annotate the Passage'],
    'organizer':                    []  // built dynamically in enterFocusMode
  };

  // ── Public API ──
  window.enterFocusMode = enterFocusMode;
  window.exitFocusMode  = exitFocusMode;

  // ── Init ──
  document.addEventListener('DOMContentLoaded', initFocus);

  function initFocus() {
    const backBtn  = document.getElementById('focus-back-btn');
    const prevBtn  = document.getElementById('focus-prev-btn');
    const nextBtn  = document.getElementById('focus-next-btn');

    if (backBtn) backBtn.addEventListener('click', exitFocusMode);
    if (prevBtn) prevBtn.addEventListener('click', prevStep);
    // nextBtn click is managed via onclick assignment in updateStepUI

    // Toolbar-level Focus button — focuses topmost visible activity
    const btnFocusTop = document.getElementById('btn-focus');
    if (btnFocusTop) {
      btnFocusTop.addEventListener('click', () => {
        const activities = Array.from(document.querySelectorAll('.activity'));
        const topmost = activities.find(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top < window.innerHeight;
        });
        if (topmost && topmost.dataset.activityId) {
          enterFocusMode(topmost.dataset.activityId);
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    // F — enter focus on topmost visible activity (works even when not in focus mode)
    if (e.key === 'f' || e.key === 'F') {
      if (!focusId) {
        const activities = Array.from(document.querySelectorAll('.activity'));
        const topmost = activities.find(el => {
          const rect = el.getBoundingClientRect();
          return rect.top >= 0 && rect.top < window.innerHeight;
        });
        if (topmost && topmost.dataset.activityId) enterFocusMode(topmost.dataset.activityId);
      }
      return;
    }
    if (!focusId) return;
    if (e.key === 'Escape')      { exitFocusMode(); return; }
    if (e.key === 'ArrowRight' || e.code === 'Space') { e.preventDefault(); nextStep(); }
    if (e.key === 'ArrowLeft')   { e.preventDefault(); prevStep(); }
  }

  // ── Enter / Exit ──
  function enterFocusMode(id) {
    focusId = id;
    currentStep = 0;

    // Determine step set
    const activityEl = document.querySelector(`[data-activity-id="${id}"]`);
    if (!activityEl) return;

    const type = getActivityType(activityEl);
    stepDefs = getStepDefs(activityEl, type);

    // Build dynamic anchors for organizer type
    if (type === 'organizer') {
      var rows = activityEl.querySelectorAll('.org-card-row');
      var dynamicAnchors = [];
      rows.forEach(function(row) {
        var badge = row.querySelector('.org-card-phase-badge');
        dynamicAnchors.push(badge ? badge.textContent.trim() : 'Current Row');
      });
      dynamicAnchors.push('Confirm Your Responses');
      sessionAnchors = dynamicAnchors;
    }

    // Compute anchor key for STEP_ANCHORS lookup
    if (type === 'organizer-row') {
      const grClass = Array.from(activityEl.classList).find(c =>
        ['activity--i-do','activity--we-do','activity--you-do-partner','activity--you-do'].includes(c)
      );
      const grKey = grClass ? grClass.replace('activity--', '') : 'we-do';
      anchorKey = 'organizer-row-' + grKey;
    } else if (type === 'organizer') {
      anchorKey = 'organizer';
    } else {
      anchorKey = type || '';
    }

    // Dim all others
    document.querySelectorAll('.activity').forEach(el => {
      if (el.dataset.activityId !== id) el.classList.add('activity-dimmed');
    });
    activityEl.classList.add('activity-focused');
    document.body.classList.add('focus-mode');
    // CSS body.focus-mode rules show .focus-header and .focus-nav automatically

    runStep(currentStep);
  }

  function exitFocusMode() {
    const completedId = focusId;   // capture BEFORE reset
    focusId = null;
    currentStep = 0;
    stepDefs = [];
    anchorKey = '';
    sessionAnchors = null;

    document.querySelectorAll('.activity').forEach(el => {
      el.classList.remove('activity-dimmed', 'activity-focused');
    });
    document.body.classList.remove('focus-mode');

    // Clear attention anchor
    const anchorEl = document.getElementById('focus-attention-anchor');
    if (anchorEl) anchorEl.textContent = '';

    // Clear MC stem CUBES outline
    document.querySelectorAll('.mc-annotatable-stem').forEach(function(s) { s.style.outline = ''; s.style.outlineOffset = ''; });

    // Restore any mutated instruction elements
    document.querySelectorAll('.activity-instruction[data-original-text]').forEach(function(el) {
      el.textContent = el.dataset.originalText;
      el.style.color = '';
      delete el.dataset.originalText;
    });

    // Mark completed activity done
    if (completedId && typeof window.markActivityDone === 'function') {
      window.markActivityDone(completedId);
    }
  }

  // ── Step navigation ──
  function nextStep() {
    if (currentStep < stepDefs.length - 1) { currentStep++; runStep(currentStep); }
  }
  function prevStep() {
    if (currentStep > 0) { currentStep--; runStep(currentStep); }
  }

  function runStep(stepIndex) {
    const step = stepDefs[stepIndex];
    if (!step) return;

    updateStepUI(stepIndex);
    const activityEl = document.querySelector(`[data-activity-id="${focusId}"]`);
    if (activityEl && step.action) step.action(activityEl, stepIndex);
  }

  function updateStepUI(stepIndex) {
    const total = stepDefs.length;

    // Step label
    const labelEl = document.getElementById('focus-step-label');
    if (labelEl) labelEl.textContent = `Step ${stepIndex + 1} of ${total} — ${stepDefs[stepIndex].label}`;

    // Step info in nav
    const infoEl = document.getElementById('focus-step-info');
    if (infoEl) infoEl.textContent = `${stepDefs[stepIndex].label}`;

    // Dots
    const dotsEl = document.getElementById('focus-step-dots');
    if (dotsEl) {
      dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
        `<div class="focus-dot${i < stepIndex ? ' done' : i === stepIndex ? ' active' : ''}"></div>`
      ).join('');
    }

    // Attention anchor (I3)
    const anchorEl = document.getElementById('focus-attention-anchor');
    if (anchorEl) {
      const anchors = (sessionAnchors && anchorKey === 'organizer') ? sessionAnchors : (STEP_ANCHORS[anchorKey] || []);
      anchorEl.textContent = anchors[stepIndex] || stepDefs[stepIndex].label;
    }

    // Card step dots (H3)
    if (focusId) {
      const cardEl = document.querySelector(`[data-activity-id="${focusId}"]`);
      if (cardEl) {
        cardEl.querySelectorAll('.step-dot').forEach((dot, i) => {
          dot.classList.toggle('step-dot--active', i === stepIndex);
          dot.classList.toggle('step-dot--done',   i < stepIndex);
        });
      }
    }

    // Prev/Next buttons
    const prevBtn = document.getElementById('focus-prev-btn');
    const nextBtn = document.getElementById('focus-next-btn');
    if (prevBtn) prevBtn.disabled = stepIndex === 0;
    if (nextBtn) {
      nextBtn.textContent = stepIndex === total - 1 ? 'Done ✓' : 'Next →';
      nextBtn.onclick = stepIndex === total - 1 ? exitFocusMode : nextStep;
    }
  }

  // ── Helpers ──
  function getActivityType(el) {
    const classes = Array.from(el.classList);
    const typeClass = classes.find(c => c.startsWith('activity--') && !c.includes('i-do') && !c.includes('we-do') && !c.includes('you-do'));
    return typeClass ? typeClass.replace('activity--', '') : null;
  }

  function getStepDefs(el, type) {
    if (!type) return [{ label: 'View', action: function() {} }];
    if (type === 'organizer') {
      return buildOrganizerSteps(el);
    }
    return STEPS[type] || [{ label: 'View', action: function() {} }];
  }

  function buildOrganizerSteps(el) {
    var rows = el.querySelectorAll('.org-card-row');
    var steps = [];
    rows.forEach(function(row, i) {
      var badge = row.querySelector('.org-card-phase-badge');
      var label = badge ? badge.textContent.trim() : ('Row ' + (i + 1));
      steps.push({
        label: label,
        action: function(actEl, stepIdx) { stepOrgRow(actEl, stepIdx); }
      });
    });
    steps.push({ label: 'Confirm', action: stepOrgRowConfirm });
    return steps;
  }

  // ── Step action functions ──

  // MC steps
  function stepMcRead(el) {
    el.querySelectorAll('.mc-annotatable-stem').forEach(function(s) { s.style.outline = ''; s.style.outlineOffset = ''; });
    el.querySelectorAll('.mc-stop-badge').forEach(function(l) { l.classList.add('mc-stop-badge--hidden'); });
    el.querySelectorAll('.mc-option-wrap').forEach(function(b) { b.classList.remove('mc-option--selected'); });
  }
  function stepMcCubes(el) {
    el.querySelectorAll('.mc-annotatable-stem').forEach(function(s) {
      s.style.outline = '2px dashed var(--day-accent)';
      s.style.outlineOffset = '4px';
    });
  }
  function stepMcEliminate(el) {
    el.querySelectorAll('.mc-annotatable-stem').forEach(function(s) { s.style.outline = ''; });
    el.querySelectorAll('.mc-stop-elim-btn').forEach(function(b) { b.style.opacity = '1'; });
  }
  function stepMcSelect(el) {
    var list = el.querySelector('.mc-options-list');
    if (list && list.dataset.state === 'eliminating') {
      var instruction = el.querySelector('.activity-instruction:last-of-type');
      if (instruction) instruction.style.color = '#fbbf24';
    }
  }
  function stepMcJustify(el) {
    var list = el.querySelector('.mc-options-list');
    var state = list ? list.dataset.state : '';
    var justWrap = el.querySelector('.mc-justify-wrap');
    if (justWrap && (state === 'justifying' || state === 'confirmed')) {
      justWrap.style.display = '';
      var inp = justWrap.querySelector('.mc-justify-input');
      if (inp && state === 'justifying') inp.focus();
      var instruction = el.querySelector('.activity-instruction');
      if (instruction && instruction.dataset.originalText) {
        instruction.textContent = instruction.dataset.originalText;
        instruction.style.color = '';
      }
    } else if (justWrap) {
      var instruction = el.querySelector('.activity-instruction');
      if (instruction) {
        if (!instruction.dataset.originalText) {
          instruction.dataset.originalText = instruction.textContent;
        }
        instruction.style.color = '#fbbf24';
        instruction.textContent = '⚠️ Eliminate 2 choices and select your Proven answer first.';
      }
    }
  }

  // Organizer steps (consolidated organizer card — all GR rows)
  function stepOrgRow(el, stepIdx) {
    el.querySelectorAll('.org-card-row').forEach(function(row, i) {
      row.classList.toggle('org-card-row--focused', i === stepIdx);
    });
  }
  function stepOrgRowConfirm(el) {
    el.querySelectorAll('.org-card-row').forEach(function(row) {
      row.classList.remove('org-card-row--focused');
    });
    el.querySelectorAll('.org-card-cell--prefilled').forEach(function(c) {
      c.style.opacity = '1';
    });
  }

  // Vocabulary steps — uses class names added by buildVocabBody in cards.js
  function stepVocabWord(el) {
    el.querySelectorAll('.vocab-def, .vocab-example, .vocab-esol-frame').forEach(c => c.style.display = 'none');
  }
  function stepVocabDef(el) {
    el.querySelectorAll('.vocab-def').forEach(c => c.style.display = '');
  }
  function stepVocabFrame(el) {
    el.querySelectorAll('.vocab-example, .vocab-esol-frame').forEach(c => c.style.display = '');
  }

  // Written response steps — single .activity-race-frame; CSS handles race/cer label swap
  function stepWrittenPrompt(el) {
    el.querySelectorAll('.activity-race-frame').forEach(f => f.style.display = 'none');
    el.querySelectorAll('.written-model').forEach(m => m.style.display = 'none');
  }
  function stepWrittenFrame(el) {
    el.querySelectorAll('.activity-race-frame').forEach(f => f.style.display = 'block');
    // CSS body.cer-active already swaps .race-labels/.cer-labels inside the frame
  }
  function stepWrittenModel(el) {
    el.querySelectorAll('.written-model').forEach(m => m.style.display = 'block');
  }

  // Passage annotation steps (3 steps)
  function stepPassageRead(el) {
    el.querySelectorAll('.cubes-guide').forEach(function(g) { g.style.display = 'none'; });
  }
  function stepPassageCubes(el) {
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = '');
  }
  function stepPassageAnnotate() {
    const drawerTab = document.getElementById('passage-drawer-tab');
    if (drawerTab) drawerTab.click();
  }

})();
