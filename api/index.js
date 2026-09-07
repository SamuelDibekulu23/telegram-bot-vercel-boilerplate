const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);


// ============================================================
// FINEBOT
// Grade 12 Mastering & Problem-Solving Bot
// ============================================================


// ============================================================
// DEMO ACCESS
// ============================================================

// This is a SIMULATED payment system.
// It does NOT charge real money.

const DEMO_PRICE = 50;


// ============================================================
// SUBJECT DATABASE
// ============================================================

const subjects = {

  natural: [
    {
      id: 'biology',
      name: 'Biology',
      emoji: '🧬'
    },

    {
      id: 'chemistry',
      name: 'Chemistry',
      emoji: '⚗️'
    },

    {
      id: 'physics',
      name: 'Physics',
      emoji: '⚛️'
    },

    {
      id: 'mathematics',
      name: 'Mathematics',
      emoji: '➗'
    }
  ],

  social: [
    {
      id: 'history',
      name: 'History',
      emoji: '📜'
    },

    {
      id: 'geography',
      name: 'Geography',
      emoji: '🌍'
    },

    {
      id: 'economics',
      name: 'Economics',
      emoji: '📈'
    },

    {
      id: 'english',
      name: 'English',
      emoji: '🇬🇧'
    }
  ]

};


// ============================================================
// ALL SUBJECTS
// ============================================================

const allSubjects = [
  ...subjects.natural,
  ...subjects.social
];

const subjectMap = {};

for (const subject of allSubjects) {

  subjectMap[subject.id] = subject;

}


// ============================================================
// QUESTION DATABASE
// ============================================================
//
// IMPORTANT:
//
// Every question has a permanent ID.
//
// The practice system will use:
// subjectId + questionId
//
// It will NOT depend on temporary currentQuestion memory.
// ============================================================

const questions = {

  biology: [

    {
      id: 'bio_001',

      topic: 'Cell Biology',

      question:
        'Which organelle is mainly responsible for producing ATP in a eukaryotic cell?',

      options: [
        'A. Nucleus',
        'B. Mitochondrion',
        'C. Ribosome',
        'D. Golgi apparatus'
      ],

      answer: 'B',

      explanation:
        'The mitochondrion is the main site of aerobic cellular respiration and produces most of the ATP used by the cell.'
    },


    {
      id: 'bio_002',

      topic: 'Genetics',

      question:
        'A heterozygous tall plant (Tt) is crossed with another heterozygous tall plant (Tt). What percentage of the offspring are expected to be tt?',

      options: [
        'A. 0%',
        'B. 25%',
        'C. 50%',
        'D. 75%'
      ],

      answer: 'B',

      explanation:
        'The cross Tt × Tt produces TT, Tt, Tt and tt. Therefore 1 out of 4 offspring is expected to be tt, which is 25%.'
    },


    {
      id: 'bio_003',

      topic: 'Photosynthesis',

      question:
        'Which substance is absorbed from the atmosphere and used during photosynthesis?',

      options: [
        'A. Oxygen',
        'B. Nitrogen',
        'C. Carbon dioxide',
        'D. Hydrogen'
      ],

      answer: 'C',

      explanation:
        'Plants absorb carbon dioxide from the atmosphere and use it with water and light energy to produce glucose during photosynthesis.'
    }

  ],


  chemistry: [

    {
      id: 'chem_001',

      topic: 'Moles',

      question:
        'How many moles are present in 18 g of water (H₂O)? Use H = 1 and O = 16.',

      options: [
        'A. 0.5 mol',
        'B. 1 mol',
        'C. 2 mol',
        'D. 18 mol'
      ],

      answer: 'B',

      explanation:
        'The molar mass of H₂O is (2 × 1) + 16 = 18 g/mol. Therefore, moles = mass ÷ molar mass = 18 ÷ 18 = 1 mol.'
    },


    {
      id: 'chem_002',

      topic: 'Chemical Equations',

      question:
        'Which equation is correctly balanced for the formation of water?',

      options: [
        'A. H₂ + O₂ → H₂O',
        'B. 2H₂ + O₂ → 2H₂O',
        'C. H₂ + 2O₂ → H₂O',
        'D. 2H₂ + 2O₂ → H₂O'
      ],

      answer: 'B',

      explanation:
        'The balanced equation is 2H₂ + O₂ → 2H₂O. Both sides contain four hydrogen atoms and two oxygen atoms.'
    },


    {
      id: 'chem_003',

      topic: 'Acids and Bases',

      question:
        'Which pH value represents a strongly acidic solution?',

      options: [
        'A. 2',
        'B. 7',
        'C. 9',
        'D. 12'
      ],

      answer: 'A',

      explanation:
        'The pH scale runs approximately from 0 to 14. Values below 7 are acidic, and a very low pH such as 2 indicates a strongly acidic solution.'
    }

  ],


  physics: [

    {
      id: 'phys_001',

      topic: 'Mechanics',

      question:
        'A car accelerates from rest at 2 m/s² for 5 seconds. What is its final velocity?',

      options: [
        'A. 2 m/s',
        'B. 5 m/s',
        'C. 10 m/s',
        'D. 20 m/s'
      ],

      answer: 'C',

      explanation:
        'Use v = u + at. The car starts from rest, so u = 0. Therefore v = 0 + (2 × 5) = 10 m/s.'
    },


    {
      id: 'phys_002',

      topic: 'Newton’s Laws',

      question:
        'A 5 kg object accelerates at 4 m/s². What force acts on the object?',

      options: [
        'A. 1.25 N',
        'B. 9 N',
        'C. 20 N',
        'D. 25 N'
      ],

      answer: 'C',

      explanation:
        'Newton’s second law states F = ma. Therefore F = 5 × 4 = 20 N.'
    },


    {
      id: 'phys_003',

      topic: 'Speed',

      question:
        'A student travels 100 metres in 20 seconds. What is the average speed?',

      options: [
        'A. 2 m/s',
        'B. 5 m/s',
        'C. 20 m/s',
        'D. 2000 m/s'
      ],

      answer: 'B',

      explanation:
        'Average speed = distance ÷ time. Therefore 100 ÷ 20 = 5 m/s.'
    }

  ],


  mathematics: [

    {
      id: 'math_001',

      topic: 'Linear Equations',

      question:
        'Solve: 5x + 3 = 18',

      options: [
        'A. x = 2',
        'B. x = 3',
        'C. x = 4',
        'D. x = 5'
      ],

      answer: 'B',

      explanation:
        'Subtract 3 from both sides: 5x = 15. Then divide both sides by 5. Therefore x = 3.'
    },


    {
      id: 'math_002',

      topic: 'Quadratic Equations',

      question:
        'What are the solutions of x² − 5x + 6 = 0?',

      options: [
        'A. x = 1 and x = 6',
        'B. x = 2 and x = 3',
        'C. x = -2 and x = -3',
        'D. x = 0 and x = 5'
      ],

      answer: 'B',

      explanation:
        'Factor the equation: (x − 2)(x − 3) = 0. Therefore x = 2 or x = 3.'
    },


    {
      id: 'math_003',

      topic: 'Percentages',

      question:
        'What is 20% of 150?',

      options: [
        'A. 20',
        'B. 25',
        'C. 30',
        'D. 35'
      ],

      answer: 'C',

      explanation:
        '20% = 20/100 = 0.2. Therefore 0.2 × 150 = 30.'
    }

  ],


  history: [

    {
      id: 'hist_001',

      topic: 'Ethiopian History',

      question:
        'Which ancient kingdom was centered around the city of Aksum?',

      options: [
        'A. Aksumite Kingdom',
        'B. Mali Empire',
        'C. Ottoman Empire',
        'D. Roman Empire'
      ],

      answer: 'A',

      explanation:
        'The Aksumite Kingdom was centered in the northern Horn of Africa, with Aksum as its major political and cultural center.'
    }

  ],


  geography: [

    {
      id: 'geo_001',

      topic: 'Physical Geography',

      question:
        'What process involves the removal and transportation of soil and rock by water, wind or ice?',

      options: [
        'A. Condensation',
        'B. Erosion',
        'C. Evaporation',
        'D. Precipitation'
      ],

      answer: 'B',

      explanation:
        'Erosion is the removal and transportation of weathered material by moving water, wind, ice or other natural agents.'
    }

  ],


  economics: [

    {
      id: 'econ_001',

      topic: 'Inflation',

      question:
        'What generally happens to the purchasing power of money when the overall price level rises?',

      options: [
        'A. It increases',
        'B. It decreases',
        'C. It doubles automatically',
        'D. It becomes unlimited'
      ],

      answer: 'B',

      explanation:
        'When prices rise, the same amount of money can generally purchase fewer goods and services. Therefore purchasing power decreases.'
    }

  ],


  english: [

    {
      id: 'eng_001',

      topic: 'Grammar',

      question:
        'Which word is the noun in the sentence: "The student solved the problem quickly."?',

      options: [
        'A. solved',
        'B. quickly',
        'C. student',
        'D. the'
      ],

      answer: 'C',

      explanation:
        'A noun names a person, place, thing or idea. "Student" is the noun in this sentence.'
    }

  ]

};


