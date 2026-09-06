const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// ============================================================
// FINEBOT — GRADE 12 MASTERING BOT
// ============================================================

// ------------------------------------------------------------
// SUBJECTS
// ------------------------------------------------------------

const subjects = {
  natural: [
    { id: "biology", name: "Biology", emoji: "🧬" },
    { id: "chemistry", name: "Chemistry", emoji: "⚗️" },
    { id: "physics", name: "Physics", emoji: "⚛️" },
    { id: "mathematics", name: "Mathematics", emoji: "➗" }
  ],

  social: [
    { id: "history", name: "History", emoji: "📜" },
    { id: "geography", name: "Geography", emoji: "🌍" },
    { id: "economics", name: "Economics", emoji: "📈" },
    { id: "english", name: "English", emoji: "🇬🇧" }
  ]
};


// ------------------------------------------------------------
// QUESTION BANK
// ------------------------------------------------------------

const questionBank = {

  Biology: [
    {
      question: "What is the powerhouse of the cell?",
      answer: "mitochondria",
      explanation:
        "Mitochondria produce most of the cell's usable energy in the form of ATP."
    },
    {
      question: "What molecule carries genetic information?",
      answer: "DNA",
      explanation:
        "DNA stores the genetic instructions used by living organisms."
    }
  ],

  Chemistry: [
    {
      question: "What is the chemical formula of water?",
      answer: "H2O",
      explanation:
        "A water molecule contains two hydrogen atoms and one oxygen atom."
    },
    {
      question: "What is the pH of a neutral solution at 25°C?",
      answer: "7",
      explanation:
        "At 25°C, a neutral solution has a pH of 7."
    }
  ],

  Physics: [
    {
      question: "What is the formula for force?",
      answer: "F = ma",
      explanation:
        "Newton's second law states that force equals mass multiplied by acceleration."
    },
    {
      question: "What is the SI unit of force?",
      answer: "newton",
      explanation:
        "The SI unit of force is the newton (N)."
    }
  ],

  Mathematics: [
    {
      question: "Solve: 5x + 3 = 13.",
      answer: "2",
      explanation:
        "5x = 10, therefore x = 2."
    },
    {
      question: "What is the derivative of x²?",
      answer: "2x",
      explanation:
        "Using the power rule, d(x²)/dx = 2x."
    }
  ],

  History: [
    {
      question:
        "According to Ethiopian tradition, who is regarded as the first emperor of Ethiopia?",
      answer: "Menelik I",
      explanation:
        "Menelik I is traditionally regarded as the first emperor of Ethiopia."
    }
  ],

  Geography: [
    {
      question: "What is the capital city of Ethiopia?",
      answer: "Addis Ababa",
      explanation:
        "Addis Ababa is the capital and largest city of Ethiopia."
    }
  ],

  Economics: [
    {
      question: "What is inflation?",
      answer: "increase in prices",
      explanation:
        "Inflation is a sustained increase in the general price level of goods and services."
    }
  ],

  English: [
    {
      question: "What is a noun?",
      answer: "person place thing",
      explanation:
        "A noun is traditionally described as a word naming a person, place, thing, or idea."
    }
  ]
};


// ------------------------------------------------------------
// SUBJECT NAME MAP
// ------------------------------------------------------------

const subjectNames = {
  biology: "Biology",
  chemistry: "Chemistry",
  physics: "Physics",
  mathematics: "Mathematics",
  history: "History",
  geography: "Geography",
  economics: "Economics",
  english: "English"
};


// ------------------------------------------------------------
// USER SESSION STATE
// ------------------------------------------------------------

const userState = {};

function getUser(userId) {

  if (!userState[userId]) {

    userState[userId] = {
      subject: null,
      questionIndex: 0,
      score: 0,
      answered: 0,
      total: 0,
      questions: null
    };

  }

  return userState[userId];
}


// ------------------------------------------------------------
// MAIN KEYBOARD
// ------------------------------------------------------------

