const axios = require("axios");
const fsModule = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "marriage",
    aliases: ["biye", "marry"],
    version: "1.0.3",
    credits: "Villain Biplob",
    description: "Fun marriage script with video attached",
    usages: "marriage @mention",
    cooldown: 5,
    category: "fun"
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions } = event;
    const mentionedIDs = Object.keys(mentions);
    
    // ১. মেনশন চেক করা
    if (mentionedIDs.length === 0) {
      return api.sendMessage("⚠️ কাউকেও তো বিয়ে করতে হবে! দয়া করে কাউকে মেনশন দিন। যেমন: marriage @Friend", threadID, messageID);
    }

    const partnerID = mentionedIDs[0];
    const partnerName = mentions[partnerID].replace("@", "",);
    const botID = api.getCurrentUserID();

    if (partnerID === botID) {
      return api.sendMessage("😳 আরে পাগল! বটকে কেউ বিয়ে করে নাকি? অন্য কাউকে ট্রাই করো! 😂", threadID, messageID);
    }

    // ২. সুন্দর শুভ বিবাহ টেক্সট
    const marriageText = 
      `📜 ─── [ শুভ নিকাহনামা ] ─── 💍\n\n` +
      `🎉 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘀 ! @${partnerName} এর সাথে আপনার ঘটা করে শুভ বিবাহ সম্পন্ন হলো!\n\n` +
      `🤵‍♂️ ঘটক : 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯💋💥\n` +
      `🤝 সাক্ষী : 𝗬𝘂𝘁𝗮🤖\n` +
      `💰 দেনমোহর : মেয়ের সকল সম্পতি ছেলের নামে ধার্য করা হলো!\n\n` +
      `আপনাদের নতুন সংসারের জন্য শুভকামনা! 🍬✨`;

    const mentionData = [{
      tag: `@${partnerName}`,
      id: partnerID
    }];

    const cacheDir = path.join(__dirname, "cache");
    if (!fsModule.existsSync(cacheDir)) {
      fsModule.mkdirSync(cacheDir, { recursive: true });
    }

    const videoPath = path.join(cacheDir, `marriage_${Date.now()}.mp4`);

    try {
      // ৩. আপনার দেওয়া Catbox ভিডিওর ডিরেক্ট লিংক
      const videoUrl = "https://files.catbox.moe/1671jv.mp4"; 
      
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fsModule.createWriteStream(videoPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      return api.sendMessage({
        body: marriageText,
        mentions: mentionData,
        attachment: fsModule.createReadStream(videoPath)
      }, threadID, () => {
        // পাঠানোর পর ক্যাশ থেকে ভিডিও ফাইল ডিলিট করা
        if (fsModule.existsSync(videoPath)) fsModule.unlinkSync(videoPath);
      }, messageID);

    } catch (error) {
      console.error("Marriage Video Error:", error);
      
      if (fsModule.existsSync(videoPath)) fsModule.unlinkSync(videoPath);

      // কোনো কারণে ভিডিও ডাউনলোড ফেইল করলে শুধু টেক্সট পাঠাবে
      return api.sendMessage({
        body: marriageText,
        mentions: mentionData
      }, threadID, messageID);
    }
  }
};
