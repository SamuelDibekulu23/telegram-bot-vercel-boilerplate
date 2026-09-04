const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to FineBot—your study companion for Grade 12. Choose an option:', Markup.inlineKeyboard([
    [Markup.button.callback('📚 Topics', 'topics')],
    [Markup.button.callback('💬 Buddy', 'buddy')],
    [Markup.button.callback('✍️ Practice', 'practice')],
    [Markup.button.callback('📞 Contact', 'contact')]
  ]));
});

bot.action('topics', (ctx) => {
  ctx.reply('Choose your stream:', Markup.inlineKeyboard([
    [Markup.button.callback('🌿 Natural', 'natural')],
    [Markup.button.callback('🏛️ Social', 'social')]
  ]));
});

bot.action('natural', (ctx) => ctx.reply('You selected Natural Science.'));
bot.action('social', (ctx) => ctx.reply('You selected Social Science.'));

bot.action('buddy', (ctx) => ctx.reply('How are you feeling today?'));
bot.action('practice', (ctx) => ctx.reply('Pick a subject to practice.'));
bot.action('contact', (ctx) => ctx.reply('You can reach us at: finebot.support@gmail.com'));

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body, res);
  } catch (err) {
    console.error(err);
    res.status(200).send('OK');
  }
};