const mainKeyboard = () =>
  Markup.inlineKeyboard([

    [
      Markup.button.callback("📚 Learn", "learn"),
      Markup.button.callback("✍️ Practice", "practice")
    ],

    [
      Markup.button.callback("🎯 Daily Challenge", "daily"),
      Markup.button.callback("🧠 Exam Tips", "tips")
    ],

    [
      Markup.button.callback("📊 My Progress", "progress"),
      Markup.button.callback("💬 Study Buddy", "buddy")
    ],

    [
      Markup.button.callback("📞 Contact", "contact")
    ]

  ]);


// ------------------------------------------------------------
// HOME BUTTON
// ------------------------------------------------------------

const backHomeKeyboard = () =>
  Markup.inlineKeyboard([
    [
      Markup.button.callback("🏠 Main Menu", "home")
    ]
  ]);


// ------------------------------------------------------------
// EDIT MENU HELPER
// ------------------------------------------------------------

async function editMenu(ctx, text, keyboard) {

  try {

    if (ctx.callbackQuery && ctx.callbackQuery.message) {

      await ctx.editMessageText(text, {
        parse_mode: "HTML",
        ...keyboard
      });

      await ctx.answerCbQuery();

      return;
    }

  } catch (error) {

    console.log("Menu edit fallback:", error.message);

  }

  await ctx.replyWithHTML(text, keyboard);
}


// ------------------------------------------------------------
// HOME SCREEN
// ------------------------------------------------------------

async function showHome(ctx) {

  const text =
    `🌟 <b>WELCOME TO FINEBOT</b> 🌟\n\n` +
    `<b>Ethiopian Grade 12 Mastering Buddy</b>\n\n` +
    `Your goal isn't just to memorize.\n` +
    `It's to <b>understand → practice → improve → master.</b>\n\n` +
    `🎯 <i>What do you want to do today?</i>`;

  await editMenu(
    ctx,
    text,
    mainKeyboard()
  );
}


// ------------------------------------------------------------
// START
// ------------------------------------------------------------

bot.start(async (ctx) => {

  await showHome(ctx);

});


// ------------------------------------------------------------
// HOME
// ------------------------------------------------------------

bot.action("home", async (ctx) => {

  await showHome(ctx);

});


// ------------------------------------------------------------
// LEARN MENU
// ------------------------------------------------------------

bot.action("learn", async (ctx) => {

  const text =
    `📚 <b>LEARN</b>\n\n` +
    `Choose your Grade 12 stream:\n\n` +
    `🌿 <b>Natural Science</b>\n` +
    `Biology • Chemistry • Physics • Mathematics\n\n` +
    `🏛️ <b>Social Science</b>\n` +
    `History • Geography • Economics • English`;

  await editMenu(
    ctx,
    text,
    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "🌿 Natural Science",
          "natural"
        )
      ],

      [
        Markup.button.callback(
          "🏛️ Social Science",
          "social"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])
  );

});


// ------------------------------------------------------------
// NATURAL SCIENCE
// ------------------------------------------------------------

