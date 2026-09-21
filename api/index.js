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

const TRACKS = {
  Natural: [
    {
      name: "English",
      emoji: "🇬🇧",
      active: true
    },
    {
      name: "Mathematics",
      emoji: "📐",
      active: false
    },
    {
      name: "Biology",
      emoji: "🧬",
      active: false
    },
    {
      name: "Chemistry",
      emoji: "⚗️",
      active: false
    },
    {
      name: "Physics",
      emoji: "⚛️",
      active: false
    },
    {
      name: "Scholastic Aptitude",
      emoji: "🧠",
      active: false
    }
  ],
  Social: [
    {
      name: "English",
      emoji: "🇬🇧",
      active: false
    },
    {
      name: "Mathematics",
      emoji: "📐",
      active: false
    },
    {
      name: "Geography",
      emoji: "🌍",
      active: false
    },
    {
      name: "Economics",
      emoji: "📈",
      active: false
    },
    {
      name: "History",
      emoji: "🏛️",
      active: false
    }
  ]
};

const SUBJECT_EMOJIS = {
  English: "🇬🇧",
  Mathematics: "📐",
  Biology: "🧬",
  Chemistry: "⚗️",
  Physics: "⚛️",
  "Scholastic Aptitude": "🧠",
  Geography: "🌍",
  Economics: "📈",
  History: "🏛️"
};

const FEEDBACK = {
  correct: [
    "🔥 Nailed it. Your brain just collected another useful piece.",
    "🎯 Clean hit. That answer was sitting there waiting for you.",
    "⚡ Correct! Tiny win, real progress.",
    "🧠 Your reasoning held up. Keep that momentum.",
    "🚀 Nice one. That is another brick in the exam wall.",
    "😎 Correct. The question tried its little trick and you didn't fall for it."
  ],
  wrong: [
    "🧩 Not quite — but this is exactly where learning gets useful.",
    "😄 The question tried to sneak past you. Now you know its trick.",
    "🛠️ Almost there. One correction now can save you marks later.",
    "🎯 Missed this one, but the mistake gives us something specific to fix.",
    "🧠 Your brain has now seen the trap. Next encounter can be different.",
    "📌 No shame in this one. Let's turn the miss into a memory."
  ],
  completion: [
    "🏁 Finished! You didn't just open the lesson — you actually moved through it.",
    "🎉 Lesson cleared. Your future exam paper has one less mystery.",
    "🚀 Done! One more piece of Grade 12 English is now under your belt.",
    "😎 That's a wrap. Your brain can officially stop pretending this topic is a stranger.",
    "🔥 Completed. Small consistent wins become serious preparation."
  ]
};

