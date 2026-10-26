module.exports = {
  config: {
    name: "queen",
    version: "1.1.0",
    author: "Villain Biplob",
    countDown: 3,
    role: 0,
    shortDescription: "Crown a group apu as Queen",
    longDescription: "Make someone the official queen of the group chat.",
    category: "fun",
    guide: {
        en: "{pn} @tag"
    }
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, senderID } = event;
    const mentions = Object.keys(event.mentions);

    let queenName = "গ্রুপের সব সুন্দরী আপুরা";
    let targetID = senderID;

    if (mentions.length > 0) {
      targetID = mentions[0];
      queenName = event.mentions[targetID].replace("@", "");
    }

    const tag = `@${queenName}`;
    const msg = `👑 𝗤𝘂𝗲𝗲𝗻 𝗢𝗳 𝗧𝗵𝗲 𝗚𝗿𝗼𝘂𝗽 👸\n\n🎉 অফিশিয়ালি ঘোষণা করা হলো যে, আজকের জন্য এই গ্রুপের মহা-রানি হলেন আমাদের সবার প্রিয় ${tag}!\n\n🙇‍♂️ সবাই তাড়াতাড়ি সেলাম ঠুকুন আর হুকুম তামিল করুন! হুকুম অমান্য করলে কিন্তু ব্লক খাবেন! ⚡\n\n(বট বস: 🦋⃟✮⃝𝐕𝐢𝗹𝐥𝐚𝐢𝐧 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝)`;

    return api.sendMessage({
      body: msg,
      mentions: [{ tag: tag, id: targetID }]
    }, threadID, messageID);
  }
};
