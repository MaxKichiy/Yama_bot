const config = require('./config.json');
const Telegraf = require('telegraf');
const axios = require('axios');

const url = 'https://yamalutsk.firebaseio.com/objects/';
const bot = new Telegraf(config.token);
let photoID = null;
let size = null;
let location = null;
let userID = null;
bot.start((ctx) => {
  // const keyboard = Telegraf.Extra.markup((markup) => {
  //   markup
  //     .resize()
  //     .keyboard([
  //       markup.contactRequestButton('Give phone number'),
  //       markup.locationRequestButton('Give location'),
  //     ]);
  //   console.log(markup);
  // });
  // console.log('fuckOff');
  // ctx.replyWithMarkdown('a message to user', keyboard);

  return ctx.reply(
    'Привет я Яма-бот, бот который хочет чтобы ты жил в нормальной стране с нормальными дорогами. Напиши /add чтобы добавить фотографию ямы'
  );
});

bot.hears('fuckyou', (ctx) => {
  const keyboard = Telegraf.Extra.markup((markup) => {
    markup
      .resize()
      .keyboard([
        markup.contactRequestButton('Give phone number'),
        markup.locationRequestButton('Give location'),
      ]);
  });
  ctx.replyWithMarkdown(ctx.message.text, keyboard);
  bot.telegram
    .sendMessage(ctx.message.chat.id, 'digimoon ti eby4iy', keyboard)
    .then(() => {
      bot.on('location', (msg) => {
        console.log(msg.location);
      });
    });
});
bot.hears('location', (msg) => {
  console.log(msg);
});

bot.command('add', (ctx) => {
  ctx.reply('Выберете фото или сфотографируйте яму');
});

bot.on('photo', (ctxPhoto) => {
  photoID = ctxPhoto.message.photo[0].file_id;
  userID = ctxPhoto.message.from.id;
  ctxPhoto.reply('Укажите размер в метрах в формате: ДхШхВ ');
});
bot.hears(/\d([x|X|х|Х])\d([x|X|х|Х])\d/, (ctxMatch) => {
  size = ctxMatch.match.input;
  ctxMatch.reply('Укажите локацию где было сделано фото: адрес или геолокацию');
  if (photoID) {
    bot.on('text', (ctxLocation) => {
      location = ctxLocation.message.text;
      bot.telegram.getFileLink(photoID).then((res) => {
        axios
          .post(url + userID + '.json', {
            photo: res,
            date: Date(ctxLocation.message.date),
            location: location,
            size: size,
          })
          .then((res) => {
            console.log(res.status);
            location = null;
            photoID = null;
            size = null;
            userID = null;
          })
          .catch((error) => console.log(error));
      });
    });
  }
});

// bot.on('photo', (ctx) => {
//   ctx.reply('Укажите размер в метрах в формате: ДхШхВ ');

//   let location = null;
//   let photoId = ctx.message.photo[0].file_id;
//   let size = null;

//   bot.hears(/\d([x|X|х|Х])\d([x|X|х|Х])\d/, (ctxMatch) => {
//     size = ctxMatch.match.input;
//     ctxMatch.reply(
//       'Укажите локацию где было сделано фото: адрес или геолокацию'
//     );
//     bot.on('text', (ctxAddr) => {
//       location = ctxAddr.message.text;
//       bot.telegram.getFileLink(photoId).then((res) => {
//         axios
//           .post(url + ctx.message.from.id + '.json', {
//             photo: res,
//             date: Date(ctx.message.date),
//             location: location,
//             size: size,
//           })
//           .then((res) => {
//             console.log(res.status);
//             location = null;
//           });
//       });
//     });
//   });
// });

// bot.command('all', (ctx) => {
//   axios
//     .get(url + ctx.message.from.id + '.json')
//     .then((res) => ctx.reply(res.data));
// });
// bot.on('message', (ctx) => {
//   console.log(ctx.message);
// });

// bot.hears('/idea', (ctx) =>
//   ctx.reply(
//     'Иногда бывает что идешь по улице видишь яму, и думаешь было бы круто если бы ее заделали... 10 лет спустя возле этой ямы появлляется еще несколько.Возможно причина в том что нету отдельного реестра, а возможно потому что властям наплевать. С таким реестром у них не будет отговорок.'
//   )
// );
bot.launch();
