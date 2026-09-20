const { Telegraf, Markup } = require("telegraf");
const { createClient } = require("@supabase/supabase-js");

const {
  getLearnEnglishMenu,
  openEnglishLesson
} = require("../src/learning/learn");

const {
  getCurrentSection,
  completeCurrentSection,
  getProgress,
  isLessonFinished
} = require("../src/learning/engine");

const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_TOKEN = process.env.SECRET_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY =
  process.env.SUPABASE_SECRET_KEY;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is missing.");
}

if (!SECRET_TOKEN) {
  throw new Error("SECRET_TOKEN is missing.");
}

if (!SUPABASE_URL) {
  throw new Error("SUPABASE_URL is missing.");
}

if (!SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_SECRET_KEY is missing.");
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

const FIRST_ENGLISH_LESSON =
  "eng-passage-main-idea";

const QUESTIONS = [
  {
    id: "chemistry-001",
    track: "Natural",
    subject: "Chemistry",
    question:
      "Which subatomic particle has a negative charge?",
    options: [
      "A. Proton",
      "B. Neutron",
      "C. Electron",
      "D. Nucleus"
    ],
    correct: "C",
    explanation:
      "An electron carries a negative electric charge."
  },
  {
    id: "biology-001",
    track: "Natural",
    subject: "Biology",
    question:
      "Which organelle is commonly called the powerhouse of the cell?",
    options: [
      "A. Nucleus",
      "B. Mitochondrion",
      "C. Ribosome",
      "D. Cell wall"
    ],
    correct: "B",
    explanation:
      "Mitochondria produce much of the usable energy in cells."
  },
  {
    id: "physics-001",
    track: "Natural",
    subject: "Physics",
    question:
      "What is the SI unit of force?",
    options: [
      "A. Joule",
      "B. Watt",
      "C. Newton",
      "D. Pascal"
    ],
    correct: "C",
    explanation:
      "Force is measured in newtons (N)."
  },
  {
    id: "mathematics-001",
    track: "Natural",
    subject: "Mathematics",
    question:
      "What is 7 × 8?",
    options: [
      "A. 54",
      "B. 56",
      "C. 64",
      "D. 58"
    ],
    correct: "B",
    explanation:
      "7 × 8 = 56."
  },
  {
    id: "english-001",
    track: "Natural",
    subject: "English",
    question:
      "Which word is a noun?",
    options: [
      "A. Quickly",
      "B. Run",
      "C. Teacher",
      "D. Beautiful"
    ],
    correct: "C",
    explanation:
      "Teacher is a noun because it names a person."
  },
  {
    id: "aptitude-001",
    track: "Natural",
    subject: "Scholastic Aptitude",
    question:
      "All roses are flowers. Some flowers fade quickly. Which conclusion is definitely true?",
    options: [
      "A. All flowers are roses",
      "B. Some roses must fade quickly",
      "C. Roses are flowers",
      "D. No roses fade quickly"
    ],
    correct: "C",
    explanation:
      "The first statement directly establishes that roses are flowers."
  },
  {
    id: "geography-001",
    track: "Social",
    subject: "Geography",
    question:
      "Which imaginary line divides Earth into Northern and Southern Hemispheres?",
    options: [
      "A. Prime Meridian",
      "B. Equator",
      "C. Tropic of Cancer",
      "D. Arctic Circle"
    ],
    correct: "B",
    explanation:
      "The Equator is at 0° latitude and divides the two hemispheres."
  },
  {
    id: "economics-001",
    track: "Social",
    subject: "Economics",
    question:
      "What economic problem exists because resources are limited while wants are unlimited?",
    options: [
      "A. Inflation",
      "B. Scarcity",
      "C. Monopoly",
      "D. Profit"
    ],
    correct: "B",
    explanation:
      "Scarcity means resources are insufficient to satisfy all human wants."
  },
  {
    id: "history-001",
    track: "Social",
    subject: "History",
    question:
      "Which is an example of a primary historical source?",
    options: [
      "A. A diary written during the event",
      "B. A modern textbook",
      "C. A later encyclopedia",
      "D. A recent documentary"
    ],
    correct: "A",
    explanation:
      "A diary created during the historical period is a primary source."
  },
  {
    id: "social-math-001",
    track: "Social",
    subject: "Mathematics",
    question:
      "If x + 5 = 12, what is x?",
    options: [
      "A. 5",
      "B. 6",
      "C. 7",
      "D. 8"
    ],
    correct: "C",
    explanation:
      "Subtract 5 from both sides: x = 7."
  },
  {
    id: "social-english-001",
    track: "Social",
    subject: "English",
    question:
      "Choose the correct sentence.",
    options: [
      "A. She walk to school.",
      "B. She walks to school.",
      "C. She walking to school.",
      "D. She walkings to school."
    ],
    correct: "B",
    explanation:
      "With the singular subject 'she', the present-simple verb is 'walks'."
  }
];

function todayAddis() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Addis_Ababa"
  }).format(new Date());
}

