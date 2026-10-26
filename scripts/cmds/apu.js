module.exports = {
  config: {
    name: "apu",
    version: "1.2.0",
    author: "Villain Biplob",
    countDown: 3,
    role: 0,
    shortDescription: "Fun lines for group apus",
    longDescription: "Sends funny and cute lines dedicated to the group's apus.",
    category: "fun",
    aliases: ["queen", "sister"],
    guide: {
        en: "{pn} @tag"
    }
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID } = event;
    const mentions = Object.keys(event.mentions);

    let apuName = "গ্রুপের সব আপুরা";
    let targetID = "";

    if (mentions.length > 0) {
      targetID = mentions[0];
      apuName = event.mentions[targetID].replace("@", "");
    }

    // 🎯 আপডেট করা ফানি লাইনসমূহ:
    const funLines = [
      `👑 @${apuName} হলো এই গ্রুপের আসল রানি! তবে রান্নাঘরে গেলে নাকি ডিম ভাজতেও আগুন লেগে যায়! 🍳🔥`,
      `☕ @${apuName} এর একটাই অহংকার, সে সারাদিন শুধু চ্যাট করবে কিন্তু ইনবক্সের রিপ্লাই দিতে তিন যুগ সময় লাগবে! 🐢`,
      `💅 @${apuName} হলো এই গ্রুপের অহংকার! তবে রাগের মাথায় মেম্বারদের ব্লক দিতে তার ১ সেকেন্ডও সময় লাগে না! 🚀`,
      `🛍️ @${apuName} এর প্রধান কাজ হলো সারাদিন অনলাইনে শপিং এর পিক দেখা, কিন্তু কেনার বেলায় 'পরে নেব' বলে কেটে পড়া! 🛍️😂`,
      `👑 @${apuName} আপু এতই কিউট যে, চ্যাটে একটা 'হুম' লিখলেও গ্রুপের সব ভাইয়ারা লাইক রিয়েক্ট দেওয়া শুরু করে! 🤭❤️`,
      `👻 @${apuName} সবসময় বলে 'আমি আর রাত জাগব না', কিন্তু রাত ২টায় গিয়ে দেখা যায় সে অন্য কারো স্টোরিতে কমেন্ট করছে! 🦉`,
      `🧃 @${apuName} হলো এই গ্রুপের সব ঝামেলা সমাধানের মাস্টার! তবে নিজের পার্স ট্রলি ব্যাগ ছাড়াই খালি থাকে! 💸🤣`,
      `🍦 @${apuName} আপুর সাথে কখনো ঝগড়া করতে যেও না! সে হেরে গেলে সরাসরি আইসক্রিম বা ফুচকা খাওয়ার আবদার বসিয়ে দেবে! 🍧`,
      `🎭 @${apuName} চ্যাটে এত ভালো ভালো কথা বলে যে মনে হয় ফেরেশতা, কিন্তু আড়ালে সে সব ভাইদের ইনবক্সের মোড় ঘুরিয়ে দেয়! 😼`,
      `🌸 @${apuName} মানেই গ্রুপে ন্যাকামি আর চ্যাটিংয়ের সুনামি! তবে আপু ছাড়া গ্রুপ একদম জমে না! ❤️`
    ];

    const randomLine = funLines[Math.floor(Math.random() * funLines.length)];

    return api.sendMessage({
      body: `✨ [ APU SPECIAL ZONE ] ✨\n\n${randomLine}\n\n(বট বস: 🦋⃟✮⃝𝐕𝐢𝗹𝐥𝐚𝐢𝐧 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝)`,
      mentions: mentions.length > 0 ? [{ tag: `@${apuName}`, id: targetID }] : []
    }, threadID, messageID);
  }
};
