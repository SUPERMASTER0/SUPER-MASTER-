const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

console.log("🚀 Bot Started");

// ================= ENV =================
const token = process.env.BOT_TOKEN;
const apiKey = process.env.API_KEY;

if (!token) {
  console.error("❌ BOT_TOKEN missing");
  process.exit(1);
}

if (!apiKey) {
  console.error("❌ API_KEY missing");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// ================= CHANNELS =================
const CHANNELS = [
  "@URVIGAMER",
  "@Supermastertrick",
  "@Raja_Game_bunny"
];

// ================= PANEL =================
const PANEL = {
  url: "https://telekartsmm.com/api/v2",
  service: "1023"
};

// ================= SAFE ORDER =================
async function sendOrder(link, quantity) {
  try {
    const res = await axios.post(PANEL.url, {
      key: apiKey,
      action: "add",
      service: PANEL.service,
      link: link,
      quantity: quantity
    }, {
      timeout: 10000 // prevent hanging
    });

    if (res.data && res.data.order) {
      console.log("✅ Order ID:", res.data.order);
    } else {
      console.log("⚠️ Bad API response:", res.data);
    }

  } catch (err) {
    console.log("❌ API Error:", err.response?.data || err.message);
  }
}

// ================= MEMORY SAFE SET =================
let processed = new Set();

// auto clear every 10 minutes (IMPORTANT)
setInterval(() => {
  processed.clear();
  console.log("🧹 Cache cleared");
}, 10 * 60 * 1000);

// ================= LISTENER =================
bot.on("channel_post", async (msg) => {
  try {
    if (!msg?.chat?.username || !msg?.message_id) return;

    const username = "@" + msg.chat.username;

    if (!CHANNELS.includes(username)) return;

    const uniqueKey = ${username}_${msg.message_id};

    if (processed.has(uniqueKey)) return;
    processed.add(uniqueKey);

    const clean = msg.chat.username;
    const link = https://t.me/${clean}/${msg.message_id};

    console.log("📢 Post:", link);

    // SINGLE SAFE ORDER
    await sendOrder(link, 1000);

  } catch (err) {
    console.log("❌ Listener Error:", err.message);
  }
});

// ================= GLOBAL SAFETY =================
bot.on("polling_error", (err) => {
  console.log("❌ Polling Error:", err.message);
});

process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Unhandled Rejection:", err);
});
