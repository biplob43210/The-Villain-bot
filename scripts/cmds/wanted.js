const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 🔑 Facebook App Token
const FB_TOKEN = "6628568379|c1e620fa708a1d5696fb991c1bde5662";

module.exports = {
  config: {
    name: "wanted",
    version: "2.0",
    author: "Arafat (Modified for Jimp)",
    role: 0,
    category: "fun",
    guide: "{pn} @mention / reply"
  },

  onStart: async function ({ api, event, message }) {
    try {
      const mention = Object.keys(event.mentions);
      const replyID = event.messageReply?.senderID;

      // target user (mention > reply > self)
      const targetID = mention[0] || replyID || event.senderID;

      // Random bounty
      const price = Math.floor(Math.random() * 188708) + 329889;
      const currency = "$";
      const priceText = price.toLocaleString() + currency;

      // Facebook Graph avatar URL
      const avatarURL = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=${FB_TOKEN}`;

      // ব্যাকগ্রাউন্ড ওয়েন্টেড টেমপ্লেট ইমেজ লোড করা
      const bgURL = "https://raw.githubusercontent.com/Arafat-Core/Arafat-Temp/refs/heads/main/wanted.png";
      
      let background = await Jimp.read(bgURL);
      background.resize(257, 383); // নির্দিষ্ট সাইজ নিশ্চিত করা

      // ইউজারের প্রোফাইল পিকচার ফেচ করা
      try {
        const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
        let avatar = await Jimp.read(response.data);
        avatar.resize(210, 210); // মূল কোডের সাইজ অনুযায়ী

        // ব্যাকগ্রাউন্ডের ওপর প্রোফাইল পিকচার বসানো (X: 25, Y: 60)
        background.composite(avatar, 25, 60);
      } catch (e) {
        console.error("Could not load avatar for wanted poster:", e);
      }

      // টেক্সট বসানোর জন্য ফন্ট লোড করা
      const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

      // প্রাইস বা অ্যামাউন্ট টেক্সট পোস্টারের নিচে প্রিন্ট করা
      background.print(font, 0, 310, {
        text: priceText,
        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
      }, 257);

      // ফাইলে সেভ করা
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

      const imgPath = path.join(cacheDir, `wanted_${targetID}.png`);
      await background.writeAsync(imgPath);

      message.reply(
        {
          body: "🤠 Wanted poster generated!",
          attachment: fs.createReadStream(imgPath)
        },
        () => fs.unlinkSync(imgPath)
      );

    } catch (err) {
      console.error("WANTED CMD ERROR:", err);
      message.reply("❌ Failed to generate wanted poster.");
    }
  }
};
