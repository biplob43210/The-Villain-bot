module.exports = {
  config: {
    name: "reactionReply",
    version: "1.1.0",
    author: "Yuta biplob",
    countDown: 5,
    role: 0,
    description: "Reacts and replies based on the user's reaction to bot's message",
    category: "events",
    eventType: ["message_reaction"]
  },

  onStart: async function({ api, event }) {
    const { threadID, userID, reaction, messageID, authorID } = event;
    const botID = api.getCurrentUserID();

    // ১. রিঅ্যাক্টটি কি বটের নিজের মেসেজে দেওয়া হয়েছে? (যদি অন্য কারো মেসেজে হয়, তবে কাজ করবে না)
    if (authorID !== botID) return;

    // ২. যে ইউজার রিঅ্যাক্ট দিয়েছে তার নাম ফেচ করা (মেনশন দেওয়ার জন্য)
    let userInfo;
    try {
        userInfo = await api.getUserInfo(userID);
    } catch (e) {
        userInfo = {};
    }
    let name = userInfo[userID]?.name || "বন্ধু";

    // ৩. কোন ইমোজি দিয়ে রিঅ্যাক্ট করা হয়েছে তার ওপর ভিত্তি করে রেসপন্স তৈরি করা
    let replyMessage = "";

    switch (reaction) {
        case "❤️":
        case "😍":
            replyMessage = `অসংখ্য ধন্যবাদ @${name}! ভালোবাসার জন্য অনেক আদর রইলো! ❤️\nআমার বস 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ আমাকে গ্রুপের দেখাশোনা করার জন্য Build করেছে! 😼🔥`;
            break;
        case "😂":
        case "😆":
            replyMessage = `হেসে উড়িয়ে দিচ্ছেন @${name}? কৌতুকটা কি বেশি funny ছিল নাকি? 😆`;
            break;
        case "👍":
        case "👌":
            replyMessage = `সায় দেওয়ার জন্য ধন্যবাদ, @${name}! 😎`;
            break;
        case "😢":
        case "😭":
            replyMessage = `আরে @${name}, কান্নাকাটি কেন করছেন? মন খারাপ থাকলে বলুন, সলভ করে দিচ্ছি! 🥺`;
            break;
        case "😡":
        case "😠":
            replyMessage = `উফ! এত রেগে যাচ্ছেন কেন @${name}? কুল ডাউন! 🧊\nআমার বস 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ এর রাজ্যে রাগারাগি একদম নিষিদ্ধ! 😼`;
            break;
        case "😮":
        case "😲":
            replyMessage = `অবাক হয়ে গেলেন নাকি @${name}? চোখ কপালে ওঠার মতো কী দেখলেন? 😲`;
            break;
        default:
            replyMessage = `আপনার '${reaction}' রিঅ্যাক্টটি পেয়ে গেলাম, @${name}! 👍`;
            break;
    }

    // ৪. মেনশন ট্যাগ সেট করা
    let mentions = [{
        tag: `@${name}`,
        id: userID
    }];

    // ৫. মেসেজ পাঠানো
    api.sendMessage({
        body: replyMessage,
        mentions: mentions
    }, threadID, messageID);
  }
};