function currentAddisHour() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Africa/Addis_Ababa",
      hour: "2-digit",
      hour12: false
    }).format(new Date())
  );
}

function createFineBotId(telegramId) {
  return `FB-${String(telegramId)
    .replace(/\D/g, "")
    .slice(-10)}`;
}

function escapeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function getStudent(user) {
  if (!user || !user.id) {
    return null;
  }

  const telegramId = String(user.id);

  if (students.has(telegramId)) {
    return students.get(telegramId);
  }

  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (error) {
    console.error(
      "Student lookup error:",
      error.message
    );
    return null;
  }

  if (data) {
    students.set(telegramId, data);
    return data;
  }

  const newStudent = {
    finebot_id: createFineBotId(telegramId),
    telegram_id: telegramId,
    first_name: user.first_name || "Student",
    username: user.username || null
  };

  const {
    data: created,
    error: createError
  } = await supabase
    .from("students")
    .insert(newStudent)
    .select("*")
    .single();

  if (createError) {
    console.error(
      "Student creation error:",
      createError.message
    );
    return null;
  }

  students.set(telegramId, created);

  return created;
}

async function saveStudent(student) {
  if (!student || !student.telegram_id) {
    return null;
  }

  const { data, error } = await supabase
    .from("students")
    .update({
      first_name: student.first_name,
      username: student.username,
      xp: student.xp,
      streak: student.streak,
      questions_answered:
        student.questions_answered,
      correct_answers:
        student.correct_answers,
      lessons_completed:
        student.lessons_completed,
      achievements:
        student.achievements,
      mistakes:
        student.mistakes,
      subject_progress:
        student.subject_progress,
      last_practice_date:
        student.last_practice_date,
      study_buddy_messages_today:
        student.study_buddy_messages_today,
      study_buddy_date:
        student.study_buddy_date,
      updated_at: new Date().toISOString()
    })
    .eq(
      "telegram_id",
      String(student.telegram_id)
    )
    .select("*")
    .single();

  if (error) {
    console.error(
      "Student save error:",
      error.message
    );
    return null;
  }

  students.set(
    String(student.telegram_id),
    data
  );

  return data;
}

