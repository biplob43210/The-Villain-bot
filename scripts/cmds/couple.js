const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "couple",
    aliases: ["match", "juti", "lovematch"],
    version: "3.0.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Generates a dynamic couple banner with profile pics and pure romantic captions",
    category: "fun",
    usages: "couple",
    cooldown: 5
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;

    try {
      // ১. গ্রুপের মেম্বারদের লিস্ট নিয়ে আসা
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());

      if (participantIDs.length < 2) {
        return api.sendMessage("গ্রুপে কাপল বানানোর মতো পর্যাপ্ত ভিকটিম পাওয়া যায়নি! 😅", threadID, messageID);
      }

      // ২. রেন্ডমলি ২ জন ভিকটিম বেছে নেওয়া
      const firstIndex = Math.floor(Math.random() * participantIDs.length);
      let secondIndex = Math.floor(Math.random() * participantIDs.length);

      while (firstIndex === secondIndex) {
        secondIndex = Math.floor(Math.random() * participantIDs.length);
      }

      const victim1ID = participantIDs[firstIndex];
      const victim2ID = participantIDs[secondIndex];

      const userInfo = await api.getUserInfo([victim1ID, victim2ID]);
      const name1 = userInfo[victim1ID].name || "ভিকটিম ১";
      const name2 = userInfo[victim2ID].name || "ভিকটিম ২";

      // ৩. প্রোফাইল পিকচার ইউআরএল সংগ্রহ (Facebook Graph API CDN)
      const avatar1Url = `https://graph.facebook.com/${victim1ID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatar2Url = `https://graph.facebook.com/${victim2ID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // ৪. ক্যানভাস দিয়ে ব্যানার তৈরি (Width: 800, Height: 450)
      const canvas = createCanvas(800, 450);
      const ctx = canvas.getContext('2d');

      // ডার্ক ও রোমান্টিক ব্যাকগ্রাউন্ড গ্রাডিয়েন্ট
      const gradient = ctx.createLinearGradient(0, 0, 800, 450);
      gradient.addColorStop(0, '#2b1055');
      gradient.addColorStop(0.5, '#7597de');
      gradient.addColorStop(1, '#ff4b2b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 450);

      // প্রোফাইল পিকচার লোড ও আঁকা (সার্কেল শেপ)
      const img1 = await loadImage(avatar1Url);
      const img2 = await loadImage(avatar2Url);

      // প্রথম পিপি (Left Circle)
      ctx.save();
      ctx.beginPath();
      ctx.arc(230, 200, 90, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img1, 140, 110, 180, 180);
      ctx.restore();

      // দ্বিতীয় পিপি (Right Circle)
      ctx.save();
      ctx.beginPath();
      ctx.arc(570, 200, 90, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img2, 480, 110, 180, 180);
      ctx.restore();

      // পিপি-র বর্ডার ও মাঝখানে হার্ট
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(230, 200, 90, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(570, 200, 90, 0, Math.PI * 2);
      ctx.stroke();

      // মাঝের লাভ চিহ্ন
      ctx.font = 'bold 50px Arial';
      ctx.fillStyle = '#ff2a75';
      ctx.textAlign = 'center';
      ctx.fillText('💖', 400, 215);

      // ব্যানারে স্পেশাল টেক্সট লেখা
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯💋🖤 এর পক্ষ থেকে আজকের সেরা কাপল', 400, 350);

      ctx.font = 'bold 22px Arial';
      ctx.fillStyle = '#ffeb3b';
      ctx.fillText(`${name1}  ❤️  ${name2}`, 400, 390);

      // ব্যানার ফাইল ইমেজ হিসেবে সেভ করা
      const cachePath = path.join(__dirname, 'cache', `couple_${Date.now()}.png`);
      await fs.ensureDir(path.join(__dirname, 'cache'));
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(cachePath, buffer);

      // ৫. খাঁটি রোমান্টিক ক্যাপশন মেসেজ
      const captionMsg = 
        `💖 ─── [ 𝐒𝐄𝐑𝐀 𝐂𝐎𝐔𝐏𝐋𝐄 𝐌𝐀𝐓𝐂𝐇 ] ─── 💖\n\n` +
        `𝐇𝐞𝐚 𝐉𝐚𝐧 𝐁𝐨𝐥𝐨 💋🖤\n` +
        `চোখ বন্ধ করতেই যেন মনের আয়নায় ভেসে উঠল আজকের সেরা দুটি মুখ! 🌸✨\n\n` +
        `🌹 আজ আমাদের জালে ধরা পড়েছে ২ জন ভিকটিম:\n` +
        `🤵‍♂️ রাজকুমার: @${name1}\n` +
        `👰‍♀️ রাজকুমারী: @${name2}\n\n` +
        `💍 **𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯💋🖤** এর বিশেষ পছন্দ এবং সাক্ষী **Yuta**-র পূর্ণ সমর্থনে এই ভালোবাসার মেলবন্ধন ঘোষণা করা হলো! চিরকাল এভাবেই একে অপরের হাত ধরে বেঁচে থাকো। 🥰💌`;

      // ৬. মেসেজ ও ব্যানার পিকচার সেন্ড করা
      await api.sendMessage({
        body: captionMsg,
        mentions: [
          { tag: `@${name1}`, id: victim1ID },
          { tag: `@${name2}`, id: victim2ID }
        ],
        attachment: fs.createReadStream(cachePath)
      }, threadID, () => fs.unlinkSync(cachePath), messageID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("ইশ! ভিকটিমদের ব্যানার বানাতে গিয়ে একটু সমস্যা হয়েছে, আবার চেষ্টা করুন! 💔", threadID, messageID);
    }
  }
};
