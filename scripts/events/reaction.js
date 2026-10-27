module.exports = {
  config: {
    name: "reactionReply",
    version: "1.1.4",
    credits: "Yuta biplob", // author কেটে credits করা হয়েছে
    description: "Reacts and replies based on the user's reaction to bot's message",
    category: "events",
    usages: "React to bot's messages",
    cooldown: 5,
    role: 0
  },

  // ইভেন্ট বা রিঅ্যাকশন ট্র্যাক করার জন্য onEvent ব্যবহার করা হয়েছে
  onEvent: async function({ api, event }) {
    const { threadID, userID, reaction, messageID } = event;
    const botID = api.getCurrentUserID();

    // ১. বট যদি নিজে রিঅ্যাক্ট করে, তবে ইগনোর করবে
    if (userID === botID) return;

    // ২. ইউজারের নাম ফেচ করা
    let name = "বন্ধু";
    try {
      let userInfo = await api.getUserInfo(userID);
      if (userInfo && userInfo[userID]) {
        name = userInfo[userID].name || userInfo[userID].firstName || "বন্ধু";
      }
    } catch (e) {
      console.error("Error fetching user info:", e);
    }

    let replyMessage = "";

    // ৩. ইমোজি এবং ফেসবুক রিয়েকশন নাম (উভয় ক্ষেত্রে চেক)
    switch (reaction) {
      case "❤️":
      case "😍":
      case "LOVE":
        replyMessage = `অসংখ্য ধন্যবাদ @${name}! ভালোবাসার জন্য অনেক আদর রইলো! ❤️\nআমার বস 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝐢𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ আমাকে গ্রুপের দেখাশোনা করার জন্য Build করেছে! 😼🔥`;
        break;
      case "😂":
      case "😆":
      case "HAHA":
        replyMessage = `হেসে উড়িয়ে দিচ্ছেন @${name}? কৌতুকটা কি বেশি funny ছিল নাকি? 😆`;
        break;
      case "👍":
      case "👌":
      case "LIKE":
        replyMessage = `সায় দেওয়ার জন্য ধন্যবাদ, @${name}! 😎`;
        break;
      case "😢":
      case "😭":
      case "SAD":
      case "SORRY":
        replyMessage = `আরে @${name}, কান্নাকাটি কেন করছেন? মন খারাপ থাকলে বলুন, সলভ করে দিচ্ছি! 🥺`;
        break;
      case "😡":
      case "😠":
      case "ANGRY":
        replyMessage = `উফ! এত রেগে যাচ্ছেন কেন @${name}? কুল ডাউন! 🧊\nআমার বস 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ এর রাজ্যে রাগারাগি একদম নিষিদ্ধ! 😼`;
        break;
      case "😮":
      case "😲":
      case "WOW":
        replyMessage = `অবাক হয়ে গেলেন নাকি @${name}? চোখ কপালে ওঠার মতো কী দেখলেন? 😲`;
        break;
      default:
        return;
    }

    if (!replyMessage) return;

    let mentions = [{
      tag: `@${name}`,
      id: userID
    }];

    try {
      await api.sendMessage({
        body: replyMessage,
        mentions: mentions
      }, threadID, messageID);
    } catch (err) {
      console.error("Failed to send reaction reply:", err);
    }
  }
};
