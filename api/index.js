cat > api/index.js <<'EOF'
const { Telegraf, Markup } = require("telegraf");
const { createClient } = require("@supabase/supabase-js");

const {
  getLearnEnglishMenu,
  openEnglishLesson
} = require("../src/learning/learn");

const {
  getEnglishLessonsByCategory
} = require("../src/learning/catalog");

const {
  getSnapshot
} = require("../src/learning/session");

const {
  advanceLesson
} = require("../src/learning/flow");

const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY;

if (!BOT_TOKEN) {
  throw new Error(
    "BOT_TOKEN environment variable is missing."
  );
}

if (!SECRET_TOKEN) {
  throw new Error(
    "SECRET_TOKEN environment variable is missing."
  );
}

if (!SUPABASE_URL) {
  throw new Error(
    "SUPABASE_URL environment variable is missing."
  );
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error(
    "SUPABASE_SECRET_KEY environment variable is missing."
  );
}

const bot = new Telegraf(BOT_TOKEN);

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

const students = new Map();
const learningSessions = new Map();

const questions = [
  {
    id: "chemistry-001",
    stream: "Natural",
    subject: "Chemistry",
    emoji: "🧪",
    question:
      "Which particle has a negative charge?",
    options: [
      "A) Proton",
      "B) Neutron",
      "C) Electron",
      "D) Nucleus"
    ],
    correctAnswer: "C",
    explanation:
      "An electron has a negative electric charge. Protons are positive, while neutrons have no electric charge."
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
      "D) Cell wall"
    ],
    correctAnswer: "B",
    explanation:
      "Mitochondria produce much of the usable energy that cells need for their activities."
  },
  {
    id: "physics-001",
    stream: "Natural",
    subject: "Physics",
    emoji: "⚡",
    question:
      "What is the SI unit of force?",
    options: [
      "A) Joule",
      "B) Watt",
      "C) Newton",
      "D) Pascal"
    ],
    correctAnswer: "C",
    explanation:
      "The SI unit of force is the newton (N)."
  },
  {
    id: "mathematics-001",
    stream: "Natural",
    subject: "Mathematics",
    emoji: "📐",
    question:
      "What is the value of 7 × 8?",
    options: [
      "A) 54",
      "B) 56",
      "C) 64",
      "D) 58"
    ],
    correctAnswer: "B",
    explanation:
      "7 multiplied by 8 equals 56."
  },
  {
    id: "english-001",
    stream: "Natural",
    subject: "English",
    emoji: "📘",
    question:
      "Which word is a noun?",
    options: [
      "A) Quickly",
      "B) Beautiful",
      "C) Student",
      "D) Run"
    ],
    correctAnswer: "C",
    explanation:
      "A noun names a person, place, thing, or idea. 'Student' is a noun."
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
      "D) No flowers are roses"
    ],
    correctAnswer: "C",
    explanation:
      "The first statement directly tells us that all roses are flowers."
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
      "D) International Date Line"
    ],
    correctAnswer: "B",
    explanation:
      "The Equator is the imaginary line at 0° latitude dividing Earth into Northern and Southern Hemispheres."
  },
  {
    id: "economics-001",
    stream: "Social",
    subject: "Economics",
    emoji: "📈",
    question:
      "What does scarcity mean in economics?",
    options: [
      "A) Resources are unlimited",
      "B) Human wants are limited",
      "C) Resources are limited relative to human wants",
      "D) Goods have no value"
    ],
    correctAnswer: "C",
    explanation:
      "Scarcity exists because resources are limited while human wants are unlimited."
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
      "D) Fictional story"
    ],
    correctAnswer: "A",
    explanation:
      "A primary source is original evidence from the period being studied, such as a document, artifact, or firsthand account."
  },
  {
    id: "social-math-001",
    stream: "Social",
    subject: "Mathematics",
    emoji: "📐",
    question:
      "If x + 5 = 12, what is x?",
    options: [
      "A) 5",
      "B) 6",
      "C) 7",
      "D) 8"
    ],
    correctAnswer: "C",
    explanation:
      "Subtract 5 from both sides: x = 12 − 5 = 7."
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
      "D) She gone to school."
    ],
    correctAnswer: "B",
    explanation:
      "With the singular subject 'she' in the simple present tense, the verb takes 's': 'She goes.'"
  }
];

function getTodayKey() {
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Africa/Addis_Ababa"
    }
  ).format(new Date());
}

