const config = require('./config.json');
const Telegraf = require('telegraf');
let mongoose = require('mongoose');

mongoose.connect(config.apitoken, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bot = new Telegraf(config.token);
bot.on('polling_error', (m) => console.log(m));
bot.start((ctx) =>
  ctx.reply(
    'Привет я Яма-бот, бот который хочет чтобы ты жил в нормальной стране с нормальными дорогами. Напиши /help для инструкции'
  )
);

bot.hears('/idea', (ctx) =>
  ctx.reply(
    'Иногда бывает что идешь по улице видишь яму, и думаешь было бы круто если бы ее заделали... 10 лет спустя возле этой ямы появлляется еще несколько.Возможно причина в том что нету отдельного реестра, а возможно потому что властям наплевать. С таким реестром у них не будет отговорок.'
  )
);
bot.launch();
