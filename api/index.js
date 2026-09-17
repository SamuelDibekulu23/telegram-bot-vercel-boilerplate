const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN environment variable is missing.");
}

if (!SECRET_TOKEN) {
  throw new Error("SECRET_TOKEN environment variable is missing.");
}

const bot = new Telegraf(BOT_TOKEN);

/*
|--------------------------------------------------------------------------
| TEMPORARY STUDENT DATA
|--------------------------------------------------------------------------
|
| This will later be moved to a real database.
|
*/

const students = new Map();

/*
|--------------------------------------------------------------------------
| PRACTICE QUESTIONS
|--------------------------------------------------------------------------
*/

const questions = [
  {
    id: "chemistry-001",
    stream: "Natural",
    subject: "Chemistry",
    emoji: "🧪",
    question: "Which particle has a negative charge?",
    options: [
      "A) Proton",
      "B) Neutron",
      "C) Electron",
      "D) Nucleus",
    ],
    correctAnswer: "C",
    explanation:
      "An electron has a negative electric charge. Protons are positive, while neutrons have no electric charge.",
  },

  {
    id: "biology-001",
    stream: "Natural",
    subject: "Biology",
    emoji: "🧬",
    question:
      "Which organelle is known as the powerhouse of the cell?",
    options: [
      "A) Nucleus",
      "B) Mitochondrion",
      "C) Ribosome",
      "D) Cell wall",
    ],
    correctAnswer: "B",
    explanation:
      "Mitochondria produce much of the usable energy that cells need for their activities.",
  },

  {
    id: "physics-001",
    stream: "Natural",
    subject: "Physics",
    emoji: "⚡",
    question: "What is the SI unit of force?",
    options: [
      "A) Joule",
      "B) Watt",
      "C) Newton",
      "D) Pascal",
    ],
    correctAnswer: "C",
    explanation:
      "The SI unit of force is the newton (N).",
  },

  {
    id: "mathematics-001",
    stream: "Natural",
    subject: "Mathematics",
    emoji: "📐",
    question: "What is the value of 7 × 8?",
    options: [
      "A) 54",
      "B) 56",
      "C) 64",
      "D) 58",
    ],
    correctAnswer: "B",
    explanation:
      "7 multiplied by 8 equals 56.",
  },

  {
    id: "english-001",
    stream: "Natural",
    subject: "English",
    emoji: "📘",
    question: "Which word is a noun?",
    options: [
      "A) Quickly",
      "B) Beautiful",
      "C) Student",
      "D) Run",
    ],
    correctAnswer: "C",
    explanation:
      "A noun names a person, place, thing, or idea. 'Student' is a noun.",
  },

  {
    id: "aptitude-001",
    stream: "Natural",
    subject: "Scholastic Aptitude",
    emoji: "🧠",
    question:
      "If all roses are flowers and some flowers are red, which statement must be true?",
    options: [
      "A) All roses are red",
      "B) Some roses are not flowers",
      "C) All roses are flowers",
      "D) No flowers are roses",
    ],
    correctAnswer: "C",
    explanation:
      "The first statement directly tells us that all roses are flowers.",
  },

  {
    id: "geography-001",
    stream: "Social",
    subject: "Geography",
    emoji: "🌍",
    question:
      "What is the imaginary line that divides Earth into Northern and Southern Hemispheres?",
    options: [
      "A) Prime Meridian",
      "B) Equator",
      "C) Tropic of Cancer",
      "D) International Date Line",
    ],
    correctAnswer: "B",
    explanation:
      "The Equator is the imaginary line at 0° latitude dividing Earth into Northern and Southern Hemispheres.",
  },

  {
    id: "economics-001",
    stream: "Social",
    subject: "Economics",
    emoji: "📈",
    question: "What does scarcity mean in economics?",
    options: [
      "A) Resources are unlimited",
      "B) Human wants are limited",
      "C) Resources are limited relative to human wants",
      "D) Goods have no value",
    ],
    correctAnswer: "C",
    explanation:
      "Scarcity exists because resources are limited while human wants are unlimited.",
  },

  {
    id: "history-001",
    stream: "Social",
    subject: "History",
    emoji: "🏛️",
    question:
      "Which source can provide direct evidence about the past?",
    options: [
      "A) Primary source",
      "B) Random guess",
      "C) Future prediction",
      "D) Fictional story",
    ],
    correctAnswer: "A",
    explanation:
      "A primary source is original evidence from the period being studied, such as a document, artifact, or firsthand account.",
  },

  {
    id: "social-math-001",
    stream: "Social",
    subject: "Mathematics",
    emoji: "📐",
    question: "If x + 5 = 12, what is x?",
    options: [
      "A) 5",
      "B) 6",
      "C) 7",
      "D) 8",
    ],
    correctAnswer: "C",
    explanation:
      "Subtract 5 from both sides: x = 12 − 5 = 7.",
  },

  {
    id: "social-english-001",
    stream: "Social",
    subject: "English",
    emoji: "📘",
    question:
      "Choose the sentence with correct subject-verb agreement.",
    options: [
      "A) She go to school.",
      "B) She goes to school.",
      "C) She going to school.",
      "D) She gone to school.",
    ],
    correctAnswer: "B",
    explanation:
      "With the singular subject 'she' in the simple present tense, the verb takes 's': 'She goes.'",
  },
];

