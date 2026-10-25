const axios = require("axios");

module.exports = {
  config: {
    name: "botMarriageEvent",
    version: "1.1.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Triggers video reply when someone mentions the bot with marriage keyword",
    category: "events",
    eventType: ["message"]
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, body, mentions } = event;

    // মেসেজ না থাকলে স্কিপ করবে
    if (!body) return;

    const botID = api.getCurrentUserID();
    const text = body.toLowerCase();

    // ১. চেক করা মেসেজে বটকে মেনশন করা হয়েছে কি না
    const isBotMentioned = mentions && Object.keys(mentions).includes(botID);

    if (isBotMentioned) {
      
      // ২. মেসেজে marriage/biye/বিয়ে/বিয়া শব্দটি আছে কি না চেক করা
      if (text.includes("marriage") || text.includes("biye") || text.includes("বিয়ে") || text.includes("বিয়া")) {
        
        const botRejectMessage = `আমার বস 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯 💋✨ কে গিয়ে বলুন তার মন অনেক বড় অনেকজন কে যায়গা দিতে পারবে 😼🔥`;

        try {
          // ৩. ভিডিওর ডিরেক্ট লিংক
          const videoUrl = "https://i.imgur.com/3Z3Q83a.mp4"; 
          const videoStream = (await axios.get(videoUrl, { responseType: "stream" })).data;

          return api.sendMessage({
            body: botRejectMessage,
            attachment: videoStream
          }, threadID, messageID);

        } catch (error) {
          console.error("Video Download Error:", error);
          // কোনো কারণে ভিডিও লোড না হলে শুধু টেক্সট চলে যাবে
          return api.sendMessage(botRejectMessage, threadID, messageID);
        }
      }
    }
  }
};