// ============================================================
// USER DATA
// ============================================================
//
// This is temporary demo storage.
// Later we will replace this with a real database.
// ============================================================

const users = {};


// ============================================================
// GET USER
// ============================================================

function getUser(userId) {

  if (!users[userId]) {

    users[userId] = {

      unlocked: false,

      score: 0,

      attempted: 0,

      correct: 0,

      streak: 0

    };

  }

  return users[userId];

}


// ============================================================
// MAIN MENU KEYBOARD
// ============================================================

function mainKeyboard() {

  return Markup.inlineKeyboard([

    [
      Markup.button.callback(
        '📚 Learn',
        'learn'
      ),

      Markup.button.callback(
        '✍️ Practice',
        'practice'
      )
    ],

    [
      Markup.button.callback(
        '🎯 Daily Challenge',
        'challenge'
      ),

      Markup.button.callback(
        '📊 My Progress',
        'progress'
      )
    ],

    [
      Markup.button.callback(
        '💬 Study Buddy',
        'buddy'
      ),

      Markup.button.callback(
        '🧠 Exam Ready',
        'exam'
      )
    ],

    [
      Markup.button.callback(
        '📞 Support',
        'contact'
      )
    ]

  ]);

}


// ============================================================
// HOME
// ============================================================

async function showHome(ctx) {

  const user =
    getUser(ctx.from.id);

  const access =
    user.unlocked
      ? '🟢 Practice Access: UNLOCKED'
      : '🔒 Practice Access: LOCKED';

  const message =

`🌟 <b>FINEBOT</b>

🎓 <b>Grade 12 Mastering Companion</b>

Learn.
Practice.
Understand.
Improve.

━━━━━━━━━━━━━━━━

${access}

<i>Your goal isn't to memorize everything.
Your goal is to understand how to solve it.</i>

<b>What do you want to do?</b> 👇`;

  if (ctx.callbackQuery) {

    await ctx.editMessageText(

      message,

      {
        parse_mode: 'HTML',
        ...mainKeyboard()
      }

    );

  } else {

    await ctx.replyWithHTML(

      message,

      mainKeyboard()

    );

  }

}


// ============================================================
// START
// ============================================================

bot.start(async (ctx) => {

  getUser(ctx.from.id);

  await showHome(ctx);

});


