const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "admin",
    version: "1.2.1",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Shows bot and owner information with custom image banner",
    category: "info",
    usages: "admin",
    cooldown: 5
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;

    const adminInfoText = 
      `🤖 ──── [ BOT & OWNER INFO ] ──── 👑\n\n` +
      `🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝗬𝘂𝗧𝗮 6𝗧9\n` +
      `👑 𝗢𝘄𝗻𝗲𝗿 : 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯\n` +
      `🏡 𝗗𝗶𝘀𝘁𝗿𝗶𝗰𝘁 : 𝗦𝗶𝗿𝗮ජ𝗴𝗮𝗻𝗷\n` +
      `🆔 𝗔𝗱𝗺𝗶𝗻 𝘂𝗶𝗱 : 𝗩𝗶𝗹𝗲𝗻𝗯𝗶𝗽𝗹𝗼𝗯007\n` +
      `🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : https://facebook.com/Vilenbiplob007\n\n` +
      `📝 𝗕𝗶𝗼 : "Love is Name Sex Is game!💋💥"\n\n` +
      `✨ Contact the owner for any bot-related issues or inquiries!`;

    const cacheDir = path.join(__dirname, 'cache');
    const imagePath = path.join(cacheDir, 'admin_pic.jpg');
    
    try {
      if (!fs.existsSync(cacheDir)) {
        fs.ensureDirSync(cacheDir);
      }

      const imageUrl = "https://i.imgur.com/gTfK2Qx.jpg"; 
      
      // Axios দিয়ে সরাসরি স্ট্রিম আকারে ইমেজ ডাউনলোড করা
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'stream'
      });

      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      return api.sendMessage({
        body: adminInfoText,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        setTimeout(() => {
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }, 5000); // ৫ সেকেন্ড পর ফাইল ডিলিট হবে যাতে সেন্ড হতে সমস্যা না হয়
      }, messageID);

    } catch (error) {
      console.error("Error sending admin image:", error);
      return api.sendMessage(adminInfoText, threadID, messageID);
    }
  }
};
