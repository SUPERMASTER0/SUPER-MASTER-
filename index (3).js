const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

console.log("🚀 Bot Started");

// 🔐 ENV
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// 📢 CHANNELS
const CHANNELS = [
  "@Dnexon55Pros",
  "@RDX_Bunnyamia56591",
  "@Supermastertrick",
  "@Raja_Game_bunny",
  "@URVIGAMER"
];

// 🔥 TELEKART PANEL
const PANEL = {
  url: "https://telekartsmm.com/api/v2",
  key: process.env.API_KEY,
  service: "1023" // ⚠️ apna correct service ID daalo
};

// 📦 SEND ORDER
async function sendOrder(link, quantity) {
  try {
    console.log("👉 Sending:", link);

    const res = await axios.post(PANEL.url, {
      key: PANEL.key,
      action: "add",
      service: PANEL.service,
      link: link,
      quantity: quantity
    });

    console.log("👉 API Response:", res.data);

    if (res.data && res.data.order) {
      console.log("✅ Order Success:", res.data.order);
    } else {
      console.log("❌ Order Failed");
    }

  } catch (err) {
    console.log("❌ Error:", err.message);
  }
}

// 🧠 DUPLICATE PROTECTION
let processed = new Set();

// 📩 LISTENER
bot.on("channel_post", async (msg) => {
  try {
    const username = msg.chat.username ? "@" + msg.chat.username : null;

    if (!CHANNELS.includes(username)) return;

    const uniqueKey = ${username}_${msg.message_id};
    if (processed.has(uniqueKey)) return;
    processed.add(uniqueKey);

    const link = https://t.me/${username.replace("@", "")}/${msg.message_id};

    console.log("📢 New Post:", link);

    // ⚡ SINGLE SAFE ORDER (test)
    await sendOrder(link, 100);

  } catch (err) {
    console.log("❌ Error:", err.message);
  }
});
