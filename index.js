const TelegramBot = require("node-telegram-bot-api");
process.env["NTBA_FIX_319"] = 1;


const Downloader = require("node-url-downloader");
const watermarker = require("./editor");
const waterMarks = require("./config");
const fs = require("fs");


const token =watermarker.getToke()
const bot = new TelegramBot(token, { polling: true });
bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const Rawaction = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
    parse_mode: "HTML",
  };
  let actions = Rawaction.split("@@");
  switch (actions[0]) {
    case "vid":
      let waterMarkAddressVID =await  waterMarks.getWarteMark(actions[1]);
      let uri2 = await watermarker.watermark(actions[2], waterMarkAddressVID);
      const buffer2 = await fs.createReadStream(`${__dirname}/${uri2}`);
      buffer2.on("open", async (fd) => {
        bot
          .editMessageText("لطفا صبر کنید(ممکن است تا ۱ دقیقه طول بکشد)", opts)
          .then((dn) => {
            bot
              .sendVideo(opts.chat_id, buffer2)
              .then((done) => {
                bot.deleteMessage(opts.chat_id, opts.message_id);
                fs.unlinkSync(`${__dirname}/${uri2}`)
                fs.unlinkSync(`${__dirname}/${uri2.split("output")[1]}`)
              })
              .catch((xx) => console.log(xx));
          });
      });
      break;
    case "img":
      let waterMarkAddress =await  waterMarks.getWarteMark(actions[1]);
      let uri = await watermarker.watermark(actions[2], waterMarkAddress, true);
      const buffer = await fs.createReadStream(`${__dirname}/${uri}`);
      console.log(actions)
      console.log(waterMarkAddress)
      
      buffer.on("open", async (fd) => {
        bot
          .editMessageText("لطفا صبر کنید(ممکن است تا ۱ دقیقه طول بکشد)", opts)
          .then((dn) => {
            bot
              .sendPhoto(opts.chat_id, buffer)
              .then((done) => {
                bot.deleteMessage(opts.chat_id, opts.message_id);
                fs.unlinkSync(`${__dirname}/${uri}`)
                fs.unlinkSync(`${__dirname}/${uri.split("output")[1]}`)
              })
              .catch((xx) => console.log(xx));
          });
      });
      break;
  }
});

bot.on("message", async (msg) => {
  let chatId = msg.chat.id;
  //=========================
  if (msg.photo) {
    const videoURL = await bot.getFileLink(
      msg.photo[Object.keys(msg.photo).length - 1].file_id
    );
    const download = new Downloader();
    download.get(videoURL);
    bot.sendMessage(chatId, "شروع بارگیری به سرور");
    download.on("done", async (dst) => {
      let keyboard = await waterMarks.inline_keyBoard("img", dst);
      console.log(keyboard);
      bot.sendMessage(
        chatId,
        "فایل ارسالی شما یک عکس میباشد.\nلطفا واترمارک مورد نظر خود را مشخص نمایید",
        {
          reply_markup: keyboard,
        }
      );
    });
  }
  if (msg.video) {
    const videoURL = await bot.getFileLink(msg.video.file_id);
    const download = new Downloader();
    download.get(videoURL);
    bot.sendMessage(chatId, "شروع بارگیری به سرور");
    download.on("done", async (dst) => {
      let keyboard = await waterMarks.inline_keyBoard("vid", dst);
      console.log(keyboard);
      bot.sendMessage(
        chatId,
        "فایل ارسالی شما یک فیلم میباشد.\nلطفا واترمارک مورد نظر خود را مشخص نمایید",
        {
          reply_markup: keyboard,
        }
      );
    });
  }
  if (!msg.video && !msg.photo) {
    bot.sendMessage(chatId, "لطفا فیلم یا ویدیو ارسال نمایید");
  }
});