function isEarlyBirdTime() {
  const hour = Number(
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Africa/Addis_Ababa",
        hour: "numeric",
        hour12: false
      }
    ).format(new Date())
  );

  return hour < 8;
}

function generateFineBotId() {
  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

  return `FB-2026-${randomPart}`;
}

function mapDatabaseStudent(row) {
  return {
    telegramId: Number(row.telegram_id),
    firstName:
      row.first_name || "Student",
    username:
      row.username || null,
    finebotId:
      row.finebot_id,
    xp: Number(row.xp || 0),
    streak: Number(row.streak || 0),
    questionsAnswered:
      Number(row.questions_answered || 0),
    correctAnswers:
      Number(row.correct_answers || 0),
    lessonsCompleted:
      Number(row.lessons_completed || 0),
    achievements:
      Array.isArray(row.achievements)
        ? row.achievements
        : [],
    mistakes:
      Array.isArray(row.mistakes)
        ? row.mistakes
        : [],
    subjectProgress:
      row.subject_progress &&
      typeof row.subject_progress === "object"
        ? row.subject_progress
        : {},
    lastPracticeDate:
      row.last_practice_date || null,
    studyBuddyMessagesToday:
      Number(
        row.study_buddy_messages_today || 0
      ),
    studyBuddyDate:
      row.study_buddy_date || null,
    currentQuestionId: null,
    createdAt:
      row.created_at ||
      new Date().toISOString()
  };
}

async function loadStudentFromDatabase(
  telegramId
) {
  const { data, error } =
    await supabase
      .from("students")
      .select("*")
      .eq(
        "telegram_id",
        String(telegramId)
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Supabase student lookup error:",
      error.message
    );
    throw error;
  }

  return data;
}

async function createStudentInDatabase(
  ctx
) {
  const telegramId =
    String(ctx.from.id);

  const studentData = {
    finebot_id:
      generateFineBotId(),
    telegram_id:
      telegramId,
    first_name:
      ctx.from.first_name ||
      "Student",
    username:
      ctx.from.username ||
      null,
    xp: 0,
    streak: 0,
    questions_answered: 0,
    correct_answers: 0,
    lessons_completed: 0,
    achievements: [],
    mistakes: [],
    subject_progress: {},
    last_practice_date: null,
    study_buddy_messages_today: 0,
    study_buddy_date: null
  };

  const { data, error } =
    await supabase
      .from("students")
      .insert(studentData)
      .select("*")
      .single();

  if (error) {
    console.error(
      "Supabase student creation error:",
      error.message
    );
    throw error;
  }

  return mapDatabaseStudent(data);
}

async function getStudent(ctx) {
  if (!ctx.from) {
    return null;
  }

  const telegramId =
    ctx.from.id;

  if (students.has(telegramId)) {
    const student =
      students.get(telegramId);

    student.firstName =
      ctx.from.first_name ||
      student.firstName ||
      "Student";

    student.username =
      ctx.from.username ||
      student.username ||
      null;

    return student;
  }

  const existingStudent =
    await loadStudentFromDatabase(
      telegramId
    );

  let student;

  if (existingStudent) {
    student =
      mapDatabaseStudent(
        existingStudent
      );
  } else {
    student =
      await createStudentInDatabase(
        ctx
      );
  }

  students.set(
    telegramId,
    student
  );

  return student;
}

async function saveStudent(
  student
) {
  if (!student) {
    return;
  }

  const updateData = {
    first_name:
      student.firstName ||
      "Student",
    username:
      student.username ||
      null,
    xp: student.xp || 0,
    streak:
      student.streak || 0,
    questions_answered:
      student.questionsAnswered ||
      0,
    correct_answers:
      student.correctAnswers ||
      0,
    lessons_completed:
      student.lessonsCompleted ||
      0,
    achievements:
      Array.isArray(
        student.achievements
      )
        ? student.achievements
        : [],
    mistakes:
      Array.isArray(
        student.mistakes
      )
        ? student.mistakes
        : [],
    subject_progress:
      student.subjectProgress ||
      {},
    last_practice_date:
      student.lastPracticeDate ||
      null,
    study_buddy_messages_today:
      student.studyBuddyMessagesToday ||
      0,
    study_buddy_date:
      student.studyBuddyDate ||
      null,
    updated_at:
      new Date().toISOString()
  };

  const { error } =
    await supabase
      .from("students")
      .update(updateData)
      .eq(
        "telegram_id",
        String(student.telegramId)
      );

  if (error) {
    console.error(
      "Supabase student save error:",
      error.message
    );
    throw error;
  }
}