// ============================================================
// HOME BUTTON
// ============================================================

bot.action('home', async (ctx) => {

  await ctx.answerCbQuery();

  await showHome(ctx);

});


// ============================================================
// PRACTICE ACCESS SCREEN
// ============================================================

bot.action('practice', async (ctx) => {

  await ctx.answerCbQuery();

  const user =
    getUser(ctx.from.id);


  // Already unlocked
  if (user.unlocked) {

    return showPracticeMenu(ctx);

  }


  // Locked
  await ctx.editMessageText(

`🔒 <b>FINEBOT PRACTICE</b>

Your problem-solving arena is waiting.

Unlock full practice access for:

💰 <b>${DEMO_PRICE} ETB</b>

━━━━━━━━━━━━━━━━

🎯 Practice Grade 12 questions

🧠 Get instant explanations

📊 Track your performance

🔥 Build your confidence

🎓 Prepare smarter

━━━━━━━━━━━━━━━━

⚠️ <i>This is a simulated payment for testing.
No real money will be charged.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            `🔓 Unlock — ${DEMO_PRICE} ETB`,
            'unlock_50'
          )
        ],

        [
          Markup.button.callback(
            '🏠 Main Menu',
            'home'
          )
        ]

      ])
    }

  );

});


// ============================================================
// SIMULATED PAYMENT
// ============================================================

bot.action('unlock_50', async (ctx) => {

  await ctx.answerCbQuery();

  await ctx.editMessageText(

`💳 <b>SIMULATED CHECKOUT</b>

FineBot Practice Access

━━━━━━━━━━━━━━━━

💰 Amount: <b>${DEMO_PRICE} ETB</b>

🧾 Product:
<b>Grade 12 Practice Access</b>

━━━━━━━━━━━━━━━━

Choose a demo payment method 👇

<i>No real payment will be processed.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '📱 Telebirr — Demo',
            'demo_pay_telebirr'
          )
        ],

        [
          Markup.button.callback(
            '🏦 CBE — Demo',
            'demo_pay_cbe'
          )
        ],

        [
          Markup.button.callback(
            '❌ Cancel',
            'home'
          )
        ]

      ])
    }

  );

});


// ============================================================
// DEMO PAYMENT CONFIRMATION
// ============================================================

bot.action(
  ['demo_pay_telebirr', 'demo_pay_cbe'],
  async (ctx) => {

    await ctx.answerCbQuery();

    const method =
      ctx.match[0] === 'demo_pay_telebirr'
        ? 'Telebirr'
        : 'CBE';

    await ctx.editMessageText(

`💳 <b>${method.toUpperCase()} — DEMO PAYMENT</b>

Amount:

💰 <b>${DEMO_PRICE} ETB</b>

━━━━━━━━━━━━━━━━

This is a simulated transaction.

Press the button below to simulate a successful payment.`,

      {
        parse_mode: 'HTML',

        ...Markup.inlineKeyboard([

          [
            Markup.button.callback(
              '✅ Simulate Successful Payment',
              `demo_success_${method.toLowerCase()}`
            )
          ],

          [
            Markup.button.callback(
              '❌ Cancel',
              'home'
            )
          ]

        ])
      }

    );

  }
);


// ============================================================
// SIMULATED SUCCESS
// ============================================================

bot.action(
  /demo_success_(telebirr|cbe)/,
  async (ctx) => {

    await ctx.answerCbQuery(
      'Payment simulated successfully!'
    );

    const user =
      getUser(ctx.from.id);

    user.unlocked = true;

    await ctx.editMessageText(

`🎉 <b>ACCESS UNLOCKED!</b>

Your simulated payment was successful.

━━━━━━━━━━━━━━━━

💰 Paid: <b>${DEMO_PRICE} ETB</b>

🔓 Practice: <b>UNLOCKED</b>

🎯 Status: <b>READY</b>

━━━━━━━━━━━━━━━━

You're ready to start solving.

No memorizing.
No guessing.

<b>Let's see what you really understand. 🧠</b>`,

      {
        parse_mode: 'HTML',

        ...Markup.inlineKeyboard([

          [
            Markup.button.callback(
              '🚀 Start Practicing',
              'practice_menu'
            )
          ],

          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]

        ])
      }

    );

  }
);


// ============================================================
// PRACTICE MENU
// ============================================================

async function showPracticeMenu(ctx) {

  await ctx.editMessageText(

`✍️ <b>PRACTICE ARENA</b>

🔓 <b>Access Unlocked</b>

Choose your subject.

Each session is designed to make you think — not just memorize. 🧠`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🧬 Biology',
            'start_biology'
          ),

          Markup.button.callback(
            '⚗️ Chemistry',
            'start_chemistry'
          )
        ],

        [
          Markup.button.callback(
            '⚛️ Physics',
            'start_physics'
          ),

          Markup.button.callback(
            '➗ Mathematics',
            'start_mathematics'
          )
        ],

        [
          Markup.button.callback(
            '📜 History',
            'start_history'
          ),

          Markup.button.callback(
            '🌍 Geography',
            'start_geography'
          )
        ],

        [
          Markup.button.callback(
            '📈 Economics',
            'start_economics'
          ),

          Markup.button.callback(
            '🇬🇧 English',
            'start_english'
          )
        ],

        [
          Markup.button.callback(
            '🎲 Mixed Practice',
            'start_mixed'
          )
        ],

        [
          Markup.button.callback(
            '🏠 Main Menu',
            'home'
          )
        ]

      ])
    }

  );

}


// ============================================================
// PRACTICE MENU BUTTON
// ============================================================

