 const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ============================================================
// FINEBOT
// Grade 12 Mastering Companion
// CLEAN 3-PART VERSION
// ============================================================

// ============================================================
// SUBJECTS
// ============================================================

const subjects = {
  biology: {
    label: '🧬 Biology',
    units: ['Cell', 'Genetics', 'Human Biology']
  },

  chemistry: {
    label: '⚗️ Chemistry',
    units: [
      'Atomic Structure',
      'Chemical Bonding',
      'Organic Chemistry'
    ]
  },

  physics: {
    label: '⚡ Physics',
    units: ['Motion', 'Energy', 'Waves']
  },

  mathematics: {
    label: '📐 Mathematics',
    units: ['Algebra', 'Geometry', 'Calculus']
  },

  english: {
    label: '🇬🇧 English',
    units: ['Grammar', 'Literature', 'Writing']
  },

  history: {
    label: '🏛️ History',
    units: [
      'Ancient Civilizations',
      'Modern History'
    ]
  },

  geography: {
    label: '🌍 Geography',
    units: [
      'Physical Geography',
      'Human Geography'
    ]
  },

  economics: {
    label: '💰 Economics',
    units: [
      'Microeconomics',
      'Macroeconomics'
    ]
  }
};

// ============================================================
// LESSONS
// ============================================================

const lessons = {

  biology: {

    Cell: {
      title: 'The Cell',

      concepts: [
        'Cells are the basic structural and functional units of life.',
        'The nucleus contains genetic material.',
        'Mitochondria release energy for cellular activities.'
      ],

      remember:
        'Think of the nucleus as the cell\'s control center.'
    },

    Genetics: {
      title: 'Genetics',

      concepts: [
        'Genetics is the study of heredity.',
        'Genes carry information that influences traits.',
        'DNA stores genetic information.'
      ],

      remember:
        'Genes are instructions passed from parents to offspring.'
    },

    'Human Biology': {
      title: 'Human Biology',

      concepts: [
        'The human body is made of specialized cells.',
        'Organ systems work together to maintain life.',
        'Homeostasis helps maintain stable internal conditions.'
      ],

      remember:
        'Your body works as a connected system.'
    }
  },

  chemistry: {

    'Atomic Structure': {
      title: 'Atomic Structure',

      concepts: [
        'Atoms contain protons, neutrons, and electrons.',
        'Protons have a positive charge.',
        'Electrons have a negative charge.'
      ],

      remember:
        'The atomic number tells you the number of protons.'
    },

    'Chemical Bonding': {
      title: 'Chemical Bonding',

      concepts: [
        'Atoms can bond to become more stable.',
        'Ionic bonds involve transfer of electrons.',
        'Covalent bonds involve sharing electrons.'
      ],

      remember:
        'Ionic = transfer. Covalent = sharing.'
    },

    'Organic Chemistry': {
      title: 'Organic Chemistry',

      concepts: [
        'Organic chemistry mainly studies carbon compounds.',
        'Carbon can form many different structures.',
        'Hydrocarbons contain carbon and hydrogen.'
      ],

      remember:
        'Carbon is the foundation of countless organic compounds.'
    }
  },

  physics: {

    Motion: {
      title: 'Motion',

      concepts: [
        'Speed describes how quickly distance is covered.',
        'Speed = Distance ÷ Time.',
        'Velocity includes direction as well as speed.'
      ],

      remember:
        'Speed tells you how fast. Velocity tells you how fast and where.'
    },

    Energy: {
      title: 'Energy',

      concepts: [
        'Energy is the ability to do work.',
        'Energy can change from one form to another.',
        'Kinetic energy is associated with motion.'
      ],

      remember:
        'Energy changes form—it does not simply disappear.'
    },

    Waves: {
      title: 'Waves',

      concepts: [
        'Waves transfer energy.',
        'Frequency measures cycles per second.',
        'Wavelength is the distance between corresponding points.'
      ],

      remember:
        'A wave carries energy from one place to another.'
    }
  },

  mathematics: {

    Algebra: {
      title: 'Algebra',

      concepts: [
        'Variables represent unknown values.',
        'Equations can be solved by performing the same operation on both sides.',
        'Simplifying expressions makes problems easier to solve.'
      ],

      remember:
        'Whatever you do to one side of an equation, do to the other.'
    },

    Geometry: {
      title: 'Geometry',

      concepts: [
        'Geometry studies shapes, sizes, and relationships.',
        'Angles are measured in degrees.',
        'Area measures the surface inside a shape.'
      ],

      remember:
        'Area is inside. Perimeter is around.'
    },

    Calculus: {
      title: 'Calculus',

      concepts: [
        'Calculus studies change and accumulation.',
        'Differentiation measures rates of change.',
        'Integration can represent accumulation.'
      ],

      remember:
        'Derivative = rate of change. Integral = accumulation.'
    }
  },

  english: {

    Grammar: {
      title: 'Grammar',

      concepts: [
        'Grammar describes how words work together.',
        'Nouns name people, places, things, or ideas.',
        'Verbs express actions or states.'
      ],

      remember:
        'Good grammar makes your meaning easier to understand.'
    },

    Literature: {
      title: 'Literature',

      concepts: [
        'Literature includes works such as poems, stories, and plays.',
        'Themes communicate deeper ideas.',
        'Characters help develop the meaning of a story.'
      ],

      remember:
        'Look beyond what happens—ask why it matters.'
    },

    Writing: {
      title: 'Writing',

      concepts: [
        'Strong writing has a clear purpose.',
        'Paragraphs should develop one main idea.',
        'Examples make arguments stronger.'
      ],

      remember:
        'Clear ideas + strong structure = stronger writing.'
    }
  },

  history: {

    'Ancient Civilizations': {
      title: 'Ancient Civilizations',

      concepts: [
        'Ancient societies developed complex political and economic systems.',
        'Writing helped preserve knowledge.',
        'Trade connected different communities.'
      ],

      remember:
        'History becomes clearer when you connect people, places, causes, and consequences.'
    },

    'Modern History': {
      title: 'Modern History',

      concepts: [
        'Modern history includes major political and social changes.',
        'Wars can transform nations and economies.',
        'Historical events often have multiple causes.'
      ],

      remember:
        'Always ask: What caused it, and what changed afterward?'
    }
  },

  geography: {

    'Physical Geography': {
      title: 'Physical Geography',

      concepts: [
        'Physical geography studies natural features and processes.',
        'Mountains, rivers, climate, and soils shape environments.',
        'Natural processes can change landscapes over time.'
      ],

      remember:
        'Physical geography focuses on the natural world.'
    },

    'Human Geography': {
      title: 'Human Geography',

      concepts: [
        'Human geography studies people and their relationship with places.',
        'Population distribution is not uniform.',
        'Cities develop because of economic and social factors.'
      ],

      remember:
        'Human geography focuses on people, places, and relationships.'
    }
  },

  economics: {

    Microeconomics: {
      title: 'Microeconomics',

      concepts: [
        'Microeconomics studies individuals, households, and firms.',
        'Supply and demand influence prices.',
        'Consumers and producers make economic choices.'
      ],

      remember:
        'Micro = smaller economic decisions.'
    },

    Macroeconomics: {
      title: 'Macroeconomics',

      concepts: [
        'Macroeconomics studies the economy as a whole.',
        'GDP measures the value of final goods and services produced.',
        'Inflation means a general rise in prices.'
      ],

      remember:
        'Macro = the big picture of the economy.'
    }
  }
};

