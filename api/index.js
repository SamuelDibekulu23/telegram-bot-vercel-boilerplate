const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(
    'Welcome to FineBot — your study companion!',
    Markup.inlineKeyboard([
      [Markup.button.callback('📚 Topics', 'topics')],
      [Markup.button.callback('💬 Buddy', 'buddy')],
      [Markup.button.callback('✍️ Practice', 'practice')],
      [Markup.button.callback('📞 Contact', 'contact')]
    ])
  );
});

bot.action('topics', (ctx) =>
  ctx.reply('📚 Choose a topic to study.')
);

bot.action('buddy', (ctx) =>
  ctx.reply('💬 How are you doing? I am here to help.')
);

bot.action('practice', (ctx) =>
  ctx.reply('✍️ Practice mode is ready!')
);

bot.action('contact', (ctx) =>
  ctx.reply('📞 You can contact us here.')
);

module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body, res);
  } catch (error) {
    console.error(error);

    if (!res.headersSent) {
      res.status(200).send('OK');
    }
  }
};