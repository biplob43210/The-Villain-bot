const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "welcome",
    version: "2.1.0",
    author: "Yuta/biplob (Modified for Jimp)",
    countDown: 5,
    role: 0,
    description: "Sends a welcome text and a custom banner using Jimp (Termux friendly).",
    category: "events",
    eventType: ["log:subscribe"]
  },

  onStart: async function({ api, event }) {
    const { threadID, logMessageData } = event;
    const addedParticipants = logMessageData.addedParticipants;

    let threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName || "our group";
    const totalMembers = threadInfo.participantIDs.length;

    for (let member of addedParticipants) {
      const userID = member.userFbId;
      const userName = member.fullName;

      if (userID === api.getCurrentUserID()) continue;

      try {
        const msgText = `Hello @${userName}, welcome to our ${groupName}! 🎉\nYou are our ${totalMembers}th member!`;
        
        await api.sendMessage({
          body: msgText,
          mentions: [{
            tag: `@${userName}`,
            id: userID
          }]
        }, threadID);

        // Jimp দিয়ে ব্যানার তৈরি (টার্মুক ফ্রেন্ডলি)
        let width = 1200;
        let height = 630;
        let baseImage = new Jimp(width, height, '#1a1a2e');

        // প্রোফাইল পিকচার ফেচ করা এবং সার্কেল করে বসানো
        let avatarUrl = `https://graph.facebook.com/${userID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        try {
          let response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
          let avatar = await Jimp.read(response.data);
          avatar.resize(220, 220);
          avatar.circle(); // গোল করার জন্য
          
          // ব্যাকগ্রাউন্ডের মাঝে প্রোফাইল পিকচার বসানো (X: 490, Y: 90)
          baseImage.composite(avatar, 490, 90);
        } catch (e) {
          console.error("Could not load profile picture in Jimp:", e);
        }

        // ফন্ট লোড করা এবং টেক্সট যুক্ত করা
        const fontLarge = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        const fontMedium = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        // টেক্সট প্রিন্ট করা (প্রয়োজনমতো কোঅর্ডিনেট সেট করা হয়েছে)
        baseImage.print(fontMedium, 0, 360, {
          text: "WELCOME TO",
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, width);

        baseImage.print(fontLarge, 0, 420, {
          text: groupName,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, width);

        baseImage.print(fontMedium, 0, 500, {
          text: `User: ${userName} | Member No: ${totalMembers}`,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, width);

        // ফাইলে সেভ করা
        const pathSave = path.join(__dirname, `cache/welcome_${userID}.png`);
        await fs.ensureDir(path.join(__dirname, 'cache'));
        await baseImage.writeAsync(pathSave);

        // ব্যানার ছবি পাঠানো
        await api.sendMessage({
          attachment: fs.createReadStream(pathSave)
        }, threadID, () => fs.unlinkSync(pathSave));

      } catch (error) {
        console.error("Error in welcome event:", error);
      }
    }
  }
};