bot.action('practice_menu', async (ctx) => {

  await ctx.answerCbQuery();

  const user =
    getUser(ctx.from.id);

  if (!user.unlocked) {

    return ctx.editMessageText(

`🔒 <b>Practice is locked.</b>

Unlock access for <b>${DEMO_PRICE} ETB</b> to start practicing.`,

      {
        parse_mode: 'HTML',

        ...Markup.inlineKeyboard([

          [
            Markup.button.callback(
              `🔓 Unlock — ${DEMO_PRICE} ETB`,
              'unlock_50'
            )
          ],

          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]

        ])
      }

    );

  }

  await showPracticeMenu(ctx);

});
// ============================================================
// PART 2 — PRACTICE ENGINE
// ============================================================

// ------------------------------------------------------------
// Practice session storage
// ------------------------------------------------------------

const practiceSessions = {};

function getPracticeSession(userId) {
  if (!practiceSessions[userId]) {
    practiceSessions[userId] = {
      ids: [],
      position: 0,
      score: 0,
      answered: false
    };
  }

  return practiceSessions[userId];
}


// ------------------------------------------------------------
// Find a question by subject + permanent question ID
// ------------------------------------------------------------

function findQuestion(subjectId, questionId) {
  const subjectQuestions = questions[subjectId] || [];

  return subjectQuestions.find(
    (q) => q.id === questionId
  );
}


// ------------------------------------------------------------
// Progress bar
// ------------------------------------------------------------

function progressBar(current, total) {
  const length = 10;

  if (total <= 0) {
    return '□□□□□□□□□□';
  }

  const filled = Math.round((current / total) * length);
  const empty = length - filled;

  return '🟩'.repeat(filled) + '⬜'.repeat(empty);
}


// ------------------------------------------------------------
// Get the next question ID
// ------------------------------------------------------------

function getNextQuestionId(subjectId, currentId) {
  const list = questions[subjectId] || [];

  const currentIndex = list.findIndex(
    (q) => q.id === currentId
  );

  if (currentIndex === -1) {
    return null;
  }

  const nextIndex = currentIndex + 1;

  if (nextIndex >= list.length) {
    return null;
  }

  return list[nextIndex].id;
}


// ------------------------------------------------------------
// Show a question
// ------------------------------------------------------------

