module.exports = {
  config: {
    name: "emojiReply",
    version: "1.0.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Replies with matched text depending on the emoji sent by user",
    category: "events",
    eventType: ["message"]
  },

  onStart: async function({ api, event }) {
    const { threadID, messageID, body } = event;

    if (!body) return;
    const text = body.trim();

    // ১. লাভ ও রোমান্টিক ইমোজি (❤️, 💖, 🌹, 💌 ইত্যাদি)
    const loveEmojis = ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💖", "💗", "💓", "💞", "💕", "💘", "💌", "💋", "🌹", "🌷", "🌸", "🥰", "😍", "😘"];
    
    // ২. স্যাড ও ইমোশনাল ইমোজি (🥺, 😢, 😭, 💔, 🥀 ইত্যাদি)
    const sadEmojis = ["🥺", "😢", "😭", "💔", "🥀", "🌧️", "💧", "😔", "😞", "😩", "😫"];
    
    // ৩. ফানি ও হাসির ইমোজি (😂, 🤣, 😜, 🤪, 🐒 ইত্যাদি)
    const funEmojis = ["😂", "🤣", "😆", "😜", "🤪", "😝", "😋", "😎", "🤩", "🥳", "🐒", "🍟", "🍕", "🍔"];
    
    // ৪. ফ্যান্টাসি ও জাদুকরী ইমোজি (✨, 🪄, 🔮, 🌌 ইত্যাদি)
    const fantasyEmojis = ["✨", "🌟", "⭐", "💫", "🪄", "🔮", "🌌", "🧚‍♂️", "🦄", "🦋"];
    
    // ৫. ফায়ার ও অ্যাটিটিউড ইমোজি (🔥, ⚡, 👑, 💯 ইত্যাদি)
    const fireEmojis = ["🔥", "⚡", "💥", "💯", "👑", "🚀", "💪", "😈", "💀"];

    let replyMessage = "";

    // চেক করা ইউজার কোন ক্যাটাগরির ইমোজি দিয়েছে
    if (loveEmojis.some(e => text.includes(e))) {
      const loveReplies = [
        `আহা! মনে হচ্ছে কেউ দারুণ রোমান্টিক মুডে আছে! সারাদিন শুধু ভালোবাসার জোয়ার বইছে দেখছি! ❤️✨`,
        `তোমার এই লাভ রিঅ্যাক্ট বা ইমোজি দেখে আমার বস Villain Biplob এর কথাই মনে পড়ে গেল! 💖🌹`,
        `ভালোবাসার রঙে চারপাশ রাঙিয়ে দিতে কে না চায় বলো? একদম মনকাড়া ইমোজি! 🥰💌`
      ];
      replyMessage = loveReplies[Math.floor(Math.random() * loveReplies.length)];
    } 
    else if (sadEmojis.some(e => text.includes(e))) {
      const sadReplies = [
        `মন খারাপ নাকি বন্ধু? এত স্যাড ইমোজি দিচ্ছো কেন? আমাদের সাক্ষী Yuta কে গিয়ে বলো একটু চাঙ্গা করে দিতে! 🥺💔`,
        `জীবনে একটু-আধটু দুঃখ তো আসতেই পারে, তাই বলে এভাবে স্যাড হয়ে থেকো না তো! 🥀🌧️`,
        `আরে কেঁদো না! সব ঠিক হয়ে যাবে, আমাদের ঘটক Villain Biplob কে ধরো, সমাধান করে দেবে! 😢🫂`
      ];
      replyMessage = sadReplies[Math.floor(Math.random() * sadReplies.length)];
    } 
    else if (funEmojis.some(e => text.includes(e))) {
      const funReplies = [
        `হা হা হা! তোমার হাসির ইমোজি দেখে তো আমারও ফান করার মুড হয়ে গেল! পকেটে চিপস আছে নাকি একটা ভাগ দিবা? 🍟😂`,
        `জীবনটা পুরাই একটা সার্কাস, আর তুমি রোজ এভাবে হাসির ইমোজি দিয়ে মাতিয়ে রাখো! দারুণ ব্যাপার! 🤪🐒`,
        `ফানি মুড অন! এভাবে হাসতে থাকো, টেনশন একদম ফ্রি! 🥳🔥`
      ];
      replyMessage = funReplies[Math.floor(Math.random() * funReplies.length)];
    } 
    else if (fantasyEmojis.some(e => text.includes(e))) {
      const fantasyReplies = [
        `ওয়াও! জাদুকরী ইমোজি! মনে হচ্ছে এখনই কোনো রূপকথার রাজ্যে উড়ে চলে যাবো! ✨🪄`,
        `তোমার এই ফ্যান্টাসি লুক দেখে আইনস্টাইনও আকাশ থেকে পড়তেন নির্ঘাত! 🔮🌌`,
        `জাদুর কাঠির ছোঁয়ায় তোমার দিনটা যেন রূপকথার মতো সুন্দর হয়ে ওঠে! 🧚‍♂️🌟`
      ];
      replyMessage = fantasyReplies[Math.floor(Math.random() * fantasyReplies.length)];
    } 
    else if (fireEmojis.some(e => text.includes(e))) {
      const fireReplies = [
        `বাপরে বাপ! পুরো চ্যাট বক্সে আগুন জ্বেলে দিলে দেখছি! একদম ফায়ার লুক! 🔥💯`,
        `আমাদের বস Villain Biplob এর স্টাইল ফলো করছো নাকি? বস লেভেলের অ্যাটিটিউড! 👑⚡`,
        `মাঠে নামলে যখন কাঁপিয়েই দিচ্ছো, তখন এই ফায়ার এভাবেই জ্বেলে রাখো! 🚀💥`
      ];
      replyMessage = fireReplies[Math.floor(Math.random() * fireReplies.length)];
    }

    // যদি মিলে যায়, তবে বট সুন্দর করে রিপ্লাই দিয়ে দেবে
    if (replyMessage) {
      return api.sendMessage(replyMessage, threadID, messageID);
    }
  }
};