const ACHIEVEMENT_RULES = [
  {
    name: "First Step",
    test: student =>
      Number(student.questions_answered) >= 1
  },
  {
    name: "Bookworm",
    test: student =>
      Number(student.lessons_completed) >= 10
  },
  {
    name: "Scholar",
    test: student =>
      Number(student.correct_answers) >= 100
  },
  {
    name: "Streak Keeper",
    test: student =>
      Number(student.streak) >= 7
  },
  {
    name: "Early Bird",
    test: () => currentAddisHour() < 8
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

function randomItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return items[
    Math.floor(Math.random() * items.length)
  ];
}

function escapeText(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function createFineBotId(telegramId) {
  return `FB-${String(telegramId)
    .replace(/\D/g, "")
    .slice(-10)}`;
}

function getAccuracy(student) {
  const answered = Number(
    student?.questions_answered || 0
  );

  if (!answered) {
    return 0;
  }

  return Math.round(
    (Number(student.correct_answers || 0) /
      answered) *
      100
  );
}

function getSubjectProgress(student) {
  if (
    !student ||
    typeof student.subject_progress !== "object" ||
    Array.isArray(student.subject_progress)
  ) {
    return {};
  }

  return student.subject_progress || {};
}

function ensureSubjectRecord(
  student,
  subject
) {
  const progress =
    getSubjectProgress(student);

  if (!progress[subject]) {
    progress[subject] = {
      questions: 0,
      correct: 0,
      lessons: 0,
      xp: 0,
      last_activity: null
    };
  }

  student.subject_progress =
    progress;

  return progress[subject];
}

function updateSubjectPractice(
  student,
  subject,
  correct,
  xp
) {
  const record =
    ensureSubjectRecord(
      student,
      subject
    );

  record.questions =
    Number(record.questions || 0) + 1;

  if (correct) {
    record.correct =
      Number(record.correct || 0) + 1;
  }

  record.xp =
    Number(record.xp || 0) +
    Number(xp || 0);

  record.last_activity =
    todayAddis();
}

function updateSubjectLesson(
  student,
  subject,
  xp
) {
  const record =
    ensureSubjectRecord(
      student,
      subject
    );

  record.lessons =
    Number(record.lessons || 0) + 1;

  record.xp =
    Number(record.xp || 0) +
    Number(xp || 0);

  record.last_activity =
    todayAddis();
}

async function getStudent(user) {
  if (!user || !user.id) {
    return null;
  }

  const telegramId =
    String(user.id);

  if (students.has(telegramId)) {
    return students.get(telegramId);
  }

  const { data, error } =
    await supabase
      .from("students")
      .select("*")
      .eq(
        "telegram_id",
        telegramId
      )
      .maybeSingle();

  if (error) {
    console.error(
      "Student lookup error:",
      error.message
    );
    return null;
  }

  if (data) {
    students.set(
      telegramId,
      data
    );

    return data;
  }

  const newStudent = {
    finebot_id:
      createFineBotId(
        telegramId
      ),
    telegram_id:
      telegramId,
    first_name:
      user.first_name ||
      "Student",
    username:
      user.username ||
      null
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

  students.set(
    telegramId,
    created
  );

  return created;
}

async function saveStudent(student) {
  if (
    !student ||
    !student.telegram_id
  ) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("students")
      .update({
        first_name:
          student.first_name,
        username:
          student.username,
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
        updated_at:
          new Date().toISOString()
      })
      .eq(
        "telegram_id",
        String(
          student.telegram_id
        )
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
    String(
      student.telegram_id
    ),
    data
  );

  return data;
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
      student?.first_name ||
        "Student"
    )}! 👋\n\n` +
    `Your next useful step is waiting.\n\n` +
    `🔥 Streak: <b>${Number(
      student?.streak || 0
    )}</b>\n` +
    `⭐ XP: <b>${Number(
      student?.xp || 0
    )}</b>\n` +
    `✍️ Questions: <b>${Number(
      student?.questions_answered || 0
    )}</b>\n` +
    `🎯 Accuracy: <b>${getAccuracy(
      student
    )}%</b>`
  );
}

async function showHome(
  ctx,
  edit = false
) {
  const student =
    await getStudent(
      ctx.from
    );

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
        !String(
          error.message || ""
        ).includes(
          "message is not modified"
        )
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
  const today =
    todayAddis();

  const previous =
    student.last_practice_date;

  if (!previous) {
    student.streak = 1;
  } else if (
    previous === today
  ) {
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

    const difference =
      Math.round(
        (currentDate.getTime() -
          oldDate.getTime()) /
          86400000
      );

    if (difference === 1) {
      student.streak =
        Number(
          student.streak || 0
        ) + 1;
    } else {
      student.streak = 1;
    }
  }

  student.last_practice_date =
    today;
}

function addAchievement(
  student,
  achievement
) {
  const achievements =
    Array.isArray(
      student.achievements
    )
      ? student.achievements
      : [];

  if (
    !achievements.includes(
      achievement
    )
  ) {
    achievements.push(
      achievement
    );
  }

  student.achievements =
    achievements;
}

function updateAchievements(
  student
) {
  for (
    const rule of
    ACHIEVEMENT_RULES
  ) {
    if (
      rule.test(student)
    ) {
      addAchievement(
        student,
        rule.name
      );
    }
  }
}

function streamKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural Science",
        "learn_stream_natural"
      )
    ],
    [
      Markup.button.callback(
        "🌍 Social Science",
        "learn_stream_social"
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
    `Choose your Grade 12 stream.\n\n` +
    `🌿 <b>Natural Science</b>\n` +
    `Science-focused subjects and English.\n\n` +
    `🌍 <b>Social Science</b>\n` +
    `Humanities, social studies and English.\n\n` +
    `Choose a stream and FineBot will take you to its subjects.`;

  const options = {
    parse_mode: "HTML",
    ...streamKeyboard()
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

function subjectKeyboard(
  track
) {
  const subjects =
    TRACKS[track] || [];

  const rows = [];

  for (
    let i = 0;
    i < subjects.length;
    i += 2
  ) {
    const first =
      subjects[i];

    const row = [
      Markup.button.callback(
        `${first.emoji} ${first.name}`,
        `learn_subject_${track}_${encodeURIComponent(first.name)}`
      )
    ];

    if (subjects[i + 1]) {
      const second =
        subjects[i + 1];

      row.push(
        Markup.button.callback(
          `${second.emoji} ${second.name}`,
          `learn_subject_${track}_${encodeURIComponent(second.name)}`
        )
      );
    }

    rows.push(row);
  }

  rows.push([
    Markup.button.callback(
      "↩️ Streams",
      "home_learn"
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

async function showSubjects(
  ctx,
  track
) {
  const emoji =
    track === "Natural"
      ? "🌿"
      : "🌍";

  return ctx.editMessageText(
    `<b>${emoji} ${escapeText(
      track
    )} Science</b>\n\n` +
      `Choose a subject.\n\n` +
      `🇬🇧 English is the first live course. The remaining subject spaces are ready for their course content to be connected.`,
    {
      parse_mode: "HTML",
      ...subjectKeyboard(
        track
      )
    }
  );
}

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
      "An electron carries a negative electric charge.",
    sourceType:
      "starter_original"
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
      "Mitochondria produce much of the usable energy in cells.",
    sourceType:
      "starter_original"
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
      "Force is measured in newtons (N).",
    sourceType:
      "starter_original"
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
      "7 × 8 = 56.",
    sourceType:
      "starter_original"
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
      "Teacher is a noun because it names a person.",
    sourceType:
      "starter_original"
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
      "The first statement directly establishes that roses are flowers.",
    sourceType:
      "starter_original"
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
      "The Equator is at 0° latitude and divides the two hemispheres.",
    sourceType:
      "starter_original"
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
      "Scarcity means resources are insufficient to satisfy all human wants.",
    sourceType:
      "starter_original"
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
      "A diary created during the historical period is a primary source.",
    sourceType:
      "starter_original"
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
      "Subtract 5 from both sides: x = 7.",
    sourceType:
      "starter_original"
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
      "With the singular subject 'she', the present-simple verb is 'walks'.",
    sourceType:
      "starter_original"
  }
];

function findQuestion(id) {
  return (
    QUESTIONS.find(
      question =>
        question.id === id
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

function questionKeyboard(
  question
) {
  return Markup.inlineKeyboard(
    question.options.map(
      option => [
        Markup.button.callback(
          option,
          `answer_${question.id}_${option.charAt(0)}`
        )
      ]
    )
  );
}

function questionText(
  question
) {
  const source =
    question.sourceType ===
    "official_past_exam"
      ? "📄 Verified past-exam question"
      : "🧪 FineBot original practice";

  return (
    `<b>${SUBJECT_EMOJIS[
      question.subject
    ] || "📘"} ${escapeText(
      question.subject
    )}</b>\n\n` +
    `${escapeText(
      question.question
    )}\n\n` +
    `${question.options
      .map(option =>
        escapeText(option)
      )
      .join("\n")}\n\n` +
    `<i>${source}</i>`
  );
}

async function sendQuestion(
  ctx,
  question
) {
  if (!question) {
    return ctx.reply(
      "There is no question available for this subject yet."
    );
  }

  return ctx.reply(
    questionText(question),
    {
      parse_mode: "HTML",
      ...questionKeyboard(
        question
      )
    }
  );
}

function practiceTrackKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural Science",
        "practice_track_Natural"
      )
    ],
    [
      Markup.button.callback(
        "🌍 Social Science",
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
    TRACKS[track] || [];

  const rows = [];

  for (
    let i = 0;
    i < subjects.length;
    i += 2
  ) {
    const first =
      subjects[i];

    const row = [
      Markup.button.callback(
        `${first.emoji} ${first.name}`,
        `practice_subject_${track}_${encodeURIComponent(first.name)}`
      )
    ];

    if (subjects[i + 1]) {
      const second =
        subjects[i + 1];

      row.push(
        Markup.button.callback(
          `${second.emoji} ${second.name}`,
          `practice_subject_${track}_${encodeURIComponent(second.name)}`
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
    `Questions are designed to build exam reasoning, not just answer collecting.\n\n` +
    `🧠 A mistake becomes useful data for your personal journey.`;

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
  const emoji =
    track === "Natural"
      ? "🌿"
      : "🌍";

  return ctx.editMessageText(
    `<b>${emoji} ${escapeText(
      track
    )} Practice</b>\n\n` +
      `Pick the subject you want to train.\n\n` +
      `FineBot records your actual attempts so your Journey can become more useful over time.`,
    {
      parse_mode: "HTML",
      ...practiceSubjectKeyboard(
        track
      )
    }
  );
}

function getTrackForSubject(
  subject
) {
  const natural =
    TRACKS.Natural.some(
      item =>
        item.name === subject
    );

  if (natural) {
    return "Natural";
  }

  const social =
    TRACKS.Social.some(
      item =>
        item.name === subject
    );

  if (social) {
    return "Social";
  }

  return null;
}

async function openPracticeSubject(
  ctx,
  track,
  encodedSubject
) {
  const subject =
    decodeURIComponent(
      encodedSubject
    );

  if (
    getTrackForSubject(
      subject
    ) !== track
  ) {
    return ctx.answerCbQuery(
      "That subject does not belong to this stream."
    );
  }

  const questions =
    findQuestions(
      track,
      subject
    );

  if (!questions.length) {
    return ctx.editMessageText(
      `<b>${SUBJECT_EMOJIS[
        subject
      ] || "📘"} ${escapeText(
        subject
      )}</b>\n\n` +
        `The question bank is being prepared for this subject.\n\n` +
        `When its verified or original practice content is connected, this same Practice doorway will use it automatically.`,
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
    randomItem(
      questions
    );

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

  updateStreak(
    student
  );

  student.questions_answered =
    Number(
      student.questions_answered || 0
    ) + 1;

  let earnedXp = 0;

  if (correct) {
    student.correct_answers =
      Number(
        student.correct_answers || 0
      ) + 1;

    earnedXp =
      5 +
      (Number(
        student.streak || 0
      ) > 1
        ? 10
        : 0);

    student.xp =
      Number(
        student.xp || 0
      ) + earnedXp;
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

  updateSubjectPractice(
    student,
    question.subject,
    correct,
    earnedXp
  );

  updateAchievements(
    student
  );

  await saveStudent(
    student
  );

  const feedback =
    correct
      ? randomItem(
          FEEDBACK.correct
        )
      : randomItem(
          FEEDBACK.wrong
        );

  const answer =
    correct
      ? `✅ <b>Correct</b>\n\n${feedback}\n\n⭐ <b>+${earnedXp} XP</b>`
      : `❌ <b>Not quite</b>\n\n${feedback}\n\n🎯 Correct answer: <b>${escapeText(
          question.correct
        )}</b>`;

  const text =
    `${answer}\n\n` +
    `<b>📖 Show Me How</b>\n` +
    `${escapeText(
      question.explanation
    )}\n\n` +
    `🔥 Streak: <b>${student.streak}</b>\n` +
    `⭐ XP: <b>${student.xp}</b>\n` +
    `🎯 Accuracy: <b>${getAccuracy(
      student
    )}%</b>`;

  return ctx.editMessageText(
    text,
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

  const track =
    getTrackForSubject(
      subject
    );

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
    return ctx.answerCbQuery(
      "No question available yet."
    );
  }

  return sendQuestion(
    ctx,
    randomItem(questions)
  );
}

function journeySubjectLines(
  student
) {
  const progress =
    getSubjectProgress(
      student
    );

  const allSubjects =
    [
      ...TRACKS.Natural,
      ...TRACKS.Social
    ].filter(
      (item, index, array) =>
        array.findIndex(
          other =>
            other.name ===
            item.name
        ) === index
    );

  return allSubjects
    .map(subject => {
      const record =
        progress[
          subject.name
        ];

      if (!record) {
        return `${subject.emoji} <b>${escapeText(
          subject.name
        )}</b> — just waiting for your first step`;
      }

      const questions =
        Number(
          record.questions || 0
        );

      const correct =
        Number(
          record.correct || 0
        );

      const accuracy =
        questions
          ? Math.round(
              (correct /
                questions) *
                100
            )
          : 0;

      return (
        `${subject.emoji} <b>${escapeText(
          subject.name
        )}</b>\n` +
        `   ✍️ ${questions} questions · 🎯 ${accuracy}% · 📚 ${Number(
          record.lessons || 0
        )} lessons`
      );
    })
    .join("\n");
}

function journeyKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🩹 Fix My Weak",
        "journey_weak"
      )
    ],
    [
      Markup.button.callback(
        "🎯 Practice Recommendation",
        "journey_recommend"
      )
    ],
    [
      Markup.button.callback(
        "🌿 Learn",
        "home_learn"
      ),
      Markup.button.callback(
        "✍️ Practice",
        "home_practice"
      )
    ],
    [
      Markup.button.callback(
        "😌 Tiny Relax",
        "journey_relax"
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
              `🏅 ${escapeText(
                item
              )}`
          )
          .join("\n")
      : "🌱 Your first achievement is waiting for you.";

  const text =
    `<b>📊 My Journey</b>\n\n` +
    `👤 <b>${escapeText(
      student.first_name ||
        "Student"
    )}</b>\n` +
    `🪪 FineBot ID: <code>${escapeText(
      student.finebot_id
    )}</code>\n` +
    `🆔 Telegram ID: <code>${escapeText(
      student.telegram_id
    )}</code>\n` +
    `@${escapeText(
      student.username ||
        "no_username"
    )}\n\n` +
    `⭐ XP: <b>${Number(
      student.xp || 0
    )}</b>\n` +
    `🔥 Streak: <b>${Number(
      student.streak || 0
    )}</b>\n` +
    `✍️ Questions: <b>${Number(
      student.questions_answered ||
        0
    )}</b>\n` +
    `✅ Correct: <b>${Number(
      student.correct_answers ||
        0
    )}</b>\n` +
    `🎯 Accuracy: <b>${getAccuracy(
      student
    )}%</b>\n` +
    `📚 Lessons: <b>${Number(
      student.lessons_completed ||
        0
    )}</b>\n\n` +
    `<b>📚 Subject Progress</b>\n\n` +
    `${journeySubjectLines(
      student
    )}\n\n` +
    `<b>🏅 Achievements</b>\n` +
    achievementText;

  const options = {
    parse_mode: "HTML",
    ...journeyKeyboard()
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

async function showRecommendation(
  ctx
) {
  const student =
    await getStudent(
      ctx.from
    );

  if (!student) {
    return ctx.answerCbQuery(
      "Journey unavailable."
    );
  }

  const progress =
    getSubjectProgress(
      student
    );

  const candidates =
    Object.entries(
      progress
    )
      .filter(
        ([name, record]) =>
          record &&
          Number(
            record.questions || 0
          ) > 0
      )
      .map(
        ([name, record]) => ({
          name,
          accuracy:
            Math.round(
              (Number(
                record.correct || 0
              ) /
                Number(
                  record.questions ||
                    1
                )) *
                100
            ),
          questions:
            Number(
              record.questions ||
                0
            )
        })
      )
      .sort(
        (a, b) =>
          a.accuracy -
          b.accuracy
      );

  if (!candidates.length) {
    return ctx.editMessageText(
      `<b>🎯 Your next recommendation</b>\n\n` +
        `You haven't built enough practice data yet.\n\n` +
        `Start with a few questions in any subject. FineBot will use your real attempts to make the recommendation more precise.`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "✍️ Start Practice",
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

  const weakest =
    candidates[0];

  return ctx.editMessageText(
    `<b>🎯 Your next recommendation</b>\n\n` +
      `${SUBJECT_EMOJIS[
        weakest.name
      ] || "📘"} <b>${escapeText(
        weakest.name
      )}</b>\n\n` +
      `Your current recorded accuracy here is <b>${weakest.accuracy}%</b> across <b>${weakest.questions}</b> attempts.\n\n` +
      `💡 Small step: do one focused practice question in this subject, then review the explanation before moving on.\n\n` +
      `The goal isn't to rush the whole subject. It is to make the next answer a little stronger.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "✍️ Practice This",
            `practice_subject_${getTrackForSubject(
              weakest.name
            )}_${encodeURIComponent(
              weakest.name
            )}`
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
        `Nothing has been marked as a mistake yet.\n\n` +
        `That's not a problem — it simply means FineBot needs a little real practice data before it can identify your weakest area.\n\n` +
        `🎯 Take a few questions and this section will become personal to you.`,
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
    const mistake of
    mistakes
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
    ).sort(
      (a, b) =>
        b[1] - a[1]
    )[0];

  const subject =
    weakest[0];

  const count =
    weakest[1];

  const record =
    getSubjectProgress(
      student
    )[subject];

  const accuracy =
    record &&
    Number(record.questions)
      ? Math.round(
          (Number(
            record.correct || 0
          ) /
            Number(
              record.questions
            )) *
            100
        )
      : 0;

  return ctx.editMessageText(
    `<b>🩹 Fix My Weak</b>\n\n` +
      `${SUBJECT_EMOJIS[
        subject
      ] || "📘"} <b>${escapeText(
        subject
      )}</b> is currently showing the strongest warning signal in your recent mistake history.\n\n` +
      `❌ Recent missed questions: <b>${count}</b>\n` +
      `🎯 Recorded accuracy: <b>${accuracy}%</b>\n\n` +
      `<b>🔧 Your tiny recovery step</b>\n` +
      `Do one focused question from ${escapeText(
        subject
      )}. Don't jump away after answering — read the explanation and identify exactly what made the wrong option tempting.\n\n` +
      `Then try one more question.\n\n` +
      `That is enough for the next step. No giant study mountain required.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "✍️ Practice Weak Area",
            `practice_subject_${getTrackForSubject(
              subject
            )}_${encodeURIComponent(
              subject
            )}`
          )
        ],
        [
          Markup.button.callback(
            "😌 Tiny Relax",
            "journey_relax"
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

function getEnglishLessons() {
  const menu =
    getLearnEnglishMenu();

  if (!Array.isArray(menu)) {
    return [];
  }

  return menu.flatMap(
    category =>
      Array.isArray(
        category.lessons
      )
        ? category.lessons.map(
            lesson => ({
              ...lesson,
              category:
                category.category ||
                "English"
            })
          )
        : []
  );
}

function getEnglishLesson(
  lessonId
) {
  return (
    getEnglishLessons().find(
      lesson =>
        lesson.id ===
        lessonId
    ) || null
  );
}

function englishCatalogKeyboard() {
  const lessons =
    getEnglishLessons();

  const rows = [];

  for (
    let i = 0;
    i < lessons.length;
    i++
  ) {
    const lesson =
      lessons[i];

    const number =
      i + 1;

    rows.push([
      Markup.button.callback(
        `${number}. ${lesson.title}`,
        `english_open_${lesson.id}`
      )
    ]);
  }

  rows.push([
    Markup.button.callback(
      "↩️ Subjects",
      "learn_stream_natural"
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

async function showEnglish(
  ctx
) {
  const lessons =
    getEnglishLessons();

  if (!lessons.length) {
    return ctx.editMessageText(
      `<b>🇬🇧 English</b>\n\n` +
        `The English course catalog could not be loaded right now.`,
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

  const liveLessons =
    lessons.filter(
      lesson =>
        getEnglishLesson(
          lesson.id
        )
    );

  return ctx.editMessageText(
    `<b>🇬🇧 English Course</b>\n\n` +
      `<b>${lessons.length} lessons discovered</b>\n\n` +
      `FineBot follows the course order provided by the English content system.\n\n` +
      `🟢 Lesson 1 is fully connected and ready for the live test.\n` +
      `📚 Future lessons will appear here automatically as their approved content files are added.\n\n` +
      `Pick a lesson to begin.`,
    {
      parse_mode: "HTML",
      ...englishCatalogKeyboard()
    }
  );
}

function saveLearningState(
  student,
  data
) {
  const progress =
    getSubjectProgress(
      student
    );

  progress.__activeLesson = {
    lessonId:
      data.lessonId,
    track:
      data.track,
    currentIndex:
      data.state.currentIndex,
    completedSections:
      data.state.completedSections,
    completedConcepts:
      data.state.completedConcepts,
    finished:
      data.state.finished,
    completedReward:
      Boolean(
        data.completedReward
      )
  };

  student.subject_progress =
    progress;
}

function clearLearningState(
  student
) {
  const progress =
    getSubjectProgress(
      student
    );

  delete progress.__activeLesson;

  student.subject_progress =
    progress;
}

function restoreLearningState(
  student
) {
  const progress =
    getSubjectProgress(
      student
    );

  const saved =
    progress.__activeLesson;

  if (!saved) {
    return null;
  }

  const lesson =
    getEnglishLesson(
      saved.lessonId
    );

  if (!lesson) {
    return null;
  }

  const result =
    openEnglishLesson(
      saved.lessonId
    );

  if (
    !result ||
    !result.success ||
    !result.lesson
  ) {
    return null;
  }

  const state =
    result.session &&
    result.session.state
      ? result.session.state
      : null;

  if (!state) {
    return null;
  }

  state.currentIndex =
    Number(
      saved.currentIndex || 0
    );

  state.completedSections =
    Array.isArray(
      saved.completedSections
    )
      ? saved.completedSections
      : [];

  state.completedConcepts =
    Array.isArray(
      saved.completedConcepts
    )
      ? saved.completedConcepts
      : [];

  state.finished =
    Boolean(
      saved.finished
    );

  return {
    lessonId:
      saved.lessonId,
    track:
      saved.track ||
      "natural",
    lesson:
      result.lesson,
    state,
    completedReward:
      Boolean(
        saved.completedReward
      )
  };
}

function sectionLabel(
  type
) {
  const labels = {
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
      "🔥 FINAL STRETCH",
    completion:
      "🏁 COMPLETE"
  };

  return (
    labels[type] ||
    "📘 LESSON"
  );
}

function progressBar(
  percentage
) {
  const safe =
    Math.max(
      0,
      Math.min(
        100,
        Number(
          percentage || 0
        )
      )
    );

  const total =
    10;

  const filled =
    Math.round(
      (safe / 100) *
        total
    );

  return (
    "🟦".repeat(filled) +
    "⬜".repeat(
      total - filled
    )
  );
}

function sectionContent(
  section
) {
  if (!section) {
    return "";
  }

  if (
    typeof section.content ===
    "string"
  ) {
    return section.content;
  }

  if (
    section.content !==
    undefined &&
    section.content !==
    null
  ) {
    try {
      return JSON.stringify(
        section.content,
        null,
        2
      );
    } catch {
      return String(
        section.content
      );
    }
  }

  return "";
}

function learningKeyboard(
  data
) {
  const state =
    data.state;

  const lesson =
    data.lesson;

  const rows = [];

  if (
    state.currentIndex > 0
  ) {
    rows.push([
      Markup.button.callback(
        "⬅️ Previous",
        "learn_previous"
      )
    ]);
  }

  if (
    !isLessonFinished(
      state
    )
  ) {
    rows.push([
      Markup.button.callback(
        "➡️ Next Page",
        "learn_next"
      )
    ]);
  }

  rows.push([
    Markup.button.callback(
      "😌 Fun Story",
      "learn_fun_story"
    ),
    Markup.button.callback(
      "🚪 Exit Lesson",
      "learn_exit"
    )
  ]);

  rows.push([
    Markup.button.callback(
      "🏠 Home",
      "back_home"
    )
  ]);

  return Markup.inlineKeyboard(
    rows
  );
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

  const percent =
    progress.percentage;

  const page =
    progress.current;

  const total =
    progress.total;

  const label =
    sectionLabel(
      section.type
    );

  const content =
    sectionContent(
      section
    );

  const title =
    section.title
      ? `<b>${escapeText(
          section.title
        )}</b>\n\n`
      : "";

  return (
    `<b>🇬🇧 ${escapeText(
      lesson.title
    )}</b>\n` +
    `<i>${escapeText(
      lesson.category ||
        "English"
    )}</i>\n\n` +
    `${progressBar(
      percent
    )} <b>${percent}%</b>\n` +
    `📄 Page <b>${page}</b> of <b>${total}</b>\n\n` +
    `<b>${label}</b>\n\n` +
    title +
    `${escapeText(
      content
    )}\n\n` +
    `🧭 Keep going one page at a time.`
  );
}

async function sendLearningPage(
  ctx,
  data
) {
  const text =
    learningText(
      data
    );

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
      ...learningKeyboard(
        data
      )
    }
  );
}

async function startEnglishLesson(
  ctx,
  lessonId
) {
  const lesson =
    getEnglishLesson(
      lessonId
    );

  if (!lesson) {
    return ctx.answerCbQuery(
      "That lesson is not available."
    );
  }

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

  const student =
    await getStudent(
      ctx.from
    );

  if (!student) {
    return ctx.answerCbQuery(
      "Student profile unavailable."
    );
  }

  const data = {
    lessonId,
    track:
      "natural",
    lesson:
      result.lesson,
    state:
      result.session.state,
    completedReward:
      false
  };

  learningSessions.set(
    String(ctx.from.id),
    data
  );

  saveLearningState(
    student,
    data
  );

  await saveStudent(
    student
  );

  return sendLearningPage(
    ctx,
    data
  );
}

async function continueLearning(
  ctx
) {
  const key =
    String(ctx.from.id);

  let data =
    learningSessions.get(
      key
    );

  if (!data) {
    const student =
      await getStudent(
        ctx.from
      );

    if (student) {
      data =
        restoreLearningState(
          student
        );
    }

    if (data) {
      learningSessions.set(
        key,
        data
      );
    }
  }

  if (!data) {
    return ctx.answerCbQuery(
      "Open an English lesson first."
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

  if (
    !result.completed
  ) {
    return ctx.answerCbQuery(
      "FineBot could not move to the next page."
    );
  }

  data.state =
    result.state;

  learningSessions.set(
    key,
    data
  );

  const student =
    await getStudent(
      ctx.from
    );

  if (student) {
    saveLearningState(
      student,
      data
    );

    await saveStudent(
      student
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

  return sendLearningPage(
    ctx,
    data
  );
}

async function previousLearning(
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
    data.state.currentIndex <=
    0
  ) {
    return ctx.answerCbQuery(
      "You are already on the first page."
    );
  }

  data.state.currentIndex -=
    1;

  data.state.finished =
    false;

  learningSessions.set(
    key,
    data
  );

  const student =
    await getStudent(
      ctx.from
    );

  if (student) {
    saveLearningState(
      student,
      data
    );

    await saveStudent(
      student
    );
  }

  return sendLearningPage(
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
    if (
      !data.completedReward
    ) {
      student.lessons_completed =
        Number(
          student.lessons_completed ||
            0
        ) + 1;

      const reward =
        10;

      student.xp =
        Number(
          student.xp || 0
        ) + reward;

      updateSubjectLesson(
        student,
        "English",
        reward
      );

      updateAchievements(
        student
      );

      data.completedReward =
        true;

      saveLearningState(
        student,
        data
      );

      await saveStudent(
        student
      );
    }
  }

  const compliment =
    randomItem(
      FEEDBACK.completion
    );

  return ctx.editMessageText(
    `<b>🏁 LESSON COMPLETE</b>\n\n` +
      `${compliment}\n\n` +
      `🇬🇧 <b>${escapeText(
        data.lesson.title
      )}</b>\n\n` +
      `⭐ <b>+10 XP</b>\n` +
      `📚 Lesson completed: <b>${Number(
        student?.lessons_completed ||
          0
      )}</b>\n` +
      `⭐ Total XP: <b>${Number(
        student?.xp || 0
      )}</b>\n\n` +
      `💡 <b>Suggested next move</b>\n` +
      `Take a tiny break with a Fun Story, or return to the English course and continue to the next available lesson.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📚 Next Lesson",
            "english_course"
          )
        ],
        [
          Markup.button.callback(
            "😌 Fun Story",
            "learn_fun_story"
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
            "🚪 Exit",
            "back_home"
          )
        ]
      ])
    }
  );
}

