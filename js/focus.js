// js/focus.js
// Focus Mode — zoom into a single activity with step-through navigation.
// Depends on: js/activities.js (buildActivities), js/cards.js (renderActivities),
//             UNIT global, window.currentDay

(function() {
  'use strict';

  let focusId = null;
  let currentStep = 0;
  let stepDefs = [];

  // ── Step definitions by activity type ──
  const STEPS = {
    'mc': [
      { label: 'Read',            action: stepMcRead },
      { label: 'Apply Strategy',  action: stepMcStrategy },
      { label: 'Interact',        action: stepMcInteract },
      { label: 'Confirm',         action: stepMcConfirm }
    ],
    'organizer-row-i-do': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'Teacher Models',  action: stepOrgIDoModel }
    ],
    'organizer-row-we-do': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'I Do Example',    action: stepOrgIDoModel },
      { label: 'Student Responds',action: stepOrgStudentFill },
      { label: 'Confirm',         action: stepOrgConfirm }
    ],
    'organizer-row-you-do': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'Student Responds',action: stepOrgStudentFill },
      { label: 'Confirm',         action: stepOrgConfirm }
    ],
    'organizer-row-you-do-partner': [
      { label: 'Read',            action: stepOrgRead },
      { label: 'Partner Practice',action: stepOrgStudentFill },
      { label: 'Confirm',         action: stepOrgConfirm }
    ],
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
      { label: 'Read ¶1–3',       action: stepPassageRead },
      { label: 'Read ¶4–6',       action: stepPassageRead2 },
      { label: 'CUBES Guide',     action: stepPassageCubes },
      { label: 'Annotate',        action: stepPassageAnnotate }
    ]
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
    if (nextBtn) nextBtn.addEventListener('click', nextStep);

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
    focusId = null;
    currentStep = 0;
    stepDefs = [];

    document.querySelectorAll('.activity').forEach(el => {
      el.classList.remove('activity-dimmed', 'activity-focused');
    });
    document.body.classList.remove('focus-mode');
    // CSS body.focus-mode removal hides .focus-header and .focus-nav automatically
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
    if (!type) return [{ label: 'View', action: () => {} }];
    if (type === 'organizer-row') {
      const grClass = Array.from(el.classList).find(c =>
        ['activity--i-do','activity--we-do','activity--you-do-partner','activity--you-do'].includes(c)
      );
      const grKey = grClass ? grClass.replace('activity--', '') : 'we-do';
      return STEPS['organizer-row-' + grKey] || STEPS['organizer-row-we-do'];
    }
    return STEPS[type] || [{ label: 'View', action: () => {} }];
  }

  // ── Step action functions ──

  // MC steps
  function stepMcRead(el) {
    el.querySelectorAll('.mc-stop-label').forEach(l => l.style.opacity = '0');
    el.querySelectorAll('.mc-option-btn').forEach(b => { b.disabled = false; b.classList.remove('mc-selected'); });
  }
  function stepMcStrategy(el) {
    el.querySelectorAll('.mc-stop-label').forEach(l => l.style.opacity = '1');
    if (document.body.classList.contains('cubes-active')) {
      const drawerTab = document.getElementById('passage-drawer-tab');
      if (drawerTab) drawerTab.click();
    }
  }
  function stepMcInteract(el) {
    el.querySelectorAll('.mc-option-btn').forEach(btn => {
      btn.disabled = false;
      btn.onclick = () => {
        el.querySelectorAll('.mc-option-btn').forEach(b => b.classList.remove('mc-selected'));
        btn.classList.add('mc-selected');
      };
    });
  }
  function stepMcConfirm(el) {
    el.querySelectorAll('.mc-answer-correct').forEach(b => b.classList.add('mc-correct'));
    el.querySelectorAll('.written-model').forEach(m => m.style.display = 'block');
  }

  // Organizer steps
  function stepOrgRead(el) {
    el.querySelectorAll('.org-cell-content, .org-cell-placeholder').forEach(c => c.style.outline = '');
  }
  function stepOrgIDoModel(el) {
    el.querySelectorAll('.exemplar-text').forEach(c => c.style.opacity = '1');
  }
  function stepOrgStudentFill(el) {
    el.querySelectorAll('.org-cell-placeholder').forEach(c => {
      c.style.outline = '2px dashed var(--accent)';
      c.style.outlineOffset = '2px';
    });
  }
  function stepOrgConfirm(el) {
    el.querySelectorAll('.exemplar-text').forEach(c => c.style.opacity = '1');
    el.querySelectorAll('.org-cell-placeholder').forEach(c => c.style.outline = '');
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

  // Passage annotation steps (4 steps per spec)
  function stepPassageRead(el) {
    // Step 1: Read ¶1–3 — hide CUBES guide; first half of passage visible
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = 'none');
  }
  function stepPassageRead2(el) {
    // Step 2: Read ¶4–6 — continue reading; passage already visible
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = 'none');
  }
  function stepPassageCubes(el) {
    el.querySelectorAll('.cubes-guide').forEach(g => g.style.display = '');
  }
  function stepPassageAnnotate() {
    const drawerTab = document.getElementById('passage-drawer-tab');
    if (drawerTab) drawerTab.click();
  }

})();
