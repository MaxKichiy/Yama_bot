const config = require('./config.json');
const Telegraf = require('telegraf');

const bot = new Telegraf(config.token);
bot.start((ctx) => ctx.reply('Welcome'));
bot.hears('hi', (ctx) => ctx.reply('Hey'));
bot.launch();
