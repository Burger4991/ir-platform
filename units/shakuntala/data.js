// units/shakuntala/data.js
// Shakuntala — 4-Day Literary Elements Test Prep Unit
// Source: Shakuntala_D1-4_TestPrep_Interactive_v9.html + Unit4_Shakuntala_TeacherLessonPlan.md

const UNIT = {
  meta: {
    id: 'shakuntala',
    title: 'Shakuntala',
    benchmark: 'ELA.10.R.1.1',
    benchmarkLabel: 'Literary Elements',
    benchmarkDescription: 'Analyze how an author develops and individualizes the responses of characters to situations using literary elements and devices',
    days: 4,
    status: 'live',
    tags: ['Literary', 'Drama', 'World Literature', 'Test Prep']
  },

  days: {
    1: {
      label: 'Day 1 — Context Clues + CUBES Annotation',
      bellringer: {
        words: ['wistfulness', 'reverence', 'presentment'],
        questions: [
          {
            stem: '1. After looking at old photographs, Maria felt a sense of __________ for her childhood.',
            options: [
              { letter: 'A', text: 'anger', correct: false, stopLabel: 'Silly' },
              { letter: 'B', text: 'wistfulness', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'excitement', correct: false, stopLabel: 'Tricky' },
              { letter: 'D', text: 'confusion', correct: false, stopLabel: 'Opposite' }
            ],
            writtenPrompt: 'Use the word "wistfulness" correctly in a sentence about a place you miss.',
            writtenModel: 'She felt a deep wistfulness whenever she passed her old elementary school, remembering the carefree days of her childhood.'
          },
          {
            stem: '2. The students showed __________ for the guest speaker by listening quietly.',
            options: [
              { letter: 'A', text: 'reverence', correct: true, stopLabel: 'Proven' },
              { letter: 'B', text: 'boredom', correct: false, stopLabel: 'Opposite' },
              { letter: 'C', text: 'hostility', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'indifference', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'Describe a situation where you or someone you know showed reverence.',
            writtenModel: 'The crowd stood in reverence as the national anthem played, each person placing a hand over their heart in quiet honor.'
          },
          {
            stem: '3. She had a strange __________ that something important would happen today.',
            options: [
              { letter: 'A', text: 'confusion', correct: false, stopLabel: 'Tricky' },
              { letter: 'B', text: 'disappointment', correct: false, stopLabel: 'Silly' },
              { letter: 'C', text: 'presentment', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'memory', correct: false, stopLabel: 'Opposite' }
            ],
            writtenPrompt: 'Write a sentence using "presentment" about a time someone had a strong feeling about the future.',
            writtenModel: 'He had a strong presentment before the championship game that his team would win, and sure enough, they scored in the final seconds.'
          }
        ]
      },
      vocab: [
        {
          word: 'wistfulness',
          partOfSpeech: 'noun',
          definition: 'longing or melancholy; pensive sadness for something past',
          example: '"Why am I filled with wistfulness on hearing such a song?" (paragraph 16) — the King feels sad longing without knowing why.'
        },
        {
          word: 'reverence',
          partOfSpeech: 'noun',
          definition: 'deep respect, often shown through actions or behavior',
          example: '"SHAKUNTALA makes a shamefaced reverence." (paragraph 2) — she bows her head in deep, humble respect.'
        },
        {
          word: 'presentment',
          partOfSpeech: 'noun',
          definition: 'a feeling or sense that something is about to happen; a premonition',
          example: '"In face of sweet presentment / Of things long past" (paragraph 16) — a felt sense of something beyond memory.'
        }
      ],
      teacherNotes: 'Day 1 — Context Clues + CUBES Annotation Model (20 min Teacher-Led). Answer Key: 1-B (wistfulness), 2-A (reverence), 3-C (presentment). STOP Labels: Q1: A=S, B=P, C=T, D=O | Q2: A=P, B=O, C=S, D=T | Q3: A=T, B=S, C=P, D=O. ESOL: Pre-teach word forms. Use gestures — wistfulness: gaze sadly into distance and sigh; reverence: bow with hands folded; presentment: point forward with knowing expression. Text Preview: Show India on map. Explain drama format (character names in CAPS, [stage directions], verse/poetry). Key context: a CURSE makes the King forget Shakuntala. I DO: Model CUBES annotation on paragraphs 1-2. Mark THREE things simultaneously — drama features (underline), key details (circle), question predictions (evidence notes). WE DO: Guide paragraphs 8-12. Focus on paragraph 12 aside as KEY paragraph. YOU DO: Partners annotate paragraphs 13-14.',
      organizer: {
        benchmarkFocus: 'Literary Elements — Day 1: Drama Format & Character Introduction',
        columns: ['GR Phase', 'Literary Element', 'Evidence from Text', 'Effect on Character/Mood'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'Verse / Poetry — Kanva speaks in rhyming lines',
              '"What must a father feel, when come / The pangs of parting from his child at home?" (paragraph 1)',
              'Creates a solemn, sorrowful mood; shows Kanva\'s deep grief at saying goodbye'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: [
              'We Do',
              'Aside — Shakuntala speaks privately to Priyamvada',
              '"I long to see my husband, and yet my feet will hardly move. It is hard, hard to leave the hermitage." (paragraph 12)',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: [
              'You Do w/ Partner',
              'Stage Direction — nature mourns Shakuntala\'s departure',
              '"The grass drops from the feeding doe; / The peahen stops her dance..." (paragraph 13)',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: [
              'You Do',
              'Verse / Monologue — King reflects on unexplained longing',
              '"In face of sweet presentment / Of things long past, there clings / A dim, sad yearning / By wistful longings bound." (paragraph 16)',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },
      textPassage: {
        title: 'Shakuntala by Kalidasa (excerpts from Acts IV & V)',
        paragraphs: [
          { number: 1, text: 'KANVA: [verse] Shakuntala must go to-day; / I miss her now at heart; / I dare not speak a loving word / Or choking tears will start. // My eyes are dim with anxious thought; / Love strikes me to the life: / And yet I strove for pious peace — / I have no child, no wife. // What must a father feel, when come / The pangs of parting from his child at home? [He walks about the two friends.] There, Shakuntala, we have arranged your ornaments. Now put on this beautiful silk dress. [SHAKUNTALA rises and does so.]' },
          { number: 2, text: 'GAUTAMI: My child, here is your father. The eyes with which he seems to embrace you are overflowing with tears of joy. You must greet him properly. [SHAKUNTALA makes a shamefaced reverence.]' },
          { number: 3, text: '[Kanva and Shakuntala take part in a brief spiritual ceremony.]' },
          { number: 4, text: 'KANVA: Now you may start, my daughter. [He glances about.] Where are Sharngarava and Sharadvata? [Enter the two pupils.]' },
          { number: 5, text: 'SHARNGARAVA and SHARADVATA: We are here, Father.' },
          { number: 6, text: 'KANVA: Sharngarava, my son, lead the way for your sister.' },
          { number: 7, text: 'SHARNGARAVA: Follow me. [They all walk about.]' },
          { number: 8, text: 'KANVA: O trees of the pious grove, in which the fairies dwell, [verse] She would not drink till she had wet / Your roots, a sister\'s duty, / Nor pluck your flowers; she loves you yet / Far more than selfish beauty. // \'Twas festival in her pure life / When budding blossoms showed; / And now she leaves you as a wife — / Oh, speed her on her road!' },
          { number: 9, text: 'SHARNGARAVA: [listening to the song of koil-birds] Father, [verse] The trees are answering your prayer / In cooing cuckoo-song, / Bidding Shakuntala farewell, / Their sister for so long. // [Invisible beings:] May lily-dotted lakes delight your eye; / May shade-trees bid the heat of noonday cease; / May soft winds blow the lotus-pollen nigh; / May all your path be pleasantness and peace.' },
          { number: 10, text: '[All listen in astonishment.]' },
          { number: 11, text: 'GAUTAMI: My child, the fairies of the pious grove bid you farewell. For they love the household. Pay reverence to the holy ones.' },
          { number: 12, text: 'SHAKUNTALA: [does so. Aside to PRIYAMVADA] Priyamvada, I long to see my husband, and yet my feet will hardly move. It is hard, hard to leave the hermitage.' },
          { number: 13, text: 'PRIYAMVADA: You are not the only one to feel sad at this farewell. See how the whole grove feels at parting from you. [verse] The grass drops from the feeding doe; / The peahen stops her dance; / Pale, trembling leaves are falling slow, / The tears of clinging plants.' },
          { number: 14, text: '[Shakuntala bids farewell to the plants and animals of the grove. Kanva promises to care for them in her absence and asks Shakuntala to tell the King that he, Kanva, reminds the King of his religious duty to honor and respect Shakuntala as his wife. Kanva also gives Shakuntala advice about how best to act in the King\'s household, suggesting she be kind and faithful. Shakuntala reluctantly departs, and Kanva expresses his sorrow at her leaving.]' },
          { number: 15, text: '[King Dushyanta relaxes at court. He listens to a song about lost love.]' },
          { number: 16, text: 'KING: Why am I filled with wistfulness on hearing such a song? I am not separated from one I love. And yet, [verse] In face of sweet presentment / Of things long past, there clings / A dim, sad yearning / By wistful longings bound.' },
          { number: 17, text: '[Kanva\'s pupils arrive at court with Shakuntala. They present her to the King, explaining that she is his wife.]' },
          { number: 18, text: 'KING: What does this mean?' },
          { number: 19, text: 'SHAKUNTALA: [aside] Oh, oh! He does not even greet me with a look. He does not even answer them.' },
          { number: 20, text: 'SHARNGARAVA: Your Majesty promised to marry Shakuntala. You must take her as your wife.' },
          { number: 21, text: 'KING: I have no memory of this. I do not recall any marriage.' },
          { number: 22, text: 'SHAKUNTALA: My husband, why do you say such a thing?' },
          { number: 23, text: 'KING: [aside] Shall I deny my marriage, and so be stained with guilt? Or shall I confess it, and so bring shame upon my house?' },
          { number: 24, text: '[The King continues to deny the marriage. Shakuntala is devastated. Kanva\'s pupils are outraged.]' },
          { number: 25, text: 'GAUTAMI: Shakuntala, your husband has abandoned you. Come, we must leave this place.' },
          { number: 26, text: 'KING: [gazing at SHAKUNTALA] [verse] My mind does not recall that I did wed / This timid maid; and yet my heart / Is torn with doubt, as if perhaps / I did, and have forgot.' },
          { number: 27, text: '[Shakuntala leaves, heartbroken. The King is left in confusion. Later, a magical ring is found that restores his memory of Shakuntala and their marriage.]' },
          { number: 28, text: 'KING: [recovering his memory] Yes! Yes, I remember now! Shakuntala is my beloved wife. How could I have forgotten? What curse made me blind? I must find her!' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle key character details, emotions, and important actions', example: 'circle "I long to see my husband" and "my feet will hardly move" in paragraph 12' },
          { letter: 'U', action: 'Underline drama features — stage directions, asides, verse sections', example: 'underline [aside to PRIYAMVADA], [shamefaced reverence], all verse lines' },
          { letter: 'B', action: 'Box paragraph numbers where important moments occur', example: 'box paragraph 12 (aside), paragraph 16 (wistfulness), paragraph 26 (King gazes)' },
          { letter: 'E', action: 'Evidence — write margin notes predicting what questions will ask', example: 'write "Q19 — function of aside?" next to paragraph 12' },
          { letter: 'S', action: 'Stop and eliminate wrong answer choices using STOP labels', example: 'label each choice S (Silly), T (Tricky), O (Opposite), P (Proven)' }
        ]
      },
      esol: {
        l12: {
          frames: [
            'The word "wistfulness" means _____ because the context clue "_____" tells me _____.',
            'Shakuntala feels _____ in paragraph 12 because she says "_____", which shows _____.'
          ],
          wordBank: ['longing', 'sadness', 'conflict', 'aside', 'husband', 'hermitage', 'reverence', 'respect']
        },
        l34: {
          frames: [
            'In paragraph _____, the literary element of _____ shows that Shakuntala feels _____.',
            'The stage direction [_____] in paragraph _____ reveals that _____.'
          ],
          wordBank: ['verse', 'aside', 'stage direction', 'conflict', 'departure']
        },
        l5: {
          frames: [
            'Kalidasa uses the literary element of _____ in paragraph _____ to reveal _____\'s internal conflict between _____ and _____, which develops her character as someone who _____.'
          ]
        }
      },
      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 20, passage: 10, closure: 5 },
      exitTicket: {
        prompt: 'Based on paragraph 12, Shakuntala\'s aside reveals that she feels—',
        frame: 'The aside in paragraph 12 reveals that Shakuntala feels _____ because she says "_____", which shows _____.',
        options: [
          { letter: 'A', text: 'excited and eager to see the king', correct: false, stopLabel: 'Tricky' },
          { letter: 'B', text: 'conflicted about leaving her home', correct: true, stopLabel: 'Proven' },
          { letter: 'C', text: 'angry at her father for making her go', correct: false, stopLabel: 'Silly' },
          { letter: 'D', text: 'confident about her future with the king', correct: false, stopLabel: 'Opposite' }
        ]
      },
      raceFrames: {
        task: 'What is Shakuntala\'s main conflict in Act IV?',
        restate: 'Shakuntala\'s main conflict in Act IV is _____.',
        answer: 'She struggles between _____ and _____.',
        cite: 'In paragraph _____, the text states, "_____."',
        explain: 'This shows her conflict because _____.'
      },
      progressItems: [
        'Complete bellringer (vocabulary context clues)',
        'Learn three vocabulary words: wistfulness, reverence, presentment',
        'Learn drama format conventions (dialogue, stage directions, asides, verse)',
        'Read passage paragraphs 1-28 with annotation',
        'Annotate with CUBES (circle, underline, box, evidence, stop)',
        'Fill organizer I Do row (Kanva\'s verse in paragraph 1)',
        'Exit ticket — identify Shakuntala\'s conflict from paragraph 12'
      ],
      engageActivities: [
        {
          type: 'tps',
          prompt: 'Have you ever felt torn between staying somewhere safe and taking a risk? Think about Shakuntala\'s situation — she is leaving her childhood home forever to join a husband she barely knows. What emotions would you feel?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        },
        {
          type: 'poll',
          question: 'Based on paragraph 12, Shakuntala\'s aside reveals that she feels—',
          choices: [
            'A. Excited and eager to see the king',
            'B. Conflicted — she wants to go but cannot bear to leave',
            'C. Angry at her father for making her leave',
            'D. Confident and ready for her new life'
          ],
          correct: 'B'
        }
      ]
    },

    2: {
      label: 'Day 2 — CUBES for Test Questions',
      bellringer: {
        words: ['wistfulness', 'reverence', 'presentment'],
        questions: [
          {
            stem: '1. The elderly man felt __________ as he watched children playing, remembering his own youth.',
            options: [
              { letter: 'A', text: 'wistfulness', correct: true, stopLabel: 'Proven' },
              { letter: 'B', text: 'reverence', correct: false, stopLabel: 'Tricky' },
              { letter: 'C', text: 'presentment', correct: false, stopLabel: 'Opposite' },
              { letter: 'D', text: 'anger', correct: false, stopLabel: 'Silly' }
            ],
            writtenPrompt: 'Write a sentence using "wistfulness" about something from your own past.',
            writtenModel: 'She felt a wave of wistfulness whenever she heard the song that played at her eighth-grade graduation.'
          },
          {
            stem: '2. The community showed __________ for the war veterans by holding a special ceremony.',
            options: [
              { letter: 'A', text: 'wistfulness', correct: false, stopLabel: 'Tricky' },
              { letter: 'B', text: 'presentment', correct: false, stopLabel: 'Opposite' },
              { letter: 'C', text: 'reverence', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'confusion', correct: false, stopLabel: 'Silly' }
            ],
            writtenPrompt: 'Describe a moment when you witnessed someone showing reverence.',
            writtenModel: 'The younger students watched with reverence as the senior athletes received their championship rings on the court.'
          },
          {
            stem: '3. Despite having no proof, she had a strong __________ that her missing keys were in her car.',
            options: [
              { letter: 'A', text: 'reverence', correct: false, stopLabel: 'Tricky' },
              { letter: 'B', text: 'wistfulness', correct: false, stopLabel: 'Opposite' },
              { letter: 'C', text: 'memory', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'presentment', correct: true, stopLabel: 'Proven' }
            ],
            writtenPrompt: 'Write a sentence using "presentment" about a situation involving a gut feeling.',
            writtenModel: 'She had a strong presentment as she walked into the exam that she had studied all the wrong chapters.'
          }
        ]
      },
      vocab: [
        {
          word: 'wistfulness',
          partOfSpeech: 'noun',
          definition: 'longing or melancholy; pensive sadness for something past',
          example: 'The King\'s wistfulness at hearing the song in paragraph 16 is an early sign that his memory of Shakuntala is not completely erased.'
        },
        {
          word: 'reverence',
          partOfSpeech: 'noun',
          definition: 'deep respect, often shown through actions or behavior',
          example: 'Shakuntala\'s shamefaced reverence to Kanva (paragraph 2) shows both her love and her awareness that she is leaving his protection forever.'
        },
        {
          word: 'presentment',
          partOfSpeech: 'noun',
          definition: 'a feeling or sense that something is about to happen; a premonition',
          example: 'The King\'s "sweet presentment / Of things long past" (paragraph 16) describes his vague sense that something important has slipped from his memory.'
        }
      ],
      teacherNotes: 'Day 2 — CUBES for Test Questions (20 min Teacher-Led). Answer Key: 1-A (wistfulness), 2-C (reverence), 3-D (presentment). Words applied to NEW contexts — application level. I DO: Model CUBES on Q16 step-by-step. UNDERLINE what it asks ("meaning of wistfulness"), BOX the paragraph reference (paragraph 16), CIRCLE matching context clues ("dim, sad yearning," "wistful longings"), EVIDENCE note ("longings = longing/melancholy"). WE DO: Guide Q17. Students identify alliteration vs. consonance — both present, but alliteration (father/feel, pangs/parting) creates the sadness and longing mood. Answer = C. Turn and Talk: Partners annotate Q18. Independent: Q18-22 answer keys: Q18=C, Q19=A, Q20A=C, Q20B=D, Q21=B, Q22=D. Exit Ticket = B ("function" means WHY/PURPOSE, not summarize or describe).',
      organizer: {
        benchmarkFocus: 'Literary Elements — Day 2: Identifying Dramatic Devices in Test Questions',
        columns: ['GR Phase', 'Literary/Dramatic Device', 'Where in Text (paragraph)', 'Function / Effect'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'Alliteration — "father/feel, pangs/parting"',
              'Paragraph 1 — Kanva\'s farewell verse',
              'Creates a mood of sadness and longing; the repeated sounds emphasize the emotional weight of separation'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: [
              'We Do',
              'Aside — Shakuntala speaks privately to Priyamvada',
              'Paragraph 12 — "I long to see my husband..."',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: [
              'You Do w/ Partner',
              'abab Rhyme Scheme — in King\'s verse',
              'Paragraph 16 — "presentment / things long past / yearning / longings bound"',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: [
              'You Do',
              'Scene / Author\'s Purpose — King gazes at Shakuntala',
              'Paragraph 26 — "my heart / Is torn with doubt"',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },
      textPassage: {
        title: 'Shakuntala by Kalidasa (excerpts from Acts IV & V)',
        paragraphs: [],
        cubesGuide: [
          { letter: 'C', action: 'Circle ideas and details in answer choices that ARE in the text', example: 'circle "longing" — that IS in paragraph 16 near "wistfulness"' },
          { letter: 'U', action: 'Underline what the question is asking you to find', example: 'underline "meaning of wistfulness in paragraph 16"' },
          { letter: 'B', action: 'Box paragraph numbers mentioned in questions or answer choices', example: 'box "paragraph 16" — tells you exactly where to look' },
          { letter: 'E', action: 'Evidence — go back to the text and find proof before selecting', example: 'note "dim, sad yearning" + "wistful longings" = longing/melancholy' },
          { letter: 'S', action: 'Stop — label each choice S, T, O, or P before choosing', example: 'label A=P (longing/melancholy), B=T (sounds right but not precise)' }
        ]
      },
      esol: {
        l12: {
          frames: [
            'Q16: "Wistfulness" in paragraph 16 means _____ because the text says "_____."',
            'Q19: The aside in paragraph 12 reveals that Shakuntala feels _____ because she says "_____."'
          ],
          wordBank: ['longing', 'melancholy', 'sadness', 'conflict', 'torn', 'husband', 'hermitage', 'internal', 'struggle']
        },
        l34: {
          frames: [
            'The function of the aside in paragraph 12 is to reveal _____ because without an aside, the reader would not know that _____.',
            'The alliteration in paragraph 1 creates a mood of _____ because the repeated _____ sounds draw attention to the words _____ and _____.'
          ],
          wordBank: ['internal struggle', 'dramatic device', 'alliteration', 'mood', 'sadness', 'longing']
        },
        l5: {
          frames: [
            'The dramatic device of _____ in paragraph _____ functions to _____, which is significant because it reveals _____\'s _____ that could not be expressed through direct dialogue.'
          ]
        }
      },
      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 20, passage: 10, closure: 5 },
      exitTicket: {
        prompt: 'Q19 asks "What is the primary function of this aside?" What is this question really asking?',
        frame: 'The question is asking me to explain _____ because "function" means _____, not _____.',
        options: [
          { letter: 'A', text: 'Summarize what Shakuntala says in the aside', correct: false, stopLabel: 'Tricky' },
          { letter: 'B', text: 'Explain WHY the author included the aside and what it reveals', correct: true, stopLabel: 'Proven' },
          { letter: 'C', text: 'Compare Shakuntala\'s aside to other characters\' dialogue', correct: false, stopLabel: 'Silly' },
          { letter: 'D', text: 'Describe where asides appear in the play', correct: false, stopLabel: 'Opposite' }
        ]
      },
      raceFrames: {
        task: 'What is the primary function of the aside in paragraph 12?',
        restate: 'The primary function of the aside in paragraph 12 is _____.',
        answer: 'It reveals Shakuntala\'s internal conflict between _____ and _____.',
        cite: 'In paragraph 12, Shakuntala says privately, "_____."',
        explain: 'The aside is significant because it reveals thoughts Shakuntala cannot express publicly — while she outwardly prepares to leave, inside she is _____.'
      },
      progressItems: [
        'Complete bellringer (vocabulary application to new contexts)',
        'Review three vocabulary words in new contexts',
        'Apply CUBES to test question Q16 (wistfulness meaning)',
        'Apply CUBES to Q17 (alliteration effect)',
        'Apply CUBES independently to Q18-22',
        'Fill organizer We Do row (aside function)',
        'Exit ticket — understand what "function" means in test questions'
      ],
      engageActivities: [
        {
          type: 'tps',
          prompt: 'When you see a question that uses the word "function" or "purpose," what is it really asking you to do? How is that different from "summarize" or "describe"?',
          thinkSeconds: 45,
          pairSeconds: 60,
          shareSeconds: 0
        },
        {
          type: 'poll',
          question: 'Q17: Which statement describes the effect of the figurative language in "What must a father feel, when come / The pangs of parting from his child at home"?',
          choices: [
            'A. The consonance (what/when, come/child) creates surprise and thankfulness.',
            'B. The consonance (what/when, come/child) creates loss and confusion.',
            'C. The alliteration (father/feel, pangs/parting) creates sadness and longing.',
            'D. The alliteration (father/feel, pangs/parting) creates joy and pride.'
          ],
          correct: 'C'
        }
      ]
    },

    3: {
      label: 'Day 3 — STOP Elimination + CER Justification',
      bellringer: {
        words: ['wistfulness', 'reverence', 'presentment'],
        questions: [
          {
            stem: '1. WISTFULNESS — which sentence uses it correctly?',
            options: [
              { letter: 'A', text: 'The team\'s wistfulness led them to win the game.', correct: false, stopLabel: 'Silly' },
              { letter: 'B', text: 'She felt wistfulness as she packed away childhood toys.', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'His wistfulness made everyone laugh at the party.', correct: false, stopLabel: 'Opposite' },
              { letter: 'D', text: 'The wistfulness of the room was bright and cheerful.', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'Write a sentence of your own using wistfulness correctly.',
            writtenModel: 'He listened to his grandmother\'s old records with wistfulness, wishing he could have known her when she was young.'
          },
          {
            stem: '2. REVERENCE — which sentence uses it correctly?',
            options: [
              { letter: 'A', text: 'Students showed reverence by talking loudly during the ceremony.', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'They treated the ancient temple with reverence and respect.', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'His reverence for rules meant he broke them constantly.', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'The reverence of the joke made everyone upset.', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'Write a sentence showing reverence in a school or community setting.',
            writtenModel: 'The students listened with reverence as the Holocaust survivor shared her story, not a single voice interrupting the silence.'
          },
          {
            stem: '3. PRESENTMENT — which sentence uses it correctly?',
            options: [
              { letter: 'A', text: 'I had a presentment that I would ace the test, and I did.', correct: true, stopLabel: 'Proven' },
              { letter: 'B', text: 'The presentment of the gift was wrapped in blue paper.', correct: false, stopLabel: 'Tricky' },
              { letter: 'C', text: 'She gave a presentment to the class about her project.', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'His presentment at the meeting lasted twenty minutes.', correct: false, stopLabel: 'Opposite' }
            ],
            writtenPrompt: 'Write a sentence using "presentment" about a gut feeling you or a character has.',
            writtenModel: 'Shakuntala must have felt a presentment of sorrow as she left the hermitage — as if part of her already knew the King would not remember her.'
          }
        ]
      },
      vocab: [
        {
          word: 'wistfulness',
          partOfSpeech: 'noun',
          definition: 'longing or melancholy; pensive sadness for something past',
          example: 'Context clue check for Q16: replace "wistfulness" with "longing or melancholy" in paragraph 16 — the sentence still makes sense. That confirms the meaning.'
        },
        {
          word: 'reverence',
          partOfSpeech: 'noun',
          definition: 'deep respect, often shown through actions or behavior',
          example: 'In paragraphs 2 and 11, reverence is shown through bowing and paying honor — the physical action proves the meaning.'
        },
        {
          word: 'presentment',
          partOfSpeech: 'noun',
          definition: 'a feeling or sense that something is about to happen; a premonition',
          example: 'The King\'s "sweet presentment / Of things long past" — a felt sense that something important lies just beyond what he can remember.'
        }
      ],
      teacherNotes: 'Day 3 — STOP Elimination + CER Justification (20 min Teacher-Led). Answer Key: 1-B, 2-B, 3-A. Correct Usage level — harder than context clues; students must recognize misuse. I DO: Full STOP elimination + CER on Q20A. Work through EACH wrong choice: A = Silly (Act IV is Departure, not Rejection — she has not seen the King yet), B = Silly (she is following duty, not challenging culture), C = Proven (paragraph 12: "I long to see my husband, and yet my feet will hardly move"), D = Tricky (sounds right, but she is ALREADY married — conflict is about GOING, not deciding to marry). Then model complete CER. WE DO: Partners do Q20B with STOP + CER at board. Independent: Q16-22 all with STOP labels + CER. Target: 7 CER justifications. Monitor for crossing out choices, returning to passage, reasoning that EXPLAINS. Exit Ticket = C (eliminate ALL wrong until 1 remains — STOP is systematic, not guessing).',
      organizer: {
        benchmarkFocus: 'Literary Elements — Day 3: STOP Elimination + CER Justification',
        columns: ['GR Phase', 'Question', 'STOP Label for Each Choice (S/T/O/P)', 'CER Justification for Correct Answer'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'Q20A: Which statement best describes the conflict Shakuntala confronts in Act IV?',
              'A=Silly (Act IV is Departure not Rejection), B=Silly (no cultural challenge shown), C=Proven (paragraph 12 aside), D=Tricky (she is already married; conflict is about going, not deciding)',
              'CLAIM: C — she struggles to leave home. EVIDENCE: Paragraph 12 "I long to see my husband, and yet my feet will hardly move." REASONING: "Longs" shows she wants to go; "feet will hardly move" + "hard, hard" show she wants to stay — classic internal conflict.'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: [
              'We Do',
              'Q20B: How does the conflict change Shakuntala?',
              'A=Tricky, B=Silly, C=Opposite, D=Proven',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: [
              'You Do w/ Partner',
              'Q19: What is the primary function of the aside in paragraph 12?',
              'A=Proven, B=Silly, C=Tricky, D=Opposite',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: [
              'You Do',
              'Q17: Which statement describes the effect of the figurative language in paragraph 1?',
              'A=Tricky, B=Silly, C=Proven, D=Opposite',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },
      textPassage: {
        title: 'Shakuntala by Kalidasa (excerpts from Acts IV & V)',
        paragraphs: [],
        cubesGuide: [
          { letter: 'C', action: 'Circle the answer choice that matches text evidence', example: 'circle choice C for Q20A — it matches paragraph 12 exactly' },
          { letter: 'U', action: 'Underline both parts of two-part questions (Part A and Part B)', example: 'underline "conflict" in Part A and "how it changes" in Part B' },
          { letter: 'B', action: 'Box paragraph numbers and go back before selecting', example: 'box paragraph 12 for Q19 — read the actual aside before choosing' },
          { letter: 'E', action: 'Evidence — quote the text in your CER justification', example: '"I long to see my husband, and yet my feet will hardly move." (paragraph 12)' },
          { letter: 'S', action: 'Stop — label ALL four choices before picking; eliminate S, T, O until only P remains', example: 'D is Tricky for Q20A because she is already married — the conflict is about going, not deciding' }
        ]
      },
      esol: {
        l12: {
          frames: [
            'The correct answer is _____ because paragraph _____ says "_____."',
            'I eliminated _____ because it is [Silly / Tricky / Opposite] — it says _____, but the text actually says _____.'
          ],
          wordBank: ['conflict', 'aside', 'internal struggle', 'evidence', 'proven', 'eliminate', 'correct', 'wrong']
        },
        l34: {
          frames: [
            'CLAIM: The correct answer is _____ because _____.',
            'EVIDENCE: In paragraph _____, the text states, "_____."',
            'REASONING: This proves the answer because _____.'
          ],
          wordBank: ['alliteration', 'aside', 'conflict', 'character', 'mood', 'sadness', 'longing', 'internal']
        },
        l5: {
          frames: [
            'CLAIM: The correct answer is _____ because the literary element of _____ in paragraph _____ directly supports this interpretation. EVIDENCE: "_____" (paragraph ___). REASONING: This proves the answer because _____, which demonstrates that _____.'
          ]
        }
      },
      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 20, passage: 5, closure: 5 },
      exitTicket: {
        prompt: 'How many answer choices should you eliminate with STOP?',
        frame: 'Using STOP means I must _____ so that _____.',
        options: [
          { letter: 'A', text: 'At least 1 wrong answer', correct: false, stopLabel: 'Tricky' },
          { letter: 'B', text: 'At least 2 wrong answers', correct: false, stopLabel: 'Opposite' },
          { letter: 'C', text: 'Eliminate ALL wrong answers until only 1 remains', correct: true, stopLabel: 'Proven' },
          { letter: 'D', text: 'You don\'t need to eliminate — just pick the best one', correct: false, stopLabel: 'Silly' }
        ]
      },
      raceFrames: {
        task: 'What is the primary function of the aside in paragraph 12, and what does it reveal about Shakuntala?',
        restate: 'The primary function of the aside in paragraph 12 is to _____.',
        answer: 'It reveals that Shakuntala feels _____ because she is torn between _____ and _____.',
        cite: 'In paragraph 12, Shakuntala says privately to Priyamvada, "_____."',
        explain: 'The aside is the author\'s tool for showing Shakuntala\'s internal struggle without breaking the drama\'s flow — it allows readers to know her _____ while the other characters remain unaware.'
      },
      progressItems: [
        'Complete bellringer (correct usage — hardest vocabulary level)',
        'Apply STOP labels to all four choices for Q20A',
        'Write CER justification for Q20A with teacher model',
        'Partner STOP + CER for Q20B',
        'Complete STOP + CER independently for Q16, Q17, Q18, Q19, Q21, Q22',
        'Fill organizer I Do and We Do rows',
        'Exit ticket — understand STOP is systematic elimination, not guessing'
      ],
      engageActivities: [
        {
          type: 'tps',
          prompt: 'Read your CER justification for Q17, Q18, or Q19 to your partner. Does your EVIDENCE actually PROVE your CLAIM — or are you just restating the question? How can you tell the difference?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        },
        {
          type: 'poll',
          question: 'Q20A: Which statement best describes the conflict Shakuntala confronts in Act IV?',
          choices: [
            'A. Shakuntala confronts the king\'s changed feelings about her.',
            'B. Shakuntala confronts the unequal treatment of women in her culture.',
            'C. Shakuntala struggles with leaving her home to reunite with the king.',
            'D. Shakuntala struggles with deciding whether to marry the king or stay.'
          ],
          correct: 'C'
        }
      ]
    },

    4: {
      label: 'Day 4 — CER Extended Response + Self-Assessment',
      bellringer: {
        words: ['wistfulness', 'reverence', 'presentment'],
        questions: [
          {
            stem: '1. What does "wistfulness" mean?',
            options: [
              { letter: 'A', text: 'extreme anger or rage', correct: false, stopLabel: 'Silly' },
              { letter: 'B', text: 'a feeling of longing or gentle sadness', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'complete happiness and joy', correct: false, stopLabel: 'Opposite' },
              { letter: 'D', text: 'confusion and uncertainty', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'In one sentence, explain how wistfulness is different from simple sadness.',
            writtenModel: 'Unlike regular sadness, wistfulness is a gentle, nostalgic longing — it is sadness mixed with fondness for something lost or past, not despair.'
          },
          {
            stem: '2. What does "reverence" mean?',
            options: [
              { letter: 'A', text: 'deep respect or honor', correct: true, stopLabel: 'Proven' },
              { letter: 'B', text: 'fear or anxiety', correct: false, stopLabel: 'Opposite' },
              { letter: 'C', text: 'boredom or indifference', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'playfulness or humor', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does Shakuntala show reverence in the drama? Cite a specific paragraph.',
            writtenModel: 'Shakuntala shows reverence in paragraph 2, where she "makes a shamefaced reverence" to Kanva, bowing in deep, humble respect before she departs.'
          },
          {
            stem: '3. What does "presentment" mean?',
            options: [
              { letter: 'A', text: 'a gift or present', correct: false, stopLabel: 'Silly' },
              { letter: 'B', text: 'a formal presentation', correct: false, stopLabel: 'Tricky' },
              { letter: 'C', text: 'a feeling about something that will happen', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'being present at an event', correct: false, stopLabel: 'Opposite' }
            ],
            writtenPrompt: 'How does the word "presentment" connect to the King\'s situation in paragraph 16?',
            writtenModel: 'The King\'s "sweet presentment / Of things long past" describes his mysterious sense that something important is just beyond his memory — a premonition that Shakuntala exists, though the curse prevents him from remembering her.'
          }
        ]
      },
      vocab: [
        {
          word: 'wistfulness',
          partOfSpeech: 'noun',
          definition: 'longing or melancholy; pensive sadness for something past',
          example: 'Final check: the King\'s wistfulness in paragraph 16 is the emotional trace left by the curse — he feels what he cannot remember.'
        },
        {
          word: 'reverence',
          partOfSpeech: 'noun',
          definition: 'deep respect, often shown through actions or behavior',
          example: 'Shakuntala\'s shamefaced reverence (paragraph 2) contrasts with her devastation in Act V — she left with respect; she arrives to rejection.'
        },
        {
          word: 'presentment',
          partOfSpeech: 'noun',
          definition: 'a feeling or sense that something is about to happen; a premonition',
          example: 'The King\'s presentment in paragraph 16 is dramatic irony — we know it IS Shakuntala\'s love he feels, even though he does not.'
        }
      ],
      teacherNotes: 'Day 4 — CER Extended Response (20 min Independent Writing). Answer Key: 1-B, 2-A, 3-C. Vocabulary Quiz — direct definitions, summative check, 5 min. Teacher-Led I DO: Model full extended CER response (275 words). Think aloud through prompt breakdown using CUBES: underline BOTH parts (1. how author develops conflict, 2. what resolution reveals about character), box key terms, identify key paragraphs (1, 8-13, 12 aside, 14 "reluctantly departs"). Read exemplar aloud. Point out: answers BOTH parts, uses 3 quotes with paragraph numbers, reasoning is 5+ sentences, uses literary terms (aside, verse, internal conflict). WE DO: Students identify CER components in exemplar at board. Independent: 200-300 word CER, 2+ quotes with paragraph numbers. Planning 5 min, Writing 15 min, Self-Assessment 5 min. Collect packets for review.',
      organizer: {
        benchmarkFocus: 'Literary Elements — Day 4: CER Extended Response Planning',
        columns: ['CER Component', 'What It Must Include', 'Evidence / Notes', 'Check'],
        rows: [
          {
            label: 'Claim',
            cells: [
              'Claim',
              'Answer BOTH parts: (1) how author develops internal conflict AND (2) what resolution reveals about character',
              'Sample: "Kalidasa develops Shakuntala\'s internal conflict through the aside in paragraph 12 and nature imagery in paragraph 13, revealing she values both love and home."',
              'Does claim address BOTH parts?'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'Evidence',
            cells: [
              'Evidence',
              '2+ direct quotes with paragraph numbers; quotation marks required',
              'Paragraph 12: "I long to see my husband, and yet my feet will hardly move. It is hard, hard to leave." Paragraph 14: "Shakuntala reluctantly departs."',
              ''
            ],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'Reasoning',
            cells: [
              'Reasoning',
              '3-5+ sentences; explain HOW evidence supports claim; use literary terms; connect to character',
              '"Reluctantly" + "hard, hard" = chose love and duty over comfort; reveals she is dutiful, brave, and capable of sacrifice',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'Self-Assessment',
            cells: [
              'Self-Assessment',
              'Check against checklist: claim addresses both parts, 2+ quotes with paragraph numbers, reasoning 3+ sentences using literary terms',
              'One thing to strengthen: _____',
              ''
            ],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },
      textPassage: {
        title: 'Shakuntala by Kalidasa (excerpts from Acts IV & V)',
        paragraphs: [],
        cubesGuide: [
          { letter: 'C', action: 'Circle key terms in the writing prompt that tell you what to include', example: 'circle "internal conflict," "how author develops," "what resolution reveals," "character"' },
          { letter: 'U', action: 'Underline BOTH parts of the prompt — you must answer both', example: 'underline "how does the author develop" AND "what does resolution reveal about her character"' },
          { letter: 'B', action: 'Box paragraph numbers for your evidence before writing', example: 'box paragraph 12 (aside), paragraph 13 (nature mourning), paragraph 14 (reluctantly departs)' },
          { letter: 'E', action: 'Evidence — select at least 2 direct quotes with paragraph numbers', example: '"I long to see my husband, and yet my feet will hardly move." (paragraph 12)' },
          { letter: 'S', action: 'Stop and self-assess against the checklist before submitting', example: 'check: Did I answer BOTH parts? Do I have 2+ quotes? Is my reasoning 3+ sentences?' }
        ]
      },
      esol: {
        l12: {
          frames: [
            'CLAIM: Kalidasa develops Shakuntala\'s conflict through _____ in paragraph _____, which reveals she values both _____ and _____.',
            'EVIDENCE: In paragraph _____, Shakuntala says, "_____," which shows _____.',
            'REASONING: This is important because it shows that Shakuntala is a character who _____.'
          ],
          wordBank: ['conflict', 'aside', 'internal struggle', 'home', 'husband', 'love', 'duty', 'brave', 'reluctantly', 'departs', 'hermitage']
        },
        l34: {
          frames: [
            'Kalidasa develops Shakuntala\'s internal conflict through the literary element of _____, which reveals that she must choose between _____ and _____.',
            'Her resolution — "reluctantly departs" (paragraph 14) — reveals that she is a character who _____, even at great personal cost.'
          ],
          wordBank: ['aside', 'verse', 'stage direction', 'conflict', 'resolution', 'dutiful', 'brave', 'sacrifice', 'dramatic irony']
        },
        l5: {
          frames: [
            'Kalidasa develops Shakuntala\'s internal conflict through multiple literary elements — the aside (paragraph 12), the nature imagery (paragraph 13), and the summarizing stage direction (paragraph 14) — collectively revealing a character who is _____, _____, and _____, making her ultimate rejection in Act V all the more _____.'
          ]
        }
      },
      pacingGuide: { bellringer: 5, vocab: 5, organizer: 10, teacher: 20, passage: 5, writing: 20, closure: 10 },
      exitTicket: {
        prompt: 'Unit Reflection: Which CUBES strategy helped you most on this unit, and why?',
        frame: 'The CUBES strategy that helped me most was _____ because when I used it, I was able to _____. Without this strategy, I might have _____ instead.',
        options: []
      },
      raceFrames: {
        task: 'How does the conflict Shakuntala faces in Act IV prepare the reader for her experience in Act V? Use evidence from both acts.',
        restate: 'The conflict Shakuntala faces in Act IV prepares the reader for Act V by _____.',
        answer: 'In Act IV, she is torn between _____ and _____; in Act V, the reader understands the weight of what she sacrificed because _____.',
        cite: 'In Act IV (paragraph 12): "_____." In Act V (paragraph 21 or 28): "_____."',
        explain: 'The connection between these two acts matters because Act IV shows what she gave up, making her rejection in Act V feel _____ rather than merely sad. Without Act IV\'s emotional preparation, Act V would be _____, but with it, the rejection becomes _____.'
      },
      progressItems: [
        'Complete vocabulary quiz (direct definitions — summative check)',
        'Analyze CER writing prompt using CUBES (underline both parts)',
        'Plan evidence from paragraphs 12, 13, and 14',
        'Write full CER extended response (200-300 words)',
        'Include 2+ direct quotes with paragraph numbers',
        'Complete self-assessment checklist',
        'Complete Q3 Series final reflection'
      ],
      engageActivities: [
        {
          type: 'tps',
          prompt: 'Look at the exemplar CER response the teacher just modeled. How many quotes does it use? How many paragraphs does it cite? How long is the reasoning section? What would you add or change?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        },
        {
          type: 'poll',
          question: 'Looking back at all 4 days, which CUBES strategy helped you the most?',
          choices: [
            'A. C — Circling key details in text and answer choices',
            'B. U — Underlining what the question is asking',
            'C. B — Boxing paragraph numbers to find evidence quickly',
            'D. E — Writing evidence margin notes to predict questions'
          ],
          correct: 'B'
        }
      ]
    }
  },

  assessment: {
    achievementLevels: [
      {
        level: 2,
        label: 'Approaching',
        descriptor: 'Identifies a literary element with minimal textual support.'
      },
      {
        level: 3,
        label: 'Meets',
        descriptor: 'Explains how a literary element contributes to character development using relevant evidence.'
      },
      {
        level: 4,
        label: 'Exceeds',
        descriptor: 'Analyzes the relationship between multiple literary elements and how the author uses them to individualize Shakuntala\'s response to conflict.'
      },
      {
        level: 5,
        label: 'Mastery',
        descriptor: 'Evaluates the author\'s deliberate craft choices and their cumulative effect on how Shakuntala is developed as a uniquely motivated character.'
      }
    ],
    stopProtocol: {
      description: 'Use STOP to analyze each MC answer choice before selecting.',
      steps: [
        { letter: 'S', label: 'Silly', description: 'Clearly wrong or absurd — eliminate first.' },
        { letter: 'T', label: 'Tricky', description: 'Sounds right but misses the point or has a related word.' },
        { letter: 'O', label: 'Opposite', description: 'Directly contradicts the text.' },
        { letter: 'P', label: 'Proven', description: 'Directly supported by text evidence — the correct answer.' }
      ]
    },
    cerExemplar: {
      prompt: 'How does the conflict Shakuntala faces in Act IV prepare the reader for her experience in Act V? Use evidence from both acts to support your analysis.',
      claim: 'The internal conflict Shakuntala faces in Act IV — torn between her love for her childhood home and her duty to her husband — prepares the reader for the devastating rejection she experiences in Act V by establishing how much she sacrificed for a love that goes unrecognized.',
      evidence: 'In Act IV, Shakuntala reveals her inner turmoil through an aside: "Priyamvada, I long to see my husband, and yet my feet will hardly move. It is hard, hard to leave the hermitage" (paragraph 12). In Act V, after Shakuntala has made this painful sacrifice, the King says, "I have no memory of this. I do not recall any marriage" (paragraph 21).',
      reasoning: 'The contrast between these two moments creates dramatic irony and deepens the tragedy. In Act IV, readers witness Shakuntala\'s painful choice — she loves her home so much that her "feet will hardly move," yet she chooses to leave everything familiar for the King. The repetition of "hard, hard" emphasizes her suffering. By establishing this sacrifice first, Kalidasa ensures that readers understand the full weight of what happens in Act V. When the cursed King fails to recognize her, we feel the injustice more acutely because we saw what she gave up. Without Act IV\'s emotional preparation, the rejection would be sad; with it, the rejection becomes tragic.',
      score: '4/4 — Complete CER with clear claim addressing both acts, evidence from each act with citations, and thorough reasoning that explains the connection using literary analysis.'
    },
    questionAnswerKey: {
      Q16: { answer: 'A', rationale: 'Context clues in paragraph 16: "dim, sad yearning," "wistful longings bound" = longing or melancholy' },
      Q17: { answer: 'C', rationale: 'Alliteration (father/feel, pangs/parting) creates sadness and longing — the emotional words are linked by sound' },
      Q18: { answer: 'C', rationale: 'Scene in paragraph 26 shows King finds Shakuntala attractive despite denying memory — "my heart is torn with doubt"' },
      Q19: { answer: 'A', rationale: 'Aside in paragraph 12 reveals Shakuntala\'s internal struggle — private thoughts she cannot express publicly' },
      Q20A: { answer: 'C', rationale: 'Shakuntala struggles with leaving her home to reunite with the king — not deciding to marry (already married)' },
      Q20B: { answer: 'D', rationale: 'She decides to follow her heart and rejoin the king — "reluctantly departs" shows she chose love over comfort' },
      Q21: { answer: 'B', rationale: 'Steady abab rhyme scheme lends formal dignity to characters\' thoughts and reflections' },
      Q22: { answer: 'D', rationale: 'Both conflicts involve choosing between stasis (staying) and change (leaving for husband)' }
    }
  },

  downloads: []
};

if (typeof module !== 'undefined') module.exports = UNIT;
