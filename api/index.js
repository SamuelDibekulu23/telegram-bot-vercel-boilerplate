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
| FineBot — Part 1: Welcome Screen
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
| Main Home Keyboard
|--------------------------------------------------------------------------
|
| Five simple destinations.
|
| 📚 Learn
| ✍️ Practice
| 📊 My Journey → Fix My Weak
| 💬 Study Buddy → Fun Stories
| 🆘 Support
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

/*
|--------------------------------------------------------------------------
| Home Text
|--------------------------------------------------------------------------
*/

function homeText(ctx) {
  const name = getStudentName(ctx);

  return (
    "🌟 FINEBOT\n" +
    "Ethiopian Grade 12 Mastering Companion\n\n" +
    `👋 Good to have you here, ${name}!\n\n` +
    "Ready to make your brain a little stronger today?\n\n" +
    "🔥 5 day streak   ·   ⭐ 125 XP"
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
| 📚 LEARN
|--------------------------------------------------------------------------
|
| This is only the Part 1 navigation for now.
| The real Learn & Play engine comes in a later brick.
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
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| ✍️ PRACTICE
|--------------------------------------------------------------------------
|
| The real question engine comes in a later brick.
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
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| 📊 MY JOURNEY
|--------------------------------------------------------------------------
|
| Personal progress lives here.
| Fix My Weak is intentionally inside this area.
|--------------------------------------------------------------------------
*/

bot.action("home_journey", async (ctx) => {
  await ctx.answerCbQuery();

  const text =
    "📊 MY JOURNEY\n\n" +
    "This is your personal record of progress.\n\n" +
    "⭐ XP\n" +
    "🔥 Streak\n" +
    "✅ Correct answers\n" +
    "🎯 Accuracy\n" +
    "📚 Lessons completed\n" +
    "🏅 Achievements\n\n" +
    "And when something keeps giving you trouble...\n" +
    "🩹 Fix My Weak will help you work through it.";

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback("🩹 Fix My Weak", "journey_weak"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| 🩹 FIX MY WEAK
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
    [
      Markup.button.callback("📊 My Journey", "home_journey"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| 💬 STUDY BUDDY
|--------------------------------------------------------------------------
|
| Fun Stories intentionally lives inside this area.
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
    [
      Markup.button.callback("📖 Fun Stories", "buddy_stories"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| 📖 FUN STORIES
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
    [
      Markup.button.callback("💬 Study Buddy", "home_buddy"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| 🆘 SUPPORT
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
    [
      Markup.button.callback(
        "📖 How to Use FineBot",
        "support_how"
      ),
    ],
    [
      Markup.button.callback("❓ FAQ", "support_faq"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Support — How to Use
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
    [
      Markup.button.callback("⬅️ Support", "home_support"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
    ],
  ]);

  await ctx.editMessageText(text, keyboard);
});

/*
|--------------------------------------------------------------------------
| Support — FAQ
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
    [
      Markup.button.callback("⬅️ Support", "home_support"),
    ],
    [
      Markup.button.callback("🏠 Home", "back_home"),
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