bot.action("natural", async (ctx) => {

  const buttons = subjects.natural.map(subject =>
    Markup.button.callback(
      `${subject.emoji} ${subject.name}`,
      `learn_${subject.id}`
    )
  );

  await editMenu(
    ctx,
    `🌿 <b>NATURAL SCIENCE</b>\n\n` +
    `Choose a subject to explore:`,
    Markup.inlineKeyboard([

      [
        buttons[0],
        buttons[1]
      ],

      [
        buttons[2],
        buttons[3]
      ],

      [
        Markup.button.callback(
          "🔙 Streams",
          "learn"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])
  );

});


// ------------------------------------------------------------
// SOCIAL SCIENCE
// ------------------------------------------------------------

bot.action("social", async (ctx) => {

  const buttons = subjects.social.map(subject =>
    Markup.button.callback(
      `${subject.emoji} ${subject.name}`,
      `learn_${subject.id}`
    )
  );

  await editMenu(
    ctx,
    `🏛️ <b>SOCIAL SCIENCE</b>\n\n` +
    `Choose a subject to explore:`,
    Markup.inlineKeyboard([

      [
        buttons[0],
        buttons[1]
      ],

      [
        buttons[2],
        buttons[3]
      ],

      [
        Markup.button.callback(
          "🔙 Streams",
          "learn"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])
  );

});

// ============================================================
// PART 2 — LEARNING + PRACTICE ENGINE
// ============================================================


// ------------------------------------------------------------
// SUBJECT PAGE
// ------------------------------------------------------------

bot.action(/^learn_(.+)$/, async (ctx) => {

  const id = ctx.match[1];

  const subject = subjectNames[id];

  if (!subject) return;

  const questionCount =
    questionBank[subject]
      ? questionBank[subject].length
      : 0;

  await editMenu(
    ctx,

    `📘 <b>${subject}</b>\n\n` +

    `Build your understanding, then test yourself.\n\n` +

    `📝 Practice questions: <b>${questionCount}</b>\n\n` +

    `Choose what you want to do:`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "✍️ Practice",
          `start_${id}`
        )
      ],

      [
        Markup.button.callback(
          "📖 Subject Overview",
          `overview_${id}`
        )
      ],

      [
        Markup.button.callback(
          "🔙 Subjects",
          "learn"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])
  );

});


// ------------------------------------------------------------
// SUBJECT OVERVIEW
// ------------------------------------------------------------

bot.action(/^overview_(.+)$/, async (ctx) => {

  const id = ctx.match[1];

  const subject = subjectNames[id];

  if (!subject) return;

  await editMenu(
    ctx,

    `📖 <b>${subject} — STUDY MODE</b>\n\n` +

    `Use this section to build your understanding before jumping into practice.\n\n` +

    `💡 <b>Mastery Rule</b>\n` +
    `Don't memorize an answer you don't understand.\n\n` +

    `Understand the idea → explain it yourself → practice it.\n\n` +

    `🎯 <i>Ready to test yourself?</i>`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "✍️ Start Practice",
          `start_${id}`
        )
      ],

      [
        Markup.button.callback(
          "🔙 Subject",
          `learn_${id}`
        )
      ]

    ])
  );

});


// ------------------------------------------------------------
// PRACTICE MENU
// ------------------------------------------------------------

bot.action("practice", async (ctx) => {

  await editMenu(
    ctx,

    `✍️ <b>PRACTICE ARENA</b>\n\n` +

    `Choose a subject and challenge yourself.\n\n` +

    `🔥 <i>Don't worry about getting everything right.</i>\n` +

    `Every wrong answer shows you what to improve.`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "🧬 Biology",
          "start_biology"
        ),

        Markup.button.callback(
          "⚗️ Chemistry",
          "start_chemistry"
        )
      ],

      [
        Markup.button.callback(
          "⚛️ Physics",
          "start_physics"
        ),

        Markup.button.callback(
          "➗ Mathematics",
          "start_mathematics"
        )
      ],

      [
        Markup.button.callback(
          "📜 History",
          "start_history"
        ),

        Markup.button.callback(
          "🌍 Geography",
          "start_geography"
        )
      ],

      [
        Markup.button.callback(
          "📈 Economics",
          "start_economics"
        ),

        Markup.button.callback(
          "🇬🇧 English",
          "start_english"
        )
      ],

      [
        Markup.button.callback(
          "🎲 Mixed Practice",
          "start_mixed"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])
  );

});


// ------------------------------------------------------------
// START PRACTICE
// ------------------------------------------------------------