async function showQuestion(ctx, subjectId, questionId) {
  const userId = ctx.from.id;

  const question = findQuestion(subjectId, questionId);

  if (!question) {
    return ctx.editMessageText(
      `⚠️ <b>Question unavailable</b>\n\n` +
      `This question could not be found.\n\n` +
      `Please start a new practice session.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🔄 Start Practice',
              'practice_menu'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }

  const session = getPracticeSession(userId);

  session.answered = false;

  const total = session.ids.length || 1;
  const current = session.position + 1;

  const bar = progressBar(current - 1, total);

  const optionButtons = question.options.map(
    (option, index) => {

      const letter = String.fromCharCode(65 + index);

      return [
        Markup.button.callback(
          `${letter}  ${option}`,
          `solve|${subjectId}|${question.id}|${letter}`
        )
      ];
    }
  );

  optionButtons.push([
    Markup.button.callback(
      '⏭️ Skip',
      `skip|${subjectId}|${question.id}`
    )
  ]);

  optionButtons.push([
    Markup.button.callback(
      '🚪 Exit Practice',
      'practice_menu'
    )
  ]);

  const text =
    `✍️ <b>Practice</b>\n\n` +
    `${bar}\n` +
    `<b>Question ${current} of ${total}</b>\n\n` +
    `📚 <b>${subjectMap[subjectId]?.name || subjectId}</b>\n` +
    `🏷️ ${question.topic}\n\n` +
    `<b>${question.question}</b>\n\n` +
    `Choose the best answer 👇`;

  await ctx.editMessageText(
    text,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(optionButtons)
    }
  );
}


// ------------------------------------------------------------
// Start a subject practice session
// ------------------------------------------------------------

async function startSubjectPractice(ctx, subjectId) {
  const userId = ctx.from.id;
  const user = getUser(userId);

  if (!user.unlocked) {
    return ctx.editMessageText(
      `🔒 <b>Practice is locked</b>\n\n` +
      `Unlock FineBot Practice for <b>${DEMO_PRICE} ETB</b> ` +
      `to start practicing.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `🔓 Unlock — ${DEMO_PRICE} ETB`,
              'unlock_50'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }

  const subjectQuestions = questions[subjectId] || [];

  if (subjectQuestions.length === 0) {
    return ctx.editMessageText(
      `📚 <b>No questions yet</b>\n\n` +
      `Questions for this subject are being prepared.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '⬅️ Back',
              'practice_menu'
            )
          ]
        ])
      }
    );
  }

  const session = getPracticeSession(userId);

  session.ids = subjectQuestions.map((q) => q.id);
  session.position = 0;
  session.score = 0;
  session.answered = false;

  const firstQuestionId = session.ids[0];

  await showQuestion(
    ctx,
    subjectId,
    firstQuestionId
  );
}


// ------------------------------------------------------------
// Subject buttons
// ------------------------------------------------------------

bot.action(
  /^subject\|(biology|chemistry|physics|mathematics|history|geography|economics|english)$/,
  async (ctx) => {

    await ctx.answerCbQuery();

    const subjectId = ctx.match[1];

    await startSubjectPractice(
      ctx,
      subjectId
    );
  }
);


// ------------------------------------------------------------
// Answer question
// ------------------------------------------------------------

bot.action(
  /^solve\|([^|]+)\|([^|]+)\|([A-D])$/,
  async (ctx) => {

    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    const subjectId = ctx.match[1];
    const questionId = ctx.match[2];
    const selected = ctx.match[3];

    const question = findQuestion(
      subjectId,
      questionId
    );

    if (!question) {
      return ctx.editMessageText(
        `⚠️ <b>Question unavailable</b>\n\n` +
        `Please start a new practice session.`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🔄 Start Practice',
                'practice_menu'
              )
            ]
          ])
        }
      );
    }

    const session = getPracticeSession(userId);

    // Prevent the same question from being answered twice.
    if (session.answered) {
      return;
    }

    session.answered = true;

    const user = getUser(userId);

    const correct =
      selected === question.answer;

    user.attempted += 1;

    if (correct) {
      user.correct += 1;
      user.score += 1;
      session.score += 1;
      user.streak += 1;
    } else {
      user.streak = 0;
    }

    const current =
      session.position + 1;

    const total =
      session.ids.length;

    let resultText = '';

    if (correct) {

      resultText =
        `🎉 <b>Correct!</b>\n\n` +
        `⭐ +1 point\n\n` +
        `🧠 <b>Explanation</b>\n` +
        `${question.explanation}`;

    } else {

      resultText =
        `❌ <b>Not quite!</b>\n\n` +
        `✅ Correct answer: <b>${question.answer}</b>\n\n` +
        `🧠 <b>Explanation</b>\n` +
        `${question.explanation}`;
    }

    const nextQuestionId =
      getNextQuestionId(
        subjectId,
        questionId
      );

    const buttons = [];

    if (nextQuestionId) {

      session.position =
        Math.min(
          session.position + 1,
          total - 1
        );

      buttons.push([
        Markup.button.callback(
          '➡️ Continue',
          `next|${subjectId}|${nextQuestionId}`
        )
      ]);

    } else {

      buttons.push([
        Markup.button.callback(
          '🏆 See Results',
          `results|${subjectId}`
        )
      ]);
    }

    buttons.push([
      Markup.button.callback(
        '🚪 Exit Practice',
        'practice_menu'
      )
    ]);

    const progress =
      progressBar(
        current,
        total
      );

    await ctx.editMessageText(
      `✍️ <b>Practice</b>\n\n` +
      `${progress}\n` +
      `<b>Question ${current} of ${total}</b>\n\n` +
      resultText,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons)
      }
    );
  }
);


// ------------------------------------------------------------
// Continue to next question
// ------------------------------------------------------------

bot.action(
  /^next\|([^|]+)\|([^|]+)$/,
  async (ctx) => {

    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    const subjectId = ctx.match[1];
    const questionId = ctx.match[2];

    const session =
      getPracticeSession(userId);

    session.answered = false;

    const question =
      findQuestion(
        subjectId,
        questionId
      );

    if (!question) {
      return ctx.editMessageText(
        `⚠️ <b>Question unavailable</b>\n\n` +
        `Please start a new practice session.`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🔄 Start Practice',
                'practice_menu'
              )
            ]
          ])
        }
      );
    }

    await showQuestion(
      ctx,
      subjectId,
      questionId
    );
  }
);


// ------------------------------------------------------------
// Skip question
// ------------------------------------------------------------

bot.action(
  /^skip\|([^|]+)\|([^|]+)$/,
  async (ctx) => {

    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    const subjectId = ctx.match[1];
    const questionId = ctx.match[2];

    const session =
      getPracticeSession(userId);

    if (session.answered) {
      return;
    }

    session.answered = true;

    const nextQuestionId =
      getNextQuestionId(
        subjectId,
        questionId
      );

    if (!nextQuestionId) {

      return ctx.editMessageText(
        `⏭️ <b>Practice Complete</b>\n\n` +
        `You skipped the last question.\n\n` +
        `Ready to try again?`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🔄 Practice Again',
                `subject|${subjectId}`
              )
            ],
            [
              Markup.button.callback(
                '📚 Practice Menu',
                'practice_menu'
              )
            ]
          ])
        }
      );
    }

    session.position =
      Math.min(
        session.position + 1,
        session.ids.length - 1
      );

    session.answered = false;

    await showQuestion(
      ctx,
      subjectId,
      nextQuestionId
    );
  }
);


// ------------------------------------------------------------
// Practice results
// ------------------------------------------------------------

bot.action(
  /^results\|([^|]+)$/,
  async (ctx) => {

    await ctx.answerCbQuery();

    const userId = ctx.from.id;

    const subjectId = ctx.match[1];

    const session =
      getPracticeSession(userId);

    const user =
      getUser(userId);

    const total =
      session.ids.length;

    const score =
      session.score;

    const percentage =
      total > 0
        ? Math.round((score / total) * 100)
        : 0;

    let message = '';

    if (percentage >= 90) {

      message =
        `🔥 <b>Outstanding!</b>\n` +
        `You're mastering this!`;

    } else if (percentage >= 70) {

      message =
        `🎉 <b>Great job!</b>\n` +
        `You're making strong progress.`;

    } else if (percentage >= 50) {

      message =
        `💪 <b>Good effort!</b>\n` +
        `Keep practicing and you'll improve.`;

    } else {

      message =
        `🌱 <b>Keep going!</b>\n` +
        `Every mistake is another opportunity to learn.`;
    }

    await ctx.editMessageText(
      `🏆 <b>Practice Complete!</b>\n\n` +
      `📚 <b>${subjectMap[subjectId]?.name || subjectId}</b>\n\n` +
      `⭐ Score: <b>${score}/${total}</b>\n` +
      `📊 Accuracy: <b>${percentage}%</b>\n` +
      `🔥 Streak: <b>${user.streak}</b>\n\n` +
      `${message}`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🔄 Practice Again',
              `subject|${subjectId}`
            )
          ],
          [
            Markup.button.callback(
              '📚 Practice Menu',
              'practice_menu'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }
);
// ============================================================
// PART 3 — MIXED PRACTICE + DAILY CHALLENGE + PROGRESS
// ============================================================


// ------------------------------------------------------------
// ALL SUBJECT IDS
// ------------------------------------------------------------

const ALL_SUBJECT_IDS = [
  'biology',
  'chemistry',
  'physics',
  'mathematics',
  'history',
  'geography',
  'economics',
  'english'
];


// ------------------------------------------------------------
// GET ALL QUESTIONS
// ------------------------------------------------------------

function getAllQuestions() {
  const all = [];

  for (const subjectId of ALL_SUBJECT_IDS) {
    const subjectQuestions = questions[subjectId] || [];

    for (const question of subjectQuestions) {
      all.push({
        ...question,
        subjectId
      });
    }
  }

  return all;
}


// ------------------------------------------------------------
// SHUFFLE ARRAY
// ------------------------------------------------------------

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] =
      [copy[j], copy[i]];
  }

  return copy;
}