async function getStudentName(ctx) {
  const student =
    await getStudent(ctx);

  if (
    !student ||
    !student.firstName
  ) {
    return "there";
  }

  return (
    student.firstName.trim() ||
    "there"
  );
}

function getUsernameText(student) {
  if (
    !student ||
    !student.username
  ) {
    return "No username";
  }

  return `@${student.username}`;
}

function getAccuracy(student) {
  if (
    !student ||
    student.questionsAnswered === 0
  ) {
    return 0;
  }

  return Math.round(
    (student.correctAnswers /
      student.questionsAnswered) *
      100
  );
}

function updateStreak(student) {
  const today =
    getTodayKey();

  if (!student.lastPracticeDate) {
    student.streak = 1;
    student.lastPracticeDate =
      today;
    return;
  }

  if (
    student.lastPracticeDate ===
    today
  ) {
    return;
  }

  const previous =
    new Date(
      `${student.lastPracticeDate}T00:00:00+03:00`
    );

  const current =
    new Date(
      `${today}T00:00:00+03:00`
    );

  const difference =
    Math.round(
      (current - previous) /
        86400000
    );

  if (difference === 1) {
    student.streak += 1;
  } else {
    student.streak = 1;
  }

  student.lastPracticeDate =
    today;
}

function addAchievement(
  student,
  achievement
) {
  if (
    student.achievements.includes(
      achievement
    )
  ) {
    return false;
  }

  student.achievements.push(
    achievement
  );

  return true;
}

function updateAchievements(student) {
  const unlocked = [];

  if (
    student.questionsAnswered >=
      1 &&
    addAchievement(
      student,
      "First Step"
    )
  ) {
    unlocked.push(
      "🌱 First Step"
    );
  }

  if (
    student.lessonsCompleted >=
      10 &&
    addAchievement(
      student,
      "Bookworm"
    )
  ) {
    unlocked.push(
      "📚 Bookworm"
    );
  }

  if (
    student.correctAnswers >=
      100 &&
    addAchievement(
      student,
      "Scholar"
    )
  ) {
    unlocked.push(
      "🎓 Scholar"
    );
  }

  if (
    student.streak >= 7 &&
    addAchievement(
      student,
      "Streak Keeper"
    )
  ) {
    unlocked.push(
      "🔥 Streak Keeper"
    );
  }

  if (
    isEarlyBirdTime() &&
    addAchievement(
      student,
      "Early Bird"
    )
  ) {
    unlocked.push(
      "🌅 Early Bird"
    );
  }

  return unlocked;
}

function homeKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "📚 Learn",
        "home_learn"
      ),
      Markup.button.callback(
        "✍️ Practice",
        "home_practice"
      )
    ],
    [
      Markup.button.callback(
        "📊 My Journey",
        "home_journey"
      ),
      Markup.button.callback(
        "💬 Study Buddy",
        "home_buddy"
      )
    ],
    [
      Markup.button.callback(
        "🆘 Support",
        "home_support"
      )
    ]
  ]);
}

async function homeText(ctx) {
  const student =
    await getStudent(ctx);

  const name =
    await getStudentName(ctx);

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
  const text =
    await homeText(ctx);

  const keyboard =
    homeKeyboard();

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(
        text,
        keyboard
      );
      return;
    } catch (error) {
      if (
        !error.description ||
        !error.description.includes(
          "message is not modified"
        )
      ) {
        throw error;
      }
      return;
    }
  }

  await ctx.reply(
    text,
    keyboard
  );
}

bot.start(
  async ctx => {
    try {
      await getStudent(ctx);
      await showHome(ctx);
    } catch (error) {
      console.error(
        "Start error:",
        error.message
      );

      await ctx.reply(
        "I couldn't load your FineBot profile right now. 😅\n\n" +
          "Please try /start again in a moment."
      );
    }
  }
);
EOF
cat >> api/index.js <<'EOF'

bot.action(
  "home_learn",
  async ctx => {
    await ctx.answerCbQuery();

    const menu =
      getLearnEnglishMenu();

    const text =
      "📚 LEARN\n\n" +
      "Let's build your understanding one step at a time. 🧠\n\n" +
      "For now, we're starting with English.\n\n" +
      "Choose what you want to strengthen:";

    const buttons =
      menu.map(
        category => [
          Markup.button.callback(
            `${category.emoji} ${category.title}`,
            `learn_category_${category.category}`
          )
        ]
      );

    buttons.push([
      Markup.button.callback(
        "🏠 Home",
        "back_home"
      )
    ]);

    await ctx.editMessageText(
      text,
      Markup.inlineKeyboard(
        buttons
      )
    );
  }
);