function getAccuracy(student) {
  if (
    !student ||
    !Number(student.questions_answered)
  ) {
    return 0;
  }

  return Math.round(
    (Number(student.correct_answers) /
      Number(student.questions_answered)) *
      100
  );
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

function homeText(student) {
  return (
    `<b>FINEBOT</b>\n` +
    `<b>Grade 12 Mastering Companion</b>\n\n` +
    `Hey ${escapeText(
      student?.first_name || "Student"
    )}! 👋\n` +
    `Let's make your next study move count.\n\n` +
    `🔥 Streak: <b>${
      student?.streak || 0
    }</b>\n` +
    `⭐ XP: <b>${
      student?.xp || 0
    }</b>\n` +
    `✍️ Questions: <b>${
      student?.questions_answered || 0
    }</b>\n` +
    `🎯 Accuracy: <b>${getAccuracy(
      student
    )}%</b>`
  );
}

async function showHome(ctx, edit = false) {
  const student =
    await getStudent(ctx.from);

  if (!student) {
    return ctx.reply(
      "FineBot could not load your student profile."
    );
  }

  const options = {
    parse_mode: "HTML",
    ...homeKeyboard()
  };

  if (edit) {
    try {
      return await ctx.editMessageText(
        homeText(student),
        options
      );
    } catch (error) {
      if (
        !String(error.message || "")
          .includes("message is not modified")
      ) {
        console.error(
          "Home edit error:",
          error.message
        );
      }
    }

    return;
  }

  return ctx.reply(
    homeText(student),
    options
  );
}
function updateStreak(student) {
  const today = todayAddis();
  const previous =
    student.last_practice_date;

  if (!previous) {
    student.streak = 1;
  } else if (previous === today) {
    return;
  } else {
    const oldDate =
      new Date(
        `${previous}T00:00:00+03:00`
      );

    const currentDate =
      new Date(
        `${today}T00:00:00+03:00`
      );

    const difference = Math.round(
      (currentDate.getTime() -
        oldDate.getTime()) /
        86400000
    );

    if (difference === 1) {
      student.streak =
        Number(student.streak || 0) + 1;
    } else {
      student.streak = 1;
    }
  }

  student.last_practice_date = today;
}

function addAchievement(
  student,
  achievement
) {
  const achievements =
    Array.isArray(student.achievements)
      ? student.achievements
      : [];

  if (
    !achievements.includes(
      achievement
    )
  ) {
    achievements.push(achievement);
  }

  student.achievements =
    achievements;
}

function updateAchievements(student) {
  if (
    Number(student.questions_answered) >=
    1
  ) {
    addAchievement(
      student,
      "First Step"
    );
  }

  if (
    Number(student.lessons_completed) >=
    10
  ) {
    addAchievement(
      student,
      "Bookworm"
    );
  }

  if (
    Number(student.correct_answers) >=
    100
  ) {
    addAchievement(
      student,
      "Scholar"
    );
  }

  if (
    Number(student.streak) >=
    7
  ) {
    addAchievement(
      student,
      "Streak Keeper"
    );
  }

  if (currentAddisHour() < 8) {
    addAchievement(
      student,
      "Early Bird"
    );
  }
}

function findQuestion(id) {
  return (
    QUESTIONS.find(
      question => question.id === id
    ) || null
  );
}

function findQuestions(
  track,
  subject
) {
  return QUESTIONS.filter(
    question =>
      question.track === track &&
      question.subject === subject
  );
}

function questionKeyboard(question) {
  return Markup.inlineKeyboard(
    question.options.map(option => [
      Markup.button.callback(
        option,
        `answer_${question.id}_${option.charAt(0)}`
      )
    ])
  );
}

function questionText(question) {
  return (
    `<b>${escapeText(
      question.subject
    )}</b>\n\n` +
    `${escapeText(
      question.question
    )}\n\n` +
    question.options
      .map(option =>
        escapeText(option)
      )
      .join("\n")
  );
}

async function sendQuestion(
  ctx,
  question
) {
  if (!question) {
    return ctx.reply(
      "No question is available for this subject yet."
    );
  }

  return ctx.reply(
    questionText(question),
    {
      parse_mode: "HTML",
      ...questionKeyboard(question)
    }
  );
}

function practiceTrackKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural",
        "practice_track_Natural"
      ),
      Markup.button.callback(
        "🌍 Social",
        "practice_track_Social"
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

function practiceSubjectKeyboard(
  track
) {
  const subjects =
    track === "Natural"
      ? [
          "English",
          "Mathematics",
          "Biology",
          "Chemistry",
          "Physics",
          "Scholastic Aptitude"
        ]
      : [
          "English",
          "Mathematics",
          "Geography",
          "Economics",
          "History"
        ];

  const rows = [];

  for (
    let i = 0;
    i < subjects.length;
    i += 2
  ) {
    const row = [
      Markup.button.callback(
        subjects[i],
        `practice_subject_${encodeURIComponent(
          subjects[i]
        )}`
      )
    ];

    if (subjects[i + 1]) {
      row.push(
        Markup.button.callback(
          subjects[i + 1],
          `practice_subject_${encodeURIComponent(
            subjects[i + 1]
          )}`
        )
      );
    }

    rows.push(row);
  }

  rows.push([
    Markup.button.callback(
      "↩️ Tracks",
      "home_practice"
    ),
    Markup.button.callback(
      "🏠 Home",
      "back_home"
    )
  ]);

  return Markup.inlineKeyboard(
    rows
  );
}

async function showPractice(
  ctx,
  edit = false
) {
  const text =
    `<b>✍️ Practice</b>\n\n` +
    `Choose your exam track.\n\n` +
    `Answer questions, build XP, and let FineBot learn where you need more practice.`;

  const options = {
    parse_mode: "HTML",
    ...practiceTrackKeyboard()
  };

  if (edit) {
    return ctx.editMessageText(
      text,
      options
    );
  }

  return ctx.reply(
    text,
    options
  );
}

async function showPracticeSubjects(
  ctx,
  track
) {
  return ctx.editMessageText(
    `<b>📚 ${escapeText(
      track
    )}</b>\n\nChoose a subject to practice.`,
    {
      parse_mode: "HTML",
      ...practiceSubjectKeyboard(
        track
      )
    }
  );
}

async function openPracticeSubject(
  ctx,
  encodedSubject
) {
  const subject =
    decodeURIComponent(
      encodedSubject
    );

  const natural = [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Scholastic Aptitude"
  ];

  const social = [
    "English",
    "Mathematics",
    "Geography",
    "Economics",
    "History"
  ];

  let track = null;

  if (natural.includes(subject)) {
    track = "Natural";
  }

  if (social.includes(subject)) {
    track = "Social";
  }

  if (!track) {
    return ctx.answerCbQuery(
      "Subject unavailable."
    );
  }

  const questions =
    findQuestions(
      track,
      subject
    );

  if (!questions.length) {
    return ctx.editMessageText(
      `<b>${escapeText(
        subject
      )}</b>\n\nThe question bank for this subject is being prepared.`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "↩️ Subjects",
              `practice_track_${track}`
            )
          ],
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      }
    );
  }

  const question =
    questions[
      Math.floor(
        Math.random() *
          questions.length
      )
    ];

  return sendQuestion(
    ctx,
    question
  );
}

