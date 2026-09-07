 const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ============================================================
// FINEBOT — GRADE 12 PROBLEM SOLVING BOT
// ============================================================

// ------------------------------------------------------------
// SUBJECTS
// ------------------------------------------------------------

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


// ------------------------------------------------------------
// QUESTION BANK
// ------------------------------------------------------------

const questions = {

  biology: [

    {
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
        'The mitochondrion produces most of the cell’s ATP through cellular respiration. ATP is the main usable energy currency of the cell.'
    },

    {
      topic: 'Genetics',

      question:
        'If a heterozygous tall plant (Tt) is crossed with another heterozygous tall plant (Tt), what percentage of the offspring are expected to be short (tt)?',

      options: [
        'A. 0%',
        'B. 25%',
        'C. 50%',
        'D. 75%'
      ],

      answer: 'B',

      explanation:
        'The cross Tt × Tt gives TT, Tt, Tt and tt. One out of four offspring is tt, giving 25%.'
    }

  ],


  chemistry: [

    {
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
        'Molar mass of H₂O = (2 × 1) + 16 = 18 g/mol. Therefore, moles = mass ÷ molar mass = 18 ÷ 18 = 1 mol.'
    },

    {
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
        'The balanced equation is 2H₂ + O₂ → 2H₂O. There are four hydrogen atoms and two oxygen atoms on both sides.'
    }

  ],


  physics: [

    {
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
        'Use v = u + at. Since the car starts from rest, u = 0. Therefore v = 0 + (2 × 5) = 10 m/s.'
    },

    {
      topic: 'Force',

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
    }

  ],


  mathematics: [

    {
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
        'Subtract 3 from both sides: 5x = 15. Divide by 5: x = 3.'
    },

    {
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
        'Factor the equation: x² − 5x + 6 = (x − 2)(x − 3). Therefore x = 2 or x = 3.'
    }

  ],


  history: [

    {
      topic: 'Ethiopian History',

      question:
        'Which ancient Ethiopian kingdom is associated with the city of Aksum?',

      options: [
        'A. Aksumite Kingdom',
        'B. Ottoman Empire',
        'C. Mali Empire',
        'D. Roman Empire'
      ],

      answer: 'A',

      explanation:
        'The ancient city of Aksum was the center of the Aksumite Kingdom, one of the major civilizations of the ancient Horn of Africa.'
    }

  ],


  geography: [

    {
      topic: 'Physical Geography',

      question:
        'Which process is primarily responsible for the wearing away of rocks and soil by moving water, wind, or ice?',

      options: [
        'A. Condensation',
        'B. Erosion',
        'C. Evaporation',
        'D. Precipitation'
      ],

      answer: 'B',

      explanation:
        'Erosion is the removal and transportation of soil and rock materials by agents such as water, wind and ice.'
    }

  ],


  economics: [

    {
      topic: 'Inflation',

      question:
        'What generally happens to the purchasing power of money when the overall price level rises significantly?',

      options: [
        'A. It increases',
        'B. It decreases',
        'C. It remains exactly the same',
        'D. It becomes unlimited'
      ],

      answer: 'B',

      explanation:
        'When prices rise, the same amount of money can generally buy fewer goods and services. Therefore purchasing power decreases.'
    }

  ],


  english: [

    {
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


// ------------------------------------------------------------
// USER SESSION DATA
// ------------------------------------------------------------

const userState = {};


// ------------------------------------------------------------
// SUBJECT LOOKUP
// ------------------------------------------------------------

const allSubjects = [
  ...subjects.natural,
  ...subjects.social
];

const subjectMap = {};

allSubjects.forEach(subject => {
  subjectMap[subject.id] = subject;
});


// ------------------------------------------------------------
// MAIN KEYBOARD
// ------------------------------------------------------------

function mainKeyboard() {

  return Markup.inlineKeyboard([

    [
      Markup.button.callback('📚 Learn', 'learn'),
      Markup.button.callback('✍️ Practice', 'practice')
    ],

    [
      Markup.button.callback('🎯 Challenge', 'challenge'),
      Markup.button.callback('📊 Progress', 'progress')
    ],

    [
      Markup.button.callback('💬 Study Buddy', 'buddy'),
      Markup.button.callback('🧠 Exam Ready', 'exam')
    ],

    [
      Markup.button.callback('📞 Contact', 'contact')
    ]

  ]);
}


// ------------------------------------------------------------
// BACK HOME BUTTON
// ------------------------------------------------------------

function backHomeKeyboard() {

  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🏠 Main Menu', 'home')
    ]
  ]);

}


// ------------------------------------------------------------
// HOME SCREEN
// ------------------------------------------------------------

async function showHome(ctx) {

  const message =

`🌟 <b>FINEBOT</b>

🎓 <b>Your Grade 12 Mastering Companion</b>

Learn smarter.
Practice harder.
Understand why.

<b>What do you want to do?</b> 👇`;

  try {

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

  } catch (error) {

    console.error('Home error:', error);

  }

}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

bot.start(async (ctx) => {

  userState[ctx.from.id] = {
    score: 0,
    attempted: 0,
    correct: 0,
    currentSubject: null,
    currentQuestion: null,
    currentIndex: 0
  };

  await showHome(ctx);

});


// ------------------------------------------------------------
// HOME
// ------------------------------------------------------------

bot.action('home', async (ctx) => {

  await ctx.answerCbQuery();

  await showHome(ctx);

});


