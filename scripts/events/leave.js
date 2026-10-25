module.exports = {
  config: {
    name: "antiLeave",
    version: "1.1.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Automatically re-adds users who leave the group with a custom message",
    category: "events",
    eventType: ["log:unsubscribe"]
  },

  onStart: async function({ api, event }) {
    // যে ইউজার লিভ নিয়েছে তার ID
    const leftParticipantId = event.logMessageData.leftParticipantFbId;
    const threadID = event.threadID;
    const botID = api.getCurrentUserID();

    // যদি বট নিজে লিভ নেয়, তবে কিছু করার দরকার নেই
    if (leftParticipantId === botID) return;

    try {
        // সাথে সাথে আবার গ্রুপে অ্যাড করা
        await api.addUserToGroup(leftParticipantId, threadID);

        // কাঙ্ক্ষিত মেসেজ পাঠানো
        const antiLeaveMessage = `আমি Yuta থাকতে কেউ পালাতে পারবে না 👽\nআমার বস 🦋⃟✮⃝𝐕𝐢𝗹𝗹𝗮𝗶𝗻 𝐁𝐈𝐏𝐋𝐎𝐁🩵⃟✮⃝ আমাকে গ্রুপের দেখাশোনা করার জন্য Build করেছে! 😼🔥`;

        await api.sendMessage(antiLeaveMessage, threadID);
    } catch (error) {
        console.error("Failed to re-add user:", error);
    }
  }
};