bot.action(/^start_(.+)$/, async (ctx) => {

  const id = ctx.match[1];

  let questions = [];

  // Mixed practice
  if (id === "mixed") {

    Object.values(questionBank).forEach(list => {
      questions.push(...list);
    });

  }

  // Subject practice
  else {

    const subject = subjectNames[id];

    if (!subject || !questionBank[subject]) {
      return;
    }

    questions = questionBank[subject];

  }

  const user = getUser(ctx.from.id);

  user.subject = id;
  user.questionIndex = 0;
  user.score = 0;
  user.answered = 0;
  user.total = questions.length;
  user.questions = questions;

  await sendQuestion(ctx);

});


// ------------------------------------------------------------
// SEND QUESTION
// ------------------------------------------------------------

async function sendQuestion(ctx) {

  const user = getUser(ctx.from.id);

  // Practice finished
  if (
    !user.questions ||
    user.questionIndex >= user.questions.length
  ) {

    await showResults(ctx);

    return;

  }

  const q =
    user.questions[user.questionIndex];

  const number =
    user.questionIndex + 1;

  const total =
    user.questions.length;

  // Visual progress bar
  const progress =
    "🟩".repeat(
      Math.min(
        Math.round(
          (number - 1) / total * 5
        ),
        5
      )
    ) +
    "⬜".repeat(
      Math.max(
        0,
        5 -
        Math.min(
          Math.round(
            (number - 1) / total * 5
          ),
          5
        )
      )
    );

  const text =
    `✍️ <b>PRACTICE ARENA</b>\n\n` +

    `Question <b>${number}/${total}</b>\n\n` +

    `${q.question}\n\n` +

    `${progress}\n\n` +

    `💬 <i>Type your answer below.</i>`;

  await editMenu(
    ctx,
    text,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "🏠 Quit Practice",
          "home"
        )
      ]

    ])
  );

}


// ------------------------------------------------------------
// NEXT QUESTION
// ------------------------------------------------------------

bot.action("next_question", async (ctx) => {

  const user = getUser(ctx.from.id);

  user.questionIndex++;

  await sendQuestion(ctx);

});


// ------------------------------------------------------------
// RESULTS
// ------------------------------------------------------------

async function showResults(ctx) {

  const user = getUser(ctx.from.id);

  const percentage =
    user.total > 0
      ? Math.round(
          (user.score / user.total) * 100
        )
      : 0;

  let level;

  if (percentage >= 80) {

    level =
      "🔥 Excellent! You're mastering this.";

  }

  else if (percentage >= 60) {

    level =
      "💪 Good work. A little more practice will make you stronger.";

  }

  else {

    level =
      "🌱 Keep practicing. Every mistake is part of mastering.";

  }

  await editMenu(

    ctx,

    `🏁 <b>PRACTICE COMPLETE</b>\n\n` +

    `🎯 Score: <b>${user.score}/${user.total}</b>\n` +

    `📊 Accuracy: <b>${percentage}%</b>\n\n` +

    `${level}\n\n` +

    `Remember:\n` +

    `<i>Practice doesn't make perfect.\n` +
    `Deliberate practice makes progress.</i>`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "🔄 Practice Again",
          "practice"
        )
      ],

      [
        Markup.button.callback(
          "📊 My Progress",
          "progress"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])

  );

  user.questions = null;

}


// ------------------------------------------------------------
// ANSWER CHECKER
// ------------------------------------------------------------