// ------------------------------------------------------------
// LEARN
// ------------------------------------------------------------

bot.action('learn', async (ctx) => {

  await ctx.answerCbQuery();

  await ctx.editMessageText(

`📚 <b>LEARN</b>

Build your knowledge before you test it.

Choose your stream 👇`,

    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🌿 Natural Science',
            'natural'
          )
        ],

        [
          Markup.button.callback(
            '🏛️ Social Science',
            'social'
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


// ------------------------------------------------------------
// NATURAL SCIENCE
// ------------------------------------------------------------

bot.action('natural', async (ctx) => {

  await ctx.answerCbQuery();

  const buttons = subjects.natural.map(subject => [

    Markup.button.callback(
      `${subject.emoji} ${subject.name}`,
      `subject_${subject.id}`
    )

  ]);

  buttons.push([
    Markup.button.callback('🔙 Back', 'learn')
  ]);

  await ctx.editMessageText(

`🌿 <b>NATURAL SCIENCE</b>

Choose a subject 👇`,

    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }

  );

});


// ------------------------------------------------------------
// SOCIAL SCIENCE
// ------------------------------------------------------------

bot.action('social', async (ctx) => {

  await ctx.answerCbQuery();

  const buttons = subjects.social.map(subject => [

    Markup.button.callback(
      `${subject.emoji} ${subject.name}`,
      `subject_${subject.id}`
    )

  ]);

  buttons.push([
    Markup.button.callback('🔙 Back', 'learn')
  ]);

  await ctx.editMessageText(

`🏛️ <b>SOCIAL SCIENCE</b>

Choose a subject 👇`,

    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }

  );

});


// ------------------------------------------------------------
// SUBJECT OVERVIEW
// ------------------------------------------------------------

bot.action(/subject_(.+)/, async (ctx) => {

  await ctx.answerCbQuery();

  const subjectId = ctx.match[1];

  const subject = subjectMap[subjectId];

  if (!subject) return;

  const questionCount =
    questions[subjectId]
      ? questions[subjectId].length
      : 0;

  await ctx.editMessageText(

`${subject.emoji} <b>${subject.name}</b>

📖 Available practice questions: <b>${questionCount}</b>

Choose what you want to do:

✍️ Practice this subject
🎯 Test yourself
📚 Continue learning`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '✍️ Practice',
            `practice_${subjectId}`
          )
        ],

        [
          Markup.button.callback(
            '🎯 Challenge',
            `challenge_${subjectId}`
          )
        ],

        [
          Markup.button.callback(
            '🔙 Back',
            subjectId === 'biology' ||
            subjectId === 'chemistry' ||
            subjectId === 'physics' ||
            subjectId === 'mathematics'
              ? 'natural'
              : 'social'
          )
        ]

      ])
    }

  );

});
// ============================================================
// PART 2 — PROBLEM-SOLVING ENGINE
// ============================================================


// ------------------------------------------------------------
// GET / CREATE USER STATE
// ------------------------------------------------------------

function getUserState(userId) {

  if (!userState[userId]) {

    userState[userId] = {
      score: 0,
      attempted: 0,
      correct: 0,

      currentSubject: null,
      currentQuestion: null,
      currentIndex: 0,

      answered: false
    };

  }

  return userState[userId];

}


// ------------------------------------------------------------
// SHUFFLE ARRAY
// ------------------------------------------------------------

function shuffle(array) {

  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];

  }

  return copy;

}


// ------------------------------------------------------------
// START SUBJECT PRACTICE
// ------------------------------------------------------------

bot.action(/practice_(.+)/, async (ctx) => {

  await ctx.answerCbQuery();

  const subjectId = ctx.match[1];

  const subject = subjectMap[subjectId];

  if (!subject || !questions[subjectId]) {

    return ctx.answerCbQuery(
      'No questions available yet.',
      { show_alert: true }
    );

  }

  const state = getUserState(ctx.from.id);

  state.currentSubject = subjectId;
  state.currentIndex = 0;
  state.score = 0;
  state.attempted = 0;
  state.correct = 0;
  state.answered = false;

  // Randomize the question order
  state.questionOrder = shuffle(
    questions[subjectId].map((_, index) => index)
  );

  await sendQuestion(ctx);

});


// ------------------------------------------------------------
// SEND QUESTION
// ------------------------------------------------------------

async function sendQuestion(ctx) {

  const state = getUserState(ctx.from.id);

  const subjectId = state.currentSubject;

  if (!subjectId) return;

  const subject = subjectMap[subjectId];

  const order = state.questionOrder || [];

  const questionIndex =
    order[state.currentIndex];

  const question =
    questions[subjectId][questionIndex];

  if (!question) {

    return showResults(ctx);

  }

  state.currentQuestion = question;
  state.answered = false;

  const total = order.length;

  const questionNumber =
    state.currentIndex + 1;

  const progressBar =
    createProgressBar(
      questionNumber,
      total
    );

  const text =

`${subject.emoji} <b>${subject.name.toUpperCase()}</b>

${progressBar}

<b>Question ${questionNumber}/${total}</b>

🧠 <b>${question.topic}</b>

${question.question}

<i>Choose the best answer:</i>`;

  const buttons = question.options.map(option => {

    return [
      Markup.button.callback(
        option,
        `answer_${option.charAt(0)}`
      )
    ];

  });

  buttons.push([
    Markup.button.callback(
      '🏠 Exit Practice',
      'practice_exit'
    )
  ]);

  try {

    if (ctx.callbackQuery) {

      await ctx.editMessageText(
        text,
        {
          parse_mode: 'HTML',
          ...Markup.inlineKeyboard(buttons)
        }
      );

    } else {

      await ctx.replyWithHTML(
        text,
        Markup.inlineKeyboard(buttons)
      );

    }

  } catch (error) {

    console.error('Send question error:', error);

  }

}


