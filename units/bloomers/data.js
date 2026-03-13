const UNIT = {
  meta: {
    id: 'bloomers',
    title: 'Corsets, Bloomers & Blue Jeans',
    benchmark: 'ELA.10.R.2.1',
    benchmarkLabel: 'Central Idea',
    benchmarkDescription: 'Analyze how an author develops and refines a central idea over the course of a text',
    benchmarkCategory: 'R.2 Informational',
    text: 'Corsets, Bloomers, and Blue Jeans',
    paragraphs: '1-9',
    days: 4,
    status: 'live',
    tags: ['Informational', 'Central Idea', 'Fashion History'],
    description: 'Text structure and central idea in an informational article about how 500 years of fashion changes reflect evolving societal values.'
  },

  days: {

    // ─────────────────────────────────────────────
    // DAY 1 — First Read + Annotation Protocol
    // ─────────────────────────────────────────────
    1: {
      label: 'Day 1 — First Read + Annotation',

      bellringer: {
        words: ['avant-garde', 'accentuated', 'renouncing'],
        questions: [
          {
            stem: 'The designer\'s __________ collection featured clothes that seemed to come from the future.',
            options: [
              { letter: 'A', text: 'old-fashioned', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'avant-garde', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'affordable', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'comfortable', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'What clue in the sentence helps you know which word belongs in the blank?',
            writtenModel: 'The phrase "seemed to come from the future" is the context clue. Avant-garde means ahead of its time or innovative, so clothes that look futuristic are avant-garde.'
          },
          {
            stem: 'The bright colors __________ the beauty of the sunset.',
            options: [
              { letter: 'A', text: 'hid', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'ruined', correct: false, stopLabel: 'Silly' },
              { letter: 'C', text: 'accentuated', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'ignored', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does accentuated differ from "created" or "added"? Why does word choice matter here?',
            writtenModel: 'Accentuated means to emphasize or make more noticeable something that already exists. The sunset was already beautiful — the bright colors made that beauty stand out even more. "Created" would be wrong because the sunset was already beautiful without the colors.'
          }
        ]
      },

      vocab: [
        {
          word: 'avant-garde',
          partOfSpeech: 'adjective',
          definition: 'ahead of its time; innovative; introducing new and experimental ideas',
          example: 'The bloomers costume was an avant-garde idea — most people weren\'t ready to accept women wearing pants.'
        },
        {
          word: 'accentuated',
          partOfSpeech: 'verb',
          definition: 'emphasized or made more noticeable; drew attention to',
          example: 'The new corset accentuated the natural curves of a woman\'s body rather than hiding them.'
        },
        {
          word: 'renouncing',
          partOfSpeech: 'verb',
          definition: 'formally rejecting or giving up; publicly refusing to continue',
          example: 'After the French Revolution, citizens were consciously renouncing the symbols of the aristocracy.'
        }
      ],

      teacherNotes: 'Day 1: First read with Circle-Box-Underline annotation. Open with essential question: "How does what we wear reflect what we believe?" Preview text structure: notice chronological organization (1500s → 1800s → 1900s → today). Model I Do with paragraph 1 think-aloud: "The clothing that women wear in any given society tells a great deal about that society\'s values — CIRCLE this. This is the thesis." Then BOX the time reference "for about 400 years." Release to independent reading of paragraphs 1–9. ESOL: Use visual timeline organizer; show images for all 3 vocabulary words (futuristic fashion for avant-garde, before/after makeup for accentuated, person refusing for renouncing).',

      organizer: {
        benchmarkFocus: 'Central Idea — Day 1: Identifying Thesis and Text Structure',
        columns: ['GR Phase', 'Central Idea / Thesis', 'Text Structure Signal', 'How It Supports the Central Idea'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'Clothing tells a great deal about society\'s values (paragraph 1)',
              'Chronological — "for about 400 years," 1500s (para 2)',
              'The thesis asks how fashion "reflect[s] changing societal values" — time order lets readers track that change era by era'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: ['We Do', '', '', ''],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: ['You Do w/ Partner', '', '', ''],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: ['You Do', '', '', ''],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'Corsets, Bloomers, and Blue Jeans',
        paragraphs: [
          {
            number: 1,
            text: 'The clothing that women wear in any given society tells a great deal about that society\'s values. What does it mean that, for about 400 years, women wore corsets to force their figures into unnatural shapes? What does it indicate that they eventually shed those corsets and started wearing looser clothing? When bloomers replaced skirts, what changes were occurring in society? And when blue jeans were first invented and then later became popular with both men and women, how did that reflect changing societal values?'
          },
          {
            number: 2,
            text: 'The corset had been popular since Shakespeare\'s day, during the reign of Queen Elizabeth I of England in the 1500s. Worn primarily by aristocratic women, it was one way to signal a woman\'s social status. Corsets, with very little variation in shape, continued to be the mark of an upper-class woman until the early 1800s. The corset of this time made a woman\'s torso look like a straight-sided, inverted cone.'
          },
          {
            number: 3,
            text: 'In the early 1800s, women stopped wearing corsets temporarily. The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy. The new freedom of movement allowed by looser-fitting clothes seemed to parallel the new ideas of freedom in political life.'
          },
          {
            number: 4,
            text: 'Within a few years, though, the corset returned, this time with a different goal—instead of hiding the natural curves of a woman\'s body, this new corset accentuated them. Throughout the 1800s, this shape, with tight compression of the waist, became increasingly exaggerated. As the corset squeezed in more and more of the waist, it created an hourglass figure, which was regarded as the "ideal" female shape.'
          },
          {
            number: 5,
            text: 'By the early 1900s, objections to the corset came from three different sources: physicians, religious leaders, and feminists. Physicians objected for two reasons: first, the corset had a negative impact on proper muscle development; second, it prevented vigorous exercise. Religious leaders denounced the way the corset exaggerated the female shape. Feminists resented the corset and considered it a symbol of the imprisonment of women. This undergarment finally fell out of favor entirely as clothing became less structured during the 1920s.'
          },
          {
            number: 6,
            text: 'Another trend in fashion that revealed changing societal attitudes was "rational dress" for women. This outfit included a short jacket and billowy trousers that were gathered at the ankle. Called the "Bloomer costume," or just "bloomers," this style was named after Amelia Bloomer, an American reformer and feminist. Bloomer did not design this costume, but she began wearing it in public as she spoke in favor of temperance reform and women\'s rights. Bloomers eventually fell out of fashion, but the avant-garde idea that women could wear pants instead of dresses and skirts had been introduced and would soon be accepted.'
          },
          {
            number: 7,
            text: 'Perhaps the most influential innovation in fashion began with the invention of denim blue jeans. Levi Strauss was a 24-year-old German immigrant who left New York and traveled to San Francisco in 1853 to open a branch of his brother\'s dry goods business. Once in San Francisco, Strauss encountered prospectors who struggled to find pants that were strong enough to endure hard labor in the gold mines. Strauss used rough canvas from tent and wagon covers to make pants for the miners. The pants were functional but uncomfortable. So Strauss began using a softer twilled cotton cloth from Nimes, France, called "serge de Nimes," which later became known as denim.'
          },
          {
            number: 8,
            text: 'Strauss learned about an innovation one of his customers had developed to make denim pants last longer. Jacob Davis was a tailor who started using rivets at the points of strain on the pants. Davis needed a business partner to promote his idea, so Strauss agreed to help. On May 20, 1873, they obtained a U.S. patent on Davis\'s idea. The date marks the official invention of blue jeans. Even though the denim pants that Strauss had been making earlier had been popular for twenty years, the act of putting rivets on them made them into what we now call "jeans." Today, blue jeans are practically a uniform for men and women alike.'
          },
          {
            number: 9,
            text: 'Popular fashion has changed drastically over the last 500 years, from corsets to blue jeans. Perhaps the global popularity of jeans is a reflection of society\'s evolving attitudes. Blue jeans and other clothing that allows for more freedom of movement suggests a society that values freedom and equality.'
          }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle the central idea / thesis', example: 'circle the thesis in paragraph 1 and central claim words in each era' },
          { letter: 'U', action: 'Underline the question or writing prompt', example: 'underline the RACE or extended response prompt' },
          { letter: 'B', action: 'Box dates, time references, and paragraph numbers', example: 'box "1500s," "early 1800s," "1920s," "1853," "1873," "today"' },
          { letter: 'E', action: 'Eliminate wrong answer choices', example: 'cross out options not supported by the text' },
          { letter: 'S', action: 'Star the strongest evidence', example: 'star the quote that best supports the central idea' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'The central idea of this text is ___.',
            'The author organizes the text in ___ order because ___.'
          ],
          wordBank: ['chronological', 'fashion', 'society', 'values', 'corsets', 'bloomers', 'blue jeans', 'freedom', 'aristocracy', 'equality']
        },
        l34: {
          frames: [
            'The author develops the central idea that ___ by showing how fashion changed from ___ to ___.',
            'The text is organized in ___ order, which supports the central idea by ___.'
          ],
          wordBank: []
        },
        l5: {
          frames: [
            'The author\'s chronological structure supports the central idea that fashion reflects societal values by allowing readers to trace how each era\'s ___ shaped its clothing choices.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 10, closure: 5 },

      exitTicket: {
        prompt: 'The author organized this text using __________ structure. (A) compare/contrast  (B) problem/solution  (C) chronological (time order)  (D) cause/effect. How do you know?',
        frame: 'The author used ___ structure. I know this because ___.'
      },

      raceFrames: {
        task: 'How does the text structure of "Corsets, Bloomers, and Blue Jeans" support the author\'s thesis?',
        restate: 'The text structure of "Corsets, Bloomers, and Blue Jeans" supports the author\'s thesis by...',
        answer: 'Specifically, the chronological organization allows readers to see how fashion changes over 500 years reflect...',
        cite: 'According to paragraph ___, "..."',
        explain: 'This proves the thesis because the time order directly shows how...'
      },

      progressItems: [
        'Complete bellringer',
        'Review vocabulary words',
        'Read passage paragraphs 1–9',
        'Annotate with Circle-Box-Underline',
        'Complete timeline organizer',
        'Exit ticket'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'What do you think clothing tells us about society?',
          choices: [
            'A. Nothing — clothes are just practical',
            'B. A little — they show personal style',
            'C. A lot — they reflect social values and status',
            'D. Everything — clothes are the most important signal'
          ],
          correct: 'C'
        },
        {
          type: 'tps',
          prompt: 'Think about something you wear regularly. What does that clothing choice say about you or your values?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        }
      ]
    },

    // ─────────────────────────────────────────────
    // DAY 2 — Question Stem Breakdown + Annotation
    // ─────────────────────────────────────────────
    2: {
      label: 'Day 2 — Question Stem Breakdown',

      bellringer: {
        words: ['renouncing', 'aristocracy', 'consciously'],
        questions: [
          {
            stem: 'Read: "In the early 1800s, women stopped wearing corsets temporarily. The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy." In this context, "aristocracy" most likely refers to—',
            options: [
              { letter: 'A', text: 'poor people', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'wealthy upper class', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'artists', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'soldiers', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'Why would people reject the symbols of the aristocracy after a revolution?',
            writtenModel: 'After a revolution, people want to break from the old power structure. The aristocracy represented the privileged class that had controlled society. Rejecting their symbols — including their clothing — was a way of showing that the old rules no longer applied.'
          },
          {
            stem: 'Read the same sentence. The word "consciously" suggests people were—',
            options: [
              { letter: 'A', text: 'asleep while doing it', correct: false, stopLabel: 'Silly' },
              { letter: 'B', text: 'forced by the government', correct: false, stopLabel: 'Opposite' },
              { letter: 'C', text: 'deliberately aware of their choice', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'confused about the situation', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'How does "consciously renouncing" show that the fashion change was about more than just style?',
            writtenModel: 'Consciously means being fully aware and intentional. When people consciously renounced aristocratic symbols, they were making a deliberate political statement, not just following a trend. This proves that fashion was a reflection of deeper values about freedom and equality.'
          }
        ]
      },

      vocab: [
        {
          word: 'avant-garde',
          partOfSpeech: 'adjective',
          definition: 'ahead of its time; innovative; introducing new and experimental ideas',
          example: 'The bloomers costume was an avant-garde idea — most people weren\'t ready to accept women wearing pants.'
        },
        {
          word: 'accentuated',
          partOfSpeech: 'verb',
          definition: 'emphasized or made more noticeable; drew attention to',
          example: 'The new corset accentuated the natural curves of a woman\'s body rather than hiding them.'
        },
        {
          word: 'renouncing',
          partOfSpeech: 'verb',
          definition: 'formally rejecting or giving up; publicly refusing to continue',
          example: 'After the French Revolution, citizens were consciously renouncing the symbols of the aristocracy.'
        }
      ],

      teacherNotes: 'Day 2: Annotating test questions with Circle-Box-Underline. Model I Do with Q27: underline "text structure" and "relate to the thesis." Think aloud through each choice. Then introduce Part A/Part B strategy for Q31: always answer Part A first, then find Part B evidence that PROVES that answer. If Part B choices don\'t support your Part A pick, reconsider Part A. ESOL: Provide graphic organizer showing question types (text structure, vocabulary, evidence, author\'s purpose, Part A/B) with visual examples of each.',

      organizer: {
        benchmarkFocus: 'Central Idea — Day 2: Connecting Questions to Text Structure',
        columns: ['Question #', 'Question Type', 'Where to Look in Text', 'What to Annotate'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'Q27 — Text Structure: How does structure relate to thesis?',
              'Paragraphs 1 and 9 (thesis + conclusion); time markers throughout',
              'Underline "text structure" and "thesis." Circle chronological markers (1500s, 1800s, 1920s, today)'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: ['We Do', 'Q28 — Vocabulary: meaning of avant-garde', '', ''],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: ['You Do w/ Partner', 'Q29 — Evidence: blue jeans invented to fill a need', '', ''],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: ['You Do', 'Q31 Part A/B — Why corsets fell out of fashion', '', ''],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'Corsets, Bloomers, and Blue Jeans',
        paragraphs: [
          { number: 1, text: 'The clothing that women wear in any given society tells a great deal about that society\'s values. What does it mean that, for about 400 years, women wore corsets to force their figures into unnatural shapes? What does it indicate that they eventually shed those corsets and started wearing looser clothing? When bloomers replaced skirts, what changes were occurring in society? And when blue jeans were first invented and then later became popular with both men and women, how did that reflect changing societal values?' },
          { number: 2, text: 'The corset had been popular since Shakespeare\'s day, during the reign of Queen Elizabeth I of England in the 1500s. Worn primarily by aristocratic women, it was one way to signal a woman\'s social status. Corsets, with very little variation in shape, continued to be the mark of an upper-class woman until the early 1800s. The corset of this time made a woman\'s torso look like a straight-sided, inverted cone.' },
          { number: 3, text: 'In the early 1800s, women stopped wearing corsets temporarily. The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy. The new freedom of movement allowed by looser-fitting clothes seemed to parallel the new ideas of freedom in political life.' },
          { number: 4, text: 'Within a few years, though, the corset returned, this time with a different goal—instead of hiding the natural curves of a woman\'s body, this new corset accentuated them. Throughout the 1800s, this shape, with tight compression of the waist, became increasingly exaggerated. As the corset squeezed in more and more of the waist, it created an hourglass figure, which was regarded as the "ideal" female shape.' },
          { number: 5, text: 'By the early 1900s, objections to the corset came from three different sources: physicians, religious leaders, and feminists. Physicians objected for two reasons: first, the corset had a negative impact on proper muscle development; second, it prevented vigorous exercise. Religious leaders denounced the way the corset exaggerated the female shape. Feminists resented the corset and considered it a symbol of the imprisonment of women. This undergarment finally fell out of favor entirely as clothing became less structured during the 1920s.' },
          { number: 6, text: 'Another trend in fashion that revealed changing societal attitudes was "rational dress" for women. This outfit included a short jacket and billowy trousers that were gathered at the ankle. Called the "Bloomer costume," or just "bloomers," this style was named after Amelia Bloomer, an American reformer and feminist. Bloomer did not design this costume, but she began wearing it in public as she spoke in favor of temperance reform and women\'s rights. Bloomers eventually fell out of fashion, but the avant-garde idea that women could wear pants instead of dresses and skirts had been introduced and would soon be accepted.' },
          { number: 7, text: 'Perhaps the most influential innovation in fashion began with the invention of denim blue jeans. Levi Strauss was a 24-year-old German immigrant who left New York and traveled to San Francisco in 1853 to open a branch of his brother\'s dry goods business. Once in San Francisco, Strauss encountered prospectors who struggled to find pants that were strong enough to endure hard labor in the gold mines. Strauss used rough canvas from tent and wagon covers to make pants for the miners. The pants were functional but uncomfortable. So Strauss began using a softer twilled cotton cloth from Nimes, France, called "serge de Nimes," which later became known as denim.' },
          { number: 8, text: 'Strauss learned about an innovation one of his customers had developed to make denim pants last longer. Jacob Davis was a tailor who started using rivets at the points of strain on the pants. Davis needed a business partner to promote his idea, so Strauss agreed to help. On May 20, 1873, they obtained a U.S. patent on Davis\'s idea. The date marks the official invention of blue jeans. Even though the denim pants that Strauss had been making earlier had been popular for twenty years, the act of putting rivets on them made them into what we now call "jeans." Today, blue jeans are practically a uniform for men and women alike.' },
          { number: 9, text: 'Popular fashion has changed drastically over the last 500 years, from corsets to blue jeans. Perhaps the global popularity of jeans is a reflection of society\'s evolving attitudes. Blue jeans and other clothing that allows for more freedom of movement suggests a society that values freedom and equality.' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle ideas/details that ARE in the text', example: 'circle text evidence in answer choices to verify' },
          { letter: 'U', action: 'Underline what the question is asking', example: 'underline "text structure," "central idea," "key idea"' },
          { letter: 'B', action: 'Box paragraph numbers mentioned in choices', example: 'box (paragraph 7) in answer options so you know where to check' },
          { letter: 'E', action: 'Eliminate choices not supported by text', example: 'cross out any choice that contradicts or distorts the text' },
          { letter: 'S', action: 'Star your best answer after checking text', example: 'star the choice proven by the most text evidence' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'For Part A, I chose ___ because paragraph ___ says ___.',
            'For Part B, I chose ___ because this quote proves ___.'
          ],
          wordBank: ['corset', 'fashion', 'evidence', 'supports', 'proves', 'paragraph', 'because', 'quote']
        },
        l34: {
          frames: [
            'The answer to Q___ is ___ because the text in paragraph ___ states "___," which shows ___.',
            'Part B answer ___ supports Part A answer ___ because ___.'
          ],
          wordBank: []
        },
        l5: {
          frames: [
            'The correct answer to Q___ is ___ because the author\'s use of ___ in paragraph ___ directly demonstrates ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 20, teacher: 10, passage: 10, closure: 5 },

      exitTicket: {
        prompt: 'For Part A/Part B questions, why is it important to answer Part A first?',
        frame: 'It is important to answer Part A first because Part B ___. If I don\'t know my Part A answer, I can\'t ___.'
      },

      raceFrames: {
        task: 'In what way does the text structure of the essay relate to the thesis it supports? (Q27)',
        restate: 'The text structure of "Corsets, Bloomers, and Blue Jeans" relates to the thesis by...',
        answer: 'The correct answer is D because the author uses chronological order to...',
        cite: 'In paragraph 1, the thesis states "how could fashion choices reflect changing societal values?" Then the text moves through time: "1500s" (para 2), "early 1800s" (para 3), "1920s" (para 5).',
        explain: 'This proves the answer because the time order directly shows how attitudes evolved — the structure matches the thesis about change over time.'
      },

      progressItems: [
        'Complete bellringer',
        'Annotate test questions 27–31',
        'Identify question types',
        'Practice Part A/Part B strategy',
        'Connect question numbers to annotated passage',
        'Exit ticket'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'Which question type do you find hardest on the ELA test?',
          choices: [
            'A. Vocabulary in context',
            'B. Text structure',
            'C. Part A / Part B',
            'D. Author\'s purpose'
          ],
          correct: 'C'
        },
        {
          type: 'tps',
          prompt: 'Look at Q27. Which answer choice has words from the text? Which one does NOT match what the author actually does?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        }
      ]
    },

    // ─────────────────────────────────────────────
    // DAY 3 — MC Justification with RACE
    // ─────────────────────────────────────────────
    3: {
      label: 'Day 3 — MC Justification with RACE',

      bellringer: {
        words: ['avant-garde', 'accentuated'],
        questions: [
          {
            stem: 'Choose the sentence that uses AVANT-GARDE correctly.',
            options: [
              { letter: 'A', text: 'The avant-garde technology was invented 100 years ago.', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'Her avant-garde ideas were considered revolutionary and ahead of their time.', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'The avant-garde painting was a copy of an old masterpiece.', correct: false, stopLabel: 'Tricky' },
              { letter: 'D', text: 'He wore avant-garde clothes from his grandfather\'s closet.', correct: false, stopLabel: 'Silly' }
            ],
            writtenPrompt: 'Why are choices A, C, and D incorrect uses of avant-garde?',
            writtenModel: 'Choice A is the opposite — technology from 100 years ago is old, not ahead of its time. Choice C is tricky because a "copy" of old work is the opposite of innovative. Choice D is silly — grandfather\'s clothes are old-fashioned, not avant-garde. Only B correctly uses the word to mean revolutionary and ahead of its time.'
          },
          {
            stem: 'Choose the sentence that uses ACCENTUATED correctly.',
            options: [
              { letter: 'A', text: 'The dark makeup accentuated her eyes, making them stand out.', correct: true, stopLabel: 'Proven' },
              { letter: 'B', text: 'The quiet music accentuated the loud noise.', correct: false, stopLabel: 'Silly' },
              { letter: 'C', text: 'She accentuated her mistake by hiding it.', correct: false, stopLabel: 'Opposite' },
              { letter: 'D', text: 'The plain walls accentuated the emptiness.', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'In choice A, what specifically is being accentuated, and how do you know?',
            writtenModel: 'Her eyes are being accentuated — the makeup makes them stand out and be more noticeable. The phrase "making them stand out" is a context clue that confirms accentuated means emphasized or made more noticeable.'
          }
        ]
      },

      vocab: [
        {
          word: 'avant-garde',
          partOfSpeech: 'adjective',
          definition: 'ahead of its time; innovative; introducing new and experimental ideas',
          example: 'The bloomers costume was an avant-garde idea — most people weren\'t ready to accept women wearing pants.'
        },
        {
          word: 'accentuated',
          partOfSpeech: 'verb',
          definition: 'emphasized or made more noticeable; drew attention to',
          example: 'The new corset accentuated the natural curves of a woman\'s body rather than hiding them.'
        },
        {
          word: 'renouncing',
          partOfSpeech: 'verb',
          definition: 'formally rejecting or giving up; publicly refusing to continue',
          example: 'After the French Revolution, citizens were consciously renouncing the symbols of the aristocracy.'
        }
      ],

      teacherNotes: 'Day 3: RACE for MC justification. Model I Do with Q27 (text structure/chronological order). Think aloud: "I don\'t just pick D — I PROVE D with RACE." Then release to partner work (We Do) for Q28 (avant-garde vocabulary): Partner A reads the sentence from para 6, Partner B identifies context clues, together write RACE justification. Independent work Q29–Q31. Remind students on Q31: answer Part A first, then find Part B evidence that PROVES Part A. ESOL: Provide sentence frames for each RACE component.',

      organizer: {
        benchmarkFocus: 'Central Idea — Day 3: RACE Justification for MC Answers',
        columns: ['Question', 'Correct Answer', 'RACE — Cite (key quote + para #)', 'RACE — Explain (why this proves it)'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'Q27 — D: Chronological order shows how attitudes about women\'s clothing evolved over time',
              '"how could fashion choices reflect changing societal values?" (para 1); text moves from "1500s" (para 2) → "1920s" (para 5) → "today" (para 9)',
              'The time-order structure directly proves the thesis: readers can SEE the evolution of both fashion and values across 500 years'
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: ['We Do', 'Q28 — D: Ahead of its time', '', ''],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: ['You Do w/ Partner', 'Q29 — A: Miners struggled to find pants strong enough', '', ''],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: ['You Do', 'Q31A — D: Leading voices came to oppose the corset for a variety of reasons', '', ''],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'Corsets, Bloomers, and Blue Jeans',
        paragraphs: [
          { number: 1, text: 'The clothing that women wear in any given society tells a great deal about that society\'s values. What does it mean that, for about 400 years, women wore corsets to force their figures into unnatural shapes? What does it indicate that they eventually shed those corsets and started wearing looser clothing? When bloomers replaced skirts, what changes were occurring in society? And when blue jeans were first invented and then later became popular with both men and women, how did that reflect changing societal values?' },
          { number: 2, text: 'The corset had been popular since Shakespeare\'s day, during the reign of Queen Elizabeth I of England in the 1500s. Worn primarily by aristocratic women, it was one way to signal a woman\'s social status. Corsets, with very little variation in shape, continued to be the mark of an upper-class woman until the early 1800s. The corset of this time made a woman\'s torso look like a straight-sided, inverted cone.' },
          { number: 3, text: 'In the early 1800s, women stopped wearing corsets temporarily. The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy. The new freedom of movement allowed by looser-fitting clothes seemed to parallel the new ideas of freedom in political life.' },
          { number: 4, text: 'Within a few years, though, the corset returned, this time with a different goal—instead of hiding the natural curves of a woman\'s body, this new corset accentuated them. Throughout the 1800s, this shape, with tight compression of the waist, became increasingly exaggerated. As the corset squeezed in more and more of the waist, it created an hourglass figure, which was regarded as the "ideal" female shape.' },
          { number: 5, text: 'By the early 1900s, objections to the corset came from three different sources: physicians, religious leaders, and feminists. Physicians objected for two reasons: first, the corset had a negative impact on proper muscle development; second, it prevented vigorous exercise. Religious leaders denounced the way the corset exaggerated the female shape. Feminists resented the corset and considered it a symbol of the imprisonment of women. This undergarment finally fell out of favor entirely as clothing became less structured during the 1920s.' },
          { number: 6, text: 'Another trend in fashion that revealed changing societal attitudes was "rational dress" for women. This outfit included a short jacket and billowy trousers that were gathered at the ankle. Called the "Bloomer costume," or just "bloomers," this style was named after Amelia Bloomer, an American reformer and feminist. Bloomer did not design this costume, but she began wearing it in public as she spoke in favor of temperance reform and women\'s rights. Bloomers eventually fell out of fashion, but the avant-garde idea that women could wear pants instead of dresses and skirts had been introduced and would soon be accepted.' },
          { number: 7, text: 'Perhaps the most influential innovation in fashion began with the invention of denim blue jeans. Levi Strauss was a 24-year-old German immigrant who left New York and traveled to San Francisco in 1853 to open a branch of his brother\'s dry goods business. Once in San Francisco, Strauss encountered prospectors who struggled to find pants that were strong enough to endure hard labor in the gold mines. Strauss used rough canvas from tent and wagon covers to make pants for the miners. The pants were functional but uncomfortable. So Strauss began using a softer twilled cotton cloth from Nimes, France, called "serge de Nimes," which later became known as denim.' },
          { number: 8, text: 'Strauss learned about an innovation one of his customers had developed to make denim pants last longer. Jacob Davis was a tailor who started using rivets at the points of strain on the pants. Davis needed a business partner to promote his idea, so Strauss agreed to help. On May 20, 1873, they obtained a U.S. patent on Davis\'s idea. The date marks the official invention of blue jeans. Even though the denim pants that Strauss had been making earlier had been popular for twenty years, the act of putting rivets on them made them into what we now call "jeans." Today, blue jeans are practically a uniform for men and women alike.' },
          { number: 9, text: 'Popular fashion has changed drastically over the last 500 years, from corsets to blue jeans. Perhaps the global popularity of jeans is a reflection of society\'s evolving attitudes. Blue jeans and other clothing that allows for more freedom of movement suggests a society that values freedom and equality.' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle correct answer choice letter', example: 'circle D after proving it with RACE' },
          { letter: 'U', action: 'Underline what you need to prove', example: 'underline the key claim in the question stem' },
          { letter: 'B', action: 'Box the paragraph numbers you cite', example: 'box (para 6) when you quote the avant-garde sentence' },
          { letter: 'E', action: 'Explain why wrong choices are wrong', example: 'write Opposite/Silly/Tricky next to eliminated choices' },
          { letter: 'S', action: 'Star the strongest quote for your RACE cite', example: 'star the sentence that most directly proves your answer' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'The correct answer is ___ because the text in paragraph ___ states "___."',
            'This proves the answer because ___.'
          ],
          wordBank: ['correct', 'because', 'paragraph', 'states', 'proves', 'shows', 'evidence', 'quote', 'chronological', 'before', 'accepted']
        },
        l34: {
          frames: [
            'The correct answer to Q___ is ___ because the author states in paragraph ___ that "___," which directly shows ___.',
            'For Part A, I chose ___ because ___. For Part B, ___ supports this because ___.'
          ],
          wordBank: []
        },
        l5: {
          frames: [
            'The correct answer is ___ because the evidence in paragraph ___ — specifically "___" — demonstrates that ___. The other choices are incorrect because ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 15, teacher: 10, passage: 15, closure: 5 },

      exitTicket: {
        prompt: 'Which Part B option did you choose for Q31? Does it PROVE your Part A answer? Write one sentence explaining the connection.',
        frame: 'For Part A, I chose ___ because ___. My Part B choice ___ proves this because ___.'
      },

      raceFrames: {
        task: 'Based on the context, what is the most likely meaning of the foreign loanword avant-garde? (Q28)',
        restate: 'The meaning of avant-garde based on context is something that is ahead of its time.',
        answer: 'The correct answer is D because the context shows the idea came before general acceptance.',
        cite: 'Paragraph 6 states the idea "had been introduced and would soon be accepted."',
        explain: 'Something that "would soon be accepted" has not been accepted yet — it is ahead of its time. This is the definition of avant-garde, confirming choice D.'
      },

      progressItems: [
        'Complete bellringer',
        'Model RACE for Q27',
        'Partner RACE for Q28',
        'Independent RACE for Q29',
        'Complete Q31 Part A/B',
        'Exit ticket'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'For Q29, which sentence BEST proves jeans were invented to fill a need?',
          choices: [
            'A. Miners struggled to find pants strong enough for gold mines',
            'B. Strauss used rough canvas from tent covers',
            'C. The pants were functional but uncomfortable',
            'D. Strauss used softer cloth from Nimes, France'
          ],
          correct: 'A'
        },
        {
          type: 'tps',
          prompt: 'Your partner chose a different Part B answer for Q31 than you did. How do you convince them yours is better? What evidence do you use?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        }
      ]
    },

    // ─────────────────────────────────────────────
    // DAY 4 — RACE Extended Response + Self-Assessment
    // ─────────────────────────────────────────────
    4: {
      label: 'Day 4 — RACE Extended Response',

      bellringer: {
        words: ['avant-garde', 'accentuated', 'renouncing'],
        questions: [
          {
            stem: 'What does "avant-garde" mean?',
            options: [
              { letter: 'A', text: 'old-fashioned', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'ahead of its time', correct: true, stopLabel: 'Proven' },
              { letter: 'C', text: 'colorful', correct: false, stopLabel: 'Silly' },
              { letter: 'D', text: 'expensive', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'Use avant-garde in a sentence about something in today\'s world that is ahead of its time.',
            writtenModel: 'Electric vehicles were once an avant-garde idea, but they are now becoming a common sight on roads around the world.'
          },
          {
            stem: 'What does "accentuated" mean?',
            options: [
              { letter: 'A', text: 'hid', correct: false, stopLabel: 'Opposite' },
              { letter: 'B', text: 'ignored', correct: false, stopLabel: 'Silly' },
              { letter: 'C', text: 'emphasized', correct: true, stopLabel: 'Proven' },
              { letter: 'D', text: 'created', correct: false, stopLabel: 'Tricky' }
            ],
            writtenPrompt: 'What does it mean for clothing to accentuate something? Use a specific example.',
            writtenModel: 'Clothing accentuates something when it draws attention to it or makes it more noticeable. The corset accentuated a woman\'s waist by squeezing it tightly, making the hourglass shape more dramatic and obvious.'
          }
        ]
      },

      vocab: [
        {
          word: 'avant-garde',
          partOfSpeech: 'adjective',
          definition: 'ahead of its time; innovative; introducing new and experimental ideas',
          example: 'The bloomers costume was an avant-garde idea — most people weren\'t ready to accept women wearing pants.'
        },
        {
          word: 'accentuated',
          partOfSpeech: 'verb',
          definition: 'emphasized or made more noticeable; drew attention to',
          example: 'The new corset accentuated the natural curves of a woman\'s body rather than hiding them.'
        },
        {
          word: 'renouncing',
          partOfSpeech: 'verb',
          definition: 'formally rejecting or giving up; publicly refusing to continue',
          example: 'After the French Revolution, citizens were consciously renouncing the symbols of the aristocracy.'
        }
      ],

      teacherNotes: 'Day 4: RACE extended response writing and self-assessment. Open by contrasting RACE vs. CER: RACE restates the question first; CER opens with a claim. RACE works best for informational texts with a direct answer. Model the full RACE with Q27 prompt before releasing students to independent writing. RACE prompt requires at least TWO pieces of text evidence with paragraph numbers. After writing, students complete self-assessment checklist independently. Close with whole-class discussion: "How was RACE different from CER we used for Ali Cogia?"',

      organizer: {
        benchmarkFocus: 'Central Idea — Day 4: RACE Extended Response Planning',
        columns: ['RACE Component', 'What to Write', 'Student Draft'],
        rows: [
          {
            label: 'I Do',
            cells: [
              'I Do',
              'RESTATE: "The author of \'Corsets, Bloomers, and Blue Jeans\' uses specific evidence to support the idea that changes in women\'s fashion reflect changes in society\'s values."',
              ''
            ],
            isPreFilled: true,
            phase: 'I Do'
          },
          {
            label: 'We Do',
            cells: ['We Do', 'ANSWER: State which historical examples you will use and what they show', ''],
            isPreFilled: false,
            phase: 'We Do'
          },
          {
            label: 'You Do w/ Partner',
            cells: ['You Do w/ Partner', 'CITE: Find TWO quotes with paragraph numbers that prove your answer', ''],
            isPreFilled: false,
            phase: 'You Do w/ Partner'
          },
          {
            label: 'You Do',
            cells: ['You Do', 'EXPLAIN: Tell HOW each quote proves the central idea — connect to cause and effect', ''],
            isPreFilled: false,
            phase: 'You Do'
          }
        ]
      },

      textPassage: {
        title: 'Corsets, Bloomers, and Blue Jeans',
        paragraphs: [
          { number: 1, text: 'The clothing that women wear in any given society tells a great deal about that society\'s values. What does it mean that, for about 400 years, women wore corsets to force their figures into unnatural shapes? What does it indicate that they eventually shed those corsets and started wearing looser clothing? When bloomers replaced skirts, what changes were occurring in society? And when blue jeans were first invented and then later became popular with both men and women, how did that reflect changing societal values?' },
          { number: 2, text: 'The corset had been popular since Shakespeare\'s day, during the reign of Queen Elizabeth I of England in the 1500s. Worn primarily by aristocratic women, it was one way to signal a woman\'s social status. Corsets, with very little variation in shape, continued to be the mark of an upper-class woman until the early 1800s. The corset of this time made a woman\'s torso look like a straight-sided, inverted cone.' },
          { number: 3, text: 'In the early 1800s, women stopped wearing corsets temporarily. The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy. The new freedom of movement allowed by looser-fitting clothes seemed to parallel the new ideas of freedom in political life.' },
          { number: 4, text: 'Within a few years, though, the corset returned, this time with a different goal—instead of hiding the natural curves of a woman\'s body, this new corset accentuated them. Throughout the 1800s, this shape, with tight compression of the waist, became increasingly exaggerated. As the corset squeezed in more and more of the waist, it created an hourglass figure, which was regarded as the "ideal" female shape.' },
          { number: 5, text: 'By the early 1900s, objections to the corset came from three different sources: physicians, religious leaders, and feminists. Physicians objected for two reasons: first, the corset had a negative impact on proper muscle development; second, it prevented vigorous exercise. Religious leaders denounced the way the corset exaggerated the female shape. Feminists resented the corset and considered it a symbol of the imprisonment of women. This undergarment finally fell out of favor entirely as clothing became less structured during the 1920s.' },
          { number: 6, text: 'Another trend in fashion that revealed changing societal attitudes was "rational dress" for women. This outfit included a short jacket and billowy trousers that were gathered at the ankle. Called the "Bloomer costume," or just "bloomers," this style was named after Amelia Bloomer, an American reformer and feminist. Bloomer did not design this costume, but she began wearing it in public as she spoke in favor of temperance reform and women\'s rights. Bloomers eventually fell out of fashion, but the avant-garde idea that women could wear pants instead of dresses and skirts had been introduced and would soon be accepted.' },
          { number: 7, text: 'Perhaps the most influential innovation in fashion began with the invention of denim blue jeans. Levi Strauss was a 24-year-old German immigrant who left New York and traveled to San Francisco in 1853 to open a branch of his brother\'s dry goods business. Once in San Francisco, Strauss encountered prospectors who struggled to find pants that were strong enough to endure hard labor in the gold mines. Strauss used rough canvas from tent and wagon covers to make pants for the miners. The pants were functional but uncomfortable. So Strauss began using a softer twilled cotton cloth from Nimes, France, called "serge de Nimes," which later became known as denim.' },
          { number: 8, text: 'Strauss learned about an innovation one of his customers had developed to make denim pants last longer. Jacob Davis was a tailor who started using rivets at the points of strain on the pants. Davis needed a business partner to promote his idea, so Strauss agreed to help. On May 20, 1873, they obtained a U.S. patent on Davis\'s idea. The date marks the official invention of blue jeans. Even though the denim pants that Strauss had been making earlier had been popular for twenty years, the act of putting rivets on them made them into what we now call "jeans." Today, blue jeans are practically a uniform for men and women alike.' },
          { number: 9, text: 'Popular fashion has changed drastically over the last 500 years, from corsets to blue jeans. Perhaps the global popularity of jeans is a reflection of society\'s evolving attitudes. Blue jeans and other clothing that allows for more freedom of movement suggests a society that values freedom and equality.' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle the central idea statement you will restate', example: 'circle your thesis sentence for the restate component' },
          { letter: 'U', action: 'Underline the writing prompt requirements', example: 'underline "at least TWO pieces of text evidence with paragraph numbers"' },
          { letter: 'B', action: 'Box the two strongest quotes you will cite', example: 'box your para 3 quote and your para 6 quote' },
          { letter: 'E', action: 'Eliminate weak evidence — pick the strongest two', example: 'cross out quotes that don\'t directly prove the central idea' },
          { letter: 'S', action: 'Star your explain sentences — the most important part', example: 'star your explanation connecting quotes to the central idea' }
        ]
      },

      esol: {
        l12: {
          frames: [
            'The author uses evidence to support the idea that ___.',
            'In paragraph ___, the text states "___." This shows that ___.',
            'Another example is in paragraph ___, where the text says "___." This proves ___.'
          ],
          wordBank: ['fashion', 'society', 'values', 'reflects', 'changes', 'evidence', 'shows', 'proves', 'because', 'therefore', 'corsets', 'bloomers', 'blue jeans', 'freedom', 'equality']
        },
        l34: {
          frames: [
            'The author develops the central idea that fashion reflects society\'s values by providing multiple historical examples. In paragraph ___, the author explains that "___," which shows ___. This connects to the central idea because ___.',
            'A second example appears in paragraph ___, where the author states "___." This further supports the central idea by demonstrating ___.'
          ],
          wordBank: []
        },
        l5: {
          frames: [
            'The author develops and refines the central idea that fashion reflects societal values through a series of historically grounded examples, each demonstrating a cause-and-effect relationship between social change and clothing choices. In paragraph ___, the author establishes ___ by noting "___," while paragraph ___ extends this pattern by showing ___.'
          ]
        }
      },

      pacingGuide: { bellringer: 5, vocab: 5, organizer: 10, teacher: 10, passage: 20, selfAssess: 10, closure: 5 },

      exitTicket: {
        prompt: 'How is RACE different from CER? When would you use RACE instead of CER?',
        frame: 'RACE is different from CER because ___. I would use RACE instead of CER when ___.'
      },

      raceFrames: {
        task: 'How does the author use evidence to support the idea that changes in women\'s fashion reflect changes in society\'s values?',
        restate: 'The author of "Corsets, Bloomers, and Blue Jeans" uses specific evidence to support the idea that changes in women\'s fashion reflect changes in society\'s values.',
        answer: 'The author provides multiple historical examples showing how each fashion change connected to broader social movements and changing attitudes toward women.',
        cite: 'In paragraph 3, the author explains that "In the early 1800s, women stopped wearing corsets temporarily" because "The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy." Later, in paragraph 6, the author describes how bloomers were named after "Amelia Bloomer, an American reformer and feminist" who "began wearing it in public as she spoke in favor of temperance reform and women\'s rights."',
        explain: 'These examples prove the central idea because each fashion change happened because of social change, not just style preference. When people rejected aristocracy, they rejected aristocratic clothing. When women fought for rights, they adopted clothing that gave them freedom to move. This pattern continues to blue jeans, which paragraph 9 says reflect "a society that values freedom and equality."'
      },

      progressItems: [
        'Complete vocabulary quiz bellringer',
        'Review RACE vs. CER distinction',
        'Plan RACE response (organizer)',
        'Write complete RACE response',
        'Self-assessment checklist',
        'Exit ticket'
      ],

      engageActivities: [
        {
          type: 'poll',
          question: 'Which RACE component do you find hardest to write?',
          choices: [
            'A. Restate — turning the question into a statement',
            'B. Answer — giving a specific direct answer',
            'C. Cite — finding and quoting evidence with paragraph numbers',
            'D. Explain — connecting evidence back to the central idea'
          ],
          correct: 'D'
        },
        {
          type: 'tps',
          prompt: 'How was writing with RACE different from writing with CER? Which felt more natural for this informational text, and why?',
          thinkSeconds: 60,
          pairSeconds: 90,
          shareSeconds: 0
        }
      ]
    }
  },

  // ─────────────────────────────────────────────
  // ASSESSMENT
  // ─────────────────────────────────────────────
  assessment: {
    achievementLevels: [
      {
        level: 2,
        label: 'Approaching',
        descriptor: 'Identifies a central idea with limited or indirect textual support.'
      },
      {
        level: 3,
        label: 'Meets',
        descriptor: 'Explains how the author develops the central idea using relevant supporting details.'
      },
      {
        level: 4,
        label: 'Exceeds',
        descriptor: 'Analyzes how the author develops and refines the central idea across multiple sections of the text using well-chosen evidence.'
      },
      {
        level: 5,
        label: 'Mastery',
        descriptor: 'Evaluates the author\'s deliberate choices — including word choice, structure, and supporting details — and their cumulative effect on how the central idea is developed and refined.'
      }
    ],
    stopProtocol: {
      description: 'Use STOP to analyze each MC answer choice before selecting.',
      steps: [
        { letter: 'S', label: 'Silly', description: 'Clearly wrong or absurd — eliminate first.' },
        { letter: 'T', label: 'Tricky', description: 'Sounds right but misses the central idea or misidentifies the focus.' },
        { letter: 'O', label: 'Opposite', description: 'Directly contradicts the author\'s central idea.' },
        { letter: 'P', label: 'Proven', description: 'Directly supported by multiple details in the text — the correct answer.' }
      ]
    },
    answerKey: {
      27: { correct: 'D', stopLabels: { A: 'Tricky', B: 'Silly', C: 'Silly', D: 'Proven' } },
      28: { correct: 'D', stopLabels: { A: 'Opposite', B: 'Silly', C: 'Tricky', D: 'Proven' } },
      29: { correct: 'A', stopLabels: { A: 'Proven', B: 'Tricky', C: 'Silly', D: 'Tricky' } },
      30: { correct: 'A', stopLabels: { A: 'Proven', B: 'Tricky', C: 'Tricky', D: 'Silly' } },
      '31A': { correct: 'D', stopLabels: { A: 'Opposite', B: 'Silly', C: 'Tricky', D: 'Proven' } },
      '31B': { correct: 'D', stopLabels: { A: 'Silly', B: 'Tricky', C: 'Tricky', D: 'Proven' } }
    },
    exemplarRace: {
      prompt: 'How does the author use evidence to support the idea that changes in women\'s fashion reflect changes in society\'s values?',
      restate: 'The author of "Corsets, Bloomers, and Blue Jeans" uses specific evidence to support the idea that changes in women\'s fashion reflect changes in society\'s values.',
      answer: 'The author provides multiple historical examples showing how each fashion change connected to broader social movements and changing attitudes toward women.',
      cite: 'In paragraph 3, the author explains that "In the early 1800s, women stopped wearing corsets temporarily" because "The French Revolution had just ended, and people were consciously renouncing the symbols of the aristocracy." Later, in paragraph 6, the author describes how bloomers were named after "Amelia Bloomer, an American reformer and feminist" who "began wearing it in public as she spoke in favor of temperance reform and women\'s rights."',
      explain: 'These examples prove the central idea because each fashion change happened because of social change, not just style preference. When people rejected aristocracy, they rejected aristocratic clothing. When women fought for rights, they adopted clothing that gave them freedom to move. The author\'s evidence shows a cause-and-effect relationship: society\'s values change first, and fashion follows. This pattern continues to blue jeans, which paragraph 9 says reflect "a society that values freedom and equality."',
      score: '4/4'
    }
  },

  downloads: [
    {
      label: 'Bloomers Blue Jeans — Source Text (PDF)',
      filename: 'Bloomers Blue Jeans.pdf',
      path: 'units/bloomers/downloads/Bloomers Blue Jeans.pdf'
    }
  ]
};

if (typeof module !== 'undefined') module.exports = UNIT;
