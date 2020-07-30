const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const axios = require('axios');

let bot = new TelegramBot(config.token, { polling: true });
const url = 'https://yamalutsk.firebaseio.com/objects/';

bot.on('message', (msg) => {
  let Hi = 'hi';
  console.log(msg.text);
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, 'Hello dear user');
  }
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome', {
    reply_markup: JSON.stringify({
      keyboard: [
        ['1', '2', '3'],
        ['4', '5', '6'],
        ['7', '8', '9'],
        ['0'],
        // ['Keyboard'],
        // ['I`am robot'],
      ],
    }),
  });
});

// bot.onText(/\/sendpic/, msg => {
//   bot.sendPhoto(msg.chat.id,"https://www.somesite.com/image.jpg",{caption : "Here we go ! \nThis is just a caption "} );)
// }
