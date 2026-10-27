const axios = require("axios");
const fsModule = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "marriage",
    aliases: ["biye", "marry"],
    version: "1.0.5",
    credits: "Villain Biplob",
    description: "Fun marriage script with video attached and auto/manual mention support",
    usages: "marriage [@mention @mention]",
    cooldown: 5,
    category: "fun"
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, mentions, senderID } = event;
    const mentionedIDs = Object.keys(mentions);
    
    let partner1ID, partner1Name, partner2ID, partner2Name;
    let mentionData = [];

    // ১. যদি ২ জন বা তার বেশি মেনশন করা হয়
    if (mentionedIDs.length >= 2) {
      partner1ID = mentionedIDs[0];
      partner1Name = mentions[partner1ID].replace("@", "");
      
      partner2ID = mentionedIDs[1];
      partner2Name = mentions[partner2ID].replace("@", "");

      mentionData = [
        { tag: `@${partner1Name}`, id: partner1ID },
        { tag: `@${partner2Name}`, id: partner2ID }
      ];
    } 
    // ২. যদি ১ জন মেনশন করা হয় (তাকে এবং কমান্ডদাতাকে নিয়ে)
    else if (mentionedIDs.length === 1) {
      partner1ID = senderID;
      try {
        const senderInfo = await api.getUserInfo(senderID);
        partner1Name = senderInfo[senderID] ? senderInfo[senderID].name : "User";
      } catch (e) {
        partner1Name = "User";
      }

      partner2ID = mentionedIDs[0];
      partner2Name = mentions[partner2ID].replace("@", "");

      mentionData = [
        { tag: `@${partner1Name}`, id: partner1ID },
        { tag: `@${partner2Name}`, id: partner2ID }
      ];
    } 
    // ৩. কাউকেও মেনশন না করলে গ্রুপ থেকে রেন্ডম ২ জন সিলেক্ট করা
    else {
      try {
        const threadInfo = await api.getThreadInfo(threadID);
        const participantIDs = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());

        if (participantIDs.length < 2) {
          return api.sendMessage("⚠️ গ্রুপে পর্যাপ্ত সদস্য নেই রেন্ডম বিয়ে দেওয়ার জন্য!", threadID, messageID);
        }

        // র‍্যান্ডমলি দুইজন মেম্বার বাছাই করা
        const shuffled = participantIDs.sort(() => 0.5 - Math.random());
        partner1ID = shuffled[0];
        partner2ID = shuffled[1];

        const usersInfo = await api.getUserInfo([partner1ID, partner2ID]);
        partner1Name = usersInfo[partner1ID] ? usersInfo[partner1ID].name : "Hubby";
        partner2Name = usersInfo[partner2ID] ? usersInfo[partner2ID].name : "Wifey";

        mentionData = [
          { tag: `@${partner1Name}`, id: partner1ID },
          { tag: `@${partner2Name}`, id: partner2ID }
        ];
      } catch (err) {
        console.error("Random Marriage Error:", err);
        return api.sendMessage("⚠️ রেন্ডমলি কাউকে সিলেক্ট করতে সমস্যা হয়েছে। দয়া করে মেনশন করে দিন!", threadID, messageID);
      }
    }

    // নতুন ফরম্যাট অনুযায়ী শুভ বিবাহ টেক্সট
    const marriageText = 
      `📜 ─── [ শুভ নিকাহনামা ] ─── 💍\n\n` +
      `🎉 𝗖𝗼𝗻𝗴𝗿𝗮𝘁𝘀 ! দুই জনের ঘটা করে শুভ বিবাহ সম্পন্ন হলো!\n\n` +
      `𝗛𝘂𝗯𝗯𝘆 : @${partner1Name}\n` +
      `𝗪𝗶𝗳𝗲𝘆 : @${partner2Name}\n\n` +
      `🤵‍♂️ ঘটক : 𝗩𝗶𝗹𝗹𝗮𝗶𝗻 𝗕𝗶𝗽𝗹𝗼𝗯💋💥\n` +
      `🤝 সাক্ষী : 𝗬𝘂𝘁𝗮🤖\n` +
      `💰 দেনমোহর :  ছেলের বাপ দাদার সকল সম্পতি মেয়ের নামে ধার্য করা হলো!\n\n` +
      `আপনাদের নতুন সংসারের জন্য শুভকামনা! 🍬✨`;

    const cacheDir = path.join(__dirname, "cache");
    if (!fsModule.existsSync(cacheDir)) {
      fsModule.mkdirSync(cacheDir, { recursive: true });
    }

    const videoPath = path.join(cacheDir, `marriage_${Date.now()}.mp4`);

    try {
      // আপনার দেওয়া Catbox ভিডিওর ডিরেক্ট লিংক
      const videoUrl = "https://files.catbox.moe/1671jv.mp4"; 
      
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });

      const writer = fsModule.createWriteStream(videoPath);
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      return api.sendMessage({
        body: marriageText,
        mentions: mentionData,
        attachment: fsModule.createReadStream(videoPath)
      }, threadID, () => {
        // পাঠানোর পর ক্যাশ থেকে ভিডিও ফাইল ডিলিট করা
        if (fsModule.existsSync(videoPath)) fsModule.unlinkSync(videoPath);
      }, messageID);

    } catch (error) {
      console.error("Marriage Video Error:", error);
      
      if (fsModule.existsSync(videoPath)) fsModule.unlinkSync(videoPath);

      // কোনো কারণে ভিডিও ডাউনলোড ফেইল করলে শুধু টেক্সট পাঠাবে
      return api.sendMessage({
        body: marriageText,
        mentions: mentionData
      }, threadID, messageID);
    }
  }
};