// ============================================================
// QUESTION BANK
// ============================================================

const questionBank = [

  // ---------------- BIOLOGY ----------------

  {
    id: 'bio_001',
    subject: 'biology',
    unit: 'Cell',

    question:
      'What is the powerhouse of the cell?',

    options: [
      'Nucleus',
      'Mitochondria',
      'Ribosome',
      'Golgi apparatus'
    ],

    correct: 1,

    explanation:
      'Mitochondria produce much of the usable energy needed by the cell.'
  },

  {
    id: 'bio_002',
    subject: 'biology',
    unit: 'Cell',

    question:
      'Which organelle contains most of a cell\'s genetic material?',

    options: [
      'Ribosome',
      'Nucleus',
      'Golgi apparatus',
      'Cell wall'
    ],

    correct: 1,

    explanation:
      'The nucleus contains the cell\'s DNA in eukaryotic cells.'
  },

  {
    id: 'bio_003',
    subject: 'biology',
    unit: 'Genetics',

    question:
      'What molecule stores genetic information?',

    options: [
      'DNA',
      'ATP',
      'Glucose',
      'Water'
    ],

    correct: 0,

    explanation:
      'DNA stores the genetic information used by living organisms.'
  },

  // ---------------- CHEMISTRY ----------------

  {
    id: 'chem_001',
    subject: 'chemistry',
    unit: 'Atomic Structure',

    question:
      'What is the chemical formula for water?',

    options: [
      'H₂O',
      'CO₂',
      'NaCl',
      'HCl'
    ],

    correct: 0,

    explanation:
      'A water molecule contains two hydrogen atoms and one oxygen atom.'
  },

  {
    id: 'chem_002',
    subject: 'chemistry',
    unit: 'Atomic Structure',

    question:
      'What is the atomic number of carbon?',

    options: [
      '4',
      '6',
      '8',
      '12'
    ],

    correct: 1,

    explanation:
      'Carbon has six protons, so its atomic number is 6.'
  },

  {
    id: 'chem_003',
    subject: 'chemistry',
    unit: 'Chemical Bonding',

    question:
      'What happens in a covalent bond?',

    options: [
      'Electrons are shared',
      'Protons are shared',
      'Neutrons disappear',
      'Atoms lose their nuclei'
    ],

    correct: 0,

    explanation:
      'Covalent bonds form when atoms share electrons.'
  },

  // ---------------- PHYSICS ----------------

  {
    id: 'phys_001',
    subject: 'physics',
    unit: 'Motion',

    question:
      'What is the formula for speed?',

    options: [
      'Distance ÷ Time',
      'Force ÷ Mass',
      'Work ÷ Time',
      'Mass ÷ Volume'
    ],

    correct: 0,

    explanation:
      'Speed is calculated by dividing distance by time.'
  },

  {
    id: 'phys_002',
    subject: 'physics',
    unit: 'Motion',

    question:
      'What is the SI unit of force?',

    options: [
      'Joule',
      'Watt',
      'Newton',
      'Pascal'
    ],

    correct: 2,

    explanation:
      'Force is measured in Newtons (N).'
  },

  {
    id: 'phys_003',
    subject: 'physics',
    unit: 'Energy',

    question:
      'Which type of energy is associated with motion?',

    options: [
      'Kinetic energy',
      'Chemical energy',
      'Nuclear energy',
      'Potential energy only'
    ],

    correct: 0,

    explanation:
      'Kinetic energy is the energy associated with motion.'
  },

  // ---------------- MATHEMATICS ----------------

  {
    id: 'math_001',
    subject: 'mathematics',
    unit: 'Algebra',

    question:
      'What is the approximate value of π?',

    options: [
      '3.14',
      '2.71',
      '1.62',
      '0.5'
    ],

    correct: 0,

    explanation:
      'π is approximately 3.14159.'
  },

  {
    id: 'math_002',
    subject: 'mathematics',
    unit: 'Algebra',

    question:
      'If 5x + 3 = 13, what is x?',

    options: [
      '1',
      '2',
      '3',
      '4'
    ],

    correct: 1,

    explanation:
      'Subtract 3 from both sides: 5x = 10. Then divide by 5: x = 2.'
  },

  {
    id: 'math_003',
    subject: 'mathematics',
    unit: 'Geometry',

    question:
      'How many degrees are in a straight angle?',

    options: [
      '90°',
      '180°',
      '270°',
      '360°'
    ],

    correct: 1,

    explanation:
      'A straight angle measures 180 degrees.'
  },

  // ---------------- ENGLISH ----------------

  {
    id: 'eng_001',
    subject: 'english',
    unit: 'Grammar',

    question:
      'What is a noun?',

    options: [
      'An action',
      'A person, place, thing, or idea',
      'A describing word',
      'A connector'
    ],

    correct: 1,

    explanation:
      'A noun names a person, place, thing, or idea.'
  },

  {
    id: 'eng_002',
    subject: 'english',
    unit: 'Grammar',

    question:
      'What is the past tense of "run"?',

    options: [
      'Run',
      'Ranned',
      'Ran',
      'Running'
    ],

    correct: 2,

    explanation:
      'The past tense of "run" is "ran".'
  },

  {
    id: 'eng_003',
    subject: 'english',
    unit: 'Writing',

    question:
      'What should a strong paragraph normally develop?',

    options: [
      'Many unrelated ideas',
      'One main idea',
      'Only questions',
      'Only quotations'
    ],

    correct: 1,

    explanation:
      'A strong paragraph usually develops one clear main idea.'
  },

  // ---------------- HISTORY ----------------

  {
    id: 'hist_001',
    subject: 'history',
    unit: 'Modern History',

    question:
      'When did Ethiopia defeat Italy at Adwa?',

    options: [
      '1896',
      '1935',
      '1941',
      '1889'
    ],

    correct: 0,

    explanation:
      'The Battle of Adwa took place in 1896.'
  },

  {
    id: 'hist_002',
    subject: 'history',
    unit: 'Modern History',

    question:
      'Which Ethiopian emperor is associated with the Battle of Adwa?',

    options: [
      'Menelik II',
      'Tewodros II',
      'Yohannes IV',
      'Haile Selassie I'
    ],

    correct: 0,

    explanation:
      'Emperor Menelik II led Ethiopia during the victory at Adwa.'
  },

  // ---------------- GEOGRAPHY ----------------

  {
    id: 'geo_001',
    subject: 'geography',
    unit: 'Human Geography',

    question:
      'What is the capital of Ethiopia?',

    options: [
      'Adama',
      'Bahir Dar',
      'Addis Ababa',
      'Harar'
    ],

    correct: 2,

    explanation:
      'Addis Ababa is the capital city of Ethiopia.'
  },

  {
    id: 'geo_002',
    subject: 'geography',
    unit: 'Physical Geography',

    question:
      'Which major river system has its source in Ethiopia?',

    options: [
      'Blue Nile',
      'Congo',
      'Niger',
      'Orange'
    ],

    correct: 0,

    explanation:
      'The Blue Nile rises at Lake Tana in Ethiopia.'
  },

  // ---------------- ECONOMICS ----------------

  {
    id: 'econ_001',
    subject: 'economics',
    unit: 'Macroeconomics',

    question:
      'What is inflation?',

    options: [
      'A general rise in prices',
      'A general fall in prices',
      'An increase in wages only',
      'A decrease in taxes'
    ],

    correct: 0,

    explanation:
      'Inflation is a sustained increase in the general price level.'
  },

  {
    id: 'econ_002',
    subject: 'economics',
    unit: 'Macroeconomics',

    question:
      'What does GDP stand for?',

    options: [
      'Gross Domestic Product',
      'Global Development Plan',
      'Government Debt Policy',
      'General Demand Price'
    ],

    correct: 0,

    explanation:
      'GDP stands for Gross Domestic Product.'
  }
];
// ============================================================
// PART 2 OF 3
// USER STATE + NAVIGATION + LEARN + PRACTICE ENGINE
// ============================================================

