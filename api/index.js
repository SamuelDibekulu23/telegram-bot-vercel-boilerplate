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
| This is only for the current development brick.
| Later, this will be replaced by a real database so progress survives
| redeployments and server restarts.
|
*/

const students = new Map();

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

      createdAt: new Date().toISOString(),
    });
  }

  const student = students.get(telegramId);

  /*
   * Keep Telegram profile information current.
   */
  student.firstName = ctx.from.first_name || student.firstName || "Student";
  student.username = ctx.from.username || student.username || null;

  return student;
}

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

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

  const username = getUsernameText(student);

  return (
    "🌟 FINEBOT\n" +
    "Grade 12 Mastering Companion\n\n" +
    `👋 Good to have you here, ${name}!\n\n` +
    "Ready to make your brain a little stronger today?\n\n" +
    `🔥 ${student.streak} day streak   ·   ⭐ ${student.xp} XP\n` +
    `📚 ${student.questionsAnswered} questions   ·   🎯 ${getAccuracy(student)}% accuracy\n\n` +
    `${username}`
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
  const student = getStudent(ctx);

  /*
   * For now we simply show the real profile.
   * Later the database will allow FineBot to distinguish:
   * - first visit
   * - returning student
   * - same-day return
   * - long absence
   * - streak milestones
   */

  console.log(
    `Student opened FineBot: ${student.firstName} (${student.telegramId})`
  );

  await showHome(ctx);
});

/*
|--------------------------------------------------------------------------
| LEARN
|--------------------------------------------------------------------------
*/

bot.action("home_learn", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📚 LEARN\n\n" +
    "Let's build your understanding one step at a time. 🧠\n\n" +
    "The full Learn & Play journey is being built next.\n\n" +
    "You'll eventually move through your Grade 12 subjects, " +
    "concepts, real-world analogies, notes and practice.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| PRACTICE
|--------------------------------------------------------------------------
*/

bot.action("home_practice", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "✍️ PRACTICE\n\n" +
    "Every question is a chance to get a little stronger.\n\n" +
    "Your question bank, instant results, mistake tracking " +
    "and personalized practice are coming in the Practice brick.\n\n" +
    "We're building it properly, one piece at a time. 💪";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| MY JOURNEY
|--------------------------------------------------------------------------
*/

bot.action("home_journey", async (ctx) => {
  await ctx.answerCbQuery();

  const student = getStudent(ctx);
  const name = getStudentName(ctx);

  const text =
    "📊 MY JOURNEY\n\n" +
    `${name}'s personal progress\n\n` +
    `👤 ${getUsernameText(student)}\n\n` +
    `⭐ XP: ${student.xp}\n` +
    `🔥 Streak: ${student.streak} days\n` +
    `✅ Correct answers: ${student.correctAnswers}\n` +
    `🎯 Accuracy: ${getAccuracy(student)}%\n` +
    `📚 Lessons completed: ${student.lessonsCompleted}\n\n` +
    "🏅 Achievements: " +
    `${student.achievements.length}\n\n` +
    "And when something keeps giving you trouble...\n" +
    "🩹 Fix My Weak will help you work through it.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🩹 Fix My Weak", "journey_weak")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| FIX MY WEAK
|--------------------------------------------------------------------------
*/

bot.action("journey_weak", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🩹 FIX MY WEAK\n\n" +
    "FineBot will look at your real practice results " +
    "to find the areas that need more attention.\n\n" +
    "No random repetition.\n" +
    "No shame.\n" +
    "Just targeted help until things start making sense. 💪\n\n" +
    "The weakness engine will be connected in a later brick.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("📊 My Journey", "home_journey")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| STUDY BUDDY
|--------------------------------------------------------------------------
*/

bot.action("home_buddy", async (ctx) => {
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

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("📖 Fun Stories", "buddy_stories")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| FUN STORIES
|--------------------------------------------------------------------------
*/

bot.action("buddy_stories", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📖 FUN STORIES\n\n" +
    "A little brain refresh between study sessions.\n\n" +
    "True stories, fascinating facts and just-for-fun moments " +
    "will live here.\n\n" +
    "The story system will be connected in a later brick.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("💬 Study Buddy", "home_buddy")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| SUPPORT
|--------------------------------------------------------------------------
*/

bot.action("home_support", async (ctx) => {
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

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("📖 How to Use FineBot", "support_how")],
    [Markup.button.callback("❓ FAQ", "support_faq")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| SUPPORT — HOW TO USE
|--------------------------------------------------------------------------
*/

bot.action("support_how", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📖 HOW TO USE FINEBOT\n\n" +
    "📚 Learn — build understanding step by step.\n\n" +
    "✍️ Practice — test what you know.\n\n" +
    "📊 My Journey — see your personal progress.\n\n" +
    "💬 Study Buddy — talk naturally and get help.\n\n" +
    "🆘 Support — get help whenever you need it.\n\n" +
    "More features will become available as we build FineBot.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Support", "home_support")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| SUPPORT — FAQ
|--------------------------------------------------------------------------
*/

bot.action("support_faq", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "❓ FAQ\n\n" +
    "FineBot is being built as a Grade 12 mastering companion.\n\n" +
    "The learning, practice, progress, weakness recovery, " +
    "Study Buddy and story systems are being developed " +
    "step by step.\n\n" +
    "For a problem that needs direct help:\n" +
    "📧 finebot.support@gmail.com";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Support", "home_support")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| BACK HOME
|--------------------------------------------------------------------------
*/

bot.action("back_home", async (ctx) => {
  await ctx.answerCbQuery();
  await showHome(ctx);
});

/*
|--------------------------------------------------------------------------
| UNKNOWN CALLBACKS
|--------------------------------------------------------------------------
*/

bot.on("callback_query", async (ctx) => {
  try {
    await ctx.answerCbQuery(
      "That little button hasn't learned its trick yet. 😄"
    );
  } catch (error) {
    console.error("Callback error:", error.message);
  }
});

/*
|--------------------------------------------------------------------------
| GLOBAL BOT ERROR HANDLER
|--------------------------------------------------------------------------
*/

bot.catch((error, ctx) => {
  console.error(
    "FineBot error:",
    error && error.message ? error.message : "Unknown error"
  );

  if (ctx && ctx.callbackQuery) {
    ctx
      .answerCbQuery("Something went a little sideways. Try again. 😅")
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
    return res.status(200).send("FineBot is running.");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const receivedSecret =
    req.headers["x-telegram-bot-api-secret-token"];

  if (!receivedSecret || receivedSecret !== SECRET_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  if (!req.body) {
    console.error("Webhook received without request body.");
    return res.status(400).send("Missing request body");
  }

  try {
    await bot.handleUpdate(req.body);

    return res.status(200).send("OK");
  } catch (error) {
    console.error(
      "FineBot webhook error:",
      error && error.message ? error.message : "Unknown error"
    );

    return res.status(500).send("Internal Server Error");
  }
};