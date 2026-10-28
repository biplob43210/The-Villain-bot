module.exports = {
  config: {
    name: "antiLeave",
    version: "1.3.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Automatically re-adds users who leave the group with a custom message",
    category: "events",
    eventType: ["log:unsubscribe"]
  },

  onStart: async function({ api, event }) {
    try {
      // ১. নিশ্চিত করা যে এটি আসলেই কারো গ্রুপ ছাড়ার ইভেন্ট কি না
      // (যদি কেউ নিজে লিভ নেয় বা কাউকে কিক করা হয়, তবেই leftParticipantFbId থাকে)
      const leftParticipantId = event.logMessageData.leftParticipantFbId;
      if (!leftParticipantId) return;

      const threadID = event.threadID;
      const botID = api.getCurrentUserID();

      // ২. যদি বট নিজে লিভ নেয়, তবে কিছু করার দরকার নেই
      if (leftParticipantId === botID) return;

      // ৩. ইউজারকে আবার গ্রুপে অ্যাড করা
      await api.addUserToGroup(leftParticipantId, threadID);

      // ৪. কাস্টম মেসেজ পাঠানো
      const antiLeaveMessage = `আমি Yuta থাকতে কেউ পালাতে পারবে না 👽\nআমার বস 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ আমাকে গ্রুপের দেখাশোনা করার জন্য Build করেছে! 😼🔥`;

      await api.sendMessage(antiLeaveMessage, threadID);

    } catch (error) {
      console.error("Anti-Leave Error:", error);
    }
  }
};