/*
|--------------------------------------------------------------------------
| DATE HELPERS
|--------------------------------------------------------------------------
*/

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa",
  }).format(new Date());
}

/*
|--------------------------------------------------------------------------
| STUDENT
|--------------------------------------------------------------------------
*/

function getStudent(ctx) {
  if (!ctx.from) return null;

  const telegramId = ctx.from.id;

  if (!students.has(telegramId)) {
    students.set(telegramId, {
      telegramId,

      firstName: ctx.from.first_name || "Student",
      username: ctx.from.username || null,

      xp: 0,
      streak: 0,

      questionsAnswered: 0,
      correctAnswers: 0,

      lessonsCompleted: 0,

      achievements: [],

      currentQuestionId: null,

      mistakes: [],

      lastPracticeDate: null,

      createdAt: new Date().toISOString(),
    });
  }

  const student = students.get(telegramId);

  student.firstName =
    ctx.from.first_name || student.firstName || "Student";

  student.username =
    ctx.from.username || student.username || null;

  return student;
}

function getStudentName(ctx) {
  const student = getStudent(ctx);

  if (!student || !student.firstName) {
    return "there";
  }

  return student.firstName.trim() || "there";
}

function getUsernameText(student) {
  if (!student || !student.username) {
    return "No username";
  }

  return `@${student.username}`;
}

function getAccuracy(student) {
  if (!student || student.questionsAnswered === 0) {
    return 0;
  }

  return Math.round(
    (student.correctAnswers / student.questionsAnswered) * 100
  );
}

/*
|--------------------------------------------------------------------------
| STREAK ENGINE
|--------------------------------------------------------------------------
*/

function updateStreak(student) {
  const today = getTodayKey();

  if (!student.lastPracticeDate) {
    student.streak = 1;
    student.lastPracticeDate = today;
    return;
  }

  if (student.lastPracticeDate === today) {
    return;
  }

  const previous = new Date(
    `${student.lastPracticeDate}T00:00:00+03:00`
  );

  const current = new Date(
    `${today}T00:00:00+03:00`
  );

  const difference =
    Math.round(
      (current.getTime() - previous.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  if (difference === 1) {
    student.streak += 1;
  } else {
    student.streak = 1;
  }

  student.lastPracticeDate = today;
}

/*
|--------------------------------------------------------------------------
| ACHIEVEMENTS
|--------------------------------------------------------------------------
*/

function addAchievement(student, achievement) {
  if (!student.achievements.includes(achievement)) {
    student.achievements.push(achievement);
    return true;
  }

  return false;
}

function updateAchievements(student) {
  const unlocked = [];

  if (
    student.questionsAnswered >= 1 &&
    addAchievement(student, "First Step")
  ) {
    unlocked.push("🏅 First Step");
  }

  if (
    student.questionsAnswered >= 10 &&
    addAchievement(student, "Bookworm")
  ) {
    unlocked.push("📚 Bookworm");
  }

  if (
    student.correctAnswers >= 100 &&
    addAchievement(student, "Scholar")
  ) {
    unlocked.push("🎓 Scholar");
  }

  if (
    student.streak >= 7 &&
    addAchievement(student, "Streak Keeper")
  ) {
    unlocked.push("🔥 Streak Keeper");
  }

  if (
    student.streak >= 1 &&
    addAchievement(student, "Early Bird")
  ) {
    /*
     * The real Early Bird time condition will be added later.
     * This placeholder achievement system is kept simple for now.
     */
  }

  return unlocked;
}

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

function homeKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📚 Learn", "home_learn"),
      Markup.button.callback("✍️ Practice", "home_practice"),
    ],
    [
      Markup.button.callback("📊 My Journey", "home_journey"),
      Markup.button.callback("💬 Study Buddy", "home_buddy"),
    ],
    [
      Markup.button.callback("🆘 Support", "home_support"),
    ],
  ]);
}

