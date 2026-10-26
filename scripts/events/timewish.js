module.exports = {
  config: {
    name: "timewish",
    version: "1.3.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Pure romantic morning, noon, evening and night wishes using onStart event",
    category: "noprefix",
    usages: "Chat normally",
    cooldown: 5
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();

    // ১. সকালের রোমান্টিক উইশ
    if (text.includes("sokal") || text.includes("morning") || text.includes("শুভ সকাল") || text.includes("সুপ্রভাত")) {
      const morningList = [
        `ভোরের প্রথম সোনালী রোদ আর মৃদু বাতাসে ভেসে আসুক প্রিয় মানুষের মিষ্টি স্মৃতির ছোঁয়া। আপনার আজকের দিনটি ভালোবাসায় পরিপূর্ণ হোক! 🌅🌸`,
        `ঘুম ভাঙার পর প্রথম যার কথা মনে পড়ে, তাকে ছাড়া সকাল যেন অসম্পূর্ণ। শুভ সকাল, আপনার দিনটি অনেক সুন্দর কাটুক! ☕✨`,
        `পাখির মিষ্টি ডাক আর রোদের হাসিতে শুরু হোক আপনার আজকের দিনটি। হৃদয়ের প্রতিটি কোণ জুড়ে থাকুক সুখের আমেজ। 🌺`
      ];
      return api.sendMessage(morningList[Math.floor(Math.random() * morningList.length)], threadID, messageID);
    }

    // ২. দুপুরের রোমান্টিক উইশ
    if (text.includes("dupur") || text.includes("noon") || text.includes("lunch") || text.includes("দুপুর")) {
      const noonList = [
        `দুপুরের এই অলস দুপুরে একটু জিরিয়ে নিন। কাজের ব্যস্ততার মাঝেও প্রিয় মানুষটির সুন্দর মিষ্টি একটা কথা সারাদিনের ক্লান্তি দূর করে দিতে পারে। 🍛💫`,
        `শুভ দুপুর! রোদ যতই প্রখর হোক না কেন, মনের ভেতর এক পশলা বৃষ্টির স্নিগ্ধতা থাকুক সারাক্ষণ। ☀️🌿`,
        `ক্লান্ত দুপুরের এই শান্ত সময়ে আপনার মনের আকাশটা সবসময় নীল আর ভালোবাসায় ঘেরা থাকুক। 💙`
      ];
      return api.sendMessage(noonList[Math.floor(Math.random() * noonList.length)], threadID, messageID);
    }

    // ৩. সন্ধ্যার রোমান্টিক উইশ
    if (text.includes("shondha") || text.includes("evening") || text.includes("সন্ধ্যা") || text.includes("বিকেল")) {
      const eveningList = [
        `গোধূলির এই আলো-আঁধারি সময়ে চায়ের কাপে চুমুক দিতে দিতে প্রিয় মানুষটার স্মৃতিতে হারিয়ে যাওয়ার মজাই আলাদা। শুভ সন্ধ্যা! 🌇☕`,
        `দিনের আলো ফুরিয়ে আসছে, আকাশে তারাদের মেলা বসার সময় হলো। আপনার সন্ধ্যার সময়টা ভীষণ রোমান্টিক ও শান্তিমay হোক। ✨`,
        `সন্ধ্যা নামলেই মন কেমন যেন উদাস হয়ে যায়... প্রিয় মানুষটির সান্নিধ্য পাওয়ার আকুলতা আরও বেড়ে যায়। 🌆🌹`
      ];
      return api.sendMessage(eveningList[Math.floor(Math.random() * eveningList.length)], threadID, messageID);
    }

    // ৪. রাতের রোমান্টিক উইশ
    if (text.includes("rat") || text.includes("night") || text.includes("gn") || text.includes("রাত") || text.includes("শুভ রাত্রি")) {
      const nightList = [
        `চাঁদের স্নিগ্ধ আলোয় ধুয়ে যাক আজকের সব ক্লান্তি ও কষ্ট। রাতের চাদরে মুড়িয়ে আসুক সুন্দর কিছু স্বপ্ন। শুভ রাত্রি, ভালো থাকবেন! 🌙💤`,
        `রাতের গভীর আকাশ সাক্ষী থাকুক আপনার প্রতিটি সুন্দর অনুভূতির। খুব ভালো একটি ঘুম আসুক আপনার চোখে, শুভ রাত্রি প্রিয়! ✨🌌`,
        `চোখ বন্ধ করলেই মনের ক্যানভাসে যে মানুষটির মুখ ভেসে ওঠে, তাকে অনেক শুভকামনা জানিয়ে শান্ত একটি রাতের প্রহর শুরু হোক। 💙🌹`
      ];
      return api.sendMessage(nightList[Math.floor(Math.random() * nightList.length)], threadID, messageID);
    }
  }
};
