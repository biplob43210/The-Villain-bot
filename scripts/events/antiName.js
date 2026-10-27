module.exports = {
  config: {
    name: "antiName",
    version: "1.0.0",
    author: "Villain Biplob",
    countDown: 5,
    role: 0,
    description: "Detects when group name is changed",
    category: "events",
    eventType: ["log:thread-name"]
  },

  onStart: async function({ api, event }) {
    const threadID = event.threadID;
    const newName = event.logMessageData.name;

    try {
      await api.sendMessage(`📌 গ্রুপের নতুন নাম দেওয়া হয়েছে: "${newName}"`, threadID);
    } catch (error) {
      console.error("Error in thread name event:", error);
    }
  }
};