bot.action(
  /^learn_category_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    const category =
      ctx.match[1];

    const lessons =
      getEnglishLessonsByCategory(
        category
      );

    if (!lessons.length) {
      await ctx.editMessageText(
        "I couldn't find lessons in that category yet. 😅",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "⬅️ English",
              "home_learn"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );

      return;
    }

    const menu =
      getLearnEnglishMenu();

    const categoryInfo =
      menu.find(
        item =>
          item.category ===
          category
      );

    const text =
      `${categoryInfo ? categoryInfo.emoji : "📚"} ${
        categoryInfo
          ? categoryInfo.title
          : "ENGLISH"
      }\n\n` +
      "Choose a lesson:";

    const buttons =
      lessons.map(
        lesson => [
          Markup.button.callback(
            lesson.title,
            `learn_lesson_${lesson.id}`
          )
        ]
      );

    buttons.push([
      Markup.button.callback(
        "⬅️ English",
        "home_learn"
      )
    ]);

    buttons.push([
      Markup.button.callback(
        "🏠 Home",
        "back_home"
      )
    ]);

    await ctx.editMessageText(
      text,
      Markup.inlineKeyboard(
        buttons
      )
    );
  }
);

bot.action(
  /^learn_lesson_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    const lessonId =
      ctx.match[1];

    const result =
      openEnglishLesson(
        lessonId
      );

    if (!result.success) {
      await ctx.editMessageText(
        "I couldn't open that lesson right now. 😅",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "⬅️ English",
              "home_learn"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );

      return;
    }

    const telegramId =
      ctx.from.id;

    learningSessions.set(
      telegramId,
      result.session
    );

    await showLearningSession(
      ctx
    );
  }
);

async function showLearningSession(ctx) {
  const telegramId =
    ctx.from.id;

  const session =
    learningSessions.get(
      telegramId
    );

  if (!session) {
    await ctx.editMessageText(
      "Your learning session is no longer active. Let's start again. 📚",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📚 Learn",
            "home_learn"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );

    return;
  }

  const snapshot =
    getSnapshot(session);

  if (!snapshot) {
    await ctx.editMessageText(
      "I couldn't load this lesson session. 😅",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📚 Learn",
            "home_learn"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );

    return;
  }

  const presentation =
    snapshot.presentation;

  let text =
    `${presentation.label}\n\n`;

  text +=
    `📚 ${presentation.lessonTitle}\n\n`;

  if (
    presentation.conceptNumber
  ) {
    text +=
      `Concept ${presentation.conceptNumber}\n\n`;
  }

  text +=
    `${presentation.title}\n\n`;

  text +=
    formatLearningContent(
      presentation.content
    );

  text +=
    `\n\n📊 ${snapshot.progress.current}/${snapshot.progress.total} · ${snapshot.progress.percentage}%`;

  await ctx.editMessageText(
    text,
    getLearningKeyboard(
      snapshot
    )
  );
}

function formatLearningContent(content) {
  if (!content) {
    return "";
  }

  if (
    content.type ===
    "intro"
  ) {
    return (
      `${content.hook || ""}\n\n` +
      `${content.goal || ""}\n\n` +
      `${content.quickStart || ""}`
    );
  }

  if (
    content.type ===
    "concept"
  ) {
    return (
      `${content.explanation || ""}` +
      formatOptionalBlock(
        "📝 NOTE",
        content.note
      ) +
      formatOptionalBlock(
        "💡 ANALOGY",
        content.analogy
      )
    );
  }

  if (
    content.type ===
    "example"
  ) {
    return (
      `💬 ${content.prompt || ""}` +
      formatOptionalBlock(
        "Answer",
        content.answer
      ) +
      formatOptionalBlock(
        "Why",
        content.explanation
      )
    );
  }

  if (
    content.type ===
    "micro_check"
  ) {
    return (
      `${content.question || ""}\n\n` +
      formatOptions(
        content.options
      )
    );
  }

  if (
    content.type ===
    "application"
  ) {
    return (
      `${content.prompt || ""}\n\n` +
      formatOptions(
        content.options
      )
    );
  }

  if (
    content.type ===
    "exam_connection"
  ) {
    return (
      `Skill: ${content.skill || ""}\n\n` +
      `${content.examTip || ""}` +
      formatOptionalBlock(
        "⚠️ Common trap",
        content.commonTrap
      )
    );
  }

  if (
    content.type ===
    "final_stretch"
  ) {
    return (
      `${content.message || ""}`
    );
  }

  if (
    content.type ===
    "completion"
  ) {
    return (
      `${content.message || ""}` +
      formatOptionalBlock(
        "🎯 Takeaway",
        content.takeaway
      ) +
      formatOptionalBlock(
        "➡️ Next",
        content.nextStep
      )
    );
  }

  return Object.values(
    content
  )
    .filter(
      value =>
        typeof value ===
        "string"
    )
    .join("\n\n");
}

