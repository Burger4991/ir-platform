// js/activities.js
// Adapter: converts a data.js day object into an ordered Activity array.
// No changes to data.js files are required.
// Activity order: passage-annotation first (I Do context), then bellringers,
// organizer rows, vocabulary, written-response last (You Do).

function buildActivities(dayData) {
  if (!dayData) return [];
  const activities = [];

  // ── Passage Annotation first (I Do — sets context before all other activities) ──
  if (dayData.textPassage && dayData.textPassage.paragraphs && dayData.textPassage.paragraphs.length) {
    activities.push({
      id: 'passage-annotation',
      type: 'passage-annotation',
      grPhase: 'i-do',
      title: 'Text Passage',
      strategies: ['cubes'],
      data: {
        paragraphs: dayData.textPassage.paragraphs,
        cubesGuide: dayData.textPassage.cubesGuide || []
      }
    });
  }

  // ── Bellringer MC questions ──
  if (dayData.bellringer && dayData.bellringer.questions) {
    dayData.bellringer.questions.forEach((q, i) => {
      activities.push({
        id: 'bellringer-q' + i,
        type: 'mc',
        grPhase: 'we-do',
        title: 'Bellringer · Q' + (i + 1),
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

  // ── Organizer rows (one activity per row) ──
  if (dayData.organizer && dayData.organizer.rows) {
    const benchmarkFocus = dayData.organizer.benchmarkFocus || '';
    const columns = dayData.organizer.columns || [];
    dayData.organizer.rows.forEach((row, i) => {
      activities.push({
        id: 'organizer-row-' + i,
        type: 'organizer-row',
        grPhase: labelToGrPhase(row.label),
        title: 'Organizer · ' + (row.label || ''),
        strategies: ['cubes'],
        data: {
          benchmarkFocus,
          columns,
          label: row.label,
          cells: row.cells || [],
          isPreFilled: !!row.isPreFilled
        }
      });
    });
  }

  // ── Vocabulary (one activity per word) ──
  const vocabItems = dayData.vocabulary || dayData.vocab || [];
  if (vocabItems.length) {
    vocabItems.forEach((v, i) => {
      activities.push({
        id: 'vocab-' + i,
        type: 'vocabulary',
        grPhase: 'we-do',
        title: 'Vocabulary · ' + (v.word || ''),
        strategies: [],
        data: {
          word: v.word,
          partOfSpeech: v.partOfSpeech || '',
          definition: v.definition || '',
          exampleSentence: v.exampleSentence || v.example || '',
          esolFrames: dayData.esol || null
        }
      });
    });
  }

  // ── Written Response (RACE) ──
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

// Map row.label string to CSS-friendly grPhase key
function labelToGrPhase(label) {
  const map = {
    'I Do':               'i-do',
    'We Do':              'we-do',
    'You Do w/ Partner':  'you-do-partner',
    'You Do':             'you-do'
  };
  return map[label] || 'we-do';
}
