// js/activities.js
// Adapter: converts a data.js day object into an ordered Activity array.
// Activity order: passage-annotation first (I Do context), then bellringers,
// comprehensionMC, organizer, vocabulary, assessmentMC, written-response last.

function buildActivities(dayData) {
  if (!dayData) return [];
  const activities = [];

  // ── Passage — always from UNIT.passage (all 18 paragraphs, all days) ──
  if (typeof UNIT !== 'undefined' && UNIT.passage && UNIT.passage.length) {
    activities.push({
      id: 'passage-annotation',
      type: 'passage-annotation',
      grPhase: 'i-do',
      title: 'Text Passage — Ali Cogia',
      strategies: ['cubes'],
      data: {
        paragraphs: UNIT.passage,
        cubesGuide: (UNIT.cubesGuide || [])
      }
    });
  }

  // ── Bellringer MC (context clues vocabulary) ──
  if (dayData.bellringer && dayData.bellringer.questions) {
    dayData.bellringer.questions.forEach((q, i) => {
      activities.push({
        id: 'bellringer-q' + i,
        type: 'mc',
        grPhase: 'we-do',
        title: 'Bellringer · Q' + (i + 1),
        strategies: ['cubes', 'stop'],
        data: {
          stem: q.stem,
          options: q.options || [],
          writtenPrompt: q.writtenPrompt || null,
          writtenModel: q.writtenModel || null
        }
      });
    });
  }

  // ── Comprehension MC (Days 1–2: after first/complete read) ──
  if (dayData.comprehensionMC && dayData.comprehensionMC.questions) {
    dayData.comprehensionMC.questions.forEach((q, i) => {
      activities.push({
        id: 'comprehension-q' + i,
        type: 'mc',
        grPhase: 'you-do',
        title: (dayData.comprehensionMC.title || 'Comprehension') + ' · Q' + (i + 1),
        strategies: ['stop'],
        data: {
          stem: q.stem,
          options: q.options || [],
          writtenPrompt: q.writtenPrompt || null,
          writtenModel: q.writtenModel || null
        }
      });
    });
  }

  // ── Consolidated Organizer (Days 3–4: single card, all rows for that day) ──
  if (dayData.organizer && dayData.organizer.rows) {
    activities.push({
      id: 'organizer',
      type: 'organizer',
      grPhase: 'we-do',
      title: 'Graphic Organizer — ' + (dayData.organizer.benchmarkFocus || ''),
      strategies: ['cubes'],
      data: {
        benchmarkFocus: dayData.organizer.benchmarkFocus || '',
        columns:        dayData.organizer.columns || [],
        rows:           dayData.organizer.rows || []
      }
    });
  }

  // ── Vocabulary (one card per word) ──
  const vocabItems = dayData.vocabulary || dayData.vocab || [];
  vocabItems.forEach((v, i) => {
    activities.push({
      id: 'vocab-' + i,
      type: 'vocabulary',
      grPhase: 'we-do',
      title: 'Vocabulary · ' + (v.word || ''),
      strategies: [],
      data: {
        word:           v.word,
        partOfSpeech:   v.partOfSpeech || '',
        definition:     v.definition || '',
        exampleSentence: v.exampleSentence || v.example || '',
        esolFrames:     dayData.esol || null
      }
    });
  });

  // ── Assessment MC (Day 5: formal STOP protocol) ──
  if (dayData.assessmentMC && dayData.assessmentMC.questions) {
    dayData.assessmentMC.questions.forEach((q, i) => {
      activities.push({
        id: 'assessment-q' + i,
        type: 'mc',
        grPhase: 'you-do',
        title: (dayData.assessmentMC.title || 'Assessment') + ' · Q' + (i + 1),
        strategies: ['stop'],
        data: {
          stem: q.stem,
          options: q.options || [],
          writtenPrompt: q.writtenPrompt || null,
          writtenModel:  q.writtenModel  || null
        }
      });
    });
  }

  // ── Written Response (Day 6: RACE/CER) ──
  if (dayData.raceFrames && dayData.raceFrames.task) {
    activities.push({
      id: 'written-response',
      type: 'written-response',
      grPhase: 'you-do',
      title: 'Written Response',
      strategies: ['race', 'cer'],
      data: {
        framework: 'race',
        prompt: dayData.raceFrames.task,
        frame: {
          restate: dayData.raceFrames.restate || '',
          answer:  dayData.raceFrames.answer  || '',
          cite:    dayData.raceFrames.cite    || '',
          explain: dayData.raceFrames.explain || ''
        }
      }
    });
  }

  return activities;
}

// Map row.label string to CSS-friendly grPhase key.
// No longer called internally — kept to avoid breaking any external callers.
function labelToGrPhase(label) {
  const map = {
    'I Do':               'i-do',
    'We Do':              'we-do',
    'You Do w/ Partner':  'you-do-partner',
    'You Do':             'you-do'
  };
  return map[label] || 'we-do';
}