async function showFunStory(
  ctx
) {
  const stories = [
    "📖 A student opened a book to study for five minutes. The book opened a chapter. The chapter opened a topic. The topic opened three questions. Suddenly five minutes had become a study session. Tiny starts are weirdly powerful.",
    "📖 Exam question: 'What is the main idea?' Student: 'The main idea is that I should have started studying earlier.' FineBot: 'Technically… not what the passage says. 😂'",
    "📖 Your brain does not need a heroic three-hour speech. Sometimes it needs one question, one correction, and one small victory.",
    "📖 A wrong answer is basically your brain putting a sticky note on the exact place that needs another look."
  ];

  return ctx.editMessageText(
    `<b>😌 Tiny Study Break</b>\n\n` +
      `${randomItem(
        stories
      )}\n\n` +
      `When you're ready, one small page is enough to restart.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📚 Back to Learn",
            "home_learn"
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

async function exitLearning(
  ctx
) {
  const student =
    await getStudent(
      ctx.from
    );

  if (student) {
    const data =
      learningSessions.get(
        String(
          ctx.from.id
        )
      );

    if (data) {
      saveLearningState(
        student,
        data
      );

      await saveStudent(
        student
      );
    }
  }

  return ctx.editMessageText(
    `<b>🚪 Lesson paused</b>\n\n` +
      `Your current lesson position has been saved.\n\n` +
      `You can return through 📚 Learn and continue your study journey.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
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
    }
  );
}

