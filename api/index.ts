const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const subjects = {
  natural: ['Biology', 'Chemistry', 'Physics', 'Mathematics'],
  social: ['History', 'Geography', 'Economics', 'English']
};

const questions = {
  'Biology': 'What is the powerhouse of the cell?',
  'Chemistry': 'What is the chemical formula of water?',
  'Physics': 'What is the formula for force?',
  'Mathematics': 'What is 5x + 3 = 13?',
  'History': 'Who was the first emperor of Ethiopia?',
  'Geography': 'What is the capital of Ethiopia?',
  'Economics': 'What is inflation?',
  'English': 'What is a noun?'
};

const answers = {
  'What is the powerhouse of the cell?': 'Mitochondria',
  'What is the chemical formula of water?': 'H2O',
  'What is the formula for force?': 'F = ma',
  'What is 5x + 3 = 13?': 'x = 2',
  'Who was the first emperor of Ethiopia?': 'Menelik I',
  'What is the capital of Ethiopia?': 'Addis Ababa',
  'What is inflation?': 'Inflation is the general increase in prices.',
  'What is a noun?': 'A noun is a person, place, or thing.'
};

const userState = {};

bot.start((ctx) => {
  const welcome = `Welcome to FineBot—your study companion for Grade 12.\n\nYou're not here to be perfect. You're here to prepare.\n\nChoose what you need right now:`;
  ctx.reply(welcome, Markup.inlineKeyboard([
    [Markup.button.callback('📚 Topics', 'topics')],
    [Markup.button.callback('💬 Buddy', 'buddy')],
    [Markup.button.callback('✍️ Practice', 'practice')],
    [Markup.button.callback('📞 Contact', 'contact')]
  ]));
});

bot.action('topics', (ctx) => {
  ctx.reply('Choose your stream:', Markup.inlineKeyboard([
    [Markup.button.callback('🌿 Natural Science', 'natural')],
    [Markup.button.callback('🏛️ Social Science', 'social')],
    [Markup.button.callback('🔙 Back', 'back')]
  ]));
});

bot.action('natural', (ctx) => {
  const buttons = subjects.natural.map(sub => [Markup.button.callback(sub, `subject_${sub}`)]);
  buttons.push([Markup.button.callback('🔙 Back', 'topics')]);
  ctx.reply('Choose a subject:', Markup.inlineKeyboard(buttons));
});

bot.action('social', (ctx) => {
  const buttons = subjects.social.map(sub => [Markup.button.callback(sub, `subject_${sub}`)]);
  buttons.push([Markup.button.callback('🔙 Back', 'topics')]);
  ctx.reply('Choose a subject:', Markup.inlineKeyboard(buttons));
});

bot.action(/subject_(.+)/, (ctx) => {
  const subject = ctx.match[1];
  ctx.reply(`You selected ${subject}. Type "practice ${subject}" to get a question.`);
});

bot.action('buddy', (ctx) => {
  ctx.reply('How are you feeling right now?', Markup.inlineKeyboard([
    [Markup.button.callback('😊 Happy', 'happy'), Markup.button.callback('😌 Calm', 'calm')],
    [Markup.button.callback('😩 Stressed', 'stressed'), Markup.button.callback('😤 Frustrated', 'frustrated')],
    [Markup.button.callback('😢 Sad', 'sad'), Markup.button.callback('😐 Neutral', 'neutral')],
    [Markup.button.callback('🔙 Back', 'back')]
  ]));
});

bot.action(['happy', 'calm', 'stressed', 'frustrated', 'sad', 'neutral'], (ctx) => {
  const responses = {
    happy: 'I\'m glad to hear that! Keep shining ☀️',
    calm: 'That\'s a good place to be. Stay grounded 🌿',
    stressed: 'Take a breath. You\'re carrying a lot—I hear you.',
    frustrated: 'It\'s okay to feel this way. You\'re not alone.',
    sad: 'I\'m here with you. It\'s okay to not be okay.',
    neutral: 'Sometimes neutral is the best place to be. Keep going.'
  };
  ctx.reply(responses[ctx.match[0]]);
});

bot.action('practice', (ctx) => {
  ctx.reply('Which subject do you want to practice?', Markup.inlineKeyboard([
    [Markup.button.callback('Biology', 'bio'), Markup.button.callback('Chemistry', 'chem')],
    [Markup.button.callback('Physics', 'phys'), Markup.button.callback('Mathematics', 'math')],
    [Markup.button.callback('History', 'hist'), Markup.button.callback('Geography', 'geo')],
    [Markup.button.callback('English', 'eng'), Markup.button.callback('Economics', 'econ')],
    [Markup.button.callback('🔙 Back', 'back')]
  ]));
});

bot.action(['bio', 'chem', 'phys', 'math', 'hist', 'geo', 'eng', 'econ'], (ctx) => {
  const subjectMap = {
    bio: 'Biology',
    chem: 'Chemistry',
    phys: 'Physics',
    math: 'Mathematics',
    hist: 'History',
    geo: 'Geography',
    eng: 'English',
    econ: 'Economics'
  };
  const subject = subjectMap[ctx.match[0]];
  const q = questions[subject];
  ctx.reply(`📝 Here is your question:\n\n${q}\n\nType your answer, and I\'ll tell you if you\'re right.`);
  userState[ctx.from.id] = { subject, question: q };
});

bot.action('contact', (ctx) => {
  ctx.reply('You can reach out to us at: finebot.support@gmail.com');
});

bot.action('back', (ctx) => {
  ctx.reply('Going back...', Markup.inlineKeyboard([
    [Markup.button.callback('📚 Topics', 'topics')],
    [Markup.button.callback('💬 Buddy', 'buddy')],
    [Markup.button.callback('✍️ Practice', 'practice')],
    [Markup.button.callback('📞 Contact', 'contact')]
  ]));
});

bot.on('text', (ctx) => {
  const msg = ctx.message.text;
  const user = userState[ctx.from.id];

  if (user && user.question) {
    const correctAnswer = answers[user.question];
    if (msg.toLowerCase().includes(correctAnswer.toLowerCase())) {
      ctx.reply('✅ Correct! Well done.');
    } else {
      ctx.reply(`❌ Not quite. The correct answer is: ${correctAnswer}`);
    }
    delete userState[ctx.from.id];
    return;
  }

  ctx.reply('I\'m here for you. Choose an option from the menu to get started.');
});

bot.launch();

module.exports = bot;