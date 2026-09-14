 const { Telegraf, Markup } = require("telegraf");

const BOT_TOKEN = process.env.BOT_TOKEN;
const SECRET_TOKEN = process.env.SECRET_TOKEN;

/*
|--------------------------------------------------------------------------
| Security: required environment variables
|--------------------------------------------------------------------------
*/

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN environment variable is missing.");
}

if (!SECRET_TOKEN) {
  throw new Error("SECRET_TOKEN environment variable is missing.");
}

const bot = new Telegraf(BOT_TOKEN);

/*
|--------------------------------------------------------------------------
| FineBot — Friendly Home Experience
|--------------------------------------------------------------------------
*/

/*
 * Get the student's first name safely.
 */
function getStudentName(ctx) {
  if (!ctx.from) {
    return "there";
  }

  const name = ctx.from.first_name;

  if (!name || typeof name !== "string") {
    return "there";
  }

  return name.trim() || "there";
}

/*
|--------------------------------------------------------------------------
| Home keyboard
|--------------------------------------------------------------------------
|
| Six destinations.
| Two columns × three rows.
|--------------------------------------------------------------------------
*/

function homeKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("🧠 Learn & Play", "home_practice"),
      Markup.button.callback("🎯 Daily Spark", "home_daily"),
    ],
    [
      Markup.button.callback("📈 My Journey", "home_progress"),
      Markup.button.callback("🧩 Fix My Weak", "home_weak"),
    ],
    [
      Markup.button.callback("🔥 Keep It Going", "home_streak"),
      Markup.button.callback("💬 Talk to FineBot", "home_chat"),
    ],
  ]);
}

/*
|--------------------------------------------------------------------------
| Home text
|--------------------------------------------------------------------------
*/

function homeText(ctx) {
  const name = getStudentName(ctx);

  return (
    "✨ FINEBOT\n\n" +
    `Good to have you here, ${name}. 😄\n` +
    "Ready to make your brain a little stronger today?\n\n" +
    "🔥 5 day streak   ·   ⭐ 125 XP\n\n" +
    "A little practice now can make tomorrow's questions\n" +
    "feel a whole lot easier. 🧠✨\n\n" +
    "What feels right today?"
  );
}

/*
|--------------------------------------------------------------------------
| Show Home
|--------------------------------------------------------------------------
*/

