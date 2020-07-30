const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.json');
const axios = require('axios');

let bot = new TelegramBot(config.token, {
  polling: true,
  onlyFirstMatch: true,
});
const url = 'https://yamalutsk.firebaseio.com/objects/';

let photoId;
let userId;
let location;
let size;

bot.on('photo', (msg, match) => {
  let option = {
    parse_mode: 'Markdown',
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        [{ text: 'My location', request_location: true }],
        ['/Отправить'],
        ['Cancel'],
      ],
    },
  };
  photoId = msg.photo[0].file_id;
  userId = msg.from.id;
  location = null;
  size = null;

  bot.sendMessage(msg.chat.id, 'Укажите размер в метрах в формате: ДхШхВ');
  bot.onText(/\d([x|X|х|Х])\d([x|X|х|Х])\d/, (msg1, match) => {
    size = match.input;
    if (size) {
      bot
        .sendMessage(
          msg.chat.id,
          'Укажите локацию где было сделано фото: адрес или геолокацию',
          option
        )
        .then(() => {
          bot.on('location', (msg) => {
            location = [msg.location.longitude, msg.location.latitude].join(
              ','
            );

            // if (location == null) {
            //   bot.on('text', (msg) => {
            //     location = msg.message.text;
            //   });
            // }
            // bot.getFileLink(photoId).then((res) => {
            //   axios
            //     .post(url + userId + '.json', {
            //       photo: res,
            //       date: new Date(),
            //       location: location,
            //       size: size,
            //     })
            //     .then((res) => {
            //       console.log(res.status);
            //     });
            // });
          });
        });
    }
  });
});
bot.onText(/^\/Отправить/, (msg) => {
  bot.getFileLink(photoId).then((res) => {
    axios
      .post(url + userId + '.json', {
        photo: res,
        date: new Date(),
        location: location,
        size: size,
      })
      .then((res) => {
        console.log(res.status);
      });
  });
});

bot.onText(/^\/get_location/, (msg, match) => {
  console.log(match);
  let option = {
    parse_mode: 'Markdown',
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [[{ text: 'My location', request_location: true }], ['Cancel']],
    },
  };
  bot
    .sendMessage(msg.chat.id, 'How can we contact you?', option)
    .then(() => {});
});