// ============================================================
// USER STATE
// ============================================================

const users = new Map();

function createUser(userId, firstName = 'Student') {
  return {
    id: userId,
    name: firstName || 'Student',

    xp: 0,
    streak: 0,

    lessonsCompleted: [],
    questionsAnswered: 0,
    correctAnswers: 0,

    mistakes: [],

    currentMode: 'home',
    currentSubject: null,
    currentUnit: null,

    practiceQuestions: [],
    currentQuestionIndex: 0,

    dailyDate: null,
    dailyAnswered: false,

    subjectPerformance: {}
  };
}

function getUser(ctx) {
  const id = ctx.from?.id;

  if (!id) {
    throw new Error('Telegram user ID unavailable.');
  }

  if (!users.has(id)) {
    users.set(
      id,
      createUser(
        id,
        ctx.from.first_name || 'Student'
      )
    );
  }

  return users.get(id);
}

// ============================================================
// GENERAL HELPERS
// ============================================================

function shuffle(array) {
  return [...array].sort(
    () => Math.random() - 0.5
  );
}

function getAccuracy(user) {
  if (!user.questionsAnswered) {
    return 0;
  }

  return Math.round(
    (user.correctAnswers /
      user.questionsAnswered) * 100
  );
}

function getSubjectQuestions(subjectKey) {
  return questionBank.filter(
    question =>
      question.subject === subjectKey
  );
}

function getQuestionsForSubject(
  subjectKey,
  count = 5
) {
  return shuffle(
    getSubjectQuestions(subjectKey)
  ).slice(0, count);
}

function getMixedQuestions(count = 5) {
  return shuffle(questionBank).slice(
    0,
    count
  );
}

function getSmartReviewQuestions(
  user,
  count = 5
) {
  if (!user.mistakes.length) {
    return getMixedQuestions(3);
  }

  return shuffle(
    user.mistakes
  ).slice(0, count);
}

function getQuestion(user) {
  return user.practiceQuestions[
    user.currentQuestionIndex
  ];
}

function getStrongestSubject(user) {
  const entries = Object.entries(
    user.subjectPerformance
  );

  if (!entries.length) {
    return null;
  }

  return entries.sort(
    (a, b) =>
      b[1].accuracy - a[1].accuracy
  )[0];
}

function getWeakestSubject(user) {
  const entries = Object.entries(
    user.subjectPerformance
  );

  if (!entries.length) {
    return null;
  }

  return entries.sort(
    (a, b) =>
      a[1].accuracy - b[1].accuracy
  )[0];
}

function recordAnswer(
  user,
  question,
  selected
) {
  user.questionsAnswered++;

  if (!user.subjectPerformance[
    question.subject
  ]) {
    user.subjectPerformance[
      question.subject
    ] = {
      correct: 0,
      answered: 0,
      accuracy: 0
    };
  }

  const performance =
    user.subjectPerformance[
      question.subject
    ];

  performance.answered++;

  const correct =
    selected === question.correct;

  if (correct) {
    user.correctAnswers++;
    performance.correct++;
    user.xp += 10;
  } else {
    const alreadySaved =
      user.mistakes.some(
        item => item.id === question.id
      );

    if (!alreadySaved) {
      user.mistakes.push(question);
    }
  }

  performance.accuracy =
    Math.round(
      (performance.correct /
        performance.answered) * 100
    );

  return correct;
}

