module.exports = {
  config: {
    name: "hello",
    version: "1.0.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Automatic sweet reply for salam and hi/hello without prefix",
    category: "noprefix",
    usages: "Say hi, hello or assalamu alaikum",
    cooldown: 3
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();

    // ১. সালামের উত্তর
    if (text.includes("assalamu alaikum") || text.includes("আসসালামু আলাইকুম") || text.includes("সালাম")) {
      const salamReplies = [
        `ওয়ালাইকুমুস সালাম ওয়া রাহমাতুল্লাহ! 🌹 আপনার দিনটি অনেক সুন্দর ও বরকতময় হোক।`,
        `ওয়ালাইকুমুস সালাম! আশা করি আল্লাহর রহমতে অনেক ভালো আছেন। ✨`,
        `ওয়ালাইকুমুস সালাম রাহমাতুল্লাহ! গ্রুপে আপনাকে স্বাগতম। 💙`
      ];
      return api.sendMessage(salamReplies[Math.floor(Math.random() * salamReplies.length)], threadID, messageID);
    }

    // ২. হাই / হ্যালো বা কে কেমন আছো এর উত্তর
    if (text === "hi" || text === "hello" || text === "হাই" || text === "হ্যালো") {
      const helloReplies = [
        `হ্যালো! 👋 কেমন আছেন সবাই? আজ আড্ডার পরিবেশ কেমন? 🌸`,
        `হাই! আপনার সাথে কথা বলে ভালো লাগলো। বলুন, কীভাবে সাহায্য করতে পারি? ✨`,
        `হ্যালো ডিয়ার! আশা করি আপনার দিনটি দারুণ কাটছে। 💫`
      ];
      return api.sendMessage(helloReplies[Math.floor(Math.random() * helloReplies.length)], threadID, messageID);
    }
  }
};