function formatOptionalBlock(
  title,
  value
) {
  if (!value) {
    return "";
  }

  return (
    `\n\n${title}\n${value}`
  );
}

function formatOptions(options) {
  if (
    !Array.isArray(options)
  ) {
    return "";
  }

  return options
    .map(
      (option, index) =>
        `${String.fromCharCode(
          65 + index
        )}) ${option}`
    )
    .join("\n");
}

function getLearningKeyboard(
  snapshot
) {
  if (
    snapshot.finished
  ) {
    return Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "📚 Learn",
          "home_learn"
        )
      ],
      [
        Markup.button.callback(
          "🏠 Home",
          "back_home"
        )
      ]
    ]);
  }

  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "➡️ Continue",
        "learn_continue"
      )
    ],
    [
      Markup.button.callback(
        "📚 Learn",
        "home_learn"
      ),
      Markup.button.callback(
        "🏠 Home",
        "back_home"
      )
    ]
  ]);
}

bot.action(
  "learn_continue",
  async ctx => {
    await ctx.answerCbQuery();

    const telegramId =
      ctx.from.id;

    const session =
      learningSessions.get(
        telegramId
      );

    if (!session) {
      await ctx.editMessageText(
        "Your learning session has ended. Let's start again. 📚",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "📚 Learn",
              "home_learn"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );

      return;
    }

    const result =
      advanceLesson(
        session.lesson,
        session.state
      );

    if (!result.success) {
      await ctx.editMessageText(
        "I couldn't move the lesson forward. 😅",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "📚 Learn",
              "home_learn"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );

      return;
    }

    session.state =
      result.state;

    learningSessions.set(
      telegramId,
      session
    );

    if (
      result.finished
    ) {
      await completeLearningLesson(
        ctx,
        session
      );

      return;
    }

    await showLearningSession(
      ctx
    );
  }
);

async function completeLearningLesson(
  ctx,
  session
) {
  const student =
    await getStudent(ctx);

  student.lessonsCompleted += 1;
  student.xp += 10;

  const unlocked =
    updateAchievements(
      student
    );

  await saveStudent(
    student
  );

  learningSessions.delete(
    ctx.from.id
  );

  let achievementText =
    "";

  if (
    unlocked.length
  ) {
    achievementText =
      "\n\n🏅 Achievement unlocked!\n" +
      unlocked.join("\n");
  }

  const text =
    "🏁 LESSON COMPLETE\n\n" +
    `You finished "${session.lesson.title}". 🎉\n\n` +
    "⭐ +10 XP\n" +
    `⭐ Total XP: ${student.xp}\n` +
    `📚 Lessons completed: ${student.lessonsCompleted}` +
    achievementText;

  await ctx.editMessageText(
    text,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "📚 Learn",
          "home_learn"
        )
      ],
      [
        Markup.button.callback(
          "📊 My Journey",
          "home_journey"
        )
      ],
      [
        Markup.button.callback(
          "🏠 Home",
          "back_home"
        )
      ]
    ])
  );
}
EOF
cat >> api/index.js <<'EOF'

