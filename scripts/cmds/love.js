module.exports = {
  config: {
    name: "love",
    version: "1.0.0",
    author: "Villain Biplob",
    countDown: 3,
    role: 0,
    shortDescription: "Calculate love percentage",
    longDescription: "Check the love chemistry or percentage between you and someone else or between two tagged users.",
    category: "fun",
    aliases: ["couple", "romance"],
    guide: {
        en: "{pn} @tag"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions);

    let person1 = senderID;
    let name1 = "আপনি";
    let person2 = "";
    let name2 = "";

    // ইউজারের নাম বা মেনশন হ্যান্ডেল করা
    try {
      const userInfo = await api.getUserInfo(senderID);
      if (userInfo && userInfo[senderID]) {
        name1 = userInfo[senderID].name || "User";
      }
    } catch (e) {}

    if (mentions.length > 0) {
      person2 = mentions[0];
      name2 = event.mentions[person2].replace("@", "");
    } else {
      // যদি কাউকে মেনশন না করে, তবে গ্রুপ থেকে র্যান্ডম কাউকে টার্গেট করবে
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs.filter(id => id !== senderID);
        if (participantIDs.length > 0) {
          person2 = participantIDs[Math.floor(Math.random() * participantIDs.length)];
          const userInfo2 = await api.getUserInfo(person2);
          if (userInfo2 && userInfo2[person2]) {
            name2 = userInfo2[person2].name || "Someone";
          }
        }
      } catch (e) {
        name2 = "রহস্যময় কেউ";
      }
    }

    // র্যান্ডম লাভ পার্সেন্টেজ জেনারেট করা (0 থেকে 100%)
    const percentage = Math.floor(Math.random() * 101);

    // পার্সেন্টেজ অনুযায়ী ফানি মন্তব্য
    let comment = "";
    if (percentage > 85) {
      comment = "এদের তো আজই বিয়ে দিয়ে দেওয়া উচিত! পারফেক্ট জুটি! 💍❤️";
    } else if (percentage > 60) {
      comment = "বাহ! ভালোই জমবে আপনাদের রোমান্স। 🤭🌹";
    } else if (percentage > 30) {
      comment = "চলমান অবস্থা তো ভালো ঠেকছে না, একটু ঝগড়া কম করবেন! 😅";
    } else {
      comment = "বাপ রে! এদের মধ্যে তো সাপে-নেউলে সম্পর্ক! দূরে থাকাই ভালো। 🏃‍♂️💨";
    }

    const msg = `💖 [ LOVE CALCULATOR ] 💖\n\n💘 জুটি: ${name1} ❤️ ${name2}\n📊 ভালোবাসার মিল: **${percentage}%**\n\n💬 মন্তব্য: ${comment}\n\n(বট বস: 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝)`;

    // মেনশন লিস্ট তৈরি করা
    const mentionList = [];
    if (mentions.length > 0) {
      mentionList.push({ tag: `@${name2}`, id: person2 });
    }

    return api.sendMessage({
      body: msg,
      mentions: mentionList
    }, threadID, messageID);
  }
};