bot.on("text", async (ctx) => {

  const user =
    userState[ctx.from.id];

  // No active practice
  if (
    !user ||
    !user.questions
  ) {

    await ctx.replyWithHTML(

      `🤔 <b>Let's get back on track.</b>\n\n` +

      `Use the menu below to continue your Grade 12 journey.`,

      mainKeyboard()

    );

    return;

  }

  const currentQuestion =
    user.questions[user.questionIndex];

  if (!currentQuestion) {

    await showResults(ctx);

    return;

  }

  const userAnswer =
    ctx.message.text
      .trim()
      .toLowerCase();

  const correctAnswer =
    currentQuestion.answer
      .toLowerCase();

  const isCorrect =
    userAnswer.includes(correctAnswer) ||
    correctAnswer.includes(userAnswer);

  user.answered++;

  // ----------------------------------------------------------
  // CORRECT
  // ----------------------------------------------------------

  if (isCorrect) {

    user.score++;

    await ctx.replyWithHTML(

      `✅ <b>CORRECT!</b>\n\n` +

      `Excellent work. 🎯\n\n` +

      `🧠 <b>Why?</b>\n` +

      `${currentQuestion.explanation}\n\n` +

      `Score: <b>${user.score}/${user.answered}</b>`,

      Markup.inlineKeyboard([

        [
          Markup.button.callback(
            "➡️ Next Question",
            "next_question"
          )
        ]

      ])

    );

  }

  // ----------------------------------------------------------
  // WRONG
  // ----------------------------------------------------------

  else {

    await ctx.replyWithHTML(

      `❌ <b>NOT QUITE</b>\n\n` +

      `The correct answer is:\n` +

      `👉 <b>${currentQuestion.answer}</b>\n\n` +

      `🧠 <b>Explanation</b>\n` +

      `${currentQuestion.explanation}\n\n` +

      `Don't just memorize it — understand <i>why</i>.`,

      Markup.inlineKeyboard([

        [
          Markup.button.callback(
            "➡️ Next Question",
            "next_question"
          )
        ]

      ])

    );

  }

});
// ============================================================
// PART 3 — DAILY CHALLENGE + BUDDY + PROGRESS + CONTACT
// ============================================================


// ------------------------------------------------------------
// DAILY CHALLENGE
// ------------------------------------------------------------

bot.action("daily", async (ctx) => {

  const allQuestions =
    Object.values(questionBank).flat();

  const today =
    new Date().getDate();

  const question =
    allQuestions[
      today % allQuestions.length
    ];

  userState[ctx.from.id] = {

    subject: "daily",

    questions: [question],

    questionIndex: 0,

    score: 0,

    answered: 0,

    total: 1

  };

  await editMenu(

    ctx,

    `🎯 <b>DAILY CHALLENGE</b>\n\n` +

    `One question.\n` +
    `One opportunity to sharpen your mind.\n\n` +

    `🧠 <b>${question.question}</b>\n\n` +

    `<i>Type your answer below.</i>`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])

  );

});


// ------------------------------------------------------------
// EXAM TIPS
// ------------------------------------------------------------

bot.action("tips", async (ctx) => {

  await editMenu(

    ctx,

    `🧠 <b>GRADE 12 EXAM TIPS</b>\n\n` +

    `1️⃣ <b>Understand before memorizing</b>\n` +
    `Ask yourself: “Can I explain this without looking?”\n\n` +

    `2️⃣ <b>Practice actively</b>\n` +
    `Don't only reread notes. Solve questions.\n\n` +

    `3️⃣ <b>Review your mistakes</b>\n` +
    `Your wrong answers are a study map.\n\n` +

    `4️⃣ <b>Use spaced revision</b>\n` +
    `Return to difficult topics regularly.\n\n` +

    `5️⃣ <b>Practice under pressure</b>\n` +
    `Sometimes study with a timer to simulate exam conditions.\n\n` +

    `🎯 <b>Mastery = Understanding + Practice + Review</b>`,

    backHomeKeyboard()

  );

});


// ------------------------------------------------------------
// PROGRESS
// ------------------------------------------------------------

bot.action("progress", async (ctx) => {

  const user =
    userState[ctx.from.id];

  // No practice yet
  if (
    !user ||
    !user.answered
  ) {

    await editMenu(

      ctx,

      `📊 <b>MY PROGRESS</b>\n\n` +

      `You haven't completed a practice session yet.\n\n` +

      `Start practicing and FineBot will track your current session.`,

      Markup.inlineKeyboard([

        [
          Markup.button.callback(
            "✍️ Start Practice",
            "practice"
          )
        ],

        [
          Markup.button.callback(
            "🏠 Main Menu",
            "home"
          )
        ]

      ])

    );

    return;

  }


  const accuracy =
    Math.round(
      (user.score / user.answered) * 100
    );


  await editMenu(

    ctx,

    `📊 <b>MY PROGRESS</b>\n\n` +

    `🎯 Questions answered: <b>${user.answered}</b>\n` +

    `✅ Correct: <b>${user.score}</b>\n` +

    `📈 Accuracy: <b>${accuracy}%</b>\n\n` +

    `Keep going.\n\n` +

    `<b>Your goal is continuous improvement.</b>`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "✍️ Practice",
          "practice"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])

  );

});