async function showBuddy(
  ctx,
  edit = false
) {
  const text =
    `<b>💬 Study Buddy</b>\n\n` +
    `🤖 <b>Coming soon...</b>\n\n` +
    `FineBot's Study Buddy is being prepared to become a proper study companion rather than another generic chatbot.\n\n` +
    `When it arrives, you'll get:\n\n` +
    `• 🧠 <b>Study-aware conversations</b> — questions that understand what you're learning.\n` +
    `• 🎯 <b>Personal study guidance</b> — small next steps based on your progress.\n` +
    `• 🫶 <b>Stuck-mode support</b> — help when your brain says, “Nope. Absolutely nothing is entering.” 😂\n` +
    `• 📚 <b>Lesson connections</b> — conversations linked to your FineBot learning journey.\n` +
    `• 💡 <b>Exam thinking help</b> — reasoning, explanations and useful study strategies.\n` +
    `• 📖 <b>Fun study breaks</b> — short stories and lighter moments when your brain needs air.\n\n` +
    `🚧 <b>Not available yet.</b>\n` +
    `But the button is already here because this space is part of where FineBot is going.`;

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
  return showFunStory(
    ctx
  );
}

async function showSupport(
  ctx,
  edit = false
) {
  const text =
    `<b>🆘 FineBot Support</b>\n\n` +
    `<b>📚 How to use FineBot</b>\n\n` +
    `1️⃣ <b>Learn</b>\n` +
    `Choose your stream → choose a subject → choose a lesson → move through the lesson page by page.\n\n` +
    `2️⃣ <b>Practice</b>\n` +
    `Choose a stream and subject → answer the question → read the explanation → continue with another question.\n\n` +
    `3️⃣ <b>My Journey</b>\n` +
    `See your personal XP, streak, questions, accuracy, completed lessons, achievements and subject-by-subject progress.\n\n` +
    `4️⃣ <b>Fix My Weak</b>\n` +
    `FineBot uses your recorded mistakes to identify the area currently needing attention and gives you one small recovery step.\n\n` +
    `5️⃣ <b>Tiny Relax</b>\n` +
    `Take a short Fun Story break, then return when you're ready.\n\n` +
    `6️⃣ <b>Study Buddy</b>\n` +
    `The Study Buddy space is coming soon. Its button already shows what is being prepared.\n\n` +
    `<b>📩 Direct help</b>\n` +
    `finebot.support@gmail.com\n\n` +
    `If something behaves unexpectedly, send the issue, what you clicked, and what you expected to happen.`;

  const options = {
    parse_mode: "HTML",
    ...Markup.inlineKeyboard([
      [
        Markup.button.callback(
          "📖 How to Use",
          "support_how"
        )
      ],
      [
        Markup.button.callback(
          "📩 Direct Help",
          "support_contact"
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

async function showSupportHow(
  ctx
) {
  return ctx.editMessageText(
    `<b>📖 How to Use FineBot</b>\n\n` +
      `📚 <b>Learn</b> — follow lessons page by page. Use Next and Previous to move through the material. Exit saves your current position.\n\n` +
      `✍️ <b>Practice</b> — answer exam-oriented questions. Every attempt contributes to your personal progress data.\n\n` +
      `📊 <b>My Journey</b> — check your own numbers: XP, streak, accuracy, questions, lessons, achievements and subject progress.\n\n` +
      `🩹 <b>Fix My Weak</b> — look at the subject where your recent mistakes are concentrating and take the suggested small recovery step.\n\n` +
      `😌 <b>Tiny Relax</b> — take a short Fun Story break whenever you need to reset before continuing.\n\n` +
      `💬 <b>Study Buddy</b> — currently coming soon.\n\n` +
      `🏠 <b>Home</b> — your central starting point.`,
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

async function showSupportContact(
  ctx
) {
  return ctx.editMessageText(
    `<b>📩 Direct FineBot Help</b>\n\n` +
      `For account issues, lesson problems, incorrect content, unexpected bot behavior, or general help, contact:\n\n` +
      `<code>finebot.support@gmail.com</code>\n\n` +
      `A useful support message includes:\n` +
      `• what you clicked\n` +
      `• what FineBot showed\n` +
      `• what you expected\n` +
      `• the approximate time it happened\n\n` +
      `That makes it much easier to investigate your issue.`,
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
  "learn_stream_natural",
  async ctx => {
    await ctx.answerCbQuery();

    return showSubjects(
      ctx,
      "Natural"
    );
  }
);

bot.action(
  "learn_stream_social",
  async ctx => {
    await ctx.answerCbQuery();

    return showSubjects(
      ctx,
      "Social"
    );
  }
);

bot.action(
  /^learn_subject_(Natural|Social)_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    const track =
      ctx.match[1];

    const subject =
      decodeURIComponent(
        ctx.match[2]
      );

    if (
      subject ===
        "English" &&
      track ===
        "Natural"
    ) {
      return showEnglish(
        ctx
      );
    }

    const subjectInfo =
      (
        TRACKS[track] ||
        []
      ).find(
        item =>
          item.name ===
          subject
      );

    if (!subjectInfo) {
      return ctx.answerCbQuery(
        "Subject unavailable."
      );
    }

    return ctx.editMessageText(
      `${subjectInfo.emoji} <b>${escapeText(
        subject
      )}</b>\n\n` +
        `The subject space is ready.\n\n` +
        `Its course content has not been connected yet. Once its approved lesson files are added to the learning system, this same doorway will use them without changing the Telegram controller.`,
      {
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [
            Markup.button.callback(
              "↩️ Subjects",
              `learn_stream_${track.toLowerCase()}`
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

bot.action(
  "english_course",
  async ctx => {
    await ctx.answerCbQuery();

    return showEnglish(
      ctx
    );
  }
);

bot.action(
  /^english_open_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return startEnglishLesson(
      ctx,
      ctx.match[1]
    );
  }
);

bot.action(
  "learn_next",
  async ctx => {
    await ctx.answerCbQuery();

    return continueLearning(
      ctx
    );
  }
);

bot.action(
  "learn_previous",
  async ctx => {
    await ctx.answerCbQuery();

    return previousLearning(
      ctx
    );
  }
);

bot.action(
  "learn_fun_story",
  async ctx => {
    await ctx.answerCbQuery();

    return showFunStory(
      ctx
    );
  }
);

bot.action(
  "learn_exit",
  async ctx => {
    await ctx.answerCbQuery();

    return exitLearning(
      ctx
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
  "journey_recommend",
  async ctx => {
    await ctx.answerCbQuery();

    return showRecommendation(
      ctx
    );
  }
);

bot.action(
  "journey_relax",
  async ctx => {
    await ctx.answerCbQuery();

    return showFunStory(
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
  /^practice_subject_(Natural|Social)_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return openPracticeSubject(
      ctx,
      ctx.match[1],
      ctx.match[2]
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
  "buddy_stories",
  async ctx => {
    await ctx.answerCbQuery();

    return showFunStory(
      ctx
    );
  }
);

bot.action(
  "support_how",
  async ctx => {
    await ctx.answerCbQuery();

    return showSupportHow(
      ctx
    );
  }
);

bot.action(
  "support_contact",
  async ctx => {
    await ctx.answerCbQuery();

    return showSupportContact(
      ctx
    );
  }
);

bot.on(
  "text",
  async ctx => {
    const text =
      String(
        ctx.message?.text ||
          ""
      ).trim();

    if (!text) {
      return;
    }

    return ctx.reply(
      `<b>💬 Study Buddy</b>\n\n` +
        `🤖 The Study Buddy is coming soon.\n\n` +
        `For now, use 📚 Learn or ✍️ Practice for your active study session.\n\n` +
        `If something is wrong with FineBot, use 🆘 Support.`,
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
    if (
      req.method ===
      "GET"
    ) {
      return res
        .status(200)
        .send(
          "FineBot is running."
        );
    }

    if (
      req.method !==
      "POST"
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