async function showHome(ctx) {
  const text = homeText(ctx);
  const keyboard = homeKeyboard();

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, keyboard);
      return;
    } catch (error) {
      /*
       * Telegram returns this when the message already has
       * exactly the same text and keyboard.
       */
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
| /start
|--------------------------------------------------------------------------
*/

bot.start(async (ctx) => {
  await showHome(ctx);
});

/*
|--------------------------------------------------------------------------
| Learn & Play
|--------------------------------------------------------------------------
*/

bot.action("home_practice", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🧠 LET'S GET INTO IT\n\n" +
    "Pick the kind of brain workout you're in the mood for.\n\n" +
    "🌿 Natural Science\n" +
    "🌍 Social Science";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🌿 Natural Science",
        "practice_natural"
      ),
    ],
    [
      Markup.button.callback(
        "🌍 Social Science",
        "practice_social"
      ),
    ],
    [
      Markup.button.callback("🏠 Back to Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Natural Science
|--------------------------------------------------------------------------
*/

bot.action("practice_natural", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🌿 NATURAL SCIENCE\n\n" +
    "Where should we start?\n\n" +
    "Take your pick — we'll go one step at a time. 😌";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🧬 Biology", "subject_biology"),
      Markup.button.callback("⚗️ Chemistry", "subject_chemistry"),
    ],
    [
      Markup.button.callback("⚡ Physics", "subject_physics"),
      Markup.button.callback(
        "📐 Mathematics",
        "subject_math_natural"
      ),
    ],
    [
      Markup.button.callback(
        "🇬🇧 English",
        "subject_english_natural"
      ),
      Markup.button.callback(
        "🧠 Aptitude",
        "subject_aptitude"
      ),
    ],
    [
      Markup.button.callback("⬅️ Back", "home_practice"),
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Social Science
|--------------------------------------------------------------------------
*/

bot.action("practice_social", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🌍 SOCIAL SCIENCE\n\n" +
    "What are we tackling today?\n\n" +
    "Pick one and let's see what you can do. 😄";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        "🇬🇧 English",
        "subject_english_social"
      ),
      Markup.button.callback(
        "📐 Mathematics",
        "subject_math_social"
      ),
    ],
    [
      Markup.button.callback(
        "🌍 Geography",
        "subject_geography"
      ),
      Markup.button.callback(
        "💰 Economics",
        "subject_economics"
      ),
    ],
    [
      Markup.button.callback("🏛️ History", "subject_history"),
    ],
    [
      Markup.button.callback("⬅️ Back", "home_practice"),
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Subject placeholder
|--------------------------------------------------------------------------
|
| The actual learning engine comes in a later brick.
|--------------------------------------------------------------------------
*/

async function subjectComingSoon(ctx, subjectName) {
  await ctx.answerCbQuery();

  const text =
    `📚 ${subjectName}\n\n` +
    "We're getting this one ready. 🛠️\n\n" +
    "The real lessons, questions, explanations and progress\n" +
    "tracking will arrive in the learning engine.\n\n" +
    "We're building it properly — one piece at a time. 💪";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("⬅️ Subjects", "home_practice"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
}

/*
|--------------------------------------------------------------------------
| Subject buttons
|--------------------------------------------------------------------------
*/

bot.action("subject_biology", (ctx) =>
  subjectComingSoon(ctx, "Biology")
);

bot.action("subject_chemistry", (ctx) =>
  subjectComingSoon(ctx, "Chemistry")
);

bot.action("subject_physics", (ctx) =>
  subjectComingSoon(ctx, "Physics")
);

bot.action("subject_math_natural", (ctx) =>
  subjectComingSoon(ctx, "Mathematics — Natural Science")
);

bot.action("subject_english_natural", (ctx) =>
  subjectComingSoon(ctx, "English — Natural Science")
);

bot.action("subject_aptitude", (ctx) =>
  subjectComingSoon(ctx, "Scholastic Aptitude")
);

bot.action("subject_english_social", (ctx) =>
  subjectComingSoon(ctx, "English — Social Science")
);

bot.action("subject_math_social", (ctx) =>
  subjectComingSoon(ctx, "Mathematics — Social Science")
);

bot.action("subject_geography", (ctx) =>
  subjectComingSoon(ctx, "Geography")
);

bot.action("subject_economics", (ctx) =>
  subjectComingSoon(ctx, "Economics")
);

bot.action("subject_history", (ctx) =>
  subjectComingSoon(ctx, "History")
);

/*
|--------------------------------------------------------------------------
| Daily Spark
|--------------------------------------------------------------------------
*/

bot.action("home_daily", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🎯 TODAY'S LITTLE CHALLENGE\n\n" +
    "Just one focused challenge.\n" +
    "No need to conquer the whole syllabus tonight. 😄\n\n" +
    "We're preparing your first Daily Spark now.\n\n" +
    "⭐ Reward: +20 XP";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🏠 Take Me Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| My Journey
|--------------------------------------------------------------------------
*/

bot.action("home_progress", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📈 YOUR JOURNEY\n\n" +
    "You're just getting started here. 🌱\n\n" +
    "⭐ 125 XP\n" +
    "🔥 5 day streak\n" +
    "🎯 0 questions completed\n" +
    "📊 Accuracy will appear here once you start practicing.\n\n" +
    "Every question you answer will gradually build this page.";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🧠 Learn & Play", "home_practice"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Fix My Weak
|--------------------------------------------------------------------------
*/

bot.action("home_weak", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🧩 LET'S FIX THE TRICKY PART\n\n" +
    "Not sure what you're weakest at yet?\n" +
    "That's okay — FineBot will figure it out as you practice.\n\n" +
    "We'll watch where you struggle,\n" +
    "then help you turn those tricky bits into strengths. 💪";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🧠 Start Practicing", "home_practice"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Keep It Going
|--------------------------------------------------------------------------
*/

bot.action("home_streak", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🔥 KEEP THE STREAK ALIVE\n\n" +
    "Five minutes of focused practice still counts.\n\n" +
    "The goal isn't to study perfectly every day.\n" +
    "It's simply to keep showing up. ❤️\n\n" +
    "Your current streak: 5 days";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🧠 Give Me a Question", "home_practice"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Talk to FineBot
|--------------------------------------------------------------------------
*/

bot.action("home_chat", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "💬 I'M HERE\n\n" +
    "Got a question?\n" +
    "Something confusing you?\n" +
    "Or just need a little push to keep studying?\n\n" +
    "FineBot's got you. 😄\n\n" +
    "The conversation features will be connected here as we build them.";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🏠 Back Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Back to Home
|--------------------------------------------------------------------------
*/

bot.action("back_home", async (ctx) => {
  await ctx.answerCbQuery();
  await showHome(ctx);
});

/*
|--------------------------------------------------------------------------
| Unknown callback protection
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
| Global Telegraf error handling
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
| Vercel webhook handler
|--------------------------------------------------------------------------
*/

module.exports = async (req, res) => {
  /*
   * Health check.
   */
  if (req.method === "GET") {
    return res.status(200).send("FineBot is running.");
  }

  /*
   * Telegram updates must arrive through POST.
   */
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  /*
   * Verify Telegram's secret webhook header.
   */
  const receivedSecret =
    req.headers["x-telegram-bot-api-secret-token"];

  if (
    !receivedSecret ||
    receivedSecret !== SECRET_TOKEN
  ) {
    return res.status(401).send("Unauthorized");
  }

  /*
   * Make sure an update was received.
   */
  if (!req.body) {
    console.error("Webhook received without request body.");
    return res.status(400).send("Missing request body");
  }

  /*
   * Give the Telegram update to Telegraf.
   */
  try {
    await bot.handleUpdate(req.body);

    return res.status(200).send("OK");
  } catch (error) {
    console.error(
      "FineBot webhook error:",
      error && error.message
        ? error.message
        : "Unknown error"
    );

    return res.status(500).send("Internal Server Error");
  }
};