bot.action(
  "home_practice",
  async ctx => {
    await ctx.answerCbQuery();

    const text =
      "✍️ PRACTICE\n\n" +
      "Every question is a chance to get a little stronger. 🧠\n\n" +
      "Choose your stream to begin:";

    await ctx.editMessageText(
      text,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🌿 Natural Sciences",
            "practice_natural"
          )
        ],
        [
          Markup.button.callback(
            "🌍 Social Sciences",
            "practice_social"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "practice_natural",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "🌿 NATURAL SCIENCES\n\nChoose a subject:",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📘 English",
            "subject_natural_english"
          ),
          Markup.button.callback(
            "📐 Mathematics",
            "subject_natural_math"
          )
        ],
        [
          Markup.button.callback(
            "🧬 Biology",
            "subject_biology"
          ),
          Markup.button.callback(
            "🧪 Chemistry",
            "subject_chemistry"
          )
        ],
        [
          Markup.button.callback(
            "⚡ Physics",
            "subject_physics"
          )
        ],
        [
          Markup.button.callback(
            "🧠 Scholastic Aptitude",
            "subject_aptitude"
          )
        ],
        [
          Markup.button.callback(
            "⬅️ Streams",
            "home_practice"
          )
        ]
      ])
    );
  }
);

bot.action(
  "practice_social",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "🌍 SOCIAL SCIENCES\n\nChoose a subject:",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📘 English",
            "subject_social_english"
          ),
          Markup.button.callback(
            "📐 Mathematics",
            "subject_social_math"
          )
        ],
        [
          Markup.button.callback(
            "🌍 Geography",
            "subject_geography"
          )
        ],
        [
          Markup.button.callback(
            "📈 Economics",
            "subject_economics"
          )
        ],
        [
          Markup.button.callback(
            "🏛️ History",
            "subject_history"
          )
        ],
        [
          Markup.button.callback(
            "⬅️ Streams",
            "home_practice"
          )
        ]
      ])
    );
  }
);

function findQuestionById(id) {
  return questions.find(
    question =>
      question.id === id
  );
}

function getQuestionsForSubject(
  subject
) {
  return questions.filter(
    question =>
      question.subject ===
      subject
  );
}

function getQuestionForStudent(
  student,
  subject
) {
  const subjectQuestions =
    getQuestionsForSubject(
      subject
    );

  if (
    subjectQuestions.length === 0
  ) {
    return null;
  }

  return subjectQuestions[0];
}

async function showPracticeQuestion(
  ctx,
  subject
) {
  const student =
    await getStudent(ctx);

  const question =
    getQuestionForStudent(
      student,
      subject
    );

  if (!question) {
    await ctx.editMessageText(
      "✍️ PRACTICE\n\n" +
        `We're still preparing questions for ${subject}.\n\n` +
        "More questions will be added to the verified question bank.",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "⬅️ Practice",
            "home_practice"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );

    return;
  }

  student.currentQuestionId =
    question.id;

  const text =
    `${question.emoji} ${question.subject.toUpperCase()}\n\n` +
    "Question\n\n" +
    question.question;

  await ctx.editMessageText(
    text,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          question.options[0],
          `answer_${question.id}_A`
        )
      ],
      [
        Markup.button.callback(
          question.options[1],
          `answer_${question.id}_B`
        )
      ],
      [
        Markup.button.callback(
          question.options[2],
          `answer_${question.id}_C`
        )
      ],
      [
        Markup.button.callback(
          question.options[3],
          `answer_${question.id}_D`
        )
      ],
      [
        Markup.button.callback(
          "⬅️ Practice",
          "home_practice"
        )
      ]
    ])
  );
}

const subjectActions = {
  subject_natural_english:
    "English",
  subject_natural_math:
    "Mathematics",
  subject_biology:
    "Biology",
  subject_chemistry:
    "Chemistry",
  subject_physics:
    "Physics",
  subject_aptitude:
    "Scholastic Aptitude",
  subject_social_english:
    "English",
  subject_social_math:
    "Mathematics",
  subject_geography:
    "Geography",
  subject_economics:
    "Economics",
  subject_history:
    "History"
};

Object.entries(
  subjectActions
).forEach(
  ([action, subject]) => {
    bot.action(
      action,
      async ctx => {
        await ctx.answerCbQuery();

        await showPracticeQuestion(
          ctx,
          subject
        );
      }
    );
  }
);

