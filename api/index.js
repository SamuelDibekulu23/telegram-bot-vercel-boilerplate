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
const practiceSessions = new Map();

const SUBJECTS = {
  Natural: [
    "English",
    "Mathematics",
    "Biology",
    "Chemistry",
    "Physics",
    "Scholastic Aptitude"
  ],
  Social: [
    "English",
    "Mathematics",
    "Geography",
    "Economics",
    "History"
  ]
};

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
      "An electron carries a negative electric charge. A proton is positive, a neutron has no net charge, and the nucleus contains protons and neutrons."
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
      "The mitochondrion is strongly associated with cellular energy production because it produces much of the ATP used by cells."
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
      "Force is measured in newtons (N). A joule measures energy, a watt measures power, and a pascal measures pressure."
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
      "Teacher is a noun because it names a person. Quickly is an adverb, run can function as a verb, and beautiful is an adjective."
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
      "The first statement directly tells us that roses belong to the group called flowers. Nothing in the statements proves that roses must fade quickly."
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
      "The Equator is located at 0° latitude and separates the Northern Hemisphere from the Southern Hemisphere."
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
      "Scarcity exists because available resources are limited while human wants are unlimited. It forces individuals and societies to make choices."
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
      "A diary written during the historical period is a primary source because it provides evidence created close to the event or period being studied."
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
      "Subtract 5 from both sides: x + 5 − 5 = 12 − 5, so x = 7."
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
      "The subject 'she' is singular, so the present-simple verb takes the third-person singular form: 'walks.'"
  }
];

const CORRECT_REPLIES = [
  "🔥 Clean hit! Your reasoning landed exactly where it needed to.",
  "🧠 Nice one! You spotted the key idea instead of getting distracted.",
  "⚡ That's it! Another piece of the puzzle is locked in.",
  "🎯 Bullseye! Your answer matches the concept.",
  "😎 Look at you catching that one before it escaped.",
  "🚀 Correct! Keep that momentum moving.",
  "💡 Yep! You recognized what the question was really testing.",
  "🏆 Strong work! That's another mark earned."
];

const WRONG_REPLIES = [
  "🧩 Not quite — but this is useful. The trap just showed itself.",
  "😄 The question tried a little ambush there. Let's break it apart.",
  "🔍 Close attempt. Now let's expose exactly where the reasoning slipped.",
  "🛠️ That's a learning moment, not a disaster. Let's repair the idea.",
  "🎯 The tempting choice won this round. FineBot is going to show you why.",
  "🧠 Interesting choice. Now we can see exactly what the exam is trying to test.",
  "📌 Not this time — and that's okay. The important part is understanding the pattern.",
  "💪 One wrong answer can become a very strong memory when we understand it properly."
];

const FINISH_MESSAGES = [
  "🎉 Lesson complete! You didn't just reach the end — you built another piece of your preparation.",
  "🏁 You made it through! One more lesson is now part of your study history.",
  "🔥 Finished! Your future exam self just got a little more prepared.",
  "🚀 That's another lesson conquered. Keep stacking small wins.",
  "🏆 Done! Understanding grows one completed lesson at a time."
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

function randomItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return items[
    Math.floor(Math.random() * items.length)
  ];
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
  return student?.subject_progress &&
    typeof student.subject_progress === "object" &&
    !Array.isArray(student.subject_progress)
    ? student.subject_progress
    : {};
}

function getSubjectRecord(
  student,
  subject
) {
  const progress =
    getSubjectProgress(student);

  const record =
    progress[subject] || {};

  return {
    questions: Number(
      record.questions || 0
    ),
    correct: Number(
      record.correct || 0
    ),
    lessons: Number(
      record.lessons || 0
    )
  };
}

function updateSubjectPractice(
  student,
  subject,
  correct
) {
  const progress =
    getSubjectProgress(student);

  const record =
    getSubjectRecord(
      student,
      subject
    );

  record.questions += 1;

  if (correct) {
    record.correct += 1;
  }

  progress[subject] = record;
  student.subject_progress = progress;
}

function updateSubjectLesson(
  student,
  subject
) {
  const progress =
    getSubjectProgress(student);

  const record =
    getSubjectRecord(
      student,
      subject
    );

  record.lessons += 1;
  progress[subject] = record;

  student.subject_progress = progress;
}