async function processAnswer(
  ctx,
  questionId,
  selected
) {
  const question =
    findQuestion(
      questionId
    );

  if (!question) {
    return ctx.answerCbQuery(
      "Question unavailable."
    );
  }

  const student =
    await getStudent(
      ctx.from
    );

  if (!student) {
    return ctx.answerCbQuery(
      "Student profile unavailable."
    );
  }

  const correct =
    selected ===
    question.correct;

  updateStreak(student);

  student.questions_answered =
    Number(
      student.questions_answered || 0
    ) + 1;

  if (correct) {
    student.correct_answers =
      Number(
        student.correct_answers || 0
      ) + 1;

    student.xp =
      Number(
        student.xp || 0
      ) +
      5 +
      (Number(student.streak || 0) > 1
        ? 10
        : 0);
  } else {
    const mistakes =
      Array.isArray(
        student.mistakes
      )
        ? student.mistakes
        : [];

    mistakes.push({
      questionId:
        question.id,
      subject:
        question.subject,
      date:
        todayAddis()
    });

    student.mistakes =
      mistakes.slice(-100);
  }

  updateAchievements(
    student
  );

  await saveStudent(
    student
  );

  const title = correct
    ? "✅ Correct!"
    : "❌ Not quite.";

  const answerText = correct
    ? "You got it! +XP added."
    : `The correct answer is <b>${escapeText(
        question.correct
      )}</b>.`;

  return ctx.editMessageText(
    `<b>${title}</b>\n\n` +
      `${answerText}\n\n` +
      `<b>📖 Why?</b>\n` +
      `${escapeText(
        question.explanation
      )}\n\n` +
      `⭐ XP: <b>${student.xp}</b>\n` +
      `🔥 Streak: <b>${student.streak}</b>`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "➡️ Next Question",
            `next_question_${encodeURIComponent(
              question.subject
            )}`
          )
        ],
        [
          Markup.button.callback(
            "📊 My Journey",
            "home_journey"
          ),
          Markup.button.callback(
            "🏠 Home",
            "back_home"
          )
        ]
      ])
    }
  );
}