// ------------------------------------------------------------
// MIXED PRACTICE
// ------------------------------------------------------------

async function startMixedPractice(ctx) {

  const userId = ctx.from.id;

  const user = getUser(userId);

  if (!user.unlocked) {

    return ctx.editMessageText(
      `🔒 <b>Practice is locked</b>\n\n` +
      `Unlock FineBot Practice for <b>${DEMO_PRICE} ETB</b> ` +
      `to start practicing.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `🔓 Unlock — ${DEMO_PRICE} ETB`,
              'unlock_50'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }


  const allQuestions =
    getAllQuestions();


  if (allQuestions.length === 0) {

    return ctx.editMessageText(
      `📚 <b>No questions available</b>\n\n` +
      `More practice questions are coming soon.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '⬅️ Practice Menu',
              'practice_menu'
            )
          ]
        ])
      }
    );
  }


  // Take up to 10 random questions.
  const selected =
    shuffleArray(allQuestions)
      .slice(
        0,
        Math.min(10, allQuestions.length)
      );


  const session =
    getPracticeSession(userId);


  session.ids =
    selected.map(
      (q) => `${q.subjectId}:${q.id}`
    );

  session.position = 0;
  session.score = 0;
  session.answered = false;


  const first =
    selected[0];


  await showMixedQuestion(
    ctx,
    first.subjectId,
    first.id
  );
}


// ------------------------------------------------------------
// FIND MIXED QUESTION
// ------------------------------------------------------------

function findMixedQuestion(
  subjectId,
  questionId
) {
  return findQuestion(
    subjectId,
    questionId
  );
}


// ------------------------------------------------------------
// SHOW MIXED QUESTION
// ------------------------------------------------------------

