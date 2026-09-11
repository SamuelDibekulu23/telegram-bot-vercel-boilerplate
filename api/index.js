 const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('🌟 Welcome to FineBot! Your Grade 12 study companion. Choose an option:', 
    Markup.inlineKeyboard([
      [Markup.button.callback('📚 Practice', 'practice')],
      [Markup.button.callback('📊 My Progress', 'progress')],
      [Markup.button.callback('📞 Support', 'support')]
    ])
  );
});

bot.action('practice', (ctx) => {
  ctx.reply('Choose a subject:', Markup.inlineKeyboard([
    [Markup.button.callback('🧬 Biology', 'biology')],
    [Markup.button.callback('⚗️ Chemistry', 'chemistry')],
    [Markup.button.callback('⚡ Physics', 'physics')],
    [Markup.button.callback('📐 Mathematics', 'math')]
  ]));
});

bot.action('biology', (ctx) => ctx.reply('🧬 Biology selected. Let\'s practice!'));
bot.action('chemistry', (ctx) => ctx.reply('⚗️ Chemistry selected. Let\'s practice!'));
bot.action('physics', (ctx) => ctx.reply('⚡ Physics selected. Let\'s practice!'));
bot.action('math', (ctx) => ctx.reply('📐 Mathematics selected. Let\'s practice!'));

bot.action('progress', (ctx) => {
  ctx.reply('📊 Your progress:\n\n⭐ XP: 0\n🔥 Streak: 0 days\n📚 Questions: 0');
});

bot.action('support', (ctx) => {
  ctx.reply('📞 Support: finebot.support@gmail.com');
});

// This is the handler Vercel needs
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error('Error:', err);
    res.status(200).send('OK');
  }
};