bot.action(
  /^answer_(.+)_([ABCD])$/,
  async ctx => {
    await ctx.answerCbQuery();

    try {
      const student =
        await getStudent(ctx);

      const questionId =
        ctx.match[1];

      const selectedAnswer =
        ctx.match[2];

      const question =
        findQuestionById(
          questionId
        );

      if (!question) {
        await ctx.editMessageText(
          "Something went wrong with that question.\n\nLet's try again. 😅",
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "✍️ Practice",
                "home_practice"
              )
            ],
            [
              Markup.button.callback(
                "🏠 Home",
                "back_home"
              )
            ]
          ])
        );

        return;
      }

      if (
        student.currentQuestionId !==
        question.id
      ) {
        await ctx.editMessageText(
          "That question is no longer active.\n\nLet's get you a fresh one. 🧠",
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "✍️ Practice",
                "home_practice"
              )
            ],
            [
              Markup.button.callback(
                "🏠 Home",
                "back_home"
              )
            ]
          ])
        );

        return;
      }

      const isCorrect =
        selectedAnswer ===
        question.correctAnswer;

      updateStreak(student);

      student.questionsAnswered +=
        1;

      if (
        !student.subjectProgress[
          question.subject
        ]
      ) {
        student.subjectProgress[
          question.subject
        ] = {
          answered: 0,
          correct: 0
        };
      }

      student.subjectProgress[
        question.subject
      ].answered += 1;

      if (isCorrect) {
        student.correctAnswers +=
          1;

        student.xp += 5;

        student.subjectProgress[
          question.subject
        ].correct += 1;
      } else {
        student.mistakes.push({
          questionId:
            question.id,
          subject:
            question.subject,
          selectedAnswer,
          correctAnswer:
            question.correctAnswer,
          createdAt:
            new Date().toISOString()
        });
      }

      student.currentQuestionId =
        null;

      const unlocked =
        updateAchievements(
          student
        );

      await saveStudent(
        student
      );

      const name =
        await getStudentName(ctx);

      let achievementText =
        "";

      if (
        unlocked.length > 0
      ) {
        achievementText =
          "\n\n🏅 Achievement unlocked!\n" +
          unlocked.join("\n");
      }

      if (isCorrect) {
        await ctx.editMessageText(
          "✅ CORRECT\n\n" +
            `Nice one, ${name}! 🔥\n\n` +
            "You got it right.\n\n" +
            "⭐ +5 XP\n" +
            `🔥 ${student.streak} day streak\n\n` +
            `🎯 Accuracy: ${getAccuracy(student)}%` +
            achievementText,
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                "➡️ Next Question",
                `next_${question.subject}`
              )
            ],
            [
              Markup.button.callback(
                "✍️ Practice",
                "home_practice"
              )
            ],
            [
              Markup.button.callback(
                "🏠 Home",
                "back_home"
              )
            ]
          ])
        );

        return;
      }

      await ctx.editMessageText(
        "❌ NOT QUITE\n\n" +
          "That's okay. Mistakes are part of learning. 🌱\n\n" +
          "⭐ +0 XP\n" +
          `🔥 ${student.streak} day streak\n\n` +
          `🎯 Accuracy: ${getAccuracy(student)}%` +
          achievementText,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "📖 Show me how",
              `explain_${question.id}`
            )
          ],
          [
            Markup.button.callback(
              "➡️ Next Question",
              `next_${question.subject}`
            )
          ],
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );
    } catch (error) {
      console.error(
        "Answer processing error:",
        error.message
      );

      await ctx.editMessageText(
        "I couldn't save that answer right now. 😅\n\nPlease try again.",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );
    }
  }
);