async function nextQuestion(
  ctx,
  encodedSubject
) {
  const subject =
    decodeURIComponent(
      encodedSubject
    );

  const natural = [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Scholastic Aptitude"
  ];

  const track =
    natural.includes(subject)
      ? "Natural"
      : "Social";

  const questions =
    findQuestions(
      track,
      subject
    );

  if (!questions.length) {
    return ctx.answerCbQuery(
      "No question available."
    );
  }

  const question =
    questions[
      Math.floor(
        Math.random() *
          questions.length
      )
    ];

  return sendQuestion(
    ctx,
    question
  );
}
async function showJourney(
  ctx,
  edit = false
) {
  const student =
    await getStudent(
      ctx.from
    );

  if (!student) {
    return ctx.reply(
      "FineBot could not load your journey."
    );
  }

  const achievements =
    Array.isArray(
      student.achievements
    )
      ? student.achievements
      : [];

  const achievementText =
    achievements.length
      ? achievements
          .map(
            item =>
              `🏅 ${escapeText(item)}`
          )
          .join("\n")
      : "No achievements yet.";

  const text =
    `<b>📊 My Journey</b>\n\n` +
    `⭐ XP: <b>${student.xp}</b>\n` +
    `🔥 Streak: <b>${student.streak}</b>\n` +
    `✍️ Questions: <b>${student.questions_answered}</b>\n` +
    `✅ Correct: <b>${student.correct_answers}</b>\n` +
    `🎯 Accuracy: <b>${getAccuracy(student)}%</b>\n` +
    `📚 Lessons completed: <b>${student.lessons_completed}</b>\n\n` +
    `<b>Achievements</b>\n` +
    achievementText;

  const options = {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
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
  };

  if (edit) {
    return ctx.editMessageText(
      text,
      options
    );
  }

  return ctx.reply(
    text,
    options
  );
}

async function showWeak(
  ctx
) {
  const student =
    await getStudent(
      ctx.from
    );

  if (!student) {
    return ctx.answerCbQuery(
      "Student profile unavailable."
    );
  }

  const mistakes =
    Array.isArray(
      student.mistakes
    )
      ? student.mistakes
      : [];

  if (!mistakes.length) {
    return ctx.editMessageText(
      `<b>🩹 Fix My Weak</b>\n\n` +
        `You don't have tracked mistakes yet.\n\n` +
        `Practice more and FineBot will build your weakness history.`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
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
      }
    );
  }

  const counts = {};

  for (
    const mistake of mistakes
  ) {
    const subject =
      mistake.subject ||
      "Unknown";

    counts[subject] =
      (counts[subject] || 0) +
      1;
  }

  const weakest =
    Object.entries(
      counts
    )
      .sort(
        (a, b) => b[1] - a[1]
      )
      .slice(0, 3);

  const list =
    weakest
      .map(
        ([subject, count]) =>
          `• ${escapeText(subject)} — ${count} missed`
      )
      .join("\n");

  return ctx.editMessageText(
    `<b>🩹 Fix My Weak</b>\n\n` +
      `Your recent mistakes point to:\n\n` +
      list +
      `\n\nPractice those areas again to strengthen them.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "✍️ Practice",
            "home_practice"
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
    }
  );
}

function learnTrackKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural",
        "learn_track_natural"
      ),
      Markup.button.callback(
        "🌍 Social",
        "learn_track_social"
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

async function showLearn(
  ctx,
  edit = false
) {
  const text =
    `<b>📚 Learn</b>\n\n` +
    `Choose your Grade 12 track.\n\n` +
    `For this first live test, FineBot's English learning system is connected first.`;

  const options = {
    parse_mode: "HTML",
    ...learnTrackKeyboard()
  };

  if (edit) {
    return ctx.editMessageText(
      text,
      options
    );
  }

  return ctx.reply(
    text,
    options
  );
}

function englishLessonKeyboard(
  track
) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "▶️ Start Main Idea",
        `learn_open_${FIRST_ENGLISH_LESSON}_${track}`
      )
    ],
    [
      Markup.button.callback(
        "↩️ Subjects",
        `learn_track_${track}`
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

async function showEnglish(
  ctx,
  track
) {
  const menu =
    getLearnEnglishMenu();

  const lesson =
    menu
      .flatMap(
        category =>
          category.lessons || []
      )
      .find(
        item =>
          item.id ===
          FIRST_ENGLISH_LESSON
      );

  if (!lesson) {
    return ctx.editMessageText(
      `<b>📚 English</b>\n\n` +
        `The first English lesson could not be loaded.`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      }
    );
  }

  return ctx.editMessageText(
    `<b>🇬🇧 English</b>\n\n` +
      `<b>${escapeText(
        lesson.title
      )}</b>\n\n` +
      `Difficulty: ${escapeText(
        lesson.difficulty
      )}\n\n` +
      `This is the first live English lesson connected to FineBot.\n\n` +
      `Let's test it properly before opening the rest of the English catalog.`,
    {
      parse_mode: "HTML",
      ...englishLessonKeyboard(
        track
      )
    }
  );
}

function learningButton(
  data
) {
  if (
    data &&
    data.state &&
    isLessonFinished(
      data.state
    )
  ) {
    return Markup.inlineKeyboard([
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
        "🏠 Home",
        "back_home"
      )
    ]
  ]);
}

