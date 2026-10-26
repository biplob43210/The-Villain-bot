const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

// ফন্ট স্টাইল করার সঠিক হেলপার ফাংশন (Unicode Surrogate Pair Safe)
function fontStyle(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars = Array.from("𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵");
  
  return text.split('').map(char => {
    const index = normal.indexOf(char);
    return index !== -1 ? boldChars[index] : char;
  }).join('');
}

module.exports = {
  config: {
    name: "welcome",
    version: "2.2.1",
    author: "Yuta/biplob (Fixed)",
    countDown: 5,
    role: 0,
    description: "Sends custom stylish welcome text and a Jimp banner.",
    category: "events",
    eventType: ["log:subscribe"]
  },

  onStart: async function({ api, event }) {
    const { threadID, logMessageData } = event;
    
    // Safety check for participants
    const addedParticipants = logMessageData?.addedParticipants;
    if (!Array.isArray(addedParticipants) || addedParticipants.length === 0) return;

    let threadInfo;
    try {
      threadInfo = await api.getThreadInfo(threadID);
    } catch (err) {
      threadInfo = { threadName: "our group", participantIDs: [] };
    }

    const groupName = threadInfo.threadName || "our group";
    const totalMembers = threadInfo.participantIDs?.length || 0;

    for (let member of addedParticipants) {
      const userID = member.userFbId;
      const userName = member.fullName;

      // বোট নিজে যুক্ত হলে ওয়েলকাম পাঠাবে না
      if (userID === api.getCurrentUserID()) continue;

      const pathSave = path.join(__dirname, `cache/welcome_${userID}.png`);

      try {
        // ব্যানার ব্যাকগ্রাউন্ড
        let width = 1200;
        let height = 630;
        let baseImage = new Jimp(width, height, '#1a1a2e');

        // প্রোফাইল পিকচার ফেচ ও ক্রপ করা
        let avatarUrl = `https://graph.facebook.com/${userID}/picture?width=500&height=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        try {
          let response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
          let avatar = await Jimp.read(response.data);
          avatar.resize(220, 220);
          avatar.circle();
          baseImage.composite(avatar, 490, 90);
        } catch (e) {
          console.error("Profile picture load fail (using placeholder/skipping):", e.message);
        }

        // ফন্ট লোড ও টেক্সট বসানো
        const fontLarge = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        const fontMedium = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

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

        // ক্যাশ ফাইলে সেভ করা
        await fs.ensureDir(path.join(__dirname, 'cache'));
        await baseImage.writeAsync(pathSave);

        // স্টাইলিশ টেক্সট ফরম্যাট
        const formattedName = fontStyle(userName);
        const formattedGroupName = fontStyle(groupName);
        const formattedCount = fontStyle(`${totalMembers}th`);

        const msgText = `𝗛𝗲𝗹𝗹𝗼 : @${userName}\n𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗢𝘂𝗿 𝗴𝗿𝗼𝘂𝗽!\n𝗬𝗼𝘂'𝗿𝗲 𝘁𝗵𝗲 ${formattedCount} 𝗺𝗲𝗺𝗯𝗲𝗿 𝘁𝗼 𝗼𝘂𝗿 𝗴𝗿𝗼𝘂𝗽 ${formattedGroupName}`;

        // মেসেজ পাঠানো
        await api.sendMessage({
          body: msgText,
          mentions: [{
            tag: `@${userName}`,
            id: userID
          }],
          attachment: fs.createReadStream(pathSave)
        }, threadID, () => {
          if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
        });

      } catch (error) {
        console.error("Error in welcome event processing:", error);
        if (fs.existsSync(pathSave)) fs.unlinkSync(pathSave);
      }
    }
  }
};