// ============================================================
// CALLBACK HELPER
// ============================================================

async function answerCallback(ctx) {
  try {
    await ctx.answerCbQuery();
  } catch (_) {
    // Ignore expired callback queries.
  }
}

// ============================================================
// EDIT-IN-PLACE NAVIGATION
// ============================================================

async function editScreen(
  ctx,
  text,
  keyboard
) {
  try {
    await ctx.editMessageText(
      text,
      keyboard
    );
  } catch (error) {
    const description =
      error?.response?.description || '';

    // Ignore Telegram's "message is not modified"
    // error because the screen is already correct.
    if (
      !description.includes(
        'message is not modified'
      )
    ) {
      throw error;
    }
  }
}

async function showScreen(
  ctx,
  text,
  keyboard
) {
  if (ctx.callbackQuery) {
    return editScreen(
      ctx,
      text,
      keyboard
    );
  }

  return ctx.reply(
    text,
    keyboard
  );
}

// ============================================================
// HOME
// ============================================================

function homeKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '📚 Learn',
        'learn_main'
      ),
      Markup.button.callback(
        '✍️ Practice',
        'practice_main'
      )
    ],

    [
      Markup.button.callback(
        '🎯 Daily Challenge',
        'daily_main'
      )
    ],

    [
      Markup.button.callback(
        '📊 My Progress',
        'progress_main'
      ),
      Markup.button.callback(
        '🧠 Exam Tips',
        'tips_main'
      )
    ],

    [
      Markup.button.callback(
        '💬 Study Buddy',
        'buddy_main'
      ),
      Markup.button.callback(
        '📞 Support',
        'support_main'
      )
    ]
  ]);
}

function getHomeText(user) {
  return `🌟 FINEBOT

Grade 12 Mastering Companion

👋 Welcome, ${user.name}!

🔥 ${user.streak} day streak
⭐ ${user.xp} XP
🎯 Accuracy: ${getAccuracy(user)}%

━━━━━━━━━━━━━━━━━━

What do you want to do?`;
}

async function showHome(ctx) {
  const user = getUser(ctx);

  user.currentMode = 'home';
  user.currentSubject = null;
  user.currentUnit = null;

  await showScreen(
    ctx,
    getHomeText(user),
    homeKeyboard()
  );
}

// ============================================================
// SUBJECT KEYBOARD
// ============================================================

function subjectKeyboard(prefix) {
  const buttons = Object.entries(
    subjects
  ).map(([key, subject]) => [
    Markup.button.callback(
      subject.label,
      `${prefix}_${key}`
    )
  ]);

  buttons.push([
    Markup.button.callback(
      '🏠 Home',
      'home'
    )
  ]);

  return Markup.inlineKeyboard(
    buttons
  );
}

// ============================================================
// LEARN KEYBOARDS
// ============================================================

function learnUnitKeyboard(
  subjectKey
) {
  const subject =
    subjects[subjectKey];

  if (!subject) {
    return homeKeyboard();
  }

  const buttons =
    subject.units.map(unit => [
      Markup.button.callback(
        `📖 ${unit}`,
        `learn_unit_${subjectKey}_${encodeURIComponent(unit)}`
      )
    ]);

  buttons.push([
    Markup.button.callback(
      '⬅️ Subjects',
      'learn_main'
    )
  ]);

  return Markup.inlineKeyboard(
    buttons
  );
}

// ============================================================
// HOME ACTION
// ============================================================

bot.action('home', async ctx => {
  await answerCallback(ctx);
  await showHome(ctx);
});

// ============================================================
// LEARN
// ============================================================

bot.action('learn_main', async ctx => {
  await answerCallback(ctx);

  const user = getUser(ctx);

  user.currentMode = 'learning';

  await editScreen(
    ctx,
    `📚 LEARN

Choose a subject:

Pick a subject to explore its topics.`,
    subjectKeyboard('learn_subject')
  );
});

bot.action(
  /^learn_subject_(.+)$/,
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);
    const subjectKey =
      ctx.match[1];

    if (!subjects[subjectKey]) {
      return editScreen(
        ctx,
        '⚠️ Subject not found.',
        homeKeyboard()
      );
    }

    user.currentMode = 'learning';
    user.currentSubject =
      subjectKey;

    await editScreen(
      ctx,
      `${subjects[subjectKey].label}

📚 CHOOSE A TOPIC

Select a topic to start learning.`,
      learnUnitKeyboard(
        subjectKey
      )
    );
  }
);

// ============================================================
// LESSON VIEW
// ============================================================

bot.action(
  /^learn_unit_(.+)_(.+)$/,
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const subjectKey =
      ctx.match[1];

    const unitName =
      decodeURIComponent(
        ctx.match[2]
      );

    if (!subjects[subjectKey]) {
      return editScreen(
        ctx,
        '⚠️ Subject not found.',
        homeKeyboard()
      );
    }

    const lesson =
      lessons[subjectKey]?.[
        unitName
      ];

    if (!lesson) {
      return editScreen(
        ctx,
        '📚 This lesson is being prepared.',
        learnUnitKeyboard(
          subjectKey
        )
      );
    }

    user.currentMode = 'lesson';
    user.currentSubject =
      subjectKey;
    user.currentUnit =
      unitName;

    const concepts =
      lesson.concepts
        .map(
          item => `• ${item}`
        )
        .join('\n');

    await editScreen(
      ctx,
`${subjects[subjectKey].label}

📖 ${lesson.title}

${concepts}

━━━━━━━━━━━━━━━━━━

💡 REMEMBER

${lesson.remember}

━━━━━━━━━━━━━━━━━━

Ready to test yourself?`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '✍️ Practice This Topic',
            `practice_unit_${subjectKey}_${encodeURIComponent(unitName)}`
          )
        ],

        [
          Markup.button.callback(
            '✅ Complete Lesson',
            `complete_lesson_${subjectKey}_${encodeURIComponent(unitName)}`
          )
        ],

        [
          Markup.button.callback(
            '⬅️ Back',
            `learn_subject_${subjectKey}`
          )
        ]
      ])
    );
  }
);

// ============================================================
// COMPLETE LESSON
// ============================================================