// ------------------------------------------------------------
// PROGRESS BAR
// ------------------------------------------------------------

function createProgressBar(current, total) {

  const length = 10;

  const filled =
    Math.round(
      (current / total) * length
    );

  const empty =
    length - filled;

  return (
    '🟩'.repeat(filled) +
    '⬜'.repeat(empty)
  );

}


// ------------------------------------------------------------
// ANSWER BUTTON
// ------------------------------------------------------------

bot.action(/answer_([A-D])/, async (ctx) => {

  await ctx.answerCbQuery();

  const state = getUserState(ctx.from.id);

  const question = state.currentQuestion;

  if (!question) {

    return ctx.answerCbQuery(
      'This question has expired.',
      { show_alert: true }
    );

  }

  // Prevent multiple answers
  if (state.answered) {

    return ctx.answerCbQuery(
      'You already answered this question.',
      { show_alert: true }
    );

  }

  const selectedAnswer =
    ctx.match[1];

  const correctAnswer =
    question.answer;

  const isCorrect =
    selectedAnswer === correctAnswer;

  state.answered = true;

  state.attempted++;

  if (isCorrect) {

    state.correct++;
    state.score++;

  }

  // Find the correct option text
  const correctOption =
    question.options.find(
      option =>
        option.charAt(0) === correctAnswer
    );

  const selectedOption =
    question.options.find(
      option =>
        option.charAt(0) === selectedAnswer
    );

  let resultText;

  if (isCorrect) {

    resultText =

`✅ <b>CORRECT!</b>

Excellent work! 🔥

You selected:
<b>${selectedOption}</b>`;

  } else {

    resultText =

`❌ <b>NOT QUITE</b>

You selected:
<b>${selectedOption}</b>

Correct answer:
<b>${correctOption}</b>`;

  }

  const explanation =

`🧠 <b>Why?</b>

${question.explanation}`;

  await ctx.editMessageText(

`${resultText}

${explanation}`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '➡️ Next Question',
            'next_question'
          )
        ],

        [
          Markup.button.callback(
            '📊 My Results',
            'practice_results'
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


// ------------------------------------------------------------
// NEXT QUESTION
// ------------------------------------------------------------

bot.action('next_question', async (ctx) => {

  await ctx.answerCbQuery();

  const state = getUserState(ctx.from.id);

  if (!state.currentSubject) {

    return showHome(ctx);

  }

  state.currentIndex++;

  const total =
    state.questionOrder
      ? state.questionOrder.length
      : 0;

  if (state.currentIndex >= total) {

    return showResults(ctx);

  }

  await sendQuestion(ctx);

});


// ------------------------------------------------------------
// PRACTICE RESULTS
// ------------------------------------------------------------

bot.action('practice_results', async (ctx) => {

  await ctx.answerCbQuery();

  await showResults(ctx);

});


// ------------------------------------------------------------
// SHOW RESULTS
// ------------------------------------------------------------

async function showResults(ctx) {

  const state = getUserState(ctx.from.id);

  const attempted =
    state.attempted || 0;

  const correct =
    state.correct || 0;

  const total =
    state.questionOrder
      ? state.questionOrder.length
      : attempted;

  let percentage = 0;

  if (attempted > 0) {

    percentage =
      Math.round(
        (correct / attempted) * 100
      );

  }

  let performance;

  if (percentage >= 90) {

    performance =
      '🏆 Outstanding! You really know this.';

  } else if (percentage >= 75) {

    performance =
      '🔥 Great job! You are building strong mastery.';

  } else if (percentage >= 50) {

    performance =
      '💪 Good start! A little more practice will help.';

  } else {

    performance =
      '🌱 Don’t give up. Every mistake is a step toward mastery.';

  }

  const subject =
    state.currentSubject
      ? subjectMap[state.currentSubject]
      : null;

  const subjectName =
    subject
      ? `${subject.emoji} ${subject.name}`
      : 'Practice';

  await ctx.editMessageText(

`🎯 <b>PRACTICE COMPLETE</b>

${subjectName}

━━━━━━━━━━━━━━━━

📚 Questions: <b>${total}</b>
✍️ Attempted: <b>${attempted}</b>
✅ Correct: <b>${correct}</b>
📊 Score: <b>${percentage}%</b>

━━━━━━━━━━━━━━━━

${performance}

<i>Keep practicing. Mastery comes from understanding, not memorizing.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🔄 Practice Again',
            `practice_${state.currentSubject}`
          )
        ],

        [
          Markup.button.callback(
            '📚 Choose Subject',
            'practice'
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


// ------------------------------------------------------------
// PRACTICE MENU
// ------------------------------------------------------------

bot.action('practice', async (ctx) => {

  await ctx.answerCbQuery();

  await ctx.editMessageText(

`✍️ <b>PRACTICE ARENA</b>

This is where knowledge becomes skill.

Choose a subject and solve exam-style questions.

<b>Which subject are you ready for?</b> 👇`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🧬 Biology',
            'practice_biology'
          ),

          Markup.button.callback(
            '⚗️ Chemistry',
            'practice_chemistry'
          )
        ],

        [
          Markup.button.callback(
            '⚛️ Physics',
            'practice_physics'
          ),

          Markup.button.callback(
            '➗ Mathematics',
            'practice_mathematics'
          )
        ],

        [
          Markup.button.callback(
            '📜 History',
            'practice_history'
          ),

          Markup.button.callback(
            '🌍 Geography',
            'practice_geography'
          )
        ],

        [
          Markup.button.callback(
            '📈 Economics',
            'practice_economics'
          ),

          Markup.button.callback(
            '🇬🇧 English',
            'practice_english'
          )
        ],

        [
          Markup.button.callback(
            '🎲 Mixed Practice',
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

});


// ------------------------------------------------------------
// EXIT PRACTICE
// ------------------------------------------------------------

bot.action('practice_exit', async (ctx) => {

  await ctx.answerCbQuery();

  const state =
    getUserState(ctx.from.id);

  state.currentSubject = null;
  state.currentQuestion = null;
  state.questionOrder = [];
  state.currentIndex = 0;
  state.answered = false;

  await ctx.editMessageText(

`✍️ <b>PRACTICE ENDED</b>

No pressure.

Come back whenever you're ready to solve another problem. 💪`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '✍️ Practice Again',
            'practice'
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
// PART 3 — MIXED PRACTICE + DAILY CHALLENGE + PROGRESS
// ============================================================


// ------------------------------------------------------------
// MIXED PRACTICE
// ------------------------------------------------------------

bot.action('mixed_practice', async (ctx) => {

  await ctx.answerCbQuery();

  const state = getUserState(ctx.from.id);

  // Collect questions from every subject
  let mixedQuestions = [];

  Object.keys(questions).forEach(subjectId => {

    questions[subjectId].forEach((question, index) => {

      mixedQuestions.push({
        ...question,
        subjectId: subjectId,
        originalIndex: index
      });

    });

  });

  // Randomize
  mixedQuestions = shuffle(mixedQuestions);

  // Keep the session manageable
  mixedQuestions = mixedQuestions.slice(0, 10);

  state.currentSubject = 'mixed';

  state.mixedQuestions = mixedQuestions;
  state.currentIndex = 0;

  state.score = 0;
  state.attempted = 0;
  state.correct = 0;

  state.currentQuestion = null;
  state.answered = false;

  await sendMixedQuestion(ctx);

});


// ------------------------------------------------------------
// SEND MIXED QUESTION
// ------------------------------------------------------------

async function sendMixedQuestion(ctx) {

  const state = getUserState(ctx.from.id);

  const mixedQuestions =
    state.mixedQuestions || [];

  const question =
    mixedQuestions[state.currentIndex];

  if (!question) {

    return showMixedResults(ctx);

  }

  state.currentQuestion = question;
  state.answered = false;

  const questionNumber =
    state.currentIndex + 1;

  const total =
    mixedQuestions.length;

  const subject =
    subjectMap[question.subjectId];

  const progressBar =
    createProgressBar(
      questionNumber,
      total
    );

  const text =

`🎲 <b>MIXED PRACTICE</b>

${progressBar}

<b>Question ${questionNumber}/${total}</b>

${subject ? `${subject.emoji} <b>${subject.name}</b>` : ''}

🧠 <b>${question.topic}</b>

${question.question}

<i>Think carefully before choosing.</i>`;

  const buttons =
    question.options.map(option => {

      return [
        Markup.button.callback(
          option,
          `mixed_answer_${option.charAt(0)}`
        )
      ];

    });

  buttons.push([
    Markup.button.callback(
      '🏠 Exit',
      'practice_exit'
    )
  ]);

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

bot.action(/mixed_answer_([A-D])/, async (ctx) => {

  await ctx.answerCbQuery();

  const state =
    getUserState(ctx.from.id);

  const question =
    state.currentQuestion;

  if (!question) return;

  if (state.answered) {

    return ctx.answerCbQuery(
      'You already answered this question.',
      { show_alert: true }
    );

  }

  const selected =
    ctx.match[1];

  const correct =
    question.answer;

  const isCorrect =
    selected === correct;

  state.answered = true;

  state.attempted++;

  if (isCorrect) {

    state.correct++;
    state.score++;

  }

  const selectedOption =
    question.options.find(
      option =>
        option.charAt(0) === selected
    );

  const correctOption =
    question.options.find(
      option =>
        option.charAt(0) === correct
    );

  let result;

  if (isCorrect) {

    result =

`✅ <b>CORRECT!</b>

Your answer:
<b>${selectedOption}</b>

🔥 Keep going!`;

  } else {

    result =

`❌ <b>NOT QUITE</b>

Your answer:
<b>${selectedOption}</b>

Correct answer:
<b>${correctOption}</b>`;

  }

  await ctx.editMessageText(

`${result}

━━━━━━━━━━━━━━━━

🧠 <b>Explanation</b>

${question.explanation}`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '➡️ Next Question',
            'mixed_next'
          )
        ],

        [
          Markup.button.callback(
            '📊 Results',
            'mixed_results'
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


// ------------------------------------------------------------
// NEXT MIXED QUESTION
// ------------------------------------------------------------

bot.action('mixed_next', async (ctx) => {

  await ctx.answerCbQuery();

  const state =
    getUserState(ctx.from.id);

  state.currentIndex++;

  const total =
    state.mixedQuestions
      ? state.mixedQuestions.length
      : 0;

  if (state.currentIndex >= total) {

    return showMixedResults(ctx);

  }

  await sendMixedQuestion(ctx);

});


// ------------------------------------------------------------
// MIXED RESULTS
// ------------------------------------------------------------

bot.action('mixed_results', async (ctx) => {

  await ctx.answerCbQuery();

  await showMixedResults(ctx);

});


async function showMixedResults(ctx) {

  const state =
    getUserState(ctx.from.id);

  const attempted =
    state.attempted || 0;

  const correct =
    state.correct || 0;

  const total =
    state.mixedQuestions
      ? state.mixedQuestions.length
      : attempted;

  const percentage =
    attempted > 0
      ? Math.round(
          (correct / attempted) * 100
        )
      : 0;

  let message;

  if (percentage >= 90) {

    message =
      '🏆 Excellent! Your knowledge is strong across subjects.';

  } else if (percentage >= 75) {

    message =
      '🔥 Great performance! Keep sharpening your weak areas.';

  } else if (percentage >= 50) {

    message =
      '💪 You are making progress. More practice will build confidence.';

  } else {

    message =
      '🌱 This is exactly why practice matters. Learn from every mistake.';

  }

  await ctx.editMessageText(

`🎲 <b>MIXED PRACTICE COMPLETE</b>

━━━━━━━━━━━━━━━━

📝 Questions: <b>${total}</b>
✅ Correct: <b>${correct}</b>
❌ Incorrect: <b>${attempted - correct}</b>
📊 Score: <b>${percentage}%</b>

━━━━━━━━━━━━━━━━

${message}

<i>Don't just count your mistakes.
Understand them.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🔄 Try Again',
            'mixed_practice'
          )
        ],

        [
          Markup.button.callback(
            '✍️ Practice',
            'practice'
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
// DAILY CHALLENGE
// ============================================================


// ------------------------------------------------------------
// CREATE DETERMINISTIC DAILY QUESTION
// ------------------------------------------------------------

function getDailyQuestion() {

  const allQuestions = [];

  Object.keys(questions).forEach(subjectId => {

    questions[subjectId].forEach((question, index) => {

      allQuestions.push({

        ...question,

        subjectId,
        originalIndex: index

      });

    });

  });

  const today =
    new Date();

  const dateNumber =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  const index =
    dateNumber % allQuestions.length;

  return allQuestions[index];

}


// ------------------------------------------------------------
// DAILY CHALLENGE MENU
// ------------------------------------------------------------

bot.action('challenge', async (ctx) => {

  await ctx.answerCbQuery();

  const daily =
    getDailyQuestion();

  const subject =
    subjectMap[daily.subjectId];

  await ctx.editMessageText(

`🎯 <b>DAILY CHALLENGE</b>

One question.
One chance.
One opportunity to sharpen your brain. 🧠

━━━━━━━━━━━━━━━━

${subject.emoji} <b>${subject.name}</b>

🧠 ${daily.topic}

Come back tomorrow for a new challenge.`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🔥 Start Challenge',
            'start_daily'
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


// ------------------------------------------------------------
// START DAILY CHALLENGE
// ------------------------------------------------------------

bot.action('start_daily', async (ctx) => {

  await ctx.answerCbQuery();

  const daily =
    getDailyQuestion();

  const state =
    getUserState(ctx.from.id);

  state.dailyQuestion =
    daily;

  state.dailyAnswered =
    false;

  const subject =
    subjectMap[daily.subjectId];

  const buttons =
    daily.options.map(option => [

      Markup.button.callback(
        option,
        `daily_answer_${option.charAt(0)}`
      )

    ]);

  buttons.push([
    Markup.button.callback(
      '🏠 Exit',
      'home'
    )
  ]);

  await ctx.editMessageText(

`🎯 <b>TODAY'S CHALLENGE</b>

${subject.emoji} <b>${subject.name}</b>

🧠 <b>${daily.topic}</b>

━━━━━━━━━━━━━━━━

${daily.question}

━━━━━━━━━━━━━━━━

<i>Trust your reasoning.</i>`,

    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    }

  );

});


// ------------------------------------------------------------
// DAILY ANSWER
// ------------------------------------------------------------

bot.action(/daily_answer_([A-D])/, async (ctx) => {

  await ctx.answerCbQuery();

  const state =
    getUserState(ctx.from.id);

  const question =
    state.dailyQuestion;

  if (!question) {

    return ctx.answerCbQuery(
      'Daily challenge unavailable.',
      { show_alert: true }
    );

  }

  if (state.dailyAnswered) {

    return ctx.answerCbQuery(
      'You already completed today’s challenge.',
      { show_alert: true }
    );

  }

  state.dailyAnswered = true;

  const selected =
    ctx.match[1];

  const correct =
    question.answer;

  const isCorrect =
    selected === correct;

  const subject =
    subjectMap[question.subjectId];

  const correctOption =
    question.options.find(
      option =>
        option.charAt(0) === correct
    );

  let result;

  if (isCorrect) {

    result =

`🎉 <b>YOU GOT IT!</b>

🔥 Excellent reasoning.

You selected the correct answer:
<b>${correctOption}</b>`;

  } else {

    result =

`💡 <b>GOOD ATTEMPT!</b>

The correct answer is:
<b>${correctOption}</b>`;

  }

  await ctx.editMessageText(

`${result}

━━━━━━━━━━━━━━━━

🧠 <b>Explanation</b>

${question.explanation}

━━━━━━━━━━━━━━━━

📅 <i>Come back tomorrow for another challenge.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '✍️ More Practice',
            'practice'
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
// PROGRESS SYSTEM
// ============================================================


// ------------------------------------------------------------
// PROGRESS MENU
// ------------------------------------------------------------

bot.action('progress', async (ctx) => {

  await ctx.answerCbQuery();

  const state =
    getUserState(ctx.from.id);

  const attempted =
    state.attempted || 0;

  const correct =
    state.correct || 0;

  const accuracy =
    attempted > 0
      ? Math.round(
          (correct / attempted) * 100
        )
      : 0;

  const remaining =
    attempted - correct;

  let level;

  if (accuracy >= 90) {

    level = '🏆 Master';

  } else if (accuracy >= 75) {

    level = '🔥 Advanced';

  } else if (accuracy >= 50) {

    level = '📚 Developing';

  } else {

    level = '🌱 Getting Started';

  }

  await ctx.editMessageText(

`📊 <b>MY PROGRESS</b>

━━━━━━━━━━━━━━━━

🎓 Level
<b>${level}</b>

✍️ Questions Attempted
<b>${attempted}</b>

✅ Correct Answers
<b>${correct}</b>

❌ Incorrect Answers
<b>${remaining}</b>

🎯 Accuracy
<b>${accuracy}%</b>

━━━━━━━━━━━━━━━━

${getProgressMessage(accuracy)}`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '✍️ Practice',
            'practice'
          )
        ],

        [
          Markup.button.callback(
            '🎯 Daily Challenge',
            'challenge'
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


// ------------------------------------------------------------
// PROGRESS MESSAGE
// ------------------------------------------------------------

function getProgressMessage(accuracy) {

  if (accuracy === 0) {

    return (
      '🚀 <b>Your journey starts here.</b>\n\n' +
      'Solve your first problem and start building your progress.'
    );

  }

  if (accuracy < 50) {

    return (
      '🌱 <b>Keep going.</b>\n\n' +
      'Mistakes are not failures. They show you exactly what to study next.'
    );

  }

  if (accuracy < 75) {

    return (
      '💪 <b>You are improving.</b>\n\n' +
      'Review the questions you missed and try them again.'
    );

  }

  if (accuracy < 90) {

    return (
      '🔥 <b>Strong progress.</b>\n\n' +
      'You are getting closer to exam-ready performance.'
    );

  }

  return (
    '🏆 <b>Excellent performance.</b>\n\n' +
    'Keep challenging yourself with mixed and exam-style questions.'
  );

}


// ============================================================
// EXAM READINESS
// ============================================================

bot.action('exam', async (ctx) => {

  await ctx.answerCbQuery();

  await ctx.editMessageText(

`🧠 <b>EXAM READY</b>

Your exam is not won on exam day.

It is won by what you repeatedly practice before it.

━━━━━━━━━━━━━━━━

🎯 <b>1. Understand</b>
Don't memorize blindly. Understand why the answer works.

✍️ <b>2. Practice</b>
Solve questions without looking at the answer first.

🔄 <b>3. Review</b>
Your mistakes are your study map.

⏱️ <b>4. Time Yourself</b>
Practice solving under realistic time pressure.

🧠 <b>5. Stay Calm</b>
A clear mind helps you use what you already know.

━━━━━━━━━━━━━━━━

<b>Small progress every day beats panic at the end.</b>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '✍️ Practice Now',
            'practice'
          )
        ],

        [
          Markup.button.callback(
            '🎯 Daily Challenge',
            'challenge'
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
// PART 4 — STUDY BUDDY + SUPPORT + TEXT HANDLER + VERCEL
// ============================================================


// ============================================================
// STUDY BUDDY
// ============================================================

bot.action('buddy', async (ctx) => {

  await ctx.answerCbQuery();

  await ctx.editMessageText(

`💬 <b>STUDY BUDDY</b>

You don't have to study through everything alone.

Tell me how you're feeling right now 👇

<i>No judgment. Just support.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '😊 I feel good',
            'mood_good'
          ),

          Markup.button.callback(
            '😌 I feel calm',
            'mood_calm'
          )
        ],

        [
          Markup.button.callback(
            '😰 I feel stressed',
            'mood_stressed'
          ),

          Markup.button.callback(
            '😤 I feel frustrated',
            'mood_frustrated'
          )
        ],

        [
          Markup.button.callback(
            '😔 I feel discouraged',
            'mood_discouraged'
          ),

          Markup.button.callback(
            '😟 I feel anxious',
            'mood_anxious'
          )
        ],

        [
          Markup.button.callback(
            '💬 I just want to talk',
            'mood_talk'
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
// BUDDY RESPONSES
// ============================================================

const buddyResponses = {

  mood_good: {

    text:
`😊 <b>That's great to hear.</b>

Protect that energy.

You don't need to study for hours today. Even one focused session can move you forward.

What do you want to do next?`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Practice',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '🎯 Daily Challenge',
          'challenge'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  },


  mood_calm: {

    text:
`😌 <b>Good.</b>

A calm mind is a powerful study tool.

This is a good moment to solve a few problems while your mind is clear.

Ready?`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Start Practicing',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '🎯 Challenge Me',
          'challenge'
        )
      ],
      [
        Markup.button.callback(
          '💬 Back to Buddy',
          'buddy'
        )
      ]
    ]

  },


  mood_stressed: {

    text:
`😰 <b>Take a breath.</b>

You don't have to solve your entire Grade 12 journey tonight.

Let's make the next step small.

Try this:

<b>1.</b> Take a slow breath.
<b>2.</b> Put your phone distractions away.
<b>3.</b> Choose ONE subject.
<b>4.</b> Solve just 3 questions.

Small steps count. 🌱`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Just 3 Questions',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '🧠 Exam Tips',
          'exam'
        )
      ],
      [
        Markup.button.callback(
          '💬 Talk to Me',
          'buddy_talk'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  },


  mood_frustrated: {

    text:
`😤 <b>It's okay to be frustrated.</b>

Sometimes the hardest part isn't the question.

It's seeing a question again and again without understanding it.

Don't just memorize the answer.

Let's break the problem down and understand <b>why</b> the answer works. 🧠`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Solve a Problem',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '💬 Talk About It',
          'buddy_talk'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  },


  mood_discouraged: {

    text:
`😔 <b>One bad result does not define you.</b>

Getting a question wrong doesn't mean you can't learn it.

It means you've found something that needs another explanation.

Your job isn't to be perfect.

Your job is to keep improving. 🌱`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Try Again',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '📊 See My Progress',
          'progress'
        )
      ],
      [
        Markup.button.callback(
          '💬 Talk to Me',
          'buddy_talk'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  },


  mood_anxious: {

    text:
`😟 <b>That exam anxiety is real.</b>

But you don't need to know everything at once.

Focus on the next question.

Then the next one.

Then the next.

That's how preparation is built — one problem at a time. 🧠`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Practice',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '🧠 Exam Ready',
          'exam'
        )
      ],
      [
        Markup.button.callback(
          '💬 Talk to Me',
          'buddy_talk'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  },


  mood_talk: {

    text:
`💬 <b>I'm listening.</b>

You can tell me what's bothering you.

For example:

• "I'm scared of failing."
• "I don't understand physics."
• "I can't concentrate."
• "I don't know where to start."

Just send me a message.`,

    buttons: [
      [
        Markup.button.callback(
          '🔙 Back to Buddy',
          'buddy'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  }

};


// ============================================================
// MOOD HANDLER
// ============================================================

bot.action(
  [
    'mood_good',
    'mood_calm',
    'mood_stressed',
    'mood_frustrated',
    'mood_discouraged',
    'mood_anxious',
    'mood_talk'
  ],
  async (ctx) => {

    await ctx.answerCbQuery();

    const response =
      buddyResponses[ctx.match[0]];

    if (!response) return;

    await ctx.editMessageText(

      response.text,

      {
        parse_mode: 'HTML',

        ...Markup.inlineKeyboard(
          response.buttons
        )
      }

    );

  }
);


// ============================================================
// TALK MODE
// ============================================================

bot.action('buddy_talk', async (ctx) => {

  await ctx.answerCbQuery();

  const state =
    getUserState(ctx.from.id);

  state.talkMode = true;

  await ctx.editMessageText(

`💬 <b>TALK TO FINEBOT</b>

I'm listening.

Send me what's on your mind.

You could say:

<i>"I'm scared I'll fail."</i>

<i>"I can't concentrate."</i>

<i>"Physics is confusing me."</i>

<i>"I don't know how to study."</i>

I'll try to help you take the next useful step.

━━━━━━━━━━━━━━━━

<b>Send your message below 👇</b>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🔙 Back to Buddy',
            'buddy'
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
// SIMPLE BUDDY MESSAGE ANALYSIS
// ============================================================

function getBuddyReply(message) {

  const text =
    message.toLowerCase();

  // Failure / exam fear
  if (
    text.includes('fail') ||
    text.includes('failing') ||
    text.includes('failed')
  ) {

    return {

      message:
`💬 <b>Let's slow that thought down.</b>

Being afraid of failing doesn't mean you will fail.

Instead of thinking about the entire exam, let's focus on something you can control right now:

<b>One topic.
One problem.
One improvement.</b>

You don't need to become perfect today.

You just need to move forward.`,

      buttons: [
        [
          Markup.button.callback(
            '✍️ Solve a Problem',
            'practice'
          )
        ],
        [
          Markup.button.callback(
            '🧠 Exam Tips',
            'exam'
          )
        ],
        [
          Markup.button.callback(
            '🏠 Main Menu',
            'home'
          )
        ]
      ]

    };

  }


  // Concentration
  if (
    text.includes('concentrate') ||
    text.includes('focus') ||
    text.includes('distracted')
  ) {

    return {

      message:
`🧠 <b>Let's make studying smaller.</b>

Try a simple focus session:

⏱️ <b>20 minutes</b>
📚 Choose one topic
📵 Remove distractions
✍️ Solve 3–5 problems
☕ Take a short break

You don't need unlimited motivation.

You need a small starting point.`,

      buttons: [
        [
          Markup.button.callback(
            '✍️ Start Practice',
            'practice'
          )
        ],
        [
          Markup.button.callback(
            '🏠 Main Menu',
            'home'
          )
        ]
      ]

    };

  }


  // Confusion
  if (
    text.includes('confus') ||
    text.includes("don't understand") ||
    text.includes('do not understand') ||
    text.includes('understand')
  ) {

    return {

      message:
`🧠 <b>Not understanding something is normal.</b>

Don't memorize the answer yet.

First ask:

<b>1.</b> What information do I have?
<b>2.</b> What am I trying to find?
<b>3.</b> Which concept or formula connects them?
<b>4.</b> Can I solve a simpler version?

That's how problem solving becomes easier.`,

      buttons: [
        [
          Markup.button.callback(
            '✍️ Practice',
            'practice'
          )
        ],
        [
          Markup.button.callback(
            '💬 More Support',
            'buddy'
          )
        ]
      ]

    };

  }


  // Generic supportive response
  return {

    message:
`💬 <b>I hear you.</b>

Whatever you're dealing with, you don't have to solve everything at once.

Let's focus on the next useful step.

You can practice, review your progress, prepare for exams, or simply keep talking.`,

    buttons: [
      [
        Markup.button.callback(
          '✍️ Practice',
          'practice'
        )
      ],
      [
        Markup.button.callback(
          '📊 My Progress',
          'progress'
        )
      ],
      [
        Markup.button.callback(
          '💬 Keep Talking',
          'buddy_talk'
        )
      ],
      [
        Markup.button.callback(
          '🏠 Main Menu',
          'home'
        )
      ]
    ]

  };

}


// ============================================================
// CONTACT / SUPPORT
// ============================================================

bot.action('contact', async (ctx) => {

  await ctx.answerCbQuery();

  await ctx.editMessageText(

`📞 <b>FINEBOT SUPPORT</b>

Need help?

━━━━━━━━━━━━━━━━

🛠️ <b>Technical Problem</b>
Tell us what went wrong.

💳 <b>Payment Problem</b>
Send your payment details and we'll help.

📝 <b>Wrong Question</b>
Tell us which question needs correction.

💡 <b>Content Feedback</b>
Your feedback helps us improve FineBot.

━━━━━━━━━━━━━━━━

📧 <b>finebot.support@gmail.com</b>

<i>Please don't send your password, OTP, or private payment credentials.</i>`,

    {
      parse_mode: 'HTML',

      ...Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '💬 Study Buddy',
            'buddy'
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
// TEXT MESSAGE HANDLER
// ============================================================

bot.on('text', async (ctx) => {

  const message =
    ctx.message.text.trim();

  const state =
    getUserState(ctx.from.id);


  // ----------------------------------------------------------
  // BUDDY TALK MODE
  // ----------------------------------------------------------

  if (state.talkMode) {

    const reply =
      getBuddyReply(message);

    await ctx.replyWithHTML(
      reply.message,
      Markup.inlineKeyboard(
        reply.buttons
      )
    );

    return;

  }


  // ----------------------------------------------------------
  // IF USER SENT TEXT DURING A PRACTICE QUESTION
  // ----------------------------------------------------------

  if (
    state.currentQuestion &&
    !state.answered
  ) {

    await ctx.replyWithHTML(

`✍️ <b>This question uses answer buttons.</b>

Choose <b>A, B, C, or D</b> from the buttons above.

Take your time and think before answering. 🧠`

    );

    return;

  }


  // ----------------------------------------------------------
  // SIMPLE COMMAND-LIKE TEXT
  // ----------------------------------------------------------

  const lower =
    message.toLowerCase();


  if (
    lower === 'menu' ||
    lower === 'home' ||
    lower === 'start'
  ) {

    await showHome(ctx);

    return;

  }


  if (
    lower === 'practice' ||
    lower === 'questions'
  ) {

    await ctx.replyWithHTML(
      '✍️ <b>Practice Arena</b>\n\nChoose a subject:',
      Markup.inlineKeyboard([

        [
          Markup.button.callback(
            '🧬 Biology',
            'practice_biology'
          ),

          Markup.button.callback(
            '⚗️ Chemistry',
            'practice_chemistry'
          )
        ],

        [
          Markup.button.callback(
            '⚛️ Physics',
            'practice_physics'
          ),

          Markup.button.callback(
            '➗ Mathematics',
            'practice_mathematics'
          )
        ],

        [
          Markup.button.callback(
            '📜 History',
            'practice_history'
          ),

          Markup.button.callback(
            '🌍 Geography',
            'practice_geography'
          )
        ],

        [
          Markup.button.callback(
            '📈 Economics',
            'practice_economics'
          ),

          Markup.button.callback(
            '🇬🇧 English',
            'practice_english'
          )
        ],

        [
          Markup.button.callback(
            '🎲 Mixed Practice',
            'mixed_practice'
          )
        ]

      ])
    );

    return;

  }


  // ----------------------------------------------------------
  // UNKNOWN TEXT
  // ----------------------------------------------------------

  await ctx.replyWithHTML(

`💬 <b>I'm here to help.</b>

Use the buttons below to continue, or send me a message if you want to talk.`,

    mainKeyboard()

  );

});


// ============================================================
// ERROR HANDLING
// ============================================================

bot.catch((error, ctx) => {

  console.error(
    'FineBot error:',
    error
  );

});


// ============================================================
// VERCEL WEBHOOK HANDLER
// ============================================================

module.exports = async (req, res) => {

  try {

    if (req.method !== 'POST') {

      res.status(200).send('FineBot is running.');

      return;

    }

    await bot.handleUpdate(
      req.body,
      res
    );

  } catch (error) {

    console.error(
      'Webhook error:',
      error
    );

    // Telegram should still receive a successful response
    res.status(200).send('OK');

  }

};