async function getStudent(user) {
  if (!user || !user.id) {
    return null;
  }

  const telegramId = String(user.id);

  if (students.has(telegramId)) {
    return students.get(telegramId);
  }

  const { data, error } =
    await supabase
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
    students.set(
      telegramId,
      data
    );

    return data;
  }

  const newStudent = {
    finebot_id:
      createFineBotId(telegramId),
    telegram_id: telegramId,
    first_name:
      user.first_name || "Student",
    username:
      user.username || null
  };

  const {
    data: created,
    error: createError
  } =
    await supabase
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
    )}! 👋\n\n` +
    `Your next study move is waiting.\n\n` +
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

    const difference =
      Math.round(
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
  if (
    Number(student.questions_answered) >=
    1
  ) {
    addAchievement(
      student,
      "🌱 First Step"
    );
  }

  if (
    Number(student.lessons_completed) >=
    10
  ) {
    addAchievement(
      student,
      "📚 Bookworm"
    );
  }

  if (
    Number(student.correct_answers) >=
    100
  ) {
    addAchievement(
      student,
      "🧠 Scholar"
    );
  }

  if (
    Number(student.streak) >=
    7
  ) {
    addAchievement(
      student,
      "🔥 Streak Keeper"
    );
  }

  if (
    currentAddisHour() < 8
  ) {
    addAchievement(
      student,
      "🌅 Early Bird"
    );
  }
}

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
  return (
    `<b>✍️ ${escapeText(
      question.subject
    )}</b>\n\n` +
    `${escapeText(
      question.question
    )}\n\n` +
    question.options
      .map(
        option =>
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
      "🧩 There isn't a question here yet. Try another subject."
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
        "🌿 Natural Sciences",
        "practice_track_Natural"
      ),
      Markup.button.callback(
        "🌍 Social Sciences",
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
    SUBJECTS[track] || [];

  const rows = [];

  for (
    let i = 0;
    i < subjects.length;
    i += 2
  ) {
    const row = [
      Markup.button.callback(
        `📘 ${subjects[i]}`,
        `practice_subject_${encodeURIComponent(
          track
        )}_${encodeURIComponent(
          subjects[i]
        )}`
      )
    ];

    if (subjects[i + 1]) {
      row.push(
        Markup.button.callback(
          `📘 ${subjects[i + 1]}`,
          `practice_subject_${encodeURIComponent(
            track
          )}_${encodeURIComponent(
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
    `This is where your exam muscles get tested.\n\n` +
    `Choose a track, pick a subject, answer the question, then use <b>📖 Show Me How</b> whenever you want the reasoning unpacked.\n\n` +
    `Every attempt also helps FineBot understand where you may need another look.`;

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
  if (!SUBJECTS[track]) {
    return ctx.answerCbQuery(
      "That track isn't available yet."
    );
  }

  return ctx.editMessageText(
    `<b>📚 ${escapeText(
      track
    )}</b>\n\nChoose the subject you want to challenge.`,
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
  encodedTrack,
  encodedSubject
) {
  const track =
    decodeURIComponent(
      encodedTrack
    );

  const subject =
    decodeURIComponent(
      encodedSubject
    );

  if (
    !SUBJECTS[track] ||
    !SUBJECTS[track].includes(
      subject
    )
  ) {
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
      `<b>📘 ${escapeText(
        subject
      )}</b>\n\n` +
        `This question bank is being prepared.\n\n` +
        `When questions are added to FineBot's question content system, they will appear here automatically.`,
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

  practiceSessions.set(
    String(ctx.from.id),
    {
      questionId:
        question.id,
      track,
      subject
    }
  );

  return sendQuestion(
    ctx,
    question
  );
}

async function showExplanation(
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
      "Explanation unavailable."
    );
  }

  const correct =
    selected === question.correct;

  const chosen =
    question.options.find(
      option =>
        option.charAt(0) ===
        selected
    );

  const correctOption =
    question.options.find(
      option =>
        option.charAt(0) ===
        question.correct
    );

  const text =
    `<b>📖 Show Me How</b>\n\n` +
    `<b>Question</b>\n` +
    `${escapeText(
      question.question
    )}\n\n` +
    `<b>Your choice</b>\n` +
    `${escapeText(
      chosen || selected
    )}\n\n` +
    `<b>Correct choice</b>\n` +
    `${escapeText(
      correctOption ||
        question.correct
    )}\n\n` +
    `<b>🧠 The reasoning</b>\n` +
    `${escapeText(
      question.explanation
    )}\n\n` +
    `${
      correct
        ? "You already had the right answer. This explanation helps turn the correct guess into reliable knowledge."
        : "The goal isn't just to know the correct option. It is to understand why the other path looked tempting and why the evidence points elsewhere."
    }`;

  return ctx.editMessageText(
    text,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "➡️ Next Question",
            `next_question_${encodeURIComponent(
              question.track
            )}_${encodeURIComponent(
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
      student.questions_answered ||
        0
    ) + 1;

  updateSubjectPractice(
    student,
    question.subject,
    correct
  );

  if (correct) {
    student.correct_answers =
      Number(
        student.correct_answers ||
          0
      ) + 1;

    student.xp =
      Number(
        student.xp || 0
      ) +
      5 +
      (Number(
        student.streak || 0
      ) > 1
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
      track:
        question.track,
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

  const reaction =
    correct
      ? randomItem(
          CORRECT_REPLIES
        )
      : randomItem(
          WRONG_REPLIES
        );

  const selectedOption =
    question.options.find(
      option =>
        option.charAt(0) ===
        selected
    );

  const correctOption =
    question.options.find(
      option =>
        option.charAt(0) ===
        question.correct
    );

  const answerText =
    correct
      ? `<b>✅ Correct!</b>\n${reaction}`
      : `<b>❌ Not quite.</b>\n${reaction}\n\nThe correct answer is <b>${escapeText(
          correctOption ||
            question.correct
        )}</b>.`;

  return ctx.editMessageText(
    `${answerText}\n\n` +
      `<b>You chose:</b> ${escapeText(
        selectedOption ||
          selected
      )}\n\n` +
      `The explanation is ready whenever you want to understand the reasoning.\n\n` +
      `⭐ XP: <b>${student.xp}</b>\n` +
      `🔥 Streak: <b>${student.streak}</b>`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "📖 Show Me How",
            `explain_${question.id}_${selected}`
          )
        ],
        [
          Markup.button.callback(
            "➡️ Next Question",
            `next_question_${encodeURIComponent(
              question.track
            )}_${encodeURIComponent(
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
  encodedTrack,
  encodedSubject
) {
  const track =
    decodeURIComponent(
      encodedTrack
    );

  const subject =
    decodeURIComponent(
      encodedSubject
    );

  if (
    !SUBJECTS[track] ||
    !SUBJECTS[track].includes(
      subject
    )
  ) {
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
      "No question is available yet."
    );
  }

  const previous =
    practiceSessions.get(
      String(ctx.from.id)
    );

  let pool = questions;

  if (
    questions.length > 1 &&
    previous?.questionId
  ) {
    pool =
      questions.filter(
        question =>
          question.id !==
          previous.questionId
      );
  }

  const question =
    pool[
      Math.floor(
        Math.random() *
          pool.length
      )
    ];

  practiceSessions.set(
    String(ctx.from.id),
    {
      questionId:
        question.id,
      track,
      subject
    }
  );

  return sendQuestion(
    ctx,
    question
  );
}

function subjectJourneyLines(
  student
) {
  const progress =
    getSubjectProgress(
      student
    );

  const knownSubjects =
    Object.keys(progress);

  if (!knownSubjects.length) {
    return (
      `No subject history yet.\n` +
      `Start with one lesson or one practice question and your map will begin filling itself.`
    );
  }

  return knownSubjects
    .sort()
    .map(subject => {
      const record =
        getSubjectRecord(
          student,
          subject
        );

      const accuracy =
        record.questions
          ? Math.round(
              (record.correct /
                record.questions) *
                100
            )
          : 0;

      return (
        `📘 <b>${escapeText(
          subject
        )}</b>\n` +
        `   Lessons: ${record.lessons} · Questions: ${record.questions} · Accuracy: ${accuracy}%`
      );
    })
    .join("\n\n");
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
      : "🌱 Your achievement shelf is waiting for its first badge.";

  const text =
    `<b>📊 My Journey</b>\n\n` +
    `This is your space. No leaderboard. No comparison. Just your own progress.\n\n` +
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
    `📚 Lessons completed: <b>${Number(
      student.lessons_completed ||
        0
    )}</b>\n\n` +
    `<b>📚 Subject Progress</b>\n\n` +
    subjectJourneyLines(
      student
    ) +
    `\n\n<b>🏅 Achievements</b>\n` +
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

  const progress =
    getSubjectProgress(
      student
    );

  const entries =
    Object.entries(progress)
      .filter(
        ([, record]) =>
          Number(
            record.questions || 0
          ) > 0
      )
      .map(
        ([subject, record]) => {
          const questions =
            Number(
              record.questions || 0
            );

          const correct =
            Number(
              record.correct || 0
            );

          const accuracy =
            Math.round(
              (correct /
                questions) *
                100
            );

          return {
            subject,
            questions,
            correct,
            accuracy
          };
        }
      )
      .sort(
        (a, b) =>
          a.accuracy -
          b.accuracy ||
          b.questions -
            a.questions
      );

  const mistakes =
    Array.isArray(
      student.mistakes
    )
      ? student.mistakes
      : [];

  if (!entries.length) {
    return ctx.editMessageText(
      `<b>🩹 Fix My Weak</b>\n\n` +
        `FineBot doesn't have enough practice data to identify a real weak area yet.\n\n` +
        `🎯 Small step: answer a few questions in one subject. Then come back here and FineBot can work from your actual results.`,
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
    entries[0];

  const weakMistakes =
    mistakes.filter(
      mistake =>
        mistake.subject ===
        weakest.subject
    ).length;

  const nextStep =
    weakest.accuracy < 50
      ? `🎯 Small step: return to the basic concept behind ${weakest.subject}, then answer just 3 questions slowly.`
      : weakest.accuracy < 70
        ? `🎯 Small step: practice 5 ${weakest.subject} questions and explain your reasoning before choosing each answer.`
        : `🎯 Small step: do 3 more ${weakest.subject} questions and focus specifically on the mistakes that keep repeating.`;

  const text =
    `<b>🩹 Fix My Weak</b>\n\n` +
    `FineBot looked at your actual practice history.\n\n` +
    `<b>🔎 Your current weakest area</b>\n` +
    `<b>${escapeText(
      weakest.subject
    )}</b>\n` +
    `🎯 Accuracy: <b>${weakest.accuracy}%</b>\n` +
    `✍️ Questions attempted: <b>${weakest.questions}</b>\n` +
    `❌ Recorded mistakes: <b>${weakMistakes}</b>\n\n` +
    `<b>🧠 What this means</b>\n` +
    `This isn't a label saying you're bad at the subject. It simply shows where your current answers need the most attention.\n\n` +
    `<b>🚶 Your next small step</b>\n` +
    `${nextStep}\n\n` +
    `Small correction → another attempt → stronger understanding.`;

  return ctx.editMessageText(
    text,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [
          Markup.button.callback(
            "✍️ Practice This",
            `practice_subject_${encodeURIComponent(
              weakest.subject ===
                "Geography" ||
              weakest.subject ===
                "Economics" ||
              weakest.subject ===
                "History"
                ? "Social"
                : "Natural"
            )}_${encodeURIComponent(
              weakest.subject
            )}`
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
        ? category.lessons
        : []
  );
}

function learnTrackKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural Sciences",
        "learn_track_natural"
      ),
      Markup.button.callback(
        "🌍 Social Sciences",
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
  const lessons =
    getEnglishLessons();

  const text =
    `<b>📚 Learn</b>\n\n` +
    `Choose where you want to build your knowledge.\n\n` +
    `🌿 <b>Natural Sciences</b> — English, Mathematics, Biology, Chemistry, Physics and Scholastic Aptitude.\n` +
    `🌍 <b>Social Sciences</b> — English, Mathematics, Geography, Economics and History.\n\n` +
    `The course catalog grows from FineBot's content system, so new lessons can appear here without rebuilding this Telegram controller.\n\n` +
    `🇬🇧 <b>English currently has ${lessons.length} lessons in its catalog.</b>`;

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

function englishCategoryKeyboard(
  category,
  lessons
) {
  const rows =
    lessons.map(
      lesson => [
        Markup.button.callback(
          `▶️ ${lesson.title}`,
          `learn_open_${encodeURIComponent(
            lesson.id
          )}_${encodeURIComponent(
            category
          )}`
        )
      ]
    );

  rows.push([
    Markup.button.callback(
      "↩️ Learn",
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

async function showEnglish(
  ctx,
  track
) {
  const menu =
    getLearnEnglishMenu();

  const categories =
    Array.isArray(menu)
      ? menu
      : [];

  const categoryRows =
    categories
      .filter(
        category =>
          Array.isArray(
            category.lessons
          ) &&
          category.lessons.length
      )
      .map(
        category => [
          Markup.button.callback(
            `📖 ${category.title || category.category || "English"}`,
            `learn_category_${encodeURIComponent(
              category.category
            )}_${encodeURIComponent(
              track
            )}`
          )
        ]
      );

  categoryRows.push([
    Markup.button.callback(
      "↩️ Learn",
      "home_learn"
    ),
    Markup.button.callback(
      "🏠 Home",
      "back_home"
    )
  ]);

  return ctx.editMessageText(
    `<b>🇬🇧 English</b>\n\n` +
      `Your English course is organized into learning areas instead of one giant wall of lessons.\n\n` +
      `Choose an area and FineBot will show the lessons available there.\n\n` +
      `📚 <b>${getEnglishLessons().length}</b> lessons currently connected.`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard(
        categoryRows
      )
    }
  );
}

async function showEnglishCategory(
  ctx,
  encodedCategory,
  encodedTrack
) {
  const category =
    decodeURIComponent(
      encodedCategory
    );

  const track =
    decodeURIComponent(
      encodedTrack
    );

  const menu =
    getLearnEnglishMenu();

  const found =
    Array.isArray(menu)
      ? menu.find(
          item =>
            String(
              item.category
            ) === category
        )
      : null;

  if (
    !found ||
    !Array.isArray(
      found.lessons
    )
  ) {
    return ctx.answerCbQuery(
      "That English area is unavailable."
    );
  }

  return ctx.editMessageText(
    `<b>🇬🇧 English · ${escapeText(
      found.title ||
        found.category
    )}</b>\n\n` +
      `Choose the lesson you want to study.\n\n` +
      `FineBot will take you through it step by step.`,
    {
      parse_mode: "HTML",
      ...englishCategoryKeyboard(
        found.category,
        found.lessons
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
          "🇬🇧 More English",
          `learn_track_${data.track || "natural"}`
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
    labelMap[
      section.type
    ] ||
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

  const percentage =
    progress.percentage;

  let progressMessage =
    "🌱 You're building the foundation.";

  if (
    percentage >= 25 &&
    percentage < 60
  ) {
    progressMessage =
      "🔥 You're properly into it now. Keep the momentum.";
  }

  if (
    percentage >= 60 &&
    percentage < 85
  ) {
    progressMessage =
      "🚀 You're through the heavy middle. The finish is getting closer.";
  }

  if (
    percentage >= 85
  ) {
    progressMessage =
      "🏆 Final stretch. Finish strong.";
  }

  return (
    `<b>${label}</b>` +
    title +
    `\n${escapeText(
      content
    )}\n\n` +
    `📍 <b>${progress.current}/${progress.total}</b> sections · <b>${progress.percentage}%</b>\n` +
    `${progressMessage}`
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
      "This lesson could not be opened."
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
        result.session.state,
      completedReward:
        false
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
      "Open a lesson first."
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

      updateSubjectLesson(
        student,
        "English"
      );

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
      `${randomItem(
        FINISH_MESSAGES
      )}\n\n` +
      `<b>${escapeText(
        data.lesson.title
      )}</b>\n\n` +
      `⭐ <b>+10 XP</b>\n` +
      `📚 Your journey has been updated.\n\n` +
      `The next lesson is waiting whenever you're ready.`,
    {
      parse_mode: "HTML",
      ...learningButton(data)
    }
  );
}

async function showBuddy(
  ctx,
  edit = false
) {
  const text =
    `<b>💬 Study Buddy</b>\n\n` +
    `A study companion that can talk with you, help you think through difficult study moments, and keep the conversation natural is coming to FineBot.\n\n` +
    `<b>🚀 Coming Soon</b>\n\n` +
    `We're building this part carefully so it can be genuinely useful — not just another bot that throws generic replies at you.\n\n` +
    `For now, your best move is simple: keep learning, keep practicing, and let your real progress build the foundation.`;

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
      `This is your future study-break corner.\n\n` +
      `Short stories, useful ideas, surprising facts and little mental resets will live here as the Study Buddy experience grows.\n\n` +
      `🚀 <b>More is coming.</b>`,
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
    `Need help? Here's the simple FineBot map.\n\n` +
    `<b>📚 Learn</b>\n` +
    `Choose a course area, open a lesson, and use <b>➡️ Continue</b> to move through it step by step.\n\n` +
    `<b>✍️ Practice</b>\n` +
    `Choose your track and subject, answer the question, then use <b>📖 Show Me How</b> when you want the reasoning explained.\n\n` +
    `<b>📊 My Journey</b>\n` +
    `See your own XP, streak, questions, accuracy, completed lessons, subject progress and achievements.\n\n` +
    `<b>🩹 Fix My Weak</b>\n` +
    `FineBot looks at your actual practice history and points you toward the area currently needing the most attention.\n\n` +
    `<b>💬 Study Buddy</b>\n` +
    `The conversational study assistant is currently coming soon.\n\n` +
    `<b>🏠 Home</b>\n` +
    `Use Home whenever you want to return to FineBot's main choices.\n\n` +
    `<b>📩 Direct help</b>\n` +
    `finebot.support@gmail.com`;

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

async function showHowToUse(
  ctx
) {
  return ctx.editMessageText(
    `<b>📖 How to Use FineBot</b>\n\n` +
      `<b>1️⃣ Start with Learn</b>\n` +
      `Pick a course area and work through lessons one step at a time. Don't rush the sections just to reach the end.\n\n` +
      `<b>2️⃣ Use Practice to test yourself</b>\n` +
      `Answer first. If you're unsure or curious about the reasoning, tap <b>📖 Show Me How</b>.\n\n` +
      `<b>3️⃣ Check My Journey</b>\n` +
      `Your progress is personal: XP, streak, questions, accuracy, lessons, subjects and achievements.\n\n` +
      `<b>4️⃣ Use Fix My Weak honestly</b>\n` +
      `It works from your actual practice history. The weakest area isn't a judgment — it's simply the place where another small step may help most.\n\n` +
      `<b>5️⃣ Don't fear wrong answers</b>\n` +
      `A wrong answer gives FineBot useful information about what to revisit.\n\n` +
      `<b>6️⃣ Keep the session manageable</b>\n` +
      `One lesson. A few questions. One correction. Small progress is still progress.\n\n` +
      `<b>Need a human?</b>\n` +
      `📩 finebot.support@gmail.com`,
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

async function showFaq(
  ctx
) {
  return ctx.editMessageText(
    `<b>❓ FineBot FAQ</b>\n\n` +
      `<b>Is FineBot free?</b>\n` +
      `The current core experience is designed to be useful without requiring a paid upgrade.\n\n` +
      `<b>Does FineBot save my progress?</b>\n` +
      `Yes. Your student profile stores progress such as XP, streak, practice results, mistakes, completed lessons and achievements.\n\n` +
      `<b>Can I continue a lesson?</b>\n` +
      `Your active learning session is kept while the current bot instance is running. Permanent lesson-resume storage can be added to the student data layer later.\n\n` +
      `<b>What does Fix My Weak do?</b>\n` +
      `It uses your recorded practice results to identify an area currently needing more attention and gives you a small next step.\n\n` +
      `<b>Where can I get direct help?</b>\n` +
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
    return showWeak(ctx);
  }
);

bot.action(
  "support_how",
  async ctx => {
    await ctx.answerCbQuery();
    return showHowToUse(
      ctx
    );
  }
);

bot.action(
  "support_faq",
  async ctx => {
    await ctx.answerCbQuery();
    return showFaq(ctx);
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
  /^answer_(.+)_([A-D])$/,
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
  /^explain_(.+)_([A-D])$/,
  async ctx => {
    await ctx.answerCbQuery();

    return showExplanation(
      ctx,
      ctx.match[1],
      ctx.match[2]
    );
  }
);

bot.action(
  /^next_question_(Natural|Social)_(.+)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return nextQuestion(
      ctx,
      ctx.match[1],
      ctx.match[2]
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
  /^learn_category_(.+)_(natural|social)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return showEnglishCategory(
      ctx,
      ctx.match[1],
      ctx.match[2]
    );
  }
);

bot.action(
  /^learn_open_(.+)_(natural|social)$/,
  async ctx => {
    await ctx.answerCbQuery();

    return startEnglishLesson(
      ctx,
      decodeURIComponent(
        ctx.match[1]
      ),
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

    return ctx.reply(
      `<b>💬 Study Buddy is coming soon.</b>\n\n` +
        `We're building the conversational study assistant carefully so it can be genuinely useful rather than just giving you generic replies.\n\n` +
        `For now, try 📚 Learn or ✍️ Practice.`,
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
