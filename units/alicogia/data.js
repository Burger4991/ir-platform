const UNIT = {
  meta: {
    id: 'alicogia',
    title: 'The Story of Ali Cogia, Merchant of Baghdad',
    benchmark: 'ELA.10.R.1.1',
    benchmarkLabel: 'Literary Elements',
    benchmarkCategory: 'R.1 Literary',
    text: 'One Thousand and One Nights',
    paragraphs: '1-18',
    days: 6,
    tags: ['One Thousand and One Nights', 'ESOL Ready'],
    description: 'Character, setting, conflict, and symbolism in a classic Arabian Nights tale about trust, temptation, and betrayal.'
  },
  days: {
    1: {
      bellringer: {
        words: ['contented', 'reproached', 'resolved'],
        questions: [
          {
            stem: 'Read: "In the reign of Haroun-al-Raschid, there lived in Bagdad a merchant named Ali Cogia, who, having neither wife nor child, contented himself with the modest profits produced by his trade." What does "contented" most likely mean as used in this passage?',
            options: [
              { letter: 'A', text: 'Frustrated and restless', correct: false },
              { letter: 'B', text: 'Satisfied and at ease', correct: true },
              { letter: 'C', text: 'Bored and indifferent', correct: false },
              { letter: 'D', text: 'Proud and ambitious', correct: false }
            ],
            writtenPrompt: 'What does the word "contented" reveal about Ali Cogia\'s character at the start of the story?',
            writtenModel: 'The word "contented" reveals that Ali Cogia is satisfied with his life. He is not driven by greed or ambition — he is at peace with what he has, which makes him a trustworthy and honorable character.'
          },
          {
            stem: 'Read: "...he reproached him for having neglected the duty of a good Mussulman." What does REPROACHED most likely mean?',
            options: [
              { letter: 'A', text: 'Praised and celebrated', correct: false },
              { letter: 'B', text: 'Ignored completely', correct: false },
              { letter: 'C', text: 'Criticized or blamed', correct: true },
              { letter: 'D', text: 'Forgiven and excused', correct: false }
            ],
            writtenPrompt: 'Why might being "reproached" motivate Ali Cogia to act? How does this connect to the story\'s theme of duty?',
            writtenModel: 'Being reproached — criticized for failing a duty — would motivate Ali Cogia because it implies social and moral pressure. In this culture, failing religious duty is shameful. This connects to the theme that honor and duty are central values in this society.'
          }
        ]
      },
      vocabulary: [
        { word: 'contented', partOfSpeech: 'adjective', definition: 'satisfied and at ease; not wanting more than you have', exampleSentence: 'Ali Cogia contented himself with modest profits and lived quite happily.' },
        { word: 'reproached', partOfSpeech: 'verb', definition: 'expressed disapproval or disappointment toward someone; criticized', exampleSentence: 'His neighbor reproached him for neglecting his religious duty.' },
        { word: 'resolved', partOfSpeech: 'verb', definition: 'made a firm decision; determined to do something', exampleSentence: 'After three vivid dreams, Ali Cogia resolved to put his journey off no longer.' }
      ],
      organizer: {
        benchmarkFocus: 'Literary Elements — Character',
        columns: ['Literary Element', 'Evidence from Text'],
        rows: [
          { label: 'I Do', cells: ['Character — Ali Cogia', 'Ali Cogia is described as a merchant who "contented himself with the modest profits produced by his trade" (¶1). He is not greedy and lives honorably.'], isPreFilled: true },
          { label: 'We Do', cells: ['Setting', ''], isPreFilled: false },
          { label: 'You Do w/ Partner', cells: ['Conflict', ''], isPreFilled: false },
          { label: 'You Do', cells: ['Symbol', ''], isPreFilled: false }
        ]
      },
      teacherNotes: 'Day 1: Introduce literary elements (character, setting, conflict, symbolism, theme). Model I Do row with think-aloud: "I notice the author describes Ali Cogia as contented and prosperous — that tells me he is NOT motivated by greed. This characterization sets up the conflict." Model CUBES annotation with paragraphs 1-3. Release to We Do for setting after modeling. Students read paragraphs 1-9 independently with CUBES.',
      textPassage: {
        paragraphs: [
          { number: 1, text: 'In the reign of Haroun-al-Raschid, there lived in Bagdad a merchant named Ali Cogia, who, having neither wife nor child, contented himself with the modest profits produced by his trade. He had lived quite happily in this way for a long time, when one night he dreamed that an old man appeared to him, and reproached him for having neglected the duty of a good Mussulman, in delaying so long his pilgrimage to Mecca.' },
          { number: 2, text: 'Ali Cogia was much troubled by this dream, as he was unwilling to give up his shop and his business, and put himself to the expense of so long a journey. He tried to think that the dream was nothing but an invention of his own brain; but when the same dream was repeated a second and a third time, he felt that he could not neglect it any longer. But the dream seemed to him a direct warning, and he resolved to put the journey off no longer.' },
          { number: 3, text: 'He arranged his affairs, and having sold his goods, he prepared for his departure. The one thing that troubled him greatly was how to dispose of the thousand gold pieces which were the fruit of his labors, and which he did not care to take with him on such a long journey.' },
          { number: 4, text: 'He took a large vase, and placing the money in the bottom of it, filled up the rest with olives. He then put the cover on, and carried the vase to the house of a merchant friend of his.' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle unknown vocabulary words', example: 'contented, Mussulman, reproached' },
          { letter: 'U', action: 'Underline character descriptions and actions', example: '"contented himself with modest profits"' },
          { letter: 'B', action: 'Box setting clues (time, place, culture)', example: '"In the reign of Haroun-al-Raschid," "Bagdad"' },
          { letter: 'E', action: 'Exclaim (!) surprising or important details', example: 'The same dream repeated three times' },
          { letter: 'S', action: 'Summarize each section in the margin', example: 'Ali Cogia decides to make pilgrimage after recurring dream' }
        ]
      },
      esol: {
        frames: [
          { level: 'L1–L2', frame: 'The character of ___ is shown as ___ because ___.' },
          { level: 'L3–L4', frame: 'The author reveals that ___ by describing him as ___, which suggests ___.' },
          { level: 'L5', frame: 'Through the characterization of ___, the author establishes ___ which foreshadows ___.' }
        ],
        wordBank: ['contented', 'prosperous', 'merchant', 'Baghdad', 'disturbed', 'duty', 'pilgrimage'],
        l1Note: 'Visual dictionary available. Allow L1 students to respond in home language first, then translate key terms. Focus on the word "contented" — show vs. tell: he is NOT greedy.'
      },
      progressItems: [
        'Bellringer complete (4 min)',
        'Literary elements introduced (character, setting, conflict, symbolism, theme)',
        'I Do row modeled with think-aloud',
        'Paragraphs 1-9 read with CUBES annotation',
        'Exit ticket complete'
      ]
    },
    2: {
      bellringer: {
        words: ['custody', 'readily', 'laden'],
        questions: [
          {
            stem: 'Read: "The only matter he could not settle satisfactorily was the safe custody of a thousand pieces of gold..." What does CUSTODY most likely mean as used here?',
            options: [
              { letter: 'A', text: 'Storage location or address', correct: false },
              { letter: 'B', text: 'Care and safekeeping', correct: true },
              { letter: 'C', text: 'A chest of treasure', correct: false },
              { letter: 'D', text: 'A business agreement', correct: false }
            ],
            writtenPrompt: 'Why is "custody" of the gold such a problem for Ali Cogia before his journey? What does this tell us about trust in the story?',
            writtenModel: 'Custody means safekeeping, and it is a problem because Ali Cogia must trust someone else with his life savings while he is away for years. This sets up the central conflict of trust vs. betrayal — he must rely on a friend\'s honor to protect what he values most.'
          },
          {
            stem: 'Read: "The merchant replied readily, \'Look, this is the key of my shop...\'" What does READILY most likely mean?',
            options: [
              { letter: 'A', text: 'Slowly and with great thought', correct: false },
              { letter: 'B', text: 'Angrily and reluctantly', correct: false },
              { letter: 'C', text: 'Quickly and willingly', correct: true },
              { letter: 'D', text: 'Quietly and with suspicion', correct: false }
            ],
            writtenPrompt: 'What does the merchant\'s "readily" agreeing to safeguard the vase suggest about his character at this point in the story?',
            writtenModel: 'The merchant agreeing readily suggests he appears trustworthy and willing at this point. He seems like a good friend. However, the reader should notice this — his easy agreement will contrast sharply with his later betrayal, showing that appearances can be deceiving.'
          }
        ]
      },
      vocabulary: [
        { word: 'custody', partOfSpeech: 'noun', definition: 'protective care or control of something; safekeeping', exampleSentence: 'Ali Cogia left his gold in the custody of a trusted merchant friend.' },
        { word: 'readily', partOfSpeech: 'adverb', definition: 'quickly and willingly; without hesitation', exampleSentence: 'The friend readily agreed to keep the vase safe while Ali Cogia traveled.' },
        { word: 'laden', partOfSpeech: 'adjective', definition: 'heavily loaded; carrying a great weight or burden', exampleSentence: 'Ali Cogia mounted the camel that he had laden with merchandise before joining the caravan.' }
      ],
      organizer: {
        benchmarkFocus: 'Literary Elements — Setting',
        columns: ['Literary Element', 'Evidence from Text'],
        rows: [
          { label: 'I Do', cells: ['Setting', '"In the reign of Haroun-al-Raschid, there lived in Bagdad" (¶1). Baghdad during the Islamic Golden Age establishes a culture where religious duty and trust between people are sacred values.'], isPreFilled: true },
          { label: 'We Do', cells: ['Characterization — The Wife', ''], isPreFilled: false },
          { label: 'You Do w/ Partner', cells: ['Conflict', ''], isPreFilled: false },
          { label: 'You Do', cells: ['Symbolism — Jar of Olives', ''], isPreFilled: false }
        ]
      },
      teacherNotes: 'Day 2: Begin with bellringer (4 min). Introduce CUBES for questions and STOP strategy for MC. Model STOP with a sample question — label each choice S, T, O, or P before selecting. Students read paragraphs 10-18 independently with margin questions. Model setting as I Do row: "Baghdad during Haroun-al-Raschid era tells us the culture values religious duty and honor." Guide We Do (Wife characterization) together.',
      textPassage: {
        paragraphs: [
          { number: 5, text: '"Friend," said he, "you know I am going to set out on the pilgrimage to Mecca. I have here a vase full of olives which I beg you to keep for me until I return. Give me the key to your shop, and I will leave it there in safety."' },
          { number: 6, text: 'The merchant replied readily, "Look, this is the key of my shop; take it, and put your vase wherever you please. I promise that you shall find it in the same place on your return."' },
          { number: 7, text: 'Some days after, Ali Cogia mounted the camel that he had laden with merchandise, joined the caravan, and began his journey.' },
          { number: 8, text: 'He reached Mecca, and visited the holy temple which the faithful are bound to make a circuit of. After performing all the ceremonies prescribed by his religion, he sold his goods to great advantage, and then went on to other cities, where he did further business.' },
          { number: 9, text: 'Several years went by, and Ali Cogia was still away from Baghdad, though his long absence was not of his own choice.' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle vocabulary used in dialogue', example: 'custody, readily, laden' },
          { letter: 'U', action: 'Underline what the merchant promises Ali Cogia', example: '"you shall find it in the same place"' },
          { letter: 'B', action: 'Box the evidence of the setting (where Ali Cogia travels)', example: 'Mecca, caravan, holy temple' },
          { letter: 'E', action: 'Exclaim (!) the most important promise made', example: 'The merchant promises the vase will be safe' },
          { letter: 'S', action: 'Summarize: what is at stake if the promise is broken?', example: 'Ali Cogia\'s savings and trust' }
        ]
      },
      esol: {
        frames: [
          { level: 'L1–L2', frame: 'The setting of ___ is important because it shows that ___.' },
          { level: 'L3–L4', frame: 'The author uses the setting of ___ to establish ___, which means that the characters value ___.' },
          { level: 'L5', frame: 'By situating the story in ___ during the era of ___, the author reinforces the cultural values of ___, which heightens the significance of ___.' }
        ],
        wordBank: ['Baghdad', 'Mecca', 'pilgrimage', 'custody', 'readily', 'trust', 'promise', 'honor'],
        l1Note: 'Provide a simple map showing Baghdad and Mecca. Explain "pilgrimage" as a religious journey. Help L1 students understand the cultural importance of keeping promises in this setting.'
      },
      progressItems: [
        'Bellringer complete (4 min)',
        'STOP strategy introduced and modeled',
        'Paragraphs 10-18 read with margin questions',
        'Setting I Do row complete',
        'Exit ticket: name the main conflict in one sentence'
      ]
    },
    3: {
      bellringer: {
        words: ['gladdened', 'presentiment', 'base'],
        questions: [
          {
            stem: 'Read: "Results gladdened his heart." What does GLADDENED most likely mean?',
            options: [
              { letter: 'A', text: 'Filled with worry', correct: false },
              { letter: 'B', text: 'Made happy or joyful', correct: true },
              { letter: 'C', text: 'Left confused and uncertain', correct: false },
              { letter: 'D', text: 'Made harder or tougher', correct: false }
            ],
            writtenPrompt: 'How does the word "gladdened" compare to Ali Cogia\'s mood at the start of the story? What does this contrast suggest?',
            writtenModel: 'At the start, Ali Cogia was "contented" — satisfied with modest happiness. "Gladdened" suggests a more active joy, perhaps relief or excitement. The contrast suggests his journey brought him renewed purpose, making the coming betrayal even more devastating.'
          },
          {
            stem: 'Read: "She has a presentiment that Ali Cogia will return." What does PRESENTIMENT most likely mean?',
            options: [
              { letter: 'A', text: 'A memory from the past', correct: false },
              { letter: 'B', text: 'A strong feeling about what will happen', correct: true },
              { letter: 'C', text: 'A written message or letter', correct: false },
              { letter: 'D', text: 'A desire for revenge', correct: false }
            ],
            writtenPrompt: 'Why is the wife\'s "presentiment" important to the plot? What does it foreshadow?',
            writtenModel: 'The wife\'s presentiment — her strong feeling that Ali Cogia will return — is important because it foreshadows the conflict that will follow. Her warning shows moral wisdom: she knows that breaking trust will have consequences. It also develops her character as the moral conscience of the story.'
          }
        ]
      },
      vocabulary: [
        { word: 'gladdened', partOfSpeech: 'verb', definition: 'made happy; filled with joy or pleasure', exampleSentence: 'The news of his friend\'s return gladdened Ali Cogia\'s heart after years away.' },
        { word: 'presentiment', partOfSpeech: 'noun', definition: 'a strong feeling that something (especially bad) is about to happen; a foreboding', exampleSentence: 'The merchant\'s wife had a presentiment that Ali Cogia would return for his gold.' },
        { word: 'base', partOfSpeech: 'adjective', definition: 'morally low; dishonorable; without integrity', exampleSentence: '"Beware of doing anything so base!" the wife warned her husband.' }
      ],
      organizer: {
        benchmarkFocus: 'Literary Elements — Characterization (The Wife) and Conflict',
        columns: ['Literary Element', 'Evidence from Text'],
        rows: [
          { label: 'I Do', cells: ['Setting', '"In the reign of Haroun-al-Raschid, there lived in Bagdad" (¶1). The cultural setting of the Islamic Golden Age establishes that religious duty and trust are the highest values.'], isPreFilled: true },
          { label: 'We Do', cells: ['Characterization — The Wife', '"Beware, I pray, of your doing anything so base! How shameful it would be to have to confess that you had betrayed your trust!" (¶12). The wife represents the moral conscience of the story — wise, direct, and principled.'], isPreFilled: true },
          { label: 'You Do w/ Partner', cells: ['Conflict', ''], isPreFilled: false },
          { label: 'You Do', cells: ['Symbolism — Jar of Olives', ''], isPreFilled: false }
        ]
      },
      teacherNotes: 'Day 3: Organizer I Do / We Do / You Do day. Model Setting row (I Do) with think-aloud. Reveal We Do (Wife characterization) together — analyze her word choices: "beware," "base," "shameful," "betrayed your trust." Guide discussion: she has no name but her dialogue tells us everything. Partner work for Conflict row. Independent for Symbolism row. Key question: What does the jar of olives represent?',
      textPassage: {
        paragraphs: [
          { number: 10, text: 'At the end of seven years, Ali Cogia resolved to return to Baghdad. Around the same time, the merchant\'s wife wanted to dress a salad. She sent her husband to the shop to get some olives. "Take what you want from the vase Ali Cogia left with us," he said.' },
          { number: 11, text: 'When the merchant opened the vase to take out the olives, he was astonished to see gold coins at the bottom. He put his hand down and then looked carefully. He could hardly believe his eyes. He put back the cover carefully and went home.' },
          { number: 12, text: '"Wife," said he, "I have found, at the bottom of the vase belonging to Ali Cogia, a great many gold pieces. What do you think I ought to do with them?" "Beware," replied his wife, "I pray, of your doing anything so base! How shameful it would be to have to confess that you had betrayed your trust! She has a presentiment that Ali Cogia will return, and he will certainly ask for his vase."' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle words that show moral judgment', example: 'base, shameful, betrayed' },
          { letter: 'U', action: 'Underline the wife\'s warning — her exact words', example: '"Beware of doing anything so base!"' },
          { letter: 'B', action: 'Box the turning point — when temptation begins', example: 'merchant discovers the gold (¶11)' },
          { letter: 'E', action: 'Exclaim (!) the moment that changes everything', example: 'He sees the gold coins' },
          { letter: 'S', action: 'Summarize: what choice does the merchant now face?', example: 'Honor his promise OR take the gold' }
        ]
      },
      esol: {
        frames: [
          { level: 'L1–L2', frame: 'The character of ___ is shown as ___ when she/he says "___".' },
          { level: 'L3–L4', frame: 'The author uses the dialogue of ___ to reveal that she is ___, as shown when she warns "___ ".' },
          { level: 'L5', frame: 'Through the characterization of the merchant\'s wife — revealed entirely through dialogue since she is unnamed — the author establishes ___ as a foil to the merchant\'s ___.' }
        ],
        wordBank: ['base', 'shameful', 'betrayed', 'presentiment', 'warned', 'gladdened', 'moral', 'conscience'],
        l1Note: 'Focus on the wife\'s warning: "base" = dishonorable; "shameful" = embarrassing/wrong; "betrayed" = broke trust. Use gestures: thumbs down for "base," covering face for "shameful." Allow L1 students to draw the scene.'
      },
      progressItems: [
        'Bellringer complete (4 min)',
        'I Do row reviewed (Setting)',
        'We Do row complete (Wife characterization)',
        'You Do w/ Partner complete (Conflict)',
        'You Do complete (Symbolism — Jar of Olives)'
      ]
    },
    4: {
      bellringer: {
        words: ['obstinate', 'sensible', 'idle'],
        questions: [
          {
            stem: 'Read: "The merchant refused to listen to her advice, sensible though it was." What does SENSIBLE most likely mean?',
            options: [
              { letter: 'A', text: 'Emotional and impulsive', correct: false },
              { letter: 'B', text: 'Confusing and unclear', correct: false },
              { letter: 'C', text: 'Reasonable and wise', correct: true },
              { letter: 'D', text: 'Selfish and greedy', correct: false }
            ],
            writtenPrompt: 'The narrator calls the wife\'s advice "sensible." What does it mean when a character ignores sensible advice? What does this reveal about the merchant?',
            writtenModel: 'When a character ignores sensible — wise and reasonable — advice, it shows they are being controlled by something stronger than logic, like greed or selfishness. The merchant ignoring sensible advice reveals that his desire for gold has already corrupted his judgment. He knows what is right but chooses what is easy.'
          },
          {
            stem: 'Read: "If you will be so obstinate..." What does OBSTINATE most likely mean?',
            options: [
              { letter: 'A', text: 'Generous and giving', correct: false },
              { letter: 'B', text: 'Honest and trustworthy', correct: false },
              { letter: 'C', text: 'Careful and deliberate', correct: false },
              { letter: 'D', text: 'Stubbornly refusing to change', correct: true }
            ],
            writtenPrompt: 'How does being "obstinate" contribute to the conflict in the story? Connect to a specific moment in the text.',
            writtenModel: 'Being obstinate — stubbornly refusing to change — deepens the conflict because the merchant has a clear choice: listen to his wife\'s sensible warning or ignore it. His obstinacy means he cannot be reasoned with. This leads directly to the betrayal, making him responsible for the consequences that follow.'
          }
        ]
      },
      vocabulary: [
        { word: 'obstinate', partOfSpeech: 'adjective', definition: 'stubbornly refusing to change one\'s mind or course of action despite good reasons to do so', exampleSentence: 'The merchant was obstinate, refusing to heed his wife\'s warning even though she was right.' },
        { word: 'sensible', partOfSpeech: 'adjective', definition: 'showing good judgment; reasonable and practical', exampleSentence: 'The wife\'s advice was sensible, but the merchant refused to listen.' },
        { word: 'idle', partOfSpeech: 'adjective', definition: 'without purpose or worth; here used to dismiss something as unimportant', exampleSentence: '"Pay no attention to my idle words," he said, though his words were anything but idle.' }
      ],
      organizer: {
        benchmarkFocus: 'Literary Elements — Conflict and Plot (Close Reading)',
        columns: ['Literary Element', 'Evidence from Text'],
        rows: [
          { label: 'I Do', cells: ['Setting', '"In the reign of Haroun-al-Raschid, there lived in Bagdad" (¶1). The cultural setting emphasizes religious duty and trust as sacred values.'], isPreFilled: true },
          { label: 'We Do', cells: ['Characterization — The Wife', '"Beware, I pray, of your doing anything so base! How shameful it would be to have to confess that you had betrayed your trust!" (¶12). She is the moral conscience — principled and direct.'], isPreFilled: true },
          { label: 'You Do w/ Partner', cells: ['Conflict', 'The merchant faces external conflict (person vs. person: Ali Cogia vs. merchant) and internal conflict (greed vs. honor). "The sight of the money roused all the merchant\'s greed" (¶16) shows greed winning.'], isPreFilled: true },
          { label: 'You Do', cells: ['Symbolism — Jar of Olives', ''], isPreFilled: false }
        ]
      },
      teacherNotes: 'Day 4: Organizer completion and close reading day. Begin with bellringer (4 min). Students finish any incomplete organizer rows. Close reading of two key quotes: (1) "The merchant refused to listen to her advice, sensible though it was" — what does this sentence structure tell us? (2) "The sight of the money roused all the merchant\'s greed" — analyze the chain reaction: sight → roused → greed. Quote analysis writing practice using ACE framework.',
      textPassage: {
        paragraphs: [
          { number: 13, text: 'The merchant refused to listen to her advice, sensible though it was. He could not resist the temptation. He took out all the gold and replaced it with olives. Then he recorked the vase as carefully as he could, so that it appeared not to have been touched.' },
          { number: 14, text: '"If you will be so obstinate," said the wife, "I cannot help it; but do not blame me for what may happen." The merchant did not reply, and seemed to give no thought to the matter.' },
          { number: 15, text: 'Some time after this, Ali Cogia reached Baghdad and went immediately to the merchant\'s shop to recover his vase. The merchant greeted him with great joy, and willingly went with him to the shop.' },
          { number: 16, text: 'The sight of the money had roused all the merchant\'s greed. He looked into the vase, and saw that all the bottom was filled with gold. He was now glad that he had yielded to the temptation, and thought Ali Cogia would never be able to prove it was gone.' }
        ],
        cubesGuide: [
          { letter: 'C', action: 'Circle words that show the merchant\'s internal battle', example: 'obstinate, refused, temptation, greed' },
          { letter: 'U', action: 'Underline the cause-and-effect chain of betrayal', example: '"sight of the money roused all the merchant\'s greed"' },
          { letter: 'B', action: 'Box the moment the merchant makes his final choice', example: '"He took out all the gold" (¶13)' },
          { letter: 'E', action: 'Exclaim (!) the irony of the merchant\'s confident thinking', example: 'He thinks Ali Cogia can never prove it — but he is wrong' },
          { letter: 'S', action: 'Summarize: how does greed overcome honor in this passage?', example: 'The merchant saw the gold, was roused by greed, and chose betrayal' }
        ]
      },
      esol: {
        frames: [
          { level: 'L1–L2', frame: 'The conflict in this story is between ___ and ___. This conflict happens because ___.' },
          { level: 'L3–L4', frame: 'The author develops the conflict by showing that ___ chooses ___ over ___, as shown when "___".' },
          { level: 'L5', frame: 'The external conflict between Ali Cogia and the merchant is driven by an internal conflict within the merchant — the struggle between ___ and ___. The author reveals this through the language "___," which suggests ___.' }
        ],
        wordBank: ['obstinate', 'sensible', 'greed', 'roused', 'temptation', 'betrayal', 'conflict', 'honor'],
        l1Note: 'Use two-column chart: Wife\'s words (sensible, moral) vs. Merchant\'s actions (obstinate, greedy). Allow L1 students to use symbols: star for "right choice," X for "wrong choice." Focus on the moment the merchant decides.'
      },
      progressItems: [
        'Bellringer complete (4 min)',
        'All organizer rows complete',
        'Close reading: "sensible though it was" analyzed',
        'Close reading: "sight of the money roused all the merchant\'s greed" analyzed',
        'ACE writing practice complete'
      ]
    },
    5: {
      bellringer: {
        words: ['entreat', 'roused', 'shameful'],
        questions: [
          {
            stem: 'Read: "Give it up, I entreat you!" What does ENTREAT most likely mean?',
            options: [
              { letter: 'A', text: 'To command forcefully', correct: false },
              { letter: 'B', text: 'To beg or plead earnestly', correct: true },
              { letter: 'C', text: 'To threaten with consequences', correct: false },
              { letter: 'D', text: 'To whisper secretly', correct: false }
            ],
            writtenPrompt: 'If the wife must "entreat" her husband rather than simply tell him — what does this reveal about the conflict between them?',
            writtenModel: 'The fact that the wife must entreat — beg and plead — rather than simply instruct reveals that the merchant has already made up his mind. She has lost the argument of reason and must resort to emotional appeal. This shows the conflict is unresolvable at this point: greed has fully overtaken his judgment.'
          },
          {
            stem: 'Read: "The sight of the money roused all the merchant\'s greed." What does ROUSED most likely mean?',
            options: [
              { letter: 'A', text: 'Calmed and soothed', correct: false },
              { letter: 'B', text: 'Hidden or concealed', correct: false },
              { letter: 'C', text: 'Stirred up or awakened', correct: true },
              { letter: 'D', text: 'Completely destroyed', correct: false }
            ],
            writtenPrompt: 'How does the word "roused" suggest that the merchant\'s greed was already inside him, just waiting? What does this reveal about his character?',
            writtenModel: 'The word "roused" — stirred up or awakened — implies that the greed was dormant inside the merchant, not created by the gold. The gold merely woke it. This reveals that the merchant was never truly trustworthy — his appearance of goodness was fragile, and the temptation simply revealed his true character.'
          }
        ]
      },
      vocabulary: [
        { word: 'entreat', partOfSpeech: 'verb', definition: 'to ask someone earnestly and emotionally; to beg or plead', exampleSentence: '"Give it up, I entreat you!" the wife begged her husband, but he would not listen.' },
        { word: 'roused', partOfSpeech: 'verb', definition: 'stirred up; awakened; caused a strong feeling to emerge', exampleSentence: 'The sight of the gold roused all the merchant\'s greed, overcoming his sense of honor.' },
        { word: 'shameful', partOfSpeech: 'adjective', definition: 'deserving shame; dishonorable; causing feelings of embarrassment or disgrace', exampleSentence: '"How shameful it would be to have betrayed your trust!" the wife warned.' }
      ],
      organizer: {
        benchmarkFocus: 'Literary Elements — All Elements Review for Assessment',
        columns: ['Literary Element', 'Evidence from Text'],
        rows: [
          { label: 'I Do', cells: ['Setting', '"In the reign of Haroun-al-Raschid, there lived in Bagdad" (¶1). Cultural setting establishes values of religious duty and trust.'], isPreFilled: true },
          { label: 'We Do', cells: ['Characterization', '"Beware, I pray, of your doing anything so base!" (¶12) — Wife as moral conscience; "The sight of the money roused all the merchant\'s greed" (¶16) — Merchant as embodiment of temptation.'], isPreFilled: true },
          { label: 'You Do w/ Partner', cells: ['Conflict', 'External: Ali Cogia vs. merchant (person vs. person); Internal: greed vs. honor within the merchant. "The sight of the money roused all the merchant\'s greed" (¶16).'], isPreFilled: true },
          { label: 'You Do', cells: ['Symbolism', 'The jar of olives symbolizes trust — it is the vessel that holds both Ali Cogia\'s gold and his faith in his friend. When opened and violated, it represents broken trust.'], isPreFilled: true }
        ]
      },
      teacherNotes: 'Day 5: Mini-assessment day with STOP protocol. Begin with bellringer (4 min) then STOP strategy review. Students take mini-assessment (Q11-Q15, district-aligned) using STOP on ALL questions — label each choice S, T, O, or P before selecting. Monitor and support. Debrief answers using think-aloud. Exit ticket: which STOP category was hardest and why?',
      esol: {
        frames: [
          { level: 'L1–L2', frame: 'The answer is ___ because the text says "___".' },
          { level: 'L3–L4', frame: 'I can prove my answer by looking at ___, where the text states "___," which shows ___.' },
          { level: 'L5', frame: 'Using the STOP strategy, I can eliminate ___ (Silly/Opposite) and ___ (Tricky) because ___; the Proven answer is ___ because "___."' }
        ],
        wordBank: ['proven', 'evidence', 'support', 'eliminate', 'inference', 'symbolize', 'develop', 'theme'],
        l1Note: 'Allow L1-L2 students to use word banks and sentence frames during assessment. Focus on STOP: use symbols — X for Silly/Opposite, ? for Tricky, checkmark for Proven. Read questions aloud if needed.'
      },
      progressItems: [
        'Bellringer complete (4 min)',
        'STOP strategy reviewed',
        'Q11-Q15 mini-assessment complete (STOP labels on every choice)',
        'Assessment debriefed with class',
        'Exit ticket: hardest STOP category identified'
      ]
    },
    6: {
      bellringer: {
        words: ['betrayed', 'greed', 'pilgrimage'],
        questions: [
          {
            stem: 'Read: "How shameful it would be to have to confess that you had betrayed your trust!" What does BETRAYED most likely mean?',
            options: [
              { letter: 'A', text: 'Protected or safeguarded', correct: false },
              { letter: 'B', text: 'Broke or violated (a promise or trust)', correct: true },
              { letter: 'C', text: 'Strengthened or reinforced', correct: false },
              { letter: 'D', text: 'Questioned or doubted', correct: false }
            ],
            writtenPrompt: 'How does the word "betrayed" capture the story\'s central theme? What makes betrayal worse than simply lying or stealing?',
            writtenModel: 'Betrayal is worse than simply lying or stealing because it involves a violation of trust that was freely given. Ali Cogia trusted his friend — not a stranger — with his savings. When that trust is betrayed, it destroys not just the gold but the relationship and the friend\'s character. The word "betrayed" captures the story\'s theme: trust is sacred, and breaking it has moral consequences.'
          },
          {
            stem: 'Read: "The sight of the money roused all the merchant\'s greed." What does GREED most likely mean?',
            options: [
              { letter: 'A', text: 'Generosity and kindness', correct: false },
              { letter: 'B', text: 'Confusion and uncertainty', correct: false },
              { letter: 'C', text: 'Fear of punishment', correct: false },
              { letter: 'D', text: 'Selfish desire for more than one needs', correct: true }
            ],
            writtenPrompt: 'How does the theme of "greed as destruction" develop across the whole story? Use at least one quote as evidence.',
            writtenModel: 'The theme of greed as destruction develops gradually. At first, the merchant seems trustworthy and generous, agreeing "readily" to help. But when he discovers the gold, "the sight of the money roused all the merchant\'s greed" (¶16), and he ignores his wife\'s sensible warning. His greed destroys the friendship, his integrity, and ultimately leads to his ruin — showing that desire for wealth corrupts moral judgment.'
          }
        ]
      },
      vocabulary: [
        { word: 'betrayed', partOfSpeech: 'verb', definition: 'violated the trust of someone; broke faith with a person who relied on you', exampleSentence: 'The merchant betrayed Ali Cogia\'s trust by stealing the gold he had been asked to protect.' },
        { word: 'greed', partOfSpeech: 'noun', definition: 'intense and selfish desire for more wealth, power, or possessions than one needs', exampleSentence: 'The sight of the gold roused all the merchant\'s greed, overcoming his sense of honor.' },
        { word: 'pilgrimage', partOfSpeech: 'noun', definition: 'a journey to a sacred or significant place, often for religious reasons', exampleSentence: 'Ali Cogia made a pilgrimage to Mecca, as his dream had instructed him to do.' }
      ],
      organizer: {
        benchmarkFocus: 'Literary Elements — Theme (ACE Writing Focus)',
        columns: ['Literary Element', 'Evidence from Text'],
        rows: [
          { label: 'I Do', cells: ['Theme 1: Trust & Betrayal', '"I promise that you shall find it in the same place on your return" (¶6) → "The sight of the money roused all the merchant\'s greed" (¶16). Breaking trust destroys relationships and reveals true character.'], isPreFilled: true },
          { label: 'We Do', cells: ['Theme 2: Greed as Destruction', '"The sight of the money roused all the merchant\'s greed" (¶16). The merchant ignores sensible advice — greed corrupts moral judgment and leads to ruin.'], isPreFilled: true },
          { label: 'You Do w/ Partner', cells: ['Theme 3: Social Responsibility / Duty', ''], isPreFilled: false },
          { label: 'You Do', cells: ['Universal Connection', ''], isPreFilled: false }
        ]
      },
      teacherNotes: 'Day 6: ACE writing and self-assessment day. Begin with bellringer (4 min). Review ACE structure (Answer → Cite → Explain). Model with the prompt: "How does the author use characterization and conflict to develop the universal theme of trust and betrayal?" Write sample ACE response together. Students draft independently, then peer review using ACE checklist. Self-assessment exit ticket: rate your response 1-5 and identify what would move you up one level.',
      esol: {
        frames: [
          { level: 'L1–L2', frame: 'The theme of this story is ___. I know this because the text says "___".' },
          { level: 'L3–L4', frame: 'The author develops the theme of ___ by using ___ (literary element). For example, "___" (¶___) shows that ___.' },
          { level: 'L5', frame: 'The author uses ___ and ___ (literary elements) to develop the universal theme that ___. As shown in "___" (¶___), this conveys that when ___, the result is ___.' }
        ],
        wordBank: ['betrayed', 'greed', 'pilgrimage', 'theme', 'characterization', 'symbolism', 'trust', 'moral', 'duty', 'universal'],
        l1Note: 'Provide the ACE frame pre-filled with the prompt: "The theme is ___ because ___." For L1 students, allow a shorter response: one sentence claim + one quote. Focus on connecting their chosen quote to the theme word (trust, greed, duty).'
      },
      progressItems: [
        'Bellringer complete (4 min)',
        'ACE structure reviewed',
        'ACE draft written (characterization + conflict → theme)',
        'Peer review complete using ACE checklist',
        'Self-assessment exit ticket complete'
      ]
    }
  },
  assessment: {
    stopProtocol: {
      description: 'Use STOP to evaluate each answer choice before selecting. Label EVERY choice before circling your answer.',
      steps: [
        { letter: 'S', label: 'Silly', description: 'Clearly wrong — no evidence in the text — eliminate first' },
        { letter: 'T', label: 'Tricky', description: 'Plausible but not fully supported; partially correct but incomplete' },
        { letter: 'O', label: 'Opposite', description: 'Contradicts what the text actually says' },
        { letter: 'P', label: 'Proven', description: 'Directly supported by text evidence — the correct answer' }
      ]
    },
    mcQuestions: [
      {
        id: 'Q11A',
        label: 'Q11 — Part A',
        stem: 'What can readers infer about Ali Cogia based upon his actions?',
        options: [
          { letter: 'A', text: 'His decision to make a trip to Mecca after having a dream shows that he is a devout Muslim.', correct: true, stop: 'P' },
          { letter: 'B', text: 'His decision to let a friend look after his money shows that he is overly trusting of other people.', correct: false, stop: 'T' },
          { letter: 'C', text: 'His choice to sell his wares on the way to Mecca shows that he is not serious about his religious life.', correct: false, stop: 'O' },
          { letter: 'D', text: 'His choice to delay his journey home for many years shows that he is neglectful of his family obligations.', correct: false, stop: 'T' }
        ],
        explanation: 'A = PROVEN — "the dream seemed to him a direct warning, and he resolved to put the journey off no longer" (¶2) demonstrates religious devotion. B = TRICKY — close but the inference is about devotion, not over-trusting. C = OPPOSITE — selling wares was practical; he was serious. D = TRICKY — no evidence he neglected family obligations.'
      },
      {
        id: 'Q11B',
        label: 'Q11 — Part B',
        stem: 'Which sentence best provides evidence for the inference about Ali Cogia in Part A?',
        options: [
          { letter: 'A', text: '"Ali Cogia was much troubled by this dream, as he was unwilling to give up his shop..." (¶2)', correct: false, stop: 'T' },
          { letter: 'B', text: '"...but the dream seemed to him a direct warning, and he resolved to put the journey off no longer." (¶2)', correct: true, stop: 'P' },
          { letter: 'C', text: '"He took a large vase, and placing the money in the bottom of it, filled up the rest with olives." (¶4)', correct: false, stop: 'S' },
          { letter: 'D', text: '"...Ali Cogia mounted the camel that he had laden with merchandise, joined the caravan..." (¶7)', correct: false, stop: 'T' }
        ],
        explanation: 'B = PROVEN — directly states Ali\'s resolve to obey the dream as a religious calling. This is the strongest evidence of his devotion.'
      },
      {
        id: 'Q12',
        label: 'Q12',
        stem: 'How does the author use dialogue to develop the character of Ali Cogia\'s friend\'s wife?',
        options: [
          { letter: 'A', text: 'The dialogue establishes that the wife is obedient and does not challenge her husband.', correct: false, stop: 'O' },
          { letter: 'B', text: 'The dialogue shows that the wife provides her husband with thoughtful advice.', correct: true, stop: 'P' },
          { letter: 'C', text: 'The dialogue establishes that the wife is in control of her husband\'s actions.', correct: false, stop: 'T' },
          { letter: 'D', text: 'The dialogue shows that the wife places business above friendship.', correct: false, stop: 'S' }
        ],
        explanation: 'B = PROVEN — "Beware, I pray, of your doing anything so base!" (¶12) shows thoughtful, moral advice. A = OPPOSITE — she clearly challenges him. C = TRICKY — she advises but cannot control him; he ignores her. D = SILLY — no text support.'
      },
      {
        id: 'Q13',
        label: 'Q13',
        stem: 'How does the author use the historical and cultural setting to reinforce the universal theme of social responsibility?',
        options: [
          { letter: 'A', text: 'The author shows that a sense of duty was intrinsic to the culture as evidenced by the journey to Mecca that was the expected "duty of a good Mussulman."', correct: true, stop: 'P' },
          { letter: 'B', text: 'The author focuses on the cultural value of sharing when Ali Cogia takes the jar of olives to his friend.', correct: false, stop: 'T' },
          { letter: 'C', text: 'The author emphasizes the importance of honest business dealings to the society when Ali Cogia "set out his goods to the best advantage."', correct: false, stop: 'T' },
          { letter: 'D', text: 'The author highlights the society\'s emphasis on the importance of accepting wise counsel when Ali Cogia goes to Cairo.', correct: false, stop: 'S' }
        ],
        explanation: 'A = PROVEN — the cultural setting establishes religious duty (pilgrimage) as a social expectation, making the merchant\'s betrayal a violation of shared cultural values.'
      },
      {
        id: 'Q14',
        label: 'Q14',
        stem: 'Ali Cogia\'s jar of olives serves as both a plot point and a motif. What does the author most clearly use the jar of olives to symbolize?',
        options: [
          { letter: 'A', text: 'loss', correct: false, stop: 'T' },
          { letter: 'B', text: 'hope', correct: false, stop: 'T' },
          { letter: 'C', text: 'greed', correct: false, stop: 'T' },
          { letter: 'D', text: 'trust', correct: true, stop: 'P' }
        ],
        explanation: 'D = PROVEN — Ali Cogia entrusted his gold (hidden in the jar) to his friend. The jar IS the trust between them. When the merchant violates the jar, he violates the trust. The jar symbolizes trust most clearly because it is the physical object through which the friendship and betrayal are expressed.'
      },
      {
        id: 'Q15',
        label: 'Q15',
        stem: 'What connection can readers make between the folktale and a moral dilemma people in modern society might face?',
        options: [
          { letter: 'A', text: '"Should I follow my dreams even if it means causing harm to others?"', correct: false, stop: 'T' },
          { letter: 'B', text: '"Should I help a friend even if I believe my friend is making a mistake?"', correct: false, stop: 'T' },
          { letter: 'C', text: '"Should I do the right thing even if I think I won\'t get caught?"', correct: true, stop: 'P' },
          { letter: 'D', text: '"Should I follow the advice of my spouse even if it is morally wrong?"', correct: false, stop: 'O' }
        ],
        explanation: 'C = PROVEN — the merchant believed Ali Cogia would never return and never know. He chose greed believing he was safe from consequences. This parallels the modern dilemma of integrity when no one is watching.'
      }
    ],
    raceGuide: {
      tiers: [
        { tier: 'LITE (L2)', label: 'Restate + Answer', frame: 'The literary element ___ is shown when ___.' },
        { tier: 'STANDARD (L3)', label: 'RACE', frame: 'The author uses ___ to show ___. The text states "___." This reveals ___.' },
        { tier: 'ADVANCED (L4-5)', label: 'RACE + Analysis', frame: 'Through the use of ___, the author conveys ___. As evidenced by "___," this reveals ___ about ___.' }
      ]
    },
    achievementLevels: [
      { level: 4, label: 'Exceeds', description: 'Student identifies multiple literary elements, cites specific evidence with paragraph numbers, and explains how elements develop theme with analytical depth.' },
      { level: 3, label: 'Meets', description: 'Student correctly identifies literary elements, cites textual evidence, and explains how the element contributes to meaning.' },
      { level: 2, label: 'Approaching', description: 'Student identifies a literary element but evidence is vague or explanation lacks connection to theme.' },
      { level: 1, label: 'Beginning', description: 'Student attempts to identify literary elements but relies on summary rather than analysis. Limited or no text evidence.' }
    ]
  },
  downloads: [
    { label: 'Teacher Lesson Plan', filename: 'AliCogia_D1-6_TeacherPlan_20260308.docx' },
    { label: 'Student Packet', filename: 'AliCogia_D1-6_StudentPacket_20260308.docx' },
    { label: 'Answer Key', filename: 'AliCogia_D1-6_AnswerKey_20260308.docx' },
    { label: 'Feedback Form', filename: 'AliCogia_D1-6_FeedbackForm_20260308.docx' }
  ]
};

if (typeof module !== 'undefined') module.exports = UNIT;