// ------------------------------------------------------------
// STUDY BUDDY RESPONSES
// ------------------------------------------------------------

const buddyResponses = {

  happy:
    "☀️ That's great! Use that energy to get one more topic done.",

  calm:
    "🌿 Good. A calm mind learns better. Let's make some progress.",

  stressed:
    "🫶 Take a slow breath. Don't try to conquer everything at once. Pick one small topic.",

  frustrated:
    "💪 Frustration often means you're pushing against something difficult. Break it into a smaller problem.",

  sad:
    "🫶 It's okay to have difficult days. You don't need to be perfect today.",

  tired:
    "😴 Your brain needs recovery too. Take a short break, then return with one focused task.",

  motivated:
    "🔥 That's the energy! Turn motivation into action — solve one question right now."

};


// ------------------------------------------------------------
// STUDY BUDDY MENU
// ------------------------------------------------------------

bot.action("buddy", async (ctx) => {

  await editMenu(

    ctx,

    `💬 <b>STUDY BUDDY</b>\n\n` +

    `How are you feeling right now?\n\n` +

    `<i>No judgment. Just choose honestly.</i>`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "😊 Happy",
          "mood_happy"
        ),

        Markup.button.callback(
          "😌 Calm",
          "mood_calm"
        )
      ],

      [
        Markup.button.callback(
          "😩 Stressed",
          "mood_stressed"
        ),

        Markup.button.callback(
          "😤 Frustrated",
          "mood_frustrated"
        )
      ],

      [
        Markup.button.callback(
          "😢 Sad",
          "mood_sad"
        ),

        Markup.button.callback(
          "😴 Tired",
          "mood_tired"
        )
      ],

      [
        Markup.button.callback(
          "🔥 Motivated",
          "mood_motivated"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])

  );

});


// ------------------------------------------------------------
// MOOD RESPONSE
// ------------------------------------------------------------

bot.action(/^mood_(.+)$/, async (ctx) => {

  const mood =
    ctx.match[1];

  const response =
    buddyResponses[mood] ||
    "I'm here with you. Keep going. 💙";

  await editMenu(

    ctx,

    `💬 <b>STUDY BUDDY</b>\n\n` +

    `${response}\n\n` +

    `What should we do next?`,

    Markup.inlineKeyboard([

      [
        Markup.button.callback(
          "✍️ Practice",
          "practice"
        )
      ],

      [
        Markup.button.callback(
          "🏠 Main Menu",
          "home"
        )
      ]

    ])

  );

});


// ------------------------------------------------------------
// CONTACT
// ------------------------------------------------------------

bot.action("contact", async (ctx) => {

  await editMenu(

    ctx,

    `📞 <b>CONTACT FINEBOT</b>\n\n` +

    `Need help, found an error, or have a suggestion?\n\n` +

    `📧 finebot.support@gmail.com\n\n` +

    `<i>We'd love to hear from you.</i>`,

    backHomeKeyboard()

  );

});


// ============================================================
// VERCEL WEBHOOK HANDLER
// ============================================================

module.exports = async (req, res) => {

  try {

    if (req.method === "POST") {

      await bot.handleUpdate(req.body);

      return res
        .status(200)
        .send("OK");

    }

    return res
      .status(200)
      .send("FineBot is running 🚀");

  }

  catch (error) {

    console.error(
      "FineBot Error:",
      error
    );

    return res
      .status(200)
      .send("OK");

  }

};