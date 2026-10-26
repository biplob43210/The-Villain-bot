module.exports = {
  config: {
    name: "divorce",
    aliases: ["talak", "breakup"],
    version: "1.2.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Fun sad divorce script with double victim mention and boss custom message",
    category: "fun",
    usages: "divorce @mention1 @mention2",
    cooldown: 5
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions } = event;
    const mentionedIDs = Object.keys(mentions);

    // ১. কমপক্ষে দুজন বা একজনের মেনশন চেক করা (এখানে দুজন ভিকটিমের জন্য অন্তত ২ জন লাগবে)
    if (mentionedIDs.length < 2) {
      return api.sendMessage("⚠️ দয়া করে অন্তত **দুজনকেই** মেনশন করুন! যেমন: divorce @User1 @User2", threadID, messageID);
    }

    // প্রথম ভিকটিম
    const victim1ID = mentionedIDs[0];
    const victim1Name = mentions[victim1ID].replace("@", "");

    // দ্বিতীয় ভিকটিম
    const victim2ID = mentionedIDs[1];
    const victim2Name = mentions[victim2ID].replace("@", "");

    // ২. দুজনের নাম দিয়ে ডিভোর্স টেক্সট তৈরি
    const divorceText = 
      `💔 ─── [ অফিশিয়াল তালাকনামা ] ─── ⚖️\n\n` +
      `ব্রেকিং নিউজ! দাম্পত্য কলহের জেরে @${victim1Name} এবং @${victim2Name} এর মধ্যকার সংসার জীবনের বিচ্ছেদ ঘটে গেছে!\n\n` +
      `🤵‍♂️ ঘটক : 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯\n` +
      `🤝 সাক্ষী : 𝗬𝘂𝘁𝗮\n\n` +
      `ডিভোর্সি ভাবিদের কষ্ট দেখে 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ বসের মন খারাপ তাই সে ডিভোর্সি ভাবিদের পাশে দাঁড়াতে চায়! 😼🔥\n\n` +
      `আজ থেকে আপনারা সবাই 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ বসের মনের মানুষ! মন খারাপ করবেন না, জীবন তো একটাই... 🥺🥀`;

    // ফেসবুক চ্যাটে দুজনের নামেই সঠিক মেনশন ট্যাগ সেট করা
    const mentionData = [
      {
        tag: `@${victim1Name}`,
        id: victim1ID
      },
      {
        tag: `@${victim2Name}`,
        id: victim2ID
      }
    ];

    try {
      // ৩. টেক্সট এবং দুজন ভিকটিমের মেনশন পাঠানো
      return api.sendMessage({
        body: divorceText,
        mentions: mentionData
      }, threadID, messageID);

    } catch (error) {
      console.error("Divorce Script Error:", error);
      return api.sendMessage("❌ কমান্ডটি কার্যকর করতে সমস্যা হচ্ছে!", threadID, messageID);
    }
  }
};