bot.action(
  /^explain_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    const question =
      findQuestionById(
        ctx.match[1]
      );

    if (!question) {
      await ctx.editMessageText(
        "I couldn't find that explanation.",
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✍️ Practice",
              "home_practice"
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      );

      return;
    }

    await ctx.editMessageText(
      "📖 SHOW ME HOW\n\n" +
        question.explanation +
        "\n\n" +
        `💡 Correct answer: ${question.correctAnswer}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "➡️ Next Question",
            `next_${question.subject}`
          )
        ],
        [
          Markup.button.callback(
            "✍️ Practice",
            "home_practice"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  /^next_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    await showPracticeQuestion(
      ctx,
      ctx.match[1]
    );
  }
);

bot.action(
  "home_journey",
  async ctx => {
    await ctx.answerCbQuery();

    const student =
      await getStudent(ctx);

    const name =
      await getStudentName(ctx);

    let achievementText =
      "None yet — your first one is waiting. 🌱";

    if (
      student.achievements.length >
      0
    ) {
      achievementText =
        student.achievements
          .map(
            item =>
              `🏅 ${item}`
          )
          .join("\n");
    }

    await ctx.editMessageText(
      "📊 MY JOURNEY\n\n" +
        `${name}'s personal progress\n\n` +
        `🆔 FineBot ID: ${student.finebotId}\n` +
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
        "🩹 Fix My Weak will help you work through it.",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🩹 Fix My Weak",
            "journey_weak"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "journey_weak",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "🩹 FIX MY WEAK\n\n" +
        "FineBot will look at your real practice results to find the areas that need more attention.\n\n" +
        "No random repetition.\n" +
        "No shame.\n" +
        "Just targeted help until things start making sense. 💪\n\n" +
        "The weakness engine will be connected after the Practice data foundation is complete.",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📊 My Journey",
            "home_journey"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);
EOF
cat >> api/index.js <<'EOF'

bot.action(
  "home_buddy",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "💬 STUDY BUDDY\n\n" +
        "You can talk naturally here.\n\n" +
        "Ask something you don't understand.\n" +
        "Share a random thought.\n" +
        "Say you're tired.\n" +
        "Or just type \"hey\".\n\n" +
        "Your Study Buddy will be connected in a later brick.\n\n" +
        "And when your brain needs a little refresh...\n" +
        "📖 Fun Stories will be right here.",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📖 Fun Stories",
            "buddy_stories"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "buddy_stories",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "📖 FUN STORIES\n\n" +
        "A little brain refresh between study sessions.\n\n" +
        "True stories, fascinating facts and just-for-fun moments will live here.\n\n" +
        "The story system will be connected in a later brick.",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "💬 Study Buddy",
            "home_buddy"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "home_support",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "🆘 SUPPORT\n\n" +
        "Need help with FineBot?\n\n" +
        "You can find:\n" +
        "• How to Use FineBot\n" +
        "• Frequently Asked Questions\n" +
        "• Help with problems or access\n" +
        "• Direct support\n\n" +
        "📧 finebot.support@gmail.com",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📖 How to Use FineBot",
            "support_how"
          )
        ],
        [
          Markup.button.callback(
            "❓ FAQ",
            "support_faq"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "support_how",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "📖 HOW TO USE FINEBOT\n\n" +
        "📚 Learn — build understanding step by step.\n\n" +
        "✍️ Practice — test what you know.\n\n" +
        "📊 My Journey — see your personal progress.\n\n" +
        "💬 Study Buddy — talk naturally and get help.\n\n" +
        "🆘 Support — get help whenever you need it.",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "⬅️ Support",
            "home_support"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "support_faq",
  async ctx => {
    await ctx.answerCbQuery();

    await ctx.editMessageText(
      "❓ FAQ\n\n" +
        "FineBot is being built as a Grade 12 mastering companion.\n\n" +
        "The learning, practice, progress, weakness recovery, Study Buddy and story systems are being developed step by step.\n\n" +
        "For a problem that needs direct help:\n" +
        "📧 finebot.support@gmail.com",
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "⬅️ Support",
            "home_support"
          )
        ],
        [
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    );
  }
);

bot.action(
  "back_home",
  async ctx => {
    await ctx.answerCbQuery();

    await showHome(ctx);
  }
);

bot.on(
  "callback_query",
  async ctx => {
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

bot.catch(
  (error, ctx) => {
    console.error(
      "FineBot error:",
      error &&
        error.message
        ? error.message
        : "Unknown error"
    );

    if (
      ctx &&
      ctx.callbackQuery
    ) {
      ctx
        .answerCbQuery(
          "Something went a little sideways. Try again. 😅"
        )
        .catch(() => {});
    }
  }
);

module.exports = async (
  req,
  res
) => {
  if (
    req.method === "GET"
  ) {
    return res
      .status(200)
      .send(
        "FineBot is running."
      );
  }

  if (
    req.method !== "POST"
  ) {
    return res
      .status(405)
      .send(
        "Method Not Allowed"
      );
  }

  const receivedSecret =
    req.headers[
      "x-telegram-bot-api-secret-token"
    ];

  if (
    !receivedSecret ||
    receivedSecret !==
      SECRET_TOKEN
  ) {
    return res
      .status(401)
      .send(
        "Unauthorized"
      );
  }

  if (!req.body) {
    console.error(
      "Webhook received without request body."
    );

    return res
      .status(400)
      .send(
        "Missing request body"
      );
  }

  try {
    await bot.handleUpdate(
      req.body
    );

    return res
      .status(200)
      .send("OK");
  } catch (error) {
    console.error(
      "FineBot webhook error:",
      error &&
        error.message
        ? error.message
        : "Unknown error"
    );

    return res
      .status(500)
      .send(
        "Internal Server Error"
      );
  }
};
EOF
