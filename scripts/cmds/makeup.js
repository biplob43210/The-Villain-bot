module.exports = {
  config: {
    name: "makeup",
    version: "1.2.0",
    author: "Villain Biplob",
    countDown: 3,
    role: 0,
    shortDescription: "Funny makeup check for apus",
    longDescription: "A funny command checking the makeup level of group apus with hilarious comments.",
    category: "fun",
    aliases: ["sajgor", "mirror"],
    guide: {
        en: "{pn} [@tag / blank]"
    }
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions);

    let apuID = senderID;
    let apuName = "আপনার";

    if (mentions.length > 0) {
      apuID = mentions[0];
      apuName = event.mentions[apuID].replace("@", "");
    } else {
      try {
        const userInfo = await api.getUserInfo(senderID);
        if (userInfo && userInfo[senderID]) {
          apuName = userInfo[senderID].name || "আপনার";
        }
      } catch (e) {}
    }

    const levels = Math.floor(Math.random() * 51) + 50; // 50% থেকে 100%
    const tag = `@${apuName}`;

    // 💬 ফানি কমেন্টস বা মেসেজ লিস্ট (যেখানে নতুন ফানি টেক্সটগুলো যোগ করা হয়েছে)
    const funnyComments = [
      "আয়নাটা আজ সারাদিন ধরে কান্নাকাটি করছে রে ভাই! মেকআপের লেয়ার এত ভারী যে বাতাসও পাস হতে পারছে না! 🤣🤣",
      "আজকে মেকআপের যে অবস্থা, এক ফোঁটা বৃষ্টি পড়লে তো সোজা পস্নাস্টিক সার্জারি ডাক্তারের কাছে দৌড়াতে হবে! 🌧️😂",
      "ফাউন্ডেশনের লেয়ার এমন থিকনেস যে, ওপর দিয়ে হাতুড়ি দিয়ে পিটলেও কোনো দাগ বসবে না! 🧱💅",
      "টিকটক ভিডিও বানানোর জন্য আজকের এই মেকআপ একদম পারফেক্ট! রিং লাইট ফেটে আলো বের হচ্ছে একেবারে! 💡✨",
      "সাজগোজ দেখে মনে হচ্ছে আজ কোনো রাজ দরবারে সরাসরি দাওয়াত খেতে যাওয়ার প্ল্যান আছে! 👑🤭",
      "মেকআপের নিচে আসল চেহারাটা লুਕিয়ে রাখার এই শিল্পকর্ম দেখে আইনস্টাইনও অজ্ঞান হয়ে যাবে! 🕵️‍♀️💀",
      "এত বেশি মেকআপ মাখছো যে বাতাসও তোমার গাল দিয়ে পিছলে পড়ে যাচ্ছে! সাবধান পড়ে যেও না আবার! 🐒",
      "আজকে মনে হয় পার্লারে গিয়ে আপু পুরো একটা ড্রামের ফেস পাউডার মুখের ওপর ঢেলে এসেছে! 🛢️😆"
    ];

    const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];

    const msg = `💄 [ MAKEUP & TIKTOK RADAR ] 💄\n\n🌸 ${tag} এর আজকের সাজসজ্জা লেভেল: **${levels}%**!\n\n💬 মন্তব্য: ${randomComment}\n\n(বট বস: 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝)`;

    return api.sendMessage({
      body: msg,
      mentions: [{ tag: tag, id: apuID }]
    }, threadID, messageID);
  }
};