function homeText(ctx) {
  const student = getStudent(ctx);
  const name = getStudentName(ctx);

  return (
    "🌟 FINEBOT\n" +
    "Grade 12 Mastering Companion\n\n" +
    `👋 Good to have you here, ${name}!\n\n` +
    "Ready to make your brain a little stronger today?\n\n" +
    `🔥 ${student.streak} day streak   ·   ⭐ ${student.xp} XP\n` +
    `📚 ${student.questionsAnswered} questions   ·   🎯 ${getAccuracy(student)}% accuracy\n\n` +
    `${getUsernameText(student)}`
  );
}

async function showHome(ctx) {
  const text = homeText(ctx);
  const keyboard = homeKeyboard();

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, keyboard);
      return;
    } catch (error) {
      if (
        !error.description ||
        !error.description.includes("message is not modified")
      ) {
        throw error;
      }

      return;
    }
  }

  await ctx.reply(text, keyboard);
}

/*
|--------------------------------------------------------------------------
| START
|--------------------------------------------------------------------------
*/

bot.start(async (ctx) => {
  getStudent(ctx);
  await showHome(ctx);
});

/*
|--------------------------------------------------------------------------
| PRACTICE MENU
|--------------------------------------------------------------------------
*/

bot.action("home_practice", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "✍️ PRACTICE\n\n" +
    "Every question is a chance to get a little stronger. 🧠\n\n" +
    "Choose your stream to begin:";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural Sciences",
        "practice_natural"
      ),
    ],
    [
      Markup.button.callback(
        "🌍 Social Sciences",
        "practice_social"
      ),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| NATURAL SUBJECTS
|--------------------------------------------------------------------------
*/

bot.action("practice_natural", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🌿 NATURAL SCIENCES\n\n" +
    "Choose a subject:";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "📘 English",
        "subject_natural_english"
      ),
      Markup.button.callback(
        "📐 Mathematics",
        "subject_natural_math"
      ),
    ],
    [
      Markup.button.callback(
        "🧬 Biology",
        "subject_biology"
      ),
      Markup.button.callback(
        "🧪 Chemistry",
        "subject_chemistry"
      ),
    ],
    [
      Markup.button.callback(
        "⚡ Physics",
        "subject_physics"
      ),
    ],
    [
      Markup.button.callback(
        "🧠 Scholastic Aptitude",
        "subject_aptitude"
      ),
    ],
    [
      Markup.button.callback(
        "⬅️ Streams",
        "home_practice"
      ),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| SOCIAL SUBJECTS
|--------------------------------------------------------------------------
*/

bot.action("practice_social", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🌍 SOCIAL SCIENCES\n\n" +
    "Choose a subject:";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "📘 English",
        "subject_social_english"
      ),
      Markup.button.callback(
        "📐 Mathematics",
        "subject_social_math"
      ),
    ],
    [
      Markup.button.callback(
        "🌍 Geography",
        "subject_geography"
      ),
    ],
    [
      Markup.button.callback(
        "📈 Economics",
        "subject_economics"
      ),
    ],
    [
      Markup.button.callback(
        "🏛️ History",
        "subject_history"
      ),
    ],
    [
      Markup.button.callback(
        "⬅️ Streams",
        "home_practice"
      ),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| QUESTION HELPERS
|--------------------------------------------------------------------------
*/

function findQuestionById(id) {
  return questions.find(
    (question) => question.id === id
  );
}

function getQuestionsForSubject(subject) {
  return questions.filter(
    (question) => question.subject === subject
  );
}

function getQuestionForStudent(student, subject) {
  const subjectQuestions =
    getQuestionsForSubject(subject);

  if (subjectQuestions.length === 0) {
    return null;
  }

  return subjectQuestions[0];
}

/*
|--------------------------------------------------------------------------
| SHOW QUESTION
|--------------------------------------------------------------------------
*/

async function showPracticeQuestion(ctx, subject) {
  const student = getStudent(ctx);

  const question = getQuestionForStudent(
    student,
    subject
  );

  if (!question) {
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "⬅️ Practice",
          "home_practice"
        ),
      ],
      [
        Markup.button.callback(
          "🏠 Home",
          "back_home"
        ),
      ],
    ]);

    await ctx.editMessageText(
      "✍️ PRACTICE\n\n" +
        `We're still preparing questions for ${subject}.\n\n` +
        "More questions will be added to the verified question bank.",
      keyboard
    );

    return;
  }

  student.currentQuestionId = question.id;

  const text =
    `${question.emoji} ${question.subject.toUpperCase()}\n\n` +
    "Question\n\n" +
    question.question;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        question.options[0],
        `answer_${question.id}_A`
      ),
    ],
    [
      Markup.button.callback(
        question.options[1],
        `answer_${question.id}_B`
      ),
    ],
    [
      Markup.button.callback(
        question.options[2],
        `answer_${question.id}_C`
      ),
    ],
    [
      Markup.button.callback(
        question.options[3],
        `answer_${question.id}_D`
      ),
    ],
    [
      Markup.button.callback(
        "⬅️ Practice",
        "home_practice"
      ),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
}

