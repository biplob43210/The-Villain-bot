Const axios = require("axios");

module.exports = {
  config: {
    name: "marriage",
    aliases: ["biye", "marry"],
    version: "1.0.0",
    credits: "Villain Biplob",
    description: "Fun marriage script with video attached",
    usages: "marriage @mention",
    cooldown: 5
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions } = event;
    const mentionedIDs = Object.keys(mentions);
    
    // ১. মেনশন চেক করা
    if (mentionedIDs.length === 0) {
      return api.sendMessage("⚠️ কাউকেও তো বিয়ে করতে হবে! দয়া করে কাউকে মেনশন দিন। যেমন: marriage @Friend", threadID, messageID);
    }

    const partnerID = mentionedIDs[0];
    const partnerName = mentions[partnerID].replace("@", "");
    const botID = api.getCurrentUserID();

    if (partnerID === botID) {
      return api.sendMessage("😳 আরে পাগল! বটকে কেউ বিয়ে করে নাকি? অন্য কাউকে ট্রای করো! 😂", threadID, messageID);
    }

    // ২. সুন্দর শুভ বিবাহ টেক্সট
    const marriageText = 
      `📜 ─── [ শুভ নিকাহনামা ] ─── 💍\n\n` +
      `🎉 অভিনন্দন! @${partnerName} এর সাথে আপনার ঘটা করে শুভ বিবাহ সম্পন্ন হলো!\n\n` +
      `🤵‍♂️ ঘটক : 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯\n` +
      `🤝 সাক্ষী : 𝗬𝘂𝘁𝗮\n` +
      `💰 দেনমোহর : ৫ লক্ষ টাকা ধার্য করা হলো!\n\n` +
      `আপনাদের নতুন সংসারের জন্য শুভকামনা! 🍬✨`;

    const mentionData = [{
      tag: `@${partnerName}`,
      id: partnerID
    }];

    try {
      // ৩. বিয়ের ভিডিওর ডিরেক্ট লিংক (এখানে আপনার পছন্দের বিয়ের শর্ট ভিডিও লিংক বসাতে পারেন)
      const videoUrl = "https://i.imgur.com/3Z3Q83a.mp4"; // স্যাম্পল ভিডিও লিংক
      const videoStream = (await axios.get(videoUrl, { responseType: "stream" })).data;

      return api.sendMessage({
        body: marriageText,
        mentions: mentionData,
        attachment: videoStream
      }, threadID, messageID);

    } catch (error) {
      console.error("Marriage Video Error:", error);
      // ভিডিও লোড না হলে শুধু টেক্সট পাঠাবে
      return api.sendMessage({
        body: marriageText,
        mentions: mentionData
      }, threadID, messageID);
    }
  }
};
