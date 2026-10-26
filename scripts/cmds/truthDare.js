module.exports = {
  config: {
    name: "td",
    version: "2.2.0",
    author: "Villain Biplob",
    countDown: 3,
    role: 0,
    shortDescription: "Play Fun & Love Truth or Dare",
    longDescription: "Fun and romantic Truth or Dare game with funny and love questions/dares.",
    category: "fun",
    aliases: ["truthdare", "play t/d", "t/d", "truth"],
    guide: {
        en: "{pn}"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const choice = args[0] ? args[0].toLowerCase() : "";

    // 🟢 TRUTH (সত্য কথা - ফানি এবং লাভ মিক্সড)
    const truths = [
        "আপনার প্রথম ক্রাশ কে ছিল এবং তার নাম কি এখনো মনে আছে? 🤭",
        "এই গ্রুপের কার ইনবক্সে আপনি সবচেয়ে বেশি চ্যাট করেন? নাম বলুন! 👀",
        "ভালোবাসার মানুষের জন্য পাগল হয়ে কখনো কোনো বোকামি করেছেন কি না?",
        "আপনার জীবনের সবচেয়ে ফানি এবং লজ্জাজনক মুহূর্ত কোনটা ছিল?",
        "কাকে এই গ্রুপে সবচেয়ে বেশি হ্যান্ডসাম বা কিউট মনে হয়?",
        "প্রেম করার জন্য কি সিঙ্গেল আছেন, নাকি মনে গোপনে কেউ আছে? ❤️",
        "শেষ কবে কার সাথে প্রোপোজ বা ফ্লার্ট করেছিলেন?",
        "ঘুমের মধ্যে কথা বলার বা অদ্ভুত কোনো অভ্যাস আছে কি আপনার?",
        "যদি এই গ্রুপের যেকোনো একজনের সাথে এক দিনের জন্য ডেটে যাওয়ার সুযোগ পান, কার সাথে যাবেন?",
        "আপনার সবচেয়ে অদ্ভুত বা হাস্যকর সিক্রেট কি যা কেউ জানে না?"
    ];

    // 🔥 DARE (চ্যালেঞ্জ - ফানি এবং লাভ মিক্সড)
    const dares = [
        "গ্রুপের পছন্দের কাউকে মেনশন করে একটি লাভলি রোমান্টিক শায়রি বা কবিতা লিখে দিন! 🌹",
        "পরের ৫টি মেসেজ ফানি কোনো প্রাণীর ডাক বা ইমোজি দিয়ে দিতে হবে! 🐵",
        "গ্রুপের যেকোনো একজনের ইনবক্সে গিয়ে 'আমি তোমাকে পছন্দ করি' লিখে স্ক্রিনশট দিন! 📸",
        "নিজের নাম পরিবর্তন করে ১ ঘণ্টা 'Villain Biplob এর ফ্যান' লিখে রাখুন! 😼",
        "গ্রুপের ৩ জন মেম্বারের নামের সাথে মিলিয়ে ফানি কাপল নেম বা জুটি তৈরি করে দিন।",
        "ভয়েস নোটে একটা ফানি জোক বা হাসির গান শুনিয়ে দিন! 🎤",
        "গ্রুপের কাউকে একটা ভার্চুয়াল কিস বা লাভ রিয়েক্ট উপহার দিন।",
        "পরবর্তী ১০ মিনিট গ্রুপে কেউ মেসেজ দিলেই তাকে 'বস Biplob জিন্দাবাদ' বলতে হবে!",
        "আপনার ফোনের গ্যালারি থেকে সবচেয়ে আজব বা ফানি একটা ছবি গ্রুপে সেন্ড করুন।",
        "কাউকে উদ্দেশ্য করে একটা মিষ্টি রোমান্টিক ডায়লগ লিখে পাঠান!"
    ];

    // র্যান্ডমলি ট্রুথ বা ডিয়ার সিলেক্ট করা
    let gameType = choice;
    if (!["truth", "dare", "td"].includes(choice)) {
        gameType = Math.random() < 0.5 ? "truth" : "dare";
    } else if (choice === "td") {
        gameType = Math.random() < 0.5 ? "truth" : "dare";
    }

    let selectedText = "";
    let title = "";

    if (gameType === "truth") {
        const randomIndex = Math.floor(Math.random() * truths.length);
        selectedText = truths[randomIndex];
        title = "🟢 [ TRUTH / সত্যি কথা (Funny & Love) ]";
    } else {
        const randomIndex = Math.floor(Math.random() * dares.length);
        selectedText = dares[randomIndex];
        title = "🔥 [ DARE / চ্যালেঞ্জ (Funny & Love) ]";
    }

    const replyMsg = `👤 User: @${senderID}\n${title}\n\n💬 প্রশ্ন/টাস্ক: ${selectedText}\n\n⚠️ চটজলদি উত্তর দিন বা কাজটা করে ফেলুন! 😼\n\n(বট বস: 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝)`;

    // ইউজারকে মেনশন করে মেসেজ পাঠানো
    return api.sendMessage({
        body: replyMsg,
        mentions: [{
            tag: `@${senderID}`,
            id: senderID
        }]
    }, threadID, messageID);
  }
};
