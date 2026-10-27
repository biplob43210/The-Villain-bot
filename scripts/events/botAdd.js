module.exports = {
  config: {
    name: "botAdd",
    version: "1.0.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Sends a thank you message and a video when the bot is added to a group",
    category: "events",
    eventType: ["log:subscribe"]
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;
    const botID = api.getCurrentUserID();

    // চেক করা হচ্ছে যে মেম্বার হিসেবে অ্যাড হওয়া আইডিটি বটের নিজের কি না
    const addedParticipants = event.logMessageData.addedParticipants || [];
    const isBotAdded = addedParticipants.some(participant => participant.userFbId === botID);

    // যদি বট নিজে গ্রুপে অ্যাড হয়ে থাকে
    if (isBotAdded) {
      try {
        // ১. ধন্যবাদ মেসেজ
        const welcomeMessage = "𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝗮𝗱𝗱𝗶𝗻𝗴 𝗺𝗲 𝘁𝗼 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽.";

        // ২. আপনার দেওয়া ভিডিওর ডাইরেক্ট লিংক
        const videoUrl = "https://files.catbox.moe/9qw7yl.mp4";

        // ৩. মেসেজ এবং ভিডিও একসাথে পাঠানো
        await api.sendMessage({
          body: welcomeMessage,
          attachment: await global.utils.getStreamFromURL(videoUrl)
        }, threadID);

      } catch (error) {
        console.error("Failed to send welcome message and video on bot add:", error);
      }
    }
  }
};
