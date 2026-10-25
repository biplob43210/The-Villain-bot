Const axios = require("axios");

module.exports = {
  config: {
    name: "hack",
    version: "1.0.2",
    credits: "Villain Biplob",
    description: "Fun hacking command with mention and danger banner photo",
    usages: "hack @mention",
    cooldown: 5
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, mentions } = event;

    // ১. কাউকেও মেনশন দেওয়া হয়েছে কিনা চেক করা
    const mentionedIDs = Object.keys(mentions);
    if (mentionedIDs.length === 0) {
      return api.sendMessage("⚠️ ভাই, কাউকে হ্যাক করতে চাইলে তার নাম মেনশন করতে হবে! যেমন: hack @Username", threadID, messageID);
    }

    const targetID = mentionedIDs[0];
    const targetName = mentions[targetID].replace("@", "");

    // ২. আপনার দেওয়া ফরম্যাট অনুযায়ী টেক্সট
    const hackText = 
      `😈 System Hacked!\n` +
      `@${targetName} এর account access bypass kora hoyeche!\n\n` +
      `𝐘𝐨𝐮𝐫'𝐞 𝐇𝐚𝐜𝐤𝙚𝐝 𝐛𝐲 🦋⃟✮⃝𝐕𝐢𝐥𝐥𝐚𝐢𝐧 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ 💋`;

    // ৩. মেনশন অবজেক্ট তৈরি করা
    const mentionData = [{
      tag: `@${targetName}`,
      id: targetID
    }];

    try {
      // ৪. ডেঞ্জারাস ও হ্যাকিং থিমযুক্ত ডিরেক্ট ব্যানার ইমেজ লিংক
      const imageUrl = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80"; 
      const imageStream = (await axios.get(imageUrl, { responseType: "stream" })).data;

      // ৫. ছবি ও টেক্সট একসাথে পাঠানো
      return api.sendMessage({
        body: hackText,
        mentions: mentionData,
        attachment: imageStream
      }, threadID, messageID);

    } catch (error) {
      console.error("Hack Command Error:", error);
      // কোনো কারণে ছবি না গেলে শুধু টেক্সট চলে যাবে
      return api.sendMessage({
        body: hackText,
        mentions: mentionData
      }, threadID, messageID);
    }
  }
};
