const axios = require("axios");
const Jimp = require("jimp");

module.exports = {
  config: {
    name: "hack",
    version: "2.0.0",
    credits: "Villain Biplob",
    description: "Fun hacking command with dynamic Jimp generated cyber banner",
    usages: "hack @mention",
    cooldown: 5
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

    // অপেক্ষমাণ মেসেজ পাঠানো (ছবি তৈরি হতে একটু সময় নিতে পারে)
    const processingMsg = await api.sendMessage(`🔄 [ SYSTEM NOTICE ] Target @${targetName} scanning started... Please wait.`, threadID);

    try {
      // ২. সাইবার হ্যাকিং ব্যাকগ্রাউন্ড ইমেজ লোড করা (Jimp দিয়ে)
      const bgUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80";
      const image = await Jimp.read(bgUrl);

      // ৩. ফন্ট লোড করা (Jimp এর বিল্ট-ইন হোয়াইট ফন্ট)
      const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
      const smallFont = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);

      // ৪. ছবির ওপর টেক্সট প্রিন্ট করা (Cyber Hack Banner Style)
      image.print(font, 50, 50, ">> SYSTEM BREACH DETECTED!");
      image.print(font, 50, 100, `Target: ${targetName}`);
      image.print(smallFont, 50, 145, `UID: ${targetID}`);
      image.print(smallFont, 50, 175, `Status: Access Bypassed Successfully!`);
      image.print(font, 50, 240, "HACKED BY VILLAIN BIPLOB");

      // ৫. ফাইল টেম্পোরারি সেভ করা
      const filePath = __dirname + `/cache/hack_${targetID}.jpg`;
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

      // আগের প্রসেসিং মেসেজ ডিলিট করে ফাইনাল ছবি পাঠানো
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID);
      }

      const fs = require("fs");
      return api.sendMessage({
        body: hackText,
        mentions: mentionData,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => {
        // পাঠানোর পর ক্যাশ ফাইল ডিলিট করে দেওয়া যাতে স্টোরেজ ফুল না হয়
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }, messageID);

    } catch (error) {
      console.error("Hack Command Error with Jimp:", error);
      
      if (processingMsg && processingMsg.messageID) {
        api.unsendMessage(processingMsg.messageID);
      }

      // কোনো কারণে Jimp ফেইল করলে শুধু টেক্সট ও ডিফল্ট ছবি চলে যাবে
      const fallbackText = 
        `😈 System Hacked!\n` +
        `@${targetName} এর account access bypass kora hoyeche!\n\n` +
        `𝐘𝐨𝐮𝐫'𝐞 𝐇𝐚𝐜𝐤𝙚𝐝 𝐛𝐲 🦋⃟✮⃝𝐕𝐢𝐥𝐥𝐚𝐢𝐧 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ 💋`;

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