bot.action(
  /^complete_lesson_(.+)_(.+)$/,
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const subjectKey =
      ctx.match[1];

    const unitName =
      decodeURIComponent(
        ctx.match[2]
      );

    const lessonId =
      `${subjectKey}:${unitName}`;

    if (
      !user.lessonsCompleted.includes(
        lessonId
      )
    ) {
      user.lessonsCompleted.push(
        lessonId
      );

      user.xp += 5;
    }

    await editScreen(
      ctx,
`✅ LESSON COMPLETE!

📖 ${unitName}
⭐ +5 XP

Your progress has been saved.

━━━━━━━━━━━━━━━━━━

Keep building your knowledge one topic at a time.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📚 Continue Learning',
            `learn_subject_${subjectKey}`
          )
        ],

        [
          Markup.button.callback(
            '✍️ Practice',
            `practice_subject_${subjectKey}`
          )
        ],

        [
          Markup.button.callback(
            '🏠 Home',
            'home'
          )
        ]
      ])
    );
  }
);

// ============================================================
// PRACTICE KEYBOARD
// ============================================================

function practiceKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '📚 By Subject',
        'practice_subject_selection'
      )
    ],

    [
      Markup.button.callback(
        '🎯 Mixed Practice',
        'practice_mixed'
      )
    ],

    [
      Markup.button.callback(
        '🧠 Smart Review',
        'practice_smart'
      )
    ],

    [
      Markup.button.callback(
        '🏠 Home',
        'home'
      )
    ]
  ]);
}

// ============================================================
// PRACTICE MAIN
// ============================================================

bot.action('practice_main', async ctx => {
  await answerCallback(ctx);

  const user = getUser(ctx);

  user.currentMode = 'practice_menu';

  await editScreen(
    ctx,
`✍️ PRACTICE

How do you want to practice?

📚 By Subject
Practice one subject at a time.

🎯 Mixed Practice
Questions from different subjects.

🧠 Smart Review
Review questions you previously missed.`,
    practiceKeyboard()
  );
});

// ============================================================
// PRACTICE BY SUBJECT
// ============================================================

bot.action(
  'practice_subject_selection',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
      '📚 CHOOSE SUBJECT\n\nWhich subject do you want to practice?',
      subjectKeyboard(
        'practice_subject'
      )
    );
  }
);

// ============================================================
// START SUBJECT PRACTICE
// ============================================================

bot.action(
  /^practice_subject_(.+)$/,
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const subjectKey =
      ctx.match[1];

    if (!subjects[subjectKey]) {
      return editScreen(
        ctx,
        '⚠️ Subject not found.',
        homeKeyboard()
      );
    }

    const questions =
      getQuestionsForSubject(
        subjectKey,
        5
      );

    if (!questions.length) {
      return editScreen(
        ctx,
        '📚 No questions are available for this subject yet.',
        practiceKeyboard()
      );
    }

    user.currentMode =
      'practice';

    user.currentSubject =
      subjectKey;

    user.currentUnit = null;

    user.practiceQuestions =
      questions;

    user.currentQuestionIndex =
      0;

    await sendQuestion(ctx);
  }
);

// ============================================================
// MIXED PRACTICE
// ============================================================

bot.action(
  'practice_mixed',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    user.currentMode =
      'practice';

    user.currentSubject = null;
    user.currentUnit = null;

    user.practiceQuestions =
      getMixedQuestions(5);

    user.currentQuestionIndex =
      0;

    await sendQuestion(ctx);
  }
);

// ============================================================
// SMART REVIEW
// ============================================================

bot.action(
  'practice_smart',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    user.currentMode =
      'smart_review';

    user.practiceQuestions =
      getSmartReviewQuestions(
        user,
        5
      );

    user.currentQuestionIndex =
      0;

    await sendQuestion(ctx);
  }
);

// ============================================================
// TOPIC PRACTICE
// ============================================================

bot.action(
  /^practice_unit_(.+)_(.+)$/,
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const subjectKey =
      ctx.match[1];

    const unitName =
      decodeURIComponent(
        ctx.match[2]
      );

    const questions =
      questionBank.filter(
        question =>
          question.subject ===
            subjectKey &&
          question.unit ===
            unitName
      );

    if (!questions.length) {
      return editScreen(
        ctx,
        '✍️ There are no practice questions for this topic yet.',
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '⬅️ Back to Lesson',
              `learn_unit_${subjectKey}_${encodeURIComponent(unitName)}`
            )
          ],
          [
            Markup.button.callback(
              '🏠 Home',
              'home'
            )
          ]
        ])
      );
    }

    user.currentMode =
      'practice';

    user.currentSubject =
      subjectKey;

    user.currentUnit =
      unitName;

    user.practiceQuestions =
      shuffle(questions);

    user.currentQuestionIndex =
      0;

    await sendQuestion(ctx);
  }
);
// ============================================================
// PART 3 OF 3
// PRACTICE + DAILY CHALLENGE + PROGRESS + SUPPORT + VERCEL
// ============================================================

// ============================================================
// QUESTION ENGINE
// ============================================================

async function sendQuestion(ctx) {
  const user = getUser(ctx);
  const question = getQuestion(user);

  if (!question) {
    return finishPractice(ctx);
  }

  const subject =
    subjects[question.subject];

  const number =
    user.currentQuestionIndex + 1;

  const total =
    user.practiceQuestions.length;

  const buttons =
    question.options.map(
      (option, index) =>
        Markup.button.callback(
          option,
          `answer_${index}`
        )
    );

  const keyboard = [];

  for (
    let i = 0;
    i < buttons.length;
    i += 2
  ) {
    keyboard.push(
      buttons.slice(i, i + 2)
    );
  }

  keyboard.push([
    Markup.button.callback(
      '🚪 Exit',
      'practice_main'
    )
  ]);

  await editScreen(
    ctx,
`${subject?.label || '📚 Practice'}

━━━━━━━━━━━━━━━━━━

❓ Question ${number} / ${total}

${question.question}

━━━━━━━━━━━━━━━━━━

Choose your answer:`,
    Markup.inlineKeyboard(
      keyboard
    )
  );
}

// ============================================================
// ANSWER HANDLER
// ============================================================

bot.action(
  /^answer_([0-3])$/,
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const selected =
      Number(ctx.match[1]);

    const question =
      getQuestion(user);

    if (!question) {
      return editScreen(
        ctx,
        '⚠️ This question is no longer active.',
        homeKeyboard()
      );
    }

    if (
      user.currentMode === 'daily'
    ) {
      return handleDailyAnswer(
        ctx,
        user,
        question,
        selected
      );
    }

    return handlePracticeAnswer(
      ctx,
      user,
      question,
      selected
    );
  }
);

// ============================================================
// PRACTICE ANSWER
// ============================================================

async function handlePracticeAnswer(
  ctx,
  user,
  question,
  selected
) {
  const correct =
    recordAnswer(
      user,
      question,
      selected
    );

  user.currentQuestionIndex++;

  if (correct) {
    await editScreen(
      ctx,
`✅ CORRECT!

${question.explanation}

━━━━━━━━━━━━━━━━━━

⭐ +10 XP

Keep going!`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '➡️ Next Question',
            'next_question'
          )
        ]
      ])
    );
  } else {
    await editScreen(
      ctx,
`❌ NOT QUITE

Correct answer:

${question.options[question.correct]}

💡 WHY?

${question.explanation}

━━━━━━━━━━━━━━━━━━

🧠 Saved for Smart Review`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '➡️ Next Question',
            'next_question'
          )
        ]
      ])
    );
  }
}

bot.action(
  'next_question',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    await sendQuestion(ctx);
  }
);

// ============================================================
// FINISH PRACTICE
// ============================================================

async function finishPractice(ctx) {
  const user = getUser(ctx);

  const accuracy =
    getAccuracy(user);

  user.currentMode = 'home';
  user.practiceQuestions = [];
  user.currentQuestionIndex = 0;

  await editScreen(
    ctx,
`🎉 PRACTICE COMPLETE!

Great work, ${user.name}!

━━━━━━━━━━━━━━━━━━

⭐ XP
${user.xp}

🎯 Accuracy
${accuracy}%

📝 Questions answered
${user.questionsAnswered}

🧠 Saved mistakes
${user.mistakes.length}

Keep going—the next question
makes you stronger.`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          '🔄 Practice Again',
          'practice_main'
        )
      ],

      [
        Markup.button.callback(
          '🧠 Smart Review',
          'practice_smart'
        )
      ],

      [
        Markup.button.callback(
          '📊 My Progress',
          'progress_main'
        )
      ],

      [
        Markup.button.callback(
          '🏠 Home',
          'home'
        )
      ]
    ])
  );
}

// ============================================================
// DAILY CHALLENGE
// ============================================================

function getTodayKey() {
  const now = new Date();

  return [
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate()
  ].join('-');
}

function getDailyQuestion() {
  const key =
    getTodayKey();

  let hash = 0;

  for (
    let i = 0;
    i < key.length;
    i++
  ) {
    hash =
      (
        hash * 31 +
        key.charCodeAt(i)
      ) >>> 0;
  }

  return questionBank[
    hash % questionBank.length
  ];
}

bot.action(
  'daily_main',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);
    const today =
      getTodayKey();

    if (
      user.dailyAnswered &&
      user.dailyDate === today
    ) {
      return editScreen(
        ctx,
`🎯 DAILY CHALLENGE

✅ You've already completed
today's challenge!

🔥 Streak
${user.streak} days

Come back tomorrow for
a new challenge.`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🏠 Home',
              'home'
            )
          ]
        ])
      );
    }

    user.dailyDate = today;
    user.currentMode = 'daily';

    await editScreen(
      ctx,
`🎯 DAILY CHALLENGE

One question.
One chance.

━━━━━━━━━━━━━━━━━━

🔥 Current streak
${user.streak} days

⭐ Reward
+20 XP

Ready?`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '🚀 Start Challenge',
            'daily_start'
          )
        ],

        [
          Markup.button.callback(
            '⬅️ Home',
            'home'
          )
        ]
      ])
    );
  }
);

bot.action(
  'daily_start',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    user.currentMode =
      'daily';

    const question =
      getDailyQuestion();

    user.practiceQuestions = [
      question
    ];

    user.currentQuestionIndex =
      0;

    await sendQuestion(ctx);
  }
);

// ============================================================
// DAILY ANSWER
// ============================================================

async function handleDailyAnswer(
  ctx,
  user,
  question,
  selected
) {
  const today =
    getTodayKey();

  const correct =
    selected ===
    question.correct;

  if (correct) {
    user.xp += 20;
    user.dailyAnswered = true;
    user.dailyDate = today;

    user.questionsAnswered++;
    user.correctAnswers++;

    user.streak++;

    await editScreen(
      ctx,
`🎉 DAILY CHALLENGE COMPLETE!

✅ Correct!

${question.explanation}

━━━━━━━━━━━━━━━━━━

⭐ +20 XP

🔥 Streak
${user.streak} days

Excellent work!

Come back tomorrow for
another challenge.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📊 My Progress',
            'progress_main'
          )
        ],

        [
          Markup.button.callback(
            '🏠 Home',
            'home'
          )
        ]
      ])
    );
  } else {
    user.xp += 5;
    user.questionsAnswered++;

    await editScreen(
      ctx,
`❌ NOT QUITE

Correct answer:

${question.options[question.correct]}

💡 ${question.explanation}

━━━━━━━━━━━━━━━━━━

⭐ +5 XP for trying.

You can try again.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '🔄 Try Again',
            'daily_start'
          )
        ],

        [
          Markup.button.callback(
            '🏠 Home',
            'home'
          )
        ]
      ])
    );
  }

  user.currentMode =
    'home';
}

// ============================================================
// PROGRESS
// ============================================================

bot.action(
  'progress_main',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const accuracy =
      getAccuracy(user);

    const strongest =
      getStrongestSubject(user);

    const weakest =
      getWeakestSubject(user);

    const strongestText =
      strongest
        ? `${subjects[strongest[0]].label} — ${strongest[1].accuracy}%`
        : 'Not enough data yet';

    const weakestText =
      weakest
        ? `${subjects[weakest[0]].label} — ${weakest[1].accuracy}%`
        : 'Not enough data yet';

    const recommendation =
      weakest
        ? `Practice ${subjects[weakest[0]].label}`
        : 'Start a practice session';

    await editScreen(
      ctx,
`📊 MY PROGRESS

👤 ${user.name}

━━━━━━━━━━━━━━━━━━

⭐ XP
${user.xp}

🔥 Study Streak
${user.streak} days

🎯 Overall Accuracy
${accuracy}%

📚 Lessons Completed
${user.lessonsCompleted.length}

✍️ Questions Answered
${user.questionsAnswered}

🧠 Saved Mistakes
${user.mistakes.length}

━━━━━━━━━━━━━━━━━━

📈 STRONGEST
${strongestText}

⚠️ NEEDS ATTENTION
${weakestText}

🎯 RECOMMENDED NEXT
${recommendation}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📚 Learn',
            'learn_main'
          ),

          Markup.button.callback(
            '✍️ Practice',
            'practice_main'
          )
        ],

        [
          Markup.button.callback(
            '🧠 Smart Review',
            'practice_smart'
          )
        ],

        [
          Markup.button.callback(
            '🏠 Home',
            'home'
          )
        ]
      ])
    );
  }
);