function learningText(
  data
) {
  const lesson =
    data.lesson;

  const state =
    data.state;

  const section =
    getCurrentSection(
      lesson,
      state
    );

  if (!section) {
    return null;
  }

  const progress =
    getProgress(
      lesson,
      state
    );

  const labelMap = {
    introduction:
      "👋 START HERE",
    concept:
      "🧠 CONCEPT",
    note:
      "📝 NOTE",
    example:
      "💡 EXAMPLE",
    quick_check:
      "⚡ QUICK CHECK",
    application:
      "🎯 APPLICATION",
    exam_connection:
      "📄 EXAM CONNECTION",
    final_stretch:
      "🎯 FINAL STRETCH",
    completion:
      "🏁 COMPLETE"
  };

  const label =
    labelMap[section.type] ||
    String(
      section.type ||
        "LESSON"
    ).toUpperCase();

  let content = "";

  if (
    typeof section.content ===
    "string"
  ) {
    content =
      section.content;
  } else if (
    section.content
  ) {
    content =
      JSON.stringify(
        section.content,
        null,
        2
      );
  }

  const title =
    section.title
      ? `\n<b>${escapeText(
          section.title
        )}</b>\n`
      : "";

  return (
    `<b>${label}</b>` +
    title +
    `\n${escapeText(content)}\n\n` +
    `📍 ${progress.current}/${progress.total} sections · ${progress.percentage}%`
  );
}

async function sendLearningSection(
  ctx,
  data
) {
  const text =
    learningText(data);

  if (!text) {
    return finishLearning(
      ctx,
      data
    );
  }

  return ctx.editMessageText(
    text,
    {
      parse_mode: "HTML",
      ...learningButton(data)
    }
  );
}

async function startEnglishLesson(
  ctx,
  lessonId,
  track
) {
  const result =
    openEnglishLesson(
      lessonId
    );

  if (
    !result ||
    !result.success ||
    !result.lesson ||
    !result.session
  ) {
    return ctx.answerCbQuery(
      "The lesson could not be opened."
    );
  }

  learningSessions.set(
    String(ctx.from.id),
    {
      lessonId,
      track,
      lesson:
        result.lesson,
      state:
        result.session.state
    }
  );

  return sendLearningSection(
    ctx,
    learningSessions.get(
      String(ctx.from.id)
    )
  );
}

async function continueLearning(
  ctx
) {
  const key =
    String(ctx.from.id);

  const data =
    learningSessions.get(
      key
    );

  if (!data) {
    return ctx.answerCbQuery(
      "Open the lesson first."
    );
  }

  if (
    isLessonFinished(
      data.state
    )
  ) {
    return finishLearning(
      ctx,
      data
    );
  }

  const result =
    completeCurrentSection(
      data.lesson,
      data.state
    );

  if (!result.completed) {
    return ctx.answerCbQuery(
      "FineBot could not advance this section."
    );
  }

  data.state =
    result.state;

  learningSessions.set(
    key,
    data
  );

  if (
    isLessonFinished(
      data.state
    )
  ) {
    return finishLearning(
      ctx,
      data
    );
  }

  return sendLearningSection(
    ctx,
    data
  );
}

