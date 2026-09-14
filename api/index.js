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
| FineBot — Brick 1
| Core Telegram/Vercel Foundation
|--------------------------------------------------------------------------
*/

/* -----------------------------------------------------------------------
   Helpers
------------------------------------------------------------------------ */

function getStudentName(ctx) {
  const user = ctx.from;

  if (!user) {
    return "Student";
  }

  return user.first_name || "Student";
}

function homeKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📚 Practice", "home_practice"),
      Markup.button.callback("🎯 Daily Challenge", "home_daily"),
    ],
    [
      Markup.button.callback("📊 My Progress", "home_progress"),
      Markup.button.callback("📞 Support", "home_support"),
    ],
  ]);
}

function homeText(ctx) {
  const name = getStudentName(ctx);

  return (
    "🌟 FINEBOT\n" +
    "Grade 12 Mastering Companion\n\n" +
    `👋 Welcome, ${name}!\n\n` +
    "🔥 0 day streak\n" +
    "⭐ 0 XP\n" +
    "📊 0 questions answered\n\n" +
    "What do you want to do?"
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
      /*
       * Telegram can report an error when the message already
       * contains exactly the same text and keyboard.
       * We do not need to send another message in that case.
       */
      if (
        !error.description ||
        !error.description.includes("message is not modified")
      ) {
        throw error;
      }
    }

    return;
  }

  await ctx.reply(text, keyboard);
}

/* -----------------------------------------------------------------------
   /start
------------------------------------------------------------------------ */

bot.start(async (ctx) => {
  await showHome(ctx);
});

/* -----------------------------------------------------------------------
   Home → Practice
------------------------------------------------------------------------ */