// ============================================================
// EXAM TIPS
// ============================================================

function tipsKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '📅 Revision Strategy',
        'tip_revision'
      )
    ],

    [
      Markup.button.callback(
        '⏱️ Time Management',
        'tip_time'
      )
    ],

    [
      Markup.button.callback(
        '📝 Exam Techniques',
        'tip_techniques'
      )
    ],

    [
      Markup.button.callback(
        '🔥 Final Week',
        'tip_final'
      )
    ],

    [
      Markup.button.callback(
        '😰 Exam Stress',
        'tip_stress'
      )
    ],

    [
      Markup.button.callback(
        '⬅️ Home',
        'home'
      )
    ]
  ]);
}

bot.action(
  'tips_main',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`🧠 EXAM TIPS

Choose what you need help with.

Small improvements in your
exam strategy can make a big
difference.`,
      tipsKeyboard()
    );
  }
);

const examTips = {

  tip_revision: {
    title:
      '📅 REVISION STRATEGY',

    text:
`Break your study into
small sessions.

1️⃣ Review one topic
2️⃣ Practice questions
3️⃣ Review mistakes
4️⃣ Move forward

🎯 Goal:
Consistency—not cramming.`
  },

  tip_time: {
    title:
      '⏱️ TIME MANAGEMENT',

    text:
`Don't spend too long fighting
one question.

1️⃣ Answer easy questions first
2️⃣ Mark difficult questions
3️⃣ Return later
4️⃣ Leave time for checking

🎯 Goal:
Maximize your total score.`
  },

  tip_techniques: {
    title:
      '📝 EXAM TECHNIQUES',

    text:
`1️⃣ Read carefully
2️⃣ Start with what you know
3️⃣ Show your working
4️⃣ Check units and calculations
5️⃣ Review before submitting`
  },

  tip_final: {
    title:
      '🔥 FINAL WEEK',

    text:
`1️⃣ Practice past questions
2️⃣ Review weak areas
3️⃣ Avoid last-minute cramming
4️⃣ Sleep properly
5️⃣ Stay calm

You've done the work.
Trust your preparation.`
  },

  tip_stress: {
    title:
      '😰 EXAM STRESS',

    text:
`Feeling stressed before an
exam is normal.

Try:

1️⃣ Slow, deep breaths
2️⃣ Break work into small tasks
3️⃣ Take short breaks
4️⃣ Talk to someone you trust

You don't have to solve
everything at once.`
  }
};