async function showMixedQuestion(
  ctx,
  subjectId,
  questionId
) {

  const userId =
    ctx.from.id;

  const question =
    findMixedQuestion(
      subjectId,
      questionId
    );


  if (!question) {

    return ctx.editMessageText(
      `⚠️ <b>Question unavailable</b>\n\n` +
      `Please start a new mixed practice.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🔄 Mixed Practice',
              'mixed_practice'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }


  const session =
    getPracticeSession(userId);


  session.answered = false;


  const total =
    session.ids.length;


  const current =
    session.position + 1;


  const bar =
    progressBar(
      current - 1,
      total
    );


  const buttons =
    question.options.map(
      (option, index) => {

        const letter =
          String.fromCharCode(
            65 + index
          );

        return [
          Markup.button.callback(
            `${letter}  ${option}`,
            `mixedsolve|${subjectId}|${question.id}|${letter}`
          )
        ];
      }
    );


  buttons.push([
    Markup.button.callback(
      '⏭️ Skip',
      `mixedskip|${subjectId}|${question.id}`
    )
  ]);


  buttons.push([
    Markup.button.callback(
      '🚪 Exit',
      'practice_menu'
    )
  ]);


  const subjectName =
    subjectMap[subjectId]?.name ||
    subjectId;


  const text =
    `🎯 <b>Mixed Practice</b>\n\n` +
    `${bar}\n` +
    `<b>Question ${current} of ${total}</b>\n\n` +
    `📚 ${subjectName}\n` +
    `🏷️ ${question.topic}\n\n` +
    `<b>${question.question}</b>\n\n` +
    `Choose your answer 👇`;


  await ctx.editMessageText(
    text,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }
  );
}


// ------------------------------------------------------------
// MIXED ANSWER
// ------------------------------------------------------------

bot.action(
  /^mixedsolve\|([^|]+)\|([^|]+)\|([A-D])$/,
  async (ctx) => {

    await ctx.answerCbQuery();


    const userId =
      ctx.from.id;


    const subjectId =
      ctx.match[1];


    const questionId =
      ctx.match[2];


    const selected =
      ctx.match[3];


    const question =
      findMixedQuestion(
        subjectId,
        questionId
      );


    if (!question) {

      return ctx.editMessageText(
        `⚠️ <b>Question unavailable</b>\n\n` +
        `Please start a new session.`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🔄 Mixed Practice',
                'mixed_practice'
              )
            ]
          ])
        }
      );
    }


    const session =
      getPracticeSession(userId);


    if (session.answered) {
      return;
    }


    session.answered = true;


    const user =
      getUser(userId);


    const correct =
      selected === question.answer;


    user.attempted += 1;


    if (correct) {

      user.correct += 1;

      user.score += 1;

      user.streak += 1;

      session.score += 1;

    } else {

      user.streak = 0;
    }


    const current =
      session.position + 1;


    const total =
      session.ids.length;


    let resultText;


    if (correct) {

      resultText =
        `🎉 <b>Correct!</b>\n\n` +
        `⭐ +1 point\n\n` +
        `🧠 <b>Why?</b>\n` +
        `${question.explanation}`;

    } else {

      resultText =
        `❌ <b>Incorrect</b>\n\n` +
        `✅ Correct answer: <b>${question.answer}</b>\n\n` +
        `🧠 <b>Why?</b>\n` +
        `${question.explanation}`;
    }


    const nextIndex =
      session.position + 1;


    const nextKey =
      session.ids[nextIndex];


    const buttons = [];


    if (nextKey) {

      const parts =
        nextKey.split(':');


      const nextSubject =
        parts[0];


      const nextQuestion =
        parts.slice(1).join(':');


      session.position =
        nextIndex;


      buttons.push([
        Markup.button.callback(
          '➡️ Continue',
          `mixednext|${nextSubject}|${nextQuestion}`
        )
      ]);

    } else {

      buttons.push([
        Markup.button.callback(
          '🏆 See Results',
          'mixed_results'
        )
      ]);
    }


    buttons.push([
      Markup.button.callback(
        '🚪 Exit',
        'practice_menu'
      )
    ]);


    const bar =
      progressBar(
        current,
        total
      );


    await ctx.editMessageText(
      `🎯 <b>Mixed Practice</b>\n\n` +
      `${bar}\n` +
      `<b>Question ${current} of ${total}</b>\n\n` +
      resultText,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons)
      }
    );
  }
);


// ------------------------------------------------------------
// MIXED NEXT
// ------------------------------------------------------------

bot.action(
  /^mixednext\|([^|]+)\|([^|]+)$/,
  async (ctx) => {

    await ctx.answerCbQuery();


    const subjectId =
      ctx.match[1];


    const questionId =
      ctx.match[2];


    const question =
      findMixedQuestion(
        subjectId,
        questionId
      );


    if (!question) {

      return ctx.editMessageText(
        `⚠️ <b>Question unavailable</b>\n\n` +
        `Please start a new session.`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🔄 Mixed Practice',
                'mixed_practice'
              )
            ]
          ])
        }
      );
    }


    const session =
      getPracticeSession(
        ctx.from.id
      );


    session.answered = false;


    await showMixedQuestion(
      ctx,
      subjectId,
      questionId
    );
  }
);


// ------------------------------------------------------------
// MIXED SKIP
// ------------------------------------------------------------

bot.action(
  /^mixedskip\|([^|]+)\|([^|]+)$/,
  async (ctx) => {

    await ctx.answerCbQuery();


    const userId =
      ctx.from.id;


    const session =
      getPracticeSession(userId);


    if (session.answered) {
      return;
    }


    session.answered = true;


    const nextIndex =
      session.position + 1;


    const nextKey =
      session.ids[nextIndex];


    if (!nextKey) {

      return ctx.editMessageText(
        `🎯 <b>Mixed Practice Complete</b>\n\n` +
        `You skipped the final question.\n\n` +
        `Ready for another round?`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🔄 Play Again',
                'mixed_practice'
              )
            ],
            [
              Markup.button.callback(
                '📚 Practice Menu',
                'practice_menu'
              )
            ]
          ])
        }
      );
    }


    const parts =
      nextKey.split(':');


    const nextSubject =
      parts[0];


    const nextQuestion =
      parts.slice(1).join(':');


    session.position =
      nextIndex;


    session.answered = false;


    await showMixedQuestion(
      ctx,
      nextSubject,
      nextQuestion
    );
  }
);


// ------------------------------------------------------------
// MIXED RESULTS
// ------------------------------------------------------------

bot.action(
  'mixed_results',
  async (ctx) => {

    await ctx.answerCbQuery();


    const userId =
      ctx.from.id;


    const session =
      getPracticeSession(userId);


    const user =
      getUser(userId);


    const total =
      session.ids.length;


    const score =
      session.score;


    const percentage =
      total > 0
        ? Math.round(
            (score / total) * 100
          )
        : 0;


    let message;


    if (percentage >= 90) {

      message =
        `🔥 <b>Excellent!</b>\n` +
        `You're seriously improving.`;

    } else if (percentage >= 70) {

      message =
        `🎉 <b>Great work!</b>\n` +
        `Keep that momentum going.`;

    } else if (percentage >= 50) {

      message =
        `💪 <b>Good effort!</b>\n` +
        `A little more practice will make you stronger.`;

    } else {

      message =
        `🌱 <b>Keep learning!</b>\n` +
        `Don't fear mistakes. Use them to improve.`;
    }


    await ctx.editMessageText(
      `🏆 <b>Mixed Practice Complete!</b>\n\n` +
      `⭐ Score: <b>${score}/${total}</b>\n` +
      `📊 Accuracy: <b>${percentage}%</b>\n` +
      `🔥 Streak: <b>${user.streak}</b>\n\n` +
      `${message}`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🎯 Play Again',
              'mixed_practice'
            )
          ],
          [
            Markup.button.callback(
              '📊 My Progress',
              'my_progress'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }
);


// ------------------------------------------------------------
// MIXED PRACTICE BUTTON
// ------------------------------------------------------------

bot.action(
  'mixed_practice',
  async (ctx) => {

    await ctx.answerCbQuery();

    await startMixedPractice(ctx);
  }
);


// ------------------------------------------------------------
// DAILY CHALLENGE
// ------------------------------------------------------------

function getDailyQuestion() {

  const all =
    getAllQuestions();


  if (all.length === 0) {
    return null;
  }


  // Same question for everyone during the same day.
  const now =
    new Date();


  const dateKey =
    `${now.getUTCFullYear()}-` +
    `${now.getUTCMonth() + 1}-` +
    `${now.getUTCDate()}`;


  let hash = 0;


  for (let i = 0; i < dateKey.length; i++) {

    hash =
      ((hash << 5) - hash) +
      dateKey.charCodeAt(i);

    hash |= 0;
  }


  const index =
    Math.abs(hash) % all.length;


  return all[index];
}


// ------------------------------------------------------------
// DAILY CHALLENGE SCREEN
// ------------------------------------------------------------

async function showDailyChallenge(ctx) {

  const user =
    getUser(ctx.from.id);


  if (!user.unlocked) {

    return ctx.editMessageText(
      `🔒 <b>Daily Challenge is locked</b>\n\n` +
      `Unlock FineBot Practice for <b>${DEMO_PRICE} ETB</b> ` +
      `to access challenges.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `🔓 Unlock — ${DEMO_PRICE} ETB`,
              'unlock_50'
            )
          ],
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }


  const daily =
    getDailyQuestion();


  if (!daily) {

    return ctx.editMessageText(
      `🎯 <b>Daily Challenge</b>\n\n` +
      `No challenge is available yet.`,
      {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              '🏠 Main Menu',
              'home'
            )
          ]
        ])
      }
    );
  }


  const subjectName =
    subjectMap[daily.subjectId]?.name ||
    daily.subjectId;


  const buttons =
    daily.options.map(
      (option, index) => {

        const letter =
          String.fromCharCode(
            65 + index
          );


        return [
          Markup.button.callback(
            `${letter}  ${option}`,
            `dailyanswer|${daily.subjectId}|${daily.id}|${letter}`
          )
        ];
      }
    );


  buttons.push([
    Markup.button.callback(
      '🏠 Main Menu',
      'home'
    )
  ]);


  await ctx.editMessageText(
    `🎯 <b>DAILY CHALLENGE</b>\n\n` +
    `🔥 One question. One chance. Give it your best shot!\n\n` +
    `📚 ${subjectName}\n` +
    `🏷️ ${daily.topic}\n\n` +
    `<b>${daily.question}</b>\n\n` +
    `Choose your answer 👇`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }
  );
}


// ------------------------------------------------------------
// DAILY CHALLENGE BUTTON
// ------------------------------------------------------------

bot.action(
  'daily_challenge',
  async (ctx) => {

    await ctx.answerCbQuery();

    await showDailyChallenge(ctx);
  }
);


// ------------------------------------------------------------
// DAILY ANSWER
// ------------------------------------------------------------

bot.action(
  /^dailyanswer\|([^|]+)\|([^|]+)\|([A-D])$/,
  async (ctx) => {

    await ctx.answerCbQuery();


    const subjectId =
      ctx.match[1];


    const questionId =
      ctx.match[2];


    const selected =
      ctx.match[3];


    const question =
      findQuestion(
        subjectId,
        questionId
      );


    if (!question) {

      return ctx.editMessageText(
        `⚠️ <b>Daily Challenge unavailable</b>\n\n` +
        `Please try again later.`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '🏠 Main Menu',
                'home'
              )
            ]
          ])
        }
      );
    }


    const user =
      getUser(ctx.from.id);


    const correct =
      selected === question.answer;


    user.attempted += 1;


    if (correct) {

      user.correct += 1;

      user.score += 1;

      user.streak += 1;

    } else {

      user.streak = 0;
    }


    if (correct) {

      await ctx.editMessageText(
        `🎯 <b>Daily Challenge Complete!</b>\n\n` +
        `🎉 <b>Correct!</b>\n\n` +
        `⭐ +1 point\n\n` +
        `🧠 <b>Explanation</b>\n` +
        `${question.explanation}\n\n` +
        `🔥 Current streak: <b>${user.streak}</b>`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '✍️ Practice More',
                'practice_menu'
              )
            ],
            [
              Markup.button.callback(
                '📊 My Progress',
                'my_progress'
              )
            ],
            [
              Markup.button.callback(
                '🏠 Main Menu',
                'home'
              )
            ]
          ])
        }
      );

    } else {

      await ctx.editMessageText(
        `🎯 <b>Daily Challenge Complete!</b>\n\n` +
        `❌ <b>Not quite!</b>\n\n` +
        `✅ Correct answer: <b>${question.answer}</b>\n\n` +
        `🧠 <b>Explanation</b>\n` +
        `${question.explanation}\n\n` +
        `💡 Don't worry — tomorrow is another challenge!`,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard([
            [
              Markup.button.callback(
                '✍️ Practice',
                'practice_menu'
              )
            ],
            [
              Markup.button.callback(
                '📊 My Progress',
                'my_progress'
              )
            ],
            [
              Markup.button.callback(
                '🏠 Main Menu',
                'home'
              )
            ]
          ])
        }
      );
    }
  }
);


