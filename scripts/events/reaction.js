module.exports = {
  config: {
    name: "reactionReply",
    version: "1.1.3",
    author: "Yuta biplob",
    countDown: 5,
    role: 0,
    description: "Reacts and replies based on the user's reaction to bot's message",
    category: "events",
    eventType: ["message_reaction"]
  },

  onStart: async function({ api, event }) {
    const { threadID, userID, reaction, messageID } = event;
    const botID = api.getCurrentUserID();

    // ১. বট যদি নিজে নিজের মেসেজে রিঅ্যাক্ট করে, তবে ইগনোর করবে
    if (userID === botID) return;

    // ২. ইউজারের নাম ফেচ করা (সেফটি সহ)
    let name = "বন্ধু";
    try {
        let userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID]) {
            name = userInfo[userID].name || userInfo[userID].firstName || "বন্ধু";
        }
    } catch (e) {
        console.error("Error fetching user info:", e);
    }

    // ৩. কোনো ইমোজিতে রিঅ্যাক্ট করা হয়েছে তার ওপর ভিত্তি করে রেসপন্স
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
            // যদি আনত ইমোজি হয়, তাহলে নিচের কোডটি রিমুভ করতে চাইলে কমেন্ট আউট করে দিতে পারেন
            return; // শুধু নির্দিষ্ট ইমোজিগুলোতে কাজ করাতে চাইলে এটি রাখতে পারেন
    }

    // যদি কোনো রেসপন্স মেসেজ না থাকে তবে থামিয়ে দিবে
    if (!replyMessage) return;

    // ৪. মেনশন সেট করা
    let mentions = [{
        tag: `@${name}`,
        id: userID
    }];

    // ৫. মেসেজ পাঠানো
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
