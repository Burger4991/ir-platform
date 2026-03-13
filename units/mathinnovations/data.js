const UNIT = {
  meta: {
    id: 'mathinnovations',
    title: 'The Source of Mathematical Innovations',
    benchmark: 'ELA.10.R.2.2',
    benchmarkLabel: 'Text Structure',
    benchmarkCategory: 'R.2 Informational',
    benchmarkDescription: 'Analyze the structure an author uses to organize a text and how it contributes to meaning',
    text: 'The Source of Mathematical Innovations',
    paragraphs: '1–9',
    days: 4,
    status: 'live',
    tags: ['Informational', 'Text Structure', 'Mathematics History'],
    description: 'Analyzing text structure, central idea, and author\'s craft in an informational article about the history of mathematical discoveries.'
  },

  days: {

    // ─────────────────────────────────────────────────────────────────────────
    // DAY 1 — First Read + Annotation Protocol
    // ─────────────────────────────────────────────────────────────────────────
    1: {
      label: 'Day 1 — First Read & Annotation',

      bellringer: {
        words: ['immortality', 'sexagesimal', 'collective'],
        questions: [
          {
            stem: 'Read: "Mathematics is the surest way to immortality. If you make a big discovery in mathematics, you will be remembered after everyone else will be forgotten." In this context, immortality means—',
            options: [
              { letter: 'A', text: 'death', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'fame that lasts forever', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'a long journey', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'a mathematical formula', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'What does the word "immortality" reveal about how the author views mathematics? Use context clues from the passage.',
            writtenModel: 'The word "immortality" reveals that the author views mathematics as a path to lasting fame. The context clue — "you will be remembered after everyone else will be forgotten" — shows that immortality here means living on in memory through your discoveries, not literally living forever.'
          },
          {
            stem: 'The ancient Babylonians used a sexagesimal place value system. Based on context clues, this means they used—',
            options: [
              { letter: 'A', text: 'a system based on 10', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'a system based on 60', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'a system with only 6 numbers', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'a written language system', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does the author use context clues to help the reader understand the word "sexagesimal"?',
            writtenModel: 'The author provides a built-in context clue by writing "a sexagesimal, or base-60, place value system" — the phrase "or base-60" directly restates the meaning in parenthetical form, making the technical term immediately understandable to the reader.'
          }
        ]
      },

      vocabulary: [
        {
          word: 'immortality',
          partOfSpeech: 'noun',
          definition: 'the state of living forever; lasting fame or memory that endures beyond one\'s death',
          exampleSentence: 'The mathematician achieved immortality through discoveries that are still used centuries later.'
        },
        {
          word: 'sexagesimal',
          partOfSpeech: 'adjective',
          definition: 'relating to or based on the number 60; a numeral system using 60 as its base',
          exampleSentence: 'The Babylonians\' sexagesimal system is why we have 60 seconds in a minute and 60 minutes in an hour.'
        },
        {
          word: 'collective',
          partOfSpeech: 'adjective',
          definition: 'done by or involving a group of people; shared among many',
          exampleSentence: 'The invention of the number system was a collective achievement of many cultures over centuries.'
        }
      ],

      teacherNotes: 'Day 1 focuses on first read and annotation. Build background: "What number system do we use? Why is it called Hindu-Arabic?" Point out the three subheadings — they are questions the author poses and then answers. This question-answer structure IS the text structure students need to identify. Model Circle-Box-Underline annotation on paragraph 1: CIRCLE the central claim ("those who made some of the earliest mathematical discoveries are either unknown to us or are the subject of debate"), BOX the subheading, UNDERLINE "immortality." Release to independent reading of paragraphs 1–9 with annotation checklist. Exit ticket checks understanding of the central claim.',

      organizer: {
        benchmarkFocus: 'Text Structure — Question-Answer Organization',
        columns: ['Text Structure Element', 'Evidence from Text', 'How It Contributes to Meaning'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'Subheading as Question: "Who Invented the Hindu-Arabic Number System?"',
              'Paragraph 4: "These combined efforts help explain the hyphenated name \'Hindu-Arabic\' and why we can\'t attribute our number system to a single mathematician."',
              'The question format raises a reader expectation — we expect one answer. The text instead shows complexity, reinforcing that discoveries are collective, not individual.'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: [
              'Subheading as Question: "Who Invented the Indian Number System?"',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: [
              'Subheading as Question: "Who Discovered That Nothing Is a Number?"',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: [
              'Concluding paragraph (no subheading): Paragraph 9',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'The Source of Mathematical Innovations',
        paragraphs: [
          {
            number: 1,
            text: 'The twentieth-century mathematician Paul Erdős once claimed, "Mathematics is the surest way to immortality. If you make a big discovery in mathematics, you will be remembered after everyone else will be forgotten." Such may be the case in the modern age, especially for prize-winning, prolific mathematicians like Erdős. However, those who made some of the earliest mathematical discoveries or innovations are either unknown to us or are the subject of debate. Consider these basic questions.'
          },
          {
            number: 2,
            text: 'The modern number system in Western society enables us to write any real number using only ten numerals: the digits 0 through 9. It is a place value system because each place in a number represents a different value: the size of the unit being counted. It is also a decimal place value system because the units are different powers of ten. (Decem means "ten" in Latin.) Each digit in a number communicates two pieces of information: a number of units and the size of the unit, whether it be ones (10⁰), tens (10¹), hundreds (10²), and so on. This means that we can represent numbers much more efficiently than the ancient Romans could, for example. Compare this number, written in decimal place value notation and then in Roman numerals:\n\n873 = DCCCLXXIII\n\nThe decimal place value system revolutionized basic calculations, record keeping, financial accounting, and everything else that involves working with large numbers—yet we are at a loss to name its inventor. Instead of calling it after a particular mathematician, we call it the Hindu-Arabic number system, and for good reason.'
          },
          {
            number: 3,
            text: 'Knowledge of this system began to reach Europe in the eleventh century CE, largely through Latin translations of Arabic texts. Muslim authors—including ninth-century mathematician and astronomer Muhammad ibn Mūsā al-Khwārizmī—were writing about the Indian decimal place value system that they had learned about from Hindu texts and were eager to share what they learned with others. Al-Khwārizmī\'s text, for instance, explained how decimal place values simplified calculations to encourage others to adopt the Indian system. Other Muslim mathematicians also translated Hindu texts and modified the appearance of some numerals, bringing them closer to the digits we use today.'
          },
          {
            number: 4,
            text: 'These combined efforts help explain the hyphenated name "Hindu-Arabic" and why we can\'t attribute our number system to a single mathematician.'
          },
          {
            number: 5,
            text: 'The "Bakhshali manuscript" is an ancient Indian mathematical scroll from the third or fourth century CE, and it is the oldest text that contains numbers written using decimal place values. It also shows the use of a dot as a placeholder within numbers, in the way that we use 0 to distinguish 51 from 501. The manuscript\'s author (or scribe) identifies himself as "the son of Chajaka," a "king of calculators." However, it is unlikely that this person invented the number system that he used because he seems to assume that the reader is already familiar with it.'
          },
          {
            number: 6,
            text: 'There is a theory that the inventor of the Indian system based it on the ancient Babylonian number system, which was a sexagesimal, or base-60, place value system. The Babylonians had inherited this system from the Sumerians by 2000 BCE, but they were the first to use a symbol as a placeholder. Still, even if this theory is true, the decimal place value system was invented when 10 was used as the base for units instead of 60. The dot placeholder in the Bakhshali manuscript also more closely resembles 0 than it does the Babylonian placeholder.'
          },
          {
            number: 7,
            text: 'But 0, of course, is more than just a placeholder symbol in a number. It is also a number in its own right: an amount equal to nothing that can be added, subtracted, multiplied, or divided by other numbers.'
          },
          {
            number: 8,
            text: 'Some scholars credit Brahmagupta, the seventh-century Indian mathematician and astronomer, with being the first to identify zero as a number. In 628 CE, Brahmagupta wrote the first rules for mathematical operations with zero, establishing it as an identity, or number with special properties. Other scholars believe that he was just formalizing what was already generally known, or that al-Khwārizmī or other mathematicians deserve credit for using zero to solve equations—and developing arithmetic algebra in the process.'
          },
          {
            number: 9,
            text: 'While questions remain about who is responsible for these mathematical breakthroughs, one thing is clear: they were made possible by the work of previous mathematicians and the slow accumulation of a body of mathematical knowledge over time. They also demonstrate that mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part.'
          }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle the central claim and key supporting details', example: 'circle "either unknown to us or are the subject of debate" (¶1)' },
          { letter: 'U', action: 'Underline vocabulary words and technical terms', example: 'underline "immortality," "sexagesimal," "collective"' },
          { letter: 'B', action: 'Box the subheadings (questions) and paragraph numbers', example: 'box "Who Invented the Hindu-Arabic Number System?"' },
          { letter: 'E', action: 'Exclaim (!) surprising facts or important claims', example: '"we are at a loss to name its inventor" — this is surprising!' },
          { letter: 'S', action: 'Summarize each section in the margin in 5 words or fewer', example: '"Can\'t credit one inventor" next to ¶4' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'The author uses ___ structure to organize this text.',
            'The subheadings are questions because ___.'
          ],
          wordBank: ['question-answer', 'structure', 'subheadings', 'invented', 'unknown', 'collective', 'discovered']
        },
        l34: {
          frames: [
            'The author organizes this text using ___ structure, which means ___.',
            'The subheadings are written as questions because the author wants to show that ___.'
          ],
          wordBank: ['question-answer', 'organize', 'structure', 'complex', 'collective effort']
        },
        l5: {
          frames: [
            'The author\'s use of ___ structure contributes to meaning by ___, which reinforces the central idea that ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 10 },

      exitTicket: {
        prompt: 'According to the text, why can\'t we credit one person with inventing our number system?',
        choices: [
          { letter: 'A', text: 'The records were destroyed', correct: false },
          { letter: 'B', text: 'Many people and cultures contributed over time', correct: true },
          { letter: 'C', text: 'The inventor wanted to remain anonymous', correct: false },
          { letter: 'D', text: 'Scientists disagree about who deserves credit', correct: false }
        ],
        frame: 'The text cannot credit one person with inventing the number system because ___.'
      },

      raceFrames: {
        task: 'How does the author use text structure to develop the idea that mathematical discoveries are collective?',
        restate: 'The author of "The Source of Mathematical Innovations" uses ___ text structure to develop the idea that mathematical discoveries are ___.',
        answer: 'Specifically, the ___ organization allows the author to explore who made each discovery — and reveal that ___.',
        cite: 'For example, paragraph ___ states, "___"',
        explain: 'This structure contributes to meaning because each question raises the expectation of a single inventor, but the text repeatedly shows that ___.'
      },

      progressItems: [
        'Bellringer complete (5 min)',
        'Vocabulary introduced — immortality, sexagesimal, collective',
        'Annotation system (Circle-Box-Underline) modeled on ¶1',
        'Text structure preview — subheadings as questions identified',
        'Paragraphs 1–9 read with CUBES annotation',
        'I Do organizer row modeled',
        'Exit ticket complete'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'What structure does the author use to organize this text?',
          choices: ['A. Cause and Effect', 'B. Problem and Solution', 'C. Question and Answer', 'D. Compare and Contrast'],
          correct: 'C'
        },
        {
          type: 'tps',
          prompt: 'Why do you think the author wrote the subheadings as questions instead of statements?',
          thinkSeconds: 45,
          pairSeconds: 60,
          shareSeconds: 0
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // DAY 2 — Question Stem Breakdown + Annotation Strategy
    // ─────────────────────────────────────────────────────────────────────────
    2: {
      label: 'Day 2 — Question Stem Analysis',

      bellringer: {
        words: ['immortality', 'sexagesimal', 'collective'],
        questions: [
          {
            stem: 'The prefix "im-" means "not." The root "mortal" means "able to die." Based on etymology, "immortality" means—',
            options: [
              { letter: 'A', text: 'very deadly', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'the state of not being able to die', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'the act of dying', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'fear of death', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does breaking the word into parts (im- + mortal + -ity) help you choose the correct answer?',
            writtenModel: 'Breaking the word into parts reveals the meaning step by step: "im-" = not, "mortal" = able to die, "-ity" = state of. Together they form "the state of not being able to die," or living forever. This matches the context in paragraph 1: "you will be remembered after everyone else will be forgotten." Etymology and context both confirm answer B.'
          },
          {
            stem: 'The word "collective" contains the root "collect" (to gather). A collective endeavor is therefore—',
            options: [
              { letter: 'A', text: 'an effort by one person', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'a failed attempt', correct: false, stopLabel: 'Silly' },
              { letter: 'C', text: 'a group effort', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'an ancient tradition', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does the word "collective" connect to the author\'s central idea in paragraph 9?',
            writtenModel: 'The word "collective" contains "collect," meaning to gather things together. A collective endeavor gathers the work of many people. This connects directly to the central idea in paragraph 9: "mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part." The word choice reinforces that math belongs to everyone.'
          }
        ]
      },

      vocabulary: [
        {
          word: 'immortality',
          partOfSpeech: 'noun',
          definition: 'the state of living forever; lasting fame or memory that endures beyond one\'s death',
          exampleSentence: 'Paul Erdős believed that mathematical discovery was the path to true immortality.'
        },
        {
          word: 'sexagesimal',
          partOfSpeech: 'adjective',
          definition: 'relating to or based on the number 60; a numeral system using 60 as its base',
          exampleSentence: 'The Babylonians inherited their sexagesimal number system from the Sumerians.'
        },
        {
          word: 'collective',
          partOfSpeech: 'adjective',
          definition: 'done by or involving a group of people; shared among many',
          exampleSentence: 'Our current number system is the result of a collective effort across many centuries and cultures.'
        }
      ],

      teacherNotes: 'Day 2 focuses on annotating test questions (Q23–Q26) using Circle-Box-Underline. Model Q23 think-aloud: underline what the question asks ("etymology AND context clues"), then use BOTH strategies. Introduce the question type chart (vocabulary vs. author\'s craft vs. paraphrase). Spend extra time on Q26 paraphrase — model how to identify main ideas in paragraph 9 FIRST, then check each answer for distortions. Key distortions to flag: A adds "Famous people take credit" (not in text), B changes the meaning to "piece clues together," D says "should not be credited" which is too strong. Answer C is accurate.',

      organizer: {
        benchmarkFocus: 'Text Structure — Question Types and Strategies',
        columns: ['Question #', 'Question Type', 'Key Strategy', 'Where to Find Evidence in Text'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'Q23 — immortality',
              'Vocabulary: Etymology + Context Clues',
              'Break word into parts (im- + mortal + -ity) AND find context clue in surrounding sentences',
              'Paragraph 1: "you will be remembered after everyone else will be forgotten"'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: [
              'Q24 — diction and syntax',
              'Author\'s Craft: Mood/Tone',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: [
              'Q25 — sexagesimal',
              'Vocabulary: Dictionary Definition + Context',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: [
              'Q26 — paraphrase',
              'Paraphrase: Find SAME meaning, different words',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'The Source of Mathematical Innovations',
        paragraphs: [
          {
            number: 1,
            text: 'The twentieth-century mathematician Paul Erdős once claimed, "Mathematics is the surest way to immortality. If you make a big discovery in mathematics, you will be remembered after everyone else will be forgotten." Such may be the case in the modern age, especially for prize-winning, prolific mathematicians like Erdős. However, those who made some of the earliest mathematical discoveries or innovations are either unknown to us or are the subject of debate. Consider these basic questions.'
          },
          {
            number: 2,
            text: 'The modern number system in Western society enables us to write any real number using only ten numerals: the digits 0 through 9. It is a place value system because each place in a number represents a different value: the size of the unit being counted. It is also a decimal place value system because the units are different powers of ten. (Decem means "ten" in Latin.) Each digit in a number communicates two pieces of information: a number of units and the size of the unit, whether it be ones (10⁰), tens (10¹), hundreds (10²), and so on. This means that we can represent numbers much more efficiently than the ancient Romans could, for example. Compare this number, written in decimal place value notation and then in Roman numerals:\n\n873 = DCCCLXXIII\n\nThe decimal place value system revolutionized basic calculations, record keeping, financial accounting, and everything else that involves working with large numbers—yet we are at a loss to name its inventor. Instead of calling it after a particular mathematician, we call it the Hindu-Arabic number system, and for good reason.'
          },
          {
            number: 9,
            text: 'While questions remain about who is responsible for these mathematical breakthroughs, one thing is clear: they were made possible by the work of previous mathematicians and the slow accumulation of a body of mathematical knowledge over time. They also demonstrate that mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part.'
          }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle ideas in answer choices that ARE in the text', example: 'circle "remembered" and "forgotten" (¶1) — this matches Q23' },
          { letter: 'U', action: 'Underline what each question is ASKING', example: 'underline "etymology and context clues" in Q23' },
          { letter: 'B', action: 'Box paragraph numbers mentioned in answer choices', example: 'box "paragraph 2" when checking Q24' },
          { letter: 'E', action: 'Eliminate answer choices that distort the original meaning', example: 'eliminate Q26 choices that ADD or CHANGE what ¶9 says' },
          { letter: 'S', action: 'Star the answer that is Proven by text evidence', example: 'star Q23 answer A — proven by ¶1 context clue' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'This question asks about ___.',
            'The strategy for this question type is ___.'
          ],
          wordBank: ['vocabulary', 'diction', 'syntax', 'paraphrase', 'etymology', 'context clue', 'paragraph']
        },
        l34: {
          frames: [
            'For a ___ question, I should ___ to find the answer.',
            'The word ___ means ___ because the text says ___.'
          ],
          wordBank: ['vocabulary', 'etymology', 'context clues', 'diction', 'syntax', 'paraphrase']
        },
        l5: {
          frames: [
            'This is a ___ question, which requires me to ___, then verify by ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 20, teacher: 10, passage: 5 },

      exitTicket: {
        prompt: 'For Question 26 (paraphrase), what should you do FIRST before looking at the answer choices?',
        frame: 'Before looking at the answer choices for a paraphrase question, I should ___.'
      },

      raceFrames: {
        task: 'Explain how the author\'s question-answer text structure helps the reader understand who deserves credit for mathematical discoveries.',
        restate: 'The author of "The Source of Mathematical Innovations" uses a ___ text structure to help readers understand ___.',
        answer: 'Each subheading poses a question (such as ___), and the author\'s answer reveals that ___.',
        cite: 'For example, in paragraph ___, the text states, "___"',
        explain: 'This structure contributes to meaning because it creates the expectation of one simple answer, but the text shows instead that ___.'
      },

      progressItems: [
        'Bellringer complete — etymology practice (5 min)',
        'Question type chart completed (Q23–Q26)',
        'Q23 annotated and strategy applied',
        'Q24 diction/syntax analyzed',
        'Q25 annotated with definition box',
        'Q26 paragraph 9 main ideas listed',
        'Exit ticket complete'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'Which strategy should you use FIRST for a vocabulary question that mentions etymology?',
          choices: ['A. Read all answer choices', 'B. Break the word into parts', 'C. Skip it and come back', 'D. Look for the word in the passage'],
          correct: 'B'
        },
        {
          type: 'tps',
          prompt: 'What is the difference between a vocabulary question and a paraphrase question? How does your strategy change?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // DAY 3 — MC Justification with RACE
    // ─────────────────────────────────────────────────────────────────────────
    3: {
      label: 'Day 3 — MC Justification with RACE',

      bellringer: {
        words: ['immortality', 'sexagesimal', 'collective'],
        questions: [
          {
            stem: 'Choose the sentence that uses the word CORRECTLY: Which sentence uses "immortality" correctly?',
            options: [
              { letter: 'A', text: 'The immortality of the building meant it was very old.', correct: false, stopLabel: 'Silly' },
              { letter: 'B', text: 'Great artists achieve immortality through work that is remembered forever.', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'She felt immortality when she forgot her homework.', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'The immortality of the storm caused widespread damage.', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does knowing the word "immortality" help you understand what Paul Erdős meant when he said math is "the surest way to immortality"?',
            writtenModel: 'Knowing that "immortality" means lasting forever in memory helps me understand that Erdős meant mathematicians achieve lasting fame — their discoveries keep them alive in human memory long after they are gone. He was not claiming they live forever physically; he meant their intellectual contributions endure.'
          },
          {
            stem: 'Choose the sentence that uses "collective" correctly.',
            options: [
              { letter: 'A', text: 'His collective decision was made completely alone.', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'The collective effort of many cultures produced our number system.', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'She kept her thoughts collective and private.', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'The collective tree stood alone in the field.', correct: false, stopLabel: 'Silly' }
            ],
            writtenPrompt: 'How does understanding "collective" help you identify the central idea of this text?',
            writtenModel: 'Understanding that "collective" means involving a group helps me identify the central idea: mathematical discoveries were not made by one person but through the combined, collective work of many mathematicians across many cultures and centuries. The author uses this word in paragraph 9 to state this central idea directly.'
          }
        ]
      },

      vocabulary: [
        {
          word: 'immortality',
          partOfSpeech: 'noun',
          definition: 'the state of living forever; lasting fame or memory that endures beyond one\'s death',
          exampleSentence: 'Through his groundbreaking proofs, the mathematician achieved a kind of immortality in the field.'
        },
        {
          word: 'sexagesimal',
          partOfSpeech: 'adjective',
          definition: 'relating to or based on the number 60; a numeral system using 60 as its base',
          exampleSentence: 'The sexagesimal system of the Babylonians influenced later counting systems in surprising ways.'
        },
        {
          word: 'collective',
          partOfSpeech: 'adjective',
          definition: 'done by or involving a group of people; shared among many',
          exampleSentence: 'The author argues that mathematical discovery is always a collective process, never just one person\'s work.'
        }
      ],

      teacherNotes: 'Day 3 is the RACE justification day. Model Q24 (diction/syntax) as the I Do — this is the most complex question type and benefits most from modeling. Think aloud: identify DICTION ("revolutionized," "at a loss"), identify SYNTAX (long list + dash + contrast word "yet"), then explain the mood/tone created. Key insight: "at a loss" is a conversational idiom, not formal language. The dash before "yet" creates a reflective pause. Partners work Q26 paraphrase together using distortion-checking. Students complete Q23 and Q25 independently. Final share-out: "What was the biggest distortion you found in the wrong answers for Q26?" Expected: A adds "famous people take credit" which is NOT in the text.',

      organizer: {
        benchmarkFocus: 'MC Justification — RACE Writing',
        columns: ['Question', 'My Answer', 'CITE — Evidence from Text (with ¶#)', 'EXPLAIN — How Evidence Proves the Answer'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'Q24: The author\'s diction and syntax help create—',
              'C — a conversational mood with a reflective tone',
              '"at a loss" (¶2) is a conversational idiom; the dash before "yet" creates a reflective pause',
              'The casual phrase "at a loss" feels like everyday speech, not formal writing, creating a conversational mood. The dash followed by "yet" signals a moment of reflection — we pause to consider the irony of such an important invention having no known creator.'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: [
              'Q26: Which accurately paraphrases the final paragraph?',
              '',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: [
              'Q23: What is the meaning of immortality?',
              '',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: [
              'Q25: How is a sexagesimal system different from a decimal system?',
              '',
              '',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'The Source of Mathematical Innovations',
        paragraphs: [
          {
            number: 1,
            text: 'The twentieth-century mathematician Paul Erdős once claimed, "Mathematics is the surest way to immortality. If you make a big discovery in mathematics, you will be remembered after everyone else will be forgotten." Such may be the case in the modern age, especially for prize-winning, prolific mathematicians like Erdős. However, those who made some of the earliest mathematical discoveries or innovations are either unknown to us or are the subject of debate. Consider these basic questions.'
          },
          {
            number: 2,
            text: 'The modern number system in Western society enables us to write any real number using only ten numerals: the digits 0 through 9. It is a place value system because each place in a number represents a different value: the size of the unit being counted. It is also a decimal place value system because the units are different powers of ten. (Decem means "ten" in Latin.) Each digit in a number communicates two pieces of information: a number of units and the size of the unit, whether it be ones (10⁰), tens (10¹), hundreds (10²), and so on. This means that we can represent numbers much more efficiently than the ancient Romans could, for example. Compare this number, written in decimal place value notation and then in Roman numerals:\n\n873 = DCCCLXXIII\n\nThe decimal place value system revolutionized basic calculations, record keeping, financial accounting, and everything else that involves working with large numbers—yet we are at a loss to name its inventor. Instead of calling it after a particular mathematician, we call it the Hindu-Arabic number system, and for good reason.'
          },
          {
            number: 6,
            text: 'There is a theory that the inventor of the Indian system based it on the ancient Babylonian number system, which was a sexagesimal, or base-60, place value system. The Babylonians had inherited this system from the Sumerians by 2000 BCE, but they were the first to use a symbol as a placeholder. Still, even if this theory is true, the decimal place value system was invented when 10 was used as the base for units instead of 60. The dot placeholder in the Bakhshali manuscript also more closely resembles 0 than it does the Babylonian placeholder.'
          },
          {
            number: 9,
            text: 'While questions remain about who is responsible for these mathematical breakthroughs, one thing is clear: they were made possible by the work of previous mathematicians and the slow accumulation of a body of mathematical knowledge over time. They also demonstrate that mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part.'
          }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle the correct answer letter before writing RACE', example: 'circle "C" for Q24 before writing your justification' },
          { letter: 'U', action: 'Underline the specific DICTION or SYNTAX you are analyzing', example: 'underline "at a loss" and "revolutionized" in ¶2' },
          { letter: 'B', action: 'Box the paragraph number you are citing', example: 'box "(¶2)" in your CITE sentence' },
          { letter: 'E', action: 'Eliminate wrong paraphrase answers by marking their distortions', example: 'mark "ADDS idea not in text" next to Q26 choice A' },
          { letter: 'S', action: 'Star the evidence that most strongly proves your answer', example: 'star the quote you use in your CITE sentence' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'The answer is ___ because the text says ___.',
            'The word "___ " in paragraph ___ shows that ___.'
          ],
          wordBank: ['evidence', 'paragraph', 'because', 'shows', 'proves', 'the text says', 'for example']
        },
        l34: {
          frames: [
            'The answer is ___ because the author uses ___ in paragraph ___ to show ___.',
            'This evidence proves the answer because ___.'
          ],
          wordBank: ['diction', 'syntax', 'conversational', 'reflective', 'tone', 'mood', 'paraphrase']
        },
        l5: {
          frames: [
            'The correct answer is ___ because the author\'s use of ___ (paragraph ___) creates ___, which demonstrates that ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 5 },

      exitTicket: {
        prompt: 'What was the biggest distortion you found in the wrong answers for Question 26? Write one sentence explaining why it is wrong.',
        frame: 'Answer ___ is a distortion because it ___, but the original paragraph says ___.'
      },

      raceFrames: {
        task: 'Use RACE to justify your answer to Question 24: The author\'s diction and syntax help create—',
        restate: 'The author\'s diction and syntax in paragraph 2 help create ___.',
        answer: 'Specifically, the answer is C because the word choice is ___ and the sentence structure creates ___.',
        cite: 'The author uses "___ " (paragraph 2), which is ___, and the dash before "yet" ___.',
        explain: 'This proves the answer because ___ shows a conversational mood, while the dash creates a moment of ___ as the reader considers ___.'
      },

      progressItems: [
        'Bellringer complete — usage in context (5 min)',
        'RACE for MC introduced and modeled on Q24',
        'Q24 diction + syntax analyzed (I Do)',
        'Q26 paraphrase RACE completed with partner (We Do)',
        'Q23 RACE justification completed independently',
        'Q25 RACE justification completed independently',
        'Share-out: distortions in Q26 identified',
        'Exit ticket complete'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'Which answer choice for Q26 is the accurate paraphrase of paragraph 9?',
          choices: [
            'A. No one knows, but famous people take credit',
            'B. Mathematicians can piece clues together over time',
            'C. Discoveries were collective, built on previous work',
            'D. Breakthroughs should not be credited to any one person'
          ],
          correct: 'C'
        },
        {
          type: 'tps',
          prompt: 'What makes a "distortion" different from a wrong answer that is just completely off-topic?',
          thinkSeconds: 45,
          pairSeconds: 60,
          shareSeconds: 0
        }
      ]
    },

    // ─────────────────────────────────────────────────────────────────────────
    // DAY 4 — RACE Extended Response + Self-Assessment
    // ─────────────────────────────────────────────────────────────────────────
    4: {
      label: 'Day 4 — RACE Extended Response',

      bellringer: {
        words: ['immortality', 'sexagesimal', 'collective'],
        questions: [
          {
            stem: '"Immortality" most likely means—',
            options: [
              { letter: 'A', text: 'death', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'fame', correct: false, stopLabel: 'Tricky' },
              { letter: 'C', text: 'living forever', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'forgetting', correct: false, stopLabel: 'Silly' }
            ],
            writtenPrompt: 'In one sentence, explain the difference between "fame" (answer B) and "living forever" (answer C). Why is C more accurate?',
            writtenModel: 'Fame means being well-known and admired, while "living forever" (immortality) means enduring without end. Answer C is more accurate because the word parts — im- (not) + mortal (able to die) + -ity (state of) — literally mean "the state of not dying," not just being famous. Fame can fade; immortality, by definition, cannot.'
          },
          {
            stem: '"Collective" means—',
            options: [
              { letter: 'A', text: 'individual', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'involving a group', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'private', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'difficult', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'Use "collective" in a sentence that connects to what you learned from this text.',
            writtenModel: 'The development of our modern number system was a collective achievement — no single mathematician invented it, but rather it emerged over centuries from the combined contributions of Hindu, Babylonian, Arabic, and European scholars.'
          }
        ]
      },

      vocabulary: [
        {
          word: 'immortality',
          partOfSpeech: 'noun',
          definition: 'the state of living forever; lasting fame or memory that endures beyond one\'s death',
          exampleSentence: 'Erdős believed mathematical discovery was humanity\'s surest path to immortality.'
        },
        {
          word: 'sexagesimal',
          partOfSpeech: 'adjective',
          definition: 'relating to or based on the number 60; a numeral system using 60 as its base',
          exampleSentence: 'Because the Babylonians used a sexagesimal system, our clocks still divide hours into 60 minutes.'
        },
        {
          word: 'collective',
          partOfSpeech: 'adjective',
          definition: 'done by or involving a group of people; shared among many',
          exampleSentence: 'The central idea of the text is that mathematics is a collective endeavor.'
        }
      ],

      teacherNotes: 'Day 4 is the extended RACE writing day. Model the full exemplar response before releasing students. Emphasize the RACE prompt: "According to the author, why is it difficult to identify who invented our modern number system?" Key requirement: TWO quotes with paragraph numbers. The model response uses paragraphs 3 and 4 — both are strong choices. Also accept paragraphs 5–6 (Bakhshali manuscript) or paragraph 9 (collective endeavor). During self-assessment, have students count their paragraph citations and check for the word "because" or "this shows" in their EXPLAIN — those signal words indicate they are actually explaining, not just restating. Close with unit reflection: How did etymology help? What to watch for in paraphrase questions?',

      organizer: {
        benchmarkFocus: 'RACE Extended Response — Text Structure + Central Idea',
        columns: ['RACE Component', 'What to Write', 'My Response'],
        rows: [
          {
            label: 'R — Restate',
            cells: [
              'Turn the question into a statement. Name the text and topic.',
              'According to the author of "The Source of Mathematical Innovations," it is difficult to identify who invented our modern number system because...',
              ''
            ],
            isPreFilled: false,
            phase: 'R'
          },
          {
            label: 'A — Answer',
            cells: [
              'Give a direct, specific answer. Explain the main reason WHY it is difficult.',
              'The main difficulty is that the number system developed gradually through contributions from multiple cultures and mathematicians, rather than being invented by one person at one time.',
              ''
            ],
            isPreFilled: false,
            phase: 'A'
          },
          {
            label: 'C — Cite',
            cells: [
              'Include at least TWO quotes with paragraph numbers in parentheses.',
              '¶3: "Muslim authors...were writing about the Indian decimal place value system that they had learned about from Hindu texts..." AND ¶4: "...we can\'t attribute our number system to a single mathematician."',
              ''
            ],
            isPreFilled: false,
            phase: 'C'
          },
          {
            label: 'E — Explain',
            cells: [
              'Explain HOW each quote supports your answer. Connect to the central idea.',
              'This evidence shows the system passed through multiple cultures — each adding modifications. The hyphenated name "Hindu-Arabic" itself reflects shared origins, making it impossible to credit one inventor.',
              ''
            ],
            isPreFilled: false,
            phase: 'E'
          }
        ]
      },

      textPassage: {
        title: 'The Source of Mathematical Innovations',
        paragraphs: [
          {
            number: 1,
            text: 'The twentieth-century mathematician Paul Erdős once claimed, "Mathematics is the surest way to immortality. If you make a big discovery in mathematics, you will be remembered after everyone else will be forgotten." Such may be the case in the modern age, especially for prize-winning, prolific mathematicians like Erdős. However, those who made some of the earliest mathematical discoveries or innovations are either unknown to us or are the subject of debate. Consider these basic questions.'
          },
          {
            number: 3,
            text: 'Knowledge of this system began to reach Europe in the eleventh century CE, largely through Latin translations of Arabic texts. Muslim authors—including ninth-century mathematician and astronomer Muhammad ibn Mūsā al-Khwārizmī—were writing about the Indian decimal place value system that they had learned about from Hindu texts and were eager to share what they learned with others. Al-Khwārizmī\'s text, for instance, explained how decimal place values simplified calculations to encourage others to adopt the Indian system. Other Muslim mathematicians also translated Hindu texts and modified the appearance of some numerals, bringing them closer to the digits we use today.'
          },
          {
            number: 4,
            text: 'These combined efforts help explain the hyphenated name "Hindu-Arabic" and why we can\'t attribute our number system to a single mathematician.'
          },
          {
            number: 9,
            text: 'While questions remain about who is responsible for these mathematical breakthroughs, one thing is clear: they were made possible by the work of previous mathematicians and the slow accumulation of a body of mathematical knowledge over time. They also demonstrate that mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part.'
          }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle the RACE prompt and underline what it is asking', example: 'circle "why is it difficult to identify who invented our modern number system?"' },
          { letter: 'U', action: 'Underline evidence in the passage you want to cite', example: 'underline quotes from ¶3, ¶4, or ¶9' },
          { letter: 'B', action: 'Box paragraph numbers next to each quote you plan to use', example: 'box "¶4" next to "we can\'t attribute our number system to a single mathematician"' },
          { letter: 'E', action: 'Evaluate your EXPLAIN — does it use "because" or "this shows"?', example: 'check: "This shows that..." connects quote to answer' },
          { letter: 'S', action: 'Self-assess using the checklist before submitting', example: 'check for 2+ quotes, paragraph numbers, and connection to central idea' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'It is difficult to identify who invented the number system because ___.',
            'The text says "___ " (paragraph ___), which means ___.'
          ],
          wordBank: ['difficult', 'invented', 'many people', 'cultures', 'contributed', 'collective', 'over time', 'cannot credit']
        },
        l34: {
          frames: [
            'According to the author, it is difficult to identify the inventor because ___, as shown in paragraph ___ where the text states ___.',
            'This evidence supports the idea that ___ because ___.'
          ],
          wordBank: ['multiple cultures', 'contributed', 'gradually', 'collective effort', 'over centuries', 'hyphenated name', 'attribute']
        },
        l5: {
          frames: [
            'The author demonstrates the difficulty of attribution by ___, which is reinforced in paragraph ___ through ___. This cumulative evidence supports the central idea that ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 20, teacher: 10, passage: 0 },

      exitTicket: {
        prompt: 'Self-assessment: Which part of your RACE response is strongest? Which part do you need to strengthen? Write 2 sentences.',
        frame: 'My strongest RACE component is ___ because ___. I need to strengthen my ___ because ___.'
      },

      raceFrames: {
        task: 'According to the author, why is it difficult to identify who invented our modern number system? Use evidence from the text to support your answer.',
        restate: 'According to the author of "The Source of Mathematical Innovations," it is difficult to identify who invented our modern number system because ___.',
        answer: 'The main difficulty is that the number system developed gradually over centuries through contributions from ___, rather than ___.',
        cite: 'In paragraph ___, the author explains that "___." Additionally, paragraph ___ states that "___."',
        explain: 'This evidence demonstrates that the difficulty comes from the ___ nature of the discovery. The system passed through ___, making it impossible to credit just one inventor. The very name "___ " reflects this shared origin. Rather than a single "eureka moment," the number system evolved through what paragraph 9 calls "___."'
      },

      progressItems: [
        'Bellringer complete — vocabulary quiz (5 min)',
        'RACE model response reviewed (I Do)',
        'RACE organizer filled in (planning)',
        'Full RACE response drafted (20 min)',
        'Self-assessment checklist completed',
        'Unit reflection written',
        'Exit ticket complete'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'Which RACE component do most students find hardest to write?',
          choices: ['A. Restate', 'B. Answer', 'C. Cite', 'D. Explain'],
          correct: 'D'
        },
        {
          type: 'tps',
          prompt: 'How did learning about etymology (word parts) help you on this unit\'s vocabulary questions? Give a specific example.',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        }
      ]
    }
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ASSESSMENT
  // ─────────────────────────────────────────────────────────────────────────
  assessment: {
    questions: [
      {
        number: 23,
        type: 'vocabulary',
        stem: 'Read this sentence from paragraph 1.\n\n"The twentieth-century mathematician Paul Erdős once claimed, \'Mathematics is the surest way to immortality. If you make a big discovery in mathematics, you will be remembered after everyone else will be forgotten.\'"',
        prompt: 'Based on etymology and context clues, what is the meaning of the word immortality?',
        options: [
          { letter: 'A', text: 'the state of living forever', correct: true, stopLabel: 'Proven' },
          { letter: 'B', text: 'the state of being admired', correct: false, stopLabel: 'Tricky' },
          { letter: 'C', text: 'the state of being overlooked', correct: false, stopLabel: 'Opposite' },
          { letter: 'D', text: 'the state of living in several countries', correct: false, stopLabel: 'Silly' }
        ],
        raceJustification: {
          restate: 'The meaning of immortality, based on etymology and context, is the state of living forever.',
          answer: 'The answer is A because the word parts and context both support this meaning.',
          cite: 'Etymology: im- (not) + mortal (able to die) + -ity (state of). Paragraph 1: "you will be remembered after everyone else will be forgotten."',
          explain: 'Both the word parts and the context prove that immortality means living forever — in this case, living on in memory through mathematical discoveries. The context clue confirms that being "remembered" is the meaning, not just being admired (B) or overlooked (C).'
        }
      },
      {
        number: 24,
        type: 'authorsCraft',
        stem: 'Consider the diction and syntax in this sentence from paragraph 2.\n\n"The decimal place value system revolutionized basic calculations, record keeping, financial accounting, and everything else that involves working with large numbers—yet we are at a loss to name its inventor."',
        prompt: 'The author\'s diction and syntax in this sentence help to create—',
        options: [
          { letter: 'A', text: 'a playful mood with a lighthearted tone.', correct: false, stopLabel: 'Silly' },
          { letter: 'B', text: 'an impartial mood with an indifferent tone.', correct: false, stopLabel: 'Opposite' },
          { letter: 'C', text: 'a conversational mood with a reflective tone.', correct: true, stopLabel: 'Proven' },
          { letter: 'D', text: 'an analytical mood with an apologetic tone.', correct: false, stopLabel: 'Tricky' }
        ],
        raceJustification: {
          restate: 'The author\'s diction and syntax in paragraph 2 create a conversational mood with a reflective tone.',
          answer: 'The answer is C because the word choice is casual and the structure creates a pause for reflection.',
          cite: 'The phrase "at a loss" (paragraph 2) is a conversational everyday expression, and the dash before "yet" creates a reflective pause before the surprising contrast.',
          explain: 'Using a casual idiom like "at a loss" makes the writing feel conversational rather than formal. The long list followed by a dash and the word "yet" creates a structural pause — a moment of reflection as the reader considers the irony of such a revolutionary invention having an unknown creator.'
        }
      },
      {
        number: 25,
        type: 'vocabulary',
        stem: 'Read this dictionary entry for the word sexagesimal from paragraph 6.\n\nsexagesimal (SEK suh JEH suh muhl) adj\nrelating to or based on the number 60',
        prompt: 'Based on this definition and context clues in the passage, how is a sexagesimal place value system different from a decimal place value system?',
        options: [
          { letter: 'A', text: 'It has 60 different numerals instead of 10.', correct: false, stopLabel: 'Tricky' },
          { letter: 'B', text: 'It uses base 60 instead of base 10.', correct: true, stopLabel: 'Proven' },
          { letter: 'C', text: 'Its placeholders represent 60 instead of 10.', correct: false, stopLabel: 'Tricky' },
          { letter: 'D', text: 'It uses 60, which is a power of 10.', correct: false, stopLabel: 'Silly' }
        ],
        raceJustification: {
          restate: 'The difference between a sexagesimal and a decimal place value system is the base number used.',
          answer: 'The answer is B because the text defines sexagesimal as base-60 while decimal means base-10.',
          cite: 'Paragraph 6 states "a sexagesimal, or base-60, place value system." The word "decimal" comes from "decem," the Latin word for ten (defined in paragraph 2).',
          explain: 'The key difference is the base: sexagesimal uses 60 as the base, decimal uses 10. A uses "60 different numerals" — but the text says nothing about 60 different symbols. C confuses the placeholder with the base. D is factually wrong since 60 is not a power of 10.'
        }
      },
      {
        number: 26,
        type: 'paraphrase',
        stem: 'Read the final paragraph of the passage (paragraph 9):\n\n"While questions remain about who is responsible for these mathematical breakthroughs, one thing is clear: they were made possible by the work of previous mathematicians and the slow accumulation of a body of mathematical knowledge over time. They also demonstrate that mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part."',
        prompt: 'Which of the following accurately paraphrases the final paragraph of the passage?',
        options: [
          {
            letter: 'A',
            text: 'No one knows who made these mathematical breakthroughs, but it is clear that they would not have occurred without previous mathematicians and their hard work. Famous people often take credit for mathematical breakthroughs that were actually the work of anonymous mathematicians.',
            correct: false,
            stopLabel: 'Tricky',
            distortion: 'Adds idea not in text: "Famous people often take credit" — the paragraph does NOT say this.'
          },
          {
            letter: 'B',
            text: 'We may never know who is responsible for these mathematical breakthroughs. However, if mathematicians work together, they can slowly piece the clues together over time to identify the famous and previously unknown mathematicians who made them possible.',
            correct: false,
            stopLabel: 'Opposite',
            distortion: 'Changes the meaning: the paragraph is about past discoveries being collective, NOT about future research to identify inventors.'
          },
          {
            letter: 'C',
            text: 'It is unclear who made these mathematical breakthroughs. However, they clearly would not have happened without the work of previous mathematicians and the knowledge they slowly gathered over time. Mathematics is a collective effort made up of contributions from known and unknown mathematicians.',
            correct: true,
            stopLabel: 'Proven',
            distortion: null
          },
          {
            letter: 'D',
            text: 'It is not clear why these mathematical breakthroughs were credited to one person when it is obvious they would not have occurred without the hard work and slowly acquired knowledge of generations. Mathematical breakthroughs should not be credited to any one person as they are clearly collective efforts.',
            correct: false,
            stopLabel: 'Tricky',
            distortion: 'Too strong: "should not be credited" is an opinion/argument not in the original. The paragraph says "both unknown and celebrated mathematicians play a part" — not that individuals should be denied credit.'
          }
        ],
        raceJustification: {
          restate: 'The accurate paraphrase of paragraph 9 captures all main ideas without adding or distorting meaning.',
          answer: 'The answer is C because it accurately restates that the breakthroughs were unclear in origin, built on previous work, and represent a collective effort.',
          cite: 'Paragraph 9 says "they were made possible by the work of previous mathematicians" and "mathematics is a collective endeavor in which both unknown and celebrated mathematicians play a part."',
          explain: 'Answer C correctly paraphrases by preserving all three main ideas: uncertain origin, dependence on prior work, and collective contribution. A adds "famous people take credit" which is not in the text. B changes the meaning to future detective work. D is too strong — it argues "should not be credited" to one person, which is an argument the author does not make.'
        }
      }
    ],

    achievementLevels: [
      {
        level: 2,
        label: 'Approaching',
        descriptor: 'Identifies the text structure with limited or indirect explanation of how it contributes to meaning.'
      },
      {
        level: 3,
        label: 'Meets',
        descriptor: 'Explains how the author\'s use of text structure contributes to the meaning of the text using relevant textual evidence.'
      },
      {
        level: 4,
        label: 'Exceeds',
        descriptor: 'Analyzes how the author uses multiple text structures and how each contributes to the overall meaning and development of the central idea.'
      },
      {
        level: 5,
        label: 'Mastery',
        descriptor: 'Evaluates how the author\'s deliberate structural choices — including the sequencing of ideas and use of organizational patterns — shape meaning and guide the reader\'s understanding.'
      }
    ],

    stopProtocol: {
      description: 'Use STOP to analyze each MC answer choice before selecting.',
      steps: [
        { letter: 'S', label: 'Silly', description: 'This answer is clearly wrong or absurd — eliminate it first.' },
        { letter: 'T', label: 'Tricky', description: 'This answer sounds right but misses the main point, adds ideas not in the text, or is too strong.' },
        { letter: 'O', label: 'Opposite', description: 'This answer says the opposite of what the text actually shows.' },
        { letter: 'P', label: 'Proven', description: 'This answer is directly supported by evidence in the text — this is the correct answer.' }
      ]
    },

    raceExemplar: {
      prompt: 'According to the author, why is it difficult to identify who invented our modern number system? Use evidence from the text to support your answer.',
      response: {
        restate: 'According to the author of "The Source of Mathematical Innovations," it is difficult to identify who invented our modern number system for several interconnected reasons.',
        answer: 'The main difficulty is that the number system developed gradually over centuries through contributions from multiple cultures and mathematicians, rather than being invented by a single person at one time.',
        cite: 'In paragraph 3, the author explains that "Muslim authors...were writing about the Indian decimal place value system that they had learned about from Hindu texts and were eager to share what they learned with others." Additionally, paragraph 4 states that "These combined efforts help explain the hyphenated name \'Hindu-Arabic\' and why we can\'t attribute our number system to a single mathematician."',
        explain: 'This evidence shows that the difficulty comes from the collaborative nature of the discovery. The number system passed through multiple cultures — from Indian mathematicians who first used it, to Arabic scholars who translated and spread it, to European mathematicians who adopted it. Each group contributed modifications, making it impossible to credit just one inventor. The very name "Hindu-Arabic" reflects this shared origin. Rather than a single "eureka moment," the number system evolved through what paragraph 9 calls "the slow accumulation of a body of mathematical knowledge over time."'
      },
      score: '4/4'
    }
  },

  downloads: [
    {
      label: 'Math Innovations — Original Passage (PDF)',
      filename: 'Math Innovations.pdf',
      path: 'downloads/Math Innovations.pdf'
    }
  ]
};

if (typeof module !== 'undefined') module.exports = UNIT;