// ------------------------------------------------------------
// MY PROGRESS
// ------------------------------------------------------------

async function showProgress(ctx) {

  const user =
    getUser(ctx.from.id);


  const attempted =
    user.attempted;


  const correct =
    user.correct;


  const accuracy =
    attempted > 0
      ? Math.round(
          (correct / attempted) * 100
        )
      : 0;


  let level;


  if (correct >= 50) {

    level = '🏆 Master';

  } else if (correct >= 25) {

    level = '🔥 Advanced';

  } else if (correct >= 10) {

    level = '⚡ Improving';

  } else {

    level = '🌱 Beginner';
  }


  await ctx.editMessageText(
    `📊 <b>MY PROGRESS</b>\n\n` +
    `${level}\n\n` +
    `⭐ Total Points: <b>${user.score}</b>\n` +
    `📝 Questions Answered: <b>${attempted}</b>\n` +
    `✅ Correct Answers: <b>${correct}</b>\n` +
    `📈 Accuracy: <b>${accuracy}%</b>\n` +
    `🔥 Current Streak: <b>${user.streak}</b>\n\n` +
    `Keep practicing every day and watch your score grow! 🚀`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            '✍️ Practice',
            'practice_menu'
          )
        ],
        [
          Markup.button.callback(
            '🎯 Daily Challenge',
            'daily_challenge'
          )
        ],
        [
          Markup.button.callback(
            '🏠 Main Menu',
            'home'
          )
        ]
      ])
    }
  );