async function finishLearning(
  ctx,
  data
) {
  const student =
    await getStudent(
      ctx.from
    );

  if (student) {
    const alreadyFinished =
      data.completedReward ===
      true;

    if (!alreadyFinished) {
      student.lessons_completed =
        Number(
          student.lessons_completed ||
            0
        ) + 1;

      student.xp =
        Number(
          student.xp || 0
        ) + 10;

      updateAchievements(
        student
      );

      await saveStudent(
        student
      );

      data.completedReward =
        true;

      learningSessions.set(
        String(ctx.from.id),
        data
      );
    }
  }

  return ctx.editMessageText(
    `<b>🎉 Lesson Complete!</b>\n\n` +
      `You completed:\n` +
      `<b>${escapeText(
        data.lesson.title
      )}</b>\n\n` +
      `⭐ <b>+10 XP</b>\n` +
      `📚 Lesson added to your journey.\n\n` +
      `You just finished your first connected FineBot English lesson.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
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
    }
  );
}
async function showBuddy(
  ctx,
  edit = false
) {
  const student =
    await getStudent(
      ctx.from
    );

  if (!student) {
    return ctx.reply(
      "FineBot could not load your profile."
    );
  }

  const today =
    todayAddis();

  if (
    student.study_buddy_date !==
    today
  ) {
    student.study_buddy_date =
      today;

    student.study_buddy_messages_today =
      0;

    await saveStudent(
      student
    );
  }

  const used =
    Number(
      student.study_buddy_messages_today ||
        0
    );

  const remaining =
    Math.max(
      0,
      3 - used
    );

  const text =
    `<b>💬 Study Buddy</b>\n\n` +
    `I'm here for your study journey.\n\n` +
    `You can share a thought, ask a study question, or tell me you're stuck.\n\n` +
    `💬 Free conversations remaining today: <b>${remaining}</b>`;

  const options = {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
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
  };

  if (edit) {
    return ctx.editMessageText(
      text,
      options
    );
  }

  return ctx.reply(
    text,
    options
  );
}

async function showStories(
  ctx
) {
  return ctx.editMessageText(
    `<b>📖 Fun Stories</b>\n\n` +
      `Your study break space is here.\n\n` +
      `Short, useful stories will be connected here as the Study Buddy system grows.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
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
    }
  );
}

async function showSupport(
  ctx,
  edit = false
) {
  const text =
    `<b>🆘 Support</b>\n\n` +
    `Need help with FineBot?\n\n` +
    `<b>How to use</b>\n` +
    `📚 Learn — study lessons step by step.\n` +
    `✍️ Practice — answer questions and build XP.\n` +
    `📊 My Journey — see your personal progress.\n` +
    `💬 Study Buddy — get study support.\n\n` +
    `<b>Contact</b>\n` +
    `finebot.support@gmail.com`;

  const options = {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
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
  };

  if (edit) {
    return ctx.editMessageText(
      text,
      options
    );
  }

  return ctx.reply(
    text,
    options
  );
}

async function showFaq(
  ctx
) {
  return ctx.editMessageText(
    `<b>❓ FineBot FAQ</b>\n\n` +
    `<b>Is FineBot free?</b>\n` +
    `Yes. The free experience is designed to be useful on its own.\n\n` +
    `<b>Does FineBot save progress?</b>\n` +
    `Yes. Your XP, streak, practice history and completed lessons are stored in your student profile.\n\n` +
    `<b>Can I continue a lesson?</b>\n` +
    `Yes. FineBot keeps your active lesson session while the bot is running.\n\n` +
    `<b>Need more help?</b>\n` +
    `finebot.support@gmail.com`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "🆘 Support",
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
    }
  );
}

bot.start(
  async ctx => {
    try {
      const student =
        await getStudent(
          ctx.from
        );

      if (!student) {
        return ctx.reply(
          "FineBot could not create your student profile. Please try again."
        );
      }

      return ctx.reply(
        homeText(student),
        {
          parse_mode: "HTML",
          ...homeKeyboard()
        }
      );
    } catch (error) {
      console.error(
        "/start error:",
        error.message
      );

      return ctx.reply(
        "FineBot encountered a temporary problem. Please try again."
      );
    }
  }
);

bot.action(
  "back_home",
  async ctx => {
    await ctx.answerCbQuery();

    return showHome(
      ctx,
      true
    );
  }
);

bot.action(
  "home_learn",
  async ctx => {
    await ctx.answerCbQuery();

    return showLearn(
      ctx,
      true
    );
  }
);

bot.action(
  "home_practice",
  async ctx => {
    await ctx.answerCbQuery();

    return showPractice(
      ctx,
      true
    );
  }
);

bot.action(
  "home_journey",
  async ctx => {
    await ctx.answerCbQuery();

    return showJourney(
      ctx,
      true
    );
  }
);

bot.action(
  "home_buddy",
  async ctx => {
    await ctx.answerCbQuery();

    return showBuddy(
      ctx,
      true
    );
  }
);

bot.action(
  "home_support",
  async ctx => {
    await ctx.answerCbQuery();

    return showSupport(
      ctx,
      true
    );
  }
);

bot.action(
  "journey_weak",
  async ctx => {
    await ctx.answerCbQuery();

    return showWeak(
      ctx
    );
  }
);

bot.action(
  "support_faq",
  async ctx => {
    await ctx.answerCbQuery();

    return showFaq(
      ctx
    );
  }
);

bot.action(
  "buddy_stories",
  async ctx => {
    await ctx.answerCbQuery();

    return showStories(
      ctx
    );
  }
);

bot.action(
  "practice_track_Natural",
  async ctx => {
    await ctx.answerCbQuery();

    return showPracticeSubjects(
      ctx,
      "Natural"
    );
  }
);

bot.action(
  "practice_track_Social",
  async ctx => {
    await ctx.answerCbQuery();

    return showPracticeSubjects(
      ctx,
      "Social"
    );
  }
);

bot.action(
  /^practice_subject_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return openPracticeSubject(
      ctx,
      ctx.match[1]
    );
  }
);

bot.action(
  /^answer_([^_]+)_([A-D])$/,
  async ctx => {
    await ctx.answerCbQuery();

    return processAnswer(
      ctx,
      ctx.match[1],
      ctx.match[2]
    );
  }
);

bot.action(
  /^next_question_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return nextQuestion(
      ctx,
      ctx.match[1]
    );
  }
);

bot.action(
  "learn_track_natural",
  async ctx => {
    await ctx.answerCbQuery();

    return showEnglish(
      ctx,
      "natural"
    );
  }
);

bot.action(
  "learn_track_social",
  async ctx => {
    await ctx.answerCbQuery();

    return showEnglish(
      ctx,
      "social"
    );
  }
);

bot.action(
  /^learn_open_([^_]+)_(natural|social)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return startEnglishLesson(
      ctx,
      ctx.match[1],
      ctx.match[2]
    );
  }
);

bot.action(
  "learn_continue",
  async ctx => {
    await ctx.answerCbQuery();

    return continueLearning(
      ctx
    );
  }
);

bot.on(
  "text",
  async ctx => {
    const text =
      String(
        ctx.message?.text || ""
      ).trim();

    if (!text) {
      return;
    }

    const student =
      await getStudent(
        ctx.from
      );

    if (!student) {
      return ctx.reply(
        "FineBot could not load your student profile."
      );
    }

    const today =
      todayAddis();

    if (
      student.study_buddy_date !==
      today
    ) {
      student.study_buddy_date =
        today;

      student.study_buddy_messages_today =
        0;
    }

    const used =
      Number(
        student.study_buddy_messages_today ||
          0
      );

    if (used >= 3) {
      return ctx.reply(
        `💬 You've used your 3 free Study Buddy conversations for today.\n\nCome back tomorrow and we'll continue.`
      );
    }

    student.study_buddy_messages_today =
      used + 1;

    await saveStudent(
      student
    );

    const lower =
      text.toLowerCase();

    let response =
      `💬 I hear you.\n\n` +
      `Take one small step: choose one concept or one question and work on just that.\n\n` +
      `You don't need to finish everything at once.`;

    if (
      lower.includes("hello") ||
      lower.includes("hey") ||
      lower.includes("hi")
    ) {
      response =
        `👋 Hey ${escapeText(
          student.first_name
        )}!\n\n` +
        `Ready for one small win today?`;
    } else if (
      lower.includes("tired") ||
      lower.includes("stress") ||
      lower.includes("stuck")
    ) {
      response =
        `🫶 That's a real study moment.\n\n` +
        `Pause for a minute, breathe, then choose just one small question or concept.\n\n` +
        `Progress doesn't require a perfect day.`;
    }

    return ctx.reply(
      response,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
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
              "🏠 Home",
              "back_home"
            )
          ]
        ])
      }
    );
  }
);

bot.catch(
  (error, ctx) => {
    console.error(
      "FineBot bot error:",
      error &&
        error.message
        ? error.message
        : "Unknown error"
    );

    if (ctx) {
      console.error(
        "Update type:",
        ctx.updateType ||
          "unknown"
      );
    }
  }
);

module.exports =
  async (req, res) => {
    if (req.method === "GET") {
      return res
        .status(200)
        .send(
          "FineBot is running."
        );
    }

    if (req.method !== "POST") {
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