for (
  const [
    action,
    tip
  ] of Object.entries(examTips)
) {
  bot.action(
    action,
    async ctx => {
      await answerCallback(ctx);

      await editScreen(
        ctx,
`${tip.title}

━━━━━━━━━━━━━━━━━━

${tip.text}`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🔙 More Tips',
              'tips_main'
            )
          ],

          [
            Markup.button.callback(
              '🏠 Home',
              'home'
            )
          ]
        ])
      );
    }
  );
}

// ============================================================
// STUDY BUDDY
// ============================================================

function buddyKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '😰 I\'m stressed',
        'buddy_stressed'
      )
    ],

    [
      Markup.button.callback(
        '😕 I\'m confused',
        'buddy_confused'
      )
    ],

    [
      Markup.button.callback(
        '📅 Help me make a study plan',
        'buddy_plan'
      )
    ],

    [
      Markup.button.callback(
        '🔥 I need motivation',
        'buddy_motivation'
      )
    ],

    [
      Markup.button.callback(
        '📚 What should I study next?',
        'buddy_next'
      )
    ],

    [
      Markup.button.callback(
        '⬅️ Home',
        'home'
      )
    ]
  ]);
}

bot.action(
  'buddy_main',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`💬 STUDY BUDDY

What do you need right now?

No judgment.
Just the next step.`,
      buddyKeyboard()
    );
  }
);

bot.action(
  'buddy_stressed',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`😰 I'M STRESSED

That's okay.

You don't need to finish
everything today.

Make it smaller:

⏱️ 20 minutes
📖 One topic
✍️ 5 questions
☕ Short break

Small progress is still progress.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📚 Start Learning',
            'learn_main'
          )
        ],

        [
          Markup.button.callback(
            '✍️ Start Practice',
            'practice_main'
          )
        ],

        [
          Markup.button.callback(
            '⬅️ Study Buddy',
            'buddy_main'
          )
        ]
      ])
    );
  }
);

bot.action(
  'buddy_confused',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`😕 I'M CONFUSED

Confusion is part of learning.

Try this:

1️⃣ Go back to the basic concept
2️⃣ Read the explanation again
3️⃣ Try an easier question
4️⃣ Review your mistake

You don't need to understand
everything immediately.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📚 Try Learning',
            'learn_main'
          )
        ],

        [
          Markup.button.callback(
            '🧠 Smart Review',
            'practice_smart'
          )
        ],

        [
          Markup.button.callback(
            '⬅️ Study Buddy',
            'buddy_main'
          )
        ]
      ])
    );
  }
);

