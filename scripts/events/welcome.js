const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
  config: {
    name: "welcome",
    version: "2.0.0",
    author: "Yuta/biplob",
    countDown: 5,
    role: 0,
    description: "Sends a welcome text and a custom canvas banner including profile picture and member count.",
    category: "events",
    eventType: ["log:subscribe"]
  },

  onStart: async function({ api, event }) {
    const { threadID, logMessageData } = event;
    const addedParticipants = logMessageData.addedParticipants;

    // গ্রুপ বা থ্রেডের তথ্য নিয়ে আসা (মোট মেম্বার সংখ্যা বের করার জন্য)
    let threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName || "our group";
    const totalMembers = threadInfo.participantIDs.length;

    for (let member of addedParticipants) {
      const userID = member.userFbId;
      const userName = member.fullName;

      // বট নিজে অ্যাড হলে ওয়েলকাম দেওয়ার দরকার নেই
      if (userID === api.getCurrentUserID()) continue;

      try {
        // ১. প্রথমে টেক্সট মেসেজ পাঠানো (কততম মেম্বার তা সহ)
        const msgText = `Hello @${userName}, welcome to our ${groupName}! 🎉\nYou are our ${totalMembers}th member!`;
        
        await api.sendMessage({
          body: msgText,
          mentions: [{
            tag: `@${userName}`,
            id: userID
          }]
        }, threadID);

        // ২. কাস্টম ব্যানার তৈরি করা (Canvas)
        const canvas = createCanvas(1200, 630);
        const ctx = canvas.getContext('2d');

        // ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট
        const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
        gradient.addColorStop(0, '#0f0c29');
        gradient.addColorStop(0.5, '#302b63');
        gradient.addColorStop(1, '#24243e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1200, 630);

        // বর্ডার ডিজাইন
        ctx.strokeStyle = '#f39c12';
        ctx.lineWidth = 12;
        ctx.strokeRect(25, 25, 1150, 580);

        // ইউজারের প্রোফাইল পিকচার (DP) ফেচ করা
        let avatarUrl = `https://graph.facebook.com/${userID}/picture?height=500&width=500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        try {
          const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
          const avatar = await loadImage(response.data);

          // গোল (Circular) প্রোফাইল পিকচার আঁকার জন্য ক্লিপিং
          ctx.save();
          ctx.beginPath();
          ctx.arc(600, 200, 110, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(avatar, 490, 90, 220, 220);
          ctx.restore();

          // প্রোফাইল পিকচারের চারপাশে সোনালী বর্ডার
          ctx.beginPath();
          ctx.arc(600, 200, 110, 0, Math.PI * 2, true);
          ctx.lineWidth = 8;
          ctx.strokeStyle = '#f39c12';
          ctx.stroke();
        } catch (e) {
          console.error("Could not load profile picture:", e);
        }

        // টেক্সট সেকশন
        ctx.textAlign = 'center';

        // ওয়েলকাম হেডিং
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 45px Arial';
        ctx.fillText('WELCOME TO', 600, 370);

        // গ্রুপের নাম
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 50px Arial';
        ctx.fillText(groupName, 600, 440);

        // ইউজারের নাম
        ctx.fillStyle = '#00ffcc';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(userName, 600, 510);

        // কততম মেম্বার (যেমন: 90th Member)
        ctx.fillStyle = '#ff4757';
        ctx.font = 'bold 35px Arial';
        ctx.fillText(`✨ Member No: ${totalMembers} ✨`, 600, 570);

        // ক্যাশ ফাইলে সেভ করা
        const pathSave = path.join(__dirname, `cache/welcome_${userID}.png`);
        await fs.ensureDir(path.join(__dirname, 'cache'));
        const buffer = canvas.toBuffer('image/png');
        await fs.writeFile(pathSave, buffer);

        // ৩. ব্যানার ছবি পাঠানো
        await api.sendMessage({
          attachment: fs.createReadStream(pathSave)
        }, threadID, () => fs.unlinkSync(pathSave)); // পাঠানোর পর ডিলিট হয়ে যাবে

      } catch (error) {
        console.error("Error in welcome event:", error);
      }
    }
  }
};