/*
|--------------------------------------------------------------------------
| SUBJECT BUTTONS
|--------------------------------------------------------------------------
*/

bot.action(
  "subject_natural_english",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(ctx, "English");
  }
);

bot.action(
  "subject_natural_math",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Mathematics"
    );
  }
);

bot.action(
  "subject_biology",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Biology"
    );
  }
);

bot.action(
  "subject_chemistry",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Chemistry"
    );
  }
);

bot.action(
  "subject_physics",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Physics"
    );
  }
);

bot.action(
  "subject_aptitude",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Scholastic Aptitude"
    );
  }
);

bot.action(
  "subject_social_english",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "English"
    );
  }
);

bot.action(
  "subject_social_math",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Mathematics"
    );
  }
);

bot.action(
  "subject_geography",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Geography"
    );
  }
);

bot.action(
  "subject_economics",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "Economics"
    );
  }
);

bot.action(
  "subject_history",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showPracticeQuestion(
      ctx,
      "History"
    );
  }
);

/*
|--------------------------------------------------------------------------
| ANSWER CHECKING
|--------------------------------------------------------------------------
*/
bot.action(
  /^answer_(.+)_([ABCD])$/,
  async (ctx) => {
    await ctx.answerCbQuery();

    const student = getStudent(ctx);

    const questionId = ctx.match[1];
    const selectedAnswer = ctx.match[2];

    const question =
      findQuestionById(questionId);

    if (!question) {
      await ctx.editMessageText(
        "Something went wrong with that question.\n\n" +
          "Let's try again. 😅",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            ),
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            ),
          ],
        ])
      );

      return;
    }

    if (
      student.currentQuestionId !==
      question.id
    ) {
      await ctx.editMessageText(
        "That question is no longer active.\n\n" +
          "Let's get you a fresh one. 🧠",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            ),
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            ),
          ],
        ])
      );

      return;
    }

    const isCorrect =
      selectedAnswer ===
      question.correctAnswer;

    /*
     * Every answered question counts as
     * activity for the day.
     */
    updateStreak(student);

    student.questionsAnswered += 1;

    if (isCorrect) {
      student.correctAnswers += 1;
      student.xp += 5;
    } else {
      student.mistakes.push({
        questionId: question.id,
        subject: question.subject,
        selectedAnswer,
        correctAnswer:
          question.correctAnswer,
        createdAt:
          new Date().toISOString(),
      });
    }

    student.currentQuestionId = null;

    const unlocked =
      updateAchievements(student);

    const name = getStudentName(ctx);

    if (isCorrect) {
      let achievementText = "";

      if (unlocked.length > 0) {
        achievementText =
          "\n\n🏅 Achievement unlocked!\n" +
          unlocked.join("\n");
      }

      const text =
        "✅ CORRECT\n\n" +
        `Nice one, ${name}! 🔥\n\n` +
        "You got it right.\n\n" +
        "⭐ +5 XP\n" +
        `🔥 ${student.streak} day streak\n\n` +
        `🎯 Accuracy: ${getAccuracy(student)}%` +
        achievementText;

      const keyboard =
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "➡️ Next Question",
              `next_${question.subject}`
            ),
          ],
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            ),
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            ),
          ],
        ]);

      await ctx.editMessageText(
        text,
        keyboard
      );
    } else {
      let achievementText = "";

      if (unlocked.length > 0) {
        achievementText =
          "\n\n🏅 Achievement unlocked!\n" +
          unlocked.join("\n");
      }

      const text =
        "❌ NOT QUITE\n\n" +
        "That's okay. Mistakes are part of learning. 🌱\n\n" +
        "⭐ +0 XP\n" +
        `🔥 ${student.streak} day streak\n\n` +
        `🎯 Accuracy: ${getAccuracy(student)}%` +
        achievementText;

      const keyboard =
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "📖 Show me how",
              `explain_${question.id}`
            ),
          ],
          [
            Markup.button.callback(
              "➡️ Next Question",
              `next_${question.subject}`
            ),
          ],
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            ),
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            ),
          ],
        ]);

      await ctx.editMessageText(
        text,
        keyboard
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| EXPLANATION
|--------------------------------------------------------------------------
*/

bot.action(
  /^explain_(.+)$/,
  async (ctx) => {
    await ctx.answerCbQuery();

    const questionId = ctx.match[1];

    const question =
      findQuestionById(questionId);

    if (!question) {
      await ctx.editMessageText(
        "I couldn't find that explanation.",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            ),
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            ),
          ],
        ])
      );

      return;
    }

    const text =
      "📖 SHOW ME HOW\n\n" +
      question.explanation +
      "\n\n" +
      `💡 Correct answer: ${question.correctAnswer}`;

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "➡️ Next Question",
            `next_${question.subject}`
          ),
        ],
        [
          Markup.button.callback(
            "✍️ Practice",
            "home_practice"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| NEXT QUESTION
|--------------------------------------------------------------------------
*/

bot.action(
  /^next_(.+)$/,
  async (ctx) => {
    await ctx.answerCbQuery();

    const subject = ctx.match[1];

    await showPracticeQuestion(
      ctx,
      subject
    );
  }
);

/*
|--------------------------------------------------------------------------
| MY JOURNEY
|--------------------------------------------------------------------------
*/

bot.action(
  "home_journey",
  async (ctx) => {
    await ctx.answerCbQuery();

    const student = getStudent(ctx);
    const name = getStudentName(ctx);

    let achievementText =
      "None yet — your first one is waiting. 🌱";

    if (student.achievements.length > 0) {
      achievementText =
        student.achievements
          .map((item) => `🏅 ${item}`)
          .join("\n");
    }

    const text =
      "📊 MY JOURNEY\n\n" +
      `${name}'s personal progress\n\n` +
      `👤 ${getUsernameText(student)}\n\n` +
      `⭐ XP: ${student.xp}\n` +
      `🔥 Streak: ${student.streak} days\n` +
      `✅ Correct answers: ${student.correctAnswers}\n` +
      `📝 Questions answered: ${student.questionsAnswered}\n` +
      `🎯 Accuracy: ${getAccuracy(student)}%\n` +
      `📚 Lessons completed: ${student.lessonsCompleted}\n\n` +
      "🏅 ACHIEVEMENTS\n" +
      achievementText +
      "\n\n" +
      "And when something keeps giving you trouble...\n" +
      "🩹 Fix My Weak will help you work through it.";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🩹 Fix My Weak",
            "journey_weak"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| FIX MY WEAK
|--------------------------------------------------------------------------
*/

bot.action(
  "journey_weak",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "🩹 FIX MY WEAK\n\n" +
      "FineBot will look at your real practice results " +
      "to find the areas that need more attention.\n\n" +
      "No random repetition.\n" +
      "No shame.\n" +
      "Just targeted help until things start making sense. 💪\n\n" +
      "The weakness engine will be connected after the Practice " +
      "data foundation is complete.";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📊 My Journey",
            "home_journey"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);
/*
|--------------------------------------------------------------------------
| LEARN
|--------------------------------------------------------------------------
*/

bot.action(
  "home_learn",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "📚 LEARN\n\n" +
      "Let's build your understanding one step at a time. 🧠\n\n" +
      "The full Learn & Play journey is being built next.\n\n" +
      "You'll eventually move through your Grade 12 subjects, " +
      "concepts, real-world analogies, notes and practice.";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| STUDY BUDDY
|--------------------------------------------------------------------------
*/

bot.action(
  "home_buddy",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "💬 STUDY BUDDY\n\n" +
      "You can talk naturally here.\n\n" +
      "Ask something you don't understand.\n" +
      "Share a random thought.\n" +
      "Say you're tired.\n" +
      "Or just type \"hey\".\n\n" +
      "Your Study Buddy will be connected in a later brick.\n\n" +
      "And when your brain needs a little refresh...\n" +
      "📖 Fun Stories will be right here.";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📖 Fun Stories",
            "buddy_stories"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| FUN STORIES
|--------------------------------------------------------------------------
*/

bot.action(
  "buddy_stories",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "📖 FUN STORIES\n\n" +
      "A little brain refresh between study sessions.\n\n" +
      "True stories, fascinating facts and just-for-fun moments " +
      "will live here.\n\n" +
      "The story system will be connected in a later brick.";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "💬 Study Buddy",
            "home_buddy"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| SUPPORT
|--------------------------------------------------------------------------
*/

bot.action(
  "home_support",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "🆘 SUPPORT\n\n" +
      "Need help with FineBot?\n\n" +
      "You can find:\n" +
      "• How to Use FineBot\n" +
      "• Frequently Asked Questions\n" +
      "• Help with problems or access\n" +
      "• Direct support\n\n" +
      "📧 finebot.support@gmail.com";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📖 How to Use FineBot",
            "support_how"
          ),
        ],
        [
          Markup.button.callback(
            "❓ FAQ",
            "support_faq"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| SUPPORT — HOW TO USE
|--------------------------------------------------------------------------
*/

bot.action(
  "support_how",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "📖 HOW TO USE FINEBOT\n\n" +
      "📚 Learn — build understanding step by step.\n\n" +
      "✍️ Practice — test what you know.\n\n" +
      "📊 My Journey — see your personal progress.\n\n" +
      "💬 Study Buddy — talk naturally and get help.\n\n" +
      "🆘 Support — get help whenever you need it.\n\n" +
      "More features will become available as we build FineBot.";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "⬅️ Support",
            "home_support"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| SUPPORT — FAQ
|--------------------------------------------------------------------------
*/

bot.action(
  "support_faq",
  async (ctx) => {
    await ctx.answerCbQuery();

    const text =
      "❓ FAQ\n\n" +
      "FineBot is being built as a Grade 12 mastering companion.\n\n" +
      "The learning, practice, progress, weakness recovery, " +
      "Study Buddy and story systems are being developed " +
      "step by step.\n\n" +
      "For a problem that needs direct help:\n" +
      "📧 finebot.support@gmail.com";

    const keyboard =
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "⬅️ Support",
            "home_support"
          ),
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          ),
        ],
      ]);

    await ctx.editMessageText(
      text,
      keyboard
    );
  }
);

/*
|--------------------------------------------------------------------------
| BACK HOME
|--------------------------------------------------------------------------
*/

bot.action(
  "back_home",
  async (ctx) => {
    await ctx.answerCbQuery();
    await showHome(ctx);
  }
);

/*
|--------------------------------------------------------------------------
| UNKNOWN CALLBACKS
|--------------------------------------------------------------------------
*/

bot.on(
  "callback_query",
  async (ctx) => {
    try {
      await ctx.answerCbQuery(
        "That little button hasn't learned its trick yet. 😄"
      );
    } catch (error) {
      console.error(
        "Callback error:",
        error.message
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

bot.catch((error, ctx) => {
  console.error(
    "FineBot error:",
    error && error.message
      ? error.message
      : "Unknown error"
  );

  if (ctx && ctx.callbackQuery) {
    ctx
      .answerCbQuery(
        "Something went a little sideways. Try again. 😅"
      )
      .catch(() => {});
  }
});

/*
|--------------------------------------------------------------------------
| VERCEL WEBHOOK
|--------------------------------------------------------------------------
*/

module.exports = async (req, res) => {
  if (req.method === "GET") {
    return res
      .status(200)
      .send("FineBot is running.");
  }

  if (req.method !== "POST") {
    return res
      .status(405)
      .send("Method Not Allowed");
  }

  const receivedSecret =
    req.headers[
      "x-telegram-bot-api-secret-token"
    ];

  if (
    !receivedSecret ||
    receivedSecret !== SECRET_TOKEN
  ) {
    return res
      .status(401)
      .send("Unauthorized");
  }

  if (!req.body) {
    console.error(
      "Webhook received without request body."
    );

    return res
      .status(400)
      .send("Missing request body");
  }

  try {
    await bot.handleUpdate(req.body);

    return res
      .status(200)
      .send("OK");
  } catch (error) {
    console.error(
      "FineBot webhook error:",
      error && error.message
        ? error.message
        : "Unknown error"
    );

    return res
      .status(500)
      .send("Internal Server Error");
  }
};