bot.action(
  'buddy_plan',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`📅 SIMPLE STUDY PLAN

TODAY
📖 Review one weak topic
✍️ Answer 5 questions
🧠 Review mistakes

TOMORROW
📖 Learn another topic
✍️ Practice again

LATER
📝 Try a larger practice session

Don't try to conquer
everything in one day.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '🚀 Start Learning',
            'learn_main'
          )
        ],

        [
          Markup.button.callback(
            '✍️ Start Practicing',
            'practice_main'
          )
        ],

        [
          Markup.button.callback(
            '⬅️ Study Buddy',
            'buddy_main'
          )
        ]
      ])
    );
  }
);

bot.action(
  'buddy_motivation',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`🔥 I NEED MOTIVATION

You already did something
important:

You started.

Every lesson you finish,
every question you answer,
and every mistake you understand
moves you forward.

You don't need a perfect day.

You just need the next step.

💪 Keep going.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📚 Take the Next Step',
            'learn_main'
          )
        ],

        [
          Markup.button.callback(
            '✍️ Practice',
            'practice_main'
          )
        ],

        [
          Markup.button.callback(
            '⬅️ Study Buddy',
            'buddy_main'
          )
        ]
      ])
    );
  }
);

bot.action(
  'buddy_next',
  async ctx => {
    await answerCallback(ctx);

    const user = getUser(ctx);

    const weakest =
      getWeakestSubject(user);

    if (weakest) {
      const subjectKey =
        weakest[0];

      return editScreen(
        ctx,
`📚 YOUR NEXT STEP

Based on your practice:

⚠️ ${subjects[subjectKey].label}

Current accuracy:
${weakest[1].accuracy}%

I'd recommend practicing
this subject next.

Small improvement here can
make a big difference.`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '✍️ Practice This Subject',
              `practice_subject_${subjectKey}`
            )
          ],

          [
            Markup.button.callback(
              '📚 Learn It',
              `learn_subject_${subjectKey}`
            )
          ],

          [
            Markup.button.callback(
              '🏠 Home',
              'home'
            )
          ]
        ])
      );
    }

    await editScreen(
      ctx,
`📚 YOUR NEXT STEP

You haven't built enough
practice data yet.

Start with one subject and
answer a few questions.

FineBot will learn your
strengths and weaknesses
as you practice.`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '✍️ Start Practice',
            'practice_main'
          )
        ],

        [
          Markup.button.callback(
            '🏠 Home',
            'home'
          )
        ]
      ])
    );
  }
);

// ============================================================
// SUPPORT
// ============================================================

function supportKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '❓ How FineBot works',
        'support_how'
      )
    ],

    [
      Markup.button.callback(
        '💳 Payment help',
        'support_payment'
      )
    ],

    [
      Markup.button.callback(
        '🔓 Access problem',
        'support_access'
      )
    ],

    [
      Markup.button.callback(
        '🐛 Report a problem',
        'support_report'
      )
    ],

    [
      Markup.button.callback(
        '💡 Send feedback',
        'support_feedback'
      )
    ],

    [
      Markup.button.callback(
        '🛠️ Technical support',
        'support_tech'
      )
    ],

    [
      Markup.button.callback(
        '⬅️ Home',
        'home'
      )
    ]
  ]);
}

bot.action(
  'support_main',
  async ctx => {
    await answerCallback(ctx);

    await editScreen(
      ctx,
`📞 SUPPORT

How can we help?

Choose an option below.`,
      supportKeyboard()
    );
  }
);

const supportPages = {

  support_how:
`❓ HOW FINEBOT WORKS

FineBot helps you:

📚 Learn curriculum topics
✍️ Practice questions
🎯 Complete daily challenges
📊 Track your progress
🧠 Review mistakes
💬 Get study support

The goal is simple:

Learn → Practice → Improve.`,

  support_payment:
`💳 PAYMENT HELP

Payment integration can be
connected to local payment methods.

If you have a payment problem,
please contact FineBot support.`,

  support_access:
`🔓 ACCESS PROBLEM

If you have already purchased
access but cannot use a feature,
please contact support.

Never send passwords or
private security codes.`,
support_report:
`🐛 REPORT A PROBLEM

Found something incorrect?

Please provide:

• Subject
• Topic
• Question
• What seems wrong

This helps us improve FineBot.`,

  support_feedback:
`💡 SEND FEEDBACK

Your feedback matters.

Tell us what you like,
what feels confusing,
and what you would improve.

Good products are built
by listening.`,

  support_tech:
`🛠️ TECHNICAL SUPPORT

If something isn't working:

1️⃣ Try opening the section again
2️⃣ Press Home
3️⃣ Restart the conversation
4️⃣ Report the problem if it continues

We're working to keep FineBot
simple and reliable.`
};

for (
  const [
    action,
    text
  ] of Object.entries(supportPages)
) {
  bot.action(
    action,
    async ctx => {
      await answerCallback(ctx);

      await editScreen(
        ctx,
        text,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '📞 Support',
              'support_main'
            )
          ],

          [
            Markup.button.callback(
              '🏠 Home',
              'home'
            )
          ]
        ])
      );
    }
  );
}

// ============================================================
// COMMANDS
// ============================================================

bot.start(async ctx => {
  await showHome(ctx);
});

bot.command(
  'home',
  async ctx => {
    await showHome(ctx);
  }
);

bot.command(
  'progress',
  async ctx => {
    const user =
      getUser(ctx);

    await ctx.reply(
      '📊 Open your progress:',
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '📊 My Progress',
            'progress_main'
          )
        ]
      ])
    );
  }
);

// ============================================================
// ERROR HANDLING
// ============================================================

bot.catch(
  (error, ctx) => {
    console.error(
      'FineBot error:',
      error
    );

    try {
      if (ctx.callbackQuery) {
        ctx.answerCbQuery().catch(
          () => {}
        );
      }

      ctx.reply(
        '⚠️ Something went wrong.\n\nPlease press Home and try again.'
      ).catch(
        () => {}
      );

    } catch (_) {
      // Ignore secondary errors.
    }
  }
);

// ============================================================
// VERCEL WEBHOOK
// ============================================================

module.exports =
  async function handler(
    req,
    res
  ) {
    try {

      if (req.method === 'GET') {
        return res.status(200).json({
          ok: true,
          bot: 'FineBot',
          message:
            'FineBot webhook is running.'
        });
      }

      if (req.method !== 'POST') {
        return res.status(405).json({
          ok: false,
          error:
            'Method not allowed.'
        });
      }

      await bot.handleUpdate(
        req.body
      );

      return res.status(200).json({
        ok: true
      });

    } catch (error) {

      console.error(
        'FineBot webhook error:',
        error
      );

      return res.status(500).json({
        ok: false,
        error:
          'Internal server error.'
      });
    }
  };