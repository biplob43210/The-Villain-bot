const axios = require("axios");
const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "hack",
    version: "2.0.1",
    credits: "Villain Biplob",
    description: "Fun hacking command with dynamic Jimp generated cyber banner",
    usages: "hack @mention",
    cooldown: 5,
    category: "fun" // <--- এই ক্যাটাগরি প্রপার্টি যোগ করা হয়েছে যাতে undefined এরর না আসে
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, mentions } = event;

    // ১. কাউকে মেনশন দেওয়া হয়েছে কিনা চেক করা
    const mentionedIDs = Object.keys(mentions);
    if (mentionedIDs.length === 0) {
      return api.sendMessage("⚠️ ভাই, কাউকে হ্যাক করতে চাইলে তার নাম মেনশন করতে হবে! যেমন: hack @Username", threadID, messageID);
    }

    const targetID = mentionedIDs[0];
    const targetName = mentions[targetID].replace("@", "");

    // অপেক্ষমাণ মেসেজ পাঠানো
    const processingMsg = await api.sendMessage(`🔄 [ SYSTEM NOTICE ] Target @${targetName} scanning started... Please wait.`, threadID);

    try {
      // ক্যাশ ফোল্ডার না থাকলে তৈরি করে নেওয়া
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // ২. সাইবার হ্যাকিং ব্যাকগ্রাউন্ড ইমেজ লোড করা (Jimp দিয়ে)
      const bgUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80";
      const image = await Jimp.read(bgUrl);

      // ৩. ফন্ট লোড করা
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

      // ৪. ছবির ওপর টেক্সট প্রিন্ট করা
      image.print(font, 50, 50, ">> SYSTEM BREACH DETECTED!");
      image.print(font, 50, 100, `Target: ${targetName}`);
      image.print(smallFont, 50, 145, `UID: ${targetID}`);
      image.print(smallFont, 50, 175, `Status: Access Bypassed Successfully!`);
      image.print(font, 50, 240, "HACKED BY VILLAIN BIPLOB");

      // ৫. ফাইল টেম্পোরারি সেভ করা
      const filePath = path.join(cacheDir, `hack_${targetID}.jpg`);
      await image.writeAsync(filePath);

      // ৬. ফেসবুক মেসেঞ্জারে পাঠানোর জন্য প্রস্তুত করা
      const hackText = 
        `😈 System Hacked!\n` +
        `@${targetName} এর account access bypass kora hoyeche!\n\n` +
        `𝐘𝐨𝐮𝐫'𝐞 𝐇𝐚𝐜𝐤𝐞𝐝 𝐛𝐲 🦋⃟✮⃝𝐕𝐢𝐥𝐥𝐚𝐢𝐧 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ 💋`;

      const mentionData = [{
        tag: `@${targetName}`,
        id: targetID
      }];

      // আগের প্রসেসিং মেসেজ ডিলিট করা
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID);
      }

      return api.sendMessage({
        body: hackText,
        mentions: mentionData,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        // পাঠানোর পর ক্যাশ ফাইল ডিলিট করে দেওয়া
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (error) {
      console.error("Hack Command Error with Jimp:", error);
      
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID);
      }

      const fallbackText = 
        `😈 System Hacked!\n` +
        `@${targetName} এর account access bypass kora hoyeche!\n\n` +
        `𝐘𝐨𝐮𝐫'𝐞 𝐇𝐚𝐜𝐤𝐞𝐝 𝐛𝐲 💥𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯👽💋`;

      const mentionData = [{
        tag: `@${targetName}`,
        id: targetID
      }];

      return api.sendMessage({
        body: fallbackText,
        mentions: mentionData
      }, threadID, messageID);
    }
  }
};
