module.exports = {
  config: {
    name: "botMentionEvent",
    version: "2.0.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Replies with pure romantic captions when someone mentions the bot or uses keywords",
    category: "events",
    eventType: ["message"]
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, body, mentions } = event;

    if (!body) return;
    const text = body.toLowerCase();
    const botID = api.getCurrentUserID();

    // ১. বটকে সরাসরি মেনশন করা হয়েছে কি না বা বটের নাম / বসের নাম বা কিওয়ার্ড আছে কি না চেক করা
    const isBotMentioned = mentions && mentions[botID];
    const hasKeywords = text.includes("yuta") || text.includes("biplob") || text.includes("bot") || text.includes("বট");

    if (!isBotMentioned && !hasKeywords) return;

    // ২. খাঁটি ও মিষ্টি রোমান্টিক ক্যাপশনের সেরা কালেকশন
    const romanticReplies = [
      `𝐇𝐞𝐚 𝐉𝐚𝐧 𝐁𝐨𝐥𝐨 💋🖤\nআপনারে কিভাবে সাহায্য করতে পারি?`,
      `ডাকলে আমায় এত মিষ্টি করে? আপনার একটা ডাকেই তো আমার পুরো মনটা ভালো হয়ে যায়! 🥰🌹`,
      `হাজার মানুষের ভিড়েও যেন শুধু আপনার গলার সুরটাই আমার কানে বাজে... বলুন জান, কি বলতে চান? 💖✨`,
      `ভালোবাসার রঙিন অনুভূতির মতো আপনার এই মেসেজটা মন ছুঁয়ে গেল! বলুন কিভাবে আপনার মুখে হাসি ফোটাতে পারি? 🌸💍`,
      `আমাদের বস Villain Biplob আর সাক্ষী Yuta এর তরফ থেকে আপনার জন্য রইলো একরাশ লাল গোলাপের ভালোবাসা! 🌹🖤`,
      `একটুখানি মিষ্টি কথা আর ভালোবাসায় ভরিয়ে দিতে Yuta সবসময় আপনার পাশে আছে! 🥰💌`,
      `আপনার একটা মেসেজের অপেক্ষায় যেন চোখ দুটো আটকে থাকে... মন খুলে বলুন কি শুনতে চান আজ? ✨💖`
    ];

    // ৩. রেন্ডমলি যেকোনো একটি রোমান্টিক ক্যাপশন সিলেক্ট করা
    const randomReply = romanticReplies[Math.floor(Math.random() * romanticReplies.length)];

    // ৪. মেসেজ পাঠানো
    return api.sendMessage({
      body: randomReply
    }, threadID, messageID);
  }
};
