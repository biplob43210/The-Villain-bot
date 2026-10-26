module.exports = {
  config: {
    name: "badword",
    version: "1.1.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Auto detects bad words, unsends message and warns user without prefix",
    category: "noprefix",
    usages: "Auto detects inappropriate language and unsends",
    cooldown: 3
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;

    const text = body.toLowerCase();

    // ১. আপনার ইচ্ছেমতো বাজে শব্দ বা গালিগুলো এখানে ছোটহাতে (lowercase) বসিয়ে দেবেন
    const badWords = [
      "voda", 
      "khanki", 
      "sauwa", 
      "chudi",
      "madarchod",
      "bessa",
      "vodai"
      // আপনার প্রয়োজনমতো আরও শব্দ এখানে যোগ করতে পারেন
    ];

    // ২. মেসেজের সাথে কোনো বাজে শব্দ মিলে যায় কিনা চেক করা
    const isBadWord = badWords.some(word => text.includes(word));

    if (isBadWord) {
      try {
        // বাজে মেসেজটি সাথে সাথে অটো আনসেন্ড/ডিলিট করে দেবে
        await api.unsendMessage(messageID);

        // ইউজারকে সতর্ক করে ওয়ার্নিং মেসেজ পাঠানো
        const warningMessage = `⚠️ এই গ্রুপে বাজে কথা বা গালি দেওয়া সম্পূর্ণ নিষেধ! আপনার মেসেজটি অটো ডিলিট করা হয়েছে। শালীনতা বজায় রাখুন! 😾👊`;
        
        return api.sendMessage(warningMessage, threadID);
      } catch (error) {
        console.error("Badword Unsend Error:", error);
      }
    }
  }
};
