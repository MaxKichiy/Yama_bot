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
  let sizes = {
    parse_mode: 'Markdown',
    reply_markup: {
      one_time_keyboard: true,
      keyboard: [
        ['1x1x0.1'],
        ['1x1x0.2'],
        ['1x0.5x0.1'],
        ['1x0.5x0.2'],
        ['Cancel'],
      ],
    },
  };
  photoId = msg.photo[2].file_id;
  userId = msg.from.id;
  location = null;
  size = null;

  bot
    .sendMessage(msg.chat.id, 'Укажите размер в метрах в формате: ДхШхВ', sizes)
    .then(() => {});
  bot.onText(
    /[+-]?([0-9]*[.])?[0-9]+([x|X|х|Х])[+-]?([0-9]*[.])?[0-9]+([x|X|х|Х])[+-]?([0-9]*[.])?[0-9]+/,
    (msg1, match) => {
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
    }
  );
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
        bot.sendMessage(msg.chat.id, 'Done');
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
