const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "admin",
    version: "1.2.0",
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

    // আপনার দেওয়া ডিজাইন ও তথ্য
    const adminInfoText = 
      `🤖 ──── [ BOT & OWNER INFO ] ──── 👑\n\n` +
      `🤖 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲 : 𝗬𝘂𝗧𝗮 6𝗧9\n` +
      `👑 𝗢𝘄𝗻𝗲𝗿 : 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯\n` +
      `🏡 𝗗𝗶𝘀𝘁𝗿𝗶𝗰𝘁 : 𝗦𝗶𝗿𝗮𝗷𝗴𝗮𝗻𝗷\n` +
      `🆔 𝗔𝗱𝗺𝗶𝗻 𝘂𝗶𝗱 : 𝗩𝗶𝗹𝗲𝗻𝗯𝗶𝗽𝗹𝗼𝗯007\n` +
      `🌐 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 : https://facebook.com/𝗩𝗶𝗹𝗲𝗻𝗯𝗶𝗽𝗹𝗼𝗯007\n\n` +
      `📝 𝗕𝗶𝗼 : "Love is Name Sex Is game!💋💥"\n\n` +
      `✨ Contact the owner for any bot-related issues or inquiries!`;

    const imagePath = path.join(__dirname, 'cache', 'admin_pic.jpg');
    
    try {
      // এখানে আপনার ছবির ডিরেক্ট লিংক বসানো হয়েছে
      const imageUrl = "https://i.imgur.com/6910_biplob_boss.jpg"; 
      
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      await fs.ensureDir(path.join(__dirname, 'cache'));
      await fs.writeFile(imagePath, response.data);

      return api.sendMessage({
        body: adminInfoText,
        attachment: fs.createReadStream(imagePath)
      }, threadID, () => {
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }, messageID);

    } catch (error) {
      console.error("Error sending admin image:", error);
      return api.sendMessage(adminInfoText, threadID, messageID);
    }
  }
};