bot.action("home_practice", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📚 PRACTICE\n\n" +
    "Choose your stream:\n\n" +
    "🌿 Natural Science\n" +
    "🌍 Social Science";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("🌿 Natural Science", "practice_natural")],
    [Markup.button.callback("🌍 Social Science", "practice_social")],
    [Markup.button.callback("⬅️ Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Practice → Natural Science
------------------------------------------------------------------------ */

bot.action("practice_natural", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🌿 NATURAL SCIENCE\n\n" +
    "Choose a subject:\n\n" +
    "🧬 Biology\n" +
    "⚗️ Chemistry\n" +
    "⚡ Physics\n" +
    "📐 Mathematics\n" +
    "🇬🇧 English\n" +
    "🧠 Scholastic Aptitude";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🧬 Biology", "subject_biology"),
      Markup.button.callback("⚗️ Chemistry", "subject_chemistry"),
    ],
    [
      Markup.button.callback("⚡ Physics", "subject_physics"),
      Markup.button.callback("📐 Mathematics", "subject_math_natural"),
    ],
    [
      Markup.button.callback("🇬🇧 English", "subject_english_natural"),
      Markup.button.callback("🧠 Aptitude", "subject_aptitude"),
    ],
    [Markup.button.callback("⬅️ Practice", "home_practice")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Practice → Social Science
------------------------------------------------------------------------ */

bot.action("practice_social", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🌍 SOCIAL SCIENCE\n\n" +
    "Choose a subject:\n\n" +
    "🇬🇧 English\n" +
    "📐 Mathematics\n" +
    "🌍 Geography\n" +
    "💰 Economics\n" +
    "🏛️ History";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🇬🇧 English", "subject_english_social"),
      Markup.button.callback("📐 Mathematics", "subject_math_social"),
    ],
    [
      Markup.button.callback("🌍 Geography", "subject_geography"),
      Markup.button.callback("💰 Economics", "subject_economics"),
    ],
    [Markup.button.callback("🏛️ History", "subject_history")],
    [Markup.button.callback("⬅️ Practice", "home_practice")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Subject placeholders
   -----------------------------------------------------------------------
   Questions are intentionally NOT implemented in Brick 1.
------------------------------------------------------------------------ */

async function subjectComingSoon(ctx, subjectName) {
  await ctx.answerCbQuery();

  const text =
    `📚 ${subjectName.toUpperCase()}\n\n` +
    "This subject is being prepared for FineBot.\n\n" +
    "🧱 The learning engine will be added in a later brick.\n\n" +
    "Your progress will eventually be tracked here.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Practice", "home_practice")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
}

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

/* -----------------------------------------------------------------------
   Home → Daily Challenge
------------------------------------------------------------------------ */

bot.action("home_daily", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🎯 DAILY CHALLENGE\n\n" +
    "Today's challenge is being prepared.\n\n" +
    "🔥 Build your study habit one day at a time!\n\n" +
    "⭐ Future reward: +20 XP";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Home → My Progress
------------------------------------------------------------------------ */

bot.action("home_progress", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📊 MY PROGRESS\n\n" +
    "⭐ XP\n" +
    "0\n\n" +
    "🔥 Study Streak\n" +
    "0 days\n\n" +
    "🎯 Accuracy\n" +
    "0%\n\n" +
    "✍️ Questions\n" +
    "0 answered\n\n" +
    "Start practicing to build your progress!";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("📚 Practice", "home_practice")],
    [Markup.button.callback("⬅️ Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Home → Support
------------------------------------------------------------------------ */

bot.action("home_support", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📞 SUPPORT\n\n" +
    "We're here to help.\n\n" +
    "Choose an option:";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("❓ How FineBot Works", "support_how")],
    [Markup.button.callback("🐛 Report a Problem", "support_problem")],
    [Markup.button.callback("💬 Contact Support", "support_contact")],
    [Markup.button.callback("⬅️ Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Support screens
------------------------------------------------------------------------ */

bot.action("support_how", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "❓ HOW FINEBOT WORKS\n\n" +
    "FineBot is a Grade 12 mastering companion designed to help you:\n\n" +
    "📚 Learn important concepts\n" +
    "✍️ Practice exam-focused questions\n" +
    "📊 Track your progress\n" +
    "🔥 Build consistent study habits\n\n" +
    "More learning features will be added step by step.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Support", "home_support")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

bot.action("support_problem", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "🐛 REPORT A PROBLEM\n\n" +
    "If something isn't working correctly, please describe the problem " +
    "and send it to the FineBot support team.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Support", "home_support")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

bot.action("support_contact", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "💬 CONTACT SUPPORT\n\n" +
    "Support contact details will be connected here when the support " +
    "system is implemented.";

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback("⬅️ Support", "home_support")],
    [Markup.button.callback("🏠 Home", "back_home")],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/* -----------------------------------------------------------------------
   Back → Home
------------------------------------------------------------------------ */

bot.action("back_home", async (ctx) => {
  await ctx.answerCbQuery();
  await showHome(ctx);
});

/* -----------------------------------------------------------------------
   Unknown callback protection
------------------------------------------------------------------------ */

bot.on("callback_query", async (ctx) => {
  try {
    await ctx.answerCbQuery("This option is not available yet.");
  } catch (error) {
    console.error("Callback error:", error.message);
  }
});

/* -----------------------------------------------------------------------
   Error handling
------------------------------------------------------------------------ */

bot.catch((error, ctx) => {
  console.error("FineBot error:", error.message);

  if (ctx.callbackQuery) {
    ctx
      .answerCbQuery("⚠️ Something went wrong. Please try again.")
      .catch(() => {});
  }
});

 /* -----------------------------------------------------------------------
   Vercel webhook handler
------------------------------------------------------------------------ */

module.exports = async (req, res) => {
  /*
   * Simple health check.
   */
  if (req.method === "GET") {
    return res.status(200).send("FineBot is running.");
  }

  /*
   * Only Telegram POST updates are accepted.
   */
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  /*
   * Verify Telegram's webhook secret.
   */
  const receivedSecret =
    req.headers["x-telegram-bot-api-secret-token"];

  if (!receivedSecret || receivedSecret !== SECRET_TOKEN) {
    return res.status(401).send("Unauthorized");
  }

  /*
   * Vercel provides the Telegram update in req.body.
   */
  if (!req.body) {
    console.error("Webhook received without a request body.");
    return res.status(400).send("Missing request body");
  }

  /*
   * Pass the update directly to Telegraf.
   */
  try {
    await bot.handleUpdate(req.body, res);

    /*
     * Telegraf may already have completed the response.
     * Only send OK if Vercel still needs a response.
     */
    if (!res.headersSent) {
      return res.status(200).send("OK");
    }
  } catch (error) {
    console.error("FineBot webhook error:", error);

    if (!res.headersSent) {
      return res.status(500).send("Internal Server Error");
    }
  }
};